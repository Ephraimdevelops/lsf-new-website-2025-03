import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
const bundle = await build({ entryPoints: ['convex/saadaUploadReceipts.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const receipts = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const metadata = { title: 'Synthetic source', publisher: 'Test authority', jurisdiction: 'tanzania_mainland', language: 'en', contentCategory: 'Test', versionLabel: 'Test edition', reviewDueAt: Date.now() + 86400000 };
function fixture() {
  const rows = new Map([['alice', { _id: 'alice', table: 'users', clerkId: 'alice', role: 'staff' }], ['bob', { _id: 'bob', table: 'users', clerkId: 'bob', role: 'staff' }], ['guest', { _id: 'guest', table: 'users', clerkId: 'guest', role: 'user' }]]); let n = 0;
  for (const storageId of ['blob', ...Array.from({ length: 55 }, (_, i) => 'blob-' + i)]) rows.set('scan-' + storageId, { _id: 'scan-' + storageId, table: 'managed_uploads', storageId, ownerId: 'alice', purpose: 'ai_source', status: 'clean' });
  const db = {
    get: async id => rows.get(id) ?? null,
    patch: async (id, changes) => Object.assign(rows.get(id), changes),
    insert: async (table, value) => { const id = 'insert-' + ++n; rows.set(id, { _id: id, table, ...value }); return id; },
    query(table) {
      const filters = []; const list = () => [...rows.values()].filter(row => row.table === table && filters.every(([key,value]) => row[key] === value));
      const q = { withIndex(_name, cb) { const chain = { eq(key,value) { filters.push([key,value]); return chain; } }; cb(chain); return q; }, order() { return q; }, paginate: async ({ cursor, numItems }) => { const start = Number(cursor ?? 0); const records = list(); return { page: records.slice(start, start + numItems), continueCursor: String(start + numItems), isDone: start + numItems >= records.length }; }, collect: async () => list(), take: async n => list().slice(0,n), first: async () => list()[0] ?? null, unique: async () => list()[0] ?? null }; return q;
    },
  };
  return { rows, actor: name => ({ db, auth: { getUserIdentity: async () => name ? { subject: name } : null }, storage: { getUrl: async () => 'https://example.com/test.pdf' } }) };
}
test('receipt survives a new session, is replay-safe and remains uploader scoped', async () => {
  const { actor, rows } = fixture(); const args = { storageId: 'blob', metadata };
  const first = await receipts.record._handler(actor('alice'), args);
  assert.equal(await receipts.record._handler(actor('alice'), args), first);
  assert.equal((await receipts.mine._handler(actor('alice'), {})).length, 1);
  assert.deepEqual(await receipts.mine._handler(actor('bob'), {}), []);
  await assert.rejects(receipts.record._handler(actor('bob'), args), /ownership/);
  await assert.rejects(receipts.record._handler(actor('alice'), { ...args, metadata: { ...metadata, versionLabel: 'Changed' } }), /metadata/);
  rows.set('doc', { _id: 'doc', table: 'documents', storageId: 'blob' });
  assert.deepEqual(await receipts.mine._handler(actor('alice'), {}), []);
});
test('ordinary users and signed-out callers cannot recover staff uploads', async () => {
  const { actor } = fixture();
  for (const name of ['guest', null]) {
    await assert.rejects(receipts.mine._handler(actor(name), {}));
    await assert.rejects(receipts.record._handler(actor(name), { storageId: 'blob', metadata }));
  }
});

test('older receipt pages remain reachable even when a page contains only ingested sources', async () => {
  const { actor, rows } = fixture();
  for (let i = 0; i < 55; i++) {
    await receipts.record._handler(actor('alice'), { storageId: 'blob-' + i, metadata });
    if (i < 40) rows.set('doc-' + i, { _id: 'doc-' + i, table: 'documents', storageId: 'blob-' + i });
  }
  const first = await receipts.minePage._handler(actor('alice'), { paginationOpts: { cursor: null, numItems: 40 } });
  assert.equal(first.page.length, 0); assert.equal(first.isDone, false);
  const next = await receipts.minePage._handler(actor('alice'), { paginationOpts: { cursor: first.continueCursor, numItems: 40 } });
  assert.equal(next.page.length, 15); assert.equal(next.isDone, true);
  assert.equal((await receipts.minePage._handler(actor('bob'), { paginationOpts: { cursor: null, numItems: 40 } })).page.length, 0);
});
test('review-date correction is owner scoped, audited and blocked after ingestion', async () => {
  const { actor, rows } = fixture();
  const id = await receipts.record._handler(actor('alice'), { storageId: 'blob', metadata });
  rows.get(id).metadata.reviewDueAt = Date.now() - 1000;
  const args = { id, reviewDueAt: Date.now() + 86400000, reason: 'Reviewed next review schedule' };
  await assert.rejects(receipts.correctReviewDate._handler(actor('bob'), args), /access denied/);
  await assert.rejects(receipts.correctReviewDate._handler(actor('alice'), { ...args, reviewDueAt: Date.now() - 1000 }), /future/);
  await assert.rejects(receipts.correctReviewDate._handler(actor('alice'), { ...args, reason: 'short' }), /10 characters/);
  await receipts.correctReviewDate._handler(actor('alice'), args);
  assert.equal(rows.get(id).metadata.reviewDueAt, args.reviewDueAt);
  assert.equal([...rows.values()].filter(row => row.table === 'audit_logs').length, 1);
  await receipts.correctReviewDate._handler(actor('alice'), args);
  assert.equal([...rows.values()].filter(row => row.table === 'audit_logs').length, 1);
  rows.set('doc', { _id: 'doc', table: 'documents', storageId: 'blob' });
  await assert.rejects(receipts.correctReviewDate._handler(actor('alice'), { ...args, reviewDueAt: args.reviewDueAt + 1000 }), /source record already exists/);
});
