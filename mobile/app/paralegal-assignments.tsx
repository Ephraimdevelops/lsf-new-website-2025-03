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

export default function ParalegalAssignmentsScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const [tab, setTab] = useState<"offers" | "active">("offers");
  const [busyId, setBusyId] = useState<string | null>(null);
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some((role) => ["paralegal", "provider_staff"].includes(role)) ?? false;
  const offers = useQuery(api.caseManagement.assignmentInbox, allowed ? {} : "skip");
  const cases = useQuery(api.caseManagement.myCases, allowed ? {} : "skip");
  const respond = useMutation(api.caseManagement.respondToAssignment);
  const assignedCases = cases?.filter((record) => record.beneficiaryId !== access?.user._id) ?? [];

  async function decide(assignmentId: Parameters<typeof respond>[0]["assignmentId"], response: "accepted" | "declined") {
    setBusyId(assignmentId);
    try { await respond({ assignmentId, response }); }
    catch (error) { Alert.alert(sw ? "Hatua haijahifadhiwa" : "Could not save", error instanceof Error ? error.message : String(error)); }
    finally { setBusyId(null); }
  }

  const header = <AppHeader back title={sw ? "Kesi nilizopewa" : "My assignments"} eyebrow="HAKI YANGU · PARALEGAL" />;
  if (!isSignedIn) return <Screen>{header}<Hero sw={sw} /><AccessCard sw={sw} signedOut /></Screen>;
  if (access === undefined) return <Screen>{header}<Text style={styles.muted}>{sw ? "Tunapakia ruhusa..." : "Loading access..."}</Text></Screen>;
  if (!allowed) return <Screen>{header}<Hero sw={sw} /><AccessCard sw={sw} /></Screen>;

  return <Screen>{header}<Hero sw={sw} />
    <View style={styles.tabs}>{(["offers", "active"] as const).map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: tab === item }} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.activeTab]}><Text style={[styles.tabText, tab === item && styles.activeTabText]}>{item === "offers" ? (sw ? "Ofa mpya" : "New offers") : (sw ? "Kesi zangu" : "My cases")}</Text></Pressable>)}</View>
    {tab === "offers" ? offers === undefined ? <Text style={styles.muted}>{sw ? "Tunapakia ofa..." : "Loading offers..."}</Text> : offers.length ? offers.map(({ assignment, case: record }) => <View key={assignment._id} style={styles.card}>
      <View style={styles.row}><View style={styles.icon}><Ionicons name="briefcase-outline" size={22} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.cardTitle}>{record?.publicId ?? (sw ? "Kesi inalindwa" : "Protected case")}</Text><Text style={styles.meta}>{record?.priority ? record.priority.replaceAll("_", " ") : (sw ? "Ofa ya kazi" : "Work offer")}</Text></View></View>
      <Text style={styles.summary} numberOfLines={3}>{record?.summary ?? (sw ? "Maelezo yatapatikana baada ya idhini ya kazi." : "Details become available after accepting the offer.")}</Text>
      {assignment.expiresAt ? <Text style={styles.meta}>{sw ? "Jibu kabla ya" : "Respond by"} {new Date(assignment.expiresAt).toLocaleString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })}</Text> : null}
      <Button label={sw ? "Kagua ofa na maelezo" : "Review offer details"} variant="secondary" onPress={() => router.push({ pathname: "/assignment/[id]", params: { id: assignment._id } })} />
      <View style={styles.actions}><Pressable accessibilityRole="button" disabled={busyId === assignment._id} style={styles.decline} onPress={() => Alert.alert(sw ? "Kataa ofa?" : "Decline offer?", sw ? "Ombi hili litarudi kwa timu ya LSF." : "The request will return to the LSF team.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Kataa" : "Decline", onPress: () => void decide(assignment._id, "declined") }])}><Text style={styles.declineText}>{sw ? "Kataa" : "Decline"}</Text></Pressable><Pressable accessibilityRole="button" disabled={busyId === assignment._id} style={styles.accept} onPress={() => Alert.alert(sw ? "Kubali kazi?" : "Accept assignment?", sw ? "Utakuwa sehemu ya timu ya kesi hii." : "You will join this case team.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Kubali" : "Accept", onPress: () => void decide(assignment._id, "accepted") }])}><Text style={styles.acceptText}>{busyId === assignment._id ? (sw ? "Inahifadhi..." : "Saving...") : (sw ? "Kubali" : "Accept")}</Text></Pressable></View>
    </View>) : <Empty sw={sw} kind="offers" />
    : cases === undefined ? <Text style={styles.muted}>{sw ? "Tunapakia kesi..." : "Loading cases..."}</Text> : assignedCases.length ? assignedCases.map((record) => <Pressable key={record._id} accessibilityRole="button" style={styles.caseCard} onPress={() => router.push({ pathname: "/case/[id]", params: { id: record._id } })}><View style={styles.icon}><Ionicons name="folder-open-outline" size={22} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.cardTitle}>{record.publicId}</Text><Text style={styles.summary} numberOfLines={2}>{record.summary}</Text><Text style={styles.meta}>{record.status.replaceAll("_", " ")}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></Pressable>) : <Empty sw={sw} kind="cases" />}
  </Screen>;
}

