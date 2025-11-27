import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all publications
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("publications").order("desc").collect();
    },
});

// Get single publication
export const getById = query({
    args: { id: v.id("publications") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get featured publications
export const getFeatured = query({
    args: {},
    handler: async (ctx) => {
        // We don't have a specific index for featured yet, so we'll filter in memory or add index later.
        // Ideally add .index("by_featured", ["featured"]) to schema.
        // For now, let's just filter.
        const all = await ctx.db.query("publications").order("desc").collect();
        return all.filter(p => p.featured === true);
    },
});

// Create publication
export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        category: v.string(),
        type: v.string(),
        coverImageUrl: v.string(),
        pdfUrl: v.string(),
        publishedDate: v.string(),
        authors: v.optional(v.array(v.string())),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db.insert("publications", args);
    },
});

// Update publication
export const update = mutation({
    args: {
        id: v.id("publications"),
        title: v.string(),
        description: v.string(),
        category: v.string(),
        type: v.string(),
        coverImageUrl: v.string(),
        pdfUrl: v.string(),
        publishedDate: v.string(),
        authors: v.optional(v.array(v.string())),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

// Delete publication
export const remove = mutation({
    args: { id: v.id("publications") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    },
});
