import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { requireGuideResubmission } from "./lib/guideLifecycle";
import { guideImportKey, requireEditableGuide, validateGuideContent, type GuideContent } from "./lib/legalGuideContent";
import { searchCurrentGuides } from "./lib/guideSearch";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";
import { requirePublicMediaReference } from "./lib/managedUploads";
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

        for (const value of [args.coverImageStorageId, args.coverImageUrl, args.pdfStorageId, args.pdfUrl]) await requirePublicMediaReference(ctx, value);
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

        await requirePublicMediaReference(ctx, args.coverImageUrl);
        await requirePublicMediaReference(ctx, args.pdfUrl);
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
        const previous = await ctx.db.get(id);
        for (const key of ["coverImageStorageId", "coverImageUrl", "pdfStorageId", "pdfUrl"] as const) await requirePublicMediaReference(ctx, fields[key], previous?.[key]);
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

function requireCurrentGuide(guide: {editVersion?: number} | null, expectedEditVersion?: number) {
    if (guide && expectedEditVersion !== undefined && expectedEditVersion !== (guide.editVersion ?? 0)) {
        throw new Error("This guide changed. Reload it and check the current text before saving.");
    }
}

// Governed practical guides for the mobile Learn journey. Drafts cannot appear in the public list.
const guideInput = {
    titleSw: v.string(), titleEn: v.string(), summarySw: v.string(), summaryEn: v.string(),
    stepsSw: v.array(v.string()), stepsEn: v.array(v.string()), category: v.string(),
    jurisdiction: v.union(v.literal("tanzania_mainland"), v.literal("zanzibar"), v.literal("national")),
    sourceTitle: v.string(), sourceUrl: v.string(), publisher: v.string(), reviewDueAt: v.number(),
    coverImageUrl: v.optional(v.string()), coverImageAltSw: v.optional(v.string()), coverImageAltEn: v.optional(v.string()),
};

type GuideSubmission = GuideContent & { importKey?: string; replacesGuideId?: Id<"legal_guides">; resubmitsGuideId?: Id<"legal_guides"> };
async function submitGuide(ctx: MutationCtx, args: GuideSubmission, userId: Id<"users">) {
        const media = validateGuideContent(args);
        if (args.importKey !== undefined) {
            if (args.replacesGuideId || args.resubmitsGuideId || args.importKey !== guideImportKey(args)) throw new Error("Invalid guide import reference.");
            const existing = await ctx.db.query("legal_guides").withIndex("by_import_key", q => q.eq("importKey", args.importKey)).first();
            if (existing) return { id: existing._id, created: false };
        }
        const prior = args.replacesGuideId ? await ctx.db.get(args.replacesGuideId) : null;
        if (args.replacesGuideId && (!prior || prior.status !== "approved")) throw new Error("Only an approved guide can be replaced.");
        const rejectedDraft = args.resubmitsGuideId ? await ctx.db.get(args.resubmitsGuideId) : null;
        if (args.resubmitsGuideId) requireGuideResubmission(rejectedDraft, userId, args.replacesGuideId);
        if (rejectedDraft) {
            const pendingResubmission = await ctx.db.query("legal_guides")
                .withIndex("by_resubmits_status", (q) => q.eq("resubmitsGuideId", rejectedDraft._id).eq("status", "pending")).first();
            if (pendingResubmission) throw new Error("This rejected guide already has a resubmission awaiting review.");
        }
        if (prior) {
            const pending = await ctx.db.query("legal_guides")
                .withIndex("by_replaces_status", (q) => q.eq("replacesGuideId", prior._id).eq("status", "pending"))
                .first();
            if (pending) throw new Error("This guide already has a revision awaiting review.");
        }
        const now = Date.now();
        const id = await ctx.db.insert("legal_guides", {
            ...args, titleSw: args.titleSw.trim(), titleEn: args.titleEn.trim(), summarySw: args.summarySw.trim(), summaryEn: args.summaryEn.trim(),
            stepsSw: args.stepsSw.map((step) => step.trim()), stepsEn: args.stepsEn.map((step) => step.trim()),
            ...media, sourceTitle: args.sourceTitle.trim(), publisher: args.publisher.trim(), category: args.category.trim(),
            editVersion: 1, version: rejectedDraft ? rejectedDraft.version : prior ? prior.version + 1 : 1, replacesGuideId: prior?._id, resubmitsGuideId: rejectedDraft?._id, status: "pending", submittedBy: userId, submittedAt: now,
        });
        await ctx.db.insert("audit_logs", { action: "content.legal_guide_submitted", entityType: "legal_guide", entityId: id, userId: userId, timestamp: now, metadata: { category: args.category, jurisdiction: args.jurisdiction, replacesGuideId: prior?._id, resubmitsGuideId: rejectedDraft?._id } });
        return { id, created: true };
}
export const submitLegalGuide = mutation({
    args: { ...guideInput, importKey: v.optional(v.string()), replacesGuideId: v.optional(v.id("legal_guides")), resubmitsGuideId: v.optional(v.id("legal_guides")) },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["content_editor", "admin"]);
        return (await submitGuide(ctx, args, user._id)).id;
    },
});
export const importPreparedLegalGuide = mutation({
    args: guideInput,
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["content_editor", "admin"]);
        return submitGuide(ctx, { ...args, importKey: guideImportKey(args) }, user._id);
    },
});

