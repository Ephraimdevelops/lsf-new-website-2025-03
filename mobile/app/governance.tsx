import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

export default function GovernanceScreen() {
  useSensitiveScreenProtection("governance");
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess); const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "staff", "supervisor"].includes(role)); const isAdmin = roles.includes("admin");
  const canAudit = roles.some((role) => ["admin", "supervisor"].includes(role));
  const accessQueue = useQuery(api.accessRequests.adminQueue, isAdmin ? { status: "pending" } : "skip");
  const applications = useQuery(api.formSubmissions.listParalegalApplications, roles.some((role) => ["admin", "staff"].includes(role)) ? {} : "skip");
  const openApplications = applications?.filter((application) => ["pending", "under_review"].includes(application.status));
  const risks = useQuery(api.sara_chat.getRiskEvents, roles.some((role) => ["admin", "staff"].includes(role)) ? { dispositionStatus: "open" } : "skip");

  if (access === undefined) return <Screen><Text style={styles.muted}>{sw ? "Inapakia..." : "Loading..."}</Text></Screen>;
  if (!allowed) return <Screen><AppHeader back title={sw ? "Utawala" : "Governance"} /><Surface tone="orange"><Text style={styles.title}>{sw ? "Ufikiaji haujaruhusiwa" : "Access is not authorised"}</Text></Surface></Screen>;

  return <Screen>
    <AppHeader back title={sw ? "Utawala wa jukwaa" : "Platform governance"} eyebrow="LSF · AUTHORISED" />
    <View style={styles.hero}><Text style={styles.kicker}>PEOPLE · ACCESS · SAFETY</Text><Text style={styles.heroTitle}>{sw ? "Watu sahihi. Ruhusa sahihi." : "Right people. Right access."}</Text><Text style={styles.heroBody}>{sw ? "Pitia maombi, uthibitisho na majibu ya AI yaliyoashiriwa kwa rekodi inayokaguliwa." : "Review applications, access and flagged AI responses with an auditable decision trail."}</Text></View>
    <View style={styles.metrics}><Metric value={accessQueue?.length ?? 0} label={sw ? "Ruhusa" : "Access"} /><Metric value={openApplications?.length ?? 0} label={sw ? "Paralegal" : "Paralegals"} /><Metric value={risks?.length ?? 0} label={sw ? "Hatari za Saada" : "Saada flags"} /></View>
    <Button label={sw ? "Dhibiti taasisi na maeneo ya msaada" : "Manage organisations & help places"} variant="secondary" onPress={() => router.push("/directory-management")} />
    <Button label={sw ? "Dhibiti maktaba na RAG ya Saada" : "Manage Saada knowledge & RAG"} variant="secondary" onPress={() => router.push("/saada-governance")} />
    {canAudit ? <Button label={sw ? "Fungua kumbukumbu ya ukaguzi" : "Open platform audit log"} variant="quiet" onPress={() => router.push("/audit-log")} /> : null}

    <SectionHeading title={sw ? "Maombi ya ufikiaji" : "Professional access requests"} />
    {accessQueue?.map((request) => <Surface key={request._id}><View style={styles.row}><View style={styles.icon}><Ionicons name="person-add-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{request.applicant?.name ?? (sw ? "Mwombaji" : "Applicant")}</Text><Text style={styles.muted}>{request.requestedRole.replaceAll("_", " ")} · {request.organizationName}</Text></View></View><Text style={styles.copy} numberOfLines={3}>{request.statement}</Text><Button label={sw ? "Kagua wasifu na uamuzi" : "Review applicant and decision"} variant="secondary" onPress={() => router.push({ pathname: "/access-request/[id]", params: { id: request._id } })} /></Surface>)}
    {accessQueue?.length === 0 ? <Empty text={sw ? "Hakuna ombi la ufikiaji." : "No access request is waiting."} /> : null}

    <SectionHeading title={sw ? "Uthibitishaji wa paralegal" : "Paralegal verification"} />
    {openApplications?.map((application) => <Surface key={application._id}><View style={styles.row}><View style={styles.icon}><Ionicons name="ribbon-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{application.fullName}</Text><Text style={styles.muted}>{application.district}, {application.region} · {application.status.replaceAll("_", " ")}</Text></View></View><Text style={styles.copy} numberOfLines={2}>{application.experience}</Text><Button label={sw ? "Kagua maombi na nyaraka" : "Review application and documents"} variant="secondary" onPress={() => router.push({ pathname: "/paralegal-application/[id]", params: { id: application._id } })} /></Surface>)}
    {openApplications?.length === 0 ? <Empty text={sw ? "Hakuna maombi ya paralegal yanayosubiri." : "No paralegal application is waiting."} /> : null}

    <SectionHeading title={sw ? "Majibu ya Saada yaliyoashiriwa" : "Flagged Saada responses"} />
    {risks?.map((risk) => <Surface key={risk._id} tone={risk.eventType === "emergency_keyword" ? "orange" : "pink"}><Text style={styles.title}>{risk.eventType.replaceAll("_", " ")}</Text><Text style={styles.copy} numberOfLines={3}>{risk.messagePreview}</Text><Button label={sw ? "Fungua ukaguzi wa Saada" : "Review flagged response"} variant="secondary" onPress={() => router.push({ pathname: "/saada-risk/[id]", params: { id: risk._id } })} /></Surface>)}
    {risks?.length === 0 ? <Empty text={sw ? "Hakuna jibu lililo wazi kwa ukaguzi." : "No flagged response is open."} /> : null}
  </Screen>;
}

function Metric({ value, label }: { value: number; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.muted}>{label}</Text></View>; }
function Empty({ text }: { text: string }) { return <Surface><Text style={styles.muted}>{text}</Text></Surface>; }
const styles = StyleSheet.create({ flex: { flex: 1 }, hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1.2 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 28, lineHeight: 33 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, metrics: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }, metric: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, padding: spacing.md }, metricValue: { color: colors.burgundy, fontFamily: type.bold, fontSize: 26 }, row: { flexDirection: "row", alignItems: "center", gap: spacing.md }, icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 15 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, copy: { marginTop: spacing.sm, color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, input: { minHeight: 72, marginTop: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, color: colors.ink, textAlignVertical: "top" }, options: { gap: spacing.sm, marginTop: spacing.md }, option: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.sm }, optionActive: { borderColor: colors.burgundy, backgroundColor: colors.softPink }, optionText: { color: colors.ink, fontFamily: type.medium, fontSize: 13 }, actions: { marginTop: spacing.md, gap: spacing.sm }, links: { marginTop: spacing.md, gap: spacing.xs }, good: { color: colors.success, fontFamily: type.medium, fontSize: 13 }, bad: { color: colors.danger, fontFamily: type.medium, fontSize: 13 }, error: { marginTop: spacing.md, color: colors.danger, fontFamily: type.medium } });
