import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { BrandMark } from "../src/components/BrandMark";
import { Button } from "../src/components/Button";
import { CivicIllustration } from "../src/components/CivicIllustration";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function OnboardingScreen() {
  const { locale, setLocale } = useLanguage();
  const { height } = useWindowDimensions();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const sw = locale === "sw";

  async function continueToApp() {
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      await AsyncStorage.setItem("haki-yangu:onboarded", "yes");
      router.replace("/(tabs)");
    } catch {
      setError(true);
      setBusy(false);
    }
  }

  return <Screen style={styles.screen} footer={<View style={styles.actions}>
    {error ? <Text accessibilityRole="alert" style={styles.error}>{sw ? "Imeshindikana kuendelea. Jaribu tena." : "Couldn't continue. Please try again."}</Text> : null}
    <Button label={sw ? "Anza hapa" : "Get started"} loading={busy} disabled={busy} onPress={() => void continueToApp()} />
    <Pressable accessibilityRole="button" disabled={busy} onPress={() => router.push("/sign-in")} style={styles.signInButton}>
      <Text style={styles.signIn}>{sw ? "Una akaunti? " : "Have an account? "}<Text style={styles.signInLink}>{sw ? "Ingia" : "Sign in"}</Text></Text>
    </Pressable>
  </View>}>
    <View style={styles.header}><BrandMark /><Text style={styles.appName}>Haki Yangu</Text></View>
    <View accessibilityRole="radiogroup" accessibilityLabel={sw ? "Chagua lugha" : "Choose language"} style={styles.languages}>
      {(["sw", "en"] as const).map(language => <Pressable key={language} accessibilityRole="radio" aria-checked={locale === language} accessibilityState={{ checked: locale === language }} onPress={() => void setLocale(language)} style={[styles.language, locale === language && styles.languageSelected]}>
        <Text style={[styles.languageText, locale === language && styles.languageTextSelected]}>{language === "sw" ? "Kiswahili" : "English"}</Text>
      </Pressable>)}
    </View>
    <View style={styles.hero}>
      <View style={styles.art}>
        <View style={styles.orbit} />
        <View style={styles.goldDot} />
        <View style={styles.tealDot} />
        <CivicIllustration pose="welcome" size={height < 700 ? 144 : height < 750 ? 180 : 224} />
      </View>
      <Text style={styles.eyebrow}>{sw ? "HAUKO PEKE YAKO" : "YOU ARE NOT ALONE"}</Text>
      <Text accessibilityRole="header" style={[styles.title, height < 700 && styles.compactTitle]}>{sw ? "Haki zako.\nHatua yako inayofuata." : "Your rights.\nYour next step."}</Text>
      <Text style={styles.body}>{sw ? "Elewa haki zako na upate msaada wa kisheria, hatua kwa hatua." : "Understand your rights and find legal help, one step at a time."}</Text>
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  screen: { paddingTop: spacing.lg, paddingBottom: spacing.lg, width: "100%", maxWidth: 560, alignSelf: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  appName: { fontFamily: type.semibold, fontSize: 17, color: colors.burgundy },
  languages: { flexDirection: "row", alignSelf: "center", backgroundColor: colors.warmBackground, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, padding: 4, marginTop: spacing.xl },
  language: { minHeight: 44, paddingHorizontal: 24, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  languageSelected: { backgroundColor: colors.burgundySoft },
  languageText: { fontFamily: type.medium, fontSize: 14, lineHeight: 21, color: colors.inkMuted },
  languageTextSelected: { color: colors.burgundy, fontFamily: type.semibold },
  hero: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: spacing.xl, gap: spacing.md },
  art: { alignItems: "center", justifyContent: "center", padding: 12, marginBottom: spacing.sm },
  orbit: { position: "absolute", width: "100%", height: "100%", borderRadius: 150, borderWidth: 1, borderColor: colors.line, transform: [{ rotate: "-12deg" }] },
  goldDot: { position: "absolute", width: 16, height: 16, borderRadius: 8, backgroundColor: colors.gold, left: 0, top: 38 },
  tealDot: { position: "absolute", width: 10, height: 10, borderRadius: 5, backgroundColor: colors.teal, right: 4, bottom: 38 },
  eyebrow: { fontFamily: type.semibold, fontSize: 11, lineHeight: 17, letterSpacing: 1.8, color: colors.burgundy, textAlign: "center" },
  title: { fontFamily: type.semibold, fontSize: 32, lineHeight: 39, letterSpacing: -0.8, color: colors.ink, textAlign: "center" },
  compactTitle: { fontSize: 28, lineHeight: 34 },
  body: { fontFamily: type.regular, fontSize: 16, lineHeight: 24, color: colors.inkMuted, textAlign: "center", maxWidth: 340 },
  actions: { width: "100%", maxWidth: 512, alignSelf: "center", paddingTop: spacing.sm },
  signInButton: { minHeight: 52, alignItems: "center", justifyContent: "center", paddingVertical: spacing.md },
  signIn: { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted, textAlign: "center" },
  signInLink: { fontFamily: type.semibold, color: colors.burgundy },
  error: { fontFamily: type.medium, fontSize: 14, lineHeight: 21, color: colors.danger, textAlign: "center", marginBottom: spacing.md },
});
