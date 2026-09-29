import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { caseStatusLabels } from "../../src/caseLabels";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { enqueuePendingAction, markPendingActionFailed, removePendingAction, shouldQueueError, usePendingActions, type PendingAction } from "../../src/pendingActions";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

type CaseTab = "timeline" | "messages" | "documents" | "appointments" | "referrals" | "tasks" | "feedback";
const caseTabs: CaseTab[] = ["timeline", "messages", "documents", "appointments", "referrals", "tasks", "feedback"];
type DocumentCategory = "evidence" | "identity" | "contract" | "letter" | "receipt" | "other";
type AppointmentMode = "in_person" | "phone" | "remote";
type ReviewReason = "reassignment" | "service_concern" | "safety_concern" | "other";

const documentCategories: Array<{ value: DocumentCategory; sw: string; en: string }> = [
  { value: "evidence", sw: "Ushahidi", en: "Evidence" },
  { value: "identity", sw: "Kitambulisho", en: "Identity" },
  { value: "contract", sw: "Mkataba", en: "Contract" },
  { value: "letter", sw: "Barua", en: "Letter" },
  { value: "receipt", sw: "Risiti", en: "Receipt" },
  { value: "other", sw: "Nyingine", en: "Other" },
];

const eventLabels: Record<string, { sw: string; en: string }> = {
  case_created: { sw: "Ombi limepitiwa na kesi imefunguliwa", en: "Your request was reviewed and a case was opened" },
  assignment_accepted: { sw: "Msaidizi wa kisheria amepatikana", en: "A legal support worker was assigned" },
  case_status_changed: { sw: "Hatua ya kesi imebadilika", en: "The case status changed" },
  appointment_requested: { sw: "Umeomba miadi", en: "You requested an appointment" },
  appointment_created: { sw: "Miadi imepangwa", en: "An appointment was scheduled" },
  appointment_completed: { sw: "Miadi imekamilika", en: "The appointment was completed" },
  appointment_cancelled: { sw: "Miadi imefutwa", en: "The appointment was cancelled" },
  appointment_missed: { sw: "Miadi haikufanyika", en: "The appointment was marked no-show" },
  case_resolved: { sw: "Matokeo yamerekodiwa", en: "An outcome was recorded" },
  feedback_requested: { sw: "LSF imeomba maoni yako", en: "LSF requested your feedback" },
  feedback_received: { sw: "Maoni yako yamepokelewa", en: "Your feedback was received" },
  referral_created: { sw: "Rufaa imeundwa", en: "A referral was created" },
  referral_consent_requested: { sw: "Uamuzi wako kuhusu rufaa unahitajika", en: "Your referral decision is needed" },
  referral_onward_consent_requested: { sw: "Rufaa nyingine inahitaji uamuzi wako", en: "An onward referral needs your decision" },
  referral_consent_approved: { sw: "Umeidhinisha rufaa", en: "You approved the referral" },
  referral_consent_declined: { sw: "Umekataa rufaa", en: "You declined the referral" },
  referral_accepted: { sw: "Rufaa imekubaliwa", en: "The referral was accepted" },
  referral_declined: { sw: "Rufaa imekataliwa", en: "The referral was declined" },
  referral_scheduled: { sw: "Huduma ya rufaa imepangwa", en: "The referral service was scheduled" },
  referral_service_delivered: { sw: "Huduma ya rufaa imetolewa", en: "The referral service was delivered" },
  referral_referred_onward: { sw: "Rufaa imeelekezwa huduma nyingine", en: "The referral was sent onward" },
  referral_closed: { sw: "Rufaa imefungwa", en: "The referral was closed" },
  referral_returned: { sw: "Rufaa imerudishwa kwa LSF", en: "The referral was returned to LSF" },
  referral_escalated: { sw: "Rufaa imepandishwa kwa hatua ya juu", en: "The referral was escalated" },
};

const appointmentStatusLabels: Record<string, { sw: string; en: string }> = {
  scheduled: { sw: "Imepangwa", en: "Scheduled" },
  completed: { sw: "Imekamilika", en: "Completed" },
  cancelled: { sw: "Imefutwa", en: "Cancelled" },
  missed: { sw: "Haikufanyika", en: "No-show" },
};

const outcomeLabels: Record<string, { sw: string; en: string }> = {
  advice_given: { sw: "Ushauri umetolewa", en: "Advice given" },
  document_prepared: { sw: "Nyaraka zimeandaliwa", en: "Document prepared" },
  mediation_supported: { sw: "Usuluhishi umesaidiwa", en: "Mediation supported" },
  referred_to_lawyer: { sw: "Imeelekezwa kwa wakili", en: "Referred to lawyer" },
  beneficiary_withdrew: { sw: "Mnufaika alisitisha", en: "Beneficiary withdrew" },
  other: { sw: "Matokeo mengine", en: "Other outcome" },
};

const appointmentModes: Array<{ value: AppointmentMode; icon: keyof typeof Ionicons.glyphMap; sw: string; en: string }> = [
  { value: "phone", icon: "call-outline", sw: "Simu", en: "Phone" },
  { value: "remote", icon: "videocam-outline", sw: "Mtandaoni", en: "Remote" },
  { value: "in_person", icon: "location-outline", sw: "Ana kwa ana", en: "In person" },
];

const reviewReasons: Array<{ value: ReviewReason; sw: string; en: string }> = [
  { value: "reassignment", sw: "Nahitaji msaidizi mwingine", en: "I need a different helper" },
  { value: "service_concern", sw: "Nina wasiwasi kuhusu huduma", en: "I have a service concern" },
  { value: "safety_concern", sw: "Nina wasiwasi wa usalama", en: "I have a safety concern" },
  { value: "other", sw: "Sababu nyingine", en: "Another reason" },
];

