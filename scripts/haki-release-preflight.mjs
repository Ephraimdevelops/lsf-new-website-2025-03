import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const strict = process.argv.includes("--release");

function readEnv(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file, "utf8").split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const at = line.indexOf("=");
      return [line.slice(0, at), line.slice(at + 1).replace(/^['"]|['"]$/g, "")];
    }));
}

const webEnv = readEnv(path.join(root, ".env.local"));
const mobileEnv = readEnv(path.join(root, "mobile/.env.local"));
const webConvex = process.env.VITE_CONVEX_URL || webEnv.VITE_CONVEX_URL || "";
const webClerk = process.env.VITE_CLERK_PUBLISHABLE_KEY || webEnv.VITE_CLERK_PUBLISHABLE_KEY || "";
const mobileConvex = process.env.EXPO_PUBLIC_CONVEX_URL || mobileEnv.EXPO_PUBLIC_CONVEX_URL || webConvex;
const inheritedTestClerk = webClerk.startsWith("pk_test_") ? webClerk : "";
const mobileClerk = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || mobileEnv.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || inheritedTestClerk;
const expo = JSON.parse(fs.readFileSync(path.join(root, "mobile/app.json"), "utf8")).expo;
const easId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID || mobileEnv.EXPO_PUBLIC_EAS_PROJECT_ID || expo.extra?.eas?.projectId || "";

const checks = [
  ["Shared Convex deployment", /^https:\/\/.+\.convex\.cloud$/.test(webConvex) && webConvex === mobileConvex],
  ["Shared Clerk instance", /^pk_(test|live)_/.test(webClerk) && webClerk === mobileClerk],
  ["Production Clerk key", webClerk.startsWith("pk_live_") && mobileClerk.startsWith("pk_live_")],
  ["EAS project ID", /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(easId)],
  ["iOS bundle identifier", expo.ios?.bundleIdentifier === "org.lsftz.hakiyangu"],
  ["Android package", expo.android?.package === "org.lsftz.hakiyangu"],
  ["Security and contract checks available", fs.existsSync(path.join(root, "scripts/check-convex-security.mjs")) && fs.existsSync(path.join(root, "scripts/haki-contracts.test.mjs"))],
];

console.log(`Haki Yangu ${strict ? "release" : "local"} preflight (configuration only)`);
for (const [label, passed] of checks) console.log(`${passed ? "PASS" : "OPEN"} ${label}`);
console.log("MANUAL Verified service contacts and public/private directory classification");
console.log("MANUAL Approved Tanzanian legal sources and Haki Yangu AI safety checks");
console.log("MANUAL Cross-role web, iOS, Android, offline, notification and accessibility rehearsal");
console.log("MANUAL LSF privacy, safeguarding, retention and incident-response approval");
console.log("This report does not prove deployment, runtime behavior, or release approval.");
if (strict && checks.some(([, passed]) => !passed)) process.exitCode = 1;
