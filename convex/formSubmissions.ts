import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAnyRole, requireAuthenticatedUser } from "./lib/auth";
import {
    activateParalegalRoleForUser,
    markParalegalProfileJoined,
} from "./lib/paralegalAccess";
import {
    escapeHtml,
    escapeHtmlWithLineBreaks,
    normalizeEmail,
    normalizeOptionalEmail,
    normalizeOptionalText,
    normalizeText,
} from "./lib/security";

// ==========================================
// RATE LIMITING & SECURITY HELPERS
// ==========================================

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_WINDOW = 3; // 3 submissions per hour

// Helper: Check Rate Limit
async function checkRateLimit(
    ctx: MutationCtx,
    identifier: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();
    const existing = await ctx.db
        .query("rate_limits")
        .withIndex("by_identifier", (q) => q.eq("identifier", identifier))
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

        const name = normalizeText(args.name, "Name", 120);
        const email = normalizeEmail(args.email);
        const phone = normalizeOptionalText(args.phone, "Phone", 40);
        const category = normalizeText(args.category, "Category", 80);
        const subject = normalizeText(args.subject, "Subject", 160);
        const message = normalizeText(args.message, "Message", 5000);

        const id = await ctx.db.insert("contact_submissions", {
            name,
            email,
            phone,
            category,
            subject,
            message,
            submittedAt: Date.now(),
            status: "new",
        });

        // Send email notification to info@lsftz.org
        try {
            await ctx.scheduler.runAfter(0, internal.resend.sendTransactionalEmail, {
                to: "info@lsftz.org",
                subject: `New Contact Submission: ${subject}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(phone || "N/A")}</p>
                    <p><strong>Category:</strong> ${escapeHtml(category)}</p>
                    <p><strong>Message:</strong></p>
                    <p>${escapeHtmlWithLineBreaks(message)}</p>
                `,
                replyTo: email
            });
        } catch (error) {
            console.error("Failed to schedule email notification", error);
        }

        return { success: true, id };
    },
});

