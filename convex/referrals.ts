import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getActiveRoles, requireAnyRole } from "./lib/auth";
import { assertCaseTransition, requireCaseAccess, requireCaseWorker, writeAudit } from "./lib/hakiYangu";
import { createNotification } from "./lib/notifications";

const referralStatus = v.union(
  v.literal("draft"),
  v.literal("consent_collected"),
  v.literal("created"),
  v.literal("destination_notified"),
  v.literal("accepted"),
  v.literal("declined"),
  v.literal("scheduled"),
  v.literal("service_delivered"),
  v.literal("referred_onward"),
  v.literal("closed"),
  v.literal("returned"),
  v.literal("escalated"),
);

const consentMethod = v.union(
  v.literal("documented_verbal"),
  v.literal("written"),
  v.literal("sms"),
  v.literal("email"),
  v.literal("signed_document"),
);

const consentReviewStatus = v.union(
  v.literal("pending_review"),
  v.literal("accepted"),
  v.literal("rejected"),
);

const allowedTransitions: Record<string, string[]> = {
  draft: ["consent_collected"],
  consent_collected: ["created"],
  created: ["destination_notified", "accepted", "declined", "escalated"],
  destination_notified: ["accepted", "declined", "returned", "escalated"],
  accepted: ["scheduled", "service_delivered", "referred_onward", "closed", "escalated"],
  declined: ["returned", "closed"],
  scheduled: ["service_delivered", "referred_onward", "closed", "escalated"],
  service_delivered: ["closed", "referred_onward"],
  referred_onward: ["closed"],
  returned: ["created", "closed", "escalated"],
  escalated: ["accepted", "returned", "closed"],
  closed: [],
};

const destinationOpenStatuses = [
  "created",
  "destination_notified",
  "accepted",
  "scheduled",
  "service_delivered",
  "returned",
  "escalated",
] as const;

const CONSENT_EVIDENCE_RETENTION_YEARS = 7;
const MAX_CONSENT_EVIDENCE_BYTES = 10 * 1024 * 1024;
const CONSENT_RETENTION_BATCH_LIMIT = 100;

function publicReference(prefix: string, id: string, now: number) {
  const date = new Date(now).toISOString().slice(0, 10).replaceAll("-", "");
  return `${prefix}-${date}-${id.slice(-6).toUpperCase()}`;
}

function normalize(value: string, label: string, max: number) {
  const trimmed = value.trim();
  if (!trimmed) throw new ConvexError(`${label} is required.`);
  return trimmed.slice(0, max);
}

async function addReferralEvent(
  ctx: Parameters<typeof writeAudit>[0],
  args: {
    referralId: Parameters<typeof ctx.db.get<"referrals">>[0];
    caseId: Parameters<typeof ctx.db.get<"cases">>[0];
    actorId: Parameters<typeof ctx.db.get<"users">>[0];
    type: string;
    publicLabelKey?: string;
    note?: string;
    metadata?: Record<string, unknown>;
  },
) {
  await ctx.db.insert("referral_events", {
    ...args,
    occurredAt: Date.now(),
  });
}

export const generateConsentUploadUrl = mutation({
  args: { caseId: v.id("cases") },
  handler: async (ctx, args) => {
    const { user } = await requireCaseWorker(ctx, args.caseId);
    const uploadUrl = await ctx.storage.generateUploadUrl();
    await writeAudit(ctx, user._id, "referral.consent_upload_url_generated", "case", args.caseId, {
      caseId: args.caseId,
      changedFieldNames: ["consentEvidenceStorageId"],
    });
    return uploadUrl;
  },
});

