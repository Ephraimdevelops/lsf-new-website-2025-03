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

export default function AssignmentOfferScreen() {
  useSensitiveScreenProtection("assignment-offer");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some((role) => ["paralegal", "provider_staff"].includes(role)) ?? false;
  const offers = useQuery(api.caseManagement.assignmentInbox, allowed ? {} : "skip");
  const respond = useMutation(api.caseManagement.respondToAssignment);
  const [choice, setChoice] = useState<"accepted" | "declined" | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState<{ decision: "accepted" | "declined"; caseId: Id<"cases"> } | null>(null);
  const offer = offers?.find((item) => item.assignment._id === id);

  async function submit() {
    if (!offer || !choice || saving) return;
    setSaving(true);
    setError("");
    try {
      await respond({ assignmentId: offer.assignment._id, response: choice, reason: choice === "declined" ? declineReason.trim() || undefined : undefined });
      setCompleted({ decision: choice, caseId: offer.assignment.caseId });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : sw ? "Uamuzi haujahifadhiwa. Jaribu tena." : "Decision was not saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return <Screen>
    <AppHeader back title={sw ? "Ofa ya kesi" : "Assignment offer"} eyebrow="HAKI YANGU · PARALEGAL" />
    {!isSignedIn ? <State icon="lock-closed-outline" title={sw ? "Ofa ni za siri" : "Offers are private"} body={sw ? "Ingia kuona ofa za kazi." : "Sign in to see your work offers."} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : access === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia ruhusa" : "Loading access"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !allowed ? <State icon="shield-outline" title={sw ? "Idhini inahitajika" : "Approval required"} body={sw ? "Jukumu la paralegal lazima liidhinishwe kabla ya kuona ofa." : "Your paralegal role must be approved before you can see offers."} action={sw ? "Angalia kujiunga" : "View onboarding"} onPress={() => router.push("/paralegal-onboarding")} />
      : completed ? <View style={styles.complete}><Ionicons name={completed.decision === "accepted" ? "checkmark-circle" : "arrow-undo-circle-outline"} size={57} color={colors.success} /><Text style={styles.completeTitle}>{completed.decision === "accepted" ? (sw ? "Umekubali kazi hii" : "You accepted this assignment") : (sw ? "Umekataa ofa hii" : "You declined this offer")}</Text><Text style={styles.body}>{completed.decision === "accepted" ? (sw ? "Kesi sasa ipo kwenye kazi zako. Fungua kesi kuona mawasiliano na hatua zinazofuata." : "The case is now in your work. Open it for messages and next steps.") : (sw ? "Timu ya LSF inaweza kuipangia kesi hii msaidizi mwingine." : "The LSF team can offer this case to another helper.")}</Text><Button label={completed.decision === "accepted" ? (sw ? "Fungua kesi" : "Open case") : (sw ? "Rudi kwenye ofa" : "Back to offers")} onPress={() => router.replace(completed.decision === "accepted" ? { pathname: "/case/[id]", params: { id: completed.caseId } } : "/paralegal-assignments")} /></View>
      : offers === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia ofa" : "Loading offer"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !offer ? <State icon="time-outline" title={sw ? "Ofa haipatikani" : "Offer no longer available"} body={sw ? "Huenda imeisha muda au tayari imejibiwa. Angalia ofa zilizopo." : "It may have expired or already been answered. Check your current offers."} action={sw ? "Angalia ofa" : "View offers"} onPress={() => router.replace("/paralegal-assignments")} />
      : <>
        <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="briefcase-outline" size={30} color={colors.surface} /></View><Text style={styles.heroKicker}>{offer.case?.publicId ?? (sw ? "Kesi inalindwa" : "Protected case")}</Text><Text style={styles.heroTitle}>{sw ? "Kagua kabla ya kujibu." : "Review before you respond."}</Text><Text style={styles.heroBody}>{sw ? "Kubali tu ikiwa una uwezo na muda wa kushughulikia kesi hii." : "Accept only if you have the capacity and time to support this case."}</Text></View>
        <View style={styles.detailCard}><Detail icon="information-circle-outline" label={sw ? "Muhtasari" : "Summary"} value={offer.case?.summary ?? (sw ? "Maelezo hayapatikani kabla ya kupokea kazi." : "Details are not available before accepting the offer.")} /><Detail icon="flag-outline" label={sw ? "Kipaumbele" : "Priority"} value={offer.case?.priority?.replaceAll("_", " ") ?? (sw ? "Hakijawekwa" : "Not listed")} />{offer.assignment.expiresAt ? <Detail icon="time-outline" label={sw ? "Jibu kabla ya" : "Respond by"} value={new Date(offer.assignment.expiresAt).toLocaleString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })} /> : null}</View>
        <Text style={styles.sectionTitle}>{sw ? "Uamuzi wako" : "Your decision"}</Text>
        <View style={styles.choices}>{(["accepted", "declined"] as const).map((option) => <Pressable key={option} accessibilityRole="radio" accessibilityState={{ checked: choice === option }} aria-checked={choice === option} onPress={() => setChoice(option)} style={[styles.choice, choice === option && styles.choiceActive]}><Ionicons name={option === "accepted" ? "checkmark-circle-outline" : "close-circle-outline"} size={24} color={colors.burgundy} /><Text style={styles.choiceText}>{option === "accepted" ? (sw ? "Ninakubali kazi hii" : "I can take this case") : (sw ? "Siwezi kupokea kazi hii" : "I cannot take this case")}</Text><Ionicons name={choice === option ? "radio-button-on" : "radio-button-off"} size={21} color={colors.burgundy} /></Pressable>)}</View>
        {choice === "declined" ? <TextInput value={declineReason} onChangeText={setDeclineReason} maxLength={500} multiline placeholder={sw ? "Sababu fupi kwa timu ya LSF (si lazima)" : "Brief reason for LSF (optional)"} placeholderTextColor={colors.inkMuted} style={styles.input} /> : null}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <Button label={choice === "accepted" ? (sw ? "Thibitisha kukubali" : "Confirm acceptance") : choice === "declined" ? (sw ? "Thibitisha kukataa" : "Confirm decline") : (sw ? "Chagua uamuzi hapo juu" : "Choose a decision above")} disabled={!choice || saving} loading={saving} onPress={() => void submit()} />
        <Button label={sw ? "Rudi kwenye ofa" : "Back to offers"} variant="quiet" onPress={() => router.back()} />
      </>}
  </Screen>;
}

