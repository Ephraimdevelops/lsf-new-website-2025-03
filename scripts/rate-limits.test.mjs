import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
const bundle = await build({ entryPoints: ['convex/lib/rateLimits.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { enforceRateLimit } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
function fixture() {
  const rows = new Map();
  return { rows, ctx: { db: {
    query: () => { let key; const query = { withIndex(_index, cb) { cb({ eq(_field, value) { key = value; return this; } }); return query; }, first: async () => rows.get(key) }; return query; },
    insert: async (_table, value) => { rows.set(value.identifier, { _id: value.identifier, ...value }); },
    patch: async (id, value) => Object.assign(rows.get(id), value),
  } } };
}
test('account buckets are isolated, enforce exact budgets and reset expired windows', async () => {
  const { ctx, rows } = fixture();
  await enforceRateLimit(ctx, 'alice', 2, 60_000);
  await enforceRateLimit(ctx, 'alice', 2, 60_000);
  await assert.rejects(enforceRateLimit(ctx, 'alice', 2, 60_000), error => error.data.code === 'RATE_LIMITED' && error.data.retryAfterMs > 0);
  await enforceRateLimit(ctx, 'bob', 2, 60_000);
  assert.equal(rows.get('bob').count, 1);
  rows.get('alice').windowStart = Date.now() - 60_001;
  await enforceRateLimit(ctx, 'alice', 2, 60_000);
  assert.equal(rows.get('alice').count, 1);
});
test('byte budgets count actual cost and reject invalid or oversized costs without changing counters', async () => {
  const { ctx, rows } = fixture();
  await enforceRateLimit(ctx, 'bytes:alice', 10, 60_000, 6);
  for (const cost of [5, 0, -1, NaN, Infinity, 0.5]) await assert.rejects(enforceRateLimit(ctx, 'bytes:alice', 10, 60_000, cost));
  assert.equal(rows.get('bytes:alice').count, 6);
  await enforceRateLimit(ctx, 'bytes:alice', 10, 60_000, 4);
  assert.equal(rows.get('bytes:alice').count, 10);
});
