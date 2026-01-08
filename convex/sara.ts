import { action, mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL for PDF files
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

// Internal mutation to create the document record
export const createDocument = internalMutation({
    args: {
        title: v.string(),
        storageId: v.id("_storage"),
        text: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("documents", {
            title: args.title,
            text: args.text,
            storageId: args.storageId,
            type: args.type,
            uploadedAt: Date.now(),
            processedAt: Date.now(),
        });
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
        const existing = await ctx.db
            .query("sara_config")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value });
        } else {
            await ctx.db.insert("sara_config", { key: args.key, value: args.value });
        }
    },
});


// List all uploaded documents
export const getDocuments = query({
    handler: async (ctx) => {
        return await ctx.db.query("documents").order("desc").collect();
    },
});

// Delete a document and its embeddings
export const deleteDocument = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
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
                chunks.push(chunk);
            }
        }
        return chunks;
    },
});