export const updatePendingLegalGuide = mutation({
    args: { id: v.id("legal_guides"), expectedEditVersion: v.optional(v.number()), ...guideInput },
    handler: async (ctx, { id, expectedEditVersion, ...args }) => {
        const { user } = await requireAnyRole(ctx, ["content_editor", "admin"]);
        const guide = await ctx.db.get(id);
        requireEditableGuide(guide, user._id);
        requireCurrentGuide(guide, expectedEditVersion);
        const media = validateGuideContent(args);
        await ctx.db.patch(id, {
            ...args, ...media, editVersion: (guide!.editVersion ?? 0) + 1, titleSw: args.titleSw.trim(), titleEn: args.titleEn.trim(),
            summarySw: args.summarySw.trim(), summaryEn: args.summaryEn.trim(),
            stepsSw: args.stepsSw.map(step => step.trim()), stepsEn: args.stepsEn.map(step => step.trim()),
            category: args.category.trim(), sourceTitle: args.sourceTitle.trim(), publisher: args.publisher.trim(),
        });
        await ctx.db.insert("audit_logs", { action: "content.legal_guide_pending_updated", entityType: "legal_guide", entityId: id, userId: user._id, timestamp: Date.now(), metadata: { version: guide!.version, sourceUrl: media.sourceUrl } });
        return { success: true };
    },
});

export const listLegalGuidesForReview = query({
    args: {},
    handler: async (ctx) => {
        const { user } = await requireAnyRole(ctx, ["content_editor", "admin"]);
        const roles = await ctx.db.query("role_assignments").withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", "active")).collect();
        const isAdmin = user.role === "admin" || roles.some((item) => item.role === "admin");
        const guides = await ctx.db.query("legal_guides").order("desc").collect();
        return isAdmin ? guides : guides.filter((guide) => guide.submittedBy === user._id);
    },
});

