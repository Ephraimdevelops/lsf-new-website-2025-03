import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { CivicPageIntro } from "../src/components/CivicPageIntro";
import { Screen } from "../src/components/Screen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

export default function TrainingManagement() {
  useSensitiveScreenProtection("paralegal-training-management");
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess); const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "staff"].includes(role)); const isAdmin = roles.includes("admin");
  const modules = useQuery(api.paralegalTraining.listForReview, allowed ? {} : "skip");
  const submit = useMutation(api.paralegalTraining.submit); const review = useMutation(api.paralegalTraining.review); const retire = useMutation(api.paralegalTraining.retire);
  const [titleSw, setTitleSw] = useState(""); const [titleEn, setTitleEn] = useState(""); const [contentSw, setContentSw] = useState(""); const [contentEn, setContentEn] = useState("");
  const [topic, setTopic] = useState(""); const [sourceTitle, setSourceTitle] = useState(""); const [sourceUrl, setSourceUrl] = useState(""); const [dueDate, setDueDate] = useState(""); const [required, setRequired] = useState(true);
  const [replacesModuleId, setReplacesModuleId] = useState<Id<"paralegal_training_modules"> | null>(null);
  const [selected, setSelected] = useState<string | null>(null); const [note, setNote] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  function continueToSource() {
    if (titleSw.trim().length < 5 || titleEn.trim().length < 5 || contentSw.trim().length < 100 || contentEn.trim().length < 100) {
      setError(sw ? "Jaza vichwa na maudhui ya lugha zote mbili; kila maudhui yahusishe angalau herufi 100." : "Complete both titles and both language versions; each content field needs at least 100 characters."); return;
    }
    setError(""); setStep(2);
  }
  function continueToPreview() {
    const date = dueDate.trim();
    const parsed = Date.parse(`${date}T12:00:00+03:00`);
    let validUrl = false;
    try { const source = new URL(sourceUrl.trim()); validUrl = source.protocol === "https:" && source.hostname.includes("."); } catch { /* shown below */ }
    if (topic.trim().length < 3 || sourceTitle.trim().length < 5 || !validUrl || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed) || new Date(parsed).toISOString().slice(0, 10) !== date || parsed <= Date.now()) {
      setError(sw ? "Kamilisha mada, chanzo cha HTTPS na tarehe ya ukaguzi ya baadaye." : "Complete the topic, HTTPS source and a valid future review date."); return;
    }
    setError(""); setStep(3);
  }
  async function submitModule() {
    const reviewDueAt = Date.parse(`${dueDate.trim()}T12:00:00+03:00`);
    if (!Number.isFinite(reviewDueAt)) { setError(sw ? "Weka tarehe sahihi ya ukaguzi." : "Enter a valid review date."); return; }
    setBusy(true); setError(""); try { await submit({ titleSw, titleEn, contentSw, contentEn, topic, sourceTitle, sourceUrl, reviewDueAt, required, replacesModuleId: replacesModuleId ?? undefined }); setTitleSw(""); setTitleEn(""); setContentSw(""); setContentEn(""); setTopic(""); setSourceTitle(""); setSourceUrl(""); setDueDate(""); setReplacesModuleId(null); setEditing(false); setStep(1); setNotice(sw ? "Moduli imetumwa kwa ukaguzi huru." : "Module sent for independent review."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); } finally { setBusy(false); }
  }
  async function decide(id: Id<"paralegal_training_modules">, decision: "approved" | "rejected" | "retired") {
    if (note.trim().length < 10) { setError(sw ? "Andika sababu ya uamuzi." : "Record a reason of at least 10 characters."); return; }
    setBusy(true); setError(""); try { if (decision === "retired") await retire({ id, reason: note.trim() }); else await review({ id, decision, note: note.trim() }); setNote(""); setSelected(null); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); } finally { setBusy(false); }
  }
  function revise(item: NonNullable<typeof modules>[number]) {
    setReplacesModuleId(item._id); setTitleSw(item.titleSw); setTitleEn(item.titleEn); setContentSw(item.contentSw); setContentEn(item.contentEn); setTopic(item.topic); setSourceTitle(item.sourceTitle); setSourceUrl(item.sourceUrl); setDueDate(new Date(item.reviewDueAt).toISOString().slice(0, 10)); setRequired(item.required);
    setEditing(true); setStep(1); setNotice(sw ? "Toleo la sasa limejazwa; likague kabla ya kuwasilisha." : "Current version loaded; review it before submitting.");
  }
  return <Screen>
    <AppHeader back title={sw ? "Mafunzo ya paralegal" : "Paralegal training"} eyebrow="LSF · LEARNING GOVERNANCE" />
    {access === undefined ? <Surface><Text style={styles.copy}>{sw ? "Inapakia..." : "Loading..."}</Text></Surface> : !allowed ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Ruhusa ya LSF inahitajika." : "LSF access required."}</Text></Surface> : <>
      <CivicPageIntro icon="school-outline" eyebrow="LSF · LEARNING" title={sw ? "Andaa mafunzo yanayoaminika." : "Prepare trusted learning."} description={sw ? "Andika kwa lugha zote mbili, onyesha chanzo, kisha wasilisha kwa ukaguzi huru." : "Write in both languages, show the source, then submit for independent review."} tone="teal" />
      <Surface tone="pink"><Text style={styles.copy}>{sw ? "Paralegal huandika kuwa amejisomea; rekodi hii si cheti cha kitaaluma." : "Paralegals acknowledge self-study; this record is not a professional certificate."}</Text></Surface>
      {error ? <Surface tone="orange"><Text accessibilityRole="alert" style={styles.error}>{error}</Text></Surface> : null}
      {notice ? <Surface tone="teal"><Text style={styles.copy}>{notice}</Text></Surface> : null}
      <SectionHeading title={editing ? (sw ? "Andika moduli" : "Author module") : (sw ? "Moduli na maamuzi" : "Modules and decisions")} />
      {!editing ? <Button label={titleSw || titleEn ? (sw ? "Endelea kuandika" : "Continue draft") : (sw ? "Andika moduli mpya" : "Write a new module")} onPress={() => { setEditing(true); setError(""); }} /> : <Surface>
        <Text style={styles.title}>{sw ? `Hatua ya ${step} kati ya 3` : `Step ${step} of 3`} · {step === 1 ? (sw ? "Maudhui" : "Content") : step === 2 ? (sw ? "Chanzo" : "Source") : (sw ? "Hakiki" : "Preview")}</Text>
        {replacesModuleId ? <Surface tone="orange"><Text style={styles.copy}>{sw ? "Toleo la sasa hubaki hai mpaka hili liidhinishwe." : "The current version stays live until this replacement is approved."}</Text></Surface> : null}
        {step === 1 ? <><Field label="Kichwa · Kiswahili" value={titleSw} onChange={setTitleSw} /><Field label="Title · English" value={titleEn} onChange={setTitleEn} /><Field label={sw ? "Maudhui · Kiswahili" : "Content · Kiswahili"} value={contentSw} onChange={setContentSw} multiline /><Field label={sw ? "Maudhui · Kiingereza" : "Content · English"} value={contentEn} onChange={setContentEn} multiline /><Button label={sw ? "Endelea kwenye chanzo" : "Continue to source"} onPress={continueToSource} /></> : null}
        {step === 2 ? <><Field label={sw ? "Mada" : "Topic"} value={topic} onChange={setTopic} /><Field label={sw ? "Jina la chanzo" : "Source title"} value={sourceTitle} onChange={setSourceTitle} /><Field label="HTTPS URL" value={sourceUrl} onChange={setSourceUrl} /><Field label={sw ? "Tarehe ya ukaguzi · YYYY-MM-DD" : "Review due · YYYY-MM-DD"} value={dueDate} onChange={setDueDate} /><Button label={required ? (sw ? "Lazima kwa maandalizi" : "Required for onboarding") : (sw ? "Hiari" : "Optional")} variant="secondary" onPress={() => setRequired(!required)} /><Button label={sw ? "Hakiki moduli" : "Preview module"} onPress={continueToPreview} /><Button label={sw ? "Rudi kwenye maudhui" : "Back to content"} variant="quiet" onPress={() => setStep(1)} /></> : null}
        {step === 3 ? <><Text style={styles.label}>{sw ? "Kiswahili" : "Swahili"}</Text><Text style={styles.title}>{titleSw.trim()}</Text><Text style={styles.preview}>{contentSw.trim()}</Text><Text style={styles.label}>English</Text><Text style={styles.title}>{titleEn.trim()}</Text><Text style={styles.preview}>{contentEn.trim()}</Text><Text style={styles.copy}>{topic.trim()} · {sourceTitle.trim()} · {sourceUrl.trim()}</Text><Text style={styles.copy}>{sw ? "Ukaguzi unaofuata" : "Next review"}: {dueDate.trim()} · {required ? (sw ? "lazima" : "required") : (sw ? "hiari" : "optional")}</Text><Button label={replacesModuleId ? (sw ? "Wasilisha toleo jipya" : "Submit replacement") : (sw ? "Wasilisha kwa ukaguzi" : "Submit for review")} loading={busy} disabled={busy} onPress={() => void submitModule()} /><Button label={sw ? "Rekebisha chanzo" : "Edit source"} variant="quiet" onPress={() => setStep(2)} /></> : null}
        <Button label={sw ? "Ficha uandishi kwa sasa" : "Hide authoring for now"} variant="quiet" onPress={() => setEditing(false)} />
      </Surface>}
      <SectionHeading title={sw ? "Foleni ya moduli na maamuzi" : "Module review queue"} />
      {modules === undefined ? <Surface><Text style={styles.copy}>{sw ? "Inapakia moduli..." : "Loading modules..."}</Text></Surface> : modules.length === 0 ? <Surface><Text style={styles.copy}>{sw ? "Hakuna moduli bado." : "No modules yet."}</Text></Surface> : modules.map((item) => <Surface key={item._id} tone={item.status === "approved" ? "teal" : undefined}><Text style={styles.title}>{sw ? item.titleSw : item.titleEn}</Text><Text style={styles.copy}>v{item.version} · {item.status} · {item.required ? (sw ? "lazima" : "required") : (sw ? "hiari" : "optional")} · {item.topic}</Text><Text style={styles.copy}>{item.sourceTitle} · {new Date(item.reviewDueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ")}</Text>{item.reviewNote ? <Text style={styles.copy}>{item.reviewNote}</Text> : null}{item.status === "approved" ? <Button label={sw ? "Tayarisha toleo jipya" : "Prepare replacement"} variant="secondary" onPress={() => revise(item)} /> : null}<Button label={selected === item._id ? (sw ? "Ficha" : "Hide") : (sw ? "Kagua maudhui yote" : "Inspect full content")} variant="secondary" onPress={() => { setSelected(selected === item._id ? null : item._id); setNote(""); }} />{selected === item._id ? <><Text style={styles.title}>Kiswahili</Text><Text style={styles.copy}>{item.contentSw}</Text><Text style={styles.title}>English</Text><Text style={styles.copy}>{item.contentEn}</Text><Text style={styles.copy}>{item.sourceUrl}</Text>{isAdmin && item.status === "pending" && item.submittedBy === access?.user?._id ? <Text style={styles.copy}>{sw ? "Msimamizi mwingine lazima aikague moduli hii." : "Another administrator must review this module."}</Text> : null}{isAdmin && (item.status === "approved" || item.status === "pending" && item.submittedBy !== access?.user?._id) ? <><Field label={sw ? "Sababu ya uamuzi" : "Decision reason"} value={note} onChange={setNote} multiline />{item.status === "pending" ? <><Button label={sw ? "Idhinisha" : "Approve"} disabled={busy || note.trim().length < 10} onPress={() => Alert.alert(sw ? "Thibitisha idhini" : "Confirm approval", sw ? "Umekagua chanzo na lugha zote mbili?" : "Have you verified the source and both languages?", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Idhinisha" : "Approve", onPress: () => void decide(item._id, "approved") }])} /><Button label={sw ? "Kataa" : "Reject"} variant="secondary" disabled={busy || note.trim().length < 10} onPress={() => void decide(item._id, "rejected")} /></> : <Button label={sw ? "Ondoa kwenye mafunzo" : "Retire module"} variant="secondary" disabled={busy || note.trim().length < 10} onPress={() => void decide(item._id, "retired")} />}</> : null}</> : null}</Surface>)}
    </>}
  </Screen>;
}
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (text: string) => void; multiline?: boolean }) { return <View><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChange} multiline={multiline} style={[styles.input, multiline && styles.multi]} placeholder={label} placeholderTextColor={colors.inkMuted} /></View>; }
const styles = StyleSheet.create({ title: { color: colors.ink, fontFamily: type.bold, fontSize: 18, lineHeight: 24 }, copy: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 15, lineHeight: 22, marginTop: spacing.sm }, preview: { color: colors.ink, fontFamily: type.regular, fontSize: 16, lineHeight: 24, marginTop: spacing.sm }, label: { color: colors.burgundy, fontFamily: type.medium, fontSize: 15, marginTop: spacing.md, marginBottom: spacing.xs }, input: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, color: colors.ink, minHeight: 50, padding: spacing.md, fontSize: 16 }, multi: { minHeight: 130, textAlignVertical: "top" }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 15 } });
