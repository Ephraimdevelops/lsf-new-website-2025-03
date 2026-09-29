import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { requireAnyRole } from "./lib/auth";

// Generate upload URL for PDF files
export const generateUploadUrl = mutation(async (ctx) => {
    await requireAnyRole(ctx, ["admin", "staff"]);
    return await ctx.storage.generateUploadUrl();
});

// Internal mutation to create the document record
export const createDocument = internalMutation({
    args: {
        title: v.string(),
        storageId: v.id("_storage"),
        text: v.string(),
        type: v.string(),
        uploadedByClerkId: v.string(),
        sourceUrl: v.optional(v.string()),
        publisher: v.string(),
        jurisdiction: v.union(v.literal("tanzania_mainland"), v.literal("zanzibar"), v.literal("national"), v.literal("other")),
        language: v.union(v.literal("sw"), v.literal("en"), v.literal("bilingual"), v.literal("other")),
        contentCategory: v.string(),
        versionLabel: v.string(),
        effectiveDate: v.optional(v.string()),
        reviewDueAt: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("documents", {
            title: args.title,
            text: args.text,
            storageId: args.storageId,
            type: args.type,
            uploadedByClerkId: args.uploadedByClerkId,
            sourceUrl: args.sourceUrl,
            publisher: args.publisher,
            jurisdiction: args.jurisdiction,
            language: args.language,
            contentCategory: args.contentCategory,
            versionLabel: args.versionLabel,
            effectiveDate: args.effectiveDate,
            reviewDueAt: args.reviewDueAt,
            approvalStatus: "pending",
            uploadedAt: Date.now(),
        });
    },
});

export const markDocumentProcessed = internalMutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { processedAt: Date.now() });
    },
});

// Internal mutation to save embeddings chunks
export const addEmbeddings = internalMutation({
    args: {
        documentId: v.id("documents"),
        chunks: v.array(
            v.object({
                text: v.string(),
                embedding: v.array(v.number()),
                index: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        for (const chunk of args.chunks) {
            await ctx.db.insert("embeddings", {
                documentId: args.documentId,
                text: chunk.text,
                embedding: chunk.embedding,
                chunkIndex: chunk.index,
            });
        }
    },
});

// ... (existing code)

// Get SARA configuration
export const getConfig = query({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);
        const config = await ctx.db
            .query("sara_config")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .first();
        return config?.value ?? null;
    },
});

// Update SARA configuration
export const updateConfig = mutation({
    args: { key: v.string(), value: v.string() },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]);
        if (args.key !== "system_status") throw new Error("Prompt changes must use versioned submission and independent approval.");
        if (args.value.length > 20000) throw new Error("Setting is too long.");

        const existing = await ctx.db
            .query("sara_config")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value });
        } else {
            await ctx.db.insert("sara_config", { key: args.key, value: args.value });
        }
        await ctx.db.insert("audit_logs", { action: "saada.config_updated", entityType: "sara_config", entityId: args.key, userId: user._id, timestamp: Date.now(), metadata: { previousLength: existing?.value.length ?? 0, newLength: args.value.length } });
    },
});

export const listPromptVersions = query({ args: {}, handler: async (ctx) => {
    await requireAnyRole(ctx, ["admin"]);
    return (await ctx.db.query("saada_prompt_versions").collect()).sort((a, b) => b.version - a.version);
} });

export const submitPromptVersion = mutation({
    args: { prompt: v.string(), changeNote: v.string() },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]);
        const prompt = args.prompt.trim(); const changeNote = args.changeNote.trim();
        if (prompt.length < 100 || prompt.length > 20000) throw new Error("Prompt must be 100–20,000 characters.");
        if (changeNote.length < 10 || changeNote.length > 1000) throw new Error("Record a 10–1,000 character change reason.");
        const versions = await ctx.db.query("saada_prompt_versions").collect();
        const version = Math.max(0, ...versions.map((item) => item.version)) + 1;
        const id = await ctx.db.insert("saada_prompt_versions", { prompt, version, changeNote, status: "pending", submittedBy: user._id, submittedAt: Date.now() });
        await ctx.db.insert("audit_logs", { action: "saada.prompt_submitted", entityType: "saada_prompt_version", entityId: id, userId: user._id, timestamp: Date.now(), metadata: { version, changeNote } });
        return { id, version };
    },
});

