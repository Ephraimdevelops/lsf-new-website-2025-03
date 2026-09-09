import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { requireAnyRole, requireAuthenticatedUser } from "./lib/auth";
import {
  assertCaseTransition,
  getActorRoleSet,
  requireCaseAccess,
  requireCaseWorker,
  writeAudit,
} from "./lib/hakiYangu";
import { createNotification } from "./lib/notifications";
import { assertAllowedUpload, normalizeOptionalText, normalizeText } from "./lib/security";

const caseStatusValidator = v.union(
  v.literal("under_review"),
  v.literal("waiting_for_information"),
  v.literal("assignment_pending"),
  v.literal("assigned"),
  v.literal("appointment_scheduled"),
  v.literal("referred"),
  v.literal("assistance_underway"),
  v.literal("resolved"),
  v.literal("closed_unresolved"),
  v.literal("closed"),
);

const priorityValidator = v.union(
  v.literal("standard"),
  v.literal("urgent"),
  v.literal("safeguarding"),
);

const documentCategoryValidator = v.union(
  v.literal("evidence"),
  v.literal("identity"),
  v.literal("contract"),
  v.literal("letter"),
  v.literal("receipt"),
  v.literal("other"),
);

const documentStatusValidator = v.union(
  v.literal("pending_review"),
  v.literal("accepted"),
  v.literal("rejected"),
);

const reviewRequestReasonValidator = v.union(
  v.literal("reassignment"),
  v.literal("service_concern"),
  v.literal("safety_concern"),
  v.literal("other"),
);

const reviewRequestStatusValidator = v.union(
  v.literal("submitted"),
  v.literal("under_review"),
  v.literal("resolved"),
  v.literal("declined"),
);

const MAX_CASE_DOCUMENT_BYTES = 10 * 1024 * 1024;
const ASSIGNMENT_OFFER_EXPIRY_MS = 48 * 60 * 60 * 1000;
const ASSIGNMENT_EXPIRY_BATCH_LIMIT = 50;
const APPOINTMENT_REMINDER_WINDOW_MS = 24 * 60 * 60 * 1000;
const APPOINTMENT_REMINDER_BATCH_LIMIT = 100;

function publicReference(prefix: string, id: string, now: number) {
  const date = new Date(now).toISOString().slice(0, 10).replaceAll("-", "");
  return `${prefix}-${date}-${id.slice(-6).toUpperCase()}`;
}

async function addEvent(
  ctx: Parameters<typeof writeAudit>[0],
  args: {
    caseId: Parameters<typeof ctx.db.get<"cases">>[0];
    actorId: Parameters<typeof getActorRoleSet>[1];
    type: string;
    audience: "beneficiary" | "workers" | "all";
    publicLabelKey?: string;
    metadata?: Record<string, unknown>;
  },
) {
  return await ctx.db.insert("case_events", {
    ...args,
    occurredAt: Date.now(),
  });
}

