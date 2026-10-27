import test from 'node:test';
import assert from 'node:assert/strict';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
const messages = loadHandlerModule('convex/requestMessages.ts');
const intake = loadHandlerModule('convex/legalHelp.ts');
async function setup() {
  const h = harness();
  const beneficiary = await h.user(); const stranger = await h.user(); const staff = await h.user('staff'); const provider = await h.user('paralegal');
  const requestId = await h.db.insert('legal_help_requests', { ownerId: beneficiary, publicId: 'QA-REQUEST', status: 'under_review', version: 1, createdAt: 1 });
  return { h, beneficiary, stranger, staff, provider, requestId };
}
const text = { body: 'Please confirm the month when this happened.', clientMessageId: 'question-1', requestInformation: true };
test('staff clarification and beneficiary reply restore the request to review', async () => {
  const s = await setup(); const args = { requestId: s.requestId, ...text };
  await s.h.invoke(messages.send, args, s.staff);
  assert.equal((await s.h.db.get(s.requestId)).status, 'waiting_for_information');
  await s.h.invoke(messages.send, { requestId: s.requestId, body: 'It happened in September. This is a synthetic test.', clientMessageId: 'reply-1' }, s.beneficiary);
  assert.equal((await s.h.db.get(s.requestId)).status, 'under_review');
  assert.equal((await s.h.db.get(s.requestId)).version, 3);
  const list = await s.h.invoke(messages.list, { requestId: s.requestId, paginationOpts: { numItems: 10, cursor: null } }, s.beneficiary);
  assert.equal(list.page.length, 2); assert.equal(list.page[0].senderKind, 'beneficiary');
  assert.equal(list.page[0].senderId, undefined);
  const notifications = await s.h.db.query('notifications').collect(); assert.equal(notifications.length, 2);
  assert.equal(notifications[1].userId, s.staff);
  assert.ok(notifications.every(row => !JSON.stringify(row).includes(text.body)));
  const audit = await s.h.db.query('audit_logs').collect(); assert.ok(audit.every(row => !JSON.stringify(row).includes(text.body)));
});
test('only the owner and active LSF roles can read or send; revoked access fails immediately', async () => {
  const s = await setup();
  for (const actor of [null, s.stranger, s.provider]) {
    await assert.rejects(s.h.invoke(messages.send, { requestId: s.requestId, ...text }, actor), /Unauthorized|denied/);
    await assert.rejects(s.h.invoke(messages.list, { requestId: s.requestId, paginationOpts: { numItems: 10, cursor: null } }, actor), /Unauthorized|denied/);
  }
  await s.h.db.patch(s.staff, { role: 'user' });
  await assert.rejects(s.h.invoke(messages.send, { requestId: s.requestId, ...text }, s.staff), /denied/);
  assert.equal((await s.h.db.query('request_messages').collect()).length, 0);
});
test('message retry is idempotent even after conversion; changed retries and new closed messages fail', async () => {
  const s = await setup(); const args = { requestId: s.requestId, ...text };
  const id = await s.h.invoke(messages.send, args, s.staff);
  await s.h.db.patch(s.requestId, { status: 'converted_to_case' });
  assert.equal(await s.h.invoke(messages.send, args, s.staff), id);
  await assert.rejects(s.h.invoke(messages.send, { ...args, body: 'Changed message' }, s.staff), /retry must match/);
  await assert.rejects(s.h.invoke(messages.send, { ...args, clientMessageId: 'new' }, s.staff), /no longer accepts/);
  assert.equal((await s.h.db.query('request_messages').collect()).length, 1);
  assert.equal((await s.h.db.query('notifications').collect()).length, 1);
});
test('beneficiaries cannot issue staff instructions and empty messages are rejected', async () => {
  const s = await setup();
  await assert.rejects(s.h.invoke(messages.send, { requestId: s.requestId, ...text }, s.beneficiary), /Only LSF/);
  await assert.rejects(s.h.invoke(messages.send, { requestId: s.requestId, body: '   ', clientMessageId: 'empty' }, s.beneficiary));
  assert.equal((await s.h.db.query('request_messages').collect()).length, 0);
});
test('waiting requests remain in the default operations queue', async () => {
  const s = await setup(); await s.h.db.patch(s.requestId, { status: 'waiting_for_information' });
  assert.ok((await s.h.invoke(intake.staffQueue, {}, s.staff)).some(row => row._id === s.requestId));
});
test('history paginates without exposing staff identity, including after withdrawal', async () => {
  const s = await setup();
  for (let i = 0; i < 4; i++) await s.h.invoke(messages.send, { requestId: s.requestId, body: `Synthetic message ${i}`, clientMessageId: `m${i}` }, s.beneficiary);
  await s.h.db.patch(s.requestId, { status: 'withdrawn' });
  const args = { requestId: s.requestId, paginationOpts: { numItems: 2, cursor: null } };
  const first = await s.h.invoke(messages.list, args, s.staff);
  const second = await s.h.invoke(messages.list, { ...args, paginationOpts: { ...args.paginationOpts, cursor: first.continueCursor } }, s.staff);
  assert.equal(first.isDone, false); assert.equal(second.isDone, true);
  assert.equal(new Set([...first.page, ...second.page].map(row => row._id)).size, 4);
});

test('a waiting state requires a question, and conversation state closes after conversion', async () => {
  const s = await setup();
  await assert.rejects(s.h.invoke(intake.setReviewStatus, { requestId: s.requestId, expectedVersion: 1, status: 'waiting_for_information' }, s.staff), /Send the question/);
  assert.equal((await s.h.db.get(s.requestId)).status, 'under_review');
  const state = await s.h.invoke(messages.state, { requestId: s.requestId }, s.beneficiary);
  assert.equal(state.canRequestInformation, false); assert.equal(state.canSend, true);
  await s.h.db.patch(s.requestId, { status: 'converted_to_case' });
  assert.equal((await s.h.invoke(messages.state, { requestId: s.requestId }, s.beneficiary)).canSend, false);
});
