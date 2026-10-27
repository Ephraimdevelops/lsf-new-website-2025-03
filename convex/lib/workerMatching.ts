import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { hasCurrentServiceReview } from "./directoryLifecycle";
import { validPoint, type Point } from "./geography";
export function declaredCapacity(profile: { availabilityStatus?: string; weeklyCapacity?: number } | null, activeLoad: number) {
  const availabilityStatus = profile?.availabilityStatus ?? "unknown";
  const weeklyCapacity = Number.isFinite(profile?.weeklyCapacity) && profile!.weeklyCapacity! >= 0 ? Math.floor(profile!.weeklyCapacity!) : null;
  const remainingCapacity = weeklyCapacity === null ? null : Math.max(0, weeklyCapacity - activeLoad);
  const canOffer = ["accepting_cases", "limited"].includes(availabilityStatus) && remainingCapacity !== null && remainingCapacity > 0;
  return { availabilityStatus, weeklyCapacity, remainingCapacity, canOffer };
}
export async function workerMatchingPoint(ctx: QueryCtx | MutationCtx, userId: Id<"users">, serviceId?: Id<"justice_services">, now = Date.now()): Promise<{ point: Point | null; source: "current_location" | "office" | "unknown" }> {
  const current = await ctx.db.query("paralegal_locations").withIndex("by_user", q => q.eq("userId", userId)).unique();
  if (current && current.expiresAt > now && current.capturedAt <= now && current.capturedAt > now - 5 * 60000 && validPoint(current)) return { point: { latitude: current.latitude, longitude: current.longitude }, source: "current_location" };
  const office = serviceId ? await ctx.db.get(serviceId) : null;
  if (office && office.active && office.visibility === "public" && office.verificationStatus === "verified" && office.servicePointType !== "safe_house" && hasCurrentServiceReview(office.nextReviewAt, now) && validPoint(office)) return { point: { latitude: office.latitude, longitude: office.longitude }, source: "office" };
  return { point: null, source: "unknown" };
}

export async function workerCapacity(ctx: QueryCtx | MutationCtx, userId: Id<"users">, profile: { availabilityStatus?: string; weeklyCapacity?: number } | null) {
  const assignments = await ctx.db.query("case_assignments").withIndex("by_assignee_status", q => q.eq("assigneeId", userId).eq("status", "accepted")).collect();
  const cases = await Promise.all(assignments.map(item => ctx.db.get(item.caseId)));
  const activeLoad = cases.filter(item => item && !["resolved", "closed_unresolved", "closed"].includes(item.status)).length;
  return { ...declaredCapacity(profile, activeLoad), activeLoad };
}
