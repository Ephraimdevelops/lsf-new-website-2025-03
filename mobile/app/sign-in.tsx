import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { useSSO } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { BrandMark } from "../src/components/BrandMark";
import { AuthVisual } from "../src/components/AuthVisual";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useAuth, useSignIn, useSignUp } from "../src/auth";
import { appConfig, clerkReady } from "../src/config";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

WebBrowser.maybeCompleteAuthSession();

type AuthMode = "signIn" | "signUp" | "reset";
type IdentifierMethod = "email" | "phone";
type SecondFactor = "totp" | "phone_code" | "email_code" | "backup_code";

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
  const [identifierMethod, setIdentifierMethod] = useState<IdentifierMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingReset, setPendingReset] = useState(false);
  const [secondFactor, setSecondFactor] = useState<SecondFactor | null>(null);
  const [factorOptions, setFactorOptions] = useState<SecondFactor[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = setTimeout(() => setResendSeconds((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendSeconds]);

  async function chooseSecondFactor(attempt: NonNullable<typeof signIn>, strategy: SecondFactor) {
    const factor = attempt.supportedSecondFactors?.find((item) => item.strategy === strategy);
    if (!factor) throw new Error("This account requires a security method not supported in the app. Please sign in on the website or contact LSF support.");
    if (factor.strategy === "phone_code") await attempt.prepareSecondFactor({ strategy: "phone_code", phoneNumberId: factor.phoneNumberId });
    if (factor.strategy === "email_code") await attempt.prepareSecondFactor({ strategy: "email_code", emailAddressId: factor.emailAddressId });
    setSecondFactor(strategy);
    setCode("");
    setResendSeconds(strategy === "phone_code" || strategy === "email_code" ? 30 : 0);
  }
  async function startSecondFactor(attempt: NonNullable<typeof signIn>) {
    const options = (attempt.supportedSecondFactors ?? []).map((item) => item.strategy).filter((strategy): strategy is SecondFactor => ["totp", "phone_code", "email_code", "backup_code"].includes(strategy));
    if (!options.length) throw new Error("This account requires a security method not supported in the app. Please sign in on the website or contact LSF support.");
    setFactorOptions(options);
    await chooseSecondFactor(attempt, options[0]);
  }

  function returnAfterAuth() {
    if (serviceId && returnTo === "service") router.replace({ pathname: "/service/[id]", params: { id: serviceId } });
    else if (serviceId && returnTo === "service-visit") router.replace({ pathname: "/service-visit", params: { serviceId } });
    else if (returnTo === "saved-services") router.replace("/saved-services");
    else if (returnTo === "intake") router.replace("/intake");
    else if (returnTo === "sara") router.replace("/sara");
    else router.replace("/(tabs)");
  }

  async function submit() {
    const identifier = identifierMethod === "phone" ? phone.trim() : email.trim();
    setErrorMessage("");
    if (!secondFactor && (!identifier || identifierMethod === "phone" && !/^\+[1-9]\d{7,14}$/.test(identifier) || identifierMethod === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier))) {
      setErrorMessage(identifierMethod === "phone" ? (locale === "sw" ? "Weka namba kamili pamoja na msimbo wa nchi, kwa mfano +255..." : "Enter the full number with country code, for example +255...") : (locale === "sw" ? "Weka barua pepe sahihi." : "Enter a valid email address."));
      return;
    }
    if (!secondFactor && (mode === "signIn" || mode === "signUp" && !pendingVerification || mode === "reset" && pendingReset) && !password) {
      setErrorMessage(locale === "sw" ? "Weka neno siri." : "Enter your password.");
      return;
    }
    if (mode === "signUp" && pendingVerification && !code.trim()) {
      setErrorMessage(locale === "sw" ? "Weka msimbo wa tarakimu sita." : "Enter the six-digit verification code.");
      return;
    }
    if (mode === "reset" && pendingReset && (!code.trim() || !password.trim())) {
      setErrorMessage(locale === "sw" ? "Weka msimbo na neno siri jipya." : "Enter the code and your new password.");
      return;
    }
    setSubmitting(true);
    try {
      if (secondFactor) {
        if (!code.trim()) throw new Error("Enter your security code.");
        if (!signInLoaded) return;
        const attempt = await signIn.attemptSecondFactor({ strategy: secondFactor, code: code.trim() });
        if (attempt.status !== "complete") throw new Error("Additional account verification is still required.");
        await setSignInActive({ session: attempt.createdSessionId });
        returnAfterAuth();
        return;
      }
      if (mode === "signIn") {
        if (!signInLoaded) return;
        const attempt = await signIn.create({ identifier, password });
        if (attempt.status === "complete") {
          await setSignInActive({ session: attempt.createdSessionId });
          returnAfterAuth();
          return;
        }
        if (attempt.status === "needs_second_factor") { await startSecondFactor(attempt); return; }
        Alert.alert(locale === "sw" ? "Hatua ya ziada inahitajika" : "More steps needed", locale === "sw" ? "Fuata hatua za ziada za usalama kwenye akaunti yako." : "Complete the extra account security step.");
        return;
      }

      if (mode === "reset") {
        if (!signInLoaded) return;
        if (!pendingReset) {
          await signIn.create({ strategy: identifierMethod === "phone" ? "reset_password_phone_code" : "reset_password_email_code", identifier });
          setPendingReset(true);
          setResendSeconds(30);
          return;
        }
        const attempt = await signIn.attemptFirstFactor({
          strategy: identifierMethod === "phone" ? "reset_password_phone_code" : "reset_password_email_code",
          code: code.trim(),
          password,
        });
        if (attempt.status === "complete") {
          await setSignInActive({ session: attempt.createdSessionId });
          returnAfterAuth();
          return;
        }
        if (attempt.status === "needs_second_factor") { await startSecondFactor(attempt); return; }
        Alert.alert(locale === "sw" ? "Haijakamilika" : "Not complete", locale === "sw" ? "Fuata hatua za ziada za usalama kwenye akaunti yako." : "Complete the extra account security step.");
        return;
      }

      if (!signUpLoaded) return;
      if (!pendingVerification) {
        if (identifierMethod === "phone") {
          await signUp.create({ phoneNumber: identifier, password });
          await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });
        } else {
          await signUp.create({ emailAddress: identifier, password });
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        }
        setPendingVerification(true);
        setResendSeconds(30);
        return;
      }

      const attempt = identifierMethod === "phone"
        ? await signUp.attemptPhoneNumberVerification({ code: code.trim() })
        : await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (attempt.status === "complete") {
        await setSignUpActive({ session: attempt.createdSessionId });
        router.replace("/join");
        return;
      }
      setErrorMessage(locale === "sw" ? "Uthibitisho haujakamilika. Angalia msimbo na ujaribu tena." : "Verification is incomplete. Check the code and try again.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
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

  async function resendCode() {
    if (submitting || resendSeconds > 0) return;
    setSubmitting(true);
    try {
      if (secondFactor === "phone_code" || secondFactor === "email_code") {
        if (!signIn) throw new Error("Start sign-in again to request a new code.");
        await chooseSecondFactor(signIn, secondFactor);
      } else if (mode === "signUp" && pendingVerification) {
        if (!signUp) throw new Error("Start sign-up again to request a new code.");
        if (identifierMethod === "phone") await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });
        else await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      } else if (mode === "reset" && pendingReset) {
        if (!signIn) throw new Error("Start recovery again to request a new code.");
        await signIn.create({ strategy: identifierMethod === "phone" ? "reset_password_phone_code" : "reset_password_email_code", identifier: identifierMethod === "phone" ? phone.trim() : email.trim() });
      } else return;
      setResendSeconds(30);
      setErrorMessage("");
    } catch (error) {
      Alert.alert(locale === "sw" ? "Msimbo haukutumwa" : "Code not sent", error instanceof Error ? error.message : String(error));
    } finally { setSubmitting(false); }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setPendingVerification(false);
    setPendingReset(false);
    setSecondFactor(null);
    setFactorOptions([]);
    setCode("");
    setErrorMessage("");
    setResendSeconds(0);
  }

  function switchIdentifierMethod(nextMethod: IdentifierMethod) {
    setIdentifierMethod(nextMethod);
    setPendingVerification(false);
    setSecondFactor(null);
    setCode("");
    setErrorMessage("");
    setResendSeconds(0);
  }

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      if (mode === "signUp") router.replace("/join"); else returnAfterAuth();
    }
  }, [authLoaded, isSignedIn, mode, returnTo, serviceId]);

  const isCodeStep = !!secondFactor || mode === "signUp" && pendingVerification || mode === "reset" && pendingReset;
  const isRecovery = mode === "reset";
  const contact = identifierMethod === "phone" ? phone.trim() : email.trim();
  const title = secondFactor ? (locale === "sw" ? "Thibitisha kuingia" : "Verify sign in")
    : mode === "signUp" && pendingVerification ? (locale === "sw" ? "Thibitisha akaunti yako" : "Verify your account")
    : mode === "reset" && pendingReset ? (locale === "sw" ? "Weka neno siri jipya" : "Set a new password")
    : mode === "reset" ? (locale === "sw" ? "Rejesha akaunti" : "Recover your account")
    : mode === "signUp" ? (locale === "sw" ? "Tengeneza akaunti" : "Create your account")
    : (locale === "sw" ? "Karibu tena" : "Welcome back");
  const description = isCodeStep
    ? secondFactor === "totp" ? (locale === "sw" ? "Weka msimbo kutoka kwenye programu yako ya usalama." : "Enter the code from your authenticator app.")
    : secondFactor === "backup_code" ? (locale === "sw" ? "Weka msimbo wako wa akiba." : "Enter one of your backup codes.")
    : (locale === "sw" ? `Weka msimbo wa tarakimu sita uliotumwa kwa ${contact || "akaunti yako"}.` : `Enter the six-digit code sent to ${contact || "your account"}.`)
    : isRecovery ? (locale === "sw" ? "Weka barua pepe yako tupate kukutumia msimbo wa kurejesha." : "Enter your email to receive a recovery code.")
    : mode === "signUp" ? (locale === "sw" ? "Tumia barua pepe na neno siri. Tutakuuliza jina na jukumu baadaye." : "Start with email and a password. Name and role come next.")
    : (locale === "sw" ? "Ingia na akaunti ile ile unayotumia kwenye tovuti." : "Use the same account you use on the website.");

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Go back"} onPress={() => isCodeStep ? switchMode(mode) : isRecovery ? switchMode("signIn") : router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={25} color={colors.charcoal} />
          </Pressable>
          <BrandMark size="large" />
          <View style={styles.backButton} />
        </View>
        {mode === "signUp" && !secondFactor ? <View style={styles.progress}><View style={styles.progressActive} /><View style={[styles.progressBar, pendingVerification && styles.progressActive]} /><View style={styles.progressBar} /></View> : null}
        {isCodeStep || isRecovery ? <AuthVisual variant={isRecovery ? "recover" : "verify"} /> : <View style={styles.brandSymbol}><Ionicons name="shield-checkmark-outline" size={31} color={colors.surface} /></View>}
        <Text style={styles.kicker}>HAKI YANGU · LSF</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{description}</Text>

        {!isCodeStep && !isRecovery ? <View style={styles.segment}>
          <Pressable accessibilityRole="tab" accessibilityState={{ selected: mode === "signIn" }} style={[styles.segmentButton, mode === "signIn" && styles.segmentButtonActive]} onPress={() => switchMode("signIn")}><Text style={[styles.segmentText, mode === "signIn" && styles.segmentTextActive]}>{locale === "sw" ? "Ingia" : "Sign in"}</Text></Pressable>
          <Pressable accessibilityRole="tab" accessibilityState={{ selected: mode === "signUp" }} style={[styles.segmentButton, mode === "signUp" && styles.segmentButtonActive]} onPress={() => switchMode("signUp")}><Text style={[styles.segmentText, mode === "signUp" && styles.segmentTextActive]}>{locale === "sw" ? "Jisajili" : "Sign up"}</Text></Pressable>
        </View> : null}
        {!isCodeStep && appConfig.phoneAuthEnabled ? <View style={styles.methodSegment}>
          <Pressable accessibilityRole="tab" accessibilityState={{ selected: identifierMethod === "email" }} style={[styles.methodButton, identifierMethod === "email" && styles.methodButtonActive]} onPress={() => switchIdentifierMethod("email")}><Ionicons name="mail-outline" size={18} color={identifierMethod === "email" ? colors.burgundy : colors.inkMuted} /><Text style={[styles.methodText, identifierMethod === "email" && styles.methodTextActive]}>{locale === "sw" ? "Barua pepe" : "Email"}</Text></Pressable>
          <Pressable accessibilityRole="tab" accessibilityState={{ selected: identifierMethod === "phone" }} style={[styles.methodButton, identifierMethod === "phone" && styles.methodButtonActive]} onPress={() => switchIdentifierMethod("phone")}><Ionicons name="call-outline" size={18} color={identifierMethod === "phone" ? colors.burgundy : colors.inkMuted} /><Text style={[styles.methodText, identifierMethod === "phone" && styles.methodTextActive]}>{locale === "sw" ? "Simu" : "Phone"}</Text></Pressable>
        </View> : null}

        {!isCodeStep && (identifierMethod === "email" ? <Field label={locale === "sw" ? "Barua pepe" : "Email address"} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="asha@example.com" icon="mail-outline" /> : <Field label={locale === "sw" ? "Namba ya simu" : "Phone number"} value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoCapitalize="none" placeholder="+255712345678" icon="call-outline" />)}
        {!isCodeStep && !isRecovery ? <Field label={locale === "sw" ? "Neno siri" : "Password"} value={password} onChangeText={setPassword} secureTextEntry placeholder={locale === "sw" ? "Weka neno siri" : "Enter your password"} icon="lock-closed-outline" /> : null}
        {isCodeStep ? <Field label={secondFactor === "backup_code" ? (locale === "sw" ? "Msimbo wa akiba" : "Backup code") : (locale === "sw" ? "Msimbo wa uthibitisho" : "Verification code")} value={code} onChangeText={setCode} keyboardType={secondFactor === "backup_code" ? "default" : "number-pad"} placeholder="••••••" icon="keypad-outline" maxLength={secondFactor === "backup_code" ? undefined : 6} oneTimeCode /> : null}
        {mode === "reset" && pendingReset && !secondFactor ? <Field label={locale === "sw" ? "Neno siri jipya" : "New password"} value={password} onChangeText={setPassword} secureTextEntry placeholder={locale === "sw" ? "Weka neno siri jipya" : "Enter a new password"} icon="lock-closed-outline" /> : null}
        {mode === "signUp" && !pendingVerification ? <Text style={styles.helper}>{locale === "sw" ? "Tumia angalau herufi 8 kwa neno siri imara." : "Use at least 8 characters for a strong password."}</Text> : null}
        {isCodeStep && (secondFactor === "email_code" || secondFactor === "phone_code" || !secondFactor) ? <View style={styles.resendPanel}><Ionicons name="time-outline" size={22} color={colors.teal} /><Text style={styles.resendCopy}>{resendSeconds > 0 ? (locale === "sw" ? `Unaweza kutuma tena baada ya sekunde ${resendSeconds}.` : `You can resend in ${resendSeconds} seconds.`) : (locale === "sw" ? "Msimbo haujafika?" : "Didn't receive the code?")}</Text></View> : null}
        {secondFactor && factorOptions.length > 1 ? <View style={styles.factorList}>{factorOptions.map((factor) => <Pressable key={factor} accessibilityRole="button" disabled={submitting} onPress={() => { if (signIn) void chooseSecondFactor(signIn, factor).catch((error) => setErrorMessage(error instanceof Error ? error.message : String(error))); }} style={[styles.factorButton, factor === secondFactor && styles.factorSelected]}><Text style={styles.factorText}>{factor.replaceAll("_", " ")}</Text></Pressable>)}</View> : null}
        {errorMessage ? <View style={styles.errorPanel} accessibilityRole="alert"><Ionicons name="information-circle-outline" size={20} color={colors.danger} /><Text style={styles.errorText}>{errorMessage}</Text></View> : null}

        <Button label={secondFactor ? (locale === "sw" ? "Thibitisha" : "Verify") : mode === "signIn" ? (locale === "sw" ? "Ingia" : "Sign in") : mode === "reset" ? pendingReset ? (locale === "sw" ? "Weka neno siri jipya" : "Set new password") : (locale === "sw" ? "Tuma msimbo" : "Send recovery code") : pendingVerification ? (locale === "sw" ? "Thibitisha" : "Verify account") : (locale === "sw" ? "Tengeneza akaunti" : "Create account")} loading={submitting} disabled={submitting || !signInLoaded || !signUpLoaded} onPress={() => void submit()} style={styles.primaryButton} />
        {isCodeStep && (secondFactor === "email_code" || secondFactor === "phone_code" || !secondFactor) ? <View style={styles.codeActions}><Pressable accessibilityRole="button" disabled={resendSeconds > 0 || submitting} onPress={() => void resendCode()}><Text style={[styles.link, resendSeconds > 0 && styles.linkDisabled]}>{locale === "sw" ? "Tuma tena" : "Resend code"}</Text></Pressable><Text style={styles.actionDivider}>|</Text><Pressable accessibilityRole="button" onPress={() => secondFactor ? switchMode("signIn") : switchMode(mode)}><Text style={styles.link}>{locale === "sw" ? "Badilisha anuani" : "Change address"}</Text></Pressable></View> : null}
        {!isCodeStep && mode === "signIn" ? <Pressable accessibilityRole="button" onPress={() => switchMode("reset")}><Text style={styles.linkCenter}>{locale === "sw" ? "Umesahau neno siri?" : "Forgot password?"}</Text></Pressable> : null}
        {!isCodeStep && mode === "reset" ? <Pressable accessibilityRole="button" onPress={() => switchMode("signIn")}><Text style={styles.linkCenter}>{locale === "sw" ? "Rudi kuingia" : "Back to sign in"}</Text></Pressable> : null}
        {!isCodeStep && mode !== "reset" && (appConfig.googleSsoEnabled || Platform.OS === "ios" && appConfig.appleSsoEnabled) ? <View style={styles.socialGroup}><Text style={styles.socialDivider}>{locale === "sw" ? "AU" : "OR"}</Text>{appConfig.googleSsoEnabled ? <Pressable accessibilityRole="button" disabled={submitting} style={styles.socialButton} onPress={() => void socialSignIn("google")}><Ionicons name="logo-google" size={20} color={colors.burgundy} /><Text style={styles.socialText}>{locale === "sw" ? "Endelea kwa Google" : "Continue with Google"}</Text></Pressable> : null}{Platform.OS === "ios" && appConfig.appleSsoEnabled ? <Pressable accessibilityRole="button" disabled={submitting} style={styles.socialButton} onPress={() => void socialSignIn("apple")}><Ionicons name="logo-apple" size={20} color={colors.ink} /><Text style={styles.socialText}>{locale === "sw" ? "Endelea kwa Apple" : "Continue with Apple"}</Text></Pressable> : null}</View> : null}
        {!isCodeStep && mode !== "reset" ? <View style={styles.trustNote}><Ionicons name="shield-checkmark-outline" size={21} color={colors.teal} /><Text style={styles.trustText}>{locale === "sw" ? "Akaunti moja salama kwa tovuti na app ya Haki Yangu." : "One secure account for the Haki Yangu website and app."}</Text></View> : null}
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
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  maxLength?: number;
  oneTimeCode?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.inputFrame}>{props.icon ? <Ionicons name={props.icon} size={21} color={colors.inkMuted} /> : null}<TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={colors.inkMuted}
        secureTextEntry={props.secureTextEntry && !visible}
        keyboardType={props.keyboardType}
        autoCapitalize={props.autoCapitalize}
        autoCorrect={false}
        maxLength={props.maxLength}
        textContentType={props.oneTimeCode ? "oneTimeCode" : undefined}
        accessibilityLabel={props.label}
        style={styles.input}
      />{props.secureTextEntry ? <Pressable accessibilityRole="button" accessibilityLabel={visible ? "Hide password" : "Show password"} onPress={() => setVisible((value) => !value)} style={styles.eyeButton}><Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={22} color={colors.inkMuted} /></Pressable> : null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: spacing.xxl },
  keyboard: { flex: 1, gap: spacing.lg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.sm, marginBottom: spacing.sm },
  backButton: { width: 46, height: 46, justifyContent: "center" },
  progress: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: spacing.sm },
  progressBar: { width: 42, height: 5, borderRadius: 4, backgroundColor: colors.line },
  progressActive: { width: 42, height: 5, borderRadius: 4, backgroundColor: colors.burgundy },
  brandSymbol: { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center", marginTop: spacing.sm },
  kicker: { fontFamily: type.bold, color: colors.burgundy, fontSize: 13, letterSpacing: 1.8 },
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 34, lineHeight: 40, letterSpacing: -1 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 16, lineHeight: 24 },
  segment: { flexDirection: "row", backgroundColor: colors.softPink, borderRadius: radius.pill, padding: 4 },
  segmentButton: { flex: 1, minHeight: 48, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  segmentButtonActive: { backgroundColor: colors.burgundy },
  segmentText: { fontFamily: type.bold, color: colors.inkMuted, fontSize: 16 },
  segmentTextActive: { color: colors.surface },
  methodSegment: { flexDirection: "row", borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, padding: 4 },
  methodButton: { flex: 1, minHeight: 48, borderRadius: radius.pill, flexDirection: "row", gap: 7, alignItems: "center", justifyContent: "center" },
  methodButtonActive: { backgroundColor: colors.burgundySoft },
  methodText: { fontFamily: type.bold, color: colors.inkMuted, fontSize: 15 },
  methodTextActive: { color: colors.burgundy },
  field: { gap: spacing.sm },
  label: { fontFamily: type.bold, color: colors.ink, fontSize: 16 },
  inputFrame: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md },
  input: { flex: 1, minHeight: 56, fontFamily: type.regular, color: colors.ink, fontSize: 16 },
  eyeButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  helper: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 14, lineHeight: 20, marginTop: -spacing.sm },
  resendPanel: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.tealSoft },
  resendCopy: { flex: 1, fontFamily: type.medium, color: colors.ink, fontSize: 15, lineHeight: 21 },
  codeActions: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.lg },
  actionDivider: { color: colors.line, fontSize: 18 },
  link: { color: colors.burgundy, fontFamily: type.bold, fontSize: 15 },
  linkDisabled: { color: colors.inkMuted },
  linkCenter: { color: colors.burgundy, fontFamily: type.bold, fontSize: 15, textAlign: "center", paddingVertical: spacing.sm },
  errorPanel: { flexDirection: "row", gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: "#FFF3F1" },
  errorText: { flex: 1, color: colors.danger, fontFamily: type.medium, fontSize: 14, lineHeight: 20 },
  primaryButton: { minHeight: 58, borderRadius: radius.pill },
  factorList: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  factorButton: { minHeight: 44, paddingHorizontal: spacing.md, justifyContent: "center", borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line },
  factorSelected: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft },
  factorText: { color: colors.ink, fontFamily: type.medium, fontSize: 14 },
  socialGroup: { gap: spacing.md },
  socialDivider: { color: colors.inkMuted, fontFamily: type.bold, fontSize: 13, textAlign: "center" },
  socialButton: { minHeight: 54, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.sm },
  socialText: { color: colors.ink, fontFamily: type.bold, fontSize: 16 },
  trustNote: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.lg, backgroundColor: colors.tealSoft, padding: spacing.md },
  trustText: { flex: 1, color: colors.ink, fontFamily: type.medium, fontSize: 14, lineHeight: 20 },
});
