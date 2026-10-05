import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { QuickExit } from "../src/components/QuickExit";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

// Tanzania Government Service Portal and TCRA numbering plan, checked October 2026.
const numbers = [
  { number: "112", sw: "Polisi", en: "Police", icon: "shield-outline" },
  { number: "115", sw: "Gari la wagonjwa", en: "Ambulance", icon: "medkit-outline" },
  { number: "114", sw: "Zimamoto na uokoaji", en: "Fire and rescue", icon: "flame-outline" },
  { number: "116", sw: "Msaada kwa mtoto", en: "Child helpline", icon: "people-outline" },
  { number: "111", sw: "Kuzuia uhalifu", en: "Crime stoppers", icon: "eye-outline" },
  { number: "113", sw: "Kuripoti rushwa", en: "Report corruption", icon: "megaphone-outline" },
  { number: "117", sw: "Huduma za afya", en: "Health helpline", icon: "heart-outline" },
  { number: "119", sw: "Kupambana na dawa za kulevya", en: "Anti-drugs", icon: "hand-left-outline" },
  { number: "190", sw: "Huduma za maafa", en: "Disaster services", icon: "warning-outline" },
  { number: "110", sw: "Dharura majini", en: "Water emergency", icon: "water-outline" },
  { number: "195", sw: "Biashara haramu ya binadamu", en: "Human trafficking", icon: "person-outline" },
] as const;

const steps = {
  sw: ["Ondoka kwenye hatari ikiwa unaweza kufanya hivyo kwa usalama.", "Mwambie mtu unayemwamini ulipo na unachohitaji.", "Hifadhi nyaraka au ushahidi tu ikiwa haitakuweka hatarini."],
  en: ["Move away from danger if you can do so safely.", "Tell someone you trust where you are and what you need.", "Keep documents or evidence only if doing so is safe."],
};

