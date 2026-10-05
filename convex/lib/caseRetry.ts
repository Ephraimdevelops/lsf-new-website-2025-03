export function isSameCaseRetry(
  existing: { caseId: string; kind: string },
  requested: { caseId: string; kind: string },
) {
  return existing.caseId === requested.caseId && existing.kind === requested.kind;
}
