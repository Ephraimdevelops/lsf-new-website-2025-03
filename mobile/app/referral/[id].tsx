import { plainError } from "../../../shared/plainLanguage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

const statusCopy: Record<string, { sw: string; en: string; icon: keyof typeof Ionicons.glyphMap }> = {
  awaiting_beneficiary_consent: { sw: "Uamuzi wako unahitajika", en: "Your decision is needed", icon: "shield-checkmark-outline" },
  created: { sw: "Rufaa imetumwa", en: "Referral sent", icon: "paper-plane-outline" },
  destination_notified: { sw: "Huduma imejulishwa", en: "Service notified", icon: "notifications-outline" },
  accepted: { sw: "Rufaa imekubaliwa", en: "Referral accepted", icon: "checkmark-circle-outline" },
  declined: { sw: "Huduma haikukubali rufaa", en: "Service declined referral", icon: "people-outline" },
  scheduled: { sw: "Huduma imepangwa", en: "Service scheduled", icon: "calendar-outline" },
  service_delivered: { sw: "Huduma imetolewa", en: "Service delivered", icon: "checkmark-done-outline" },
  returned: { sw: "Rufaa imerudishwa kwa LSF", en: "Referral returned to LSF", icon: "return-up-back-outline" },
  closed: { sw: "Rufaa imefungwa", en: "Referral closed", icon: "folder-outline" },
};

export default function ReferralDetailScreen() {
  useSensitiveScreenProtection("referral-detail");
  const { id, caseId } = useLocalSearchParams<{ id: string; caseId: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const referrals = useQuery(api.referrals.listForCase, isSignedIn && caseId ? { caseId: caseId as Id<"cases"> } : "skip");
  const decide = useMutation(api.referrals.decideBeneficiaryConsent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const referral = referrals?.find((item) => item._id === id);
  const waiting = referral?.status === "awaiting_beneficiary_consent";
  const status = referral && (statusCopy[referral.status] ?? { sw: "Rufaa inaendelea", en: "Referral in progress", icon: "time-outline" as const });

  async function recordDecision(decision: "approved" | "declined") {
    if (!referral || saving) return;
    setSaving(true);
    setError("");
    try {
      await decide({ referralId: referral._id, decision });
    } catch (caught) {
      setError(plainError(caught, locale, sw ? "Uamuzi haujahifadhiwa. Jaribu tena." : "Your decision was not saved. Please try again."));
    } finally {
      setSaving(false);
    }
  }

  function confirmDecision(decision: "approved" | "declined") {
    Alert.alert(
      decision === "approved" ? (sw ? "Idhinisha kushiriki taarifa?" : "Approve sharing information?") : (sw ? "Kataa rufaa hii?" : "Decline this referral?"),
      decision === "approved"
        ? (sw ? "Ni taarifa zilizoonyeshwa hapa tu zitakazoshirikiwa na huduma iliyotajwa." : "Only the information shown here will be shared with the named service.")
        : (sw ? "Taarifa zako hazitatumwa kwa huduma hii. Timu ya LSF inaweza kutafuta chaguo jingine." : "Your information will not be sent to this service. LSF can look for another option."),
      [
        { text: sw ? "Rudi" : "Go back", style: "cancel" },
        { text: decision === "approved" ? (sw ? "Ninakubali" : "I agree") : (sw ? "Sikubali" : "I decline"), style: decision === "declined" ? "destructive" : "default", onPress: () => void recordDecision(decision) },
      ],
    );
  }

  return <Screen>
    <AppHeader back title={sw ? "Msaada kutoka huduma nyingine" : "My referral"} eyebrow="HAKI YANGU" />
    {!isSignedIn ? <State icon="lock-closed-outline" title={sw ? "Rufaa yako inalindwa" : "Your referral is private"} body={sw ? "Ingia kuona taarifa na kutoa uamuzi wako." : "Sign in to view details and make your decision."} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : referrals === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia rufaa" : "Loading referral"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !referral ? <State icon="search-outline" title={sw ? "Rufaa haipatikani" : "Referral not found"} body={sw ? "Huenda imebadilika au huna ruhusa ya kuiona." : "It may have changed, or you may not have access to it."} action={sw ? "Rudi kwenye kesi" : "Return to case"} onPress={() => router.back()} />
      : <>
        <View style={[styles.hero, waiting && styles.heroPending]}>
          <View style={styles.heroIcon}><Ionicons name={status!.icon} size={30} color={waiting ? colors.burgundy : colors.surface} /></View>
          <Text style={[styles.heroKicker, waiting && styles.heroKickerPending]}>{referral.publicId}</Text>
          <Text style={[styles.heroTitle, waiting && styles.heroTitlePending]}>{status![locale]}</Text>
          <Text style={[styles.heroBody, waiting && styles.heroBodyPending]}>{waiting
            ? (sw ? "Tafadhali kagua mahali rufaa inaenda na taarifa zitakazoshirikiwa. Hakuna kitakachotumwa kabla ya uamuzi wako." : "Review where this referral will go and what will be shared. Nothing is sent before you decide.")
            : referral.status === "declined" || referral.status === "returned"
              ? (sw ? "Timu ya LSF inaweza kukusaidia kupata hatua nyingine." : "The LSF team can help find another next step.")
              : (sw ? "Fuatilia maendeleo na hatua zinazofuata hapa." : "Follow progress and next steps here.")}</Text>
        </View>

        <Text style={styles.sectionTitle}>{sw ? "Rufaa inaenda wapi" : "Where your referral goes"}</Text>
        <View style={styles.card}>
          <Ionicons name="business-outline" size={23} color={colors.burgundy} />
          <View style={styles.cardCopy}>
            <Text style={styles.cardTitle}>{referral.destinationService?.name ?? (sw ? "Huduma haipatikani" : "Service unavailable")}</Text>
            {referral.destinationService?.organizationName ? <Text style={styles.cardBody}>{referral.destinationService.organizationName}</Text> : null}
            {[referral.destinationService?.district, referral.destinationService?.region].filter(Boolean).length ? <Text style={styles.cardBody}>{[referral.destinationService?.district, referral.destinationService?.region].filter(Boolean).join(", ")}</Text> : null}
          </View>
        </View>

        <Text style={styles.sectionTitle}>{sw ? "Kwa nini rufaa hii" : "Why this referral"}</Text>
        <View style={styles.card}><Ionicons name="information-circle-outline" size={23} color={colors.burgundy} /><Text style={[styles.cardBody, styles.flex]}>{referral.reason}</Text></View>

        <Text style={styles.sectionTitle}>{waiting ? (sw ? "Taarifa zitakazoshirikiwa ukikubali" : "Information shared only if you agree") : (sw ? "Taarifa za rufaa" : "Referral information")}</Text>
        <View style={styles.listCard}>{referral.informationShared.length ? referral.informationShared.map((item, index) => <View key={`${index}-${item}`} style={styles.listRow}><Ionicons name="checkmark-circle-outline" size={20} color={colors.burgundy} /><Text style={styles.listText}>{item}</Text></View>) : <Text style={styles.cardBody}>{sw ? "Hakuna taarifa zilizoorodheshwa." : "No information is listed."}</Text>}</View>

        {waiting ? <View style={styles.consentPanel}>
          <Ionicons name="lock-closed-outline" size={22} color={colors.burgundy} />
          <Text style={styles.consentText}>{sw ? "Unaweza kukataa. Rufaa hii haitatumwa na LSF inaweza kutafuta msaada mwingine." : "You can decline. This referral will not be sent, and LSF can look for other help."}</Text>
        </View> : null}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {waiting ? <View style={styles.actions}>
          <Button label={sw ? "Ninakubali rufaa hii" : "I agree to this referral"} disabled={saving} loading={saving} onPress={() => confirmDecision("approved")} />
          <Button label={sw ? "Sikubali kushiriki taarifa" : "I do not agree to share"} variant="secondary" disabled={saving} onPress={() => confirmDecision("declined")} />
        </View> : <View style={styles.progress}>
          <Text style={styles.sectionTitle}>{sw ? "Maendeleo ya rufaa" : "Referral progress"}</Text>
          {referral.events.map((event) => <View key={event._id} style={styles.event}><View style={styles.dot} /><View style={styles.flex}><Text style={styles.eventTitle}>{event.type.replaceAll("_", " ")}</Text><Text style={styles.eventDate}>{new Date(event.occurredAt).toLocaleString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })}</Text>{event.note ? <Text style={styles.cardBody}>{event.note}</Text> : null}</View></View>)}
        </View>}
        <Button label={sw ? "Rudi kwenye kesi yangu" : "Back to my case"} variant="quiet" onPress={() => router.push({ pathname: "/case/[id]", params: { id: caseId } })} />
      </>}
  </Screen>;
}

