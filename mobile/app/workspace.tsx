import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function WorkspaceScreen() {
  const { locale } = useLanguage();
  const access = useQuery(api.users.currentAccess);
  const roles: string[] = access?.roles ?? [];
  const canUseOpsQueue = roles.some((role) => ["admin", "staff", "supervisor"].includes(role));
  const canSupervise = roles.some((role) => ["admin", "supervisor"].includes(role));
  const isSafeguarding = roles.includes("safeguarding_officer");
  const canEditGuides = roles.some((role) => ["content_editor", "admin"].includes(role));
  const isProvider = roles.some((role) => ["paralegal", "provider_staff"].includes(role));
  const myApplication = useQuery(api.paralegals.getMyApplication, isProvider ? {} : "skip");
  const isReporter = roles.some((role) => ["stakeholder", "donor"].includes(role));
  const canUseReporting = roles.some((role) => ["admin", "staff", "supervisor", "stakeholder", "donor"].includes(role));
  const queue = useQuery(api.caseManagement.staffCaseQueue, canUseOpsQueue ? {} : "skip");
  const supportQueue = useQuery(api.paralegals.staffSupportQueue, canUseOpsQueue ? {} : "skip");
  const offers = useQuery(api.caseManagement.assignmentInbox, isProvider ? {} : "skip");
  const tasks = useQuery(api.caseManagement.myTasks, isProvider ? {} : "skip");
  const snapshots = useQuery(api.reporting.listSnapshots, canUseReporting ? { status: "approved" } : "skip");
  const respondToAssignment = useMutation(api.caseManagement.respondToAssignment);
  const completeTask = useMutation(api.caseManagement.completeTask);
  const respondToSupport = useMutation(api.paralegals.respondToSupportRequest);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [respondingSupportId, setRespondingSupportId] = useState<string | null>(null);
  const latest = snapshots?.[0];
  const title = canUseOpsQueue ? (locale === "sw" ? "Kituo cha uendeshaji" : "Operations workspace") : isProvider ? (locale === "sw" ? "Kazi za paralegal" : "Paralegal workspace") : isSafeguarding ? (locale === "sw" ? "Kazi za ulinzi" : "Safeguarding workspace") : canEditGuides ? (locale === "sw" ? "Uhariri wa miongozo" : "Guide editorial") : (locale === "sw" ? "Taarifa za athari" : "Impact reporting");

  async function respond(assignmentId: string, response: "accepted" | "declined") {
    setRespondingId(assignmentId);
    try {
      await respondToAssignment({ assignmentId: assignmentId as Parameters<typeof respondToAssignment>[0]["assignmentId"], response });
    } finally {
      setRespondingId(null);
    }
  }

  async function updateSupport(id: string, status: "in_review" | "responded" | "closed") {
    setRespondingSupportId(id);
    try { await respondToSupport({ id: id as Parameters<typeof respondToSupport>[0]["id"], status }); }
    finally { setRespondingSupportId(null); }
  }

  function confirmTask(taskId: Parameters<typeof completeTask>[0]["taskId"], title: string) {
    Alert.alert(
      locale === "sw" ? "Thibitisha kukamilika" : "Confirm completion",
      locale === "sw" ? `Je, umekamilisha “${title}”?` : `Have you completed “${title}”?`,
      [
        { text: locale === "sw" ? "Ghairi" : "Cancel", style: "cancel" },
        { text: locale === "sw" ? "Ndiyo, imekamilika" : "Yes, mark done", onPress: () => void completeTask({ taskId }) },
      ],
    );
  }

  if (access === undefined) return <Screen><AppHeader back title={locale === "sw" ? "Sehemu za kazi" : "Workspaces"} /><Text style={styles.snapshotBody}>{locale === "sw" ? "Tunapakia ruhusa..." : "Loading access..."}</Text></Screen>;
  if (!access) return <Screen>
    <AppHeader back title={locale === "sw" ? "Sehemu za kazi" : "Workspaces"} eyebrow="HAKI YANGU · LSF" />
    <View style={styles.hero}><Text style={styles.kicker}>{locale === "sw" ? "MAJUKUMU NA HUDUMA" : "ROLES & SERVICES"}</Text><Text style={styles.heroTitle}>{locale === "sw" ? "Kila jukumu lina eneo lake." : "A place for every role."}</Text><Text style={styles.heroBody}>{locale === "sw" ? "Angalia safari ya paralegal au utawala wa LSF. Rekodi za watu na hatua za kazi zinaonekana tu kwa akaunti iliyoidhinishwa." : "Explore paralegal work and LSF governance. People’s records and work actions remain visible only to approved accounts."}</Text></View>
    <SectionHeading title={locale === "sw" ? "Safari ya paralegal" : "Paralegal journey"} />
    <Surface tone="pink"><Text style={styles.snapshotTitle}>{locale === "sw" ? "Kutoka maombi hadi kazi" : "From application to fieldwork"}</Text><Text style={styles.snapshotBody}>{locale === "sw" ? "Uthibitishaji, kesi, kazi za kufuatilia na upatikanaji." : "Verification, assigned cases, follow-up tasks and availability."}</Text><Button label={locale === "sw" ? "Angalia hatua za kujiunga" : "Explore onboarding"} onPress={() => router.push("/paralegal-onboarding")} /><Button label={locale === "sw" ? "Fungua kituo cha kujifunza" : "Open learning hub"} variant="secondary" onPress={() => router.push("/paralegal-learning")} /><Button label={locale === "sw" ? "Angalia kazi za paralegal" : "Explore paralegal tasks"} variant="secondary" onPress={() => router.push("/paralegal-tasks")} /></Surface>
    <SectionHeading title={locale === "sw" ? "Utawala wa LSF" : "LSF governance"} />
    <Surface tone="teal"><Text style={styles.snapshotTitle}>{locale === "sw" ? "Uendeshaji na ulinzi" : "Operations and safeguarding"}</Text><Text style={styles.snapshotBody}>{locale === "sw" ? "Mapitio ya maombi, idhini, huduma na maarifa ya Saada." : "Request triage, approvals, services and Saada knowledge."}</Text><Button label={locale === "sw" ? "Angalia maeneo ya LSF" : "Explore LSF sections"} variant="secondary" onPress={() => router.push("/explore")} /></Surface>
    <Button label={locale === "sw" ? "Ingia kwa akaunti yako" : "Sign in to your account"} onPress={() => router.push("/sign-in")} />
  </Screen>;

  return (
    <Screen>
      <AppHeader back title={title} eyebrow="Haki Yangu · LSF" />
      <View style={styles.hero}><Text style={styles.kicker}>{canUseOpsQueue ? "OPERATIONS" : isProvider ? "SERVICE DELIVERY" : isSafeguarding ? "SAFEGUARDING" : "REPORTING"}</Text><Text style={styles.heroTitle}>{locale === "sw" ? "Taarifa sahihi kwa jukumu lako." : "The right information for your role."}</Text><Text style={styles.heroBody}>{locale === "sw" ? "Ufikiaji huu unatokana na ruhusa zilizothibitishwa kwenye seva." : "This workspace follows your verified server permissions."}</Text></View>

      {canSupervise ? <Button label={locale === "sw" ? "Usimamizi na ubora wa kesi" : "Supervision & case quality"} variant="secondary" onPress={() => router.push("/supervision")} /> : null}
      {canEditGuides ? <Button label={locale === "sw" ? "Andika na kagua miongozo" : "Draft and review guides"} variant="secondary" onPress={() => router.push("/editorial-workspace")} /> : null}
      {canUseOpsQueue ? <><Button label={locale === "sw" ? "Fungua triage na ulinganishaji" : "Open triage & matching"} onPress={() => router.push("/operations")} /><Button label={locale === "sw" ? "Ufikiaji na utawala" : "Access & governance"} variant="secondary" onPress={() => router.push("/governance")} /><SectionHeading title={locale === "sw" ? "Muhtasari wa kazi" : "Operations overview"} /><View style={styles.stats}><Stat value={queue?.length ?? 0} label={locale === "sw" ? "Kesi kwenye foleni" : "Cases in queue"} tone="pink" /><Stat value={queue?.filter((item) => item.priority === "safeguarding").length ?? 0} label={locale === "sw" ? "Ulinzi" : "Safeguarding"} tone="orange" /></View>{queue?.slice(0, 4).map((item) => <CaseRow key={item._id} id={item.publicId} summary={item.summary} onPress={() => router.push({ pathname: "/case/[id]", params: { id: item._id } })} />)}<SectionHeading title={locale === "sw" ? "Msaada wa paralegal" : "Paralegal support queue"} />{supportQueue?.length ? supportQueue.slice(0, 5).map(({ request, user }) => <View key={request._id} style={styles.offer}><View style={styles.rowStatic}><View style={styles.rowIcon}><Ionicons name="heart-outline" size={19} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.rowTitle}>{user?.name ?? (locale === "sw" ? "Paralegal" : "Paralegal")}</Text><Text style={styles.rowBody}>{request.type.replaceAll("_", " ")} · {request.status.replaceAll("_", " ")}</Text><Text style={styles.rowBody} numberOfLines={2}>{request.note}</Text></View></View><View style={styles.offerActions}>{request.status === "submitted" ? <Pressable disabled={respondingSupportId === request._id} style={styles.declineButton} onPress={() => void updateSupport(request._id, "in_review")}><Text style={styles.declineText}>{locale === "sw" ? "Anza kupitia" : "Review"}</Text></Pressable> : null}{request.status !== "closed" ? <Pressable disabled={respondingSupportId === request._id} style={styles.acceptButton} onPress={() => void updateSupport(request._id, request.status === "in_review" ? "responded" : "closed")}><Text style={styles.acceptText}>{request.status === "in_review" ? (locale === "sw" ? "Jibu" : "Respond") : (locale === "sw" ? "Funga" : "Close")}</Text></Pressable> : null}</View></View>) : <Surface><Text style={styles.snapshotBody}>{locale === "sw" ? "Hakuna ombi la msaada linalosubiri." : "No open paralegal support requests."}</Text></Surface>}</> : null}

      {isProvider ? <><SectionHeading title={locale === "sw" ? "Ofa mpya" : "New assignments"} /><View style={styles.stats}><Stat value={offers?.length ?? 0} label={locale === "sw" ? "Zinasubiri jibu" : "Awaiting response"} tone="teal" /><Stat value={roles.length} label={locale === "sw" ? "Majukumu yako" : "Your roles"} tone="gold" /></View>{offers?.slice(0, 4).map((item) => <OfferRow key={item.assignment._id} id={item.case?.publicId ?? "—"} summary={item.case?.summary ?? (locale === "sw" ? "Maelezo yanalindwa" : "Details protected")} pending={respondingId === item.assignment._id} onAccept={() => void respond(item.assignment._id, "accepted")} onDecline={() => void respond(item.assignment._id, "declined")} />)}<Button label={locale === "sw" ? "Angalia kesi nilizopewa" : "View assigned cases"} onPress={() => router.push("/(tabs)/cases")} /></> : null}
      {isProvider ? <View style={{ gap: spacing.sm }}><Button label={locale === "sw" ? "Ofa na kesi nilizopewa" : "Offers and assigned cases"} variant="secondary" onPress={() => router.push("/paralegal-assignments")} /><Button label={locale === "sw" ? "Kazi zangu zote" : "All my tasks"} variant="secondary" onPress={() => router.push("/paralegal-tasks")} /><Button label={locale === "sw" ? "Badili upatikanaji" : "Update availability"} variant="secondary" onPress={() => router.push("/paralegal-availability")} /><Button label={locale === "sw" ? "Taasisi na huduma zangu" : "My organisation and services"} variant="secondary" onPress={() => router.push("/my-organisation")} /></View> : null}
      {isProvider ? <Button label={locale === "sw" ? "Kituo cha kujifunza" : "Learning hub"} variant="secondary" onPress={() => router.push("/paralegal-learning")} /> : null}
      {isProvider ? <Button label={locale === "sw" ? "Muhtasari wa utendaji" : "View performance"} variant="secondary" onPress={() => router.push("/paralegal-performance")} /> : null}
      {isProvider ? <Button label={locale === "sw" ? "Rufaa nilizopokea" : "Incoming referrals"} variant="secondary" onPress={() => router.push("/provider-referrals")} /> : null}
      {isProvider ? <Button label={locale === "sw" ? "Kituo cha kujifunza" : "Open learning hub"} variant="secondary" onPress={() => router.push("/(tabs)/learn")} /> : null}
      {isProvider ? <Button label={locale === "sw" ? "Ustawi na usimamizi" : "Wellbeing and supervision"} variant="secondary" onPress={() => router.push("/paralegal-wellbeing")} /> : null}
      {isProvider ? <><SectionHeading title={locale === "sw" ? "Kazi za leo" : "My tasks"} />{tasks?.length ? tasks.slice(0, 8).map((item) => <View key={item.task._id} style={styles.row}><Ionicons name="square-outline" size={21} color={colors.burgundy} /><View style={styles.flex}><Text style={styles.rowTitle}>{item.task.title}</Text><Text style={styles.rowBody}>{item.case?.publicId ?? "—"}{item.task.dueAt ? ` · ${new Date(item.task.dueAt).toLocaleDateString(locale === "sw" ? "sw-TZ" : "en-TZ")}` : ""}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? `Maliza ${item.task.title}` : `Complete ${item.task.title}`} style={styles.taskButton} onPress={() => confirmTask(item.task._id, item.task.title)}><Text style={styles.taskButtonText}>{locale === "sw" ? "Maliza" : "Done"}</Text></Pressable></View>) : <Surface><Text style={styles.snapshotBody}>{locale === "sw" ? "Hakuna kazi wazi kwa sasa." : "No open tasks right now."}</Text></Surface>}</> : null}
      {isProvider && myApplication ? <Surface tone={myApplication.onboardingCompleted ? "teal" : "orange"}><Text style={styles.snapshotTitle}>{locale === "sw" ? "Utayari wa paralegal" : "Paralegal readiness"}</Text><Text style={styles.snapshotBody}>{myApplication.status === "approved" ? (myApplication.onboardingCompleted ? (locale === "sw" ? "Wasifu wako uko tayari kwa kazi." : "Your profile is ready for work.") : (locale === "sw" ? "Kamilisha wasifu, maadili na upatikanaji kabla ya kupokea kesi." : "Complete your profile, ethics and availability before taking cases.")) : (locale === "sw" ? `Hali ya ombi: ${myApplication.status}` : `Application status: ${myApplication.status}`)}</Text><Button label={locale === "sw" ? "Kagua wasifu wa kazi" : "Review work profile"} variant="secondary" onPress={() => router.push("/paralegal-onboarding")} /></Surface> : null}

      {canUseReporting ? <><SectionHeading title={locale === "sw" ? "Athari iliyoidhinishwa" : "Approved impact"} /><Button label={locale === "sw" ? "Fungua kituo cha taarifa" : "Open reporting centre"} variant="secondary" onPress={() => router.push("/reporting")} />{latest ? <><View style={styles.stats}><Stat value={latest.values.openCases ?? 0} label={locale === "sw" ? "Kesi wazi" : "Open cases"} tone="pink" /><Stat value={`${latest.values.assignmentAcceptanceRate ?? 0}%`} label={locale === "sw" ? "Kukubali kazi" : "Assignment acceptance"} tone="teal" /></View><Surface><Text style={styles.snapshotTitle}>{locale === "sw" ? `Siku ${latest.values.periodDays}` : `${latest.values.periodDays}-day snapshot`}</Text><Text style={styles.snapshotBody}>{latest.publicSummary}</Text><Text style={styles.date}>{new Date(latest.generatedAt).toLocaleDateString(locale === "sw" ? "sw-TZ" : "en-TZ")}</Text></Surface></> : <Surface><Text style={styles.snapshotBody}>{locale === "sw" ? "Hakuna taarifa iliyoidhinishwa bado." : "No approved reporting snapshot is available yet."}</Text></Surface>}</> : null}

      {isSafeguarding && !canUseOpsQueue ? <Surface tone="orange"><Text style={styles.snapshotTitle}>{locale === "sw" ? "Ufikiaji wa ulinzi" : "Safeguarding access"}</Text><Text style={styles.snapshotBody}>{locale === "sw" ? "Akaunti hii ina jukumu la ulinzi. Fungua foleni iliyolindwa kuona masuala ya usalama yaliyo ndani ya ruhusa yako." : "This account has the safeguarding role. Open the restricted safeguarding queue to review safety concerns within your server-approved scope."}</Text><Button label={locale === "sw" ? "Fungua foleni ya ulinzi" : "Open safeguarding queue"} variant="secondary" onPress={() => router.push("/safeguarding")} /></Surface> : null}

      {!canUseOpsQueue && !isProvider && !canUseReporting && !isSafeguarding && !canEditGuides ? <Surface tone="pink"><Text style={styles.snapshotTitle}>{locale === "sw" ? "Hakuna eneo la kazi" : "No staff workspace"}</Text><Text style={styles.snapshotBody}>{locale === "sw" ? "Akaunti hii inaweza kutumia huduma za kawaida za Haki Yangu." : "This account can use the standard Haki Yangu services."}</Text></Surface> : null}
    </Screen>
  );
}

