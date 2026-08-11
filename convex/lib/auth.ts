import type { MutationCtx, QueryCtx } from "../_generated/server";
import { ConvexError } from "convex/values";

export const platformRoles = [
  "admin",
  "staff",
  "supervisor",
  "content_editor",
  "paralegal",
  "provider_staff",
  "stakeholder",
  "donor",
  "user",
] as const;

export type PlatformRole = (typeof platformRoles)[number];
type AuthContext = QueryCtx | MutationCtx;

export async function requireAuthenticatedUser(ctx: AuthContext) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("Unauthorized");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user || user.isDeleted) throw new ConvexError("Unauthorized");
  return { identity, user };
}

export async function getActiveRoles(
  ctx: AuthContext,
  userId: Parameters<typeof ctx.db.get<"users">>[0],
) {
  const user = await ctx.db.get(userId);
  if (!user || user.isDeleted) return [];
  const assignments = await ctx.db
    .query("role_assignments")
    .withIndex("by_user_status", (q) =>
      q.eq("userId", userId).eq("status", "active"),
    )
    .collect();
  return [...new Set<PlatformRole>([
    user.role,
    ...assignments.map((assignment) => assignment.role),
  ])];
}

export async function requireAnyRole(
  ctx: AuthContext,
  roles: readonly PlatformRole[],
) {
  const actor = await requireAuthenticatedUser(ctx);
  const assignments = await ctx.db
    .query("role_assignments")
    .withIndex("by_user_status", (q) =>
      q.eq("userId", actor.user._id).eq("status", "active"),
    )
    .collect();

  const assignedRoles = assignments.map((assignment) => assignment.role);
  const hasAssignedRole = assignedRoles.some((role) => roles.includes(role));
  const hasLegacyRole = roles.includes(actor.user.role);
  if (!hasAssignedRole && !hasLegacyRole) throw new ConvexError("Forbidden");

  return { ...actor, assignments };
}
