import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../src/auth";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const states = [
  { key: "accepting_cases", sw: "Ninapokea kesi", en: "Accepting cases", icon: "checkmark-circle-outline" },
  { key: "limited", sw: "Nina nafasi chache", en: "Limited capacity", icon: "time-outline" },
  { key: "paused", sw: "Nimesitisha kwa muda", en: "Paused", icon: "pause-circle-outline" },
  { key: "unavailable", sw: "Sipo", en: "Unavailable", icon: "close-circle-outline" },
] as const;
type Availability = (typeof states)[number]["key"];

export default function ParalegalAvailabilityScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const approved = access?.roles.some((role) => ["paralegal", "provider_staff"].includes(role)) ?? false;
  const application = useQuery(api.paralegals.getMyApplication, approved ? {} : "skip");
  const updateProfile = useMutation(api.paralegals.updateParalegalProfile);
  const [status, setStatus] = useState<Availability>("accepting_cases");
  const [hours, setHours] = useState("");
  const [capacity, setCapacity] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!application) return;
    setStatus(application.availabilityStatus ?? "accepting_cases");
    setHours(application.workingHours ?? "");
    setCapacity(application.weeklyCapacity === undefined ? "" : String(application.weeklyCapacity));
    setNotes(application.availabilityNotes ?? "");
  }, [application?._id]);

  async function save() {
    if (!application) return;
    const parsedCapacity = capacity.trim() ? Number(capacity) : undefined;
    if (parsedCapacity !== undefined && (!Number.isInteger(parsedCapacity) || parsedCapacity < 0 || parsedCapacity > 50)) {
      setMessage(sw ? "Weka idadi ya kesi kati ya 0 na 50." : "Enter a weekly capacity from 0 to 50.");
      return;
    }
    setSaving(true); setMessage("");
    try {
      await updateProfile({ id: application._id, availabilityStatus: status, workingHours: hours.trim(), weeklyCapacity: parsedCapacity, availabilityNotes: notes.trim() });
      setMessage(sw ? "Upatikanaji umehifadhiwa." : "Availability saved.");
    } catch (error) { setMessage(error instanceof Error ? error.message : (sw ? "Haikuhifadhiwa." : "Could not save.")); }
    finally { setSaving(false); }
  }

  const header = <AppHeader back title={sw ? "Upatikanaji wangu" : "My availability"} eyebrow="HAKI YANGU · PARALEGAL" />;
  if (!isSignedIn) return <Screen>{header}<View style={styles.hero}><Ionicons name="calendar-outline" size={31} color={colors.peach} /><Text style={styles.heroTitle}>{sw ? "Panga muda wa kusaidia watu." : "Set time aside to help people."}</Text><Text style={styles.heroBody}>{sw ? "Onyesha kama unapokea kesi mpya na saa zako za kazi." : "Show whether you can accept new cases and your working hours."}</Text></View><AccessCard sw={sw} signedOut /></Screen>;
  if (access === undefined) return <Screen>{header}<Text style={styles.muted}>{sw ? "Tunapakia ruhusa..." : "Loading access..."}</Text></Screen>;
  if (!approved) return <Screen>{header}<AccessCard sw={sw} /></Screen>;
  if (application === undefined) return <Screen>{header}<Text style={styles.muted}>{sw ? "Tunapakia wasifu..." : "Loading profile..."}</Text></Screen>;
  if (!application) return <Screen>{header}<View style={styles.empty}><Text style={styles.heading}>{sw ? "Hakuna ombi lililounganishwa" : "No linked application"}</Text><Text style={styles.muted}>{sw ? "Wasiliana na LSF kuhusu wasifu wako wa paralegal." : "Contact LSF about your paralegal profile."}</Text></View></Screen>;

  return <Screen>{header}
    <View style={styles.hero}><Ionicons name="calendar-outline" size={31} color={colors.peach} /><Text style={styles.heroTitle}>{sw ? "Upatikanaji unaoaminika." : "Availability people can rely on."}</Text><Text style={styles.heroBody}>{sw ? "Sasisha hali yako ili timu isitoe kazi wakati haupo." : "Keep this current so the team does not offer work when you are away."}</Text></View>
    <Text style={styles.heading}>{sw ? "Hali yangu sasa" : "My current status"}</Text>
    <View style={styles.options}>{states.map((item) => <Pressable key={item.key} accessibilityRole="radio" accessibilityState={{ selected: status === item.key }} onPress={() => setStatus(item.key)} style={[styles.option, status === item.key && styles.selected]}><Ionicons name={item.icon} size={23} color={status === item.key ? colors.burgundy : colors.inkMuted} /><Text style={[styles.optionText, status === item.key && styles.selectedText]}>{sw ? item.sw : item.en}</Text><Ionicons name={status === item.key ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /></Pressable>)}</View>
    <Text style={styles.heading}>{sw ? "Muda na uwezo" : "Hours and capacity"}</Text>
    <View style={styles.form}><Field label={sw ? "Saa za kazi" : "Working hours"} value={hours} onChangeText={setHours} placeholder={sw ? "Mfano: Jumatatu–Ijumaa 08:00–17:00" : "Example: Monday–Friday 08:00–17:00"} /><Field label={sw ? "Kesi mpya kwa wiki" : "New cases per week"} value={capacity} onChangeText={setCapacity} placeholder="0–50" keyboardType="number-pad" /><Field label={sw ? "Maelezo ya upatikanaji" : "Availability note"} value={notes} onChangeText={setNotes} placeholder={sw ? "Kwa mfano: nipo kwa simu asubuhi" : "For example: available by phone in mornings"} multiline /></View>
    {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
    <Button label={saving ? (sw ? "Inahifadhi..." : "Saving...") : (sw ? "Hifadhi upatikanaji" : "Save availability")} disabled={saving} loading={saving} onPress={() => void save()} />
  </Screen>;
}

function Field({ label, value, onChangeText, placeholder, multiline, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; multiline?: boolean; keyboardType?: "number-pad" }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.inkMuted} multiline={multiline} keyboardType={keyboardType} maxLength={multiline ? 300 : 100} style={[styles.input, multiline && styles.multiline]} /></View>;
}

