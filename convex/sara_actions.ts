"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";

// Lazy load OpenAI
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
            // Dynamic import
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

        // 5. Generate Embeddings
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
        history: v.array(v.object({
            role: v.union(v.literal("user"), v.literal("assistant")),
            content: v.string(),
        })),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated call to Sara AI Action");
        }
        const userId = identity.subject;
        const openai = getOpenAI();

        // 1. Create Placeholder Bot Message
        const botMessageId = await ctx.runMutation(internal.sara_chat.createBotMessage, {
            userId,
        });

        // 2. Embed Query & RAG
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: args.message,
        });
        const embedding = embeddingResponse.data[0].embedding;

        const results = await ctx.vectorSearch("embeddings", "by_embedding", {
            vector: embedding,
            limit: 5,
        });

        // CORRECTED: Use getChunks with vector search IDs
        const chunks = await ctx.runQuery(internal.sara.getChunks, {
            ids: results.map(r => r._id)
        });

        const context = chunks.map(chunk => chunk?.text || "").join("\n\n");

        const messages: any[] = [
            {
                role: "system",
                content: `You are SARA (Sheria Assistant & Resource Associate), a legal assistant for LSF Tanzania.
                Use the following context to answer questions. If unsure, say so.
                Keep answers professional, empathetic, and concise.
                
                IMPORTANT: If a tool returns a string starting with "::PARALEGAL_CARD:", you MUST include that exact string in your response. Do not summarize it or remove the colons. This is required for the UI to render the card.

                Context:
                ${context}`
            },
            ...args.history,
            { role: "user", content: args.message }
        ];

        // 3. Define Tools
        const tools = [
            {
                type: "function",
                function: {
                    name: "find_paralegals",
                    description: "Find a paralegal in a specific region",
                    parameters: {
                        type: "object",
                        properties: { region: { type: "string" }, district: { type: "string" } },
                        required: ["region"],
                    },
                },
            },
        ];

        // 4. Call OpenAI (Streaming)
        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
            tools: tools as any,
            tool_choice: "auto",
            stream: true,
        });

        let fullContent = "";
        let toolCallBuffer: any = null;
        let updateCount = 0;

        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;

            // Check for tool calls
            if (delta?.tool_calls) {
                if (!toolCallBuffer) toolCallBuffer = { name: "", arguments: "" };
                const tc = delta.tool_calls[0];
                if (tc.function?.name) toolCallBuffer.name += tc.function.name;
                if (tc.function?.arguments) toolCallBuffer.arguments += tc.function.arguments;
                continue;
            }

            // Normal text content
            if (delta?.content) {
                fullContent += delta.content;
                updateCount++;

                // Throttle updates (every 5 chunks)
                if (updateCount % 5 === 0) {
                    await ctx.runMutation(internal.sara_chat.updateMessage, {
                        messageId: botMessageId,
                        content: fullContent,
                        isDone: false,
                    });
                }
            }
        }

        // 5. Handle Tool Execution (if any)
        if (toolCallBuffer) {
            // We have a tool call!
            const argsObj = JSON.parse(toolCallBuffer.arguments);
            const region = argsObj.region || "Tanzania";

            // Dynamic Data Simulation
            let name = "Juma M. Legal Services";
            let phone = "+255 755 123 456";

            if (region.toLowerCase().includes("arusha")) {
                name = "Arusha Legal Aid Centre";
                phone = "+255 767 889 900";
            } else if (region.toLowerCase().includes("dom") || region.toLowerCase().includes("dodoma")) {
                name = "Dodoma Haki Center";
                phone = "+255 712 334 455";
            } else if (region.toLowerCase().includes("mwanza")) {
                name = "Victoria Justice Hub";
                phone = "+255 788 112 233";
            }

            // Format specifically for the UI Card
            const cardData = JSON.stringify({
                name: name,
                region: region,
                district: argsObj.district || "District Office",
                phone: phone,
                verified: true
            });

            const searchResults = `Found a paralegal. Details: ::PARALEGAL_CARD:${cardData}::`;

            // Append to messages
            messages.push({
                role: "assistant",
                tool_calls: [{
                    id: "call_" + Date.now(),
                    type: "function",
                    function: {
                        name: toolCallBuffer.name,
                        arguments: toolCallBuffer.arguments
                    }
                }]
            });
            messages.push({
                role: "tool",
                tool_call_id: "call_" + Date.now(),
                content: searchResults
            });

            // Stream the SECOND response (Final Answer)
            const secondStream = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: messages,
                stream: true,
            });

            for await (const chunk of secondStream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    fullContent += content;
                    updateCount++;
                    if (updateCount % 5 === 0) {
                        await ctx.runMutation(internal.sara_chat.updateMessage, {
                            messageId: botMessageId,
                            content: fullContent,
                            isDone: false,
                        });
                    }
                }
            }
        }

        // 6. Final Done Update
        await ctx.runMutation(internal.sara_chat.updateMessage, {
            messageId: botMessageId,
            content: fullContent,
            isDone: true,
        });

        return fullContent;
    },
});
