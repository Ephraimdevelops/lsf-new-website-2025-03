import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
const inventory = loadHandlerModule('convex/usageInventory.ts');
const sara = loadHandlerModule('convex/sara.ts');
const ops = loadHandlerModule('convex/ops.ts');

test('source comparison requires exact nonempty extracted text, not matching titles', async () => {
  const h = harness();
  const leftId = await h.db.insert('documents', { title: 'Same title', text: 'PRIVATE SOURCE', storageId: 'a' });
  const rightId = await h.db.insert('documents', { title: 'Same title', text: 'DIFFERENT SOURCE', storageId: 'b' });
  let result = await h.invoke(inventory.compareSources, { leftId, rightId });
  assert.equal(result.identicalExtractedText, false);
  await h.db.patch(rightId, { text: 'PRIVATE SOURCE' });
  result = await h.invoke(inventory.compareSources, { leftId, rightId });
  assert.equal(result.identicalExtractedText, true); assert.equal(result.sameStorageReference, false);
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE SOURCE/);
  for (const text of ['', '   ', undefined]) {
    await h.db.patch(leftId, { text }); await h.db.patch(rightId, { text });
    assert.equal((await h.invoke(inventory.compareSources, { leftId, rightId })).identicalExtractedText, false);
  }
  await assert.rejects(h.invoke(inventory.compareSources, { leftId, rightId: leftId }), /different/);
});

test('budget status reads the monthly ledger, includes reservations and respects configuration', async () => {
  const previous = process.env.SAADA_MONTHLY_BUDGET_USD;
  try {
    const h = harness(); const admin = await h.user('admin');
    const month = new Date().toISOString().slice(0, 7);
    const ledger = await h.db.insert('ai_usage_months', { month, committedMicroUsd: 3000000, reservedMicroUsd: 2000000, unpricedCalls: 0 });
    const query = h.db.query;
    h.db.query = table => { assert.notEqual(table, 'sara_chats'); return query(table); };
    process.env.SAADA_MONTHLY_BUDGET_USD = '10';
    let status = await h.invoke(ops.getBudgetStatus, {}, admin);
    assert.equal(status.usage, 5); assert.equal(status.limit, 10); assert.equal(status.isLocked, false);
    process.env.SAADA_MONTHLY_BUDGET_USD = '5';
    assert.equal((await h.invoke(ops.getBudgetStatus, {}, admin)).isLocked, true);
    process.env.SAADA_MONTHLY_BUDGET_USD = '10';
    await h.db.patch(ledger, { unpricedCalls: 1 });
    assert.equal((await h.invoke(ops.getBudgetStatus, {}, admin)).isLocked, true);
    delete process.env.SAADA_MONTHLY_BUDGET_USD;
    status = await h.invoke(ops.getBudgetStatus, {}, admin);
    assert.equal(status.limit, null); assert.equal(status.isLocked, false);
    await assert.rejects(h.invoke(ops.getBudgetStatus), /Unauthorized/);
    await assert.rejects(h.invoke(ops.getBudgetStatus, {}, await h.user('user')));
  } finally {
    if (previous === undefined) delete process.env.SAADA_MONTHLY_BUDGET_USD;
    else process.env.SAADA_MONTHLY_BUDGET_USD = previous;
  }
});

test('empty budget ledger does not fabricate historical spend', async () => {
  const previous = process.env.SAADA_MONTHLY_BUDGET_USD;
  try {
    process.env.SAADA_MONTHLY_BUDGET_USD = '20';
    const h = harness(); const admin = await h.user('admin');
    const result = await h.invoke(ops.getBudgetStatus, {}, admin);
    assert.equal(result.usage, 0); assert.equal(result.isLocked, false);
  } finally {
    if (previous === undefined) delete process.env.SAADA_MONTHLY_BUDGET_USD;
    else process.env.SAADA_MONTHLY_BUDGET_USD = previous;
  }
});

test('inventory is internal, paginated and does not expose text, vectors or storage URLs', async () => {
  assert.equal(inventory.sources.isInternal, true);
  const h = harness();
  for (let i = 0; i < 7; i++) await h.db.insert('documents', { title: `Source ${i}`, text: 'PRIVATE BODY', storageId: 'PRIVATE STORAGE', approvalStatus: 'pending' });
  const first = await h.invoke(inventory.sources);
  assert.equal(first.sources.length, 5); assert.equal(first.isDone, false);
  const second = await h.invoke(inventory.sources, { cursor: first.cursor });
  assert.equal(second.sources.length, 2); assert.equal(second.isDone, true);
  assert.doesNotMatch(JSON.stringify(first), /PRIVATE|embedding|storageId/);
});
test('retrieval excludes vectors and unapproved or expired legal sources', async () => {
  const h = harness(); const ids = [];
  for (const [status, due] of [['approved', Date.now() + 60000], ['pending', Date.now() + 60000], ['approved', 1]]) {
    const doc = await h.db.insert('documents', { title: 'Test source', approvalStatus: status, reviewDueAt: due });
    ids.push(await h.db.insert('embeddings', { documentId: doc, text: 'A legal passage', chunkIndex: 0, embedding: Array(1536).fill(0.2) }));
  }
  const result = await h.invoke(sara.getChunks, { ids });
  assert.equal(result.length, 1); assert.equal(result[0].text, 'A legal passage');
  assert.equal(result[0].sourceTitle, 'Test source'); assert.equal('embedding' in result[0], false);
});
test('analytics dates are index ranges, not post-read historical filters', () => {
  const source = readFileSync('convex/analytics.ts', 'utf8');
  assert.equal((source.match(/withIndex\("by_type_timestamp"/g) ?? []).length, 22);
  assert.doesNotMatch(source, /filter\(\(?q\)?\s*=>\s*q\.gte\(q\.field\("timestamp"\),\s*cutoff/);
  assert.match(readFileSync('convex/schema.ts', 'utf8'), /index\("by_type_timestamp", \["type", "timestamp"\]\)/);
});
test('web heartbeat interval skips hidden tabs but sends visibility changes', () => {
  const source = readFileSync('src/hooks/usePresenceHeartbeat.ts', 'utf8');
  assert.match(source, /if \(document.visibilityState === 'visible'\) send\(\)/);
  assert.match(source, /setInterval\(tick, 30_000\)/);
  assert.match(source, /addEventListener\('visibilitychange', send\)/);
});

test('mobile knowledge analytics only subscribes while the usage tab is open', () => {
  const source = readFileSync('mobile/app/saada-governance.tsx', 'utf8');
  assert.match(source, /useQuery\(api\.sara_chat\.getAnalytics, allowed && tab === "insights" \? \{\} : "skip"\)/);
});

test('mobile periodic heartbeat skips background apps and retains state transitions', () => {
  const source = readFileSync('mobile/src/usePresenceHeartbeat.ts', 'utf8');
  assert.match(source, /if \(AppState.currentState === 'active' && \(typeof document === 'undefined' \|\| document.visibilityState === 'visible'\)\) send\(\)/);
  assert.match(source, /setInterval\(tick, 30_000\)/);
  assert.match(source, /AppState.addEventListener\('change', send\)/);
  assert.match(source, /foreground: false/);
});
