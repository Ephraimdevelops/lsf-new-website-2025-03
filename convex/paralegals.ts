import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnyRole, requireAuthenticatedUser } from "./lib/auth";
import { isParalegalReady } from "./lib/paralegalAccess";
import { writeAudit } from "./lib/hakiYangu";
import { createNotification } from "./lib/notifications";

// ==========================================
// PARALEGAL MANAGEMENT
// ==========================================

// Get all approved paralegals (from applications)
export const listApprovedParalegals = query({
    args: {
        region: v.optional(v.string()),
        verifiedOnly: v.optional(v.boolean()),
        includePrivate: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const includePrivate = args.includePrivate === true;
        if (includePrivate) {
            await requireAnyRole(ctx, ["admin", "staff"]);
        }

        let paralegals = await ctx.db
            .query("paralegal_applications")
            .withIndex("by_status", (q) => q.eq("status", "approved"))
            .collect();

        if (args.region) {
            const searchRegion = args.region.toLowerCase();
            paralegals = paralegals.filter((p) => p.region.toLowerCase().includes(searchRegion));
        }

        if (args.verifiedOnly) {
            paralegals = paralegals.filter((p) => p.isVerified === true);
        }

        if (includePrivate) return paralegals;

        paralegals = paralegals.filter(isParalegalReady);

        return paralegals.map((paralegal) => ({
            _id: paralegal._id,
            _creationTime: paralegal._creationTime,
            fullName: paralegal.fullName,
            phone: paralegal.phone,
            region: paralegal.region,
            district: paralegal.district,
            ward: paralegal.ward,
            bio: paralegal.bio,
            photoUrl: paralegal.photoUrl,
            specializations: paralegal.specializations ?? [],
            isVerified: paralegal.isVerified === true,
            languages: paralegal.languages ?? [],
            availabilityStatus: paralegal.availabilityStatus ?? "accepting_cases",
        }));
    },
});

// Get paralegal by ID
export const getParalegal = query({
    args: { id: v.id("paralegal_applications") },
    handler: async (ctx, args) => {
        const paralegal = await ctx.db.get(args.id);
        if (!paralegal) return null;
        if (paralegal.status === "approved" && !isParalegalReady(paralegal)) return null;
        if (paralegal.status !== "approved") {
            await requireAnyRole(ctx, ["admin", "staff"]);
            return paralegal;
        }
        return {
            _id: paralegal._id,
            _creationTime: paralegal._creationTime,
            fullName: paralegal.fullName,
            phone: paralegal.phone,
            region: paralegal.region,
            district: paralegal.district,
            ward: paralegal.ward,
            bio: paralegal.bio,
            photoUrl: paralegal.photoUrl,
            specializations: paralegal.specializations ?? [],
            isVerified: paralegal.isVerified === true,
            languages: paralegal.languages ?? [],
            availabilityStatus: paralegal.availabilityStatus ?? "accepting_cases",
            workingHours: paralegal.workingHours,
        };
    },
});

// Get paralegal by email (for dashboard)
export const getParalegalByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const actor = await requireAuthenticatedUser(ctx);
        const isStaff = ["admin", "staff"].includes(actor.user.role);
        const isSelf = actor.identity.email?.toLowerCase() === args.email.toLowerCase();
        if (!isStaff && !isSelf) throw new Error("Forbidden");

        return await ctx.db
            .query("paralegal_applications")
            .filter((q) => q.eq(q.field("email"), args.email.toLowerCase()))
            .first();
    },
});

export const getMyApplication = query({
    args: {},
    handler: async (ctx) => {
        const actor = await requireAuthenticatedUser(ctx);
        const email = actor.identity.email?.trim().toLowerCase();
        if (!email) return null;
        return await ctx.db
            .query("paralegal_applications")
            .withIndex("by_email", (q) => q.eq("email", email))
            .order("desc")
            .first();
    },
});

