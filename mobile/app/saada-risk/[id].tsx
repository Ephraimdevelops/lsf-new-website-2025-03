import { plainError } from "../../../shared/plainLanguage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { AdminIntro as CivicPageIntro } from "../../src/admin/AdminIntro";
import { AdminScreen as Screen } from "../../src/admin/AdminScreen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

type Decision = "reviewed" | "escalated" | "case_follow_up" | "false_positive";

export default function SaadaRiskReviewScreen() {
  useSensitiveScreenProtection("saada-risk-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff"].includes(role));
  const risk = useQuery(api.sara_chat.getRiskEventForReview, allowed && id ? { eventId: id as Id<"saada_risk_events"> } : "skip");
  const resolve = useMutation(api.sara_chat.resolveRiskEvent);
  const claimFollowUp = useMutation(api.sara_chat.claimRiskFollowUp);
  const completeFollowUp = useMutation(api.sara_chat.completeRiskFollowUp);
  const releaseFollowUp = useMutation(api.sara_chat.releaseRiskFollowUp);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [outcome, setOutcome] = useState("");
  const [releaseReason, setReleaseReason] = useState("");

  async function save() {
    if (!risk || !decision || note.trim().length < 10 || busy) return;
    setBusy(true); setError("");
    try { await resolve({ eventId: risk._id, dispositionStatus: decision, reviewNote: note.trim() }); setSaved(true); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }

  async function claim() {
    if (!risk || busy) return;
    setBusy(true); setError("");
    try { await claimFollowUp({ eventId: risk._id }); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }
  async function complete() {
    if (!risk || busy || outcome.trim().length < 10) return;
    setBusy(true); setError("");
    try { await completeFollowUp({ eventId: risk._id, outcome: outcome.trim() }); setOutcome(""); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }
  async function release() {
    if (!risk || busy || releaseReason.trim().length < 10) return;
    setBusy(true); setError("");
    try { await releaseFollowUp({ eventId: risk._id, reason: releaseReason.trim() }); setReleaseReason(""); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Kagua jibu la AI lililotiwa alama" : "Review Haki Yangu AI flag"} eyebrow="LSF · AI GOVERNANCE" />
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <State text={sw ? "Ufikiaji haujaruhusiwa" : "Access not authorised"} /> : risk === undefined ? <State text={sw ? "Inapakia alama..." : "Loading flagged response..."} /> : !risk ? <State text={sw ? "Alama hii haipatikani." : "This flag is unavailable."} /> : <>
      <CivicPageIntro icon="shield-half-outline" eyebrow="HAKI YANGU AI · HUMAN REVIEW" title={sw ? "Pitia kabla ya hatua inayofuata." : "Review before the next step."} description={sw ? "Alama ya AI si uamuzi wa kisheria wala tathmini ya dharura." : "An AI flag is not a legal decision or an emergency assessment."} tone="orange" />
      <Surface tone={risk.eventType === "emergency_keyword" ? "orange" : "pink"} style={styles.card}><Text style={styles.label}>{sw ? "MUHTASARI WA TUKIO" : "EVENT SUMMARY"}</Text><Text style={styles.title}>{risk.eventType.replaceAll("_", " ")}</Text><Text style={styles.body}>{risk.messagePreview || (sw ? "Hakuna muhtasari uliorekodiwa." : "No preview was recorded.")}</Text><Text style={styles.muted}>{sw ? "Hali" : "Status"}: {(risk.dispositionStatus ?? "open").replaceAll("_", " ")}</Text><Text style={styles.muted}>{new Date(risk.createdAt).toLocaleString(sw ? "sw-TZ" : "en-TZ")}</Text></Surface>
      {risk.reviewNote ? <Surface style={styles.card}><Text style={styles.label}>{sw ? "SABABU ILIYOREKODIWA" : "RECORDED REVIEW NOTE"}</Text><Text style={styles.body}>{risk.reviewNote}</Text></Surface> : null}
      {saved ? <Surface tone="teal" style={styles.card}><Ionicons name="checkmark-circle" size={32} color={colors.teal} /><Text style={styles.title}>{sw ? "Uamuzi umehifadhiwa" : "Decision recorded"}</Text><Button label={sw ? "Rudi kwenye orodha" : "Back to review queue"} onPress={() => router.replace("/saada-risk-queue")} /></Surface> : (risk.dispositionStatus ?? "open") !== "open" ? <Surface tone="teal" style={styles.card}><Text style={styles.title}>{sw ? "Tukio hili tayari limepitiwa." : "This event has already been reviewed."}</Text><Text style={styles.muted}>{sw ? "Mabadiliko zaidi yanahitaji mchakato wa ufuatiliaji." : "Further action needs a follow-up process."}</Text></Surface> : <>
        <Text style={styles.sectionTitle}>{sw ? "Hatua ya ukaguzi" : "Review disposition"}</Text>
        <View style={styles.options}><Option active={decision === "escalated"} title={sw ? "Weka alama ya kupandisha" : "Mark for escalation"} icon="arrow-up-circle-outline" onPress={() => setDecision("escalated")} /><Option active={decision === "case_follow_up"} title={sw ? "Weka alama ya ufuatiliaji wa kesi" : "Mark for case follow-up"} icon="folder-open-outline" onPress={() => setDecision("case_follow_up")} /><Option active={decision === "reviewed"} title={sw ? "Imepitiwa" : "Reviewed"} icon="checkmark-circle-outline" onPress={() => setDecision("reviewed")} /><Option active={decision === "false_positive"} title={sw ? "Alama isiyo sahihi" : "False positive"} icon="close-circle-outline" onPress={() => setDecision("false_positive")} /></View>
        {decision === "escalated" || decision === "case_follow_up" ? <Surface tone="orange" style={styles.card}><Text style={styles.muted}>{sw ? "Hii itaweka tukio kwenye orodha ya ufuatiliaji ya LSF. Mfanyakazi atalichukua na kurekodi matokeo. Mawasiliano ya nje bado yafanyike kwa utaratibu wa LSF." : "This places the event in LSF's follow-up queue. A staff member claims it and records the outcome. External contact still follows LSF procedure."}</Text></Surface> : null}
        <Surface tone="pink" style={styles.card}><Text style={styles.title}>{sw ? "Andika sababu ya uamuzi" : "Record the decision reason"}</Text><TextInput multiline maxLength={1000} value={note} onChangeText={setNote} placeholder={sw ? "Ulichokagua na hatua inayohitajika..." : "What you checked and what should happen next..."} placeholderTextColor={colors.inkMuted} style={styles.input} /><Text style={styles.muted}>{note.trim().length}/1000 · {sw ? "Angalau herufi 10" : "At least 10 characters"}</Text>{decision ? <Button label={sw ? "Thibitisha na hifadhi" : "Confirm and record"} loading={busy} disabled={busy || note.trim().length < 10} onPress={() => void save()} /> : null}</Surface>
      </>}
      {risk.dispositionStatus === "escalated" || risk.dispositionStatus === "case_follow_up" ? <Surface tone="orange" style={styles.card}>
        <Text style={styles.title}>{sw ? "Ufuatiliaji wa LSF" : "LSF follow-up"}</Text>
        <Text style={styles.muted}>{sw ? "Huu ni ufuatiliaji wa ndani. Haufungui wala kufunga kesi ya mnufaika." : "This is internal follow-up. It does not open or close a beneficiary case."}</Text>
        <Text style={styles.muted}>{risk.followUpStatus === "completed" ? (sw ? "Umekamilika" : "Completed") : risk.followUpStatus === "in_progress" ? (sw ? "Unafanyiwa kazi" : "In progress") : (sw ? "Unasubiri mfanyakazi" : "Awaiting a staff member")}</Text>
        {!risk.followUpOwnerId && risk.followUpStatus !== "completed" ? <Button label={sw ? "Chukua ufuatiliaji huu" : "Claim this follow-up"} loading={busy} disabled={busy} onPress={() => void claim()} /> : null}
        {risk.followUpStatus === "in_progress" && risk.followUpOwnerId !== access?.user?._id ? <Text style={styles.body}>{sw ? "Mfanyakazi mwingine amechukua ufuatiliaji huu." : "Another staff member has claimed this follow-up."}</Text> : null}
        {risk.followUpStatus === "in_progress" && risk.followUpOwnerId === access?.user?._id ? <>
          <Text style={styles.body}>{sw ? "Rekodi hatua iliyofanyika. Usijumuishe maelezo binafsi yasiyohitajika." : "Record the action taken. Avoid unnecessary personal details."}</Text>
          <Text style={styles.label}>{sw ? "Matokeo ya ufuatiliaji" : "Follow-up outcome"}</Text>
          <TextInput accessibilityLabel={sw ? "Matokeo ya ufuatiliaji" : "Follow-up outcome"} multiline maxLength={2000} value={outcome} onChangeText={setOutcome} placeholder={sw ? "Hatua iliyofanyika na hatua inayofuata..." : "Action taken and next step..."} placeholderTextColor={colors.inkMuted} style={styles.input} />
          <Button label={sw ? "Hifadhi matokeo na kamilisha" : "Record outcome and complete"} disabled={busy || outcome.trim().length < 10} loading={busy} onPress={() => Alert.alert(sw ? "Kamilisha ufuatiliaji?" : "Complete follow-up?", sw ? "Matokeo yatahifadhiwa kwenye rekodi ya LSF." : "The outcome will be saved in the LSF record.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Kamilisha" : "Complete", onPress: () => void complete() }])} />
        </> : null}
        {risk.followUpStatus === "in_progress" && access?.roles.includes("admin") ? <>
          <Text style={styles.label}>{sw ? "Sababu ya kuachia kazi" : "Reason to release assignment"}</Text>
          <TextInput accessibilityLabel={sw ? "Sababu ya kuachia kazi" : "Release reason"} multiline maxLength={1000} value={releaseReason} onChangeText={setReleaseReason} placeholder={sw ? "Kwa nini irudi kwenye orodha?" : "Why should this return to the queue?"} placeholderTextColor={colors.inkMuted} style={styles.input} />
          <Button label={sw ? "Rudisha kwenye orodha" : "Return to queue"} variant="secondary" disabled={busy || releaseReason.trim().length < 10} onPress={() => Alert.alert(sw ? "Rudisha kwenye orodha?" : "Return to queue?", sw ? "Mfanyakazi mwingine ataweza kuchukua ufuatiliaji huu." : "Another staff member will be able to claim this follow-up.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Rudisha" : "Return", onPress: () => void release() }])} />
        </> : null}
        {risk.followUpStatus === "completed" ? <><Text style={styles.label}>{sw ? "Matokeo yaliyorekodiwa" : "Recorded outcome"}</Text><Text style={styles.body}>{risk.followUpOutcome}</Text>{risk.followUpCompletedAt ? <Text style={styles.muted}>{new Date(risk.followUpCompletedAt).toLocaleString(sw ? "sw-TZ" : "en-TZ")}</Text> : null}</> : null}
      </Surface> : null}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </>}
  </Screen>;
}

