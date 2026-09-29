import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { useSSO } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { BrandMark } from "../src/components/BrandMark";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useAuth, useSignIn, useSignUp } from "../src/auth";
import { clerkReady } from "../src/config";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

WebBrowser.maybeCompleteAuthSession();

type AuthMode = "signIn" | "signUp" | "reset";

export default function SignInScreen() {
  if (!clerkReady) return <AuthUnavailable />;
  return <ConfiguredSignInScreen />;
}

function AuthUnavailable() {
  const { locale } = useLanguage();
  return <Screen>
    <View style={{ paddingTop: spacing.xxl, gap: spacing.md }}>
      <Ionicons name="person-circle-outline" size={54} color={colors.burgundy} />
      <Text style={{ fontFamily: type.bold, color: colors.ink, fontSize: 25 }}>
        {locale === "sw" ? "Akaunti bado haijaunganishwa" : "Account sign-in is not configured"}
      </Text>
      <Text style={{ fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 23 }}>
        {locale === "sw" ? "Unaweza kuendelea kuona skrini za umma. Kutuma ombi, kuhifadhi taarifa au kufungua kesi binafsi kunahitaji huduma ya akaunti kuunganishwa." : "You can continue browsing public screens. Sending a request, saving information or opening a private case requires the account service to be connected."}
      </Text>
      <Button label={locale === "sw" ? "Rudi kwenye programu" : "Back to the app"} onPress={() => router.replace("/(tabs)")} />
    </View>
  </Screen>;
}

