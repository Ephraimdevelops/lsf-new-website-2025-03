import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

type EvidenceDecision = "accepted" | "rejected";

export default function StaffReferralDetailScreen() {
  useSensitiveScreenProtection("referral-oversight-detail");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff", "supervisor"].includes(role));
  const detail = useQuery(api.referrals.getForStaff, allowed && id ? { referralId: id as Id<"referrals"> } : "skip");
  const reviewEvidence = useMutation(api.referrals.reviewConsentEvidence);
  const [decision, setDecision] = useState<EvidenceDecision | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  async function saveDecision() {
    if (!detail?.consent || !decision || busy) return;
    if (decision === "rejected" && note.trim().length < 10) { setError(sw ? "Eleza sababu ya kukataa ushahidi." : "Explain why the evidence is rejected."); return; }
    setBusy(true); setError("");
    try {
      await reviewEvidence({ consentId: detail.consent._id, status: decision, reviewNotes: note.trim() || undefined });
      setCompleted(true);
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }

  function confirmDecision() {
    if (!decision) return;
    Alert.alert(sw ? "Thibitisha ukaguzi" : "Confirm evidence review", sw ? "Huu ni uamuzi kuhusu faili la ushahidi pekee; hauwezi kuchukua nafasi ya ridhaa ya mnufaika." : "This decision concerns the evidence file only; it does not replace beneficiary consent.", [
      { text: sw ? "Ghairi" : "Cancel", style: "cancel" },
      { text: decision === "accepted" ? (sw ? "Kubali ushahidi" : "Accept evidence") : (sw ? "Kataa ushahidi" : "Reject evidence"), onPress: () => void saveDecision() },
    ]);
  }

  async function openEvidence() {
    if (!detail?.consentEvidenceUrl) return;
    try { await Linking.openURL(detail.consentEvidenceUrl); }
    catch { setError(sw ? "Faili halijafunguka. Jaribu tena." : "The file could not be opened. Please try again."); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Maelezo ya rufaa" : "Referral details"} eyebrow="LSF · RESTRICTED" />
    {access === undefined ? <State title={sw ? "Inapakia ruhusa..." : "Loading access..."} />
      : !allowed ? <State title={sw ? "Ruhusa ya LSF inahitajika." : "LSF access is required."} />
      : detail === undefined ? <State title={sw ? "Inapakia rufaa..." : "Loading referral..."} />
      : !detail ? <State title={sw ? "Rufaa haipatikani." : "Referral not found."} />
      : <>
        <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="git-compare-outline" size={27} color={colors.burgundy} /></View><Text style={styles.kicker}>{detail.referral.publicId}</Text><Text style={styles.heroTitle}>{sw ? "Angalia ridhaa na hatua ya huduma." : "Check consent and the service handoff."}</Text><Text style={styles.heroBody}>{sw ? "Taarifa hizi ni kwa timu yenye ruhusa. Uamuzi wa ushahidi haupaswi kutuma rufaa kimya kimya." : "These details are for authorised staff. Reviewing evidence must not silently send a referral."}</Text></View>
        <Surface tone={detail.referral.status === "awaiting_beneficiary_consent" ? "orange" : "pink"} style={styles.block}><Text style={styles.label}>{sw ? "HALI YA SASA" : "CURRENT STATUS"}</Text><Text style={styles.title}>{detail.referral.status.replaceAll("_", " ")}</Text><Info label={sw ? "Kesi" : "Case"} value={detail.case?.publicId ?? "—"} /><Info label={sw ? "Huduma inayopelekewa" : "Destination service"} value={detail.destinationService?.name ?? "—"} /><Info label={sw ? "Mtoa huduma" : "Provider"} value={detail.destinationUser?.name ?? (sw ? "Hajatajwa" : "Not assigned")} /></Surface>
        {detail.destinationUnavailable && !["closed", "declined", "returned"].includes(detail.referral.status) ? <Surface tone="orange" style={styles.block}><Text accessibilityRole="alert" style={styles.title}>{sw ? "Mahali pa rufaa hapokei tena" : "Referral destination unavailable"}</Text><Text style={styles.body}>{sw ? "Huduma au taasisi imezimwa. Usitume taarifa nyingine. Kagua kesi na mpange msaada mwingine pamoja na mnufaika." : "The service or organisation is no longer active. Do not share more information. Review the case and arrange another option with the beneficiary."}</Text></Surface> : null}
        <Surface style={styles.block}><Text style={styles.title}>{sw ? "Sababu na taarifa" : "Reason and sharing scope"}</Text><Text style={styles.body}>{detail.referral.reason}</Text>{detail.referral.informationShared.map((item, index) => <View key={`${index}-${item}`} style={styles.listRow}><Ionicons name="checkmark-circle-outline" size={19} color={colors.burgundy} /><Text style={styles.listText}>{item}</Text></View>)}</Surface>
        <Surface tone={detail.consent?.granted ? "teal" : "orange"} style={styles.block}><Text style={styles.title}>{sw ? "Ridhaa ya mnufaika" : "Beneficiary consent"}</Text><Text style={styles.body}>{detail.consent?.granted ? (sw ? "Mnufaika ameidhinisha kushiriki taarifa zilizoorodheshwa." : "The beneficiary approved sharing the listed information.") : (sw ? "Ridhaa haijaidhinishwa. Mtoa huduma hatakiwi kupokea taarifa hizi." : "Consent is not approved. The provider must not receive these details.")}</Text>{detail.consent?.recordedAt ? <Text style={styles.meta}>{new Date(detail.consent.recordedAt).toLocaleString(sw ? "sw-TZ" : "en-TZ")}</Text> : null}</Surface>
        {detail.consent?.evidenceStorageId ? <Surface style={styles.block}><Text style={styles.title}>{sw ? "Ushahidi wa ridhaa" : "Consent evidence"}</Text><Text style={styles.body}>{sw ? "Kagua faili lililopakiwa na uthibitisho wake. Hii ni hatua tofauti na uamuzi wa mnufaika ndani ya programu." : "Inspect the uploaded file and its provenance. This is separate from the beneficiary's in-app decision."}</Text><Info label={sw ? "Hali ya ukaguzi" : "Review status"} value={detail.consent.reviewStatus ?? "pending_review"} />{detail.consentEvidenceUrl ? <Button label={sw ? "Fungua faili la ushahidi" : "Open evidence file"} variant="secondary" onPress={() => void openEvidence()} /> : <Text style={styles.meta}>{sw ? "Faili halipatikani kwa sasa." : "The file is not available right now."}</Text>}
          {detail.consent.reviewStatus === "pending_review" && !completed ? <><View style={styles.choices}>{(["accepted", "rejected"] as EvidenceDecision[]).map((item) => <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: decision === item }} aria-checked={decision === item} onPress={() => setDecision(item)} style={[styles.choice, decision === item && styles.choiceActive]}><Ionicons name={decision === item ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={styles.listText}>{item === "accepted" ? (sw ? "Kubali ushahidi" : "Accept evidence") : (sw ? "Kataa ushahidi" : "Reject evidence")}</Text></Pressable>)}</View>{decision ? <><TextInput value={note} onChangeText={setNote} multiline maxLength={1000} style={styles.input} placeholder={sw ? "Andika sababu za ukaguzi" : "Record review reasons"} placeholderTextColor={colors.inkMuted} />{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<Button label={sw ? "Hifadhi uamuzi wa ushahidi" : "Save evidence decision"} disabled={busy || (decision === "rejected" && note.trim().length < 10)} loading={busy} onPress={confirmDecision} /></> : null}</> : null}
          {completed ? <Text style={styles.success}>{sw ? "Uamuzi wa ushahidi umehifadhiwa." : "Evidence decision recorded."}</Text> : null}
        </Surface> : null}
        {detail.events.length ? <Surface style={styles.block}><Text style={styles.title}>{sw ? "Historia ya rufaa" : "Referral timeline"}</Text>{detail.events.slice(-8).map((event) => <View key={event._id} style={styles.event}><View style={styles.dot} /><View style={styles.flex}><Text style={styles.listText}>{event.type.replaceAll("_", " ")}</Text><Text style={styles.meta}>{new Date(event.occurredAt).toLocaleString(sw ? "sw-TZ" : "en-TZ")}</Text></View></View>)}</Surface> : null}
        {detail.case ? <Button label={sw ? "Angalia kesi ndani ya ruhusa yangu" : "Open case within my access"} variant="secondary" onPress={() => router.push({ pathname: "/case/[id]", params: { id: detail.case!._id } })} /> : null}
        <Button label={sw ? "Rudi kwenye foleni ya rufaa" : "Back to referral queue"} variant="quiet" onPress={() => router.push("/referral-oversight")} />
      </>}
  </Screen>;
}

function State({ title }: { title: string }) { return <Surface tone="orange" style={styles.block}><Text style={styles.title}>{title}</Text></Surface>; }
function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><Text style={styles.meta}>{label}</Text><Text style={styles.infoValue}>{value.replaceAll("_", " ")}</Text></View>; }
const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, padding: spacing.xl, backgroundColor: colors.burgundy, gap: spacing.sm }, heroIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, kicker: { marginTop: spacing.sm, color: colors.peach, fontFamily: type.bold, fontSize: 11 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 26, lineHeight: 32 }, heroBody: { color: "#F9E8EF", fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  block: { marginTop: spacing.md, gap: spacing.sm }, label: { color: colors.burgundy, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 17 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 20 }, meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 }, info: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: spacing.sm }, infoValue: { color: colors.ink, fontFamily: type.medium, fontSize: 14, marginTop: 3 },
  listRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm }, listText: { flex: 1, color: colors.ink, fontFamily: type.medium, fontSize: 13, lineHeight: 19 }, choices: { gap: spacing.sm, marginTop: spacing.sm }, choice: { minHeight: 48, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm }, choiceActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, input: { minHeight: 90, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: spacing.md, textAlignVertical: "top", color: colors.ink }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 13 }, success: { color: colors.success, fontFamily: type.bold, fontSize: 13 }, event: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.line }, dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.burgundy, marginTop: 4 }, flex: { flex: 1 },
});
