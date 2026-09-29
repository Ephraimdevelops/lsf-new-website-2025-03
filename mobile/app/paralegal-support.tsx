import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const kinds = [
  ["supervisor", "Msaada wa msimamizi", "Supervisor guidance"],
  ["challenging_case", "Kesi yenye changamoto", "Challenging case"],
  ["peer_support", "Mtandao wa wenzangu", "Peer support"],
  ["wellbeing", "Ustawi wangu", "Wellbeing check-in"],
  ["payment", "Malipo au madai", "Payment or claim"],
] as const;

export default function ParalegalSupportScreen() {
  const { kind: requestedKind } = useLocalSearchParams<{ kind?: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const approved = access?.roles.some((role) => ["paralegal", "provider_staff"].includes(role)) ?? false;
  const requests = useQuery(api.paralegals.mySupportRequests, approved ? {} : "skip");
  const requestSupport = useMutation(api.paralegals.requestSupport);
  const [kind, setKind] = useState<(typeof kinds)[number][0]>(kinds.find(([value]) => value === requestedKind)?.[0] ?? "supervisor");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function submit() {
    setSaving(true); setError("");
    try { await requestSupport({ type: kind, note }); setNote(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : (locale === "sw" ? "Haikuweza kutuma ombi." : "Could not send request.")); }
    finally { setSaving(false); }
  }
  if (!isSignedIn) return <Screen><View style={styles.header}><Pressable onPress={() => router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable><Text style={styles.headerTitle}>{locale === "sw" ? "Msaada wa paralegal" : "Paralegal support"}</Text><View style={{ width: 26 }} /></View><View style={styles.hero}><Ionicons name="heart-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{locale === "sw" ? "Wewe ni muhimu." : "You matter."}</Text><Text style={styles.heroBody}>{locale === "sw" ? "Mwongozo wa msimamizi, msaada wa kesi, ustawi na madai hukaa mahali pamoja." : "Supervisor guidance, case help, wellbeing and claims stay in one place."}</Text></View><SectionHeading title={locale === "sw" ? "Aina za msaada" : "Support options"} /><View style={styles.choices}>{kinds.map(([value, sw, en]) => <View key={value} style={styles.choice}><Ionicons name="heart-outline" size={20} color={colors.burgundy} /><Text style={styles.choiceText}>{locale === "sw" ? sw : en}</Text></View>)}</View><Surface tone="pink"><Text style={styles.empty}>{locale === "sw" ? "Ingia kwa akaunti ya paralegal iliyoidhinishwa kutuma ombi la siri kwa LSF." : "Sign in with an approved paralegal account to send a private request to LSF."}</Text><Button label={locale === "sw" ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} /></Surface></Screen>;
  if (access === undefined) return <Screen><Text style={styles.empty}>{locale === "sw" ? "Tunapakia ruhusa..." : "Loading access..."}</Text></Screen>;
  if (!approved) return <Screen><View style={styles.header}><Pressable onPress={() => router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable><Text style={styles.headerTitle}>{locale === "sw" ? "Msaada wa paralegal" : "Paralegal support"}</Text><View style={{ width: 26 }} /></View><Surface tone="orange"><Text style={styles.empty}>{locale === "sw" ? "Jukumu la paralegal lazima liidhinishwe na LSF kabla ya kutuma ombi la msaada wa kazi." : "LSF must approve your paralegal role before you can request work support."}</Text><Button label={locale === "sw" ? "Angalia kujiunga" : "View onboarding"} onPress={() => router.push("/paralegal-onboarding")} /></Surface></Screen>;
  return <Screen>
    <View style={styles.header}><Pressable onPress={() => router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable><Text style={styles.headerTitle}>{locale === "sw" ? "Msaada wa paralegal" : "Paralegal support"}</Text><View style={{ width: 26 }} /></View>
    <View style={styles.hero}><Ionicons name="heart-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{locale === "sw" ? "Wewe ni muhimu." : "You matter."}</Text><Text style={styles.heroBody}>{locale === "sw" ? "Omba mwongozo, msaada wa kesi, mazungumzo ya ustawi au msaada wa malipo kupitia LSF." : "Request case guidance, wellbeing support, peer connection or payment help through LSF."}</Text></View>
    <SectionHeading title={locale === "sw" ? "Nahitaji msaada wa" : "I need support with"} />
    <View style={styles.choices}>{kinds.map(([value, sw, en]) => <Pressable key={value} onPress={() => setKind(value)} style={[styles.choice, kind === value && styles.choiceActive]}><Ionicons name={kind === value ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={[styles.choiceText, kind === value && styles.choiceTextActive]}>{locale === "sw" ? sw : en}</Text></Pressable>)}</View>
    <TextInput value={note} onChangeText={setNote} multiline maxLength={2000} placeholder={locale === "sw" ? "Eleza unachohitaji kwa usalama. Usitumie hapa maelezo ya siri ya mnufaika yasiyohitajika." : "Describe what you need safely. Do not include unnecessary sensitive beneficiary details."} placeholderTextColor={colors.inkMuted} style={styles.input} />
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <Button label={saving ? (locale === "sw" ? "Inatuma..." : "Sending...") : (locale === "sw" ? "Tuma kwa LSF" : "Send to LSF")} loading={saving} disabled={saving || note.trim().length < 5} onPress={() => void submit()} />
    <SectionHeading title={locale === "sw" ? "Maombi yangu" : "My requests"} />
    {requests?.length ? requests.map((item) => <Surface key={item._id}><View style={styles.row}><Text style={styles.requestType}>{kinds.find(([value]) => value === item.type)?.[locale === "sw" ? 1 : 2] ?? item.type}</Text><Text style={styles.status}>{item.status.replaceAll("_", " ")}</Text></View><Text style={styles.requestNote}>{item.note}</Text><Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString(locale === "sw" ? "sw-TZ" : "en-TZ")}</Text><Button label={locale === "sw" ? "Angalia hali na jibu" : "View status and response"} variant="secondary" onPress={() => router.push({ pathname: "/paralegal-support-request/[id]", params: { id: item._id } })} /></Surface>) : <Text style={styles.empty}>{locale === "sw" ? "Bado hujatuma ombi la msaada." : "You have not sent a support request yet."}</Text>}
  </Screen>;
}

const styles = StyleSheet.create({ header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md }, headerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 }, hero: { marginTop: spacing.xl, backgroundColor: colors.ink, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontWeight: "700", fontSize: 26 }, heroBody: { color: "#D8D2D5", fontFamily: type.regular, fontSize: 13, lineHeight: 20 }, choices: { gap: spacing.sm }, choice: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface }, choiceActive: { borderColor: colors.burgundy, backgroundColor: colors.softPink }, choiceText: { color: colors.inkMuted, fontFamily: type.medium, fontWeight: "500", fontSize: 13 }, choiceTextActive: { color: colors.burgundy }, input: { minHeight: 120, marginVertical: spacing.md, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, color: colors.ink, fontFamily: type.regular, textAlignVertical: "top" }, error: { color: colors.danger, fontFamily: type.regular, fontSize: 13, marginBottom: spacing.md }, row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md }, requestType: { flex: 1, color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 14 }, status: { color: colors.burgundy, fontFamily: type.medium, fontWeight: "500", fontSize: 12, textTransform: "capitalize" }, requestNote: { marginTop: spacing.sm, color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, date: { marginTop: spacing.md, color: colors.inkMuted, fontFamily: type.regular, fontSize: 12 }, empty: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 20 },
});
