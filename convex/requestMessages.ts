import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getActiveRoles, requireAuthenticatedUser } from "./lib/auth";
import { normalizeText } from "./lib/security";
import { writeAudit } from "./lib/hakiYangu";
import { createNotification } from "./lib/notifications";
import { enforceRateLimit } from "./lib/rateLimits";

async function requireRequestConversationAccess(ctx: QueryCtx | MutationCtx, requestId: Id<"legal_help_requests">) {
  const { user } = await requireAuthenticatedUser(ctx);
  const request = await ctx.db.get(requestId);
  if (!request) throw new ConvexError("Request unavailable");
  const owner = request.ownerId === user._id;
  const roles = owner ? [] : await getActiveRoles(ctx, user._id);
  if (!owner && !roles.some(role => ["admin", "staff", "supervisor"].includes(role))) throw new ConvexError("Request access denied");
  return { user, request, owner };
}

export const state = query({
  args: { requestId: v.id("legal_help_requests") },
  handler: async (ctx, args) => {
    const { owner, request } = await requireRequestConversationAccess(ctx, args.requestId);
    return { status: request.status, canSend: ["submitted", "under_review", "waiting_for_information"].includes(request.status), canRequestInformation: !owner };
  },
});

export const list = query({
  args: { requestId: v.id("legal_help_requests"), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireRequestConversationAccess(ctx, args.requestId);
    const result = await ctx.db.query("request_messages").withIndex("by_request", q => q.eq("requestId", args.requestId)).order("desc").paginate(args.paginationOpts);
    return { ...result, page: result.page.map(({ _id, body, senderKind, requestsInformation, createdAt }) => ({ _id, body, senderKind, requestsInformation, createdAt })) };
  },
});

export const send = mutation({
  args: { requestId: v.id("legal_help_requests"), clientMessageId: v.string(), body: v.string(), requestInformation: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const { user, request, owner } = await requireRequestConversationAccess(ctx, args.requestId);
    const body = normalizeText(args.body, "Message", 3000);
    const clientMessageId = normalizeText(args.clientMessageId, "Message identity", 100);
    const requestsInformation = !owner && args.requestInformation === true;
    if (owner && args.requestInformation) throw new ConvexError("Only LSF can request information");
    const prior = await ctx.db.query("request_messages").withIndex("by_request_sender_client", q => q.eq("requestId", request._id).eq("senderId", user._id).eq("clientMessageId", clientMessageId)).unique();
    // A committed reply can be acknowledged after conversion or withdrawal.
    if (prior) {
      if (prior.body !== body || prior.requestsInformation !== requestsInformation) throw new ConvexError("Message retry must match the original");
      return prior._id;
    }
    if (!["submitted", "under_review", "waiting_for_information"].includes(request.status)) throw new ConvexError("This request no longer accepts messages. Open your case or contact LSF.");
    await enforceRateLimit(ctx, `request-message:${user._id}`, 15, 60_000);
    const now = Date.now();
    const messageId = await ctx.db.insert("request_messages", { requestId: request._id, senderId: user._id, senderKind: owner ? "beneficiary" : "staff", clientMessageId, body, requestsInformation, createdAt: now });
    const nextStatus = requestsInformation ? "waiting_for_information" : owner && request.status === "waiting_for_information" ? "under_review" : request.status;
    await ctx.db.patch(request._id, { status: nextStatus, version: request.version + 1, updatedAt: now });
    await writeAudit(ctx, user._id, "help_request.message_sent", "legal_help_request", request._id, { messageId, changedFieldNames: ["messages", ...(nextStatus !== request.status ? ["status"] : [])] });
    // Notifications contain neutral copy, never the message or issue details.
    if (!owner) await createNotification(ctx, { userId: request.ownerId, type: "request.message", titleKey: "request.message.title", bodyKey: "request.message.body", resourceType: "legal_help_request", resourceId: request._id });
    else {
      const recent = await ctx.db.query("request_messages").withIndex("by_request", q => q.eq("requestId", request._id)).filter(q => q.eq(q.field("senderKind"), "staff")).order("desc").first();
      if (recent && (await getActiveRoles(ctx, recent.senderId)).some(role => ["admin", "staff", "supervisor"].includes(role))) {
        await createNotification(ctx, { userId: recent.senderId, type: "request.message", titleKey: "request.message.title", bodyKey: "request.message.body", resourceType: "legal_help_request", resourceId: request._id });
      }
    }
    return messageId;
  },
});
