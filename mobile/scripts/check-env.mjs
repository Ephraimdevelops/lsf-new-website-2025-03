import fs from "node:fs";
import path from "node:path";

const localEnvPath = path.resolve(".env.local");
const parentEnvPath = path.resolve("..", ".env.local");

function readEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return Object.fromEntries(
    fs.readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1).replace(/^['"]|['"]$/g, "")];
      }),
  );
}

const local = readEnv(localEnvPath);
const parent = readEnv(parentEnvPath);

const values = {
  convexUrl: local.EXPO_PUBLIC_CONVEX_URL || parent.EXPO_PUBLIC_CONVEX_URL || parent.VITE_CONVEX_URL || "",
  clerkPublishableKey: local.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || parent.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
  easProjectId: local.EXPO_PUBLIC_EAS_PROJECT_ID || parent.EXPO_PUBLIC_EAS_PROJECT_ID || "",
};

const checks = [
  {
    name: "EXPO_PUBLIC_CONVEX_URL",
    ok: /^https:\/\/.+\.convex\.cloud$/.test(values.convexUrl),
    required: true,
    help: "Set the Convex deployment URL used by the mobile app.",
  },
  {
    name: "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
    ok: /^pk_(test|live)_/.test(values.clerkPublishableKey),
    required: false,
    help: "Optional for browsing; required for sign-in, personal requests and staff work.",
  },
  {
    name: "EXPO_PUBLIC_EAS_PROJECT_ID",
    ok: values.easProjectId.length > 0,
    required: false,
    help: "Required for Expo push token project scoping and release builds.",
  },
];

if (values.clerkPublishableKey.startsWith("pk_live_")) {
  console.warn("WARNING: pk_live_ cannot authenticate on localhost Expo web. Use the matching pk_test_ key for local web QA; keep the live key in release/EAS environment configuration.");
}

let failed = false;
for (const check of checks) {
  const status = check.ok ? "set" : check.required ? "missing" : "missing_optional";
  console.log(`${check.name}: ${status}`);
  if (!check.ok) console.log(`  ${check.help}`);
  if (check.required && !check.ok) failed = true;
}

if (failed) {
  console.error("Mobile environment is not ready for QR/device sign-in testing.");
  process.exit(1);
}

console.log(values.clerkPublishableKey ? "Mobile environment is ready for sign-in testing." : "Mobile environment is ready for public browsing; sign-in is unavailable until Clerk is configured.");
