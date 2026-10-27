import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const deployment = "joyous-spaniel-5";
function run(name, args, identity) {
  const flags = ["convex", "run", name, JSON.stringify(args), "--deployment-name", deployment];
  if (identity) flags.push("--identity", JSON.stringify({ subject: identity }));
  return JSON.parse(execFileSync("npx", flags, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 90000 }));
}
function syntheticPdf() {
  const content = "BT /F1 12 Tf 30 750 Td (Synthetic training receipt. No personal data. Sample payment: TZS 100. This is not a real legal document.) Tj ET";
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${content.length} >>\nstream\n${content}\nendstream`];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) { offsets.push(Buffer.byteLength(pdf)); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; }
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => String(offset).padStart(10, "0") + " 00000 n \n").join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}
const fixture = run("uploadRehearsal:seed", {});
try {
  const upload = fixture.uploads.find(item => item.purpose === "personal_document");
  assert.ok(upload && fixture.ownerClerkId && fixture.otherClerkId);
  const response = await fetch(upload.url, { method: "POST", headers: { "Content-Type": "application/pdf" }, body: syntheticPdf(), signal: AbortSignal.timeout(150000) });
  assert.ok(response.ok, `Synthetic upload failed: ${response.status}`);
  const { storageId } = await response.json();
  const id = run("personalDocuments:save", { storageId, name: "Synthetic training receipt.pdf" }, fixture.ownerClerkId);
  assert.equal(run("personalDocuments:save", { storageId, name: "Synthetic training receipt.pdf" }, fixture.ownerClerkId), id);
  assert.ok(run("personalDocuments:list", {}, fixture.ownerClerkId).some(item => item._id === id));
  assert.ok(run("personalDocuments:get", { id }, fixture.ownerClerkId).url);
  assert.throws(() => run("personalDocuments:get", { id }, fixture.otherClerkId));
  assert.throws(() => run("documentBrief:summarize", { id, locale: "sw", consent: false }, fixture.ownerClerkId));
  const checks = ["scanned upload", "idempotent private save", "owner list/open", "cross-owner denial", "AI consent denial"];
  if (!process.argv.includes("--skip-ai")) {
    const brief = run("documentBrief:summarize", { id, locale: "sw", consent: true }, fixture.ownerClerkId);
    assert.ok(typeof brief === "string" && brief.length > 30 && brief.length <= 5000);
    const saved = run("personalDocuments:get", { id }, fixture.ownerClerkId);
    assert.equal(saved.brief, brief); assert.equal(saved.briefLocale, "sw");
    checks.push("live Kiswahili AI brief", "persisted brief");
  }
  console.log(JSON.stringify({ passed: true, checks, aiSkipped: process.argv.includes("--skip-ai"), scope: "Named development only, synthetic receipt; no personal data or production changes." }));
} finally {
  run("uploadRehearsal:cleanup", { users: [fixture.ownerId, fixture.otherOwnerId] });
}
