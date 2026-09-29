import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnyRole, requireAuthenticatedUser } from "./lib/auth";
import { normalizeOptionalText, normalizeText } from "./lib/security";
import { writeAudit } from "./lib/hakiYangu";
import { createNotification } from "./lib/notifications";

const localeValidator = v.union(v.literal("sw"), v.literal("en"));
const safeContactValidator = v.union(
  v.literal("in_app"),
  v.literal("phone"),
  v.literal("sms"),
  v.literal("email"),
  v.literal("none"),
);
const preferredLanguageValidator = v.union(
  v.literal("sw"),
  v.literal("en"),
  v.literal("both"),
  v.literal("other"),
);
const urgencyValidator = v.union(
  v.literal("standard"),
  v.literal("urgent"),
  v.literal("immediate_safety"),
);
const issueCategoryValidator = v.union(v.literal("employment"), v.literal("land"), v.literal("family"), v.literal("safety"), v.literal("consumer"), v.literal("other"));

function publicReference(prefix: string, id: string, now: number) {
  const date = new Date(now).toISOString().slice(0, 10).replaceAll("-", "");
  return `${prefix}-${date}-${id.slice(-6).toUpperCase()}`;
}

export const saveDraft = mutation({
  args: {
    clientRequestId: v.string(),
    expectedVersion: v.optional(v.number()),
    locale: localeValidator,
    description: v.optional(v.string()),
    issueCategory: v.optional(issueCategoryValidator),
    sourceServiceId: v.optional(v.id("justice_services")),
    safeContactMethod: v.optional(safeContactValidator),
    preferredLanguage: v.optional(preferredLanguageValidator),
    preferredLanguageOther: v.optional(v.string()),
    region: v.optional(v.string()),
    district: v.optional(v.string()),
    occurredAt: v.optional(v.number()),
    involvedParties: v.optional(v.string()),
    desiredHelp: v.optional(v.string()),
    hasDocuments: v.optional(v.boolean()),
    urgency: v.optional(urgencyValidator),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    if (args.sourceServiceId) {
      const source = await ctx.db.get(args.sourceServiceId);
      if (!source || !source.active || source.visibility !== "public" || source.verificationStatus !== "verified") {
        throw new ConvexError({ code: "VALIDATION", message: "The selected service is no longer available. Review Find Help before submitting." });
      }
    }
    const clientRequestId = normalizeText(args.clientRequestId, "Client request ID", 100);
    const now = Date.now();
    const existing = await ctx.db
      .query("legal_help_requests")
      .withIndex("by_owner_client_request", (q) =>
        q.eq("ownerId", user._id).eq("clientRequestId", clientRequestId),
      )
      .unique();

    const normalized = {
      locale: args.locale,
      description: normalizeOptionalText(args.description, "Description", 5000),
      issueCategory: args.issueCategory,
      sourceServiceId: args.sourceServiceId,
      safeContactMethod: args.safeContactMethod,
      preferredLanguage: args.preferredLanguage,
      preferredLanguageOther: normalizeOptionalText(args.preferredLanguageOther, "Other language", 80),
      region: normalizeOptionalText(args.region, "Region", 100),
      district: normalizeOptionalText(args.district, "District", 100),
      occurredAt: args.occurredAt,
      involvedParties: normalizeOptionalText(args.involvedParties, "People or organisations involved", 1000),
      desiredHelp: normalizeOptionalText(args.desiredHelp, "Desired help", 1000),
      hasDocuments: args.hasDocuments,
      urgency: args.urgency,
    };

    if (existing) {
      if (existing.status !== "draft") {
        return { requestId: existing._id, publicId: existing.publicId, version: existing.version, status: existing.status };
      }
      if (args.expectedVersion !== undefined && args.expectedVersion !== existing.version) {
        throw new ConvexError({ code: "CONFLICT", message: "This draft changed on another device" });
      }

      const version = existing.version + 1;
      await ctx.db.patch(existing._id, { ...normalized, version, updatedAt: now });
      return { requestId: existing._id, publicId: existing.publicId, version, status: "draft" as const };
    }

    const requestId = await ctx.db.insert("legal_help_requests", {
      publicId: "pending",
      ownerId: user._id,
      clientRequestId,
      status: "draft",
      ...normalized,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
    const publicId = publicReference("HYR", requestId, now);
    await ctx.db.patch(requestId, { publicId });
    await writeAudit(ctx, user._id, "help_request.draft_created", "legal_help_request", requestId);
    return { requestId, publicId, version: 1, status: "draft" as const };
  },
});

export const saveAnswer = mutation({
  args: {
    requestId: v.id("legal_help_requests"),
    questionKey: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new ConvexError({ code: "NOT_FOUND", message: "Request not found" });
    if (request.ownerId !== user._id) throw new ConvexError({ code: "FORBIDDEN", message: "Request access denied" });
    if (request.status !== "draft") throw new ConvexError({ code: "CONFLICT", message: "Submitted answers cannot be changed" });

    const questionKey = normalizeText(args.questionKey, "Question", 100);
    const value = normalizeText(args.value, "Answer", 5000);
    const existing = await ctx.db
      .query("intake_answers")
      .withIndex("by_request_question", (q) =>
        q.eq("requestId", args.requestId).eq("questionKey", questionKey),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { value, updatedAt: Date.now() });
      return existing._id;
    }
    return await ctx.db.insert("intake_answers", {
      requestId: args.requestId,
      ownerId: user._id,
      questionKey,
      value,
      updatedAt: Date.now(),
    });
  },
});

export const generateAttachmentUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuthenticatedUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const attachToDraft = mutation({
  args: {
    requestId: v.id("legal_help_requests"),
    storageId: v.id("_storage"),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const request = await ctx.db.get(args.requestId);
    if (!request || request.ownerId !== user._id) throw new ConvexError({ code: "FORBIDDEN", message: "Request access denied" });
    if (request.status !== "draft") throw new ConvexError({ code: "CONFLICT", message: "Submitted requests cannot be changed" });
    if (args.size <= 0 || args.size > 10 * 1024 * 1024) throw new ConvexError({ code: "VALIDATION", message: "File must be smaller than 10 MB" });
    const attachmentId = await ctx.db.insert("request_attachments", {
      requestId: request._id, ownerId: user._id, storageId: args.storageId,
      name: normalizeText(args.name, "File name", 180), type: normalizeText(args.type, "File type", 120),
      size: args.size, note: normalizeOptionalText(args.note, "File note", 500), createdAt: Date.now(),
    });
    await ctx.db.patch(request._id, { hasDocuments: true, updatedAt: Date.now(), version: request.version + 1 });
    return { attachmentId };
  },
});

export const submit = mutation({
  args: {
    requestId: v.id("legal_help_requests"),
    expectedVersion: v.number(),
    consentVersion: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new ConvexError({ code: "NOT_FOUND", message: "Request not found" });
    if (request.ownerId !== user._id) throw new ConvexError({ code: "FORBIDDEN", message: "Request access denied" });
    if (request.status !== "draft") {
      return { requestId: request._id, publicId: request.publicId, status: request.status };
    }
    if (request.version !== args.expectedVersion) {
      throw new ConvexError({ code: "CONFLICT", message: "Review the latest draft before submitting" });
    }
    if (!request.description || !request.region || !request.district || !request.safeContactMethod || !request.preferredLanguage || !request.desiredHelp || !request.urgency) {
      throw new ConvexError({ code: "VALIDATION", message: "Complete all required intake steps" });
    }
    if (request.preferredLanguage === "other" && !request.preferredLanguageOther) {
      throw new ConvexError({ code: "VALIDATION", message: "Enter the preferred support language" });
    }

    const consentVersion = normalizeText(args.consentVersion, "Consent version", 40);
    const now = Date.now();
    await ctx.db.insert("consents", {
      userId: user._id,
      type: "service",
      version: consentVersion,
      granted: true,
      locale: request.locale,
      recordedAt: now,
    });
    await ctx.db.patch(request._id, {
      status: "submitted",
      consentVersion,
      submittedAt: now,
      updatedAt: now,
      version: request.version + 1,
    });
    await writeAudit(ctx, user._id, "help_request.submitted", "legal_help_request", request._id, {
      changedFieldNames: ["status", "consentVersion", "submittedAt"],
    });
    await createNotification(ctx, {
      userId: user._id,
      type: "request.submitted",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.requestSubmitted.body",
      resourceType: "legal_help_request",
      resourceId: request._id,
    });

    return { requestId: request._id, publicId: request.publicId, status: "submitted" as const };
  },
});

export const myRequests = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const requests = await ctx.db
      .query("legal_help_requests")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .collect();
    return requests.map(({ description: _description, ...request }) => request);
  },
});

