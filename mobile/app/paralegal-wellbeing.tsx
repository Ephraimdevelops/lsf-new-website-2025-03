import { ParalegalIntro } from "../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../src/components/ParalegalNavigation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CivicPageHeader as AppHeader } from "../src/components/CivicPageHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const choices = [
  { id: "wellbeing", icon: "heart-outline", sw: "Nahitaji mazungumzo ya ustawi", en: "I need a wellbeing conversation", detailSw: "Omba mawasiliano ya faragha kutoka LSF.", detailEn: "Ask LSF for a private conversation." },
  { id: "supervisor", icon: "people-outline", sw: "Nahitaji usimamizi wa kazi", en: "I need work supervision", detailSw: "Zungumza kuhusu mipaka ya jukumu au hatua zinazofuata.", detailEn: "Discuss role boundaries or next steps." },
  { id: "challenging_case", icon: "shield-checkmark-outline", sw: "Nina kesi yenye changamoto", en: "I have a difficult case", detailSw: "Omba msaada bila kuweka taarifa za siri zisizohitajika.", detailEn: "Ask for help without unnecessary case details." },
] as const;

export default function ParalegalWellbeingScreen() {
  const { locale } = useLanguage();
  const [selected, setSelected] = useState<(typeof choices)[number]["id"]>("wellbeing");
  return <Screen footer={true ? <ParalegalNavigation current="profile" /> : undefined}>
    <AppHeader compact back title={locale === "sw" ? "Ustawi na usimamizi" : "Wellbeing and supervision"} />
    <ParalegalIntro pose="contact" title={locale === "sw" ? "Wewe ni muhimu pia." : "Your wellbeing matters too."} body={locale === "sw" ? "Kazi ya kusaidia wengine inaweza kuwa ngumu. Chagua aina ya msaada unaohitaji, kisha uamue kama utatuma ombi kwa LSF." : "Supporting others can be difficult. Choose the help you need, then decide whether to send a request to LSF."} />
    <Text style={styles.sectionTitle}>{locale === "sw" ? "Ungependa msaada gani?" : "What support would help?"}</Text>
    {choices.map((choice) => <Pressable key={choice.id} accessibilityRole="radio" accessibilityState={{ checked: selected === choice.id }} aria-checked={selected === choice.id} onPress={() => setSelected(choice.id)} style={[styles.choice, selected === choice.id && styles.selected]}><View style={styles.choiceIcon}><Ionicons name={choice.icon} size={24} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.choiceTitle}>{locale === "sw" ? choice.sw : choice.en}</Text><Text style={styles.choiceBody}>{locale === "sw" ? choice.detailSw : choice.detailEn}</Text></View><Ionicons name={selected === choice.id ? "radio-button-on" : "radio-button-off"} size={22} color={colors.burgundy} /></Pressable>)}
    <Surface tone="pink"><Text style={styles.noticeTitle}>{locale === "sw" ? "Unabaki na udhibiti" : "You stay in control"}</Text><Text style={styles.choiceBody}>{locale === "sw" ? "Hakuna taarifa ya ustawi inayotumwa kwa kuchagua hapa. Utakagua na kutuma ombi lako mwenyewe kwenye ukurasa unaofuata." : "Selecting an option here sends no wellbeing information. You will review and submit your own request on the next screen."}</Text></Surface>
    <Button label={locale === "sw" ? "Endelea kuomba msaada" : "Continue to support request"} onPress={() => router.push({ pathname: "/paralegal-support", params: { kind: selected } })} />
    <Button label={locale === "sw" ? "Rudi kwenye kazi zangu" : "Return to my work"} variant="secondary" onPress={() => router.push("/workspace")} />
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { marginTop: spacing.lg, padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.ink, gap: spacing.sm },
  icon: { width: 58, height: 58, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundy },
  title: { color: colors.surface, fontFamily: type.bold, fontWeight: "700", fontSize: 28, lineHeight: 34 },
  heroBody: { color: "#E4DDE1", fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  sectionTitle: { marginTop: spacing.xxl, marginBottom: spacing.md, color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 19 },
  choice: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, marginBottom: spacing.sm },
  selected: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft },
  choiceIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1 }, choiceTitle: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 14 },
  choiceBody: { marginTop: 4, color: colors.inkMuted, fontFamily: type.regular, fontSize: 15, lineHeight: 23 },
  noticeTitle: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 15 },
});
