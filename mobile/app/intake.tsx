import { useAuth } from "../src/auth";
import type { Id } from "../../convex/_generated/dataModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { QuickExit } from "../src/components/QuickExit";
import { Screen } from "../src/components/Screen";
import { useIntakeDraft } from "../src/intake/IntakeDraftContext";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

const TOTAL_STEPS = 8;

const issueOptions = [
  { key: "employment", icon: "briefcase-outline", sw: "Kazi na ajira", en: "Employment and work", swBody: "Mshahara, mkataba, kufukuzwa au haki kazini.", enBody: "Pay, contracts, dismissal, or workplace rights." },
  { key: "land", icon: "home-outline", sw: "Ardhi na nyumba", en: "Land and housing", swBody: "Umiliki, mipaka, upangaji au kufukuzwa.", enBody: "Ownership, boundaries, tenancy, or eviction." },
  { key: "family", icon: "people-outline", sw: "Familia na ndoa", en: "Family and marriage", swBody: "Ndoa, talaka, watoto, urithi au matunzo.", enBody: "Marriage, divorce, children, inheritance, or support." },
  { key: "safety", icon: "shield-checkmark-outline", sw: "Ukatili na usalama", en: "Violence and safety", swBody: "Vitisho, ukatili wa kijinsia au ulinzi.", enBody: "Threats, gender-based violence, or protection." },
  { key: "consumer", icon: "wallet-outline", sw: "Fedha na huduma", en: "Money and services", swBody: "Madeni, bidhaa, huduma au marejesho.", enBody: "Debt, products, services, or refunds." },
  { key: "other", icon: "ellipsis-horizontal", sw: "Jambo jingine", en: "Something else", swBody: "Eleza hali yako kwa maneno yako.", enBody: "Describe your situation in your own words." },
] as const;

