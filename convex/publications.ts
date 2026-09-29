import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";
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
                    try {
                        const url = await ctx.storage.getUrl(item.coverImageStorageId as Id<"_storage">);
                        if (url) coverImageUrl = url;
                    } catch (e) { }
                }

                if (item.pdfUrl && !item.pdfUrl.startsWith('http')) {
                    try {
                        const url = await ctx.storage.getUrl(item.pdfUrl as Id<"_storage">);
                        if (url) pdfUrl = url;
                    } catch (e) { }
                }

                return { ...item, coverImageUrl, pdfUrl };
            })
        );
    },
});

// Get single publication
export const getById = query({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        const normalizedId = ctx.db.normalizeId("publications", args.id);
        if (!normalizedId) return null;

        const item = await ctx.db.get(normalizedId);
        if (!item) return null;

        let coverImageUrl = item.coverImageUrl;
        let pdfUrl = item.pdfUrl;

        if (item.coverImageStorageId) {
            try {
                const url = await ctx.storage.getUrl(item.coverImageStorageId as Id<"_storage">);
                if (url) coverImageUrl = url;
            } catch (e) { }
        }

        // Resolve PDF URL if it's a storage ID
        if (item.pdfStorageId) {
            try {
                const url = await ctx.storage.getUrl(item.pdfStorageId as Id<"_storage">);
                if (url) pdfUrl = url;
            } catch (e) { }
        } else if (item.pdfUrl && !item.pdfUrl.startsWith('http')) {
            try {
                const url = await ctx.storage.getUrl(item.pdfUrl as Id<"_storage">);
                if (url) pdfUrl = url;
            } catch (e) { }
        }

        return { ...item, coverImageUrl, pdfUrl };
    },
});

// Get featured publications
export const getFeatured = query({
    args: {},
    handler: async (ctx) => {
        // We don't have a specific index for featured yet, so we'll filter in memory or add index later.
        const all = await ctx.db.query("publications").order("desc").collect();
        const results = all.filter(p => p.featured === true);

        return await Promise.all(
            results.map(async (item) => {
                let coverImageUrl = item.coverImageUrl;
                let pdfUrl = item.pdfUrl;

                if (item.coverImageStorageId) {
                    const url = await ctx.storage.getUrl(item.coverImageStorageId);
                    if (url) coverImageUrl = url;
                }

                if (item.pdfUrl && !item.pdfUrl.startsWith('http')) {
                    try {
                        const url = await ctx.storage.getUrl(item.pdfUrl as Id<"_storage">);
                        if (url) pdfUrl = url;
                    } catch (e) {
                        // ignore
                    }
                }

                return { ...item, coverImageUrl, pdfUrl };
            })
        );
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
        await requireAnyRole(ctx, ["admin", "staff"]);

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
        await requireAnyRole(ctx, ["admin"]);

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
        await requireAnyRole(ctx, ["admin", "staff"]);

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

// Delete publication
export const remove = mutation({
    args: { id: v.id("publications") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);

        await ctx.db.delete(args.id);
    },
});

// Increment download count (Public - called on download click)
export const incrementDownloadCount = mutation({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        const normalizedId = ctx.db.normalizeId("publications", args.id);
        if (!normalizedId) throw new Error("Invalid ID format");

        const publication = await ctx.db.get(normalizedId);
        if (!publication) throw new Error("Publication not found");

        const currentCount = publication.downloadCount || 0;
        await ctx.db.patch(normalizedId, {
            downloadCount: currentCount + 1,
        });

        return { newCount: currentCount + 1 };
    },
});

// Seed initial publications
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

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

// Governed practical guides for the mobile Learn journey. Drafts cannot appear in the public list.
const guideInput = {
    titleSw: v.string(), titleEn: v.string(), summarySw: v.string(), summaryEn: v.string(),
    stepsSw: v.array(v.string()), stepsEn: v.array(v.string()), category: v.string(),
    jurisdiction: v.union(v.literal("tanzania_mainland"), v.literal("zanzibar"), v.literal("national")),
    sourceTitle: v.string(), sourceUrl: v.string(), publisher: v.string(), reviewDueAt: v.number(),
};

export const submitLegalGuide = mutation({
    args: guideInput,
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["content_editor", "admin"]);
        const fields = [args.titleSw, args.titleEn, args.summarySw, args.summaryEn, args.category, args.sourceTitle, args.publisher];
        if (fields.some((field) => field.trim().length < 3)) throw new Error("Complete both languages and source metadata.");
        if (args.stepsSw.length < 1 || args.stepsEn.length < 1 || args.stepsSw.length > 12 || args.stepsEn.length > 12) throw new Error("Provide 1–12 practical steps per language.");
        if ([...args.stepsSw, ...args.stepsEn].some((step) => step.trim().length < 8)) throw new Error("Each practical step must be at least 8 characters.");
        let source: URL;
        try { source = new URL(args.sourceUrl); } catch { throw new Error("Provide a valid source URL."); }
        if (source.protocol !== "https:" || !source.hostname.includes(".")) throw new Error("The source must have a public HTTPS URL.");
        if (args.reviewDueAt <= Date.now() || args.reviewDueAt > Date.now() + 3 * 365 * 24 * 60 * 60 * 1000) throw new Error("Choose a review date within three years.");
        const now = Date.now();
        const id = await ctx.db.insert("legal_guides", {
            ...args, titleSw: args.titleSw.trim(), titleEn: args.titleEn.trim(), summarySw: args.summarySw.trim(), summaryEn: args.summaryEn.trim(),
            stepsSw: args.stepsSw.map((step) => step.trim()), stepsEn: args.stepsEn.map((step) => step.trim()),
            sourceTitle: args.sourceTitle.trim(), sourceUrl: source.toString(), publisher: args.publisher.trim(), category: args.category.trim(),
            version: 1, status: "pending", submittedBy: user._id, submittedAt: now,
        });
        await ctx.db.insert("audit_logs", { action: "content.legal_guide_submitted", entityType: "legal_guide", entityId: id, userId: user._id, timestamp: now, metadata: { category: args.category, jurisdiction: args.jurisdiction } });
        return id;
    },
});

