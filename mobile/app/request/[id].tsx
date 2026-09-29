import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

const order = ["submitted", "under_review", "waiting_for_information", "converted_to_case"] as const;
const labels: Record<string, { sw: string; en: string }> = {
  draft: { sw: "Rasimu", en: "Draft" }, submitted: { sw: "Ombi limepokelewa", en: "Request submitted" }, under_review: { sw: "Linakaguliwa", en: "Under review" }, waiting_for_information: { sw: "Taarifa zaidi zinahitajika", en: "More information needed" }, information_only: { sw: "Taarifa zimetolewa", en: "Information provided" }, referred: { sw: "Limeelekezwa", en: "Referred" }, converted_to_case: { sw: "Kesi imefunguliwa", en: "Case opened" }, withdrawn: { sw: "Umeondoa ombi", en: "Withdrawn" }, closed: { sw: "Limefungwa", en: "Closed" },
};

export default function RequestDetailScreen() {
  useSensitiveScreenProtection("request-detail");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage();
  const requestId = id as Id<"legal_help_requests">;
  const details = useQuery(api.legalHelp.getMyRequest, id ? { requestId } : "skip");
  const withdraw = useMutation(api.legalHelp.withdrawMyRequest);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState("");
  const t = (sw: string, en: string) => locale === "sw" ? sw : en;

  if (details === undefined) return <View style={styles.loading}><ActivityIndicator color={colors.burgundy} /></View>;
  if (details === null) return <Screen><AppHeader back title={t("Ombi", "Request")} /><Surface tone="pink"><Text style={styles.title}>{t("Ombi halipatikani", "Request unavailable")}</Text><Text style={styles.body}>{t("Huenda limehamishwa kuwa kesi au huna ruhusa kuliona.", "It may have become a case or you may not have access.")}</Text><Button label={t("Rudi kwenye kesi zangu", "Back to my cases")} onPress={() => router.replace("/(tabs)/cases")} /></Surface></Screen>;

  const { request, sourceService } = details;
  const currentIndex = order.indexOf(request.status as typeof order[number]);
  const progressStages = currentIndex >= 0 ? order : order.slice(0, 1);
  const canWithdraw = ["submitted", "under_review", "waiting_for_information"].includes(request.status);
  const next = nextStep(request.status, locale);

  function confirmWithdraw() {
    Alert.alert(t("Ondoa ombi?", "Withdraw request?"), t("LSF itaacha kulishughulikia. Unaweza kuanza ombi jipya baadaye.", "LSF will stop processing it. You can start a new request later."), [
      { text: t("Ghairi", "Cancel"), style: "cancel" },
      { text: t("Ondoa ombi", "Withdraw"), style: "destructive", onPress: () => void performWithdraw() },
    ]);
  }

  async function performWithdraw() {
    setWithdrawing(true); setError("");
    try { await withdraw({ requestId }); }
    catch (caught) { setError(caught instanceof Error ? caught.message : t("Ombi halikuondolewa.", "Request could not be withdrawn.")); }
    finally { setWithdrawing(false); }
  }

  return <Screen>
    <AppHeader back title={t("Ombi langu", "My request")} eyebrow={request.publicId} />
    <View style={styles.hero}><View style={styles.statusIcon}><Ionicons name={request.status === "withdrawn" ? "close" : "document-text"} size={28} color={colors.surface} /></View><Text style={styles.heroStatus}>{labels[request.status]?.[locale] ?? request.status.replaceAll("_", " ")}</Text><Text style={styles.heroBody}>{next}</Text></View>
    <Surface tone="white"><Text style={styles.sectionTitle}>{t("Hatua ya ombi", "Request progress")}</Text>{progressStages.map((status, index) => { const done = currentIndex >= index || (status === "submitted" && currentIndex === -1); const active = request.status === status; return <View key={status} style={styles.timelineRow}><View style={styles.timelineRail}>{index < progressStages.length - 1 ? <View style={[styles.line, done && styles.lineDone]} /> : null}<View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>{done ? <Ionicons name={active ? "ellipse" : "checkmark"} size={active ? 9 : 13} color={colors.surface} /> : null}</View></View><View style={styles.timelineCopy}><Text style={[styles.timelineTitle, active && styles.timelineTitleActive]}>{labels[status][locale]}</Text>{active ? <Text style={styles.timelineBody}>{next}</Text> : null}</View></View>; })}{["referred", "information_only", "closed", "withdrawn"].includes(request.status) ? <View style={styles.terminal}><Ionicons name="information-circle-outline" size={20} color={colors.burgundy} /><View style={styles.flex}><Text style={styles.timelineTitleActive}>{labels[request.status][locale]}</Text><Text style={styles.timelineBody}>{next}</Text></View></View> : null}</Surface>
    <Surface tone="pink"><Text style={styles.sectionTitle}>{t("Muhtasari wako", "Your request summary")}</Text><Info label={t("Tatizo", "Issue")} value={request.issueCategory?.replaceAll("_", " ") || t("Msaada wa kisheria", "Legal help")} /><Info label={t("Mahali", "Location")} value={[request.district, request.region].filter(Boolean).join(", ")} /><Info label={t("Msaada unaohitajika", "Help requested")} value={request.desiredHelp || t("Haijawekwa", "Not provided")} /><Info label={t("Njia salama", "Safe contact")} value={request.safeContactMethod?.replaceAll("_", " ") || t("Ndani ya programu", "In app")} />{sourceService ? <Pressable style={styles.source} onPress={() => router.push({ pathname: "/service/[id]", params: { id: String(sourceService._id) } })}><Ionicons name="business-outline" size={20} color={colors.burgundy} /><View style={styles.flex}><Text style={styles.infoLabel}>{t("Huduma uliyotazama", "Service you viewed")}</Text><Text style={styles.infoValue}>{sourceService.name} · {sourceService.district}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.burgundy} /></Pressable> : null}</Surface>
    <View style={styles.nextCard}><Ionicons name="arrow-forward-circle" size={28} color={colors.burgundy} /><View style={styles.flex}><Text style={styles.sectionTitle}>{t("Hatua inayofuata", "What happens next")}</Text><Text style={styles.body}>{next}</Text></View></View>
    {request.status === "converted_to_case" ? <Button label={t("Fungua kesi zangu", "Open My Cases")} onPress={() => router.push("/(tabs)/cases")} /> : null}
    {request.status === "waiting_for_information" ? <Button label={t("Wasiliana na timu ya LSF", "Contact the LSF team")} onPress={() => router.push("/support")} /> : null}
    {["information_only", "closed", "withdrawn"].includes(request.status) ? <Button label={t("Omba msaada tena", "Request more help")} variant="secondary" onPress={() => router.push("/intake")} /> : null}
    {canWithdraw ? <Button label={withdrawing ? t("Inaondolewa...", "Withdrawing...") : t("Ondoa ombi hili", "Withdraw this request")} variant="quiet" disabled={withdrawing} onPress={confirmWithdraw} /> : null}
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </Screen>;
}

