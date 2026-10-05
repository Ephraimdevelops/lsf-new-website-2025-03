export function requireReadySourceForApproval(source: {
  indexingStatus?: string;
  processedAt?: number;
  publisher?: string;
  jurisdiction?: string;
  language?: string;
  contentCategory?: string;
  versionLabel?: string;
  reviewDueAt?: number;
}, hasIndexedChunk: boolean, now: number) {
  if (source.indexingStatus !== "ready" || !source.processedAt || !hasIndexedChunk) {
    throw new Error("Source indexing must finish with searchable content before approval.");
  }
  if (!source.publisher?.trim() || !source.jurisdiction || !source.language || !source.contentCategory?.trim() || !source.versionLabel?.trim()) {
    throw new Error("Complete source provenance before approval.");
  }
  if (!source.reviewDueAt || source.reviewDueAt <= now) {
    throw new Error("Review due date must be in the future.");
  }
}
