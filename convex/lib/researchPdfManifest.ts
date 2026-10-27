export type ResearchPdfInput = {
  researchSourceId: string; filename: string; sha256: string; byteSize: number;
  title: string; provenance: string;
};
/** Older Convex deployments expose storage hashes as base64; newer ones use hex. */
export function storageChecksumHex(checksum: string): string {
  if (/^[a-fA-F0-9]{64}$/.test(checksum)) return checksum.toLowerCase();
  if (!/^[A-Za-z0-9+/]{43}=$/.test(checksum)) throw new Error('Unsupported stored checksum format.');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let bits = 0, count = 0, hex = '';
  for (const char of checksum.slice(0, -1)) {
    bits = (bits << 6) | alphabet.indexOf(char); count += 6;
    if (count >= 8) { count -= 8; hex += ((bits >>> count) & 255).toString(16).padStart(2, '0'); }
    bits &= (1 << count) - 1;
  }
  if (hex.length !== 64) throw new Error('Invalid stored checksum length.');
  return hex;
}
export function validateResearchPdf(input: ResearchPdfInput): void {
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(input.researchSourceId)) throw new Error('Invalid research source reference.');
  if (!input.filename.toLowerCase().endsWith('.pdf') || /[\\/]/.test(input.filename) || input.filename.length > 180) throw new Error('Use a PDF filename without directories.');
  if (!/^[a-f0-9]{64}$/.test(input.sha256)) throw new Error('Invalid SHA-256 checksum.');
  if (!Number.isInteger(input.byteSize) || input.byteSize <= 0 || input.byteSize > 50 * 1024 * 1024) throw new Error('Research PDFs must be non-empty and at most 50 MiB.');
  if (!input.title.trim() || input.title.length > 180) throw new Error('A research title of at most 180 characters is required.');
  if (input.provenance.length > 64000) throw new Error('Research provenance is too large.');
  const original: unknown = JSON.parse(input.provenance);
  if (!original || typeof original !== 'object' || Array.isArray(original)) throw new Error('Research provenance must be an object.');
}
export function parseResearchPdfManifest(value: unknown): ResearchPdfInput[] {
  const rows = (value as { entries?: unknown })?.entries;
  if (!Array.isArray(rows) || !rows.length || rows.length > 250) throw new Error('Choose a manifest with 1–250 PDFs.');
  const hashes = new Set<string>();
  return rows.map(row => {
    const input = Object.fromEntries(['researchSourceId', 'filename', 'sha256', 'byteSize', 'title', 'provenance'].map(key => [key, row?.[key]])) as ResearchPdfInput;
    if (['researchSourceId', 'filename', 'sha256', 'title', 'provenance'].some(key => typeof input[key as keyof ResearchPdfInput] !== 'string')) throw new Error('Manifest fields are missing.');
    validateResearchPdf(input);
    if (hashes.has(input.sha256)) throw new Error('Duplicate PDF checksum in manifest.');
    hashes.add(input.sha256);
    return input;
  });
}
