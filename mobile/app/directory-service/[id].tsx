import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

type Intake = "open" | "limited" | "closed" | "emergency_only";

export default function DirectoryServiceDetailScreen() {
  useSensitiveScreenProtection("directory-service-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "staff", "supervisor"].includes(role));
  const canManage = roles.some((role) => ["admin", "staff"].includes(role));
  const services = useQuery(api.justiceServices.staffListServices, allowed ? {} : "skip");
  const item = services?.find((service) => service._id === id);
  const update = useMutation(api.justiceServices.updateService);
  const [source, setSource] = useState(""); const [authority, setAuthority] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");

  async function change(updates: Parameters<typeof update>[0]["updates"]) {
    if (!item || busy) return;
    setBusy(true); setError("");
    try { await update({ id: item._id as Id<"justice_services">, updates }); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }
  function verify() {
    if (!item) return;
    const chosenSource = source.trim() || item.source?.trim();
    const chosenAuthority = authority.trim() || item.verifyingAuthority?.trim();
    if (!chosenSource || !chosenAuthority) { setError(sw ? "Weka chanzo na mamlaka iliyothibitisha." : "Record a source and verifying authority first."); return; }
    if (item.organizationId && item.organization?.verificationStatus !== "verified") { setError(sw ? "Thibitisha taasisi inayohusishwa kwanza." : "Verify the linked organisation first."); return; }
    Alert.alert(sw ? "Thibitisha huduma?" : "Verify this service?", sw ? "Hakikisha taarifa za mawasiliano, eneo na upatikanaji kutoka chanzo halisi. Tarehe ya ukaguzi unaofuata ni miezi sita." : "Confirm contact, location and intake details against the source. The next review date is six months away.", [
      { text: sw ? "Ghairi" : "Cancel", style: "cancel" },
      { text: sw ? "Thibitisha" : "Verify", onPress: () => { const now = Date.now(); void change({ source: chosenSource, verifyingAuthority: chosenAuthority, verificationStatus: "verified", lastVerifiedAt: now, nextReviewAt: now + 180 * 24 * 60 * 60 * 1000 }); } },
    ]);
  }
  return <Screen>
    <AppHeader back title={sw ? "Pitia huduma" : "Review service"} eyebrow="LSF · DIRECTORY" />
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <State text={sw ? "Ruhusa ya LSF inahitajika." : "LSF access is required."} /> : services === undefined ? <State text={sw ? "Inapakia huduma..." : "Loading service..."} /> : !item ? <State text={sw ? "Huduma haipatikani." : "Service not found."} /> : <>
      <View style={styles.hero}><Ionicons name={item.servicePointType === "safe_house" ? "shield-checkmark-outline" : "business-outline"} size={30} color={colors.peach} /><Text style={styles.heroTitle}>{item.name}</Text><Text style={styles.heroBody}>{item.organization?.name ?? item.organizationName ?? "—"} · {item.servicePointType.replaceAll("_", " ")}</Text></View>
      {item.servicePointType === "safe_house" || item.visibility === "confidential" ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Eneo la siri" : "Confidential location"}</Text><Text style={styles.body}>{sw ? "Usiweke anwani au mawasiliano ya eneo hili hadharani. Unaweza kushughulikia taarifa zake kwa ruhusa ya ndani tu." : "Never publish this location or its contact details. Handle it within authorised staff access only."}</Text></Surface> : null}
      <Surface><Text style={styles.section}>{sw ? "Hali ya rekodi" : "Record state"}</Text><Line label={sw ? "Uthibitisho" : "Verification"} value={item.verificationStatus} /><Line label={sw ? "Mwonekano" : "Visibility"} value={item.visibility} /><Line label={sw ? "Inaonekana" : "Active"} value={item.active ? (sw ? "Ndiyo" : "Yes") : (sw ? "Hapana" : "No")} /><Line label={sw ? "Upatikanaji" : "Intake"} value={item.currentIntakeState} /><Line label={sw ? "Rufaa" : "Referrals"} value={item.referralCapability ? (sw ? "Ndiyo" : "Yes") : (sw ? "Hapana" : "No")} /></Surface>
      <Surface><Text style={styles.section}>{sw ? "Eneo na mawasiliano" : "Location and contact"}</Text><Line label={sw ? "Mkoa" : "Region"} value={item.region} /><Line label={sw ? "Wilaya" : "District"} value={item.district} /><Line label={sw ? "Anwani" : "Address"} value={item.physicalLocation || "—"} /><Line label={sw ? "Simu" : "Phone"} value={item.phone || "—"} /><Line label={sw ? "Saa" : "Hours"} value={item.openingHours || "—"} /></Surface>
      <Surface><Text style={styles.section}>{sw ? "Uwezo wa huduma" : "Service capability"}</Text><Line label={sw ? "Masuala" : "Issues"} value={item.issueCategories.join(", ") || "—"} /><Line label={sw ? "Lugha" : "Languages"} value={item.languages.join(", ") || "—"} /><Line label={sw ? "Simu" : "Phone support"} value={item.phoneSupport ? "Yes" : "No"} /><Line label={sw ? "Kwa mbali" : "Remote support"} value={item.remoteSupport ? "Yes" : "No"} /><Line label={sw ? "Dharura" : "Emergency"} value={item.emergencyCapability ? "Yes" : "No"} /></Surface>
      <Surface><Text style={styles.section}>{sw ? "Ushahidi wa uthibitisho" : "Verification evidence"}</Text><Line label={sw ? "Chanzo" : "Source"} value={item.source || "—"} /><Line label={sw ? "Mamlaka" : "Authority"} value={item.verifyingAuthority || "—"} /><Line label={sw ? "Mara ya mwisho" : "Last checked"} value={item.lastVerifiedAt ? new Date(item.lastVerifiedAt).toLocaleDateString() : "—"} /><Line label={sw ? "Ukaguzi ujao" : "Next review"} value={item.nextReviewAt ? new Date(item.nextReviewAt).toLocaleDateString() : "—"} /></Surface>
      {canManage ? <Surface tone="pink"><Text style={styles.section}>{sw ? "Hatua za msimamizi" : "Staff actions"}</Text>
        <Text style={styles.body}>{sw ? "Badili hali ya kupokea kesi baada ya kuthibitisha moja kwa moja na mtoa huduma." : "Update intake only after checking directly with the provider."}</Text>
        <View style={styles.choices}>{(["open", "limited", "closed", "emergency_only"] as Intake[]).map((state) => <Pressable key={state} accessibilityRole="button" disabled={busy} style={[styles.choice, item.currentIntakeState === state && styles.choiceOn]} onPress={() => void change({ currentIntakeState: state })}><Text style={[styles.choiceText, item.currentIntakeState === state && styles.choiceTextOn]}>{state.replaceAll("_", " ")}</Text></Pressable>)}</View>
        <TextInput value={source} onChangeText={setSource} style={styles.input} placeholder={sw ? "Chanzo kilichokaguliwa" : "Verified source"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Chanzo" : "Source"} />
        <TextInput value={authority} onChangeText={setAuthority} style={styles.input} placeholder={sw ? "Mamlaka iliyothibitisha" : "Verifying authority"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Mamlaka" : "Authority"} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label={sw ? "Thibitisha rekodi" : "Verify record"} disabled={busy} onPress={verify} />
        <Button label={item.active ? (sw ? "Sitisha huduma" : "Pause service") : (sw ? "Washa huduma" : "Activate service")} variant="secondary" disabled={busy} onPress={() => Alert.alert(sw ? "Thibitisha mabadiliko" : "Confirm change", sw ? "Hii itabadilisha upatikanaji wa huduma kwenye orodha." : "This changes whether the service is available in the directory.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Endelea" : "Continue", onPress: () => void change({ active: !item.active }) }])} />
      </Surface> : null}
    </>}
  </Screen>;
}
function State({ text }: { text: string }) { return <Surface><Text style={styles.body}>{text}</Text></Surface>; }
function Line({ label, value }: { label: string; value: string }) { return <View style={styles.line}><Text style={styles.muted}>{label}</Text><Text style={styles.value}>{value}</Text></View>; }
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27, lineHeight: 32 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, section: { color: colors.burgundy, fontFamily: type.bold, fontSize: 16, marginBottom: spacing.sm }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 20 }, line: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, borderBottomWidth: 1, borderColor: colors.line, paddingVertical: spacing.sm }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, flex: 1 }, value: { color: colors.ink, fontFamily: type.medium, fontSize: 12, flex: 2, textAlign: "right" }, choices: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, choice: { minHeight: 44, justifyContent: "center", paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line }, choiceOn: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, choiceText: { color: colors.ink, fontFamily: type.medium, fontSize: 12, textTransform: "capitalize" }, choiceTextOn: { color: colors.surface }, input: { minHeight: 50, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, paddingHorizontal: spacing.md, color: colors.ink }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 13 } });