export const listForCase = query({
  args: { caseId: v.id("cases") },
  handler: async (ctx, args) => {
    await requireCaseAccess(ctx, args.caseId);
    const referrals = await ctx.db
      .query("referrals")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .collect();
    return await Promise.all(referrals.map(async (referral) => ({
      ...referral,
      destinationService: await ctx.db.get(referral.destinationServiceId),
      destinationUser: referral.destinationUserId ? await ctx.db.get(referral.destinationUserId) : null,
      sourceService: referral.sourceServiceId ? await ctx.db.get(referral.sourceServiceId) : null,
      parentReferral: referral.parentReferralId ? await ctx.db.get(referral.parentReferralId) : null,
      onwardReferral: referral.onwardReferralId ? await ctx.db.get(referral.onwardReferralId) : null,
      consent: referral.consentId ? await ctx.db.get(referral.consentId) : null,
      events: await ctx.db
        .query("referral_events")
        .withIndex("by_referral_time", (q) => q.eq("referralId", referral._id))
        .collect(),
    })));
  },
});

export const staffQueue = query({
  args: { status: v.optional(referralStatus) },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const records = args.status
      ? await ctx.db.query("referrals").withIndex("by_status", (q) => q.eq("status", args.status!)).collect()
      : await ctx.db.query("referrals").order("desc").take(100);
    return await Promise.all(records.map(async (referral) => {
      const consent = referral.consentId ? await ctx.db.get(referral.consentId) : null;
      return {
        referral,
        case: await ctx.db.get(referral.caseId),
        beneficiary: await ctx.db.get(referral.beneficiaryId),
        destinationService: await ctx.db.get(referral.destinationServiceId),
        destinationUser: referral.destinationUserId ? await ctx.db.get(referral.destinationUserId) : null,
        parentReferral: referral.parentReferralId ? await ctx.db.get(referral.parentReferralId) : null,
        onwardReferral: referral.onwardReferralId ? await ctx.db.get(referral.onwardReferralId) : null,
        consent,
        consentEvidenceUrl: consent?.evidenceStorageId ? await ctx.storage.getUrl(consent.evidenceStorageId) : null,
      };
    }));
  },
});

export const staffConsentEvidenceQueue = query({
  args: { status: v.optional(consentReviewStatus) },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const status = args.status ?? "pending_review";
    const consents = await ctx.db
      .query("consents")
      .withIndex("by_type_review", (q) => q.eq("type", "referral").eq("reviewStatus", status))
      .order("desc")
      .take(100);
    return await Promise.all(consents.map(async (consent) => {
      const referral = consent.relatedReferralId ? await ctx.db.get(consent.relatedReferralId) : null;
      return {
        consent,
        referral,
        case: consent.relatedCaseId ? await ctx.db.get(consent.relatedCaseId) : null,
        beneficiary: await ctx.db.get(consent.userId),
        destinationService: consent.destinationServiceId ? await ctx.db.get(consent.destinationServiceId) : null,
        recordedBy: consent.recordedBy ? await ctx.db.get(consent.recordedBy) : null,
        url: consent.evidenceStorageId ? await ctx.storage.getUrl(consent.evidenceStorageId) : null,
      };
    }));
  },
});

export const myDestinationQueue = query({
  args: { status: v.optional(referralStatus) },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["paralegal", "provider_staff"]);
    const statuses = args.status ? [args.status] : destinationOpenStatuses;
    const records = (await Promise.all(statuses.map((status) =>
      ctx.db
        .query("referrals")
        .withIndex("by_destination_user_status", (q) => q.eq("destinationUserId", user._id).eq("status", status))
        .collect(),
    ))).flat();

    return await Promise.all(records.map(async (referral) => ({
      referral,
      case: await ctx.db.get(referral.caseId),
      destinationService: await ctx.db.get(referral.destinationServiceId),
      onwardReferral: referral.onwardReferralId ? await ctx.db.get(referral.onwardReferralId) : null,
      consent: referral.consentId ? await ctx.db.get(referral.consentId) : null,
      events: await ctx.db
        .query("referral_events")
        .withIndex("by_referral_time", (q) => q.eq("referralId", referral._id))
        .collect(),
    })));
  },
});

