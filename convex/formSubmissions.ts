import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ==========================================
// RATE LIMITING & SECURITY HELPERS
// ==========================================

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 3; // 3 submissions per hour

// Helper: Check Rate Limit
async function checkRateLimit(
    ctx: any,
    identifier: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();
    const existing = await ctx.db
        .query("rate_limits")
        .withIndex("by_identifier", (q: any) => q.eq("identifier", identifier))
        .first();

    if (!existing) {
        await ctx.db.insert("rate_limits", { identifier, count: 1, windowStart: now });
        return { allowed: true, remaining: MAX_SUBMISSIONS_PER_WINDOW - 1, resetAt: now + RATE_LIMIT_WINDOW };
    }

    if (now - existing.windowStart > RATE_LIMIT_WINDOW) {
        await ctx.db.patch(existing._id, { count: 1, windowStart: now });
        return { allowed: true, remaining: MAX_SUBMISSIONS_PER_WINDOW - 1, resetAt: now + RATE_LIMIT_WINDOW };
    }

    if (existing.count >= MAX_SUBMISSIONS_PER_WINDOW) {
        return { allowed: false, remaining: 0, resetAt: existing.windowStart + RATE_LIMIT_WINDOW };
    }

    await ctx.db.patch(existing._id, { count: existing.count + 1 });
    return { allowed: true, remaining: MAX_SUBMISSIONS_PER_WINDOW - existing.count - 1, resetAt: existing.windowStart + RATE_LIMIT_WINDOW };
}

// Helper: Validate Honeypot
function validateHoneypot(honeypotValue: string | undefined): boolean {
    return !honeypotValue || honeypotValue.trim() === "";
}

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
        // Security fields
        clientIdentifier: v.optional(v.string()),
        roleTitle: v.optional(v.string()), // Honeypot
    },
    handler: async (ctx, args) => {
        // 1. Honeypot Check
        if (!validateHoneypot(args.roleTitle)) {
            console.log("[SECURITY] Contact form honeypot triggered");
            return { success: true, id: "rejected" };
        }

        // 2. Rate Limit Check
        const identifier = args.clientIdentifier || "anonymous_contact";
        const rateCheck = await checkRateLimit(ctx, `contact:${identifier}`);
        if (!rateCheck.allowed) {
            throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateCheck.resetAt - Date.now()) / 60000)} minutes.`);
        }

        const id = await ctx.db.insert("contact_submissions", {
            name: args.name,
            email: args.email,
            phone: args.phone,
            category: args.category,
            subject: args.subject,
            message: args.message,
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
        // Security fields added for consistency, though currently handled by whistleblower.ts
        clientIdentifier: v.optional(v.string()),
        roleTitle: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Honeypot check (redundant if using whistleblower.ts but good for safety)
        if (args.roleTitle && !validateHoneypot(args.roleTitle)) return { success: true, id: "rejected" };

        const id = await ctx.db.insert("whistleblower_reports", {
            reportType: args.reportType,
            description: args.description,
            evidenceUrls: args.evidenceUrls,
            contactEmail: args.contactEmail,
            contactPhone: args.contactPhone,
            isAnonymous: args.isAnonymous,
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
        // SECURITY: Only admin/staff can read reports (RLS)
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized: You must be logged in");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || !["admin", "staff"].includes(user.role)) {
            throw new Error("Forbidden: Insufficient privileges. Admin or Staff role required.");
        }

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
        // Security fields
        clientIdentifier: v.optional(v.string()),
        roleTitle: v.optional(v.string()), // Honeypot
    },
    handler: async (ctx, args) => {
        // 1. Honeypot Check
        if (!validateHoneypot(args.roleTitle)) {
            console.log("[SECURITY] Paralegal app honeypot triggered");
            return { success: true, id: "rejected" };
        }

        // 2. Rate Limit Check
        const identifier = args.clientIdentifier || "anonymous_paralegal";
        const rateCheck = await checkRateLimit(ctx, `paralegal:${identifier}`);
        if (!rateCheck.allowed) {
            throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateCheck.resetAt - Date.now()) / 60000)} minutes.`);
        }

        // Check for duplicate applications
        const existing = await ctx.db
            .query("paralegal_applications")
            .filter((q) => q.eq(q.field("email"), args.email.toLowerCase()))
            .first();

        if (existing && existing.status === "pending") {
            return { success: false, message: "An application with this email is already pending." };
        }

        const id = await ctx.db.insert("paralegal_applications", {
            fullName: args.fullName,
            email: args.email.toLowerCase(),
            phone: args.phone,
            region: args.region,
            district: args.district,
            ward: args.ward,
            education: args.education,
            experience: args.experience,
            motivation: args.motivation,
            languages: args.languages,
            resumeUrl: args.resumeUrl,
            idDocumentUrl: args.idDocumentUrl,
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
        // SECURITY: Only admin/staff can view applications (RLS)
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized: You must be logged in");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user || !["admin", "staff"].includes(user.role)) {
            throw new Error("Forbidden: Insufficient privileges. Admin or Staff role required.");
        }

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