export const createFromRequest = mutation({
  args: {
    requestId: v.id("legal_help_requests"),
    summary: v.string(),
    priority: priorityValidator,
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new ConvexError({ code: "NOT_FOUND", message: "Request not found" });

    const existing = await ctx.db
      .query("cases")
      .withIndex("by_source_request", (q) => q.eq("sourceRequestId", request._id))
      .unique();
    if (existing) return { caseId: existing._id, publicId: existing.publicId, created: false };
    if (!["submitted", "under_review", "waiting_for_information"].includes(request.status)) {
      throw new ConvexError({ code: "CONFLICT", message: "This request cannot be converted to a case" });
    }

    const now = Date.now();
    const caseId = await ctx.db.insert("cases", {
      publicId: "pending",
      sourceRequestId: request._id,
      beneficiaryId: request.ownerId,
      status: "under_review",
      priority: args.priority,
      summary: normalizeText(args.summary, "Case summary", 3000),
      createdBy: user._id,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
    const publicId = publicReference("HYC", caseId, now);
    await ctx.db.patch(caseId, { publicId });
    await ctx.db.insert("case_participants", {
      caseId,
      userId: request.ownerId,
      role: "beneficiary",
      status: "active",
      addedBy: user._id,
      addedAt: now,
    });
    await ctx.db.insert("case_participants", {
      caseId,
      userId: user._id,
      role: "case_officer",
      status: "active",
      addedBy: user._id,
      addedAt: now,
    });
    await ctx.db.insert("case_conversations", { caseId, status: "active", createdAt: now });
    await addEvent(ctx, {
      caseId,
      actorId: user._id,
      type: "case_created",
      audience: "all",
      publicLabelKey: "case.timeline.underReview",
    });
    await ctx.db.patch(request._id, {
      status: "converted_to_case",
      version: request.version + 1,
      updatedAt: now,
    });
    await createNotification(ctx, {
      userId: request.ownerId,
      type: "case.created",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.caseCreated.body",
      resourceType: "case",
      resourceId: caseId,
    });
    await writeAudit(ctx, user._id, "case.created", "case", caseId, {
      sourceRequestId: request._id,
      changedFieldNames: ["status"],
    });
    return { caseId, publicId, created: true };
  },
});

export const myCases = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const owned = await ctx.db
      .query("cases")
      .withIndex("by_beneficiary", (q) => q.eq("beneficiaryId", user._id))
      .order("desc")
      .collect();
    const participantLinks = await ctx.db
      .query("case_participants")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    const participantCases = await Promise.all(participantLinks.map((link) => ctx.db.get(link.caseId)));
    const merged = new Map(owned.map((record) => [record._id, record]));
    for (const record of participantCases) if (record) merged.set(record._id, record);
    return [...merged.values()].sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const staffCaseQueue = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const roles = await getActorRoleSet(ctx, user._id);
    if (roles.has("admin") || roles.has("supervisor")) {
      return await ctx.db.query("cases").order("desc").collect();
    }
    const links = await ctx.db
      .query("case_participants")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    const records = await Promise.all(links.map((link) => ctx.db.get(link.caseId)));
    return records.filter((record) => record !== null).sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const serviceProviders = query({
  args: {},
  handler: async (ctx) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const [paralegalAssignments, providerAssignments, legacyParalegals] = await Promise.all([
      ctx.db.query("role_assignments").withIndex("by_role_status", (q) => q.eq("role", "paralegal").eq("status", "active")).collect(),
      ctx.db.query("role_assignments").withIndex("by_role_status", (q) => q.eq("role", "provider_staff").eq("status", "active")).collect(),
      ctx.db.query("users").filter((q) => q.eq(q.field("role"), "paralegal")).collect(),
    ]);
    const providerIds = new Set([...paralegalAssignments, ...providerAssignments].map((assignment) => assignment.userId));
    for (const provider of legacyParalegals) providerIds.add(provider._id);
    const providers = await Promise.all([...providerIds].map(async (userId) => {
      const provider = await ctx.db.get(userId);
      if (!provider || provider.isDeleted) return null;
      const [roles, profile] = await Promise.all([
        getActorRoleSet(ctx, provider._id),
        ctx.db.query("paralegal_applications").withIndex("by_email", (q) => q.eq("email", provider.email.toLowerCase())).first(),
      ]);
      return {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        role: roles.has("provider_staff") ? "provider_staff" as const : "paralegal" as const,
        imageUrl: provider.imageUrl,
        availabilityStatus: profile?.availabilityStatus ?? "accepting_cases",
      };
    }));
    return providers.filter((provider) => provider !== null).sort((a, b) => a.name.localeCompare(b.name));
  },
});

const issueKeywordMap = [
  { tag: "Employment", keywords: ["salary", "wage", "employer", "employment", "job", "mshahara", "mwajiri", "ajira"] },
  { tag: "Land & Housing", keywords: ["land", "house", "tenant", "rent", "boundary", "ardhi", "nyumba", "mpangaji"] },
  { tag: "Family & Children", keywords: ["child", "custody", "divorce", "family", "children", "mtoto", "talaka", "familia"] },
  { tag: "GBV & Safety", keywords: ["violence", "abuse", "gbv", "safety", "threat", "ukatili", "unyanyasaji", "usalama"] },
  { tag: "Contracts & Debt", keywords: ["contract", "debt", "loan", "agreement", "mkataba", "deni", "mkopo"] },
];

function matchIssueTags(text: string) {
  const lower = text.toLowerCase();
  return issueKeywordMap
    .filter((entry) => entry.keywords.some((keyword) => lower.includes(keyword)))
    .map((entry) => entry.tag);
}

async function notifySupervisors(
  ctx: Parameters<typeof writeAudit>[0],
  args: { type: string; resourceType: string; resourceId: string },
) {
  const [legacyAdmins, legacyStaff, activeAdminRoles, activeSupervisorRoles] = await Promise.all([
    ctx.db.query("users").filter((q) => q.eq(q.field("role"), "admin")).collect(),
    ctx.db.query("users").filter((q) => q.eq(q.field("role"), "staff")).collect(),
    ctx.db.query("role_assignments").withIndex("by_role_status", (q) => q.eq("role", "admin").eq("status", "active")).collect(),
    ctx.db.query("role_assignments").withIndex("by_role_status", (q) => q.eq("role", "supervisor").eq("status", "active")).collect(),
  ]);
  const userIds = new Set([
    ...legacyAdmins.filter((user) => !user.isDeleted).map((user) => user._id),
    ...legacyStaff.filter((user) => !user.isDeleted).map((user) => user._id),
    ...activeAdminRoles.map((role) => role.userId),
    ...activeSupervisorRoles.map((role) => role.userId),
  ]);
  for (const userId of userIds) {
    await createNotification(ctx, {
      userId,
      type: args.type,
      titleKey: "notifications.update.title",
      bodyKey: "notifications.caseReviewRequested.body",
      resourceType: args.resourceType,
      resourceId: args.resourceId,
    });
  }
}

function assignmentOfferExpiresAt(offeredAt: number) {
  return offeredAt + ASSIGNMENT_OFFER_EXPIRY_MS;
}

async function expireAssignmentOffer(
  ctx: Parameters<typeof writeAudit>[0],
  args: {
    assignmentId: Id<"case_assignments">;
    now: number;
    actorId: Id<"users">;
    reason?: string;
  },
) {
  const assignment = await ctx.db.get(args.assignmentId);
  if (!assignment || assignment.status !== "offered") return null;
  const expiresAt = assignment.expiresAt ?? assignmentOfferExpiresAt(assignment.offeredAt);
  if (expiresAt > args.now) return null;

  const caseRecord = await ctx.db.get(assignment.caseId);
  await ctx.db.patch(assignment._id, {
    status: "expired",
    expiresAt,
    reason: normalizeOptionalText(args.reason ?? "Offer expired without response.", "Expiry reason", 500),
    endedAt: args.now,
  });

  if (caseRecord) {
    await ctx.db.patch(caseRecord._id, {
      status: caseRecord.status === "assignment_pending" ? "assignment_pending" : caseRecord.status,
      version: caseRecord.status === "assignment_pending" ? caseRecord.version + 1 : caseRecord.version,
      updatedAt: args.now,
    });
    await addEvent(ctx, {
      caseId: caseRecord._id,
      actorId: args.actorId,
      type: "assignment_expired",
      audience: "workers",
      metadata: { assignmentId: assignment._id, assigneeId: assignment.assigneeId, expiresAt },
    });
    await notifySupervisors(ctx, {
      type: "assignment.expired",
      resourceType: "case_assignment",
      resourceId: assignment._id,
    });
  }

  await createNotification(ctx, {
    userId: assignment.assigneeId,
    type: "assignment.expired",
    titleKey: "notifications.update.title",
    bodyKey: "notifications.assignmentExpired.body",
    resourceType: "case_assignment",
    resourceId: assignment._id,
  });
  await writeAudit(ctx, args.actorId, "assignment.expired", "case_assignment", assignment._id, {
    caseId: assignment.caseId,
    changedFieldNames: ["status"],
    expiresAt,
  });
  return { assignmentId: assignment._id, caseId: assignment.caseId, assigneeId: assignment.assigneeId };
}

async function getClosureReadiness(ctx: MutationCtx | QueryCtx, caseId: Id<"cases">) {
  const [outcome, documents, feedbackRequestedEvent] = await Promise.all([
    ctx.db.query("case_outcomes").withIndex("by_case", (q) => q.eq("caseId", caseId)).unique(),
    ctx.db.query("case_documents").withIndex("by_case", (q) => q.eq("caseId", caseId)).collect(),
    ctx.db
      .query("case_events")
      .withIndex("by_case", (q) => q.eq("caseId", caseId))
      .filter((q) => q.eq(q.field("type"), "feedback_requested"))
      .first(),
  ]);
  const pendingDocuments = documents.filter((document) => document.status === "pending_review");
  const outcomeSummary = outcome?.summary.trim() ?? "";
  const requirements = {
    outcomeRecorded: outcome !== null,
    beneficiarySafeSummary: outcomeSummary.length >= 20,
    documentsReviewed: pendingDocuments.length === 0,
    feedbackRequested: feedbackRequestedEvent !== null || outcome !== null,
  };
  const missing = [
    requirements.outcomeRecorded ? null : "Record the case outcome.",
    requirements.beneficiarySafeSummary ? null : "Add a beneficiary-safe outcome summary of at least 20 characters.",
    requirements.documentsReviewed ? null : "Accept or reject every pending case document.",
    requirements.feedbackRequested ? null : "Request beneficiary feedback before closure.",
  ].filter((item): item is string => item !== null);
  return {
    canClose: missing.length === 0,
    missing,
    pendingDocumentCount: pendingDocuments.length,
    requirements,
    outcomeId: outcome?._id,
  };
}

async function requireAssignableAvailability(
  ctx: MutationCtx,
  assigneeId: Id<"users">,
  overrideReason?: string,
) {
  const assignee = await ctx.db.get(assigneeId);
  const profile = assignee
    ? await ctx.db.query("paralegal_applications").withIndex("by_email", (q) => q.eq("email", assignee.email.toLowerCase())).first()
    : null;
  const availabilityStatus = profile?.availabilityStatus ?? "accepting_cases";
  const normalizedOverrideReason = normalizeOptionalText(overrideReason, "Availability override reason", 500);
  if ((availabilityStatus === "paused" || availabilityStatus === "unavailable") && !normalizedOverrideReason) {
    throw new ConvexError({
      code: "VALIDATION",
      message: "Provider is paused or unavailable. Record an override reason before sending the offer.",
    });
  }
  return {
    availabilityStatus,
    availabilityOverrideReason: normalizedOverrideReason,
  };
}

export const providerRecommendations = query({
  args: { caseId: v.id("cases") },
  handler: async (ctx, args) => {
    await requireCaseWorker(ctx, args.caseId);
    const caseRecord = await ctx.db.get(args.caseId);
    if (!caseRecord) throw new ConvexError({ code: "NOT_FOUND", message: "Case not found" });
    const request = await ctx.db.get(caseRecord.sourceRequestId);
    const issueTags = matchIssueTags(`${caseRecord.summary} ${request?.description ?? ""} ${request?.desiredHelp ?? ""}`);

    const [paralegalAssignments, providerAssignments, legacyParalegalUsers] = await Promise.all([
      ctx.db.query("role_assignments").withIndex("by_role_status", (q) => q.eq("role", "paralegal").eq("status", "active")).collect(),
      ctx.db.query("role_assignments").withIndex("by_role_status", (q) => q.eq("role", "provider_staff").eq("status", "active")).collect(),
      ctx.db.query("users").filter((q) => q.eq(q.field("role"), "paralegal")).collect(),
    ]);
    const providerIds = new Set([...paralegalAssignments, ...providerAssignments].map((assignment) => assignment.userId));
    for (const provider of legacyParalegalUsers) providerIds.add(provider._id);

    const providers = await Promise.all([...providerIds].map(async (userId) => {
      const provider = await ctx.db.get(userId);
      if (!provider || provider.isDeleted) return null;
      const [roles, profile, assignments] = await Promise.all([
        getActorRoleSet(ctx, provider._id),
        ctx.db.query("paralegal_applications").withIndex("by_email", (q) => q.eq("email", provider.email.toLowerCase())).first(),
        ctx.db.query("case_assignments").withIndex("by_assignee_status", (q) => q.eq("assigneeId", provider._id).eq("status", "accepted")).collect(),
      ]);
      const activeAssignments = await Promise.all(assignments.map(async (assignment) => {
        const assignedCase = await ctx.db.get(assignment.caseId);
        return assignedCase && !["resolved", "closed_unresolved", "closed"].includes(assignedCase.status) ? assignedCase : null;
      }));
      const activeLoad = activeAssignments.filter(Boolean).length;
      const availabilityStatus = profile?.availabilityStatus ?? "accepting_cases";
      const weeklyCapacity = Math.max(0, Math.floor(profile?.weeklyCapacity ?? 3));
      const remainingCapacity = Math.max(weeklyCapacity - activeLoad, 0);
      const reasons: string[] = [];
      let score = 0;
      if (profile?.isVerified) {
        score += 15;
        reasons.push("verified profile");
      }
      if (request?.region && profile?.region?.toLowerCase() === request.region.toLowerCase()) {
        score += 30;
        reasons.push(`same region: ${request.region}`);
      }
      if (request?.district && profile?.district?.toLowerCase() === request.district.toLowerCase()) {
        score += 25;
        reasons.push(`same district: ${request.district}`);
      }
      const specializations = profile?.specializations ?? [];
      const languages = profile?.languages ?? [];
      const matchedSpecializations = specializations.filter((specialization) =>
        issueTags.some((tag) => specialization.toLowerCase().includes(tag.toLowerCase().split(" ")[0])),
      );
      if (matchedSpecializations.length > 0) {
        score += Math.min(30, matchedSpecializations.length * 12);
        reasons.push(`issue fit: ${matchedSpecializations.slice(0, 2).join(", ")}`);
      }
      if (activeLoad === 0) {
        score += 10;
        reasons.push("no active accepted cases");
      } else {
        score -= Math.min(20, activeLoad * 5);
        reasons.push(`${activeLoad} active case${activeLoad === 1 ? "" : "s"}`);
      }
      if (availabilityStatus === "accepting_cases") {
        score += remainingCapacity > 0 ? 12 : -10;
        reasons.push(remainingCapacity > 0 ? `${remainingCapacity} capacity slot${remainingCapacity === 1 ? "" : "s"}` : "capacity full");
      } else if (availabilityStatus === "limited") {
        score += remainingCapacity > 0 ? 3 : -15;
        reasons.push(remainingCapacity > 0 ? "limited availability" : "limited and full");
      } else {
        score -= 60;
        reasons.push(availabilityStatus === "paused" ? "paused new cases" : "unavailable for new cases");
      }
      if (request?.preferredLanguage && request.preferredLanguage !== "both" && request.preferredLanguage !== "other") {
        const preferred = request.preferredLanguage === "sw" ? "kiswahili" : "english";
        if (languages.some((language) => language.toLowerCase().includes(preferred))) {
          score += 8;
          reasons.push(`language fit: ${preferred}`);
        }
      }
      if (request?.preferredLanguage === "other" && request.preferredLanguageOther) {
        const preferred = request.preferredLanguageOther.toLowerCase();
        if (languages.some((language) => language.toLowerCase().includes(preferred))) {
          score += 8;
          reasons.push(`language fit: ${request.preferredLanguageOther}`);
        }
      }
      if (score <= 0 && reasons.length === 0) reasons.push("available verified provider account");
      return {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        role: roles.has("provider_staff") ? "provider_staff" as const : "paralegal" as const,
        imageUrl: provider.imageUrl,
        region: profile?.region,
        district: profile?.district,
        specializations,
        languages,
        availabilityStatus,
        weeklyCapacity,
        remainingCapacity,
        workingHours: profile?.workingHours,
        availabilityNotes: profile?.availabilityNotes,
        activeLoad,
        score,
        reasons,
      };
    }));

    return providers
      .filter((provider) => provider !== null)
      .sort((a, b) => b.score - a.score || a.activeLoad - b.activeLoad || a.name.localeCompare(b.name))
      .slice(0, 8);
  },
});

export const staffAssignmentOffers = query({
  args: {
    status: v.optional(v.union(
      v.literal("offered"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("expired"),
      v.literal("ended"),
    )),
  },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const assignments = args.status
      ? await ctx.db
        .query("case_assignments")
        .filter((q) => q.eq(q.field("status"), args.status))
        .collect()
      : await ctx.db.query("case_assignments").collect();
    const now = Date.now();
    const rows = await Promise.all(assignments.map(async (assignment) => {
      const expiresAt = assignment.expiresAt ?? assignmentOfferExpiresAt(assignment.offeredAt);
      const responseAt = assignment.respondedAt ?? assignment.endedAt;
      const responseHours = responseAt ? Math.max(0, Math.round(((responseAt - assignment.offeredAt) / (60 * 60 * 1000)) * 10) / 10) : null;
      return {
        assignment,
        case: await ctx.db.get(assignment.caseId),
        assignee: await ctx.db.get(assignment.assigneeId),
        offeredBy: await ctx.db.get(assignment.offeredBy),
        history: {
          expiresAt,
          isOverdue: assignment.status === "offered" && expiresAt <= now,
          responseHours,
          offerAgeHours: Math.max(0, Math.round(((now - assignment.offeredAt) / (60 * 60 * 1000)) * 10) / 10),
          availabilityStatus: assignment.availabilityStatus ?? "unknown",
          availabilityOverrideReason: assignment.availabilityOverrideReason,
        },
      };
    }));
    return rows.sort((a, b) => {
      const aTime = a.assignment.expiresAt ?? a.assignment.offeredAt;
      const bTime = b.assignment.expiresAt ?? b.assignment.offeredAt;
      return bTime - aTime;
    }).slice(0, 100);
  },
});

export const getCase = query({
  args: { caseId: v.id("cases") },
  handler: async (ctx, args) => {
    const access = await requireCaseAccess(ctx, args.caseId);
    const events = await ctx.db
      .query("case_events")
      .withIndex("by_case_time", (q) => q.eq("caseId", args.caseId))
      .order("asc")
      .collect();
    const isBeneficiary = access.caseRecord.beneficiaryId === access.user._id;
    const visibleEvents = isBeneficiary
      ? events.filter((event) => event.audience !== "workers")
      : events;
    const appointments = await ctx.db
      .query("case_appointments")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect();
    const outcome = await ctx.db
      .query("case_outcomes")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .unique();
    const feedback = isBeneficiary
      ? await ctx.db.query("case_feedback").withIndex("by_case", (q) => q.eq("caseId", args.caseId)).unique()
      : null;
    const reviewRequests = isBeneficiary
      ? await ctx.db
        .query("case_review_requests")
        .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
        .order("desc")
        .collect()
      : [];
    const now = Date.now();
    const assignmentRows = isBeneficiary
      ? []
      : await ctx.db.query("case_assignments").withIndex("by_case", (q) => q.eq("caseId", args.caseId)).collect();
    const assignmentHistory = await Promise.all(assignmentRows
      .sort((a, b) => b.offeredAt - a.offeredAt)
      .map(async (assignment) => {
        const expiresAt = assignment.expiresAt ?? assignmentOfferExpiresAt(assignment.offeredAt);
        const responseAt = assignment.respondedAt ?? assignment.endedAt;
        const responseHours = responseAt ? Math.max(0, Math.round(((responseAt - assignment.offeredAt) / (60 * 60 * 1000)) * 10) / 10) : null;
        const [assignee, offeredBy] = await Promise.all([
          ctx.db.get(assignment.assigneeId),
          ctx.db.get(assignment.offeredBy),
        ]);
        return {
          assignment,
          assigneeName: assignee?.name ?? "Unknown provider",
          offeredByName: offeredBy?.name ?? "LSF staff",
          history: {
            expiresAt,
            isOverdue: assignment.status === "offered" && expiresAt <= now,
            responseHours,
            offerAgeHours: Math.max(0, Math.round(((now - assignment.offeredAt) / (60 * 60 * 1000)) * 10) / 10),
            availabilityStatus: assignment.availabilityStatus ?? "unknown",
            availabilityOverrideReason: assignment.availabilityOverrideReason,
          },
        };
      }));
    const closureReadiness = isBeneficiary ? null : await getClosureReadiness(ctx, args.caseId);
    return { case: access.caseRecord, events: visibleEvents, appointments, outcome, feedback, reviewRequests, assignmentHistory, closureReadiness };
  },
});

export const offerAssignment = mutation({
  args: {
    caseId: v.id("cases"),
    assigneeId: v.id("users"),
    availabilityOverrideReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user, caseRecord } = await requireCaseWorker(ctx, args.caseId);
    const assigneeRoles = await getActorRoleSet(ctx, args.assigneeId);
    if (!assigneeRoles.has("paralegal") && !assigneeRoles.has("provider_staff")) {
      throw new ConvexError({ code: "VALIDATION", message: "Assignee is not an active verified service provider" });
    }
    if (["resolved", "closed_unresolved", "closed"].includes(caseRecord.status)) {
      throw new ConvexError({ code: "CONFLICT", message: "Closed cases cannot be assigned" });
    }

    const openAssignments = await ctx.db
      .query("case_assignments")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .filter((q) => q.or(q.eq(q.field("status"), "offered"), q.eq(q.field("status"), "accepted")))
      .collect();
    if (openAssignments.some((assignment) => assignment.assigneeId === args.assigneeId)) {
      return openAssignments.find((assignment) => assignment.assigneeId === args.assigneeId)!._id;
    }
    if (openAssignments.some((assignment) => assignment.status === "accepted")) {
      throw new ConvexError({ code: "CONFLICT", message: "Case already has an active assignee" });
    }

    const availability = await requireAssignableAvailability(ctx, args.assigneeId, args.availabilityOverrideReason);
    const now = Date.now();
    const expiresAt = assignmentOfferExpiresAt(now);
    const assignmentId = await ctx.db.insert("case_assignments", {
      caseId: args.caseId,
      assigneeId: args.assigneeId,
      offeredBy: user._id,
      status: "offered",
      offeredAt: now,
      expiresAt,
      availabilityStatus: availability.availabilityStatus,
      availabilityOverrideReason: availability.availabilityOverrideReason,
    });
    if (caseRecord.status !== "assignment_pending") {
      assertCaseTransition(caseRecord.status, "assignment_pending");
      await ctx.db.patch(caseRecord._id, {
        status: "assignment_pending",
        version: caseRecord.version + 1,
        updatedAt: now,
      });
    }
    await addEvent(ctx, {
      caseId: args.caseId,
      actorId: user._id,
      type: "assignment_offered",
      audience: "workers",
      metadata: { assignmentId, assigneeId: args.assigneeId, expiresAt, ...availability },
    });
    await createNotification(ctx, {
      userId: args.assigneeId,
      type: "assignment.offered",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.assignmentOffered.body",
      resourceType: "case_assignment",
      resourceId: assignmentId,
    });
    await writeAudit(ctx, user._id, "assignment.offered", "case_assignment", assignmentId, { caseId: args.caseId, ...availability });
    return assignmentId;
  },
});

