import type { ScrollViewInstance } from "react-native";
import { recordingBlobToWav } from "../../shared/voiceAudio";
import { plainError } from "../../shared/plainLanguage";
import { useAuth } from "../src/auth";
import type { Id } from "../../convex/_generated/dataModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAction, useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { CivicIllustration } from "../src/components/CivicIllustration";
import { regionOptions, districtOptions } from "../src/regionOptions";
import { helpIssues as issueOptions } from "../src/helpIssues";
import { helpGoals } from "../src/helpGoals";
import { QuickExit } from "../src/components/QuickExit";
import { Screen } from "../src/components/Screen";
import { useIntakeDraft, type IntakeDraft } from "../src/intake/IntakeDraftContext";
import { IntakeDate, IntakeSelect } from "../src/intake/IntakeSelect";
import { IntakeVoice } from "../src/intake/IntakeVoice";
import { uploadEvidence } from "../src/intake/uploadEvidence";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

const TOTAL_STEPS = 8;
type Evidence = NonNullable<IntakeDraft["evidence"]>[number];

// Only messages constructed here are shown directly; server diagnostics stay hidden.
class IntakeFeedbackError extends Error {}
function intakeError(caught: unknown, locale: "sw" | "en", fallback: string) {
  return caught instanceof IntakeFeedbackError ? caught.message : plainError(caught, locale, fallback);
}


