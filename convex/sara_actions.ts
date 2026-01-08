"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";
// @ts-ignore
// import pdf from "pdf-parse/lib/pdf-parse.js";

// Lazy load OpenAI to avoid deployment errors when env var is missing during analysis
const getOpenAI = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY environment variable");
    }
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
};

// Helper to chunk text
function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.slice(i, i + chunkSize));
        i += chunkSize - overlap;
    }
    return chunks;
}

export const ingestDocument = action({
    args: {
        storageId: v.id("_storage"),
        title: v.string(),
    },
    handler: async (ctx, args): Promise<{ success: boolean; documentId: any }> => {
        // 1. Get file from storage
        const fileUrl = await ctx.storage.getUrl(args.storageId);
        if (!fileUrl) throw new Error("File not found");

        // Fetch file content
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Parse PDF
        let text = "";
        try {
            // Dynamic import to avoid bundling issues with "url" dependency
            // @ts-ignore
            const pdfModule = await import("pdf-parse/lib/pdf-parse.js");
            const pdf = pdfModule.default || pdfModule;

            const data: any = await pdf(buffer);
            text = data.text;
        } catch (e) {
            console.error("PDF Parse Error:", e);
            throw new Error("Failed to parse PDF");
        }

        // 3. Create Document Record
        const documentId = await ctx.runMutation(internal.sara.createDocument, {
            title: args.title,
            storageId: args.storageId,
            text: text,
            type: "pdf",
        });

        // 4. Chunk Text
        const chunks = chunkText(text);

        // 5. Generate Embeddings (in batches to avoid rate limits)
        const openai = getOpenAI();
        const batchSize = 20;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            const embeddingResponse = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: batch,
            });

            const chunkData = batch.map((chunkText: string, idx: number) => ({
                text: chunkText,
                embedding: embeddingResponse.data[idx].embedding,
                index: i + idx,
            }));

            // 6. Store Embeddings
            await ctx.runMutation(internal.sara.addEmbeddings, {
                documentId,
                chunks: chunkData,
            });
        }

        return { success: true, documentId };
    },
});

export const ask = action({
    args: {
        message: v.string(),
        history: v.optional(v.array(v.object({ role: v.string(), content: v.string() }))),
    },
    handler: async (ctx, args): Promise<string | null> => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("You must be logged in to use SARA.");
        }

        // 0. Save User Message immediately
        await ctx.runMutation(internal.sara_chat.saveMessage, {
            userId: identity.subject,
            role: "user",
            content: args.message
        });

        const openai = getOpenAI();

        // 1. Embed user query
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: args.message,
        });
        const embedding = embeddingResponse.data[0].embedding;

        // 2. Search knowledge base (Vector Search)
        const results = await ctx.vectorSearch("embeddings", "by_embedding", {
            vector: embedding,
            limit: 5,
        });

        // 3. Fetch text & Configuration
        const chunks: any[] = await ctx.runQuery(internal.sara.getChunks, {
            ids: results.map(r => r._id),
        });
        const customPrompt: string | null = await ctx.runQuery(api.sara.getConfig, { key: "system_prompt" });

        // 4. Construct Context
        const context = chunks.map((c: any) => c.text).join("\n\n");

        const defaultPrompt = `You are SARA (Smart Access to Rights & Assistance), a professional, warm, and intelligent Tanzanian legal paralegal assistant for the Legal Services Facility (LSF).
    
    Your goal is to help Tanzanians understand their legal rights, especially women and marginalized groups.
    
    Use the following CONTEXT from LSF's knowledge base to answer the user's question.
    If the answer is found in the context, cite it naturally.
    If the answer is NOT in the context, politely say you don't have that specific information but offer general legal guidance based on Tanzanian law.
    
    Tone: Professional, empathetic, empowering, clearly Tanzanian (use "Habari", "Poleni" etc where appropriate if speaking Swahili).
    Language: Reply in the same language as the user (Swahili or English).`;

        const systemPrompt = `${customPrompt || defaultPrompt}
    
    CONTEXT:
    ${context || "No specific documents found."}
    `;

        // Tool Definitions
        const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
            {
                type: "function",
                function: {
                    name: "find_paralegals",
                    description: "Search for verified paralegals in a specific location in Tanzania. Use this when the user asks for help finding a lawyer, paralegal, or legal assistance in a specific area.",
                    parameters: {
                        type: "object",
                        properties: {
                            location: {
                                type: "string",
                                description: "The city, district, or region in Tanzania (e.g. 'Arusha', 'Temeke', 'Mwanza')"
                            }
                        },
                        required: ["location"]
                    }
                }
            }
        ];

        // 5. Generate Answer (Initial Call)
        let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: "system", content: systemPrompt },
            ...(args.history?.map(h => ({ role: h.role as "user" | "assistant", content: h.content })) || []),
            { role: "user", content: args.message },
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
            tools: tools,
            tool_choice: "auto",
        });

        const responseMessage = completion.choices[0].message;
        let finalContent = responseMessage.content || "";
        const usedTools: string[] = [];

        // 6. Handle Tool Calls
        if (responseMessage.tool_calls) {
            // Append the assistant's request to call a tool to the history
            messages.push(responseMessage);

            for (const toolCall of responseMessage.tool_calls) {
                // Determine if it's the right tool (OpenAI types can be tricky)
                if (toolCall.type === 'function' && toolCall.function.name === "find_paralegals") {
                    usedTools.push("find_paralegals"); // Track for analytics
                    const { location } = JSON.parse(toolCall.function.arguments);

                    // Call the Convex query
                    const paralegals = await ctx.runQuery(api.paralegals.listApprovedParalegals, {
                        region: location,
                        verifiedOnly: true
                    });

                    // Format the results for the AI
                    const toolResult = paralegals.length > 0
                        ? JSON.stringify(paralegals.map((p: any) => ({
                            id: p._id,
                            name: p.fullName,
                            region: p.region,
                            district: p.district,
                            phone: p.phone,
                            // Specialized marker for frontend to render card
                            _marker: `::PARALEGAL_CARD:{"id":"${p._id}","name":"${p.fullName}","region":"${p.region}","phone":"${p.phone}"}::`
                        })))
                        : "No verified paralegals found in that specific location. Suggest checking a nearby major city.";

                    messages.push({
                        tool_call_id: toolCall.id,
                        role: "tool",
                        content: toolResult,
                    });
                }
            }

            // 7. Second Call to obtain final answer
            const finalResponse = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: messages,
            });

            finalContent = finalResponse.choices[0].message.content || "";
        }

        // 8. Save Assistant Message
        await ctx.runMutation(internal.sara_chat.saveMessage, {
            userId: identity.subject,
            role: "assistant",
            content: finalContent,
            toolCalls: usedTools.length > 0 ? usedTools : undefined
        });

        return finalContent;
    },
});
