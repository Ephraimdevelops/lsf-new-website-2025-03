import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser, requireAnyRole } from "./lib/auth";
import { monthlyLimitMicroUsd } from "./lib/aiPricing";

export const reserve = internalMutation({
  args: {
    feature: v.string(),
    model: v.string(),
    estimateMicroUsd: v.number(),
    priced: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { identity } = await requireAuthenticatedUser(ctx);
    if (
      !Number.isSafeInteger(args.estimateMicroUsd) ||
      args.estimateMicroUsd < 0 ||
      args.feature.length > 80 ||
      args.model.length > 100
    )
      throw new Error("Invalid AI cost reservation.");
    const month = new Date().toISOString().slice(0, 7);
    const limit = monthlyLimitMicroUsd(process.env.SAADA_MONTHLY_BUDGET_USD);
    let ledger = await ctx.db
      .query("ai_usage_months")
      .withIndex("by_month", (q) => q.eq("month", month))
      .unique();
    if (limit !== null && (!args.priced || (ledger?.unpricedCalls ?? 0) > 0))
      throw new Error(
        "AI cost cannot be bounded for this operation. Use the existing non-AI flow or ask an administrator to review metering.",
      );
    if (
      limit !== null &&
      (ledger?.committedMicroUsd ?? 0) +
        (ledger?.reservedMicroUsd ?? 0) +
        args.estimateMicroUsd >
        limit
    )
      throw new Error(
        "AI monthly spending allowance reached. Existing records and non-AI support remain available.",
      );
    if (!ledger) {
      const id = await ctx.db.insert("ai_usage_months", {
        month,
        committedMicroUsd: 0,
        reservedMicroUsd: 0,
        callCount: 0,
        unpricedCalls: 0,
      });
      ledger = (await ctx.db.get(id))!;
    }
    await ctx.db.patch(ledger._id, {
      reservedMicroUsd: ledger.reservedMicroUsd + args.estimateMicroUsd,
      callCount: ledger.callCount + 1,
      unpricedCalls: ledger.unpricedCalls + (args.priced ? 0 : 1),
    });
    return ctx.db.insert("ai_usage_calls", {
      month,
      ownerClerkId: identity.subject,
      feature: args.feature,
      model: args.model,
      reservationMicroUsd: args.estimateMicroUsd,
      priced: args.priced,
      status: "reserved",
      createdAt: Date.now(),
    });
  },
});

export const settle = internalMutation({
  args: {
    id: v.id("ai_usage_calls"),
    actualMicroUsd: v.optional(v.number()),
    inputTokens: v.optional(v.number()),
    outputTokens: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { identity } = await requireAuthenticatedUser(ctx);
    const call = await ctx.db.get(args.id);
    if (!call || call.ownerClerkId !== identity.subject)
      throw new Error("AI cost receipt access denied.");
    if (call.status !== "reserved") return; // Replay cannot double charge or refund.
    for (const n of [args.actualMicroUsd, args.inputTokens, args.outputTokens])
      if (n !== undefined && (!Number.isSafeInteger(n) || n < 0))
        throw new Error("Invalid AI usage receipt.");
    const ledger = await ctx.db
      .query("ai_usage_months")
      .withIndex("by_month", (q) => q.eq("month", call.month))
      .unique();
    if (!ledger) throw new Error("AI cost ledger missing.");
    const cost = args.actualMicroUsd ?? call.reservationMicroUsd;
    await ctx.db.patch(ledger._id, {
      reservedMicroUsd: Math.max(
        0,
        ledger.reservedMicroUsd - call.reservationMicroUsd,
      ),
      committedMicroUsd: ledger.committedMicroUsd + cost,
      unpricedCalls:
        Math.max(
          0,
          ledger.unpricedCalls -
            (!call.priced && args.actualMicroUsd !== undefined ? 1 : 0),
        ) + (call.priced && cost > call.reservationMicroUsd ? 1 : 0),
    });
    await ctx.db.patch(call._id, {
      status: args.actualMicroUsd === undefined ? "uncertain" : "settled",
      costMicroUsd: cost,
      inputTokens: args.inputTokens,
      outputTokens: args.outputTokens,
      finishedAt: Date.now(),
    });
  },
});

export const status = query({
  args: {},
  handler: async (ctx) => {
    await requireAnyRole(ctx, ["admin", "staff"]);
    const month = new Date().toISOString().slice(0, 7);
    const row = await ctx.db
      .query("ai_usage_months")
      .withIndex("by_month", (q) => q.eq("month", month))
      .unique();
    const limit = monthlyLimitMicroUsd(process.env.SAADA_MONTHLY_BUDGET_USD);
    const committed = row?.committedMicroUsd ?? 0,
      reserved = row?.reservedMicroUsd ?? 0;
    const fraction = limit === null ? null : (committed + reserved) / limit;
    return {
      month,
      mode: limit === null ? "monitoring" : "enforcing",
      limitUSD: limit === null ? null : limit / 1e6,
      committedEstimateUSD: committed / 1e6,
      reservedEstimateUSD: reserved / 1e6,
      calls: row?.callCount ?? 0,
      unpricedCalls: row?.unpricedCalls ?? 0,
      alert:
        fraction === null
          ? "limit_not_configured"
          : fraction >= 1
            ? "limit_reached"
            : fraction >= 0.8
              ? "near_limit"
              : "within_limit",
      note: "Application estimates since metering started; not the OpenAI invoice. Failed or interrupted calls retain reservations. Audio without a server-validated duration bound and unpriced models are blocked in enforcing mode.",
    };
  },
});
