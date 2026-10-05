import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
import { directoryLabel } from "../../src/directoryLabels";

export default function DirectoryOrganisationDetailScreen() {
  useSensitiveScreenProtection("directory-organisation-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess); const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "staff", "supervisor"].includes(role));
  const canManage = roles.some((role) => ["admin", "staff"].includes(role));
  const isAdmin = roles.includes("admin");
  const organisation = useQuery(api.justiceServices.staffGetOrganization, allowed && id ? { id: id as Id<"justice_service_organizations"> } : "skip");
  const needsIndependentReviewer = organisation && (organisation.createdBy === access?.user?._id || organisation.lastMaterialEditedBy === access?.user?._id);
  const members = useQuery(api.admin.listOrganizationMembers, isAdmin && organisation ? { organizationId: organisation._id } : "skip");
  const points = organisation?.services ?? [];
  const update = useMutation(api.justiceServices.updateOrganization);
  const [notes, setNotes] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const [agreementVersion, setAgreementVersion] = useState("");
  const [responseHours, setResponseHours] = useState("");
  const [safeguardingReady, setSafeguardingReady] = useState(false);
  useEffect(() => {
    if (!organisation) return;
    setAgreementVersion(organisation.dataSharingAgreementVersion ?? "");
    setResponseHours(organisation.slaHours?.toString() ?? "");
    setSafeguardingReady(organisation.safeguardingReady);
  }, [organisation?._id]);
  async function change(updates: Parameters<typeof update>[0]["updates"]) {
    if (!organisation || busy) return;
    setBusy(true); setError("");
    try { await update({ id: organisation._id as Id<"justice_service_organizations">, updates }); setNotes(""); setNotice(sw ? "Uamuzi umehifadhiwa kwenye rekodi." : "Decision saved to the record."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }
  function confirm(status: "verified" | "suspended" | "inactive") {
    if (!organisation) return;
    if (notes.trim().length < 10) { setError(sw ? "Andika ushahidi au sababu ya uamuzi kwanza." : "Record evidence or a decision reason first."); return; }
    Alert.alert(sw ? "Thibitisha uamuzi" : "Confirm decision", status === "verified" ? (sw ? "Je, umekagua taasisi na ushahidi wake kwa kujitegemea?" : "Have you independently checked this organisation and its evidence?") : (sw ? "Kusimamisha au kuondoa taasisi kutasitisha huduma zake kwenye orodha na makubaliano ya rufaa." : "Suspending or retiring the organisation pauses its listed services and referral agreement."), [
      { text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Endelea" : "Continue", onPress: () => void change({ verificationStatus: status, notes: notes.trim(), ...(status !== "verified" ? { referralAgreementStatus: "suspended" as const } : {}) }) },
    ]);
  }
  function saveReadiness(nextAgreement?: "active" | "suspended") {
    if (!organisation || busy) return;
    if (notes.trim().length < 10) { setError(sw ? "Andika sababu ya uamuzi (herufi 10 au zaidi)." : "Record a decision reason of at least 10 characters."); return; }
    const hours = responseHours.trim() ? Number(responseHours.trim()) : undefined;
    if (hours !== undefined && (!Number.isInteger(hours) || hours < 1 || hours > 720)) { setError(sw ? "Saa za majibu lazima ziwe kati ya 1 na 720." : "Response hours must be between 1 and 720."); return; }
    if (nextAgreement === "active" && (organisation.verificationStatus !== "verified" || !safeguardingReady || !agreementVersion.trim())) { setError(sw ? "Thibitisha taasisi, utayari wa ulinzi na toleo la makubaliano ya data kwanza." : "Verify the organisation, safeguarding readiness and data-sharing agreement version first."); return; }
    const updates = { safeguardingReady, dataSharingAgreementVersion: agreementVersion.trim() || undefined, ...(hours !== undefined ? { slaHours: hours } : {}), ...(nextAgreement ? { referralAgreementStatus: nextAgreement } : {}), notes: notes.trim() };
    Alert.alert(sw ? "Hifadhi utayari?" : "Save readiness?", nextAgreement === "active" ? (sw ? "Taasisi itaruhusiwa kupokea rufaa baada ya kuhifadhi." : "The organisation will be eligible to receive referrals after saving.") : nextAgreement === "suspended" ? (sw ? "Makubaliano ya rufaa yatasimamishwa." : "The referral agreement will be suspended.") : (sw ? "Mabadiliko ya utayari yataandikwa kwenye rekodi." : "Readiness changes will be recorded on the organisation."), [
      { text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Hifadhi" : "Save", onPress: () => void change(updates) },
    ]);
  }
  return <Screen>
    <AppHeader back title={sw ? "Pitia taasisi" : "Review organisation"} eyebrow="LSF · DIRECTORY" />
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <State text={sw ? "Ruhusa ya LSF inahitajika." : "LSF access is required."} /> : organisation === undefined ? <State text={sw ? "Inapakia taasisi..." : "Loading organisation..."} /> : !organisation ? <State text={sw ? "Taasisi haipatikani." : "Organisation not found."} /> : <>
      <View style={styles.hero}><Ionicons name="business-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{organisation.name}</Text><Text style={styles.heroBody}>{directoryLabel(organisation.organizationType, sw)} · {directoryLabel(organisation.verificationStatus, sw)}</Text></View>
      <View style={styles.metrics}><Metric value={organisation.serviceCount} label={sw ? "Huduma" : "Services"} /><Metric value={organisation.activeReferralServiceCount} label={sw ? "Rufaa hai" : "Active referrals"} /><Metric value={organisation.slaHours ?? "—"} label={sw ? "Saa za majibu" : "Response hours"} /></View>
      <Surface><Text style={styles.section}>{sw ? "Utayari na makubaliano" : "Readiness and agreement"}</Text><Line label={sw ? "Uthibitisho" : "Verification"} value={directoryLabel(organisation.verificationStatus, sw)} /><Line label={sw ? "Makubaliano" : "Referral agreement"} value={directoryLabel(organisation.referralAgreementStatus, sw)} /><Line label={sw ? "Ulinzi" : "Safeguarding"} value={organisation.safeguardingReady ? (sw ? "Imethibitishwa" : "Confirmed") : (sw ? "Haijathibitishwa" : "Not confirmed")} /><Line label={sw ? "Toleo la mkataba wa data" : "Data agreement version"} value={organisation.dataSharingAgreementVersion || "—"} /></Surface>
      {canManage ? <Surface><Text style={styles.section}>{sw ? "Dhibiti utayari wa rufaa" : "Manage referral readiness"}</Text><Text style={styles.body}>{sw ? "Thibitisha taarifa hizi na taasisi kabla ya kuwasha makubaliano. Andika sababu ya uamuzi hapa chini." : "Confirm these details with the organisation before activating an agreement. Record the reason below."}</Text><Button label={safeguardingReady ? (sw ? "Ulinzi: umethibitishwa" : "Safeguarding: confirmed") : (sw ? "Ulinzi: haujathibitishwa" : "Safeguarding: not confirmed")} variant="secondary" onPress={() => setSafeguardingReady(!safeguardingReady)} /><Text style={styles.label}>{sw ? "Toleo la makubaliano ya data" : "Data-sharing agreement version"}</Text><TextInput value={agreementVersion} onChangeText={setAgreementVersion} style={styles.shortInput} placeholder={sw ? "Mfano: toleo lililosainiwa" : "Signed agreement version"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Toleo la makubaliano ya data" : "Data-sharing agreement version"} /><Text style={styles.label}>{sw ? "Muda wa kujibu rufaa (saa)" : "Referral response target (hours)"}</Text><TextInput value={responseHours} onChangeText={setResponseHours} keyboardType="number-pad" style={styles.shortInput} placeholder="1–720" placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Muda wa kujibu kwa saa" : "Response target in hours"} /><Button label={sw ? "Hifadhi utayari" : "Save readiness"} variant="secondary" disabled={busy} onPress={() => saveReadiness()} /><Button label={sw ? "Washa makubaliano ya rufaa" : "Activate referral agreement"} disabled={busy || organisation.referralAgreementStatus === "active" || organisation.verificationStatus !== "verified"} onPress={() => saveReadiness("active")} /><Button label={sw ? "Simamisha makubaliano" : "Suspend referral agreement"} variant="quiet" disabled={busy || organisation.referralAgreementStatus !== "active"} onPress={() => saveReadiness("suspended")} /></Surface> : null}
      <Surface><Text style={styles.section}>{sw ? "Mawasiliano ya ndani" : "Internal contact"}</Text><Line label={sw ? "Mhusika" : "Focal person"} value={organisation.focalPersonName || "—"} /><Line label={sw ? "Simu" : "Phone"} value={organisation.focalPersonPhone || "—"} /><Line label="Email" value={organisation.focalPersonEmail || "—"} /><Text style={styles.note}>{sw ? "Mawasiliano haya ni ya ndani na hayaonyeshwi kwenye orodha ya umma." : "These internal contacts are not shown in the public directory."}</Text></Surface>
      {canManage ? <Button label={sw ? "Hariri taarifa za taasisi" : "Edit organisation details"} variant="secondary" onPress={() => router.push({ pathname: "/directory-organisation-form", params: { id: organisation._id } })} /> : null}
      <Text style={styles.section}>{sw ? "Huduma zilizounganishwa" : "Linked services"}</Text>
      {canManage ? <Button label={sw ? "+ Ongeza huduma ya taasisi" : "+ Add service for this organisation"} variant="secondary" onPress={() => router.push({ pathname: "/directory-service-form", params: { organizationId: organisation._id } })} /> : null}
      {points.length === 0 ? <State text={sw ? "Hakuna huduma iliyounganishwa." : "No linked services."} /> : points.map((point) => <Surface key={point._id}><Text style={styles.title}>{point.name}</Text><Text style={styles.muted}>{point.district}, {point.region} · {directoryLabel(point.verificationStatus, sw)} · {directoryLabel(point.visibility, sw)}</Text><Button label={sw ? "Pitia huduma" : "Review service"} variant="secondary" onPress={() => router.push({ pathname: "/directory-service/[id]", params: { id: point._id } })} /></Surface>)}
      {isAdmin ? <><Text style={styles.section}>{sw ? "Wafanyakazi na ruhusa" : "Members and access"}</Text>{members === undefined ? <State text={sw ? "Inapakia wanachama..." : "Loading members..."} /> : members.length === 0 ? <State text={sw ? "Hakuna jukumu lililounganishwa." : "No linked role assignments."} /> : members.map((member) => <Surface key={member.id}><Text style={styles.title}>{member.name}</Text><Text style={styles.muted}>{member.email} · {directoryLabel(member.role, sw)} · {directoryLabel(member.status, sw)}</Text>{member.status === "active" && member.email ? <Button label={sw ? "Kagua ruhusa za mfanyakazi" : "Review member access"} variant="quiet" onPress={() => router.push({ pathname: "/access-management", params: { search: member.email } })} /> : null}</Surface>)}<Button label={sw ? "Dhibiti ruhusa na maombi" : "Manage access and requests"} variant="secondary" onPress={() => router.push("/access-management")} /></> : null}
      {canManage ? <Surface tone="pink"><Text style={styles.section}>{sw ? "Uamuzi wa taasisi" : "Organisation decision"}</Text><Text style={styles.body}>{sw ? "Rekodi chanzo na sababu ya ukaguzi kabla ya kuthibitisha. Hii haitawasha makubaliano ya rufaa moja kwa moja." : "Record the evidence and reason before verification. This does not automatically activate a referral agreement."}</Text>{needsIndependentReviewer && organisation.verificationStatus !== "verified" ? <Text style={styles.note}>{sw ? "Uliunda au kuhariri rekodi hii. Mfanyakazi mwingine wa LSF lazima aidhinishe uthibitisho." : "You created or materially edited this record. Another LSF reviewer must verify it."}</Text> : null}<TextInput value={notes} onChangeText={setNotes} multiline maxLength={1000} style={styles.input} placeholder={sw ? "Ushahidi wa ukaguzi na maelezo" : "Verification evidence and notes"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Maelezo ya ukaguzi" : "Verification notes"} />{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}{notice ? <Text accessibilityRole="alert" style={styles.note}>{notice}</Text> : null}<Button label={sw ? "Thibitisha taasisi" : "Verify organisation"} disabled={busy || organisation.verificationStatus === "verified" || !!needsIndependentReviewer} onPress={() => confirm("verified")} /><Button label={sw ? "Simamisha taasisi" : "Suspend organisation"} variant="secondary" disabled={busy || organisation.verificationStatus === "suspended" || organisation.verificationStatus === "inactive"} onPress={() => confirm("suspended")} /><Button label={sw ? "Ondoa taasisi kwenye orodha" : "Retire organisation"} variant="quiet" disabled={busy || organisation.verificationStatus === "inactive"} onPress={() => confirm("inactive")} /></Surface> : null}
    </>}
  </Screen>;
}
function State({ text }: { text: string }) { return <Surface><Text style={styles.body}>{text}</Text></Surface>; }
function Line({ label, value }: { label: string; value: string }) { return <View style={styles.line}><Text style={styles.muted}>{label}</Text><Text style={styles.value}>{value}</Text></View>; }
function Metric({ value, label }: { value: number | string; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.muted}>{label}</Text></View>; }
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 30, lineHeight: 38 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 16, lineHeight: 24 }, metrics: { flexDirection: "row", gap: spacing.sm }, metric: { flex: 1, minHeight: 80, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.sm }, metricValue: { color: colors.burgundy, fontFamily: type.bold, fontSize: 23 }, section: { color: colors.burgundy, fontFamily: type.bold, fontSize: 19, marginBottom: spacing.sm }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 18 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 16, lineHeight: 24 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 14, lineHeight: 20 }, line: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, borderBottomWidth: 1, borderColor: colors.line, paddingVertical: spacing.sm }, value: { color: colors.ink, fontFamily: type.medium, fontSize: 14, lineHeight: 20, flex: 1, textAlign: "right" }, note: { color: colors.orange, fontFamily: type.medium, fontSize: 15, lineHeight: 22, marginTop: spacing.md }, label: { color: colors.charcoal, fontFamily: type.medium, fontSize: 15, marginTop: spacing.md }, shortInput: { minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, paddingHorizontal: spacing.md, color: colors.ink, fontSize: 16 }, input: { minHeight: 100, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, color: colors.ink, fontSize: 16, textAlignVertical: "top" }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 15 } });
