import { useAuth } from "../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { QuickExit } from "../src/components/QuickExit";
import { Screen } from "../src/components/Screen";
import { useIntakeDraft } from "../src/intake/IntakeDraftContext";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

const TOTAL_STEPS = 5;

export default function IntakeScreen() {
  useSensitiveScreenProtection("intake");
  const { isSignedIn } = useAuth();
  const { locale, t } = useLanguage();
  const { draft, hasSavedDraft, updateDraft, resetDraft, saveDraftForLater, restoreSavedDraft, clearSavedDraft } = useIntakeDraft();
  const saveDraft = useMutation(api.legalHelp.saveDraft);
  const submitRequest = useMutation(api.legalHelp.submit);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submittedRequestId, setSubmittedRequestId] = useState("");

  const canContinue =
    (step === 1 && draft.description.trim().length >= 10) ||
    (step === 2 && draft.region.trim() && draft.district.trim()) ||
    (step === 3 && draft.desiredHelp.trim().length >= 3) ||
    (step === 4 && (draft.preferredLanguage !== "other" || draft.preferredLanguageOther.trim().length >= 2)) ||
    step >= 5;

  async function finish() {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      if (!isSignedIn) {
        await saveDraftForLater();
        setSubmittedRequestId(`HY-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
        return;
      }
      const saved = await saveDraft({
        clientRequestId: draft.clientRequestId,
        locale,
        description: draft.description,
        region: draft.region,
        district: draft.district,
        desiredHelp: draft.desiredHelp,
        safeContactMethod: draft.safeContactMethod,
        preferredLanguage: draft.preferredLanguage,
        preferredLanguageOther: draft.preferredLanguageOther,
        urgency: draft.urgency,
        hasDocuments: draft.hasDocuments,
      });
      await submitRequest({ requestId: saved.requestId, expectedVersion: saved.version, consentVersion: "service-v1" });
      resetDraft(locale);
      await clearSavedDraft();
      setSubmittedRequestId(saved.publicId ?? "HY-2025-000123");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to submit request");
    } finally {
      setLoading(false);
    }
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

  async function restoreDraft() {
    setError("");
    setNotice("");
    try {
      const restored = await restoreSavedDraft();
      setNotice(restored ? (locale === "sw" ? "Rasimu imerejeshwa." : "Draft restored.") : (locale === "sw" ? "Hakuna rasimu iliyohifadhiwa." : "No saved draft found."));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : locale === "sw" ? "Rasimu haijarejeshwa." : "Draft was not restored.");
    }
  }

  if (submittedRequestId) {
    return (
      <Screen style={styles.confirmScreen}>
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
          <Button label={locale === "sw" ? "Angalia kesi yangu" : "View my case"} onPress={() => router.replace("/(tabs)/cases")} />
          <Button label={locale === "sw" ? "Rudi nyumbani" : "Back to home"} variant="secondary" onPress={() => { resetDraft(locale); router.replace("/(tabs)"); }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}><Pressable accessibilityRole="button" onPress={() => step > 1 ? setStep(step - 1) : router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable><Text style={styles.step}>{locale === "sw" ? `Hatua ya ${step} kati ya ${TOTAL_STEPS}` : `Step ${step} of ${TOTAL_STEPS}`}</Text><QuickExit locale={locale} /></View>
      <View style={styles.progressTrack}><View style={[styles.progress, { width: `${(step / TOTAL_STEPS) * 100}%` }]} /></View>
      {step === 1 ? <DescriptionStep /> : null}
      {step === 2 ? <LocationStep /> : null}
      {step === 3 ? <DesiredHelpStep /> : null}
      {step === 4 ? <SafetyStep /> : null}
      {step === 5 ? <ReviewStep /> : null}
      {hasSavedDraft ? (
        <Pressable style={styles.restoreCard} onPress={() => void restoreDraft()}>
          <Ionicons name="refresh-outline" size={18} color={colors.burgundy} />
          <Text style={styles.restoreText}>{locale === "sw" ? "Rejesha rasimu iliyohifadhiwa" : "Restore saved draft"}</Text>
        </Pressable>
      ) : null}
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        {step < TOTAL_STEPS ? <Button label={t("next")} disabled={!canContinue} onPress={() => setStep(step + 1)} /> : <Button label={isSignedIn ? t("submit") : (locale === "sw" ? "Wasilisha ombi" : "Submit request")} loading={loading} onPress={() => void finish()} />}
        <Button label={locale === "sw" ? "Hifadhi, endelea baadaye" : "Save, continue later"} variant="quiet" onPress={() => void saveForLater()} />
        {step > 1 ? <Button label={t("back")} variant="quiet" onPress={() => setStep(step - 1)} /> : null}
      </View>
    </Screen>
  );

  function DescriptionStep() {
    return <View style={styles.section}><Text style={styles.title}>{t("whatHappened")}</Text><Text style={styles.body}>{t("ownWords")}</Text><TextInput multiline textAlignVertical="top" value={draft.description} onChangeText={(description) => updateDraft({ description, locale })} maxLength={5000} placeholder={locale === "sw" ? "Mfano: Mwajiri wangu hajalipa mshahara wangu..." : "Example: My employer has not paid my salary..."} placeholderTextColor={colors.inkMuted} style={styles.textArea} /><Text style={styles.counter}>{draft.description.length}/5000</Text><View style={styles.privacy}><Ionicons name="lock-closed-outline" size={18} color={colors.success} /><Text style={styles.privacyText}>{locale === "sw" ? "Usiweke taarifa zaidi ya zinazohitajika kueleza tatizo." : "Only include details needed to explain the problem."}</Text></View></View>;
  }

  function LocationStep() {
    return <View style={styles.section}><Text style={styles.title}>{locale === "sw" ? "Hili lilitokea wapi?" : "Where did this happen?"}</Text><Text style={styles.body}>{locale === "sw" ? "Mahali hutusaidia kuelekeza ombi kwa huduma inayofaa." : "Location helps us route the request to the right service."}</Text><Field label={locale === "sw" ? "Mkoa" : "Region"} value={draft.region} onChangeText={(region) => updateDraft({ region })} /><Field label={locale === "sw" ? "Wilaya" : "District"} value={draft.district} onChangeText={(district) => updateDraft({ district })} /></View>;
  }

  function DesiredHelpStep() {
    return <View style={styles.section}><Text style={styles.title}>{locale === "sw" ? "Ungependa msaada gani?" : "What help are you looking for?"}</Text><Text style={styles.body}>{locale === "sw" ? "Eleza matokeo unayotumaini kupata." : "Describe the outcome you hope to achieve."}</Text><TextInput multiline textAlignVertical="top" value={draft.desiredHelp} onChangeText={(desiredHelp) => updateDraft({ desiredHelp })} maxLength={1000} placeholder={locale === "sw" ? "Mfano: Nataka msaada kufuatilia mshahara wangu..." : "Example: I need help following up my unpaid salary..."} placeholderTextColor={colors.inkMuted} style={styles.textArea} /><Choice label={locale === "sw" ? "Nina nyaraka au picha" : "I have documents or photos"} selected={draft.hasDocuments} onPress={() => updateDraft({ hasDocuments: !draft.hasDocuments })} /></View>;
  }

  function SafetyStep() {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{locale === "sw" ? "Je, unahitaji msaada wa haraka?" : "Do you need urgent help?"}</Text>
        <Text style={styles.body}>{locale === "sw" ? "Chagua kiwango kinachoeleza hali yako kwa sasa." : "Choose the option that best describes your situation now."}</Text>
        <Choice label={locale === "sw" ? "Msaada wa kawaida" : "Standard support"} selected={draft.urgency === "standard"} onPress={() => updateDraft({ urgency: "standard" })} />
        <Choice label={locale === "sw" ? "Ni jambo la haraka" : "This is urgent"} selected={draft.urgency === "urgent"} onPress={() => updateDraft({ urgency: "urgent" })} />
        <Choice label={locale === "sw" ? "Kuna hatari ya usalama sasa" : "There is an immediate safety concern"} selected={draft.urgency === "immediate_safety"} onPress={() => updateDraft({ urgency: "immediate_safety" })} danger />
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
              <Text style={[styles.chipText, draft.safeContactMethod === method && styles.chipTextSelected]}>{method.replace("_", " ")}</Text>
            </Pressable>
          ))}
        </View>
        {draft.urgency === "immediate_safety" ? (
          <View style={styles.safetyNotice}>
            <Ionicons name="warning-outline" size={22} color={colors.danger} />
            <Text style={styles.safetyText}>{locale === "sw" ? "Haki Yangu si huduma ya dharura. Ikiwa uko kwenye hatari ya sasa, nenda mahali salama na wasiliana na huduma rasmi ya dharura iliyo karibu." : "Haki Yangu is not an emergency service. If you are in immediate danger, move to a safe place and contact an official local emergency service."}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  function ReviewStep() {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{locale === "sw" ? "Kagua ombi lako" : "Review your request"}</Text>
        <Text style={styles.body}>{locale === "sw" ? "Hakikisha taarifa hizi ni sahihi kabla ya kutuma." : "Please confirm the details before submitting."}</Text>
        <View style={styles.reviewPanel}>
          <ReviewRow icon="briefcase-outline" label={locale === "sw" ? "Aina" : "Category"} value={draft.desiredHelp || (locale === "sw" ? "Msaada wa kisheria" : "Legal help")} />
          <ReviewRow icon="document-text-outline" label={t("whatHappened")} value={draft.description} />
          <ReviewRow icon="location-outline" label={locale === "sw" ? "Mahali" : "Where"} value={`${draft.district}, ${draft.region}`} />
          <ReviewRow icon="calendar-outline" label={locale === "sw" ? "Wakati" : "When"} value={new Date().toLocaleDateString(locale === "sw" ? "sw-TZ" : "en-TZ", { dateStyle: "medium" })} />
          <ReviewRow icon="folder-outline" label={locale === "sw" ? "Nyaraka" : "Documents"} value={draft.hasDocuments ? (locale === "sw" ? "Zipo" : "Attached / available") : (locale === "sw" ? "Hakuna kwa sasa" : "None yet")} />
        </View>
        <Text style={styles.label}>{locale === "sw" ? "Dharura" : "Urgency"}</Text>
        <View style={styles.urgencyRow}>
          {(["standard", "urgent", "immediate_safety"] as const).map((urgency) => (
            <Pressable key={urgency} style={[styles.urgencyChip, draft.urgency === urgency && styles.urgencyChipActive]} onPress={() => updateDraft({ urgency })}>
              <Text style={[styles.urgencyText, draft.urgency === urgency && styles.urgencyTextActive]}>{urgencyLabel(urgency, locale)}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.confirmCheck}>
          <Ionicons name="checkbox" size={22} color={colors.burgundy} />
          <Text style={styles.confirmCheckText}>{locale === "sw" ? "Ninathibitisha kuwa taarifa nilizotoa ni za kweli na sahihi." : "I confirm that the information provided is true and accurate."}</Text>
        </View>
        <View style={styles.consent}><Ionicons name="lock-closed-outline" size={19} color={colors.inkMuted} /><Text style={styles.consentText}>{locale === "sw" ? "Taarifa zako ni salama na za faragha." : "Your information is secure and confidential."}</Text></View>
      </View>
    );
  }
}

function urgencyLabel(urgency: "standard" | "urgent" | "immediate_safety", locale: "sw" | "en") {
  const labels = {
    sw: { standard: "Kawaida", urgent: "Haraka", immediate_safety: "Juu" },
    en: { standard: "Low", urgent: "Medium", immediate_safety: "High" },
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

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return <View><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} style={styles.input} maxLength={100} /></View>;
}

function Choice({ label, selected, onPress, danger = false }: { label: string; selected: boolean; onPress: () => void; danger?: boolean }) {
  return <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress} style={[styles.choice, selected && styles.choiceSelected, danger && selected && styles.choiceDanger]}><Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={22} color={danger && selected ? colors.danger : colors.burgundy} /><Text style={styles.choiceText}>{label}</Text></Pressable>;
}

function ReviewRow({ label, value, icon }: { label: string; value: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return <View style={styles.review}>{icon ? <Ionicons name={icon} size={16} color={colors.burgundy} /> : null}<Text style={styles.reviewLabel}>{label}</Text><Text style={styles.reviewValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  step: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 13 },
  progressTrack: { height: 4, borderRadius: radius.pill, backgroundColor: colors.line, marginTop: spacing.lg },
  progress: { height: 4, borderRadius: radius.pill, backgroundColor: colors.burgundy },
  section: { marginTop: spacing.xxl, gap: spacing.lg },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 22 },
  textArea: { minHeight: 180, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, fontFamily: type.regular, color: colors.charcoal, fontSize: 15, lineHeight: 22 },
  counter: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 11, textAlign: "right", marginTop: -spacing.md },
  privacy: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start", padding: spacing.md, backgroundColor: "#E7F4ED", borderRadius: radius.sm },
  privacyText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 12, lineHeight: 18 },
  label: { fontFamily: type.medium, color: colors.charcoal, fontSize: 13, marginBottom: spacing.sm },
  input: { minHeight: 52, borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.lg, fontFamily: type.regular, color: colors.charcoal },
  choice: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  choiceSelected: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  choiceDanger: { borderColor: colors.danger, backgroundColor: "#FDEDEC" },
  choiceText: { flex: 1, fontFamily: type.medium, color: colors.charcoal, fontSize: 14 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  chipSelected: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  chipText: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12, textTransform: "capitalize" },
  chipTextSelected: { color: colors.burgundy },
  safetyNotice: { flexDirection: "row", gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, backgroundColor: "#FDEDEC" },
  safetyText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  reviewPanel: { borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, gap: spacing.sm },
  review: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingVertical: spacing.sm },
  reviewLabel: { width: 86, fontFamily: type.bold, color: colors.charcoal, fontSize: 12 },
  reviewValue: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
  urgencyRow: { flexDirection: "row", gap: spacing.sm },
  urgencyChip: { flex: 1, minHeight: 42, borderRadius: radius.pill, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  urgencyChipActive: { backgroundColor: colors.burgundy },
  urgencyText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  urgencyTextActive: { color: colors.surface },
  confirmCheck: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md },
  confirmCheckText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 12, lineHeight: 18 },
  consent: { flexDirection: "row", gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: "#F7F5F6", alignItems: "center" },
  consentText: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
  restoreCard: { marginTop: spacing.xl, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: "#E8B8CC", backgroundColor: colors.softPink, padding: spacing.md },
  restoreText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 13 },
  notice: { fontFamily: type.medium, color: colors.success, marginTop: spacing.lg, textAlign: "center" },
  actions: { gap: spacing.sm, marginTop: spacing.xxl },
  error: { fontFamily: type.regular, color: colors.danger, marginTop: spacing.lg },
  confirmScreen: { justifyContent: "center", paddingTop: spacing.xxl },
  successCard: { borderRadius: 26, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl, alignItems: "center", gap: spacing.lg, shadowColor: colors.charcoal, shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 12 }, elevation: 4 },
  confettiRow: { flexDirection: "row", gap: spacing.lg, height: 16 },
  confettiDot: { color: colors.orange, fontSize: 26, lineHeight: 10 },
  confettiDotAlt: { color: colors.teal, fontSize: 26, lineHeight: 10 },
  successIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.success, alignItems: "center", justifyContent: "center" },
  successTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 26, textAlign: "center" },
  successBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: "center" },
  requestNumberCard: { alignSelf: "stretch", borderRadius: radius.md, backgroundColor: colors.softPink, padding: spacing.lg, alignItems: "center", gap: spacing.xs },
  requestNumberLabel: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  requestNumber: { fontFamily: type.bold, color: colors.burgundy, fontSize: 18 },
});
