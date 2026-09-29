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

export default function SaadaPolicyReviewScreen() {
  useSensitiveScreenProtection("saada-policy-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const isAdmin = access?.roles.includes("admin") ?? false;
  const versions = useQuery(api.sara.listPromptVersions, isAdmin ? {} : "skip");
  const version = versions?.find((item) => item._id === id);
  const review = useMutation(api.sara.reviewPromptVersion);
  const ownSubmission = Boolean(version && access?.user._id === version.submittedBy);
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save() {
    if (!version || !decision || ownSubmission || note.trim().length < 10 || busy) return;
    setBusy(true); setError("");
    try { await review({ id: version._id, decision, reviewNote: note.trim() }); setSaved(true); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Kagua sera ya Saada" : "Review Saada policy"} eyebrow="LSF · AI GOVERNANCE" />
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !isAdmin ? <State text={sw ? "Wasimamizi pekee wanaweza kuona maagizo ya Saada." : "Only administrators can view Saada instructions."} /> : versions === undefined ? <State text={sw ? "Inapakia toleo..." : "Loading version..."} /> : !version ? <State text={sw ? "Toleo halipatikani." : "Version not found."} /> : <>
      <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="options-outline" size={29} color={colors.burgundy} /></View><Text style={styles.kicker}>SAADA · INSTRUCTIONS</Text><Text style={styles.heroTitle}>{sw ? "Toleo" : "Version"} {version.version}</Text><Text style={styles.heroBody}>{sw ? "Kagua maandishi kamili, mipaka na sababu ya mabadiliko kabla ya uamuzi." : "Read the complete instructions, safeguards and change reason before deciding."}</Text></View>
      <Surface tone={version.status === "approved" ? "teal" : "orange"} style={styles.card}><Text style={styles.title}>{sw ? "Hali ya toleo" : "Version status"}</Text><Text style={styles.status}>{version.status.replaceAll("_", " ")}</Text><Text style={styles.muted}>{sw ? "Liliwasilishwa" : "Submitted"}: {new Date(version.submittedAt).toLocaleString(sw ? "sw-TZ" : "en-TZ")}</Text></Surface>
      <Text style={styles.section}>{sw ? "Sababu ya mabadiliko" : "Reason for change"}</Text><Surface style={styles.card}><Text style={styles.body}>{version.changeNote}</Text></Surface>
      <Text style={styles.section}>{sw ? "Maagizo kamili ya Saada" : "Full Saada instructions"}</Text><Surface style={styles.card}><Text selectable style={styles.prompt}>{version.prompt}</Text></Surface>
      {version.reviewNote ? <Surface tone="pink" style={styles.card}><Text style={styles.title}>{sw ? "Sababu ya mkaguzi" : "Reviewer reason"}</Text><Text style={styles.body}>{version.reviewNote}</Text></Surface> : null}
      {saved ? <Surface tone="teal" style={styles.card}><Ionicons name="checkmark-circle" size={32} color={colors.teal} /><Text style={styles.title}>{sw ? "Uamuzi umehifadhiwa" : "Decision recorded"}</Text><Button label={sw ? "Rudi kwenye matoleo" : "Back to versions"} onPress={() => router.replace("/saada-governance")} /></Surface> : version.status !== "pending" ? <Surface tone="teal" style={styles.card}><Text style={styles.muted}>{sw ? "Toleo hili lina uamuzi uliorekodiwa." : "This version already has a recorded decision."}</Text></Surface> : ownSubmission ? <Surface tone="orange" style={styles.card}><Ionicons name="shield-outline" size={25} color={colors.orange} /><Text style={styles.title}>{sw ? "Uhakiki huru unahitajika" : "Independent review required"}</Text><Text style={styles.muted}>{sw ? "Huwezi kuidhinisha toleo ulilowasilisha." : "You cannot review the version you submitted."}</Text></Surface> : <>
        <Text style={styles.section}>{sw ? "Uamuzi huru" : "Independent decision"}</Text><Surface tone="pink" style={styles.card}><Text style={styles.muted}>{sw ? "Idhini itafanya toleo hili kuwa hai na kuondoa toleo lililokuwa hai." : "Approval activates this version and retires the currently active one."}</Text><View style={styles.choices}><Choice label={sw ? "Idhinisha" : "Approve"} active={decision === "approved"} onPress={() => setDecision("approved")} /><Choice label={sw ? "Kataa" : "Reject"} active={decision === "rejected"} onPress={() => setDecision("rejected")} /></View><TextInput multiline maxLength={1000} value={note} onChangeText={setNote} placeholder={sw ? "Usalama, usahihi, mipaka na sababu ya uamuzi..." : "Safety, accuracy, boundaries and decision reason..."} placeholderTextColor={colors.inkMuted} style={styles.input} /><Text style={styles.muted}>{note.trim().length}/1000 · {sw ? "Angalau herufi 10" : "At least 10 characters"}</Text>{decision ? <Button label={decision === "approved" ? (sw ? "Thibitisha idhini" : "Confirm approval") : (sw ? "Thibitisha kukataa" : "Confirm rejection")} loading={busy} disabled={busy || note.trim().length < 10} onPress={() => void save()} /> : null}</Surface>
      </>}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </>}
  </Screen>;
}

function State({ text }: { text: string }) { return <Surface tone="orange" style={styles.card}><Text style={styles.title}>{text}</Text></Surface>; }
function Choice({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) { return <Pressable accessibilityRole="radio" accessibilityState={{ checked: active }} onPress={onPress} style={[styles.choice, active && styles.choiceActive]}><Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={styles.title}>{label}</Text></Pressable>; }
const styles = StyleSheet.create({ hero: { marginTop: spacing.sm, backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, card: { marginTop: spacing.lg, gap: spacing.md }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, status: { color: colors.burgundy, fontFamily: type.bold, fontSize: 14, textTransform: "capitalize" }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, section: { marginTop: spacing.xl, marginBottom: spacing.md, color: colors.ink, fontFamily: type.bold, fontSize: 19 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, prompt: { color: colors.ink, fontFamily: type.regular, fontSize: 14, lineHeight: 22 }, choices: { flexDirection: "row", gap: spacing.sm }, choice: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: spacing.sm, minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface }, choiceActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, input: { minHeight: 120, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, textAlignVertical: "top", color: colors.ink }, error: { color: colors.danger, fontFamily: type.medium, marginVertical: spacing.md } });
