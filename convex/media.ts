import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
