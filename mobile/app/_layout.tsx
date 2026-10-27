import { useNotificationNavigation } from "../src/useNotificationNavigation";
import { BrandLoading } from '../src/components/BrandLoading';
import { LanguagePreferenceSync } from "../src/components/LanguagePreferenceSync";
import { useFonts } from "expo-font";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { appConfig, clerkReady, configDiagnostics, missingRequiredConfig, requiredConfigReady } from "../src/config";
import { IntakeDraftProvider } from "../src/intake/IntakeDraftContext";
import { LanguageProvider, useLanguage } from "../src/i18n";
import { colors, spacing, type } from "../src/theme";
import { AccountSyncProvider, useAccountSync } from "../src/useStoreUserEffect";
import { usePushNotificationRegistration } from "../src/usePushNotifications";
import { useSafeSignOut } from "../src/useSafeSignOut";

const tokenCache = {
  async getToken(key: string) {
    if (!isValidSecureStoreKey(key)) return null;
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    if (!isValidSecureStoreKey(key)) return;
    try {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch {
      // Auth can still recover by requiring the user to sign in again.
    }
  },
};

function isValidSecureStoreKey(key: string) {
  return /^[A-Za-z0-9._-]+$/.test(key);
}

function Navigation() {
  const { locale } = useLanguage();
  return (
    <AccountSyncProvider><IntakeDraftProvider initialLocale={locale}><AccountPushRegistration /><LanguagePreferenceSync />
      <Stack screenLayout={accountScreenLayout} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="sign-in" options={{ presentation: "modal" }} />
        <Stack.Screen name="join" />
        <Stack.Screen name="auth-complete" />
        <Stack.Screen name="sso-callback" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="intake" />
        <Stack.Screen name="case/[id]" />
        <Stack.Screen name="case-outcome/[id]" />
        <Stack.Screen name="case-review/[id]" />
        <Stack.Screen name="case-follow-up/[id]" />
        <Stack.Screen name="referral/[id]" />
        <Stack.Screen name="provider-referrals" />
        <Stack.Screen name="provider-referral/[id]" />
        <Stack.Screen name="referral-oversight" />
        <Stack.Screen name="referral-oversight/[id]" />
        <Stack.Screen name="request/[id]" />
        <Stack.Screen name="safety" />
        <Stack.Screen name="find-services" />
        <Stack.Screen name="nearby-help" />
        <Stack.Screen name="compare-services" />
        <Stack.Screen name="saved-services" />
        <Stack.Screen name="service/[id]" />
        <Stack.Screen name="service-visit" />
        <Stack.Screen name="paralegals" />
        <Stack.Screen name="paralegal-profile" />
        <Stack.Screen name="documents" />
        <Stack.Screen name="document/[id]" />
        <Stack.Screen name="appointments" />
        <Stack.Screen name="appointment/[id]" />
        <Stack.Screen name="resource/[id]" />
        <Stack.Screen name="legal-guide/[id]" />
        <Stack.Screen name="editorial-workspace" />
        <Stack.Screen name="base-role-management" />
        <Stack.Screen name="legal-guide-review/[id]" />
        <Stack.Screen name="letter-builder" />
        <Stack.Screen name="document-checker" />
        <Stack.Screen name="sara" />
        <Stack.Screen name="review" />
        <Stack.Screen name="offline" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="notification-settings" />
        <Stack.Screen name="privacy-security" />
        <Stack.Screen name="support" />
        <Stack.Screen name="about" />
        <Stack.Screen name="font-license" />
        <Stack.Screen name="workspace" />
        <Stack.Screen name="operations" />
        <Stack.Screen name="supervision" />
        <Stack.Screen name="matching-review" />
        <Stack.Screen name="partner-performance" />
        <Stack.Screen name="operations-request/[id]" />
        <Stack.Screen name="case-matching/[id]" />
        <Stack.Screen name="closure-review/[id]" />
        <Stack.Screen name="safeguarding" />
        <Stack.Screen name="safeguarding-review/[id]" />
        <Stack.Screen name="governance" />
        <Stack.Screen name="access-management" />
        <Stack.Screen name="legacy-case-access" />
        <Stack.Screen name="saada-governance" />
        <Stack.Screen name="saada-evaluations" />
        <Stack.Screen name="saada-source/[id]" />
        <Stack.Screen name="saada-policy/[id]" />
        <Stack.Screen name="saada-risk/[id]" />
        <Stack.Screen name="saada-risk-queue" />
        <Stack.Screen name="access-request/[id]" />
        <Stack.Screen name="paralegal-application/[id]" />
        <Stack.Screen name="directory-management" />
        <Stack.Screen name="directory-organisation-form" />
        <Stack.Screen name="directory-service-form" />
        <Stack.Screen name="directory-correction/[id]" />
        <Stack.Screen name="directory-service/[id]" />
        <Stack.Screen name="directory-organisation/[id]" />
        <Stack.Screen name="audit-log" />
        <Stack.Screen name="reporting" />
        <Stack.Screen name="paralegal-onboarding" />
        <Stack.Screen name="paralegal-learning" />
        <Stack.Screen name="training-management" />
        <Stack.Screen name="paralegal-wellbeing" />
        <Stack.Screen name="paralegal-tasks" />
        <Stack.Screen name="paralegal-assignments" />
        <Stack.Screen name="assignment/[id]" />
        <Stack.Screen name="paralegal-availability" />
        <Stack.Screen name="task/[id]" />
        <Stack.Screen name="my-organisation" />
        <Stack.Screen name="paralegal-performance" />
        <Stack.Screen name="paralegal-support" />
        <Stack.Screen name="paralegal-support-request/[id]" />
      </Stack>
    </IntakeDraftProvider></AccountSyncProvider>
  );
}

// Keep the navigator mounted during account sync so cold links retain their route.
// Gate screen content instead; authenticated queries still wait for account readiness.
function accountScreenLayout({ children }: { children: React.ReactNode }) {
  return <AccountSyncGuard>{children}</AccountSyncGuard>;
}

function AccountPushRegistration() {
  const { isSignedIn } = useAuth();
  const { ready } = useAccountSync();
  return <PushRegistration enabled={Boolean(isSignedIn && ready)} />;
}

function AccountSyncGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const safeSignOut = useSafeSignOut();
  const [signOutError, setSignOutError] = useState(false);
  const { locale } = useLanguage();
  const { status, ready, retry } = useAccountSync();
  if (!isSignedIn || ready) return <>{children}</>;
  if (status !== "error") return <BrandLoading task="account" locale={locale} fullScreen/>;
  return <View style={styles.center}>
    <View style={styles.configPanel}>
      <Text style={styles.errorTitle}>{locale === "sw" ? "Akaunti haijaunganishwa" : "Account connection failed"}</Text>
      <Text style={styles.errorBody}>{locale === "sw" ? "Angalia intaneti yako, kisha ujaribu tena. Tatizo likiendelea, wasiliana na LSF." : "Check your internet connection, then retry. If the problem continues, contact LSF."}</Text>
      {status === "error" ? <View style={{ gap: spacing.md }}>
        <Pressable accessibilityRole="button" onPress={retry}><Text style={styles.syncText}>{locale === "sw" ? "Jaribu tena" : "Retry connection"}</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={() => void safeSignOut().catch(() => setSignOutError(true))}><Text style={styles.syncText}>{locale === "sw" ? "Ondoka" : "Sign out"}</Text></Pressable>
        {signOutError ? <Text style={styles.errorBody}>{locale === "sw" ? "Hatukuweza kuzima arifa za kifaa hiki. Unganisha mtandao na ujaribu tena kabla ya kutoka." : "We could not disable alerts for this device. Reconnect and retry before signing out."}</Text> : null}
      </View> : null}
    </View>
  </View>;
}