function AccessCard({ sw, signedOut = false }: { sw: boolean; signedOut?: boolean }) {
  return <View style={styles.empty}><Ionicons name="lock-closed-outline" size={34} color={colors.burgundy} /><Text style={styles.heading}>{signedOut ? (sw ? "Ingia kuona upatikanaji wako" : "Sign in to manage availability") : (sw ? "Idhini ya paralegal inahitajika" : "Paralegal approval required")}</Text><Text style={styles.muted}>{signedOut ? (sw ? "Wasifu wako unahitaji akaunti salama." : "Your work profile needs a secure account.") : (sw ? "LSF lazima iidhinishe jukumu lako kwanza." : "LSF must approve your role first.")}</Text><Button label={signedOut ? (sw ? "Ingia salama" : "Sign in securely") : (sw ? "Angalia kujiunga" : "View onboarding")} onPress={() => router.push(signedOut ? "/sign-in" : "/paralegal-onboarding")} /></View>;
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, backgroundColor: colors.ink, padding: spacing.xl, gap: spacing.sm }, heroTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 25, lineHeight: 31 }, heroBody: { fontFamily: type.regular, color: "#E5DDE1", fontSize: 13, lineHeight: 20 },
  heading: { marginTop: spacing.lg, marginBottom: spacing.sm, fontFamily: type.bold, color: colors.ink, fontSize: 19 }, options: { gap: spacing.sm }, option: { minHeight: 62, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md }, selected: { borderColor: colors.burgundy, backgroundColor: colors.softPink }, optionText: { flex: 1, fontFamily: type.medium, color: colors.ink, fontSize: 14 }, selectedText: { fontFamily: type.bold, color: colors.burgundy },
  form: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.lg, marginBottom: spacing.md }, field: { gap: spacing.xs }, label: { fontFamily: type.bold, color: colors.ink, fontSize: 13 }, input: { minHeight: 49, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: spacing.md, color: colors.ink, fontFamily: type.regular, fontSize: 14 }, multiline: { minHeight: 90, paddingTop: spacing.md, textAlignVertical: "top" }, message: { marginBottom: spacing.md, fontFamily: type.medium, color: colors.burgundy, fontSize: 13 }, muted: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20, textAlign: "center" }, empty: { marginTop: spacing.lg, alignItems: "center", gap: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.xl },
});