export const reassignCase = mutation({
  args: {
    caseId: v.id("cases"),
    newAssigneeId: v.id("users"),
    reason: v.optional(v.string()),
    resolutionNote: v.optional(v.string()),
    availabilityOverrideReason: v.optional(v.string()),
    reviewRequestId: v.optional(v.id("case_review_requests")),
  },
  handler: async (ctx, args) => {
    const { user, caseRecord } = await requireCaseWorker(ctx, args.caseId);
    const assigneeRoles = await getActorRoleSet(ctx, args.newAssigneeId);
    if (!assigneeRoles.has("paralegal") && !assigneeRoles.has("provider_staff")) {
      throw new ConvexError({ code: "VALIDATION", message: "New assignee is not an active verified service provider" });
    }
    if (["resolved", "closed_unresolved", "closed"].includes(caseRecord.status)) {
      throw new ConvexError({ code: "CONFLICT", message: "Closed cases cannot be reassigned" });
    }

    const now = Date.now();
    const openAssignments = await ctx.db
      .query("case_assignments")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .filter((q) => q.or(q.eq(q.field("status"), "offered"), q.eq(q.field("status"), "accepted")))
      .collect();
    if (openAssignments.some((assignment) => assignment.assigneeId === args.newAssigneeId)) {
      throw new ConvexError({ code: "CONFLICT", message: "New assignee already has an open assignment on this case" });
    }
    const availability = await requireAssignableAvailability(ctx, args.newAssigneeId, args.availabilityOverrideReason);

    const endedAssigneeIds = new Set<Id<"users">>();
    for (const assignment of openAssignments) {
      const nextStatus = assignment.status === "accepted" ? "ended" : "expired";
      endedAssigneeIds.add(assignment.assigneeId);
      await ctx.db.patch(assignment._id, {
        status: nextStatus,
        reason: normalizeOptionalText(args.reason, "Reassignment reason", 500),
        endedAt: now,
      });
    }

    const activeParticipants = await ctx.db
      .query("case_participants")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    for (const participant of activeParticipants) {
      if (participant.role === "beneficiary" || participant.role === "case_officer" || participant.role === "supervisor") continue;
      if (!endedAssigneeIds.has(participant.userId)) continue;
      await ctx.db.patch(participant._id, { status: "inactive", removedAt: now });
    }

    const assignmentId = await ctx.db.insert("case_assignments", {
      caseId: args.caseId,
      assigneeId: args.newAssigneeId,
      offeredBy: user._id,
      status: "offered",
      offeredAt: now,
      expiresAt: assignmentOfferExpiresAt(now),
      reason: normalizeOptionalText(args.reason, "Reassignment reason", 500),
      availabilityStatus: availability.availabilityStatus,
      availabilityOverrideReason: availability.availabilityOverrideReason,
    });

    if (caseRecord.status !== "assignment_pending") {
      assertCaseTransition(caseRecord.status, "assignment_pending");
      await ctx.db.patch(caseRecord._id, {
        status: "assignment_pending",
        version: caseRecord.version + 1,
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(caseRecord._id, { updatedAt: now });
    }

    if (args.reviewRequestId) {
      const review = await ctx.db.get(args.reviewRequestId);
      if (review && review.caseId === args.caseId && !["resolved", "declined"].includes(review.status)) {
        await ctx.db.patch(review._id, {
          status: "resolved",
          resolutionNote: normalizeOptionalText(args.resolutionNote ?? "Reassignment offer sent.", "Resolution note", 1200),
          resolvedBy: user._id,
          resolvedAt: now,
          updatedAt: now,
        });
      }
    }

    await addEvent(ctx, {
      caseId: args.caseId,
      actorId: user._id,
      type: "assignment_reassigned",
      audience: "all",
      publicLabelKey: "case.timeline.assignmentPending",
      metadata: { assignmentId, endedAssigneeIds: [...endedAssigneeIds], ...availability },
    });
    for (const previousAssigneeId of endedAssigneeIds) {
      await createNotification(ctx, {
        userId: previousAssigneeId,
        type: "assignment.ended",
        titleKey: "notifications.update.title",
        bodyKey: "notifications.assignmentEnded.body",
        resourceType: "case",
        resourceId: args.caseId,
      });
    }
    await createNotification(ctx, {
      userId: args.newAssigneeId,
      type: "assignment.offered",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.assignmentOffered.body",
      resourceType: "case_assignment",
      resourceId: assignmentId,
    });
    await createNotification(ctx, {
      userId: caseRecord.beneficiaryId,
      type: "case.status_changed",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.caseStatusChanged.body",
      resourceType: "case",
      resourceId: caseRecord._id,
    });
    await writeAudit(ctx, user._id, "assignment.reassigned", "case_assignment", assignmentId, {
      caseId: args.caseId,
      changedFieldNames: ["status", "assigneeId"],
      previousAssigneeIds: [...endedAssigneeIds],
      newAssigneeId: args.newAssigneeId,
      reviewRequestId: args.reviewRequestId,
      ...availability,
    });
    return { assignmentId, endedAssigneeIds: [...endedAssigneeIds] };
  },
});

export const assignmentInbox = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAnyRole(ctx, ["paralegal", "provider_staff"]);
    const now = Date.now();
    const assignments = await ctx.db
      .query("case_assignments")
      .withIndex("by_assignee_status", (q) => q.eq("assigneeId", user._id).eq("status", "offered"))
      .order("desc")
      .collect();
    const activeOffers = assignments.filter((assignment) => (assignment.expiresAt ?? assignmentOfferExpiresAt(assignment.offeredAt)) > now);
    return await Promise.all(activeOffers.map(async (assignment) => ({
      assignment,
      case: await ctx.db.get(assignment.caseId),
    })));
  },
});