function ConfiguredSignInScreen() {
  const { returnTo, serviceId } = useLocalSearchParams<{ returnTo?: string; serviceId?: string }>();
  const { locale } = useLanguage();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { startSSOFlow } = useSSO();
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingReset, setPendingReset] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function returnAfterAuth() {
    if (serviceId && returnTo === "service") router.replace({ pathname: "/service/[id]", params: { id: serviceId } });
    else if (serviceId && returnTo === "service-visit") router.replace({ pathname: "/service-visit", params: { serviceId } });
    else if (returnTo === "saved-services") router.replace("/saved-services");
    else if (returnTo === "intake") router.replace("/intake");
    else if (returnTo === "sara") router.replace("/sara");
    else router.replace("/(tabs)");
  }

  async function submit() {
    if (!email.trim()) {
      Alert.alert(locale === "sw" ? "Jaza taarifa" : "Add details", locale === "sw" ? "Weka barua pepe yako." : "Enter your email address.");
      return;
    }
    if (mode !== "reset" && !password.trim()) {
      Alert.alert(locale === "sw" ? "Jaza taarifa" : "Add details", locale === "sw" ? "Weka neno siri." : "Enter your password.");
      return;
    }
    if (mode === "signUp" && pendingVerification && !code.trim()) {
      Alert.alert(locale === "sw" ? "Weka msimbo" : "Enter the code", locale === "sw" ? "Weka msimbo uliotumwa kwenye barua pepe." : "Enter the verification code sent to your email.");
      return;
    }
    if (mode === "reset" && pendingReset && (!code.trim() || !password.trim())) {
      Alert.alert(locale === "sw" ? "Weka taarifa" : "Add details", locale === "sw" ? "Weka msimbo na neno siri jipya." : "Enter the code and your new password.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signIn") {
        if (!signInLoaded) return;
        const attempt = await signIn.create({ identifier: email.trim(), password });
        if (attempt.status === "complete") {
          await setSignInActive({ session: attempt.createdSessionId });
          returnAfterAuth();
          return;
        }
        Alert.alert(locale === "sw" ? "Hatua ya ziada inahitajika" : "More steps needed", locale === "sw" ? "Fuata hatua za ziada za usalama kwenye akaunti yako." : "Complete the extra account security step.");
        return;
      }

      if (mode === "reset") {
        if (!signInLoaded) return;
        if (!pendingReset) {
          await signIn.create({ strategy: "reset_password_email_code", identifier: email.trim() });
          setPendingReset(true);
          Alert.alert(locale === "sw" ? "Angalia barua pepe" : "Check your email", locale === "sw" ? "Tumeutuma msimbo wa kurejesha akaunti." : "We sent a password reset code.");
          return;
        }
        const attempt = await signIn.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code: code.trim(),
          password,
        });
        if (attempt.status === "complete") {
          await setSignInActive({ session: attempt.createdSessionId });
          returnAfterAuth();
          return;
        }
        Alert.alert(locale === "sw" ? "Haijakamilika" : "Not complete", locale === "sw" ? "Fuata hatua za ziada za usalama kwenye akaunti yako." : "Complete the extra account security step.");
        return;
      }

      if (!signUpLoaded) return;
      if (!pendingVerification) {
        await signUp.create({ emailAddress: email.trim(), password });
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setPendingVerification(true);
        Alert.alert(locale === "sw" ? "Angalia barua pepe" : "Check your email", locale === "sw" ? "Tumeanza uthibitisho. Weka msimbo hapa." : "Verification started. Enter the code here.");
        return;
      }

      const attempt = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (attempt.status === "complete") {
        await setSignUpActive({ session: attempt.createdSessionId });
        router.replace("/join");
        return;
      }
      Alert.alert(locale === "sw" ? "Uthibitisho haujakamilika" : "Verification incomplete", locale === "sw" ? "Jaribu tena au omba msimbo mpya." : "Try again or request a new code.");
    } catch (error) {
      Alert.alert(locale === "sw" ? "Haikuwezekana kuingia" : "Authentication failed", error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function socialSignIn(provider: "google" | "apple") {
    setSubmitting(true);
    try {
      const configuredScheme = Constants.expoConfig?.scheme;
      const appScheme = typeof configuredScheme === "string" ? configuredScheme : Array.isArray(configuredScheme) ? configuredScheme[0] : "hakiyangu";
      const result = await startSSOFlow({
        strategy: provider === "google" ? "oauth_google" : "oauth_apple",
        redirectUrl: Linking.createURL("sso-callback", {
          scheme: appScheme,
        }),
      });
      if (result.createdSessionId && result.setActive) {
        await result.setActive({ session: result.createdSessionId });
        if (mode === "signUp") router.replace("/join"); else returnAfterAuth();
      } else if (result.authSessionResult?.type !== "cancel") {
        Alert.alert(locale === "sw" ? "Hatua ya ziada" : "More steps required", locale === "sw" ? "Kamilisha uthibitisho wa akaunti yako." : "Complete the additional account verification step.");
      }
    } catch (error) {
      Alert.alert(locale === "sw" ? "Kuingia hakukufaulu" : "Social sign-in failed", error instanceof Error ? error.message : String(error));
    } finally { setSubmitting(false); }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setPendingVerification(false);
    setPendingReset(false);
    setCode("");
  }

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      if (mode === "signUp") router.replace("/join"); else returnAfterAuth();
    }
  }, [authLoaded, isSignedIn, mode, returnTo, serviceId]);

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={colors.charcoal} />
          </Pressable>
          <BrandMark />
        </View>
        <View style={styles.panel}>
          <View style={styles.welcomeBand}><View style={styles.icon}><Ionicons name="shield-checkmark-outline" size={34} color={colors.surface} /></View><Text style={styles.welcomeKicker}>HAKI YANGU · LSF</Text></View>
          <Text style={styles.title}>
            {mode === "signIn"
              ? (locale === "sw" ? "Ingia salama" : "Secure sign in")
              : mode === "signUp"
                ? (locale === "sw" ? "Fungua akaunti" : "Create account")
                : (locale === "sw" ? "Rejesha akaunti" : "Recover account")}
          </Text>
          <Text style={styles.body}>
            {locale === "sw"
              ? "Akaunti inalinda kesi, nyaraka, miadi na ujumbe wako. Wageni wanaweza kusoma rasilimali za umma pekee."
              : "Your account protects cases, documents, appointments, and messages. Guests can only use public resources."}
          </Text>
          <View style={styles.sharedAccount}><Ionicons name="people-outline" size={18} color={colors.teal} /><Text style={styles.sharedAccountText}>{locale === "sw" ? "Mnufaika, paralegal, mdau au mfanyakazi: tumia barua pepe na neno siri lile lile la tovuti." : "Beneficiary, paralegal, stakeholder, or staff: use the same email and password as the website."}</Text></View>
          <View style={styles.segment}>
            <Pressable style={[styles.segmentButton, mode === "signIn" && styles.segmentButtonActive]} onPress={() => switchMode("signIn")}>
              <Text style={[styles.segmentText, mode === "signIn" && styles.segmentTextActive]}>{locale === "sw" ? "Ingia" : "Sign in"}</Text>
            </Pressable>
            <Pressable style={[styles.segmentButton, mode === "signUp" && styles.segmentButtonActive]} onPress={() => switchMode("signUp")}>
              <Text style={[styles.segmentText, mode === "signUp" && styles.segmentTextActive]}>{locale === "sw" ? "Jisajili" : "Sign up"}</Text>
            </Pressable>
          </View>
          <Field label={locale === "sw" ? "Barua pepe" : "Email"} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="asha@example.com" />
          {mode !== "reset" || pendingReset ? (
            <Field label={mode === "reset" ? (locale === "sw" ? "Neno siri jipya" : "New password") : (locale === "sw" ? "Neno siri" : "Password")} value={password} onChangeText={setPassword} secureTextEntry placeholder="********" />
          ) : null}
          {mode === "signUp" && pendingVerification ? (
            <Field label={locale === "sw" ? "Msimbo wa uthibitisho" : "Verification code"} value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="123456" />
          ) : null}
          {mode === "reset" && pendingReset ? (
            <Field label={locale === "sw" ? "Msimbo wa kurejesha" : "Recovery code"} value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="123456" />
          ) : null}
          <Button
            label={submitting
              ? (locale === "sw" ? "Tafadhali subiri..." : "Please wait...")
              : mode === "signIn"
                ? (locale === "sw" ? "Ingia" : "Sign in")
                : mode === "reset"
                  ? pendingReset
                    ? (locale === "sw" ? "Weka neno siri jipya" : "Set new password")
                    : (locale === "sw" ? "Tuma msimbo" : "Send recovery code")
                  : pendingVerification
                    ? (locale === "sw" ? "Thibitisha akaunti" : "Verify account")
                    : (locale === "sw" ? "Unda akaunti" : "Create account")}
            loading={submitting}
            disabled={submitting || !signInLoaded || !signUpLoaded}
            onPress={() => void submit()}
          />
          {mode !== "reset" ? <View style={styles.socialGroup}>
            <Text style={styles.socialDivider}>{locale === "sw" ? "AU ENDELEA KWA" : "OR CONTINUE WITH"}</Text>
            <Pressable accessibilityRole="button" disabled={submitting} style={styles.socialButton} onPress={() => void socialSignIn("google")}><Ionicons name="logo-google" size={19} color={colors.burgundy} /><Text style={styles.socialText}>Google</Text></Pressable>
            {Platform.OS === "ios" && <Pressable accessibilityRole="button" disabled={submitting} style={styles.socialButton} onPress={() => void socialSignIn("apple")}><Ionicons name="logo-apple" size={19} color={colors.burgundy} /><Text style={styles.socialText}>Apple</Text></Pressable>}
          </View> : null}
          <Pressable accessibilityRole="button" onPress={() => switchMode(mode === "reset" ? "signIn" : "reset")}>
            <Text style={styles.recoveryText}>
              {mode === "reset"
                ? (locale === "sw" ? "Rudi kuingia" : "Back to sign in")
                : (locale === "sw" ? "Umesahau neno siri? Rejesha akaunti" : "Forgot password? Recover account")}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={colors.inkMuted}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        autoCapitalize={props.autoCapitalize}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  panel: { marginTop: spacing.xl, borderRadius: 28, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl, gap: spacing.lg, shadowColor: colors.charcoal, shadowOpacity: 0.08, shadowRadius: 22, shadowOffset: { width: 0, height: 14 }, elevation: 3 },
  welcomeBand: { minHeight: 94, marginHorizontal: -spacing.xl, marginTop: -spacing.xl, marginBottom: spacing.sm, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: spacing.xl, flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.burgundy },
  welcomeKicker: { fontFamily: type.bold, fontWeight: "700", color: colors.peach, fontSize: 13, letterSpacing: 1 },
  icon: { width: 54, height: 54, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" },
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 29, letterSpacing: -0.7 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  sharedAccount: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, borderRadius: radius.md, backgroundColor: colors.tealSoft, padding: spacing.md },
  sharedAccountText: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, lineHeight: 19 },
  segment: { flexDirection: "row", backgroundColor: colors.softPink, borderRadius: radius.pill, padding: 4 },
  segmentButton: { flex: 1, minHeight: 42, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  segmentButtonActive: { backgroundColor: colors.burgundy },
  segmentText: { fontFamily: type.bold, fontWeight: "700", color: colors.inkMuted, fontSize: 13 },
  segmentTextActive: { color: colors.surface },
  field: { gap: spacing.xs },
  label: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 13 },
  input: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFCFD", paddingHorizontal: spacing.md, fontFamily: type.regular, color: colors.charcoal, fontSize: 15 },
  socialGroup: { gap: spacing.sm },
  socialDivider: { textAlign: "center", color: colors.inkMuted, fontSize: 11, fontFamily: type.bold, letterSpacing: 1.2 },
  socialButton: { minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.sm },
  socialText: { color: colors.ink, fontFamily: type.bold, fontSize: 15 },
  recoveryText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 18, textAlign: "center" },
});