export const reviewConsentEvidence = mutation({
  args: {
    consentId: v.id("consents"),
    status: consentReviewStatus,
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const consent = await ctx.db.get(args.consentId);
    if (!consent || consent.type !== "referral") {
      throw new ConvexError("Referral consent evidence not found.");
    }
    if (!consent.evidenceStorageId) {
      throw new ConvexError("Only uploaded consent evidence can be reviewed here.");
    }
    if (args.status === "pending_review") {
      throw new ConvexError("Choose accepted or rejected.");
    }
    const now = Date.now();
    await ctx.db.patch(consent._id, {
      reviewStatus: args.status,
      reviewedBy: user._id,
      reviewedAt: now,
      reviewNotes: args.reviewNotes?.trim().slice(0, 1000),
    });
    await writeAudit(ctx, user._id, "referral.consent_evidence_reviewed", "consent", consent._id, {
      caseId: consent.relatedCaseId,
      referralId: consent.relatedReferralId,
      changedFieldNames: ["reviewStatus", "reviewNotes"],
      from: consent.reviewStatus,
      to: args.status,
    });
    if (consent.relatedReferralId && consent.relatedCaseId) {
      await addReferralEvent(ctx, {
        referralId: consent.relatedReferralId,
        caseId: consent.relatedCaseId,
        actorId: user._id,
        type: `consent_evidence_${args.status}`,
        publicLabelKey: "case.timeline.consentEvidenceReviewed",
        metadata: { consentId: consent._id, reviewStatus: args.status },
      });
    }
    return { status: args.status };
  },
});

export const expireConsentEvidenceRetention = internalMutation({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const limit = Math.min(Math.max(Math.trunc(args.limit ?? CONSENT_RETENTION_BATCH_LIMIT), 1), 250);
    const consents = await ctx.db
      .query("consents")
      .withIndex("by_type_retention", (q) => q.eq("type", "referral").eq("retentionStatus", "active").lte("retentionUntil", now))
      .take(limit);
    for (const consent of consents) {
      await ctx.db.patch(consent._id, {
        retentionStatus: "expired",
      });
      if (consent.recordedBy) {
        await writeAudit(ctx, consent.recordedBy, "referral.consent_evidence_retention_expired", "consent", consent._id, {
          caseId: consent.relatedCaseId,
          referralId: consent.relatedReferralId,
          changedFieldNames: ["retentionStatus"],
          from: "active",
          to: "expired",
        });
      }
    }
    return { expiredCount: consents.length };
  },
});