function Hero({ sw }: { sw: boolean }) { return <View style={styles.hero}><Ionicons name="people-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{sw ? "Pokea kazi. Saidia watu." : "Take work. Support people."}</Text><Text style={styles.heroBody}>{sw ? "Pitia ofa, kubali au kataa, kisha fuatilia kesi ulizopokea." : "Review offers, accept or decline, then follow your active cases."}</Text></View>; }
function Empty({ sw, kind }: { sw: boolean; kind: "offers" | "cases" }) { return <View style={styles.empty}><Ionicons name="folder-open-outline" size={33} color={colors.burgundy} /><Text style={styles.emptyTitle}>{kind === "offers" ? (sw ? "Hakuna ofa mpya" : "No new offers") : (sw ? "Hakuna kesi ulizopewa" : "No assigned cases")}</Text><Text style={styles.muted}>{sw ? "Timu ya LSF itakuarifu kunapokuwa na hatua mpya." : "The LSF team will notify you when there is a new step."}</Text></View>; }
function AccessCard({ sw, signedOut = false }: { sw: boolean; signedOut?: boolean }) { return <View style={styles.empty}><Ionicons name="lock-closed-outline" size={33} color={colors.burgundy} /><Text style={styles.emptyTitle}>{signedOut ? (sw ? "Ingia kuona kazi zako" : "Sign in to see assignments") : (sw ? "Idhini ya paralegal inahitajika" : "Paralegal approval required")}</Text><Text style={styles.muted}>{sw ? "Kesi na ofa zake ni za siri." : "Cases and offers are private."}</Text><Button label={signedOut ? (sw ? "Ingia salama" : "Sign in securely") : (sw ? "Angalia kujiunga" : "View onboarding")} onPress={() => router.push(signedOut ? "/sign-in" : "/paralegal-onboarding")} /></View>; }

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, backgroundColor: colors.ink, padding: spacing.xl, gap: spacing.sm }, heroTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 25 }, heroBody: { fontFamily: type.regular, color: "#E6DCE1", fontSize: 13, lineHeight: 20 }, tabs: { flexDirection: "row", gap: spacing.sm, marginVertical: spacing.lg }, tab: { flex: 1, minHeight: 45, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, activeTab: { borderColor: colors.burgundy, backgroundColor: colors.burgundy }, tabText: { fontFamily: type.bold, color: colors.inkMuted, fontSize: 13 }, activeTabText: { color: colors.surface },
  card: { gap: spacing.md, marginBottom: spacing.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface }, row: { flexDirection: "row", alignItems: "center", gap: spacing.md }, icon: { width: 43, height: 43, borderRadius: 14, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, flex: { flex: 1 }, cardTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 15 }, meta: { marginTop: 4, fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 }, summary: { fontFamily: type.regular, color: colors.ink, fontSize: 13, lineHeight: 19 }, actions: { flexDirection: "row", gap: spacing.sm }, decline: { flex: 1, minHeight: 44, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.burgundy, alignItems: "center", justifyContent: "center" }, declineText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 13 }, accept: { flex: 1, minHeight: 44, borderRadius: radius.pill, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" }, acceptText: { fontFamily: type.bold, color: colors.surface, fontSize: 13 }, caseCard: { minHeight: 82, marginBottom: spacing.sm, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md }, empty: { marginTop: spacing.md, alignItems: "center", gap: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.xl }, emptyTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 18, textAlign: "center" }, muted: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20, textAlign: "center" },
});
