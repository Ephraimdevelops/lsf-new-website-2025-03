import Constants from "expo-constants";
import { Platform } from "react-native";

type AppExtra = {
  convexUrl?: string;
  clerkPublishableKey?: string;
  easProjectId?: string;
  googleSsoEnabled?: boolean;
  appleSsoEnabled?: boolean;
  phoneAuthEnabled?: boolean;
};

const extra = (Constants.expoConfig?.extra ?? {}) as AppExtra;

export const appConfig = {
  convexUrl: extra.convexUrl ?? "",
  clerkPublishableKey: extra.clerkPublishableKey ?? "",
  easProjectId: extra.easProjectId ?? Constants.easConfig?.projectId ?? "",
  googleSsoEnabled: extra.googleSsoEnabled === true,
  appleSsoEnabled: extra.appleSsoEnabled === true,
  phoneAuthEnabled: extra.phoneAuthEnabled === true,
};

const isValidConvexUrl = /^https:\/\/.+\.convex\.cloud$/.test(appConfig.convexUrl);
const isValidClerkPublishableKey = /^pk_(test|live)_/.test(appConfig.clerkPublishableKey);
const isUnsupportedLocalWebClerkKey = __DEV__ && Platform.OS === "web" && appConfig.clerkPublishableKey.startsWith("pk_live_");

export const configDiagnostics = {
  convexUrl: {
    name: "EXPO_PUBLIC_CONVEX_URL",
    ready: isValidConvexUrl,
    required: true,
    help: "Use the Convex deployment URL for this mobile environment.",
  },
  clerkPublishableKey: {
    name: "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
    ready: isValidClerkPublishableKey && !isUnsupportedLocalWebClerkKey,
    required: false,
    help: isUnsupportedLocalWebClerkKey
      ? "Guest browsing works on local Expo web. Sign-in requires the matching Clerk development key (pk_test_)."
      : "Optional for browsing; sign-in requires the matching Clerk publishable key.",
  },
  easProjectId: {
    name: "EXPO_PUBLIC_EAS_PROJECT_ID",
    ready: appConfig.easProjectId.length > 0,
    required: false,
    help: "Required before push/release builds; optional for local sign-in smoke tests.",
  },
};

export const requiredConfigReady =
  configDiagnostics.convexUrl.ready;

export const clerkReady = configDiagnostics.clerkPublishableKey.ready;

export const missingRequiredConfig = Object.values(configDiagnostics).filter(
  (item) => item.name === "EXPO_PUBLIC_CONVEX_URL" && !item.ready,
);
