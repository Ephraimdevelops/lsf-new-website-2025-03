export function requireIndependentBaseRoleReview(requestedBy: string, reviewerId: string, targetId: string) {
  if (requestedBy === reviewerId || reviewerId === targetId || requestedBy === targetId) {
    throw new Error("A different administrator must request and review this change; nobody may change their own base role.");
  }
}

export function requireRemainingAdministrator(targetId: string, activeAdminIds: readonly string[]) {
  if (new Set(activeAdminIds.filter((id) => id !== targetId)).size === 0) {
    throw new Error("The last active administrator cannot lose admin access.");
  }
}