export const listContactSubmissions = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

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
        await requireAnyRole(ctx, ["admin", "staff"]);

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
        await requireAnyRole(ctx, ["admin"]);

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

        const identifier = args.clientIdentifier || "anonymous_whistleblower";
        const rateCheck = await checkRateLimit(ctx, `whistleblower:${identifier}`);
        if (!rateCheck.allowed) {
            throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateCheck.resetAt - Date.now()) / 60000)} minutes.`);
        }

        const reportType = normalizeText(args.reportType, "Report type", 120);
        const description = normalizeText(args.description, "Description", 8000);
        const contactEmail = normalizeOptionalEmail(args.contactEmail, "Contact email");
        const contactPhone = normalizeOptionalText(args.contactPhone, "Contact phone", 40);
        const evidenceUrls = args.evidenceUrls?.map((url) => normalizeText(url, "Evidence URL", 1000));

        const id = await ctx.db.insert("whistleblower_reports", {
            reportType,
            description,
            evidenceUrls,
            contactEmail,
            contactPhone,
            isAnonymous: args.isAnonymous,
            submittedAt: Date.now(),
            status: "new",
            priority: "medium",
        });

        // Send email notification to info@lsftz.org
        try {
            await ctx.scheduler.runAfter(0, internal.resend.sendTransactionalEmail, {
                to: "info@lsftz.org",
                subject: `New Whistleblower Report Submitted`,
                html: `
                    <h2>New Whistleblower Report</h2>
                    <p><strong>Type:</strong> ${escapeHtml(reportType)}</p>
                    <p><strong>Anonymous:</strong> ${args.isAnonymous ? "Yes" : "No"}</p>
                    <p><strong>Contact Email:</strong> ${escapeHtml(contactEmail || "Not provided")}</p>
                    <p><strong>Contact Field:</strong> ${escapeHtml(contactPhone || "Not provided")}</p>
                    <p><strong>Description:</strong></p>
                    <p>${escapeHtmlWithLineBreaks(description)}</p>
                    <p>Please check the admin dashboard for full details and evidence attachments.</p>
                `,
                replyTo: contactEmail
            });
        } catch (error) {
            console.error("Failed to schedule email notification", error);
        }

        return { success: true, id };
    },
});

export const listWhistleblowerReports = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

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
        await requireAnyRole(ctx, ["admin", "staff"]);

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

export const generateParalegalDocumentUploadUrl = mutation({ args: {}, handler: async (ctx) => {
    await requireAuthenticatedUser(ctx);
    return await ctx.storage.generateUploadUrl();
} });

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
        resumeStorageId: v.optional(v.id("_storage")),
        idDocumentStorageId: v.optional(v.id("_storage")),
        certificateStorageId: v.optional(v.id("_storage")),
        // Security fields
        clientIdentifier: v.optional(v.string()),
        roleTitle: v.optional(v.string()), // Honeypot
    },
    handler: async (ctx, args) => {
        const authenticated = await requireAuthenticatedUser(ctx);
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

        const fullName = normalizeText(args.fullName, "Full name", 160);
        const email = normalizeEmail(args.email);
        if (authenticated.identity.email?.toLowerCase() !== email) throw new Error("Application email must match the signed-in account.");
        const phone = normalizeText(args.phone, "Phone", 40);
        const region = normalizeText(args.region, "Region", 80);
        const district = normalizeText(args.district, "District", 80);
        const ward = normalizeOptionalText(args.ward, "Ward", 80);
        const education = normalizeText(args.education, "Education", 2000);
        const experience = normalizeText(args.experience, "Experience", 4000);
        const motivation = normalizeText(args.motivation, "Motivation", 4000);
        const languages = args.languages?.map((language) => normalizeText(language, "Language", 80));
        const resumeUrl = normalizeOptionalText(args.resumeUrl, "Resume URL", 1000);
        const idDocumentUrl = normalizeOptionalText(args.idDocumentUrl, "ID document URL", 1000);
        for (const storageId of [args.resumeStorageId, args.idDocumentStorageId, args.certificateStorageId].filter(Boolean)) {
            const metadata = await ctx.db.system.get(storageId!);
            if (!metadata || metadata.size > 10 * 1024 * 1024) throw new Error("Application files must exist and be 10MB or smaller.");
            const type = metadata.contentType?.toLowerCase() ?? "";
            if (!type.includes("pdf") && !type.includes("image")) throw new Error("Application files must be PDF or image documents.");
        }

        // Check for duplicate applications
        const existing = await ctx.db
            .query("paralegal_applications")
            .withIndex("by_email", (q) => q.eq("email", email))
            .collect();

        if (existing.some((application) => application.status !== "rejected")) {
            return { success: false, message: "An application for this email already exists. Contact LSF if you need to update it." };
        }

        const id = await ctx.db.insert("paralegal_applications", {
            fullName,
            email,
            phone,
            region,
            district,
            ward,
            education,
            experience,
            motivation,
            languages,
            resumeUrl,
            idDocumentUrl,
            resumeStorageId: args.resumeStorageId,
            idDocumentStorageId: args.idDocumentStorageId,
            certificateStorageId: args.certificateStorageId,
            submittedAt: Date.now(),
            status: "pending",
        });

        // Send email notification to info@lsftz.org
        try {
            await ctx.scheduler.runAfter(0, internal.resend.sendTransactionalEmail, {
                to: "info@lsftz.org",
                subject: `New Paralegal Application: ${fullName}`,
                html: `
                    <h2>New Paralegal Application</h2>
                    <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
                    <p><strong>Location:</strong> ${escapeHtml(region)}, ${escapeHtml(district)}${ward ? ', ' + escapeHtml(ward) : ''}</p>
                    <p><strong>Education:</strong> ${escapeHtml(education)}</p>
                    <p><strong>Experience:</strong> ${escapeHtml(experience)}</p>
                    <p>Please review pending applications in the admin dashboard.</p>
                `,
                replyTo: email
            });
        } catch (error) {
            console.error("Failed to schedule email notification", error);
        }

        return { success: true, id };
    },
});

export const listParalegalApplications = query({
    args: {
        status: v.optional(v.string()),
        region: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        let results = await ctx.db.query("paralegal_applications").order("desc").collect();

        if (args.status) {
            results = results.filter((app) => app.status === args.status);
        }
        if (args.region) {
            results = results.filter((app) => app.region === args.region);
        }

        return await Promise.all(results.map(async (application) => ({ ...application,
            resumeDocumentUrl: application.resumeStorageId ? await ctx.storage.getUrl(application.resumeStorageId) : application.resumeUrl,
            identityDocumentUrl: application.idDocumentStorageId ? await ctx.storage.getUrl(application.idDocumentStorageId) : application.idDocumentUrl,
            certificateDocumentUrl: application.certificateStorageId ? await ctx.storage.getUrl(application.certificateStorageId) : undefined,
        })));
    },
});

export const reviewParalegalApplication = mutation({
    args: {
        id: v.id("paralegal_applications"),
        status: v.union(v.literal("pending"), v.literal("under_review"), v.literal("approved"), v.literal("rejected")),
        reviewNotes: v.optional(v.string()),
        reviewedBy: v.optional(v.string()), // Accepted for older clients, never trusted.
    },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
        if (args.status === "approved") await requireAnyRole(ctx, ["admin"]);
        const application = await ctx.db.get(args.id);
        if (!application) throw new Error("Paralegal application not found");
        if (args.status === "approved" && !(application.idDocumentStorageId || application.idDocumentUrl)) throw new Error("Identity evidence is required before approval.");
        if (args.status === "approved" && !application.certificateStorageId) throw new Error("Paralegal credential evidence is required before approval.");
        if (["approved", "rejected"].includes(application.status) && application.status !== args.status) {
            throw new Error("Final decisions require a separate supervised change process.");
        }
        if (args.status === application.status) return { success: true };
        const now = Date.now();
        await ctx.db.patch(args.id, {
            status: args.status,
            reviewNotes: args.reviewNotes?.trim(),
            reviewedBy: user._id,
            isVerified: args.status === "approved" ? true : application.isVerified,
            approvedAt: args.status === "approved" ? now : application.approvedAt,
            reviewedAt: now,
        });
        if (args.status === "approved") {
            const matchingUser = await ctx.db
                .query("users")
                .withIndex("by_email", (q) => q.eq("email", application.email.toLowerCase()))
                .first();
            if (matchingUser && !matchingUser.isDeleted) {
                await activateParalegalRoleForUser(ctx, { userId: matchingUser._id, grantedBy: user._id, now });
                await markParalegalProfileJoined(ctx, application._id, now);
            }
        }
        await ctx.db.insert("audit_logs", {
            action: "paralegal.application_reviewed",
            entityType: "paralegal_application",
            entityId: args.id,
            userId: user._id,
            timestamp: now,
            metadata: { previousStatus: application.status, status: args.status },
        });
        return { success: true };
    },
});

export const getParalegalApplicationStats = query({
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

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
