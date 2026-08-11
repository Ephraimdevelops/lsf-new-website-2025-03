import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";

export type CaseStatus = Doc<"cases">["status"];

export const caseTransitions: Record<CaseStatus, readonly CaseStatus[]> = {
  under_review: ["waiting_for_information", "assignment_pending", "referred", "closed_unresolved"],
  waiting_for_information: ["under_review", "assignment_pending", "closed_unresolved"],
  assignment_pending: ["assigned", "referred", "closed_unresolved"],
  assigned: ["assignment_pending", "appointment_scheduled", "assistance_underway", "referred", "closed_unresolved"],
  appointment_scheduled: ["assignment_pending", "assistance_underway", "assigned", "closed_unresolved"],
  referred: ["assignment_pending", "assistance_underway", "closed_unresolved"],
  assistance_underway: ["assignment_pending", "appointment_scheduled", "referred", "resolved", "closed_unresolved"],
  resolved: ["closed"],
  closed_unresolved: ["closed"],
  closed: [],
};

export function assertCaseTransition(from: CaseStatus, to: CaseStatus) {
  if (!caseTransitions[from].includes(to)) {
    throw new ConvexError({ code: "CONFLICT", message: `Invalid case transition: ${from} to ${to}` });
  }
}