function Stat({ value, label, tone }: { value: string | number; label: string; tone: "pink" | "orange" | "teal" | "gold" }) { return <Surface tone={tone} style={styles.stat}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></Surface>; }
function CaseRow({ id, summary, onPress }: { id: string; summary: string; onPress: () => void }) { return <Pressable style={styles.row} onPress={onPress}><View style={styles.rowIcon}><Ionicons name="briefcase-outline" size={19} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.rowTitle}>{id}</Text><Text style={styles.rowBody} numberOfLines={2}>{summary}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></Pressable>; }
function OfferRow({ id, summary, pending, onAccept, onDecline }: { id: string; summary: string; pending: boolean; onAccept: () => void; onDecline: () => void }) { return <View style={styles.offer}><View style={styles.rowStatic}><View style={styles.rowIcon}><Ionicons name="briefcase-outline" size={19} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.rowTitle}>{id}</Text><Text style={styles.rowBody} numberOfLines={2}>{summary}</Text></View></View><View style={styles.offerActions}><Pressable disabled={pending} style={styles.declineButton} onPress={onDecline}><Text style={styles.declineText}>Decline</Text></Pressable><Pressable disabled={pending} style={styles.acceptButton} onPress={onAccept}><Text style={styles.acceptText}>{pending ? "Saving..." : "Accept"}</Text></Pressable></View></View>; }

