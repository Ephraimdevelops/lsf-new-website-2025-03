import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all programs
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("programs").collect();
    },
});

// Get program by slug
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("programs")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
    },
});

// Get program by ID
export const getById = query({
    args: { id: v.id("programs") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create program
export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        slug: v.string(),
        imageUrl: v.string(),
        objectives: v.optional(v.array(v.string())),
        impact: v.optional(v.string()),
        status: v.union(v.literal("active"), v.literal("completed")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db.insert("programs", args);
    },
});

// Update program
export const update = mutation({
    args: {
        id: v.id("programs"),
        title: v.string(),
        description: v.string(),
        slug: v.string(),
        imageUrl: v.string(),
        objectives: v.optional(v.array(v.string())),
        impact: v.optional(v.string()),
        status: v.union(v.literal("active"), v.literal("completed")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

// Delete program
export const remove = mutation({
    args: { id: v.id("programs") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    },
});
