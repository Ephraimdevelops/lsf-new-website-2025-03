import { plainError } from "../../../shared/plainLanguage";
import { destinationActions, decisionLabels, referralLabels } from '../../src/provider/referralFlow';
import { ParalegalIntro } from "../../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../../src/components/ParalegalNavigation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { CivicPageHeader as AppHeader } from "../../src/components/CivicPageHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

type Decision = "accepted" | "declined" | "scheduled" | "service_delivered" | "returned" | "closed";

export default function ProviderReferralDetailScreen() {
  useSensitiveScreenProtection("provider-referral-detail");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some((role) => role === "paralegal" || role === "provider_staff") ?? false;
  const record = useQuery(api.referrals.getForDestination, allowed && id ? { referralId: id as import("../../../convex/_generated/dataModel").Id<"referrals"> } : "skip");
  const respond = useMutation(api.referrals.respondAsDestination);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [allHistory, setAllHistory] = useState(false);
  useEffect(() => { setDecision(null); setNote(""); setError(""); setSaved(false); setReviewing(false); setAllHistory(false); }, [id]);
  const available = record ? destinationActions[record.referral.status] ?? [] : [];

  async function submit() {
    if (!record || !decision || busy) return;
    if (decision !== "accepted" && note.trim().length < 10) { setError(sw ? "Eleza sababu au hatua kwa angalau herufi 10." : "Explain the reason or action in at least 10 characters."); return; }
    setBusy(true); setError("");
    try {
      await respond({ referralId: record.referral._id, status: decision, expectedUpdatedAt: record.referral.updatedAt, note: note.trim() || undefined, declineReason: decision === "declined" ? note.trim() : undefined, finalDisposition: decision === "closed" ? note.trim() : undefined });
      setSaved(true);
    } catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }

  function confirm() { if (!decision) return; if (reviewing) void submit(); else setReviewing(true); }

  return <Screen footer={allowed ? <ParalegalNavigation current={access?.roles.includes("provider_staff") ? "referrals" : "cases"} /> : undefined}>
    <AppHeader compact back title={sw ? "Pitia rufaa" : "Review referral"} />
    {!isSignedIn ? <State title={sw ? "Ingia kuona rufaa" : "Sign in to view referrals"} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : access === undefined || (allowed && record === undefined) ? <State title={sw ? "Inapakia rufaa..." : "Loading referral..."} />
      : !allowed ? <State title={sw ? "Idhini ya mtoa huduma inahitajika" : "Provider approval required"} />
      : saved ? <Surface tone="teal" style={styles.state}><Ionicons name="checkmark-circle" size={40} color={colors.teal} /><Text style={styles.title}>{sw ? "Hatua imehifadhiwa" : "Action recorded"}</Text><Text style={styles.body}>{sw ? "Timu ya LSF na mnufaika wataona hatua inayofuata." : "LSF and the beneficiary will see the next update."}</Text><Button label={sw ? "Rudi kwenye rufaa" : "Back to referrals"} onPress={() => router.replace("/provider-referrals")} /></Surface>
      : !record ? <State title={sw ? "Rufaa hii haipo kwenye orodha yako." : "This referral is not in your queue."} action={sw ? "Rudi kwenye rufaa" : "Back to referrals"} onPress={() => router.replace("/provider-referrals")} />
      : <>
        <ParalegalIntro pose="direction" title={sw ? "Msaada umekabidhiwa kwako." : "Support has reached your service."} body={sw ? "Pitia sababu, taarifa zilizokubaliwa kushirikiwa na hali ya sasa kabla ya kuamua." : "Review the reason, consented information and current status before deciding."} />
        <Surface tone="pink" style={styles.block}><Text style={styles.label}>{sw ? "HALI YA RUFAA" : "REFERRAL STATUS"}</Text><Text style={styles.title}>{referralLabels[record.referral.status]?.[locale] ?? record.referral.status.replaceAll("_", " ")}</Text><Text style={styles.meta}>{record.case?.publicId ?? "—"} · {record.destinationService?.name ?? (sw ? "Huduma haipatikani" : "Service unavailable")}</Text></Surface>
        <Surface style={styles.block}><Text style={styles.title}>{sw ? "Kwa nini rufaa hii" : "Why this referral"}</Text><Text style={styles.body}>{record.referral.reason}</Text></Surface>
        <Surface style={styles.block}><Text style={styles.title}>{sw ? "Taarifa zilizokubaliwa kushirikiwa" : "Information approved for sharing"}</Text>{record.consent?.granted ? record.referral.informationShared.map((item, index) => <View key={`${index}-${item}`} style={styles.infoRow}><Ionicons name="checkmark-circle-outline" size={18} color={colors.teal} /><Text style={styles.infoText}>{item}</Text></View>) : <Text style={styles.body}>{sw ? "Ridhaa haijaonekana. Usifungue maelezo ya kesi; wasiliana na LSF." : "Consent is not recorded. Do not open case details; contact LSF."}</Text>}</Surface>
        {record.canOpenCase && record.case ? <Button label={sw ? "Fungua kesi ndani ya ruhusa yangu" : "Open case within my access"} variant="secondary" onPress={() => router.push({ pathname: "/case/[id]", params: { id: record.case!._id } })} /> : null}
        {["accepted", "scheduled", "service_delivered"].includes(record.referral.status) && !record.onwardReferral && record.case && <Button variant="secondary" label={sw ? "Pendekeza huduma inayofuata" : "Suggest onward help"} onPress={() => router.push({ pathname: "/work-referral", params: { caseId: record.referral.caseId, parentId: record.referral._id } })} />}
        {reviewing && <Text style={styles.body}>{sw ? "Hali ya rufaa itasasishwa na mnufaika ataarifiwa. Thibitisha kuhifadhi." : "The referral status will change and the beneficiary will receive an update. Confirm to save."}</Text>}
        {record.events.length ? <Surface style={styles.block}><Text style={styles.title}>{sw ? "Historia ya rufaa" : "Referral history"}</Text>{(allHistory ? record.events : record.events.slice(-5)).map((event) => <View key={event._id} style={styles.event}><Ionicons name="ellipse" size={10} color={colors.burgundy} /><View style={styles.flex}><Text style={styles.infoText}>{event.type.replaceAll("_", " ")}</Text><Text style={styles.meta}>{new Date(event.occurredAt).toLocaleString(sw ? "sw-TZ" : "en-TZ", {timeZone:"Africa/Dar_es_Salaam"})}</Text></View></View>)}{record.events.length > 5 && <Button variant="quiet" label={allHistory ? (sw ? "Onyesha hatua za karibuni" : "Show recent steps") : (sw ? "Onyesha historia yote" : "Show all history")} onPress={() => setAllHistory(!allHistory)} />}</Surface> : null}
        {record.consent?.granted && available.length ? <Surface tone="teal" style={styles.block}><Text style={styles.title}>{sw ? "Hatua inayofuata" : "Choose next action"}</Text><Text style={styles.body}>{sw ? "Chagua hali sahihi. Sababu ya kukataa au kufunga itarekodiwa." : "Choose the accurate status. Reasons for declining or closing are recorded."}</Text><View style={styles.options}>{available.map((item) => <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: decision === item }} aria-checked={decision === item} style={[styles.option, decision === item && styles.optionActive]} onPress={() => { setDecision(item); setReviewing(false); setError(""); }}><Ionicons name={decision === item ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={styles.infoText}>{decisionLabels[item][locale]}</Text></Pressable>)}</View>{decision ? <><TextInput value={note} onChangeText={value => { setNote(value); setReviewing(false); }} multiline maxLength={1200} style={styles.input} placeholder={decision === "accepted" ? (sw ? "Maelezo ya hatua (si lazima)" : "Action note (optional)") : (sw ? "Eleza sababu au hatua iliyochukuliwa" : "Explain the reason or action taken")} placeholderTextColor={colors.inkMuted} />{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<Button label={reviewing ? (sw ? "Thibitisha na hifadhi" : "Confirm and save") : decisionLabels[decision][locale]} loading={busy} disabled={busy || (decision !== "accepted" && note.trim().length < 10)} onPress={confirm} /></> : null}</Surface> : null}
        <Button label={sw ? "Rudi kwenye rufaa" : "Back to referrals"} variant="quiet" onPress={() => router.push("/provider-referrals")} />
      </>}
  </Screen>;
}

