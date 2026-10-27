import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
const bundle = await build({ entryPoints: ['convex/sara.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const sara = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const source = { title: 'Synthetic source', storageId: 'test-upload', text: 'Test text', type: 'pdf', uploadedByClerkId: 'test-editor', publisher: 'Synthetic publisher', jurisdiction: 'tanzania_mainland', language: 'en', contentCategory: 'Test', versionLabel: 'Test edition', reviewDueAt: Date.now() + 86400000 };
function fixture() {
  const rows = new Map(); let count = 0;
  rows.set('test-editor', { _id: 'test-editor', table: 'users', clerkId: 'test-editor', role: 'staff' });
  rows.set('scan-receipt', { _id: 'scan-receipt', table: 'managed_uploads', storageId: 'test-upload', ownerId: 'test-editor', purpose: 'ai_source', status: 'clean' });
  const db = {
    get: async id => rows.get(id) ?? null,
    patch: async (id, changes) => Object.assign(rows.get(id), changes),
    delete: async id => rows.delete(id),
    insert: async (table, record) => { const id = 'record-' + ++count; rows.set(id, { _id: id, table, ...record }); return id; },
    query(table) {
      const filters = []; const q = { withIndex(_name, fn) { const chain = { eq(key, value) { filters.push([key,value]); return chain; } }; fn(chain); return q; }, collect: async () => [...rows.values()].filter(r => r.table === table && filters.every(([key,value]) => r[key] === value)), first: async () => [...rows.values()].find(r => r.table === table && filters.every(([key,value]) => r[key] === value)) ?? null, unique: async () => [...rows.values()].find(r => r.table === table && filters.every(([key,value]) => r[key] === value)) ?? null }; return q;
    },
  };
  return { ctx: { db }, rows };
}
test('same-upload replay retains one source and its indexing state', async () => {
  const { ctx, rows } = fixture();
  const initial = await sara.createDocument._handler(ctx, source);
  const replay = await sara.createDocument._handler(ctx, source);
  assert.equal(initial.created, true); assert.equal(replay.created, false);
  assert.equal(replay.documentId, initial.documentId); assert.equal([...rows.values()].filter(r => r.table === 'documents').length, 1);
  rows.get(initial.documentId).indexingStatus = 'ready';
  assert.equal((await sara.createDocument._handler(ctx, source)).indexingStatus, 'ready');
});
test('replay cannot change uploader or provenance', async () => {
  const { ctx } = fixture(); await sara.createDocument._handler(ctx, source);
  for (const change of [{ uploadedByClerkId: 'another-editor' }, { versionLabel: 'Different edition' }, { sourceUrl: 'https://example.com/changed' }]) {
    await assert.rejects(sara.createDocument._handler(ctx, { ...source, ...change }), /must match|Uploader access denied/);
  }
});
test('failed indexing remains the same record and withdrawn sources reject replay', async () => {
  const { ctx, rows } = fixture(); const first = await sara.createDocument._handler(ctx, source);
  rows.get(first.documentId).indexingStatus = 'failed';
  assert.equal((await sara.createDocument._handler(ctx, source)).indexingStatus, 'failed');
  rows.get(first.documentId).approvalStatus = 'withdrawn';
  await assert.rejects(sara.createDocument._handler(ctx, source), /withdrawn or rejected/);
  assert.equal([...rows.values()].filter(r => r.table === 'documents').length, 1);
});

test('active indexing cannot be taken over; stalled indexing clears partial chunks and fences the old worker', async () => {
  const { ctx, rows } = fixture(); const claim = await sara.createDocument._handler(ctx, source);
  const id = claim.documentId;
  await assert.rejects(sara.beginDocumentReindex._handler(ctx, { id }), /eligible/);
  await sara.addEmbeddings._handler(ctx, { documentId: id, generation: 1, chunks: [{ text: 'Partial', embedding: [0.1], index: 0 }] });
  rows.get(id).indexingUpdatedAt = Date.now() - 31 * 60000;
  const generation = await sara.beginDocumentReindex._handler(ctx, { id });
  assert.equal(generation, 2);
  assert.equal([...rows.values()].filter(r => r.table === 'embeddings').length, 0);
  await assert.rejects(sara.addEmbeddings._handler(ctx, { documentId: id, generation: 1, chunks: [] }), /no longer/);
  await sara.markDocumentIndexFailed._handler(ctx, { id, generation: 1, error: 'Late failure' });
  assert.equal(rows.get(id).indexingStatus, 'processing');
  await assert.rejects(sara.markDocumentProcessed._handler(ctx, { id, generation: 1 }), /no longer/);
  await sara.addEmbeddings._handler(ctx, { documentId: id, generation, chunks: [{ text: 'Fresh', embedding: [0.2], index: 0 }] });
  await sara.markDocumentProcessed._handler(ctx, { id, generation });
  assert.equal(rows.get(id).indexingStatus, 'ready');
  assert.equal(rows.get(id).approvalStatus, 'pending');
});
test('legacy processing records can recover without weakening the approval gate', async () => {
  const { ctx, rows } = fixture(); const claim = await sara.createDocument._handler(ctx, source);
  const doc = rows.get(claim.documentId);
  delete doc.indexingGeneration; delete doc.indexingUpdatedAt; doc.uploadedAt = Date.now() - 31 * 60000;
  assert.equal(await sara.beginDocumentReindex._handler(ctx, { id: doc._id }), 1);
  doc.approvalStatus = 'approved'; doc.indexingStatus = 'failed';
  await assert.rejects(sara.beginDocumentReindex._handler(ctx, { id: doc._id }), /eligible/);
});

test('ingestion cannot commit stale metadata after a receipt correction', async () => {
  const { ctx, rows } = fixture();
  const { storageId, text, type, uploadedByClerkId, ...metadata } = source;
  rows.set('receipt', { _id: 'receipt', table: 'saada_upload_receipts', storageId, uploadedByClerkId, metadata: { ...metadata, reviewDueAt: source.reviewDueAt + 86400000 } });
  await assert.rejects(sara.createDocument._handler(ctx, source), /metadata changed/);
  assert.equal([...rows.values()].filter(row => row.table === 'documents').length, 0);
  await sara.createDocument._handler(ctx, { ...source, reviewDueAt: source.reviewDueAt + 86400000 });
});
