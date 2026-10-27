import { BrandLoading } from '../src/components/BrandLoading';
import { plainError } from "../../shared/plainLanguage";
import { CivicPageHeader as AppHeader } from "../src/components/CivicPageHeader";
import { ParalegalIntro } from "../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../src/components/ParalegalNavigation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function ParalegalOnboardingScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const application = useQuery(api.paralegals.getMyApplication, isSignedIn ? {} : "skip");
  const training = useQuery(api.paralegalTraining.readiness, application?.status === "approved" ? {} : "skip");
  const updateProfile = useMutation(api.paralegals.updateParalegalProfile);
  const completeReadiness = useMutation(api.paralegals.completeMyOnboarding);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState<"accepting_cases" | "limited" | "paused" | "unavailable">("accepting_cases");
  const [workingHours, setWorkingHours] = useState("");
  const [bio, setBio] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [ethicsAccepted, setEthicsAccepted] = useState(false);
  const [conductAccepted, setConductAccepted] = useState(false);
  const [safeguardingCompleted, setSafeguardingCompleted] = useState(false);
  useEffect(() => { if (application) { setAvailability(application.availabilityStatus ?? "accepting_cases"); setWorkingHours(application.workingHours ?? ""); setBio(application.bio ?? ""); setSpecializations(application.specializations?.join(", ") ?? ""); } }, [application?._id]);
  if (!isSignedIn) return <Screen footer={application?.status === "approved" ? <ParalegalNavigation current="profile" /> : undefined}>
    <AppHeader compact back title={locale === "sw" ? "Hatua za kuanza kazi" : "Steps to start work"} />
    <ParalegalIntro pose="welcome" title={locale === "sw" ? "Jiandae kupokea kesi." : "Prepare to take cases."} body={locale === "sw" ? "Unaweza kuona hatua hizi bila kuingia. Ingia kutuma ombi na kuona taarifa za kazi." : "View the steps without signing in. Sign in to apply and see your work records."} />
    <Step label={locale === "sw" ? "1. Tuma ombi" : "1. Apply"} detail={locale === "sw" ? "Toa taarifa za utambulisho, mafunzo na taasisi." : "Provide identity, training and organisation details."} done={false} />
    <Step label={locale === "sw" ? "2. Ukaguzi wa LSF" : "2. LSF review"} detail={locale === "sw" ? "LSF hukagua nyaraka na uhusiano wa taasisi." : "LSF reviews documents and organisation affiliation."} done={false} />
    <Step label={locale === "sw" ? "3. Maadili na maandalizi" : "3. Ethics and readiness"} detail={locale === "sw" ? "Kagua usiri, ulinzi, wasifu na upatikanaji." : "Review confidentiality, safeguarding, profile and availability."} done={false} />
    <Step label={locale === "sw" ? "4. Pokea kazi" : "4. Take assignments"} detail={locale === "sw" ? "Baada ya idhini, pokea kazi na fanya ufuatiliaji." : "After approval, receive work and follow up."} done={false} />
    <Button label={locale === "sw" ? "Angalia njia za kujiunga" : "See how to join"} onPress={() => router.push("/join")} />
    <Button label={locale === "sw" ? "Ingia" : "Sign in"} variant="secondary" onPress={() => router.push("/sign-in")} />
  </Screen>;
  if (application === undefined) return <Screen><BrandLoading compact text={locale === "sw" ? "Tunapakia wasifu..." : "Loading your profile..."}/></Screen>;
  if (!application) return <Screen footer={<ParalegalNavigation current="profile" />}><AppHeader compact back title={locale === "sw" ? "Kuanza kazi" : "Work setup"} /><ParalegalIntro pose="safety" title={locale === "sw" ? "Unganisha wasifu wako wa kazi." : "Link your work profile."} body={locale === "sw" ? "LSF inahitaji ombi na nyaraka zako kabla hujapokea kesi." : "LSF needs your application and documents before you can accept cases."} /><Text style={styles.title}>{locale === "sw" ? "Hakuna ombi la msaidizi wa kisheria" : "No paralegal application"}</Text><Text style={styles.body}>{locale === "sw" ? "Tafadhali tumia mwaliko au wasiliana na LSF kuanza mchakato." : "Use an invitation or contact LSF to start the application process."}</Text><Button label={locale === "sw" ? "Angalia njia za kujiunga" : "See how to join"} onPress={() => router.push("/join")} /></Screen>;

  async function completeOnboarding() {
    setSaving(true); setError("");
    try {
      await completeReadiness({ id: application!._id, ethicsAccepted, codeOfConductAccepted: conductAccepted, safeguardingTrainingCompleted: safeguardingCompleted });
    } catch (caught) { setError(plainError(caught, locale, (locale === "sw" ? "Haikuweza kuhifadhi." : "Could not save readiness."))); }
    finally { setSaving(false); }
  }

  async function saveAvailability() {
    setSaving(true); setError("");
    try { await updateProfile({ id: application!._id, availabilityStatus: availability, workingHours: workingHours.trim() || undefined, bio: bio.trim() || undefined, specializations: specializations.split(",").map((value) => value.trim()).filter(Boolean).slice(0, 12) }); }
    catch (caught) { setError(plainError(caught, locale, (locale === "sw" ? "Haikuweza kuhifadhi upatikanaji." : "Could not save availability."))); }
    finally { setSaving(false); }
  }

  const approved = application.status === "approved";
  return <Screen footer={application?.status === "approved" ? <ParalegalNavigation current="profile" /> : undefined}>
    <AppHeader compact back title={locale === "sw" ? "Kuanza kazi" : "Get started"} />
    <ParalegalIntro pose="welcome" title={locale === "sw" ? `Karibu, ${application.fullName}` : `Welcome, ${application.fullName}`} body={locale === "sw" ? "Kamilisha hatua hizi kabla ya kupokea kesi." : "Complete these steps before taking cases."} />
    <Step label={locale === "sw" ? "Utambulisho na ombi" : "Identity and application"} done={approved} detail={approved ? (locale === "sw" ? "Limeidhinishwa na LSF" : "Approved by LSF") : (locale === "sw" ? `Hali: ${application.status}` : `Status: ${application.status}`)} />
    <Step label={locale === "sw" ? "Wasifu wa umma" : "Public profile"} done={Boolean(application.bio && application.specializations?.length)} detail={locale === "sw" ? "Utaalamu, eneo na lugha" : "Specialties, location and languages"} />
    <Step label={locale === "sw" ? "Maadili na ulinzi" : "Ethics and safeguarding"} done={Boolean(application.ethicsAcceptedAt && application.codeOfConductAcceptedAt && application.safeguardingTrainingCompletedAt)} detail={locale === "sw" ? "Usiri, maadili na ulinzi wa mtu" : "Confidentiality, conduct and safeguarding"} />
    {approved ? <Step label={locale === "sw" ? "Mafunzo ya LSF" : "LSF training"} done={Boolean(training?.requiredCount && training.completedCount === training.requiredCount)} detail={training ? `${training.completedCount}/${training.requiredCount} ${locale === "sw" ? "masomo ya lazima uliyopitia" : "required lessons reviewed"}` : (locale === "sw" ? "Inapakia mafunzo..." : "Loading training...")} /> : null}
    {approved ? <Button label={locale === "sw" ? "Fungua mafunzo" : "Open training"} variant="secondary" onPress={() => router.push("/paralegal-learning")} /> : null}
    <Step label={locale === "sw" ? "Upatikanaji wa kazi" : "Work availability"} done={Boolean(application.availabilityStatus && application.workingHours)} detail={`${application.availabilityStatus ?? "—"} · ${application.workingHours ?? (locale === "sw" ? "Haijawekwa" : "Not set")}`} />
    {approved ? <View style={styles.editor}><Text style={styles.editorTitle}>{locale === "sw" ? "Wasifu unaoonekana kwa wanaohitaji msaada" : "Public profile shown to people seeking help"}</Text><TextInput value={bio} onChangeText={setBio} maxLength={600} multiline placeholder={locale === "sw" ? "Eleza kwa ufupi uzoefu na aina ya msaada unaotoa..." : "Briefly describe your experience and the support you provide..."} placeholderTextColor={colors.inkMuted} style={[styles.input, styles.multiline]} /><TextInput value={specializations} onChangeText={setSpecializations} placeholder={locale === "sw" ? "Utaalamu, umetenganishwa kwa koma" : "Specialties, separated by commas"} placeholderTextColor={colors.inkMuted} style={styles.input} /><Text style={styles.editorTitle}>{locale === "sw" ? "Upatikanaji wa kazi" : "Work availability"}</Text><View style={styles.options}>{(["accepting_cases", "limited", "paused", "unavailable"] as const).map((option) => <Pressable key={option} onPress={() => setAvailability(option)} style={[styles.option, availability === option && styles.optionSelected]}><Text style={[styles.optionText, availability === option && styles.optionTextSelected]}>{option.replaceAll("_", " ")}</Text></Pressable>)}</View><TextInput value={workingHours} onChangeText={setWorkingHours} placeholder={locale === "sw" ? "Mfano: Jumatatu–Ijumaa 08:00–17:00" : "Example: Monday–Friday 08:00–17:00"} placeholderTextColor={colors.inkMuted} style={styles.input} /><Button label={saving ? (locale === "sw" ? "Inahifadhi..." : "Saving...") : (locale === "sw" ? "Hifadhi wasifu" : "Save profile")} variant="secondary" loading={saving} disabled={saving} onPress={() => void saveAvailability()} /></View> : null}
    {approved && !application.onboardingCompleted ? <View style={styles.declarations}><Text style={styles.editorTitle}>{locale === "sw" ? "Mafunzo na maadili" : "Training and standards"}</Text><Declaration checked={ethicsAccepted} onPress={() => setEthicsAccepted((value) => !value)} label={locale === "sw" ? "Nimepitia kanuni za usiri na maadili ya msaidizi wa kisheria." : "I reviewed the paralegal confidentiality and ethics rules."} /><Declaration checked={conductAccepted} onPress={() => setConductAccepted((value) => !value)} label={locale === "sw" ? "Nakubali kanuni za mwenendo na mipaka ya jukumu langu." : "I accept the code of conduct and the limits of my role."} /><Declaration checked={safeguardingCompleted} onPress={() => setSafeguardingCompleted((value) => !value)} label={locale === "sw" ? "Nimekamilisha utangulizi wa ulinzi na namna ya kuripoti hatari." : "I completed safeguarding and risk-escalation orientation."} /></View> : null}
    {error ? <Text style={styles.error}>{error}</Text> : null}
    {approved && !application.onboardingCompleted ? <Button label={saving ? (locale === "sw" ? "Inahifadhi..." : "Saving...") : (locale === "sw" ? "Thibitisha nimejiandaa" : "Confirm I am ready")} loading={saving} disabled={saving || !ethicsAccepted || !conductAccepted || !safeguardingCompleted || !training?.requiredCount || training.completedCount !== training.requiredCount} onPress={() => void completeOnboarding()} /> : null}
    {approved && application.onboardingCompleted ? <View style={styles.ready}><Ionicons name="checkmark-circle" size={24} color={colors.teal} /><Text style={styles.readyText}>{locale === "sw" ? "Uko tayari. Kesi utakazopewa zitaonekana kwenye sehemu yako ya kazi." : "You are ready. New assignments will appear in your work area."}</Text></View> : null}
  </Screen>;
}

