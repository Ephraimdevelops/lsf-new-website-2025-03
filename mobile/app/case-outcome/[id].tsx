import { plainError } from "../../../shared/plainLanguage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { CivicPageHeader as AppHeader } from "../../src/components/CivicPageHeader";
import { ParalegalIntro } from "../../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../../src/components/ParalegalNavigation";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

const outcomes: Record<string, { sw: string; en: string }> = {
  advice_given: { sw: "Ushauri umetolewa", en: "Advice given" },
  document_prepared: { sw: "Nyaraka zimeandaliwa", en: "Document prepared" },
  mediation_supported: { sw: "Usuluhishi umesaidiwa", en: "Mediation supported" },
  referred_to_lawyer: { sw: "Imeelekezwa kwa wakili", en: "Referred to a lawyer" },
  beneficiary_withdrew: { sw: "Ulisitisha msaada", en: "Support withdrawn" },
  other: { sw: "Matokeo mengine", en: "Other outcome" },
};

export default function CaseOutcomeScreen() {
  useSensitiveScreenProtection("case-outcome");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const caseId = id as Id<"cases">;
  const details = useQuery(api.caseManagement.getCase, isSignedIn && id ? { caseId } : "skip");
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const submitFeedback = useMutation(api.caseManagement.submitFeedback);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const isBeneficiary = Boolean(details && access && details.case.beneficiaryId === access.user._id);
  const workCase = Boolean(details?.closureReadiness && access?.roles.some(role => ["paralegal", "provider_staff"].includes(role)) && !isBeneficiary);
  const canGiveFeedback = isBeneficiary && details?.outcome && ["resolved", "closed"].includes(details.case.status) && !details.feedback;

  async function sendFeedback() {
    if (!rating || sending) return;
    setSending(true);
    setError("");
    try {
      await submitFeedback({ caseId, rating, comment: comment.trim() || undefined });
    } catch (caught) {
      setError(plainError(caught, locale, sw ? "Maoni hayajatumwa. Jaribu tena." : "Feedback was not sent. Please try again."));
    } finally {
      setSending(false);
    }
  }

  return <Screen footer={workCase ? <ParalegalNavigation current="cases" /> : undefined}>
    <AppHeader back title={sw ? "Matokeo ya kesi" : "Case outcome"} compact />
    {!isSignedIn ? <State icon="lock-closed-outline" title={sw ? "Matokeo yako yanalindwa" : "Your outcome is private"} body={sw ? "Ingia kuona matokeo ya kesi." : "Sign in to see your case outcome."} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : details === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia matokeo" : "Loading outcome"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !details ? <State icon="folder-outline" title={sw ? "Kesi haipatikani" : "Case not found"} body={sw ? "Huenda imebadilika au huna ruhusa ya kuiona." : "It may have changed, or you may not have access to it."} />
      : <>
        {workCase ? <ParalegalIntro pose="review" title={details.outcome ? (sw ? "Matokeo yamerekodiwa." : "Outcome recorded.") : (sw ? "Rekodi msaada uliotolewa." : "Record the help provided.")} body={sw ? "Pitia kilichofanyika na ukubaliane hatua inayofuata na mnufaika." : "Review what happened and agree the next step with the beneficiary."} /> : <View style={[styles.hero, !details.outcome && styles.heroPending]}>
          <View style={styles.heroIcon}><Ionicons name={details.outcome ? "checkmark-circle" : "time-outline"} size={37} color={details.outcome ? colors.surface : colors.burgundy} /></View>
          <Text style={[styles.heroTitle, !details.outcome && styles.pendingText]}>{details.outcome ? (sw ? "Matokeo yamerekodiwa" : "An outcome is recorded") : (sw ? "Msaada bado unaendelea" : "Support is still in progress")}</Text>
          <Text style={[styles.heroBody, !details.outcome && styles.pendingText]}>{details.outcome ? (sw ? "Hivi ndivyo timu ya kesi ilivyorekodi msaada uliotolewa." : "This is how your case team recorded the support provided.") : (sw ? "Matokeo yataonekana hapa baada ya timu ya kesi kuyarekodi." : "Your outcome will appear here when the case team records it.")}</Text>
        </View>}

        <Text style={styles.reference}>{details.case.publicId}</Text>
        {details.outcome ? <View style={styles.outcomeCard}>
          <Text style={styles.kicker}>{sw ? "KILICHOFANYIKA" : "WHAT HAPPENED"}</Text>
          <Text style={styles.outcomeTitle}>{outcomes[details.outcome.outcomeCode]?.[locale] ?? details.outcome.outcomeCode.replaceAll("_", " ")}</Text>
          <Text style={styles.body}>{details.outcome.summary}</Text>
          <Text style={styles.date}>{new Date(details.outcome.recordedAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "long" })}</Text>
        </View> : null}

        <Text style={styles.sectionTitle}>{sw ? "Hatua inayofuata" : "Your next step"}</Text>
        <View style={styles.nextCard}><Ionicons name="shield-checkmark-outline" size={25} color={colors.burgundy} /><Text style={[styles.body, styles.flex]}>{workCase ? (sw ? "Fuatilia hatua zilizobaki, rekodi matokeo kwenye kesi, na omba ukaguzi wa LSF panapohitajika." : "Follow up on remaining tasks, record the outcome in the case, and ask LSF for review when needed.") : details.case.status === "closed_unresolved" ? (sw ? "Ikiwa bado unahitaji msaada, wasiliana na LSF au anza ombi jipya." : "If you still need help, contact LSF or start a new request.") : details.outcome ? (sw ? "Hifadhi nyaraka muhimu. Ikiwa tatizo linaendelea, unaweza kuomba LSF ipitie kesi yako." : "Keep important documents. If the problem continues, you can ask LSF to review your case.") : (sw ? "Fuatilia kesi yako kwa taarifa kutoka kwa timu ya msaada." : "Follow your case for updates from your support team.")}</Text></View>

        {details.feedback ? <View style={styles.received}><Ionicons name="heart-outline" size={30} color={colors.burgundy} /><Text style={styles.sectionTitle}>{sw ? "Asante kwa maoni yako" : "Thanks for your feedback"}</Text><Text style={styles.body}>{sw ? `Uliipa huduma alama ${details.feedback.rating} kati ya 5.` : `You rated the support ${details.feedback.rating} out of 5.`}</Text>{details.feedback.comment ? <Text style={styles.quote}>{details.feedback.comment}</Text> : null}</View>
          : canGiveFeedback ? <View style={styles.feedback}>
            <Text style={styles.sectionTitle}>{sw ? "Huduma ilikusaidia kiasi gani?" : "How helpful was the support?"}</Text>
            <Text style={styles.body}>{sw ? "Maoni yako huenda kwa LSF kuboresha huduma. Hayabadilishi matokeo ya kesi." : "Your feedback goes to LSF to improve service. It does not change the case outcome."}</Text>
            <View style={styles.stars}>{[1, 2, 3, 4, 5].map((value) => <Pressable key={value} accessibilityRole="button" accessibilityLabel={sw ? `Alama ${value} kati ya 5` : `${value} of 5 stars`} onPress={() => setRating(value)} style={styles.star}><Ionicons name={value <= rating ? "star" : "star-outline"} size={33} color={colors.orange} /></Pressable>)}</View>
            <TextInput value={comment} onChangeText={setComment} multiline maxLength={2000} placeholder={sw ? "Maoni zaidi (si lazima)" : "Anything else? (optional)"} placeholderTextColor={colors.inkMuted} style={styles.input} />
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            <Button label={sw ? "Tuma maoni" : "Submit feedback"} disabled={!rating || sending} loading={sending} onPress={() => void sendFeedback()} />
          </View> : null}

        <View style={styles.actions}>{isBeneficiary ? <><Button label={sw ? "Angalia hatua za ufuatiliaji" : "See follow-up steps"} onPress={() => router.push({ pathname: "/case-follow-up/[id]", params: { id } })} /><Button label={sw ? "Nahitaji msaada zaidi" : "I need more help"} variant="secondary" onPress={() => router.push({ pathname: "/case-review/[id]", params: { id } })} /></> : null}<Button label={sw ? "Fungua kesi yangu" : "Open my case"} variant="quiet" onPress={() => router.push({ pathname: "/case/[id]", params: { id, ...(workCase ? { section: "feedback" } : {}) } })} /></View>
      </>}
  </Screen>;
}

