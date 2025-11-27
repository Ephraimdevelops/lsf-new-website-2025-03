import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all news
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("news").order("desc").collect();
    },
});

// Get featured news
export const getFeatured = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("news")
            .withIndex("by_featured", (q) => q.eq("featured", true))
            .order("desc")
            .collect();
    },
});

// Get single news by ID
export const getById = query({
    args: { id: v.id("news") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get single news by ID or Slug
export const getBySlugOrId = query({
    args: { identifier: v.string() },
    handler: async (ctx, args) => {
        const { identifier } = args;

        // Try as ID first
        const id = ctx.db.normalizeId("news", identifier);
        if (id) {
            const item = await ctx.db.get(id);
            if (item) return item;
        }

        // Try as slug
        const item = await ctx.db
            .query("news")
            .withIndex("by_slug", (q) => q.eq("slug", identifier))
            .unique();

        return item;
    },
});

// Create news (Admin only)
export const create = mutation({
    args: {
        title: v.string(),
        excerpt: v.string(),
        content: v.string(),
        category: v.string(),
        image: v.string(),
        date: v.string(),
        featured: v.boolean(),
        author: v.optional(v.string()),
        seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()),
        keywords: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        // In a real app, check for "admin" role here
        // const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
        // if (user?.role !== "admin") throw new Error("Unauthorized");

        return await ctx.db.insert("news", args);
    },
});

// Update news (Admin only)
export const update = mutation({
    args: {
        id: v.id("news"),
        title: v.string(),
        excerpt: v.string(),
        content: v.string(),
        category: v.string(),
        image: v.string(),
        date: v.string(),
        featured: v.boolean(),
        author: v.optional(v.string()),
        seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()),
        keywords: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

// Delete news (Admin only)
export const remove = mutation({
    args: { id: v.id("news") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    },
});
