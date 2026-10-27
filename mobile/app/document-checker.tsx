import { useAuth } from "../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { CivicIllustration } from "../src/components/CivicIllustration";
import { CivicPageHeader } from "../src/components/CivicPageHeader";
import { Screen } from "../src/components/Screen";
import { uploadEvidence } from "../src/intake/uploadEvidence";
import { useIntakeDraft } from "../src/intake/IntakeDraftContext";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const checks = {
  sw: [
    "Majina yote yameandikwa kwa usahihi.",
    "Kiasi, tarehe, muda na adhabu zimeeleweka.",
    "Wajibu wa kila upande umeandikwa wazi.",
    "Kuna sehemu ya saini, mashahidi au mihuri inapohitajika.",
    "Hakuna ukurasa, kiambatanisho au kipengele kisichoeleweka.",
  ],
  en: [
    "All names are written correctly.",
    "Amount, dates, duration, and penalties are clear.",
    "Each party's obligations are written plainly.",
    "Signature, witness, or stamp sections are present where needed.",
    "No page, attachment, or clause is unclear.",
  ],
};

const redFlags = {
  sw: [
    "Unaambiwa usisome au usichukue nakala.",
    "Kuna nafasi tupu kwenye kiasi, tarehe au jina.",
    "Unatakiwa kulipa kabla ya kuthibitisha mmiliki au mamlaka.",
    "Kuna kipengele cha adhabu kubwa usichokielewa.",
  ],
  en: [
    "You are told not to read it or not to keep a copy.",
    "Amount, date, or name fields are blank.",
    "You must pay before ownership or authority is verified.",
    "There is a penalty clause you do not understand.",
  ],
};

export default function DocumentCheckerScreen() {
  const { isLoaded, userId } = useAuth();
  return <DocumentTool key={isLoaded ? userId ?? "guest" : "loading"} />;
}