export const getMyPerformance = query({
    args: {},
    handler: async (ctx) => {
        const { user } = await requireAnyRole(ctx, ["paralegal", "provider_staff"]);
        const assignments = await ctx.db.query("case_assignments").withIndex("by_assignee_status", (q) => q.eq("assigneeId", user._id).eq("status", "accepted")).collect();
        const cases = await Promise.all(assignments.map((assignment) => ctx.db.get(assignment.caseId)));
        const outcomes = await Promise.all(assignments.map((assignment) => ctx.db.query("case_outcomes").withIndex("by_case", (q) => q.eq("caseId", assignment.caseId)).unique()));
        const feedback = await Promise.all(assignments.map((assignment) => ctx.db.query("case_feedback").withIndex("by_case", (q) => q.eq("caseId", assignment.caseId)).unique()));
        const rated = feedback.filter((item): item is NonNullable<typeof item> => item !== null);
        const resolved = cases.filter((item) => item?.status === "resolved" || item?.status === "closed").length;
        return {
            casesHandled: assignments.length,
            activeCases: cases.filter((item) => item && !["resolved", "closed", "closed_unresolved"].includes(item.status)).length,
            resolvedCases: resolved,
            outcomesRecorded: outcomes.filter(Boolean).length,
            feedbackCount: rated.length,
            averageRating: rated.length ? Math.round((rated.reduce((sum, item) => sum + item.rating, 0) / rated.length) * 10) / 10 : null,
            generatedAt: Date.now(),
        };
    },
});

export const mySupportRequests = query({
    args: {},
    handler: async (ctx) => {
        const { user } = await requireAnyRole(ctx, ["paralegal", "provider_staff"]);
        return await ctx.db.query("paralegal_support_requests").withIndex("by_user_status", (q) => q.eq("userId", user._id)).order("desc").take(50);
    },
});

export const requestSupport = mutation({
    args: {
        type: v.union(v.literal("supervisor"), v.literal("peer_support"), v.literal("wellbeing"), v.literal("challenging_case"), v.literal("payment")),
        note: v.string(),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["paralegal", "provider_staff"]);
        const note = args.note.trim();
        if (note.length < 5 || note.length > 2000) throw new Error("Support note must be between 5 and 2000 characters.");
        const now = Date.now();
        const id = await ctx.db.insert("paralegal_support_requests", { userId: user._id, type: args.type, note, status: "submitted", createdAt: now, updatedAt: now });
        await writeAudit(ctx, user._id, "paralegal.support_requested", "paralegal_support_request", id, { type: args.type });
        const [staff, supervisors, admins] = await Promise.all([
            ctx.db.query("role_assignments").withIndex("by_role_status", (q) => q.eq("role", "staff").eq("status", "active")).collect(),
            ctx.db.query("role_assignments").withIndex("by_role_status", (q) => q.eq("role", "supervisor").eq("status", "active")).collect(),
            ctx.db.query("role_assignments").withIndex("by_role_status", (q) => q.eq("role", "admin").eq("status", "active")).collect(),
        ]);
        for (const recipientId of new Set([...staff, ...supervisors, ...admins].map((assignment) => String(assignment.userId)))) {
            await createNotification(ctx, { userId: recipientId as typeof user._id, type: "paralegal.support_requested", titleKey: "notifications.update.title", bodyKey: "notifications.paralegalSupportRequested.body", resourceType: "paralegal_support_request", resourceId: id });
        }
        return id;
    },
});

export const staffSupportQueue = query({
    args: { status: v.optional(v.union(v.literal("submitted"), v.literal("in_review"), v.literal("responded"), v.literal("closed"))) },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
        const requests = args.status
            ? await ctx.db.query("paralegal_support_requests").withIndex("by_status", (q) => q.eq("status", args.status!)).order("desc").take(100)
            : await ctx.db.query("paralegal_support_requests").withIndex("by_status", (q) => q.eq("status", "submitted")).order("desc").take(100);
        return await Promise.all(requests.map(async (request) => ({ request, user: await ctx.db.get(request.userId) })));
    },
});

