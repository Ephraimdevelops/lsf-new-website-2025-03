import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";
import { assertAllowedUpload } from "./lib/security";

// ==========================================
// MEDIA LIBRARY MUTATIONS (SECURED + OPTIMIZED)
// ==========================================

// Maximum file size: 20MB (increased from 5MB for modern camera files and larger PDFs)
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        return await ctx.storage.generateUploadUrl();
    },
});

export const saveMedia = mutation({
    args: {
        storageId: v.id("_storage"),
        name: v.string(),
        type: v.string(),
        size: v.number(),
    },
    handler: async (ctx, args) => {
        const { identity } = await requireAnyRole(ctx, ["admin", "staff"]);
        const file = assertAllowedUpload({ ...args, maxBytes: MAX_FILE_SIZE_BYTES });

        const url = await ctx.storage.getUrl(args.storageId);
        if (!url) throw new ConvexError("Failed to resolve storage URL for uploaded file");

        await ctx.db.insert("media_library", {
            storageId: args.storageId,
            name: file.name,
            type: file.type,
            size: args.size,
            url,
            uploadedBy: identity.subject,
            uploadedAt: Date.now(),
        });

        return url;
    },
});