function DocumentTool() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const { draft, updateDraft } = useIntakeDraft();
  const cases = useQuery(api.caseManagement.myCases, isSignedIn ? {} : "skip");
  const generateDocumentUploadUrl = useMutation(api.caseManagement.generateDocumentUploadUrl);
  const addDocument = useMutation(api.caseManagement.addDocument);
  const generatePersonalUpload = useMutation(api.personalDocuments.generateUploadUrl);
  const savePersonalDocument = useMutation(api.personalDocuments.save);
  const [personalStorageId, setPersonalStorageId] = useState<Id<"_storage"> | null>(null);
  const [savedDocumentId, setSavedDocumentId] = useState<Id<"personal_documents"> | null>(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [attaching, setAttaching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [attached, setAttached] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showCases, setShowCases] = useState(false);
  const [error, setError] = useState("");
  const sw = locale === "sw";

  async function selectFile(asset: DocumentPicker.DocumentPickerAsset) {
    let size = asset.size;
    if (!size) {
      if (Platform.OS === "web") size = (await (await fetch(asset.uri)).blob()).size;
      else { const info = await FileSystem.getInfoAsync(asset.uri); size = info.exists ? info.size : 0; }
    }
    if (!size || size > 10 * 1024 * 1024) {
      setError(sw ? "Chagua hati isiyozidi MB 10." : "Choose a document under 10 MB.");
      return;
    }
    setSelectedFile({ ...asset, size }); setFileName(asset.name); setAttached(false); setProgress(0); setError(""); setPersonalStorageId(null); setSavedDocumentId(null);
  }

  async function takePhoto() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) { setError(sw ? "Ruhusu kamera au chagua faili kwenye simu." : "Allow camera access or choose a file instead."); return; }
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 });
      if (result.canceled) return;
      const asset = result.assets[0];
      await selectFile({ uri: asset.uri, name: asset.fileName || `hati-${Date.now()}.jpg`, mimeType: asset.mimeType || "image/jpeg", size: asset.fileSize, lastModified: Date.now() });
    } catch { setError(sw ? "Kamera haijafunguka. Jaribu kuchagua faili." : "Camera unavailable. Try choosing a file."); }
  }

  async function chooseFile() {
    try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (asset) await selectFile(asset);
    } catch { setError(sw ? "Faili halijafunguka. Jaribu tena." : "Couldn't open the file. Try again."); }
  }

  async function saveToLibrary() {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    if (!selectedFile || attaching) return;
    setAttaching(true); setError(""); setProgress(0);
    try {
      const storageId = personalStorageId ?? await uploadEvidence(await generatePersonalUpload({}), { uri: selectedFile.uri, mimeType: selectedFile.mimeType || "application/octet-stream", size: selectedFile.size || 0 }, setProgress) as Id<"_storage">;
      setPersonalStorageId(storageId);
      const id = await savePersonalDocument({ storageId, name: selectedFile.name });
      setSavedDocumentId(id); setProgress(100);
    } catch { setError(sw ? "Hati haijahifadhiwa. Angalia mtandao, kisha jaribu tena." : "Document not saved. Check your connection, then retry."); }
    finally { setAttaching(false); }
  }

  async function attachToCase() {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (!selectedFile) {
      Alert.alert(locale === "sw" ? "Chagua faili" : "Choose a file");
      return;
    }
    if (!selectedCaseId) {
      Alert.alert(locale === "sw" ? "Chagua kesi" : "Choose a case");
      return;
    }
    setAttaching(true);
    setError(""); setProgress(0);
    try {
      const contentType = selectedFile.mimeType || "application/octet-stream";
      const postUrl = await generateDocumentUploadUrl({ caseId: selectedCaseId as Id<"cases"> });
      const storageId = await uploadEvidence(postUrl, { uri: selectedFile.uri, mimeType: contentType, size: selectedFile.size || 0 }, setProgress);
      await addDocument({
        caseId: selectedCaseId as Id<"cases">,
        storageId: storageId as Id<"_storage">,
        clientDocumentId: `document-checker-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: selectedFile.name,
        type: contentType,
        size: selectedFile.size || 0,
        category: "contract",
        note: locale === "sw" ? "Imechaguliwa kutoka zana ya kukagua hati kabla ya kusaini." : "Selected from the before-you-sign document checker.",
      });
      setProgress(100); setAttached(true);
    } catch (error) {
      setError(sw ? "Hati haijawekwa. Angalia mtandao na ujaribu tena." : "Document not attached. Check your connection and try again.");
    } finally {
      setAttaching(false);
    }
  }

  return (
    <Screen>
      <CivicPageHeader back compact title={sw ? "Elewa hati yako" : "Understand a document"} actionIcon="help-circle-outline" actionLabel={sw ? "Kuhusu zana hii" : "About this tool"} onAction={() => setShowGuide(value => !value)} />

      <View style={styles.hero}>
        <View style={styles.intro}><View style={styles.fileCopy}><Text style={styles.toolLabel}>HAKI YANGU · {sw ? "ZANA YA HATI" : "DOCUMENT TOOL"}</Text><Text style={styles.title}>{sw ? "Piga picha. Hifadhi. Elewa." : "Capture. Save. Understand."}</Text><Text style={styles.body}>{sw ? "Hifadhi hati. Ukiamua, omba maelezo mafupi ya AI." : "Save a document. Choose an AI summary if you want one."}</Text></View><CivicIllustration pose="documents" size={112} /></View>
        {!selectedFile ? <View style={styles.capture}><Ionicons name="scan-outline" size={32} color={colors.teal} /><Text style={styles.panelTitle}>{sw ? "Chagua hati ya kuanza" : "Choose a document to start"}</Text><Text style={styles.fileMeta}>{sw ? "PDF au picha · Hadi MB 10" : "PDF or photo · Up to 10 MB"}</Text></View> : null}
        <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Piga picha ya hati" : "Take a document photo"} disabled={attaching} onPress={() => void takePhoto()} style={styles.primaryAction}><Ionicons name="camera-outline" size={22} color={colors.surface} /><Text style={styles.primaryLabel}>{sw ? "Piga picha ya hati" : "Take a document photo"}</Text></Pressable>
        <Pressable accessibilityRole="button" disabled={attaching} onPress={() => void chooseFile()} style={styles.linkRow}><Ionicons name="folder-open-outline" size={21} color={colors.burgundy} /><Text style={styles.linkText}>{sw ? "Chagua faili kwenye simu" : "Choose a file from your phone"}</Text></Pressable>
      </View>

      {fileName ? (
        <View style={styles.fileCard}>
          <Ionicons name={attached || savedDocumentId ? "checkmark-circle" : "document-text-outline"} size={24} color={attached || savedDocumentId ? colors.teal : colors.burgundy} />
          <View style={styles.fileCopy}>
            <Text style={styles.fileName}>{fileName}</Text>
            <Text style={styles.fileMeta}>{attaching ? `${sw ? "Inapakiwa" : "Uploading"} ${progress}%` : savedDocumentId ? (sw ? "Imehifadhiwa kwenye akaunti yako" : "Saved to your private account") : attached ? (sw ? "Imewekwa kwenye kesi" : "Attached to your case") : (sw ? "Ipo kwenye simu tu. Bado haijahifadhiwa." : "On your device only. Not saved yet.")}</Text>
          </View>
          {!attaching ? <Pressable accessibilityRole="button" accessibilityLabel={sw ? "Ondoa hati iliyochaguliwa" : "Remove selected document"} onPress={() => { setSelectedFile(null); setFileName(""); setAttached(false); setShowCases(false); setSavedDocumentId(null); setPersonalStorageId(null); }} style={styles.remove}><Ionicons name="close" size={21} color={colors.inkMuted} /></Pressable> : null}
        </View>
      ) : null}

      {selectedFile ? <View style={styles.attachPanel}>{savedDocumentId ? <Button label={sw ? "Fungua hati na maelezo ya AI" : "Open document and AI summary"} onPress={() => router.push({ pathname: "/saved-document/[id]", params: { id: savedDocumentId } })} /> : <Button label={sw ? "Hifadhi kwenye akaunti yangu" : "Save to my account"} loading={attaching} disabled={attaching} onPress={() => void saveToLibrary()} />}<Text style={styles.fileMeta}>{sw ? "Timu ya kesi haiioni hati hii mpaka uchague kuishirikisha." : "Your case team cannot see this document unless you choose to share it."}</Text></View> : null}
      <Pressable accessibilityRole="button" style={styles.optionRow} onPress={() => router.push("/(tabs)/learn?view=saved")}><Ionicons name="bookmark-outline" size={22} color={colors.teal} /><Text style={styles.optionText}>{sw ? "Hati nilizohifadhi" : "My saved documents"}</Text><Ionicons name="arrow-forward" size={18} color={colors.teal} /></Pressable>
      {showGuide ? <View style={styles.panel}>
        <Text style={styles.body}>{sw ? "Huu ni mwongozo wa kujikagua, si uchambuzi wa AI au uthibitisho wa kisheria. Kuchagua hati hakuitumi kwa LSF." : "This is a self-check guide, not AI analysis or legal approval. Selecting a document does not send it to LSF."}</Text>
        <Text style={styles.panelTitle}>{locale === "sw" ? "Kabla ya kusaini, hakikisha:" : "Before signing, check:"}</Text>
        {checks[locale].map((item) => (
          <View key={item} style={styles.checkRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View> : null}

      {showGuide ? <View style={styles.warningPanel}>
        <Text style={styles.warningTitle}>{locale === "sw" ? "Dalili za kusitisha na kuuliza" : "Stop and ask if:"}</Text>
        {redFlags[locale].map((item) => (
          <View key={item} style={styles.checkRow}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View> : null}

      {selectedFile ? <>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: showGuide }} onPress={() => setShowGuide(value => !value)} style={styles.optionRow}><Ionicons name="list-outline" size={22} color={colors.teal} /><Text style={styles.optionText}>{sw ? "Cha kuangalia kabla ya kusaini" : "What to check before signing"}</Text><Ionicons name={showGuide ? "chevron-up" : "chevron-down"} size={18} color={colors.inkMuted} /></Pressable>
      {!attached ? <Pressable accessibilityRole="button" accessibilityState={{ expanded: showCases }} onPress={() => setShowCases(value => !value)} style={styles.optionRow}><Ionicons name="folder-outline" size={22} color={colors.burgundy} /><Text style={styles.optionText}>{sw ? "Weka hati kwenye kesi yangu" : "Attach to my case"}</Text><Ionicons name={showCases ? "chevron-up" : "chevron-down"} size={18} color={colors.inkMuted} /></Pressable> : null}
      </> : <Text style={styles.disclaimer}>{sw ? "Maelezo ya AI ni ya kukusaidia kuelewa, si uthibitisho wa kisheria." : "An AI summary helps you understand a document; it is not legal approval."}</Text>}
      {selectedFile && showCases && !attached ? <View style={styles.attachPanel}>
        <Text style={styles.panelTitle}>{locale === "sw" ? "Weka hati kwenye kesi" : "Attach document to a case"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Ukibonyeza Weka hati, itashirikiwa na timu ya kesi uliyochagua."
            : "When you tap Attach, this document is shared with the selected case team."}
        </Text>
        {!isSignedIn ? (
          <Button label={locale === "sw" ? "Ingia ili kuweka kwenye kesi" : "Sign in to attach to a case"} onPress={() => router.push("/sign-in")} />
        ) : cases?.length ? (
          <>
            <View style={styles.caseList}>
              {cases.map((item) => (
                <Pressable accessibilityRole="radio" accessibilityState={{ checked: selectedCaseId === item._id }} disabled={attaching} key={item._id} onPress={() => setSelectedCaseId(item._id)} style={[styles.caseOption, selectedCaseId === item._id && styles.caseOptionActive]}>
                  <Text style={[styles.caseId, selectedCaseId === item._id && styles.caseOptionTextActive]}>{item.publicId}</Text>
                  <Text style={styles.caseSummary} numberOfLines={2}>{item.summary}</Text>
                </Pressable>
              ))}
            </View>
            <Button label={attaching ? (locale === "sw" ? "Inaweka..." : "Attaching...") : (locale === "sw" ? "Weka hati kwenye kesi" : "Attach document to case")} loading={attaching} disabled={attaching || !selectedCaseId} onPress={() => void attachToCase()} />
          </>
        ) : (
          <Button label={locale === "sw" ? "Anza ombi kwanza" : "Start a request first"} onPress={() => router.push("/intake")} />
        )}
      </View> : null}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <Pressable accessibilityRole="button" disabled={attaching} style={styles.optionRow} onPress={() => {
        if (selectedFile && !(draft.evidence ?? []).some(file => file.uri === selectedFile.uri)) {
          if ((draft.evidence?.length ?? 0) >= 10) { setError(sw ? "Ombi lina hati 10 tayari. Ondoa moja kabla ya kuongeza hii." : "Your request already has 10 documents. Remove one before adding this."); return; }
          updateDraft({ hasDocuments: true, evidence: [...(draft.evidence ?? []), { uri: selectedFile.uri, name: selectedFile.name, mimeType: selectedFile.mimeType || "application/octet-stream", size: selectedFile.size || 0 }] });
        }
        router.push("/intake");
      }}><Ionicons name="chatbubbles-outline" size={22} color={colors.teal} /><View style={styles.fileCopy}><Text style={styles.optionText}>{sw ? "Nahitaji mtu anisaidie" : "I need someone to help"}</Text><Text style={styles.fileMeta}>{sw ? "Omba msaada kuhusu hati yako" : "Request help with your document"}</Text></View><Ionicons name="arrow-forward" size={20} color={colors.teal} /></Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md, marginBottom: spacing.lg },
  headerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 },
  headerSpacer: { width: 26 },
  hero: { gap: spacing.md },
  intro: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  toolLabel: { fontFamily: type.medium, fontSize: 10, lineHeight: 16, color: colors.teal, marginBottom: 8 },
  capture: { minHeight: 120, alignItems: "center", justifyContent: "center", backgroundColor: "#F0F6F4", borderRadius: 8, gap: 10, padding: 16 },
  primaryAction: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: colors.burgundy, borderRadius: 8, padding: 12 },
  primaryLabel: { fontFamily: type.semibold, color: colors.surface, fontSize: 15 },
  optionRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 64, paddingVertical: 16 },
  optionText: { flex: 1, fontFamily: type.medium, fontSize: 14, lineHeight: 21, color: colors.ink },
  remove: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  disclaimer: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 19, textAlign: "center", marginVertical: 16 },
  error: { fontFamily: type.regular, color: colors.danger, fontSize: 13, lineHeight: 20, marginTop: 12 },
  heroIcon: { width: 58, height: 58, borderRadius: radius.lg, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: type.semibold, color: colors.charcoal, fontSize: 23, lineHeight: 30, marginBottom: 8 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  fileCard: { marginTop: spacing.lg, flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: 8, backgroundColor: "#F3F5F4", padding: spacing.md },
  fileCopy: { flex: 1, gap: 2 },
  fileName: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14 },
  fileMeta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13 },
  panel: { marginTop: spacing.xl, gap: spacing.md },
  warningPanel: { marginTop: spacing.lg, marginBottom: spacing.lg, backgroundColor: "#FFF7E8", borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  attachPanel: { marginTop: spacing.lg, gap: spacing.md },
  panelTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 },
  warningTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 },
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  checkText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  caseList: { gap: spacing.sm },
  caseOption: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, backgroundColor: colors.background, gap: 3 },
  caseOptionActive: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  caseOptionTextActive: { color: colors.burgundy },
  caseId: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 13 },
  caseSummary: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  linkRow: { marginTop: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, paddingVertical: spacing.md },
  linkText: { fontFamily: type.medium, fontWeight: "500", color: colors.burgundy, fontSize: 13 },
});
