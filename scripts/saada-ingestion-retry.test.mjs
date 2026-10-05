import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
const bundle = await build({ entryPoints: ['convex/sara.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const sara = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const source = { title: 'Synthetic source', storageId: 'test-upload', text: 'Test text', type: 'pdf', uploadedByClerkId: 'test-editor', publisher: 'Synthetic publisher', jurisdiction: 'tanzania_mainland', language: 'en', contentCategory: 'Test', versionLabel: 'Test edition', reviewDueAt: Date.now() + 86400000 };
function fixture() {
  const rows = new Map(); let count = 0;
  const db = {
    get: async id => rows.get(id) ?? null,
    insert: async (table, record) => { const id = 'record-' + ++count; rows.set(id, { _id: id, table, ...record }); return id; },
    query(table) {
      const filters = []; const q = { withIndex(_name, fn) { const chain = { eq(key, value) { filters.push([key,value]); return chain; } }; fn(chain); return q; }, first: async () => [...rows.values()].find(r => r.table === table && filters.every(([key,value]) => r[key] === value)) ?? null }; return q;
    },
  };
  return { ctx: { db }, rows };
}
test('same-upload replay retains one source and its indexing state', async () => {
  const { ctx, rows } = fixture();
  const initial = await sara.createDocument._handler(ctx, source);
  const replay = await sara.createDocument._handler(ctx, source);
  assert.equal(initial.created, true); assert.equal(replay.created, false);
  assert.equal(replay.documentId, initial.documentId); assert.equal(rows.size, 1);
  rows.get(initial.documentId).indexingStatus = 'ready';
  assert.equal((await sara.createDocument._handler(ctx, source)).indexingStatus, 'ready');
});
test('replay cannot change uploader or provenance', async () => {
  const { ctx } = fixture(); await sara.createDocument._handler(ctx, source);
  for (const change of [{ uploadedByClerkId: 'another-editor' }, { versionLabel: 'Different edition' }, { sourceUrl: 'https://example.com/changed' }]) {
    await assert.rejects(sara.createDocument._handler(ctx, { ...source, ...change }), /must match/);
  }
});
test('failed indexing remains the same record and withdrawn sources reject replay', async () => {
  const { ctx, rows } = fixture(); const first = await sara.createDocument._handler(ctx, source);
  rows.get(first.documentId).indexingStatus = 'failed';
  assert.equal((await sara.createDocument._handler(ctx, source)).indexingStatus, 'failed');
  rows.get(first.documentId).approvalStatus = 'withdrawn';
  await assert.rejects(sara.createDocument._handler(ctx, source), /withdrawn or rejected/);
  assert.equal(rows.size, 1);
});
