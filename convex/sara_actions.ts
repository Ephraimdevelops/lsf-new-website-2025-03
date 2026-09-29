"use node";
import { action } from "./_generated/server";
import type { ActionCtx } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";
import { normalizeText } from "./lib/security";

// ==========================================
// EMERGENCY SAFETY SYSTEM (CRITICAL)
// ==========================================

// EMERGENCY KEYWORDS - Bypass LLM entirely (0ms latency)
const EMERGENCY_KEYWORDS = [
    // English
    "suicide", "kill myself", "want to die", "end my life", "kill me",
    "hurt myself", "self harm", "danger", "emergency", "violence",
    "abuse", "rape", "beat me", "hitting me",
    // Swahili (Kiswahili cha Kitanzania)
    "kujiua", "nijiue", "nataka kufa", "kumaliza maisha", "ukatili",
    "hatari", "dharura", "kunibaka", "kunipiga", "kuniumiza",
    "ubakaji", "unyanyasaji", "jeuri"
];

const EMERGENCY_RESPONSE = `🚨 **Msaada wa Dharura / Emergency Support**

Ikiwa uko katika hatari ya sasa, nenda mahali salama ukiweza na tumia huduma rasmi ya dharura.
If you are in immediate danger, move to a safe place if you can and use an official emergency service.

**Piga simu SASA / Call NOW:**
━━━━━━━━━━━━━━━━━━━━━━
📞 **Police Emergency:** **112** (Tanzania)
📞 **116:** **Gender and Children Desk / Child Helpline**
━━━━━━━━━━━━━━━━━━━━━━

Namba hizi zimechapishwa na Serikali ya Tanzania. Upatikanaji unaweza kutegemea mtandao na eneo.
These numbers are published by the Government of Tanzania. Availability may depend on network and location.

**Chanzo / Source:** Tanzania Government contact portal and TCRA national numbering information.

---
*Ujumbe huu umetumwa moja kwa moja bila kutumia AI kwa usalama wako.*
*This message was sent directly without AI processing for your safety.*`;

function checkEmergencyKeywords(message: string): boolean {
    const lowerMessage = message.toLowerCase().trim();
    return EMERGENCY_KEYWORDS.some(keyword =>
        lowerMessage.includes(keyword.toLowerCase())
    );
}

// ==========================================
// OPENAI CLIENT
// ==========================================

const getOpenAI = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY environment variable");
    }
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
};

const MAX_SARA_DOCUMENT_BYTES = 15 * 1024 * 1024;
type SaadaActivityType =
    | "intent_detected"
    | "risk_check_started"
    | "risk_check_completed"
    | "knowledge_search_started"
    | "knowledge_search_completed"
    | "pathway_lookup_started"
    | "pathway_lookup_completed"
    | "service_search_started"
    | "service_search_completed"
    | "matching_started"
    | "matching_completed"
    | "document_analysis_started"
    | "document_analysis_completed"
    | "draft_started"
    | "draft_completed"
    | "confirmation_required"
    | "tool_execution_started"
    | "tool_execution_completed"
    | "human_review_requested"
    | "waiting_external_response"
    | "completed"
    | "failed";
type SaadaActivityStatus = "started" | "completed" | "failed" | "waiting";

async function requireAdminOrStaffAction(ctx: ActionCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const role = await ctx.runQuery(internal.users.getRoleByClerkIdInternal, {
        clerkId: identity.subject,
    });

    if (role !== "admin" && role !== "staff") {
        throw new Error("Forbidden");
    }
}

// ==========================================
// TEXT CHUNKING FOR RAG
// ==========================================

function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.slice(i, i + chunkSize));
        i += chunkSize - overlap;
    }
    return chunks;
}

// ==========================================
// DOCUMENT INGESTION ACTION
// ==========================================

