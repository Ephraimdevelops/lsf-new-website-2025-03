import type { MutationCtx, QueryCtx } from "../_generated/server";

export const platformRoles = [
  "admin",
  "staff",
  "paralegal",
  "stakeholder",
  "user",
] as const;

export type PlatformRole = (typeof platformRoles)[number];
type AuthContext = QueryCtx | MutationCtx;

export async function requireAuthenticatedUser(ctx: AuthContext) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user || user.isDeleted) throw new Error("Unauthorized");
  return { identity, user };
}

export async function requireAnyRole(
  ctx: AuthContext,
  roles: readonly PlatformRole[],
) {
  const actor = await requireAuthenticatedUser(ctx);
  if (!roles.includes(actor.user.role)) throw new Error("Forbidden");
  return actor;
}
