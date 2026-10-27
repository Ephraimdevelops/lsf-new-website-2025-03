import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const directory = await mkdtemp(join(tmpdir(), 'haki-invitation-tests-'));
await build({ stdin: { contents: 'export * as invitations from "./convex/providerInvitations.ts"; export * as access from "./convex/accessRequests.ts";', resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: join(directory, 'handlers.mjs') });
const { invitations, access } = await import(pathToFileURL(join(directory, 'handlers.mjs')).href);
await rm(directory, { recursive: true });

function fixture() {
  const records = new Map(); let counter = 0;
  const put = (table, id, values) => records.set(id, { _id: id, _table: table, ...values });
  for (const id of ['provider', 'recipient', 'outsider', 'reviewer']) put('users', id, { clerkId: id, email: `${id}@example.test`, name: id, role: id === 'reviewer' ? 'admin' : 'user' });
  put('justice_service_organizations', 'org', { name: 'Synthetic test organisation', verificationStatus: 'verified', referralAgreementStatus: 'active' });
  put('role_assignments', 'membership', { userId: 'provider', role: 'provider_staff', organizationId: 'org', status: 'active' });
  const db = {
    get: async id => records.get(id) ?? null,
    insert: async (table, values) => { const id = `${table}-${++counter}`; put(table, id, values); return id; },
    patch: async (id, values) => { Object.assign(records.get(id), values); },
    query(table) {
      const filters = [];
      const query = {
        withIndex(_name, callback) { const q = { eq(key, value) { filters.push([key, value]); return q; } }; callback(q); return query; },
        order() { return query; },
        async collect() { return [...records.values()].filter(item => item._table === table && filters.every(([key, value]) => item[key] === value)); },
        async first() { return (await query.collect())[0] ?? null; },
        async unique() { const items = await query.collect(); assert.ok(items.length <= 1); return items[0] ?? null; },
        async take(limit) { return (await query.collect()).slice(0, limit); },
      }; return query;
    },
  };
  const context = (id, verified = true) => ({ db, auth: { getUserIdentity: async () => ({ subject: id, email: `${id}@example.test`, emailVerified: verified }) } });
  return { records, context };
}

test('provider invitation → recipient acceptance → independent LSF approval grants only scoped membership', async () => {
  const { records, context } = fixture();
  const id = await invitations.create._handler(context('provider'), { organizationId: 'org', email: 'recipient@example.test' });
  assert.equal((await invitations.mine._handler(context('recipient'), {})).length, 1);
  await assert.rejects(() => invitations.respond._handler(context('outsider'), { id, accept: true }));
  await assert.rejects(() => invitations.respond._handler(context('recipient', false), { id, accept: true }));
  const requestId = await invitations.respond._handler(context('recipient'), { id, accept: true });
  assert.equal(await invitations.respond._handler(context('recipient'), { id, accept: true }), requestId);
  const review = await access.adminRequestForReview._handler(context('reviewer'), { id: requestId });
  assert.equal(review.invitationEvidence.inviterName, 'provider');
  assert.equal(review.invitationEvidence.inviterStillMember, true);
  await assert.rejects(() => access.adminRequestForReview._handler(context('outsider'), { id: requestId }));
  assert.equal([...records.values()].filter(item => item._table === 'role_assignments' && item.userId === 'recipient').length, 0);
  await access.decide._handler(context('reviewer'), { requestId, decision: 'approved', decisionNote: 'Identity and membership verified in synthetic test.', organizationId: 'org' });
  const roles = [...records.values()].filter(item => item._table === 'role_assignments' && item.userId === 'recipient');
  assert.equal(roles.length, 1); assert.equal(roles[0].organizationId, 'org'); assert.equal(roles[0].role, 'provider_staff');
  assert.equal(records.get('recipient').role, 'user');
});

test('expired, cancelled and revoked-inviter invitations cannot activate a review', async () => {
  for (const condition of ['expired', 'cancelled', 'revoked']) {
    const { records, context } = fixture();
    const id = await invitations.create._handler(context('provider'), { organizationId: 'org', email: 'recipient@example.test' });
    if (condition === 'expired') records.get(id).expiresAt = 0;
    if (condition === 'cancelled') await invitations.cancel._handler(context('provider'), { id });
    if (condition === 'revoked') records.get('membership').status = 'revoked';
    await assert.rejects(() => invitations.respond._handler(context('recipient'), { id, accept: true }));
  }
});

test('outsiders cannot invite and an inviter with admin privileges cannot approve their own invitation', async () => {
  const { records, context } = fixture();
  await assert.rejects(() => invitations.create._handler(context('outsider'), { organizationId: 'org', email: 'recipient@example.test' }));
  const id = await invitations.create._handler(context('provider'), { organizationId: 'org', email: 'recipient@example.test' });
  const requestId = await invitations.respond._handler(context('recipient'), { id, accept: true });
  records.get('provider').role = 'admin';
  await assert.rejects(() => access.decide._handler(context('provider'), { requestId, decision: 'approved', decisionNote: 'Attempt to approve own invitation.', organizationId: 'org' }));
  await assert.rejects(() => access.decide._handler(context('reviewer'), { requestId, decision: 'approved', decisionNote: 'Attempt to change invited organisation.', organizationId: 'another-org' }));
});

test('membership revoked after acceptance blocks approval but permits rejection', async () => {
  const { records, context } = fixture();
  const id = await invitations.create._handler(context('provider'), { organizationId: 'org', email: 'recipient@example.test' });
  const requestId = await invitations.respond._handler(context('recipient'), { id, accept: true });
  records.get('membership').status = 'revoked';
  await assert.rejects(() => access.decide._handler(context('reviewer'), { requestId, decision: 'approved', decisionNote: 'Membership changed while review was pending.', organizationId: 'org' }));
  assert.equal([...records.values()].filter(item => item._table === 'role_assignments' && item.userId === 'recipient').length, 0);
  await access.decide._handler(context('reviewer'), { requestId, decision: 'rejected', decisionNote: 'Inviter no longer represents this organisation.' });
  assert.equal(records.get(requestId).status, 'rejected');
});

test('organisation sees review outcome separately from current membership without reviewer notes', async () => {
  const { records, context } = fixture();
  const id = await invitations.create._handler(context('provider'), { organizationId: 'org', email: 'recipient@example.test' });
  const requestId = await invitations.respond._handler(context('recipient'), { id, accept: true });
  const list = () => invitations.listForOrganisation._handler(context('provider'), { organizationId: 'org' });
  let [item] = await list();
  assert.equal(item.accessReviewStatus, 'pending');
  assert.equal(item.hasActiveMembership, false);
  await access.decide._handler(context('reviewer'), { requestId, decision: 'approved', decisionNote: 'Private reviewer evidence must not appear in invitation history.', organizationId: 'org' });
  [item] = await list();
  assert.equal(item.accessReviewStatus, 'approved');
  assert.equal(item.hasActiveMembership, true);
  assert.ok(!JSON.stringify(item).includes('Private reviewer evidence'));
  const membership = [...records.values()].find(record => record._table === 'role_assignments' && record.userId === 'recipient');
  membership.status = 'revoked';
  [item] = await list();
  assert.equal(item.accessReviewStatus, 'approved');
  assert.equal(item.hasActiveMembership, false);
  await assert.rejects(() => invitations.listForOrganisation._handler(context('outsider'), { organizationId: 'org' }));
});

test('rejected invitation review remains visible after access request organisation is cleared', async () => {
  const { context } = fixture();
  const id = await invitations.create._handler(context('provider'), { organizationId: 'org', email: 'recipient@example.test' });
  const requestId = await invitations.respond._handler(context('recipient'), { id, accept: true });
  await access.decide._handler(context('reviewer'), { requestId, decision: 'rejected', decisionNote: 'Membership could not be verified.' });
  const [item] = await invitations.listForOrganisation._handler(context('provider'), { organizationId: 'org' });
  assert.equal(item.accessReviewStatus, 'rejected');
  assert.equal(item.hasActiveMembership, false);
});
