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
  const sharedDevelopmentEnv = readEnvFile(path.resolve(__dirname, "../.env.local"));
  const sharedClerkKey = sharedDevelopmentEnv.VITE_CLERK_PUBLISHABLE_KEY || "";
  return {
    ...config,
    extra: {
      ...config.extra,
      convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL || sharedDevelopmentEnv.VITE_CONVEX_URL || "",
      prototypeMode: process.env.EXPO_PUBLIC_PROTOTYPE_MODE === "1",
      clerkPublishableKey:
        process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
        (sharedClerkKey.startsWith("pk_test_") ? sharedClerkKey : "") ||
        "",
      easProjectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || config.extra?.eas?.projectId || "",
    },
  };
};
