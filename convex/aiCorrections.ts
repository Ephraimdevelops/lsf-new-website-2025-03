import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  query,
  mutation,
} from "./_generated/server";
import { requireAuthenticatedUser, requireAnyRole } from "./lib/auth";
import {
  correctionCategory,
  correctionReference,
  recordShownReferences,
  phoneReferenceKey,
  type AiReference,
} from "./lib/aiCorrections";
const context = {
  conversationId: v.optional(v.id("sara_conversations")),
  socialMessageId: v.optional(v.id("social_messages")),
};
const reference = v.object({
  id: v.string(),
  title: v.string(),
  kind: v.string(),
  url: v.optional(v.string()),
  phone: v.optional(v.string()),
});
async function scopeFor(ctx: any, args: any) {
  if (args.socialMessageId) {
    const row = await ctx.db.get(args.socialMessageId);
    if (!row) throw Error("Message unavailable");
    const c = await ctx.db
      .query("social_conversations")
      .withIndex("by_identity", (q: any) =>
        q
          .eq("channel", row.channel)
          .eq("account", row.account)
          .eq("sender", row.sender),
      )
      .unique();
    if (!c?.consent || c.humanMode) throw Error("AI consent required");
    return { scope: "social:" + c._id, text: row.transcribedText ?? row.text };
  }
  const { identity } = await requireAuthenticatedUser(ctx);
  if (args.conversationId) {
    const c = await ctx.db.get(args.conversationId);
    if (!c || c.userId !== identity.subject)
      throw Error("Conversation not found");
  }
  return {
    scope:
      "app:" + JSON.stringify([identity.subject, args.conversationId ?? null]),
    text: args.currentMessage ?? "",
  };
}
async function state(ctx: any, scope: string) {
  const shown = await ctx.db
    .query("ai_reference_exposures")
    .withIndex("by_scope", (q: any) => q.eq("scope", scope))
    .order("desc")
    .take(80);
  const reports = await ctx.db
    .query("ai_information_reports")
    .withIndex("by_scope", (q: any) => q.eq("scope", scope))
    .order("desc")
    .take(100);
  const suspended = await ctx.db
    .query("ai_reference_reviews")
    .withIndex("by_suspended", (q: any) => q.eq("suspended", true))
    .take(1000);
  const excluded = new Set<string>([
    ...reports.flatMap((x: any) => [x.referenceId, ...(x.relatedIds ?? [])]),
    ...suspended.flatMap((x: any) => [
      x.referenceId,
      ...(x.phoneKey ? [x.phoneKey] : []),
    ]),
  ]);
  for (const ref of shown)
    if (excluded.has(ref.referenceId)) {
      const phoneKey = phoneReferenceKey(ref.phone);
      if (phoneKey) excluded.add(phoneKey);
    }
  return {
    references: shown.map((x: any) => ({
      id: x.referenceId,
      title: x.title,
      kind: x.kind,
      url: x.url,
      phone: x.phone,
    })),
    excludedIds: [...excluded],
    reports: reports
      .slice(0, 8)
      .map((x: any) => ({
        referenceId: x.referenceId,
        category: x.category,
        status: x.status,
      })),
    suspendedIds: suspended.map((x: any) => x.referenceId),
  };
}
export const getState = internalQuery({
  args: context,
  handler: async (ctx, args) => state(ctx, (await scopeFor(ctx, args)).scope),
});
export const getGlobalExclusions = internalQuery({
  args: {},
  handler: async (ctx) =>
    (
      await ctx.db
        .query("ai_reference_reviews")
        .withIndex("by_suspended", (q) => q.eq("suspended", true))
        .take(1000)
    ).flatMap((x) => [x.referenceId, ...(x.phoneKey ? [x.phoneKey] : [])]),
});
export const recordReferences = internalMutation({
  args: {
    ...context,
    references: v.array(reference),
    answerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { scope } = await scopeFor(ctx, args);
    await recordShownReferences(ctx, scope, args.references, args.answerId);
  },
});
async function report(ctx: any, args: any) {
  const { scope, text: messageText } = await scopeFor(ctx, args);
  const text = messageText || args.currentMessage || "";
  const current = await state(ctx, scope);
  const pending = await ctx.db
    .query("ai_information_reports")
    .withIndex("by_scope", (q: any) => q.eq("scope", scope))
    .order("desc")
    .take(10);
  if (
    !correctionCategory(text) &&
    !pending.some(
      (x: any) => x.status === "pending" && x.submittedAt > Date.now() - 600000,
    )
  )
    throw Error("A current feedback statement is required");
  let ref = current.references.find((x: any) => x.id === args.referenceId);
  if (args.referenceId === "last_answer")
    ref = current.references.find((x: any) => x.kind === "answer");
  if (!ref)
    throw Error("Choose a reference actually shown in this conversation");
  if (
    !correctionCategory(text) &&
    correctionReference(text, current.references) !== ref.id
  )
    throw Error("Clarify which reported reference you mean");
  const exposure = await ctx.db
    .query("ai_reference_exposures")
    .withIndex("by_scope_reference", (q: any) =>
      q.eq("scope", scope).eq("referenceId", ref.id),
    )
    .unique();
  const old = pending.find(
    (x: any) => x.referenceId === ref.id && x.status === "pending",
  );
  if (old)
    return {
      recorded: true,
      id: old._id,
      referenceId: ref.id,
      alreadyReported: true,
    };
  const id = await ctx.db.insert("ai_information_reports", {
    scope,
    referenceId: ref.id,
    title: ref.title,
    kind: ref.kind,
    ...(ref.url ? { sourceUrl: ref.url } : {}),
    category: args.category,
    statement: text.slice(0, 600),
    relatedIds: exposure?.relatedIds ?? [],
    status: "pending",
    submittedAt: Date.now(),
  });
  return {
    recorded: true,
    id,
    referenceId: ref.id,
    excludedInThisChat: true,
    globalChange: false,
  };
}
const category = v.union(
  v.literal("wrong_contact"),
  v.literal("unavailable"),
  v.literal("wrong_location"),
  v.literal("unsuitable_service"),
  v.literal("incorrect_guidance"),
  v.literal("outdated_information"),
  v.literal("other"),
);
export const reportProblem = internalMutation({
  args: {
    ...context,
    currentMessage: v.optional(v.string()),
    referenceId: v.string(),
    category,
  },
  handler: report,
});
export const captureFeedback = internalMutation({
  args: { ...context, currentMessage: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { scope, text } = await scopeFor(ctx, args);
    const message = text || args.currentMessage || "",
      category = correctionCategory(message);
    if (!category) return { recorded: false };
    const current = await state(ctx, scope);
    if (!current.references.length) return { recorded: false };
    return report(ctx, {
      ...args,
      currentMessage: message,
      referenceId: correctionReference(message, current.references),
      category,
    });
  },
});
export const reviewQueue = query({
  args: { status: v.union(v.literal("pending"), v.literal("reviewed")) },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin"]);
    const rows = await ctx.db
      .query("ai_information_reports")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .take(100);
    return Promise.all(
      rows.map(async (row) => ({
        ...row,
        relatedReferences: (
          await Promise.all(
            row.relatedIds.map((referenceId) =>
              ctx.db
                .query("ai_reference_exposures")
                .withIndex("by_scope_reference", (q) =>
                  q.eq("scope", row.scope).eq("referenceId", referenceId),
                )
                .unique(),
            ),
          )
        )
          .filter((x) => x !== null)
          .map((x) => ({ id: x.referenceId, title: x.title, url: x.url })),
      })),
    );
  },
});
export const review = mutation({
  args: {
    id: v.id("ai_information_reports"),
    decision: v.union(
      v.literal("suspend"),
      v.literal("corrected"),
      v.literal("dismiss"),
    ),
    note: v.string(),
    evidenceUrl: v.optional(v.string()),
    referenceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin"]);
    const row = await ctx.db.get(args.id);
    if (
      !row ||
      (row.status !== "pending" &&
        !(row.decision === "suspend" && args.decision === "corrected"))
    )
      throw Error("Pending report or suspended reference not found");
    const target =
      args.referenceId ?? row.resolvedReferenceId ?? row.referenceId;
    if (target !== row.referenceId && !row.relatedIds.includes(target))
      throw Error("Choose a source from this reported answer");
    const isAnswer = target.startsWith("answer:");
    const note = args.note.trim();
    if (note.length < 10 || note.length > 1500)
      throw Error("Explain the verification in 10–1500 characters");
    if (args.decision !== "dismiss") {
      if (!args.evidenceUrl) throw Error("Add the public verification source");
      const url = new URL(args.evidenceUrl);
      if (url.protocol !== "https:" || url.username || url.password)
        throw Error("Use a public HTTPS source");
    }
    if (isAnswer && args.decision === "suspend")
      throw Error(
        "An answer report needs source review; select a specific source before a global suspension",
      );
    if (!isAnswer && args.decision !== "dismiss") {
      const exposure = await ctx.db
        .query("ai_reference_exposures")
        .withIndex("by_scope_reference", (q) =>
          q.eq("scope", row.scope).eq("referenceId", target),
        )
        .unique();
      const phoneKey = phoneReferenceKey(exposure?.phone);
      const old = await ctx.db
        .query("ai_reference_reviews")
        .withIndex("by_reference", (q) => q.eq("referenceId", target))
        .unique();
      const values = {
        ...(phoneKey ? { phoneKey } : {}),
        suspended: args.decision === "suspend",
        note,
        evidenceUrl: args.evidenceUrl!,
        reviewedBy: user._id,
        reviewedAt: Date.now(),
      };
      if (old) await ctx.db.patch(old._id, values);
      else
        await ctx.db.insert("ai_reference_reviews", {
          referenceId: target,
          ...values,
        });
    }
    await ctx.db.patch(row._id, {
      status: "reviewed",
      resolvedReferenceId: target,
      decision: args.decision,
      reviewNote: note,
      reviewedBy: user._id,
      reviewedAt: Date.now(),
      ...(args.evidenceUrl ? { evidenceUrl: args.evidenceUrl } : {}),
    });
    await ctx.db.insert("audit_logs", {
      action: "ai.information_report_reviewed",
      entityType: "ai_information_report",
      entityId: row._id,
      userId: user._id,
      timestamp: Date.now(),
      metadata: {
        referenceId: target,
        decision: args.decision,
        evidenceUrl: args.evidenceUrl,
      },
    });
    return { success: true };
  },
});
