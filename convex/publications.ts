import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all publications
// Get all publications with optional search and filter
export const get = query({
    args: {
        search: v.optional(v.string()),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let results;

        if (args.search) {
            results = await ctx.db
                .query("publications")
                .withSearchIndex("search_title", (q) =>
                    args.category
                        ? q.search("title", args.search!).eq("category", args.category)
                        : q.search("title", args.search!)
                )
                .collect();
        } else if (args.category) {
            results = await ctx.db
                .query("publications")
                .withIndex("by_category", (q) => q.eq("category", args.category!))
                .order("desc")
                .collect();
        } else {
            results = await ctx.db.query("publications").order("desc").collect();
        }

        return await Promise.all(
            results.map(async (item) => {
                let coverImageUrl = item.coverImageUrl;
                let pdfUrl = item.pdfUrl;

                if (item.coverImageStorageId) {
                    const url = await ctx.storage.getUrl(item.coverImageStorageId);
                    if (url) coverImageUrl = url;
                }

                // Resolve PDF URL if it's a storage ID (heuristic: lacks http prefix and looks like ID)
                // Or if we had a pdfStorageId field (which we don't officially in schema, but might have added)
                // The form saves ID into 'pdfUrl'.
                if (item.pdfUrl && !item.pdfUrl.startsWith('http')) {
                    try {
                        const url = await ctx.storage.getUrl(item.pdfUrl as Id<"_storage">);
                        if (url) pdfUrl = url;
                    } catch (e) {
                        // ignore invalid ID
                    }
                }

                return { ...item, coverImageUrl, pdfUrl };
            })
        );
    },
});

// Get single publication
export const getById = query({
    args: { id: v.id("publications") },
    handler: async (ctx, args) => {
        const item = await ctx.db.get(args.id);
        if (!item) return null;

        let coverImageUrl = item.coverImageUrl;
        let pdfUrl = item.pdfUrl;

        if (item.coverImageStorageId) {
            const url = await ctx.storage.getUrl(item.coverImageStorageId);
            if (url) coverImageUrl = url;
        }

        // Resolve PDF URL if it's a storage ID
        if (item.pdfStorageId) {
            const url = await ctx.storage.getUrl(item.pdfStorageId);
            if (url) pdfUrl = url;
        } else if (item.pdfUrl && !item.pdfUrl.startsWith('http')) {
            try {
                // Legacy or direct ID usage fallback
                const url = await ctx.storage.getUrl(item.pdfUrl as Id<"_storage">);
                if (url) pdfUrl = url;
            } catch (e) {
                // ignore
            }
        }

        return { ...item, coverImageUrl, pdfUrl };
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
        coverImageUrl: v.optional(v.string()),
        coverImageStorageId: v.optional(v.string()),
        pdfUrl: v.optional(v.string()),
        pdfStorageId: v.optional(v.string()),
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

export const createForMigration = mutation({
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
        // Check for existing publication by title
        const existing = await ctx.db
            .query("publications")
            .filter((q) => q.eq(q.field("title"), args.title))
            .first();

        if (existing) {
            return existing._id;
        }

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
        coverImageUrl: v.optional(v.string()),
        coverImageStorageId: v.optional(v.string()),
        pdfUrl: v.optional(v.string()),
        pdfStorageId: v.optional(v.string()),
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

// Increment download count (Public - called on download click)
export const incrementDownloadCount = mutation({
    args: { id: v.id("publications") },
    handler: async (ctx, args) => {
        const publication = await ctx.db.get(args.id);
        if (!publication) throw new Error("Publication not found");

        const currentCount = publication.downloadCount || 0;
        await ctx.db.patch(args.id, {
            downloadCount: currentCount + 1,
        });

        return { newCount: currentCount + 1 };
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
