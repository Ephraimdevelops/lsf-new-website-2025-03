import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";
import { requirePublicMediaReference } from "./lib/managedUploads";
import { isConvexStorageId } from "./lib/mediaHelpers";
import type { Id } from "./_generated/dataModel";

async function assertUploadedImage(ctx: { db: { system: { get: (id: Id<"_storage">) => Promise<{ contentType?: string; size: number } | null> } } }, id: Id<"_storage">) {
    const metadata = await ctx.db.system.get(id);
    if (!metadata || !["image/jpeg", "image/png", "image/webp"].includes(metadata.contentType || "") || metadata.size > 20 * 1024 * 1024) {
        throw new Error("The testimonial image is missing or unsupported. Upload a JPG, PNG, or WebP image under 20 MB.");
    }
}

async function withImage<T extends { imageUrl: string; imageStorageId?: Id<"_storage"> }>(ctx: { storage: { getUrl: (id: Id<"_storage">) => Promise<string | null> } }, testimonial: T) {
    const storageId = testimonial.imageStorageId || (isConvexStorageId(testimonial.imageUrl) ? testimonial.imageUrl as Id<"_storage"> : null);
    const imageUrl = storageId ? await ctx.storage.getUrl(storageId).catch(() => null) : null;
    return { ...testimonial, imageUrl: imageUrl ?? "", imageStatus: imageUrl ? "ready" as const : "missing" as const };
}

// Public reads resolve the durable storage ID on every request.
export const get = query({
    args: {},
    handler: async (ctx) => Promise.all((await ctx.db.query("testimonials").collect()).map(item => withImage(ctx, item))),
});

export const getFeatured = query({
    args: {},
    handler: async (ctx) => Promise.all((await ctx.db.query("testimonials").withIndex("by_featured", q => q.eq("featured", true)).collect()).map(item => withImage(ctx, item))),
});

// Create a testimonial
export const create = mutation({
    args: {
        name: v.string(),
        role: v.string(),
        location: v.string(),
        content: v.string(),
        imageStorageId: v.id("_storage"),
        rating: v.number(),
        category: v.string(),
        featured: v.boolean(),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        await assertUploadedImage(ctx, args.imageStorageId);
        await requirePublicMediaReference(ctx, args.imageStorageId);
        return await ctx.db.insert("testimonials", { ...args, imageUrl: "" });
    },
});

// Update a testimonial
export const update = mutation({
    args: {
        id: v.id("testimonials"),
        name: v.optional(v.string()),
        role: v.optional(v.string()),
        location: v.optional(v.string()),
        content: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        imageStorageId: v.optional(v.id("_storage")),
        rating: v.optional(v.number()),
        category: v.optional(v.string()),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const { id, ...rest } = args;
        const previous = await ctx.db.get(id);
        await requirePublicMediaReference(ctx, rest.imageStorageId, previous?.imageStorageId);
        if (rest.imageStorageId) await assertUploadedImage(ctx, rest.imageStorageId);
        if (rest.imageUrl && !rest.imageStorageId) throw new Error("Upload a new testimonial image instead of entering an image URL.");
        await ctx.db.patch(id, rest.imageStorageId ? { ...rest, imageUrl: "" } : rest);
    },
});

// Remove a testimonial
export const remove = mutation({
    args: { id: v.id("testimonials") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);

        await ctx.db.delete(args.id);
    },
});

// Retained for older admin clients. Never recreate sample people or dead image paths.
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);
        return { created: 0, message: "Sample testimonials are disabled. Add verified testimonials through the admin editor." };
    },
});

// One-time, idempotent cleanup of seed paths whose files were never bundled.
export const clearBrokenSeedImageReferences = internalMutation({
    args: {},
    handler: async (ctx) => {
        let cleared = 0;
        for (const item of await ctx.db.query("testimonials").collect()) {
            if (!item.imageStorageId && /^\/lovable-uploads\/testimonial-[1-6]\.jpg$/i.test(item.imageUrl)) {
                await ctx.db.patch(item._id, { imageUrl: "" });
                cleared++;
            }
        }
        return { cleared };
    },
});
