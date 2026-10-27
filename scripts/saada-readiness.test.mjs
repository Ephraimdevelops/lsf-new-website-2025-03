import test from "node:test";
import assert from "node:assert/strict";
import {
  harness,
  loadHandlerModule,
} from "./test-support/convex-handler-harness.mjs";
const sara = loadHandlerModule("convex/sara.ts");
const assistance = loadHandlerModule("convex/lib/saadaAssistance.ts");
test('app-help routing excludes legal questions and respects explicit language requests',()=>{
 assert.equal(assistance.isAppHelpQuestion('What can you help me do in this app? Please answer in English.'),true);
 assert.equal(assistance.isAppHelpQuestion('Nawezaje kutumia programu hii?'),true);
 assert.equal(assistance.isAppHelpQuestion('How do I use this app to evict a tenant?'),false);
 assert.equal(assistance.isAppHelpQuestion('What can you do about my unpaid wages?'),false);
 assert.equal(assistance.responseLocale('Please answer in English.','sw'),'en');
 assert.equal(assistance.responseLocale('Jibu kwa Kiswahili.','en'),'sw');
 assert.equal(assistance.responseLocale('Help me with rent','en'),'en');
});
test("staff readiness exposes aggregate counts without source bodies, profiles or conversations", async () => {
  const h = harness(),
    u = await h.user("admin");
  await h.db.insert("documents", {
    text: "PRIVATE_BODY",
    indexingStatus: "failed",
    approvalStatus: "pending",
  });
  await h.db.insert("legal_guides", {
    status: "pending",
    titleEn: "PRIVATE_TITLE",
  });
  await h.db.insert("saada_research_pdfs", {
    archived: false,
    provenance: "PRIVATE_PROVENANCE",
  });
  await h.db.insert("directory_research", {
    archived: false,
    phone: "PRIVATE_PHONE",
  });
  const data = await h.invoke(sara.getReadiness, {}, u);
  assert.equal(data.failedSourceDocuments, 1);
  assert.equal(data.approvedCurrentSourceDocuments, 0);
  assert.equal(data.pendingGuides, 1);
  assert.equal(data.privatePdfOriginals, 1);
  assert.doesNotMatch(
    JSON.stringify(data),
    /PRIVATE_|phone|text|profile|conversation/,
  );
  await assert.rejects(h.invoke(sara.getReadiness), /Unauthorized/);
  const user = await h.user();
  await assert.rejects(h.invoke(sara.getReadiness, {}, user), /Forbidden/);
});
test("publisher contact fallback keeps provenance and never invents intake or a provider match", () => {
  const content = assistance.publishedSupportText("en", undefined, "Kinondoni");
  assert.match(content, /Kinondoni Legal Aid Clinic/);
  assert.match(content, /published|Published/);
  assert.match(content, /not a matched individual paralegal/);
  assert.doesNotMatch(
    assistance.publishedSupportText("en", undefined, "Karatu"),
    /Isere St/,
  );
  assert.match(
    assistance.clarificationQuestion("jurisdiction", "sw"),
    /Tanzania Bara au Zanzibar/,
  );
  assert.throws(() => assistance.clarificationQuestion("publish_source", "en"));
});
test('a model declining tools still produces a safe, useful next step',()=>{
 assert.match(assistance.assistanceFallback('Help me understand my rights as a tenant','en'),/Mainland Tanzania or Zanzibar/);
 assert.match(assistance.assistanceFallback('I am in Kinondoni connect me with a nearby paralgel','en'),/Kinondoni Legal Aid Clinic/);
 assert.match(assistance.assistanceFallback('I am in Mainland Tanzania and need tenancy help','en'),/When did this happen/);
});
test('generic provider search does not suggest issue-specific agencies without an issue',()=>{
 const content=assistance.publishedSupportText('en',undefined,'Kinondoni');
 assert.doesNotMatch(content,/Mediation and Arbitration|consumer information/);assert.match(content,/Legal and Human Rights Centre/);
});
test('organisation-name lookup can return publisher information without inventing a verified service',()=>{
 const content=assistance.publishedSupportText('en',undefined,undefined,'TAWLA');
 assert.match(content,/Tanzania Women Lawyers Association/);assert.match(content,/tawla.or.tz/);assert.doesNotMatch(content,/Mediation and Arbitration/);
});