export const respondToSupportRequest = mutation({
    args: {
        id: v.id("paralegal_support_requests"),
        status: v.union(v.literal("in_review"), v.literal("responded"), v.literal("closed")),
        responseNote: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
        const request = await ctx.db.get(args.id);
        if (!request) throw new Error("Support request not found.");
        const now = Date.now();
        const responseNote = args.responseNote?.trim();
        await ctx.db.patch(args.id, { status: args.status, responseNote: responseNote || request.responseNote, updatedAt: now, respondedAt: args.status === "responded" || args.status === "closed" ? now : request.respondedAt });
        await writeAudit(ctx, user._id, "paralegal.support_updated", "paralegal_support_request", args.id, { status: args.status, changedFieldNames: ["status", "responseNote"] });
        await createNotification(ctx, { userId: request.userId, type: "paralegal.support_updated", titleKey: "notifications.update.title", bodyKey: "notifications.paralegalSupportUpdated.body", resourceType: "paralegal_support_request", resourceId: args.id });
        return { status: args.status };
    },
});

// Increment profile views
export const incrementProfileViews = mutation({
    args: { id: v.id("paralegal_applications") },
    handler: async (ctx, args) => {
        const paralegal = await ctx.db.get(args.id);
        if (paralegal && paralegal.status === "approved") {
            await ctx.db.patch(args.id, {
                profileViews: (paralegal.profileViews || 0) + 1,
            });
        }
    },
});

// Toggle verified status (admin only)
export const toggleVerified = mutation({
    args: { id: v.id("paralegal_applications") },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]);

        const paralegal = await ctx.db.get(args.id);
        if (paralegal) {
            if (paralegal.status !== "approved") throw new Error("Only approved paralegals can change verification status.");
            if (!paralegal.isVerified && (!paralegal.reviewedBy || !(paralegal.idDocumentStorageId || paralegal.idDocumentUrl) || !paralegal.certificateStorageId)) throw new Error("Identity and credential review must be recorded before verification.");
            await ctx.db.patch(args.id, {
                isVerified: !paralegal.isVerified,
            });
            await writeAudit(ctx, user._id, "paralegal.verification_changed", "paralegal_application", args.id, { verified: !paralegal.isVerified });
        }
        return { success: true };
    },
});

// Update paralegal profile
export const updateParalegalProfile = mutation({
    args: {
        id: v.id("paralegal_applications"),
        fullName: v.optional(v.string()),
        phone: v.optional(v.string()),
        region: v.optional(v.string()),
        district: v.optional(v.string()),
        ward: v.optional(v.string()),
        bio: v.optional(v.string()),
        photoUrl: v.optional(v.string()),
        specializations: v.optional(v.array(v.string())),
        availabilityStatus: v.optional(v.union(
            v.literal("accepting_cases"),
            v.literal("limited"),
            v.literal("paused"),
            v.literal("unavailable"),
        )),
        weeklyCapacity: v.optional(v.number()),
        workingHours: v.optional(v.string()),
        availabilityNotes: v.optional(v.string()),
        hasJoinedHakiYangu: v.optional(v.boolean()),
        onboardingCompleted: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const paralegal = await ctx.db.get(args.id);
        if (!paralegal) throw new Error("Paralegal not found");

        const actor = await requireAuthenticatedUser(ctx);
        const isStaff = ["admin", "staff"].includes(actor.user.role);
        const isSelf = actor.identity.email?.toLowerCase() === paralegal.email.toLowerCase();
        if (!isStaff && !isSelf) throw new Error("Forbidden");
        if (args.onboardingCompleted !== undefined || args.hasJoinedHakiYangu !== undefined) throw new Error("Use the governed onboarding completion flow.");

        const { id, ...updates } = args;
        if (updates.weeklyCapacity !== undefined) {
            updates.weeklyCapacity = Math.max(0, Math.min(50, Math.floor(updates.weeklyCapacity)));
        }
        await ctx.db.patch(id, updates);
        return { success: true };
    },
});

