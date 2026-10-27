export const INDEX_STALL_MS = 30 * 60 * 1000;
type IndexState = { approvalStatus?: string; indexingStatus?: string; indexingUpdatedAt?: number; uploadedAt: number };
export function isStalledSourceIndex(doc: IndexState, now = Date.now()) {
  return doc.approvalStatus === "pending" && doc.indexingStatus === "processing" && now - (doc.indexingUpdatedAt ?? doc.uploadedAt) >= INDEX_STALL_MS;
}
export function canRetrySourceIndex(doc: IndexState, now = Date.now()) {
  return doc.approvalStatus === "pending" && (doc.indexingStatus === "failed" || isStalledSourceIndex(doc, now));
}