function formatDate(timestamp?: number, locale: "sw" | "en" = "en") {
  if (!timestamp) return locale === "sw" ? "Haijapangwa" : "Not scheduled";
  return new Date(timestamp).toLocaleString(locale === "sw" ? "sw-TZ" : "en-TZ", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function nextStep(status: keyof typeof caseStatusLabels.en, locale: "sw" | "en") {
  const labels = {
    sw: {
      under_review: "Timu ya LSF inapitia maelezo yako.",
      waiting_for_information: "Tafadhali jibu ujumbe au ongeza taarifa utakazoombwa.",
      assignment_pending: "Tunatafuta msaidizi sahihi wa kisheria.",
      assigned: "Unaweza kuwasiliana na msaidizi wako kupitia ujumbe.",
      appointment_scheduled: "Jiandae kwa miadi yako na weka nyaraka karibu.",
      referred: "Fuata maelekezo ya rufaa uliyopokea.",
      assistance_underway: "Msaada unaendelea. Endelea kufuatilia hatua.",
      resolved: "Kesi imepata matokeo. Toa maoni yako ili kuboresha huduma.",
      closed_unresolved: "Kesi imefungwa bila kutatuliwa. Wasiliana na LSF kama bado unahitaji msaada.",
      closed: "Kesi imefungwa.",
    },
    en: {
      under_review: "LSF is reviewing your information.",
      waiting_for_information: "Please respond to any message or information request.",
      assignment_pending: "We are matching you with the right legal support worker.",
      assigned: "You can message your assigned support worker.",
      appointment_scheduled: "Prepare for your appointment and keep documents nearby.",
      referred: "Follow the referral guidance you received.",
      assistance_underway: "Support is underway. Keep tracking each step.",
      resolved: "An outcome has been recorded. Your feedback helps improve the service.",
      closed_unresolved: "The case was closed unresolved. Contact LSF if you still need help.",
      closed: "This case is closed.",
    },
  };
  return labels[locale][status];
}

function closureCopy(status: keyof typeof caseStatusLabels.en, hasFeedback: boolean, locale: "sw" | "en") {
  if (status === "closed_unresolved") {
    return {
      title: locale === "sw" ? "Kesi imefungwa bila kutatuliwa" : "Case closed unresolved",
      body: locale === "sw"
        ? "LSF imefunga kesi hii bila matokeo kamili. Ikiwa bado unahitaji msaada, tumia sehemu ya maoni kuomba timu ya LSF ipitie."
        : "LSF closed this case without a full resolution. If you still need help, use the review section to ask the LSF team to look again.",
      icon: "alert-circle-outline" as const,
    };
  }
  if (status === "closed") {
    return {
      title: locale === "sw" ? "Kesi imefungwa" : "Case closed",
      body: hasFeedback
        ? (locale === "sw" ? "Matokeo yamehifadhiwa na maoni yako yamepokelewa." : "The outcome is saved and your feedback has been received.")
        : (locale === "sw" ? "Matokeo yamehifadhiwa. Tafadhali toa maoni yako kuhusu huduma uliyopokea." : "The outcome is saved. Please rate the support you received."),
      icon: "lock-closed-outline" as const,
    };
  }
  return {
    title: locale === "sw" ? "Matokeo yamerekodiwa" : "Outcome recorded",
    body: hasFeedback
      ? (locale === "sw" ? "Asante. Maoni yako yamepokelewa." : "Thank you. Your feedback has been received.")
      : (locale === "sw" ? "Tafadhali kagua matokeo na utume maoni yako." : "Please review the outcome and submit your feedback."),
    icon: "checkmark-circle-outline" as const,
  };
}

export default function CaseDetailScreen() {
  useSensitiveScreenProtection("case-detail");
  const { id, section } = useLocalSearchParams<{ id: string; section?: CaseTab }>();
  const caseId = id as Id<"cases">;
  const { locale } = useLanguage();
  const details = useQuery(api.caseManagement.getCase, { caseId });
  const messages = useQuery(api.caseManagement.listMessages, { caseId });
  const documents = useQuery(api.caseManagement.listDocuments, { caseId });
  const referrals = useQuery(api.referrals.listForCase, { caseId });
  const updateReferralStatus = useMutation(api.referrals.updateStatus);
  const sendMessage = useMutation(api.caseManagement.sendMessage);
  const sendVoiceMessage = useMutation(api.caseManagement.sendVoiceMessage);
  const generateVoiceMessageUploadUrl = useMutation(api.caseManagement.generateVoiceMessageUploadUrl);
  const submitFeedback = useMutation(api.caseManagement.submitFeedback);
  const generateDocumentUploadUrl = useMutation(api.caseManagement.generateDocumentUploadUrl);
  const addDocument = useMutation(api.caseManagement.addDocument);
  const reviewDocumentMutation = useMutation(api.caseManagement.reviewDocument);
  const requestAppointmentMutation = useMutation(api.caseManagement.requestAppointment);
  const scheduleAppointmentMutation = useMutation(api.caseManagement.scheduleAppointment);
  const requestCaseReviewMutation = useMutation(api.caseManagement.requestCaseReview);
  const recordOutcomeMutation = useMutation(api.caseManagement.recordOutcome);
  const completeTask = useMutation(api.caseManagement.completeTask);
  const createTaskMutation = useMutation(api.caseManagement.createTask);
  const [message, setMessage] = useState("");
  const [feedbackComment, setFeedbackComment] = useState("");
  const [outcomeCode, setOutcomeCode] = useState("advice_given");
  const [outcomeSummary, setOutcomeSummary] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskNote, setTaskNote] = useState("");
  const [documentNote, setDocumentNote] = useState("");
  const [documentCategory, setDocumentCategory] = useState<DocumentCategory>("evidence");
  const [appointmentMode, setAppointmentMode] = useState<AppointmentMode>("phone");
  const [appointmentPreferredTime, setAppointmentPreferredTime] = useState("");
  const [appointmentNote, setAppointmentNote] = useState("");
  const [appointmentStart, setAppointmentStart] = useState("");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [reviewReason, setReviewReason] = useState<ReviewReason>("reassignment");
  const [reviewNote, setReviewNote] = useState("");
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);
  const [sendingVoice, setSendingVoice] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [requestingAppointment, setRequestingAppointment] = useState(false);
  const [schedulingAppointment, setSchedulingAppointment] = useState(false);
  const [requestingReview, setRequestingReview] = useState(false);
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [recordingOutcome, setRecordingOutcome] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [reviewingDocumentId, setReviewingDocumentId] = useState<string | null>(null);
  const [updatingReferralId, setUpdatingReferralId] = useState<string | null>(null);
  const [syncingPending, setSyncingPending] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<CaseTab>(section && caseTabs.includes(section) ? section : "timeline");
  useEffect(() => {
    if (section && caseTabs.includes(section)) setTab(section);
  }, [section]);
  const pendingActions = usePendingActions();
  const voiceRecorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const voiceState = useAudioRecorderState(voiceRecorder, 250);

  if (details === undefined) return <View style={styles.loading}><ActivityIndicator color={colors.burgundy} /></View>;

  const caseStatus = details.case.status as keyof typeof caseStatusLabels.en;
  const isResolved = details.case.status === "resolved" || details.case.status === "closed";
  const isClosureState = isResolved || details.case.status === "closed_unresolved";
  const closure = closureCopy(caseStatus, Boolean(details.feedback), locale);
  const scheduledAppointments = details.appointments.filter((appointment) => appointment.status === "scheduled");
  const latestAppointment =
    [...scheduledAppointments].sort((a, b) => a.startsAt - b.startsAt)[0] ??
    [...details.appointments].sort((a, b) => b.startsAt - a.startsAt)[0];
  const openReviewRequest = details.reviewRequests.find((request) => request.status === "submitted" || request.status === "under_review");
  const casePendingActions = pendingActions.actions.filter((action) => action.caseId === caseId);

  async function reviewDocument(documentId: Id<"case_documents">, status: "accepted" | "rejected") {
    setReviewingDocumentId(documentId); setError("");
    try { await reviewDocumentMutation({ documentId, status, reviewNotes: status === "accepted" ? (locale === "sw" ? "Nyaraka imepitiwa na kukubaliwa." : "Document reviewed and accepted.") : (locale === "sw" ? "Tafadhali wasiliana na mnufaika kuhusu marekebisho." : "Please follow up with the beneficiary about corrections.") }); }
    catch (caught) { setError(caught instanceof Error ? caught.message : (locale === "sw" ? "Mapitio hayajahifadhiwa." : "Review could not be saved.")); }
    finally { setReviewingDocumentId(null); }
  }

  async function scheduleAppointment() {
    const startsAt = Date.parse(appointmentStart);
    if (!Number.isFinite(startsAt)) { setError(locale === "sw" ? "Weka tarehe na muda sahihi, mfano 2026-10-15 10:00." : "Enter a valid date and time, for example 2026-10-15 10:00."); return; }
    setSchedulingAppointment(true); setError("");
    try { await scheduleAppointmentMutation({ caseId, startsAt, mode: appointmentMode, location: appointmentLocation.trim() || undefined }); setAppointmentStart(""); setAppointmentLocation(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : (locale === "sw" ? "Miadi haikupangwa." : "Appointment could not be scheduled.")); }
    finally { setSchedulingAppointment(false); }
  }

  async function recordOutcome() {
    if (outcomeSummary.trim().length < 10) { setError(locale === "sw" ? "Andika muhtasari wa matokeo kwa ufupi." : "Write an outcome summary of at least 10 characters."); return; }
    setRecordingOutcome(true); setError("");
    try { await recordOutcomeMutation({ caseId, outcomeCode, summary: outcomeSummary.trim() }); setOutcomeSummary(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : (locale === "sw" ? "Matokeo hayajahifadhiwa." : "Outcome could not be saved.")); }
    finally { setRecordingOutcome(false); }
  }

  async function createTask() {
    if (!taskTitle.trim()) return;
    setCreatingTask(true); setError("");
    try { await createTaskMutation({ caseId, title: taskTitle.trim(), note: taskNote.trim() || undefined }); setTaskTitle(""); setTaskNote(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : (locale === "sw" ? "Kazi haikuweza kuongezwa." : "Task could not be added.")); }
    finally { setCreatingTask(false); }
  }

  async function setReferralStatus(referralId: Id<"referrals">, status: "accepted" | "scheduled" | "service_delivered" | "returned" | "closed") {
    setUpdatingReferralId(referralId); setError("");
    try { await updateReferralStatus({ referralId, status, note: locale === "sw" ? "Hali imesasishwa kutoka workspace ya huduma." : "Status updated from the service workspace." }); }
    catch (caught) { setError(caught instanceof Error ? caught.message : (locale === "sw" ? "Hali ya rufaa haijahifadhiwa." : "Referral status could not be saved.")); }
    finally { setUpdatingReferralId(null); }
  }

  function queuedNotice() {
    return locale === "sw"
      ? "Hatua imehifadhiwa kwenye kifaa hiki na itatumwa ukirudi mtandaoni."
      : "Saved on this device. It will send when you are back online.";
  }

  function actionLabel(action: PendingAction) {
    const labels = {
      case_message: locale === "sw" ? "Ujumbe wa kesi" : "Case message",
      appointment_request: locale === "sw" ? "Ombi la miadi" : "Appointment request",
      case_review_request: locale === "sw" ? "Ombi la kupitia kesi" : "Case review request",
      case_feedback: locale === "sw" ? "Maoni ya huduma" : "Service feedback",
    };
    return labels[action.type];
  }

  async function sendPendingAction(action: PendingAction) {
    if (action.type === "case_message") {
      await sendMessage({ caseId: action.caseId, body: action.body, clientMessageId: action.clientMessageId });
      return;
    }
    if (action.type === "appointment_request") {
      await requestAppointmentMutation({
        caseId: action.caseId,
        preferredMode: action.preferredMode,
        preferredTime: action.preferredTime,
        note: action.note,
      });
      return;
    }
    if (action.type === "case_review_request") {
      await requestCaseReviewMutation({ caseId: action.caseId, reason: action.reason, note: action.note });
      return;
    }
    await submitFeedback({ caseId: action.caseId, rating: action.rating, comment: action.comment });
  }

  async function syncPendingActions() {
    setSyncingPending(true);
    setError("");
    try {
      for (const action of casePendingActions) {
        try {
          await sendPendingAction(action);
          await removePendingAction(action.id);
        } catch (syncError) {
          await markPendingActionFailed(action.id, syncError);
          if (!shouldQueueError(syncError)) {
            throw syncError;
          }
        }
      }
      await pendingActions.refresh();
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : locale === "sw" ? "Baadhi ya vitu havijatumwa." : "Some pending items were not sent.");
    } finally {
      setSyncingPending(false);
    }
  }

  async function send() {
    const body = message.trim();
    if (!body) return;
    const clientMessageId = `mobile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setSending(true);
    setError("");
    try {
      await sendMessage({ caseId, body, clientMessageId });
      setMessage("");
    } catch (sendError) {
      if (shouldQueueError(sendError)) {
        await enqueuePendingAction({ type: "case_message", caseId, body, clientMessageId });
        await pendingActions.refresh();
        setMessage("");
        setError(queuedNotice());
      } else {
        setError(sendError instanceof Error ? sendError.message : locale === "sw" ? "Ujumbe haujatumwa." : "Message was not sent.");
      }
    } finally {
      setSending(false);
    }
  }

  async function toggleVoiceRecording() {
    setError("");
    if (!voiceState.isRecording) {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) { setError(locale === "sw" ? "Ruhusa ya kipaza sauti inahitajika kutuma ujumbe wa sauti." : "Microphone permission is required for voice notes."); return; }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await voiceRecorder.prepareToRecordAsync();
      voiceRecorder.record({ forDuration: 120 });
      return;
    }
    const durationMs = voiceState.durationMillis;
    await voiceRecorder.stop();
    const uri = voiceRecorder.uri;
    if (!uri || durationMs < 500) { setError(locale === "sw" ? "Ujumbe wa sauti ni mfupi sana." : "Voice note is too short."); return; }
    setSendingVoice(true);
    try {
      const uploadUrl = await generateVoiceMessageUploadUrl({ caseId });
      const blob = await (await fetch(uri)).blob();
      const mimeType = blob.type || (uri.endsWith(".webm") ? "audio/webm" : "audio/mp4");
      const upload = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": mimeType }, body: blob });
      if (!upload.ok) throw new Error(locale === "sw" ? "Sauti haijapakiwa." : "Voice note upload failed.");
      const { storageId } = await upload.json();
      await sendVoiceMessage({ caseId, clientMessageId: `voice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, storageId, mimeType, durationMs });
    } catch (voiceError) { setError(voiceError instanceof Error ? voiceError.message : (locale === "sw" ? "Sauti haikutumwa." : "Voice note was not sent.")); }
    finally { setSendingVoice(false); await setAudioModeAsync({ allowsRecording: false }); }
  }

  async function submit() {
    setFeedbackSending(true);
    setError("");
    try {
      await submitFeedback({ caseId, rating, comment: feedbackComment.trim() || undefined });
      setFeedbackComment("");
    } catch (feedbackError) {
      if (shouldQueueError(feedbackError)) {
        await enqueuePendingAction({ type: "case_feedback", caseId, rating, comment: feedbackComment.trim() || undefined });
        await pendingActions.refresh();
        setFeedbackComment("");
        setError(queuedNotice());
      } else {
        setError(feedbackError instanceof Error ? feedbackError.message : locale === "sw" ? "Maoni hayakutumwa." : "Feedback was not sent.");
      }
    } finally {
      setFeedbackSending(false);
    }
  }

  async function uploadDocument() {
    setUploadingDocument(true);
    setError("");
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (picked.canceled || !picked.assets[0]) return;

      const asset = picked.assets[0];
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const contentType = asset.mimeType || blob.type || "application/octet-stream";
      const postUrl = await generateDocumentUploadUrl({ caseId });
      const uploadResponse = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: blob,
      });
      if (!uploadResponse.ok) throw new Error(locale === "sw" ? "Faili halijapakiwa." : "File upload failed.");
      const { storageId } = await uploadResponse.json();
      await addDocument({
        caseId,
        storageId: storageId as Id<"_storage">,
        clientDocumentId: `mobile-doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: asset.name,
        type: contentType,
        size: asset.size || blob.size,
        category: documentCategory,
        note: documentNote.trim() || undefined,
      });
      setDocumentNote("");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : locale === "sw" ? "Nyaraka haijapakiwa." : "Document was not uploaded.");
    } finally {
      setUploadingDocument(false);
    }
  }

  async function requestAppointment() {
    setRequestingAppointment(true);
    setError("");
    try {
      const preferredTime = appointmentPreferredTime.trim() || undefined;
      const note = appointmentNote.trim() || undefined;
      await requestAppointmentMutation({
        caseId,
        preferredMode: appointmentMode,
        preferredTime,
        note,
      });
      setAppointmentPreferredTime("");
      setAppointmentNote("");
      setTab("timeline");
    } catch (appointmentError) {
      if (shouldQueueError(appointmentError)) {
        await enqueuePendingAction({
          type: "appointment_request",
          caseId,
          preferredMode: appointmentMode,
          preferredTime: appointmentPreferredTime.trim() || undefined,
          note: appointmentNote.trim() || undefined,
        });
        await pendingActions.refresh();
        setAppointmentPreferredTime("");
        setAppointmentNote("");
        setError(queuedNotice());
      } else {
        setError(appointmentError instanceof Error ? appointmentError.message : locale === "sw" ? "Ombi la miadi halijatumwa." : "Appointment request was not sent.");
      }
    } finally {
      setRequestingAppointment(false);
    }
  }

  async function requestReview() {
    setRequestingReview(true);
    setError("");
    try {
      const note = reviewNote.trim() || undefined;
      await requestCaseReviewMutation({
        caseId,
        reason: reviewReason,
        note,
      });
      setReviewNote("");
    } catch (reviewError) {
      if (shouldQueueError(reviewError)) {
        await enqueuePendingAction({ type: "case_review_request", caseId, reason: reviewReason, note: reviewNote.trim() || undefined });
        await pendingActions.refresh();
        setReviewNote("");
        setError(queuedNotice());
      } else {
        setError(reviewError instanceof Error ? reviewError.message : locale === "sw" ? "Ombi la kupitia kesi halijatumwa." : "Review request was not sent.");
      }
    } finally {
      setRequestingReview(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Go back"} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Maelezo ya kesi" : "Case details"}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Arifa" : "Notifications"} onPress={() => router.push("/notifications")}>
          <Ionicons name="notifications-outline" size={23} color={colors.burgundy} />
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.row}>
          <Text style={styles.caseId}>{details.case.publicId}</Text>
          <Text style={styles.status}>{caseStatusLabels[locale][caseStatus]}</Text>
        </View>
        <Text style={styles.summary}>{details.case.summary}</Text>
        <View style={styles.nextStep}>
          <Ionicons name="compass-outline" size={18} color={colors.burgundy} />
          <Text style={styles.nextStepText}>{nextStep(caseStatus, locale)}</Text>
        </View>
      </View>

      {isClosureState ? (
        <Pressable style={styles.closureBanner} onPress={() => setTab("feedback")}>
          <View style={styles.iconChip}><Ionicons name={closure.icon} size={20} color={colors.burgundy} /></View>
          <View style={styles.bannerCopy}>
            <Text style={styles.bannerTitle}>{closure.title}</Text>
            <Text style={styles.bannerText}>{closure.body}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.inkMuted} />
        </Pressable>
      ) : null}

      {latestAppointment ? (
        <Pressable style={styles.appointmentBanner} onPress={() => setTab("appointments")}>
          <View style={styles.iconChip}><Ionicons name="calendar-outline" size={19} color={colors.burgundy} /></View>
          <View style={styles.bannerCopy}>
            <Text style={styles.bannerTitle}>
              {latestAppointment.status === "scheduled"
                ? (locale === "sw" ? "Miadi ijayo" : "Next appointment")
                : (locale === "sw" ? "Taarifa ya miadi" : "Appointment update")}
            </Text>
            <Text style={styles.bannerText}>{formatDate(latestAppointment.startsAt, locale)} · {latestAppointment.mode.replaceAll("_", " ")}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.inkMuted} />
        </Pressable>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {casePendingActions.length ? (
        <View style={styles.pendingCard}>
          <View style={styles.row}>
            <Text style={styles.pendingTitle}>{locale === "sw" ? "Vitu vinavyosubiri kutumwa" : "Pending sync"}</Text>
            <Text style={styles.pendingCount}>{casePendingActions.length}</Text>
          </View>
          {casePendingActions.slice(0, 3).map((action) => (
            <View key={action.id} style={styles.pendingRow}>
              <Ionicons name="time-outline" size={17} color={colors.burgundy} />
              <Text style={styles.pendingText}>{actionLabel(action)} · {formatDate(action.createdAt, locale)}</Text>
            </View>
          ))}
          <Button
            label={syncingPending ? (locale === "sw" ? "Inatuma..." : "Syncing...") : (locale === "sw" ? "Jaribu kutuma sasa" : "Try syncing now")}
            disabled={syncingPending}
            loading={syncingPending}
            onPress={() => void syncPendingActions()}
          />
        </View>
      ) : null}

      <View style={styles.tabs}>
        <CaseTabButton label={locale === "sw" ? "Hatua" : "Timeline"} icon="git-branch-outline" active={tab === "timeline"} onPress={() => setTab("timeline")} />
        <CaseTabButton label={locale === "sw" ? "Ujumbe" : "Messages"} icon="chatbubble-outline" active={tab === "messages"} onPress={() => setTab("messages")} />
        <CaseTabButton label={locale === "sw" ? "Nyaraka" : "Docs"} icon="document-text-outline" active={tab === "documents"} onPress={() => setTab("documents")} />
        <CaseTabButton label={locale === "sw" ? "Miadi" : "Appointments"} icon="calendar-outline" active={tab === "appointments"} onPress={() => setTab("appointments")} />
        <CaseTabButton label={locale === "sw" ? "Rufaa" : "Referrals"} icon="swap-horizontal-outline" active={tab === "referrals"} onPress={() => setTab("referrals")} />
        {details.closureReadiness ? <CaseTabButton label={locale === "sw" ? "Kazi" : "Tasks"} icon="checkbox-outline" active={tab === "tasks"} onPress={() => setTab("tasks")} /> : null}
        <CaseTabButton label={locale === "sw" ? "Maoni" : "Feedback"} icon="checkmark-done-outline" active={tab === "feedback"} onPress={() => setTab("feedback")} />
      </View>

      {tab === "timeline" ? (
        <View style={styles.timeline}>
          {details.events.map((event, index) => (
            <View key={event._id} style={styles.event}>
              <View style={styles.rail}>
                <View style={[styles.dot, index === details.events.length - 1 && styles.currentDot]} />
                {index < details.events.length - 1 ? <View style={styles.line} /> : null}
              </View>
              <View style={styles.eventBody}>
                <Text style={styles.eventTitle}>{eventLabels[event.type]?.[locale] || (locale === "sw" ? "Taarifa mpya kwenye kesi" : "A case update was recorded")}</Text>
                <Text style={styles.eventDate}>{formatDate(event.occurredAt, locale)}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {tab === "tasks" && details.closureReadiness ? (
        <View style={styles.documents}>
          <Text style={styles.sectionKicker}>{locale === "sw" ? "Kazi zinazohusiana na kesi" : "Case work"}</Text>
          <View style={styles.requestPanel}><TextInput value={taskTitle} onChangeText={setTaskTitle} placeholder={locale === "sw" ? "Ongeza kazi, mfano: Mpigie mnufaika Jumatatu" : "Add a task, for example: Call beneficiary on Monday"} placeholderTextColor={colors.inkMuted} style={styles.singleInput} /><TextInput value={taskNote} onChangeText={setTaskNote} placeholder={locale === "sw" ? "Maelezo ya kazi (si lazima)" : "Task note (optional)"} placeholderTextColor={colors.inkMuted} style={styles.singleInput} /><Button label={creatingTask ? (locale === "sw" ? "Inaongeza..." : "Adding...") : (locale === "sw" ? "Ongeza kazi" : "Add task")} loading={creatingTask} disabled={creatingTask || !taskTitle.trim()} onPress={() => void createTask()} /></View>
          {details.tasks.length ? details.tasks.map((task) => <View key={task._id} style={styles.documentCard}><View style={styles.documentIcon}><Ionicons name={task.status === "done" ? "checkmark-circle-outline" : "checkbox-outline"} size={23} color={task.status === "done" ? colors.teal : colors.burgundy} /></View><View style={styles.documentCopy}><Text style={styles.documentName}>{task.title}</Text><Text style={styles.documentMeta}>{task.status.replaceAll("_", " ")}{task.dueAt ? ` · ${formatDate(task.dueAt, locale)}` : ""}</Text>{task.note ? <Text style={styles.documentTextPreview}>{task.note}</Text> : null}</View>{task.status === "open" ? <Pressable accessibilityRole="button" style={styles.smallAction} onPress={() => Alert.alert(locale === "sw" ? "Thibitisha kukamilika" : "Confirm completion", locale === "sw" ? `Je, umekamilisha “${task.title}”?` : `Have you completed “${task.title}”?`, [{ text: locale === "sw" ? "Ghairi" : "Cancel", style: "cancel" }, { text: locale === "sw" ? "Ndiyo" : "Yes", onPress: () => void completeTask({ taskId: task._id }) }])}><Text style={styles.smallActionText}>{locale === "sw" ? "Maliza" : "Done"}</Text></Pressable> : null}</View>) : <View style={styles.emptyPanel}><Text style={styles.emptyText}>{locale === "sw" ? "Hakuna kazi zilizoandikwa kwenye kesi hii." : "No tasks have been added to this case yet."}</Text></View>}
        </View>
      ) : null}

      {tab === "messages" ? (
        <View style={styles.messageArea}>
          {messages?.length ? messages.map((item) => (
            <View key={item._id} style={styles.messageBubble}>
              {item.type === "voice" && item.audioUrl ? <VoiceNote url={item.audioUrl} durationMs={item.durationMs ?? 0} sw={locale === "sw"} /> : <Text style={styles.messageText}>{item.body}</Text>}
              <Text style={styles.messageTime}>{new Date(item.createdAt).toLocaleTimeString(locale === "sw" ? "sw-TZ" : "en-TZ", { hour: "2-digit", minute: "2-digit" })}</Text>
            </View>
          )) : <Text style={styles.emptyText}>{locale === "sw" ? "Bado hakuna ujumbe. Mazungumzo haya yanahusiana na kesi hii tu." : "No messages yet. This conversation is limited to this case."}</Text>}
          <View style={styles.composer}>
            <Pressable accessibilityRole="button" accessibilityLabel={voiceState.isRecording ? (locale === "sw" ? "Simamisha na tuma sauti" : "Stop and send voice note") : (locale === "sw" ? "Rekodi ujumbe wa sauti" : "Record voice note")} disabled={sendingVoice} onPress={() => void toggleVoiceRecording()} style={[styles.voiceButton, voiceState.isRecording && styles.voiceRecording]}><Ionicons name={voiceState.isRecording ? "stop" : "mic-outline"} size={21} color={voiceState.isRecording ? colors.surface : colors.burgundy} /></Pressable>
            <TextInput value={message} onChangeText={setMessage} multiline placeholder={locale === "sw" ? "Andika ujumbe..." : "Write a message..."} placeholderTextColor={colors.inkMuted} style={styles.messageInput} />
            <Pressable disabled={sending || !message.trim()} onPress={() => void send()} style={[styles.send, (sending || !message.trim()) && styles.disabledSend]}>
              <Ionicons name="arrow-up" size={21} color={colors.surface} />
            </Pressable>
          </View>
        </View>
      ) : null}

      {tab === "documents" ? (
        <View style={styles.documents}>
          <View style={styles.uploadPanel}>
            <Text style={styles.sectionKicker}>{locale === "sw" ? "Ongeza nyaraka" : "Add document"}</Text>
            <Text style={styles.uploadHelp}>
              {locale === "sw"
                ? "Pakia picha, PDF, au Word document inayohusiana na kesi hii. Faili litaonekana kama linasubiri mapitio."
                : "Upload a photo, PDF, or Word document for this case. It will appear as pending review."}
            </Text>
            <View style={styles.categoryRow}>
              {documentCategories.map((category) => (
                <Pressable key={category.value} onPress={() => setDocumentCategory(category.value)} style={[styles.categoryChip, documentCategory === category.value && styles.categoryChipActive]}>
                  <Text style={[styles.categoryText, documentCategory === category.value && styles.categoryTextActive]}>{category[locale]}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={documentNote}
              onChangeText={setDocumentNote}
              maxLength={500}
              multiline
              placeholder={locale === "sw" ? "Maelezo mafupi (si lazima)" : "Short note (optional)"}
              placeholderTextColor={colors.inkMuted}
              style={styles.documentNote}
            />
            <Button label={uploadingDocument ? (locale === "sw" ? "Inapakia..." : "Uploading...") : (locale === "sw" ? "Chagua faili" : "Choose file")} loading={uploadingDocument} disabled={uploadingDocument} onPress={() => void uploadDocument()} />
          </View>
          {documents === undefined ? <ActivityIndicator color={colors.burgundy} /> : null}
          {documents?.length ? documents.map((document) => (
            <View key={document._id} style={styles.documentCard}>
              <View style={styles.documentIcon}><Ionicons name="document-text-outline" size={23} color={colors.burgundy} /></View>
              <View style={styles.documentCopy}>
                <Text style={styles.documentName}>{document.name}</Text>
                <Text style={styles.documentMeta}>{document.category.replaceAll("_", " ")} · {document.textContent ? (locale === "sw" ? "rasimu ya maandishi" : "text draft") : `${(document.size / 1024 / 1024).toFixed(2)} MB`}</Text>
                <Text style={[styles.documentStatus, document.status === "rejected" && styles.rejectedText]}>{document.status.replaceAll("_", " ")}</Text>
                {document.textContent ? <Text style={styles.documentTextPreview} numberOfLines={4}>{document.textContent}</Text> : null}
                {details.closureReadiness && document.status === "pending_review" ? <View style={styles.documents}><Button label={locale === "sw" ? "Kubali" : "Accept"} variant="secondary" loading={reviewingDocumentId === document._id} disabled={Boolean(reviewingDocumentId)} onPress={() => void reviewDocument(document._id, "accepted")} /><Button label={locale === "sw" ? "Kataa" : "Reject"} variant="quiet" disabled={Boolean(reviewingDocumentId)} onPress={() => void reviewDocument(document._id, "rejected")} /></View> : null}
              </View>
            </View>
          )) : documents ? (
            <View style={styles.emptyPanel}>
              <Ionicons name="folder-open-outline" size={38} color={colors.burgundy} />
              <Text style={styles.emptyText}>{locale === "sw" ? "Bado hakuna nyaraka kwenye kesi hii." : "No documents are attached to this case yet."}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {tab === "appointments" ? (
        <View style={styles.appointments}>
          {details.closureReadiness ? <View style={styles.requestPanel}><Text style={styles.sectionKicker}>{locale === "sw" ? "Panga miadi ya mnufaika" : "Schedule beneficiary appointment"}</Text><Text style={styles.uploadHelp}>{locale === "sw" ? "Tumia tarehe ya baadaye kwa muundo unaoeleweka." : "Use a future date and time in a clear format."}</Text><TextInput value={appointmentStart} onChangeText={setAppointmentStart} placeholder="2026-10-15 10:00" placeholderTextColor={colors.inkMuted} style={styles.singleInput} /><TextInput value={appointmentLocation} onChangeText={setAppointmentLocation} placeholder={locale === "sw" ? "Eneo au kiungo cha mkutano (si lazima)" : "Location or meeting link (optional)"} placeholderTextColor={colors.inkMuted} style={styles.singleInput} /><Button label={schedulingAppointment ? (locale === "sw" ? "Inapanga..." : "Scheduling...") : (locale === "sw" ? "Panga miadi" : "Schedule appointment")} loading={schedulingAppointment} disabled={schedulingAppointment} onPress={() => void scheduleAppointment()} /></View> : null}
          {!isResolved ? (
            <View style={styles.requestPanel}>
              <Text style={styles.sectionKicker}>{locale === "sw" ? "Omba miadi" : "Request appointment"}</Text>
              <Text style={styles.uploadHelp}>
                {locale === "sw"
                  ? "Tuma ombi kwa timu yako ya kesi. Miadi itathibitishwa baada ya msaidizi kupanga muda."
                  : "Send a request to your case team. The appointment is confirmed only after a support worker schedules it."}
              </Text>
              <View style={styles.modeRow}>
                {appointmentModes.map((mode) => (
                  <Pressable key={mode.value} onPress={() => setAppointmentMode(mode.value)} style={[styles.modeChip, appointmentMode === mode.value && styles.modeChipActive]}>
                    <Ionicons name={mode.icon} size={17} color={appointmentMode === mode.value ? colors.burgundy : colors.inkMuted} />
                    <Text style={[styles.modeText, appointmentMode === mode.value && styles.modeTextActive]}>{mode[locale]}</Text>
                  </Pressable>
                ))}
              </View>
              <TextInput
                value={appointmentPreferredTime}
                onChangeText={setAppointmentPreferredTime}
                maxLength={160}
                placeholder={locale === "sw" ? "Muda unaokufaa, mfano Jumanne asubuhi" : "Preferred time, e.g. Tuesday morning"}
                placeholderTextColor={colors.inkMuted}
                style={styles.singleInput}
              />
              <TextInput
                value={appointmentNote}
                onChangeText={setAppointmentNote}
                maxLength={800}
                multiline
                placeholder={locale === "sw" ? "Unachotaka kujadili (si lazima)" : "What you want to discuss (optional)"}
                placeholderTextColor={colors.inkMuted}
                style={styles.appointmentNote}
              />
              <Button
                label={requestingAppointment ? (locale === "sw" ? "Inatuma..." : "Sending...") : (locale === "sw" ? "Tuma ombi la miadi" : "Send appointment request")}
                loading={requestingAppointment}
                disabled={requestingAppointment}
                onPress={() => void requestAppointment()}
              />
            </View>
          ) : null}
          {details.appointments.length ? details.appointments.map((appointment) => (
            <View key={appointment._id} style={styles.appointmentCard}>
              <View style={styles.row}>
                <Text style={styles.appointmentTitle}>{formatDate(appointment.startsAt, locale)}</Text>
                <Text style={[
                  styles.appointmentStatus,
                  appointment.status === "cancelled" || appointment.status === "missed" ? styles.appointmentStatusWarning : null,
                  appointment.status === "completed" ? styles.appointmentStatusComplete : null,
                ]}>
                  {appointmentStatusLabels[appointment.status]?.[locale] ?? appointment.status.replaceAll("_", " ")}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name={appointment.mode === "phone" ? "call-outline" : appointment.mode === "remote" ? "videocam-outline" : "location-outline"} size={18} color={colors.burgundy} />
                <Text style={styles.metaText}>{appointment.mode.replaceAll("_", " ")}{appointment.location ? ` · ${appointment.location}` : ""}</Text>
              </View>
              {appointment.statusNote ? (
                <View style={styles.appointmentNoteCard}>
                  <Ionicons name="information-circle-outline" size={17} color={colors.burgundy} />
                  <Text style={styles.appointmentNoteText}>{appointment.statusNote}</Text>
                </View>
              ) : null}
            </View>
          )) : (
            <View style={styles.emptyPanel}>
              <Ionicons name="calendar-clear-outline" size={38} color={colors.burgundy} />
              <Text style={styles.emptyText}>{locale === "sw" ? "Bado hakuna miadi iliyopangwa." : "No appointment has been scheduled yet."}</Text>
            </View>
          )}
        </View>
      ) : null}

      {tab === "referrals" ? (
        <View style={styles.referrals}>
          {referrals === undefined ? <ActivityIndicator color={colors.burgundy} /> : null}
          {referrals?.length ? referrals.map((referral) => (
            <View key={referral._id} style={styles.referralCard}>
              <View style={styles.row}>
                <Text style={styles.referralId}>{referral.publicId}</Text>
                <Text style={styles.referralStatus}>{referral.status.replaceAll("_", " ")}</Text>
              </View>
              <Text style={styles.referralTitle}>{referral.destinationService?.name ?? (locale === "sw" ? "Huduma ya rufaa" : "Referral service")}</Text>
              {referral.parentReferral ? (
                <View style={styles.chainPanel}>
                  <Ionicons name="git-branch-outline" size={16} color={colors.burgundy} />
                  <Text style={styles.chainText}>
                    {locale === "sw"
                      ? `Imeundwa kutoka rufaa ${referral.parentReferral.publicId}`
                      : `Created from referral ${referral.parentReferral.publicId}`}
                  </Text>
                </View>
              ) : null}
              {referral.onwardReferral ? (
                <View style={styles.chainPanel}>
                  <Ionicons name="git-branch-outline" size={16} color={colors.burgundy} />
                  <Text style={styles.chainText}>
                    {locale === "sw"
                      ? `Imeendelea kwenda rufaa ${referral.onwardReferral.publicId}`
                      : `Continued to referral ${referral.onwardReferral.publicId}`}
                  </Text>
                </View>
              ) : null}
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={17} color={colors.burgundy} />
                <Text style={styles.metaText}>
                  {[referral.destinationService?.district, referral.destinationService?.region].filter(Boolean).join(", ") || (locale === "sw" ? "Eneo halijawekwa" : "Location not listed")}
                </Text>
              </View>
              <View style={styles.referralSection}>
                <Text style={styles.sectionKicker}>{locale === "sw" ? "Sababu" : "Reason"}</Text>
                <Text style={styles.referralText}>{referral.reason}</Text>
              </View>
              <View style={styles.referralSection}>
                <Text style={styles.sectionKicker}>{referral.status === "awaiting_beneficiary_consent" ? (locale === "sw" ? "Taarifa zitakazoshirikiwa ukikubali" : "Information shared only if you agree") : (locale === "sw" ? "Taarifa za rufaa" : "Referral information")}</Text>
                {referral.informationShared.map((item) => (
                  <View key={item} style={styles.sharedItem}>
                    <Ionicons name="checkmark-circle-outline" size={15} color={colors.success} />
                    <Text style={styles.sharedText}>{item}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.consentPanel}>
                <Ionicons name="shield-checkmark-outline" size={18} color={colors.burgundy} />
                <Text style={styles.consentText}>
                  {referral.status === "awaiting_beneficiary_consent"
                    ? (locale === "sw" ? "Rufaa inasubiri uamuzi wako. Bado haijashirikiwa." : "Waiting for your decision. This referral has not been shared.")
                    : referral.consent?.granted
                      ? (locale === "sw" ? `Ridhaa imerekodiwa: ${referral.consent.method?.replaceAll("_", " ") ?? "haijaonyeshwa"}` : `Consent recorded: ${referral.consent.method?.replaceAll("_", " ") ?? "not shown"}`)
                      : (locale === "sw" ? "Rufaa haikukubaliwa." : "Referral consent was declined.")}
                </Text>
              </View>
              {referral.status === "awaiting_beneficiary_consent" ? <View style={styles.referralSection}>
                <Text style={styles.sectionKicker}>{locale === "sw" ? "Uamuzi wako unahitajika" : "Your decision is needed"}</Text>
                <Text style={styles.referralText}>{locale === "sw" ? "Kagua huduma iliyotajwa na taarifa zote hapo juu. Hakuna taarifa itakayotumwa kwa mtoa huduma mpaka ukubali. Unaweza kukataa na LSF itatafuta njia nyingine." : "Review the named service and every item above. Nothing will be sent to the provider until you agree. You may decline and LSF can find another option."}</Text>
              </View> : null}
              <Button label={referral.status === "awaiting_beneficiary_consent" ? (locale === "sw" ? "Kagua na amua kuhusu rufaa" : "Review and decide on referral") : (locale === "sw" ? "Angalia maendeleo ya rufaa" : "View referral progress")} variant={referral.status === "awaiting_beneficiary_consent" ? "primary" : "secondary"} onPress={() => router.push({ pathname: "/referral/[id]", params: { id: referral._id, caseId } })} />
              {details.closureReadiness && referral.status !== "awaiting_beneficiary_consent" && !["closed", "declined", "returned"].includes(referral.status) ? <View style={styles.referralSection}><Text style={styles.sectionKicker}>{locale === "sw" ? "Sasisha kazi ya rufaa" : "Update referral work"}</Text><View style={styles.documents}><Button label={locale === "sw" ? "Kubali" : "Accept"} variant="secondary" disabled={Boolean(updatingReferralId)} loading={updatingReferralId === referral._id} onPress={() => void setReferralStatus(referral._id, "accepted")} /><Button label={locale === "sw" ? "Panga" : "Schedule"} variant="secondary" disabled={Boolean(updatingReferralId)} onPress={() => void setReferralStatus(referral._id, "scheduled")} /><Button label={locale === "sw" ? "Huduma imetolewa" : "Delivered"} variant="secondary" disabled={Boolean(updatingReferralId)} onPress={() => void setReferralStatus(referral._id, "service_delivered")} /><Button label={locale === "sw" ? "Funga" : "Close"} variant="quiet" disabled={Boolean(updatingReferralId)} onPress={() => void setReferralStatus(referral._id, "closed")} /></View></View> : null}
              <View style={styles.referralEvents}>
                {referral.events.map((event) => (
                  <View key={event._id} style={styles.referralEvent}>
                    <View style={styles.referralEventDot} />
                    <View style={styles.referralEventCopy}>
                      <Text style={styles.referralEventTitle}>
                        {eventLabels[event.type]?.[locale] || (locale === "sw" ? "Taarifa ya rufaa" : "Referral update")}
                      </Text>
                      <Text style={styles.eventDate}>{formatDate(event.occurredAt, locale)}</Text>
                      {event.note ? <Text style={styles.referralText}>{event.note}</Text> : null}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )) : referrals ? (
            <View style={styles.emptyPanel}>
              <Ionicons name="swap-horizontal-outline" size={38} color={colors.burgundy} />
              <Text style={styles.emptyText}>
                {locale === "sw"
                  ? "Bado hakuna rufaa kwenye kesi hii. Ikiwa huduma nyingine inahitajika, timu ya LSF itaiongeza hapa."
                  : "No referrals are attached to this case yet. If another service is needed, the LSF team will add it here."}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {tab === "feedback" ? (
        <View style={styles.feedbackPanel}>
          <Button label={locale === "sw" ? "Angalia matokeo na toa maoni" : "View outcome and give feedback"} variant="secondary" onPress={() => router.push({ pathname: "/case-outcome/[id]", params: { id: caseId } })} />
          <Button label={locale === "sw" ? "Nahitaji msaada zaidi au mapitio" : "I need more help or a review"} variant="quiet" onPress={() => router.push({ pathname: "/case-review/[id]", params: { id: caseId } })} />
          {details.closureReadiness && !details.outcome && !isClosureState ? <View style={styles.feedbackForm}><Text style={styles.sectionKicker}>{locale === "sw" ? "Rekodi matokeo ya kesi" : "Record case outcome"}</Text><View style={styles.categoryRow}>{Object.keys(outcomeLabels).map((code) => <Pressable key={code} onPress={() => setOutcomeCode(code)} style={[styles.categoryChip, outcomeCode === code && styles.categoryChipActive]}><Text style={[styles.categoryText, outcomeCode === code && styles.categoryTextActive]}>{outcomeLabels[code][locale]}</Text></Pressable>)}</View><TextInput value={outcomeSummary} onChangeText={setOutcomeSummary} multiline maxLength={3000} placeholder={locale === "sw" ? "Eleza msaada uliotolewa na hatua inayofuata..." : "Describe the support provided and next step..."} placeholderTextColor={colors.inkMuted} style={styles.feedbackInput} /><Button label={recordingOutcome ? (locale === "sw" ? "Inahifadhi..." : "Saving...") : (locale === "sw" ? "Hifadhi matokeo" : "Save outcome")} loading={recordingOutcome} disabled={recordingOutcome} onPress={() => void recordOutcome()} /></View> : null}
          {details.outcome ? (
            <View style={styles.outcomeCard}>
              <Text style={styles.sectionKicker}>{locale === "sw" ? "Matokeo ya kesi" : "Case outcome"}</Text>
              <Text style={styles.outcomeTitle}>{outcomeLabels[details.outcome.outcomeCode]?.[locale] ?? details.outcome.outcomeCode.replaceAll("_", " ")}</Text>
              <Text style={styles.outcomeSummary}>{details.outcome.summary}</Text>
              <Text style={styles.outcomeMeta}>
                {locale === "sw" ? "Yamerekodiwa" : "Recorded"} {formatDate(details.outcome.recordedAt, locale)}
              </Text>
            </View>
          ) : isClosureState ? (
            <View style={styles.emptyPanel}>
              <Ionicons name="time-outline" size={38} color={colors.burgundy} />
              <Text style={styles.emptyText}>{locale === "sw" ? "Matokeo bado hayajaonekana kwenye kesi hii." : "No outcome is visible for this case yet."}</Text>
            </View>
          ) : null}

          {details.feedback ? (
            <View style={styles.thanksCard}>
              <Ionicons name="checkmark-circle" size={34} color={colors.success} />
              <Text style={styles.thanksTitle}>{locale === "sw" ? "Asante kwa maoni yako" : "Thanks for your feedback"}</Text>
              <View style={styles.submittedRating}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Ionicons key={value} name={value <= details.feedback!.rating ? "star" : "star-outline"} size={20} color={colors.orange} />
                ))}
              </View>
              {details.feedback.comment ? <Text style={styles.feedbackQuote}>{details.feedback.comment}</Text> : null}
              <Text style={styles.emptyText}>{locale === "sw" ? "Maoni yako yamesaidia kuboresha huduma." : "Your feedback helps improve the service."}</Text>
            </View>
          ) : isResolved && details.outcome ? (
            <View style={styles.feedbackForm}>
              <Text style={styles.sectionKicker}>{locale === "sw" ? "Tathmini huduma" : "Rate the support"}</Text>
              <Text style={styles.uploadHelp}>
                {locale === "sw"
                  ? "Maoni yako huenda kwa LSF ili kuboresha huduma. Hayabadilishi matokeo ya kesi."
                  : "Your feedback goes to LSF to improve service quality. It does not change the case outcome."}
              </Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Pressable key={value} onPress={() => setRating(value)} style={styles.starButton}>
                    <Ionicons name={value <= rating ? "star" : "star-outline"} size={30} color={colors.orange} />
                  </Pressable>
                ))}
              </View>
              <TextInput value={feedbackComment} onChangeText={setFeedbackComment} multiline placeholder={locale === "sw" ? "Una maoni yoyote? (si lazima)" : "Anything to add? (optional)"} placeholderTextColor={colors.inkMuted} style={styles.feedbackInput} />
              <Button label={feedbackSending ? (locale === "sw" ? "Inatuma..." : "Sending...") : (locale === "sw" ? "Tuma maoni" : "Submit feedback")} disabled={feedbackSending} onPress={() => void submit()} />
            </View>
          ) : null}

          <View style={styles.reviewPanel}>
            <Text style={styles.sectionKicker}>{locale === "sw" ? "Unahitaji mtu wa LSF apitie?" : "Need LSF to review this case?"}</Text>
            <Text style={styles.uploadHelp}>
              {locale === "sw"
                ? "Tumia sehemu hii kuomba kupitia huduma, kuomba msaidizi mwingine, au kuripoti wasiwasi. Maelezo haya huenda kwa timu ya LSF, si moja kwa moja kwa msaidizi wako."
                : "Use this to request a service review, ask for a different helper, or report a concern. These details go to the LSF team, not directly to your assigned helper."}
            </Text>
            {openReviewRequest ? (
              <View style={styles.reviewStatusCard}>
                <Ionicons name="shield-checkmark-outline" size={24} color={colors.burgundy} />
                <View style={styles.reviewStatusCopy}>
                  <Text style={styles.reviewStatusTitle}>{locale === "sw" ? "Ombi lako limepokelewa" : "Your request has been received"}</Text>
                  <Text style={styles.reviewStatusText}>
                    {locale === "sw"
                      ? `Hali: ${openReviewRequest.status.replaceAll("_", " ")}`
                      : `Status: ${openReviewRequest.status.replaceAll("_", " ")}`}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.categoryRow}>
                  {reviewReasons.map((reason) => (
                    <Pressable key={reason.value} onPress={() => setReviewReason(reason.value)} style={[styles.categoryChip, reviewReason === reason.value && styles.categoryChipActive]}>
                      <Text style={[styles.categoryText, reviewReason === reason.value && styles.categoryTextActive]}>{reason[locale]}</Text>
                    </Pressable>
                  ))}
                </View>
                <TextInput
                  value={reviewNote}
                  onChangeText={setReviewNote}
                  maxLength={1200}
                  multiline
                  placeholder={locale === "sw" ? "Eleza kwa ufupi unachotaka LSF ipitie..." : "Briefly explain what you want LSF to review..."}
                  placeholderTextColor={colors.inkMuted}
                  style={styles.reviewNote}
                />
                <Button
                  label={requestingReview ? (locale === "sw" ? "Inatuma..." : "Sending...") : (locale === "sw" ? "Tuma ombi la kupitia" : "Send review request")}
                  loading={requestingReview}
                  disabled={requestingReview}
                  onPress={() => void requestReview()}
                />
              </>
            )}
          </View>

          {!details.outcome && !isClosureState ? (
            <View style={styles.emptyPanel}>
              <Ionicons name="time-outline" size={38} color={colors.burgundy} />
              <Text style={styles.emptyText}>{locale === "sw" ? "Matokeo bado hayajarekodiwa." : "No outcome has been recorded yet."}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </Screen>
  );
}

function VoiceNote({ url, durationMs, sw }: { url: string; durationMs: number; sw: boolean }) {
  const player = useAudioPlayer(url);
  const playing = useAudioPlayerStatus(player).playing;
  return <Pressable accessibilityRole="button" accessibilityLabel={playing ? (sw ? "Sitisha ujumbe wa sauti" : "Pause voice note") : (sw ? "Cheza ujumbe wa sauti" : "Play voice note")} onPress={() => playing ? player.pause() : player.play()} style={styles.voiceNote}><Ionicons name={playing ? "pause" : "play"} size={18} color={colors.surface} /><View style={styles.voiceTrack}><View style={styles.voiceTrackFill} /></View><Text style={styles.voiceDuration}>{Math.max(1, Math.round(durationMs / 1000))}s</Text></Pressable>;
}

function CaseTabButton({ label, icon, active, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; active: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.tab, active && styles.activeTab]}>
      <Ionicons name={icon} size={18} color={active ? colors.burgundy : colors.inkMuted} />
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 },
  summaryCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md, marginTop: spacing.xl },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md },
  caseId: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 15 },
  status: { fontFamily: type.medium, fontWeight: "500", color: colors.success, backgroundColor: "#E7F4ED", paddingVertical: 5, paddingHorizontal: 9, borderRadius: radius.pill, fontSize: 13, maxWidth: 150, textAlign: "center" },
  summary: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  nextStep: { flexDirection: "row", gap: spacing.sm, backgroundColor: colors.softPink, borderRadius: radius.sm, padding: spacing.md },
  nextStepText: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, lineHeight: 19 },
  appointmentBanner: { marginTop: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  closureBanner: { marginTop: spacing.lg, backgroundColor: colors.softPink, borderWidth: 1, borderColor: "#F0D5DF", borderRadius: radius.md, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconChip: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  bannerCopy: { flex: 1 },
  bannerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 13 },
  bannerText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, marginTop: 2, textTransform: "capitalize" },
  error: { fontFamily: type.medium, fontWeight: "500", color: colors.danger, backgroundColor: "#FDECEC", borderRadius: radius.sm, padding: spacing.md, marginTop: spacing.md },
  pendingCard: { marginTop: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  pendingTitle: { flex: 1, fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14 },
  pendingCount: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, backgroundColor: colors.softPink, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  pendingRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  pendingText: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 18 },
  tabs: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xl },
  tab: { minWidth: "47%", flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.surface },
  activeTab: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  tabText: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13 },
  activeTabText: { color: colors.burgundy },
  timeline: { marginTop: spacing.xl },
  event: { flexDirection: "row", minHeight: 86 },
  rail: { width: 28, alignItems: "center" },
  dot: { width: 13, height: 13, borderRadius: 7, backgroundColor: colors.teal, borderWidth: 3, borderColor: colors.background },
  currentDot: { backgroundColor: colors.burgundy },
  line: { width: 2, flex: 1, backgroundColor: colors.line },
  eventBody: { flex: 1, paddingLeft: spacing.md, paddingBottom: spacing.xl },
  eventTitle: { fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 14, lineHeight: 20 },
  eventDate: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, marginTop: spacing.xs },
  messageArea: { marginTop: spacing.xl, gap: spacing.md },
  messageBubble: { alignSelf: "flex-start", maxWidth: "92%", backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line },
  messageText: { fontFamily: type.regular, color: colors.charcoal, fontSize: 14, lineHeight: 20 },
  messageTime: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, marginTop: spacing.xs, textAlign: "right" },
  emptyText: { fontFamily: type.regular, color: colors.inkMuted, textAlign: "center", lineHeight: 21 },
  documents: { marginTop: spacing.xl, gap: spacing.md },
  uploadPanel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  uploadHelp: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  categoryChip: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.background },
  categoryChipActive: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  categoryText: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13 },
  categoryTextActive: { color: colors.burgundy },
  documentNote: { minHeight: 78, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontFamily: type.regular, color: colors.charcoal, textAlignVertical: "top" },
  documentCard: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg },
  documentIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  documentCopy: { flex: 1, gap: 3 },
  smallAction: { alignSelf: "center", minHeight: 38, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  smallActionText: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 12 },
  documentName: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14 },
  documentMeta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, textTransform: "capitalize" },
  documentStatus: { fontFamily: type.medium, fontWeight: "500", color: colors.success, fontSize: 13, textTransform: "capitalize" },
  documentTextPreview: { marginTop: spacing.xs, borderRadius: radius.sm, backgroundColor: "#FBF7F8", padding: spacing.sm, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  rejectedText: { color: colors.danger },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm, marginTop: spacing.lg },
  voiceButton: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: colors.burgundy, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  voiceRecording: { backgroundColor: colors.burgundy },
  voiceNote: { minHeight: 48, borderRadius: radius.pill, backgroundColor: colors.burgundy, paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  voiceTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,.35)", overflow: "hidden" },
  voiceTrackFill: { width: "45%", height: "100%", backgroundColor: colors.surface },
  voiceDuration: { color: colors.surface, fontFamily: type.bold, fontSize: 12 },
  messageInput: { flex: 1, minHeight: 48, maxHeight: 120, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontFamily: type.regular, color: colors.charcoal },
  send: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  disabledSend: { opacity: 0.5 },
  appointments: { marginTop: spacing.xl, gap: spacing.md },
  referrals: { marginTop: spacing.xl, gap: spacing.md },
  referralCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  referralId: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
  referralStatus: { fontFamily: type.medium, fontWeight: "500", color: colors.success, backgroundColor: "#E7F4ED", borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontSize: 13, textTransform: "capitalize" },
  referralTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 18 },
  chainPanel: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FBF7F8", padding: spacing.sm },
  chainText: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  referralSection: { gap: spacing.xs },
  referralText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  sharedItem: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  sharedText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  consentPanel: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderRadius: radius.sm, backgroundColor: colors.softPink, padding: spacing.md },
  consentText: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, lineHeight: 18, textTransform: "capitalize" },
  referralEvents: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: spacing.md, gap: spacing.md },
  referralEvent: { flexDirection: "row", gap: spacing.sm },
  referralEventDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.burgundy, marginTop: 5 },
  referralEventCopy: { flex: 1 },
  referralEventTitle: { fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  requestPanel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  modeRow: { flexDirection: "row", gap: spacing.sm },
  modeChip: { flex: 1, minHeight: 44, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.sm },
  modeChipActive: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  modeText: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13 },
  modeTextActive: { color: colors.burgundy },
  singleInput: { minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontFamily: type.regular, color: colors.charcoal },
  appointmentNote: { minHeight: 92, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontFamily: type.regular, color: colors.charcoal, textAlignVertical: "top" },
  appointmentCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  appointmentTitle: { flex: 1, fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14, lineHeight: 20 },
  appointmentStatus: { fontFamily: type.medium, fontWeight: "500", color: colors.success, backgroundColor: "#E7F4ED", borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontSize: 13, textTransform: "capitalize" },
  appointmentStatusComplete: { color: colors.burgundy, backgroundColor: colors.softPink },
  appointmentStatusWarning: { color: colors.danger, backgroundColor: "#FDECEC" },
  appointmentNoteCard: { flexDirection: "row", gap: spacing.sm, borderRadius: radius.sm, backgroundColor: colors.softPink, padding: spacing.md },
  appointmentNoteText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  metaText: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19, textTransform: "capitalize" },
  emptyPanel: { alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.xl, marginTop: spacing.xl },
  feedbackPanel: { marginTop: spacing.xl, gap: spacing.md },
  reviewPanel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  reviewNote: { minHeight: 96, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontFamily: type.regular, color: colors.charcoal, textAlignVertical: "top" },
  reviewStatusCard: { flexDirection: "row", gap: spacing.md, alignItems: "center", borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.md },
  reviewStatusCopy: { flex: 1 },
  reviewStatusTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14 },
  reviewStatusText: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, textTransform: "capitalize" },
  outcomeCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.sm },
  sectionKicker: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13, textTransform: "uppercase", letterSpacing: 0 },
  outcomeTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 18 },
  outcomeSummary: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  outcomeMeta: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13 },
  thanksCard: { alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.xl },
  thanksTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 16, textAlign: "center" },
  submittedRating: { flexDirection: "row", gap: spacing.xs },
  feedbackQuote: { width: "100%", fontFamily: type.regular, color: colors.charcoal, fontSize: 14, lineHeight: 21, backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md },
  feedbackForm: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  ratingRow: { flexDirection: "row", justifyContent: "space-between" },
  starButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  feedbackInput: { minHeight: 96, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontFamily: type.regular, color: colors.charcoal, textAlignVertical: "top" },
});
