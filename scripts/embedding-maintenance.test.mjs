import test from 'node:test';
import assert from 'node:assert/strict';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
const maintenance = loadHandlerModule('convex/embeddingMaintenance.ts');
async function fixture() {
  const h = harness();
  const keepId = await h.db.insert('documents', { title: 'Annual report', text: 'Same original text', storageId: 'original-a', processedAt: 1 });
  const duplicateId = await h.db.insert('documents', { title: 'Annual report', text: 'Same original text', storageId: 'original-b', processedAt: 2, metadata: { provenance: 'Retain me' } });
  const original = await h.db.insert('embeddings', { documentId: keepId, chunkIndex: 0, text: 'Same passage', embedding: [0.1, 0.2] });
  const redundant = await h.db.insert('embeddings', { documentId: duplicateId, chunkIndex: 0, text: 'Same passage', embedding: [0.1, 0.2] });
  return { h, keepId, duplicateId, original, redundant, args: { keepId, duplicateId } };
}
test('dry run makes no changes; removal preserves originals, source provenance and an audit record', async () => {
  const f = await fixture(); const before = JSON.stringify([...f.h.records]);
  assert.equal((await f.h.invoke(maintenance.duplicatePlan, f.args)).exactDuplicateChunks, 1);
  assert.equal(JSON.stringify([...f.h.records]), before);
  await f.h.invoke(maintenance.removeExactLegacyDuplicate, { ...f.args, confirmation: 'REMOVE_EXACT_DUPLICATE_EMBEDDINGS' });
  assert.ok(await f.h.db.get(f.original)); assert.equal(await f.h.db.get(f.redundant), null);
  const duplicate = await f.h.db.get(f.duplicateId);
  assert.equal(duplicate.storageId, 'original-b'); assert.equal(duplicate.text, 'Same original text');
  assert.equal(duplicate.metadata.provenance, 'Retain me'); assert.equal(duplicate.processedAt, undefined);
  assert.equal((await f.h.db.query('audit_logs').collect()).length, 1);
  await assert.rejects(f.h.invoke(maintenance.removeExactLegacyDuplicate, f.args), /coverage/);
});
test('reviewed sources and active ingestion are excluded', async () => {
  for (const fields of [{ approvalStatus: 'pending' }, { approvalStatus: 'approved' }, { approvalStatus: 'withdrawn' }, { indexingStatus: 'processing' }]) {
    const f = await fixture(); await f.h.db.patch(f.duplicateId, fields);
    await assert.rejects(f.h.invoke(maintenance.duplicatePlan, f.args), /legacy/);
    assert.ok(await f.h.db.get(f.redundant));
  }
});
test('equal titles, equal vector dimensions or missing chunks do not prove duplication', async () => {
  for (const fields of [{ text: 'Different passage' }, { embedding: [0.1, 0.3] }, { embedding: [] }, { chunkIndex: 2 }]) {
    const f = await fixture(); await f.h.db.patch(f.redundant, fields);
    await assert.rejects(f.h.invoke(maintenance.removeExactLegacyDuplicate, f.args), /duplicates/);
    assert.ok(await f.h.db.get(f.redundant));
  }
  const f = await fixture(); await f.h.db.patch(f.duplicateId, { text: 'Different source text' });
  await assert.rejects(f.h.invoke(maintenance.duplicatePlan, f.args), /match exactly/);
});