export const createForCase = mutation({
  args: {
    caseId: v.id("cases"),
    requestId: v.optional(v.id("legal_help_requests")),
    sourceServiceId: v.optional(v.id("justice_services")),
    destinationServiceId: v.id("justice_services"),
    destinationUserId: v.optional(v.id("users")),
    reason: v.string(),
    informationShared: v.array(v.string()),
    consentId: v.optional(v.id("consents")),
    consentMethod: v.optional(consentMethod),
    consentStatement: v.optional(v.string()),
    consentEvidenceNote: v.optional(v.string()),
    consentEvidenceStorageId: v.optional(v.id("_storage")),
    consentEvidenceFileName: v.optional(v.string()),
    consentEvidenceFileType: v.optional(v.string()),
    consentEvidenceFileSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { user, caseRecord } = await requireCaseWorker(ctx, args.caseId);
    const destination = await ctx.db.get(args.destinationServiceId);
    if (!destination || !destination.active || destination.verificationStatus !== "verified") {
      throw new ConvexError("Referral destination must be an active verified service.");
    }
    if (destination.visibility === "confidential") {
      throw new ConvexError("Confidential services require a safeguarding-specific referral workflow.");
    }
    if (!destination.referralCapability) {
      throw new ConvexError("Destination is not configured to receive referrals.");
    }
    if (args.destinationUserId) {
      const destinationUser = await ctx.db.get(args.destinationUserId);
      if (!destinationUser || destinationUser.isDeleted) {
        throw new ConvexError("Destination provider account is unavailable.");
      }
      const roles = await getActiveRoles(ctx, destinationUser._id);
      if (!roles.includes("paralegal") && !roles.includes("provider_staff")) {
        throw new ConvexError("Destination user must be an active provider or paralegal.");
      }
    }
    const now = Date.now();
    const sourceRequest = await ctx.db.get(caseRecord.sourceRequestId);
    const normalizedInformationShared = args.informationShared.map((item) => normalize(item, "Information shared", 160));
    const selectedConsentMethod = args.consentMethod ?? "documented_verbal";
    if (args.consentEvidenceFileSize && args.consentEvidenceFileSize > MAX_CONSENT_EVIDENCE_BYTES) {
      throw new ConvexError("Consent evidence file must be 10MB or smaller.");
    }
    if (selectedConsentMethod === "signed_document" && !args.consentEvidenceStorageId) {
      throw new ConvexError("Signed document consent requires an uploaded evidence file.");
    }
    if (args.consentEvidenceStorageId) {
      const storedFile = await ctx.db.system.get(args.consentEvidenceStorageId);
      if (!storedFile) {
        throw new ConvexError("Uploaded consent evidence file was not found.");
      }
    }
    const consentRecordId = args.consentId ?? await ctx.db.insert("consents", {
      userId: caseRecord.beneficiaryId,
      type: "referral",
      version: "2026-09-referral-consent-v1",
      granted: true,
      locale: sourceRequest?.locale ?? "en",
      method: selectedConsentMethod,
      statement: normalize(
        args.consentStatement ?? "Beneficiary consented to share minimum necessary information for this referral.",
        "Consent statement",
        1200,
      ),
      evidenceNote: args.consentEvidenceNote?.trim().slice(0, 1200),
      evidenceStorageId: args.consentEvidenceStorageId,
      evidenceFileName: args.consentEvidenceFileName?.trim().slice(0, 180),
      evidenceFileType: args.consentEvidenceFileType?.trim().slice(0, 120),
      evidenceFileSize: args.consentEvidenceFileSize,
      retentionUntil: now + CONSENT_EVIDENCE_RETENTION_YEARS * 365 * 24 * 60 * 60 * 1000,
      retentionStatus: "active",
      reviewStatus: args.consentEvidenceStorageId ? "pending_review" : "accepted",
      informationShared: normalizedInformationShared,
      relatedCaseId: args.caseId,
      destinationServiceId: args.destinationServiceId,
      recordedBy: user._id,
      recordedAt: now,
    });
    const referralId = await ctx.db.insert("referrals", {
      publicId: "pending",
      caseId: args.caseId,
      requestId: args.requestId,
      sourceServiceId: args.sourceServiceId,
      destinationServiceId: args.destinationServiceId,
      destinationUserId: args.destinationUserId,
      parentReferralId: undefined,
      createdBy: user._id,
      beneficiaryId: caseRecord.beneficiaryId,
      reason: normalize(args.reason, "Referral reason", 2000),
      informationShared: normalizedInformationShared,
      consentId: consentRecordId,
      consentCollectedAt: now,
      status: "created",
      createdAt: now,
      updatedAt: now,
    });
    const publicId = publicReference("HYR", referralId, now);
    await ctx.db.patch(consentRecordId, { relatedReferralId: referralId });
    await ctx.db.patch(referralId, { publicId });
    if (["under_review", "assignment_pending", "assigned", "assistance_underway"].includes(caseRecord.status)) {
      assertCaseTransition(caseRecord.status, "referred");
      await ctx.db.patch(caseRecord._id, {
        status: "referred",
        version: caseRecord.version + 1,
        updatedAt: now,
      });
    }
    await addReferralEvent(ctx, {
      referralId,
      caseId: args.caseId,
      actorId: user._id,
      type: "referral_created",
      publicLabelKey: "case.timeline.referralCreated",
      metadata: { destinationServiceId: args.destinationServiceId, destinationUserId: args.destinationUserId, consentId: consentRecordId, informationShared: normalizedInformationShared },
    });
    await ctx.db.insert("case_events", {
      caseId: args.caseId,
      actorId: user._id,
      type: "referral_created",
      audience: "all",
      publicLabelKey: "case.timeline.referralCreated",
      metadata: { referralId, destinationServiceId: args.destinationServiceId, destinationUserId: args.destinationUserId, consentId: consentRecordId },
      occurredAt: now,
    });
    await createNotification(ctx, {
      userId: caseRecord.beneficiaryId,
      type: "referral.created",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.referralCreated.body",
      resourceType: "referral",
      resourceId: referralId,
    });
    if (args.destinationUserId) {
      await createNotification(ctx, {
        userId: args.destinationUserId,
        type: "referral.created",
        titleKey: "notifications.update.title",
        bodyKey: "notifications.referralCreated.body",
        resourceType: "referral",
        resourceId: referralId,
      });
    }
    await writeAudit(ctx, user._id, "referral.created", "referral", referralId, {
      caseId: args.caseId,
      destinationServiceId: args.destinationServiceId,
      destinationUserId: args.destinationUserId,
      consentId: consentRecordId,
      changedFieldNames: ["status", "informationShared", "consentCollectedAt", "consentId"],
    });
    return { referralId, publicId, consentId: consentRecordId };
  },
});

