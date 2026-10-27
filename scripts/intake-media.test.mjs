import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';

async function load(file) {
  const bundle = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'esm' });
  return import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
}
const { reserveTranscription } = await load('convex/legalHelp.ts');
const { decodeDraft } = await load('mobile/src/intake/draftStorage.ts');
function fixture({ actor = 'alice', status = 'draft', type = 'audio/mp4', size = 100, recent = [] } = {}) {
  const rows = new Map([
    ['user', { _id: 'user', clerkId: 'alice', role: 'user' }],
    ['request', { _id: 'request', ownerId: 'user', status }],
    ['attachment', { _id: 'attachment', ownerId: 'user', requestId: 'request', storageId: 'blob', name: 'voice.m4a' }],
  ]);
  const audits = [];
  const ctx = {
    auth: { getUserIdentity: async () => actor ? { subject: actor } : null },
    db: {
      get: async id => rows.get(id),
      system: { get: async () => ({ size, contentType: type }) },
      insert: async (table, data) => { if (table === 'audit_logs') audits.push(data); return 'inserted'; },
      query(table) {
        let identity;
        const q = { withIndex(_index, callback) { callback({ eq(_field, value) { identity = value; return this; } }); return q; },
          unique: async () => table === 'managed_uploads' ? { ownerId: 'user', purpose: 'request_attachment', status: 'clean' } : identity === 'alice' ? rows.get('user') : null,
          first: async () => null,
          filter: () => q, take: async () => table === 'audit_logs' ? recent : [],
        }; return q;
      },
    },
    storage: { getUrl: async () => 'https://example.test/recording' },
  };
  return { ctx, rows, audits };
}
const args = { requestId: 'request', attachmentId: 'attachment' };
test('transcription reservation admits only an authenticated owner of a draft recording', async () => {
  for (const actor of [null, 'bob']) await assert.rejects(reserveTranscription._handler(fixture({ actor }).ctx, args));
  await assert.rejects(reserveTranscription._handler(fixture({ status: 'submitted' }).ctx, args), /access denied/);
  const f = fixture(); f.rows.get('attachment').ownerId = 'someone-else';
  await assert.rejects(reserveTranscription._handler(f.ctx, args), /access denied/);
});
test('transcription checks actual stored media and caps requests without logging the story', async () => {
  for (const change of [{ type: 'application/pdf' }, { size: 11 * 1024 * 1024 }]) await assert.rejects(reserveTranscription._handler(fixture(change).ctx, args), /Unsupported/);
  const recent = Array.from({ length: 5 }, () => ({ action: 'help_request.transcription', timestamp: Date.now() }));
  await assert.rejects(reserveTranscription._handler(fixture({ recent }).ctx, args), /wait/);
  const f = fixture(); const result = await reserveTranscription._handler(f.ctx, args);
  assert.equal(result.type, 'audio/mp4'); assert.equal(f.audits.length, 1);
  assert.equal(f.audits[0].entityId, 'attachment'); assert.equal(f.audits[0].metadata, undefined);
});
const draft = { clientRequestId: 'synthetic', locale: 'sw', description: 'Synthetic test only', region: '', district: '', occurredOn: '', involvedParties: '', desiredHelp: '', safeContactMethod: 'in_app', preferredLanguage: 'sw', preferredLanguageOther: '', urgency: 'standard', hasDocuments: true };
test('selected evidence and upload receipts survive draft decoding and invalid files are rejected', () => {
  const file = { uri: 'file:///cache/synthetic.pdf', name: 'synthetic.pdf', mimeType: 'application/pdf', size: 10, storageId: 'blob', requestId: 'request', attachmentId: 'attachment' };
  assert.deepEqual(decodeDraft(JSON.stringify({ ...draft, issueDetail: 'maintenance', evidence: [file] })).evidence, [file]);
  for (const change of [{ size: 0 }, { size: 11 * 1024 * 1024 }, { size: '10' }, { uri: 'https://example.test/private' }, { storageId: {} }]) assert.throws(() => decodeDraft(JSON.stringify({ ...draft, evidence: [{ ...file, ...change }] })));
});
