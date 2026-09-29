import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useUser } from "../src/auth";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import type { Id } from "../../convex/_generated/dataModel";

type Path = "beneficiary" | "paralegal" | "organisation";
type ProfessionalRole = "staff" | "content_editor" | "provider_staff" | "stakeholder" | "donor";

export default function JoinScreen() {
  const { locale } = useLanguage();
  const { user } = useUser();
  const access = useQuery(api.users.currentAccess, user ? {} : "skip");
  const paralegalApplication = useQuery(api.paralegals.getMyApplication, user ? {} : "skip");
  const apply = useMutation(api.formSubmissions.submitParalegalApplication);
  const generateDocumentUploadUrl = useMutation(api.formSubmissions.generateParalegalDocumentUploadUrl);
  const requestAccess = useMutation(api.accessRequests.request);
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
  const sw = locale === "sw";
  const hasParalegalRole = access?.roles.includes("paralegal") ?? false;

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
    if (!user?.primaryEmailAddress?.emailAddress || !user.fullName) {
      Alert.alert(sw ? "Kamilisha wasifu" : "Complete your profile", sw ? "Ongeza jina na barua pepe iliyothibitishwa kwenye akaunti yako." : "Add your name and verified email to your account first.");
      return;
    }
    if ([phone, region, district, education, experience, motivation].some((value) => !value.trim()) || !identityDocument || !certificateDocument) {
      Alert.alert(sw ? "Taarifa hazijakamilika" : "Missing details", sw ? "Jaza sehemu zote za maombi." : "Complete all application fields.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await apply({ fullName: user.fullName, email: user.primaryEmailAddress.emailAddress, phone: phone.trim(), region: region.trim(), district: district.trim(), education: education.trim(), experience: experience.trim(), motivation: motivation.trim(), idDocumentStorageId: identityDocument.id, certificateStorageId: certificateDocument.id, resumeStorageId: resumeDocument?.id });
      if (!result.success) throw new Error(result.message ?? "Application was not accepted.");
      setSubmitted(true);
    } catch (error) {
      Alert.alert(sw ? "Maombi hayakutumwa" : "Application not sent", error instanceof Error ? error.message : String(error));
    } finally { setSubmitting(false); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Chagua njia yako" : "Choose your path"} eyebrow="HAKI YANGU · LSF" />
    <View style={styles.hero}><Text style={styles.kicker}>JUSTICE FOR EVERYDAY PEOPLE</Text><Text style={styles.title}>{sw ? "Ungependa kutumia Haki Yangu vipi?" : "How will you use Haki Yangu?"}</Text><Text style={styles.intro}>{sw ? "Akaunti yako ni moja kwenye tovuti na programu. Ufikiaji wa kazi hutolewa baada ya uthibitisho wa LSF." : "One account works on web and mobile. Professional access follows LSF review."}</Text></View>
    <Choice icon="heart-outline" selected={path === "beneficiary"} title={sw ? "Nahitaji msaada wa kisheria" : "I need legal help"} body={sw ? "Uliza Saada, tafuta msaada na fuatilia kesi yako." : "Ask Saada, find help and follow your case."} onPress={() => setPath("beneficiary")} />
    <Choice icon="people-outline" selected={path === "paralegal"} title={sw ? "Mimi ni paralegal" : "I am a paralegal"} body={sw ? "Wasilisha maombi. LSF itakagua kabla ya kutoa ufikiaji wa kazi." : "Apply for review. LSF approves work access."} onPress={() => setPath("paralegal")} />
    <Choice icon="business-outline" selected={path === "organisation"} title={sw ? "Nafanya kazi kwa taasisi au LSF" : "I work with an organisation or LSF"} body={sw ? "Majukumu ya wafanyakazi na washirika hutolewa na msimamizi aliyeidhinishwa." : "Staff and partner roles are granted by authorised administrators."} onPress={() => setPath("organisation")} />
    {path === "beneficiary" && <Button label={sw ? "Endelea kupata msaada" : "Continue to legal help"} onPress={() => router.replace("/(tabs)")} />}
    {path === "organisation" && <View style={styles.panel}><Text style={styles.panelTitle}>{sw ? "Omba ufikiaji wa kazi" : "Request professional access"}</Text><Text style={styles.copy}>{sw ? "LSF itathibitisha taasisi na jukumu lako kabla ya kutoa ruhusa." : "LSF verifies your organisation and role before granting access."}</Text>{myRequests?.some((item) => item.status === "pending") || submitted ? <><Text style={styles.copy}>{sw ? "Ombi lako linasubiri ukaguzi." : "Your request is awaiting review."}</Text><Button label={sw ? "Endelea" : "Continue"} onPress={() => router.replace("/(tabs)")} /></> : <><Text style={styles.label}>{sw ? "Jukumu unaloomba" : "Requested role"}</Text>{([ ["provider_staff", "Provider team"], ["staff", "LSF staff"], ["content_editor", "Content editor"], ["stakeholder", "Partner"], ["donor", "Donor"] ] as const).map(([role, label]) => <Pressable key={role} accessibilityRole="radio" accessibilityState={{ selected: professionalRole === role }} onPress={() => setProfessionalRole(role)} style={[styles.roleChoice, professionalRole === role && styles.selected]}><Ionicons name={professionalRole === role ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={styles.copy}>{label}</Text></Pressable>)}<Field label={sw ? "Jina la taasisi" : "Organisation name"} value={organizationName} onChange={setOrganizationName} /><Field label={sw ? "Eleza kazi yako na kwa nini unahitaji ufikiaji" : "Describe your work and why you need access"} value={statement} onChange={setStatement} multiline /><Button label={sw ? "Tuma ombi kwa LSF" : "Submit request for LSF review"} loading={submitting} disabled={submitting || !access} onPress={() => void submitAccessRequest()} /></>}</View>}
    {path === "paralegal" && <View style={styles.panel}>{hasParalegalRole || paralegalApplication?.status === "approved" ? <><StatusBadge status="approved" sw={sw} /><Text style={styles.panelTitle}>{sw ? "Ufikiaji umeidhinishwa" : "Access approved"}</Text><Text style={styles.copy}>{sw ? "Kamilisha wasifu, maadili, mafunzo na upatikanaji kabla ya kupokea kazi." : "Complete your profile, ethics, training, and availability before taking work."}</Text><Button label={sw ? "Endelea na utambulisho" : "Continue onboarding"} onPress={() => router.replace("/paralegal-onboarding")} /></> : submitted || (paralegalApplication && paralegalApplication.status !== "rejected") ? <><StatusBadge status={paralegalApplication?.status ?? "pending"} sw={sw} /><Text style={styles.panelTitle}>{sw ? "Maombi yako yanakaguliwa" : "Your application is under review"}</Text><Text style={styles.copy}>{sw ? "LSF itakagua utambulisho, uzoefu na taasisi yako. Tutakuarifu uamuzi ukifanyika." : "LSF will review your identity, experience, and organisation. We will notify you when a decision is made."}</Text><View style={styles.statusSteps}><StatusStep done label={sw ? "Maombi yamewasilishwa" : "Application submitted"} /><StatusStep active label={sw ? "Ukaguzi wa LSF" : "LSF review"} /><StatusStep label={sw ? "Uamuzi wa ufikiaji" : "Access decision"} /></View><Button label={sw ? "Endelea kutumia Haki Yangu" : "Continue using Haki Yangu"} onPress={() => router.replace("/(tabs)")} /></> : <>{paralegalApplication?.status === "rejected" ? <View style={styles.rejectedNotice}><Ionicons name="information-circle-outline" size={20} color={colors.orange} /><Text style={styles.rejectedText}>{sw ? "Maombi ya awali hayakuidhinishwa. Unaweza kurekebisha taarifa na kutuma upya, au kuwasiliana na LSF." : "Your earlier application was not approved. You may correct the details and apply again, or contact LSF."}</Text></View> : null}<Text style={styles.panelTitle}>{sw ? "Omba kuwa paralegal" : "Apply as a paralegal"}</Text><Text style={styles.copy}>{sw ? "Jina na barua pepe zinatoka kwenye akaunti yako. Jaza maelezo ya uzoefu ili LSF ikague." : "Your name and email come from your account. LSF reviews your experience before granting access."}</Text><Field label={sw ? "Simu" : "Phone"} value={phone} onChange={setPhone} /><Field label={sw ? "Mkoa" : "Region"} value={region} onChange={setRegion} /><Field label={sw ? "Wilaya" : "District"} value={district} onChange={setDistrict} /><Field label={sw ? "Elimu na mafunzo" : "Education and training"} value={education} onChange={setEducation} /><Field label={sw ? "Uzoefu" : "Experience"} value={experience} onChange={setExperience} multiline /><Field label={sw ? "Kwa nini ungependa kujiunga?" : "Why do you want to join?"} value={motivation} onChange={setMotivation} multiline /><UploadRow label={sw ? "Kitambulisho cha taifa au pasipoti *" : "National ID or passport *"} file={identityDocument?.name} onPress={() => void pickAndUpload("identity")} /><UploadRow label={sw ? "Cheti cha paralegal *" : "Paralegal certificate *"} file={certificateDocument?.name} onPress={() => void pickAndUpload("certificate")} /><UploadRow label={sw ? "CV au nyaraka ya uzoefu (si lazima)" : "CV or experience record (optional)"} file={resumeDocument?.name} onPress={() => void pickAndUpload("resume")} /><Button label={sw ? "Tuma maombi kwa LSF" : "Submit for LSF review"} loading={submitting} disabled={submitting} onPress={() => void submitApplication()} /></>}</View>}
  </Screen>;
}

function Choice({ icon, selected, title, body, onPress }: { icon: React.ComponentProps<typeof Ionicons>["name"]; selected: boolean; title: string; body: string; onPress: () => void }) { return <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress} style={[styles.choice, selected && styles.selected]}><View style={styles.icon}><Ionicons name={icon} color={colors.burgundy} size={23} /></View><View style={{ flex: 1 }}><Text style={styles.panelTitle}>{title}</Text><Text style={styles.copy}>{body}</Text></View><Ionicons name={selected ? "checkmark-circle" : "ellipse-outline"} color={colors.burgundy} size={23} /></Pressable>; }
function StatusBadge({ status, sw }: { status: string; sw: boolean }) { const approved = status === "approved"; return <View style={[styles.statusBadge, approved && styles.statusBadgeApproved]}><Ionicons name={approved ? "checkmark-circle" : "time-outline"} size={17} color={approved ? colors.success : colors.orange} /><Text style={[styles.statusBadgeText, approved && styles.statusBadgeTextApproved]}>{approved ? (sw ? "IMEIDHINISHWA" : "APPROVED") : (sw ? "INASUBIRI UKAGUZI" : "UNDER REVIEW")}</Text></View>; }
function StatusStep({ label, done = false, active = false }: { label: string; done?: boolean; active?: boolean }) { return <View style={styles.statusStep}><Ionicons name={done ? "checkmark-circle" : active ? "time" : "ellipse-outline"} size={21} color={done ? colors.success : active ? colors.orange : colors.inkMuted} /><Text style={[styles.statusStepText, (done || active) && styles.statusStepTextActive]}>{label}</Text></View>; }
function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput style={[styles.input, multiline && styles.multiline]} value={value} onChangeText={onChange} multiline={multiline} accessibilityLabel={label} /></View>; }
function UploadRow({ label, file, onPress }: { label: string; file?: string; onPress: () => void }) { return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.uploadRow}><Ionicons name={file ? "checkmark-circle" : "cloud-upload-outline"} size={22} color={file ? colors.success : colors.burgundy} /><View style={{ flex: 1 }}><Text style={styles.label}>{label}</Text><Text style={styles.copy}>{file || "PDF, JPG or PNG · maximum 10MB"}</Text></View></Pressable>; }
const styles = StyleSheet.create({ uploadRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md }, hero: { backgroundColor: colors.burgundy, padding: spacing.xl, borderRadius: radius.xl, marginBottom: spacing.lg }, kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1.5 }, title: { color: colors.surface, fontFamily: type.bold, fontSize: 28, marginTop: spacing.sm }, intro: { color: colors.surface, fontFamily: type.regular, fontSize: 14, lineHeight: 21, marginTop: spacing.sm }, roleChoice: { flexDirection: "row", gap: spacing.sm, alignItems: "center", padding: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }, choice: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg, marginBottom: spacing.sm, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }, selected: { borderColor: colors.burgundy, backgroundColor: colors.softPink }, icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, panel: { gap: spacing.md, backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.lg, marginTop: spacing.md }, panelTitle: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, copy: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19, marginTop: 3 }, field: { gap: spacing.xs }, label: { color: colors.ink, fontFamily: type.bold, fontSize: 13 }, input: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, minHeight: 48, paddingHorizontal: spacing.md, color: colors.ink, fontSize: 15 }, multiline: { minHeight: 86, textAlignVertical: "top", paddingTop: spacing.md }, statusBadge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.orangeSoft, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }, statusBadgeApproved: { backgroundColor: "#E7F4ED" }, statusBadgeText: { color: colors.orange, fontFamily: type.bold, fontSize: 11, letterSpacing: 0.7 }, statusBadgeTextApproved: { color: colors.success }, statusSteps: { gap: spacing.sm, borderRadius: radius.md, backgroundColor: "#F7F5F6", padding: spacing.md }, statusStep: { flexDirection: "row", alignItems: "center", gap: spacing.sm }, statusStepText: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 13 }, statusStepTextActive: { color: colors.ink }, rejectedNotice: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, borderRadius: radius.md, backgroundColor: colors.orangeSoft, padding: spacing.md }, rejectedText: { flex: 1, color: colors.ink, fontFamily: type.regular, fontSize: 13, lineHeight: 19 } });
