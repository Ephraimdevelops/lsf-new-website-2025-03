import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useMutation, useQuery } from "convex/react";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useUser } from "../src/auth";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useAccountSync } from "../src/useStoreUserEffect";
import type { Id } from "../../convex/_generated/dataModel";

import { ProviderInviteInbox } from "../src/components/ProviderInvitations";

type Path = "beneficiary" | "paralegal" | "organisation" | "stakeholder";
type ProfessionalRole = "staff" | "content_editor" | "provider_staff" | "stakeholder" | "donor";

export default function JoinScreen() {
  const { locale } = useLanguage();
  const { user, isLoaded: userLoaded } = useUser();
  const { status: accountStatus, ready: accountReady, retry: retryAccountSync } = useAccountSync();
  const access = useQuery(api.users.currentAccess, user && accountReady ? {} : "skip");
  const paralegalApplication = useQuery(api.paralegals.getMyApplication, user && accountReady ? {} : "skip");
  const apply = useMutation(api.formSubmissions.submitParalegalApplication);
  const generateDocumentUploadUrl = useMutation(api.formSubmissions.generateParalegalDocumentUploadUrl);
  const requestAccess = useMutation(api.accessRequests.request);
  const updateProfile = useMutation(api.users.updateProfile);
  const myRequests = useQuery(api.accessRequests.myRequests, access ? {} : "skip");
  const [path, setPath] = useState<Path>("beneficiary");
  const [professionalRole, setProfessionalRole] = useState<ProfessionalRole>("provider_staff");
  const [organizationName, setOrganizationName] = useState("");
  const [statement, setStatement] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [motivation, setMotivation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [identityDocument, setIdentityDocument] = useState<{ id: Id<"_storage">; name: string } | null>(null);
  const [certificateDocument, setCertificateDocument] = useState<{ id: Id<"_storage">; name: string } | null>(null);
  const [resumeDocument, setResumeDocument] = useState<{ id: Id<"_storage">; name: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [accountName, setAccountName] = useState("");
  const sw = locale === "sw";
  const hasParalegalRole = access?.roles.includes("paralegal") ?? false;
  const needsName = access && ["user", "haki yangu user"].includes(access.user.name.trim().toLowerCase());

  async function saveAccountName() {
    if (accountName.trim().length < 2) {
      Alert.alert(sw ? "Weka jina" : "Enter your name", sw ? "Weka jina lenye angalau herufi mbili." : "Enter at least two characters.");
      return;
    }
    setSubmitting(true);
    try { await updateProfile({ name: accountName.trim() }); }
    catch (error) { Alert.alert(sw ? "Jina halikuhifadhiwa" : "Name not saved", error instanceof Error ? error.message : String(error)); }
    finally { setSubmitting(false); }
  }

  async function pickAndUpload(kind: "identity" | "certificate" | "resume") {
    const picked = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/jpeg", "image/png"], copyToCacheDirectory: true });
    if (picked.canceled) return;
    const asset = picked.assets[0];
    if (asset.size && asset.size > 10 * 1024 * 1024) { Alert.alert(sw ? "Faili ni kubwa" : "File too large", "Maximum 10MB"); return; }
    setSubmitting(true);
    try {
      const postUrl = await generateDocumentUploadUrl({});
      const blob = await (await fetch(asset.uri)).blob();
      const response = await fetch(postUrl, { method: "POST", headers: { "Content-Type": asset.mimeType || "application/octet-stream" }, body: blob });
      if (!response.ok) throw new Error("Upload failed");
      const { storageId } = await response.json();
      const uploaded = { id: storageId as Id<"_storage">, name: asset.name };
      if (kind === "identity") setIdentityDocument(uploaded); else if (kind === "certificate") setCertificateDocument(uploaded); else setResumeDocument(uploaded);
    } catch (error) { Alert.alert(sw ? "Faili haikupakiwa" : "Upload failed", error instanceof Error ? error.message : String(error)); }
    finally { setSubmitting(false); }
  }

  async function submitAccessRequest() {
    if (!access) {
      Alert.alert(sw ? "Subiri kidogo" : "Please wait", sw ? "Akaunti yako inaunganishwa." : "Your account is being connected.");
      return;
    }
    setSubmitting(true);
    try {
      await requestAccess({ requestedRole: professionalRole, organizationName, statement });
      setSubmitted(true);
    } catch (error) {
      Alert.alert(sw ? "Ombi halikutumwa" : "Request not sent", error instanceof Error ? error.message : String(error));
    } finally { setSubmitting(false); }
  }

  async function submitApplication() {
    if (!user?.primaryEmailAddress?.emailAddress || !access?.user.name || needsName) {
      Alert.alert(sw ? "Kamilisha wasifu" : "Complete your profile", sw ? "Ongeza jina na barua pepe iliyothibitishwa kwenye akaunti yako." : "Add your name and verified email to your account first.");
      return;
    }
    if ([phone, region, district, education, experience, motivation].some((value) => !value.trim()) || !identityDocument || !certificateDocument) {
      Alert.alert(sw ? "Taarifa hazijakamilika" : "Missing details", sw ? "Jaza sehemu zote za maombi." : "Complete all application fields.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await apply({ fullName: access.user.name, email: user.primaryEmailAddress.emailAddress, phone: phone.trim(), region: region.trim(), district: district.trim(), education: education.trim(), experience: experience.trim(), motivation: motivation.trim(), idDocumentStorageId: identityDocument.id, certificateStorageId: certificateDocument.id, resumeStorageId: resumeDocument?.id });
      if (!result.success) throw new Error(result.message ?? "Application was not accepted.");
      setSubmitted(true);
    } catch (error) {
      Alert.alert(sw ? "Maombi hayakutumwa" : "Application not sent", error instanceof Error ? error.message : String(error));
    } finally { setSubmitting(false); }
  }

  if (!userLoaded) return <Screen><Text style={styles.copy}>{sw ? "Akaunti inaandaliwa…" : "Preparing your account…"}</Text></Screen>;
  if (!user) return <Redirect href="/sign-in" />;
  if (needsName) return <Screen><AppHeader back title={sw ? "Jina lako" : "Your name"} eyebrow="HAKI YANGU · LSF" /><Surface><Text style={styles.panelTitle}>{sw ? "Tutakuitaje?" : "What should we call you?"}</Text><Text style={styles.copy}>{sw ? "Jina lako litasaidia kwenye wasifu na maombi yako. Unaweza kulibadilisha baadaye." : "Your name will appear on your profile and applications. You can change it later."}</Text><Field label={sw ? "Jina" : "Name"} value={accountName} onChange={setAccountName} /><Button label={sw ? "Endelea" : "Continue"} loading={submitting} disabled={submitting} onPress={() => void saveAccountName()} /></Surface></Screen>;

  return <Screen>
    {access && <ProviderInviteInbox />}
    <AppHeader back title={sw ? "Akaunti yako" : "Your account"} eyebrow="HAKI YANGU · LSF" />
    <View style={styles.hero}><Text style={styles.kicker}>{sw ? "HATUA YA 2 KATI YA 2" : "STEP 2 OF 2"}</Text><Text style={styles.title}>{sw ? "Chagua aina ya akaunti yako" : "Choose your account type"}</Text><Text style={styles.intro}>{sw ? "Tuchague jinsi utakavyotumia Haki Yangu ili tukupe uzoefu unaofaa." : "Tell us how you will use Haki Yangu so we can show what matters to you."}</Text></View>
    {!accountReady && accountStatus !== "error" ? <Surface tone="teal"><Text style={styles.copy}>{sw ? "Tunaunganisha akaunti yako salama…" : "Connecting your secure account…"}</Text></Surface> : null}
    {user && accountStatus === "error" ? <Surface tone="orange"><Text style={styles.copy}>{sw ? "Akaunti yako haijaunganishwa. Angalia mtandao na ujaribu tena, au wasiliana na LSF ikiwa imezuiwa." : "Your account could not be connected. Check your connection and retry, or contact LSF if it was deactivated."}</Text><Button label={sw ? "Jaribu tena" : "Retry connection"} onPress={retryAccountSync} /></Surface> : null}
    <Choice icon="person-outline" selected={path === "beneficiary"} tone="pink" title={sw ? "Mnufaika" : "Beneficiary"} body={sw ? "Pata msaada na ufuatilie kesi yako." : "Get help and follow your case."} onPress={() => setPath("beneficiary")} />
    <Choice icon="people-outline" selected={path === "paralegal"} tone="teal" approvalLabel={sw ? "Inahitaji idhini ya LSF" : "LSF approval required"} title={sw ? "Msaidizi wa sheria" : "Paralegal"} body={sw ? "Simamia maombi na toa msaada kwa wateja." : "Manage requests and help clients."} onPress={() => setPath("paralegal")} />
    <Choice icon="briefcase-outline" selected={path === "organisation"} tone="orange" approvalLabel={sw ? "Inahitaji idhini ya LSF" : "LSF approval required"} title={sw ? "Mfanyakazi wa LSF" : "LSF or provider staff"} body={sw ? "Fanya kazi za taasisi au shirika lako." : "Work with your organisation or LSF."} onPress={() => { setProfessionalRole("provider_staff"); setPath("organisation"); }} />
    <Choice icon="people-outline" selected={path === "stakeholder"} tone="gold" approvalLabel={sw ? "Inahitaji idhini ya LSF" : "LSF approval required"} title={sw ? "Mdau" : "Stakeholder"} body={sw ? "Fuatilia shughuli za Haki Yangu." : "Follow Haki Yangu activities."} onPress={() => { setProfessionalRole("stakeholder"); setPath("stakeholder"); }} />
    {path === "beneficiary" && <Button label={sw ? "Endelea kupata msaada" : "Continue to legal help"} disabled={!accountReady || !access} onPress={() => router.replace("/auth-complete")} />}
    {(path === "organisation" || path === "stakeholder") && <View style={styles.panel}><Text style={styles.panelTitle}>{sw ? "Omba ufikiaji wa kazi" : "Request professional access"}</Text><Text style={styles.copy}>{sw ? "LSF itathibitisha taasisi na jukumu lako kabla ya kutoa ruhusa." : "LSF verifies your organisation and role before granting access."}</Text>{myRequests?.some((item) => item.status === "pending") || submitted ? <><Text style={styles.copy}>{sw ? "Ombi lako linasubiri ukaguzi." : "Your request is awaiting review."}</Text><Button label={sw ? "Endelea" : "Continue"} onPress={() => router.replace("/(tabs)")} /></> : <><Text style={styles.label}>{sw ? "Jukumu unaloomba" : "Requested role"}</Text>{([ ["provider_staff", "Provider team"], ["staff", "LSF staff"], ["content_editor", "Content editor"], ["stakeholder", "Partner"], ["donor", "Donor"] ] as const).map(([role, label]) => <Pressable key={role} accessibilityRole="radio" accessibilityState={{ checked: professionalRole === role }} aria-checked={professionalRole === role} onPress={() => setProfessionalRole(role)} style={[styles.roleChoice, professionalRole === role && styles.selected]}><Ionicons name={professionalRole === role ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={styles.copy}>{label}</Text></Pressable>)}<Field label={sw ? "Jina la taasisi" : "Organisation name"} value={organizationName} onChange={setOrganizationName} /><Field label={sw ? "Eleza kazi yako na kwa nini unahitaji ufikiaji" : "Describe your work and why you need access"} value={statement} onChange={setStatement} multiline /><Button label={sw ? "Tuma ombi kwa LSF" : "Submit request for LSF review"} loading={submitting} disabled={submitting || !access} onPress={() => void submitAccessRequest()} /></>}</View>}
    {path === "paralegal" && <View style={styles.panel}>{hasParalegalRole || paralegalApplication?.status === "approved" ? <><StatusBadge status="approved" sw={sw} /><Text style={styles.panelTitle}>{sw ? "Ufikiaji umeidhinishwa" : "Access approved"}</Text><Text style={styles.copy}>{sw ? "Kamilisha wasifu, maadili, mafunzo na upatikanaji kabla ya kupokea kazi." : "Complete your profile, ethics, training, and availability before taking work."}</Text><Button label={sw ? "Endelea na utambulisho" : "Continue onboarding"} onPress={() => router.replace("/paralegal-onboarding")} /></> : submitted || (paralegalApplication && paralegalApplication.status !== "rejected" && !paralegalApplication.intakeOrigin) ? <><StatusBadge status={paralegalApplication?.status ?? "pending"} sw={sw} /><Text style={styles.panelTitle}>{sw ? "Maombi yako yanakaguliwa" : "Your application is under review"}</Text><Text style={styles.copy}>{sw ? "LSF itakagua utambulisho, uzoefu na taasisi yako. Tutakuarifu uamuzi ukifanyika." : "LSF will review your identity, experience, and organisation. We will notify you when a decision is made."}</Text><View style={styles.statusSteps}><StatusStep done label={sw ? "Maombi yamewasilishwa" : "Application submitted"} /><StatusStep active label={sw ? "Ukaguzi wa LSF" : "LSF review"} /><StatusStep label={sw ? "Uamuzi wa ufikiaji" : "Access decision"} /></View><Button label={sw ? "Endelea kutumia Haki Yangu" : "Continue using Haki Yangu"} onPress={() => router.replace("/(tabs)")} /></> : <>{paralegalApplication?.status === "rejected" ? <View style={styles.rejectedNotice}><Ionicons name="information-circle-outline" size={20} color={colors.orange} /><Text style={styles.rejectedText}>{sw ? "Maombi ya awali hayakuidhinishwa. Unaweza kurekebisha taarifa na kutuma upya, au kuwasiliana na LSF." : "Your earlier application was not approved. You may correct the details and apply again, or contact LSF."}</Text></View> : null}{paralegalApplication?.intakeOrigin ? <View style={styles.rejectedNotice}><Ionicons name="mail-outline" size={20} color={colors.orange} /><Text style={styles.rejectedText}>{sw ? "LSF imeongeza jina lako kwenye orodha. Kamilisha taarifa na nyaraka ili ukaguzi uanze." : "LSF added an invitation record. Complete your details and documents to begin review."}</Text></View> : null}<Text style={styles.panelTitle}>{sw ? "Omba kuwa paralegal" : "Apply as a paralegal"}</Text><Text style={styles.copy}>{sw ? "Jina na barua pepe zinatoka kwenye akaunti yako. Jaza maelezo ya uzoefu ili LSF ikague." : "Your name and email come from your account. LSF reviews your experience before granting access."}</Text><Field label={sw ? "Simu" : "Phone"} value={phone} onChange={setPhone} /><Field label={sw ? "Mkoa" : "Region"} value={region} onChange={setRegion} /><Field label={sw ? "Wilaya" : "District"} value={district} onChange={setDistrict} /><Field label={sw ? "Elimu na mafunzo" : "Education and training"} value={education} onChange={setEducation} /><Field label={sw ? "Uzoefu" : "Experience"} value={experience} onChange={setExperience} multiline /><Field label={sw ? "Kwa nini ungependa kujiunga?" : "Why do you want to join?"} value={motivation} onChange={setMotivation} multiline /><UploadRow label={sw ? "Kitambulisho cha taifa au pasipoti *" : "National ID or passport *"} file={identityDocument?.name} onPress={() => void pickAndUpload("identity")} /><UploadRow label={sw ? "Cheti cha paralegal *" : "Paralegal certificate *"} file={certificateDocument?.name} onPress={() => void pickAndUpload("certificate")} /><UploadRow label={sw ? "CV au nyaraka ya uzoefu (si lazima)" : "CV or experience record (optional)"} file={resumeDocument?.name} onPress={() => void pickAndUpload("resume")} /><Button label={sw ? "Tuma maombi kwa LSF" : "Submit for LSF review"} loading={submitting} disabled={submitting} onPress={() => void submitApplication()} /></>}</View>}
  </Screen>;
}

function Choice({ icon, selected, tone, approvalLabel, title, body, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; selected: boolean; tone: "pink" | "teal" | "orange" | "gold"; approvalLabel?: string; title: string; body: string; onPress: () => void }) {
  const tint = { pink: colors.burgundySoft, teal: colors.tealSoft, orange: colors.orangeSoft, gold: colors.goldSoft }[tone];
  const accent = { pink: colors.burgundy, teal: colors.teal, orange: colors.orange, gold: colors.warning }[tone];
  return <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} aria-checked={selected} onPress={onPress} style={[styles.choice, selected && styles.selected]}>
    <View style={[styles.icon, { backgroundColor: tint }]}><Ionicons name={icon} color={accent} size={26} /></View>
    <View style={{ flex: 1 }}><Text style={[styles.panelTitle, { color: accent }]}>{title}</Text><Text style={styles.copy}>{body}</Text>{approvalLabel && <View style={[styles.approval, { backgroundColor: tint }]}><Ionicons name="lock-closed" size={11} color={accent} /><Text style={[styles.approvalText, { color: accent }]}>{approvalLabel}</Text></View>}</View>
    <Ionicons name={selected ? "radio-button-on" : "radio-button-off"} color={accent} size={23} />
  </Pressable>;
}
function StatusBadge({ status, sw }: { status: string; sw: boolean }) { const approved = status === "approved"; return <View style={[styles.statusBadge, approved && styles.statusBadgeApproved]}><Ionicons name={approved ? "checkmark-circle" : "time-outline"} size={17} color={approved ? colors.success : colors.orange} /><Text style={[styles.statusBadgeText, approved && styles.statusBadgeTextApproved]}>{approved ? (sw ? "IMEIDHINISHWA" : "APPROVED") : (sw ? "INASUBIRI UKAGUZI" : "UNDER REVIEW")}</Text></View>; }
function StatusStep({ label, done = false, active = false }: { label: string; done?: boolean; active?: boolean }) { return <View style={styles.statusStep}><Ionicons name={done ? "checkmark-circle" : active ? "time" : "ellipse-outline"} size={21} color={done ? colors.success : active ? colors.orange : colors.inkMuted} /><Text style={[styles.statusStepText, (done || active) && styles.statusStepTextActive]}>{label}</Text></View>; }
function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput style={[styles.input, multiline && styles.multiline]} value={value} onChangeText={onChange} multiline={multiline} accessibilityLabel={label} /></View>; }
function UploadRow({ label, file, onPress }: { label: string; file?: string; onPress: () => void }) { return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.uploadRow}><Ionicons name={file ? "checkmark-circle" : "cloud-upload-outline"} size={22} color={file ? colors.success : colors.burgundy} /><View style={{ flex: 1 }}><Text style={styles.label}>{label}</Text><Text style={styles.copy}>{file || "PDF, JPG or PNG · maximum 10MB"}</Text></View></Pressable>; }
const styles = StyleSheet.create({ uploadRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md }, hero: { paddingTop: spacing.md, paddingBottom: spacing.xl, gap: spacing.sm }, kicker: { color: colors.burgundy, fontFamily: type.bold, fontSize: 11, letterSpacing: 1.5 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 30, lineHeight: 36 }, intro: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 16, lineHeight: 24 }, roleChoice: { flexDirection: "row", gap: spacing.sm, alignItems: "center", padding: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }, choice: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg, marginBottom: spacing.sm, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }, selected: { borderColor: colors.burgundy, backgroundColor: colors.softPink }, icon: { width: 68, height: 68, borderRadius: 21, alignItems: "center", justifyContent: "center" }, approval: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 4, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 5, marginTop: spacing.sm }, approvalText: { fontFamily: type.medium, fontSize: 10 }, panel: { gap: spacing.md, backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.lg, marginTop: spacing.md }, panelTitle: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, copy: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19, marginTop: 3 }, field: { gap: spacing.xs }, label: { color: colors.ink, fontFamily: type.bold, fontSize: 13 }, input: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, minHeight: 48, paddingHorizontal: spacing.md, color: colors.ink, fontSize: 15 }, multiline: { minHeight: 86, textAlignVertical: "top", paddingTop: spacing.md }, statusBadge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.orangeSoft, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }, statusBadgeApproved: { backgroundColor: "#E7F4ED" }, statusBadgeText: { color: colors.orange, fontFamily: type.bold, fontSize: 11, letterSpacing: 0.7 }, statusBadgeTextApproved: { color: colors.success }, statusSteps: { gap: spacing.sm, borderRadius: radius.md, backgroundColor: "#F7F5F6", padding: spacing.md }, statusStep: { flexDirection: "row", alignItems: "center", gap: spacing.sm }, statusStepText: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 13 }, statusStepTextActive: { color: colors.ink }, rejectedNotice: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, borderRadius: radius.md, backgroundColor: colors.orangeSoft, padding: spacing.md }, rejectedText: { flex: 1, color: colors.ink, fontFamily: type.regular, fontSize: 13, lineHeight: 19 } });
