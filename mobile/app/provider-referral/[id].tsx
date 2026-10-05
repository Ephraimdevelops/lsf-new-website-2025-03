import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

type Decision = "accepted" | "declined" | "scheduled" | "service_delivered" | "returned" | "closed";
const choices: Record<string, Decision[]> = {
  created: ["accepted", "declined"], destination_notified: ["accepted", "declined", "returned"],
  accepted: ["scheduled", "service_delivered", "closed"], scheduled: ["service_delivered", "closed"],
  service_delivered: ["closed"], escalated: ["accepted", "returned", "closed"],
};
const copy: Record<Decision, { sw: string; en: string }> = {
  accepted: { sw: "Kubali rufaa", en: "Accept referral" }, declined: { sw: "Kataa rufaa", en: "Decline referral" },
  scheduled: { sw: "Panga huduma", en: "Mark scheduled" }, service_delivered: { sw: "Huduma imetolewa", en: "Service delivered" },
  returned: { sw: "Rudisha kwa LSF", en: "Return to LSF" }, closed: { sw: "Funga rufaa", en: "Close referral" },
};

export default function ProviderReferralDetailScreen() {
  useSensitiveScreenProtection("provider-referral-detail");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some((role) => role === "paralegal" || role === "provider_staff") ?? false;
  const rows = useQuery(api.referrals.myDestinationQueue, allowed ? {} : "skip");
  const record = rows?.find(({ referral }) => referral._id === id);
  const respond = useMutation(api.referrals.respondAsDestination);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const available = record ? choices[record.referral.status] ?? [] : [];

  async function submit() {
    if (!record || !decision || busy) return;
    if (decision !== "accepted" && note.trim().length < 10) { setError(sw ? "Eleza sababu au hatua kwa angalau herufi 10." : "Explain the reason or action in at least 10 characters."); return; }
    setBusy(true); setError("");
    try {
      await respond({ referralId: record.referral._id, status: decision, note: note.trim() || undefined, declineReason: decision === "declined" ? note.trim() : undefined, finalDisposition: decision === "closed" ? note.trim() : undefined });
      setSaved(true);
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }

  function confirm() {
    if (!decision) return;
    Alert.alert(sw ? "Thibitisha hatua" : "Confirm action", sw ? "Hali ya rufaa itasasishwa na mnufaika ataarifiwa." : "The referral status will change and the beneficiary will receive an update.", [
      { text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: copy[decision][locale], onPress: () => void submit() },
    ]);
  }

  return <Screen>
    <AppHeader back title={sw ? "Pitia rufaa" : "Review referral"} eyebrow="HAKI YANGU · PROVIDER" />
    {!isSignedIn ? <State title={sw ? "Ingia kuona rufaa" : "Sign in to view referrals"} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : access === undefined || (allowed && rows === undefined) ? <State title={sw ? "Inapakia rufaa..." : "Loading referral..."} />
      : !allowed ? <State title={sw ? "Idhini ya mtoa huduma inahitajika" : "Provider approval required"} />
      : saved ? <Surface tone="teal" style={styles.state}><Ionicons name="checkmark-circle" size={40} color={colors.teal} /><Text style={styles.title}>{sw ? "Hatua imehifadhiwa" : "Action recorded"}</Text><Text style={styles.body}>{sw ? "Timu ya LSF na mnufaika wataona hatua inayofuata." : "LSF and the beneficiary will see the next update."}</Text><Button label={sw ? "Rudi kwenye rufaa" : "Back to referrals"} onPress={() => router.replace("/provider-referrals")} /></Surface>
      : !record ? <State title={sw ? "Rufaa hii haipo kwenye foleni yako." : "This referral is not in your queue."} action={sw ? "Rudi kwenye rufaa" : "Back to referrals"} onPress={() => router.replace("/provider-referrals")} />
      : <>
        <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="paper-plane-outline" size={28} color={colors.burgundy} /></View><Text style={styles.kicker}>{record.referral.publicId}</Text><Text style={styles.heroTitle}>{sw ? "Msaada umekabidhiwa kwako." : "Support has reached your service."}</Text><Text style={styles.heroBody}>{sw ? "Pitia sababu, taarifa zilizokubaliwa kushirikiwa na hali ya sasa kabla ya kuamua." : "Review the reason, consented information and current status before deciding."}</Text></View>
        <Surface tone="pink" style={styles.block}><Text style={styles.label}>{sw ? "HALI YA RUFAA" : "REFERRAL STATUS"}</Text><Text style={styles.title}>{record.referral.status.replaceAll("_", " ")}</Text><Text style={styles.meta}>{record.case?.publicId ?? "—"} · {record.destinationService?.name ?? (sw ? "Huduma haipatikani" : "Service unavailable")}</Text></Surface>
        <Surface style={styles.block}><Text style={styles.title}>{sw ? "Kwa nini rufaa hii" : "Why this referral"}</Text><Text style={styles.body}>{record.referral.reason}</Text></Surface>
        <Surface style={styles.block}><Text style={styles.title}>{sw ? "Taarifa zilizokubaliwa kushirikiwa" : "Information approved for sharing"}</Text>{record.consent?.granted ? record.referral.informationShared.map((item, index) => <View key={`${index}-${item}`} style={styles.infoRow}><Ionicons name="checkmark-circle-outline" size={18} color={colors.teal} /><Text style={styles.infoText}>{item}</Text></View>) : <Text style={styles.body}>{sw ? "Ridhaa haijaonekana. Usifungue maelezo ya kesi; wasiliana na LSF." : "Consent is not recorded. Do not open case details; contact LSF."}</Text>}</Surface>
        {record.consent?.granted && record.case ? <Button label={sw ? "Fungua kesi ndani ya ruhusa yangu" : "Open case within my access"} variant="secondary" onPress={() => router.push({ pathname: "/case/[id]", params: { id: record.case!._id } })} /> : null}
        {record.events.length ? <Surface style={styles.block}><Text style={styles.title}>{sw ? "Historia ya rufaa" : "Referral history"}</Text>{record.events.slice(-5).map((event) => <View key={event._id} style={styles.event}><Ionicons name="ellipse" size={10} color={colors.burgundy} /><View style={styles.flex}><Text style={styles.infoText}>{event.type.replaceAll("_", " ")}</Text><Text style={styles.meta}>{new Date(event.occurredAt).toLocaleString(sw ? "sw-TZ" : "en-TZ")}</Text></View></View>)}</Surface> : null}
        {record.consent?.granted && available.length ? <Surface tone="teal" style={styles.block}><Text style={styles.title}>{sw ? "Hatua inayofuata" : "Choose next action"}</Text><Text style={styles.body}>{sw ? "Chagua hali sahihi. Sababu ya kukataa au kufunga itarekodiwa." : "Choose the accurate status. Reasons for declining or closing are recorded."}</Text><View style={styles.options}>{available.map((item) => <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: decision === item }} aria-checked={decision === item} style={[styles.option, decision === item && styles.optionActive]} onPress={() => { setDecision(item); setError(""); }}><Ionicons name={decision === item ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={styles.infoText}>{copy[item][locale]}</Text></Pressable>)}</View>{decision ? <><TextInput value={note} onChangeText={setNote} multiline maxLength={1200} style={styles.input} placeholder={decision === "accepted" ? (sw ? "Maelezo ya hatua (si lazima)" : "Action note (optional)") : (sw ? "Eleza sababu au hatua iliyochukuliwa" : "Explain the reason or action taken")} placeholderTextColor={colors.inkMuted} />{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<Button label={copy[decision][locale]} loading={busy} disabled={busy || (decision !== "accepted" && note.trim().length < 10)} onPress={confirm} /></> : null}</Surface> : null}
        <Button label={sw ? "Rudi kwenye rufaa" : "Back to referrals"} variant="quiet" onPress={() => router.push("/provider-referrals")} />
      </>}
  </Screen>;
}

function State({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) { return <Surface tone="orange" style={styles.state}><Ionicons name="lock-closed-outline" size={32} color={colors.burgundy} /><Text style={styles.title}>{title}</Text>{action && onPress ? <Button label={action} variant="secondary" onPress={onPress} /> : null}</Surface>; }

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, padding: spacing.xl, backgroundColor: colors.burgundy, gap: spacing.sm }, heroIcon: { width: 52, height: 52, borderRadius: 17, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, kicker: { marginTop: spacing.sm, color: colors.peach, fontFamily: type.bold, fontSize: 12 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 25, lineHeight: 31 }, heroBody: { color: "#F9E8EF", fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  state: { marginTop: spacing.lg, gap: spacing.md }, block: { marginTop: spacing.md, gap: spacing.sm }, label: { color: colors.burgundy, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 17 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 20 }, meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 },
  infoRow: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" }, infoText: { flex: 1, color: colors.ink, fontFamily: type.medium, fontSize: 13, lineHeight: 19 }, event: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.line }, flex: { flex: 1 }, options: { marginVertical: spacing.md, gap: spacing.sm }, option: { minHeight: 47, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, flexDirection: "row", gap: spacing.sm, alignItems: "center" }, optionActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, input: { minHeight: 100, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, color: colors.ink, textAlignVertical: "top" }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 13 },
});
