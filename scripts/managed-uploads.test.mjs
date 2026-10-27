import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
async function load(file) {
  const bundle = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'esm' });
  return import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
}
const policy = await load('convex/lib/uploadPolicy.ts');
const ownership = await load('convex/lib/managedUploads.ts');
const managed = await load('convex/managedUploads.ts');
const syntheticTicket = 'a'.repeat(64);
test('cleanup acknowledges already-removed quarantine and retries outages without touching clean files', async () => {
  const acknowledgements = [];
  const ctx = { runQuery: async () => 'rejected-blob', runMutation: async (_fn, args) => acknowledgements.push(args), storage: { delete: async () => { throw new Error('storage id rejected-blob not found'); } } };
  await managed.cleanupQuarantine._handler(ctx, { id: 'rejected-ticket' });
  assert.equal(acknowledgements.length, 1);
  ctx.storage.delete = async () => { throw new Error('Synthetic storage outage'); };
  await assert.rejects(managed.cleanupQuarantine._handler(ctx, { id: 'rejected-ticket' }), /outage/);
  assert.equal(acknowledgements.length, 1);
  const row = { _id: 'clean-ticket', status: 'clean', quarantineStorageId: 'clean-file' };
  let patches = 0;
  await managed.acknowledgeQuarantineCleanup._handler({ db: { get: async () => row, patch: async () => patches++ } }, { id: 'clean-ticket', storageId: 'clean-file' });
  assert.equal(patches, 0);
  row.status = 'failed';
  await managed.acknowledgeQuarantineCleanup._handler({ db: { get: async () => row, patch: async (_id, fields) => { patches++; assert.equal(fields.cleanupPending, false); assert.equal(fields.quarantineStorageId, undefined); } } }, { id: 'clean-ticket', storageId: 'clean-file' });
  assert.equal(patches, 1);
});

test('bounded quarantine retries schedule only failed or rejected temporary files', async () => {
  const scheduled = [];
  const rows = [{ _id: 'failed', status: 'failed', quarantineStorageId: 'temporary' }, { _id: 'clean', status: 'clean', quarantineStorageId: 'accepted' }];
  const ctx = { db: { query: () => ({ withIndex() { return this; }, take: async limit => { assert.equal(limit, 100); return rows; } }) }, scheduler: { runAfter: async (_delay, _fn, args) => scheduled.push(args.id) } };
  await managed.retryQuarantineCleanup._handler(ctx, {});
  assert.deepEqual(scheduled, ['failed']);
});
test('quarantine capabilities are one-use, short-lived and never authorize clean or other-owner data', async () => {
  const row = { _id: 'ticket', ownerId: 'alice', purpose: 'application', status: 'scanning', scanReservedAt: Date.now(), size: 12, type: 'application/pdf' };
  const ctx = { db: {
    get: async id => id === 'ticket' ? row : { _id: 'alice', role: 'user' },
    system: { get: async () => ({ size: 12, contentType: 'application/pdf' }) },
    patch: async (_id, fields) => Object.assign(row, fields),
    query: () => ({ withIndex() { return this; }, unique: async () => row }),
  }, storage: { generateUploadUrl: async () => 'private-native-entropy' }, scheduler: { runAfter: async () => {} } };
  const capability = await managed.stageForScan._handler(ctx, { id: 'ticket', storageId: 'quarantine', sha256: 'b'.repeat(64) });
  assert.match(capability, /^[a-f0-9]{64}$/);
  assert.notEqual(capability, row.scanTokenHash);
  assert.ok(row.scanTokenExpiresAt <= Date.now() + 120_000);
  assert.deepEqual(await managed.claimScanSource._handler(ctx, { tokenHash: row.scanTokenHash }), { storageId: 'quarantine', size: 12 });
  await assert.rejects(managed.claimScanSource._handler(ctx, { tokenHash: row.scanTokenHash }), /denied/);
  const clean = { id: 'ticket', status: 'clean', storageId: 'other', sha256: row.sha256, size: 12, type: row.type, scannerVersion: 'Synthetic', definitionsUpdatedAt: Date.now() };
  await assert.rejects(managed.finish._handler(ctx, clean), /mismatch/);
  await managed.finish._handler(ctx, { ...clean, storageId: 'quarantine' });
  assert.equal(row.quarantineStorageId, undefined);
  assert.equal(row.scanTokenHash, undefined);
  assert.equal(await managed.rejectedQuarantine._handler(ctx, { id: 'ticket' }), null);
  await assert.rejects(managed.claimScanSource._handler(ctx, { tokenHash: capability }), /denied/);
});

