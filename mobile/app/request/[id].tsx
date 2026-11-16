import { BrandLoading } from '../../src/components/BrandLoading';
import { plainError } from "../../../shared/plainLanguage";
import { useIntakeDraft } from "../../src/intake/IntakeDraftContext";
import { useAuth } from "../../src/auth";
import { RequestConversation } from "../../src/components/RequestConversation";
import { requestLabels, requestReachedStages } from "../../src/requestProgress";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { CivicPageHeader } from "../../src/components/CivicPageHeader";
import { CivicIllustration } from "../../src/components/CivicIllustration";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type, typography } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

const labels = requestLabels;

export default function RequestDetailScreen() {
  useSensitiveScreenProtection("request-detail");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage();
  const { updateDraft } = useIntakeDraft();
  const { isLoaded, isSignedIn } = useAuth();
  const requestId = id as Id<"legal_help_requests">;
  const details = useQuery(api.legalHelp.getMyRequest, isSignedIn && id ? { requestId } : "skip");
  const withdraw = useMutation(api.legalHelp.withdrawMyRequest);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const t = (sw: string, en: string) => locale === "sw" ? sw : en;

  if (isLoaded && !isSignedIn) return <Screen><CivicPageHeader back compact title={t("Ombi langu", "My request")} /><Text style={styles.body}>{t("Ingia kuona ombi lako.", "Sign in to view your request.")}</Text><Button label={t("Ingia", "Sign in")} onPress={() => router.push("/sign-in")} /></Screen>;
  if (!id) return <Screen><CivicPageHeader back compact title={t("Ombi", "Request")} /><Text style={styles.body}>{t("Ombi halipatikani.", "Request unavailable.")}</Text><Button label={t("Maombi yangu", "My requests")} onPress={() => router.replace("/(tabs)/cases")} /></Screen>;
  if (details === undefined) return <View style={styles.loading}><BrandLoading compact task="cases"/></View>;
  if (details === null) return <Screen><CivicPageHeader back compact title={t("Ombi", "Request")} /><CivicIllustration pose="review" size={120} /><Text style={styles.title}>{t("Ombi halipatikani", "Request unavailable")}</Text><Text style={styles.body}>{t("Huenda limehamishwa kuwa kesi au huna ruhusa kuliona.", "It may have become a case or you may not have access.")}</Text><Button label={t("Rudi kwenye kesi zangu", "Back to my cases")} onPress={() => router.replace("/(tabs)/cases")} /></Screen>;

  const { request, sourceService } = details;
  const progressStages = requestReachedStages(request.status);
  const canWithdraw = ["submitted", "under_review", "waiting_for_information"].includes(request.status);

  function confirmWithdraw() {
    Alert.alert(t("Ondoa ombi?", "Withdraw request?"), t("LSF itaacha kulishughulikia. Historia ya ombi itabaki. Unaweza kuomba msaada tena.", "LSF will stop processing it. Your request history will remain. You can ask for help again."), [
      { text: t("Ghairi", "Cancel"), style: "cancel" },
      { text: t("Ondoa ombi", "Withdraw"), style: "destructive", onPress: () => void performWithdraw() },
    ]);
  }

  async function performWithdraw() {
    setWithdrawing(true); setError("");
    try { await withdraw({ requestId }); }
    catch (caught) { setError(plainError(caught, locale, t("Hatukuweza kuthibitisha kama ombi limeondolewa. Angalia hali yake kabla ya kujaribu tena.", "We could not confirm the withdrawal. Check the request status before retrying."))); }
    finally { setWithdrawing(false); }
  }

  return <Screen>
    <CivicPageHeader back compact title={t("Ombi langu", "My request")} />
    <View style={[styles.hero, request.status === "waiting_for_information" && styles.attentionHero]}><View style={styles.flex}>
      <View style={styles.statusLabel}><Ionicons name={request.status === "waiting_for_information" ? "alert-circle-outline" : request.status === "draft" ? "create-outline" : "document-text-outline"} size={22} color={request.status === "waiting_for_information" ? colors.burgundy : colors.teal} /><Text style={styles.infoLabel}>{t("Hali ya ombi", "Request status")}</Text></View>
      <Text accessibilityRole="header" style={styles.heroStatus}>{labels[request.status]?.[locale] ?? request.status.replaceAll("_", " ")}</Text>
      <Text style={styles.topic}>{issueLabel(request.issueCategory, locale)}</Text>
      <Text selectable style={styles.reference}>{request.publicId}</Text>
    </View><CivicIllustration pose="review" size={64} /></View>
    {request.status === "draft" && <Button label={t("Endelea na ombi hili", "Continue this request")} onPress={() => {
      updateDraft({ clientRequestId: request.clientRequestId, locale: request.locale, description: request.description ?? "", issueCategory: request.issueCategory, issueDetail: undefined, sourceServiceId: sourceService ? request.sourceServiceId : undefined, region: request.region ?? "", district: request.district ?? "", occurredOn: request.occurredAt ? new Date(request.occurredAt).toISOString().slice(0, 10) : "", involvedParties: request.involvedParties ?? "", desiredHelp: request.desiredHelp ?? "", helpGoal: undefined, safeContactMethod: request.safeContactMethod ?? "in_app", preferredLanguage: request.preferredLanguage ?? locale, preferredLanguageOther: request.preferredLanguageOther ?? "", urgency: request.urgency ?? "standard", hasDocuments: request.hasDocuments ?? false, evidence: [] });
      router.push("/intake");
    }} />}
    {details.caseId ? <Button label={t("Fungua kesi yangu", "Open my case")} onPress={() => router.push({ pathname: "/case/[id]", params: { id: details.caseId! } })} /> : null}
    <RequestConversation key={requestId} requestId={requestId} compact />
    <View style={styles.summary}>
      <View style={styles.sectionHeading}><Ionicons name="reader-outline" size={24} color={colors.teal} /><Text accessibilityRole="header" style={styles.sectionTitle}>{t("Maelezo ya ombi", "Request details")}</Text></View>
      <Info icon="pricetag-outline" label={t("Tatizo", "Issue")} value={issueLabel(request.issueCategory, locale)} />
      {request.description ? <Info icon="document-text-outline" label={t("Ulichoeleza", "Your description")} value={request.description} /> : null}
      <Info icon="location-outline" label={t("Mahali", "Location")} value={[request.district, request.region].filter(Boolean).join(", ") || t("Haijawekwa", "Not provided")} />
      <Info icon="help-circle-outline" label={t("Msaada unaohitajika", "Help requested")} value={request.desiredHelp || t("Haijawekwa", "Not provided")} />
      <Info icon="lock-closed-outline" label={t("Njia salama ya kuwasiliana", "Safe contact")} value={contactLabel(request.safeContactMethod, locale)} />
      {sourceService ? <Pressable accessibilityRole="button" style={styles.source} onPress={() => router.push({ pathname: "/service/[id]", params: { id: String(sourceService._id) } })}><Ionicons name="business-outline" size={22} color={colors.teal} /><View style={styles.flex}><Text style={styles.infoLabel}>{t("Huduma uliyotazama", "Service you viewed")}</Text><Text style={styles.infoValue}>{sourceService.name}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.teal} /></Pressable> : null}
    </View>
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: showProgress }} onPress={() => setShowProgress(value => !value)} style={styles.progressToggle}><Ionicons name="git-branch-outline" size={24} color={colors.teal} /><Text style={styles.sectionTitle}>{t("Hatua zilizofikiwa", "Progress so far")}</Text><Ionicons name={showProgress ? "chevron-up" : "chevron-down"} size={20} color={colors.inkMuted} /></Pressable>
    {showProgress ? <View>{progressStages.map((status, index) => <View key={status} style={styles.timelineRow}><View style={styles.timelineRail}>{index < progressStages.length - 1 ? <View style={[styles.line, styles.lineDone]} /> : null}<View style={[styles.dot, styles.dotDone]}><Ionicons name="checkmark" size={13} color={colors.surface} /></View></View><Text style={styles.timelineTitle}>{labels[status][locale]}</Text></View>)}</View> : null}
    {["information_only", "closed", "withdrawn"].includes(request.status) ? <Button label={t("Omba msaada tena", "Request more help")} variant="secondary" onPress={() => router.push("/intake")} /> : null}
    {canWithdraw ? <Button label={withdrawing ? t("Inaondolewa...", "Withdrawing...") : t("Ondoa ombi hili", "Withdraw this request")} variant="danger" disabled={withdrawing} onPress={confirmWithdraw} /> : null}
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </Screen>;
}