export default function SafetyScreen() {
  useSensitiveScreenProtection("safety");
  const { locale } = useLanguage();
  const [showMore, setShowMore] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  return <Screen>
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Go back"} onPress={() => router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable>
      <Text style={styles.headerTitle}>{locale === "sw" ? "Usalama na dharura" : "Safety and emergencies"}</Text>
      <QuickExit locale={locale} />
    </View>
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>{locale === "sw" ? "MSAADA WA HARAKA" : "IMMEDIATE HELP"}</Text>
      <Text style={styles.title}>{locale === "sw" ? "Je, uko kwenye hatari sasa?" : "Are you in danger now?"}</Text>
      <Text style={styles.body}>{locale === "sw" ? "Piga huduma ya dharura. Haki Yangu haipokei simu za dharura, na ombi la mtandaoni linaweza kuchelewa." : "Call an emergency service. Haki Yangu does not receive emergency calls, and an online request may be delayed."}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Piga polisi 112" : "Call police 112"} style={styles.mainCall} onPress={() => void Linking.openURL("tel:112")}><Ionicons name="call" size={21} color={colors.surface} /><Text style={styles.mainCallText}>{locale === "sw" ? "Piga 112 sasa" : "Call 112 now"}</Text><Ionicons name="arrow-forward" size={18} color={colors.surface} /></Pressable>
    </View>
    <View style={styles.sectionHead}><Text style={styles.sectionTitle}>{locale === "sw" ? "Namba za msaada" : "Help numbers"}</Text><Text style={styles.sectionNote}>{locale === "sw" ? "Gusa kupiga simu" : "Tap to call"}</Text></View>
    <View style={styles.numberList}>{(showMore ? numbers : numbers.slice(0, 4)).map((item) => <Pressable key={item.number} accessibilityRole="button" accessibilityLabel={`${item[locale]} ${item.number}`} onPress={() => void Linking.openURL(`tel:${item.number}`)} style={({ pressed }) => [styles.numberRow, pressed && styles.pressed]}><View style={styles.numberIcon}><Ionicons name={item.icon} size={21} color={colors.burgundy} /></View><Text style={styles.numberLabel}>{item[locale]}</Text><Text style={styles.numberValue}>{item.number}</Text><Ionicons name="call-outline" size={19} color={colors.teal} /></Pressable>)}</View>
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: showMore }} style={styles.moreButton} onPress={() => setShowMore(!showMore)}><Text style={styles.moreText}>{showMore ? (locale === "sw" ? "Onyesha chache" : "Show fewer") : (locale === "sw" ? "Namba zaidi" : "More numbers")}</Text><Ionicons name={showMore ? "chevron-up" : "chevron-down"} size={18} color={colors.burgundy} /></Pressable>
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: showPlan }} style={styles.planHead} onPress={() => setShowPlan(!showPlan)}><View><Text style={styles.sectionTitle}>{locale === "sw" ? "Hatua za usalama" : "Safety steps"}</Text><Text style={styles.sectionNote}>{locale === "sw" ? "Mwongozo mfupi wa kujilinda" : "A short plan for staying safe"}</Text></View><Ionicons name={showPlan ? "chevron-up" : "chevron-down"} size={20} color={colors.burgundy} /></Pressable>
    {showPlan ? <View style={styles.steps}>{steps[locale].map((step, index) => <View key={step} style={styles.step}><Text style={styles.stepNumber}>{index + 1}</Text><Text style={styles.stepText}>{step}</Text></View>)}</View> : null}
    <View style={styles.footer}><Ionicons name="eye-off-outline" size={20} color={colors.teal} /><Text style={styles.footerText}>{locale === "sw" ? "Ikiwa simu yako inaangaliwa, tumia kitufe cha kutoka haraka juu au kifaa salama." : "If your phone is monitored, use Quick Exit above or a safer device."}</Text></View>
    <Pressable accessibilityRole="button" style={styles.requestLink} onPress={() => router.push("/intake")}><Text style={styles.requestText}>{locale === "sw" ? "Si dharura? Omba msaada wa kisheria" : "Not an emergency? Request legal help"}</Text><Ionicons name="arrow-forward" size={17} color={colors.burgundy} /></Pressable>
  </Screen>;
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerTitle: { fontFamily: type.semibold, color: colors.charcoal, fontSize: 17 },
  hero: { marginTop: 22, backgroundColor: "#173F3C", borderRadius: 18, padding: 21 },
  eyebrow: { fontFamily: type.semibold, fontSize: 11, color: "#9EE0D8" },
  title: { marginTop: 10, fontFamily: type.editorial, fontSize: 27, lineHeight: 32, color: colors.surface },
  body: { marginTop: 8, fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: "#DFEFED" },
  mainCall: { marginTop: 20, backgroundColor: colors.burgundy, minHeight: 52, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  mainCallText: { fontFamily: type.semibold, fontSize: 16, color: colors.surface },
  sectionHead: { marginTop: 26, marginBottom: 10, flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  sectionTitle: { fontFamily: type.semibold, fontSize: 19, color: colors.ink },
  sectionNote: { fontFamily: type.regular, fontSize: 12, color: colors.inkMuted },
  numberList: { backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 13 },
  numberRow: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 12 },
  numberIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  numberLabel: { flex: 1, fontFamily: type.medium, fontSize: 14, color: colors.ink },
  numberValue: { fontFamily: type.semibold, fontSize: 17, color: colors.burgundy },
  pressed: { opacity: 0.65 },
  moreButton: { minHeight: 46, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  moreText: { fontFamily: type.semibold, fontSize: 14, color: colors.burgundy },
  planHead: { marginTop: 13, minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  steps: { gap: 14, paddingVertical: 10 },
  step: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  stepNumber: { overflow: "hidden", width: 26, height: 26, borderRadius: 13, textAlign: "center", textAlignVertical: "center", backgroundColor: colors.softPink, fontFamily: type.semibold, color: colors.burgundy },
  stepText: { flex: 1, fontFamily: type.regular, color: colors.ink, fontSize: 14, lineHeight: 21 },
  footer: { marginTop: 20, backgroundColor: colors.tealSoft, borderRadius: 12, padding: 14, flexDirection: "row", gap: 10 },
  footerText: { flex: 1, fontFamily: type.regular, color: colors.ink, fontSize: 13, lineHeight: 19 },
  requestLink: { minHeight: 55, marginBottom: 24, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  requestText: { fontFamily: type.semibold, color: colors.burgundy, fontSize: 14 },
});