const styles = StyleSheet.create({
  flex: { flex: 1 }, hero: { borderRadius: radius.xl, backgroundColor: colors.ink, padding: spacing.xl, gap: spacing.sm }, kicker: { fontFamily: type.bold, fontWeight: "700", color: colors.peach, fontSize: 13, letterSpacing: 1.2 }, heroTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 28, lineHeight: 32, letterSpacing: -0.7 }, heroBody: { fontFamily: type.regular, color: "#D8D2D5", fontSize: 13, lineHeight: 20 },
  stats: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md }, stat: { flex: 1, minHeight: 124, justifyContent: "flex-end", shadowOpacity: 0 }, value: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 29 }, label: { marginTop: 5, fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 78, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, marginBottom: spacing.sm }, taskButton: { minHeight: 40, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" }, taskButtonText: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 12 }, offer: { borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md }, rowStatic: { flexDirection: "row", alignItems: "center", gap: spacing.md }, rowIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" }, rowTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 13 }, rowBody: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 }, offerActions: { flexDirection: "row", gap: spacing.sm }, declineButton: { flex: 1, minHeight: 42, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" }, declineText: { fontFamily: type.bold, fontWeight: "700", color: colors.inkMuted, fontSize: 13 }, acceptButton: { flex: 1, minHeight: 42, borderRadius: radius.pill, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" }, acceptText: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 13 }, snapshotTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 17 }, snapshotBody: { marginTop: spacing.sm, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 }, date: { marginTop: spacing.md, fontFamily: type.medium, fontWeight: "500", color: colors.burgundy, fontSize: 13 },
});
