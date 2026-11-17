import test from "node:test";
import assert from "node:assert/strict";
import {
  harness,
  loadHandlerModule,
} from "./test-support/convex-handler-harness.mjs";
const corrections = loadHandlerModule("convex/aiCorrections.ts");
async function fixture() {
  const h = harness(),
    owner = await h.user(),
    other = await h.user(),
    admin = await h.user("admin");
  const user = await h.db.get(owner);
  const conversationId = await h.db.insert("sara_conversations", {
    userId: user.clerkId,
    title: "Own chat",
    updatedAt: Date.now(),
  });
  await h.invoke(
    corrections.recordReferences,
    {
      conversationId,
      references: [
        {
          id: "published-paralegal:fixture-a",
          title: "Fictional A",
          kind: "published",
          phone: "+255600000001",
          url: "https://lsftz.org/legal-help",
        },
        { id: "guide:fixture-guide", title: "Fixture guidance", kind: "legal" },
      ],
      answerId: "answer-one",
    },
    owner,
  );
  return { h, owner, other, admin, conversationId };
}
test("a wrong contact is recorded and excluded only in its own chat before review", async () => {
  const f = await fixture();
  await f.h.invoke(
    corrections.captureFeedback,
    {
      conversationId: f.conversationId,
      currentMessage: "Fictional A has the wrong number",
    },
    f.owner,
  );
  const state = await f.h.invoke(
    corrections.getState,
    { conversationId: f.conversationId },
    f.owner,
  );
  assert.ok(state.excludedIds.includes("published-paralegal:fixture-a"));
  assert.deepEqual(await f.h.invoke(corrections.getGlobalExclusions), []);
  await assert.rejects(
    f.h.invoke(
      corrections.getState,
      { conversationId: f.conversationId },
      f.other,
    ),
    /not found/,
  );
});
test("general misinformation reports retain the previous answer and related sources for rechecking", async () => {
  const f = await fixture();
  await f.h.invoke(
    corrections.captureFeedback,
    {
      conversationId: f.conversationId,
      currentMessage: "That information is incorrect",
    },
    f.owner,
  );
  const state = await f.h.invoke(
    corrections.getState,
    { conversationId: f.conversationId },
    f.owner,
  );
  assert.ok(state.excludedIds.includes("guide:fixture-guide"));
  assert.ok(state.excludedIds.includes("answer:answer-one"));
  assert.equal(state.reports[0].category, "incorrect_guidance");
});
test("invented targets, unrequested reports and non-admin global changes are rejected", async () => {
  const f = await fixture();
  await assert.rejects(
    f.h.invoke(
      corrections.reportProblem,
      {
        conversationId: f.conversationId,
        currentMessage: "This is wrong",
        referenceId: "paralegal:someone-else",
        category: "wrong_contact",
      },
      f.owner,
    ),
    /actually shown/,
  );
  await assert.rejects(
    f.h.invoke(
      corrections.reportProblem,
      {
        conversationId: f.conversationId,
        currentMessage: "Hello",
        referenceId: "last_answer",
        category: "other",
      },
      f.owner,
    ),
    /feedback statement/,
  );
  await assert.rejects(
    f.h.invoke(corrections.reviewQueue, { status: "pending" }, f.owner),
  );
});
test("only a verified admin review can suspend or restore a shared AI reference", async () => {
  const f = await fixture();
  const report = await f.h.invoke(
    corrections.reportProblem,
    {
      conversationId: f.conversationId,
      currentMessage: "This is the wrong number",
      referenceId: "published-paralegal:fixture-a",
      category: "wrong_contact",
    },
    f.owner,
  );
  await assert.rejects(
    f.h.invoke(
      corrections.review,
      {
        id: report.id,
        decision: "suspend",
        note: "Checked the published correction",
      },
      f.admin,
    ),
    /verification source/,
  );
  await f.h.invoke(
    corrections.review,
    {
      id: report.id,
      decision: "suspend",
      note: "Verified against the corrected publisher contact page.",
      evidenceUrl: "https://lsftz.org/legal-help",
    },
    f.admin,
  );
  assert.deepEqual(await f.h.invoke(corrections.getGlobalExclusions), [
    "published-paralegal:fixture-a",
    "phone:255600000001",
  ]);
  const otherChat = await f.h.db.insert("sara_conversations", {
    userId: (await f.h.db.get(f.other)).clerkId,
    title: "Other",
    updatedAt: Date.now(),
  });
  const state = await f.h.invoke(
    corrections.getState,
    { conversationId: otherChat },
    f.other,
  );
  assert.ok(state.excludedIds.includes("published-paralegal:fixture-a"));
});
test("a pending report never enables cross-channel social access or processing without consent", async () => {
  const f = await fixture();
  const cid = await f.h.db.insert("social_conversations", {
    channel: "whatsapp",
    account: "office",
    sender: "fixture",
    humanMode: false,
    consent: false,
    updatedAt: Date.now(),
  });
  const mid = await f.h.db.insert("social_messages", {
    channel: "whatsapp",
    account: "office",
    sender: "fixture",
    eventId: "event",
    text: "Wrong number",
    sentAt: Date.now(),
    status: "drafting",
  });
  await assert.rejects(
    f.h.invoke(corrections.getState, { socialMessageId: mid }),
    /consent/,
  );
  await f.h.db.patch(cid, { consent: true });
  const state = await f.h.invoke(corrections.getState, {
    socialMessageId: mid,
  });
  assert.equal(state.references.length, 0);
});
test("an admin can identify a source behind an answer, suspend it, then restore after verification", async () => {
  const f = await fixture();
  const r = await f.h.invoke(
    corrections.reportProblem,
    {
      conversationId: f.conversationId,
      currentMessage: "That information is incorrect",
      referenceId: "last_answer",
      category: "incorrect_guidance",
    },
    f.owner,
  );
  await assert.rejects(
    f.h.invoke(
      corrections.review,
      {
        id: r.id,
        referenceId: "guide:unrelated",
        decision: "suspend",
        note: "Verified source mismatch with publisher.",
        evidenceUrl: "https://example.org/source",
      },
      f.admin,
    ),
    /source from this reported answer/,
  );
  await f.h.invoke(
    corrections.review,
    {
      id: r.id,
      referenceId: "guide:fixture-guide",
      decision: "suspend",
      note: "Verified source mismatch with publisher.",
      evidenceUrl: "https://example.org/source",
    },
    f.admin,
  );
  assert.deepEqual(await f.h.invoke(corrections.getGlobalExclusions), [
    "guide:fixture-guide",
  ]);
  await f.h.invoke(
    corrections.review,
    {
      id: r.id,
      decision: "corrected",
      note: "The original source has now been corrected and checked.",
      evidenceUrl: "https://example.org/source",
    },
    f.admin,
  );
  assert.deepEqual(await f.h.invoke(corrections.getGlobalExclusions), []);
});
test("hypothetical errors and descriptions of a wrongful dismissal do not file feedback", async () => {
  const f = await fixture();
  for (const message of [
    "What if the number is wrong?",
    "I need help about wrongful dismissal",
    "Kama namba sio sahihi nifanyeje?",
    "My certificate has information that is wrong",
  ])
    assert.deepEqual(
      await f.h.invoke(
        corrections.captureFeedback,
        { conversationId: f.conversationId, currentMessage: message },
        f.owner,
      ),
      { recorded: false },
    );
});
test("Kiswahili feedback and subsequent clarification bind to a shown source only", async () => {
  const f = await fixture();
  await f.h.invoke(
    corrections.captureFeedback,
    { conversationId: f.conversationId, currentMessage: "Namba sio sahihi" },
    f.owner,
  );
  await assert.rejects(
    f.h.invoke(
      corrections.reportProblem,
      {
        conversationId: f.conversationId,
        currentMessage: "Ndiyo",
        referenceId: "published-paralegal:fixture-a",
        category: "wrong_contact",
      },
      f.owner,
    ),
    /Clarify/,
  );
  await f.h.invoke(
    corrections.reportProblem,
    {
      conversationId: f.conversationId,
      currentMessage: "Fictional A",
      referenceId: "published-paralegal:fixture-a",
      category: "wrong_contact",
    },
    f.owner,
  );
  const state = await f.h.invoke(
    corrections.getState,
    { conversationId: f.conversationId },
    f.owner,
  );
  assert.ok(state.excludedIds.includes("published-paralegal:fixture-a"));
});
test("only confirmed DM delivery records references as actually shown", async () => {
  const f = await fixture();
  const social = loadHandlerModule("convex/socialMessaging.ts");
  await f.h.db.insert("social_conversations", {
    channel: "whatsapp",
    account: "office",
    sender: "delivery-fixture",
    humanMode: false,
    consent: true,
    updatedAt: Date.now(),
  });
  const m = await f.h.db.insert("social_messages", {
    channel: "whatsapp",
    account: "office",
    sender: "delivery-fixture",
    eventId: "delivery",
    text: "A test",
    sentAt: Date.now(),
    status: "sending",
    automatic: true,
    aiReferences: [
      { id: "service:sent", title: "Fictional office", kind: "directory" },
    ],
  });
  const before = (await f.h.db.query("ai_reference_exposures").collect())
    .length;
  await f.h.invoke(social.finishSend, { id: m });
  assert.equal(
    (await f.h.db.query("ai_reference_exposures").collect()).length,
    before,
  );
  await f.h.db.patch(m, { status: "sending" });
  await f.h.invoke(social.finishSend, {
    id: m,
    outboundId: "confirmed-test-outbound",
  });
  assert.ok(
    (await f.h.db.query("ai_reference_exposures").collect()).some(
      (x) => x.referenceId === "service:sent",
    ),
  );
});
test("common Kiswahili feedback distinguishes an unreachable phone from wrong information without treating confusion as a factual correction", () => {
  const { correctionCategory } = loadHandlerModule(
    "convex/lib/aiCorrections.ts",
  );
  assert.equal(correctionCategory("Namba hiyo haipatikani"), "unavailable");
  assert.equal(correctionCategory("Namba hiyo sio yake"), "wrong_contact");
  assert.equal(correctionCategory("Hiyo sio kweli"), "incorrect_guidance");
  assert.equal(correctionCategory("Ofisi imehama"), "wrong_location");
  assert.equal(correctionCategory("Sijakuelewa, nielezee tena"), undefined);
});
