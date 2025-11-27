import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all stories
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("success_stories").order("desc").collect();
    },
});

// Get single story
export const getById = query({
    args: { id: v.id("success_stories") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create story
export const create = mutation({
    args: {
        title: v.string(),
        story: v.string(),
        personName: v.string(),
        location: v.string(),
        imageUrl: v.string(),
        impactMetrics: v.optional(v.any()),
        programId: v.optional(v.string()),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db.insert("success_stories", args);
    },
});

// Update story
export const update = mutation({
    args: {
        id: v.id("success_stories"),
        title: v.string(),
        story: v.string(),
        personName: v.string(),
        location: v.string(),
        imageUrl: v.string(),
        impactMetrics: v.optional(v.any()),
        programId: v.optional(v.string()),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

// Delete story
export const remove = mutation({
    args: { id: v.id("success_stories") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    },
});
