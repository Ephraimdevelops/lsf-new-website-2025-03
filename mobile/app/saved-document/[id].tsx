import { BrandLoading } from '../../src/components/BrandLoading';
import { useAuth } from "../../src/auth";
import { useAction, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Platform, StyleSheet, Text, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { Button } from "../../src/components/Button";
import { CivicIllustration } from "../../src/components/CivicIllustration";
import { CivicPageHeader } from "../../src/components/CivicPageHeader";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

export default function SavedDocumentScreen() {
  useSensitiveScreenProtection("saved-document");
  const { isLoaded, isSignedIn } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const document = useQuery(api.personalDocuments.get, isSignedIn && id ? { id: id as Id<"personal_documents"> } : "skip");
  const summarize = useAction(api.documentBrief.summarize);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function createBrief() {
    if (!document || busy) return;
    setBusy(true); setError("");
    try { await summarize({ id: document._id, locale, consent: true }); }
    catch (cause) {
      const data = cause instanceof ConvexError ? cause.data : null;
      const code = data && typeof data === "object" && "code" in data ? String(data.code) : "";
      const messages: Record<string, { sw: string; en: string }> = {
        UNREADABLE_PDF: { sw: "PDF hii haina maandishi yanayosomeka. Piga picha iliyo wazi ya ukurasa badala yake.", en: "This PDF has no readable text. Take a clear photo of the page instead." },
        DOCUMENT_TOO_LONG: { sw: "Hati hii ni ndefu sana. Ongeza kurasa zinazohusika tu.", en: "This document is too long. Add only the relevant pages." },
        AI_UNAVAILABLE: { sw: "Haki Yangu AI haipatikani kwa sasa. Hati yako bado ipo.", en: "Haki Yangu AI is unavailable. Your document is still saved." },
        RATE_LIMITED: { sw: "Umeomba maelezo mara kadhaa. Subiri kidogo ujaribu tena.", en: "You have requested several summaries. Wait before trying again." },
      };
      setError(messages[code]?.[locale] ?? (sw ? "Maelezo hayajapatikana. Hati yako ipo; jaribu tena baadaye." : "The summary is unavailable. Your document is saved; try again later."));
    }
    finally { setBusy(false); }
  }
  function confirmBrief() {
    const title = sw ? "AI isome hati hii?" : "Let AI read this document?";
    const message = sw ? "Hati itatumwa kwa OpenAI kuandaa muhtasari wa AI. Muhtasari unaweza kukosea; si ushauri wa kisheria. Endelea ikiwa unakubali." : "Your document will be sent to OpenAI for an AI summary. It can be wrong and is not legal advice. Continue if you agree.";
    if (Platform.OS === "web") { if (window.confirm(`${title}\n\n${message}`)) void createBrief(); }
    else Alert.alert(title, message, [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Nimekubali" : "I agree", onPress: () => void createBrief() }]);
  }
  return <Screen><CivicPageHeader back compact title={sw ? "Hati yangu" : "My document"} />
    <View style={styles.intro}><View style={{ flex: 1 }}><Text style={styles.title}>{!id || document === null ? (sw ? "Hati haipatikani" : "Document unavailable") : (sw ? "Imehifadhiwa kwa ajili yako." : "Saved for you.")}</Text><Text style={styles.body}>{sw ? "Hati binafsi kwenye akaunti yako." : "A private document in your account."}</Text></View><CivicIllustration pose="documents" size={96} /></View>
    {!isLoaded ? <BrandLoading compact task="account"/> : !isSignedIn ? <Button label={sw ? "Ingia kuona hati" : "Sign in to view document"} onPress={() => router.push("/sign-in")} /> : !id || document === null ? <Text accessibilityRole="alert" style={styles.body}>{sw ? "Hati hii haipatikani kwenye akaunti yako. Rudi kwenye orodha ya nyaraka." : "This document is unavailable in your account. Return to your document list."}</Text> : document === undefined ? <BrandLoading compact task="documents"/> : <>
      <Text style={styles.name}>{document.name}</Text><Text style={styles.body}>{(document.size / 1024 / 1024).toFixed(2)} MB · {new Date(document.createdAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { timeZone: "Africa/Dar_es_Salaam" })}</Text>
      <Button label={sw ? "Fungua hati" : "Open document"} variant="secondary" onPress={() => { if (document.url) void Linking.openURL(document.url).catch(() => setError(sw ? "Hati haijafunguka." : "Could not open document.")); }} />
      <Text style={styles.heading}>{sw ? "Muhtasari wa AI" : "AI summary"}</Text>
      {document.brief && document.briefLocale === locale ? <Text style={styles.brief}>{document.brief}</Text> : <><Text style={styles.body}>{sw ? "Pata muhtasari wa aina ya hati na mambo muhimu." : "Get a summary of the document type and key points."}</Text><Button label={sw ? "Pata muhtasari" : "Get a summary"} loading={busy} disabled={busy} onPress={confirmBrief} /></>}
      {document.brief ? <Button label={sw ? "Uliza Haki Yangu AI kuhusu hati hii" : "Ask Haki Yangu AI about this document"} variant="secondary" onPress={() => router.push({pathname:"/sara",params:{documentId:document._id}})} /> : null}
      <Text style={styles.note}>{sw ? "AI inaweza kukosea. Hakikisha maelezo kwenye hati halisi; hii si idhini ya kusaini." : "AI can make mistakes. Check the original document; this is not approval to sign."}</Text>
    </>}{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </Screen>;
}
const styles = StyleSheet.create({
  intro: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24 }, title: { fontFamily: type.semibold, fontSize: 22, lineHeight: 29, color: colors.ink },
  name: { fontFamily: type.medium, fontSize: 18, lineHeight: 26, color: colors.ink, marginBottom: 8 }, body: { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted, marginBottom: 18 },
  heading: { fontFamily: type.semibold, fontSize: 18, color: colors.ink, marginTop: 28, marginBottom: 12 }, brief: { fontFamily: type.regular, fontSize: 15, lineHeight: 25, color: colors.ink, padding: 16, backgroundColor: "#F0F6F4", borderRadius: 8 },
  note: { fontFamily: type.regular, fontSize: 12, lineHeight: 19, color: colors.inkMuted, marginTop: 16 }, error: { fontFamily: type.regular, fontSize: 13, lineHeight: 21, color: colors.danger, marginTop: 16 },
});
