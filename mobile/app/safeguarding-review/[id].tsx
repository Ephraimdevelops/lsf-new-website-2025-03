import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

export default function SafeguardingReviewScreen() {
  useSensitiveScreenProtection("safeguarding-review");
  const { id, returnTo } = useLocalSearchParams<{ id: string; returnTo?: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff", "supervisor", "safeguarding_officer"].includes(role));
  const submitted = useQuery(api.caseManagement.staffReviewRequests, allowed ? { status: "submitted" } : "skip");
  const inReview = useQuery(api.caseManagement.staffReviewRequests, allowed ? { status: "under_review" } : "skip");
  const row = [...(submitted ?? []), ...(inReview ?? [])].find((item) => item.review._id === id);
  const queueRoute = returnTo === "supervision" ? "/supervision" : "/safeguarding";
  const resolveReview = useMutation(api.caseManagement.resolveCaseReviewRequest);
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState<"resolved" | "declined" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  async function update(status: "under_review" | "resolved" | "declined") {
    if (!row || busy) return;
    if (status !== "under_review" && note.trim().length < 10) { setError(sw ? "Andika sababu ya uamuzi kwa angalau herufi 10." : "Record a decision reason of at least 10 characters."); return; }
    setBusy(true); setError("");
    try {
      await resolveReview({ reviewRequestId: row.review._id, status, resolutionNote: note.trim() || undefined });
      if (status === "under_review") setDecision(null); else setCompleted(true);
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }

  return <Screen>
    <AppHeader back title={returnTo === "supervision" ? (sw ? "Mapitio ya kesi" : "Case review") : (sw ? "Mapitio yaliyolindwa" : "Protected review")} eyebrow="LSF · RESTRICTED" />
    {access === undefined ? <State title={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <State title={sw ? "Ufikiaji haujaruhusiwa" : "Access not authorised"} /> : completed ? <Surface tone="teal" style={styles.state}><Ionicons name="checkmark-circle" size={38} color={colors.teal} /><Text style={styles.title}>{sw ? "Uamuzi umerekodiwa" : "Decision recorded"}</Text><Text style={styles.muted}>{sw ? "Mwombaji ataarifiwa kuhusu hatua hii." : "The requester will receive an update."}</Text><Button label={sw ? "Rudi kwenye foleni" : "Back to queue"} onPress={() => router.replace(queueRoute)} /></Surface> : submitted === undefined || inReview === undefined ? <State title={sw ? "Inapakia ombi..." : "Loading review..."} /> : !row ? <Surface tone="orange" style={styles.state}><Text style={styles.title}>{sw ? "Ombi halipo kwenye foleni yako." : "This review is not in your open queue."}</Text><Button variant="secondary" label={sw ? "Rudi kwenye foleni" : "Back to queue"} onPress={() => router.replace(queueRoute)} /></Surface> : <>
      <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="shield-checkmark-outline" size={30} color={colors.burgundy} /></View><Text style={styles.eyebrow}>{row.case?.publicId ?? (sw ? "KESI ILIYOLINDWA" : "PROTECTED CASE")}</Text><Text style={styles.heroTitle}>{sw ? "Kagua kwa uangalifu. Andika uamuzi." : "Review carefully. Record the decision."}</Text><Text style={styles.heroBody}>{sw ? "Taarifa hizi ziwe ndani ya timu yenye ruhusa pekee." : "Keep these details within the authorised review team."}</Text></View>
      <Surface tone="orange" style={styles.detail}><Text style={styles.label}>{sw ? "SABABU YA MAPITIO" : "REASON FOR REVIEW"}</Text><Text style={styles.title}>{row.review.reason.replaceAll("_", " ")}</Text><Text style={styles.muted}>{row.review.status.replaceAll("_", " ")}</Text><Text style={styles.body}>{row.review.note || (sw ? "Hakuna maelezo ya ziada." : "No additional note was provided.")}</Text></Surface>
      {row.case && access?.roles.some((role) => ["admin", "supervisor"].includes(role)) ? <Button variant="secondary" label={sw ? "Fungua kesi" : "Open case"} onPress={() => router.push({ pathname: "/case/[id]", params: { id: row.case!._id } })} /> : null}
      {row.review.status === "submitted" ? <Surface style={styles.detail}><Text style={styles.title}>{sw ? "Anza ukaguzi" : "Start review"}</Text><Text style={styles.muted}>{sw ? "Ombi litaendelea kuonekana kwenye foleni wakati linapitiwa." : "The item will remain in the queue while it is being reviewed."}</Text><Button label={sw ? "Anza mapitio" : "Start review"} loading={busy} onPress={() => void update("under_review")} /></Surface> : <Surface style={styles.detail}><Text style={styles.title}>{sw ? "Uamuzi wa mapitio" : "Review decision"}</Text><Text style={styles.muted}>{sw ? "Andika hatua zilizochukuliwa au sababu ya kufunga ombi." : "Record the action taken or the reason for closing the request."}</Text><TextInput value={note} onChangeText={setNote} multiline maxLength={1200} style={styles.input} placeholder={sw ? "Matokeo na sababu ya uamuzi..." : "Findings and decision reason..."} placeholderTextColor={colors.inkMuted} /><View style={styles.choices}><Choice label={sw ? "Tatua" : "Resolve"} active={decision === "resolved"} onPress={() => setDecision("resolved")} /><Choice label={sw ? "Kataa" : "Decline"} active={decision === "declined"} onPress={() => setDecision("declined")} /></View>{decision ? <Surface tone="pink" style={styles.confirm}><Text style={styles.title}>{decision === "resolved" ? (sw ? "Thibitisha utatuzi" : "Confirm resolution") : (sw ? "Thibitisha kukataa" : "Confirm decline")}</Text><Text style={styles.muted}>{sw ? "Uamuzi na sababu zitawekwa kwenye rekodi na mwombaji ataarifiwa." : "The decision and reason will be recorded, and the requester notified."}</Text><Button label={decision === "resolved" ? (sw ? "Hifadhi utatuzi" : "Save resolution") : (sw ? "Hifadhi kukataa" : "Save decline")} loading={busy} disabled={busy || note.trim().length < 10} onPress={() => void update(decision)} /></Surface> : null}</Surface>}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </>}
  </Screen>;
}

function State({ title }: { title: string }) { return <Surface tone="orange" style={styles.state}><Text style={styles.title}>{title}</Text></Surface>; }
function Choice({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) { return <Pressable accessibilityRole="radio" accessibilityState={{ checked: active }} aria-checked={active} onPress={onPress} style={[styles.choice, active && styles.choiceActive]}><Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={styles.title}>{label}</Text></Pressable>; }
const styles = StyleSheet.create({ hero: { marginTop: spacing.sm, backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, eyebrow: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 26, lineHeight: 32 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, detail: { marginTop: spacing.lg, gap: spacing.md }, state: { marginTop: spacing.xl, gap: spacing.md }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, label: { color: colors.orange, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, input: { minHeight: 120, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, textAlignVertical: "top", color: colors.ink }, choices: { flexDirection: "row", gap: spacing.sm }, choice: { flex: 1, minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }, choiceActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, confirm: { gap: spacing.md }, error: { color: colors.danger, fontFamily: type.medium, marginVertical: spacing.md } });