export const getMyRequest = query({
  args: { requestId: v.id("legal_help_requests") },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const request = await ctx.db.get(args.requestId);
    if (!request || request.ownerId !== user._id) return null;
    const source = request.sourceServiceId ? await ctx.db.get(request.sourceServiceId) : null;
    return {
      request,
      sourceService: source && source.active && source.visibility === "public" && source.verificationStatus === "verified" && source.servicePointType !== "safe_house"
        ? { _id: source._id, name: source.name, region: source.region, district: source.district }
        : null,
    };
  },
});

export const withdrawMyRequest = mutation({
  args: { requestId: v.id("legal_help_requests") },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new ConvexError({ code: "NOT_FOUND", message: "Request not found" });
    if (request.ownerId !== user._id) throw new ConvexError({ code: "FORBIDDEN", message: "Request access denied" });
    if (!["submitted", "under_review", "waiting_for_information"].includes(request.status)) {
      throw new ConvexError({ code: "CONFLICT", message: "This request can no longer be withdrawn" });
    }
    const now = Date.now();
    await ctx.db.patch(request._id, { status: "withdrawn", version: request.version + 1, updatedAt: now });
    await writeAudit(ctx, user._id, "help_request.withdrawn", "legal_help_request", request._id, {
      changedFieldNames: ["status"], from: request.status, to: "withdrawn",
    });
    return { status: "withdrawn" as const };
  },
});

