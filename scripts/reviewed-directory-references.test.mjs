import test from "node:test";
import assert from "node:assert/strict";
import {
  harness,
  loadHandlerModule,
} from "./test-support/convex-handler-harness.mjs";
const research = loadHandlerModule("convex/directoryResearch.ts");
async function setup(kind = "pathway", title = "Fictional preparation") {
  const h = harness(),
    admin = await h.user("admin"),
    staff = await h.user("staff");
  const id = await h.db.insert("directory_research", {
    externalKey: "fixture-only",
    kind,
    title,
    notes: "Private draft notes",
    originalRecord: '{"private":"provenance"}',
    sourceUrls: ["https://example.org/source"],
    archived: false,
    createdBy: staff,
    updatedBy: staff,
    updatedAt: Date.now(),
  });
  const args = {
    id,
    scope: kind === "pathway" ? "preparation" : "published_contact",
    titleEn: "Fictional preparation checklist",
    titleSw: "Orodha ya maandalizi ya mfano",
    bodyEn: "Prepare a safe factual account, with available documents only.",
    bodySw: "Andaa maelezo yaliyo salama, pamoja na nyaraka ulizo nazo tu.",
    sourceUrls: ["https://example.org/source"],
    note: "Reviewed optional preparation only, not legal rules.",
    reviewDueAt: Date.now() + 86400000,
  };
  return { h, admin, staff, id, args };
}
test("only admins may publish bounded research references; raw provenance and review identities remain private", async () => {
  const f = await setup();
  await assert.rejects(
    f.h.invoke(research.reviewPublicReference, f.args, f.staff),
    /Forbidden/,
  );
  await assert.rejects(
    f.h.invoke(research.reviewPublicReference, f.args),
    /Unauthorized/,
  );
  await f.h.invoke(research.reviewPublicReference, f.args, f.admin);
  const result = await f.h.invoke(research.searchPublicReferences, {
    search: "preparation",
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].scope, "preparation");
  for (const key of [
    "originalRecord",
    "notes",
    "reviewedBy",
    "createdBy",
    "note",
  ])
    assert.equal(key in result[0], false);
  assert.equal(
    (await f.h.db.get(f.id)).originalRecord,
    '{"private":"provenance"}',
  );
});
test("approval cannot recast a pathway as a verified contact or leak a shelter address", async () => {
  const f = await setup();
  await assert.rejects(
    f.h.invoke(
      research.reviewPublicReference,
      { ...f.args, scope: "published_contact" },
      f.admin,
    ),
    /Pathways/,
  );
  await assert.rejects(
    f.h.invoke(
      research.reviewPublicReference,
      { ...f.args, phone: "+255600000001" },
      f.admin,
    ),
    /separate checked record/,
  );
  await assert.rejects(
    f.h.invoke(
      research.reviewPublicReference,
      { ...f.args, sourceUrls: ["http://example.org/"] },
      f.admin,
    ),
    /HTTPS/,
  );
  const shelter = await setup("centre", "Fictional shelter programme lead");
  await assert.rejects(
    shelter.h.invoke(
      research.reviewPublicReference,
      { ...shelter.args, address: "A private shelter location" },
      shelter.admin,
    ),
    /safe public referral/,
  );
});
test("expired, archived, withdrawn and globally suspended references never enter public searches", async () => {
  const f = await setup();
  await f.h.invoke(research.reviewPublicReference, f.args, f.admin);
  await f.h.db.insert("ai_reference_reviews", {
    referenceId: "research:" + f.id,
    suspended: true,
  });
  assert.deepEqual(await f.h.invoke(research.searchPublicReferences, {}), []);
  const review = (await f.h.db.query("ai_reference_reviews").collect())[0];
  await f.h.db.patch(review._id, { suspended: false });
  await f.h.db.patch(f.id, { archived: true });
  assert.deepEqual(await f.h.invoke(research.searchPublicReferences, {}), []);
  await f.h.db.patch(f.id, {
    archived: false,
    publicReference: {
      ...(await f.h.db.get(f.id)).publicReference,
      reviewDueAt: Date.now() - 1,
    },
  });
  assert.deepEqual(await f.h.invoke(research.searchPublicReferences, {}), []);
  await f.h.invoke(research.reviewPublicReference, f.args, f.admin);
  await f.h.invoke(
    research.withdrawPublicReference,
    { id: f.id, reason: "Publisher corrections require a fresh review." },
    f.admin,
  );
  assert.deepEqual(await f.h.invoke(research.searchPublicReferences, {}), []);
});
test("editing private research revokes the prior public reference until it is reviewed again", async () => {
  const f = await setup();
  await f.h.invoke(research.reviewPublicReference, f.args, f.admin);
  const row = await f.h.db.get(f.id);
  await f.h.invoke(
    research.update,
    {
      id: f.id,
      externalKey: row.externalKey,
      kind: row.kind,
      title: row.title,
      notes: "Changed contact observations",
      originalRecord: row.originalRecord,
      sourceUrls: row.sourceUrls,
    },
    f.staff,
  );
  assert.equal((await f.h.db.get(f.id)).publicReference, undefined);
  assert.deepEqual(await f.h.invoke(research.searchPublicReferences, {}), []);
});
test("issue matching uses whole words and prefers the topic title over generic Mainland text", async () => {
  const f = await setup();
  await f.h.invoke(
    research.reviewPublicReference,
    {
      ...f.args,
      titleEn: "Inheritance preparation checklist",
      bodyEn: "This preparation concerns Mainland Tanzania only.",
    },
    f.admin,
  );
  assert.deepEqual(
    await f.h.invoke(research.searchPublicReferences, { search: "land" }),
    [],
  );
  const other = await f.h.db.insert("directory_research", {
    externalKey: "land-fixture",
    kind: "pathway",
    title: "Land boundary",
    notes: "Private",
    originalRecord: "{}",
    sourceUrls: ["https://example.org/source"],
    archived: false,
    createdBy: f.staff,
    updatedBy: f.staff,
    updatedAt: Date.now(),
  });
  await f.h.invoke(
    research.reviewPublicReference,
    { ...f.args, id: other, titleEn: "Land boundary preparation checklist" },
    f.admin,
  );
  const result = await f.h.invoke(research.searchPublicReferences, {
    search: "land",
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "research:" + other);
  assert.deepEqual(
    await f.h.invoke(research.searchPublicReferences, {
      search: "land",
      excludedIds: ["research:" + other],
    }),
    [],
  );
});