function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>; }
function nextStep(status: string, locale: "sw" | "en") { const sw = locale === "sw"; const messages: Record<string, string> = { submitted: sw ? "Timu ya LSF itaanza ukaguzi. Utapokea taarifa hali ikibadilika." : "The LSF team will begin review. You will be notified when the status changes.", under_review: sw ? "LSF inakagua maelezo na kutafuta njia sahihi ya msaada." : "LSF is reviewing the details and identifying the right support path.", waiting_for_information: sw ? "Timu inahitaji taarifa zaidi. Angalia arifa au wasiliana na LSF." : "The team needs more information. Check notifications or contact LSF.", converted_to_case: sw ? "Kesi imefunguliwa. Nenda Kesi Zangu kuona msaidizi, ujumbe na hatua zote." : "A case has been opened. Go to My Cases for your helper, messages, and full progress.", referred: sw ? "Ombi limeelekezwa kwa huduma inayofaa. Utaarifiwa kuhusu hatua inayofuata." : "The request was routed to a suitable service. You will receive the next update.", information_only: sw ? "Taarifa ulizohitaji zimetolewa. Unaweza kuanza ombi jipya ukihitaji msaada zaidi." : "The requested information was provided. You can start another request if more help is needed.", withdrawn: sw ? "Umeondoa ombi hili. LSF haitalishughulikia zaidi." : "You withdrew this request. LSF will no longer process it.", closed: sw ? "Ombi hili limefungwa. Unaweza kuomba msaada tena wakati wowote." : "This request is closed. You can ask for help again at any time." }; return messages[status] ?? (sw ? "Endelea kufuatilia taarifa hapa." : "Keep checking here for updates."); }
const styles = StyleSheet.create({ loading: { flex: 1, alignItems: "center", justifyContent: "center" }, flex: { flex: 1 }, hero: { borderRadius: radius.xl, backgroundColor: colors.burgundy, padding: spacing.xl, alignItems: "center", gap: spacing.sm }, statusIcon: { width: 62, height: 62, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.17)", alignItems: "center", justifyContent: "center" }, heroStatus: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 25, textAlign: "center" }, heroBody: { fontFamily: type.regular, color: "#F9E8EF", fontSize: 13, lineHeight: 19, textAlign: "center" }, title: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 20 }, body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 }, sectionTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 16, marginBottom: spacing.sm }, timelineRow: { minHeight: 67, flexDirection: "row", gap: spacing.md }, timelineRail: { width: 26, alignItems: "center" }, line: { position: "absolute", top: 22, bottom: -5, width: 2, backgroundColor: colors.line }, lineDone: { backgroundColor: colors.success }, dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, dotDone: { borderColor: colors.success, backgroundColor: colors.success }, dotActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundy }, timelineCopy: { flex: 1, paddingBottom: spacing.md }, timelineTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.inkMuted, fontSize: 14 }, timelineTitleActive: { color: colors.burgundy }, timelineBody: { marginTop: 4, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 }, terminal: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.md }, info: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: "#E8DDE1" }, infoLabel: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 12 }, infoValue: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 }, source: { marginTop: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md }, nextCard: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, borderRadius: radius.lg, backgroundColor: colors.tealSoft, padding: spacing.lg }, error: { fontFamily: type.regular, color: colors.danger, fontSize: 13, textAlign: "center" } });
