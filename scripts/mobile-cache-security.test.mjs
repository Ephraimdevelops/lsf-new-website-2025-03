import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';

async function load(file, stubs = {}) {
  const bundle = await build({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'esm', plugins: [{
    name: 'device-test-adapters', setup(builder) {
      builder.onResolve({ filter: /^(expo-secure-store|react|\.\/auth)$/ }, args => stubs[args.path] ? { path: args.path, namespace: 'stub' } : undefined);
      builder.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ contents: stubs[args.path], loader: 'js' }));
    },
  }] });
  return import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
}

const values = new Map();
globalThis.__pendingStore = {
  getItemAsync: async key => values.get(key) ?? null,
  setItemAsync: async (key, value) => { values.set(key, value); },
};
const pending = await load('mobile/src/pendingActions.ts', {
  'expo-secure-store': 'export const getItemAsync = globalThis.__pendingStore.getItemAsync; export const setItemAsync = globalThis.__pendingStore.setItemAsync; export const WHEN_UNLOCKED_THIS_DEVICE_ONLY = "device-only";',
  'react': 'export const useEffect = () => {}; export const useState = () => {};',
  './auth': 'export const useUser = () => ({user:null});',
});
const action = { type: 'case_message', caseId: 'synthetic-case', body: 'Synthetic test message', clientMessageId: 'synthetic-message' };

test('private pending queues require an owner and do not adopt legacy or another account data', async () => {
  values.clear();
  values.set('haki_yangu_pending_actions', JSON.stringify([{ ...action, id: 'legacy', createdAt: Date.now(), attempts: 0 }]));
  assert.deepEqual(await pending.getPendingActions(null), []);
  assert.deepEqual(await pending.getPendingActions('alice'), []);
  await assert.rejects(pending.enqueuePendingAction(null, action), /Sign in/);
  await pending.enqueuePendingAction('alice', action);
  assert.equal((await pending.getPendingActions('alice')).length, 1);
  assert.deepEqual(await pending.getPendingActions('bob'), []);
  assert.notEqual(pending.pendingActionKey('a/b'), pending.pendingActionKey('ab'));
});

test('concurrent queue writes retain every action and capacity does not silently evict work', async () => {
  values.clear();
  await Promise.all(Array.from({ length: 25 }, (_, i) => pending.enqueuePendingAction('alice', { ...action, clientMessageId: `message-${i}` })));
  const queue = await pending.getPendingActions('alice');
  assert.equal(queue.length, 25);
  assert.equal(new Set(queue.map(item => item.clientMessageId)).size, 25);
  await assert.rejects(pending.enqueuePendingAction('alice', action), /pending actions/);
  assert.equal((await pending.getPendingActions('alice')).length, 25);
  await pending.markPendingActionFailed('alice', queue[0].id, new Error('sensitive server response'));
  assert.equal((await pending.getPendingActions('alice'))[0].lastError, 'Sync failed');
  await pending.removePendingAction('bob', queue[0].id);
  assert.equal((await pending.getPendingActions('alice')).length, 25);
});

test('corrupt or unsupported queued payloads are not replayed', async () => {
  values.clear();
  const key = pending.pendingActionKey('alice');
  values.set(key, JSON.stringify([{ ...action, type: 'unknown', id: 'invalid', createdAt: Date.now(), attempts: 0 }]));
  await assert.rejects(pending.getPendingActions('alice'), /recovery/);
  assert.ok(values.has(key));
  values.clear();
  await assert.rejects(pending.enqueuePendingAction('alice', { ...action, body: '' }), /Invalid/);
});