function Info({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) { return <View style={styles.info}><Ionicons name={icon} size={22} color={colors.inkMuted} /><View style={styles.flex}><Text style={styles.infoLabel}>{label}</Text><Text selectable style={styles.infoValue}>{value}</Text></View></View>; }
function issueLabel(value: string | undefined, locale: "sw" | "en") {
  const labels: Record<string, [string, string]> = { employment: ["Ajira", "Employment"], land: ["Ardhi", "Land"], family: ["Familia", "Family"], safety: ["Usalama", "Safety"], consumer: ["Haki za mlaji", "Consumer rights"], other: ["Msaada mwingine", "Other help"] };
  return labels[value ?? "other"]?.[locale === "sw" ? 0 : 1] ?? (locale === "sw" ? "Msaada wa kisheria" : "Legal help");
}
function contactLabel(value: string | undefined, locale: "sw" | "en") {
  const labels: Record<string, [string, string]> = { in_app: ["Ndani ya programu", "In app"], phone: ["Simu", "Phone"], sms: ["Ujumbe wa simu", "SMS"], email: ["Barua pepe", "Email"], none: ["Usiwasiliane nami kwa sasa", "Do not contact me for now"] };
  return labels[value ?? "in_app"]?.[locale === "sw" ? 0 : 1] ?? (locale === "sw" ? "Haijawekwa" : "Not provided");
}
const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1 },
  hero: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12, backgroundColor: "#F2F8F6", borderRadius: 8, padding: 14 },
  attentionHero: { backgroundColor: "#FCF3F6" },
  statusLabel: { flexDirection: "row", alignItems: "center", gap: 7 },
  heroStatus: { ...typography.itemTitle, fontFamily: type.bold, marginTop: 8 },
  topic: { ...typography.supporting, marginTop: 4 },
  reference: { ...typography.metadata, marginTop: 6 },
  title: { fontFamily: type.semibold, color: colors.ink, fontSize: 20, marginVertical: 16 },
  body: { ...typography.supporting },
  sectionTitle: { ...typography.itemTitle, flex: 1 },
  sectionHeading: { flexDirection: "row", alignItems: "center", gap: 10, paddingBottom: 10 },
  summary: { marginTop: 20, marginBottom: 12 },
  progressToggle: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 56, marginBottom: 12, borderTopWidth: 1, borderTopColor: colors.line },
  timelineRow: { minHeight: 48, flexDirection: "row", gap: 12 },
  timelineRail: { width: 24, alignItems: "center" },
  line: { position: "absolute", top: 22, bottom: -5, width: 1, backgroundColor: colors.line },
  lineDone: { backgroundColor: colors.teal },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  dotDone: { backgroundColor: colors.teal },
  timelineTitle: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 22 },
  info: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  infoLabel: { ...typography.metadata },
  infoValue: { ...typography.body, marginTop: 3 },
  source: { marginTop: 6, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 8, backgroundColor: "#F3F6F5", padding: 12 },
  error: { fontFamily: type.regular, color: colors.danger, fontSize: 13, lineHeight: 20 },
});
