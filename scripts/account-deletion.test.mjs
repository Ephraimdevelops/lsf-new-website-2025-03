import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
const bundle = await build({ entryPoints: ['convex/accountDeletion.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const deletion = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
function fixture(role = 'user', otherAdmin = false) {
  const user = { _id: 'alice', clerkId: 'clerk-alice', role };
  const other = { _id: 'bob', clerkId: 'clerk-bob', role: 'admin' };
  const assignment = { _id: 'role', userId: 'alice', role, status: 'active' };
  const token = { _id: 'token', userId: 'alice', enabled: true };
  const scheduled = [], inserted = [], patched = [];
  const ctx = {
    auth: { getUserIdentity: async () => ({ subject: 'clerk-alice' }) },
    scheduler: { runAfter: async (delay, ref, args) => scheduled.push({ delay, args }) },
    db: {
      get: async id => id === 'alice' ? user : otherAdmin ? other : null,
      patch: async (id, fields) => { patched.push({ id, fields }); if (id === 'alice') Object.assign(user, fields); },
      insert: async (table, value) => inserted.push({ table, value }),
      query(table) {
        let index;
        const q = { withIndex(name) { index = name; return q; }, unique: async () => user,
          collect: async () => table === 'push_subscriptions' ? [token] : table === 'role_assignments'
            ? index === 'by_role_status' ? (otherAdmin ? [{ userId: 'bob' }] : []) : [assignment]
            : table === 'users' ? [user, ...(otherAdmin ? [other] : [])] : [],
        }; return q;
      },
    },
  };
  ctx.runQuery = async () => user;
  ctx.runMutation = async (ref, args) => args.complete !== undefined ? deletion.finish._handler(ctx, args) : deletion.prepare._handler(ctx, args);
  return { ctx, user, inserted, patched, scheduled };
}

test('every role can close its own account without deleting case or audit records', async () => {
  for (const role of ['user', 'paralegal', 'provider_staff', 'staff', 'supervisor', 'safeguarding_officer', 'content_editor', 'stakeholder', 'donor', 'admin']) {
    const f = fixture(role, true);
    await deletion.prepare._handler(f.ctx, { clerkId: 'clerk-alice' });
    assert.equal(f.user.isDeleted, true);
    assert.equal(f.user.loginDeletionStatus, 'pending');
    assert.ok(f.patched.some(row => row.id === 'role' && row.fields.status === 'revoked'));
    assert.ok(f.patched.some(row => row.id === 'token' && row.fields.enabled === false));
    assert.deepEqual(f.inserted.map(row => row.table), ['audit_logs']);
    assert.equal(f.scheduled.length, 1);
  }
});
test('last administrator is protected before any access is revoked', async () => {
  const f = fixture('admin');
  await assert.rejects(deletion.prepare._handler(f.ctx, { clerkId: 'clerk-alice' }), /another administrator/);
  assert.equal(f.patched.length, 0); assert.equal(f.scheduled.length, 0);
});
test('repeated requests do not duplicate role revocation or request audit logs', async () => {
  const f = fixture();
  await deletion.prepare._handler(f.ctx, { clerkId: 'clerk-alice' });
  await deletion.prepare._handler(f.ctx, { clerkId: 'clerk-alice' });
  assert.equal(f.inserted.length, 1);
  assert.equal(f.patched.filter(row => row.id === 'role').length, 1);
});
test('Clerk success and already-removed logins complete the durable job', async () => {
  const fetchBefore = globalThis.fetch, secretBefore = process.env.CLERK_SECRET_KEY;
  process.env.CLERK_SECRET_KEY = 'synthetic-test-secret';
  try {
    for (const status of [200, 404]) {
      const f = fixture(); Object.assign(f.user, { isDeleted: true, loginDeletionStatus: 'pending' });
      globalThis.fetch = async (url, options) => { assert.ok(url.endsWith('/clerk-alice')); assert.equal(options.method, 'DELETE'); return { ok: status === 200, status }; };
      assert.deepEqual(await deletion.removeLogin._handler(f.ctx, { clerkId: 'clerk-alice', attempt: 0 }), { deleted: true });
      assert.equal(f.user.loginDeletionStatus, 'complete');
    }
  } finally { globalThis.fetch = fetchBefore; if (secretBefore === undefined) delete process.env.CLERK_SECRET_KEY; else process.env.CLERK_SECRET_KEY = secretBefore; }
});
test('transient Clerk failures retry, remain honest, and record exhausted retries', async () => {
  const fetchBefore = globalThis.fetch, secretBefore = process.env.CLERK_SECRET_KEY;
  process.env.CLERK_SECRET_KEY = 'synthetic-test-secret';
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  try {
    const f = fixture(); Object.assign(f.user, { isDeleted: true, loginDeletionStatus: 'pending' });
    assert.deepEqual(await deletion.removeLogin._handler(f.ctx, { clerkId: 'clerk-alice', attempt: 1 }), { deleted: false });
    assert.equal(f.scheduled[0].args.attempt, 2);
    await deletion.removeLogin._handler(f.ctx, { clerkId: 'clerk-alice', attempt: 6 });
    assert.equal(f.user.loginDeletionStatus, 'failed');
  } finally { globalThis.fetch = fetchBefore; if (secretBefore === undefined) delete process.env.CLERK_SECRET_KEY; else process.env.CLERK_SECRET_KEY = secretBefore; }
});
test('no unauthenticated deletion and wrong Clerk configuration changes no data', async () => {
  const f = fixture(); f.ctx.auth.getUserIdentity = async () => null;
  await assert.rejects(deletion.deleteMyAccount._handler(f.ctx, { confirmation: 'DELETE' }), /Unauthorized/);
  const fetchBefore = globalThis.fetch, secretBefore = process.env.CLERK_SECRET_KEY;
  process.env.CLERK_SECRET_KEY = 'synthetic-test-secret';
  globalThis.fetch = async () => ({ ok: false, status: 401 });
  try {
    f.ctx.auth.getUserIdentity = async () => ({ subject: 'clerk-alice' });
    await assert.rejects(deletion.deleteMyAccount._handler(f.ctx, { confirmation: 'DELETE' }), /Nothing has been deleted/);
    assert.equal(f.patched.length, 0);
  } finally { globalThis.fetch = fetchBefore; if (secretBefore === undefined) delete process.env.CLERK_SECRET_KEY; else process.env.CLERK_SECRET_KEY = secretBefore; }
});
