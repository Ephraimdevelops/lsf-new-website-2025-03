import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function ParalegalPerformanceScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const approved = access?.roles.some((role) => ["paralegal", "provider_staff"].includes(role)) ?? false;
  const performance = useQuery(api.paralegals.getMyPerformance, approved ? {} : "skip");
  if (!isSignedIn) return <Screen><AppHeader back title={locale === "sw" ? "Utendaji wangu" : "My performance"} eyebrow="Haki Yangu · Paralegal" /><View style={styles.hero}><Ionicons name="trending-up-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{locale === "sw" ? "Pima kazi yako na matokeo yake." : "Understand your work and its impact."}</Text><Text style={styles.heroBody}>{locale === "sw" ? "Kesi ulizoshughulikia, matokeo na maoni ya wanufaika huonekana hapa baada ya idhini." : "Assigned cases, outcomes and beneficiary feedback appear here after approval."}</Text></View><Surface tone="pink"><Text style={styles.noteTitle}>{locale === "sw" ? "Taarifa zako ni za siri" : "Your metrics are private"}</Text><Text style={styles.body}>{locale === "sw" ? "Ingia kwa akaunti ya paralegal iliyoidhinishwa ili kuona utendaji halisi." : "Sign in with an approved paralegal account to see real performance data."}</Text><Button label={locale === "sw" ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} /></Surface></Screen>;
  if (access === undefined) return <Screen><Text style={styles.body}>{locale === "sw" ? "Tunapakia ruhusa..." : "Loading access..."}</Text></Screen>;
  if (!approved) return <Screen><AppHeader back title={locale === "sw" ? "Utendaji wangu" : "My performance"} /><Surface tone="orange"><Text style={styles.noteTitle}>{locale === "sw" ? "Idhini ya paralegal inahitajika" : "Paralegal approval required"}</Text><Text style={styles.body}>{locale === "sw" ? "Utendaji unaonekana tu baada ya jukumu kuidhinishwa na LSF." : "Performance is available after LSF approves your role."}</Text><Button label={locale === "sw" ? "Angalia kujiunga" : "View onboarding"} onPress={() => router.push("/paralegal-onboarding")} /></Surface></Screen>;
  if (performance === undefined) return <Screen><Text style={styles.body}>{locale === "sw" ? "Tunapakia utendaji..." : "Loading performance..."}</Text></Screen>;
  return <Screen>
    <AppHeader back title={locale === "sw" ? "Utendaji wangu" : "My performance"} eyebrow="Haki Yangu · Paralegal" />
    <View style={styles.hero}><Ionicons name="trending-up-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{locale === "sw" ? "Kazi yako inaonekana." : "See the work you are doing."}</Text><Text style={styles.heroBody}>{locale === "sw" ? "Taarifa hii inatokana na kesi ulizopewa na maoni ya wanufaika." : "These figures come from your assigned cases and beneficiary feedback."}</Text></View>
    <SectionHeading title={locale === "sw" ? "Muhtasari" : "Overview"} />
    <View style={styles.grid}><Metric value={performance.casesHandled} label={locale === "sw" ? "Kesi ulizoshughulikia" : "Cases handled"} /><Metric value={performance.activeCases} label={locale === "sw" ? "Kesi zinazoendelea" : "Active cases"} /><Metric value={performance.resolvedCases} label={locale === "sw" ? "Zilizopata matokeo" : "Resolved"} /><Metric value={performance.outcomesRecorded} label={locale === "sw" ? "Matokeo yaliyorekodiwa" : "Outcomes recorded"} /></View>
    <Surface tone="teal"><Text style={styles.rating}>{performance.averageRating === null ? "—" : performance.averageRating.toFixed(1)} <Text style={styles.ratingSmall}>/ 5</Text></Text><Text style={styles.body}>{locale === "sw" ? `${performance.feedbackCount} maoni ya mnufaika yamejumuishwa.` : `${performance.feedbackCount} beneficiary feedback responses included.`}</Text></Surface>
    <Surface tone="pink"><Text style={styles.noteTitle}>{locale === "sw" ? "Tumia taarifa hii kujiboresha" : "Use this to improve"}</Text><Text style={styles.body}>{locale === "sw" ? "Kamilisha maelezo ya kesi, fuatilia hatua ulizoahidi, na omba msaada wa msimamizi unapokutana na changamoto." : "Keep case notes complete, follow through on promised steps, and ask a supervisor for support when a matter is difficult."}</Text><Button label={locale === "sw" ? "Fungua msaada" : "Open support"} variant="secondary" onPress={() => router.push("/support")} /></Surface>
  </Screen>;
}

function Metric({ value, label }: { value: number; label: string }) { return <Surface style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></Surface>; }

const styles = StyleSheet.create({ hero: { backgroundColor: colors.ink, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm, marginTop: spacing.lg }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontWeight: "700", fontSize: 24 }, heroBody: { color: "#D8D2D5", fontFamily: type.regular, fontSize: 13, lineHeight: 20 }, grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md }, metric: { width: "47%", minHeight: 116 }, metricValue: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 29 }, metricLabel: { color: colors.inkMuted, fontFamily: type.medium, fontWeight: "500", fontSize: 12, lineHeight: 17, marginTop: spacing.sm }, rating: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 34 }, ratingSmall: { fontSize: 16 }, noteTitle: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 16 }, body: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 20, marginTop: spacing.sm },
});
