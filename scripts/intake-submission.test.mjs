import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
const bundle = await build({ entryPoints: ['convex/legalHelp.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const intake = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
function fixture(actor = 'alice') {
  const rows = new Map(); let n = 0;
  const put = (table, id, value) => rows.set(id, { _id: id, table, ...value });
  put('users', 'alice-user', { clerkId: 'alice', role: 'user' });
  put('users', 'bob-user', { clerkId: 'bob', role: 'user' });
  put('legal_help_requests', 'request', { ownerId: 'alice-user', clientRequestId: 'retry', status: 'draft', version: 1, publicId: 'HYR-TEST', locale: 'sw', description: 'Synthetic employment story', region: 'Test region', district: 'Test district', desiredHelp: 'Test guidance', safeContactMethod: 'in_app', preferredLanguage: 'sw', urgency: 'standard' });
  const db = {
    get: async id => rows.get(id) ?? null,
    insert: async (table, value) => { const id = 'insert-' + ++n; put(table, id, value); return id; },
    patch: async (id, value) => Object.assign(rows.get(id), value),
    query(table) {
      const filters = []; const q = {
        withIndex(_index, cb) { const chain = { eq(key, value) { filters.push([key,value]); return chain; } }; cb(chain); return q; },
        collect: async () => [...rows.values()].filter(r => r.table === table && filters.every(([key,value]) => r[key] === value)),
        unique: async () => (await q.collect())[0] ?? null,
      }; return q;
    },
  };
  return { rows, ctx: { db, auth: { getUserIdentity: async () => actor ? { subject: actor } : null }, scheduler: { runAfter: async () => undefined } } };
}
const attachment = { requestId: 'request', storageId: 'blob-one', name: 'synthetic.pdf', type: 'application/pdf', size: 100 };
test('attachment retry returns the same attachment and current version without duplicate evidence', async () => {
  const { ctx, rows } = fixture();
  const first = await intake.attachToDraft._handler(ctx, attachment);
  rows.get('request').version = 7;
  const retry = await intake.attachToDraft._handler(ctx, attachment);
  assert.equal(retry.attachmentId, first.attachmentId); assert.equal(retry.version, 7);
  assert.equal([...rows.values()].filter(r => r.table === 'request_attachments').length, 1);
  assert.equal(rows.get('request').version, 7);
  await assert.rejects(intake.attachToDraft._handler(ctx, { ...attachment, name: 'different.pdf' }), /retry must match/);
});
test('committed attachment can be acknowledged after submission but new attachments remain blocked', async () => {
  const { ctx, rows } = fixture();
  await intake.attachToDraft._handler(ctx, attachment); rows.get('request').status = 'submitted';
  await intake.attachToDraft._handler(ctx, attachment);
  await assert.rejects(intake.attachToDraft._handler(ctx, { ...attachment, storageId: 'different-blob' }), /cannot be changed/);
  const other = fixture('bob'); await assert.rejects(intake.attachToDraft._handler(other.ctx, attachment), /access denied/);
});
test('retrying submission creates one consent and one notification only', async () => {
  const { ctx, rows } = fixture();
  const args = { requestId: 'request', expectedVersion: 1, consentVersion: 'service-v1' };
  const first = await intake.submit._handler(ctx, args); const second = await intake.submit._handler(ctx, args);
  assert.equal(first.publicId, second.publicId);
  for (const table of ['consents','notifications']) assert.equal([...rows.values()].filter(r => r.table === table).length, 1);
});
test('submitted recovery survives retired service; new drafts still require an eligible service', async () => {
  const { ctx, rows } = fixture(); rows.get('request').status = 'submitted';
  const args = { clientRequestId: 'retry', locale: 'sw', sourceServiceId: 'retired-service' };
  const recovered = await intake.saveDraft._handler(ctx, args); assert.equal(recovered.requestId, 'request');
  await assert.rejects(intake.saveDraft._handler(ctx, { ...args, clientRequestId: 'new' }), /no longer available/);
  await assert.rejects(intake.saveDraft._handler(fixture('bob').ctx, args), /no longer available/);
});

test('withdrawn submission rejects replay rather than reporting success', async () => {
  const { ctx, rows } = fixture(); rows.get('request').status = 'withdrawn';
  await assert.rejects(intake.submit._handler(ctx, { requestId: 'request', expectedVersion: 1, consentVersion: 'service-v1' }), /withdrawn request/);
  assert.equal([...rows.values()].filter(r => r.table === 'consents').length, 0);
});