export default function IntakeScreen() {
  useSensitiveScreenProtection("intake");
  const active = useRef(true);
  useLayoutEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  function ensureActive() { if (!active.current) throw new Error("Intake screen is no longer active"); }
  const { isSignedIn } = useAuth();
  const { locale, t } = useLanguage();
  const sw = locale === "sw";
  const { draft, hasSavedDraft, hasGuestDraft, updateDraft, resetDraft, saveDraftForLater, restoreSavedDraft, restoreGuestDraft, clearSavedDraft } = useIntakeDraft();
  const saveDraft = useMutation(api.legalHelp.saveDraft);
  const saveAnswer = useMutation(api.legalHelp.saveAnswer);
  const generateAttachmentUploadUrl = useMutation(api.legalHelp.generateAttachmentUploadUrl);
  const attachToDraft = useMutation(api.legalHelp.attachToDraft);
  const submitRequest = useMutation(api.legalHelp.submit);
  const recordJourney = useMutation(api.journeyAnalytics.record);
  const transcribe = useAction(api.intakeAudio.transcribe);
  const serverDraft = useQuery(api.legalHelp.getDraft, isSignedIn ? { clientRequestId: draft.clientRequestId } : "skip");
  const services = useQuery(api.justiceServices.listPublicServices, {});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);
  const uploadLock = useRef(false);
  const [uploadState, setUploadState] = useState<Record<string, { percent: number; error?: string }>>({});
  const [moreIssues, setMoreIssues] = useState(false);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [cleanupFailed, setCleanupFailed] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState("");
  const [submittedRecordId, setSubmittedRecordId] = useState("");
  const [draftRestored, setDraftRestored] = useState(false);
  const evidence = draft.evidence ?? [];
  const evidenceRef = useRef(evidence);
  evidenceRef.current = evidence;
  function keepReceipt(file: Evidence) {
    ensureActive();
    const next = [...evidenceRef.current.filter(item => item.uri !== file.uri), file];
    evidenceRef.current = next;
    updateDraft({ evidence: next, hasDocuments: true });
  }
  const occurredDate = new Date(`${draft.occurredOn}T12:00:00`);
  const occurredOnIsValid = !draft.occurredOn || (/^\d{4}-\d{2}-\d{2}$/.test(draft.occurredOn) && !Number.isNaN(occurredDate.getTime()) && `${occurredDate.getFullYear()}-${String(occurredDate.getMonth() + 1).padStart(2, "0")}-${String(occurredDate.getDate()).padStart(2, "0")}` === draft.occurredOn && occurredDate <= new Date(new Date().setHours(23, 59, 59, 999)));
  const selectedIssue = issueOptions.find(item => item.id === draft.issueDetail) ?? issueOptions.find(item => item.key === draft.issueCategory);
  function goStep(next: number) { setStep(next); scrollRef.current?.scrollTo({ y: 0, animated: false }); }

  async function saveRemoteDraft() {
    ensureActive();
    const saved = await saveDraft({ clientRequestId: draft.clientRequestId, locale, description: draft.description, issueCategory: draft.issueCategory,
      sourceServiceId: draft.sourceServiceId as Id<"justice_services"> | undefined, region: draft.region, district: draft.district,
      occurredAt: draft.occurredOn ? new Date(`${draft.occurredOn}T12:00:00`).getTime() : undefined,
      involvedParties: draft.involvedParties, desiredHelp: draft.desiredHelp, safeContactMethod: draft.safeContactMethod,
      preferredLanguage: draft.preferredLanguage, preferredLanguageOther: draft.preferredLanguageOther, urgency: draft.urgency, hasDocuments: draft.hasDocuments || evidence.length > 0 || !!serverDraft?.attachments.length });
    ensureActive();
    if (saved.status === "draft" && selectedIssue) await saveAnswer({ requestId: saved.requestId, questionKey: "issue_detail", value: selectedIssue.en });
    ensureActive();
    return saved;
  }

  async function uploadFile(file: Evidence, requestId: Id<"legal_help_requests">) {
    ensureActive();
    setUploadState(current => ({ ...current, [file.uri]: { percent: 0 } }));
    try {
      let storageId = file.requestId === requestId ? file.storageId : undefined;
      if (!storageId) {
        const url = await generateAttachmentUploadUrl({});
        ensureActive();
        storageId = await uploadEvidence(url, file, percent => { if (active.current) setUploadState(current => ({ ...current, [file.uri]: { percent } })); });
      }
      ensureActive();
      // Keep the receipt before attachment so a retry does not upload the binary twice.
      const receipt = { ...file, storageId: String(storageId), requestId: String(requestId) };
      keepReceipt(receipt);
      const attached = await attachToDraft({ requestId, storageId: storageId as Id<"_storage">, name: file.name, type: file.mimeType, size: file.size });
      ensureActive();
      const result = { ...receipt, attachmentId: String(attached.attachmentId) };
      keepReceipt(result);
      setUploadState(current => ({ ...current, [file.uri]: { percent: 100 } }));
      return { file: result, version: attached.version };
    } catch (caught) {
      if (active.current) setUploadState(current => ({ ...current, [file.uri]: { percent: 0, error: intakeError(caught, locale, (sw ? "Upakiaji umeshindikana" : "Upload failed")) } }));
      throw caught;
    }
  }

  async function uploadSelected() {
    if (!active.current || uploadLock.current) return;
    uploadLock.current = true; setLoading(true); setError("");
    try {
      if (!isSignedIn) { await saveDraftForLater(); ensureActive(); router.push({ pathname: "/sign-in", params: { returnTo: "intake" } }); return; }
      const saved = await saveRemoteDraft();
      ensureActive();
      if (saved.status !== "draft") throw new IntakeFeedbackError(sw ? "Ombi hili tayari limetumwa." : "This request has already been submitted.");
      const next = [...evidence];
      for (let i = 0; i < next.length; i++) {
        const uploaded = await uploadFile(next[i], saved.requestId); ensureActive(); next[i] = uploaded.file;
        updateDraft({ evidence: [...next], hasDocuments: true });
      }
    } catch (caught) { if (active.current) setError(intakeError(caught, locale, sw ? "Hatukuweza kuthibitisha upakiaji. Faili zako bado zimeorodheshwa; jaribu tena." : "We could not confirm the upload. Your selected files are still listed; try again.")); }
    finally { uploadLock.current = false; if (active.current) setLoading(false); }
  }

  const transcriptionCopies = useRef(new Map<string,string>());
  useEffect(() => () => { for (const copy of transcriptionCopies.current.values()) URL.revokeObjectURL(copy); transcriptionCopies.current.clear(); }, []);
  async function transcribeRecording(uri: string) {
    ensureActive();
    if (!isSignedIn) throw new Error(sw ? "Ingia kutumia unukuzi wa sauti. Unaweza kuandika bila kuingia." : "Sign in to use transcription. You can type without signing in.");
    if (uploadLock.current || (evidence.length >= 10 && !evidence.some(file => file.uri === uri))) throw new Error(sw ? "Subiri upakiaji ukamilike au tumia faili chache." : "Wait for uploads to finish or use fewer files.");
    uploadLock.current = true; setLoading(true);
    try {
      let recordingUri = transcriptionCopies.current.get(uri) ?? uri;
      if (Platform.OS === "web" && recordingUri === uri) {
        const converted = await recordingBlobToWav(await (await fetch(uri)).blob());
        ensureActive();
        recordingUri = URL.createObjectURL(converted);
        transcriptionCopies.current.set(uri,recordingUri);
      }
      const info = Platform.OS === "web" ? { exists: true, size: (await (await fetch(recordingUri)).blob()).size } : await FileSystem.getInfoAsync(recordingUri);
      ensureActive();
      if (!info.exists || !info.size || info.size > 10 * 1024 * 1024) throw new Error("Recording is unavailable or exceeds 10 MB");
      const file: Evidence = evidence.find(item => item.uri === recordingUri) ?? { uri: recordingUri, name: `voice-${Date.now()}.${Platform.OS === "web" ? "wav" : "m4a"}`, mimeType: Platform.OS === "web" ? "audio/wav" : "audio/mp4", size: info.size };
      const saved = await saveRemoteDraft();
      ensureActive();
      if (saved.status !== "draft") throw new Error("Request already submitted");
      const uploaded = await uploadFile(file, saved.requestId);
      ensureActive();
      updateDraft({ evidence: [...evidence.filter(item => item.uri !== uri && item.uri !== recordingUri), uploaded.file], hasDocuments: true });
      try {
        ensureActive();
        const text = await transcribe({ requestId: saved.requestId, attachmentId: uploaded.file.attachmentId as Id<"request_attachments">, locale, consent: true });
        ensureActive();
        return text;
      } catch {
        throw new Error(sw ? "Unukuzi haujapatikana kwa sasa. Rekodi imehifadhiwa kwenye rasimu; jaribu tena au andika jibu lako." : "Transcription is unavailable right now. Your recording is saved in the draft; retry or type your answer.");
      }
    } finally { uploadLock.current = false; if (active.current) setLoading(false); }
  }

  const canContinue =
    (step === 1 && Boolean(draft.issueCategory)) ||
    (step === 2 && draft.description.trim().length >= 10) ||
    (step === 3 && draft.region.trim() && draft.district.trim() && occurredOnIsValid) ||
    (step === 4 && draft.desiredHelp.trim().length >= 3) ||
    step === 5 ||
    step === 6 ||
    (step === 7 && (draft.preferredLanguage !== "other" || draft.preferredLanguageOther.trim().length >= 2)) ||
    step >= 8;

  async function finish() {
    if (!active.current || submitting.current || uploadLock.current || !consentAccepted) return;
    submitting.current = true;
    uploadLock.current = true;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      if (!isSignedIn) {
        await saveDraftForLater();
        ensureActive();
        router.push({ pathname: "/sign-in", params: { returnTo: "intake" } });
        return;
      }
      const saved = await saveRemoteDraft();
      ensureActive();
      if (saved.status === "withdrawn") throw new IntakeFeedbackError(locale === "sw" ? "Ombi hili liliondolewa. Angalia maombi yako kabla ya kuanza ombi jipya." : "This request was withdrawn. Check your requests before starting a new one.");
      let expectedVersion = saved.version;
      if (saved.status === "draft") for (const file of evidence) expectedVersion = (await uploadFile(file, saved.requestId)).version;
      ensureActive();
      if (saved.status === "draft") await submitRequest({ requestId: saved.requestId, expectedVersion, consentVersion: "service-v1" });
      ensureActive();
      setSubmittedRequestId(saved.publicId ?? saved.requestId);
      setSubmittedRecordId(saved.requestId);
      resetDraft(locale);
      try { await clearSavedDraft(); } catch { if (active.current) setCleanupFailed(true); }
    } catch (caught) {
      if (active.current) setError(intakeError(caught, locale, sw ? "Hatukuweza kuthibitisha ombi. Angalia maombi yako kabla ya kujaribu tena." : "We could not confirm the request. Check your requests before retrying."));
    } finally {
      submitting.current = false;
      uploadLock.current = false;
      if (active.current) setLoading(false);
    }
  }

  async function chooseEvidence() {
    if (!active.current) return;
    setError("");
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/jpeg", "image/png", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], copyToCacheDirectory: true, multiple: true });
      ensureActive();
      if (result.canceled) return;
      const files: Evidence[] = [];
      for (const asset of result.assets) {
        const size = asset.size ?? (await (await fetch(asset.uri)).blob()).size;
        ensureActive();
        if (!size || size > 10 * 1024 * 1024) throw new IntakeFeedbackError(sw ? "Chagua faili lenye maudhui na lisilozidi MB 10." : "Choose a non-empty file up to 10 MB.");
        const mimeType = asset.mimeType || (asset.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream");
        if (!evidence.some(file => file.uri === asset.uri)) files.push({ uri: asset.uri, name: asset.name.slice(0, 180), mimeType, size });
      }
      if (evidence.length + files.length > 10) throw new IntakeFeedbackError(sw ? "Chagua hadi faili 10." : "Choose up to 10 files.");
      updateDraft({ evidence: [...evidence, ...files], hasDocuments: true });
    } catch (caught) { if (active.current) setError(intakeError(caught, locale, (sw ? "Faili halijachaguliwa." : "Unable to select a file."))); }
  }

  async function saveForLater() {
    if (!active.current) return;
    setError("");
    setNotice("");
    try {
      await saveDraftForLater();
      ensureActive();
      setNotice(locale === "sw" ? "Rasimu imehifadhiwa kwenye kifaa hiki." : "Draft saved on this device.");
    } catch (caught) {
      if (active.current) setError(intakeError(caught, locale, locale === "sw" ? "Rasimu haijahifadhiwa." : "Draft was not saved."));
    }
  }

  async function restoreDraft(guest = false) {
    if (!active.current) return;
    setError("");
    setNotice("");
    try {
      const restored = guest ? await restoreGuestDraft() : await restoreSavedDraft();
      ensureActive();
      if (restored) setDraftRestored(true);
      setNotice(restored ? (locale === "sw" ? "Rasimu imerejeshwa." : "Draft restored.") : (locale === "sw" ? "Hakuna rasimu iliyohifadhiwa." : "No saved draft found."));
    } catch (caught) {
      if (active.current) setError(intakeError(caught, locale, locale === "sw" ? "Rasimu haijarejeshwa." : "Draft was not restored."));
    }
  }

  if (submittedRequestId) {
    return (
      <Screen style={styles.confirmScreen}>
        {cleanupFailed ? <View><Text accessibilityRole="alert" style={styles.error}>{locale === "sw" ? "Ombi limetumwa. Rasimu iliyohifadhiwa kwenye kifaa haikuondolewa. Usitume ombi tena; tumia namba ya kumbukumbu hapa chini." : "Your request was submitted. The saved draft on this device could not be removed. Do not submit again; use the reference below."}</Text><Button variant="secondary" label={locale === "sw" ? "Jaribu kuondoa rasimu ya kifaa" : "Retry clearing the device draft"} onPress={() => { void clearSavedDraft().then(() => { if (active.current) setCleanupFailed(false); }).catch(() => { if (active.current) setCleanupFailed(true); }); }} /></View> : null}
        <View style={styles.successCard}>
          <View style={styles.successIcon}><Ionicons name="checkmark" size={42} color={colors.surface} /></View>
          <Text style={styles.successTitle}>{locale === "sw" ? "Ombi limepokelewa" : "Request received"}</Text>
          <Text style={styles.successBody}>{locale === "sw" ? "Ombi limetumwa. LSF itakagua taarifa zako. Fuatilia ombi lako kuona hatua inayofuata." : "Request sent. LSF will review your information. Follow your request for the next step."}</Text>
          <View style={styles.requestNumberCard}>
            <Text style={styles.requestNumberLabel}>{locale === "sw" ? "Namba ya ombi" : "Request number"}</Text>
            <Text style={styles.requestNumber}>{submittedRequestId}</Text>
          </View>
          <Button label={locale === "sw" ? "Fuatilia ombi langu" : "Track my request"} onPress={() => router.replace({ pathname: "/request/[id]", params: { id: submittedRecordId } })} />
          <Button label={locale === "sw" ? "Rudi nyumbani" : "Back to home"} variant="secondary" onPress={() => { resetDraft(locale); router.replace("/(tabs)"); }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollRef={scrollRef} footer={<View style={styles.actions}>
      {step < TOTAL_STEPS ? <Button label={t("next")} disabled={!canContinue || loading} onPress={() => { if (step === TOTAL_STEPS - 1) void recordJourney({ surface: "mobile", step: "request_review" }).catch(() => undefined); goStep(step + 1); }} /> : <Button disabled={!consentAccepted || loading} label={isSignedIn ? t("submit") : (locale === "sw" ? "Ingia kutuma ombi" : "Sign in to submit")} loading={loading} onPress={() => void finish()} />}
      <Pressable disabled={loading} accessibilityRole="button" style={styles.saveLater} onPress={() => void saveForLater()}><Ionicons name="bookmark-outline" size={17} color={colors.inkMuted} /><Text style={styles.meta}>{sw ? "Hifadhi, endelea baadaye" : "Save, continue later"}</Text></Pressable>
    </View>}>
      <View style={styles.header}><Pressable disabled={loading} accessibilityRole="button" accessibilityLabel={sw ? "Rudi" : "Back"} style={styles.backButton} onPress={() => step > 1 ? goStep(step - 1) : router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable><Text style={styles.step}>{locale === "sw" ? `Hatua ya ${step} kati ya ${TOTAL_STEPS}` : `Step ${step} of ${TOTAL_STEPS}`}</Text><QuickExit locale={locale} /></View>
      <View accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: TOTAL_STEPS, now: step }} style={styles.progressSegments}>{Array.from({ length: TOTAL_STEPS }, (_, index) => <View key={index} style={[styles.segment, index < step && styles.segmentDone]} />)}</View>
      <Text style={styles.phase}>{sw ? (step <= 2 ? "Tatizo lako" : step <= 5 ? "Maelezo na ushahidi" : step <= 7 ? "Usalama na mawasiliano" : "Kagua na tuma") : (step <= 2 ? "Your situation" : step <= 5 ? "Details and evidence" : step <= 7 ? "Safety and contact" : "Review and submit")}</Text>
      {step === 1 ? IssueStep() : null}
      {step > 1 && selectedIssue ? <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Badilisha aina ya tatizo" : "Change issue type"} style={styles.inlineAction} onPress={() => goStep(1)}><Ionicons name={selectedIssue.icon} size={18} color={colors.teal} /><Text style={styles.meta}>{selectedIssue[locale]}</Text><Ionicons name="create-outline" size={16} color={colors.inkMuted} /></Pressable> : null}
      {step === 2 ? DescriptionStep() : null}
      {step === 3 ? LocationStep() : null}
      {step === 4 ? DesiredHelpStep() : null}
      {step === 5 ? DocumentsStep() : null}
      {step === 6 ? UrgencyStep() : null}
      {step === 7 ? ContactStep() : null}
      {step === 8 ? ReviewStep() : null}
      {step === 1 && hasSavedDraft && !draftRestored ? (
        <Pressable style={styles.restoreCard} onPress={() => void restoreDraft()}>
          <Ionicons name="refresh-outline" size={18} color={colors.burgundy} />
          <Text style={styles.restoreText}>{locale === "sw" ? "Rejesha rasimu iliyohifadhiwa" : "Restore saved draft"}</Text>
        </Pressable>
      ) : null}
      {step === 1 && hasGuestDraft && !draftRestored ? <View style={styles.restoreCard}>
        <View style={{ flex: 1 }}><Text style={styles.restoreText}>{locale === "sw" ? "Rasimu hii iliandaliwa kabla ya kuingia. Ukiitumia, itahifadhiwa kwenye akaunti hii bila kutumwa." : "A draft was created before sign-in. Using it moves it to this account without submitting."}</Text>
        {hasSavedDraft || draft.description || draft.issueCategory ? <Text style={styles.fieldError}>{locale === "sw" ? "Hii itachukua nafasi ya rasimu ya akaunti hii." : "This replaces this account's current draft."}</Text> : null}
        <Button label={locale === "sw" ? "Tumia rasimu ya kabla ya kuingia" : "Use the draft created before sign-in"} variant="secondary" onPress={() => void restoreDraft(true)} /></View>
      </View> : null}
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </Screen>
  );

  function IssueStep() {
    return <View style={styles.section}>
      <Intro title={sw ? "Unahitaji msaada kuhusu nini?" : "What do you need help with?"} body={sw ? "Chagua kinachokaribia tatizo lako. Huhitaji kujua jina la kisheria." : "Choose the closest match. You don't need to know the legal term."} />
      <View style={styles.issueList}>{issueOptions.filter((item, index) => moreIssues || index < 5 || item.id === draft.issueDetail).map(item => {
        const selected = selectedIssue?.id === item.id;
        return <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ checked: selected }} style={[styles.issueOption, selected && styles.issueOptionSelected]} onPress={() => updateDraft({ issueCategory: item.key, issueDetail: item.id })}>
          <Ionicons name={item.icon} size={25} color={selected ? colors.burgundy : colors.teal} /><View style={styles.issueOptionCopy}><Text style={[styles.issueOptionTitle, selected && { color: colors.burgundy }]}>{sw ? item.sw : item.en}</Text><Text style={styles.issueOptionBody}>{sw ? item.swBody : item.enBody}</Text></View><Ionicons name={selected ? "checkmark" : "chevron-forward"} size={20} color={selected ? colors.burgundy : colors.inkMuted} />
        </Pressable>;
      })}</View>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: moreIssues }} style={styles.inlineAction} onPress={() => setMoreIssues(!moreIssues)}><Text style={styles.saadaHelpTitle}>{moreIssues ? (sw ? "Onyesha chache" : "Show fewer") : (sw ? "Kazi, nyumba, fedha na mengine" : "Work, housing, money and more")}</Text><Ionicons name={moreIssues ? "chevron-up" : "chevron-down"} size={18} color={colors.teal} /></Pressable>
      <Pressable style={styles.saadaHelp} onPress={() => router.push("/sara")}><Ionicons name="sparkles-outline" size={20} color={colors.teal} /><View style={styles.issueOptionCopy}><Text style={styles.saadaHelpTitle}>{sw ? "Huna uhakika? Haki Yangu AI" : "Not sure? Haki Yangu AI"}</Text><Text style={styles.saadaHelpBody}>{sw ? "Pata maelezo kabla ya kuchagua." : "Get guidance before choosing."}</Text></View><Ionicons name="arrow-forward" size={18} color={colors.teal} /></Pressable>
    </View>;
  }

  function Intro({ title, body }: { title: string; body: string }) {
    const pose = (["welcome", "voice", "location", "direction", "documents", "safety", "contact", "review"] as const)[step - 1] ?? "welcome";
    return <View style={styles.intro}><View style={styles.introTop}><Text style={[styles.title, { flex: 1 }]}>{title}</Text><CivicIllustration pose={pose} size={104} /></View><Text style={styles.body}>{body}</Text></View>;
  }

  function DescriptionStep() {
    return <View style={styles.section}><Intro title={t("whatHappened")} body={t("ownWords")} /><TextInput accessibilityLabel={t("whatHappened")} multiline textAlignVertical="top" value={draft.description} onChangeText={(description) => updateDraft({ description, locale })} maxLength={5000} placeholder={sw ? "Nini kilitokea? Nani alihusika? Kimekuathiri vipi?" : "What happened? Who was involved? How has it affected you?"} placeholderTextColor={colors.inkMuted} style={styles.textArea} /><Text style={styles.counter}>{draft.description.length}/5000</Text><IntakeVoice sw={sw} disabled={loading} onTranscribe={transcribeRecording} onText={text => updateDraft({ description: [draft.description.trim(), text].filter(Boolean).join("\n\n").slice(0, 5000) })} />{AttachmentList(false)}<View style={styles.privacy}><Ionicons name="lock-closed-outline" size={18} color={colors.teal} /><Text style={styles.privacyText}>{sw ? "Eleza unachojua. Usiongeze taarifa zisizohitajika." : "Describe what you know. Leave out unnecessary personal details."}</Text></View></View>;
  }

  function LocationStep() {
    const districts = districtOptions(draft.region, services ?? [], draft.district);
    return <View style={styles.section}><Intro title={sw ? "Maelezo ya tatizo" : "Details of the problem"} body={sw ? "Tatizo limetokea au linaendelea wapi? Si lazima pawe unapoishi." : "Where is the problem happening, or where did it happen? You need not live there."} />
      <IntakeSelect label={sw ? "Mkoa wa tukio" : "Region of the problem"} placeholder={sw ? "Mkoa tatizo lilipotokea" : "Region where it happened"} value={draft.region} options={regionOptions} onChange={region => updateDraft({ region, district: "" })} sw={sw} />
      <IntakeSelect label={sw ? "Wilaya ya tukio" : "District of the problem"} placeholder={!draft.region ? (sw ? "Weka mkoa kwanza" : "Set a region first") : (sw ? "Wilaya tatizo lilipotokea" : "District where it happened")} disabled={!draft.region} value={draft.district} options={districts} onChange={district => updateDraft({ district })} sw={sw} allowCustom />
      <IntakeDate value={draft.occurredOn} onChange={occurredOn => updateDraft({ occurredOn })} sw={sw} />
      {!occurredOnIsValid ? <Text style={styles.fieldError}>{sw ? "Chagua tarehe tena." : "Please select the date again."}</Text> : null}
      <Field label={sw ? "Mtu au taasisi iliyohusika (si lazima)" : "Person or organisation involved (optional)"} value={draft.involvedParties} onChangeText={involvedParties => updateDraft({ involvedParties })} />
    </View>;
  }

  function DesiredHelpStep() {
    return <View style={styles.section}><Intro title={sw ? "Ungependa msaada gani?" : "What help are you looking for?"} body={sw ? "Ungependa nini kibadilike? Unaweza kuchagua mwanzo wa jibu au kueleza mwenyewe." : "What would you like to change? Choose a starting point or describe it yourself."} />
      <IntakeSelect label={sw ? "Ungependa msaada gani?" : "What kind of support would you like?"} value={draft.helpGoal ?? ""} options={helpGoals.map(goal => ({ value: goal.value, label: goal[locale] }))} onChange={helpGoal => updateDraft({ helpGoal, desiredHelp: helpGoals.find(goal => goal.value === helpGoal)?.[locale] ?? draft.desiredHelp })} sw={sw} />
      <Pressable accessibilityRole="button" style={styles.inlineAction} onPress={() => router.push({ pathname: "/find-services", params: { issue: draft.issueCategory ?? "", goal: draft.helpGoal ?? "", region: draft.region, district: draft.district } })}><Ionicons name="search-outline" size={20} color={colors.teal} /><Text style={styles.saadaHelpTitle}>{sw ? "Tazama huduma za msaada huu" : "See services for this support"}</Text><Ionicons name="arrow-forward" size={18} color={colors.teal} /></Pressable>
      <TextInput accessibilityLabel={sw ? "Msaada unaotaka" : "Help you want"} multiline textAlignVertical="top" value={draft.desiredHelp} onChangeText={desiredHelp => updateDraft({ desiredHelp })} maxLength={1000} placeholder={sw ? "Ningependa msaada wa..." : "I would like help with..."} placeholderTextColor={colors.inkMuted} style={styles.textArea} /><IntakeVoice sw={sw} disabled={loading} onTranscribe={transcribeRecording} onText={text => updateDraft({ desiredHelp: [draft.desiredHelp.trim(), text].filter(Boolean).join("\n\n").slice(0, 1000) })} />{AttachmentList(false)}</View>;
  }

  function DocumentsStep() {
    return <View style={styles.section}><Intro title={sw ? "Ushahidi unaoweza kusaidia" : "Evidence that may help"} body={sw ? "Si lazima. Hati na rekodi ulizoongeza tayari zimeorodheshwa hapa." : "Optional. Documents and recordings you already added are listed here."} />{AttachmentList(true)}<View style={styles.privacy}><Ionicons name="eye-off-outline" size={18} color={colors.teal} /><Text style={styles.privacyText}>{sw ? "Usipakie chochote kinachoweza kukuongeza hatarini. Unaweza kutoa ushahidi baadaye." : "Do not upload anything that could put you at risk. You can provide evidence later."}</Text></View></View>;
  }

  function AttachmentList(showUpload: boolean) {
    const remoteOnly = serverDraft?.attachments.filter(item => !evidence.some(file => file.attachmentId === item._id)) ?? [];
    return <View style={styles.attachmentList}>
      <Pressable disabled={loading} accessibilityRole="button" style={styles.inlineAction} onPress={() => void chooseEvidence()}><Ionicons name="attach-outline" size={22} color={colors.teal} /><Text style={styles.saadaHelpTitle}>{sw ? "Ongeza hati au picha" : "Attach a document or photo"}</Text></Pressable>
      {evidence.map(file => { const state = uploadState[file.uri]; const uploaded = !!file.attachmentId; return <View key={file.uri} style={styles.attachment}><View style={styles.inlineAction}><Ionicons name={uploaded ? "checkmark-circle" : state && !state.error ? "cloud-upload-outline" : "document-outline"} size={22} color={uploaded ? colors.teal : colors.burgundy} /><View style={{ flex: 1 }}><Text numberOfLines={2} style={styles.issueOptionTitle}>{file.name}</Text><Text style={styles.meta}>{Math.ceil(file.size / 1024)} KB · {uploaded ? (sw ? "Imepakiwa kwenye rasimu" : "Uploaded to draft") : state?.error ? (sw ? "Haijapakiwa · jaribu tena" : "Not uploaded · retry") : state ? `${sw ? "Inapakia" : "Uploading"} ${state.percent}%` : (sw ? "Imechaguliwa · bado haijapakiwa" : "Selected · not uploaded yet")}</Text></View>{!uploaded && !loading ? <Pressable style={styles.backButton} accessibilityLabel={(sw ? "Ondoa " : "Remove ") + file.name} onPress={() => updateDraft({ evidence: evidence.filter(item => item.uri !== file.uri) })}><Ionicons name="close" size={20} color={colors.inkMuted} /></Pressable> : null}</View>{state && !state.error && !uploaded ? <View style={styles.progressTrack}><View style={[styles.progress, { width: `${state.percent}%` }]} /></View> : null}{state?.error ? <Text style={styles.error}>{state.error}</Text> : null}</View>; })}
      {remoteOnly.map(file => <View key={file._id} style={styles.attachment}><View style={styles.inlineAction}><Ionicons name="checkmark-circle" size={22} color={colors.teal} /><View style={{ flex: 1 }}><Text style={styles.issueOptionTitle}>{file.name}</Text><Text style={styles.meta}>{sw ? "Imepakiwa kwenye rasimu" : "Uploaded to draft"}</Text></View></View></View>)}
      {showUpload ? <><Text style={styles.meta}>{sw ? "Hadi faili 10, MB 10 kila moja. PDF, picha, Word au maandishi. Kupakia huhifadhi rasimu; hakutumi ombi." : "Up to 10 files, 10 MB each. PDF, images, Word or text. Uploading saves a draft; it does not submit your request."}</Text>{evidence.some(file => !file.attachmentId) ? <Button label={sw ? "Pakia faili kwenye rasimu" : "Upload files to draft"} loading={loading} onPress={() => Alert.alert(sw ? "Pakia kwenye rasimu?" : "Upload to draft?", sw ? "Faili na maelezo yako yatahifadhiwa kwenye akaunti yako. Ombi halitatumwa mpaka ulipitie na ukubali kutuma." : "Your files and answers will be saved to your account. Your request is not submitted until you review and consent.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Pakia" : "Upload", onPress: () => void uploadSelected() }])} /> : null}</> : null}
    </View>;
  }

  function UrgencyStep() {
    return (
      <View style={styles.section}>
        <Intro title={sw ? "Una uharaka kiasi gani?" : "How urgent is this?"} body={sw ? "Chagua hali yako sasa. Hii haihakikishi muda wa kupata jibu." : "Choose your current situation. This does not guarantee a response time."} />
        <Choice label={sw ? "Naweza kusubiri mwongozo" : "I can wait for guidance"} body={sw ? "Hakuna hatari ya sasa au muda wa karibu unaoisha." : "No immediate danger or approaching deadline."} selected={draft.urgency === "standard"} onPress={() => updateDraft({ urgency: "standard" })} />
        <Choice label={sw ? "Nahitaji msaada mapema" : "I need help soon"} body={sw ? "Kuna muda unaoisha au hali inayozidi kuwa ngumu." : "There is a deadline or a worsening situation."} selected={draft.urgency === "urgent"} onPress={() => updateDraft({ urgency: "urgent" })} />
        <Choice label={sw ? "Usalama wangu uko hatarini sasa" : "My safety is at risk now"} body={sw ? "Kuna tishio au madhara yanayoendelea." : "There is a current threat or ongoing harm."} selected={draft.urgency === "immediate_safety"} onPress={() => updateDraft({ urgency: "immediate_safety" })} danger />
        {draft.urgency === "immediate_safety" ? (
          <View style={styles.safetyNotice}><Ionicons name="warning-outline" size={22} color={colors.danger} /><Text style={styles.safetyText}>{locale === "sw" ? "Haki Yangu si huduma ya dharura. Ikiwa uko kwenye hatari ya sasa, nenda mahali salama na wasiliana na huduma rasmi ya dharura iliyo karibu." : "Haki Yangu is not an emergency service. If you are in immediate danger, move to a safe place and contact an official local emergency service."}</Text></View>
        ) : null}
        {draft.urgency === "immediate_safety" ? <Button variant="secondary" label={sw ? "Namba za msaada wa dharura" : "Emergency support numbers"} onPress={() => router.push("/safety")} /> : null}
      </View>
    );
  }

  function ContactStep() {
    return (
      <View style={styles.section}>
        <Intro title={sw ? "Tuwasiliane kwa usalama" : "Let's contact you safely"} body={sw ? "Chagua njia moja salama na lugha ya msaada. Unaweza kufuatilia ombi ndani ya programu." : "Choose one safe contact method and your support language. You can track the request in the app."} />
        <IntakeSelect label={sw ? "Lugha ya msaada" : "Support language"} value={draft.preferredLanguage} options={(["sw", "en", "both", "other"] as const).map(value => ({ value, label: value === "other" && sw ? "Lugha nyingine" : languageLabel(value) }))} onChange={value => updateDraft({ preferredLanguage: value as IntakeDraft["preferredLanguage"] })} sw={sw} />
        {draft.preferredLanguage === "other" ? (
          <Field
            label={locale === "sw" ? "Andika lugha" : "Enter language"}
            value={draft.preferredLanguageOther}
            onChangeText={(preferredLanguageOther) => updateDraft({ preferredLanguageOther })}
          />
        ) : null}
        <IntakeSelect label={sw ? "Njia salama ya kupata taarifa" : "Safe way to receive updates"} value={draft.safeContactMethod} options={(["in_app", "phone", "sms", "email", "none"] as const).map(value => ({ value, label: contactLabel(value, locale) }))} onChange={value => updateDraft({ safeContactMethod: value as IntakeDraft["safeContactMethod"] })} sw={sw} />
        <Text style={styles.body}>{draft.safeContactMethod === "in_app" ? (sw ? "Ujumbe ndani ya programu pekee; hakuna simu, SMS au barua pepe." : "App messages only; no calls, SMS or email.") : draft.safeContactMethod === "none" ? (sw ? "Usiwasiliane nami. Nitaangalia maendeleo mwenyewe ndani ya programu." : "Do not contact me. I will check progress in the app myself.") : (sw ? "LSF itatumia mawasiliano ya akaunti yako. Hakikisha ni sahihi na salama kwenye wasifu." : "LSF will use your account contact details. Check that they are correct and safe in your profile.")}</Text>
      </View>
    );
  }

  function ReviewStep() {
    return (
      <View style={styles.section}>
        <Intro title={sw ? "Kagua kabla ya kutuma" : "Review before sending"} body={sw ? "LSF itapokea maelezo na ushahidi uliochagua. Hariri chochote kisicho sahihi." : "LSF will receive the details and evidence you selected. Edit anything that isn't right."} />
        <View style={styles.reviewPanel}>
          <ReviewRow label={sw ? "Tatizo" : "Issue"} value={selectedIssue ? selectedIssue[locale] : (sw ? "Msaada wa kisheria" : "Legal help")} onEdit={() => goStep(1)} locale={locale} />
          {draft.sourceServiceId ? <ReviewRow icon="business-outline" label={locale === "sw" ? "Kutoka Tafuta Msaada" : "From Find Help"} value={locale === "sw" ? "Huduma uliyochagua imeunganishwa na ombi" : "Your selected service is linked to this request"} /> : null}
          <ReviewRow label={t("whatHappened")} value={draft.description} onEdit={() => goStep(2)} locale={locale} />
          <ReviewRow label={sw ? "Eneo la tatizo" : "Location of the problem"} value={`${draft.district}, ${draft.region}`} onEdit={() => goStep(3)} locale={locale} />
          <ReviewRow label={sw ? "Tarehe ya tukio" : "Event date"} value={draft.occurredOn ? occurredDate.toLocaleDateString(sw ? "sw-TZ" : "en-GB", { day: "numeric", month: "long", year: "numeric" }) : (sw ? "Haijawekwa" : "Not provided")} onEdit={() => goStep(3)} locale={locale} />
          {draft.involvedParties ? <ReviewRow label={sw ? "Waliohusika" : "Involved"} value={draft.involvedParties} onEdit={() => goStep(3)} locale={locale} /> : null}
          <ReviewRow label={sw ? "Msaada" : "Requested help"} value={draft.desiredHelp} onEdit={() => goStep(4)} locale={locale} />
          <ReviewRow label={sw ? "Ushahidi" : "Evidence"} value={[...new Set([...evidence.map(file => file.name + (file.attachmentId ? "" : (sw ? " · itapakiwa wakati wa kutuma" : " · uploads when submitted"))), ...(serverDraft?.attachments.map(file => file.name) ?? [])])].join("\n") || (sw ? "Hakuna kwa sasa" : "None yet")} onEdit={() => goStep(5)} locale={locale} />
          <ReviewRow label={sw ? "Lugha" : "Language"} value={languageLabel(draft.preferredLanguage, draft.preferredLanguageOther)} onEdit={() => goStep(7)} locale={locale} />
          <ReviewRow label={sw ? "Mawasiliano" : "Safe contact"} value={contactLabel(draft.safeContactMethod, locale)} onEdit={() => goStep(7)} locale={locale} />
        </View>
        <ReviewRow label={sw ? "Uharaka" : "Urgency"} value={urgencyLabel(draft.urgency, locale)} onEdit={() => goStep(6)} locale={locale} />
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: consentAccepted }} onPress={() => setConsentAccepted(!consentAccepted)} style={styles.confirmCheck}>
          <Ionicons name={consentAccepted ? "checkbox" : "square-outline"} size={24} color={colors.burgundy} />
          <Text style={styles.confirmCheckText}>{locale === "sw" ? "Ninaomba LSF ikague taarifa nilizochagua kutuma na iwasiliane nami kwa njia salama niliyochagua. Nimeeleza ninachojua kwa uaminifu." : "I ask LSF to review the information I choose to send and contact me through my selected safe method. I have described what I know honestly."}</Text>
        </Pressable>
        <View style={styles.consent}><Ionicons name="lock-closed-outline" size={19} color={colors.inkMuted} /><Text style={styles.consentText}>{sw ? "Baada ya kutuma, utaona namba ya ombi na kufuatilia maendeleo kwenye ‘Kesi yangu’." : "After sending, you'll receive a reference and can track progress in My cases."}</Text></View>
      </View>
    );
  }
}