export const respondToAssignment = mutation({
  args: {
    assignmentId: v.id("case_assignments"),
    response: v.union(v.literal("accepted"), v.literal("declined")),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["paralegal", "provider_staff"]);
    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) throw new ConvexError({ code: "NOT_FOUND", message: "Assignment not found" });
    if (assignment.assigneeId !== user._id) throw new ConvexError({ code: "FORBIDDEN", message: "Assignment access denied" });
    if (assignment.status !== "offered") {
      if (assignment.status === args.response) return { status: assignment.status };
      throw new ConvexError({ code: "CONFLICT", message: "Assignment has already been answered" });
    }

    const caseRecord = await ctx.db.get(assignment.caseId);
    if (!caseRecord) throw new ConvexError({ code: "NOT_FOUND", message: "Case not found" });
    const now = Date.now();
    if ((assignment.expiresAt ?? assignmentOfferExpiresAt(assignment.offeredAt)) <= now) {
      await expireAssignmentOffer(ctx, {
        assignmentId: assignment._id,
        now,
        actorId: user._id,
        reason: "Provider response arrived after the offer expiry window.",
      });
      throw new ConvexError({ code: "CONFLICT", message: "Assignment offer has expired" });
    }
    await ctx.db.patch(assignment._id, {
      status: args.response,
      reason: normalizeOptionalText(args.reason, "Reason", 500),
      respondedAt: now,
    });

    if (args.response === "accepted") {
      const participant = await ctx.db
        .query("case_participants")
        .withIndex("by_case_user", (q) => q.eq("caseId", caseRecord._id).eq("userId", user._id))
        .unique();
      if (participant) {
        await ctx.db.patch(participant._id, { status: "active", removedAt: undefined });
      } else {
        await ctx.db.insert("case_participants", {
          caseId: caseRecord._id,
          userId: user._id,
          role: "paralegal",
          status: "active",
          addedBy: assignment.offeredBy,
          addedAt: now,
        });
      }
      assertCaseTransition(caseRecord.status, "assigned");
      await ctx.db.patch(caseRecord._id, {
        status: "assigned",
        version: caseRecord.version + 1,
        updatedAt: now,
      });
      await addEvent(ctx, {
        caseId: caseRecord._id,
        actorId: user._id,
        type: "assignment_accepted",
        audience: "all",
        publicLabelKey: "case.timeline.assigned",
      });
      await createNotification(ctx, {
        userId: caseRecord.beneficiaryId,
        type: "assignment.accepted",
        titleKey: "notifications.update.title",
        bodyKey: "notifications.assignmentAccepted.body",
        resourceType: "case",
        resourceId: caseRecord._id,
      });
    } else {
      await addEvent(ctx, {
        caseId: caseRecord._id,
        actorId: user._id,
        type: "assignment_declined",
        audience: "workers",
      });
    }
    await writeAudit(ctx, user._id, `assignment.${args.response}`, "case_assignment", assignment._id, {
      caseId: caseRecord._id,
    });
    return { status: args.response };
  },
});

