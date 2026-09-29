import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../src/auth";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function ParalegalTasksScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const [view, setView] = useState<"open" | "done">("open");
  const [busyId, setBusyId] = useState<string | null>(null);
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some((role) => ["paralegal", "provider_staff"].includes(role)) ?? false;
  const rows = useQuery(api.caseManagement.myTasks, allowed ? { status: view } : "skip");
  const completeTask = useMutation(api.caseManagement.completeTask);

  async function finish(taskId: Parameters<typeof completeTask>[0]["taskId"]) {
    setBusyId(taskId);
    try { await completeTask({ taskId }); }
    catch (error) { Alert.alert(sw ? "Haikuhifadhiwa" : "Could not save", error instanceof Error ? error.message : String(error)); }
    finally { setBusyId(null); }
  }

  const header = <AppHeader back title={sw ? "Kazi zangu" : "My tasks"} eyebrow="HAKI YANGU · PARALEGAL" />;
  if (!isSignedIn) return <Screen>{header}<View style={styles.hero}><Ionicons name="checkbox-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{sw ? "Jua kinachohitaji hatua leo." : "Know what needs action today."}</Text><Text style={styles.heroBody}>{sw ? "Kazi za kesi, tarehe za kufuatilia na hatua zilizokamilika hukaa hapa." : "Case tasks, follow-up dates and completed steps stay here."}</Text></View><AccessCard sw={sw} signedOut /></Screen>;
  if (access === undefined) return <Screen>{header}<Text style={styles.muted}>{sw ? "Tunapakia ruhusa..." : "Loading access..."}</Text></Screen>;
  if (!allowed) return <Screen>{header}<AccessCard sw={sw} /></Screen>;

  return <Screen>{header}
    <View style={styles.hero}><Ionicons name="checkbox-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{sw ? "Kazi zako, kwa mpangilio." : "Your work, in order."}</Text><Text style={styles.heroBody}>{sw ? "Fungua kesi ili kuona muktadha kabla ya kuchukua hatua." : "Open the case for context before taking action."}</Text></View>
    <View style={styles.tabs}>{(["open", "done"] as const).map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: view === item }} onPress={() => setView(item)} style={[styles.tab, view === item && styles.tabActive]}><Text style={[styles.tabText, view === item && styles.tabTextActive]}>{item === "open" ? (sw ? "Zinazosubiri" : "To do") : (sw ? "Zimekamilika" : "Done")}</Text></Pressable>)}</View>
    {rows === undefined ? <Text style={styles.muted}>{sw ? "Tunapakia kazi..." : "Loading tasks..."}</Text>
    : rows.length === 0 ? <View style={styles.empty}><Ionicons name={view === "open" ? "checkmark-circle-outline" : "folder-open-outline"} size={36} color={colors.teal} /><Text style={styles.emptyTitle}>{view === "open" ? (sw ? "Hakuna kazi wazi" : "No open tasks") : (sw ? "Hakuna kazi iliyokamilika" : "No completed tasks")}</Text><Text style={styles.muted}>{sw ? "Kazi zilizounganishwa na kesi zako zitaonekana hapa." : "Tasks linked to your cases will appear here."}</Text></View>
    : rows.map(({ task, case: caseRecord }) => <View key={task._id} style={styles.card}>
      <View style={styles.cardTop}><View style={[styles.taskIcon, task.status === "done" && styles.taskIconDone]}><Ionicons name={task.status === "done" ? "checkmark" : "square-outline"} size={20} color={task.status === "done" ? colors.surface : colors.burgundy} /></View><View style={styles.copy}><Text style={styles.taskTitle}>{task.title}</Text><Text style={styles.caseRef}>{caseRecord?.publicId ?? (sw ? "Kesi inalindwa" : "Case protected")}</Text></View></View>
      {task.note ? <Text style={styles.taskNote}>{task.note}</Text> : null}
      {task.dueAt ? <View style={styles.due}><Ionicons name="time-outline" size={17} color={task.dueAt < Date.now() && task.status === "open" ? colors.danger : colors.inkMuted} /><Text style={[styles.dueText, task.dueAt < Date.now() && task.status === "open" && styles.overdue]}>{task.dueAt < Date.now() && task.status === "open" ? (sw ? "Imechelewa · " : "Overdue · ") : ""}{new Date(task.dueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { day: "numeric", month: "short", year: "numeric" })}</Text></View> : null}
      <Button label={sw ? "Angalia kazi na muktadha" : "View task details"} variant="secondary" onPress={() => router.push({ pathname: "/task/[id]", params: { id: task._id } })} />
      <View style={styles.actions}><Pressable accessibilityRole="button" style={styles.caseLink} onPress={() => router.push({ pathname: "/case/[id]", params: { id: task.caseId } })}><Text style={styles.caseLinkText}>{sw ? "Fungua kesi" : "Open case"}</Text><Ionicons name="arrow-forward" size={16} color={colors.burgundy} /></Pressable>{task.status === "open" ? <Pressable accessibilityRole="button" disabled={busyId === task._id} style={[styles.doneButton, busyId === task._id && styles.disabled]} onPress={() => Alert.alert(sw ? "Thibitisha kazi" : "Complete task", sw ? `Je, umekamilisha “${task.title}”?` : `Have you completed “${task.title}”?`, [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Ndiyo" : "Yes", onPress: () => void finish(task._id) }])}><Text style={styles.doneText}>{busyId === task._id ? (sw ? "Inahifadhi..." : "Saving...") : (sw ? "Maliza" : "Mark done")}</Text></Pressable> : null}</View>
    </View>)}
  </Screen>;
}

function AccessCard({ sw, signedOut = false }: { sw: boolean; signedOut?: boolean }) {
  return <View style={styles.empty}><Ionicons name="lock-closed-outline" size={34} color={colors.burgundy} /><Text style={styles.emptyTitle}>{signedOut ? (sw ? "Ingia kuona kazi zako" : "Sign in to see your tasks") : (sw ? "Idhini ya paralegal inahitajika" : "Paralegal approval required")}</Text><Text style={styles.muted}>{signedOut ? (sw ? "Kazi za kesi ni za siri na zinahitaji akaunti iliyoidhinishwa." : "Case tasks are private and require an approved account.") : (sw ? "LSF lazima iidhinishe jukumu lako kabla kazi hazijaonekana." : "LSF must approve your role before tasks become available.")}</Text><Button label={signedOut ? (sw ? "Ingia salama" : "Sign in securely") : (sw ? "Angalia kujiunga" : "View onboarding")} onPress={() => router.push(signedOut ? "/sign-in" : "/paralegal-onboarding")} /></View>;
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, backgroundColor: colors.ink, padding: spacing.xl, gap: spacing.sm }, heroTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 25, lineHeight: 31 }, heroBody: { fontFamily: type.regular, color: "#E5DDE1", fontSize: 13, lineHeight: 20 },
  tabs: { flexDirection: "row", gap: spacing.sm, marginVertical: spacing.lg }, tab: { flex: 1, minHeight: 45, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface }, tabActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, tabText: { fontFamily: type.bold, color: colors.inkMuted, fontSize: 13 }, tabTextActive: { color: colors.surface },
  card: { marginBottom: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.md }, cardTop: { flexDirection: "row", gap: spacing.md }, taskIcon: { width: 43, height: 43, borderRadius: 13, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, taskIconDone: { backgroundColor: colors.teal }, copy: { flex: 1 }, taskTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 16, lineHeight: 21 }, caseRef: { marginTop: 4, fontFamily: type.medium, color: colors.burgundy, fontSize: 12 }, taskNote: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 }, due: { flexDirection: "row", alignItems: "center", gap: spacing.xs }, dueText: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 }, overdue: { color: colors.danger }, actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm }, caseLink: { flex: 1, minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, borderWidth: 1, borderColor: colors.burgundy, borderRadius: radius.pill }, caseLinkText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 12 }, doneButton: { flex: 1, minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: radius.pill, backgroundColor: colors.burgundy }, doneText: { fontFamily: type.bold, color: colors.surface, fontSize: 12 }, disabled: { opacity: 0.5 },
  empty: { marginTop: spacing.lg, alignItems: "center", gap: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.xl }, emptyTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 18, textAlign: "center" }, muted: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20, textAlign: "center" },
});
