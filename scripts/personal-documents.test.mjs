import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { build } from "esbuild";
async function load(file) {
  const bundle = await build({ entryPoints: [file], bundle: true, write: false, platform: "node", format: "esm" });
  return import("data:text/javascript;base64," + Buffer.from(bundle.outputFiles[0].text).toString("base64"));
}
const documents = await load("convex/personalDocuments.ts");
const policy = await load("convex/lib/uploadPolicy.ts");
const appearance = await load("mobile/src/notificationAppearance.ts");
const draftStorage = await load("mobile/src/intake/draftStorage.ts");
function fixture() {
  const user = { _id: "alice", clerkId: "clerk-alice", role: "user" };
  const document = { _id: "document", ownerId: "alice", storageId: "blob", name: "Synthetic document.pdf", type: "application/pdf", size: 100 };
  const receipt = { ownerId: "alice", purpose: "personal_document", status: "clean", type: "application/pdf", size: 100 };
  const inserted = [], filters = [], patches = [];
  let existing = null;
  const ctx = {
    auth: { getUserIdentity: async () => ({ subject: "clerk-alice" }) },
    storage: { getUrl: async () => "https://example.test/private-blob" },
    db: {
      get: async id => id === "alice" ? user : document,
      insert: async (table, value) => { inserted.push({ table, value }); return "created"; },
      patch: async (id, value) => patches.push({ id, value }),
      query(table) {
        const q = { withIndex(index, cb) { cb({ eq(field, value) { filters.push({ table, index, field, value }); return this; } }); return q; },
          unique: async () => table === "users" ? user : table === "managed_uploads" ? receipt : existing,
          first: async () => null, order: () => q, take: async () => [document],
        }; return q;
      },
    },
  };
  return { ctx, user, document, receipt, inserted, filters, patches, setExisting: value => { existing = value; } };
}