function State({ text }: { text: string }) { return <Surface tone="orange" style={styles.card}><Text style={styles.title}>{text}</Text></Surface>; }
function Option({ title, icon, active, onPress }: { title: string; icon: keyof typeof Ionicons.glyphMap; active: boolean; onPress: () => void }) { return <Pressable accessibilityRole="radio" accessibilityState={{ checked: active }} aria-checked={active} onPress={onPress} style={[styles.option, active && styles.optionActive]}><Ionicons name={icon} size={21} color={colors.burgundy} /><Text style={styles.optionText}>{title}</Text><Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /></Pressable>; }
const styles = StyleSheet.create({ hero: { marginTop: spacing.sm, backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 26, lineHeight: 32 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, card: { marginTop: spacing.lg, gap: spacing.md }, label: { color: colors.burgundy, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md, color: colors.ink, fontFamily: type.bold, fontSize: 19 }, options: { gap: spacing.sm }, option: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 60, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md }, optionActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, optionText: { flex: 1, color: colors.ink, fontFamily: type.medium, fontSize: 14 }, input: { minHeight: 120, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: spacing.md, color: colors.ink, textAlignVertical: "top", backgroundColor: colors.surface }, error: { marginVertical: spacing.md, color: colors.danger, fontFamily: type.medium } });
