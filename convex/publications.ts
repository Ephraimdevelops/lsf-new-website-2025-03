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

// Increment download count
export const incrementDownloadCount = mutation({
    args: { id: v.id("publications") },
    handler: async (ctx, args) => {
        const publication = await ctx.db.get(args.id);
        if (!publication) throw new Error("Publication not found");

    },
});

// Seed initial publications
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("publications").collect();
        if (existing.length > 0) return;

        const publications = [
            {
                title: 'Access to Justice in Rural Tanzania',
                description: 'Comprehensive study examining challenges and opportunities for justice in rural communities.',
                category: 'Research',
                type: 'report',
                coverImageUrl: '/lovable-uploads/placeholder.svg',
                pdfUrl: '#',
                publishedDate: '2024-01-20',
                authors: ['Dr. Sarah Johnson', 'LSF Research Team'],
                featured: true,
                downloadCount: 120
            },
            {
                title: 'Women\'s Legal Rights Handbook',
                description: 'Practical guide covering land ownership, inheritance, and protection from violence.',
                category: 'Guide',
                type: 'handbook',
                coverImageUrl: '/lovable-uploads/placeholder.svg',
                pdfUrl: '#',
                publishedDate: '2024-01-18',
                authors: ['Legal Aid Department'],
                featured: true,
                downloadCount: 350
            },
            {
                title: 'Climate Justice and Community Rights',
                description: 'Exploring intersection of climate change and legal rights for communities.',
                category: 'Policy',
                type: 'policy-brief',
                coverImageUrl: '/lovable-uploads/placeholder.svg',
                pdfUrl: '#',
                publishedDate: '2024-01-15',
                authors: ['Environmental Law Team'],
                featured: false,
                downloadCount: 85
            },
            {
                title: 'Digital Legal Services in Africa',
                description: 'Analysis of technology adoption in legal aid across African countries.',
                category: 'Research',
                type: 'report',
                coverImageUrl: '/lovable-uploads/placeholder.svg',
                pdfUrl: '#',
                publishedDate: '2024-01-12',
                authors: ['Tech Innovation Hub'],
                featured: true,
                downloadCount: 200
            },
            {
                title: 'Annual Impact Report 2023',
                description: 'Summary of LSF achievements, financial overview, and future goals.',
                category: 'Report',
                type: 'annual-report',
                coverImageUrl: '/lovable-uploads/placeholder.svg',
                pdfUrl: '#',
                publishedDate: '2024-01-01',
                authors: ['LSF Board'],
                featured: true,
                downloadCount: 500
            }
        ];

        for (const item of publications) {
            await ctx.db.insert("publications", item);
        }
    },
});