export const expireStaleAssignmentOffers = internalMutation({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const limit = Math.min(Math.max(Math.trunc(args.limit ?? ASSIGNMENT_EXPIRY_BATCH_LIMIT), 1), 100);
    const assignments = await ctx.db
      .query("case_assignments")
      .withIndex("by_status_expires", (q) => q.eq("status", "offered").lte("expiresAt", now))
      .take(limit);
    const expired = [];
    for (const assignment of assignments) {
      const result = await expireAssignmentOffer(ctx, {
        assignmentId: assignment._id,
        now,
        actorId: assignment.offeredBy,
      });
      if (result) expired.push(result);
    }
    return { expiredCount: expired.length, expired };
  },
});

export const expireStaleAssignmentOffersNow = mutation({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const now = Date.now();
    const limit = Math.min(Math.max(Math.trunc(args.limit ?? ASSIGNMENT_EXPIRY_BATCH_LIMIT), 1), 100);
    const assignments = await ctx.db
      .query("case_assignments")
      .withIndex("by_status_expires", (q) => q.eq("status", "offered").lte("expiresAt", now))
      .take(limit);
    const expired = [];
    for (const assignment of assignments) {
      const result = await expireAssignmentOffer(ctx, {
        assignmentId: assignment._id,
        now,
        actorId: user._id,
      });
      if (result) expired.push(result);
    }
    return { expiredCount: expired.length, expired };
  },
});

export const updateStatus = mutation({
  args: {
    caseId: v.id("cases"),
    status: caseStatusValidator,
    expectedVersion: v.number(),
  },
  handler: async (ctx, args) => {
    const { user, caseRecord } = await requireCaseWorker(ctx, args.caseId);
    if (caseRecord.version !== args.expectedVersion) {
      throw new ConvexError({ code: "CONFLICT", message: "Case was updated by another user" });
    }
    assertCaseTransition(caseRecord.status, args.status);
    if (args.status === "closed") {
      const closureReadiness = await getClosureReadiness(ctx, args.caseId);
      if (!closureReadiness.canClose) {
        throw new ConvexError({
          code: "VALIDATION",
          message: `Case is not ready to close: ${closureReadiness.missing.join(" ")}`,
        });
      }
    }
    const now = Date.now();
    await ctx.db.patch(caseRecord._id, {
      status: args.status,
      version: caseRecord.version + 1,
      updatedAt: now,
      closedAt: args.status === "closed" ? now : caseRecord.closedAt,
    });
    await addEvent(ctx, {
      caseId: caseRecord._id,
      actorId: user._id,
      type: "case_status_changed",
      audience: "all",
      publicLabelKey: `case.timeline.${args.status}`,
      metadata: { from: caseRecord.status, to: args.status },
    });
    await createNotification(ctx, {
      userId: caseRecord.beneficiaryId,
      type: "case.status_changed",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.caseStatusChanged.body",
      resourceType: "case",
      resourceId: caseRecord._id,
    });
    await writeAudit(ctx, user._id, "case.status_changed", "case", caseRecord._id, {
      changedFieldNames: ["status"],
      from: caseRecord.status,
      to: args.status,
    });
    return { status: args.status, version: caseRecord.version + 1 };
  },
});

export const listMessages = query({
  args: { caseId: v.id("cases") },
  handler: async (ctx, args) => {
    await requireCaseAccess(ctx, args.caseId);
    const conversation = await ctx.db
      .query("case_conversations")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .unique();
    if (!conversation) return [];
    return await ctx.db
      .query("case_messages")
      .withIndex("by_conversation_time", (q) => q.eq("conversationId", conversation._id))
      .order("asc")
      .take(200);
  },
});

export const generateDocumentUploadUrl = mutation({
  args: { caseId: v.id("cases") },
  handler: async (ctx, args) => {
    await requireCaseAccess(ctx, args.caseId);
    return await ctx.storage.generateUploadUrl();
  },
});

export const addDocument = mutation({
  args: {
    caseId: v.id("cases"),
    storageId: v.id("_storage"),
    clientDocumentId: v.string(),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    category: documentCategoryValidator,
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireCaseAccess(ctx, args.caseId);
    const clientDocumentId = normalizeText(args.clientDocumentId, "Client document ID", 100);
    const existing = await ctx.db
      .query("case_documents")
      .withIndex("by_uploader_client", (q) => q.eq("uploaderId", user._id).eq("clientDocumentId", clientDocumentId))
      .unique();
    if (existing) return existing._id;

    const metadata = await ctx.db.system.get(args.storageId);
    if (!metadata) throw new ConvexError({ code: "NOT_FOUND", message: "Uploaded file not found" });
    const file = assertAllowedUpload({
      name: args.name,
      type: metadata.contentType || args.type,
      size: metadata.size,
      maxBytes: MAX_CASE_DOCUMENT_BYTES,
    });
    if (metadata.contentType && metadata.contentType.toLowerCase() !== args.type.toLowerCase()) {
      throw new ConvexError({ code: "VALIDATION", message: "Uploaded file type does not match the selected file" });
    }

    const now = Date.now();
    const documentId = await ctx.db.insert("case_documents", {
      caseId: args.caseId,
      uploaderId: user._id,
      storageId: args.storageId,
      clientDocumentId,
      name: file.name,
      type: file.type,
      size: metadata.size,
      category: args.category,
      note: normalizeOptionalText(args.note, "Document note", 500),
      status: "pending_review",
      createdAt: now,
    });
    await addEvent(ctx, {
      caseId: args.caseId,
      actorId: user._id,
      type: "document_uploaded",
      audience: "workers",
      metadata: { documentId, category: args.category },
    });
    await writeAudit(ctx, user._id, "case_document.uploaded", "case_document", documentId, {
      caseId: args.caseId,
      changedFieldNames: ["status"],
    });
    return documentId;
  },
});

