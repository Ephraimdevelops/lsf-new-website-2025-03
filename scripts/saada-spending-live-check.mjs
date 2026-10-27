// Read-only guest checks; no app identity or model invocation.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";
const url = fs
  .readFileSync(".env.local", "utf8")
  .match(/^VITE_CONVEX_URL\s*=\s*(.+)$/m)?.[1]
  .trim()
  .replace(/^['"]|['"]$/g, "");
const client = new ConvexHttpClient(url);
const report = {
  checkedAt: new Date().toISOString(),
  environment: "configured development backend",
  modelCalls: 0,
  recordWrites: 0,
  checks: [],
};
try {
  await client.query(anyApi.aiUsage.status, {});
  report.checks.push({
    name: "Private cost status rejects guests",
    passed: false,
  });
} catch (error) {
  report.checks.push({
    name: "Private cost status rejects guests",
    passed: /Unauthorized|Forbidden/.test(String(error)),
  });
}
try {
  await client.action(anyApi.sara_actions.ask, {
    message: "Guest authorization check",
    locale: "en",
  });
  report.checks.push({
    name: "Agent rejects guests before paid calls",
    passed: false,
  });
} catch (error) {
  report.checks.push({
    name: "Agent rejects guests before paid calls",
    passed: /Unauthenticated call/.test(String(error)),
  });
}
let configured = "";
try {
  configured = execFileSync(
    "npx",
    ["convex", "env", "get", "SAADA_MONTHLY_BUDGET_USD"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 60000 },
  ).trim();
} catch {}
report.monthlyDollarLimitConfigured =
  /^\d+(\.\d{1,2})?$/.test(configured) && Number(configured) > 0;
fs.writeFileSync(
  "docs/haki-yangu/saada-spending-live-check-2026-10-16.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
if (report.checks.some((check) => !check.passed)) process.exitCode = 1;
