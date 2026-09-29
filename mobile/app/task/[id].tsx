import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

export default function TaskDetailScreen() {
  useSensitiveScreenProtection("paralegal-task");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some((role) => ["paralegal", "provider_staff"].includes(role)) ?? false;
  const openTasks = useQuery(api.caseManagement.myTasks, allowed ? { status: "open" } : "skip");
  const doneTasks = useQuery(api.caseManagement.myTasks, allowed ? { status: "done" } : "skip");
  const completeTask = useMutation(api.caseManagement.completeTask);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const row = [...(openTasks ?? []), ...(doneTasks ?? [])].find((item) => item.task._id === id);

  async function finish() {
    if (!row || saving) return;
    setSaving(true);
    setError("");
    try {
      await completeTask({ taskId: row.task._id });
      setConfirming(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : sw ? "Kazi haijahifadhiwa. Jaribu tena." : "Task was not saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return <Screen>
    <AppHeader back title={sw ? "Maelezo ya kazi" : "Task details"} eyebrow="HAKI YANGU · PARALEGAL" />
    {!isSignedIn ? <State icon="lock-closed-outline" title={sw ? "Kazi za kesi ni za siri" : "Case tasks are private"} body={sw ? "Ingia kuona kazi zako." : "Sign in to view your tasks."} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : access === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia ruhusa" : "Loading access"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !allowed ? <State icon="shield-outline" title={sw ? "Idhini inahitajika" : "Approval required"} body={sw ? "Jukumu la paralegal lazima liidhinishwe kabla ya kuona kazi." : "Your paralegal role must be approved before you can see tasks."} />
      : openTasks === undefined || doneTasks === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia kazi" : "Loading task"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !row ? <State icon="search-outline" title={sw ? "Kazi haipatikani" : "Task not found"} body={sw ? "Huenda imeondolewa au huna ruhusa ya kuiona." : "It may have been removed, or you may not have access to it."} action={sw ? "Rudi kwenye kazi" : "Back to tasks"} onPress={() => router.replace("/paralegal-tasks")} />
      : <>
        <View style={[styles.hero, row.task.status === "done" && styles.heroDone]}><View style={styles.heroIcon}><Ionicons name={row.task.status === "done" ? "checkmark-circle" : "checkbox-outline"} size={32} color={colors.surface} /></View><Text style={styles.heroKicker}>{row.case?.publicId ?? (sw ? "Kesi inalindwa" : "Protected case")}</Text><Text style={styles.heroTitle}>{row.task.title}</Text><Text style={styles.heroBody}>{row.task.status === "done" ? (sw ? "Kazi hii imekamilika." : "This task is complete.") : (sw ? "Kagua muktadha wa kesi kabla ya kukamilisha hatua hii." : "Review the case context before completing this step.")}</Text></View>
        <View style={styles.card}><Info icon="flag-outline" label={sw ? "Hali" : "Status"} value={row.task.status === "done" ? (sw ? "Imekamilika" : "Completed") : (sw ? "Inasubiri" : "To do")} />{row.task.dueAt ? <Info icon="calendar-outline" label={sw ? "Tarehe ya mwisho" : "Due date"} value={new Date(row.task.dueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "long" })} /> : null}{row.task.note ? <Info icon="document-text-outline" label={sw ? "Maelezo" : "Details"} value={row.task.note} /> : null}</View>
        <Text style={styles.sectionTitle}>{sw ? "Fungua kesi kwanza" : "Open the case first"}</Text><Text style={styles.body}>{sw ? "Taarifa za mnufaika, ujumbe, nyaraka na miadi hukaa kwenye sehemu ya kesi iliyoidhinishwa." : "Beneficiary details, messages, documents and appointments stay in the authorised case workspace."}</Text>
        <Button label={sw ? "Fungua kazi kwenye kesi" : "Open tasks in case"} variant="secondary" onPress={() => router.push({ pathname: "/case/[id]", params: { id: row.task.caseId, section: "tasks" } })} />
        {row.task.status === "open" ? confirming ? <View style={styles.confirm}><Ionicons name="help-circle-outline" size={27} color={colors.burgundy} /><Text style={styles.sectionTitle}>{sw ? "Umekamilisha kazi hii?" : "Have you completed this task?"}</Text><Text style={styles.body}>{sw ? "Thibitisha baada ya kufanya hatua husika. Tukio litawekwa kwenye historia ya kesi." : "Confirm after doing the work. The event will appear in the case history."}</Text>{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<Button label={sw ? "Ndiyo, imekamilika" : "Yes, mark complete"} disabled={saving} loading={saving} onPress={() => void finish()} /><Button label={sw ? "Bado" : "Not yet"} variant="quiet" disabled={saving} onPress={() => setConfirming(false)} /></View> : <Button label={sw ? "Weka kazi imekamilika" : "Mark task complete"} onPress={() => setConfirming(true)} /> : null}
        <Button label={sw ? "Rudi kwenye kazi zangu" : "Back to my tasks"} variant="quiet" onPress={() => router.push("/paralegal-tasks")} />
      </>}
  </Screen>;
}

function Info({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) { return <View style={styles.info}><Ionicons name={icon} size={21} color={colors.burgundy} /><View style={styles.flex}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View></View>; }
function State({ icon, title, body, action, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onPress?: () => void }) { return <View style={styles.state}><Ionicons name={icon} size={36} color={colors.burgundy} /><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.body}>{body}</Text>{action && onPress ? <Button label={action} onPress={onPress} /> : null}</View>; }

const styles = StyleSheet.create({
  hero: { marginTop: spacing.md, borderRadius: radius.xl, backgroundColor: colors.ink, padding: spacing.xl, gap: spacing.sm }, heroDone: { backgroundColor: colors.green }, heroIcon: { width: 56, height: 56, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" }, heroKicker: { marginTop: spacing.md, fontFamily: type.bold, color: colors.peach, fontSize: 12 }, heroTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 24, lineHeight: 31 }, heroBody: { fontFamily: type.regular, color: colors.surface, fontSize: 14, lineHeight: 21 },
  card: { marginTop: spacing.xl, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, paddingHorizontal: spacing.lg }, info: { flexDirection: "row", gap: spacing.md, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.line }, flex: { flex: 1 }, label: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 }, value: { marginTop: spacing.xs, fontFamily: type.bold, color: colors.ink, fontSize: 15, lineHeight: 21 }, sectionTitle: { marginTop: spacing.xl, fontFamily: type.bold, color: colors.ink, fontSize: 19 }, body: { marginVertical: spacing.md, fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  confirm: { marginTop: spacing.xl, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.burgundySoft, gap: spacing.sm }, error: { fontFamily: type.medium, color: colors.danger }, state: { marginTop: spacing.xl, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.burgundySoft, alignItems: "center", gap: spacing.md },
});