export const listDocuments = query({
  args: { caseId: v.id("cases") },
  handler: async (ctx, args) => {
    await requireCaseAccess(ctx, args.caseId);
    const documents = await ctx.db
      .query("case_documents")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .order("desc")
      .collect();
    return await Promise.all(documents.map(async (document) => ({
      ...document,
      url: document.storageId ? await ctx.storage.getUrl(document.storageId) : null,
    })));
  },
});

export const addGeneratedLetterDocument = mutation({
  args: {
    caseId: v.id("cases"),
    clientDocumentId: v.string(),
    name: v.string(),
    textContent: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireCaseAccess(ctx, args.caseId);
    const clientDocumentId = normalizeText(args.clientDocumentId, "Client document ID", 100);
    const existing = await ctx.db
      .query("case_documents")
      .withIndex("by_uploader_client", (q) => q.eq("uploaderId", user._id).eq("clientDocumentId", clientDocumentId))
      .unique();
    if (existing) return existing._id;

    const textContent = normalizeText(args.textContent, "Letter content", 12000);
    const now = Date.now();
    const documentId = await ctx.db.insert("case_documents", {
      caseId: args.caseId,
      uploaderId: user._id,
      clientDocumentId,
      name: normalizeText(args.name, "Document name", 180),
      type: "text/plain",
      size: textContent.length,
      category: "letter",
      textContent,
      source: "letter_builder",
      note: normalizeOptionalText(args.note, "Document note", 500),
      status: "pending_review",
      createdAt: now,
    });
    await addEvent(ctx, {
      caseId: args.caseId,
      actorId: user._id,
      type: "document_uploaded",
      audience: "workers",
      metadata: { documentId, category: "letter", source: "letter_builder" },
    });
    await writeAudit(ctx, user._id, "case_document.generated_letter", "case_document", documentId, {
      caseId: args.caseId,
      changedFieldNames: ["status", "textContent", "source"],
    });
    return documentId;
  },
});

export const myDocuments = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const owned = await ctx.db
      .query("cases")
      .withIndex("by_beneficiary", (q) => q.eq("beneficiaryId", user._id))
      .collect();
    const participantLinks = await ctx.db
      .query("case_participants")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    const participantCases = await Promise.all(participantLinks.map((link) => ctx.db.get(link.caseId)));
    const accessibleCases = new Map(owned.map((record) => [record._id, record]));
    for (const record of participantCases) if (record) accessibleCases.set(record._id, record);

    const rows = await Promise.all([...accessibleCases.values()].map(async (caseRecord) => {
      const documents = await ctx.db
        .query("case_documents")
        .withIndex("by_case", (q) => q.eq("caseId", caseRecord._id))
        .collect();
      return await Promise.all(documents.map(async (document) => ({
        ...document,
        casePublicId: caseRecord.publicId,
        caseSummary: caseRecord.summary,
        url: document.storageId ? await ctx.storage.getUrl(document.storageId) : null,
      })));
    }));
    return rows.flat().sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
  },
});

export const staffDocumentQueue = query({
  args: { status: v.optional(documentStatusValidator) },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const status = args.status ?? "pending_review";
    const documents = await ctx.db
      .query("case_documents")
      .filter((q) => q.eq(q.field("status"), status))
      .order("desc")
      .take(100);
    return await Promise.all(documents.map(async (document) => ({
      document,
      case: await ctx.db.get(document.caseId),
      uploader: await ctx.db.get(document.uploaderId),
      url: document.storageId ? await ctx.storage.getUrl(document.storageId) : null,
    })));
  },
});

export const reviewDocument = mutation({
  args: {
    documentId: v.id("case_documents"),
    status: documentStatusValidator,
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new ConvexError({ code: "NOT_FOUND", message: "Document not found" });
    const actor = await requireAuthenticatedUser(ctx);
    const roles = await getActorRoleSet(ctx, actor.user._id);
    const isStaffReviewer = roles.has("admin") || roles.has("staff") || roles.has("supervisor");
    const user = isStaffReviewer ? actor.user : (await requireCaseWorker(ctx, document.caseId)).user;
    if (args.status === "pending_review") {
      throw new ConvexError({ code: "VALIDATION", message: "Choose accepted or rejected" });
    }
    const now = Date.now();
    await ctx.db.patch(document._id, {
      status: args.status,
      reviewedBy: user._id,
      reviewedAt: now,
      reviewNotes: normalizeOptionalText(args.reviewNotes, "Review notes", 1000),
    });
    await addEvent(ctx, {
      caseId: document.caseId,
      actorId: user._id,
      type: `document_${args.status}`,
      audience: "workers",
      metadata: { documentId: document._id },
    });
    await writeAudit(ctx, user._id, "case_document.reviewed", "case_document", document._id, {
      caseId: document.caseId,
      changedFieldNames: ["status"],
      from: document.status,
      to: args.status,
    });
    return { status: args.status };
  },
});

export const sendMessage = mutation({
  args: {
    caseId: v.id("cases"),
    clientMessageId: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const { user, caseRecord } = await requireCaseAccess(ctx, args.caseId);
    const clientMessageId = normalizeText(args.clientMessageId, "Client message ID", 100);
    const existing = await ctx.db
      .query("case_messages")
      .withIndex("by_sender_client", (q) => q.eq("senderId", user._id).eq("clientMessageId", clientMessageId))
      .unique();
    if (existing) return existing._id;

    const conversation = await ctx.db
      .query("case_conversations")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .unique();
    if (!conversation || conversation.status !== "active") {
      throw new ConvexError({ code: "CONFLICT", message: "Case conversation is unavailable" });
    }
    const now = Date.now();
    const messageId = await ctx.db.insert("case_messages", {
      conversationId: conversation._id,
      caseId: args.caseId,
      senderId: user._id,
      clientMessageId,
      type: "text",
      body: normalizeText(args.body, "Message", 4000),
      createdAt: now,
    });
    const participants = await ctx.db
      .query("case_participants")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    for (const participant of participants) {
      if (participant.userId === user._id) continue;
      await createNotification(ctx, {
        userId: participant.userId,
        type: "message.received",
        titleKey: "notifications.update.title",
        bodyKey: "notifications.messageReceived.body",
        resourceType: "case",
        resourceId: caseRecord._id,
      });
    }
    await writeAudit(ctx, user._id, "message.sent", "case_message", messageId, { caseId: caseRecord._id });
    return messageId;
  },
});

export const scheduleAppointment = mutation({
  args: {
    caseId: v.id("cases"),
    startsAt: v.number(),
    mode: v.union(v.literal("in_person"), v.literal("phone"), v.literal("remote")),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user, caseRecord } = await requireCaseWorker(ctx, args.caseId);
    if (args.startsAt <= Date.now()) throw new ConvexError({ code: "VALIDATION", message: "Appointment must be in the future" });
    const now = Date.now();
    const appointmentId = await ctx.db.insert("case_appointments", {
      caseId: args.caseId,
      createdBy: user._id,
      startsAt: args.startsAt,
      mode: args.mode,
      location: normalizeOptionalText(args.location, "Location", 300),
      status: "scheduled",
      createdAt: now,
      updatedAt: now,
    });
    if (["assigned", "assistance_underway"].includes(caseRecord.status)) {
      assertCaseTransition(caseRecord.status, "appointment_scheduled");
      await ctx.db.patch(caseRecord._id, {
        status: "appointment_scheduled",
        version: caseRecord.version + 1,
        updatedAt: now,
      });
    }
    await addEvent(ctx, {
      caseId: args.caseId,
      actorId: user._id,
      type: "appointment_created",
      audience: "all",
      publicLabelKey: "case.timeline.appointmentScheduled",
      metadata: { appointmentId, startsAt: args.startsAt },
    });
    await createNotification(ctx, {
      userId: caseRecord.beneficiaryId,
      type: "appointment.created",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.appointmentCreated.body",
      resourceType: "case_appointment",
      resourceId: appointmentId,
    });
    await writeAudit(ctx, user._id, "appointment.created", "case_appointment", appointmentId, { caseId: args.caseId });
    return appointmentId;
  },
});