function urgencyLabel(urgency: "standard" | "urgent" | "immediate_safety", locale: "sw" | "en") {
  const labels = {
    sw: { standard: "Kawaida", urgent: "Haraka", immediate_safety: "Hatari sasa" },
    en: { standard: "Standard", urgent: "Urgent", immediate_safety: "Safety now" },
  };
  return labels[locale][urgency];
}

function languageLabel(language: "sw" | "en" | "both" | "other", otherLanguage = "") {
  if (language === "other" && otherLanguage.trim()) return otherLanguage.trim();
  const labels = {
    sw: "Kiswahili",
    en: "English",
    both: "Kiswahili + English",
    other: "Other",
  };
  return labels[language];
}

function contactLabel(method: "in_app" | "phone" | "sms" | "email" | "none", locale: "sw" | "en") {
  const labels = {
    sw: { in_app: "Ujumbe ndani ya programu", phone: "Simu", sms: "Ujumbe mfupi (SMS)", email: "Barua pepe", none: "Usiwasiliane nami" },
    en: { in_app: "Messages in the app", phone: "Phone call", sms: "Text message (SMS)", email: "Email", none: "Do not contact me" },
  };
  return labels[locale][method];
}

function Field({ label, value, onChangeText, autoCorrect }: { label: string; value: string; onChangeText: (value: string) => void; autoCorrect?: boolean }) {
  return <View><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} autoCorrect={autoCorrect} style={styles.input} maxLength={100} /></View>;
}

