import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

export default function CaseFollowUpScreen() {
  useSensitiveScreenProtection("case-follow-up");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const details = useQuery(api.caseManagement.getCase, isSignedIn && id ? { caseId: id as Id<"cases"> } : "skip");
  const appointments = details?.appointments.filter((item) => item.status === "scheduled").sort((a, b) => a.startsAt - b.startsAt) ?? [];

  return <Screen>
    <AppHeader back title={sw ? "Hatua zinazofuata" : "Next steps"} eyebrow="HAKI YANGU" />
    {!isSignedIn ? <State icon="lock-closed-outline" title={sw ? "Hatua zako zinalindwa" : "Your next steps are private"} body={sw ? "Ingia kuona hali ya kesi yako." : "Sign in to see your case progress."} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : details === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia hatua" : "Loading next steps"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !details ? <State icon="folder-outline" title={sw ? "Kesi haipatikani" : "Case not found"} body={sw ? "Huenda imebadilika au huna ruhusa ya kuiona." : "It may have changed, or you may not have access to it."} />
      : <>
        <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="arrow-forward" size={29} color={colors.surface} /></View><Text style={styles.heroTitle}>{sw ? "Tuko nawe hatua kwa hatua." : "We are with you, step by step."}</Text><Text style={styles.heroBody}>{sw ? "Angalia mambo yanayohusiana na kesi yako na chagua unachohitaji sasa." : "See what relates to your case and choose what you need now."}</Text></View>
        <Text style={styles.reference}>{details.case.publicId}</Text>
        {details.outcome ? <Step number="1" icon="reader-outline" title={sw ? "Soma matokeo ya kesi" : "Read your case outcome"} body={sw ? "Angalia kile kilichorekodiwa na timu ya msaada." : "See what your support team recorded."} action={sw ? "Angalia matokeo" : "View outcome"} onPress={() => router.push({ pathname: "/case-outcome/[id]", params: { id } })} />
          : <Step number="1" icon="time-outline" title={sw ? "Fuatilia hali ya kesi" : "Follow case progress"} body={sw ? "Matokeo hayajarekodiwa bado. Taarifa mpya zitaonekana kwenye kesi yako." : "An outcome has not been recorded yet. New updates will appear in your case."} action={sw ? "Fungua kesi" : "Open case"} onPress={() => router.push({ pathname: "/case/[id]", params: { id } })} />}
        {appointments.length ? <Step number="2" icon="calendar-outline" title={sw ? "Miadi inayofuata" : "Your next appointment"} body={new Date(appointments[0].startsAt).toLocaleString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "full", timeStyle: "short" })} action={sw ? "Angalia miadi" : "View appointment"} onPress={() => router.push({ pathname: "/appointment/[id]", params: { id: appointments[0]._id } })} />
          : <Step number="2" icon="document-text-outline" title={sw ? "Weka nyaraka karibu" : "Keep your documents together"} body={sw ? "Hifadhi nakala za barua, makubaliano na nyaraka zinazohusiana ikiwa ni salama kufanya hivyo." : "Keep copies of relevant letters, agreements and records when it is safe to do so."} action={sw ? "Nyaraka zangu" : "My documents"} onPress={() => router.push("/documents")} />}
        <Step number="3" icon="chatbubbles-outline" title={sw ? "Uliza swali au toa taarifa" : "Ask a question or share an update"} body={sw ? "Wasiliana na timu ya kesi kupitia mazungumzo salama." : "Contact your case team through the secure conversation."} action={sw ? "Fungua ujumbe" : "Open messages"} onPress={() => router.push({ pathname: "/case/[id]", params: { id, section: "messages" } })} />
        <View style={styles.support}><Ionicons name="heart-outline" size={28} color={colors.burgundy} /><Text style={styles.supportTitle}>{sw ? "Bado unahitaji msaada?" : "Still need help?"}</Text><Text style={styles.supportBody}>{sw ? "Ikiwa tatizo linaendelea au msaada haukutosha, mwambie LSF." : "If the problem continues or the support was not enough, tell LSF."}</Text><Button label={sw ? "Omba LSF ipitie" : "Ask LSF to review"} onPress={() => router.push({ pathname: "/case-review/[id]", params: { id } })} /></View>
      </>}
  </Screen>;
}

function Step({ number, icon, title, body, action, onPress }: { number: string; icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action: string; onPress: () => void }) { return <View style={styles.step}><View style={styles.stepNumber}><Text style={styles.stepNumberText}>{number}</Text></View><View style={styles.stepCopy}><Ionicons name={icon} size={25} color={colors.burgundy} /><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepBody}>{body}</Text><Button label={action} variant="secondary" onPress={onPress} /></View></View>; }
function State({ icon, title, body, action, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onPress?: () => void }) { return <View style={styles.state}><Ionicons name={icon} size={35} color={colors.burgundy} /><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepBody}>{body}</Text>{action && onPress ? <Button label={action} onPress={onPress} /> : null}</View>; }

const styles = StyleSheet.create({
  hero: { marginTop: spacing.md, padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.burgundy, gap: spacing.sm }, heroIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" },
  heroTitle: { marginTop: spacing.md, fontFamily: type.bold, color: colors.surface, fontSize: 25, lineHeight: 31 }, heroBody: { fontFamily: type.regular, color: colors.surface, fontSize: 14, lineHeight: 21 },
  reference: { marginVertical: spacing.xl, fontFamily: type.bold, color: colors.burgundy, fontSize: 13 }, step: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg }, stepNumber: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundy }, stepNumberText: { fontFamily: type.bold, color: colors.surface },
  stepCopy: { flex: 1, gap: spacing.sm, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: spacing.lg }, stepTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 18, lineHeight: 24 }, stepBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  support: { marginTop: spacing.md, padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.burgundySoft, gap: spacing.md }, supportTitle: { fontFamily: type.bold, color: colors.burgundy, fontSize: 20 }, supportBody: { fontFamily: type.regular, color: colors.ink, fontSize: 14, lineHeight: 21 },
  state: { marginTop: spacing.xxl, borderRadius: radius.lg, backgroundColor: colors.burgundySoft, padding: spacing.xl, alignItems: "center", gap: spacing.md },
});
