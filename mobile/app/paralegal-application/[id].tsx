import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

export default function ParalegalApplicationReviewScreen() {
  useSensitiveScreenProtection("paralegal-application-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const canReview = access?.roles.some((role) => ["admin", "staff"].includes(role)) ?? false;
  const isAdmin = access?.roles.includes("admin") ?? false;
  const application = useQuery(api.formSubmissions.paralegalApplicationForReview, canReview && id ? { id: id as Id<"paralegal_applications"> } : "skip");
  const review = useMutation(api.formSubmissions.reviewParalegalApplication);
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const ownApplication = Boolean(application && access?.user.email?.toLowerCase() === application.email.toLowerCase());

  async function save(status: "under_review" | "approved" | "rejected") {
    if (!application || saving || ownApplication) return;
    setSaving(true); setError("");
    try {
      await review({ id: application._id, status, reviewNotes: note.trim() || undefined });
      setDecision(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : sw ? "Uamuzi haujahifadhiwa. Jaribu tena." : "Decision was not saved. Please try again.");
    } finally { setSaving(false); }
  }

  async function openFile(url: string) {
    try { await Linking.openURL(url); }
    catch { setError(sw ? "Nyaraka haikufunguka. Jaribu tena." : "The document could not be opened. Please try again."); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Kagua paralegal" : "Review paralegal"} eyebrow="LSF · APPROVALS" />
    {!isSignedIn ? <State icon="lock-closed-outline" title={sw ? "Maombi ni ya siri" : "Applications are private"} body={sw ? "Ingia kwa akaunti ya LSF." : "Sign in with an LSF account."} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : access === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia ruhusa" : "Loading access"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !canReview ? <State icon="shield-outline" title={sw ? "Ufikiaji haujaruhusiwa" : "Access not authorised"} body={sw ? "Jukumu la LSF linahitajika kuona maombi haya." : "An LSF review role is required to view applications."} />
      : application === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia ombi" : "Loading application"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !application ? <State icon="search-outline" title={sw ? "Ombi halipatikani" : "Application not found"} body={sw ? "Huenda limeondolewa au huna ruhusa ya kuliona." : "It may have been removed, or you may not have access to it."} action={sw ? "Rudi kwenye utawala" : "Back to governance"} onPress={() => router.replace("/governance")} />
      : <>
        <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="ribbon-outline" size={32} color={colors.surface} /></View><Text style={styles.heroKicker}>{sw ? "UTHIBITISHO WA PARALEGAL" : "PARALEGAL VERIFICATION"}</Text><Text style={styles.heroTitle}>{application.fullName}</Text><Text style={styles.heroBody}>{sw ? "Kagua utambulisho, uzoefu na cheti kabla ya idhini." : "Review identity, experience and credentials before approval."}</Text></View>
        <View style={styles.status}><Ionicons name={application.status === "approved" ? "checkmark-circle" : "time-outline"} size={23} color={colors.burgundy} /><Text style={styles.statusText}>{application.status.replaceAll("_", " ")}</Text></View>
        <Text style={styles.sectionTitle}>{sw ? "Wasifu wa mwombaji" : "Applicant profile"}</Text><View style={styles.card}><Info label={sw ? "Barua pepe" : "Email"} value={application.email} /><Info label={sw ? "Simu" : "Phone"} value={application.phone} /><Info label={sw ? "Eneo" : "Location"} value={[application.ward, application.district, application.region].filter(Boolean).join(", ")} /><Info label={sw ? "Elimu" : "Education"} value={application.education} /><Info label={sw ? "Uzoefu" : "Experience"} value={application.experience} /><Info label={sw ? "Kwa nini anajiunga" : "Motivation"} value={application.motivation} />{application.languages?.length ? <Info label={sw ? "Lugha" : "Languages"} value={application.languages.join(", ")} /> : null}</View>
        <Text style={styles.sectionTitle}>{sw ? "Nyaraka za uthibitisho" : "Verification documents"}</Text><View style={styles.documents}><Document label={sw ? "Kitambulisho" : "Identity document"} url={application.identityDocumentUrl} onOpen={openFile} sw={sw} /><Document label={sw ? "Cheti cha paralegal" : "Paralegal certificate"} url={application.certificateDocumentUrl} onOpen={openFile} sw={sw} /><Document label={sw ? "Wasifu / CV" : "Resume / CV"} url={application.resumeDocumentUrl} onOpen={openFile} sw={sw} /></View>
        {ownApplication ? <View style={styles.notice}><Ionicons name="shield-outline" size={22} color={colors.burgundy} /><Text style={styles.body}>{sw ? "Huwezi kufanya uamuzi wa ombi lako mwenyewe." : "You cannot make a decision on your own application."}</Text></View> : ["approved", "rejected"].includes(application.status) ? <View style={styles.notice}><Ionicons name="checkmark-circle-outline" size={22} color={colors.burgundy} /><Text style={styles.body}>{sw ? "Uamuzi wa mwisho umerekodiwa. Mabadiliko yanahitaji utaratibu wa usimamizi." : "A final decision is recorded. Changes require a separate supervised process."}</Text></View> : <>
          <Text style={styles.sectionTitle}>{sw ? "Hatua ya ukaguzi" : "Review decision"}</Text><Text style={styles.body}>{sw ? "Anza ukaguzi kwanza; idhini ya mwisho inahitaji msimamizi na nyaraka zinazotakiwa." : "Start review first; final approval requires an administrator and the required documents."}</Text>
          {application.intakeOrigin ? <View style={styles.notice}><Ionicons name="mail-outline" size={22} color={colors.burgundy} /><Text style={styles.body}>{sw ? "Mwombaji lazima akamilishe mwaliko na kupakia nyaraka kabla ya ukaguzi." : "The applicant must complete the invitation and upload evidence before review can begin."}</Text></View> : application.status === "pending" ? <Button label={sw ? "Anza ukaguzi" : "Start review"} loading={saving} disabled={saving} onPress={() => void save("under_review")} /> : <>
            <TextInput value={note} onChangeText={setNote} multiline maxLength={1000} placeholder={sw ? "Sababu ya uamuzi na matokeo ya ukaguzi..." : "Decision reason and review findings..."} placeholderTextColor={colors.inkMuted} style={styles.input} />
            <View style={styles.choices}>{isAdmin ? <Choice label={sw ? "Idhinisha" : "Approve"} icon="checkmark-circle-outline" selected={decision === "approved"} onPress={() => setDecision("approved")} /> : null}<Choice label={sw ? "Kataa" : "Reject"} icon="close-circle-outline" selected={decision === "rejected"} onPress={() => setDecision("rejected")} /></View>
            {decision ? <View style={styles.confirm}><Text style={styles.confirmTitle}>{decision === "approved" ? (sw ? "Thibitisha idhini" : "Confirm approval") : (sw ? "Thibitisha kukataa" : "Confirm rejection")}</Text><Text style={styles.body}>{decision === "approved" ? (sw ? "Jukumu la paralegal linaweza kuanza kutumika baada ya hatua hii." : "The paralegal role may become active after this step.") : (sw ? "Ombi litafungwa na sababu itawekwa kwenye rekodi." : "The application will close and the reason will be recorded.")}</Text><Button label={decision === "approved" ? (sw ? "Idhinisha paralegal" : "Approve paralegal") : (sw ? "Kataa maombi" : "Reject application")} loading={saving} disabled={saving || note.trim().length < 10 || (decision === "approved" && (!application.identityDocumentUrl || !application.certificateStorageId))} onPress={() => void save(decision)} /></View> : null}
          </>}
        </>}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <Button label={sw ? "Rudi kwenye foleni" : "Back to queue"} variant="quiet" onPress={() => router.push("/paralegal-review-queue")} />
      </>}
  </Screen>;
}

function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>; }
function Document({ label, url, onOpen, sw }: { label: string; url?: string | null; onOpen: (url: string) => void; sw: boolean }) { return <View style={styles.document}><Ionicons name="document-text-outline" size={22} color={colors.burgundy} /><View style={styles.flex}><Text style={styles.value}>{label}</Text><Text style={styles.label}>{url ? (sw ? "Inapatikana kwa ukaguzi" : "Available for review") : (sw ? "Haipo" : "Missing")}</Text></View>{url ? <Pressable accessibilityRole="button" accessibilityLabel={`${sw ? "Fungua" : "Open"} ${label}`} onPress={() => onOpen(url)}><Ionicons name="open-outline" size={22} color={colors.burgundy} /></Pressable> : null}</View>; }
function Choice({ label, icon, selected, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; selected: boolean; onPress: () => void }) { return <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} aria-checked={selected} onPress={onPress} style={[styles.choice, selected && styles.choiceActive]}><Ionicons name={icon} size={21} color={colors.burgundy} /><Text style={styles.choiceText}>{label}</Text></Pressable>; }
function State({ icon, title, body, action, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onPress?: () => void }) { return <View style={styles.state}><Ionicons name={icon} size={35} color={colors.burgundy} /><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.body}>{body}</Text>{action && onPress ? <Button label={action} onPress={onPress} /> : null}</View>; }