export const ingestDocument = action({
    args: {
        storageId: v.id("_storage"),
        title: v.string(),
        sourceUrl: v.optional(v.string()),
        publisher: v.string(),
        jurisdiction: v.union(v.literal("tanzania_mainland"), v.literal("zanzibar"), v.literal("national"), v.literal("other")),
        language: v.union(v.literal("sw"), v.literal("en"), v.literal("bilingual"), v.literal("other")),
        contentCategory: v.string(),
        versionLabel: v.string(),
        effectiveDate: v.optional(v.string()),
        reviewDueAt: v.number(),
    },
    handler: async (ctx, args): Promise<{ success: boolean; documentId: any }> => {
        await requireAdminOrStaffAction(ctx);
        const uploader = await ctx.auth.getUserIdentity();
        if (!uploader) throw new Error("Unauthorized");
        const title = normalizeText(args.title, "Document title", 180);
        if (!Number.isFinite(args.reviewDueAt) || args.reviewDueAt <= Date.now()) throw new Error("Review due date must be in the future.");
        if (args.sourceUrl) {
            try { const url = new URL(args.sourceUrl); if (!['https:', 'http:'].includes(url.protocol)) throw new Error(); }
            catch { throw new Error("Source URL must be a valid HTTP(S) address."); }
        }

        // 1. Get file from storage
        const fileUrl = await ctx.storage.getUrl(args.storageId);
        if (!fileUrl) throw new Error("File not found");

        // Fetch file content
        const response = await fetch(fileUrl);
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.toLowerCase().includes("pdf")) {
            throw new Error("Only PDF documents can be ingested into SARA");
        }

        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength > MAX_SARA_DOCUMENT_BYTES) {
            throw new Error("SARA documents must be 15MB or smaller");
        }

        // 2. Parse PDF using pdfjs-dist (Standard standard/V8 compatible)
        let text = "";
        try {
            // Dynamic import to avoid breaking the bundler.
            const pdfjsLib = await import("pdfjs-dist/build/pdf.min.mjs");

            // Required for Edge/Node environments where there's no native Worker
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.min.mjs";
            }

            const uint8Array = new Uint8Array(arrayBuffer);
            const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
            const pdfDoc = await loadingTask.promise;

            const numPages = pdfDoc.numPages;
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageStrings = textContent.items.map((item: any) => item.str);
                text += pageStrings.join(" ") + "\n";
            }
        } catch (e) {
            console.error("PDF Parse Error (PDF.js):", e);
            throw new Error(`Failed to parse PDF: ${e instanceof Error ? e.message : 'Unknown PDF error'}`);
        }

        // 3. Create Document Record
        const documentId = await ctx.runMutation(internal.sara.createDocument, {
            title,
            storageId: args.storageId,
            text: text,
            type: "pdf",
            uploadedByClerkId: uploader.subject,
            sourceUrl: args.sourceUrl?.trim() || undefined,
            publisher: normalizeText(args.publisher, "Publisher", 180),
            jurisdiction: args.jurisdiction,
            language: args.language,
            contentCategory: normalizeText(args.contentCategory, "Content category", 100),
            versionLabel: normalizeText(args.versionLabel, "Version", 80),
            effectiveDate: args.effectiveDate?.trim() || undefined,
            reviewDueAt: args.reviewDueAt,
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

        await ctx.runMutation(internal.sara.markDocumentProcessed, { id: documentId });
        return { success: true, documentId };
    },
});

// ==========================================
// MAIN CHAT ACTION (WITH SAFETY TRIGGERS)
// ==========================================

