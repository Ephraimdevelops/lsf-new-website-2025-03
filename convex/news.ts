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

// Seed initial news
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("news").collect();
        if (existing.length > 0) return;

        const newsItems = [
            {
                title: 'LSF Launches Digital Legal Aid Platform',
                excerpt: 'Revolutionary platform connecting rural communities with legal professionals across Tanzania.',
                content: '<p>Full content of the article...</p>',
                category: 'Innovation',
                image: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
                date: '2024-01-15',
                featured: true,
                author: 'LSF Communications',
                slug: 'lsf-launches-digital-legal-aid-platform'
            },
            {
                title: 'Women\'s Land Rights Initiative Reaches 10K+',
                excerpt: 'Empowering women across 15 regions with essential legal knowledge and support.',
                content: '<p>Full content of the article...</p>',
                category: 'Gender Justice',
                image: '/lovable-uploads/placeholder.svg',
                date: '2024-01-12',
                featured: true,
                author: 'Jane Doe',
                slug: 'womens-land-rights-initiative'
            },
            {
                title: 'Climate Justice Program Expands Nationwide',
                excerpt: 'Protecting environmental rights across all coastal regions in Tanzania.',
                content: '<p>Full content of the article...</p>',
                category: 'Climate',
                image: '/lovable-uploads/placeholder.svg',
                date: '2024-01-10',
                featured: false,
                author: 'John Smith',
                slug: 'climate-justice-program-expands'
            },
            {
                title: '500+ Paralegals Graduate Training Program',
                excerpt: 'Expanding community legal support network across Tanzania.',
                content: '<p>Full content of the article...</p>',
                category: 'Training',
                image: '/lovable-uploads/placeholder.svg',
                date: '2024-01-08',
                featured: true,
                author: 'LSF Training Team',
                slug: '500-paralegals-graduate'
            },
            {
                title: 'Digital Transformation Reaches Rural Areas',
                excerpt: 'Bridging the digital divide in legal services for 100+ communities.',
                content: '<p>Full content of the article...</p>',
                category: 'Technology',
                image: '/lovable-uploads/placeholder.svg',
                date: '2024-01-05',
                featured: false,
                author: 'Tech Team',
                slug: 'digital-transformation-rural-areas'
            },
            {
                title: 'Government Partnership Strengthens Legal Aid',
                excerpt: 'New collaboration reaching 50,000+ people in Q1 2024.',
                content: '<p>Full content of the article...</p>',
                category: 'Partnership',
                image: '/lovable-uploads/placeholder.svg',
                date: '2024-01-03',
                featured: true,
                author: 'Policy Team',
                slug: 'government-partnership-strengthens-legal-aid'
            }
        ];

        for (const item of newsItems) {
            await ctx.db.insert("news", item);
        }
    },
});
