import type { Id } from "../../../convex/_generated/dataModel";
import { ParalegalIntro } from "../../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../../src/components/ParalegalNavigation";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { CivicPageHeader as AppHeader } from "../../src/components/CivicPageHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";

const categories: Record<string, { sw: string; en: string }> = {
  evidence: { sw: "Ushahidi", en: "Evidence" }, identity: { sw: "Kitambulisho", en: "Identity" },
  contract: { sw: "Mkataba", en: "Contract" }, letter: { sw: "Barua", en: "Letter" },
  receipt: { sw: "Risiti", en: "Receipt" }, other: { sw: "Nyingine", en: "Other" },
};

export default function DocumentDetailScreen() {
  useSensitiveScreenProtection("document-details");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const document = useQuery(api.caseManagement.getDocument, isSignedIn && id ? { documentId: id as Id<"case_documents"> } : "skip");
  const workCase = document?.context === "work";
  return <Screen footer={workCase ? <ParalegalNavigation current="cases" /> : undefined}>
    <AppHeader back title={sw ? "Maelezo ya hati" : "Document details"} compact />
    {!isSignedIn ? <State title={sw ? "Hati yako inalindwa" : "Your document is private"} body={sw ? "Ingia kwa usalama ili kuiona." : "Sign in securely to view it."} label={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
    : document === undefined ? <State title={sw ? "Tunapakia hati" : "Loading document"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
    : !document ? <State title={sw ? "Hati haipatikani" : "Document not found"} body={sw ? "Huenda imeondolewa au huna ruhusa ya kuiona." : "It may have been removed, or you may not have access."} label={sw ? "Nyaraka zangu" : "My documents"} onPress={() => router.replace("/documents")} />
    : <>
      {workCase && <ParalegalIntro pose="direction" title={sw ? "Pitia hati kwa uangalifu." : "Review the document with care."} body={sw ? "Angalia maelezo ya ukaguzi na hatua inayofuata kwenye kesi." : "Check the review notes and the next step inside the case."} />}
      <View style={styles.hero}><View style={styles.icon}><Ionicons name="document-text-outline" size={32} color={colors.surface} /></View><Text style={styles.heroTitle}>{document.name}</Text><Text style={styles.heroMeta}>{categories[document.category]?.[locale] ?? document.category} · {document.casePublicId}</Text></View>
      <View style={styles.statusCard}><Ionicons name={document.status === "accepted" ? "checkmark-circle-outline" : document.status === "rejected" ? "alert-circle-outline" : "time-outline"} size={25} color={document.status === "accepted" ? colors.teal : colors.burgundy} /><View style={styles.flex}><Text style={styles.statusTitle}>{document.status === "accepted" ? (sw ? "Imekubaliwa" : "Accepted") : document.status === "rejected" ? (sw ? "Inahitaji hatua nyingine" : "Needs another step") : (sw ? "Inasubiri mapitio" : "Pending review")}</Text><Text style={styles.statusBody}>{document.status === "pending_review" ? (sw ? "Timu ya kesi bado haijathibitisha hati hii." : "The case team has not reviewed this document yet.") : document.status === "accepted" ? (sw ? "Timu ya kesi imeikagua hati hii." : "The case team has reviewed this document.") : (sw ? "Angalia maelezo ya mapitio hapa chini." : "Read the review note below.")}</Text></View></View>
      {document.reviewNotes ? <View style={styles.note}><Text style={styles.sectionTitle}>{sw ? "Ujumbe wa mapitio" : "Review note"}</Text><Text style={styles.body}>{document.reviewNotes}</Text></View> : null}
      {document.textContent ? <View style={styles.note}><Text style={styles.sectionTitle}>{sw ? "Maandishi ya hati" : "Document text"}</Text><Text style={styles.body}>{document.textContent}</Text></View> : null}
      <View style={styles.actions}>
        {document.url ? <Button label={sw ? "Fungua faili" : "Open file"} onPress={() => void Linking.openURL(document.url!)} /> : null}
        <Button label={sw ? "Fungua kesi husika" : "Open related case"} variant={document.url ? "secondary" : "primary"} onPress={() => router.push({ pathname: "/case/[id]", params: { id: document.caseId, section: "documents" } })} />
      </View>
      <Text style={styles.privacy}>{sw ? "Hati hii inaonekana tu kwa watu wenye ruhusa ya kesi yako." : "Only people authorised for your case can see this document."}</Text>
    </>}
  </Screen>;
}

function State({ title, body, label, onPress }: { title: string; body: string; label?: string; onPress?: () => void }) {
  return <View style={styles.state}><Ionicons name="lock-closed-outline" size={34} color={colors.burgundy} /><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.body}>{body}</Text>{label && onPress ? <Button label={label} onPress={onPress} /> : null}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, hero: { borderRadius: radius.xl, backgroundColor: colors.burgundy, padding: spacing.xl, gap: spacing.md },
  icon: { width: 58, height: 58, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.17)", alignItems: "center", justifyContent: "center" },
  heroTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 25, lineHeight: 31 }, heroMeta: { fontFamily: type.medium, color: "#F7DFE7", fontSize: 13 },
  statusCard: { marginTop: spacing.lg, flexDirection: "row", gap: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg },
  statusTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 16 }, statusBody: { marginTop: 4, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  note: { marginTop: spacing.lg, gap: spacing.sm, borderRadius: radius.lg, backgroundColor: colors.softPink, padding: spacing.lg }, sectionTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 18 }, body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  actions: { marginTop: spacing.xl, gap: spacing.sm }, privacy: { marginTop: spacing.md, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18, textAlign: "center" },
  state: { marginTop: spacing.xxl, alignItems: "center", gap: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.xl },
});
