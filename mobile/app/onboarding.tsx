import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { BrandMark } from "../src/components/BrandMark";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function OnboardingScreen() {
  const { locale, setLocale } = useLanguage();

  async function continueToApp() {
    await AsyncStorage.setItem("haki-yangu:onboarded", "yes");
    router.replace("/(tabs)");
  }

  return (
    <Screen style={styles.screen}>
      <BrandMark />
      <View style={styles.hero}>
        <View style={styles.illustration}>
          <View style={styles.artGlow} />
          <Image source={require("../assets/saada-paralegal.png")} style={styles.artImage} resizeMode="cover" accessible={false} />
          <View style={styles.artStatement}><Text style={styles.artStatementTitle}>{locale === "sw" ? "Hauko peke yako." : "You are not alone."}</Text><Text style={styles.artStatementBody}>{locale === "sw" ? "Taarifa. Msaada. Hatua wazi." : "Information. Support. Clear next steps."}</Text></View>
          <View style={styles.artCard}><Ionicons name="shield-checkmark" size={22} color={colors.teal} /><Text style={styles.artCardText}>{locale === "sw" ? "Salama na ya kuaminika" : "Safe and trusted"}</Text></View>
        </View>
        <Text style={styles.kicker}>{locale === "sw" ? "WATU · HAKI · USAIDIZI" : "PEOPLE · RIGHTS · SUPPORT"}</Text>
        <Text style={styles.title}>{locale === "sw" ? "Haki zako, mikononi mwako" : "Your rights, in your hands"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Haki Yangu hukusaidia kuelewa haki zako, kupata msaada unaofaa na kufuatilia hatua zinazofuata."
            : "Haki Yangu helps you understand your rights, reach the right support and follow what happens next."}
        </Text>
      </View>
      <View style={styles.pathPreview}>
        <View style={styles.previewItem}><View style={styles.previewIcon}><Ionicons name="chatbubbles" size={20} color={colors.burgundy} /></View><View style={styles.previewCopy}><Text style={styles.previewTitle}>{locale === "sw" ? "Omba msaada" : "Ask for help"}</Text><Text style={styles.previewBody}>{locale === "sw" ? "Eleza tatizo lako na uunganishwe." : "Tell us your problem and get connected."}</Text></View></View>
        <View style={styles.previewDivider} />
        <View style={styles.previewItem}><View style={[styles.previewIcon, styles.previewIconTeal]}><Ionicons name="search" size={20} color={colors.teal} /></View><View style={styles.previewCopy}><Text style={styles.previewTitle}>{locale === "sw" ? "Tafuta huduma" : "Find help"}</Text><Text style={styles.previewBody}>{locale === "sw" ? "Gundua huduma zilizothibitishwa." : "Explore verified services near you."}</Text></View></View>
        <View style={styles.previewDivider} />
        <View style={styles.previewItem}><View style={[styles.previewIcon, styles.previewIconGold]}><Ionicons name="document-text-outline" size={20} color={colors.warning} /></View><View style={styles.previewCopy}><Text style={styles.previewTitle}>{locale === "sw" ? "Fuatilia kesi yako" : "Follow your case"}</Text><Text style={styles.previewBody}>{locale === "sw" ? "Ona hatua zinazofuata kwa urahisi." : "See your next steps clearly."}</Text></View></View>
      </View>
      <View>
        <Text style={styles.languageLabel}>{locale === "sw" ? "Chagua lugha" : "Choose your language"}</Text>
        <View style={styles.languageRow}>
          <Button label="Kiswahili" variant={locale === "sw" ? "primary" : "secondary"} onPress={() => void setLocale("sw")} style={styles.languageButton} />
          <Button label="English" variant={locale === "en" ? "primary" : "secondary"} onPress={() => void setLocale("en")} style={styles.languageButton} />
        </View>
        <Button label={locale === "sw" ? "Anza" : "Get started"} onPress={() => void continueToApp()} />
        <Pressable onPress={() => router.push("/sign-in")}><Text style={styles.signIn}>{locale === "sw" ? "Una akaunti tayari? Ingia" : "Already have an account? Sign in"}</Text></Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: spacing.lg, justifyContent: "space-between" },
  hero: { gap: spacing.lg },
  illustration: { height: 270, borderRadius: radius.xl, backgroundColor: colors.burgundySoft, marginTop: spacing.xl, overflow: "hidden" },
  artGlow: { position: "absolute", width: 240, height: 240, borderRadius: 120, right: -40, top: -45, backgroundColor: "#F5B7C9", opacity: 0.55 },
  artImage: { position: "absolute", width: 178, height: 270, right: 0, bottom: 0, borderTopLeftRadius: 90 },
  artStatement: { position: "absolute", left: spacing.lg, top: spacing.xl, width: 150 },
  artStatementTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 22, lineHeight: 25 },
  artStatementBody: { marginTop: spacing.sm, fontFamily: type.medium, fontWeight: "500", color: colors.ink, fontSize: 13, lineHeight: 18 },
  artCard: { position: "absolute", left: spacing.lg, bottom: spacing.lg, flexDirection: "row", alignItems: "center", gap: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md },
  artCardText: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 13 },
  kicker: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 11, letterSpacing: 1.5 },
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 34, lineHeight: 38, letterSpacing: -0.8 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 16, lineHeight: 24 },
  pathPreview: { marginVertical: spacing.xl, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md },
  previewItem: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm },
  previewIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" },
  previewIconTeal: { backgroundColor: colors.tealSoft }, previewIconGold: { backgroundColor: colors.goldSoft }, previewCopy: { flex: 1 },
  previewTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 14 }, previewBody: { marginTop: 2, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  previewDivider: { height: 1, backgroundColor: colors.line, marginVertical: spacing.xs },
  languageLabel: { marginBottom: spacing.sm, fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 13 },
  languageRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg },
  languageButton: { flex: 1 },
  signIn: { paddingVertical: spacing.lg, textAlign: "center", fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
});
