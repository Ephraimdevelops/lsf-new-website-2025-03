// Hosted guest-only check: no app token, identity override, model call or record write.
import fs from "node:fs";
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";
const local = fs.readFileSync(".env.local", "utf8");
const url = local
  .match(/^VITE_CONVEX_URL\s*=\s*(.+)$/m)?.[1]
  .trim()
  .replace(/^['"]|['"]$/g, "");
if (!url) throw new Error("Configured development URL missing.");
const client = new ConvexHttpClient(url);
const report = {
  checkedAt: new Date().toISOString(),
  environment: "configured development backend",
  identity: "guest_no_token",
  checks: [],
  modelCallsPerformed: 0,
  recordWritesPerformed: 0,
};
try {
  await client.action(anyApi.sara_actions.ask, {
    message: "Guest authorization smoke test",
    locale: "en",
  });
  report.checks.push({
    name: "Guest cannot invoke Saada agent",
    passed: false,
  });
} catch (error) {
  report.checks.push({
    name: "Guest cannot invoke Saada agent",
    passed: /Unauthenticated call to Sara AI Action/.test(String(error)),
  });
}
fs.writeFileSync(
  "docs/haki-yangu/saada-agent-live-check-2026-10-15.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
if (report.checks.some((check) => !check.passed)) process.exitCode = 1;
