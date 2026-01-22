import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new hero story
 */
export const create = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        description: v.string(),
        image: v.optional(v.string()),
        date: v.number(),
        location: v.optional(v.string()),
        readTime: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const heroId = await ctx.db.insert("heros", {
            title: args.title,
            slug: args.slug,
            description: args.description,
            image: args.image,
            date: args.date,
            location: args.location || "Tanzania",
            readTime: args.readTime,
        });
        return heroId;
    },
});

/**
 * Get all hero stories
 */
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("heros").collect();
    },
});

/**
 * Get hero by ID
 */
export const getById = query({
    args: { id: v.id("heros") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

/**
 * Get hero by slug
 */
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("heros")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
    },
});

/**
 * Delete a hero story
 */
export const remove = mutation({
    args: { id: v.id("heros") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

/**
 * Update a hero story
 */
export const update = mutation({
    args: {
        id: v.id("heros"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        description: v.optional(v.string()),
        image: v.optional(v.string()),
        date: v.optional(v.number()),
        location: v.optional(v.string()),
        readTime: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== undefined)
        );
        await ctx.db.patch(id, filteredUpdates);
        return id;
    },
});