export const createOnwardReferral = mutation({
  args: {
    parentReferralId: v.id("referrals"),
    destinationServiceId: v.id("justice_services"),
    destinationUserId: v.optional(v.id("users")),
    reason: v.string(),
    informationShared: v.array(v.string()),
    consentMethod: v.optional(consentMethod),
    consentStatement: v.optional(v.string()),
    consentEvidenceNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requireAnyRole(ctx, ["admin", "staff", "supervisor", "paralegal", "provider_staff"]);
    const roles = new Set([actor.user.role, ...actor.assignments.map((assignment) => assignment.role)]);
    const isStaff = roles.has("admin") || roles.has("staff") || roles.has("supervisor");
    const parent = await ctx.db.get(args.parentReferralId);
    if (!parent) throw new ConvexError("Parent referral not found.");
    if (!isStaff && parent.destinationUserId !== actor.user._id) {
      throw new ConvexError("Only the assigned destination provider can create an onward referral.");
    }
    if (!["accepted", "scheduled", "service_delivered"].includes(parent.status)) {
      throw new ConvexError("Only accepted, scheduled, or delivered referrals can be referred onward.");
    }
    if (parent.onwardReferralId) {
      throw new ConvexError("This referral already has an onward referral.");
    }
    const destination = await ctx.db.get(args.destinationServiceId);
    if (!destination || !destination.active || destination.verificationStatus !== "verified") {
      throw new ConvexError("Onward destination must be an active verified service.");
    }
    if (destination.visibility === "confidential") {
      throw new ConvexError("Confidential services require a safeguarding-specific referral workflow.");
    }
    if (!destination.referralCapability) {
      throw new ConvexError("Destination is not configured to receive referrals.");
    }
    if (args.destinationUserId) {
      const destinationUser = await ctx.db.get(args.destinationUserId);
      if (!destinationUser || destinationUser.isDeleted) {
        throw new ConvexError("Destination provider account is unavailable.");
      }
      const destinationRoles = await getActiveRoles(ctx, destinationUser._id);
      if (!destinationRoles.includes("paralegal") && !destinationRoles.includes("provider_staff")) {
        throw new ConvexError("Destination user must be an active provider or paralegal.");
      }
    }
    const caseRecord = await ctx.db.get(parent.caseId);
    if (!caseRecord) throw new ConvexError("Linked case not found.");
    const sourceRequest = await ctx.db.get(caseRecord.sourceRequestId);
    const now = Date.now();
    const normalizedInformationShared = args.informationShared.map((item) => normalize(item, "Information shared", 160));
    const consentRecordId = await ctx.db.insert("consents", {
      userId: parent.beneficiaryId,
      type: "referral",
      version: "2026-09-referral-onward-consent-v1",
      granted: true,
      locale: sourceRequest?.locale ?? "en",
      method: args.consentMethod ?? "documented_verbal",
      statement: normalize(
        args.consentStatement ?? "Beneficiary consented to onward referral and minimum necessary information sharing.",
        "Consent statement",
        1200,
      ),
      evidenceNote: args.consentEvidenceNote?.trim().slice(0, 1200),
      informationShared: normalizedInformationShared,
      relatedCaseId: parent.caseId,
      destinationServiceId: args.destinationServiceId,
      recordedBy: actor.user._id,
      recordedAt: now,
      retentionStatus: "active",
      reviewStatus: "accepted",
    });
    const referralId = await ctx.db.insert("referrals", {
      publicId: "pending",
      caseId: parent.caseId,
      requestId: parent.requestId,
      sourceServiceId: parent.destinationServiceId,
      destinationServiceId: args.destinationServiceId,
      destinationUserId: args.destinationUserId,
      parentReferralId: parent._id,
      createdBy: actor.user._id,
      beneficiaryId: parent.beneficiaryId,
      reason: normalize(args.reason, "Onward referral reason", 2000),
      informationShared: normalizedInformationShared,
      consentId: consentRecordId,
      consentCollectedAt: now,
      status: "created",
      createdAt: now,
      updatedAt: now,
    });
    const publicId = publicReference("HYR", referralId, now);
    await ctx.db.patch(consentRecordId, { relatedReferralId: referralId });
    await ctx.db.patch(referralId, { publicId });
    await ctx.db.patch(parent._id, {
      status: "referred_onward",
      onwardReferralId: referralId,
      updatedAt: now,
    });
    await addReferralEvent(ctx, {
      referralId: parent._id,
      caseId: parent.caseId,
      actorId: actor.user._id,
      type: "referral_referred_onward",
      publicLabelKey: "case.timeline.referral.referred_onward",
      note: args.reason.trim().slice(0, 1200),
      metadata: { onwardReferralId: referralId, destinationServiceId: args.destinationServiceId },
    });
    await addReferralEvent(ctx, {
      referralId,
      caseId: parent.caseId,
      actorId: actor.user._id,
      type: "referral_created",
      publicLabelKey: "case.timeline.referralCreated",
      metadata: { parentReferralId: parent._id, sourceServiceId: parent.destinationServiceId, destinationServiceId: args.destinationServiceId, consentId: consentRecordId },
    });
    await ctx.db.insert("case_events", {
      caseId: parent.caseId,
      actorId: actor.user._id,
      type: "referral_referred_onward",
      audience: "all",
      publicLabelKey: "case.timeline.referral.referred_onward",
      metadata: { parentReferralId: parent._id, onwardReferralId: referralId, destinationServiceId: args.destinationServiceId, consentId: consentRecordId },
      occurredAt: now,
    });
    await createNotification(ctx, {
      userId: parent.beneficiaryId,
      type: "referral.updated",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.referralCreated.body",
      resourceType: "referral",
      resourceId: referralId,
    });
    if (args.destinationUserId) {
      await createNotification(ctx, {
        userId: args.destinationUserId,
        type: "referral.created",
        titleKey: "notifications.update.title",
        bodyKey: "notifications.referralCreated.body",
        resourceType: "referral",
        resourceId: referralId,
      });
    }
    await writeAudit(ctx, actor.user._id, "referral.referred_onward", "referral", parent._id, {
      caseId: parent.caseId,
      changedFieldNames: ["status", "onwardReferralId"],
      from: parent.status,
      to: "referred_onward",
      onwardReferralId: referralId,
    });
    return { referralId, publicId, parentReferralId: parent._id, consentId: consentRecordId };
  },
});

