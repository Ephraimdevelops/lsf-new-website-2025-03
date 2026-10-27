import { plainError } from "../../shared/plainLanguage";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../src/auth";
import { api } from "../src/backend/api";
import { CivicPageHeader } from "../src/components/CivicPageHeader";
import { CivicIllustration } from "../src/components/CivicIllustration";
import { CivicObject, type CivicObjectKind } from "../src/components/CivicObject";
import { IntakeSelect } from "../src/intake/IntakeSelect";
import { regionOptions } from "../src/regionOptions";
import { uploadEvidence } from "../src/intake/uploadEvidence";
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState<"identity" | "certificate" | "resume" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const services = useQuery(api.justiceServices.listPublicServices, sheetOpen && path === "paralegal" ? {} : "skip");
  const [showInvitations, setShowInvitations] = useState(false);
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
  const [submittedPath, setSubmittedPath] = useState<Path | null>(null);
  const [accountName, setAccountName] = useState("");
  const sw = locale === "sw";
  const hasParalegalRole = access?.roles.includes("paralegal") ?? false;
  const needsName = access && ["user", "haki yangu user"].includes(access.user.name.trim().toLowerCase());
  const districts = [...new Set((services ?? []).filter(item => item.region.toLowerCase() === region.toLowerCase()).map(item => item.district))].sort();
  function choosePath(next: Path) {
    setPath(next); setSheetOpen(true); setStep(0); setFormError(""); setUploadError("");
    if (next === "organisation") setProfessionalRole("provider_staff");
    if (next === "stakeholder") setProfessionalRole("stakeholder");
  }
  function nextStep() {
    if (step === 0 && (!phone.trim() || !region || !district.trim())) { setFormError(sw ? "Ongeza simu, mkoa na wilaya ili tuendelee." : "Add your phone, region and district to continue."); return; }
    if (step === 1 && (!education.trim() || !experience.trim() || !motivation.trim())) { setFormError(sw ? "Chagua mafunzo yako na eleza uzoefu na sababu ya kujiunga." : "Choose your training and describe your experience and reason for joining."); return; }
    setFormError(""); setStep(current => current + 1);
  }

  async function saveAccountName() {
    if (accountName.trim().length < 2) {
      Alert.alert(sw ? "Weka jina" : "Enter your name", sw ? "Weka jina lenye angalau herufi mbili." : "Enter at least two characters.");
      return;
    }
    setSubmitting(true);
    try { await updateProfile({ name: accountName.trim() }); }
    catch (error) { Alert.alert(sw ? "Jina halikuhifadhiwa" : "Name not saved", plainError(error, locale)); }
    finally { setSubmitting(false); }
  }

  async function pickAndUpload(kind: "identity" | "certificate" | "resume") {
    if (uploading || submitting || !accountReady || !access) return;
    setUploading(kind); setUploadProgress(0); setUploadError("");
    try {
    const picked = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/jpeg", "image/png"], copyToCacheDirectory: true, multiple: false });
    if (picked.canceled) return;
    const asset = picked.assets[0];
    if (asset.size && asset.size > 10 * 1024 * 1024) { Alert.alert(sw ? "Faili ni kubwa" : "File too large", "Maximum 10MB"); return; }
      const postUrl = await generateDocumentUploadUrl({});
      const storageId = await uploadEvidence(postUrl, { uri: asset.uri, mimeType: asset.mimeType || (asset.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : asset.name.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg"), size: asset.size || 0 }, setUploadProgress);
      const uploaded = { id: storageId as Id<"_storage">, name: asset.name };
      if (kind === "identity") setIdentityDocument(uploaded); else if (kind === "certificate") setCertificateDocument(uploaded); else setResumeDocument(uploaded);
      setUploadProgress(100);
    } catch { setUploadError(sw ? "Hati haijapakiwa. Angalia mtandao, kisha bonyeza hati hiyo ujaribu tena." : "Document not uploaded. Check your connection, then tap the document to retry."); }
    finally { setUploading(null); }
  }

  async function submitAccessRequest() {
    if (organizationName.trim().length < 2 || statement.trim().length < 20 || statement.trim().length > 2000) {
      setFormError(sw ? "Ongeza jina la taasisi na maelezo ya kazi yako (herufi 20 hadi 2,000)." : "Add your organisation name and describe your work in 20 to 2,000 characters.");
      return;
    }
    setFormError("");
    if (!access) {
      Alert.alert(sw ? "Subiri kidogo" : "Please wait", sw ? "Akaunti yako inaunganishwa." : "Your account is being connected.");
      return;
    }
    setSubmitting(true);
    try {
      await requestAccess({ requestedRole: professionalRole, organizationName, statement });
      setSubmittedPath(path);
    } catch (error) {
      Alert.alert(sw ? "Ombi halikutumwa" : "Request not sent", plainError(error, locale));
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
      setSubmittedPath("paralegal");
    } catch (error) {
      Alert.alert(sw ? "Maombi hayakutumwa" : "Application not sent", plainError(error, locale));
    } finally { setSubmitting(false); }
  }

  if (!userLoaded) return <Screen><Text style={styles.copy}>{sw ? "Akaunti inaandaliwa…" : "Preparing your account…"}</Text></Screen>;
  if (needsName) return <Screen><CivicPageHeader back title={sw ? "Jina lako" : "Your name"} /><View style={styles.panel}><CivicIllustration pose="welcome" size={96} /><Text style={styles.panelTitle}>{sw ? "Tutakuitaje?" : "What should we call you?"}</Text><Text style={styles.copy}>{sw ? "Jina litaonekana kwenye wasifu na maombi. Unaweza kulibadilisha." : "Your name appears on your profile and applications. You can change it."}</Text><Field label={sw ? "Jina" : "Name"} value={accountName} onChange={setAccountName} /><Button label={sw ? "Endelea" : "Continue"} loading={submitting} disabled={submitting} onPress={() => void saveAccountName()} /></View></Screen>;

  return <Screen>
    <CivicPageHeader back title={sw ? "Akaunti yako" : "Your account"} />
    <View style={styles.hero}><Text style={[styles.title, { fontFamily: type.semibold, fontSize: 25, lineHeight: 32 }]}>{sw ? "Utatumia Haki Yangu vipi?" : "How will you use Haki Yangu?"}</Text><Text style={styles.intro}>{sw ? "Chagua unachohitaji. Kuomba msaada hakuhitaji ruhusa ya kazi; kufanya kazi kunahitaji idhini ya LSF." : "Choose what you need. You can request help without a work role. Work access needs LSF approval."}</Text></View>
    {user && !accountReady && accountStatus !== "error" ? <Surface tone="teal"><Text style={styles.copy}>{sw ? "Tunaunganisha akaunti yako salama…" : "Connecting your secure account…"}</Text></Surface> : null}
    {user && accountStatus === "error" ? <Surface tone="orange"><Text style={styles.copy}>{sw ? "Akaunti yako haijaunganishwa. Angalia mtandao na ujaribu tena, au wasiliana na LSF ikiwa imezuiwa." : "Your account could not be connected. Check your connection and retry, or contact LSF if it was deactivated."}</Text><Button label={sw ? "Jaribu tena" : "Retry connection"} onPress={retryAccountSync} /></Surface> : null}
    <Choice kind="beneficiary" selected={path === "beneficiary"} title={sw ? "Nahitaji msaada" : "I need help"} body={sw ? "Pata msaada na ufuatilie kesi yako." : "Get help and follow your case."} onPress={() => choosePath("beneficiary")} />
    <Choice kind="paralegal" selected={path === "paralegal"} approvalLabel={sw ? "Idhini ya LSF inahitajika" : "Needs LSF approval"} title={sw ? "Msaidizi wa sheria" : "Paralegal"} body={sw ? "Toa msaada wa kisheria kwa jamii." : "Provide legal support in your community."} onPress={() => choosePath("paralegal")} />
    <Choice kind="organisation" selected={path === "organisation"} approvalLabel={sw ? "Idhini ya LSF inahitajika" : "Needs LSF approval"} title={sw ? "Timu ya LSF au taasisi" : "LSF or provider team"} body={sw ? "Fanya kazi za taasisi au shirika lako." : "Work with your organisation or LSF."} onPress={() => choosePath("organisation")} />
    <Choice kind="stakeholder" selected={path === "stakeholder"} approvalLabel={sw ? "Idhini ya LSF inahitajika" : "Needs LSF approval"} title={sw ? "Mdau au mfadhili" : "Partner or donor"} body={sw ? "Fuatilia taarifa za shughuli na matokeo." : "Follow activity and impact reports."} onPress={() => choosePath("stakeholder")} />
    <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => { if (!submitting && !uploading) setSheetOpen(false); }}>
      <View style={styles.scrim}><SafeAreaView style={styles.sheet}>
        <View style={styles.sheetHeader}><View style={{ flex: 1 }}><Text style={styles.sheetBrand}>LSF · HAKI YANGU</Text><Text style={styles.panelTitle}>{path === "beneficiary" ? (sw ? "Tuko hapa kukusaidia" : "We're here to help") : path === "paralegal" ? (sw ? "Jiunge kama msaidizi wa kisheria" : "Join as a paralegal") : (sw ? "Jiunge na timu" : "Join a team")}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={sw ? "Ghairi" : "Cancel"} disabled={submitting || !!uploading} onPress={() => setSheetOpen(false)} style={styles.cancel}><Ionicons name="close" size={23} color={colors.burgundy} /><Text style={styles.cancelLabel}>{sw ? "Ghairi" : "Cancel"}</Text></Pressable></View>
        <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingBottom: 28 }}>
        <CivicObject kind={path} size={96} />
        {!user ? <View style={styles.panel}><Text style={styles.panelTitle}>{sw ? "Ingia ili tuendelee" : "Sign in to continue"}</Text><Text style={styles.copy}>{path === "beneficiary" ? (sw ? "Unaweza kutafuta msaada bila akaunti. Ingia kutuma na kufuatilia ombi lako." : "You can browse help without an account. Sign in to send and follow your request.") : (sw ? "Ingia kutuma taarifa kwa LSF. Kuchagua jukumu hakukupi ruhusa ya kazi." : "Sign in to send your details to LSF. Choosing a role does not grant work access.")}</Text><Button label={sw ? "Ingia au jisajili" : "Sign in or create an account"} onPress={() => router.push("/sign-in")} /></View> : <>
    {path === "organisation" && access ? <View style={{ marginVertical: 12 }}><Pressable accessibilityRole="button" accessibilityState={{ expanded: showInvitations }} style={{ minHeight: 48, flexDirection: "row", alignItems: "center", gap: 12 }} onPress={() => setShowInvitations(!showInvitations)}><Ionicons name="mail-outline" size={21} color={colors.teal} /><Text style={[styles.copy, { flex: 1, fontSize: 15, color: colors.ink }]}>{sw ? "Nina mwaliko wa timu" : "I have a team invitation"}</Text><Ionicons name={showInvitations ? "chevron-up" : "chevron-down"} size={18} color={colors.inkMuted} /></Pressable>{showInvitations ? <ProviderInviteInbox /> : null}</View> : null}
    {path === "beneficiary" && <View style={styles.panel}><Text style={styles.panelTitle}>{sw ? "Unahitaji msaada gani?" : "What do you need help with?"}</Text><Text style={styles.copy}>{sw ? "Unaweza kuuliza swali, kutafuta huduma au kuanza ombi. Huhitaji kuomba jukumu la kazi." : "Ask a question, find a service or start a request. You do not need a professional role."}</Text><Button label={sw ? "Endelea kupata msaada" : "Continue to legal help"} disabled={!accountReady || !access} onPress={() => router.replace("/auth-complete")} /></View>}
    {(path === "organisation" || path === "stakeholder") && <View style={styles.panel}><Text style={styles.panelTitle}>{sw ? "Omba ufikiaji wa kazi" : "Request professional access"}</Text><Text style={styles.copy}>{sw ? "LSF itathibitisha taasisi na jukumu lako kabla ya kutoa ruhusa." : "LSF verifies your organisation and role before granting access."}</Text>{myRequests?.some((item) => item.status === "pending" && item.requestedRole === professionalRole) || submittedPath === path ? <><Text style={styles.copy}>{sw ? "Ombi lako linasubiri ukaguzi." : "Your request is awaiting review."}</Text><Button label={sw ? "Endelea" : "Continue"} onPress={() => router.replace("/(tabs)")} /></> : <><IntakeSelect label={sw ? "Jukumu lako" : "Your role"} sw={sw} value={professionalRole} onChange={value => setProfessionalRole(value as ProfessionalRole)} options={(path === "stakeholder" ? [["stakeholder", sw ? "Mdau" : "Partner"], ["donor", sw ? "Mfadhili" : "Donor"]] : [["provider_staff", sw ? "Timu ya mtoa huduma" : "Provider team"], ["staff", sw ? "Mfanyakazi wa LSF" : "LSF staff"], ["content_editor", sw ? "Mhariri" : "Content editor"]]).map(([value, label]) => ({ value, label }))} /><Field label={sw ? "Jina la taasisi" : "Organisation name"} value={organizationName} onChange={setOrganizationName} /><Field label={sw ? "Eleza kazi yako na kwa nini unahitaji ufikiaji" : "Describe your work and why you need access"} value={statement} onChange={setStatement} multiline maxLength={2000} />{formError ? <Text accessibilityRole="alert" style={styles.error}>{formError}</Text> : null}<Button label={sw ? "Tuma ombi kwa LSF" : "Submit request for LSF review"} loading={submitting} disabled={submitting || !access || !organizationName.trim() || !statement.trim()} onPress={() => void submitAccessRequest()} /></>}</View>}
    {path === "paralegal" && <View style={styles.panel}>{hasParalegalRole || paralegalApplication?.status === "approved" ? <><StatusBadge status="approved" sw={sw} /><Text style={styles.panelTitle}>{sw ? "Ufikiaji umeidhinishwa" : "Access approved"}</Text><Text style={styles.copy}>{sw ? "Kamilisha wasifu, maadili, mafunzo na upatikanaji kabla ya kupokea kazi." : "Complete your profile, ethics, training, and availability before taking work."}</Text><Button label={sw ? "Endelea na utambulisho" : "Continue onboarding"} onPress={() => router.replace("/paralegal-onboarding")} /></> : submittedPath === "paralegal" || (paralegalApplication && paralegalApplication.status !== "rejected" && !paralegalApplication.intakeOrigin) ? <><StatusBadge status={paralegalApplication?.status ?? "pending"} sw={sw} /><Text style={styles.panelTitle}>{sw ? "Maombi yako yanakaguliwa" : "Your application is under review"}</Text><Text style={styles.copy}>{sw ? "LSF itakagua utambulisho, uzoefu na taasisi yako. Utapokea taarifa ya uamuzi." : "LSF will review your identity, experience and organisation. You will receive the decision."}</Text><View style={styles.statusSteps}><StatusStep done label={sw ? "Maombi yamewasilishwa" : "Application submitted"} /><StatusStep active label={sw ? "Ukaguzi wa LSF" : "LSF review"} /><StatusStep label={sw ? "Uamuzi wa ufikiaji" : "Access decision"} /></View><Button label={sw ? "Endelea kutumia Haki Yangu" : "Continue using Haki Yangu"} onPress={() => router.replace("/(tabs)")} /></> : <>{paralegalApplication?.status === "rejected" ? <View style={styles.rejectedNotice}><Ionicons name="information-circle-outline" size={20} color={colors.orange} /><Text style={styles.rejectedText}>{sw ? "Maombi ya awali hayakuidhinishwa. Unaweza kurekebisha taarifa na kutuma upya, au kuwasiliana na LSF." : "Your earlier application was not approved. You may correct the details and apply again, or contact LSF."}</Text></View> : null}{paralegalApplication?.intakeOrigin ? <View style={styles.rejectedNotice}><Ionicons name="mail-outline" size={20} color={colors.orange} /><Text style={styles.rejectedText}>{sw ? "LSF imeongeza jina lako kwenye orodha. Kamilisha taarifa na nyaraka ili ukaguzi uanze." : "LSF added an invitation record. Complete your details and documents to begin review."}</Text></View> : null}<Text style={styles.panelTitle}>{sw ? "Omba kuwa msaidizi wa kisheria" : "Apply as a paralegal"}</Text><Text style={styles.copy}>{sw ? "Jina na barua pepe zinatoka kwenye akaunti yako. Jaza maelezo ya uzoefu ili LSF ikague." : "Your name and email come from your account. LSF reviews your experience before granting access."}</Text><View style={styles.steps}>{[sw ? "Mawasiliano" : "Contact", sw ? "Uzoefu" : "Experience", sw ? "Nyaraka" : "Documents"].map((label, index) => <View key={label} style={styles.stepItem}><View style={[styles.stepBar, index <= step && styles.stepBarActive]} /><Text style={[styles.stepLabel, index === step && { color: colors.burgundy }]}>{index + 1}. {label}</Text></View>)}</View>
      {step === 0 ? <><Field label={sw ? "Namba yako ya simu" : "Your phone number"} value={phone} onChange={setPhone} keyboardType="phone-pad" /><IntakeSelect label={sw ? "Mkoa unaofanyia kazi" : "Region where you work"} value={region} options={regionOptions} onChange={value => { setRegion(value); setDistrict(""); }} sw={sw} /><IntakeSelect label={sw ? "Wilaya unaofanyia kazi" : "District where you work"} value={district} options={districts.map(value => ({ value, label: value }))} onChange={setDistrict} sw={sw} allowCustom /><Text style={styles.copy}>{sw ? "Wilaya haipo? Andika jina lake kwenye utafutaji na chagua Tumia." : "District missing? Type its name in search and choose Use."}</Text></> : null}
      {step === 1 ? <><IntakeSelect label={sw ? "Elimu au mafunzo yako" : "Your education or training"} value={education} onChange={setEducation} sw={sw} allowCustom options={[["Paralegal training", "Mafunzo ya paralegal"], ["Law certificate", "Cheti cha sheria"], ["Law diploma", "Diploma ya sheria"], ["Law degree", "Shahada ya sheria"]].map(([value, label]) => ({ value, label: sw ? label : value }))} /><Field label={sw ? "Umewahi kusaidia jamii kwa namna gani?" : "How have you supported your community?"} value={experience} onChange={setExperience} multiline /><Field label={sw ? "Kwa nini ungependa kujiunga?" : "Why would you like to join?"} value={motivation} onChange={setMotivation} multiline /></> : null}
      {step === 2 ? <><Text style={styles.copy}>{sw ? "Nyaraka hizi zitatumwa kwa LSF kwa ukaguzi. Hazitaonekana kwenye wasifu wa umma." : "These documents are sent to LSF for review. They will not appear on your public profile."}</Text><UploadRow label={sw ? "Kitambulisho au pasipoti" : "National ID or passport"} file={identityDocument?.name} busy={uploading === "identity"} progress={uploadProgress} disabled={!!uploading || submitting || !accountReady || !access} sw={sw} onPress={() => void pickAndUpload("identity")} /><UploadRow label={sw ? "Cheti cha msaidizi wa kisheria" : "Paralegal certificate"} file={certificateDocument?.name} busy={uploading === "certificate"} progress={uploadProgress} disabled={!!uploading || submitting || !accountReady || !access} sw={sw} onPress={() => void pickAndUpload("certificate")} /><UploadRow label={sw ? "CV (si lazima)" : "CV (optional)"} file={resumeDocument?.name} busy={uploading === "resume"} progress={uploadProgress} disabled={!!uploading || submitting || !accountReady || !access} sw={sw} onPress={() => void pickAndUpload("resume")} />{uploadError ? <Text accessibilityRole="alert" style={styles.error}>{uploadError}</Text> : null}</> : null}
      {formError ? <Text accessibilityRole="alert" style={styles.error}>{formError}</Text> : null}
      {step < 2 ? <Button label={sw ? "Endelea" : "Continue"} onPress={nextStep} /> : <Button label={sw ? "Tuma maombi kwa LSF" : "Submit for LSF review"} loading={submitting} disabled={submitting || !!uploading || !access || !identityDocument || !certificateDocument} onPress={() => void submitApplication()} />}
      {step > 0 ? <Button variant="quiet" label={sw ? "Hatua iliyotangulia" : "Previous step"} disabled={submitting || !!uploading} onPress={() => { setStep(current => current - 1); setFormError(""); }} /> : null}</>}</View>}
        </>}
        </ScrollView></SafeAreaView></View>
    </Modal>
  </Screen>;
}

