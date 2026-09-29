import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

type Jurisdiction = "national" | "tanzania_mainland" | "zanzibar";
export default function EditorialWorkspaceScreen() {
  useSensitiveScreenProtection("editorial-workspace");
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["content_editor", "admin"].includes(role));
  const isAdmin = roles.includes("admin");
  const guides = useQuery(api.publications.listLegalGuidesForReview, allowed ? {} : "skip");
  const submit = useMutation(api.publications.submitLegalGuide);
  const review = useMutation(api.publications.reviewLegalGuide);
  const [titleSw, setTitleSw] = useState(""); const [titleEn, setTitleEn] = useState("");
  const [summarySw, setSummarySw] = useState(""); const [summaryEn, setSummaryEn] = useState("");
  const [stepsSw, setStepsSw] = useState(""); const [stepsEn, setStepsEn] = useState("");
  const [category, setCategory] = useState(""); const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("national");
  const [sourceTitle, setSourceTitle] = useState(""); const [sourceUrl, setSourceUrl] = useState(""); const [publisher, setPublisher] = useState(""); const [reviewDate, setReviewDate] = useState("");
  const [selected, setSelected] = useState<string | null>(null); const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  async function submitGuide() {
    setError(""); setNotice("");
    const reviewDueAt = Date.parse(`${reviewDate.trim()}T12:00:00+03:00`);
    if (!Number.isFinite(reviewDueAt)) { setError(sw ? "Weka tarehe halali ya ukaguzi (YYYY-MM-DD)." : "Enter a valid review date (YYYY-MM-DD)."); return; }
    setBusy(true);
    try {
      await submit({ titleSw, titleEn, summarySw, summaryEn, stepsSw: stepsSw.split("\n").filter(Boolean), stepsEn: stepsEn.split("\n").filter(Boolean), category, jurisdiction, sourceTitle, sourceUrl, publisher, reviewDueAt });
      setTitleSw(""); setTitleEn(""); setSummarySw(""); setSummaryEn(""); setStepsSw(""); setStepsEn(""); setCategory(""); setSourceTitle(""); setSourceUrl(""); setPublisher(""); setReviewDate("");
      setNotice(sw ? "Mwongozo umetumwa kwa idhini huru." : "Guide submitted for independent review.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }
  async function decide(id: Parameters<typeof review>[0]["id"], decision: "approved" | "rejected") {
    if (note.trim().length < 10) { setError(sw ? "Andika sababu ya ukaguzi." : "Record a review reason."); return; }
    setBusy(true); setError("");
    try { await review({ id, decision, note: note.trim() }); setSelected(null); setNote(""); setNotice(sw ? "Uamuzi umehifadhiwa." : "Decision saved."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }
  return <Screen>
    <AppHeader back title={sw ? "Uhariri wa miongozo" : "Guide editorial"} eyebrow="LSF · GOVERNED CONTENT" />
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <State text={sw ? "Ruhusa ya mhariri au msimamizi inahitajika." : "Editor or administrator access is required."} /> : <>
      <View style={styles.hero}><Ionicons name="book-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{sw ? "Andika. Thibitisha. Chapisha." : "Draft. Review. Publish."}</Text><Text style={styles.heroBody}>{sw ? "Mwongozo hauonekani kwa umma kabla ya msimamizi mwingine kuidhinisha chanzo na maudhui." : "Guidance stays private until a different administrator approves its source and content."}</Text></View>
      {error ? <Surface tone="orange"><Text accessibilityRole="alert" style={styles.error}>{error}</Text></Surface> : null}
      {notice ? <Surface tone="teal"><Text style={styles.body}>{notice}</Text></Surface> : null}
      <Surface tone="pink"><Text style={styles.section}>{sw ? "Wasilisha mwongozo mpya" : "Submit a new guide"}</Text>
        <Field label="Kichwa · Kiswahili" value={titleSw} onChange={setTitleSw} />
        <Field label="Title · English" value={titleEn} onChange={setTitleEn} />
        <Field label="Muhtasari · Kiswahili" value={summarySw} onChange={setSummarySw} multiline />
        <Field label="Summary · English" value={summaryEn} onChange={setSummaryEn} multiline />
        <Field label={sw ? "Hatua kwa Kiswahili (mstari mmoja kila hatua)" : "Swahili steps (one per line)"} value={stepsSw} onChange={setStepsSw} multiline />
        <Field label={sw ? "Hatua kwa Kiingereza (mstari mmoja kila hatua)" : "English steps (one per line)"} value={stepsEn} onChange={setStepsEn} multiline />
        <Field label={sw ? "Mada" : "Category"} value={category} onChange={setCategory} />
        <Text style={styles.label}>{sw ? "Eneo la sheria" : "Jurisdiction"}</Text><View style={styles.choices}>{(["national", "tanzania_mainland", "zanzibar"] as Jurisdiction[]).map((value) => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: jurisdiction === value }} onPress={() => setJurisdiction(value)} style={[styles.chip, jurisdiction === value && styles.chipOn]}><Text style={[styles.chipText, jurisdiction === value && styles.chipTextOn]}>{value.replaceAll("_", " ")}</Text></Pressable>)}</View>
        <Field label={sw ? "Jina la chanzo" : "Source title"} value={sourceTitle} onChange={setSourceTitle} />
        <Field label={sw ? "Kiungo rasmi cha HTTPS" : "Official HTTPS URL"} value={sourceUrl} onChange={setSourceUrl} />
        <Field label={sw ? "Mchapishaji" : "Publisher"} value={publisher} onChange={setPublisher} />
        <Field label={sw ? "Ukaguzi ujao · YYYY-MM-DD" : "Review due · YYYY-MM-DD"} value={reviewDate} onChange={setReviewDate} />
        <Button label={sw ? "Wasilisha kwa ukaguzi" : "Submit for review"} loading={busy} onPress={() => void submitGuide()} />
      </Surface>
      <Text style={styles.section}>{sw ? "Miongozo na hali" : "Guides and status"} · {guides?.length ?? 0}</Text>
      {guides === undefined ? <State text={sw ? "Inapakia miongozo..." : "Loading guides..."} /> : guides.length === 0 ? <State text={sw ? "Hakuna mwongozo uliowasilishwa." : "No guides submitted yet."} /> : guides.map((guide) => <Surface key={guide._id} tone={guide.status === "approved" ? "teal" : "white"}>
        <Text style={styles.title}>{sw ? guide.titleSw : guide.titleEn}</Text><Text style={styles.meta}>{guide.category} · {guide.jurisdiction} · {guide.status}</Text><Text style={styles.body}>{sw ? guide.summarySw : guide.summaryEn}</Text><Text style={styles.meta}>{guide.publisher} · {guide.sourceTitle}</Text><Text style={styles.meta}>{sw ? "Ukaguzi kabla ya" : "Review due"}: {new Date(guide.reviewDueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ")}</Text>
        {guide.reviewNote ? <Text style={styles.meta}>{sw ? "Sababu ya ukaguzi" : "Review reason"}: {guide.reviewNote}</Text> : null}
        {isAdmin && guide.status === "pending" ? <><Button label={selected === guide._id ? (sw ? "Ficha uamuzi" : "Hide decision") : (sw ? "Kagua maudhui" : "Review content")} variant="secondary" onPress={() => { setSelected(selected === guide._id ? null : guide._id); setNote(""); }} />{selected === guide._id ? <><Text style={styles.label}>{sw ? "Hatua" : "Steps"}</Text>{(sw ? guide.stepsSw : guide.stepsEn).map((step, index) => <Text key={index} style={styles.body}>{index + 1}. {step}</Text>)}<Text style={styles.meta}>{guide.sourceUrl}</Text><Field label={sw ? "Sababu ya uamuzi" : "Decision reason"} value={note} onChange={setNote} multiline /><Button label={sw ? "Idhinisha" : "Approve"} disabled={busy} onPress={() => Alert.alert(sw ? "Idhinisha?" : "Approve guide?", sw ? "Hakikisha chanzo, usahihi wa sheria na lugha zote mbili." : "Confirm source, legal accuracy and both languages.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Idhinisha" : "Approve", onPress: () => void decide(guide._id, "approved") }])} /><Button label={sw ? "Kataa" : "Reject"} variant="secondary" disabled={busy} onPress={() => void decide(guide._id, "rejected")} /></> : null}</> : null}
        {guide.status === "approved" ? <Button label={sw ? "Angalia mwongozo wa umma" : "View public guide"} variant="quiet" onPress={() => router.push({ pathname: "/legal-guide/[id]", params: { id: guide._id } })} /> : null}
      </Surface>)}
    </>}
  </Screen>;
}
function State({ text }: { text: string }) { return <Surface><Text style={styles.body}>{text}</Text></Surface>; }
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) { return <View><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChange} multiline={multiline} style={[styles.input, multiline && styles.multi]} placeholder={label} placeholderTextColor={colors.inkMuted} accessibilityLabel={label} /></View>; }
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 26 }, heroBody: { color: "#F9E8EF", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, section: { color: colors.burgundy, fontFamily: type.bold, fontSize: 18, marginTop: spacing.md }, label: { color: colors.ink, fontFamily: type.bold, fontSize: 13, marginTop: spacing.sm }, input: { minHeight: 48, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, color: colors.ink }, multi: { minHeight: 88, textAlignVertical: "top" }, choices: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, chip: { minHeight: 44, justifyContent: "center", borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: spacing.md }, chipOn: { backgroundColor: colors.burgundy }, chipText: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 12 }, chipTextOn: { color: colors.surface }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 20, marginTop: spacing.sm }, meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, marginTop: spacing.sm }, error: { color: colors.danger, fontFamily: type.bold, fontSize: 13 } });