function Step({ label, detail, done }: { label: string; detail: string; done: boolean }) { return <View style={styles.step}><Ionicons name={done ? "checkmark-circle" : "ellipse-outline"} size={23} color={done ? colors.teal : colors.burgundy} /><View style={styles.stepCopy}><Text style={styles.stepLabel}>{label}</Text><Text style={styles.stepDetail}>{detail}</Text></View></View>; }
function Declaration({ checked, label, onPress }: { checked: boolean; label: string; onPress: () => void }) { return <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={onPress} style={styles.declaration}><Ionicons name={checked ? "checkbox" : "square-outline"} size={22} color={checked ? colors.teal : colors.burgundy} /><Text style={styles.declarationText}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({ header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md, marginBottom: spacing.xl }, headerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 }, hero: { borderRadius: radius.xl, backgroundColor: colors.burgundy, padding: spacing.xl, gap: spacing.sm, marginBottom: spacing.xl }, kicker: { fontFamily: type.bold, fontWeight: "700", color: colors.peach, fontSize: 12, letterSpacing: 1 }, title: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 27, lineHeight: 33 }, body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 }, step: { flexDirection: "row", gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, marginBottom: spacing.md }, stepCopy: { flex: 1, gap: spacing.xs }, stepLabel: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 15 }, stepDetail: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13 }, editor: { marginVertical: spacing.md, gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }, editorTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 15 }, declarations: { marginVertical: spacing.md, gap: spacing.sm, padding: spacing.lg, borderRadius: radius.md, backgroundColor: "#FFF7FA", borderWidth: 1, borderColor: "#F3D8E4" }, declaration: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingVertical: spacing.sm }, declarationText: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 15, lineHeight: 23 }, options: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, option: { borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }, optionSelected: { backgroundColor: colors.softPink, borderColor: colors.burgundy }, optionText: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 12, textTransform: "capitalize" }, optionTextSelected: { color: colors.burgundy }, input: { minHeight: 50, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.md, color: colors.charcoal, fontFamily: type.regular }, multiline: { minHeight: 100, paddingTop: spacing.md, textAlignVertical: "top" }, error: { color: colors.danger, fontFamily: type.regular, marginBottom: spacing.md }, ready: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.tealSoft, borderRadius: radius.md }, readyText: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.ink, fontSize: 13, lineHeight: 18 },
});