export const respondAsDestination = mutation({
  args: {
    referralId: v.id("referrals"),
    status: v.union(
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("scheduled"),
      v.literal("service_delivered"),
      v.literal("returned"),
      v.literal("closed"),
    ),
    note: v.optional(v.string()),
    declineReason: v.optional(v.string()),
    finalDisposition: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["paralegal", "provider_staff"]);
    const referral = await ctx.db.get(args.referralId);
    if (!referral) throw new ConvexError("Referral not found.");
    if (referral.destinationUserId !== user._id) {
      throw new ConvexError("Referral destination access denied.");
    }
    if (!allowedTransitions[referral.status]?.includes(args.status)) {
      throw new ConvexError(`Referral cannot move from ${referral.status} to ${args.status}.`);
    }
    if (args.status === "declined" && !args.declineReason?.trim() && !args.note?.trim()) {
      throw new ConvexError("Decline reason is required.");
    }
    const now = Date.now();
    await ctx.db.patch(referral._id, {
      status: args.status,
      declineReason: args.status === "declined" ? (args.declineReason?.trim() || args.note?.trim()) : referral.declineReason,
      finalDisposition: args.finalDisposition?.trim(),
      updatedAt: now,
      closedAt: args.status === "closed" ? now : referral.closedAt,
    });
    await addReferralEvent(ctx, {
      referralId: referral._id,
      caseId: referral.caseId,
      actorId: user._id,
      type: `referral_${args.status}`,
      publicLabelKey: `case.timeline.referral.${args.status}`,
      note: args.note?.trim(),
      metadata: { from: referral.status, to: args.status, actor: "destination" },
    });
    await createNotification(ctx, {
      userId: referral.beneficiaryId,
      type: "referral.updated",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.referralCreated.body",
      resourceType: "referral",
      resourceId: referral._id,
    });
    await writeAudit(ctx, user._id, "referral.destination_status_changed", "referral", referral._id, {
      caseId: referral.caseId,
      changedFieldNames: ["status"],
      from: referral.status,
      to: args.status,
    });
    return { referralId: referral._id, status: args.status };
  },
});