export const getDraft = query({
  args: { clientRequestId: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const clientRequestId = normalizeText(args.clientRequestId, "Client request ID", 100);
    const request = await ctx.db
      .query("legal_help_requests")
      .withIndex("by_owner_client_request", (q) =>
        q.eq("ownerId", user._id).eq("clientRequestId", clientRequestId),
      )
      .unique();
    if (!request) return null;
    const answers = await ctx.db
      .query("intake_answers")
      .withIndex("by_request", (q) => q.eq("requestId", request._id))
      .collect();
    return { request, answers };
  },
});

export const staffQueue = query({
  args: { status: v.optional(v.union(
    v.literal("submitted"),
    v.literal("under_review"),
    v.literal("waiting_for_information"),
  )) },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    if (args.status) {
      return await ctx.db
        .query("legal_help_requests")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("asc")
        .collect();
    }
    const submitted = await ctx.db.query("legal_help_requests").withIndex("by_status", (q) => q.eq("status", "submitted")).collect();
    const reviewing = await ctx.db.query("legal_help_requests").withIndex("by_status", (q) => q.eq("status", "under_review")).collect();
    return [...submitted, ...reviewing].sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const openForTriage = mutation({
  args: {
    requestId: v.id("legal_help_requests"),
    expectedVersion: v.number(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new ConvexError({ code: "NOT_FOUND", message: "Request not found" });
    if (!["submitted", "under_review", "waiting_for_information"].includes(request.status)) {
      throw new ConvexError({ code: "CONFLICT", message: "Request is no longer available for triage" });
    }
    if (request.version !== args.expectedVersion) {
      throw new ConvexError({ code: "CONFLICT", message: "Request changed; refresh the queue" });
    }

    const now = Date.now();
    const nextVersion = request.status === "submitted" ? request.version + 1 : request.version;
    if (request.status === "submitted") {
      await ctx.db.patch(request._id, { status: "under_review", version: nextVersion, updatedAt: now });
    }
    const answers = await ctx.db
      .query("intake_answers")
      .withIndex("by_request", (q) => q.eq("requestId", request._id))
      .collect();
    const beneficiary = await ctx.db.get(request.ownerId);
    const sourceService = request.sourceServiceId ? await ctx.db.get(request.sourceServiceId) : null;
    await writeAudit(ctx, user._id, "help_request.viewed_for_triage", "legal_help_request", request._id, {
      changedFieldNames: request.status === "submitted" ? ["status"] : [],
    });
    return {
      request: {
        ...request,
        status: request.status === "submitted" ? "under_review" as const : request.status,
        version: nextVersion,
      },
      answers,
      sourceService: sourceService ? { name: sourceService.name, district: sourceService.district, region: sourceService.region, verificationStatus: sourceService.verificationStatus, active: sourceService.active } : null,
      beneficiary: beneficiary ? { name: beneficiary.name, email: beneficiary.email } : null,
    };
  },
});

export const setReviewStatus = mutation({
  args: {
    requestId: v.id("legal_help_requests"),
    expectedVersion: v.number(),
    status: v.union(v.literal("under_review"), v.literal("waiting_for_information")),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new ConvexError({ code: "NOT_FOUND", message: "Request not found" });
    if (!["submitted", "under_review", "waiting_for_information"].includes(request.status)) {
      throw new ConvexError({ code: "CONFLICT", message: "Request is no longer editable" });
    }
    if (request.version !== args.expectedVersion) {
      throw new ConvexError({ code: "CONFLICT", message: "Request changed; refresh before updating" });
    }
    if (request.status === args.status) return { status: request.status, version: request.version };
    const now = Date.now();
    await ctx.db.patch(request._id, { status: args.status, version: request.version + 1, updatedAt: now });
    await writeAudit(ctx, user._id, "help_request.review_status_changed", "legal_help_request", request._id, {
      changedFieldNames: ["status"],
      from: request.status,
      to: args.status,
    });
    return { status: args.status, version: request.version + 1 };
  },
});