export default function IntakeScreen() {
  useSensitiveScreenProtection("intake");
  const { isSignedIn } = useAuth();
  const { locale, t } = useLanguage();
  const { draft, hasSavedDraft, hasGuestDraft, updateDraft, resetDraft, saveDraftForLater, restoreSavedDraft, restoreGuestDraft, clearSavedDraft } = useIntakeDraft();
  const saveDraft = useMutation(api.legalHelp.saveDraft);
  const generateAttachmentUploadUrl = useMutation(api.legalHelp.generateAttachmentUploadUrl);
  const attachToDraft = useMutation(api.legalHelp.attachToDraft);
  const submitRequest = useMutation(api.legalHelp.submit);
  const recordJourney = useMutation(api.journeyAnalytics.record);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);
  const uploadedEvidence = useRef<{ key: string; storageId: Id<"_storage">; size: number } | null>(null);
  const [cleanupFailed, setCleanupFailed] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState("");
  const [submittedRecordId, setSubmittedRecordId] = useState("");
  const [draftRestored, setDraftRestored] = useState(false);
  const [evidence, setEvidence] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const occurredOnIsValid = !draft.occurredOn || (/^\d{4}-\d{2}-\d{2}$/.test(draft.occurredOn) && !Number.isNaN(new Date(`${draft.occurredOn}T12:00:00`).getTime()));

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
    if (submitting.current || !consentAccepted) return;
    submitting.current = true;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      if (!isSignedIn) {
        await saveDraftForLater();
        router.push({ pathname: "/sign-in", params: { returnTo: "intake" } });
        return;
      }
      const saved = await saveDraft({
        clientRequestId: draft.clientRequestId,
        locale,
        description: draft.description,
        issueCategory: draft.issueCategory,
        sourceServiceId: draft.sourceServiceId as Id<"justice_services"> | undefined,
        region: draft.region,
        district: draft.district,
        occurredAt: draft.occurredOn ? new Date(`${draft.occurredOn}T12:00:00`).getTime() : undefined,
        involvedParties: draft.involvedParties,
        desiredHelp: draft.desiredHelp,
        safeContactMethod: draft.safeContactMethod,
        preferredLanguage: draft.preferredLanguage,
        preferredLanguageOther: draft.preferredLanguageOther,
        urgency: draft.urgency,
        hasDocuments: draft.hasDocuments,
      });
      if (saved.status === "withdrawn") throw new Error(locale === "sw" ? "Ombi hili liliondolewa. Angalia maombi yako kabla ya kuanza ombi jipya." : "This request was withdrawn. Check your requests before starting a new one.");
      let expectedVersion = saved.version;
      if (saved.status === "draft" && evidence) {
        const evidenceKey = JSON.stringify([saved.requestId, evidence.uri, evidence.name, evidence.mimeType, evidence.size]);
        let storageId = uploadedEvidence.current?.key === evidenceKey ? uploadedEvidence.current.storageId : undefined;
        let actualSize = uploadedEvidence.current?.key === evidenceKey ? uploadedEvidence.current.size : evidence.size;
        if (!storageId) {
          const uploadUrl = await generateAttachmentUploadUrl({});
          const fileResponse = await fetch(evidence.uri);
          const blob = await fileResponse.blob();
          const uploadResponse = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": evidence.mimeType ?? "application/octet-stream" }, body: blob });
          if (!uploadResponse.ok) throw new Error(locale === "sw" ? "Faili halijapakiwa." : "Evidence upload failed.");
          const result = await uploadResponse.json() as { storageId: Id<"_storage"> };
          storageId = result.storageId;
          actualSize = evidence.size ?? blob.size;
          uploadedEvidence.current = { key: evidenceKey, storageId, size: actualSize };
        }
        const attached = await attachToDraft({ requestId: saved.requestId, storageId, name: evidence.name, type: evidence.mimeType ?? "application/octet-stream", size: actualSize ?? 0 });
        expectedVersion = attached.version;
      }
      if (saved.status === "draft") await submitRequest({ requestId: saved.requestId, expectedVersion, consentVersion: "service-v1" });
      setSubmittedRequestId(saved.publicId ?? saved.requestId);
      setSubmittedRecordId(saved.requestId);
      resetDraft(locale);
      try { await clearSavedDraft(); } catch { setCleanupFailed(true); }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to submit request");
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  async function chooseEvidence() {
    const result = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/*", "text/plain"], copyToCacheDirectory: true, multiple: false });
    if (!result.canceled) setEvidence(result.assets[0]);
  }

  async function saveForLater() {
    setError("");
    setNotice("");
    try {
      await saveDraftForLater();
      setNotice(locale === "sw" ? "Rasimu imehifadhiwa kwenye kifaa hiki." : "Draft saved on this device.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : locale === "sw" ? "Rasimu haijahifadhiwa." : "Draft was not saved.");
    }
  }

  async function restoreDraft(guest = false) {
    setError("");
    setNotice("");
    try {
      const restored = guest ? await restoreGuestDraft() : await restoreSavedDraft();
      if (restored) setDraftRestored(true);
      setNotice(restored ? (locale === "sw" ? "Rasimu imerejeshwa." : "Draft restored.") : (locale === "sw" ? "Hakuna rasimu iliyohifadhiwa." : "No saved draft found."));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : locale === "sw" ? "Rasimu haijarejeshwa." : "Draft was not restored.");
    }
  }

  if (submittedRequestId) {
    return (
      <Screen style={styles.confirmScreen}>
        {cleanupFailed ? <View><Text accessibilityRole="alert" style={styles.error}>{locale === "sw" ? "Ombi limetumwa. Rasimu iliyohifadhiwa kwenye kifaa haikuondolewa. Usitume ombi tena; tumia namba ya kumbukumbu hapa chini." : "Your request was submitted. The saved draft on this device could not be removed. Do not submit again; use the reference below."}</Text><Button variant="secondary" label={locale === "sw" ? "Jaribu kuondoa rasimu ya kifaa" : "Retry clearing the device draft"} onPress={() => { void clearSavedDraft().then(() => setCleanupFailed(false)).catch(() => setCleanupFailed(true)); }} /></View> : null}
        <View style={styles.successCard}>
          <View style={styles.confettiRow}>
            <Text style={styles.confettiDot}>.</Text>
            <Text style={styles.confettiDotAlt}>.</Text>
            <Text style={styles.confettiDot}>.</Text>
          </View>
          <View style={styles.successIcon}><Ionicons name="checkmark" size={42} color={colors.surface} /></View>
          <Text style={styles.successTitle}>{locale === "sw" ? "Ombi limepokelewa" : "Request submitted!"}</Text>
          <Text style={styles.successBody}>{locale === "sw" ? "Tumepokea taarifa zako. LSF itakagua ombi na hatua inayofuata itaonekana kwenye kesi zako." : "We received your request. LSF will review it and the next step will appear in your cases."}</Text>
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
    <Screen footer={<View style={styles.actions}>
      {step < TOTAL_STEPS ? <Button label={t("next")} disabled={!canContinue} onPress={() => { if (step === TOTAL_STEPS - 1) void recordJourney({ surface: "mobile", step: "request_review" }).catch(() => undefined); setStep(step + 1); }} /> : <Button disabled={!consentAccepted} label={isSignedIn ? t("submit") : (locale === "sw" ? "Ingia kutuma ombi" : "Sign in to submit")} loading={loading} onPress={() => void finish()} />}
      <Button label={locale === "sw" ? "Hifadhi, endelea baadaye" : "Save, continue later"} variant="quiet" onPress={() => void saveForLater()} />
    </View>}>
      <View style={styles.header}><Pressable accessibilityRole="button" onPress={() => step > 1 ? setStep(step - 1) : router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable><Text style={styles.step}>{locale === "sw" ? `Hatua ya ${step} kati ya ${TOTAL_STEPS}` : `Step ${step} of ${TOTAL_STEPS}`}</Text><QuickExit locale={locale} /></View>
      <View style={styles.progressTrack}><View style={[styles.progress, { width: `${(step / TOTAL_STEPS) * 100}%` }]} /></View>
      {step === 1 ? IssueStep() : null}
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
        <View style={{ flex: 1 }}><Text style={styles.restoreText}>{locale === "sw" ? "Kuna rasimu iliyoandaliwa kabla ya kuingia kwenye akaunti. Ukiitumia, itahamishwa kwenye akaunti hii bila kutumwa." : "A draft was created before sign-in. Using it moves it to this account without submitting."}</Text>
        {hasSavedDraft || draft.description || draft.issueCategory ? <Text style={styles.fieldError}>{locale === "sw" ? "Hii itachukua nafasi ya rasimu ya akaunti hii." : "This replaces this account's current draft."}</Text> : null}
        <Button label={locale === "sw" ? "Tumia rasimu ya kabla ya kuingia" : "Use the draft created before sign-in"} variant="secondary" onPress={() => void restoreDraft(true)} /></View>
      </View> : null}
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </Screen>
  );

  function IssueStep() {
    return <View style={styles.section}><View style={styles.stepSymbol}><Ionicons name="help-buoy-outline" size={28} color={colors.surface} /></View><Text style={styles.title}>{locale === "sw" ? "Unahitaji msaada kuhusu nini?" : "What kind of problem do you need help with?"}</Text><Text style={styles.body}>{locale === "sw" ? "Chagua aina iliyo karibu zaidi. Unaweza kutoa maelezo katika hatua inayofuata." : "Choose the closest match. You can explain the details in the next step."}</Text><View style={styles.issueList}>{issueOptions.map((item) => { const selected = draft.issueCategory === item.key; return <Pressable key={item.key} accessibilityRole="radio" accessibilityState={{ checked: selected }} aria-checked={selected} style={[styles.issueOption, selected && styles.issueOptionSelected]} onPress={() => updateDraft({ issueCategory: item.key })}><View style={[styles.issueOptionIcon, selected && styles.issueOptionIconSelected]}><Ionicons name={item.icon} size={22} color={selected ? colors.surface : colors.burgundy} /></View><View style={styles.issueOptionCopy}><Text style={[styles.issueOptionTitle, selected && styles.issueOptionTitleSelected]}>{locale === "sw" ? item.sw : item.en}</Text><Text style={[styles.issueOptionBody, selected && styles.issueOptionBodySelected]}>{locale === "sw" ? item.swBody : item.enBody}</Text></View><Ionicons name={selected ? "checkmark-circle" : "chevron-forward"} size={21} color={selected ? colors.surface : colors.inkMuted} /></Pressable>; })}</View><Pressable style={styles.saadaHelp} onPress={() => router.push("/sara")}><Ionicons name="sparkles" size={20} color={colors.teal} /><View style={styles.issueOptionCopy}><Text style={styles.saadaHelpTitle}>{locale === "sw" ? "Huna uhakika? Muulize Saada" : "Not sure? Ask Saada"}</Text><Text style={styles.saadaHelpBody}>{locale === "sw" ? "Atakusaidia kuelewa chaguo bila kutuma ombi." : "Get guidance without submitting a request."}</Text></View><Ionicons name="arrow-forward" size={18} color={colors.teal} /></Pressable></View>;
  }

  function DescriptionStep() {
    return <View style={styles.section}><Text style={styles.title}>{t("whatHappened")}</Text><Text style={styles.body}>{t("ownWords")}</Text><TextInput multiline textAlignVertical="top" value={draft.description} onChangeText={(description) => updateDraft({ description, locale })} maxLength={5000} placeholder={locale === "sw" ? "Mfano: Mwajiri wangu hajalipa mshahara wangu..." : "Example: My employer has not paid my salary..."} placeholderTextColor={colors.inkMuted} style={styles.textArea} /><Text style={styles.counter}>{draft.description.length}/5000</Text><View style={styles.privacy}><Ionicons name="lock-closed-outline" size={18} color={colors.success} /><Text style={styles.privacyText}>{locale === "sw" ? "Usiweke taarifa zaidi ya zinazohitajika kueleza tatizo." : "Only include details needed to explain the problem."}</Text></View></View>;
  }

  function LocationStep() {
    return <View style={styles.section}><Text style={styles.title}>{locale === "sw" ? "Tupe maelezo muhimu" : "Add the important details"}</Text><Text style={styles.body}>{locale === "sw" ? "Mahali, tarehe na waliohusika hutusaidia kuelekeza ombi kwa usahihi." : "Location, date, and who was involved help us route your request correctly."}</Text><Field label={locale === "sw" ? "Mkoa" : "Region"} value={draft.region} onChangeText={(region) => updateDraft({ region })} autoCorrect={false} /><Field label={locale === "sw" ? "Wilaya" : "District"} value={draft.district} onChangeText={(district) => updateDraft({ district })} autoCorrect={false} /><Field label={locale === "sw" ? "Ilitokea lini? (YYYY-MM-DD, si lazima)" : "When did this happen? (YYYY-MM-DD, optional)"} value={draft.occurredOn} onChangeText={(occurredOn) => updateDraft({ occurredOn })} autoCorrect={false} />{!occurredOnIsValid ? <Text style={styles.fieldError}>{locale === "sw" ? "Tumia muundo YYYY-MM-DD, kwa mfano 2026-09-21." : "Use YYYY-MM-DD, for example 2026-09-21."}</Text> : null}<Field label={locale === "sw" ? "Nani au taasisi gani ilihusika? (si lazima)" : "Who or which organisation was involved? (optional)"} value={draft.involvedParties} onChangeText={(involvedParties) => updateDraft({ involvedParties })} /></View>;
  }

  function DesiredHelpStep() {
    return <View style={styles.section}><Text style={styles.title}>{locale === "sw" ? "Ungependa msaada gani?" : "What help are you looking for?"}</Text><Text style={styles.body}>{locale === "sw" ? "Eleza matokeo unayotumaini kupata." : "Describe the outcome you hope to achieve."}</Text><TextInput multiline textAlignVertical="top" value={draft.desiredHelp} onChangeText={(desiredHelp) => updateDraft({ desiredHelp })} maxLength={1000} placeholder={locale === "sw" ? "Mfano: Nataka msaada kufuatilia mshahara wangu..." : "Example: I need help following up my unpaid salary..."} placeholderTextColor={colors.inkMuted} style={styles.textArea} /></View>;
  }

  function DocumentsStep() {
    return <View style={styles.section}><Text style={styles.title}>{locale === "sw" ? "Ongeza ushahidi" : "Add evidence"}</Text><Text style={styles.body}>{locale === "sw" ? "Pakia picha au hati ikiwa ni salama kufanya hivyo. Unaweza kuruka hatua hii." : "Upload a photo or document if it is safe to do so. You can skip this step."}</Text><Choice label={locale === "sw" ? "Nina nyaraka au picha" : "I have documents or photos"} selected={draft.hasDocuments} onPress={() => updateDraft({ hasDocuments: !draft.hasDocuments })} />{draft.hasDocuments ? <View style={styles.uploadCard}><Text style={styles.body}>{evidence ? evidence.name : (locale === "sw" ? "Chagua ushahidi wa kupakia" : "Choose evidence to upload")}</Text><Button label={evidence ? (locale === "sw" ? "Badilisha faili" : "Choose another file") : (locale === "sw" ? "Chagua PDF au picha" : "Choose a PDF or photo")} variant="secondary" onPress={() => void chooseEvidence()} />{evidence ? <Text style={styles.meta}>{Math.round((evidence.size ?? 0) / 1024)} KB · {locale === "sw" ? "Itapakiwa kwa usalama" : "Will be uploaded securely"}</Text> : null}</View> : null}<View style={styles.privacy}><Ionicons name="eye-off-outline" size={18} color={colors.success} /><Text style={styles.privacyText}>{locale === "sw" ? "Usipakie hati ambayo inaweza kukuongeza hatarini. Unaweza kuitoa baadaye kwa njia salama." : "Do not upload anything that could increase your risk. You can provide it later through a safe channel."}</Text></View></View>;
  }

  function UrgencyStep() {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{locale === "sw" ? "Je, unahitaji msaada wa haraka?" : "Do you need urgent help?"}</Text>
        <Text style={styles.body}>{locale === "sw" ? "Chagua kiwango kinachoeleza hali yako kwa sasa." : "Choose the option that best describes your situation now."}</Text>
        <Choice label={locale === "sw" ? "Msaada wa kawaida" : "Standard support"} selected={draft.urgency === "standard"} onPress={() => updateDraft({ urgency: "standard" })} />
        <Choice label={locale === "sw" ? "Ni jambo la haraka" : "This is urgent"} selected={draft.urgency === "urgent"} onPress={() => updateDraft({ urgency: "urgent" })} />
        <Choice label={locale === "sw" ? "Kuna hatari ya usalama sasa" : "There is an immediate safety concern"} selected={draft.urgency === "immediate_safety"} onPress={() => updateDraft({ urgency: "immediate_safety" })} danger />
        {draft.urgency === "immediate_safety" ? (
          <View style={styles.safetyNotice}><Ionicons name="warning-outline" size={22} color={colors.danger} /><Text style={styles.safetyText}>{locale === "sw" ? "Haki Yangu si huduma ya dharura. Ikiwa uko kwenye hatari ya sasa, nenda mahali salama na wasiliana na huduma rasmi ya dharura iliyo karibu." : "Haki Yangu is not an emergency service. If you are in immediate danger, move to a safe place and contact an official local emergency service."}</Text></View>
        ) : null}
      </View>
    );
  }

  function ContactStep() {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{locale === "sw" ? "Tuwasiliane nawe kwa usalama" : "Let us contact you safely"}</Text>
        <Text style={styles.body}>{locale === "sw" ? "Chagua lugha na njia salama ya kupata taarifa kuhusu ombi lako." : "Choose your preferred language and the safest way to receive request updates."}</Text>
        <Text style={styles.label}>{locale === "sw" ? "Lugha unayopendelea kwa msaada" : "Preferred support language"}</Text>
        <View style={styles.chipRow}>
          {(["sw", "en", "both", "other"] as const).map((language) => (
            <Pressable key={language} style={[styles.chip, draft.preferredLanguage === language && styles.chipSelected]} onPress={() => updateDraft({ preferredLanguage: language })}>
              <Text style={[styles.chipText, draft.preferredLanguage === language && styles.chipTextSelected]}>{languageLabel(language)}</Text>
            </Pressable>
          ))}
        </View>
        {draft.preferredLanguage === "other" ? (
          <Field
            label={locale === "sw" ? "Andika lugha" : "Enter language"}
            value={draft.preferredLanguageOther}
            onChangeText={(preferredLanguageOther) => updateDraft({ preferredLanguageOther })}
          />
        ) : null}
        <Text style={styles.label}>{locale === "sw" ? "Njia salama ya kuwasiliana" : "Safe contact method"}</Text>
        <View style={styles.chipRow}>
          {(["in_app", "phone", "sms", "email", "none"] as const).map((method) => (
            <Pressable key={method} style={[styles.chip, draft.safeContactMethod === method && styles.chipSelected]} onPress={() => updateDraft({ safeContactMethod: method })}>
              <Text style={[styles.chipText, draft.safeContactMethod === method && styles.chipTextSelected]}>{contactLabel(method, locale)}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.privacy}><Ionicons name="notifications-off-outline" size={18} color={colors.success} /><Text style={styles.privacyText}>{locale === "sw" ? "Chagua ‘Hakuna’ ikiwa mawasiliano ya nje ya programu si salama. Unaweza kuangalia maendeleo ndani ya programu." : "Choose ‘None’ if contact outside the app is unsafe. You can check progress in the app."}</Text></View>
      </View>
    );
  }

  function ReviewStep() {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{locale === "sw" ? "Kagua ombi lako" : "Review your request"}</Text>
        <Text style={styles.body}>{locale === "sw" ? "Hakikisha taarifa hizi ni sahihi kabla ya kutuma." : "Please confirm the details before submitting."}</Text>
        <View style={styles.reviewPanel}>
          <ReviewRow icon="briefcase-outline" label={locale === "sw" ? "Aina" : "Category"} value={draft.issueCategory?.replaceAll("_", " ") || (locale === "sw" ? "Msaada wa kisheria" : "Legal help")} onEdit={() => setStep(1)} locale={locale} />
          {draft.sourceServiceId ? <ReviewRow icon="business-outline" label={locale === "sw" ? "Kutoka Tafuta Msaada" : "From Find Help"} value={locale === "sw" ? "Huduma uliyochagua imeunganishwa na ombi" : "Your selected service is linked to this request"} /> : null}
          <ReviewRow icon="document-text-outline" label={t("whatHappened")} value={draft.description} onEdit={() => setStep(2)} locale={locale} />
          <ReviewRow icon="location-outline" label={locale === "sw" ? "Mahali" : "Where"} value={`${draft.district}, ${draft.region}`} onEdit={() => setStep(3)} locale={locale} />
          <ReviewRow icon="calendar-outline" label={locale === "sw" ? "Wakati" : "When"} value={draft.occurredOn || (locale === "sw" ? "Haijawekwa" : "Not provided")} onEdit={() => setStep(3)} locale={locale} />
          {draft.involvedParties ? <ReviewRow icon="people-outline" label={locale === "sw" ? "Waliohusika" : "Involved"} value={draft.involvedParties} onEdit={() => setStep(3)} locale={locale} /> : null}
          <ReviewRow icon="help-circle-outline" label={locale === "sw" ? "Msaada" : "Requested help"} value={draft.desiredHelp} onEdit={() => setStep(4)} locale={locale} />
          <ReviewRow icon="folder-outline" label={locale === "sw" ? "Nyaraka" : "Documents"} value={evidence ? evidence.name : draft.hasDocuments ? (locale === "sw" ? "Umesema una nyaraka; hakuna faili iliyochaguliwa" : "You have documents; no file selected") : (locale === "sw" ? "Hakuna kwa sasa" : "None yet")} onEdit={() => setStep(5)} locale={locale} />
          <ReviewRow icon="language-outline" label={locale === "sw" ? "Lugha" : "Language"} value={languageLabel(draft.preferredLanguage, draft.preferredLanguageOther)} onEdit={() => setStep(7)} locale={locale} />
          <ReviewRow icon="call-outline" label={locale === "sw" ? "Mawasiliano" : "Safe contact"} value={contactLabel(draft.safeContactMethod, locale)} onEdit={() => setStep(7)} locale={locale} />
        </View>
        <Text style={styles.label}>{locale === "sw" ? "Dharura" : "Urgency"}</Text>
        <View style={styles.urgencyRow}>
          {(["standard", "urgent", "immediate_safety"] as const).map((urgency) => (
            <Pressable key={urgency} style={[styles.urgencyChip, draft.urgency === urgency && styles.urgencyChipActive]} onPress={() => updateDraft({ urgency })}>
              <Text style={[styles.urgencyText, draft.urgency === urgency && styles.urgencyTextActive]}>{urgencyLabel(urgency, locale)}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: consentAccepted }} onPress={() => setConsentAccepted(!consentAccepted)} style={styles.confirmCheck}>
          <Ionicons name={consentAccepted ? "checkbox" : "square-outline"} size={24} color={colors.burgundy} />
          <Text style={styles.confirmCheckText}>{locale === "sw" ? "Ninaomba LSF ikague taarifa nilizochagua kutuma na iwasiliane nami kwa njia salama niliyochagua. Nimeeleza ninachojua kwa uaminifu." : "I ask LSF to review the information I choose to send and contact me through my selected safe method. I have described what I know honestly."}</Text>
        </Pressable>
        <View style={styles.consent}><Ionicons name="lock-closed-outline" size={19} color={colors.inkMuted} /><Text style={styles.consentText}>{locale === "sw" ? "Taarifa zako ni salama na za faragha." : "Your information is secure and confidential."}</Text></View>
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
    sw: { in_app: "Ndani ya programu", phone: "Simu", sms: "Ujumbe mfupi", email: "Barua pepe", none: "Hakuna" },
    en: { in_app: "In app", phone: "Phone", sms: "SMS", email: "Email", none: "None" },
  };
  return labels[locale][method];
}

function Field({ label, value, onChangeText, autoCorrect }: { label: string; value: string; onChangeText: (value: string) => void; autoCorrect?: boolean }) {
  return <View><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} autoCorrect={autoCorrect} style={styles.input} maxLength={100} /></View>;
}

function Choice({ label, selected, onPress, danger = false }: { label: string; selected: boolean; onPress: () => void; danger?: boolean }) {
  return <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} aria-checked={selected} onPress={onPress} style={[styles.choice, selected && styles.choiceSelected, danger && selected && styles.choiceDanger]}><Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={22} color={danger && selected ? colors.danger : colors.burgundy} /><Text style={styles.choiceText}>{label}</Text></Pressable>;
}

function ReviewRow({ label, value, icon, onEdit, locale }: { label: string; value: string; icon?: keyof typeof Ionicons.glyphMap; onEdit?: () => void; locale?: "sw" | "en" }) {
  return <View style={styles.review}>{icon ? <Ionicons name={icon} size={16} color={colors.burgundy} /> : null}<Text style={styles.reviewLabel}>{label}</Text><Text style={styles.reviewValue}>{value}</Text>{onEdit ? <Pressable accessibilityRole="button" accessibilityLabel={`${locale === "sw" ? "Hariri" : "Edit"} ${label}`} onPress={onEdit} style={styles.editReview}><Text style={styles.editReviewText}>{locale === "sw" ? "Hariri" : "Edit"}</Text></Pressable> : null}</View>;
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  step: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13 },
  progressTrack: { height: 4, borderRadius: radius.pill, backgroundColor: colors.line, marginTop: spacing.lg },
  progress: { height: 4, borderRadius: radius.pill, backgroundColor: colors.burgundy },
  section: { marginTop: spacing.xl, gap: spacing.lg },
  stepSymbol: { width: 54, height: 54, borderRadius: 19, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 22 },
  textArea: { minHeight: 180, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, fontFamily: type.regular, color: colors.charcoal, fontSize: 15, lineHeight: 22 },
  counter: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, textAlign: "right", marginTop: -spacing.md },
  privacy: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start", padding: spacing.md, backgroundColor: "#E7F4ED", borderRadius: radius.sm },
  privacyText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, marginBottom: spacing.sm },
  input: { minHeight: 52, borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.lg, fontFamily: type.regular, color: colors.charcoal },
  choice: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  choiceSelected: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  choiceDanger: { borderColor: colors.danger, backgroundColor: "#FDEDEC" },
  choiceText: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 14 },
  issueList: { gap: spacing.sm },
  issueOption: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md },
  issueOptionSelected: { borderColor: colors.burgundy, backgroundColor: colors.burgundy },
  issueOptionIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" },
  issueOptionIconSelected: { backgroundColor: "rgba(255,255,255,0.16)" },
  issueOptionCopy: { flex: 1 },
  issueOptionTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 15 },
  issueOptionTitleSelected: { color: colors.surface },
  issueOptionBody: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  issueOptionBodySelected: { color: "#F8DCE6" },
  saadaHelp: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: "#B8DFDA", backgroundColor: colors.tealSoft, padding: spacing.md },
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
  reviewPanel: { borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, gap: spacing.sm },
  review: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingVertical: spacing.sm },
  reviewLabel: { width: 86, fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 13 },
  reviewValue: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 18 },
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
  error: { fontFamily: type.regular, color: colors.danger, marginTop: spacing.lg },
  fieldError: { marginTop: -spacing.md, fontFamily: type.regular, color: colors.danger, fontSize: 12, lineHeight: 17 },
  confirmScreen: { justifyContent: "center", paddingTop: spacing.xxl },
  successCard: { borderRadius: 26, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl, alignItems: "center", gap: spacing.lg, shadowColor: colors.charcoal, shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 12 }, elevation: 4 },
  confettiRow: { flexDirection: "row", gap: spacing.lg, height: 16 },
  confettiDot: { color: colors.orange, fontSize: 26, lineHeight: 19 },
  confettiDotAlt: { color: colors.teal, fontSize: 26, lineHeight: 19 },
  successIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.success, alignItems: "center", justifyContent: "center" },
  successTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 26, textAlign: "center" },
  successBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
  requestNumberCard: { alignSelf: "stretch", borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.lg, alignItems: "center", gap: spacing.xs },
  requestNumberLabel: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13 },
  requestNumber: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 18 },
});
