export function requireIndependentDirectoryReviewer(actorId: string, createdBy: string, lastMaterialEditedBy?: string) {
  if (actorId === createdBy || actorId === lastMaterialEditedBy) {
    throw new Error("A different LSF reviewer must verify this record.");
  }
}

export function requireDirectoryDecisionReason(value: string | undefined) {
  const reason = value?.trim();
  if (!reason || reason.length < 10 || reason.length > 1000) {
    throw new Error("Record a 10–1000 character lifecycle decision reason.");
  }
  return reason;
}

export function requireDraftOrganisation(verificationStatus: string, referralAgreementStatus: string) {
  if (verificationStatus !== "draft" || !["none", "draft"].includes(referralAgreementStatus)) {
    throw new Error("Create an organisation draft first. Verification and referral activation require a separate review.");
  }
}

export function requireDraftService(verificationStatus: string, active: boolean) {
  if (verificationStatus !== "draft" || active) {
    throw new Error("Create an inactive service draft first. Verification and activation require review.");
  }
}

export function requireActiveReferralReadiness(verificationStatus: string, safeguardingReady: boolean, dataSharingAgreementVersion?: string) {
  if (verificationStatus !== "verified") throw new Error("Only verified organizations can have an active referral agreement.");
  if (!safeguardingReady || !dataSharingAgreementVersion?.trim()) {
    throw new Error("An active referral agreement requires confirmed safeguarding readiness and a data-sharing agreement version.");
  }
}

export function referralStatusAfterOrganisationChange(verificationStatus: string, currentStatus: string, requestedStatus?: string) {
  if (verificationStatus !== "verified") {
    if (requestedStatus === "active") throw new Error("An unverified organisation cannot activate referrals.");
    return currentStatus === "active" ? "suspended" : requestedStatus ?? currentStatus;
  }
  return requestedStatus ?? currentStatus;
}

export function isReferralOrganisationBlocked(verificationStatus?: string) {
  return verificationStatus === "suspended" || verificationStatus === "inactive";
}

export function requireLinkedCorrectionUpdate(submittedAt: number, linkedServiceUpdateAt: number | undefined, currentServiceUpdatedAt: number | undefined) {
  if (!linkedServiceUpdateAt || linkedServiceUpdateAt < submittedAt || !currentServiceUpdatedAt || currentServiceUpdatedAt < linkedServiceUpdateAt) {
    throw new Error("Edit the service from this correction request before marking it applied.");
  }
}

export function hasCurrentServiceReview(nextReviewAt: number | undefined, now: number) {
  return typeof nextReviewAt === "number" && nextReviewAt > now;
}

export function isServiceReviewOverdue(verificationStatus: string, nextReviewAt: number | undefined, now: number) {
  return verificationStatus === "verified" && !hasCurrentServiceReview(nextReviewAt, now);
}
