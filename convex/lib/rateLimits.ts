import { ConvexError } from "convex/values";
import type { MutationCtx } from "../_generated/server";

export async function enforceRateLimit(ctx: MutationCtx, key: string, maximum: number, windowMs: number, cost = 1) {
  const now = Date.now();
  const row = await ctx.db.query("rate_limits").withIndex("by_identifier", q => q.eq("identifier", key)).first();
  const fresh = !row || now - row.windowStart >= windowMs;
  const count = fresh ? 0 : row.count;
  if (cost <= 0 || !Number.isSafeInteger(cost) || count + cost > maximum) {
    throw new ConvexError({ code: "RATE_LIMITED", retryAfterMs: fresh ? windowMs : Math.max(1, row!.windowStart + windowMs - now), message: "Please wait before trying again." });
  }
  const next = { count: count + cost, windowStart: fresh ? now : row!.windowStart };
  if (row) await ctx.db.patch(row._id, next);
  else await ctx.db.insert("rate_limits", { identifier: key, ...next });
}