test('quarantine cleanup cannot delete clean files and source delivery never exposes a storage URL', async () => {
  const deleted = [];
  await managed.cleanupQuarantine._handler({ runQuery: async () => null, storage: { delete: async id => deleted.push(id) } }, { id: 'clean-ticket' });
  assert.deepEqual(deleted, []);
  await managed.cleanupQuarantine._handler({ runQuery: async () => 'rejected-blob', runMutation: async () => {}, storage: { get: async () => new Blob(['synthetic']), delete: async id => deleted.push(id) } }, { id: 'rejected-ticket' });
  assert.deepEqual(deleted, ['rejected-blob']);
  const blob = new Blob(['synthetic']);
  const ctx = { runMutation: async () => ({ storageId: 'quarantine', size: blob.size }), storage: { get: async () => blob } };
  const response = await managed.scanSource._handler(ctx, new Request('https://development.convex.site/secure-scan-source', { method: 'POST', headers: { Authorization: `Bearer ${syntheticTicket}` } }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  assert.equal(await response.text(), 'synthetic');
  const rejected = await managed.scanSource._handler(ctx, new Request('https://development.convex.site/secure-scan-source', { method: 'POST' }));
  assert.equal(rejected.status, 404);
});
test('issued gateway tickets are opaque and do not disclose a raw native upload capability', async () => {
  process.env.CONVEX_SITE_URL = 'https://development.example.test';
  process.env.PRIVATE_SCANNER_URL = 'https://scanner.example.test/scan';
  process.env.PRIVATE_SCANNER_TOKEN = 'synthetic-credential-at-least-32-characters';
  const native = 'https://storage.example.test/upload?token=private-synthetic-nonce';
  let issued;
  const ctx = { db: {
    query: () => ({ withIndex() { return this; }, first: async () => null }),
    insert: async (table, value) => { if (table === 'managed_uploads') issued = value; },
  }, storage: { generateUploadUrl: async () => native } };
  const result = new URL(await ownership.issueManagedUpload(ctx, 'alice', 'application'));
  assert.match(result.searchParams.get('ticket'), /^[a-f0-9]{64}$/);
  assert.equal(result.searchParams.get('ticket').includes(native), false);
  assert.equal(issued.tokenHash, await policy.digestBytes(new TextEncoder().encode(result.searchParams.get('ticket'))));
  assert.notEqual(issued.tokenHash, result.searchParams.get('ticket'));
});
test('file content checks reject mislabeled executable bytes and enforce streaming byte limits', async () => {
  assert.throws(() => policy.validateFileSignature(new TextEncoder().encode('MZ executable'), 'application/pdf'));
  policy.validateFileSignature(new TextEncoder().encode('%PDF-1.7\nsynthetic'), 'application/pdf');
  await assert.rejects(policy.readBoundedBody(new Request('https://example.test', { method: 'POST', body: '12345' }), 4), /size limit/);
  await assert.rejects(policy.readBoundedBody(new Request('https://example.test', { method: 'POST', body: '' }), 4), /Empty/);
  assert.ok(policy.uploadPolicy('request_attachment').types.includes('application/msword'));
  assert.ok(policy.uploadPolicy('case_document').types.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document'));
  assert.equal(policy.uploadPolicy('application').types.includes('application/msword'), false);
  policy.validateFileSignature(new TextEncoder().encode('Synthetic UTF-8 text'), 'text/plain');
  assert.throws(() => policy.validateFileSignature(Uint8Array.from([0, 255]), 'text/plain'));
  assert.throws(() => policy.uploadPolicy('unexpected-purpose'), /Unknown/);
});
test('attachment binding requires a clean receipt with exact owner, purpose and entity', async () => {
  let receipt = { ownerId: 'alice', purpose: 'case_document', entityId: 'case-a', status: 'clean' };
  const ctx = { db: { query: () => ({ withIndex() { return this; }, unique: async () => receipt }) } };
  await ownership.requireCleanOwnedUpload(ctx, 'blob', 'alice', 'case_document', 'case-a');
  for (const change of [{ ownerId: 'bob' }, { purpose: 'profile_photo' }, { entityId: 'case-b' }, { status: 'scanning' }]) {
    const original = receipt; receipt = { ...receipt, ...change };
    await assert.rejects(ownership.requireCleanOwnedUpload(ctx, 'blob', 'alice', 'case_document', 'case-a'), /ownership/);
    receipt = original;
  }
  receipt = null;
  await assert.rejects(ownership.requireCleanOwnedUpload(ctx, 'blob', 'alice', 'case_document', 'case-a'), /ownership/);
});
test('public publishing rejects private storage IDs and private storage URLs', async () => {
  let receipt = { status: 'clean', purpose: 'request_attachment' };
  const ctx = { db: { query: () => ({ withIndex() { return this; }, unique: async () => receipt }) } };
  for (const value of ['blob', 'https://example.convex.cloud/api/storage/blob']) await assert.rejects(ownership.requirePublicMediaReference(ctx, value), /public media/);
  receipt = { status: 'clean', purpose: 'public_media' };
  await ownership.requirePublicMediaReference(ctx, 'blob');
  await ownership.requirePublicMediaReference(ctx, 'https://example.convex.cloud/api/storage/blob');
  receipt = null;
  await ownership.requirePublicMediaReference(ctx, '/bundled/image.jpg');
  await ownership.requirePublicMediaReference(ctx, 'legacy-unchanged', 'legacy-unchanged');
});
test('failed clean receipt commit removes the newly stored object and records failure', async () => {
  process.env.PRIVATE_SCANNER_URL = 'https://scanner.example.test/scan';
  process.env.PRIVATE_SCANNER_TOKEN = 'synthetic-credential-at-least-32-characters';
  const bytes = new TextEncoder().encode('%PDF-1.7\nSynthetic');
  const originalFetch = globalThis.fetch;
  const deleted = []; const statuses = [];
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({ clean: true, sha256: await policy.digestBytes(bytes), engine: 'Synthetic', definitionsUpdatedAt: Date.now() }));
    const ctx = {
      runMutation: async (_fn, args) => {
        if (args.tokenHash) return { _id: 'ticket', purpose: 'application' };
        if (args.byteSize) return;
        statuses.push(args.status);
        if (args.status === 'clean') throw new Error('Synthetic exhausted byte budget');
      },
      storage: { store: async () => 'new-blob', delete: async id => deleted.push(id) },
    };
    const response = await managed.receive._handler(ctx, new Request(`https://example.test/secure-upload?ticket=${syntheticTicket}`, { method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: bytes }));
    assert.equal(response.status, 400);
    assert.deepEqual(deleted, ['new-blob']);
    assert.deepEqual(statuses, ['clean', 'failed']);
    assert.equal((await response.text()).includes('Synthetic exhausted'), false);
  } finally { globalThis.fetch = originalFetch; }
});
test('upload ticket claims reject expiry, reuse and deactivated owners', async () => {
  let ticket = { _id: 'ticket', ownerId: 'alice', purpose: 'application', status: 'issued', expiresAt: Date.now() + 10_000 };
  let deleted = false;
  const ctx = { db: {
    query: table => ({ withIndex() { return this; }, unique: async () => ticket, first: async () => null }),
    get: async () => ({ isDeleted: deleted }), insert: async () => 'rate', patch: async (id, value) => { if (id === 'ticket') Object.assign(ticket, value); },
  } };
  await managed.claim._handler(ctx, { tokenHash: 'test' });
  await assert.rejects(managed.claim._handler(ctx, { tokenHash: 'test' }), /already used/);
  ticket.status = 'issued'; ticket.expiresAt = Date.now() - 1;
  await assert.rejects(managed.claim._handler(ctx, { tokenHash: 'test' }), /expired/);
  ticket.expiresAt = Date.now() + 1000; deleted = true;
  await assert.rejects(managed.claim._handler(ctx, { tokenHash: 'test' }), /denied/);
});
test('scanner byte admission is one-use and cannot exceed the actual purpose limit', async () => {
  let row = { _id: 'ticket', status: 'scanning', purpose: 'application', ownerId: 'alice' };
  const ctx = { db: {
    get: async id => id === 'ticket' ? row : { _id: 'alice', role: 'user', isDeleted: false },
    query: () => ({ withIndex() { return this; }, first: async () => null }),
    insert: async () => 'budget', patch: async (id, value) => { if (id === 'ticket') Object.assign(row, value); },
  } };
  for (const change of [{ byteSize: 0 }, { byteSize: 11 * 1024 * 1024 }, { type: 'application/msword' }]) await assert.rejects(managed.reserveScan._handler(ctx, { id: 'ticket', byteSize: 100, type: 'application/pdf', ...change }), /Invalid/);
  await managed.reserveScan._handler(ctx, { id: 'ticket', byteSize: 100, type: 'application/pdf' });
  assert.equal(row.size, 100);
  assert.ok(row.scanReservedAt);
  await assert.rejects(managed.reserveScan._handler(ctx, { id: 'ticket', byteSize: 100, type: 'application/pdf' }), /conflict/);
});
test('privileged tickets recheck active roles before claim, scan admission and clean completion', async () => {
  let active = true;
  let deleted = false;
  let row = { _id: 'ticket', ownerId: 'alice', purpose: 'ai_source', status: 'issued', expiresAt: Date.now() + 1000 };
  const owner = { _id: 'alice', role: 'user' };
  const ctx = { db: {
    get: async id => id === 'ticket' ? row : { ...owner, isDeleted: deleted },
    query: table => ({ withIndex() { return this; }, unique: async () => row, first: async () => null, collect: async () => table === 'role_assignments' && active ? [{ role: 'staff' }] : [] }),
    insert: async () => 'budget', patch: async (id, value) => { if (id === 'ticket') Object.assign(row, value); },
  } };
  active = false;
  await assert.rejects(managed.claim._handler(ctx, { tokenHash: 'test' }), /denied/);
  assert.equal(row.status, 'issued');
  active = true;
  await managed.claim._handler(ctx, { tokenHash: 'test' });
  active = false;
  await assert.rejects(managed.reserveScan._handler(ctx, { id: 'ticket', byteSize: 100, type: 'application/pdf' }), /denied/);
  assert.equal(row.scanReservedAt, undefined);
  active = true;
  await managed.reserveScan._handler(ctx, { id: 'ticket', byteSize: 100, type: 'application/pdf' });
  const receipt = { id: 'ticket', status: 'clean', storageId: 'blob', sha256: 'a'.repeat(64), size: 100, type: 'application/pdf', scannerVersion: 'ClamAV synthetic', definitionsUpdatedAt: Date.now() };
  active = false;
  await assert.rejects(managed.finish._handler(ctx, receipt), /denied/);
  active = true; deleted = true;
  await assert.rejects(managed.finish._handler(ctx, receipt), /denied/);
  deleted = false;
  for (const change of [{ definitionsUpdatedAt: 1 }, { definitionsUpdatedAt: Date.now() + 120_000 }, { sha256: 'invalid' }, { scannerVersion: ' ' }]) await assert.rejects(managed.finish._handler(ctx, { ...receipt, ...change }), /Invalid/);
  assert.equal(row.status, 'scanning');
  await managed.finish._handler(ctx, receipt);
  assert.equal(row.status, 'clean');
});
test('stalled upload sweep is bounded and preserves clean receipts, recent work and all files', async () => {
  const old = Date.now() - 30 * 60 * 1000;
  const rows = [
    { _id: 'stalled-scan', status: 'scanning', createdAt: old },
    { _id: 'expired-ticket', status: 'issued', createdAt: old },
    { _id: 'extra-expired', status: 'issued', createdAt: old },
    { _id: 'clean-original', status: 'clean', createdAt: old, storageId: 'original-evidence' },
    { _id: 'recent-scan', status: 'scanning', createdAt: Date.now() },
  ];
  let deletions = 0;
  const ctx = { db: {
    query: () => {
      let selected = rows;
      const query = { withIndex(_name, callback) {
        const range = { eq(key, value) { selected = selected.filter(row => row[key] === value); return range; }, lt(key, value) { selected = selected.filter(row => row[key] < value); return range; } };
        callback(range); return query;
      }, take: async count => selected.slice(0, count) }; return query;
    },
    patch: async (id, value) => Object.assign(rows.find(row => row._id === id), value),
    delete: async () => { deletions++; },
  }, storage: { delete: async () => { deletions++; } } };
  for (const limit of [0, 101, 0.5, NaN]) await assert.rejects(managed.expireStaleTickets._handler(ctx, { limit }), /Invalid/);
  assert.deepEqual(await managed.expireStaleTickets._handler(ctx, { limit: 2 }), { expired: 2 });
  assert.equal(rows[0].status, 'failed'); assert.equal(rows[1].status, 'failed');
  assert.equal(rows[2].status, 'issued'); assert.equal(rows[3].status, 'clean'); assert.equal(rows[4].status, 'scanning');
  assert.equal(rows[3].storageId, 'original-evidence'); assert.equal(deletions, 0);
  assert.deepEqual(await managed.expireStaleTickets._handler(ctx, { limit: 2 }), { expired: 1 });
});
test('exhausted scan admission rejects the gateway before calling the scanner or storing bytes', async () => {
  process.env.PRIVATE_SCANNER_URL = 'https://scanner.example.test/scan';
  process.env.PRIVATE_SCANNER_TOKEN = 'synthetic-credential-at-least-32-characters';
  const originalFetch = globalThis.fetch;
  let scans = 0; let stores = 0;
  try {
    globalThis.fetch = async () => { scans++; throw new Error('Should not scan'); };
    const ctx = {
      runMutation: async (_fn, args) => {
        if (args.tokenHash) return { _id: 'ticket', purpose: 'application' };
        if (args.byteSize) throw new Error('Synthetic daily limit');
      },
      storage: { store: async () => { stores++; }, delete: async () => {} },
    };
    const response = await managed.receive._handler(ctx, new Request(`https://example.test/secure-upload?ticket=${syntheticTicket}`, { method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: '%PDF-1.7\nSynthetic' }));
    assert.equal(response.status, 400); assert.equal(scans, 0); assert.equal(stores, 0);
  } finally { globalThis.fetch = originalFetch; }
});
test('upload gateway stores bytes only after fresh, matching, clean scanner receipts', async () => {
  process.env.PRIVATE_SCANNER_URL = 'https://scanner.example.test/scan';
  process.env.PRIVATE_SCANNER_TOKEN = 'synthetic-credential-at-least-32-characters';
  const bytes = new TextEncoder().encode('%PDF-1.7\nSynthetic test document');
  const hash = await policy.digestBytes(bytes);
  const originalFetch = globalThis.fetch;
  try {
    for (const change of [{ clean: false }, { sha256: 'wrong' }, { definitionsUpdatedAt: 0 }, { outage: true }, {}]) {
      let stores = 0; const finishes = [];
      globalThis.fetch = async () => {
        if (change.outage) throw new Error('Synthetic outage');
        return new Response(JSON.stringify({ clean: true, sha256: hash, engine: 'Synthetic engine', definitionsUpdatedAt: Date.now(), ...change }));
      };
      const ctx = {
        runMutation: async (_fn, args) => args.tokenHash ? { _id: 'ticket', purpose: 'application' } : args.byteSize ? undefined : finishes.push(args),
        storage: { store: async () => { stores++; return 'blob'; }, delete: async () => {} },
      };
      const response = await managed.receive._handler(ctx, new Request(`https://example.test/secure-upload?ticket=${syntheticTicket}`, { method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: bytes }));
      const clean = Object.keys(change).length === 0;
      assert.equal(response.status, clean ? 200 : 400);
      assert.equal(stores, clean ? 1 : 0);
      assert.equal(finishes.at(-1).status, clean ? 'clean' : change.outage ? 'failed' : 'rejected');
      assert.equal(response.headers.get('Cache-Control'), 'no-store');
    }
  } finally { globalThis.fetch = originalFetch; }
});