export const scheduleAppointmentFromRequest = mutation({
  args: {
    caseId: v.id("cases"),
    requestEventId: v.id("case_events"),
    startsAt: v.number(),
    mode: v.union(v.literal("in_person"), v.literal("phone"), v.literal("remote")),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user, caseRecord } = await requireCaseWorker(ctx, args.caseId);
    const requestEvent = await ctx.db.get(args.requestEventId);
    if (!requestEvent || requestEvent.caseId !== args.caseId || requestEvent.type !== "appointment_requested") {
      throw new ConvexError({ code: "NOT_FOUND", message: "Appointment request event not found" });
    }
    if (["resolved", "closed_unresolved", "closed"].includes(caseRecord.status)) {
      throw new ConvexError({ code: "CONFLICT", message: "Closed cases cannot receive appointments" });
    }
    if (args.startsAt <= Date.now()) throw new ConvexError({ code: "VALIDATION", message: "Appointment must be in the future" });

    const requestMetadata = requestEvent.metadata && typeof requestEvent.metadata === "object"
      ? requestEvent.metadata as Record<string, unknown>
      : {};
    if (requestMetadata.scheduledAppointmentId) {
      throw new ConvexError({ code: "CONFLICT", message: "This appointment request is already scheduled" });
    }

    const now = Date.now();
    const appointmentId = await ctx.db.insert("case_appointments", {
      caseId: args.caseId,
      createdBy: user._id,
      startsAt: args.startsAt,
      mode: args.mode,
      location: normalizeOptionalText(args.location, "Location", 300),
      status: "scheduled",
      statusNote: normalizeOptionalText(
        [
          requestMetadata.preferredMode ? `Requested mode: ${requestMetadata.preferredMode}` : "",
          requestMetadata.preferredTime ? `Preferred time: ${requestMetadata.preferredTime}` : "",
          requestMetadata.note ? `Beneficiary note: ${requestMetadata.note}` : "",
        ].filter(Boolean).join("\n"),
        "Appointment request context",
        800,
      ),
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(requestEvent._id, {
      metadata: {
        ...requestMetadata,
        scheduledAppointmentId: appointmentId,
        scheduledAt: now,
        scheduledBy: user._id,
      },
    });

    if (["assigned", "assistance_underway"].includes(caseRecord.status)) {
      assertCaseTransition(caseRecord.status, "appointment_scheduled");
      await ctx.db.patch(caseRecord._id, {
        status: "appointment_scheduled",
        version: caseRecord.version + 1,
        updatedAt: now,
      });
    }
    await addEvent(ctx, {
      caseId: args.caseId,
      actorId: user._id,
      type: "appointment_created",
      audience: "all",
      publicLabelKey: "case.timeline.appointmentScheduled",
      metadata: { appointmentId, startsAt: args.startsAt, sourceRequestEventId: args.requestEventId },
    });
    await createNotification(ctx, {
      userId: caseRecord.beneficiaryId,
      type: "appointment.created",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.appointmentCreated.body",
      resourceType: "case_appointment",
      resourceId: appointmentId,
    });
    await writeAudit(ctx, user._id, "appointment.created_from_request", "case_appointment", appointmentId, {
      caseId: args.caseId,
      requestEventId: args.requestEventId,
      changedFieldNames: ["case_appointments", "case_events.metadata"],
    });
    return appointmentId;
  },
});

export const updateAppointmentStatus = mutation({
  args: {
    appointmentId: v.id("case_appointments"),
    status: v.union(v.literal("completed"), v.literal("cancelled"), v.literal("missed")),
    statusNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment) throw new ConvexError({ code: "NOT_FOUND", message: "Appointment not found" });
    const { user, caseRecord } = await requireCaseWorker(ctx, appointment.caseId);
    if (["resolved", "closed_unresolved", "closed"].includes(caseRecord.status)) {
      throw new ConvexError({ code: "CONFLICT", message: "Closed cases cannot update appointments" });
    }
    if (appointment.status !== "scheduled") {
      if (appointment.status === args.status) return { appointmentId: appointment._id, status: appointment.status };
      throw new ConvexError({ code: "CONFLICT", message: "Only scheduled appointments can be updated" });
    }

    const now = Date.now();
    const statusNote = normalizeOptionalText(args.statusNote, "Appointment status note", 800);
    await ctx.db.patch(appointment._id, {
      status: args.status,
      statusNote,
      statusUpdatedBy: user._id,
      statusUpdatedAt: now,
      updatedAt: now,
    });
    if (args.status === "completed" && caseRecord.status === "appointment_scheduled") {
      assertCaseTransition(caseRecord.status, "assistance_underway");
      await ctx.db.patch(caseRecord._id, {
        status: "assistance_underway",
        version: caseRecord.version + 1,
        updatedAt: now,
      });
    }
    await addEvent(ctx, {
      caseId: appointment.caseId,
      actorId: user._id,
      type: `appointment_${args.status}`,
      audience: "all",
      publicLabelKey: args.status === "completed" ? "case.timeline.assistance_underway" : "case.timeline.appointmentScheduled",
      metadata: { appointmentId: appointment._id, status: args.status },
    });
    await createNotification(ctx, {
      userId: caseRecord.beneficiaryId,
      type: "appointment.changed",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.appointmentChanged.body",
      resourceType: "case_appointment",
      resourceId: appointment._id,
    });
    await writeAudit(ctx, user._id, `appointment.${args.status}`, "case_appointment", appointment._id, {
      caseId: appointment.caseId,
      changedFieldNames: ["status", "statusNote", "statusUpdatedAt"],
    });
    return { appointmentId: appointment._id, status: args.status };
  },
});

export const myAppointments = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const owned = await ctx.db
      .query("cases")
      .withIndex("by_beneficiary", (q) => q.eq("beneficiaryId", user._id))
      .collect();
    const participantLinks = await ctx.db
      .query("case_participants")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    const participantCases = await Promise.all(participantLinks.map((link) => ctx.db.get(link.caseId)));
    const accessibleCases = new Map(owned.map((record) => [record._id, record]));
    for (const record of participantCases) if (record) accessibleCases.set(record._id, record);

    const rows = await Promise.all([...accessibleCases.values()].map(async (caseRecord) => {
      const appointments = await ctx.db
        .query("case_appointments")
        .withIndex("by_case", (q) => q.eq("caseId", caseRecord._id))
        .collect();
      return appointments.map((appointment) => ({
        ...appointment,
        casePublicId: caseRecord.publicId,
        caseSummary: caseRecord.summary,
      }));
    }));
    return rows.flat().sort((a, b) => {
      if (a.status === "scheduled" && b.status !== "scheduled") return -1;
      if (a.status !== "scheduled" && b.status === "scheduled") return 1;
      return a.status === "scheduled" ? a.startsAt - b.startsAt : b.startsAt - a.startsAt;
    }).slice(0, 100);
  },
});

export const sendUpcomingAppointmentReminders = internalMutation({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const limit = Math.min(
      Math.max(Math.trunc(args.limit ?? APPOINTMENT_REMINDER_BATCH_LIMIT), 1),
      APPOINTMENT_REMINDER_BATCH_LIMIT,
    );
    const upcoming = await ctx.db
      .query("case_appointments")
      .withIndex("by_status_start", (q) => (
        q.eq("status", "scheduled")
          .gte("startsAt", now)
          .lte("startsAt", now + APPOINTMENT_REMINDER_WINDOW_MS)
      ))
      .take(limit);

    let sent = 0;
    let skipped = 0;
    for (const appointment of upcoming) {
      if (appointment.reminderSentAt) {
        skipped += 1;
        continue;
      }
      const caseRecord = await ctx.db.get(appointment.caseId);
      if (!caseRecord || ["resolved", "closed_unresolved", "closed"].includes(caseRecord.status)) {
        skipped += 1;
        continue;
      }
      await createNotification(ctx, {
        userId: caseRecord.beneficiaryId,
        type: "appointment.reminder",
        titleKey: "notifications.update.title",
        bodyKey: "notifications.appointmentReminder.body",
        resourceType: "case_appointment",
        resourceId: appointment._id,
      });
      await ctx.db.patch(appointment._id, { reminderSentAt: now, updatedAt: now });
      sent += 1;
    }
    return { scanned: upcoming.length, sent, skipped };
  },
});

