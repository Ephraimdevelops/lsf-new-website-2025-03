import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { SectionHeading, Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

export default function CaseMatchingScreen() {
  useSensitiveScreenProtection("operations");
  const { id } = useLocalSearchParams<{ id: string }>();
  const caseId = id as Id<"cases">;
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff", "supervisor"].includes(role));
  const cases = useQuery(api.caseManagement.staffCaseQueue, allowed ? {} : "skip");
  const caseRecord = cases?.find((item) => item._id === caseId);
  const recommendations = useQuery(api.caseManagement.providerRecommendations, allowed && caseRecord ? { caseId } : "skip");
  const details = useQuery(api.caseManagement.getCase, allowed && caseRecord ? { caseId } : "skip");
  const offerAssignment = useMutation(api.caseManagement.offerAssignment);
  const reassignCase = useMutation(api.caseManagement.reassignCase);
  const [selected, setSelected] = useState<Id<"users"> | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<Id<"justice_service_organizations"> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reason, setReason] = useState("");
  const hasOpenAssignment = details?.assignmentHistory.some((item) => ["offered", "accepted"].includes(item.assignment.status)) ?? false;
  const provider = recommendations?.find((item) => item.id === selected);
  const eligible = provider && provider.remainingCapacity > 0 && !["paused", "unavailable"].includes(provider.availabilityStatus);

  async function sendOffer() {
    if (!caseRecord || !provider || !eligible || busy) return;
    const organizationId = provider.affiliations.length === 1 ? provider.affiliations[0].organizationId : selectedOrganizationId ?? undefined;
    if (provider.affiliations.length > 1 && !organizationId) { setError(sw ? "Chagua taasisi ambayo mtoa msaada ataiwakilisha kwenye kesi hii." : "Choose which organisation this worker represents for this case."); return; }
    if (hasOpenAssignment && reason.trim().length < 10) { setError(sw ? "Eleza sababu ya kubadilisha mtoa msaada (angalau herufi 10)." : "Explain the reassignment (at least 10 characters)."); return; }
    setBusy(true); setError("");
    try {
      if (hasOpenAssignment) await reassignCase({ caseId, newAssigneeId: provider.id, organizationId, reason: reason.trim() });
      else await offerAssignment({ caseId, assigneeId: provider.id, organizationId });
      setSuccess(sw ? `Ofa imetumwa kwa ${provider.name}.` : `Offer sent to ${provider.name}.`);
      setSelected(null);
      setSelectedOrganizationId(null);
      setReason("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }

  if (access === undefined || (allowed && cases === undefined)) return <Screen><AppHeader back title={sw ? "Ulinganishaji" : "Case matching"} /><Text style={styles.muted}>{sw ? "Inapakia..." : "Loading case..."}</Text></Screen>;
  if (!allowed || !caseRecord) return <Screen><AppHeader back title={sw ? "Ulinganishaji" : "Case matching"} /><Surface tone="orange"><Text style={styles.title}>{sw ? "Kesi haipatikani ndani ya ruhusa yako." : "This case is unavailable in your access scope."}</Text></Surface></Screen>;

  return <Screen>
    <AppHeader back title={sw ? "Pata mtoa msaada" : "Find the right match"} eyebrow="LSF · CASE MATCHING" />
    <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="people" size={26} color={colors.burgundy} /></View><Text style={styles.heroEyebrow}>{caseRecord.publicId}</Text><Text style={styles.heroTitle}>{sw ? "Unganisha kesi na msaada unaofaa." : "Match this case with the right support."}</Text><Text style={styles.heroCopy}>{sw ? "Pitia uwezo, eneo na sababu za pendekezo kabla ya kutuma ofa." : "Review capacity, location and fit before sending an assignment offer."}</Text></View>
    <Surface tone="pink" style={styles.context}><Text style={styles.title}>{sw ? "Muhtasari wa kesi" : "Case context"}</Text><Text style={styles.summary}>{caseRecord.summary}</Text><Text style={styles.muted}>{caseRecord.priority.replaceAll("_", " ")} · {caseRecord.status.replaceAll("_", " ")}</Text><Button variant="quiet" label={sw ? "Angalia kesi" : "View case"} onPress={() => router.push({ pathname: "/case/[id]", params: { id: caseId } })} /></Surface>
    {success ? <Surface tone="teal" style={styles.message}><Text style={styles.title}>{success}</Text><Text style={styles.muted}>{sw ? "Mtoa huduma atahitaji kukubali ofa kabla ya kupewa kesi." : "The provider must accept the offer before taking the case."}</Text></Surface> : null}
    {error ? <Surface tone="orange" style={styles.message}><Text style={styles.error}>{error}</Text></Surface> : null}
    <SectionHeading title={sw ? "Watoa msaada wanaopendekezwa" : "Recommended providers"} action={recommendations ? `${recommendations.length}` : undefined} />
    {recommendations === undefined ? <Surface><Text style={styles.muted}>{sw ? "Inatafuta watoa msaada..." : "Finding eligible providers..."}</Text></Surface> : recommendations.length === 0 ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Hakuna mtoa msaada anayepatikana sasa." : "No provider is available right now."}</Text><Text style={styles.muted}>{sw ? "Kesi ibaki katika foleni ya LSF kwa hatua inayofuata." : "Keep the case in the LSF queue for the next action."}</Text></Surface> : recommendations.map((item, index) => {
      const unavailable = item.remainingCapacity <= 0 || ["paused", "unavailable"].includes(item.availabilityStatus);
      return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${item.name}, ${item.score} percent fit`} onPress={() => { setSelected(item.id); setSelectedOrganizationId(null); }} style={[styles.provider, selected === item.id && styles.providerSelected]}>
        <View style={styles.providerTop}><View style={styles.avatar}><Text style={styles.avatarText}>{item.name.trim().slice(0, 1).toUpperCase()}</Text></View><View style={styles.providerName}><Text style={styles.title}>{item.name}</Text><Text style={styles.muted}>{item.role.replaceAll("_", " ")} · {[item.district, item.region].filter(Boolean).join(", ") || (sw ? "Eneo halijabainishwa" : "Location not recorded")}</Text></View><View style={styles.score}><Text style={styles.scoreText}>{item.score}%</Text></View></View>
        <Text style={styles.rank}>{index === 0 ? (sw ? "PENDEKEZO LA KWANZA" : "TOP RECOMMENDATION") : (sw ? "SABABU ZA ULINGANISHI" : "WHY THIS MATCH")}</Text>
        {item.reasons.slice(0, 4).map((reason) => <View key={reason} style={styles.reason}><Ionicons name="checkmark-circle" size={17} color={colors.teal} /><Text style={styles.reasonText}>{reason}</Text></View>)}
        <View style={styles.footer}><Text style={[styles.availability, unavailable && styles.unavailable]}>{unavailable ? (sw ? "Hapatikani kwa ofa mpya" : "Unavailable for new offers") : `${item.remainingCapacity} ${sw ? "nafasi zilizobaki" : "capacity slots remaining"}`}</Text><Ionicons name={selected === item.id ? "radio-button-on" : "radio-button-off"} size={23} color={selected === item.id ? colors.burgundy : colors.inkMuted} /></View>
      </Pressable>;
    })}
    {provider ? <Surface tone="pink" style={styles.confirm}><Text style={styles.title}>{hasOpenAssignment ? (sw ? "Badili mtoa msaada?" : "Reassign this case?") : (sw ? "Tuma ofa ya kazi?" : "Send assignment offer?")}</Text><Text style={styles.muted}>{hasOpenAssignment ? (sw ? "Ofa au ufikiaji wa mtoa msaada wa awali utaisha. Mtoa mpya atahitaji kuikubali ofa." : "The previous offer or provider access will end. The new provider must accept the offer.") : (sw ? `Ofa itatumwa kwa ${provider.name}. Atahitaji kuikubali.` : `An offer will be sent to ${provider.name}. They must accept it.`)}</Text>{provider.affiliations.length ? <><Text style={styles.title}>{sw ? "Taasisi inayowakilishwa kwenye kesi" : "Organisation represented on this case"}</Text>{provider.affiliations.map((affiliation) => <Pressable key={affiliation.organizationId} accessibilityRole="radio" accessibilityState={{ checked: (provider.affiliations.length === 1 ? provider.affiliations[0].organizationId : selectedOrganizationId) === affiliation.organizationId }} aria-checked={(provider.affiliations.length === 1 ? provider.affiliations[0].organizationId : selectedOrganizationId) === affiliation.organizationId} onPress={() => setSelectedOrganizationId(affiliation.organizationId)} style={[styles.affiliation, (provider.affiliations.length === 1 ? provider.affiliations[0].organizationId : selectedOrganizationId) === affiliation.organizationId && styles.providerSelected]}><Ionicons name={(provider.affiliations.length === 1 ? provider.affiliations[0].organizationId : selectedOrganizationId) === affiliation.organizationId ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={styles.summary}>{affiliation.organizationName} · {affiliation.role.replaceAll("_", " ")}</Text></Pressable>)}</> : <Text style={styles.muted}>{sw ? "Mtoa msaada binafsi; hakuna taasisi iliyothibitishwa iliyounganishwa." : "Independent worker; no verified organisation is linked."}</Text>}{hasOpenAssignment ? <TextInput value={reason} onChangeText={setReason} multiline maxLength={500} accessibilityLabel={sw ? "Sababu ya kubadilisha" : "Reassignment reason"} placeholder={sw ? "Sababu ya kubadilisha mtoa msaada" : "Reason for reassignment"} placeholderTextColor={colors.inkMuted} style={{ minHeight: 85, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, color: colors.ink, textAlignVertical: "top" }} /> : null}<Button label={hasOpenAssignment ? (sw ? "Tuma ofa kwa mtoa mpya" : "Offer to new provider") : (sw ? "Tuma ofa" : "Send offer")} loading={busy} disabled={!eligible || busy || details === undefined || provider.affiliations.length > 1 && !selectedOrganizationId} onPress={() => Alert.alert(sw ? "Thibitisha ofa" : "Confirm offer", hasOpenAssignment ? (sw ? "Hii itaondoa ufikiaji wa mtoa msaada wa sasa." : "This ends the current provider's access.") : (sw ? "Mtoa msaada atahitaji kuikubali." : "The provider must accept."), [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Endelea" : "Continue", onPress: () => void sendOffer() }])} />{!eligible ? <Text style={styles.error}>{sw ? "Mtoa msaada huyu hawezi kupewa ofa sasa." : "This provider cannot receive a new offer now."}</Text> : null}</Surface> : null}
  </Screen>;
}

const styles = StyleSheet.create({ hero: { marginTop: spacing.sm, padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.burgundy, gap: spacing.sm }, heroIcon: { width: 49, height: 49, borderRadius: 16, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, heroEyebrow: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1.2 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27, lineHeight: 33 }, heroCopy: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, context: { marginTop: spacing.lg, gap: spacing.sm }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, summary: { color: colors.charcoal, fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, message: { marginTop: spacing.md, gap: spacing.xs }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 13 }, provider: { marginBottom: spacing.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, gap: spacing.sm }, providerSelected: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, providerTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm }, affiliation: { minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.sm, flexDirection: "row", alignItems: "center", gap: spacing.sm }, avatar: { width: 45, height: 45, borderRadius: 23, alignItems: "center", justifyContent: "center", backgroundColor: colors.tealSoft }, avatarText: { color: colors.teal, fontFamily: type.bold, fontSize: 19 }, providerName: { flex: 1 }, score: { backgroundColor: colors.tealSoft, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 5 }, scoreText: { color: colors.teal, fontFamily: type.bold, fontSize: 13 }, rank: { color: colors.burgundy, fontFamily: type.bold, fontSize: 11, letterSpacing: 0.6 }, reason: { flexDirection: "row", alignItems: "center", gap: spacing.sm }, reasonText: { flex: 1, color: colors.charcoal, fontFamily: type.regular, fontSize: 13 }, footer: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: spacing.sm, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, availability: { color: colors.teal, fontFamily: type.medium, fontSize: 12 }, unavailable: { color: colors.orange }, confirm: { marginBottom: spacing.xl, gap: spacing.md } });
