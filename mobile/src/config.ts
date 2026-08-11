import Constants from "expo-constants";

type AppExtra = {
  convexUrl?: string;
  clerkPublishableKey?: string;
  easProjectId?: string;
  prototypeMode?: boolean;
};

const extra = (Constants.expoConfig?.extra ?? {}) as AppExtra;

export const appConfig = {
  convexUrl: extra.convexUrl ?? "",
  clerkPublishableKey: extra.clerkPublishableKey ?? "",
  easProjectId: extra.easProjectId ?? Constants.easConfig?.projectId ?? "",
  prototypeMode: extra.prototypeMode === true,
};

const isValidConvexUrl = /^https:\/\/.+\.convex\.cloud$/.test(appConfig.convexUrl);
const isValidClerkPublishableKey = /^pk_(test|live)_/.test(appConfig.clerkPublishableKey);

export const configDiagnostics = {
  convexUrl: {
    name: "EXPO_PUBLIC_CONVEX_URL",
    ready: isValidConvexUrl,
    required: true,
    help: "Use the Convex deployment URL for this mobile environment.",
  },
  clerkPublishableKey: {
    name: "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
    ready: isValidClerkPublishableKey,
    required: true,
    help: "Use the publishable Clerk key for the matching Clerk instance.",
  },
  easProjectId: {
    name: "EXPO_PUBLIC_EAS_PROJECT_ID",
    ready: appConfig.easProjectId.length > 0,
    required: false,
    help: "Required before push/release builds; optional for local sign-in smoke tests.",
  },
};

export const requiredConfigReady =
  configDiagnostics.convexUrl.ready && configDiagnostics.clerkPublishableKey.ready;

export const missingRequiredConfig = Object.values(configDiagnostics).filter(
  (item) => item.required && !item.ready,
);