export const ask = action({
    args: {
        message: v.string(),
        history: v.array(v.object({
            role: v.union(v.literal("user"), v.literal("assistant")),
            content: v.string(),
        })),
        source: v.optional(v.union(v.literal("web"), v.literal("mobile"), v.literal("unknown"))),
        clientRequestId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated call to Sara AI Action");
        }
        const userId = identity.subject;
        const source = args.source ?? "unknown";
        const requestId = args.clientRequestId?.trim().slice(0, 120) || `${source}-${Date.now()}`;
        const messagePreview = args.message.slice(0, 240);
        const activity = async (
            type: SaadaActivityType,
            status: SaadaActivityStatus,
            labelKey: string,
            summary?: string,
            metadata?: Record<string, unknown>,
        ) => ctx.runMutation(internal.sara.recordActivityEvent, {
            userId,
            requestId,
            source,
            type,
            status,
            labelKey,
            summary,
            metadata,
        });

        // =====================================================
        // SECURITY GATE 1: Kill Switch Check
        // =====================================================
        await activity("intent_detected", "completed", "saada.activity.intent_detected", "Question received");
        await activity("risk_check_started", "started", "saada.activity.risk_check_started", "Checking safety and system policy");
        const systemConfig = await ctx.runQuery(internal.sara.getConfigInternal, { key: "system_status" });
        if (systemConfig === "maintenance") {
            console.log("[SARA SECURITY] Kill Switch active - blocking request");
            await ctx.runMutation(internal.sara.recordRiskEvent, {
                userId,
                eventType: "policy_block",
                source,
                messagePreview,
                metadata: { reason: "maintenance" },
            });
            await activity("failed", "failed", "saada.activity.failed", "Saada is temporarily unavailable", { reason: "maintenance" });
            throw new Error("SARA is temporarily unavailable for maintenance. Please try again later.");
        }

        // =====================================================
        // SECURITY GATE 2: Budget Cap Enforcement
        // =====================================================
        const allChatsForBudget = await ctx.runQuery(internal.sara.getAllChats);
        const budgetTokenCount = allChatsForBudget.reduce((sum: number, m: any) => sum + (m.tokens || 0), 0);
        const BUDGET_LIMIT_TOKENS = 2000000; // ~$20 at $0.01/1k tokens

        if (budgetTokenCount >= BUDGET_LIMIT_TOKENS) {
            console.log("[SARA SECURITY] Budget cap reached - blocking request");
            await ctx.runMutation(internal.sara.recordRiskEvent, {
                userId,
                eventType: "policy_block",
                source,
                messagePreview,
                metadata: { reason: "budget_limit", budgetTokenCount },
            });
            await activity("failed", "failed", "saada.activity.failed", "Monthly usage limit reached", { reason: "budget_limit" });
            throw new Error("SARA has reached its monthly usage limit. Please contact the administrator.");
        }

        // =====================================================
        // SAFETY FIRST: Check for emergency keywords (0ms latency)
        // This bypasses OpenAI entirely for critical safety
        // =====================================================
        if (checkEmergencyKeywords(args.message)) {
            console.log("[SARA SAFETY] Emergency keyword detected, bypassing LLM");
            await ctx.runMutation(internal.sara.recordRiskEvent, {
                userId,
                eventType: "emergency_keyword",
                source,
                messagePreview,
                metadata: { bypassedLlm: true },
            });
            await activity("risk_check_completed", "completed", "saada.activity.risk_check_completed", "Safety concern detected", { emergency: true });
            await activity("human_review_requested", "waiting", "saada.activity.human_review_requested", "Human support is recommended");

            // Create and immediately complete the bot message
            const botMessageId = await ctx.runMutation(internal.sara_chat.createBotMessage, {
                userId,
            });

            await ctx.runMutation(internal.sara_chat.updateMessage, {
                messageId: botMessageId,
                content: EMERGENCY_RESPONSE,
                isDone: true,
                toolCalls: ["EMERGENCY_SAFETY_TRIGGER"],
            });
            await activity("completed", "completed", "saada.activity.completed", "Emergency guidance returned", { bypassedLlm: true });

            return EMERGENCY_RESPONSE;
        }
        await activity("risk_check_completed", "completed", "saada.activity.risk_check_completed", "Safety gate completed");

        const openai = getOpenAI();

        // 1. Create Placeholder Bot Message
        const botMessageId = await ctx.runMutation(internal.sara_chat.createBotMessage, {
            userId,
        });

        // 2. Embed Query & RAG
        await activity("knowledge_search_started", "started", "saada.activity.knowledge_search_started", "Searching approved knowledge");
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: args.message,
        });
        const embedding = embeddingResponse.data[0].embedding;

        const vectorResults = await ctx.vectorSearch("embeddings", "by_embedding", {
            vector: embedding,
            limit: 20,
        });
        const approvedIds = new Set(await ctx.runQuery(internal.sara.getApprovedChunkIds, {
            ids: vectorResults.map((result) => result._id),
        }));
        const results = vectorResults.filter((result) => approvedIds.has(result._id)).slice(0, 5);
        await activity("knowledge_search_completed", "completed", "saada.activity.knowledge_search_completed", `${results.length} knowledge matches checked`, { resultCount: results.length });

        // =====================================================
        // HALLUCINATION GUARD: Check confidence scores
        // =====================================================
        const HIGH_CONFIDENCE_THRESHOLD = 0.75;
        const highConfidenceResults = results.filter(r =>
            r._score !== undefined && r._score >= HIGH_CONFIDENCE_THRESHOLD
        );

        let context = "";
        let confidenceWarning = "";

        if (highConfidenceResults.length === 0 && results.length > 0) {
            await ctx.runMutation(internal.sara.recordRiskEvent, {
                userId,
                eventType: "low_confidence",
                source,
                messagePreview,
                metadata: { resultCount: results.length },
            });
            await activity("human_review_requested", "waiting", "saada.activity.human_review_requested", "Low confidence legal guidance needs caution", { resultCount: results.length });
            // Low confidence - warn SARA to be honest
            confidenceWarning = `
⚠️ IMPORTANT: The knowledge base returned LOW CONFIDENCE results for this query.
You MUST be honest and say something like: "Samahani, sijui jibu la swali hilo kwa uhakika. 
Tafadhali wasiliana na wakili au paralegal kwa ushauri sahihi."
DO NOT make up legal information. It is SAFER to say "I don't know" than to guess.
`;
            // Still provide context but with low confidence
            const chunks = await ctx.runQuery(internal.sara.getChunks, {
                ids: results.map(r => r._id)
            });
            context = chunks.map(chunk => `[SOURCE: ${chunk?.sourceTitle ?? "Approved LSF source"}; PUBLISHER: ${chunk?.publisher ?? "LSF-approved publisher"}; VERSION: ${chunk?.versionLabel ?? "reviewed edition"}; EFFECTIVE: ${chunk?.effectiveDate ?? "not stated"}; URL: ${chunk?.sourceUrl ?? "stored source PDF"}]\n${chunk?.text || ""}`).join("\n\n");
        } else if (highConfidenceResults.length > 0) {
            // High confidence - use filtered results
            const chunks = await ctx.runQuery(internal.sara.getChunks, {
                ids: highConfidenceResults.map(r => r._id)
            });
            context = chunks.map(chunk => `[SOURCE: ${chunk?.sourceTitle ?? "Approved LSF source"}; PUBLISHER: ${chunk?.publisher ?? "LSF-approved publisher"}; VERSION: ${chunk?.versionLabel ?? "reviewed edition"}; EFFECTIVE: ${chunk?.effectiveDate ?? "not stated"}; URL: ${chunk?.sourceUrl ?? "stored source PDF"}]\n${chunk?.text || ""}`).join("\n\n");
        }

        // =====================================================
        // SYSTEM PROMPT: Tanzanian Swahili Cultural Tuning
        // =====================================================
        // Fetch dynamic system prompt from DB (Admin Config)
        const approvedPrompt = await ctx.runQuery(internal.sara.getApprovedPromptInternal, {});

        const defaultSystemPrompt = `You are Saada, the official legal assistant for LSF (Legal Services Facility) Tanzania.

CORE IDENTITY:
- Name: Saada
- Role: Official Legal Assistant (Sheria Assistant & Resource Associate)
- Institution: Legal Services Facility (LSF)
- Mission: To help Tanzanians understand their rights and access justice.

TRUST & AUTHORITY:
- You represent the official platform of LSF Tanzania.
- Always include this declaration in your introductions: "Naitwa Saada. Nimeboreshwa zaidi ili kukusaidia kuelewa sheria za Tanzania kwa lugha rahisi na kupata msaada wa kisheria." 
- Your name is Saada. You have no other past names or identities. You are solely the AI assistant for LSF.

LANGUAGE & CULTURAL GUIDELINES:
- Use Kiswahili cha Kitanzania (Tanzanian Swahili) as your primary language.
- Avoid Kenyan idioms or slang.
- Simplify legal terms for accessibility (e.g., use "Mirathi" for probate, "Haki za Ardhi" for property rights).
- Be empathetic, calm, and professional.

RESPONSE GUIDELINES:
- Keep answers professional, empathetic, and concise.
- Never use the word "Smart" to describe yourself; use "Official" or "Helpful".
- If asked for specific legal advice, recommend consulting a paralegal.
- If a user asks for a paralegal or legal assistance, ALWAYS proactively ask them for their Region and District FIRST if you don't already know it, so you can find one near them using the find_paralegals tool.
- Always end with a helpful next step.
- When approved knowledge is used, name the source in a short "Chanzo" or "Source" line. Never invent a source or citation.

${confidenceWarning}

IMPORTANT: If a tool returns a string starting with "::PARALEGAL_CARD:", you MUST include that exact string in your response. Do not summarize it or remove the colons. This is required for the UI to render the card.

KNOWLEDGE BASE CONTEXT:
${context || "No relevant context found. Please be honest about not having specific information."}`;

        // Only an independently approved prompt version may replace the default.
        let finalSystemPrompt = defaultSystemPrompt;

        if (approvedPrompt?.prompt) {
            finalSystemPrompt = `${approvedPrompt.prompt}

${confidenceWarning}

IMPORTANT: If a tool returns a string starting with "::PARALEGAL_CARD:", you MUST include that exact string in your response. Do not summarize it or remove the colons. This is required for the UI to render the card.

KNOWLEDGE BASE CONTEXT:
${context || "No relevant context found. Please be honest about not having specific information."}`;
        }

        const messages: any[] = [
            { role: "system", content: finalSystemPrompt },
            ...args.history.slice(-10), // Limit to last 10 messages (5 turns)
            { role: "user", content: args.message }
        ];

        // 3. Define Tools
        const tools = [
            {
                type: "function",
                function: {
                    name: "find_paralegals",
                    description: "Find a paralegal in a specific region of Tanzania",
                    parameters: {
                        type: "object",
                        properties: {
                            region: { type: "string", description: "Tanzanian region (e.g., Arusha, Dodoma, Mwanza)" },
                            district: { type: "string", description: "District within the region" }
                        },
                        required: ["region"],
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "find_services",
                    description: "Search the verified public Haki Yangu service directory by legal issue and Tanzanian location. Never returns confidential safe-house locations.",
                    parameters: {
                        type: "object",
                        properties: {
                            issueCategory: { type: "string", enum: ["employment", "land", "family", "safety", "consumer", "other"] },
                            region: { type: "string", description: "Tanzanian region" },
                            district: { type: "string", description: "District within the region" },
                        },
                        required: ["issueCategory"],
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
        let totalTokens = 0;

        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;

            // Track token usage
            if (chunk.usage) {
                totalTokens = chunk.usage.total_tokens || 0;
            }

            // Check for tool calls
            if (delta?.tool_calls) {
                if (!toolCallBuffer) toolCallBuffer = { name: "", arguments: "", id: "" };
                const tc = delta.tool_calls[0];
                if (tc.id) toolCallBuffer.id = tc.id;
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
            await ctx.runMutation(internal.sara.recordRiskEvent, {
                userId,
                eventType: "tool_routing",
                source,
                messagePreview,
                metadata: { toolName: toolCallBuffer.name },
            });
            await activity("tool_execution_started", "started", "saada.activity.tool_execution_started", `Running ${toolCallBuffer.name}`, { toolName: toolCallBuffer.name });
            const argsObj = JSON.parse(toolCallBuffer.arguments);
            const region = argsObj.region || "Tanzania";

            await activity("service_search_started", "started", "saada.activity.service_search_started", "Looking for verified public support", { region, toolName: toolCallBuffer.name });
            let searchResults = "I could not find a verified public service for those details. Use Find Help or submit a reviewed request to LSF.";

            if (toolCallBuffer.name === "find_services") {
                const services = await ctx.runQuery(api.justiceServices.listPublicServices, {
                    issueCategory: argsObj.issueCategory,
                    region: argsObj.region,
                    district: argsObj.district,
                });
                await activity("service_search_completed", "completed", "saada.activity.service_search_completed", `${services.length} verified public services checked`, { region, resultCount: services.length });
                if (services.length) {
                    searchResults = `Verified public directory results:\n${services.slice(0, 3).map((service: any) => `- ${service.name} — ${service.district}, ${service.region}; intake: ${service.currentIntakeState}; access: ${[service.phoneSupport && "phone", service.walkIn && "walk-in", service.remoteSupport && "remote"].filter(Boolean).join(", ") || "confirm with service"}`).join("\n")}\nTell the user these are directory records, advise them to open Find Help for current details, and do not claim a referral was sent.`;
                }
            } else {
                const paralegals = await ctx.runQuery(api.paralegals.listApprovedParalegals, { region: region });
                await activity("service_search_completed", "completed", "saada.activity.service_search_completed", `${paralegals.length} verified paralegal records checked`, { region, resultCount: paralegals.length });
                if (paralegals && paralegals.length > 0) {
                // Find a paralegal matching the district if strictly requested, otherwise use the first from the region
                const district = argsObj.district;
                let target = paralegals[0];

                if (district) {
                    const districtMatch = paralegals.find((p: any) => p.district.toLowerCase().includes(district.toLowerCase()));
                    if (districtMatch) {
                        target = districtMatch;
                    }
                }

                // Format for UI Card
                const cardData = JSON.stringify({
                    name: target.fullName,
                    region: target.region,
                    district: target.district,
                    phone: target.phone,
                    verified: target.isVerified || false
                });

                searchResults = `Found a verified paralegal. Details: ::PARALEGAL_CARD:${cardData}::`;
                }
            }
            await activity("tool_execution_completed", "completed", "saada.activity.tool_execution_completed", `${toolCallBuffer.name} completed`, { toolName: toolCallBuffer.name });

            // Append tool call result
            const currentToolCallId = toolCallBuffer.id || "call_" + Date.now();

            messages.push({
                role: "assistant",
                tool_calls: [{
                    id: currentToolCallId,
                    type: "function",
                    function: {
                        name: toolCallBuffer.name,
                        arguments: toolCallBuffer.arguments
                    }
                }]
            });
            messages.push({
                role: "tool",
                tool_call_id: currentToolCallId,
                content: searchResults
            });

            // Stream second response
            const secondStream = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: messages,
                stream: true,
            });

            for await (const chunk of secondStream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (chunk.usage) {
                    totalTokens += chunk.usage.total_tokens || 0;
                }
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

        // 6. Final Done Update (with token tracking)
        await ctx.runMutation(internal.sara_chat.updateMessage, {
            messageId: botMessageId,
            content: fullContent,
            isDone: true,
            tokens: totalTokens,
            toolCalls: toolCallBuffer ? [toolCallBuffer.name] : undefined,
        });

        await ctx.runMutation(internal.sara.recordRiskEvent, {
            userId,
            eventType: "normal_response",
            source,
            messagePreview,
            metadata: {
                tokens: totalTokens,
                toolUsed: toolCallBuffer ? toolCallBuffer.name : null,
                highConfidenceResultCount: highConfidenceResults.length,
            },
        });
        await activity("completed", "completed", "saada.activity.completed", "Saada response completed", {
            tokens: totalTokens,
            toolUsed: toolCallBuffer ? toolCallBuffer.name : null,
            highConfidenceResultCount: highConfidenceResults.length,
        });

        return fullContent;
    },
});