function PushRegistration({ enabled }: { enabled: boolean }) {
  usePushNotificationRegistration(enabled);
  useNotificationNavigation(enabled);
  return null;
}

function ConfigurationRequired() {
  const checks = Object.values(configDiagnostics);
  const missingRequiredNames = missingRequiredConfig.map((item) => item.name).join(", ");

  return (
    <View style={styles.center}>
      <View style={styles.configPanel}>
        <Text style={styles.errorTitle}>Configuration required</Text>
        <Text style={styles.errorBody}>
          Set the public mobile environment values before testing Haki Yangu on a device.
        </Text>
        <View style={styles.configList}>
          {checks.map((check) => (
            <View key={check.name} style={styles.configRow}>
              <View style={styles.configCopy}>
                <Text style={styles.configName}>{check.name}</Text>
                <Text style={styles.configHelp}>{check.help}</Text>
              </View>
              <Text style={[styles.configStatus, check.ready ? styles.configReady : styles.configMissing]}>
                {check.ready ? "set" : check.required ? "missing" : "optional"}
              </Text>
            </View>
          ))}
        </View>
        {missingRequiredNames ? (
          <Text style={styles.configCommand}>Missing required: {missingRequiredNames}</Text>
        ) : null}
        <Text style={styles.configCommand}>Run: cd mobile && npm run env:check</Text>
      </View>
    </View>
  );
}

function Providers() {
  const convex = useMemo(
    () => requiredConfigReady ? new ConvexReactClient(appConfig.convexUrl) : null,
    [],
  );

  if (!requiredConfigReady || !convex) {
    return <ConfigurationRequired />;
  }

  const navigation = (
    <LanguageProvider fallback={<BrandLoading task="app" fullScreen/>}>
      <Navigation />
    </LanguageProvider>
  );

  if (!clerkReady) {
    return <ConvexProvider client={convex}>{navigation}</ConvexProvider>;
  }

  return (
    <ClerkProvider publishableKey={appConfig.clerkPublishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {navigation}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Onest-Regular": require("../assets/fonts/Onest-Regular.ttf"),
    "Onest-Medium": require("../assets/fonts/Onest-Medium.ttf"),
    "Onest-SemiBold": require("../assets/fonts/Onest-SemiBold.ttf"),
    "Onest-Bold": require("../assets/fonts/Onest-Bold.ttf"),
  });
  if (!fontsLoaded) {
    return <BrandLoading task="app" fullScreen/>;
  }
  return <SafeAreaProvider><Providers /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl, backgroundColor: colors.background },
  errorTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 22, marginBottom: spacing.sm },
  errorBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, textAlign: "center", lineHeight: 22 },
  configPanel: { width: "100%", maxWidth: 430, borderRadius: 28, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, shadowColor: colors.charcoal, shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 16 }, elevation: 3 },
  configList: { gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.md },
  configRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, borderRadius: 18, backgroundColor: colors.softPink, padding: spacing.md },
  configCopy: { flex: 1, gap: 4 },
  configName: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 13 },
  configHelp: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  configStatus: { overflow: "hidden", borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 5, fontFamily: type.bold, fontWeight: "700", fontSize: 13 },
  configReady: { backgroundColor: colors.tealSoft, color: colors.teal },
  configMissing: { backgroundColor: colors.peach, color: colors.burgundy },
  configCommand: { fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, lineHeight: 18, textAlign: "center" },
  syncText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, marginTop: spacing.md },
});
