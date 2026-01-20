import { v } from "convex/values";
import { mutation } from "./_generated/server";

// ==========================================
// MEDIA LIBRARY MUTATIONS (SECURED + OPTIMIZED)
// ==========================================

// Maximum file size: 5MB (increased from 2MB for modern camera files)
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.storage.generateUploadUrl();
    },
});

export const saveMedia = mutation({
    args: {
        storageId: v.string(),
        name: v.string(),
        type: v.string(),
        size: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // =====================================================
        // SECURITY: Backend file size validation (5MB limit)
        // Prevents bypass of frontend limit via direct API calls
        // =====================================================
        if (args.size > MAX_FILE_SIZE_BYTES) {
            console.log(`[SECURITY] File size rejected: ${args.size} bytes (max: ${MAX_FILE_SIZE_BYTES})`);
            throw new Error(`File size exceeds 5MB limit. Your file is ${(args.size / (1024 * 1024)).toFixed(2)}MB.`);
        }

        const url = await ctx.storage.getUrl(args.storageId);
        if (!url) throw new Error("Failed to get URL");

        await ctx.db.insert("media_library", {
            ...args,
            url,
            uploadedBy: identity.subject,
            uploadedAt: Date.now(),
        });

        return url;
    },
});
