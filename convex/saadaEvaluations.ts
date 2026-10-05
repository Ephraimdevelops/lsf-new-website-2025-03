import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";

type RetrievedSource = { documentId: string; title: string; publisher?: string; versionLabel?: string; sourceUrl?: string };
function responseEvidence(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const value = metadata as Record<string, unknown>;
  if (typeof value.completedAt !== "number" || typeof value.questionAsked !== "string") return null;
  const retrievedSources: RetrievedSource[] = Array.isArray(value.retrievedSources) ? value.retrievedSources.filter((item: unknown): item is RetrievedSource => !!item && typeof item === "object" && typeof (item as RetrievedSource).documentId === "string" && typeof (item as RetrievedSource).title === "string").slice(0, 5) : [];
  return { completedAt: value.completedAt, questionAsked: value.questionAsked, retrievedSources };
}

export const listMyTestResponsesPage = query({
  args: { caseId: v.id("saada_evaluation_cases"), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { identity } = await requireAnyRole(ctx, ["admin", "staff"]);
    const evaluationCase = await ctx.db.get(args.caseId);
    if (!evaluationCase || evaluationCase.status !== "active") throw new Error("Active evaluation case not found.");
    const messages = await ctx.db.query("sara_chats")
      .withIndex("by_user_role_time", (q) => q.eq("userId", identity.subject).eq("role", "assistant"))
      .order("desc").paginate(args.paginationOpts);
    const wanted = evaluationCase.question.trim().replace(/\s+/g, " ").toLowerCase();
    return {
      ...messages,
      page: messages.page.flatMap((message) => {
        const evidence = responseEvidence(message.metadata);
        if (!evidence || message.timestamp < evaluationCase.createdAt || evidence.completedAt < evaluationCase.createdAt || evidence.questionAsked.trim().replace(/\s+/g, " ").toLowerCase() !== wanted) return [];
        return [{ _id: message._id, answer: message.content, timestamp: message.timestamp, ...evidence }];
      }),
    };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAnyRole(ctx, ["admin", "staff"]);
    const cases = await ctx.db.query("saada_evaluation_cases").order("desc").take(100);
    return await Promise.all(cases.map(async (item) => {
      const reviews = await ctx.db.query("saada_evaluation_reviews").withIndex("by_case", (q) => q.eq("caseId", item._id)).order("desc").take(10);
      return { ...item, reviews };
    }));
  },
});

export const listPage = query({
  args: { status: v.union(v.literal("active"), v.literal("retired")), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff"]);
    const page = await ctx.db.query("saada_evaluation_cases")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc").paginate(args.paginationOpts);
    return {
      ...page,
      page: await Promise.all(page.page.map(async (item) => ({
        ...item,
        reviews: await ctx.db.query("saada_evaluation_reviews")
          .withIndex("by_case", (q) => q.eq("caseId", item._id)).order("desc").take(10),
      }))),
    };
  },
});

export const listReviewsPage = query({
  args: { caseId: v.id("saada_evaluation_cases"), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff"]);
    const item = await ctx.db.get(args.caseId);
    if (!item) throw new Error("Evaluation case not found.");
    return ctx.db.query("saada_evaluation_reviews")
      .withIndex("by_case", (q) => q.eq("caseId", args.caseId))
      .order("desc").paginate(args.paginationOpts);
  },
});

export const createCase = mutation({
  args: { question: v.string(), language: v.union(v.literal("sw"), v.literal("en")), topic: v.string(), expectedBehavior: v.string(), riskLevel: v.union(v.literal("standard"), v.literal("high")) },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    const question = args.question.trim(); const topic = args.topic.trim(); const expectedBehavior = args.expectedBehavior.trim();
    if (question.length < 10 || question.length > 1000 || topic.length < 3 || topic.length > 100 || expectedBehavior.length < 20 || expectedBehavior.length > 2000) throw new Error("Complete the evaluation question, topic and expected safe behaviour.");
    const now = Date.now();
    const id = await ctx.db.insert("saada_evaluation_cases", { question, language: args.language, topic, expectedBehavior, riskLevel: args.riskLevel, status: "active", createdBy: user._id, createdAt: now });
    await ctx.db.insert("audit_logs", { action: "saada.evaluation_case_created", entityType: "saada_evaluation_case", entityId: id, userId: user._id, timestamp: now, metadata: { topic, riskLevel: args.riskLevel } });
    return { id };
  },
});

