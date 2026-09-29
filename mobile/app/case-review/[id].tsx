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

const reasons = [
  { value: "reassignment", icon: "people-outline", sw: "Nahitaji msaidizi mwingine", en: "I need a different helper" },
  { value: "service_concern", icon: "chatbubble-ellipses-outline", sw: "Nina wasiwasi kuhusu huduma", en: "I have a service concern" },
  { value: "safety_concern", icon: "shield-outline", sw: "Nina wasiwasi wa usalama", en: "I have a safety concern" },
  { value: "other", icon: "help-circle-outline", sw: "Sababu nyingine", en: "Another reason" },
] as const;

export default function CaseReviewScreen() {
  useSensitiveScreenProtection("case-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const caseId = id as Id<"cases">;
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const details = useQuery(api.caseManagement.getCase, isSignedIn && id ? { caseId } : "skip");
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const requestReview = useMutation(api.caseManagement.requestCaseReview);
  const [reason, setReason] = useState<(typeof reasons)[number]["value"]>("service_concern");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const isBeneficiary = Boolean(details && access && details.case.beneficiaryId === access.user._id);
  const openReview = details?.reviewRequests.find((item) => item.status === "submitted" || item.status === "under_review");
  const closed = details && ["closed", "closed_unresolved"].includes(details.case.status);

  async function submit() {
    if (sending || !note.trim()) return;
    setSending(true);
    setError("");
    try {
      await requestReview({ caseId, reason, note: note.trim() });
      setNote("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : sw ? "Ombi halijatumwa. Jaribu tena." : "Request was not sent. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return <Screen>
    <AppHeader back title={sw ? "Unahitaji msaada zaidi?" : "Need more help?"} eyebrow="HAKI YANGU" />
    {!isSignedIn ? <State icon="lock-closed-outline" title={sw ? "Taarifa yako inalindwa" : "Your information is private"} body={sw ? "Ingia kuomba timu ya LSF ipitie kesi." : "Sign in to ask LSF to review your case."} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : details === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia kesi" : "Loading case"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !details ? <State icon="folder-outline" title={sw ? "Kesi haipatikani" : "Case not found"} body={sw ? "Huenda imebadilika au huna ruhusa ya kuiona." : "It may have changed, or you may not have access to it."} />
      : <>
        <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="heart-outline" size={32} color={colors.burgundy} /></View><Text style={styles.heroTitle}>{sw ? "Tuko hapa kukusikiliza." : "We are here to listen."}</Text><Text style={styles.heroBody}>{sw ? "Ikiwa msaada haujatosha au kuna tatizo, unaweza kuwasiliana na timu ya LSF." : "If the support was not enough or something went wrong, you can reach the LSF team."}</Text></View>
        <Text style={styles.caseRef}>{details.case.publicId}</Text>
        {!isBeneficiary ? <View style={styles.received}><Ionicons name="lock-closed-outline" size={32} color={colors.burgundy} /><Text style={styles.sectionTitle}>{sw ? "Mnufaika pekee" : "Beneficiary only"}</Text><Text style={styles.body}>{sw ? "Ni mnufaika wa kesi hii pekee anayeweza kuomba mapitio." : "Only the beneficiary of this case can request a review."}</Text></View>
          : openReview ? <View style={styles.received}><Ionicons name="checkmark-circle" size={34} color={colors.success} /><Text style={styles.sectionTitle}>{sw ? "Ombi lako limepokelewa" : "Your review request was received"}</Text><Text style={styles.body}>{sw ? "LSF inapitia ombi lako. Fuatilia arifa na kesi yako kwa hatua zinazofuata." : "LSF is reviewing your request. Watch your notifications and case for the next step."}</Text><Text style={styles.status}>{openReview.status.replaceAll("_", " ")}</Text></View>
          : closed ? <View style={styles.received}><Ionicons name="information-circle-outline" size={32} color={colors.burgundy} /><Text style={styles.sectionTitle}>{sw ? "Kesi hii imefungwa" : "This case is closed"}</Text><Text style={styles.body}>{sw ? "Ombi la kupitia kesi iliyofungwa haliwezi kutumwa hapa. Wasiliana na LSF au anza ombi jipya." : "A review request cannot be sent for a closed case here. Contact LSF or start a new request."}</Text><Button label={sw ? "Wasiliana na LSF" : "Contact LSF"} variant="secondary" onPress={() => router.push("/support")} /><Button label={sw ? "Omba msaada mpya" : "Start a new request"} variant="quiet" onPress={() => router.push("/intake")} /></View>
          : <>
            <Text style={styles.sectionTitle}>{sw ? "Tunaweza kusaidia vipi?" : "What should LSF review?"}</Text>
            <View style={styles.options}>{reasons.map((item) => <Pressable key={item.value} accessibilityRole="radio" accessibilityState={{ checked: reason === item.value }} onPress={() => setReason(item.value)} style={[styles.option, reason === item.value && styles.optionSelected]}><View style={styles.optionIcon}><Ionicons name={item.icon} size={22} color={colors.burgundy} /></View><Text style={styles.optionText}>{item[locale]}</Text><Ionicons name={reason === item.value ? "radio-button-on" : "radio-button-off"} size={22} color={colors.burgundy} /></Pressable>)}</View>
            <Text style={styles.sectionTitle}>{sw ? "Eleza kwa ufupi" : "Tell us what happened"}</Text>
            <Text style={styles.body}>{sw ? "Maelezo haya huenda kwa timu ya LSF, si moja kwa moja kwa msaidizi wako." : "These details go to LSF, not directly to your assigned helper."}</Text>
            <TextInput value={note} onChangeText={setNote} multiline maxLength={1200} placeholder={sw ? "Ungependa LSF ipitie nini?" : "What would you like LSF to review?"} placeholderTextColor={colors.inkMuted} style={styles.input} />
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            <Button label={sw ? "Tuma ombi kwa LSF" : "Send request to LSF"} disabled={!note.trim() || sending} loading={sending} onPress={() => void submit()} />
          </>}
        <View style={styles.actions}><Button label={sw ? "Rudi kwenye kesi yangu" : "Back to my case"} variant="quiet" onPress={() => router.push({ pathname: "/case/[id]", params: { id } })} /></View>
      </>}
  </Screen>;
}

function State({ icon, title, body, action, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onPress?: () => void }) { return <View style={styles.received}><Ionicons name={icon} size={35} color={colors.burgundy} /><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.body}>{body}</Text>{action && onPress ? <Button label={action} onPress={onPress} /> : null}</View>; }

const styles = StyleSheet.create({
  hero: { marginTop: spacing.md, padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.burgundySoft, gap: spacing.sm }, heroIcon: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  heroTitle: { marginTop: spacing.md, fontFamily: type.bold, fontSize: 25, lineHeight: 31, color: colors.burgundy }, heroBody: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.ink },
  caseRef: { marginVertical: spacing.xl, fontFamily: type.bold, fontSize: 13, color: colors.burgundy }, sectionTitle: { fontFamily: type.bold, fontSize: 19, lineHeight: 25, color: colors.ink },
  body: { marginTop: spacing.sm, fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.inkMuted }, options: { marginTop: spacing.md, marginBottom: spacing.xl, gap: spacing.sm },
  option: { minHeight: 68, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  optionSelected: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, optionIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, optionText: { flex: 1, fontFamily: type.medium, fontSize: 14, color: colors.ink },
  input: { minHeight: 140, marginVertical: spacing.md, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, fontFamily: type.regular, color: colors.ink, textAlignVertical: "top" },
  error: { color: colors.danger, fontFamily: type.medium, marginBottom: spacing.md }, received: { marginTop: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.greenSoft, padding: spacing.xl, gap: spacing.sm }, status: { fontFamily: type.bold, color: colors.success }, actions: { marginTop: spacing.xl },
});
