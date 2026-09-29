import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

type Priority = "standard" | "urgent" | "safeguarding";
type TriageDetail = { name?: string; answers: Array<{ questionKey: string; value: string }>; sourceName?: string };

export default function OperationsRequestScreen() {
  useSensitiveScreenProtection("operations-request");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some((role) => ["admin", "staff", "supervisor"].includes(role)) ?? false;
  const requests = useQuery(api.legalHelp.staffQueue, allowed ? {} : "skip");
  const request = requests?.find((item) => item._id === id);
  const openForTriage = useMutation(api.legalHelp.openForTriage);
  const createCase = useMutation(api.caseManagement.createFromRequest);
  const [detail, setDetail] = useState<TriageDetail | null>(null);
  const [summary, setSummary] = useState("");
  const [priority, setPriority] = useState<Priority>("standard");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function beginReview() {
    if (!request || busy) return;
    setBusy(true); setError("");
    try {
      const result = await openForTriage({ requestId: request._id, expectedVersion: request.version });
      setDetail({ name: result.beneficiary?.name, answers: result.answers.map((item) => ({ questionKey: item.questionKey, value: item.value })), sourceName: result.sourceService?.name });
      setSummary(result.request.description?.trim().slice(0, 3000) ?? "");
      setPriority(result.request.urgency === "immediate_safety" ? "safeguarding" : result.request.urgency === "urgent" ? "urgent" : "standard");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : sw ? "Mapitio hayakufunguka. Pakia foleni upya." : "Review could not open. Refresh the queue.");
    } finally { setBusy(false); }
  }

  async function convert() {
    if (!request || !detail || summary.trim().length < 10 || busy) return;
    setBusy(true); setError("");
    try {
      const result = await createCase({ requestId: request._id, summary: summary.trim(), priority });
      router.replace({ pathname: "/case/[id]", params: { id: result.caseId } });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : sw ? "Kesi haijafunguliwa. Jaribu tena." : "Case was not created. Please try again.");
    } finally { setBusy(false); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Pitia ombi" : "Review request"} eyebrow="LSF · OPERATIONS" />
    {!isSignedIn ? <State icon="lock-closed-outline" title={sw ? "Maombi ni ya siri" : "Requests are private"} body={sw ? "Ingia kwa akaunti ya LSF." : "Sign in with an LSF account."} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : access === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia ruhusa" : "Loading access"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !allowed ? <State icon="shield-outline" title={sw ? "Ufikiaji haujaruhusiwa" : "Access not authorised"} body={sw ? "Jukumu la LSF linahitajika kuona ombi hili." : "An LSF operations role is required to view this request."} />
      : requests === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia ombi" : "Loading request"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !request ? <State icon="file-tray-outline" title={sw ? "Ombi halipo kwenye foleni" : "Request is no longer in the queue"} body={sw ? "Huenda hali imebadilika. Rudi kwenye foleni ya uendeshaji." : "Its status may have changed. Return to the operations queue."} action={sw ? "Rudi kwenye foleni" : "Back to queue"} onPress={() => router.replace("/operations")} />
      : <>
        <View style={[styles.hero, request.urgency === "immediate_safety" && styles.heroSafety]}><View style={styles.heroIcon}><Ionicons name={request.urgency === "immediate_safety" ? "shield-outline" : "document-text-outline"} size={30} color={colors.surface} /></View><Text style={styles.heroKicker}>{request.publicId}</Text><Text style={styles.heroTitle}>{sw ? "Uamuzi wa mapitio" : "Triage review"}</Text><Text style={styles.heroBody}>{sw ? "Kagua taarifa kwa uangalifu kabla ya kufungua kesi na kuipangia kipaumbele." : "Review the details carefully before creating a case and setting its priority."}</Text></View>
        <View style={styles.summaryCard}><Info label={sw ? "Suala" : "Issue"} value={(request.issueCategory ?? "other").replaceAll("_", " ")} /><Info label={sw ? "Eneo" : "Location"} value={[request.district, request.region].filter(Boolean).join(", ") || (sw ? "Halijawekwa" : "Not listed")} /><Info label={sw ? "Dharura" : "Urgency"} value={(request.urgency ?? "standard").replaceAll("_", " ")} /><Info label={sw ? "Njia salama" : "Safe contact"} value={(request.safeContactMethod ?? "in_app").replaceAll("_", " ")} /><Info label={sw ? "Hali" : "Status"} value={request.status.replaceAll("_", " ")} /></View>
        {!detail ? <View style={styles.reviewGate}><Ionicons name="lock-open-outline" size={27} color={colors.burgundy} /><Text style={styles.sectionTitle}>{sw ? "Fungua ukaguzi wa siri" : "Open private review"}</Text><Text style={styles.body}>{sw ? "Hatua hii itarekodiwa kwenye kumbukumbu ya ukaguzi na itaonyesha maelezo ya ombi kwa ajili ya triage." : "This action is logged and reveals the request details needed for triage."}</Text><Button label={sw ? "Anza kupitia ombi" : "Begin reviewing request"} loading={busy} disabled={busy} onPress={() => void beginReview()} /></View>
          : <>
            <Text style={styles.sectionTitle}>{sw ? "Maelezo ya ombi" : "Request details"}</Text>
            <View style={styles.detailCard}>{detail.name ? <Info label={sw ? "Mnufaika" : "Beneficiary"} value={detail.name} /> : null}<Info label={sw ? "Kilichotokea" : "What happened"} value={request.description ?? (sw ? "Hakuna maelezo." : "No description recorded.")} />{request.desiredHelp ? <Info label={sw ? "Msaada anaohitaji" : "Help requested"} value={request.desiredHelp} /> : null}{detail.sourceName ? <Info label={sw ? "Huduma aliyoiona" : "Service viewed"} value={detail.sourceName} /> : null}{detail.answers.map((answer, index) => <Info key={`${index}-${answer.questionKey}`} label={answer.questionKey.replaceAll("_", " ")} value={answer.value} />)}</View>
            <Text style={styles.sectionTitle}>{sw ? "Muhtasari salama wa kesi" : "Safe case summary"}</Text><Text style={styles.body}>{sw ? "Andika muhtasari unaohitajika kwa timu ya kesi. Epuka maelezo ya siri yasiyo muhimu." : "Write the context needed by the case team. Avoid unnecessary sensitive detail."}</Text><TextInput value={summary} onChangeText={setSummary} multiline maxLength={3000} placeholder={sw ? "Muhtasari wa kesi..." : "Case summary..."} placeholderTextColor={colors.inkMuted} style={styles.input} />
            <Text style={styles.sectionTitle}>{sw ? "Kipaumbele" : "Priority"}</Text><View style={styles.choices}>{(["standard", "urgent", "safeguarding"] as Priority[]).map((item) => <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: priority === item }} onPress={() => setPriority(item)} style={[styles.choice, priority === item && styles.choiceActive]}><Text style={styles.choiceText}>{item.replaceAll("_", " ")}</Text><Ionicons name={priority === item ? "radio-button-on" : "radio-button-off"} size={21} color={colors.burgundy} /></Pressable>)}</View>
            <Button label={sw ? "Fungua kesi na endelea" : "Create case and continue"} loading={busy} disabled={busy || summary.trim().length < 10} onPress={() => void convert()} />
          </>}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <Button label={sw ? "Rudi kwenye foleni" : "Back to queue"} variant="quiet" onPress={() => router.push("/operations")} />
      </>}
  </Screen>;
}

