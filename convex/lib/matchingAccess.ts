import { ConvexError } from "convex/values";

type MatchingSource = "navigator" | "saada" | "staff" | "directory";

export function acceptsMatchingIntake(
  state: "open" | "limited" | "closed" | "emergency_only",
  urgency?: "standard" | "urgent" | "immediate_safety",
  capacity?: number,
) {
  if (state === "closed" || (capacity !== undefined && capacity <= 0)) return false;
  return state !== "emergency_only" || urgency === "immediate_safety";
}

export function requireMatchingSource(source: MatchingSource, isStaff: boolean) {
  if (source === "saada" || (source === "staff" && !isStaff)) {
    throw new ConvexError("This matching source cannot be selected from a public client.");
  }
}

export function requireMatchingLinkAccess(args: {
  actorId?: string;
  requestOwnerId?: string;
  caseBeneficiaryId?: string;
  caseSourceRequestId?: string;
  requestId?: string;
  isStaff: boolean;
  canAccessCase: boolean;
}) {
  const { actorId, requestOwnerId, caseBeneficiaryId, caseSourceRequestId, requestId, isStaff, canAccessCase } = args;
  if ((requestOwnerId || caseBeneficiaryId) && !actorId) throw new ConvexError("Sign in before matching a private request or case.");
  if (requestOwnerId && actorId !== requestOwnerId && !isStaff) throw new ConvexError("Request access denied.");
  if (caseBeneficiaryId && !canAccessCase) throw new ConvexError("Case access denied.");
  if (requestId && caseSourceRequestId && requestId !== caseSourceRequestId) throw new ConvexError("The case does not belong to this request.");
}
