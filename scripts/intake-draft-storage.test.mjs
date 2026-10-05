import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
const bundle = await build({ entryPoints: ['mobile/src/intake/draftStorage.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { draftStorageKey, decodeDraft, transferGuestDraft } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const draft = { clientRequestId: 'mobile-synthetic', locale: 'sw', description: 'Synthetic test story', region: '', district: '', occurredOn: '', involvedParties: '', desiredHelp: '', safeContactMethod: 'in_app', preferredLanguage: 'sw', preferredLanguageOther: '', urgency: 'standard', hasDocuments: false };
function fixture() {
  const rows = new Map([[draftStorageKey(null), JSON.stringify(draft)]]);
  const store = { read: async key => rows.get(key) ?? null, write: async (key, value) => { rows.set(key, value); }, remove: async key => { rows.delete(key); } };
  return { rows, store };
}
test('guest and account namespaces cannot collide, including arbitrary identity punctuation', () => {
  const keys = [null, 'guest', 'a/b', 'a_b', 'a.b', 'ab', '😀'].map(draftStorageKey);
  assert.equal(new Set(keys).size, keys.length);
  keys.forEach(key => assert.match(key, /^[A-Za-z0-9._-]+$/));
});
test('restore rejects malformed fields and excludes unexpected persisted attributes', () => {
  assert.throws(() => decodeDraft('{broken'));
  for (const changes of [{ description: null }, { description: 'x'.repeat(5001) }, { urgency: 'invented' }, { hasDocuments: 'false' }, { locale: 'unknown' }]) assert.throws(() => decodeDraft(JSON.stringify({ ...draft, ...changes })));
  assert.deepEqual(decodeDraft(JSON.stringify({ ...draft, ownerId: 'other-account', consentAccepted: true })), { ...draft, issueCategory: undefined, sourceServiceId: undefined });
});
test('explicit guest transfer creates a fresh identity for only the selected account and removes guest text', async () => {
  const { rows, store } = fixture();
  const result = await transferGuestDraft('alice', 'mobile-new-id', store);
  assert.equal(result.clientRequestId, 'mobile-new-id');
  assert.equal(result.description, draft.description);
  assert.equal(rows.has(draftStorageKey(null)), false);
  assert.equal(rows.has(draftStorageKey('bob')), false);
  assert.equal(decodeDraft(rows.get(draftStorageKey('alice'))).clientRequestId, 'mobile-new-id');
});
test('failed account save keeps anonymous draft and does not delete anything', async () => {
  const { rows, store } = fixture();
  store.write = async () => { throw new Error('storage full'); };
  await assert.rejects(transferGuestDraft('alice', 'new', store), /storage full/);
  assert.equal(rows.has(draftStorageKey(null)), true);
  assert.equal(rows.has(draftStorageKey('alice')), false);
});
test('failed anonymous cleanup rejects transfer while retaining recoverable copies', async () => {
  const { rows, store } = fixture();
  store.remove = async () => { throw new Error('cleanup failed'); };
  await assert.rejects(transferGuestDraft('alice', 'new', store), /cleanup failed/);
  assert.equal(rows.has(draftStorageKey(null)), true);
  assert.equal(rows.has(draftStorageKey('alice')), true);
});
