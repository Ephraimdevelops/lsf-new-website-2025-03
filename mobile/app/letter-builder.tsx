import { useAuth } from "../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const DRAFT_KEY = "haki_yangu_demand_letter_draft";

function today(locale: "sw" | "en") {
  return new Date().toLocaleDateString(locale === "sw" ? "sw-TZ" : "en-TZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function LetterBuilderScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const cases = useQuery(api.caseManagement.myCases, isSignedIn ? {} : "skip");
  const addGeneratedLetterDocument = useMutation(api.caseManagement.addGeneratedLetterDocument);
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [issue, setIssue] = useState("");
  const [request, setRequest] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("7");
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [attaching, setAttaching] = useState(false);
  const deadline = Number.parseInt(deadlineDays, 10);
  const safeDeadline = Number.isFinite(deadline) && deadline > 0 ? Math.min(deadline, 30) : 7;

  useEffect(() => {
    SecureStore.getItemAsync(DRAFT_KEY)
      .then((stored) => {
        if (!stored) return;
        const draft = JSON.parse(stored) as {
          senderName?: string;
          recipientName?: string;
          issue?: string;
          request?: string;
          deadlineDays?: string;
          savedAt?: number;
        };
        setSenderName(draft.senderName ?? "");
        setRecipientName(draft.recipientName ?? "");
        setIssue(draft.issue ?? "");
        setRequest(draft.request ?? "");
        setDeadlineDays(draft.deadlineDays ?? "7");
        setDraftSavedAt(draft.savedAt ?? null);
      })
      .catch(() => {
        setDraftSavedAt(null);
      });
  }, []);

  const preview = locale === "sw"
    ? [
      `Tarehe: ${today(locale)}`,
      "",
      `Kwa: ${recipientName.trim() || "[Jina la anayepokea]"}`,
      "",
      "YAH: OMBI LA UTATUZI WA TATIZO",
      "",
      `Mimi, ${senderName.trim() || "[Jina lako]"}, ninaandika kuhusu suala lifuatalo:`,
      issue.trim() || "[Eleza tatizo kwa ufupi, tarehe muhimu, kiasi au makubaliano yanayohusika.]",
      "",
      "Ninaomba hatua ifuatayo ichukuliwe:",
      request.trim() || "[Eleza unachotaka kifanyike, mfano kulipwa, kurejeshewa mali, au kupata jibu la maandishi.]",
      "",
      `Tafadhali nijibu ndani ya siku ${safeDeadline}. Nimehifadhi nakala ya barua hii na ushahidi wangu.`,
      "",
      "Wako,",
      senderName.trim() || "[Jina lako]",
    ].join("\n")
    : [
      `Date: ${today(locale)}`,
      "",
      `To: ${recipientName.trim() || "[Recipient name]"}`,
      "",
      "RE: REQUEST TO RESOLVE A LEGAL ISSUE",
      "",
      `I, ${senderName.trim() || "[Your name]"}, am writing about the following issue:`,
      issue.trim() || "[Briefly explain the problem, important dates, amount, or agreement involved.]",
      "",
      "I request the following action:",
      request.trim() || "[Explain what you want done, for example payment, return of property, or a written response.]",
      "",
      `Please respond within ${safeDeadline} days. I have kept a copy of this letter and my evidence.`,
      "",
      "Sincerely,",
      senderName.trim() || "[Your name]",
    ].join("\n");

  async function shareLetter() {
    if (!senderName.trim() || !recipientName.trim() || !issue.trim() || !request.trim()) {
      Alert.alert(
        locale === "sw" ? "Kagua taarifa" : "Review details",
        locale === "sw" ? "Jaza jina, mpokeaji, tatizo, na unachoomba kabla ya kutuma." : "Add your name, recipient, issue, and requested action before sharing.",
      );
      return;
    }
    await Share.share({ message: preview });
  }

  function hasCompleteDraft() {
    return Boolean(senderName.trim() && recipientName.trim() && issue.trim() && request.trim());
  }

  async function attachToCase() {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (!selectedCaseId) {
      Alert.alert(locale === "sw" ? "Chagua kesi" : "Choose a case");
      return;
    }
    if (!hasCompleteDraft()) {
      Alert.alert(
        locale === "sw" ? "Kagua taarifa" : "Review details",
        locale === "sw" ? "Jaza rasimu kabla ya kuiweka kwenye kesi." : "Complete the draft before attaching it to a case.",
      );
      return;
    }
    setAttaching(true);
    try {
      await addGeneratedLetterDocument({
        caseId: selectedCaseId as Parameters<typeof addGeneratedLetterDocument>[0]["caseId"],
        clientDocumentId: `letter-builder-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: locale === "sw" ? "Rasimu ya barua ya madai.txt" : "Demand letter draft.txt",
        textContent: preview,
        note: locale === "sw" ? "Imeundwa kwenye zana ya Haki Yangu ya barua." : "Created with the Haki Yangu letter builder.",
      });
      Alert.alert(locale === "sw" ? "Imewekwa kwenye kesi" : "Attached to case");
    } catch (error) {
      Alert.alert(locale === "sw" ? "Haijawekwa" : "Not attached", error instanceof Error ? error.message : String(error));
    } finally {
      setAttaching(false);
    }
  }

  async function saveDraft() {
    const savedAt = Date.now();
    await SecureStore.setItemAsync(DRAFT_KEY, JSON.stringify({
      senderName,
      recipientName,
      issue,
      request,
      deadlineDays,
      savedAt,
    }), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    setDraftSavedAt(savedAt);
    Alert.alert(locale === "sw" ? "Rasimu imehifadhiwa" : "Draft saved");
  }

  async function deleteDraft() {
    await SecureStore.deleteItemAsync(DRAFT_KEY);
    setSenderName("");
    setRecipientName("");
    setIssue("");
    setRequest("");
    setDeadlineDays("7");
    setDraftSavedAt(null);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Tengeneza barua" : "Letter builder"}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIcon}><Ionicons name="document-text-outline" size={28} color={colors.burgundy} /></View>
        <Text style={styles.title}>{locale === "sw" ? "Andaa barua ya madai kwa hatua rahisi" : "Draft a demand letter step by step"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Hii ni rasimu ya lugha rahisi. Kagua kabla ya kuituma na omba msaada kama suala ni la hatari au lina utata."
            : "This creates a plain-language draft. Review it before sending and request help if the matter is risky or complex."}
        </Text>
        {draftSavedAt ? (
          <Text style={styles.savedText}>
            {locale === "sw" ? "Rasimu ya mwisho:" : "Last saved:"} {new Date(draftSavedAt).toLocaleString(locale === "sw" ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })}
          </Text>
        ) : null}
      </View>

      <View style={styles.form}>
        <Field label={locale === "sw" ? "Jina lako" : "Your name"} value={senderName} onChangeText={setSenderName} placeholder={locale === "sw" ? "Mfano: Asha Said" : "Example: Asha Said"} />
        <Field label={locale === "sw" ? "Unamwandikia nani?" : "Who are you writing to?"} value={recipientName} onChangeText={setRecipientName} placeholder={locale === "sw" ? "Mfano: ABC Company Ltd" : "Example: ABC Company Ltd"} />
        <Field label={locale === "sw" ? "Tatizo ni nini?" : "What is the issue?"} value={issue} onChangeText={setIssue} multiline placeholder={locale === "sw" ? "Mfano: Sijalipwa mshahara wa miezi miwili..." : "Example: I have not been paid for two months..."} />
        <Field label={locale === "sw" ? "Unaomba nini kifanyike?" : "What action do you want?"} value={request} onChangeText={setRequest} multiline placeholder={locale === "sw" ? "Mfano: Nilipwe kiasi ninachodai ndani ya siku 7." : "Example: Pay the amount owed within 7 days."} />
        <Field label={locale === "sw" ? "Muda wa kujibu, siku" : "Response deadline, days"} value={deadlineDays} onChangeText={setDeadlineDays} keyboardType="number-pad" placeholder="7" />
      </View>

      <View style={styles.draftActions}>
        <Pressable style={styles.secondaryAction} onPress={() => void saveDraft()}>
          <Ionicons name="save-outline" size={18} color={colors.burgundy} />
          <Text style={styles.secondaryText}>{locale === "sw" ? "Hifadhi rasimu salama" : "Save secure draft"}</Text>
        </Pressable>
        {draftSavedAt ? (
          <Pressable style={styles.secondaryAction} onPress={() => void deleteDraft()}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={[styles.secondaryText, styles.dangerText]}>{locale === "sw" ? "Futa rasimu" : "Delete draft"}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>{locale === "sw" ? "Rasimu ya barua" : "Letter draft"}</Text>
        <Text style={styles.preview}>{preview}</Text>
      </View>

      <Button label={locale === "sw" ? "Shiriki au hifadhi rasimu" : "Share or save draft"} onPress={() => void shareLetter()} />
      <View style={styles.attachPanel}>
        <Text style={styles.previewTitle}>{locale === "sw" ? "Weka kwenye kesi" : "Attach to a case"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Hii itahifadhi rasimu kama nyaraka ya kesi inayosubiri mapitio. Chagua kesi tu ukiwa tayari kushiriki na timu yako ya kesi."
            : "This saves the draft as a pending case document. Choose a case only when you are ready to share it with your case team."}
        </Text>
        {!isSignedIn ? (
          <Button label={locale === "sw" ? "Ingia ili kuweka kwenye kesi" : "Sign in to attach to a case"} onPress={() => router.push("/sign-in")} />
        ) : cases?.length ? (
          <>
            <View style={styles.caseList}>
              {cases.map((item) => (
                <Pressable key={item._id} onPress={() => setSelectedCaseId(item._id)} style={[styles.caseOption, selectedCaseId === item._id && styles.caseOptionActive]}>
                  <Text style={[styles.caseId, selectedCaseId === item._id && styles.caseOptionTextActive]}>{item.publicId}</Text>
                  <Text style={styles.caseSummary} numberOfLines={2}>{item.summary}</Text>
                </Pressable>
              ))}
            </View>
            <Button label={attaching ? (locale === "sw" ? "Inaweka..." : "Attaching...") : (locale === "sw" ? "Weka rasimu kwenye kesi" : "Attach draft to case")} loading={attaching} disabled={attaching} onPress={() => void attachToCase()} />
          </>
        ) : (
          <Button label={locale === "sw" ? "Anza ombi kwanza" : "Start a request first"} onPress={() => router.push("/intake")} />
        )}
      </View>
      <Pressable style={styles.helpLink} onPress={() => router.push("/intake")}>
        <Ionicons name="people-outline" size={18} color={colors.burgundy} />
        <Text style={styles.helpText}>{locale === "sw" ? "Nahitaji msaada kuhusu barua hii" : "I need help with this letter"}</Text>
      </Pressable>
    </Screen>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "default" | "number-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        multiline={props.multiline}
        keyboardType={props.keyboardType ?? "default"}
        placeholder={props.placeholder}
        placeholderTextColor={colors.inkMuted}
        style={[styles.input, props.multiline && styles.textArea]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md, marginBottom: spacing.lg },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  headerSpacer: { width: 26 },
  hero: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  heroIcon: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.peach, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 24, lineHeight: 30 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  savedText: { fontFamily: type.medium, color: colors.burgundy, fontSize: 12 },
  form: { marginTop: spacing.xl, gap: spacing.md },
  field: { gap: spacing.xs },
  label: { fontFamily: type.bold, color: colors.charcoal, fontSize: 13 },
  input: { minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontFamily: type.regular, color: colors.charcoal, fontSize: 14 },
  textArea: { minHeight: 96, textAlignVertical: "top" },
  draftActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.lg },
  secondaryAction: { flexDirection: "row", alignItems: "center", gap: spacing.xs, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  secondaryText: { fontFamily: type.medium, color: colors.burgundy, fontSize: 12 },
  dangerText: { color: colors.danger },
  previewCard: { marginTop: spacing.xl, marginBottom: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FBF7F8", padding: spacing.lg, gap: spacing.md },
  previewTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 16 },
  preview: { fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  attachPanel: { marginBottom: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.md },
  caseList: { gap: spacing.sm },
  caseOption: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, backgroundColor: colors.background, gap: 3 },
  caseOptionActive: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  caseOptionTextActive: { color: colors.burgundy },
  caseId: { fontFamily: type.bold, color: colors.charcoal, fontSize: 13 },
  caseSummary: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  helpLink: { marginTop: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, paddingVertical: spacing.md },
  helpText: { fontFamily: type.medium, color: colors.burgundy, fontSize: 13 },
});