export const requestAppointment = mutation({
  args: {
    caseId: v.id("cases"),
    preferredMode: v.union(v.literal("in_person"), v.literal("phone"), v.literal("remote")),
    preferredTime: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user, caseRecord } = await requireCaseAccess(ctx, args.caseId);
    if (["resolved", "closed_unresolved", "closed"].includes(caseRecord.status)) {
      throw new ConvexError({ code: "CONFLICT", message: "Closed cases cannot receive appointment requests" });
    }

    const now = Date.now();
    await addEvent(ctx, {
      caseId: args.caseId,
      actorId: user._id,
      type: "appointment_requested",
      audience: "all",
      publicLabelKey: "case.timeline.appointmentRequested",
      metadata: {
        preferredMode: args.preferredMode,
        preferredTime: normalizeOptionalText(args.preferredTime, "Preferred time", 160),
        note: normalizeOptionalText(args.note, "Appointment note", 800),
      },
    });

    const participants = await ctx.db
      .query("case_participants")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    for (const participant of participants) {
      if (participant.userId === user._id || participant.role === "beneficiary") continue;
      await createNotification(ctx, {
        userId: participant.userId,
        type: "appointment.requested",
        titleKey: "notifications.update.title",
        bodyKey: "notifications.appointmentRequested.body",
        resourceType: "case",
        resourceId: caseRecord._id,
      });
    }
    await writeAudit(ctx, user._id, "appointment.requested", "case", args.caseId, {
      preferredMode: args.preferredMode,
    });
  },
});

export const recordOutcome = mutation({
  args: {
    caseId: v.id("cases"),
    outcomeCode: v.string(),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    const { user, caseRecord } = await requireCaseWorker(ctx, args.caseId);
    const existing = await ctx.db.query("case_outcomes").withIndex("by_case", (q) => q.eq("caseId", args.caseId)).unique();
    if (existing) return existing._id;
    assertCaseTransition(caseRecord.status, "resolved");
    const now = Date.now();
    const outcomeId = await ctx.db.insert("case_outcomes", {
      caseId: args.caseId,
      recordedBy: user._id,
      outcomeCode: normalizeText(args.outcomeCode, "Outcome", 100),
      summary: normalizeText(args.summary, "Outcome summary", 3000),
      recordedAt: now,
    });
    await ctx.db.patch(caseRecord._id, {
      status: "resolved",
      version: caseRecord.version + 1,
      updatedAt: now,
    });
    await addEvent(ctx, {
      caseId: args.caseId,
      actorId: user._id,
      type: "case_resolved",
      audience: "all",
      publicLabelKey: "case.timeline.resolved",
    });
    await createNotification(ctx, {
      userId: caseRecord.beneficiaryId,
      type: "feedback.requested",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.feedbackRequested.body",
      resourceType: "case",
      resourceId: args.caseId,
    });
    await addEvent(ctx, {
      caseId: args.caseId,
      actorId: user._id,
      type: "feedback_requested",
      audience: "beneficiary",
      publicLabelKey: "case.timeline.feedbackRequested",
    });
    await writeAudit(ctx, user._id, "case.outcome_recorded", "case_outcome", outcomeId, { caseId: args.caseId });
    return outcomeId;
  },
});

export const submitFeedback = mutation({
  args: {
    caseId: v.id("cases"),
    rating: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user, caseRecord } = await requireCaseAccess(ctx, args.caseId);
    if (caseRecord.beneficiaryId !== user._id) throw new ConvexError({ code: "FORBIDDEN", message: "Only the beneficiary can give feedback" });
    if (args.rating < 1 || args.rating > 5 || !Number.isInteger(args.rating)) {
      throw new ConvexError({ code: "VALIDATION", message: "Rating must be between 1 and 5" });
    }
    const outcome = await ctx.db.query("case_outcomes").withIndex("by_case", (q) => q.eq("caseId", args.caseId)).unique();
    if (!outcome || !["resolved", "closed"].includes(caseRecord.status)) {
      throw new ConvexError({ code: "CONFLICT", message: "Feedback opens after a case outcome is recorded" });
    }
    const existing = await ctx.db.query("case_feedback").withIndex("by_case", (q) => q.eq("caseId", args.caseId)).unique();
    if (existing) return existing._id;
    const feedbackId = await ctx.db.insert("case_feedback", {
      caseId: args.caseId,
      beneficiaryId: user._id,
      rating: args.rating,
      comment: normalizeOptionalText(args.comment, "Comment", 2000),
      submittedAt: Date.now(),
    });
    await addEvent(ctx, {
      caseId: args.caseId,
      actorId: user._id,
      type: "feedback_received",
      audience: "workers",
    });
    await writeAudit(ctx, user._id, "feedback.submitted", "case_feedback", feedbackId, { caseId: args.caseId });
    return feedbackId;
  },
});

export const requestCaseReview = mutation({
  args: {
    caseId: v.id("cases"),
    reason: reviewRequestReasonValidator,
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user, caseRecord } = await requireCaseAccess(ctx, args.caseId);
    if (caseRecord.beneficiaryId !== user._id) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Only the beneficiary can request a case review" });
    }
    if (["closed", "closed_unresolved"].includes(caseRecord.status)) {
      throw new ConvexError({ code: "CONFLICT", message: "Closed cases cannot receive new review requests" });
    }

    const openRequests = await ctx.db
      .query("case_review_requests")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .filter((q) => q.or(q.eq(q.field("status"), "submitted"), q.eq(q.field("status"), "under_review")))
      .collect();
    if (openRequests.length > 0) return openRequests[0]._id;

    const now = Date.now();
    const reviewRequestId = await ctx.db.insert("case_review_requests", {
      caseId: args.caseId,
      requestedBy: user._id,
      reason: args.reason,
      note: normalizeOptionalText(args.note, "Review request note", 1200),
      status: "submitted",
      createdAt: now,
      updatedAt: now,
    });
    await addEvent(ctx, {
      caseId: args.caseId,
      actorId: user._id,
      type: "case_review_requested",
      audience: "beneficiary",
      publicLabelKey: "case.timeline.reviewRequested",
    });
    await notifySupervisors(ctx, {
      type: "case.review_requested",
      resourceType: "case_review_request",
      resourceId: reviewRequestId,
    });
    await writeAudit(ctx, user._id, "case_review.requested", "case_review_request", reviewRequestId, {
      caseId: args.caseId,
      reason: args.reason,
    });
    return reviewRequestId;
  },
});

export const staffReviewRequests = query({
  args: { status: v.optional(reviewRequestStatusValidator) },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const status = args.status ?? "submitted";
    const reviews = await ctx.db
      .query("case_review_requests")
      .withIndex("by_status", (q) => q.eq("status", status))
      .order("desc")
      .take(100);
    return await Promise.all(reviews.map(async (review) => ({
      review,
      case: await ctx.db.get(review.caseId),
      requester: await ctx.db.get(review.requestedBy),
      participants: await ctx.db
        .query("case_participants")
        .withIndex("by_case", (q) => q.eq("caseId", review.caseId))
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect(),
    })));
  },
});

export const resolveCaseReviewRequest = mutation({
  args: {
    reviewRequestId: v.id("case_review_requests"),
    status: v.union(v.literal("under_review"), v.literal("resolved"), v.literal("declined")),
    resolutionNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const review = await ctx.db.get(args.reviewRequestId);
    if (!review) throw new ConvexError({ code: "NOT_FOUND", message: "Review request not found" });
    if (["resolved", "declined"].includes(review.status)) {
      return { status: review.status };
    }

    const now = Date.now();
    await ctx.db.patch(review._id, {
      status: args.status,
      resolutionNote: normalizeOptionalText(args.resolutionNote, "Resolution note", 1200),
      resolvedBy: args.status === "under_review" ? review.resolvedBy : user._id,
      resolvedAt: args.status === "under_review" ? review.resolvedAt : now,
      updatedAt: now,
    });
    if (args.status !== "under_review") {
      await addEvent(ctx, {
        caseId: review.caseId,
        actorId: user._id,
        type: "case_review_closed",
        audience: "beneficiary",
        publicLabelKey: "case.timeline.reviewClosed",
      });
      await createNotification(ctx, {
        userId: review.requestedBy,
        type: "case.review_closed",
        titleKey: "notifications.update.title",
        bodyKey: "notifications.caseReviewClosed.body",
        resourceType: "case",
        resourceId: review.caseId,
      });
    }
    await writeAudit(ctx, user._id, `case_review.${args.status}`, "case_review_request", review._id, {
      caseId: review.caseId,
      changedFieldNames: ["status"],
      from: review.status,
      to: args.status,
    });
    return { status: args.status };
  },
});
