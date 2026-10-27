import { BrandLoading } from './BrandLoading';
import { workDayEnd } from "../work/WorkDateTime";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { isParalegalReady } from "../workReadiness";
import { api } from "../backend/api";
import { useLanguage } from "../i18n";
import { colors, type } from "../theme";
import { CivicPageHeader } from "./CivicPageHeader";
import { CivicObject } from "./CivicObject";
import { PersonalIntro } from "./PersonalIntro";
import { ParalegalNavigation } from "./ParalegalNavigation";
import { Screen } from "./Screen";

const finished = ["closed"];
export function ParalegalHome() {
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const application = useQuery(api.paralegals.getMyApplication);
  const offers = useQuery(api.caseManagement.assignmentInbox);
  const tasks = useQuery(api.caseManagement.myTasks, {});
  const cases = useQuery(api.caseManagement.myCases);
  const appointments = useQuery(api.caseManagement.myAppointments, { context: "work" });
  const isParalegal = access?.roles.includes("paralegal");
  const ready = isParalegalReady(application);
  const assigned = cases?.filter(item => item.beneficiaryId !== access?.user._id);
  const active = assigned?.filter(item => !finished.includes(item.status));
  const workCaseIds = new Set(assigned?.map(item => item._id));
  const upcoming = appointments?.filter(item => workCaseIds.has(item.caseId) && item.status === "scheduled" && item.startsAt >= Date.now());
  const endOfToday = workDayEnd();
  const due = tasks?.filter(item => item.task.dueAt && item.task.dueAt <= endOfToday);
  const availability = application?.availabilityStatus;
  const availabilityText = availability === "accepting_cases" ? (sw ? "Napokea kesi mpya" : "Taking new cases") : availability === "limited" ? (sw ? "Nina nafasi chache" : "Limited availability") : availability === "paused" ? (sw ? "Nimesitisha kesi mpya" : "New cases paused") : availability === "unavailable" ? (sw ? "Sipo kwa sasa" : "Currently unavailable") : (sw ? "Unaweza kupokea kesi?" : "Can you take new cases?");
  const setupBody = !application ? (sw ? "Wasifu wako wa kazi haujaunganishwa. Angalia hatua za kujiunga au omba LSF ikusaidie." : "Your work profile is not linked. Check the setup steps or ask LSF for help.") : application.status !== "approved" ? (sw ? "LSF bado haijaidhinisha wasifu wako. Angalia hali ya ombi lako." : "Your profile is awaiting LSF approval. Check your application status.") : !application.isVerified || !application.reviewedBy || !(application.idDocumentStorageId || application.idDocumentUrl) || !application.certificateStorageId ? (sw ? "LSF inahitaji kuthibitisha wasifu na nyaraka zako kabla ya kupokea kesi." : "LSF needs to verify your profile and documents before you can accept cases.") : (sw ? "Kamilisha maandalizi, maadili na mafunzo ya ulinzi kabla ya kupokea kesi." : "Complete your setup, conduct and safeguarding steps before accepting cases.");
  return <Screen footer={<ParalegalNavigation current="home" />}>
    <CivicPageHeader compact title={sw ? "Kazi zako leo" : "Your work today"} actionIcon="notifications-outline" actionLabel={sw ? "Arifa" : "Notifications"} onAction={() => router.push("/notifications")} />
    <PersonalIntro body={sw ? "Pitia kesi mpya na ufuatilie hatua ulizoahidi." : "Review new cases and follow through on your next steps."} />
    {application?.syntheticDevelopmentFixture && <Text style={styles.muted}>{sw ? "Akaunti ya majaribio. Utayari wa kazi umewekwa kwa majaribio pekee." : "Test account. Work readiness is simulated for development testing."}</Text>}
    {application === undefined ? <BrandLoading compact text={sw ? "Tunapakia wasifu wako…" : "Loading your work profile…"}/> : isParalegal ? application ? <Row icon="time-outline" title={availabilityText} body={sw ? "Muda na nafasi zako za kusaidia" : "Your hours and capacity to help"} route="/paralegal-availability" tone="teal" /> : null : <Row icon="business-outline" title={sw ? "Taasisi na huduma zangu" : "My organisation and services"} body={sw ? "Angalia hali ya kupokea kesi" : "Check whether your service is taking requests"} route="/my-organisation" tone="teal" />}
    {isParalegal && application !== undefined && !ready ? <View style={styles.setup}><Text style={styles.rowTitle}>{sw ? "Kamilisha maandalizi ya kazi" : "Finish your work setup"}</Text><Text style={styles.body}>{setupBody}</Text><Row icon="arrow-forward" title={sw ? "Angalia hatua zinazobaki" : "See your next setup step"} route="/paralegal-onboarding" /></View> : null}
    <View style={styles.counts}><Count value={offers?.length} label={sw ? "Kesi za kupokea" : "Cases to accept"} route="/paralegal-assignments" /><Count value={active?.length} label={sw ? "Kesi zinazoendelea" : "Active cases"} route="/paralegal-assignments?view=active" /><Count value={due?.length} label={sw ? "Kazi zilizofikia muda" : "Tasks due"} route="/paralegal-tasks" /></View>
    <Heading title={sw ? "Yanayohitaji hatua" : "Needs your attention"} />
    {offers === undefined || tasks === undefined ? <BrandLoading compact text={sw ? "Tunapakia kazi…" : "Loading your work…"}/> : offers.length || tasks.length ? <>
      {offers.slice(0, 2).map(({ assignment, case: record }) => <Row key={assignment._id} icon="briefcase-outline" title={sw ? "Kagua kesi uliyopewa" : "Review a case assignment"} body={record?.summary ?? (sw ? "Maelezo yanalindwa" : "Details protected")} route={`/assignment/${assignment._id}`} tone="teal" />)}
      {tasks.slice(0, 3).map(({ task }) => <Row key={task._id} icon="checkbox-outline" title={task.title} body={task.dueAt ? `${task.dueAt < Date.now() ? (sw ? "Imechelewa · " : "Overdue · ") : ""}${new Date(task.dueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { day: "numeric", month: "short", timeZone: "Africa/Dar_es_Salaam" })}` : (sw ? "Angalia maelezo ya kazi" : "Review task details")} route={`/task/${task._id}`} />)}
      <Row icon="arrow-forward" title={sw ? "Angalia kazi zote" : "View all tasks"} route="/paralegal-tasks" />
    </> : <View style={styles.empty}><CivicObject kind="empty" size={72} /><View style={styles.flex}><Text style={styles.rowTitle}>{sw ? "Hakuna kazi inayosubiri." : "Nothing waiting right now."}</Text><Text style={styles.body}>{sw ? "Kesi na kazi mpya zitaonekana hapa." : "New assignments and tasks will appear here."}</Text></View></View>}
    {!!active?.filter(item => ["resolved", "closed_unresolved"].includes(item.status)).length && <><Heading title={sw ? "Kamilisha kesi" : "Needs final checks"} />{active!.filter(item => ["resolved", "closed_unresolved"].includes(item.status)).slice(0,3).map(item => <Row key={item._id} icon="checkmark-done-outline" title={item.publicId} body={sw ? "Matokeo yamehifadhiwa. Kamilisha ukaguzi wa mwisho." : "Result recorded. Complete the final checks."} route={`/case/${item._id}?section=feedback`} />)}</>}
    <Heading title={sw ? "Miadi inayokuja" : "Upcoming appointments"} />
    {appointments === undefined || cases === undefined ? <BrandLoading compact text={sw ? "Tunapakia miadi…" : "Loading appointments…"}/> : upcoming?.length ? upcoming.slice(0, 3).map(item => <Row key={item._id} icon="calendar-outline" title={item.casePublicId} body={new Date(item.startsAt).toLocaleString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Dar_es_Salaam" })} route={`/appointment/${item._id}`} />) : <Text style={styles.body}>{sw ? "Hakuna miadi inayokuja kwenye kesi zako za kazi." : "No upcoming appointments in your work cases."}</Text>}
    <Row icon="calendar-outline" title={sw ? "Angalia miadi yote" : "View all appointments"} route="/work-appointments" tone="teal" />
    <Heading title={sw ? "Zana za kazi" : "Your work tools"} />
    <Row icon="document-text-outline" title={sw ? "Nyaraka za kazi" : "Work documents"} body={sw ? "Pitia nyaraka kwenye kesi zako" : "Review documents across your cases"} route="/work-documents" tone="teal" />
    <Row icon="paper-plane-outline" title={sw ? "Maombi kutoka huduma nyingine" : "Referrals received"} body={sw ? "Fuata msaada kutoka kwa timu nyingine" : "Follow support from another team"} route="/provider-referrals" tone="teal" />
    <Row icon="book-outline" title={sw ? "Jifunze na jiandae" : "Learn and prepare"} body={sw ? "Mafunzo na miongozo ya LSF" : "LSF training and reviewed guides"} route="/paralegal-learning" tone="gold" />
    <Row icon="people-outline" title={sw ? "Omba msaada wa LSF" : "Ask LSF for help"} body={sw ? "Mwongozo wa kesi na ustawi wako" : "Case guidance and your wellbeing"} route="/paralegal-support" />
  </Screen>;
}
function Heading({ title }: { title: string }) { return <Text style={styles.heading}>{title}</Text>; }
function Count({ value, label, route }: { value?: number; label: string; route: string }) { return <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${value ?? "…"}`} style={styles.count} onPress={() => router.push(route as Href)}><Text style={styles.value}>{value ?? "—"}</Text><Text style={styles.countLabel}>{label}</Text></Pressable>; }
function Row({ icon, title, body, route, tone }: { icon: keyof typeof Ionicons.glyphMap; title: string; body?: string; route: string; tone?: "teal" | "gold" }) { const tint = tone === "teal" ? colors.tealSoft : tone === "gold" ? colors.goldSoft : colors.burgundySoft; const accent = tone === "teal" ? colors.teal : tone === "gold" ? colors.warning : colors.burgundy; return <Pressable accessibilityRole="button" onPress={() => router.push(route as Href)} style={({ pressed }) => [styles.row, pressed && { opacity: 0.65 }]}><View style={[styles.icon, { backgroundColor: tint }]}><Ionicons name={icon} size={22} color={accent} /></View><View style={styles.flex}><Text style={styles.rowTitle}>{title}</Text>{body ? <Text style={styles.body} numberOfLines={2}>{body}</Text> : null}</View><Ionicons name="chevron-forward" size={18} color={accent} /></Pressable>; }
const styles = StyleSheet.create({ flex: { flex: 1 }, row: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line }, icon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" }, rowTitle: { fontFamily: type.semibold, fontSize: 16, lineHeight: 23, color: colors.ink }, body: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.inkMuted, marginTop: 4 }, muted: { fontFamily: type.regular, fontSize: 14, color: colors.inkMuted, paddingVertical: 12 }, setup: { backgroundColor: colors.orangeSoft, padding: 16, borderRadius: 16, marginTop: 16 }, counts: { flexDirection: "row", gap: 8, marginVertical: 24 }, count: { flex: 1, padding: 12, minHeight: 90, borderRadius: 16, backgroundColor: colors.tealSoft, justifyContent: "center" }, value: { fontFamily: type.semibold, fontSize: 27, color: colors.ink }, countLabel: { fontFamily: type.medium, fontSize: 12, lineHeight: 18, color: colors.inkMuted, marginTop: 4 }, heading: { fontFamily: type.semibold, fontSize: 20, lineHeight: 27, color: colors.ink, marginTop: 20, marginBottom: 8 }, empty: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 12 } });