export const reviewPromptVersion = mutation({
    args: { id: v.id("saada_prompt_versions"), decision: v.union(v.literal("approved"), v.literal("rejected")), reviewNote: v.string() },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]); const version = await ctx.db.get(args.id);
        if (!version) throw new Error("Prompt version not found.");
        if (version.submittedBy === user._id) throw new Error("A different administrator must review this prompt.");
        if (version.status !== "pending") throw new Error("This prompt has already been reviewed.");
        const reviewNote = args.reviewNote.trim();
        if (reviewNote.length < 10 || reviewNote.length > 1000) throw new Error("Record a 10–1,000 character review reason.");
        const now = Date.now();
        if (args.decision === "approved") {
            const active = await ctx.db.query("saada_prompt_versions").withIndex("by_status", (q) => q.eq("status", "approved")).collect();
            for (const item of active) await ctx.db.patch(item._id, { status: "retired" });
        }
        await ctx.db.patch(version._id, { status: args.decision, reviewedBy: user._id, reviewedAt: now, reviewNote });
        await ctx.db.insert("audit_logs", { action: `saada.prompt_${args.decision}`, entityType: "saada_prompt_version", entityId: version._id, userId: user._id, timestamp: now, metadata: { version: version.version, reviewNote } });
        return { success: true };
    },
});


// List all uploaded documents
export const getDocuments = query({
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const documents = await ctx.db.query("documents").order("desc").take(100);
        return await Promise.all(documents.map(async ({ text, ...document }) => ({ ...document, sourcePdfUrl: await ctx.storage.getUrl(document.storageId) })));
    },
});

export const reviewDocument = mutation({
    args: { id: v.id("documents"), decision: v.union(v.literal("approved"), v.literal("rejected")), note: v.string() },
    handler: async (ctx, args) => {
        const { user, identity } = await requireAnyRole(ctx, ["admin"]);
        const doc = await ctx.db.get(args.id);
        if (!doc) throw new Error("Document not found");
        if (doc.uploadedByClerkId === identity.subject) throw new Error("A different administrator must review this source.");
        if (doc.approvalStatus === args.decision) return { success: true };
        if (args.decision === "approved" && !doc.processedAt) throw new Error("Document indexing must finish before approval.");
        if (args.decision === "approved" && (!doc.publisher || !doc.jurisdiction || !doc.language || !doc.contentCategory || !doc.versionLabel || !doc.reviewDueAt)) throw new Error("Complete source provenance and review metadata before approval.");
        if (args.decision === "approved" && doc.reviewDueAt! <= Date.now()) throw new Error("Review due date must be in the future.");
        const note = args.note.trim();
        if (note.length < 10 || note.length > 2000) throw new Error("Record a 10–2000 character review reason.");
        const now = Date.now();
        await ctx.db.patch(doc._id, { approvalStatus: args.decision, reviewedBy: user._id, reviewNote: note, lastReviewedAt: now, approvedAt: args.decision === "approved" ? now : undefined });
        await ctx.db.insert("audit_logs", { action: `saada.document_${args.decision}`, entityType: "document", entityId: doc._id, userId: user._id, timestamp: now, metadata: { title: doc.title, previousStatus: doc.approvalStatus ?? "legacy_unreviewed" } });
        return { success: true };
    },
});

export const getApprovedChunkIds = internalQuery({
    args: { ids: v.array(v.id("embeddings")) },
    handler: async (ctx, args) => {
        const allowed = [];
        for (const id of args.ids) {
            const chunk = await ctx.db.get(id);
            if (!chunk) continue;
            const document = await ctx.db.get(chunk.documentId);
            if (document?.approvalStatus === "approved") allowed.push(id);
        }
        return allowed;
    },
});