function State({ icon, title, body, action, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onPress?: () => void }) { return <View style={styles.state}><Ionicons name={icon} size={36} color={colors.burgundy} /><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.body}>{body}</Text>{action && onPress ? <Button label={action} onPress={onPress} /> : null}</View>; }

const styles = StyleSheet.create({
  hero: { marginTop: spacing.md, borderRadius: radius.xl, backgroundColor: colors.green, padding: spacing.xl, gap: spacing.sm }, heroPending: { backgroundColor: colors.burgundySoft },
  heroIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" },
  heroTitle: { marginTop: spacing.md, fontFamily: type.bold, fontSize: 25, lineHeight: 31, color: colors.surface }, heroBody: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.surface }, pendingText: { color: colors.burgundy },
  reference: { marginTop: spacing.lg, fontFamily: type.bold, color: colors.burgundy, fontSize: 13 },
  outcomeCard: { marginTop: spacing.md, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, gap: spacing.md },
  kicker: { fontFamily: type.bold, color: colors.burgundy, letterSpacing: 1.1, fontSize: 11 }, outcomeTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 20 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 22 }, date: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  sectionTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 18, lineHeight: 24 }, nextCard: { marginTop: spacing.md, flexDirection: "row", gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.burgundySoft }, flex: { flex: 1 },
  received: { marginTop: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.greenSoft, padding: spacing.xl, gap: spacing.sm }, quote: { fontFamily: type.medium, color: colors.ink, fontSize: 14, lineHeight: 21 },
  feedback: { marginTop: spacing.xl, gap: spacing.md }, stars: { flexDirection: "row", justifyContent: "space-between" }, star: { minWidth: 48, minHeight: 48, justifyContent: "center", alignItems: "center" },
  input: { minHeight: 110, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, fontFamily: type.regular, color: colors.ink, textAlignVertical: "top" }, error: { color: colors.danger, fontFamily: type.medium },
  actions: { marginTop: spacing.xl, gap: spacing.md }, state: { marginTop: spacing.xxl, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.burgundySoft, alignItems: "center", gap: spacing.md },
});