function Choice({ kind, selected, approvalLabel, title, body, onPress }: { kind: CivicObjectKind; selected: boolean; approvalLabel?: string; title: string; body: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderColor: colors.line }}>
    <CivicObject kind={kind} size={68} />
    <View style={{ flex: 1 }}><Text style={[styles.panelTitle, { fontFamily: type.semibold, color: colors.ink }]}>{title}</Text><Text style={[styles.copy, { fontSize: 14, lineHeight: 21 }]}>{body}</Text>{approvalLabel ? <Text style={[styles.copy, { color: colors.teal, fontSize: 12 }]}>{approvalLabel}</Text> : null}</View>
    <Ionicons name="arrow-forward" color={colors.burgundy} size={23} />
  </Pressable>;
}
function StatusBadge({ status, sw }: { status: string; sw: boolean }) { const approved = status === "approved"; return <View style={[styles.statusBadge, approved && styles.statusBadgeApproved]}><Ionicons name={approved ? "checkmark-circle" : "time-outline"} size={17} color={approved ? colors.success : colors.orange} /><Text style={[styles.statusBadgeText, approved && styles.statusBadgeTextApproved]}>{approved ? (sw ? "IMEIDHINISHWA" : "APPROVED") : (sw ? "INASUBIRI UKAGUZI" : "UNDER REVIEW")}</Text></View>; }
function StatusStep({ label, done = false, active = false }: { label: string; done?: boolean; active?: boolean }) { return <View style={styles.statusStep}><Ionicons name={done ? "checkmark-circle" : active ? "time" : "ellipse-outline"} size={21} color={done ? colors.success : active ? colors.orange : colors.inkMuted} /><Text style={[styles.statusStepText, (done || active) && styles.statusStepTextActive]}>{label}</Text></View>; }
function Field({ label, value, onChange, multiline = false, keyboardType = "default", maxLength }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; keyboardType?: "default" | "phone-pad"; maxLength?: number }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput style={[styles.input, multiline && styles.multiline]} value={value} keyboardType={keyboardType} maxLength={maxLength ?? (keyboardType === "phone-pad" ? 40 : multiline ? 4000 : 160)} onChangeText={onChange} multiline={multiline} accessibilityLabel={label} /></View>; }
function UploadRow({ label, file, busy, progress, disabled, sw, onPress }: { label: string; file?: string; busy: boolean; progress: number; disabled: boolean; sw: boolean; onPress: () => void }) { return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress} style={styles.uploadRow}><Ionicons name={busy ? "time-outline" : file ? "checkmark-circle" : "cloud-upload-outline"} size={22} color={file ? colors.teal : colors.burgundy} /><View style={{ flex: 1 }}><Text style={styles.label}>{label}</Text><Text style={styles.copy}>{busy ? `${sw ? "Inapakiwa" : "Uploading"} ${progress}%` : file || (sw ? "PDF, JPG au PNG · Hadi MB 10" : "PDF, JPG or PNG · Up to 10 MB")}</Text></View>{file && !busy ? <Ionicons name="refresh-outline" size={19} color={colors.inkMuted} /> : null}</Pressable>; }
const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: "rgba(22,30,29,0.32)", justifyContent: "flex-end" },
  sheet: { maxHeight: "92%", backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 24 },
  sheetHeader: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 18 },
  sheetBrand: { fontFamily: type.medium, color: colors.teal, fontSize: 11, lineHeight: 18, marginBottom: 4 },
  cancel: { minHeight: 48, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  cancelLabel: { fontFamily: type.medium, color: colors.burgundy, fontSize: 11 },
  steps: { flexDirection: "row", gap: 12 },
  stepItem: { flex: 1, gap: 8 },
  stepBar: { height: 3, backgroundColor: colors.line, borderRadius: 2 },
  stepBarActive: { backgroundColor: colors.teal },
  stepLabel: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 11, lineHeight: 17 },
  error: { fontFamily: type.regular, color: colors.danger, fontSize: 13, lineHeight: 21 },
  uploadRow: { flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 16, minHeight: 64 },
  hero: { paddingBottom: 20, gap: 8 },
  title: { color: colors.ink, fontFamily: type.semibold, fontSize: 25, lineHeight: 32 },
  intro: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 15, lineHeight: 23 },
  roleChoice: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 14, paddingHorizontal: 8, minHeight: 52 },
  selected: { backgroundColor: "#F3F5F4", borderRadius: 8 },
  panel: { gap: 16, paddingVertical: 24 },
  panelTitle: { color: colors.ink, fontFamily: type.semibold, fontSize: 18, lineHeight: 25 },
  copy: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 14, lineHeight: 22, marginTop: 3 },
  field: { gap: 8 },
  label: { color: colors.ink, fontFamily: type.medium, fontSize: 14, lineHeight: 21 },
  input: { backgroundColor: "#F3F5F4", borderRadius: 8, minHeight: 54, paddingHorizontal: 16, fontFamily: type.regular, color: colors.ink, fontSize: 15 },
  multiline: { minHeight: 100, textAlignVertical: "top", paddingTop: 14 },
  statusBadge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 8, backgroundColor: colors.orangeSoft, paddingHorizontal: 12, paddingVertical: 8 },
  statusBadgeApproved: { backgroundColor: "#E7F4ED" },
  statusBadgeText: { color: colors.orange, fontFamily: type.medium, fontSize: 12 },
  statusBadgeTextApproved: { color: colors.success },
  statusSteps: { gap: 16, paddingVertical: 12 },
  statusStep: { flexDirection: "row", alignItems: "center", gap: 12 },
  statusStepText: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 14 },
  statusStepTextActive: { color: colors.ink },
  rejectedNotice: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderRadius: 8, backgroundColor: colors.orangeSoft, padding: 16 },
  rejectedText: { flex: 1, color: colors.ink, fontFamily: type.regular, fontSize: 14, lineHeight: 22 },
});
