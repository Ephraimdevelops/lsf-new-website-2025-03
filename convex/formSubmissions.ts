import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ==========================================
// CONTACT FORM SUBMISSIONS
// ==========================================

export const submitContact = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        category: v.string(),
        subject: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("contact_submissions", {
            ...args,
            submittedAt: Date.now(),
            status: "new",
        });
        return { success: true, id };
    },
});

export const listContactSubmissions = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.status) {
            return await ctx.db
                .query("contact_submissions")
                .withIndex("by_status", (q) => q.eq("status", args.status as "new" | "read" | "replied" | "archived"))
                .order("desc")
                .collect();
        }
        return await ctx.db.query("contact_submissions").order("desc").collect();
    },
});

export const updateContactStatus = mutation({
    args: {
        id: v.id("contact_submissions"),
        status: v.union(v.literal("new"), v.literal("read"), v.literal("replied"), v.literal("archived")),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const updates: Record<string, unknown> = { status: args.status };
        if (args.notes) updates.notes = args.notes;
        if (args.status === "replied") updates.repliedAt = Date.now();

        await ctx.db.patch(args.id, updates);
        return { success: true };
    },
});

export const deleteContact = mutation({
    args: { id: v.id("contact_submissions") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    },
});

// ==========================================
// WHISTLEBLOWER REPORTS
// ==========================================

export const submitWhistleblowerReport = mutation({
    args: {
        reportType: v.string(),
        description: v.string(),
        evidenceUrls: v.optional(v.array(v.string())),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        isAnonymous: v.boolean(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("whistleblower_reports", {
            ...args,
            submittedAt: Date.now(),
            status: "new",
            priority: "medium",
        });
        return { success: true, id };
    },
});

export const listWhistleblowerReports = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.status) {
            return await ctx.db
                .query("whistleblower_reports")
                .withIndex("by_status", (q) => q.eq("status", args.status as "new" | "investigating" | "resolved" | "dismissed"))
                .order("desc")
                .collect();
        }
        return await ctx.db.query("whistleblower_reports").order("desc").collect();
    },
});

export const updateWhistleblowerReport = mutation({
    args: {
        id: v.id("whistleblower_reports"),
        status: v.optional(v.union(v.literal("new"), v.literal("investigating"), v.literal("resolved"), v.literal("dismissed"))),
        priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical"))),
        assignedTo: v.optional(v.string()),
        resolution: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        if (updates.status === "resolved") {
            (updates as Record<string, unknown>).resolvedAt = Date.now();
        }
        await ctx.db.patch(id, updates);
        return { success: true };
    },
});

// ==========================================
// PARALEGAL APPLICATIONS
// ==========================================

export const submitParalegalApplication = mutation({
    args: {
        fullName: v.string(),
        email: v.string(),
        phone: v.string(),
        region: v.string(),
        district: v.string(),
        ward: v.optional(v.string()),
        education: v.string(),
        experience: v.string(),
        motivation: v.string(),
        languages: v.optional(v.array(v.string())),
        resumeUrl: v.optional(v.string()),
        idDocumentUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check for duplicate applications
        const existing = await ctx.db
            .query("paralegal_applications")
            .filter((q) => q.eq(q.field("email"), args.email.toLowerCase()))
            .first();

        if (existing && existing.status === "pending") {
            return { success: false, message: "An application with this email is already pending." };
        }

        const id = await ctx.db.insert("paralegal_applications", {
            ...args,
            email: args.email.toLowerCase(),
            submittedAt: Date.now(),
            status: "pending",
        });

        return { success: true, id };
    },
});

export const listParalegalApplications = query({
    args: {
        status: v.optional(v.string()),
        region: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let results = await ctx.db.query("paralegal_applications").order("desc").collect();

        if (args.status) {
            results = results.filter((app) => app.status === args.status);
        }
        if (args.region) {
            results = results.filter((app) => app.region === args.region);
        }

        return results;
    },
});

export const reviewParalegalApplication = mutation({
    args: {
        id: v.id("paralegal_applications"),
        status: v.union(v.literal("pending"), v.literal("under_review"), v.literal("approved"), v.literal("rejected")),
        reviewNotes: v.optional(v.string()),
        reviewedBy: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, {
            ...updates,
            reviewedAt: Date.now(),
        });
        return { success: true };
    },
});

export const getParalegalApplicationStats = query({
    handler: async (ctx) => {
        const all = await ctx.db.query("paralegal_applications").collect();

        return {
            total: all.length,
            pending: all.filter((a) => a.status === "pending").length,
            underReview: all.filter((a) => a.status === "under_review").length,
            approved: all.filter((a) => a.status === "approved").length,
            rejected: all.filter((a) => a.status === "rejected").length,
        };
    },
});