export const completeMyOnboarding = mutation({
    args: {
        id: v.id("paralegal_applications"),
        ethicsAccepted: v.boolean(),
        codeOfConductAccepted: v.boolean(),
        safeguardingTrainingCompleted: v.boolean(),
    },
    handler: async (ctx, args) => {
        const actor = await requireAuthenticatedUser(ctx);
        const application = await ctx.db.get(args.id);
        if (!application || actor.identity.email?.toLowerCase() !== application.email.toLowerCase()) throw new Error("Forbidden");
        if (application.status !== "approved" || !application.isVerified) throw new Error("LSF approval and verification are required.");
        if (!application.bio?.trim() || !application.specializations?.length) throw new Error("Complete your public profile first.");
        if (!application.availabilityStatus || !application.workingHours?.trim()) throw new Error("Set your availability and working hours first.");
        if (!args.ethicsAccepted || !args.codeOfConductAccepted || !args.safeguardingTrainingCompleted) throw new Error("Complete all ethics, conduct, and safeguarding declarations.");
        const now = Date.now();
        const training = await ctx.db.query("paralegal_training_modules").withIndex("by_status", (q) => q.eq("status", "approved")).collect();
        const required = training.filter((item) => item.required && item.reviewDueAt > now);
        if (!required.length) throw new Error("LSF must publish a current required training module before onboarding can finish.");
        for (const module of required) {
            const completion = await ctx.db.query("paralegal_training_completions").withIndex("by_user_module", (q) => q.eq("userId", actor.user._id).eq("moduleId", module._id)).unique();
            if (completion?.moduleVersion !== module.version) throw new Error("Review and acknowledge each required LSF training module first.");
        }
        await ctx.db.patch(application._id, { ethicsAcceptedAt: now, codeOfConductAcceptedAt: now, safeguardingTrainingCompletedAt: now, onboardingCompleted: true, hasJoinedHakiYangu: true });
        await ctx.db.insert("audit_logs", { action: "paralegal.onboarding_completed", entityType: "paralegal_application", entityId: application._id, userId: actor.user._id, timestamp: now, metadata: { changedFieldNames: ["ethicsAcceptedAt", "codeOfConductAcceptedAt", "safeguardingTrainingCompletedAt", "onboardingCompleted"] } });
        return { success: true };
    },
});

// Deactivate paralegal
export const deactivateParalegal = mutation({
    args: { id: v.id("paralegal_applications") },
    handler: async (ctx, args) => {
        const { user: actor } = await requireAnyRole(ctx, ["admin", "staff"]);
        const paralegal = await ctx.db.get(args.id);
        if (!paralegal) throw new Error("Paralegal not found");

        await ctx.db.patch(args.id, {
            status: "rejected",
            isVerified: false,
            onboardingCompleted: false,
            availabilityStatus: "unavailable",
            reviewNotes: "Access revoked by LSF staff.",
            reviewedBy: actor._id,
            reviewedAt: Date.now(),
        });
        const matchingUser = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", paralegal.email.toLowerCase())).unique();
        if (matchingUser) {
            const assignments = await ctx.db.query("role_assignments").withIndex("by_user_status", (q) => q.eq("userId", matchingUser._id).eq("status", "active")).collect();
            for (const assignment of assignments.filter((assignment) => assignment.role === "paralegal")) await ctx.db.patch(assignment._id, { status: "revoked", revokedAt: Date.now() });
            if (matchingUser.role === "paralegal") await ctx.db.patch(matchingUser._id, { role: "user" });
            await createNotification(ctx, { userId: matchingUser._id, type: "access.revoked", titleKey: "notifications.update.title", bodyKey: "notifications.accessRevoked.body", resourceType: "profile", resourceId: matchingUser._id });
            await writeAudit(ctx, actor._id, "paralegal.access_revoked", "user", matchingUser._id, { applicationId: args.id, changedFieldNames: ["role", "role_assignments", "profile_status"] });
        }
        return { success: true, userId: matchingUser?._id ?? null };
    },
});

// Get paralegal stats for admin
export const getParalegalStats = query({
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const all = await ctx.db.query("paralegal_applications").collect();
        const approved = all.filter((p) => p.status === "approved");

        // Group by region
        const byRegion: Record<string, number> = {};
        approved.forEach((p) => {
            byRegion[p.region] = (byRegion[p.region] || 0) + 1;
        });

        return {
            total: approved.length,
            verified: approved.filter((p) => p.isVerified).length,
            pending: all.filter((p) => p.status === "pending").length,
            byRegion,
        };
    },
});

