import { BrandLoading } from '../src/components/BrandLoading';
import { plainError } from "../../shared/plainLanguage";
import { ParalegalIntro } from "../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../src/components/ParalegalNavigation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { CivicPageHeader as AppHeader } from "../src/components/CivicPageHeader";
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
  const modules = useQuery(api.paralegalTraining.listPublished, access?.roles.some((role) => ["paralegal", "staff", "admin"].includes(role)) ? {} : "skip");
  const acknowledge = useMutation(api.paralegalTraining.acknowledge);
  const [openModule, setOpenModule] = useState<string | null>(null); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);

  return <Screen footer={approved ? <ParalegalNavigation current="learn" /> : undefined}>
    <AppHeader compact back title={locale === "sw" ? "Mafunzo na miongozo" : "Learning hub"} />
    <ParalegalIntro pose="documents" title={locale === "sw" ? "Jifunze. Saidia kwa uangalifu." : "Learn. Support with care."} body={locale === "sw" ? "Soma miongozo iliyokaguliwa. Fuata mipaka ya jukumu lako na uliza LSF ukihitaji msaada." : "Read reviewed guides. Stay within your role and ask LSF when you need guidance."} />

    <SectionHeading title={locale === "sw" ? "Hatua za utayari" : "Readiness steps"} />
    <View style={styles.steps}>
      <Step icon="person-circle-outline" number="01" title={locale === "sw" ? "Kamilisha wasifu" : "Complete your profile"} body={locale === "sw" ? "Taarifa, eneo, upatikanaji na maadili." : "Identity, area, availability and conduct."} onPress={() => router.push("/paralegal-onboarding")} />
      <Step icon="shield-checkmark-outline" number="02" title={locale === "sw" ? "Tumia mwongozo uliopitishwa" : "Use reviewed guidance"} body={locale === "sw" ? "Angalia chanzo na tarehe ya mapitio kabla ya kutumia taarifa." : "Check the source and review date before using information."} onPress={() => router.push("/rights")} />
      <Step icon="people-outline" number="03" title={locale === "sw" ? "Omba usimamizi" : "Ask for supervision"} body={locale === "sw" ? "Usikisie jibu kwa suala la hatari au nje ya utaalamu wako." : "Escalate risky matters or questions beyond your expertise."} onPress={() => router.push("/paralegal-support")} />
    </View>

    <SectionHeading title={locale === "sw" ? "Mafunzo yaliyoidhinishwa" : "Approved training"} />
    {modules === undefined && access?.roles.some((role) => ["paralegal", "staff", "admin"].includes(role)) ? <Surface><BrandLoading compact text={locale === "sw" ? "Inapakia mafunzo..." : "Loading training..."}/></Surface> : null}
    {modules?.length === 0 ? <Surface tone="orange"><Text style={styles.cardTitle}>{locale === "sw" ? "Hakuna mafunzo ya LSF yaliyochapishwa bado." : "LSF has not published training yet."}</Text><Text style={styles.body}>{locale === "sw" ? "Omba msimamizi aandae na aidhinishe masomo yanayohitajika." : "Ask your supervisor to prepare and approve the required lessons."}</Text></Surface> : null}
    {modules?.map((module) => <Surface key={module._id} tone={module.completedAt ? "teal" : module.required ? "orange" : "white"}><Text style={styles.cardTitle}>{locale === "sw" ? module.titleSw : module.titleEn}</Text><Text style={styles.source}>{module.required ? (locale === "sw" ? "Lazima" : "Required") : (locale === "sw" ? "Hiari" : "Optional")} · v{module.version} · {module.topic}</Text><Text style={styles.body}>{module.completedAt ? (locale === "sw" ? `Ulipitia na kuthibitisha ${new Date(module.completedAt).toLocaleDateString("sw-TZ")}` : `Reviewed and acknowledged ${new Date(module.completedAt).toLocaleDateString("en-TZ")}`) : (locale === "sw" ? "Bado hujathibitisha kusoma somo." : "You have not confirmed reading this lesson.")}</Text><Button label={openModule === module._id ? (locale === "sw" ? "Ficha maudhui" : "Hide content") : (locale === "sw" ? "Soma somo" : "Read lesson")} variant="secondary" onPress={() => setOpenModule(openModule === module._id ? null : module._id)} />{openModule === module._id ? <><Text style={styles.body}>{locale === "sw" ? module.contentSw : module.contentEn}</Text><Text style={styles.source}>{module.sourceTitle} · {module.sourceUrl}</Text><Text style={styles.body}>{locale === "sw" ? "Hii inarekodi kuwa umesoma; si cheti cha mtihani." : "This records that you have read the lesson; it is not an exam certificate."}</Text>{access?.roles.includes("paralegal") && !module.completedAt ? <Button label={locale === "sw" ? "Nimesoma na kuelewa" : "I reviewed and understood"} disabled={busy} onPress={async () => { setBusy(true); setError(""); try { await acknowledge({ id: module._id }); } catch (caught) { setError(plainError(caught, locale)); } finally { setBusy(false); } }} /> : null}</> : null}</Surface>)}
    {error ? <Text accessibilityRole="alert" style={styles.accessNote}>{error}</Text> : null}
    <SectionHeading title={locale === "sw" ? "Miongozo iliyopitishwa na LSF" : "LSF-approved guides"} />
    {guides === undefined ? <Surface><BrandLoading compact text={locale === "sw" ? "Tunapakia miongozo..." : "Loading guides..."}/></Surface> : guides.length === 0 ?
      <Surface tone="orange"><Ionicons name="document-text-outline" size={26} color={colors.burgundy} /><Text style={styles.cardTitle}>{locale === "sw" ? "Hakuna mwongozo ulioidhinishwa bado" : "No approved guides yet"}</Text><Text style={styles.body}>{locale === "sw" ? "LSF bado haijachapisha nyenzo za kisheria zilizopitiwa. Ikiwa unashughulikia kesi, omba mwongozo wa msimamizi." : "LSF has not published reviewed legal material yet. Request supervisor guidance for a case rather than relying on unverified material."}</Text><Button label={locale === "sw" ? "Omba mwongozo" : "Request guidance"} variant="secondary" onPress={() => router.push("/paralegal-support")} /></Surface> :
      guides.map((guide) => <Pressable key={guide._id} accessibilityRole="button" onPress={() => router.push({ pathname: "/legal-guide/[id]", params: { id: guide._id } })} style={styles.guide}>
        <View style={styles.guideIcon}><Ionicons name="document-text-outline" size={23} color={colors.burgundy} /></View>
        <View style={styles.guideText}><Text style={styles.guideTitle}>{locale === "sw" ? guide.titleSw : guide.titleEn}</Text><Text style={styles.body} numberOfLines={2}>{locale === "sw" ? guide.summarySw : guide.summaryEn}</Text><Text style={styles.source}>{guide.publisher} · {guide.sourceTitle}</Text></View>
        <Ionicons name="chevron-forward" size={19} color={colors.inkMuted} />
      </Pressable>)}

    <SectionHeading title={locale === "sw" ? "Msaada wa kazi" : "Support for your work"} />
    <Surface tone="pink"><Text style={styles.cardTitle}>{locale === "sw" ? "Usibebe suala gumu peke yako." : "Do not carry a difficult case alone."}</Text><Text style={styles.body}>{locale === "sw" ? "Omba mwongozo wa kesi, msaada wa ustawi au ufafanuzi kutoka LSF." : "Ask LSF for case guidance, wellbeing support or help with a procedure."}</Text><Button label={locale === "sw" ? "Fungua msaada wa msaidizi wa kisheria" : "Open paralegal support"} onPress={() => router.push("/paralegal-support")} /></Surface>
    {!approved ? <Text style={styles.accessNote}>{locale === "sw" ? "Ufikiaji wa kesi na maombi ya ndani unahitaji akaunti ya msaidizi wa kisheria iliyoidhinishwa." : "Cases and internal requests require an approved paralegal account."}</Text> : null}
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
  body: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 15, lineHeight: 23 },
  guide: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, marginBottom: spacing.sm },
  guideIcon: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundySoft },
  guideText: { flex: 1, gap: 4 }, guideTitle: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 15 },
  source: { color: colors.burgundy, fontFamily: type.medium, fontWeight: "500", fontSize: 11 },
  accessNote: { marginTop: spacing.lg, color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 },
});
