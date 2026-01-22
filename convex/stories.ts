import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all stories
// Get all stories
export const get = query({
    args: {},
    handler: async (ctx) => {
        const results = await ctx.db.query("success_stories").order("desc").collect();

        return await Promise.all(
            results.map(async (item) => {
                let imageUrl = item.imageUrl;
                if (item.storageId) {
                    const url = await ctx.storage.getUrl(item.storageId);
                    if (url) imageUrl = url;
                }
                return { ...item, imageUrl };
            })
        );
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
        quote: v.optional(v.string()),
        personName: v.string(),
        location: v.string(),
        imageUrl: v.optional(v.string()),
        storageId: v.optional(v.string()),
        readTime: v.optional(v.number()),
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

// Create story for migration (no auth check)
export const createForMigration = mutation({
    args: {
        title: v.string(),
        story: v.string(),
        quote: v.optional(v.string()),
        personName: v.string(),
        location: v.string(),
        imageUrl: v.string(),
        readTime: v.optional(v.number()),
        impactMetrics: v.optional(v.any()),
        programId: v.optional(v.string()),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        // Check for existing story by title to prevent duplicates
        const existing = await ctx.db
            .query("success_stories")
            .filter((q) => q.eq(q.field("title"), args.title))
            .first();

        if (existing) {
            return existing._id;
        }

        return await ctx.db.insert("success_stories", args);
    },
});

// Update story
export const update = mutation({
    args: {
        id: v.id("success_stories"),
        title: v.string(),
        story: v.string(),
        quote: v.optional(v.string()),
        personName: v.string(),
        location: v.string(),
        imageUrl: v.optional(v.string()),
        storageId: v.optional(v.string()),
        readTime: v.optional(v.number()),
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

// Seed initial stories
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("success_stories").collect();
        if (existing.length > 0) return;

        const stories = [
            {
                title: 'Reclaiming Land Rights in Kilolo',
                story: 'After years of dispute, Mama John finally secured her land title deed with the help of LSF paralegals...',
                personName: 'Mama John',
                location: 'Kilolo, Iringa',
                imageUrl: '/lovable-uploads/placeholder.svg',
                featured: true
            },
            {
                title: 'Justice for Child Support',
                story: 'A young mother in Mtwara received legal aid to ensure her children receive the support they deserve...',
                personName: 'Amina Juma',
                location: 'Mtwara',
                imageUrl: '/lovable-uploads/placeholder.svg',
                featured: true
            },
            {
                title: 'Resolving Community Water Dispute',
                story: 'Two villages in Dodoma found a peaceful resolution to a water source conflict through mediation...',
                personName: 'Village Elders',
                location: 'Dodoma',
                imageUrl: '/lovable-uploads/placeholder.svg',
                featured: false
            },
            {
                title: 'Empowering Women Entrepreneurs',
                story: 'A group of women in Arusha registered their cooperative and protected their business assets...',
                personName: 'Arusha Women Group',
                location: 'Arusha',
                imageUrl: '/lovable-uploads/placeholder.svg',
                featured: true
            },
            {
                title: 'Legal Education for Youth',
                story: 'Students in Dar es Salaam learned about their constitutional rights through our outreach program...',
                personName: 'City High School Students',
                location: 'Dar es Salaam',
                imageUrl: '/lovable-uploads/placeholder.svg',
                featured: false
            }
        ];

        for (const story of stories) {
            await ctx.db.insert("success_stories", story);
        }
    },
});