export const listLegalGuidesForReview = query({
    args: {},
    handler: async (ctx) => {
        const { user } = await requireAnyRole(ctx, ["content_editor", "admin"]);
        const roles = await ctx.db.query("role_assignments").withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", "active")).collect();
        const isAdmin = user.role === "admin" || roles.some((item) => item.role === "admin");
        const guides = await ctx.db.query("legal_guides").order("desc").take(100);
        return isAdmin ? guides : guides.filter((guide) => guide.submittedBy === user._id);
    },
});

export const reviewLegalGuide = mutation({
    args: { id: v.id("legal_guides"), decision: v.union(v.literal("approved"), v.literal("rejected")), note: v.string() },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]);
        const guide = await ctx.db.get(args.id);
        if (!guide) throw new Error("Guide not found.");
        if (guide.status !== "pending") throw new Error("Only pending guides can be reviewed.");
        if (guide.submittedBy === user._id) throw new Error("A different administrator must review this guide.");
        const note = args.note.trim();
        if (note.length < 10 || note.length > 2000) throw new Error("Record a 10–2000 character review reason.");
        if (args.decision === "approved" && guide.reviewDueAt <= Date.now()) throw new Error("The source review date has passed.");
        const now = Date.now();
        await ctx.db.patch(args.id, { status: args.decision, reviewNote: note, reviewedBy: user._id, reviewedAt: now });
        await ctx.db.insert("audit_logs", { action: `content.legal_guide_${args.decision}`, entityType: "legal_guide", entityId: args.id, userId: user._id, timestamp: now, metadata: { previousStatus: guide.status, sourceUrl: guide.sourceUrl } });
        return { success: true };
    },
});

export const listPublicLegalGuides = query({
    args: {},
    handler: async (ctx) => {
        const guides = await ctx.db.query("legal_guides").withIndex("by_status", (q) => q.eq("status", "approved")).collect();
        return guides.filter((guide) => guide.reviewDueAt > Date.now()).map((guide) => ({
            _id: guide._id, titleSw: guide.titleSw, titleEn: guide.titleEn, summarySw: guide.summarySw, summaryEn: guide.summaryEn,
            stepsSw: guide.stepsSw, stepsEn: guide.stepsEn, category: guide.category, jurisdiction: guide.jurisdiction,
            sourceTitle: guide.sourceTitle, sourceUrl: guide.sourceUrl, publisher: guide.publisher, reviewDueAt: guide.reviewDueAt, version: guide.version,
        }));
    },
});
