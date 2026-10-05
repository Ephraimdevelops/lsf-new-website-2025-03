import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";

function validText(value: string, min: number, max: number) {
  const text = value.trim();
  if (text.length < min || text.length > max) throw new ConvexError(`Text must be between ${min} and ${max} characters.`);
  return text;
}

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAnyRole(ctx, ["paralegal", "admin", "staff"]);
    const now = Date.now();
    const modules = await ctx.db.query("paralegal_training_modules").withIndex("by_status", (q) => q.eq("status", "approved")).collect();
    return await Promise.all(modules.filter((item) => item.reviewDueAt > now).map(async (item) => {
      const completion = await ctx.db.query("paralegal_training_completions").withIndex("by_user_module", (q) => q.eq("userId", user._id).eq("moduleId", item._id)).unique();
      return { ...item, completedAt: completion?.moduleVersion === item.version ? completion.completedAt : null };
    }));
  },
});

export const listForReview = query({
  args: {},
  handler: async (ctx) => {
    await requireAnyRole(ctx, ["admin", "staff"]);
    return await ctx.db.query("paralegal_training_modules").order("desc").take(100);
  },
});

export const submit = mutation({
  args: { titleSw: v.string(), titleEn: v.string(), contentSw: v.string(), contentEn: v.string(), topic: v.string(), sourceTitle: v.string(), sourceUrl: v.string(), required: v.boolean(), reviewDueAt: v.number(), replacesModuleId: v.optional(v.id("paralegal_training_modules")) },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    const titleSw = validText(args.titleSw, 5, 150); const titleEn = validText(args.titleEn, 5, 150);
    const contentSw = validText(args.contentSw, 100, 10000); const contentEn = validText(args.contentEn, 100, 10000);
    const topic = validText(args.topic, 3, 100); const sourceTitle = validText(args.sourceTitle, 5, 200);
    if (!/^https:\/\//i.test(args.sourceUrl) || args.reviewDueAt <= Date.now()) throw new ConvexError("An HTTPS source and future review date are required.");
    const previous = args.replacesModuleId ? await ctx.db.get(args.replacesModuleId) : null;
    if (args.replacesModuleId && (!previous || previous.status !== "approved")) throw new ConvexError("Only an approved module can be replaced.");
    if (previous) {
      const pending = await ctx.db.query("paralegal_training_modules")
        .withIndex("by_replaces_status", (q) => q.eq("replacesModuleId", previous._id).eq("status", "pending"))
        .first();
      if (pending) throw new ConvexError("A replacement is already awaiting review.");
    }
    const now = Date.now();
    const id = await ctx.db.insert("paralegal_training_modules", { titleSw, titleEn, contentSw, contentEn, topic, sourceTitle, sourceUrl: args.sourceUrl.trim(), required: args.required, reviewDueAt: args.reviewDueAt, version: (previous?.version ?? 0) + 1, replacesModuleId: previous?._id, status: "pending", submittedBy: user._id, submittedAt: now });
    await ctx.db.insert("audit_logs", { action: "training.module_submitted", entityType: "paralegal_training_module", entityId: id, userId: user._id, timestamp: now, metadata: { required: args.required } });
    return id;
  },
});

export const review = mutation({
  args: { id: v.id("paralegal_training_modules"), decision: v.union(v.literal("approved"), v.literal("rejected")), note: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin"]);
    const item = await ctx.db.get(args.id);
    if (!item || item.status !== "pending") throw new ConvexError("Pending module not found.");
    if (item.submittedBy === user._id) throw new ConvexError("A different administrator must review this module.");
    const note = validText(args.note, 10, 1000); const now = Date.now();
    if (args.decision === "approved" && item.reviewDueAt <= now) throw new ConvexError("Review date has passed.");
    if (args.decision === "approved" && item.replacesModuleId) {
      const previous = await ctx.db.get(item.replacesModuleId);
      if (!previous || previous.status !== "approved") throw new ConvexError("The previous module is no longer current.");
      await ctx.db.patch(previous._id, { status: "retired", reviewNote: `Replaced by version ${item.version}`, reviewedAt: now });
    }
    await ctx.db.patch(item._id, { status: args.decision, reviewedBy: user._id, reviewedAt: now, reviewNote: note });
    await ctx.db.insert("audit_logs", { action: `training.module_${args.decision}`, entityType: "paralegal_training_module", entityId: item._id, userId: user._id, timestamp: now, metadata: { note } });
    return { success: true };
  },
});

export const retire = mutation({
  args: { id: v.id("paralegal_training_modules"), reason: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin"]);
    const item = await ctx.db.get(args.id);
    if (!item || item.status !== "approved") throw new ConvexError("Approved module not found.");
    const reason = validText(args.reason, 10, 1000); const now = Date.now();
    await ctx.db.patch(item._id, { status: "retired", reviewNote: reason, reviewedBy: user._id, reviewedAt: now });
    await ctx.db.insert("audit_logs", { action: "training.module_retired", entityType: "paralegal_training_module", entityId: item._id, userId: user._id, timestamp: now, metadata: { reason } });
    return { success: true };
  },
});

export const acknowledge = mutation({
  args: { id: v.id("paralegal_training_modules") },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["paralegal"]);
    const item = await ctx.db.get(args.id); const now = Date.now();
    if (!item || item.status !== "approved" || item.reviewDueAt <= now) throw new ConvexError("Approved current module not found.");
    const existing = await ctx.db.query("paralegal_training_completions").withIndex("by_user_module", (q) => q.eq("userId", user._id).eq("moduleId", item._id)).unique();
    if (existing?.moduleVersion === item.version) return { success: true, completedAt: existing.completedAt };
    if (existing) await ctx.db.patch(existing._id, { completedAt: now, moduleVersion: item.version });
    else await ctx.db.insert("paralegal_training_completions", { moduleId: item._id, userId: user._id, completedAt: now, moduleVersion: item.version });
    await ctx.db.insert("audit_logs", { action: "training.module_acknowledged", entityType: "paralegal_training_module", entityId: item._id, userId: user._id, timestamp: now, metadata: { version: item.version } });
    return { success: true, completedAt: now };
  },
});

export const readiness = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAnyRole(ctx, ["paralegal"]);
    const now = Date.now();
    const approved = await ctx.db.query("paralegal_training_modules").withIndex("by_status", (q) => q.eq("status", "approved")).collect();
    const required = approved.filter((item) => item.required && item.reviewDueAt > now);
    const completions = await Promise.all(required.map(async (item) => {
      const completion = await ctx.db.query("paralegal_training_completions").withIndex("by_user_module", (q) => q.eq("userId", user._id).eq("moduleId", item._id)).unique();
      return completion?.moduleVersion === item.version;
    }));
    return { requiredCount: required.length, completedCount: completions.filter(Boolean).length };
  },
});