function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>; }
function State({ icon, title, body, action, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onPress?: () => void }) { return <View style={styles.state}><Ionicons name={icon} size={36} color={colors.burgundy} /><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.body}>{body}</Text>{action && onPress ? <Button label={action} onPress={onPress} /> : null}</View>; }

const styles = StyleSheet.create({
  hero: { marginTop: spacing.md, padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.burgundy, gap: spacing.sm }, heroSafety: { backgroundColor: colors.burgundyDark }, heroIcon: { width: 57, height: 57, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }, heroKicker: { marginTop: spacing.md, fontFamily: type.bold, fontSize: 12, color: colors.peach }, heroTitle: { fontFamily: type.bold, fontSize: 25, lineHeight: 31, color: colors.surface }, heroBody: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.surface },
  summaryCard: { marginTop: spacing.xl, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.lg }, info: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line }, label: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 }, value: { marginTop: spacing.xs, fontFamily: type.bold, color: colors.ink, fontSize: 15, lineHeight: 21 }, reviewGate: { marginTop: spacing.xl, backgroundColor: colors.burgundySoft, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md }, sectionTitle: { marginTop: spacing.xl, fontFamily: type.bold, color: colors.ink, fontSize: 19 }, body: { marginVertical: spacing.md, fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 }, detailCard: { marginTop: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.lg }, input: { minHeight: 120, marginVertical: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, fontFamily: type.regular, color: colors.ink, textAlignVertical: "top" }, choices: { gap: spacing.sm, marginVertical: spacing.md }, choice: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: spacing.md }, choiceActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, choiceText: { fontFamily: type.bold, color: colors.ink, fontSize: 14, textTransform: "capitalize" }, error: { marginTop: spacing.md, fontFamily: type.medium, color: colors.danger }, state: { marginTop: spacing.xl, alignItems: "center", gap: spacing.md, borderRadius: radius.lg, backgroundColor: colors.burgundySoft, padding: spacing.xl },
});