export const updateStatus = mutation({
  args: {
    referralId: v.id("referrals"),
    status: referralStatus,
    note: v.optional(v.string()),
    declineReason: v.optional(v.string()),
    finalDisposition: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const referral = await ctx.db.get(args.referralId);
    if (!referral) throw new ConvexError("Referral not found.");
    const { user } = await requireCaseWorker(ctx, referral.caseId);
    if (!allowedTransitions[referral.status]?.includes(args.status)) {
      throw new ConvexError(`Referral cannot move from ${referral.status} to ${args.status}.`);
    }
    if (args.status === "declined" && !args.declineReason?.trim()) {
      throw new ConvexError("Decline reason is required.");
    }
    const now = Date.now();
    await ctx.db.patch(referral._id, {
      status: args.status,
      declineReason: args.declineReason?.trim(),
      finalDisposition: args.finalDisposition?.trim(),
      updatedAt: now,
      closedAt: args.status === "closed" ? now : referral.closedAt,
    });
    await addReferralEvent(ctx, {
      referralId: referral._id,
      caseId: referral.caseId,
      actorId: user._id,
      type: `referral_${args.status}`,
      publicLabelKey: `case.timeline.referral.${args.status}`,
      note: args.note?.trim(),
      metadata: { from: referral.status, to: args.status },
    });
    await writeAudit(ctx, user._id, "referral.status_changed", "referral", referral._id, {
      caseId: referral.caseId,
      changedFieldNames: ["status"],
      from: referral.status,
      to: args.status,
    });
    return { referralId: referral._id, status: args.status };
  },
});
