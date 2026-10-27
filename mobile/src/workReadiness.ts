// Presentation mirrors convex/lib/paralegalAccess.isParalegalReady.
// The server remains the authority when an assignment is accepted.
type WorkProfile = {
  status: string; isVerified?: boolean; reviewedBy?: string;
  idDocumentStorageId?: string; idDocumentUrl?: string; certificateStorageId?: string;
  onboardingCompleted?: boolean; ethicsAcceptedAt?: number;
  codeOfConductAcceptedAt?: number; safeguardingTrainingCompletedAt?: number;
};
export function isParalegalReady(profile: WorkProfile | null | undefined) {
  return Boolean(profile?.status === "approved" && profile.isVerified && profile.reviewedBy
    && (profile.idDocumentStorageId || profile.idDocumentUrl) && profile.certificateStorageId
    && profile.onboardingCompleted && profile.ethicsAcceptedAt && profile.codeOfConductAcceptedAt
    && profile.safeguardingTrainingCompletedAt);
}
