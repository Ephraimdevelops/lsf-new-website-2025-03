import { v } from "convex/values";
import type { MutationCtx } from "./_generated/server";
import { query, mutation, internalMutation } from "./_generated/server";
import { requireAuthenticatedUser, getActiveRoles } from "./lib/auth";
import { isParalegalReady } from "./lib/paralegalAccess";
import { validPoint } from "./lib/geography";
async function requireParalegal(ctx: MutationCtx, actor: Awaited<ReturnType<typeof requireAuthenticatedUser>>) {
  const profiles = await ctx.db.query("paralegal_applications").withIndex("by_email", q => q.eq("email", actor.user.email.toLowerCase())).collect();
  if (actor.identity.emailVerified !== true || !(await getActiveRoles(ctx, actor.user._id)).includes("paralegal") || !profiles.some(p => !p.syntheticDevelopmentFixture && isParalegalReady(p))) throw new Error("An active verified paralegal account is required.");
  return actor.user;
}
export const status = query({ args: {}, handler: async ctx => {
  const { user } = await requireAuthenticatedUser(ctx);
  const location = await ctx.db.query("paralegal_locations").withIndex("by_user", q => q.eq("userId", user._id)).unique();
  const active = (await getActiveRoles(ctx, user._id)).includes("paralegal");
  return { expiresAt: active && location && location.expiresAt > Date.now() ? location.expiresAt : null };
}});
export const share = mutation({ args: { latitude: v.number(), longitude: v.number(), accuracy: v.number(), capturedAt: v.number() }, handler: async (ctx, args) => {
  const actor = await requireAuthenticatedUser(ctx);
  const user = await requireParalegal(ctx, actor), now = Date.now();
  if (!validPoint(args) || !Number.isFinite(args.capturedAt) || !Number.isFinite(args.accuracy) || args.accuracy < 0 || args.accuracy > 1000 || args.capturedAt > now + 30000 || args.capturedAt < now - 60000) throw new Error("A fresh location accurate within 1 km is required. Retry GPS.");
  const previous = await ctx.db.query("paralegal_locations").withIndex("by_user", q => q.eq("userId", user._id)).unique();
  // Store an approximate kilometre grid only; never expose a personal map pin.
  const fields = { latitude: Math.round(args.latitude * 100) / 100, longitude: Math.round(args.longitude * 100) / 100, capturedAt: now, expiresAt: now + 5 * 60000 };
  if (previous) await ctx.db.patch(previous._id, fields);
  else await ctx.db.insert("paralegal_locations", { userId: user._id, ...fields });
}});
export const stop = mutation({ args: {}, handler: async ctx => {
  const { user } = await requireAuthenticatedUser(ctx);
  const location = await ctx.db.query("paralegal_locations").withIndex("by_user", q => q.eq("userId", user._id)).unique();
  if (location) await ctx.db.delete(location._id);
}});
export const purgeExpired = internalMutation({ args: {}, handler: async ctx => {
  const expired = await ctx.db.query("paralegal_locations").withIndex("by_expiry", q => q.lte("expiresAt", Date.now())).take(100);
  for (const item of expired) await ctx.db.delete(item._id);
}});
