export const sourceMetadataFields = ['title', 'publisher', 'sourceUrl', 'jurisdiction', 'language', 'contentCategory', 'versionLabel', 'effectiveDate', 'reviewDueAt'] as const;

export function sourceMetadataSnapshot(source: object) {
  const record = source as Record<string, unknown>;
  return JSON.stringify(sourceMetadataFields.map(key => record[key] ?? null));
}

export function normalizeSourceMetadata<T extends Record<string, unknown>>(input: T, now: number) {
  const metadata = { ...input };
  for (const [key, maximum] of [['title', 180], ['publisher', 180], ['contentCategory', 100], ['versionLabel', 80]] as const) {
    const value = String(input[key] ?? '').trim();
    if (!value || value.length > maximum) throw new Error(`${key} must contain 1–${maximum} characters.`);
    (metadata as Record<string, unknown>)[key] = value;
  }
  const url = String(input.sourceUrl ?? '').trim();
  if (url) {
    try { const parsed = new URL(url); if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password || url.length > 2000) throw new Error(); }
    catch { throw new Error('Enter a valid public HTTP(S) source URL.'); }
  }
  (metadata as Record<string, unknown>).sourceUrl = url || undefined;
  const effectiveDate = String(input.effectiveDate ?? '').trim();
  if (effectiveDate && (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate) || new Date(effectiveDate).toISOString().slice(0,10) !== effectiveDate)) throw new Error('Enter a valid effective date.');
  (metadata as Record<string, unknown>).effectiveDate = effectiveDate || undefined;
  if (typeof input.reviewDueAt !== 'number' || !Number.isFinite(input.reviewDueAt) || input.reviewDueAt <= now) throw new Error('Review due date must be in the future.');
  return metadata;
}
