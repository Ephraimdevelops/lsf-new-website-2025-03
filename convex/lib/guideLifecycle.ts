export function requireGuideResubmission(
  rejected: { status: string; submittedBy: string; replacesGuideId?: string } | null,
  editorId: string,
  replacementTargetId?: string,
) {
  if (!rejected || rejected.status !== "rejected") throw new Error("Only a rejected guide can be resubmitted.");
  if (rejected.submittedBy !== editorId) throw new Error("The original editor must resubmit this rejected guide.");
  if (rejected.replacesGuideId !== replacementTargetId) throw new Error("The resubmission must retain its original replacement target.");
}