// Get paralegal dashboard data
export const getDashboardData = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const actor = await requireAuthenticatedUser(ctx);
        const isStaff = ["admin", "staff"].includes(actor.user.role);
        const isSelf = actor.identity.email?.toLowerCase() === args.email.toLowerCase();
        if (!isStaff && !isSelf) throw new Error("Forbidden");

        const paralegal = await ctx.db
            .query("paralegal_applications")
            .filter((q) => q.eq(q.field("email"), args.email.toLowerCase()))
            .first();

        if (!paralegal || paralegal.status !== "approved") {
            return null;
        }

        // Get all approved paralegals for ranking
        const allApproved = await ctx.db
            .query("paralegal_applications")
            .withIndex("by_status", (q) => q.eq("status", "approved"))
            .collect();

        const rank = allApproved
            .sort((a, b) => (b.profileViews || 0) - (a.profileViews || 0))
            .findIndex((p) => p._id === paralegal._id) + 1;

        return {
            paralegal,
            stats: {
                profileViews: paralegal.profileViews || 0,
                rank,
                totalParalegals: allApproved.length,
                isVerified: paralegal.isVerified || false,
            },
        };
    },
});

// Admin ONLY: Add Paralegal Manually
export const addParalegalManually = mutation({
    args: {
        fullName: v.string(),
        email: v.string(),
        phone: v.string(),
        region: v.string(),
        district: v.string(),
        specializations: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
        const now = Date.now();
        const email = args.email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.endsWith(".local")) throw new Error("A real email address is required so the applicant can complete verification.");

        // Check if an application for this email already exists
        const existing = await ctx.db
            .query("paralegal_applications")
            .filter((q) => q.eq(q.field("email"), email))
            .first();

        if (existing) {
            throw new Error("A paralegal with this email already exists.");
        }

        // A staff-created record is an invitation to apply, not a verified worker.
        const id = await ctx.db.insert("paralegal_applications", {
            fullName: args.fullName.trim(),
            email,
            phone: args.phone,
            region: args.region,
            district: args.district,
            education: "Manual Entry",
            experience: "Manual Entry",
            motivation: "Added by Admin",
            specializations: args.specializations || [],
            isVerified: false,
            status: "pending",
            intakeOrigin: "manual_invitation",
            submittedAt: now,
            profileViews: 0,
            hasJoinedHakiYangu: false,
            onboardingCompleted: false,
        });
        await writeAudit(ctx, user._id, "paralegal.invitation_created", "paralegal_application", id, { intakeOrigin: "manual_invitation" });
        return { success: true, id };
    },
});

// ==========================================
// BULK CSV IMPORT
// ==========================================
export const importParalegalsBatch = mutation({
    args: {
        records: v.array(
            v.object({
                fullName: v.string(),
                email: v.string(),
                phone: v.string(),
                region: v.string(),
                district: v.string(),
                bio: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin", "staff"]);

        let imported = 0;
        let duplicates = 0;
        const errors: string[] = [];

        for (const record of args.records) {
            try {
                const email = record.email.trim().toLowerCase();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.endsWith(".local")) throw new Error("A real email address is required.");
                // Skip if email already exists
                const existing = await ctx.db
                    .query("paralegal_applications")
                    .filter((q) => q.eq(q.field("email"), email))
                    .first();

                if (existing) {
                    duplicates++;
                    continue;
                }

                const now = Date.now();
                const id = await ctx.db.insert("paralegal_applications", {
                    fullName: record.fullName.trim(),
                    email,
                    phone: record.phone.trim(),
                    region: record.region.trim(),
                    district: record.district.trim(),
                    bio: record.bio || undefined,
                    education: "CSV Import",
                    experience: "CSV Import",
                    motivation: "Imported from CSV",
                    isVerified: false,
                    status: "pending",
                    intakeOrigin: "csv_invitation",
                    submittedAt: now,
                    profileViews: 0,
                    hasJoinedHakiYangu: false,
                    onboardingCompleted: false,
                });
                await writeAudit(ctx, user._id, "paralegal.invitation_imported", "paralegal_application", id, { intakeOrigin: "csv_invitation" });
                imported++;
            } catch (e: any) {
                errors.push(`${record.fullName}: ${e.message}`);
            }
        }

        return { imported, duplicates, errors };
    },
});
