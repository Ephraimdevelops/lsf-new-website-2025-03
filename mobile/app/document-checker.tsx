import { useAuth } from "../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
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
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const cases = useQuery(api.caseManagement.myCases, isSignedIn ? {} : "skip");
  const generateDocumentUploadUrl = useMutation(api.caseManagement.generateDocumentUploadUrl);
  const addDocument = useMutation(api.caseManagement.addDocument);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [attaching, setAttaching] = useState(false);

  async function chooseFile() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      copyToCacheDirectory: false,
      multiple: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setSelectedFile(asset ?? null);
    setFileName(asset?.name ?? "");
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
    try {
      const response = await fetch(selectedFile.uri);
      const blob = await response.blob();
      const contentType = selectedFile.mimeType || blob.type || "application/octet-stream";
      const postUrl = await generateDocumentUploadUrl({ caseId: selectedCaseId as Id<"cases"> });
      const uploadResponse = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: blob,
      });
      if (!uploadResponse.ok) throw new Error(locale === "sw" ? "Faili halijapakiwa." : "File upload failed.");
      const { storageId } = await uploadResponse.json();
      await addDocument({
        caseId: selectedCaseId as Id<"cases">,
        storageId: storageId as Id<"_storage">,
        clientDocumentId: `document-checker-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: selectedFile.name,
        type: contentType,
        size: selectedFile.size || blob.size,
        category: "contract",
        note: locale === "sw" ? "Imechaguliwa kutoka zana ya kukagua hati kabla ya kusaini." : "Selected from the before-you-sign document checker.",
      });
      Alert.alert(locale === "sw" ? "Imewekwa kwenye kesi" : "Attached to case");
    } catch (error) {
      Alert.alert(locale === "sw" ? "Haijawekwa" : "Not attached", error instanceof Error ? error.message : String(error));
    } finally {
      setAttaching(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Kagua kabla ya kusaini" : "Before you sign"}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIcon}><Ionicons name="cloud-upload-outline" size={30} color={colors.burgundy} /></View>
        <Text style={styles.title}>{locale === "sw" ? "Kagua hati kwa dalili muhimu" : "Check a document for key risks"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Chagua PDF, picha, au Word document. Kwa sasa Haki Yangu inakupa orodha ya ukaguzi na njia ya kuomba msaada. Hati haitumwi bila hatua yako ya kuomba msaada."
            : "Choose a PDF, photo, or Word document. Haki Yangu gives you a review checklist and a path to request help. The document is not uploaded unless you start a help request."}
        </Text>
        <Button label={locale === "sw" ? "Chagua faili" : "Choose file"} onPress={() => void chooseFile()} />
      </View>

      {fileName ? (
        <View style={styles.fileCard}>
          <Ionicons name="document-text-outline" size={22} color={colors.burgundy} />
          <View style={styles.fileCopy}>
            <Text style={styles.fileName}>{fileName}</Text>
            <Text style={styles.fileMeta}>{locale === "sw" ? "Imechaguliwa kwenye kifaa hiki" : "Selected on this device"}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>{locale === "sw" ? "Kabla ya kusaini, hakikisha:" : "Before signing, check:"}</Text>
        {checks[locale].map((item) => (
          <View key={item} style={styles.checkRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.warningPanel}>
        <Text style={styles.warningTitle}>{locale === "sw" ? "Dalili za kusitisha na kuuliza" : "Stop and ask if:"}</Text>
        {redFlags[locale].map((item) => (
          <View key={item} style={styles.checkRow}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      <Button label={locale === "sw" ? "Omba msaada wa kukagua hati" : "Request document review help"} onPress={() => router.push("/intake")} />
      <View style={styles.attachPanel}>
        <Text style={styles.panelTitle}>{locale === "sw" ? "Weka hati kwenye kesi" : "Attach document to a case"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Chagua kesi tu ukiwa tayari kushiriki faili hili na timu yako ya kesi. Faili litapakiwa na kusubiri mapitio."
            : "Choose a case only when you are ready to share this file with your case team. The file will upload and wait for review."}
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
            <Button label={attaching ? (locale === "sw" ? "Inaweka..." : "Attaching...") : (locale === "sw" ? "Weka hati kwenye kesi" : "Attach document to case")} loading={attaching} disabled={attaching} onPress={() => void attachToCase()} />
          </>
        ) : (
          <Button label={locale === "sw" ? "Anza ombi kwanza" : "Start a request first"} onPress={() => router.push("/intake")} />
        )}
      </View>
      <Pressable style={styles.linkRow} onPress={() => router.push("/letter-builder")}>
        <Ionicons name="create-outline" size={18} color={colors.burgundy} />
        <Text style={styles.linkText}>{locale === "sw" ? "Tengeneza barua badala yake" : "Build a letter instead"}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md, marginBottom: spacing.lg },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  headerSpacer: { width: 26 },
  hero: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  heroIcon: { width: 58, height: 58, borderRadius: radius.lg, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 25, lineHeight: 31 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  fileCard: { marginTop: spacing.lg, flexDirection: "row", alignItems: "center", gap: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: "#FBF7F8", padding: spacing.lg },
  fileCopy: { flex: 1, gap: 2 },
  fileName: { fontFamily: type.bold, color: colors.charcoal, fontSize: 14 },
  fileMeta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12 },
  panel: { marginTop: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  warningPanel: { marginTop: spacing.lg, marginBottom: spacing.lg, backgroundColor: "#FFF7E8", borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  attachPanel: { marginTop: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.md },
  panelTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  warningTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  checkText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  caseList: { gap: spacing.sm },
  caseOption: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, backgroundColor: colors.background, gap: 3 },
  caseOptionActive: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  caseOptionTextActive: { color: colors.burgundy },
  caseId: { fontFamily: type.bold, color: colors.charcoal, fontSize: 13 },
  caseSummary: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  linkRow: { marginTop: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, paddingVertical: spacing.md },
  linkText: { fontFamily: type.medium, color: colors.burgundy, fontSize: 13 },
});
