import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { parseGuideImport, requireEditableGuide, validateGuideContent } from '../mobile/src/content/legalGuideContent.ts';

const now = Date.UTC(2026, 9, 7);
const guide = {
  titleSw: 'Swali la haki', titleEn: 'A legal question', summarySw: 'Maelezo ya kuanza.', summaryEn: 'Practical first steps.',
  stepsSw: ['Hifadhi nyaraka zako.'], stepsEn: ['Keep relevant records.'], category: 'Everyday help', jurisdiction: 'tanzania_mainland',
  sourceTitle: 'Official source', sourceUrl: 'https://example.go.tz/law', publisher: 'Source publisher', reviewDueAt: now + 30 * 86400000,
};
test('image requires HTTPS and descriptions in both languages', () => {
  assert.throws(() => validateGuideContent({ ...guide, coverImageUrl: 'javascript:alert(1)' }, now), /HTTPS/);
  assert.throws(() => validateGuideContent({ ...guide, coverImageUrl: 'https://user:password@example.com/image.jpg' }, now), /credentials/);
  assert.throws(() => validateGuideContent({ ...guide, coverImageUrl: 'https://example.com/image.jpg', coverImageAltEn: 'An office' }, now), /both languages/);
  assert.equal(validateGuideContent({ ...guide, coverImageUrl: 'https://example.com/image.jpg', coverImageAltEn: 'An office', coverImageAltSw: 'Ofisi ya msaada' }, now).coverImageAltSw, 'Ofisi ya msaada');
});
test('removing an image removes stale descriptions', () => {
  assert.equal(validateGuideContent({ ...guide, coverImageAltEn: 'Old description' }, now).coverImageAltEn, undefined);
});
test('pending edits cannot change another author or approved content', () => {
  assert.doesNotThrow(() => requireEditableGuide({ status: 'pending', submittedBy: 'author' }, 'author'));
  assert.throws(() => requireEditableGuide({ status: 'pending', submittedBy: 'author' }, 'reviewer'));
  assert.throws(() => requireEditableGuide({ status: 'approved', submittedBy: 'author' }, 'author'));
});
test('pack import strips forged approval/identity fields and sets chosen review date', () => {
  const result = parseGuideImport({ guides: [{ appFieldsDraft: { ...guide, status: 'approved', submittedBy: 'someone' } }] }, guide.reviewDueAt, now);
  assert.equal(result[0].status, undefined);
  assert.equal(result[0].submittedBy, undefined);
  assert.equal(result[0].reviewDueAt, guide.reviewDueAt);
});
test('pack rejects duplicates, missing language, expired dates and oversized batches', () => {
  assert.throws(() => parseGuideImport([guide, guide], guide.reviewDueAt, now), /duplicates/);
  assert.throws(() => parseGuideImport([{ ...guide, summarySw: '' }], guide.reviewDueAt, now), /both languages/);
  assert.throws(() => parseGuideImport([guide], now, now), /review date/);
  assert.throws(() => parseGuideImport(Array(251).fill(guide), guide.reviewDueAt, now), /1–250/);
});
test('all 72 research drafts pass field validation without becoming approved', () => {
  const pack = JSON.parse(readFileSync(new URL('../docs/haki-yangu/know-your-rights-preparation-2026-10-07/guide-drafts.json', import.meta.url), 'utf8'));
  const result = parseGuideImport(pack, guide.reviewDueAt, now);
  assert.equal(result.length, 72);
  assert.equal(result.filter(g => g.jurisdiction === 'zanzibar').length, 8);
  assert.ok(result.every(g => !('status' in g)));
});

test('expanded pack contains 108 unique bilingual drafts with twelve per category', () => {
  const pack = JSON.parse(readFileSync(new URL('../docs/haki-yangu/know-your-rights-expanded-2026-10-07/guide-drafts.json', import.meta.url), 'utf8'));
  const result = parseGuideImport(pack, guide.reviewDueAt, now);
  assert.equal(result.length, 108);
  assert.ok(pack.categories.every(category => category.count === 12));
  assert.ok(pack.guides.every(g => g.productionEligible === false && g.backendGuideId === null));
});
