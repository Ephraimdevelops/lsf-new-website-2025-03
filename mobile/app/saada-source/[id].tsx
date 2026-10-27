import { plainError } from "../../../shared/plainLanguage";
import { AdminIntro } from "../../src/admin/AdminIntro";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAction, useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { AdminScreen as Screen } from "../../src/admin/AdminScreen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

export default function SaadaSourceReviewScreen() {
  useSensitiveScreenProtection("saada-source-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff"].includes(role));
  const isAdmin = access?.roles.includes("admin") ?? false;
  const record = useQuery(api.sara.getDocumentForReview, allowed && id ? { id: id as Id<"documents"> } : "skip");
  const doc = record?.doc;
  const previous = record?.previous;
  const review = useMutation(api.sara.reviewDocument);
  const withdraw = useMutation(api.sara.withdrawDocument);
  const retryIndex = useAction(api.sara_actions.retryDocumentIndex);
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState("");
  const ownSource = Boolean(doc?.uploadedByClerkId && doc.uploadedByClerkId === access?.user?.clerkId);
  const sourceReady = Boolean(doc?.processedAt && doc.indexingStatus === "ready" && doc.publisher && doc.jurisdiction && doc.language && doc.contentCategory && doc.versionLabel && doc.reviewDueAt && doc.reviewDueAt > Date.now() && (!doc.replacesDocumentId || previous?.approvalStatus === "approved"));

  async function openPdf(url?: string | null) {
    if (!url) return;
    try { await Linking.openURL(url); }
    catch { setError(sw ? "PDF haijafunguka. Jaribu tena." : "The PDF could not be opened. Please try again."); }
  }
  async function save() {
    if (!doc || !decision || note.trim().length < 10 || busy) return;
    setBusy(true); setError("");
    try { await review({ id: doc._id, decision, note: note.trim() }); setSaved(true); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }
  async function withdrawSource() {
    if (!doc || withdrawReason.trim().length < 10 || busy) return;
    setBusy(true); setError("");
    try { await withdraw({ id: doc._id, reason: withdrawReason.trim() }); setSaved(true); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }
  async function retry() {
    if (!doc || busy) return;
    setBusy(true); setError("");
    try { await retryIndex({ id: doc._id }); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Kagua chanzo" : "Review source"} eyebrow="HAKI YANGU AI · KNOWLEDGE" />
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <State text={sw ? "Ufikiaji haujaruhusiwa" : "Access not authorised"} /> : record === undefined ? <State text={sw ? "Inapakia chanzo..." : "Loading source..."} /> : !doc ? <State text={sw ? "Chanzo hakipatikani." : "Source not found."} /> : <>
      <AdminIntro icon="book-outline" eyebrow="LSF" title={doc.title} description={sw ? "Hakikisha nyaraka na asili yake kabla ya kuiruhusu Haki Yangu AI kuitumia." : "Check the document and its provenance before allowing Haki Yangu AI to use it."} />
      <Surface tone={doc.approvalStatus === "approved" ? "teal" : "orange"} style={styles.card}><Text style={styles.title}>{sw ? "Hali ya chanzo" : "Source status"}</Text><Text style={styles.status}>{(doc.approvalStatus ?? "unreviewed").replaceAll("_", " ")}</Text><Text style={styles.muted}>{doc.indexingStatus === "failed" ? (sw ? "Faharasa imeshindwa" : "Index failed") : doc.indexingStatus === "ready" ? (sw ? "Faharasa imekamilika" : "Index complete") : (sw ? "Faharasa haijakamilika" : "Index not ready")}</Text>{doc.canRetryIndex ? <><Text style={styles.warning}>{doc.indexingError || (sw ? "Hati hii haijaendelea kuandaliwa kwa dakika 30. Jaribu kuiandaa tena." : "No indexing progress for 30 minutes. You can recover this source.")}</Text>{doc.approvalStatus === "pending" ? <Button label={doc.indexStalled ? (sw ? "Rejesha faharasa iliyokwama" : "Recover stalled indexing") : (sw ? "Jaribu kuweka faharasa tena" : "Retry indexing")} variant="secondary" loading={busy} onPress={() => void retry()} /> : null}</> : null}</Surface>
      {doc.approvalStatus === "approved" && (!doc.reviewDueAt || doc.reviewDueAt <= Date.now()) ? <Surface tone="orange" style={styles.card}><Text style={styles.title}>{sw ? "Ukaguzi wa chanzo umechelewa" : "Source review overdue"}</Text><Text style={styles.body}>{sw ? "Haki Yangu AI hakitumii chanzo hiki kwenye majibu. Tayarisha PDF na toleo jipya kutoka maktaba; litahitaji idhini huru kabla ya kutumika." : "Haki Yangu AI excludes this source from answers. Prepare a new PDF and version from the library; it needs independent approval before use."}</Text><Button label={sw ? "Rudi kwenye maktaba" : "Back to knowledge library"} variant="secondary" onPress={() => router.push("/saada-governance")} /></Surface> : null}
      <Text style={styles.section}>{sw ? "Maelezo ya chanzo" : "Source provenance"}</Text>
      <Surface style={styles.details}><Info label={sw ? "Mchapishaji" : "Publisher"} value={doc.publisher} /><Info label={sw ? "Mamlaka ya kisheria" : "Jurisdiction"} value={doc.jurisdiction} /><Info label={sw ? "Lugha" : "Language"} value={doc.language} /><Info label={sw ? "Aina" : "Category"} value={doc.contentCategory ?? doc.type} /><Info label={sw ? "Toleo" : "Edition / version"} value={doc.versionLabel} /><Info label={sw ? "Tarehe ya kuanza" : "Effective date"} value={doc.effectiveDate} /><Info label={sw ? "Ukaguzi unaofuata" : "Review due"} value={doc.reviewDueAt ? new Date(doc.reviewDueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ") : undefined} /><Info label={sw ? "Kiungo cha asili" : "Original source URL"} value={doc.sourceUrl} /></Surface>
      <Button variant="secondary" label={sw ? "Fungua PDF ya chanzo" : "Open source PDF"} disabled={!doc.sourcePdfUrl} onPress={() => void openPdf(doc.sourcePdfUrl)} />
      {doc.replacesDocumentId ? <Surface tone="pink" style={styles.card}><Text style={styles.title}>{sw ? "Chanzo kinachobadilishwa" : "Source being replaced"}</Text>{previous ? <><Text style={styles.body}>{previous.title} · {previous.versionLabel ?? "—"}</Text><Text style={styles.muted}>{previous.publisher ?? "—"} · {previous.jurisdiction ?? "—"} · {previous.language ?? "—"}</Text><Text style={styles.muted}>{sw ? "Hali" : "Status"}: {previous.approvalStatus ?? "—"}</Text><Button label={sw ? "Fungua PDF ya awali" : "Open previous PDF"} variant="secondary" disabled={!previous.sourcePdfUrl} onPress={() => void openPdf(previous.sourcePdfUrl)} /></> : <Text style={styles.warning}>{sw ? "Rekodi ya awali haipatikani. Usikubali toleo hili bila kuithibitisha." : "Previous record unavailable. Do not approve this replacement without checking it."}</Text>}</Surface> : null}
      {doc.reviewNote ? <Surface tone="pink" style={styles.card}><Text style={styles.title}>{sw ? "Sababu ya ukaguzi uliopita" : "Previous review reason"}</Text><Text style={styles.body}>{doc.reviewNote}</Text></Surface> : null}
      {isAdmin && doc.approvalStatus === "approved" && !saved ? <Surface tone="orange" style={styles.card}><Text style={styles.title}>{sw ? "Ondoa chanzo kwenye majibu" : "Withdraw source from answers"}</Text><Text style={styles.body}>{sw ? "Kuondoa huzuia Haki Yangu AI kukitumia mara moja na huhifadhi nyaraka na historia yake kwa ukaguzi." : "Withdrawal stops Haki Yangu AI retrieving this source immediately and preserves its document and audit record."}</Text><TextInput multiline value={withdrawReason} onChangeText={setWithdrawReason} placeholder={sw ? "Sababu ya kuondoa (herufi 10 au zaidi)" : "Withdrawal reason (at least 10 characters)"} placeholderTextColor={colors.inkMuted} style={styles.input} /><Button variant="secondary" label={sw ? "Ondoa kwenye majibu" : "Withdraw from answers"} disabled={withdrawReason.trim().length < 10 || busy} loading={busy} onPress={() => void withdrawSource()} /></Surface> : null}
      {saved ? <Surface tone="teal" style={styles.card}><Ionicons name="checkmark-circle" size={32} color={colors.teal} /><Text style={styles.title}>{sw ? "Uamuzi umehifadhiwa" : "Decision recorded"}</Text><Button label={sw ? "Rudi kwenye maktaba" : "Back to library"} onPress={() => router.replace("/saada-governance")} /></Surface> : !isAdmin || (ownSource && doc.approvalStatus === "pending") ? <Surface tone="orange" style={styles.card}><Text style={styles.muted}>{ownSource ? (sw ? "Ulipakia chanzo hiki. Msimamizi mwingine lazima akague na aamue." : "You uploaded this source. Another administrator must review and decide.") : (sw ? "Msimamizi tofauti lazima athibitishe chanzo." : "A different administrator must approve the source.")}</Text></Surface> : ["approved", "rejected", "withdrawn"].includes(doc.approvalStatus ?? "") ? <Surface tone="teal" style={styles.card}><Text style={styles.muted}>{sw ? "Chanzo hiki tayari kina uamuzi uliorekodiwa." : "A decision has already been recorded for this source."}</Text></Surface> : <>
        <Text style={styles.section}>{sw ? "Uamuzi huru" : "Independent review"}</Text><Surface tone="pink" style={styles.card}><Text style={styles.muted}>{sw ? "Mpaka kipitishwe, chanzo hakitumiki kwa majibu ya Haki Yangu AI. Mtayarishaji hawezi kukiidhinisha mwenyewe." : "Haki Yangu AI cannot retrieve this source before approval. The uploader cannot approve their own source."}</Text>{!sourceReady ? <Text style={styles.warning}>{sw ? "Idhini inahitaji faharasa kamili, metadata yote na tarehe ya ukaguzi ya baadaye." : "Approval requires a complete index, full provenance and a future review date."}</Text> : null}<View style={styles.choices}><Choice label={sw ? "Idhinisha" : "Approve"} active={decision === "approved"} onPress={() => setDecision("approved")} /><Choice label={sw ? "Kataa" : "Reject"} active={decision === "rejected"} onPress={() => setDecision("rejected")} /></View><TextInput multiline maxLength={2000} value={note} onChangeText={setNote} placeholder={sw ? "Eleza uamuzi na nyaraka ulizokagua..." : "Record the decision and documents checked..."} placeholderTextColor={colors.inkMuted} style={styles.input} />{decision ? <Button label={decision === "approved" ? (sw ? "Thibitisha idhini" : "Confirm approval") : (sw ? "Thibitisha kukataa" : "Confirm rejection")} loading={busy} disabled={busy || note.trim().length < 10 || (decision === "approved" && !sourceReady)} onPress={() => void save()} /> : null}</Surface>
      </>}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </>}
  </Screen>;
}

function Info({ label, value }: { label: string; value?: string | null }) { return <View style={styles.info}><Text style={styles.label}>{label}</Text><Text style={styles.body}>{value || "—"}</Text></View>; }
function State({ text }: { text: string }) { return <Surface tone="orange" style={styles.card}><Text style={styles.title}>{text}</Text></Surface>; }
function Choice({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) { return <Pressable accessibilityRole="radio" accessibilityState={{ checked: active }} aria-checked={active} onPress={onPress} style={[styles.choice, active && styles.choiceActive]}><Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={styles.title}>{label}</Text></Pressable>; }
const styles = StyleSheet.create({ hero: { marginTop: spacing.sm, backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 29, lineHeight: 36 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 16, lineHeight: 24 }, card: { marginTop: spacing.lg, gap: spacing.md }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 18 }, status: { color: colors.burgundy, fontFamily: type.bold, fontSize: 14, textTransform: "capitalize" }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, section: { marginTop: spacing.xl, marginBottom: spacing.md, color: colors.ink, fontFamily: type.bold, fontSize: 19 }, details: { gap: spacing.sm }, info: { borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: spacing.sm }, label: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 12 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 16, lineHeight: 24 }, choices: { flexDirection: "row", gap: spacing.sm }, choice: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: spacing.sm, minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface }, choiceActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, input: { minHeight: 120, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, textAlignVertical: "top", color: colors.ink }, warning: { color: colors.orange, fontFamily: type.medium, fontSize: 13, lineHeight: 19 }, error: { color: colors.danger, fontFamily: type.medium, marginVertical: spacing.md } });