// Delete a document and its embeddings
export const deleteDocument = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);

        const doc = await ctx.db.get(args.id);
        if (!doc) throw new Error("Document not found");

        // 1. Delete Embeddings
        const embeddings = await ctx.db
            .query("embeddings")
            .withIndex("by_documentId", (q) => q.eq("documentId", args.id))
            .collect();

        for (const embedding of embeddings) {
            await ctx.db.delete(embedding._id);
        }

        // 2. Delete File from Storage
        if (doc.storageId) {
            await ctx.storage.delete(doc.storageId);
        }

        // 3. Delete Document Record
        await ctx.db.delete(args.id);
    },
});

export const getChunks = internalQuery({
    // ... (existing getChunks)
    args: {
        ids: v.array(v.id("embeddings")),
    },
    handler: async (ctx, args) => {
        const chunks = [];
        for (const id of args.ids) {
            const chunk = await ctx.db.get(id);
            if (chunk) {
                const document = await ctx.db.get(chunk.documentId);
                chunks.push({ ...chunk, sourceTitle: document?.title ?? "Approved LSF source", sourceUrl: document?.sourceUrl, publisher: document?.publisher, versionLabel: document?.versionLabel, effectiveDate: document?.effectiveDate, jurisdiction: document?.jurisdiction });
            }
        }
        return chunks;
    },
});

export const recordRiskEvent = internalMutation({
    args: {
        userId: v.string(),
        eventType: v.union(
            v.literal("emergency_keyword"),
            v.literal("low_confidence"),
            v.literal("tool_routing"),
            v.literal("policy_block"),
            v.literal("normal_response"),
        ),
        source: v.union(v.literal("web"), v.literal("mobile"), v.literal("unknown")),
        messagePreview: v.string(),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("saada_risk_events", {
            userId: args.userId,
            eventType: args.eventType,
            source: args.source,
            messagePreview: args.messagePreview.slice(0, 240),
            metadata: args.metadata,
            dispositionStatus: "open",
            createdAt: Date.now(),
        });
    },
});

const saadaActivityType = v.union(
    v.literal("intent_detected"),
    v.literal("risk_check_started"),
    v.literal("risk_check_completed"),
    v.literal("knowledge_search_started"),
    v.literal("knowledge_search_completed"),
    v.literal("pathway_lookup_started"),
    v.literal("pathway_lookup_completed"),
    v.literal("service_search_started"),
    v.literal("service_search_completed"),
    v.literal("matching_started"),
    v.literal("matching_completed"),
    v.literal("document_analysis_started"),
    v.literal("document_analysis_completed"),
    v.literal("draft_started"),
    v.literal("draft_completed"),
    v.literal("confirmation_required"),
    v.literal("tool_execution_started"),
    v.literal("tool_execution_completed"),
    v.literal("human_review_requested"),
    v.literal("waiting_external_response"),
    v.literal("completed"),
    v.literal("failed"),
);

export const recordActivityEvent = internalMutation({
    args: {
        userId: v.string(),
        requestId: v.string(),
        source: v.union(v.literal("web"), v.literal("mobile"), v.literal("unknown")),
        type: saadaActivityType,
        status: v.union(v.literal("started"), v.literal("completed"), v.literal("failed"), v.literal("waiting")),
        labelKey: v.string(),
        summary: v.optional(v.string()),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("saada_activity_events", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

// ==========================================
// INTERNAL QUERIES FOR SECURITY GATES
// ==========================================

/**
 * Internal query to get SARA config value (for Kill Switch)
 * Used by sara_actions.ts to check maintenance mode
 */
export const getConfigInternal = internalQuery({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        const config = await ctx.db
            .query("sara_config")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .first();
        return config?.value ?? null;
    },
});

export const getApprovedPromptInternal = internalQuery({ args: {}, handler: async (ctx) => {
    const approved = await ctx.db.query("saada_prompt_versions").withIndex("by_status", (q) => q.eq("status", "approved")).collect();
    return approved.sort((a, b) => b.version - a.version)[0] ?? null;
} });

/**
 * Internal query to get all SARA chat messages (for Budget check)
 * Returns all messages to calculate total token usage
 */
export const getAllChats = internalQuery({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("sara_chats").collect();
    },
});
