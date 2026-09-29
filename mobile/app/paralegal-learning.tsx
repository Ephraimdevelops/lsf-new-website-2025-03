import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function ParalegalLearningScreen() {
  const { locale } = useLanguage();
  const { isSignedIn } = useAuth();
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const guides = useQuery(api.publications.listPublicLegalGuides, {});
  const approved = access?.roles.some((role) => role === "paralegal" || role === "provider_staff") ?? false;

  return <Screen>
    <AppHeader back title={locale === "sw" ? "Kituo cha kujifunza" : "Learning hub"} eyebrow="HAKI YANGU · PARALEGAL" />
    <View style={styles.hero}>
      <View style={styles.heroIcon}><Ionicons name="book-outline" size={29} color={colors.surface} /></View>
      <Text style={styles.heroTitle}>{locale === "sw" ? "Jifunze. Saidia kwa uangalifu." : "Learn. Support with care."}</Text>
      <Text style={styles.heroBody}>{locale === "sw" ? "Pata miongozo iliyopitiwa, kagua mipaka ya jukumu lako, na uliza LSF unapohitaji usimamizi." : "Find reviewed guides, check the limits of your role, and ask LSF when you need supervision."}</Text>
    </View>

    <SectionHeading title={locale === "sw" ? "Hatua za utayari" : "Readiness steps"} />
    <View style={styles.steps}>
      <Step icon="person-circle-outline" number="01" title={locale === "sw" ? "Kamilisha wasifu" : "Complete your profile"} body={locale === "sw" ? "Taarifa, eneo, upatikanaji na maadili." : "Identity, area, availability and conduct."} onPress={() => router.push("/paralegal-onboarding")} />
      <Step icon="shield-checkmark-outline" number="02" title={locale === "sw" ? "Tumia mwongozo uliopitishwa" : "Use reviewed guidance"} body={locale === "sw" ? "Angalia chanzo na tarehe ya mapitio kabla ya kutumia taarifa." : "Check the source and review date before using information."} onPress={() => router.push("/learn")} />
      <Step icon="people-outline" number="03" title={locale === "sw" ? "Omba usimamizi" : "Ask for supervision"} body={locale === "sw" ? "Usikisie jibu kwa suala la hatari au nje ya utaalamu wako." : "Escalate risky matters or questions beyond your expertise."} onPress={() => router.push("/paralegal-support")} />
    </View>

    <SectionHeading title={locale === "sw" ? "Miongozo iliyopitishwa na LSF" : "LSF-approved guides"} />
    {guides === undefined ? <Surface><Text style={styles.body}>{locale === "sw" ? "Tunapakia miongozo..." : "Loading guides..."}</Text></Surface> : guides.length === 0 ?
      <Surface tone="orange"><Ionicons name="document-text-outline" size={26} color={colors.burgundy} /><Text style={styles.cardTitle}>{locale === "sw" ? "Hakuna mwongozo ulioidhinishwa bado" : "No approved guides yet"}</Text><Text style={styles.body}>{locale === "sw" ? "LSF bado haijachapisha nyenzo za kisheria zilizopitiwa. Ikiwa unashughulikia kesi, omba mwongozo wa msimamizi." : "LSF has not published reviewed legal material yet. Request supervisor guidance for a case rather than relying on unverified material."}</Text><Button label={locale === "sw" ? "Omba mwongozo" : "Request guidance"} variant="secondary" onPress={() => router.push("/paralegal-support")} /></Surface> :
      guides.map((guide) => <Pressable key={guide._id} accessibilityRole="button" onPress={() => router.push({ pathname: "/legal-guide/[id]", params: { id: guide._id } })} style={styles.guide}>
        <View style={styles.guideIcon}><Ionicons name="document-text-outline" size={23} color={colors.burgundy} /></View>
        <View style={styles.guideText}><Text style={styles.guideTitle}>{locale === "sw" ? guide.titleSw : guide.titleEn}</Text><Text style={styles.body} numberOfLines={2}>{locale === "sw" ? guide.summarySw : guide.summaryEn}</Text><Text style={styles.source}>{guide.publisher} · {guide.sourceTitle}</Text></View>
        <Ionicons name="chevron-forward" size={19} color={colors.inkMuted} />
      </Pressable>)}

    <SectionHeading title={locale === "sw" ? "Msaada wa kazi" : "Support for your work"} />
    <Surface tone="pink"><Text style={styles.cardTitle}>{locale === "sw" ? "Usibebe suala gumu peke yako." : "Do not carry a difficult case alone."}</Text><Text style={styles.body}>{locale === "sw" ? "Omba usimamizi wa kesi, msaada wa ustawi au ufafanuzi wa utaratibu kupitia ombi la ndani la LSF." : "Ask LSF for case supervision, wellbeing support or process clarification through the protected support request."}</Text><Button label={locale === "sw" ? "Fungua msaada wa paralegal" : "Open paralegal support"} onPress={() => router.push("/paralegal-support")} /></Surface>
    {!approved ? <Text style={styles.accessNote}>{locale === "sw" ? "Ufikiaji wa kesi na maombi ya ndani unahitaji akaunti ya paralegal iliyoidhinishwa." : "Cases and internal requests require an approved paralegal account."}</Text> : null}
  </Screen>;
}

function Step({ icon, number, title, body, onPress }: { icon: keyof typeof Ionicons.glyphMap; number: string; title: string; body: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.step}><View style={styles.stepIcon}><Ionicons name={icon} size={23} color={colors.burgundy} /></View><View style={styles.stepText}><Text style={styles.stepNumber}>{number}</Text><Text style={styles.cardTitle}>{title}</Text><Text style={styles.body}>{body}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></Pressable>;
}

const styles = StyleSheet.create({
  hero: { marginTop: spacing.lg, padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.ink, gap: spacing.sm },
  heroIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  heroTitle: { color: colors.surface, fontFamily: type.bold, fontWeight: "700", fontSize: 27, lineHeight: 32 },
  heroBody: { color: "#E4DDE1", fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  steps: { gap: spacing.sm },
  step: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  stepIcon: { width: 45, height: 45, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundySoft },
  stepText: { flex: 1, gap: 3 }, stepNumber: { color: colors.burgundy, fontFamily: type.bold, fontWeight: "700", fontSize: 11 },
  cardTitle: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 16 },
  body: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 },
  guide: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, marginBottom: spacing.sm },
  guideIcon: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundySoft },
  guideText: { flex: 1, gap: 4 }, guideTitle: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 15 },
  source: { color: colors.burgundy, fontFamily: type.medium, fontWeight: "500", fontSize: 11 },
  accessNote: { marginTop: spacing.lg, color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 },
});
