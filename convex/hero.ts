import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all slides
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("hero_slides").withIndex("by_order").collect();
    },
});

// Update slide order/content
export const update = mutation({
    args: {
        id: v.id("hero_slides"),
        title: v.string(),
        subtitle: v.optional(v.string()),
        description: v.string(),
        category: v.optional(v.string()),
        imageUrl: v.string(),
        ctaText: v.optional(v.string()),
        ctaLink: v.optional(v.string()),
        stat: v.optional(v.string()),
        statLabel: v.optional(v.string()),
        order: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

// Create slide
export const create = mutation({
    args: {
        title: v.string(),
        subtitle: v.optional(v.string()),
        description: v.string(),
        category: v.optional(v.string()),
        imageUrl: v.string(),
        ctaText: v.optional(v.string()),
        ctaLink: v.optional(v.string()),
        stat: v.optional(v.string()),
        statLabel: v.optional(v.string()),
        order: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db.insert("hero_slides", args);
    },
});

// Delete slide
export const remove = mutation({
    args: { id: v.id("hero_slides") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    },
});
