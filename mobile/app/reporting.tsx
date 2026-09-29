import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Alert, Share, StyleSheet, Text, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

export default function ReportingScreen() {
  useSensitiveScreenProtection("donor-safe-reporting");
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess); const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "staff", "supervisor", "stakeholder", "donor"].includes(role));
  const canGenerate = roles.some((role) => ["admin", "staff", "supervisor"].includes(role));
  const canApprove = roles.some((role) => ["admin", "supervisor"].includes(role));
  const [status, setStatus] = useState<"draft" | "approved">(canGenerate ? "draft" : "approved"); const [busy, setBusy] = useState(false);
  const snapshots = useQuery(api.reporting.listSnapshots, allowed ? { status } : "skip");
  const generate = useMutation(api.reporting.generateDonorSafeSnapshot); const approve = useMutation(api.reporting.approveSnapshot);
  if (access === undefined) return <Screen><Text style={styles.muted}>{sw ? "Inapakia..." : "Loading..."}</Text></Screen>;
  if (!allowed) return <Screen><AppHeader back title={sw ? "Taarifa" : "Reporting"} /><Surface tone="orange"><Text style={styles.title}>{sw ? "Ufikiaji haujaruhusiwa" : "Access is not authorised"}</Text></Surface></Screen>;
  async function generateSnapshot() { setBusy(true); try { await generate({ days: 30 }); setStatus("draft"); } catch (error) { Alert.alert(sw ? "Haikuundwa" : "Not generated", error instanceof Error ? error.message : String(error)); } finally { setBusy(false); } }
  async function approveSnapshot(id: Id<"metric_snapshots">) { setBusy(true); try { await approve({ snapshotId: id }); setStatus("approved"); } catch (error) { Alert.alert(sw ? "Haikuidhinishwa" : "Not approved", error instanceof Error ? error.message : String(error)); } finally { setBusy(false); } }
  function safeText(snapshot: NonNullable<typeof snapshots>[number]) { const v = snapshot.values; return `${sw ? "Muhtasari wa athari" : "Impact summary"}\n${new Date(snapshot.periodStart).toLocaleDateString()} – ${new Date(snapshot.periodEnd).toLocaleDateString()}\n${sw ? "Maombi" : "Requests"}: ${v.requestsSubmitted ?? "suppressed"}\n${sw ? "Kesi zilizotatuliwa" : "Resolved cases"}: ${v.resolvedCases ?? "suppressed"}\n${sw ? "Kukubaliwa kwa rufaa" : "Referral acceptance"}: ${v.referralAcceptanceRate ?? 0}%\n${sw ? "Wastani wa maoni" : "Feedback average"}: ${v.feedbackAverageRating ?? 0}\n${snapshot.publicSummary}`; }
  return <Screen>
    <AppHeader back title={sw ? "Taarifa salama kwa wafadhili" : "Donor-safe reporting"} eyebrow="LSF · AGGREGATE ONLY" />
    <View style={styles.hero}><Text style={styles.kicker}>IMPACT · PRIVACY · ACCOUNTABILITY</Text><Text style={styles.heroTitle}>{sw ? "Onyesha athari bila kufichua watu." : "Show impact without exposing people."}</Text><Text style={styles.heroBody}>{sw ? "Takwimu ndogo hufichwa, rasimu hupitiwa na mtu tofauti, na taarifa binafsi haziingii kwenye usafirishaji." : "Small cells are suppressed, drafts require a different approver, and personal data stays out of exports."}</Text></View>
    {canGenerate ? <Button label={sw ? "Unda rasimu ya siku 30" : "Generate 30-day draft"} loading={busy} disabled={busy} onPress={() => void generateSnapshot()} /> : null}
    <View style={styles.tabs}><Button label={sw ? "Zilizoidhinishwa" : "Approved"} variant={status === "approved" ? "primary" : "quiet"} onPress={() => setStatus("approved")} />{canGenerate ? <Button label={sw ? "Rasimu" : "Drafts"} variant={status === "draft" ? "primary" : "quiet"} onPress={() => setStatus("draft")} /> : null}</View>
    {snapshots?.map((snapshot) => <Surface key={snapshot._id} tone={snapshot.approvalStatus === "approved" ? "teal" : "pink"}><View style={styles.row}><View style={styles.icon}><Ionicons name="bar-chart-outline" size={22} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{snapshot.values.periodDays} {sw ? "siku" : "days"}</Text><Text style={styles.muted}>{new Date(snapshot.periodStart).toLocaleDateString(sw ? "sw-TZ" : "en-TZ")} – {new Date(snapshot.periodEnd).toLocaleDateString(sw ? "sw-TZ" : "en-TZ")}</Text></View><Text style={styles.badge}>{snapshot.approvalStatus}</Text></View><View style={styles.metrics}><Metric value={snapshot.values.requestsSubmitted} label={sw ? "Maombi" : "Requests"} /><Metric value={snapshot.values.resolvedCases} label={sw ? "Zilizotatuliwa" : "Resolved"} /><Metric value={`${snapshot.values.referralAcceptanceRate ?? 0}%`} label={sw ? "Rufaa" : "Referrals"} /></View>{snapshot.qualityFlags.length ? <Text style={styles.flags}>{sw ? "Ukaguzi wa ubora" : "Quality checks"}: {snapshot.qualityFlags.join(" · ")}</Text> : null}{snapshot.approvalStatus === "draft" && canApprove ? <Button label={sw ? "Idhinisha taarifa" : "Approve report"} disabled={busy} onPress={() => void approveSnapshot(snapshot._id)} /> : null}{snapshot.approvalStatus === "approved" ? <Button label={sw ? "Shiriki muhtasari salama" : "Share safe summary"} variant="secondary" onPress={() => void Share.share({ message: safeText(snapshot) })} /> : null}</Surface>)}
    {snapshots?.length === 0 ? <Surface><Text style={styles.muted}>{sw ? "Hakuna taarifa katika hali hii." : "No report is available in this state."}</Text></Surface> : null}
  </Screen>;
}

function Metric({ value, label }: { value: unknown; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value === null || value === undefined ? "—" : String(value)}</Text><Text style={styles.muted}>{label}</Text></View>; }
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1.2 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27, lineHeight: 32 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, tabs: { flexDirection: "row", gap: spacing.sm }, row: { flexDirection: "row", alignItems: "center", gap: spacing.md }, icon: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, flex: { flex: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 }, badge: { color: colors.burgundy, fontFamily: type.bold, fontSize: 11, textTransform: "uppercase" }, metrics: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }, metric: { flex: 1, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.sm }, metricValue: { color: colors.ink, fontFamily: type.bold, fontSize: 20 }, flags: { marginTop: spacing.md, color: colors.orange, fontFamily: type.medium, fontSize: 12, lineHeight: 18 } });