function Detail({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) { return <View style={styles.detail}><Ionicons name={icon} size={21} color={colors.burgundy} /><View style={styles.flex}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View></View>; }
function State({ icon, title, body, action, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onPress?: () => void }) { return <View style={styles.state}><Ionicons name={icon} size={36} color={colors.burgundy} /><Text style={styles.completeTitle}>{title}</Text><Text style={styles.body}>{body}</Text>{action && onPress ? <Button label={action} onPress={onPress} /> : null}</View>; }

const styles = StyleSheet.create({
  hero: { marginTop: spacing.md, padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.ink, gap: spacing.sm }, heroIcon: { width: 56, height: 56, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)" }, heroKicker: { marginTop: spacing.md, fontFamily: type.bold, color: colors.peach, fontSize: 12 }, heroTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 25, lineHeight: 31 }, heroBody: { fontFamily: type.regular, color: "#E6DCE1", fontSize: 14, lineHeight: 21 },
  detailCard: { marginTop: spacing.xl, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, paddingHorizontal: spacing.lg }, detail: { flexDirection: "row", gap: spacing.md, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.line }, flex: { flex: 1 }, label: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 }, value: { marginTop: spacing.xs, fontFamily: type.bold, color: colors.ink, fontSize: 15, lineHeight: 21 }, sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md, fontFamily: type.bold, color: colors.ink, fontSize: 19 },
  choices: { gap: spacing.sm, marginBottom: spacing.lg }, choice: { minHeight: 65, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }, choiceActive: { backgroundColor: colors.burgundySoft, borderColor: colors.burgundy }, choiceText: { flex: 1, fontFamily: type.medium, color: colors.ink, fontSize: 14 }, input: { minHeight: 95, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, fontFamily: type.regular, color: colors.ink, textAlignVertical: "top", marginBottom: spacing.lg }, error: { marginBottom: spacing.md, fontFamily: type.medium, color: colors.danger },
  complete: { marginTop: spacing.xl, alignItems: "center", gap: spacing.md, padding: spacing.xl, backgroundColor: colors.greenSoft, borderRadius: radius.lg }, completeTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 21, textAlign: "center" }, body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" }, state: { marginTop: spacing.xl, alignItems: "center", gap: spacing.md, padding: spacing.xl, backgroundColor: colors.burgundySoft, borderRadius: radius.lg },
});
