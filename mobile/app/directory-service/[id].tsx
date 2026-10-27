import { plainError } from "../../../shared/plainLanguage";
import { AdminIntro } from "../../src/admin/AdminIntro";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { AdminScreen as Screen } from "../../src/admin/AdminScreen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";
import { directoryLabel } from "../../src/directoryLabels";

type Intake = "open" | "limited" | "closed" | "emergency_only";
const intakeLabels: Record<Intake, { sw: string; en: string }> = {
  open: { sw: "Inapokea", en: "Open" }, limited: { sw: "Nafasi chache", en: "Limited" },
  closed: { sw: "Imefungwa", en: "Closed" }, emergency_only: { sw: "Dharura tu", en: "Emergency only" },
};

export default function DirectoryServiceDetailScreen() {
  useSensitiveScreenProtection("directory-service-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "staff", "supervisor"].includes(role));
  const canManage = roles.some((role) => ["admin", "staff"].includes(role));
  const item = useQuery(api.justiceServices.staffGetService, allowed && id ? { id: id as Id<"justice_services"> } : "skip");
  const reviewOverdue = Boolean(item?.verificationStatus === "verified" && (!item.nextReviewAt || item.nextReviewAt <= Date.now()));
  const needsIndependentReviewer = item && (item.createdBy === access?.user?._id || item.lastMaterialEditedBy === access?.user?._id);
  const update = useMutation(api.justiceServices.updateService);
  const [source, setSource] = useState(""); const [authority, setAuthority] = useState(""); const [decisionReason, setDecisionReason] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");

  async function change(updates: Parameters<typeof update>[0]["updates"], reason?: string) {
    if (!item || busy) return;
    setBusy(true); setError("");
    try { await update({ id: item._id as Id<"justice_services">, updates, decisionReason: reason }); if (reason) setDecisionReason(""); setNotice(sw ? "Mabadiliko yamehifadhiwa kwenye rekodi." : "Change saved to the record."); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }
  function verify() {
    if (!item) return;
    const chosenSource = source.trim() || item.source?.trim();
    const chosenAuthority = authority.trim() || item.verifyingAuthority?.trim();
    if (!chosenSource || !chosenAuthority) { setError(sw ? "Weka chanzo na mamlaka iliyothibitisha." : "Record a source and verifying authority first."); return; }
    if (decisionReason.trim().length < 10) { setError(sw ? "Andika sababu ya uthibitisho." : "Record the verification decision reason."); return; }
    if (item.organizationId && item.organization?.verificationStatus !== "verified") { setError(sw ? "Thibitisha taasisi inayohusishwa kwanza." : "Verify the linked organisation first."); return; }
    Alert.alert(sw ? (reviewOverdue ? "Fanya ukaguzi mpya?" : "Thibitisha huduma?") : (reviewOverdue ? "Renew verification?" : "Verify this service?"), sw ? "Hakikisha taarifa za mawasiliano, eneo na upatikanaji kutoka chanzo halisi. Ikiwa huduma imewashwa, ukaguzi huu mpya utairudisha kwenye orodha ya umma. Ukaguzi unaofuata ni miezi sita." : "Check contact, location and intake details against the source. If this service is active, renewal restores it to public results. The next review is in six months.", [
      { text: sw ? "Ghairi" : "Cancel", style: "cancel" },
      { text: sw ? "Thibitisha" : "Verify", onPress: () => { const now = Date.now(); void change({ source: chosenSource, verifyingAuthority: chosenAuthority, verificationStatus: "verified", lastVerifiedAt: now, nextReviewAt: now + 180 * 24 * 60 * 60 * 1000 }, decisionReason.trim()); } },
    ]);
  }
  function confirmIntake(state: Intake) {
    if (!item || state === item.currentIntakeState) return;
    if (decisionReason.trim().length < 10) { setError(sw ? "Andika sababu ya kubadili upatikanaji (herufi 10 au zaidi)." : "Record why intake is changing (at least 10 characters)."); return; }
    Alert.alert(sw ? "Badili upatikanaji?" : "Change availability?", sw ? `Huduma itakuwa: ${intakeLabels[state].sw}. Hakikisha umezungumza na mtoa huduma.` : `The service will be: ${intakeLabels[state].en}. Confirm this with the provider first.`, [
      { text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Hifadhi" : "Save", onPress: () => void change({ currentIntakeState: state }, decisionReason.trim()) },
    ]);
  }
  return <Screen>
    <AppHeader back title={sw ? "Pitia huduma" : "Review service"} eyebrow="LSF · DIRECTORY" />
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <State text={sw ? "Ruhusa ya LSF inahitajika." : "LSF access is required."} /> : item === undefined ? <State text={sw ? "Inapakia huduma..." : "Loading service..."} /> : !item ? <State text={sw ? "Huduma haipatikani." : "Service not found."} /> : <>
      <AdminIntro icon="book-outline" eyebrow="LSF" title={item.name} description={`${item.organization?.name ?? item.organizationName ?? "—"} · ${directoryLabel(item.servicePointType, sw)}`} />
      {item.servicePointType === "safe_house" || item.visibility === "confidential" ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Eneo la siri" : "Confidential location"}</Text><Text style={styles.body}>{sw ? "Usiweke anwani au mawasiliano ya eneo hili hadharani. Unaweza kushughulikia taarifa zake kwa ruhusa ya ndani tu." : "Never publish this location or its contact details. Handle it within authorised staff access only."}</Text></Surface> : null}
      <Surface><Text style={styles.section}>{sw ? "Hali ya rekodi" : "Record state"}</Text><Line label={sw ? "Uthibitisho" : "Verification"} value={directoryLabel(item.verificationStatus, sw)} /><Line label={sw ? "Mwonekano" : "Visibility"} value={directoryLabel(item.visibility, sw)} /><Line label={sw ? "Inaonekana" : "Active"} value={item.active ? (sw ? "Ndiyo" : "Yes") : (sw ? "Hapana" : "No")} /><Line label={sw ? "Upatikanaji" : "Intake"} value={directoryLabel(item.currentIntakeState, sw)} /><Line label={sw ? "Rufaa" : "Referrals"} value={item.referralCapability ? (sw ? "Ndiyo" : "Yes") : (sw ? "Hapana" : "No")} /></Surface>
      {reviewOverdue ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Ukaguzi wa huduma umechelewa" : "Service review overdue"}</Text><Text style={styles.body}>{sw ? "Huduma hii imeondolewa kwenye matokeo ya umma hadi mfanyakazi mwingine wa LSF athibitishe tena chanzo, mawasiliano na upatikanaji wake." : "This service is excluded from public results until another LSF reviewer checks its source, contact details and current availability."}</Text></Surface> : null}
      <Surface><Text style={styles.section}>{sw ? "Eneo na mawasiliano" : "Location and contact"}</Text><Line label={sw ? "Mkoa" : "Region"} value={item.region} /><Line label={sw ? "Wilaya" : "District"} value={item.district} /><Line label={sw ? "Anwani" : "Address"} value={item.physicalLocation || "—"} /><Line label={sw ? "Simu" : "Phone"} value={item.phone || "—"} /><Line label={sw ? "Saa" : "Hours"} value={item.openingHours || "—"} /></Surface>
      <Surface><Text style={styles.section}>{sw ? "Uwezo wa huduma" : "Service capability"}</Text><Line label={sw ? "Masuala" : "Issues"} value={item.issueCategories.join(", ") || "—"} /><Line label={sw ? "Lugha" : "Languages"} value={item.languages.join(", ") || "—"} /><Line label={sw ? "Simu" : "Phone support"} value={item.phoneSupport ? (sw ? "Ndiyo" : "Yes") : (sw ? "Hapana" : "No")} /><Line label={sw ? "Kwa mbali" : "Remote support"} value={item.remoteSupport ? (sw ? "Ndiyo" : "Yes") : (sw ? "Hapana" : "No")} /><Line label={sw ? "Dharura" : "Emergency"} value={item.emergencyCapability ? (sw ? "Ndiyo" : "Yes") : (sw ? "Hapana" : "No")} /></Surface>
      <Surface><Text style={styles.section}>{sw ? "Ushahidi wa uthibitisho" : "Verification evidence"}</Text><Line label={sw ? "Chanzo" : "Source"} value={item.source || "—"} /><Line label={sw ? "Mamlaka" : "Authority"} value={item.verifyingAuthority || "—"} /><Line label={sw ? "Mara ya mwisho" : "Last checked"} value={item.lastVerifiedAt ? new Date(item.lastVerifiedAt).toLocaleDateString() : "—"} /><Line label={sw ? "Ukaguzi ujao" : "Next review"} value={item.nextReviewAt ? new Date(item.nextReviewAt).toLocaleDateString() : "—"} /></Surface>
      {canManage ? <Button label={sw ? "Sahihisha taarifa za huduma" : "Correct service details"} variant="secondary" onPress={() => router.push({ pathname: "/directory-service-form", params: { id: item._id } })} /> : null}
      {canManage ? <Surface tone="pink"><Text style={styles.section}>{sw ? "Hatua za msimamizi" : "Staff actions"}</Text>
        <Text style={styles.body}>{sw ? "Badili hali ya kupokea kesi baada ya kuthibitisha moja kwa moja na mtoa huduma." : "Update intake only after checking directly with the provider."}</Text>
        <View style={styles.choices}>{(["open", "limited", "closed", "emergency_only"] as Intake[]).map((state) => <Pressable key={state} accessibilityRole="button" accessibilityState={{ selected: item.currentIntakeState === state, disabled: busy }} disabled={busy} style={[styles.choice, item.currentIntakeState === state && styles.choiceOn]} onPress={() => confirmIntake(state)}><Text style={[styles.choiceText, item.currentIntakeState === state && styles.choiceTextOn]}>{sw ? intakeLabels[state].sw : intakeLabels[state].en}</Text></Pressable>)}</View>
        <TextInput value={source} onChangeText={setSource} style={styles.input} placeholder={sw ? "Chanzo kilichokaguliwa" : "Verified source"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Chanzo" : "Source"} />
        <TextInput value={authority} onChangeText={setAuthority} style={styles.input} placeholder={sw ? "Mamlaka iliyothibitisha" : "Verifying authority"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Mamlaka" : "Authority"} />
        <TextInput value={decisionReason} onChangeText={setDecisionReason} multiline maxLength={1000} style={[styles.input, { minHeight: 84, textAlignVertical: "top" }]} placeholder={sw ? "Sababu ya hatua hii (angalau herufi 10)" : "Reason for this decision (at least 10 characters)"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Sababu ya uamuzi" : "Decision reason"} />
        {needsIndependentReviewer && (item.verificationStatus !== "verified" || reviewOverdue) ? <Text style={styles.body}>{sw ? "Uliunda au kuhariri rekodi hii. Mfanyakazi mwingine wa LSF lazima aidhinishe uthibitisho." : "You created or materially edited this record. Another LSF reviewer must verify it."}</Text> : null}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}{notice ? <Text accessibilityRole="alert" style={styles.body}>{notice}</Text> : null}
        <Button label={reviewOverdue ? (sw ? "Thibitisha upya rekodi" : "Renew verification") : (sw ? "Thibitisha rekodi" : "Verify record")} disabled={busy || (item.verificationStatus === "verified" && !reviewOverdue) || !!needsIndependentReviewer} onPress={verify} />
        <Button label={item.active ? (sw ? "Sitisha huduma" : "Pause service") : (sw ? "Washa huduma" : "Activate service")} variant="secondary" disabled={busy || (!item.active && item.verificationStatus !== "verified")} onPress={() => { if (decisionReason.trim().length < 10) { setError(sw ? "Andika sababu ya hatua hii." : "Record a decision reason first."); return; } Alert.alert(sw ? "Thibitisha mabadiliko" : "Confirm change", sw ? "Hii itabadilisha upatikanaji wa huduma kwenye orodha." : "This changes whether the service is available in the directory.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Endelea" : "Continue", onPress: () => void change({ active: !item.active }, decisionReason.trim()) }]); }} />
        <Button label={sw ? "Ondoa huduma kwenye orodha" : "Retire service record"} variant="quiet" disabled={busy || item.verificationStatus === "inactive"} onPress={() => { if (decisionReason.trim().length < 10) { setError(sw ? "Andika sababu ya kuondoa." : "Record a retirement reason first."); return; } Alert.alert(sw ? "Ondoa huduma?" : "Retire service?", sw ? "Rekodi itabaki kwenye historia, lakini haitakuwa ya umma." : "The record remains in history but leaves the public directory.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Ondoa" : "Retire", onPress: () => void change({ verificationStatus: "inactive", active: false, currentIntakeState: "closed" }, decisionReason.trim()) }]); }} />
      </Surface> : null}
    </>}
  </Screen>;
}
function State({ text }: { text: string }) { return <Surface><Text style={styles.body}>{text}</Text></Surface>; }
function Line({ label, value }: { label: string; value: string }) { return <View style={styles.line}><Text style={styles.muted}>{label}</Text><Text style={styles.value}>{value}</Text></View>; }
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 30, lineHeight: 38 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 16, lineHeight: 24 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 18 }, section: { color: colors.burgundy, fontFamily: type.bold, fontSize: 19, marginBottom: spacing.sm }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 16, lineHeight: 24 }, line: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, borderBottomWidth: 1, borderColor: colors.line, paddingVertical: spacing.sm }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 14, lineHeight: 20, flex: 1 }, value: { color: colors.ink, fontFamily: type.medium, fontSize: 14, lineHeight: 20, flex: 2, textAlign: "right" }, choices: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, choice: { minHeight: 48, justifyContent: "center", paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line }, choiceOn: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, choiceText: { color: colors.ink, fontFamily: type.medium, fontSize: 14, textTransform: "capitalize" }, choiceTextOn: { color: colors.surface }, input: { minHeight: 50, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, paddingHorizontal: spacing.md, color: colors.ink, fontSize: 16 }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 15 } });