function State({ icon, title, body, action, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onPress?: () => void }) {
  return <View style={styles.state}><Ionicons name={icon} size={36} color={colors.burgundy} /><Text style={styles.stateTitle}>{title}</Text><Text style={styles.cardBody}>{body}</Text>{action && onPress ? <Button label={action} onPress={onPress} /> : null}</View>;
}

const styles = StyleSheet.create({
  hero: { marginTop: spacing.md, padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.burgundy, gap: spacing.sm },
  heroPending: { backgroundColor: colors.burgundySoft },
  heroIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: "rgba(255,255,255,0.17)", alignItems: "center", justifyContent: "center" },
  heroKicker: { marginTop: spacing.md, fontFamily: type.bold, fontSize: 12, color: colors.peach }, heroKickerPending: { color: colors.burgundy },
  heroTitle: { fontFamily: type.bold, fontSize: 24, lineHeight: 31, color: colors.surface }, heroTitlePending: { color: colors.burgundy },
  heroBody: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.surface }, heroBodyPending: { color: colors.ink },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md, fontFamily: type.bold, fontSize: 18, color: colors.ink },
  card: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  cardCopy: { flex: 1, gap: spacing.xs }, cardTitle: { fontFamily: type.bold, fontSize: 16, color: colors.ink }, cardBody: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.inkMuted }, flex: { flex: 1 },
  listCard: { padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, gap: spacing.md },
  listRow: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" }, listText: { flex: 1, fontFamily: type.medium, fontSize: 14, lineHeight: 21, color: colors.ink },
  consentPanel: { marginTop: spacing.lg, flexDirection: "row", gap: spacing.md, borderRadius: radius.md, backgroundColor: colors.burgundySoft, padding: spacing.lg },
  consentText: { flex: 1, fontFamily: type.medium, color: colors.burgundyDark, lineHeight: 20 },
  actions: { marginTop: spacing.xl, gap: spacing.md }, error: { marginTop: spacing.md, fontFamily: type.medium, color: colors.danger },
  progress: { marginBottom: spacing.xl }, event: { flexDirection: "row", gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line },
  dot: { marginTop: 5, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.burgundy }, eventTitle: { fontFamily: type.bold, fontSize: 14, color: colors.ink }, eventDate: { marginTop: 3, marginBottom: spacing.xs, fontFamily: type.regular, fontSize: 12, color: colors.inkMuted },
  state: { marginTop: spacing.xxl, alignItems: "center", gap: spacing.md, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.burgundySoft },
  stateTitle: { fontFamily: type.bold, fontSize: 20, color: colors.burgundy, textAlign: "center" },
});