function State({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) { return <Surface tone="orange" style={styles.state}><Ionicons name="lock-closed-outline" size={32} color={colors.burgundy} /><Text style={styles.title}>{title}</Text>{action && onPress ? <Button label={action} variant="secondary" onPress={onPress} /> : null}</Surface>; }

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, padding: spacing.xl, backgroundColor: colors.burgundy, gap: spacing.sm }, heroIcon: { width: 52, height: 52, borderRadius: 17, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, kicker: { marginTop: spacing.sm, color: colors.peach, fontFamily: type.bold, fontSize: 12 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 25, lineHeight: 31 }, heroBody: { color: "#F9E8EF", fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  state: { marginTop: spacing.lg, gap: spacing.md }, block: { marginTop: spacing.md, gap: spacing.sm }, label: { color: colors.burgundy, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 17 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 15, lineHeight: 23 }, meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 },
  infoRow: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" }, infoText: { flex: 1, color: colors.ink, fontFamily: type.medium, fontSize: 15, lineHeight: 23 }, event: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.line }, flex: { flex: 1 }, options: { marginVertical: spacing.md, gap: spacing.sm }, option: { minHeight: 47, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, flexDirection: "row", gap: spacing.sm, alignItems: "center" }, optionActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, input: { minHeight: 100, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, color: colors.ink, textAlignVertical: "top" }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 13 },
});
