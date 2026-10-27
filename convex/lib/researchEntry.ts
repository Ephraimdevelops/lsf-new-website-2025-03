export type ResearchEntryInput = { externalKey: string; kind: 'organisation' | 'centre' | 'pathway'; title: string; region?: string; district?: string; address?: string; phone?: string; email?: string; notes: string; sourceUrls: string[]; originalRecord: string };
export function validateResearchEntry(entry: ResearchEntryInput) {
  if (!['organisation','centre','pathway'].includes(entry.kind) || entry.externalKey.length < 3 || entry.externalKey.length > 200 || entry.title.trim().length < 3 || entry.title.length > 300) throw new Error('Complete the record name and research reference.');
  if (entry.notes.length > 12000 || entry.originalRecord.length > 50000) throw new Error('Research record is too large.');
  for (const value of [entry.region,entry.district,entry.address,entry.phone,entry.email]) if ((value?.length ?? 0) > 1000) throw new Error('Contact or location text is too long.');
  if (!entry.sourceUrls.length || entry.sourceUrls.length > 30) throw new Error('Keep 1–30 source links.');
  for (const source of entry.sourceUrls) { const url = new URL(source); if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Sources must be public HTTPS links.'); }
  const original = JSON.parse(entry.originalRecord);
  if (!original || typeof original !== "object" || Array.isArray(original)) throw new Error("Keep an original source record object.");
}

export function researchSearchText(entry: ResearchEntryInput) {
  return [entry.title, entry.region, entry.district, entry.address, entry.phone, entry.email, entry.notes].filter(Boolean).join(" ");
}