export const listLegalGuidesPage = query({
    args: { paginationOpts: paginationOptsValidator, status: v.union(v.literal("pending"), v.literal("approved"), v.literal("due"), v.literal("history")) },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["content_editor", "admin"]);
        const roles = await ctx.db.query("role_assignments").withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", "active")).collect();
        const isAdmin = user.role === "admin" || roles.some((item) => item.role === "admin");
        if (args.status === "due") {
            const cutoff = Date.now() + 30 * 24 * 60 * 60 * 1000;
            const due = isAdmin
                ? ctx.db.query("legal_guides").withIndex("by_status_review_due", (q) => q.eq("status", "approved").lte("reviewDueAt", cutoff))
                : ctx.db.query("legal_guides").withIndex("by_submitter_status_review_due", (q) => q.eq("submittedBy", user._id).eq("status", "approved").lte("reviewDueAt", cutoff));
            return due.order("asc").paginate(args.paginationOpts);
        }
        if (isAdmin && args.status !== "history") {
            const status = args.status;
            return ctx.db.query("legal_guides").withIndex("by_status", (q) => q.eq("status", status)).order("desc").paginate(args.paginationOpts);
        }
        const base = isAdmin
            ? ctx.db.query("legal_guides")
            : ctx.db.query("legal_guides").withIndex("by_submitted_by", (q) => q.eq("submittedBy", user._id));
        return base.filter((q) => args.status === "history"
            ? q.or(q.eq(q.field("status"), "rejected"), q.eq(q.field("status"), "retired"))
            : q.eq(q.field("status"), args.status)).order("desc").paginate(args.paginationOpts);
    },
});

export const getLegalGuideForReview = query({
    args: { id: v.id("legal_guides") },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["content_editor", "admin"]);
        const roles = await ctx.db.query("role_assignments").withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", "active")).collect();
        const isAdmin = user.role === "admin" || roles.some((item) => item.role === "admin");
        const guide = await ctx.db.get(args.id);
        if (!guide || (!isAdmin && guide.submittedBy !== user._id)) return null;
        const previous = guide.replacesGuideId ? await ctx.db.get(guide.replacesGuideId) : null;
        const rejectedDraft = guide.resubmitsGuideId ? await ctx.db.get(guide.resubmitsGuideId) : null;
        return { guide, previous, rejectedDraft };
    },
});

export const reviewLegalGuide = mutation({
    args: { id: v.id("legal_guides"), decision: v.union(v.literal("approved"), v.literal("rejected")), note: v.string(), expectedEditVersion: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]);
        const guide = await ctx.db.get(args.id);
        if (!guide) throw new Error("Guide not found.");
        requireCurrentGuide(guide, args.expectedEditVersion);
        if (guide.status !== "pending") throw new Error("Only pending guides can be reviewed.");
        if (guide.submittedBy === user._id) throw new Error("A different administrator must review this guide.");
        const note = args.note.trim();
        if (note.length < 10 || note.length > 2000) throw new Error("Record a 10–2000 character review reason.");
        if (args.decision === "approved" && guide.reviewDueAt <= Date.now()) throw new Error("The source review date has passed.");
        const now = Date.now();
        if (args.decision === "approved" && guide.replacesGuideId) {
            const prior = await ctx.db.get(guide.replacesGuideId);
            if (!prior || prior.status !== "approved") throw new Error("The previous version is no longer active; review this revision again.");
            await ctx.db.patch(prior._id, { status: "retired", editVersion: (prior.editVersion ?? 0) + 1, reviewNote: `Replaced by version ${guide.version}`, reviewedBy: user._id, reviewedAt: now });
        }
        await ctx.db.patch(args.id, { status: args.decision, editVersion: (guide.editVersion ?? 0) + 1, reviewNote: note, reviewedBy: user._id, reviewedAt: now });
        await ctx.db.insert("audit_logs", { action: `content.legal_guide_${args.decision}`, entityType: "legal_guide", entityId: args.id, userId: user._id, timestamp: now, metadata: { previousStatus: guide.status, sourceUrl: guide.sourceUrl } });
        return { success: true };
    },
});

