export type GuideContent = {
  titleSw: string; titleEn: string; summarySw: string; summaryEn: string;
  stepsSw: string[]; stepsEn: string[]; category: string;
  jurisdiction: 'national' | 'tanzania_mainland' | 'zanzibar';
  sourceTitle: string; sourceUrl: string; publisher: string; reviewDueAt: number;
  coverImageUrl?: string; coverImageAltSw?: string; coverImageAltEn?: string;
};

function publicHttps(value: string, label: string) {
  let url: URL;
  try { url = new URL(value); } catch { throw new Error(`${label} must be a valid HTTPS URL.`); }
  if (url.protocol !== 'https:' || !url.hostname.includes('.') || url.username || url.password) {
    throw new Error(`${label} must be a public HTTPS URL without credentials.`);
  }
  return url.toString();
}

export function validateGuideContent(input: GuideContent, now = Date.now()) {
  const values = [input.titleSw, input.titleEn, input.summarySw, input.summaryEn, input.category, input.sourceTitle, input.publisher];
  if (values.some(value => typeof value !== 'string' || value.trim().length < 3 || value.length > 10000)) {
    throw new Error('Complete both languages and source metadata (3–10000 characters per field).');
  }
  for (const steps of [input.stepsSw, input.stepsEn]) {
    if (!Array.isArray(steps) || steps.length < 1 || steps.length > 12 || steps.some(step => typeof step !== 'string' || step.trim().length < 8 || step.length > 5000)) {
      throw new Error('Provide 1–12 practical steps per language, each 8–5000 characters.');
    }
  }
  if (!['national', 'tanzania_mainland', 'zanzibar'].includes(input.jurisdiction)) throw new Error('Choose a supported jurisdiction.');
  if (!Number.isFinite(input.reviewDueAt) || input.reviewDueAt <= now || input.reviewDueAt > now + 3 * 365 * 86400000) throw new Error('Choose a review date within three years.');
  const sourceUrl = publicHttps(input.sourceUrl, 'Source');
  const coverImageUrl = input.coverImageUrl?.trim() ? publicHttps(input.coverImageUrl.trim(), 'Cover image') : undefined;
  const coverImageAltSw = input.coverImageAltSw?.trim() || undefined;
  const coverImageAltEn = input.coverImageAltEn?.trim() || undefined;
  if (coverImageUrl && [coverImageAltSw, coverImageAltEn].some(alt => !alt || alt.length < 3 || alt.length > 300)) {
    throw new Error('Describe the image in both languages (3–300 characters each).');
  }
  return { sourceUrl, coverImageUrl, coverImageAltSw: coverImageUrl ? coverImageAltSw : undefined, coverImageAltEn: coverImageUrl ? coverImageAltEn : undefined };
}

export function requireEditableGuide(guide: { status: string; submittedBy: string } | null, actorId: string) {
  if (!guide || guide.status !== 'pending' || guide.submittedBy !== actorId) {
    throw new Error('Only the author can edit their own pending guide. Use a new version for approved content.');
  }
}

export function guideImportKey(guide: Pick<GuideContent, 'titleSw' | 'titleEn' | 'sourceUrl' | 'category' | 'jurisdiction'>) {
  return JSON.stringify([guide.titleSw.trim(), guide.titleEn.trim(), guide.sourceUrl.trim(), guide.category.trim(), guide.jurisdiction]);
}

export function parseGuideImport(value: unknown, reviewDueAt: number, now = Date.now()): GuideContent[] {
  const rows = Array.isArray(value) ? value : (value as { guides?: unknown[] } | null)?.guides;
  if (!Array.isArray(rows) || rows.length < 1 || rows.length > 250) throw new Error('Choose a JSON pack containing 1–250 guides.');
  const seen = new Set<string>();
  return rows.map((row, index) => {
    const raw = ((row as { appFieldsDraft?: unknown })?.appFieldsDraft ?? row) as GuideContent;
    if (!raw || typeof raw !== 'object') throw new Error(`Guide ${index + 1} is not a guide record.`);
    const guide: GuideContent = {
      titleSw: raw.titleSw, titleEn: raw.titleEn, summarySw: raw.summarySw, summaryEn: raw.summaryEn,
      stepsSw: raw.stepsSw, stepsEn: raw.stepsEn, category: raw.category, jurisdiction: raw.jurisdiction,
      sourceTitle: raw.sourceTitle, sourceUrl: raw.sourceUrl, publisher: raw.publisher, reviewDueAt,
      ...(raw.coverImageUrl ? { coverImageUrl: raw.coverImageUrl, coverImageAltSw: raw.coverImageAltSw, coverImageAltEn: raw.coverImageAltEn } : {}),
    };
    try { validateGuideContent(guide, now); } catch (error) { throw new Error(`Guide ${index + 1}: ${error instanceof Error ? error.message : 'Invalid content'}`); }
    const key = guideImportKey(guide);
    if (seen.has(key)) throw new Error(`Guide ${index + 1} duplicates another guide in this file.`);
    seen.add(key);
    return guide;
  });
}
