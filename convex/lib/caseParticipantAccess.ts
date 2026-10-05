export function canUseCaseParticipantRole(participantRole: string, activeRoles: ReadonlySet<string>) {
  if (activeRoles.has("admin") || activeRoles.has("supervisor")) return true;
  if (participantRole === "paralegal") return activeRoles.has("paralegal");
  if (participantRole === "provider_staff") return activeRoles.has("provider_staff");
  if (participantRole === "case_officer") return activeRoles.has("staff");
  if (participantRole === "supervisor") return activeRoles.has("supervisor");
  return false;
}

export function canUseScopedCaseAffiliation(verificationStatus: string | undefined, hasMatchingActiveAssignment: boolean) {
  return verificationStatus === "verified" && hasMatchingActiveAssignment;
}

export function requireIndependentLegacyScopeReview(reviewerId: string, addedById: string, workerId: string) {
  if (reviewerId === addedById || reviewerId === workerId) throw new Error("A different administrator must review this case affiliation.");
}

export function canClassifyIndependentParalegal(participantRole: string, baseRole: string, hasActiveOrganisationMembership: boolean) {
  return participantRole === "paralegal" && baseRole === "paralegal" && !hasActiveOrganisationMembership;
}
