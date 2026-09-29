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

type Decision = "reviewed" | "escalated" | "case_follow_up" | "false_positive";

export default function SaadaRiskReviewScreen() {
  useSensitiveScreenProtection("saada-risk-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff"].includes(role));
  const risks = useQuery(api.sara_chat.getRiskEvents, allowed ? {} : "skip");
  const risk = risks?.find((item) => item._id === id);
  const resolve = useMutation(api.sara_chat.resolveRiskEvent);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save() {
    if (!risk || !decision || note.trim().length < 10 || busy) return;
    setBusy(true); setError("");
    try { await resolve({ eventId: risk._id, dispositionStatus: decision, reviewNote: note.trim() }); setSaved(true); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Kagua alama ya Saada" : "Review Saada flag"} eyebrow="LSF · AI GOVERNANCE" />
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <State text={sw ? "Ufikiaji haujaruhusiwa" : "Access not authorised"} /> : risks === undefined ? <State text={sw ? "Inapakia alama..." : "Loading flagged response..."} /> : !risk ? <State text={sw ? "Alama hii haipatikani." : "This flag is unavailable."} /> : <>
      <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="shield-half-outline" size={29} color={colors.burgundy} /></View><Text style={styles.kicker}>{risk.eventType.replaceAll("_", " ").toUpperCase()}</Text><Text style={styles.heroTitle}>{sw ? "Binadamu apitie kabla ya hatua inayofuata." : "A human reviews the next step."}</Text><Text style={styles.heroBody}>{sw ? "Alama ya AI si uamuzi wa kisheria au tathmini ya dharura yenyewe." : "An AI flag is not itself a legal decision or an emergency assessment."}</Text></View>
      <Surface tone={risk.eventType === "emergency_keyword" ? "orange" : "pink"} style={styles.card}><Text style={styles.label}>{sw ? "MUHTASARI WA TUKIO" : "EVENT SUMMARY"}</Text><Text style={styles.title}>{risk.eventType.replaceAll("_", " ")}</Text><Text style={styles.body}>{risk.messagePreview || (sw ? "Hakuna muhtasari uliorekodiwa." : "No preview was recorded.")}</Text><Text style={styles.muted}>{sw ? "Hali" : "Status"}: {(risk.dispositionStatus ?? "open").replaceAll("_", " ")}</Text><Text style={styles.muted}>{new Date(risk.createdAt).toLocaleString(sw ? "sw-TZ" : "en-TZ")}</Text></Surface>
      {risk.reviewNote ? <Surface style={styles.card}><Text style={styles.label}>{sw ? "SABABU ILIYOREKODIWA" : "RECORDED REVIEW NOTE"}</Text><Text style={styles.body}>{risk.reviewNote}</Text></Surface> : null}
      {saved ? <Surface tone="teal" style={styles.card}><Ionicons name="checkmark-circle" size={32} color={colors.teal} /><Text style={styles.title}>{sw ? "Uamuzi umehifadhiwa" : "Decision recorded"}</Text><Button label={sw ? "Rudi kwenye utawala" : "Back to governance"} onPress={() => router.replace("/governance")} /></Surface> : (risk.dispositionStatus ?? "open") !== "open" ? <Surface tone="teal" style={styles.card}><Text style={styles.title}>{sw ? "Tukio hili tayari limepitiwa." : "This event has already been reviewed."}</Text><Text style={styles.muted}>{sw ? "Mabadiliko zaidi yanahitaji mchakato wa ufuatiliaji." : "Further action needs a follow-up process."}</Text></Surface> : <>
        <Text style={styles.sectionTitle}>{sw ? "Hatua ya ukaguzi" : "Review disposition"}</Text>
        <View style={styles.options}><Option active={decision === "escalated"} title={sw ? "Pandisha kwa timu husika" : "Escalate to the relevant team"} icon="arrow-up-circle-outline" onPress={() => setDecision("escalated")} /><Option active={decision === "case_follow_up"} title={sw ? "Ufuatiliaji wa kesi" : "Case follow-up required"} icon="folder-open-outline" onPress={() => setDecision("case_follow_up")} /><Option active={decision === "reviewed"} title={sw ? "Imepitiwa" : "Reviewed"} icon="checkmark-circle-outline" onPress={() => setDecision("reviewed")} /><Option active={decision === "false_positive"} title={sw ? "Alama isiyo sahihi" : "False positive"} icon="close-circle-outline" onPress={() => setDecision("false_positive")} /></View>
        <Surface tone="pink" style={styles.card}><Text style={styles.title}>{sw ? "Andika sababu ya uamuzi" : "Record the decision reason"}</Text><TextInput multiline maxLength={1000} value={note} onChangeText={setNote} placeholder={sw ? "Ulichokagua na hatua inayohitajika..." : "What you checked and what should happen next..."} placeholderTextColor={colors.inkMuted} style={styles.input} /><Text style={styles.muted}>{note.trim().length}/1000 · {sw ? "Angalau herufi 10" : "At least 10 characters"}</Text>{decision ? <Button label={sw ? "Thibitisha na hifadhi" : "Confirm and record"} loading={busy} disabled={busy || note.trim().length < 10} onPress={() => void save()} /> : null}</Surface>
      </>}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </>}
  </Screen>;
}

function State({ text }: { text: string }) { return <Surface tone="orange" style={styles.card}><Text style={styles.title}>{text}</Text></Surface>; }
function Option({ title, icon, active, onPress }: { title: string; icon: keyof typeof Ionicons.glyphMap; active: boolean; onPress: () => void }) { return <Pressable accessibilityRole="radio" accessibilityState={{ checked: active }} onPress={onPress} style={[styles.option, active && styles.optionActive]}><Ionicons name={icon} size={21} color={colors.burgundy} /><Text style={styles.optionText}>{title}</Text><Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /></Pressable>; }
const styles = StyleSheet.create({ hero: { marginTop: spacing.sm, backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 26, lineHeight: 32 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, card: { marginTop: spacing.lg, gap: spacing.md }, label: { color: colors.burgundy, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md, color: colors.ink, fontFamily: type.bold, fontSize: 19 }, options: { gap: spacing.sm }, option: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 60, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md }, optionActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, optionText: { flex: 1, color: colors.ink, fontFamily: type.medium, fontSize: 14 }, input: { minHeight: 120, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: spacing.md, color: colors.ink, textAlignVertical: "top", backgroundColor: colors.surface }, error: { marginVertical: spacing.md, color: colors.danger, fontFamily: type.medium } });