export const listPublicLegalGuides = query({
    args: { refreshTick: v.optional(v.number()) },
    handler: async (ctx) => {
        const guides = await ctx.db.query("legal_guides").withIndex("by_status", (q) => q.eq("status", "approved")).collect();
        return guides.filter((guide) => guide.reviewDueAt > Date.now()).map((guide) => ({
            _id: guide._id, titleSw: guide.titleSw, titleEn: guide.titleEn, summarySw: guide.summarySw, summaryEn: guide.summaryEn,
            stepsSw: guide.stepsSw, stepsEn: guide.stepsEn, category: guide.category, jurisdiction: guide.jurisdiction,
            sourceTitle: guide.sourceTitle, sourceUrl: guide.sourceUrl, publisher: guide.publisher, reviewDueAt: guide.reviewDueAt, version: guide.version,
            coverImageUrl: guide.coverImageUrl, coverImageAltSw: guide.coverImageAltSw, coverImageAltEn: guide.coverImageAltEn,
        }));
    },
});

export const retireLegalGuide = mutation({
    args: { id: v.id("legal_guides"), reason: v.string(), expectedEditVersion: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]);
        const guide = await ctx.db.get(args.id);
        if (!guide || guide.status !== "approved") throw new Error("Only an approved guide can be retired.");
        requireCurrentGuide(guide, args.expectedEditVersion);
        const reason = args.reason.trim();
        if (reason.length < 10 || reason.length > 2000) throw new Error("Record a 10–2000 character retirement reason.");
        const now = Date.now();
        await ctx.db.patch(args.id, { status: "retired", editVersion: (guide.editVersion ?? 0) + 1, reviewNote: reason, reviewedBy: user._id, reviewedAt: now });
        await ctx.db.insert("audit_logs", { action: "content.legal_guide_retired", entityType: "legal_guide", entityId: args.id, userId: user._id, timestamp: now, metadata: { reason, version: guide.version } });
        return { success: true };
    },
});

export const searchPublicLegalGuides = query({
    args: { search: v.optional(v.string()), jurisdiction: v.optional(v.union(v.literal("national"), v.literal("tanzania_mainland"), v.literal("zanzibar"))) },
    handler: async (ctx, args) => {
        if ((args.search?.length ?? 0) > 300) throw new Error("Use a shorter guide search.");
        const records = await ctx.db.query("legal_guides").withIndex("by_status", q => q.eq("status", "approved")).collect();
        return searchCurrentGuides(records, args.search, args.jurisdiction).map(guide => ({
            _id: guide._id, titleEn: guide.titleEn, titleSw: guide.titleSw,
            summaryEn: guide.summaryEn, summarySw: guide.summarySw, stepsEn: guide.stepsEn, stepsSw: guide.stepsSw,
            category: guide.category, jurisdiction: guide.jurisdiction, sourceTitle: guide.sourceTitle,
            sourceUrl: guide.sourceUrl, publisher: guide.publisher, reviewDueAt: guide.reviewDueAt,
        }));
    },
});

// Recoverable removal keeps review and case references intact.
export const archiveLegalGuide = mutation({
    args: { id: v.id("legal_guides"), reason: v.string(), expectedEditVersion: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const { user, assignments } = await requireAnyRole(ctx, ["content_editor", "admin"]);
        const guide = await ctx.db.get(args.id);
        const admin = user.role === "admin" || assignments.some(role => role.role === "admin");
        if (!guide || (!admin && guide.submittedBy !== user._id)) throw new Error("Guide access denied.");
        requireCurrentGuide(guide, args.expectedEditVersion);
        if (guide.status === "approved" && !admin) throw new Error("An administrator must retire published guidance.");
        const reason = args.reason.trim();
        if (reason.length < 10 || reason.length > 2000) throw new Error("Record a 10–2000 character removal reason.");
        await ctx.db.patch(guide._id, { status: "retired", editVersion: (guide.editVersion ?? 0) + 1, reviewNote: reason });
        await ctx.db.insert("audit_logs", { action: "content.legal_guide_archived", entityType: "legal_guide", entityId: guide._id, userId: user._id, timestamp: Date.now(), metadata: { previousStatus: guide.status, reason } });
        return { success: true };
    },
});
