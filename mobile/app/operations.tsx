import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

type Priority = "standard" | "urgent" | "safeguarding";

export default function OperationsScreen() {
  useSensitiveScreenProtection("operations");
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff", "supervisor"].includes(role));
  const requests = useQuery(api.legalHelp.staffQueue, allowed ? {} : "skip");
  const cases = useQuery(api.caseManagement.staffCaseQueue, allowed ? {} : "skip");
  const [selectedRequestId, setSelectedRequestId] = useState<Id<"legal_help_requests"> | null>(null);
  const selectedRequest = requests?.find((item) => item._id === selectedRequestId);
  const [selectedCaseId, setSelectedCaseId] = useState<Id<"cases"> | null>(null);
  const openForTriage = useMutation(api.legalHelp.openForTriage);
  const createCase = useMutation(api.caseManagement.createFromRequest);
  const [summary, setSummary] = useState(""); const [priority, setPriority] = useState<Priority>("standard");
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");

  if (access === undefined) return <Screen><Text style={styles.muted}>{sw ? "Inapakia ruhusa..." : "Loading access..."}</Text></Screen>;
  if (!allowed) return <Screen><AppHeader back title={sw ? "Uendeshaji" : "Operations"} /><Surface tone="orange"><Text style={styles.cardTitle}>{sw ? "Ufikiaji haujaruhusiwa" : "Access is not authorised"}</Text><Text style={styles.muted}>{sw ? "Jukumu la LSF lililoidhinishwa linahitajika." : "An approved LSF operations role is required."}</Text></Surface></Screen>;

  async function beginTriage() { if (!selectedRequest) return; setBusy(true); setError(""); try { const detail = await openForTriage({ requestId: selectedRequest._id, expectedVersion: selectedRequest.version }); setSummary((detail.request.description ?? "").slice(0, 500)); } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); } finally { setBusy(false); } }
  async function convert() { if (!selectedRequest || summary.trim().length < 10) return; setBusy(true); setError(""); try { const result = await createCase({ requestId: selectedRequest._id, summary: summary.trim(), priority }); setSelectedRequestId(null); setSummary(""); router.push({ pathname: "/case/[id]", params: { id: result.caseId } }); } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); } finally { setBusy(false); } }

  const openCases = cases?.filter((item) => !["closed", "closed_unresolved", "resolved"].includes(item.status)) ?? [];
  return <Screen>
    <AppHeader back title={sw ? "Kituo cha uendeshaji" : "Operations centre"} eyebrow="LSF · HAKI YANGU" />
    <View style={styles.hero}><Text style={styles.kicker}>INTAKE · TRIAGE · MATCHING</Text><Text style={styles.heroTitle}>{sw ? "Ombi hadi msaada halisi." : "From request to real support."}</Text><Text style={styles.heroBody}>{sw ? "Pitia ombi, fungua kesi na tuma ofa kwa mtoa huduma aliyethibitishwa." : "Review a request, open a case and offer it to a verified provider."}</Text></View>
    <View style={styles.metrics}><Metric value={requests?.length ?? 0} label={sw ? "Maombi" : "Requests"} icon="file-tray-full-outline" /><Metric value={openCases.length} label={sw ? "Kesi wazi" : "Open cases"} icon="briefcase-outline" /></View>
    <Button label={sw ? "Fuatilia rufaa na ushahidi wa ridhaa" : "Review referrals and consent evidence"} variant="secondary" onPress={() => router.push("/referral-oversight")} />
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <SectionHeading title={sw ? "Foleni ya maombi" : "Intake & triage queue"} />
    {requests?.length ? requests.map((request) => <Pressable key={request._id} style={[styles.card, selectedRequestId === request._id && styles.selected]} onPress={() => { setSelectedRequestId(request._id); setSummary(request.description ?? ""); }}><View style={styles.icon}><Ionicons name={request.urgency === "immediate_safety" ? "shield-outline" : "document-text-outline"} size={21} color={request.urgency === "immediate_safety" ? colors.orange : colors.burgundy} /></View><View style={styles.flex}><Text style={styles.cardTitle}>{(request.issueCategory ?? "other").replaceAll("_", " ")}</Text><Text style={styles.muted}>{request.region}{request.district ? ` · ${request.district}` : ""} · {request.status.replaceAll("_", " ")}</Text><Text style={styles.summary} numberOfLines={2}>{request.description ?? (sw ? "Maelezo hayapo" : "No description")}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></Pressable>) : <Surface><Text style={styles.muted}>{sw ? "Hakuna ombi linalosubiri." : "No request is waiting for triage."}</Text></Surface>}
    {selectedRequest ? <Surface tone="pink"><Text style={styles.cardTitle}>{sw ? "Uamuzi wa triage" : "Triage decision"}</Text><Button label={sw ? "Fungua skrini ya mapitio ya ombi" : "Open request review screen"} variant="secondary" onPress={() => router.push({ pathname: "/operations-request/[id]", params: { id: selectedRequest._id } })} /><TextInput value={summary} onChangeText={setSummary} multiline maxLength={3000} style={styles.input} placeholder={sw ? "Muhtasari salama wa kesi" : "Safe case summary"} /><View style={styles.chips}>{(["standard", "urgent", "safeguarding"] as Priority[]).map((item) => <Pressable key={item} onPress={() => setPriority(item)} style={[styles.chip, priority === item && styles.chipActive]}><Text style={[styles.chipText, priority === item && styles.chipTextActive]}>{item}</Text></Pressable>)}</View><Button label={sw ? "Anza mapitio" : "Open triage review"} variant="secondary" disabled={busy} onPress={() => void beginTriage()} /><Button label={sw ? "Fungua kesi" : "Create case"} disabled={busy || summary.trim().length < 10} onPress={() => void convert()} /></Surface> : null}
    <SectionHeading title={sw ? "Kesi na ulinganishaji" : "Cases & matching"} />
    {openCases.slice(0, 12).map((item) => <Pressable key={item._id} style={[styles.card, selectedCaseId === item._id && styles.selected]} onPress={() => setSelectedCaseId(item._id)}><View style={styles.icon}><Ionicons name="people-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.cardTitle}>{item.publicId}</Text><Text style={styles.muted}>{item.priority} · {item.status.replaceAll("_", " ")}</Text><Text style={styles.summary} numberOfLines={2}>{item.summary}</Text></View><Pressable onPress={() => router.push({ pathname: "/case/[id]", params: { id: item._id } })}><Ionicons name="open-outline" size={20} color={colors.burgundy} /></Pressable></Pressable>)}
    {selectedCaseId ? <Surface tone="teal"><Text style={styles.cardTitle}>{sw ? "Watoa huduma wanaopendekezwa" : "Recommended providers"}</Text><Text style={styles.muted}>{sw ? "Angalia sababu za ulinganishaji na uwezo kabla ya kutuma ofa." : "Review fit and capacity before sending an offer."}</Text><Button label={sw ? "Fungua ulinganishaji" : "Open matching screen"} onPress={() => router.push({ pathname: "/case-matching/[id]", params: { id: selectedCaseId } })} /></Surface> : null}
  </Screen>;
}

function Metric({ value, label, icon }: { value: number; label: string; icon: React.ComponentProps<typeof Ionicons>["name"] }) { return <View style={styles.metric}><Ionicons name={icon} size={22} color={colors.burgundy} /><Text style={styles.metricValue}>{value}</Text><Text style={styles.muted}>{label}</Text></View>; }
const styles = StyleSheet.create({ flex: { flex: 1 }, hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, kicker: { fontFamily: type.bold, fontWeight: "700", color: colors.peach, fontSize: 11, letterSpacing: 1.2 }, heroTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 28, lineHeight: 33 }, heroBody: { fontFamily: type.regular, color: "#FAEAF0", fontSize: 14, lineHeight: 21 }, metrics: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }, metric: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs }, metricValue: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 28 }, card: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm }, selected: { borderColor: colors.burgundy, backgroundColor: "#FFF7FA" }, icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, cardTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 15 }, muted: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 }, summary: { marginTop: 3, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 18 }, input: { minHeight: 96, marginTop: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, backgroundColor: colors.surface, color: colors.ink, textAlignVertical: "top" }, chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginVertical: spacing.md }, chip: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }, chipActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, chipText: { color: colors.inkMuted, fontFamily: type.bold, fontSize: 12, textTransform: "capitalize" }, chipTextActive: { color: colors.surface }, provider: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.line, paddingVertical: spacing.md }, assign: { backgroundColor: colors.burgundy, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }, assignText: { color: colors.surface, fontFamily: type.bold, fontSize: 12 }, disabled: { opacity: 0.4 }, error: { marginTop: spacing.md, color: colors.danger, fontFamily: type.medium } });