export const replaceCase = mutation({
  args: { id: v.id("saada_evaluation_cases"), question: v.string(), language: v.union(v.literal("sw"), v.literal("en")), topic: v.string(), expectedBehavior: v.string(), riskLevel: v.union(v.literal("standard"), v.literal("high")), reason: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin"]);
    const previous = await ctx.db.get(args.id);
    if (!previous || previous.status !== "active" || previous.replacedByCaseId) throw new Error("Active evaluation case not found.");
    const question = args.question.trim(); const topic = args.topic.trim(); const expectedBehavior = args.expectedBehavior.trim(); const reason = args.reason.trim();
    if (question.length < 10 || question.length > 1000 || topic.length < 3 || topic.length > 100 || expectedBehavior.length < 20 || expectedBehavior.length > 2000 || reason.length < 10 || reason.length > 1000) throw new Error("Complete the revised case and reason for replacement.");
    const unchanged = question === previous.question && topic === previous.topic && expectedBehavior === previous.expectedBehavior && args.language === previous.language && args.riskLevel === previous.riskLevel;
    if (unchanged) throw new Error("Change at least one field before replacing this case.");
    const now = Date.now();
    const id = await ctx.db.insert("saada_evaluation_cases", { question, language: args.language, topic, expectedBehavior, riskLevel: args.riskLevel, status: "active", createdBy: user._id, createdAt: now, replacesCaseId: args.id });
    await ctx.db.patch(args.id, { status: "retired", replacedByCaseId: id });
    await ctx.db.insert("audit_logs", { action: "saada.evaluation_case_replaced", entityType: "saada_evaluation_case", entityId: args.id, userId: user._id, timestamp: now, metadata: { replacementId: id, reason } });
    return { id };
  },
});

export const recordReview = mutation({
  args: { caseId: v.id("saada_evaluation_cases"), messageId: v.id("sara_chats"), verdict: v.union(v.literal("pass"), v.literal("fail"), v.literal("needs_legal_review")), reviewNote: v.string() },
  handler: async (ctx, args) => {
    const { user, identity } = await requireAnyRole(ctx, ["admin", "staff"]);
    const evaluationCase = await ctx.db.get(args.caseId);
    if (!evaluationCase || evaluationCase.status !== "active") throw new Error("Active evaluation case not found.");
    const message = await ctx.db.get(args.messageId);
    const evidence = responseEvidence(message?.metadata);
    if (!message || message.role !== "assistant" || message.userId !== identity.subject || !evidence) throw new Error("Select one of your completed Saada test responses.");
    if (message.timestamp < evaluationCase.createdAt || evidence.completedAt < evaluationCase.createdAt) throw new Error("This response predates the evaluation case. Run the current question again.");
    if (evidence.questionAsked.trim().replace(/\s+/g, " ").toLowerCase() !== evaluationCase.question.trim().replace(/\s+/g, " ").toLowerCase()) throw new Error("The selected response must answer this evaluation question.");
    const observedAnswer = message.content.trim(); const reviewNote = args.reviewNote.trim();
    if (observedAnswer.length < 10 || observedAnswer.length > 12000 || reviewNote.length < 10 || reviewNote.length > 2000) throw new Error("Select a complete response and record a review reason.");
    const previous = await ctx.db.query("saada_evaluation_reviews").withIndex("by_case_message", (q) => q.eq("caseId", args.caseId).eq("messageId", args.messageId)).collect();
    if (previous.some((item) => item.reviewerId === user._id)) throw new Error("You already reviewed this test response for this case.");
    const now = Date.now();
    const id = await ctx.db.insert("saada_evaluation_reviews", { caseId: args.caseId, messageId: args.messageId, questionAsked: evidence.questionAsked, retrievedSources: evidence.retrievedSources, observedAnswer, verdict: args.verdict, reviewNote, reviewerId: user._id, reviewedAt: now });
    await ctx.db.insert("audit_logs", { action: "saada.evaluation_review_recorded", entityType: "saada_evaluation_case", entityId: args.caseId, userId: user._id, timestamp: now, metadata: { verdict: args.verdict, reviewId: id, messageId: args.messageId, retrievedSourceCount: evidence.retrievedSources.length } });
    return { id };
  },
});

export const retireCase = mutation({
  args: { id: v.id("saada_evaluation_cases"), reason: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin"]);
    const item = await ctx.db.get(args.id);
    if (!item || item.status !== "active") throw new Error("Active evaluation case not found.");
    const reason = args.reason.trim();
    if (reason.length < 10 || reason.length > 1000) throw new Error("Record why this case is being retired.");
    const now = Date.now();
    await ctx.db.patch(args.id, { status: "retired" });
    await ctx.db.insert("audit_logs", { action: "saada.evaluation_case_retired", entityType: "saada_evaluation_case", entityId: args.id, userId: user._id, timestamp: now, metadata: { reason } });
    return { success: true };
  },
});
