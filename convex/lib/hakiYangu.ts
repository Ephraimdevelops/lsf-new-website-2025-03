import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { requireAuthenticatedUser } from "./auth";
export { assertCaseTransition, caseTransitions } from "./caseLifecycle";

type AuthContext = QueryCtx | MutationCtx;
export async function getActorRoleSet(ctx: AuthContext, userId: Id<"users">) {
  const user = await ctx.db.get(userId);
  if (!user || user.isDeleted) throw new ConvexError({ code: "UNAUTHENTICATED", message: "User unavailable" });

  const assignments = await ctx.db
    .query("role_assignments")
    .withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "active"))
    .collect();

  return new Set<string>([user.role, ...assignments.map((assignment) => assignment.role)]);
}

export async function requireCaseAccess(ctx: AuthContext, caseId: Id<"cases">) {
  const actor = await requireAuthenticatedUser(ctx);
  const caseRecord = await ctx.db.get(caseId);
  if (!caseRecord) throw new ConvexError({ code: "NOT_FOUND", message: "Case not found" });

  if (caseRecord.beneficiaryId === actor.user._id) return { ...actor, caseRecord };

  const participant = await ctx.db
    .query("case_participants")
    .withIndex("by_case_user", (q) => q.eq("caseId", caseId).eq("userId", actor.user._id))
    .filter((q) => q.eq(q.field("status"), "active"))
    .first();
  if (participant) return { ...actor, caseRecord, participant };

  const roles = await getActorRoleSet(ctx, actor.user._id);
  if (roles.has("admin") || roles.has("supervisor")) {
    return { ...actor, caseRecord };
  }

  throw new ConvexError({ code: "FORBIDDEN", message: "Case access denied" });
}

export async function requireCaseWorker(ctx: AuthContext, caseId: Id<"cases">) {
  const access = await requireCaseAccess(ctx, caseId);
  const roles = await getActorRoleSet(ctx, access.user._id);
  const isStaff = roles.has("admin") || roles.has("supervisor");
  const isWorker = "participant" in access && access.participant.role !== "beneficiary";
  if (!isStaff && !isWorker) {
    throw new ConvexError({ code: "FORBIDDEN", message: "Case worker access required" });
  }
  return access;
}

export async function writeAudit(
  ctx: MutationCtx,
  actorId: Id<"users">,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, unknown>,
) {
  await ctx.db.insert("audit_logs", {
    action,
    entityType,
    entityId,
    userId: actorId,
    timestamp: Date.now(),
    metadata,
  });
}
