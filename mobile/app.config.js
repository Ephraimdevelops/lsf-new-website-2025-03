const fs = require("node:fs");
const path = require("node:path");

function readEnvFile(filePath) {
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

module.exports = ({ config }) => {
  const production = process.env.EAS_BUILD_PROFILE === "production" || process.env.EXPO_RELEASE_CHECK === "true";
  const sharedDevelopmentEnv = production ? {} : readEnvFile(path.resolve(__dirname, "../.env.local"));
  const sharedClerkKey = sharedDevelopmentEnv.VITE_CLERK_PUBLISHABLE_KEY || "";
  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || sharedDevelopmentEnv.VITE_CONVEX_URL || "";
  const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || (sharedClerkKey.startsWith("pk_test_") ? sharedClerkKey : "") || "";
  const easProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID || config.extra?.eas?.projectId || "";
  if (production) {
    const missing = [];
    if (!/^https:\/\/[a-z0-9-]+\.convex\.cloud$/.test(convexUrl)) missing.push("EXPO_PUBLIC_CONVEX_URL");
    if (!/^pk_live_.+/.test(clerkPublishableKey)) missing.push("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY (live instance)");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(easProjectId)) missing.push("EXPO_PUBLIC_EAS_PROJECT_ID (UUID)");
    if (missing.length) throw new Error(`Production build blocked: configure ${missing.join(", ")} in the EAS production environment. Development fallback is disabled.`);
  }
  return {
    ...config,
    extra: {
      ...config.extra,
      convexUrl,
      clerkPublishableKey,
      easProjectId,
      eas: { ...config.extra?.eas, ...(easProjectId ? { projectId: easProjectId } : {}) },
      googleSsoEnabled: process.env.EXPO_PUBLIC_GOOGLE_SSO_ENABLED === "true",
      appleSsoEnabled: process.env.EXPO_PUBLIC_APPLE_SSO_ENABLED === "true",
      phoneAuthEnabled: process.env.EXPO_PUBLIC_PHONE_AUTH_ENABLED === "true",
    },
  };
};