function Choice({ label, body, selected, onPress, danger = false }: { label: string; body?: string; selected: boolean; onPress: () => void; danger?: boolean }) {
  return <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={onPress} style={[styles.choice, selected && styles.choiceSelected, danger && selected && styles.choiceDanger]}><Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={22} color={danger && selected ? colors.danger : colors.burgundy} /><View style={{ flex: 1 }}><Text style={styles.choiceText}>{label}</Text>{body ? <Text style={styles.issueOptionBody}>{body}</Text> : null}</View></Pressable>;
}

function ReviewRow({ label, value, icon, onEdit, locale }: { label: string; value: string; icon?: keyof typeof Ionicons.glyphMap; onEdit?: () => void; locale?: "sw" | "en" }) {
  return <View style={styles.review}><View style={styles.reviewHeading}><Text style={styles.reviewLabel}>{label}</Text>{onEdit ? <Pressable accessibilityRole="button" accessibilityLabel={`${locale === "sw" ? "Hariri" : "Edit"} ${label}`} onPress={onEdit} style={styles.editReview}><Ionicons name="pencil-outline" size={18} color={colors.burgundy} /></Pressable> : null}</View><Text style={styles.reviewValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  backButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  progressSegments: { flexDirection: "row", gap: 5, marginTop: 16 },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: "#ECEEEE" },
  segmentDone: { backgroundColor: colors.burgundy },
  phase: { fontFamily: type.regular, fontSize: 12, color: colors.inkMuted, marginTop: 12 },
  intro: { gap: 14 }, introTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  illustration: { width: 104, height: 104, overflow: "hidden" },
  inlineAction: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 48 },
  attachmentList: { gap: 12 },
  attachment: { backgroundColor: "#F3F5F4", padding: 14, borderRadius: 8, gap: 8 },
  reviewHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  step: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13 },
  progressTrack: { height: 4, borderRadius: radius.pill, backgroundColor: colors.line, marginTop: spacing.lg },
  progress: { height: 4, borderRadius: radius.pill, backgroundColor: colors.burgundy },
  section: { marginTop: spacing.xl, gap: spacing.lg },
  stepSymbol: { width: 54, height: 54, borderRadius: 19, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: type.semibold, color: colors.charcoal, fontSize: 26, lineHeight: 33, letterSpacing: 0 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 22 },
  textArea: { minHeight: 180, borderRadius: 8, backgroundColor: "#F3F5F4", padding: spacing.lg, fontFamily: type.regular, color: colors.charcoal, fontSize: 16, lineHeight: 25 },
  counter: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, textAlign: "right", marginTop: -spacing.md },
  privacy: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start", paddingVertical: spacing.md },
  privacyText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, marginBottom: spacing.sm },
  input: { minHeight: 52, borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.lg, fontFamily: type.regular, color: colors.charcoal },
  choice: { minHeight: 88, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg, borderRadius: 8, backgroundColor: "#F5F7F6" },
  choiceSelected: { backgroundColor: "#EDF4F2" },
  choiceDanger: { backgroundColor: "#FCF0ED" },
  choiceText: { fontFamily: type.medium, color: colors.charcoal, fontSize: 15, lineHeight: 23 },
  issueList: { gap: 0 },
  issueOption: { minHeight: 88, flexDirection: "row", alignItems: "center", gap: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, paddingVertical: 17, paddingHorizontal: 4 },
  issueOptionSelected: { borderBottomColor: colors.burgundy },
  issueOptionIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" },
  issueOptionIconSelected: { backgroundColor: "rgba(255,255,255,0.16)" },
  issueOptionCopy: { flex: 1 },
  issueOptionTitle: { fontFamily: type.medium, color: colors.ink, fontSize: 16, lineHeight: 23 },
  issueOptionTitleSelected: { color: colors.surface },
  issueOptionBody: { marginTop: 4, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  issueOptionBodySelected: { color: "#F8DCE6" },
  saadaHelp: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: 8, backgroundColor: "#F0F6F5", padding: spacing.md },
  saadaHelpTitle: { fontFamily: type.bold, color: colors.teal, fontSize: 14 },
  saadaHelpBody: { marginTop: 2, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  uploadCard: { gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.softPink, borderWidth: 1, borderColor: "#E8B8CC" },
  meta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  chipSelected: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  chipText: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13 },
  chipTextSelected: { color: colors.burgundy },
  safetyNotice: { flexDirection: "row", gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, backgroundColor: "#FDEDEC" },
  safetyText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  reviewPanel: { gap: 18 },
  review: { gap: 4, paddingVertical: 4 },
  reviewLabel: { flex: 1, fontFamily: type.medium, color: colors.inkMuted, fontSize: 13 },
  reviewValue: { fontFamily: type.regular, color: colors.charcoal, fontSize: 16, lineHeight: 25 },
  editReview: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
  editReviewText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  urgencyRow: { flexDirection: "row", gap: spacing.sm },
  urgencyChip: { flex: 1, minHeight: 42, borderRadius: radius.pill, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  urgencyChipActive: { backgroundColor: colors.burgundy },
  urgencyText: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
  urgencyTextActive: { color: colors.surface },
  confirmCheck: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md },
  confirmCheckText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  consent: { flexDirection: "row", gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: "#F7F5F6", alignItems: "center" },
  consentText: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 18 },
  restoreCard: { marginTop: spacing.xl, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: "#E8B8CC", backgroundColor: colors.softPink, padding: spacing.md },
  restoreText: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
  notice: { fontFamily: type.medium, fontWeight: "500", color: colors.success, marginTop: spacing.lg, textAlign: "center" },
  actions: { gap: spacing.xs },
  saveLater: { minHeight: 48, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center" },
  error: { fontFamily: type.regular, color: colors.danger, marginTop: spacing.lg },
  fieldError: { marginTop: -spacing.md, fontFamily: type.regular, color: colors.danger, fontSize: 12, lineHeight: 17 },
  confirmScreen: { justifyContent: "center", paddingTop: spacing.xxl },
  successCard: { alignItems: "center", gap: 24, paddingVertical: 32 },
  confettiRow: { flexDirection: "row", gap: spacing.lg, height: 16 },
  confettiDot: { color: colors.orange, fontSize: 26, lineHeight: 19 },
  confettiDotAlt: { color: colors.teal, fontSize: 26, lineHeight: 19 },
  successIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  successTitle: { fontFamily: type.semibold, color: colors.charcoal, fontSize: 28, lineHeight: 36, textAlign: "center" },
  successBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 16, lineHeight: 25, textAlign: "center" },
  requestNumberCard: { alignSelf: "stretch", borderRadius: 8, backgroundColor: "#F3F5F4", padding: spacing.lg, alignItems: "center", gap: spacing.xs },
  requestNumberLabel: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13 },
  requestNumber: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 18 },
});
