import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { BrandMark } from "../src/components/BrandMark";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useAuth, useSignIn, useSignUp } from "../src/auth";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

type AuthMode = "signIn" | "signUp";

export default function SignInScreen() {
  const { locale } = useLanguage();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert(locale === "sw" ? "Jaza taarifa" : "Add details", locale === "sw" ? "Weka barua pepe na neno siri." : "Enter your email and password.");
      return;
    }
    if (mode === "signUp" && pendingVerification && !code.trim()) {
      Alert.alert(locale === "sw" ? "Weka msimbo" : "Enter the code", locale === "sw" ? "Weka msimbo uliotumwa kwenye barua pepe." : "Enter the verification code sent to your email.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signIn") {
        if (!signInLoaded) return;
        const attempt = await signIn.create({ identifier: email.trim(), password });
        if (attempt.status === "complete") {
          await setSignInActive({ session: attempt.createdSessionId });
          router.replace("/(tabs)");
          return;
        }
        Alert.alert(locale === "sw" ? "Hatua ya ziada inahitajika" : "More steps needed", locale === "sw" ? "Fuata hatua za ziada za usalama kwenye akaunti yako." : "Complete the extra account security step.");
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
        router.replace("/(tabs)");
        return;
      }
      Alert.alert(locale === "sw" ? "Uthibitisho haujakamilika" : "Verification incomplete", locale === "sw" ? "Jaribu tena au omba msimbo mpya." : "Try again or request a new code.");
    } catch (error) {
      Alert.alert(locale === "sw" ? "Haikuwezekana kuingia" : "Authentication failed", error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setPendingVerification(false);
    setCode("");
  }

  useEffect(() => {
    if (authLoaded && isSignedIn) router.replace("/(tabs)");
  }, [authLoaded, isSignedIn]);

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
          <View style={styles.icon}>
            <Ionicons name="shield-checkmark-outline" size={40} color={colors.burgundy} />
          </View>
          <Text style={styles.title}>{mode === "signIn" ? (locale === "sw" ? "Ingia salama" : "Secure sign in") : (locale === "sw" ? "Fungua akaunti" : "Create account")}</Text>
          <Text style={styles.body}>
            {locale === "sw"
              ? "Akaunti inalinda kesi, nyaraka, miadi na ujumbe wako. Wageni wanaweza kusoma rasilimali za umma pekee."
              : "Your account protects cases, documents, appointments, and messages. Guests can only use public resources."}
          </Text>
          <View style={styles.segment}>
            <Pressable style={[styles.segmentButton, mode === "signIn" && styles.segmentButtonActive]} onPress={() => switchMode("signIn")}>
              <Text style={[styles.segmentText, mode === "signIn" && styles.segmentTextActive]}>{locale === "sw" ? "Ingia" : "Sign in"}</Text>
            </Pressable>
            <Pressable style={[styles.segmentButton, mode === "signUp" && styles.segmentButtonActive]} onPress={() => switchMode("signUp")}>
              <Text style={[styles.segmentText, mode === "signUp" && styles.segmentTextActive]}>{locale === "sw" ? "Jisajili" : "Sign up"}</Text>
            </Pressable>
          </View>
          <Field label={locale === "sw" ? "Barua pepe" : "Email"} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="asha@example.com" />
          <Field label={locale === "sw" ? "Neno siri" : "Password"} value={password} onChangeText={setPassword} secureTextEntry placeholder="********" />
          {mode === "signUp" && pendingVerification ? (
            <Field label={locale === "sw" ? "Msimbo wa uthibitisho" : "Verification code"} value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="123456" />
          ) : null}
          <Button
            label={submitting ? (locale === "sw" ? "Tafadhali subiri..." : "Please wait...") : mode === "signIn" ? (locale === "sw" ? "Ingia" : "Sign in") : pendingVerification ? (locale === "sw" ? "Thibitisha akaunti" : "Verify account") : (locale === "sw" ? "Unda akaunti" : "Create account")}
            loading={submitting}
            disabled={submitting || !signInLoaded || !signUpLoaded}
            onPress={() => void submit()}
          />
          <Text style={styles.recoveryText}>
            {locale === "sw"
              ? "Kurejesha akaunti na MFA zinategemea mipangilio ya Clerk Native Applications."
              : "Account recovery and MFA depend on Clerk Native Applications being enabled."}
          </Text>
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
  panel: { marginTop: 52, borderRadius: 28, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl, gap: spacing.lg, shadowColor: colors.charcoal, shadowOpacity: 0.08, shadowRadius: 22, shadowOffset: { width: 0, height: 14 }, elevation: 3 },
  icon: { width: 78, height: 78, borderRadius: 39, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 29, letterSpacing: -0.7 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  segment: { flexDirection: "row", backgroundColor: colors.softPink, borderRadius: radius.pill, padding: 4 },
  segmentButton: { flex: 1, minHeight: 42, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  segmentButtonActive: { backgroundColor: colors.burgundy },
  segmentText: { fontFamily: type.bold, color: colors.inkMuted, fontSize: 13 },
  segmentTextActive: { color: colors.surface },
  field: { gap: spacing.xs },
  label: { fontFamily: type.bold, color: colors.charcoal, fontSize: 12 },
  input: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFCFD", paddingHorizontal: spacing.md, fontFamily: type.regular, color: colors.charcoal, fontSize: 15 },
  recoveryText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18, textAlign: "center" },
});
