import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useAction, useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

type Tab = "sources" | "instructions" | "insights";
type SourceForm = { publisher: string; sourceUrl: string; jurisdiction: "tanzania_mainland" | "zanzibar" | "national" | "other"; language: "sw" | "en" | "bilingual" | "other"; contentCategory: string; versionLabel: string; effectiveDate: string; reviewDate: string };

function nextReviewDate() { const date = new Date(); date.setFullYear(date.getFullYear() + 1); return date.toISOString().slice(0, 10); }

export default function SaadaGovernanceScreen() {
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "staff"].includes(role));
  const isAdmin = roles.includes("admin");
  const documents = useQuery(api.sara.getDocuments, allowed ? {} : "skip");
  const versions = useQuery(api.sara.listPromptVersions, isAdmin ? {} : "skip");
  const analytics = useQuery(api.sara_chat.getAnalytics, allowed ? {} : "skip");
  const uploadUrl = useMutation(api.sara.generateUploadUrl);
  const ingest = useAction(api.sara_actions.ingestDocument);
  const submitPrompt = useMutation(api.sara.submitPromptVersion);
  const [tab, setTab] = useState<Tab>("sources");
  const [form, setForm] = useState<SourceForm>({ publisher: "", sourceUrl: "", jurisdiction: "national", language: "bilingual", contentCategory: "Law / legal guidance", versionLabel: "", effectiveDate: "", reviewDate: nextReviewDate() });
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [prompt, setPrompt] = useState(""); const [changeNote, setChangeNote] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");

  if (access === undefined) return <Screen><Text style={styles.muted}>{sw ? "Inapakia ruhusa..." : "Loading access..."}</Text></Screen>;
  if (!allowed) return <Screen><AppHeader back title={sw ? "Utawala wa Saada" : "Saada governance"} /><Surface tone="orange"><Text style={styles.title}>{sw ? "Ufikiaji haujaruhusiwa" : "Access is not authorised"}</Text><Text style={styles.muted}>{sw ? "Jukumu la LSF lililoidhinishwa linahitajika." : "An approved LSF staff or administrator role is required."}</Text></Surface></Screen>;

  async function chooseSource() {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf", copyToCacheDirectory: true });
    if (result.canceled) return;
    const picked = result.assets[0];
    if (picked.size && picked.size > 15 * 1024 * 1024) { setError(sw ? "PDF lazima iwe chini ya MB 15." : "PDF must be 15 MB or smaller."); return; }
    setFile(picked); setError("");
  }

  async function uploadSource() {
    if (!file || !form.publisher.trim() || !form.versionLabel.trim() || !form.contentCategory.trim() || !form.reviewDate.trim()) { setError(sw ? "Chagua PDF na ujaze mchapishaji, aina ya maudhui, toleo na tarehe ya ukaguzi." : "Choose a PDF and complete publisher, category, version and review date."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const postUrl = await uploadUrl({});
      const blob = await (await fetch(file.uri)).blob();
      const response = await fetch(postUrl, { method: "POST", headers: { "Content-Type": file.mimeType || "application/pdf" }, body: blob });
      if (!response.ok) throw new Error(sw ? "Upakiaji wa PDF umeshindwa." : "PDF upload failed.");
      const body = await response.json() as { storageId?: Id<"_storage"> };
      if (!body.storageId) throw new Error("Upload did not return a storage reference.");
      await ingest({ storageId: body.storageId, title: file.name, publisher: form.publisher.trim(), sourceUrl: form.sourceUrl.trim() || undefined, jurisdiction: form.jurisdiction, language: form.language, contentCategory: form.contentCategory.trim(), versionLabel: form.versionLabel.trim(), effectiveDate: form.effectiveDate.trim() || undefined, reviewDueAt: new Date(`${form.reviewDate}T12:00:00`).getTime() });
      setNotice(sw ? "Chanzo kimeingizwa na kuwekewa faharasa. Kitasubiri ukaguzi huru kabla ya Saada kukitumia." : "Source ingested and indexed. It remains out of Saada answers until an independent review approves it."); setFile(null); setForm((current) => ({ ...current, versionLabel: "", effectiveDate: "" }));
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }

  async function createPromptVersion() {
    setBusy(true); setError("");
    try { const result = await submitPrompt({ prompt, changeNote }); setPrompt(""); setChangeNote(""); setNotice(sw ? `Toleo ${result.version} linasubiri idhini huru.` : `Version ${result.version} is awaiting independent approval.`); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(false); }
  }

  const approvedCount = documents?.filter((item) => item.approvalStatus === "approved").length ?? 0;
  const pendingCount = documents?.filter((item) => item.approvalStatus !== "approved" && item.approvalStatus !== "rejected").length ?? 0;
  const activePrompt = versions?.find((item) => item.status === "approved");

  return <Screen>
    <AppHeader back title={sw ? "Usimamizi wa Saada" : "Saada governance"} eyebrow="LSF · APPROVED KNOWLEDGE" />
    <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="library-outline" size={25} color={colors.surface} /></View><Text style={styles.kicker}>SAADA · RAG · AI GOVERNANCE</Text><Text style={styles.heroTitle}>{sw ? "Maarifa yanayoaminika. Majibu salama." : "Trusted knowledge. Safer answers."}</Text><Text style={styles.heroBody}>{sw ? "Chanzo kipya hakitumiki na Saada mpaka kipitiwe, kiidhinishwe na kurekodiwa." : "New sources stay out of Saada’s answers until reviewed, approved and auditable."}</Text></View>
    <View style={styles.metrics}><Metric value={approvedCount} label={sw ? "Vyanzo vilivyoidhinishwa" : "Approved sources"} /><Metric value={pendingCount} label={sw ? "Vinasubiri ukaguzi" : "Awaiting review"} /><Metric value={activePrompt ? `v${activePrompt.version}` : "—"} label={sw ? "Maagizo hai" : "Active instructions"} /></View>
    <View style={styles.tabs}><TabButton active={tab === "sources"} icon="documents-outline" label={sw ? "Maktaba" : "Library"} onPress={() => setTab("sources")} /><TabButton active={tab === "instructions"} icon="options-outline" label={sw ? "Sera" : "Policy"} onPress={() => setTab("instructions")} /><TabButton active={tab === "insights"} icon="stats-chart-outline" label={sw ? "Matumizi" : "Usage"} onPress={() => setTab("insights")} /></View>
    {error ? <Surface tone="orange"><Text accessibilityRole="alert" style={styles.error}>{error}</Text></Surface> : null}
    {notice ? <Surface tone="teal"><Text style={styles.notice}>{notice}</Text></Surface> : null}
    {tab === "sources" ? <>
      <SectionHeading title={sw ? "Ongeza chanzo cha kisheria" : "Add a legal source"} />
      <Surface tone="pink"><Text style={styles.cardTitle}>{sw ? "PDF, provenance na ukaguzi" : "PDF, provenance and review"}</Text><Text style={styles.muted}>{sw ? "Tumia sheria, kanuni, mwongozo rasmi au nyenzo iliyoidhinishwa. Chanzo kisicho na metadata kamili hakiwezi kuidhinishwa." : "Use laws, regulations, official guidance or approved material. A source without complete metadata cannot be approved."}</Text>
        <Pressable accessibilityRole="button" onPress={() => void chooseSource()} style={styles.filePicker}><Ionicons name={file ? "checkmark-circle-outline" : "cloud-upload-outline"} size={24} color={file ? colors.teal : colors.burgundy} /><View style={styles.flex}><Text style={styles.cardTitle}>{file?.name ?? (sw ? "Chagua PDF" : "Choose a PDF")}</Text><Text style={styles.muted}>{file ? `${((file.size ?? 0) / 1024 / 1024).toFixed(1)} MB` : (sw ? "PDF pekee · hadi MB 15" : "PDF only · up to 15 MB")}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></Pressable>
        <Field label={sw ? "Mchapishaji / mamlaka" : "Publisher / authority"} value={form.publisher} onChangeText={(publisher) => setForm((v) => ({ ...v, publisher }))} placeholder={sw ? "Mfano: Serikali ya Jamhuri ya Muungano" : "e.g. Government of Tanzania"} />
        <Field label={sw ? "Kiungo cha chanzo (hiari)" : "Source URL (optional)"} value={form.sourceUrl} onChangeText={(sourceUrl) => setForm((v) => ({ ...v, sourceUrl }))} placeholder="https://..." autoCapitalize="none" />
        <ChoiceField label={sw ? "Mamlaka ya kisheria" : "Jurisdiction"} value={form.jurisdiction} options={[["tanzania_mainland", sw ? "Tanzania Bara" : "Tanzania Mainland"], ["zanzibar", "Zanzibar"], ["national", sw ? "Kitaifa" : "National"], ["other", sw ? "Nyingine" : "Other"]]} onChange={(jurisdiction) => setForm((v) => ({ ...v, jurisdiction: jurisdiction as SourceForm["jurisdiction"] }))} />
        <ChoiceField label={sw ? "Lugha" : "Language"} value={form.language} options={[["sw", "Kiswahili"], ["en", "English"], ["bilingual", sw ? "Lugha mbili" : "Bilingual"], ["other", sw ? "Nyingine" : "Other"]]} onChange={(language) => setForm((v) => ({ ...v, language: language as SourceForm["language"] }))} />
        <Field label={sw ? "Aina ya maudhui" : "Content category"} value={form.contentCategory} onChangeText={(contentCategory) => setForm((v) => ({ ...v, contentCategory }))} placeholder={sw ? "Sheria / mwongozo wa kisheria" : "Law / legal guidance"} />
        <Field label={sw ? "Toleo / namba ya marekebisho" : "Edition / amendment version"} value={form.versionLabel} onChangeText={(versionLabel) => setForm((v) => ({ ...v, versionLabel }))} placeholder={sw ? "Mfano: Toleo la 2025" : "e.g. 2025 edition"} />
        <View style={styles.fieldRow}><View style={styles.flex}><Field label={sw ? "Tarehe ya kuanza (hiari)" : "Effective date (optional)"} value={form.effectiveDate} onChangeText={(effectiveDate) => setForm((v) => ({ ...v, effectiveDate }))} placeholder="YYYY-MM-DD" /></View><View style={styles.flex}><Field label={sw ? "Tarehe ya ukaguzi" : "Review due"} value={form.reviewDate} onChangeText={(reviewDate) => setForm((v) => ({ ...v, reviewDate }))} placeholder="YYYY-MM-DD" /></View></View>
        <Button label={busy ? (sw ? "Inapakia na kuweka faharasa..." : "Uploading and indexing...") : (sw ? "Pakia kwa ukaguzi" : "Upload for review")} loading={busy} disabled={busy || !file} onPress={() => void uploadSource()} />
      </Surface>
      <SectionHeading title={sw ? "Vyanzo na hali ya faharasa" : "Sources & index status"} />
      {documents === undefined ? <Surface><Text style={styles.muted}>{sw ? "Inapakia maktaba..." : "Loading knowledge library..."}</Text></Surface> : documents.length ? documents.map((doc) => <Surface key={doc._id}>
        <View style={styles.sourceTop}><View style={styles.icon}><Ionicons name="document-text-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.cardTitle}>{doc.title}</Text><Text style={styles.muted}>{doc.publisher || (sw ? "Mchapishaji haujawekwa" : "Publisher missing")} · {doc.jurisdiction ?? "—"} · {doc.language ?? "—"}</Text></View><Status value={doc.approvalStatus ?? "unreviewed"} /></View>
        <View style={styles.metadata}><Text style={styles.metaText}>{sw ? "Toleo" : "Version"}: {doc.versionLabel ?? "—"}</Text><Text style={styles.metaText}>{sw ? "Aina" : "Category"}: {doc.contentCategory ?? doc.type}</Text><Text style={styles.metaText}>{doc.processedAt ? (sw ? "Faharasa tayari" : "Index ready") : (sw ? "Faharasa haijakamilika" : "Index pending")}</Text><Text style={styles.metaText}>{sw ? "Ukaguzi" : "Review due"}: {doc.reviewDueAt ? new Date(doc.reviewDueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ") : "—"}</Text></View>
        {doc.reviewNote ? <Text style={styles.reviewNote}>{sw ? "Sababu ya awali" : "Previous review note"}: {doc.reviewNote}</Text> : null}
        <Button label={sw ? "Kagua chanzo na PDF" : "Review source and PDF"} variant="secondary" onPress={() => router.push({ pathname: "/saada-source/[id]", params: { id: doc._id } })} />
      </Surface>) : <Surface><Text style={styles.muted}>{sw ? "Maktaba haina chanzo bado. Ongeza nyenzo iliyothibitishwa ili kuanza." : "No sources are in the library yet. Add an authoritative source to begin."}</Text></Surface>}
    </> : tab === "instructions" ? <>
      {!isAdmin ? <Surface tone="orange"><Text style={styles.muted}>{sw ? "Maagizo ya Saada yanaonekana kwa wasimamizi pekee." : "Saada instruction versions are restricted to administrators."}</Text></Surface> : <>
        <SectionHeading title={sw ? "Toleo la maagizo ya Saada" : "Saada instruction versions"} />
        <Surface tone="pink"><Text style={styles.cardTitle}>{sw ? "Pendekeza mabadiliko" : "Propose an instruction change"}</Text><Text style={styles.muted}>{sw ? "Maagizo mapya huanza kama rasimu na msimamizi mwingine lazima ayaidhinishe." : "New instructions start as pending; a different administrator must approve them before they take effect."}</Text><TextInput value={prompt} onChangeText={setPrompt} multiline maxLength={20000} style={[styles.input, styles.promptInput]} placeholder={sw ? "Maagizo ya msingi ya Saada (angalau herufi 100)..." : "Saada’s system instructions (at least 100 characters)..."} placeholderTextColor={colors.inkMuted} /><Text style={styles.counter}>{prompt.length}/20,000</Text><Field label={sw ? "Kwa nini maagizo yanabadilika?" : "Why are instructions changing?"} value={changeNote} onChangeText={setChangeNote} placeholder={sw ? "Sababu ya mabadiliko (herufi 10 au zaidi)" : "Change reason (10 characters or more)"} multiline /><Button label={busy ? (sw ? "Inawasilisha..." : "Submitting...") : (sw ? "Wasilisha kwa idhini huru" : "Submit for independent approval")} loading={busy} disabled={busy || prompt.trim().length < 100 || changeNote.trim().length < 10} onPress={() => void createPromptVersion()} /></Surface>
        <SectionHeading title={sw ? "Matoleo na maamuzi" : "Versions & decisions"} />
        {versions === undefined ? <Surface><Text style={styles.muted}>{sw ? "Inapakia matoleo..." : "Loading versions..."}</Text></Surface> : versions.length ? versions.map((version) => <Surface key={version._id}>
          <View style={styles.sourceTop}><View style={styles.icon}><Ionicons name="git-branch-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.cardTitle}>{sw ? "Toleo" : "Version"} {version.version}</Text><Text style={styles.muted}>{version.changeNote}</Text></View><Status value={version.status} /></View>
          {version.status === "approved" ? <Text style={styles.activeBanner}>{sw ? "Toleo hili ndilo linatumika sasa." : "This version is currently active."}</Text> : null}
          <Button label={sw ? "Soma na kagua toleo" : "Read and review version"} variant="secondary" onPress={() => router.push({ pathname: "/saada-policy/[id]", params: { id: version._id } })} />
          {version.reviewNote ? <Text style={styles.reviewNote}>{sw ? "Maelezo ya mkaguzi" : "Reviewer note"}: {version.reviewNote}</Text> : null}
        </Surface>) : <Surface><Text style={styles.muted}>{sw ? "Hakuna toleo la maagizo lililowasilishwa." : "No instruction versions have been submitted."}</Text></Surface>}
      </>}
    </> : <>
      <SectionHeading title={sw ? "Matumizi na mrejesho wa Saada" : "Saada usage & feedback"} />
      {analytics === undefined ? <Surface><Text style={styles.muted}>{sw ? "Inapakia takwimu..." : "Loading usage data..."}</Text></Surface> : <>
        <View style={styles.analyticsGrid}><Metric value={analytics.totalMessages} label={sw ? "Ujumbe uliohifadhiwa" : "Stored messages"} /><Metric value={analytics.last24h} label={sw ? "Ujumbe saa 24" : "Messages in last 24h"} /><Metric value={analytics.activeUsers} label={sw ? "Akaunti zilizotumia" : "Accounts represented"} /><Metric value={analytics.tokens.total.toLocaleString()} label={sw ? "Tokeni zilizorekodiwa" : "Recorded tokens"} /></View>
        <Surface tone="teal"><Text style={styles.cardTitle}>{sw ? "Gharama ya kihistoria (makadirio)" : "Historical cost estimate"}</Text><Text style={styles.cost}>{analytics.tokens.estimatedCost}</Text><Text style={styles.muted}>{sw ? "Hesabu ya zamani ya tokeni kwa bei tambarare; si ankara, si matumizi ya sasa ya mtoa AI, na inaweza isiakisi gharama halisi." : "Legacy flat-rate token estimate only. It is not an invoice, live provider spend, or a verified measure of actual cost."}</Text></Surface>
        <SectionHeading title={sw ? "Mrejesho wa majibu" : "Answer feedback"} />
        <View style={styles.analyticsGrid}><Metric value={analytics.feedback.positive} label={sw ? "Yamependelewa" : "Helpful"} /><Metric value={analytics.feedback.negative} label={sw ? "Yamewekewa alama" : "Flagged unhelpful"} /><Metric value={analytics.feedback.total} label={sw ? "Jumla" : "Total ratings"} /></View>
        <SectionHeading title={sw ? "Matumizi ya zana" : "Tool usage"} />
        {Object.entries(analytics.toolUsage).length ? Object.entries(analytics.toolUsage).sort((a, b) => b[1] - a[1]).map(([name, count]) => <Surface key={name}><View style={styles.sourceTop}><View style={styles.icon}><Ionicons name="construct-outline" size={20} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.cardTitle}>{name.replaceAll("_", " ")}</Text><Text style={styles.muted}>{sw ? "Matumizi yaliyorekodiwa" : "Recorded invocations"}</Text></View><Text style={styles.toolCount}>{count}</Text></View></Surface>) : <Surface><Text style={styles.muted}>{sw ? "Hakuna matumizi ya zana yaliyorekodiwa." : "No tool invocations have been recorded."}</Text></Surface>}
      </>}
    </>}
    <Button label={sw ? "Fungua kumbukumbu ya ukaguzi" : "Open audit log"} variant="quiet" onPress={() => router.push("/audit-log")} />
  </Screen>;
}

function Field({ label, value, onChangeText, placeholder, multiline, autoCapitalize }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; multiline?: boolean; autoCapitalize?: "none" | "sentences" | "words" | "characters" }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.inkMuted} multiline={multiline} autoCapitalize={autoCapitalize} style={[styles.input, multiline && styles.multiline]} /></View>; }
function ChoiceField({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (value: string) => void }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><View style={styles.choices}>{options.map(([key, title]) => <Pressable key={key} accessibilityRole="radio" accessibilityState={{ selected: key === value }} onPress={() => onChange(key)} style={[styles.choice, key === value && styles.choiceSelected]}><Text style={[styles.choiceText, key === value && styles.choiceTextSelected]}>{title}</Text></Pressable>)}</View></View>; }
function Metric({ value, label }: { value: number | string; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>; }
function Status({ value }: { value: string }) { const good = value === "approved"; return <View style={[styles.status, good && styles.statusGood]}><Text style={[styles.statusText, good && styles.statusTextGood]}>{value.replaceAll("_", " ")}</Text></View>; }
function TabButton({ active, icon, label, onPress }: { active: boolean; icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; onPress: () => void }) { return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.tab, active && styles.tabActive]}><Ionicons name={icon} size={18} color={active ? colors.surface : colors.inkMuted} /><Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({
  flex: { flex: 1 }, hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center", marginBottom: spacing.xs }, kicker: { color: colors.peach, fontFamily: type.bold, fontWeight: "700", fontSize: 11, letterSpacing: 1.1 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontWeight: "700", fontSize: 26, lineHeight: 32 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, metrics: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.md }, analyticsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, metric: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: spacing.md, gap: spacing.xs }, metricValue: { color: colors.burgundy, fontFamily: type.bold, fontWeight: "700", fontSize: 22 }, metricLabel: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 11, lineHeight: 15 }, tabs: { flexDirection: "row", gap: spacing.xs, marginBottom: spacing.md }, tab: { flex: 1, minHeight: 46, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, paddingHorizontal: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }, tabActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, tabText: { color: colors.inkMuted, fontFamily: type.bold, fontSize: 11 }, tabTextActive: { color: colors.surface }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 17 }, cardTitle: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 15 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, cost: { color: colors.teal, fontFamily: type.bold, fontSize: 30, marginVertical: spacing.xs }, toolCount: { color: colors.burgundy, fontFamily: type.bold, fontSize: 18 }, field: { gap: spacing.xs, marginTop: spacing.sm }, label: { color: colors.ink, fontFamily: type.bold, fontSize: 12 }, choices: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }, choice: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, backgroundColor: colors.surface, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm }, choiceSelected: { backgroundColor: colors.softPink, borderColor: colors.burgundy }, choiceText: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 11 }, choiceTextSelected: { color: colors.burgundy }, input: { minHeight: 46, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, color: colors.ink, fontFamily: type.regular, fontSize: 14 }, multiline: { minHeight: 76, textAlignVertical: "top", paddingTop: spacing.md }, fieldRow: { flexDirection: "row", gap: spacing.sm }, filePicker: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: spacing.md, backgroundColor: colors.surface, marginTop: spacing.md, marginBottom: spacing.sm }, sourceTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm }, icon: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, status: { backgroundColor: colors.orangeSoft, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 5, maxWidth: 100 }, statusGood: { backgroundColor: colors.tealSoft }, statusText: { color: colors.orange, fontFamily: type.bold, fontSize: 10, textTransform: "capitalize" }, statusTextGood: { color: colors.teal }, metadata: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md }, metaText: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 11, backgroundColor: "#F7F5F6", borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 5 }, reviewNote: { marginTop: spacing.sm, color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 }, actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }, deleteAction: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, minHeight: 40, marginTop: spacing.sm }, deleteText: { color: colors.danger, fontFamily: type.medium, fontSize: 12 }, promptInput: { minHeight: 200, textAlignVertical: "top", paddingTop: spacing.md, fontFamily: "monospace" }, counter: { alignSelf: "flex-end", marginTop: -spacing.xs, color: colors.inkMuted, fontFamily: type.regular, fontSize: 11 }, activeBanner: { color: colors.teal, backgroundColor: colors.tealSoft, borderRadius: radius.sm, marginTop: spacing.md, padding: spacing.sm, fontFamily: type.medium, fontSize: 12 }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 13 }, notice: { color: colors.teal, fontFamily: type.medium, fontSize: 13, lineHeight: 19 },
});
