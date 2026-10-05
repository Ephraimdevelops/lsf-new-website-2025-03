import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Linking, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

export default function LegalGuideReviewScreen() {
  useSensitiveScreenProtection("legal-guide-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role) => role === "content_editor" || role === "admin") ?? false;
  const isAdmin = access?.roles.includes("admin") ?? false;
  const record = useQuery(api.publications.getLegalGuideForReview, allowed && id ? { id: id as Id<"legal_guides"> } : "skip");
  const review = useMutation(api.publications.reviewLegalGuide);
  const [note, setNote] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");

  async function decide(decision: "approved" | "rejected") {
    if (!record?.guide || busy) return;
    setBusy(true); setError("");
    try { await review({ id: record.guide._id, decision, note: note.trim() }); router.replace("/editorial-workspace"); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }

  const guide = record?.guide; const previous = record?.previous; const rejectedDraft = record?.rejectedDraft;
  const sourceReviewExpired = !!guide && guide.reviewDueAt <= Date.now();
  return <Screen>
    <AppHeader back title={sw ? "Kagua mwongozo" : "Review guide"} eyebrow="LSF · EDITORIAL REVIEW" />
    {access === undefined ? <Message text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <Message text={sw ? "Ruhusa ya uhariri inahitajika." : "Editorial access required."} /> : record === undefined ? <Message text={sw ? "Inapakia mwongozo..." : "Loading guide..."} /> : !guide ? <Message text={sw ? "Mwongozo haupatikani au huna ruhusa." : "Guide unavailable or access denied."} /> : <>
      <View style={styles.hero}><Text style={styles.kicker}>{sw ? "UKAGUZI WA LUGHA MBILI" : "BILINGUAL REVIEW"}</Text><Text style={styles.heroTitle}>{guide.titleSw}</Text><Text style={styles.heroBody}>{guide.titleEn}</Text></View>
      <Surface tone={guide.status === "pending" ? "orange" : "teal"}><Text style={styles.title}>{sw ? "Hali na toleo" : "Status & version"}</Text><Text style={styles.body}>v{guide.version} · {guide.status} · {guide.jurisdiction}</Text><Text style={styles.body}>{sw ? "Ukaguzi wa chanzo kabla ya" : "Source review due"} {new Date(guide.reviewDueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ")}</Text>{guide.reviewNote ? <Text style={styles.body}>{guide.reviewNote}</Text> : null}</Surface>
      <LanguageBlock title="Kiswahili" heading={guide.titleSw} summary={guide.summarySw} steps={guide.stepsSw} />
      <LanguageBlock title="English" heading={guide.titleEn} summary={guide.summaryEn} steps={guide.stepsEn} />
      <Surface><Text style={styles.title}>{sw ? "Chanzo na umiliki" : "Source & provenance"}</Text><Text style={styles.body}>{guide.sourceTitle} · {guide.publisher}</Text><Text selectable style={styles.link}>{guide.sourceUrl}</Text><Button label={sw ? "Fungua chanzo rasmi" : "Open official source"} variant="secondary" onPress={() => void Linking.openURL(guide.sourceUrl).catch((caught) => setError(caught instanceof Error ? caught.message : String(caught)))} /><Text style={styles.body}>{guide.category} · {guide.jurisdiction}</Text></Surface>
      {previous ? <Surface tone="pink"><Text style={styles.title}>{sw ? "Linganisha toleo linalobadilishwa" : "Compare replaced version"}</Text><Text style={styles.body}>v{previous.version} · {previous.status}</Text><Text style={styles.label}>Kiswahili</Text><Text style={styles.body}>{previous.titleSw}</Text><Text style={styles.body}>{previous.summarySw}</Text>{previous.stepsSw.map((step, index) => <Text key={`sw-${index}`} style={styles.body}>{index + 1}. {step}</Text>)}<Text style={styles.label}>English</Text><Text style={styles.body}>{previous.titleEn}</Text><Text style={styles.body}>{previous.summaryEn}</Text>{previous.stepsEn.map((step, index) => <Text key={`en-${index}`} style={styles.body}>{index + 1}. {step}</Text>)}<Text style={styles.body}>{previous.sourceTitle} · {previous.publisher}</Text><Text selectable style={styles.link}>{previous.sourceUrl}</Text></Surface> : null}
      {rejectedDraft ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Rasimu iliyokataliwa kabla" : "Previously rejected draft"}</Text><Text style={styles.body}>{rejectedDraft.titleSw} / {rejectedDraft.titleEn} · v{rejectedDraft.version}</Text><Text style={styles.body}>{sw ? "Sababu ya kukataliwa" : "Rejection reason"}: {rejectedDraft.reviewNote || "—"}</Text><Text style={styles.body}>{sw ? "Linganisha mabadiliko ya lugha zote na chanzo kabla ya kuidhinisha." : "Compare both languages and the source before approving the correction."}</Text><LanguageBlock title="Kiswahili" heading={rejectedDraft.titleSw} summary={rejectedDraft.summarySw} steps={rejectedDraft.stepsSw} /><LanguageBlock title="English" heading={rejectedDraft.titleEn} summary={rejectedDraft.summaryEn} steps={rejectedDraft.stepsEn} /><Text style={styles.body}>{rejectedDraft.sourceTitle} · {rejectedDraft.publisher}</Text><Text selectable style={styles.link}>{rejectedDraft.sourceUrl}</Text></Surface> : null}
      {error ? <Surface tone="orange"><Text accessibilityRole="alert" style={styles.error}>{error}</Text></Surface> : null}
      {isAdmin && guide.status === "pending" && guide.submittedBy === access?.user?._id ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Ukaguzi huru unahitajika" : "Independent review required"}</Text><Text style={styles.body}>{sw ? "Uliwasilisha mwongozo huu. Msimamizi mwingine lazima akague na aamue." : "You submitted this guide. Another administrator must review and decide."}</Text></Surface> : null}
      {isAdmin && guide.status === "pending" && guide.submittedBy !== access?.user?._id ? <Surface tone="pink"><Text style={styles.title}>{sw ? "Uamuzi huru" : "Independent decision"}</Text><Text style={styles.body}>{sw ? "Kagua chanzo, usahihi wa kisheria, hatua na tafsiri zote mbili kabla ya kuchapisha. Aliyewasilisha hawezi kujithibitishia." : "Check the source, legal accuracy, steps and both languages before publication. The submitter cannot approve their own guide."}</Text>{sourceReviewExpired ? <Text style={styles.error}>{sw ? "Tarehe ya ukaguzi imepita. Omba toleo jipya lenye chanzo kilichokaguliwa kabla ya kuchapisha." : "The source review date has passed. Request a new version with a checked source before publication."}</Text> : null}<TextInput value={note} onChangeText={setNote} multiline maxLength={2000} style={styles.input} placeholder={sw ? "Sababu ya uamuzi (herufi 10 au zaidi)" : "Decision reason (at least 10 characters)"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Sababu ya uamuzi" : "Decision reason"} /><Button label={sw ? "Idhinisha na uchapishe" : "Approve & publish"} disabled={busy || sourceReviewExpired || note.trim().length < 10} loading={busy} onPress={() => Alert.alert(sw ? "Chapisha mwongozo?" : "Publish guide?", sw ? "Mwongozo huu wa lugha mbili utaonekana kwa umma." : "This bilingual guide will become public.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Chapisha" : "Publish", onPress: () => void decide("approved") }])} /><Button label={sw ? "Kataa kwa marekebisho" : "Reject for revision"} variant="secondary" disabled={busy || note.trim().length < 10} onPress={() => void decide("rejected")} /></Surface> : null}
      <Button label={sw ? "Rudi kwenye foleni" : "Back to editorial queue"} variant="quiet" onPress={() => router.back()} />
    </>}
  </Screen>;
}

function Message({ text }: { text: string }) { return <Surface><Text style={styles.body}>{text}</Text></Surface>; }
function LanguageBlock({ title, heading, summary, steps }: { title: string; heading: string; summary: string; steps: string[] }) { return <Surface><Text style={styles.label}>{title}</Text><Text style={styles.title}>{heading}</Text><Text style={styles.body}>{summary}</Text>{steps.map((step, index) => <Text key={index} style={styles.body}>{index + 1}. {step}</Text>)}</Surface>; }
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 12, letterSpacing: 1 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 30, lineHeight: 38 }, heroBody: { color: colors.peach, fontFamily: type.medium, fontSize: 17, lineHeight: 24 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 19 }, label: { color: colors.burgundy, fontFamily: type.bold, fontSize: 15, marginTop: spacing.sm }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 16, lineHeight: 24, marginTop: spacing.sm }, link: { color: colors.teal, fontFamily: type.medium, fontSize: 15, lineHeight: 22, marginTop: spacing.sm }, input: { minHeight: 110, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, textAlignVertical: "top", color: colors.ink, fontSize: 16 }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 15, lineHeight: 22 } });