test('same retry key is recovered without consuming queue capacity and changed payload is rejected', async () => {
 values.clear();const first=await pending.enqueuePendingAction('alice',action);
 const retry=await pending.enqueuePendingAction('alice',action);
 assert.equal(retry.id,first.id);assert.equal((await pending.getPendingActions('alice')).length,1);
 await assert.rejects(pending.enqueuePendingAction('alice',{...action,body:'Changed payload'}),/match the original/);
});
test('queue order remains FIFO and changes notify only the owning account', async () => {
 values.clear();let alice=0,bob=0;
 const unsubA=pending.subscribePendingActions('alice',()=>alice++),unsubB=pending.subscribePendingActions('bob',()=>bob++);
 const first=await pending.enqueuePendingAction('alice',{...action,clientMessageId:'first'});
 await pending.enqueuePendingAction('alice',{...action,clientMessageId:'second'});
 assert.deepEqual((await pending.getPendingActions('alice')).map(x=>x.clientMessageId),['first','second']);assert.equal(alice,2);assert.equal(bob,0);
 await pending.removePendingAction('alice',first.id);assert.equal(alice,3);unsubA();unsubB();
});
test('corrupt storage is retained and reported, rather than appearing as an empty successful queue', async () => {
 values.clear();const key=pending.pendingActionKey('alice');values.set(key,'{broken');
 await assert.rejects(pending.getPendingActions('alice'),/not been deleted/);assert.equal(values.get(key),'{broken');
 await assert.rejects(pending.enqueuePendingAction('alice',action),/not been deleted/);assert.equal(values.get(key),'{broken');
});

const forms = await load('convex/formSubmissions.ts');
process.env.CONVEX_SITE_URL = 'https://example.test';
process.env.PRIVATE_SCANNER_URL = 'https://scanner.example.test/scan';
process.env.PRIVATE_SCANNER_TOKEN = 'synthetic-test-token-with-32-characters';
function fixture() {
  const rates = new Map();
  let subject = 'alice';
  let metadata = { size: 100, contentType: 'application/pdf' };
  const ctx = {
    auth: { getUserIdentity: async () => subject ? { subject, email: `${subject}@example.test` } : null },
    db: {
      query(table) {
        let match;
        const query = {
          withIndex(_name, callback) { callback({ eq(_field, value) { match = value; return this; } }); return query; },
          unique: async () => table === 'managed_uploads' ? { ownerId: subject, status: 'clean', purpose: 'application' } : subject && match === subject ? { _id: subject, clerkId: subject } : null,
          first: async () => rates.get(match) ?? null,
          collect: async () => [],
        }; return query;
      },
      insert: async (table, row) => { if (table === 'rate_limits') rates.set(row.identifier, { ...row, _id: row.identifier }); return 'synthetic-id'; },
      patch: async (id, row) => { rates.set(id, { ...rates.get(id), ...row }); },
      system: { get: async () => metadata },
    },
    storage: { generateUploadUrl: async () => 'https://example.test/upload' },
    scheduler: { runAfter: async () => {} },
  };
  return { ctx, rates, actor: value => { subject = value; }, metadata: value => { metadata = value; } };
}
const application = { fullName: 'Synthetic applicant', email: 'alice@example.test', phone: '000000', region: 'Test', district: 'Test', education: 'Test', experience: 'Test', motivation: 'Test' };

test('application limits use server identity rather than caller-controlled identifiers', async () => {
  const f = fixture();
  for (let i = 0; i < 3; i++) await forms.submitParalegalApplication._handler(f.ctx, { ...application, clientIdentifier: `rotated-${i}` });
  await assert.rejects(forms.submitParalegalApplication._handler(f.ctx, { ...application, clientIdentifier: 'new-identifier' }), /Rate limit/);
  f.actor('bob');
  await forms.submitParalegalApplication._handler(f.ctx, { ...application, email: 'bob@example.test' });
  assert.equal(f.rates.get('paralegal:bob').count, 1);
});

test('upload URL issuance requires authentication and has an independent account budget', async () => {
  const f = fixture();
  for (let i = 0; i < 30; i++) await forms.generateParalegalDocumentUploadUrl._handler(f.ctx, {});
  await assert.rejects(forms.generateParalegalDocumentUploadUrl._handler(f.ctx, {}), /Please wait/);
  f.actor('bob');
  await forms.generateParalegalDocumentUploadUrl._handler(f.ctx, {});
  f.actor(null);
  await assert.rejects(forms.generateParalegalDocumentUploadUrl._handler(f.ctx, {}), /Unauthorized/);
});

test('application attachment metadata rejects empty files and broad spoofed image/PDF MIME labels', async () => {
  for (const metadata of [{ size: 0, contentType: 'application/pdf' }, { size: 100, contentType: 'image/svg+xml' }, { size: 100, contentType: 'not-really/pdf' }]) {
    const f = fixture(); f.metadata(metadata);
    await assert.rejects(forms.submitParalegalApplication._handler(f.ctx, { ...application, idDocumentStorageId: 'blob' }), /Application files/);
  }
});