const styles = StyleSheet.create({
  hero: { marginTop: spacing.md, backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }, heroKicker: { marginTop: spacing.md, fontFamily: type.bold, color: colors.peach, fontSize: 12 }, heroTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 25 }, heroBody: { fontFamily: type.regular, color: colors.surface, fontSize: 14, lineHeight: 21 }, status: { marginTop: spacing.lg, flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.burgundySoft, borderRadius: radius.md, padding: spacing.md }, statusText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 14, textTransform: "capitalize" }, sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md, fontFamily: type.bold, color: colors.ink, fontSize: 19 }, card: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.lg }, info: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line }, label: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 }, value: { marginTop: spacing.xs, fontFamily: type.bold, color: colors.ink, fontSize: 15, lineHeight: 21 }, documents: { gap: spacing.sm }, document: { minHeight: 70, flexDirection: "row", alignItems: "center", gap: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md }, flex: { flex: 1 }, notice: { marginTop: spacing.xl, flexDirection: "row", gap: spacing.md, borderRadius: radius.md, backgroundColor: colors.burgundySoft, padding: spacing.lg }, body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 }, input: { minHeight: 110, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, color: colors.ink, fontFamily: type.regular, textAlignVertical: "top" }, choices: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md }, choice: { flex: 1, minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }, choiceActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, choiceText: { fontFamily: type.bold, color: colors.ink }, confirm: { marginTop: spacing.lg, marginBottom: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.burgundySoft, padding: spacing.lg, gap: spacing.md }, confirmTitle: { fontFamily: type.bold, color: colors.burgundy, fontSize: 18 }, error: { marginVertical: spacing.md, fontFamily: type.medium, color: colors.danger }, state: { marginTop: spacing.xl, padding: spacing.xl, alignItems: "center", gap: spacing.md, backgroundColor: colors.burgundySoft, borderRadius: radius.lg },
});