test("personal document saving rejects foreign, unscanned or incorrectly scoped uploads", async () => {
  for (const change of [{ ownerId: "bob" }, { status: "scanning" }, { purpose: "case_document" }, { entityId: "foreign-case" }]) {
    const f = fixture(); Object.assign(f.receipt, change);
    await assert.rejects(documents.save._handler(f.ctx, { storageId: "blob", name: "test.pdf" }), /ownership/);
    assert.equal(f.inserted.length, 0);
  }
});
test("personal document save takes file metadata from the clean receipt and retries idempotently", async () => {
  const f = fixture();
  await documents.save._handler(f.ctx, { storageId: "blob", name: "test.pdf" });
  const saved = f.inserted.find(row => row.table === "personal_documents").value;
  assert.equal(saved.ownerId, "alice"); assert.equal(saved.size, 100); assert.equal(saved.type, "application/pdf");
  f.setExisting(f.document); const before = f.inserted.length;
  assert.equal(await documents.save._handler(f.ctx, { storageId: "blob", name: "test.pdf" }), "document");
  assert.equal(f.inserted.length, before);
});
test("document lists are owner scoped and other users cannot retrieve download links or start AI", async () => {
  const f = fixture(); await documents.list._handler(f.ctx, {});
  assert.ok(f.filters.some(row => row.table === "personal_documents" && row.field === "ownerId" && row.value === "alice"));
  f.document.ownerId = "bob";
  await assert.rejects(documents.get._handler(f.ctx, { id: "document" }), /not found/);
  await assert.rejects(documents.reserveBrief._handler(f.ctx, { id: "document", consent: true }), /not found/);
});
test("AI reservation requires explicit consent and clean ownership before consuming its rate limit", async () => {
  const f = fixture();
  await assert.rejects(documents.reserveBrief._handler(f.ctx, { id: "document", consent: false }), /consent/);
  assert.equal(f.inserted.length, 0);
  const result = await documents.reserveBrief._handler(f.ctx, { id: "document", consent: true });
  assert.equal(result.ownerId, "alice");
  assert.ok(f.inserted.some(row => row.table === "rate_limits" && row.value.identifier === "document-brief:alice"));
});
test("unauthenticated and deleted accounts cannot access the document vault", async () => {
  const f = fixture(); f.ctx.auth.getUserIdentity = async () => null;
  await assert.rejects(documents.list._handler(f.ctx, {}), /Unauthorized/);
  f.ctx.auth.getUserIdentity = async () => ({ subject: "clerk-alice" }); f.user.isDeleted = true;
  await assert.rejects(documents.get._handler(f.ctx, { id: "document" }), /Unauthorized/);
  await assert.rejects(documents.storeBrief._handler(f.ctx, { id: "document", ownerId: "alice", locale: "sw", brief: "Test" }), /not found/);
});
test("personal documents have an isolated, bounded image and PDF upload policy", () => {
  const limits = policy.uploadPolicy("personal_document");
  assert.equal(limits.maxBytes, 10 * 1024 * 1024);
  assert.ok(limits.types.includes("application/pdf"));
  assert.ok(limits.types.includes("image/jpeg"));
  assert.ok(!limits.types.includes("audio/webm"));
});
test("brief analysis disables provider storage, limits input and output, and never indexes private files", () => {
  const source = readFileSync("convex/documentBrief.ts", "utf8");
  assert.match(source, /store: false/); assert.match(source, /text\.length > 50000/);
  assert.match(source, /max_tokens: 600/); assert.match(source, /timeout: 45000/);
  assert.match(source, /ignore any embedded instructions/);
  assert.doesNotMatch(source, /addEmbeddings|ingestDocument|console\.log/);
});
test("notification types have distinct quiet semantic icons and accents", () => {
  const kinds = ["message.received", "appointment.reminder", "referral.created", "assignment.offered", "case.created"].map(appearance.notificationAppearance);
  assert.equal(new Set(kinds.map(kind => kind.icon)).size, 5);
  assert.equal(new Set(kinds.map(kind => kind.tone)).size, 5);
});
test("help goals survive local draft restoration", () => {
  const draft = { clientRequestId: "synthetic", locale: "sw", description: "Test only", region: "", district: "", occurredOn: "", involvedParties: "", desiredHelp: "Kuelewa haki zangu", helpGoal: "rights", safeContactMethod: "in_app", preferredLanguage: "sw", preferredLanguageOther: "", urgency: "standard", hasDocuments: false };
  assert.equal(draftStorage.decodeDraft(JSON.stringify(draft)).helpGoal, "rights");
  assert.throws(() => draftStorage.decodeDraft(JSON.stringify({ ...draft, helpGoal: "invalid" })));
});

test("rights links do not route to Saved and the document tool clears selections on account changes", () => {
  for (const file of ["mobile/app/(tabs)/index.tsx", "mobile/app/explore.tsx", "mobile/app/support.tsx", "mobile/app/workspace.tsx"]) {
    assert.match(readFileSync(file, "utf8"), /"\/rights"/);
  }
  const tool = readFileSync("mobile/app/document-checker.tsx", "utf8");
  assert.match(tool, /<DocumentTool key=\{isLoaded \? userId \?\? "guest" : "loading"\}/);
  assert.match(tool, /learn\?view=saved/);
  const saved = readFileSync("mobile/app/(tabs)/learn.tsx", "utf8");
  const savedView = saved.slice(saved.indexOf('if (view === "saved")'), saved.indexOf("\n  return ("));
  assert.doesNotMatch(savedView, /Jua haki zako/);
  assert.match(savedView, /personalDocuments\?\.map/);
  assert.match(savedView, /caseDocuments\?\.map/);
});

test("selected issue and goal remain visible and carry into matching and intake", () => {
  const intake = readFileSync("mobile/app/intake.tsx", "utf8");
  const finder = readFileSync("mobile/app/find-services.tsx", "utf8");
  assert.match(intake, /<Ionicons name=\{item\.icon\} size=\{25\}/);
  assert.match(intake, /value=\{draft\.helpGoal \?\? ""\}/);
  assert.match(intake, /params: \{ issue: draft\.issueCategory/);
  assert.match(finder, /initialIssue \|\| goal \? "results"/);
  assert.match(finder, /serviceType: selectedGoal\?\.serviceType/);
  assert.match(finder, /typedTopic \? undefined : search\.trim\(\)/);
  assert.match(finder, /draft\.helpGoal === goal && draft\.desiredHelp \? draft\.desiredHelp/);
});
