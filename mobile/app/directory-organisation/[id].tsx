import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

export default function DirectoryOrganisationDetailScreen() {
  useSensitiveScreenProtection("directory-organisation-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess); const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "staff", "supervisor"].includes(role));
  const canManage = roles.some((role) => ["admin", "staff"].includes(role));
  const organisations = useQuery(api.justiceServices.staffListOrganizations, allowed ? {} : "skip");
  const services = useQuery(api.justiceServices.staffListServices, allowed ? {} : "skip");
  const organisation = organisations?.find((entry) => entry._id === id);
  const points = services?.filter((entry) => entry.organizationId === id) ?? [];
  const update = useMutation(api.justiceServices.updateOrganization);
  const [notes, setNotes] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function change(updates: Parameters<typeof update>[0]["updates"]) {
    if (!organisation || busy) return;
    setBusy(true); setError("");
    try { await update({ id: organisation._id as Id<"justice_service_organizations">, updates }); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }
  function confirm(status: "verified" | "suspended") {
    if (!organisation) return;
    if (status === "verified" && notes.trim().length < 10) { setError(sw ? "Andika ushahidi wa ukaguzi kwanza." : "Record verification evidence first."); return; }
    Alert.alert(sw ? "Thibitisha uamuzi" : "Confirm decision", status === "verified" ? (sw ? "Je, umekagua taasisi na ushahidi wake kwa kujitegemea?" : "Have you independently checked this organisation and its evidence?") : (sw ? "Kusimamisha taasisi kutasimamisha makubaliano yake ya rufaa." : "Suspending the organisation also suspends its referral agreement."), [
      { text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Endelea" : "Continue", onPress: () => void change({ verificationStatus: status, notes: status === "verified" ? notes.trim() : organisation.notes, ...(status === "suspended" ? { referralAgreementStatus: "suspended" as const } : {}) }) },
    ]);
  }
  return <Screen>
    <AppHeader back title={sw ? "Pitia taasisi" : "Review organisation"} eyebrow="LSF · DIRECTORY" />
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <State text={sw ? "Ruhusa ya LSF inahitajika." : "LSF access is required."} /> : organisations === undefined ? <State text={sw ? "Inapakia taasisi..." : "Loading organisation..."} /> : !organisation ? <State text={sw ? "Taasisi haipatikani." : "Organisation not found."} /> : <>
      <View style={styles.hero}><Ionicons name="business-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{organisation.name}</Text><Text style={styles.heroBody}>{organisation.organizationType.replaceAll("_", " ")} · {organisation.verificationStatus}</Text></View>
      <View style={styles.metrics}><Metric value={organisation.serviceCount} label={sw ? "Huduma" : "Services"} /><Metric value={organisation.activeReferralServiceCount} label={sw ? "Rufaa hai" : "Active referrals"} /><Metric value={organisation.slaHours ?? "—"} label={sw ? "Saa za majibu" : "Response hours"} /></View>
      <Surface><Text style={styles.section}>{sw ? "Utayari na makubaliano" : "Readiness and agreement"}</Text><Line label={sw ? "Uthibitisho" : "Verification"} value={organisation.verificationStatus} /><Line label={sw ? "Makubaliano" : "Referral agreement"} value={organisation.referralAgreementStatus} /><Line label={sw ? "Ulinzi" : "Safeguarding"} value={organisation.safeguardingReady ? (sw ? "Imethibitishwa" : "Confirmed") : (sw ? "Haijathibitishwa" : "Not confirmed")} /><Line label={sw ? "Toleo la mkataba wa data" : "Data agreement version"} value={organisation.dataSharingAgreementVersion || "—"} /></Surface>
      <Surface><Text style={styles.section}>{sw ? "Mawasiliano ya ndani" : "Internal contact"}</Text><Line label={sw ? "Mhusika" : "Focal person"} value={organisation.focalPersonName || "—"} /><Line label={sw ? "Simu" : "Phone"} value={organisation.focalPersonPhone || "—"} /><Line label="Email" value={organisation.focalPersonEmail || "—"} /><Text style={styles.note}>{sw ? "Mawasiliano haya ni ya ndani na hayaonyeshwi kwenye orodha ya umma." : "These internal contacts are not shown in the public directory."}</Text></Surface>
      <Text style={styles.section}>{sw ? "Huduma zilizounganishwa" : "Linked services"}</Text>
      {services === undefined ? <State text={sw ? "Inapakia huduma..." : "Loading services..."} /> : points.length === 0 ? <State text={sw ? "Hakuna huduma iliyounganishwa." : "No linked services."} /> : points.map((point) => <Surface key={point._id}><Text style={styles.title}>{point.name}</Text><Text style={styles.muted}>{point.district}, {point.region} · {point.verificationStatus} · {point.visibility}</Text><Button label={sw ? "Pitia huduma" : "Review service"} variant="secondary" onPress={() => router.push({ pathname: "/directory-service/[id]", params: { id: point._id } })} /></Surface>)}
      {canManage ? <Surface tone="pink"><Text style={styles.section}>{sw ? "Uamuzi wa taasisi" : "Organisation decision"}</Text><Text style={styles.body}>{sw ? "Rekodi chanzo na sababu ya ukaguzi kabla ya kuthibitisha. Hii haitawasha makubaliano ya rufaa moja kwa moja." : "Record the evidence and reason before verification. This does not automatically activate a referral agreement."}</Text><TextInput value={notes} onChangeText={setNotes} multiline style={styles.input} placeholder={sw ? "Ushahidi wa ukaguzi na maelezo" : "Verification evidence and notes"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Maelezo ya ukaguzi" : "Verification notes"} />{error ? <Text style={styles.error}>{error}</Text> : null}<Button label={sw ? "Thibitisha taasisi" : "Verify organisation"} disabled={busy || organisation.verificationStatus === "verified"} onPress={() => confirm("verified")} /><Button label={sw ? "Simamisha taasisi" : "Suspend organisation"} variant="secondary" disabled={busy || organisation.verificationStatus === "suspended"} onPress={() => confirm("suspended")} /></Surface> : null}
    </>}
  </Screen>;
}
function State({ text }: { text: string }) { return <Surface><Text style={styles.body}>{text}</Text></Surface>; }
function Line({ label, value }: { label: string; value: string }) { return <View style={styles.line}><Text style={styles.muted}>{label}</Text><Text style={styles.value}>{value}</Text></View>; }
function Metric({ value, label }: { value: number | string; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.muted}>{label}</Text></View>; }
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27, lineHeight: 32 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14 }, metrics: { flexDirection: "row", gap: spacing.sm }, metric: { flex: 1, minHeight: 80, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.sm }, metricValue: { color: colors.burgundy, fontFamily: type.bold, fontSize: 23 }, section: { color: colors.burgundy, fontFamily: type.bold, fontSize: 16, marginBottom: spacing.sm }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 15 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 20 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12 }, line: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, borderBottomWidth: 1, borderColor: colors.line, paddingVertical: spacing.sm }, value: { color: colors.ink, fontFamily: type.medium, fontSize: 12, flex: 1, textAlign: "right" }, note: { color: colors.orange, fontFamily: type.medium, fontSize: 12, marginTop: spacing.md }, input: { minHeight: 100, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, color: colors.ink, textAlignVertical: "top" }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 13 } });
