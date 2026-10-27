import type { ScrollViewInstance } from "react-native";
import { BrandLoading } from '../src/components/BrandLoading';
import { plainError } from "../../shared/plainLanguage";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useAction, useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { AdminIntro as CivicPageIntro } from "../src/admin/AdminIntro";
import { Button } from "../src/components/Button";
import { AdminScreen as Screen } from "../src/admin/AdminScreen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

type Tab = "sources" | "instructions" | "insights" | "evidence";
type SourceForm = { title: string; publisher: string; sourceUrl: string; jurisdiction: "tanzania_mainland" | "zanzibar" | "national" | "other"; language: "sw" | "en" | "bilingual" | "other"; contentCategory: string; versionLabel: string; effectiveDate: string; reviewDate: string };

export default function SaadaGovernanceScreen() {
  useSensitiveScreenProtection("saada-governance");
  const { sourceTab: initialSourceTab } = useLocalSearchParams<{ sourceTab?: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "staff"].includes(role));
  const isAdmin = roles.includes("admin");
  const [tab, setTab] = useState<Tab>("sources");
  const screenRef = useRef<ScrollViewInstance>(null);
  const [sourceTab, setSourceTab] = useState<"pending" | "due" | "approved" | "history">(initialSourceTab === "due" ? "due" : "pending");
  const documentPage = usePaginatedQuery(api.sara.listDocumentsPage, allowed ? { status: sourceTab } : "skip", { initialNumItems: 20 });
  const documents = documentPage.status === "LoadingFirstPage" ? undefined : documentPage.results;
  const versions = useQuery(api.sara.listPromptVersions, isAdmin ? {} : "skip");
  const analytics = useQuery(api.sara_chat.getAnalytics, allowed ? {} : "skip");
  const evidence = useQuery(api.sara.listSourceEvidence, allowed && tab === "evidence" ? {} : "skip");
  const uploadUrl = useMutation(api.sara.generateUploadUrl);
  const ingest = useAction(api.sara_actions.ingestDocument);
  const recordUpload = useMutation(api.saadaUploadReceipts.record);
  const uploadPage = usePaginatedQuery(api.saadaUploadReceipts.minePage, allowed ? {} : "skip", { initialNumItems: 20 });
  const recoverableUploads = uploadPage.results;
  const submitPrompt = useMutation(api.sara.submitPromptVersion);
  const uploadedSource = useRef<{ uri: string; metadata: string; storageId: Id<"_storage"> } | null>(null);
  const [form, setForm] = useState<SourceForm>({ title: "", publisher: "", sourceUrl: "", jurisdiction: "national", language: "bilingual", contentCategory: "Law / legal guidance", versionLabel: "", effectiveDate: "", reviewDate: "" });
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [replacesDocumentId, setReplacesDocumentId] = useState<Id<"documents"> | null>(null);
  const [prompt, setPrompt] = useState(""); const [changeNote, setChangeNote] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");

  if (access === undefined) return <Screen><BrandLoading compact text={sw ? "Inapakia ruhusa..." : "Loading access..."}/></Screen>;
  if (!allowed) return <Screen><AppHeader back title={sw ? "Usimamizi wa LSF wa Haki Yangu AI" : "Haki Yangu AI governance"} /><Surface tone="orange"><Text style={styles.title}>{sw ? "Ufikiaji haujaruhusiwa" : "Access is not authorised"}</Text><Text style={styles.muted}>{sw ? "Jukumu la LSF lililoidhinishwa linahitajika." : "An approved LSF staff or administrator role is required."}</Text></Surface></Screen>;

  async function chooseSource() {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf", copyToCacheDirectory: true });
    if (result.canceled) return;
    const picked = result.assets[0];
    if (picked.size && picked.size > 15 * 1024 * 1024) { setError(sw ? "PDF lazima iwe chini ya MB 15." : "PDF must be 15 MB or smaller."); return; }
    uploadedSource.current = null;
    setFile(picked); setForm((current) => ({ ...current, title: current.title || picked.name.replace(/\.pdf$/i, "") })); setError("");
  }

  async function uploadSource() {
    if (!file || !form.title.trim() || !form.publisher.trim() || !form.versionLabel.trim() || !form.contentCategory.trim() || !form.reviewDate.trim()) { setError(sw ? "Chagua PDF na ujaze kichwa, mchapishaji, aina ya maudhui, toleo na tarehe ya ukaguzi." : "Choose a PDF and complete title, publisher, category, version and review date."); return; }
    const reviewDueAt = /^\d{4}-\d{2}-\d{2}$/.test(form.reviewDate.trim()) ? Date.parse(`${form.reviewDate.trim()}T12:00:00+03:00`) : NaN;
    if (!Number.isFinite(reviewDueAt) || reviewDueAt <= Date.now() || new Date(reviewDueAt).toISOString().slice(0, 10) !== form.reviewDate.trim()) { setError(sw ? "Weka tarehe halali ya ukaguzi ya baadaye (YYYY-MM-DD)." : "Enter a valid future review date (YYYY-MM-DD)."); return; }
    if (form.sourceUrl.trim()) {
      try { const url = new URL(form.sourceUrl.trim()); if (!["https:", "http:"].includes(url.protocol) || !url.hostname.includes(".")) throw new Error(); }
      catch { setError(sw ? "Weka kiungo halali cha chanzo cha HTTP(S)." : "Enter a valid HTTP(S) source link."); return; }
    }
    setBusy(true); setError(""); setNotice("");
    try {
      const metadata = JSON.stringify({ ...form, replacesDocumentId });
      let storageId = uploadedSource.current?.uri === file.uri && uploadedSource.current.metadata === metadata ? uploadedSource.current.storageId : undefined;
      if (!storageId) {
        const blob = await (await fetch(file.uri)).blob();
        if (!blob.size || blob.size > 15 * 1024 * 1024) throw new Error(sw ? "PDF lazima isiwe tupu na iwe hadi MB 15." : "PDF must be non-empty and 15 MB or smaller.");
        const postUrl = await uploadUrl({});
        const response = await fetch(postUrl, { method: "POST", headers: { "Content-Type": "application/pdf" }, body: blob });
        if (!response.ok) throw new Error(sw ? "Upakiaji wa PDF umeshindwa." : "PDF upload failed.");
        const body = await response.json() as { storageId?: Id<"_storage"> };
        if (!body.storageId) throw new Error("Upload did not return a storage reference.");
        storageId = body.storageId;
        uploadedSource.current = { uri: file.uri, metadata, storageId };
      }
      const ingestion = { storageId, title: form.title.trim(), publisher: form.publisher.trim(), sourceUrl: form.sourceUrl.trim() || undefined, jurisdiction: form.jurisdiction, language: form.language, contentCategory: form.contentCategory.trim(), versionLabel: form.versionLabel.trim(), effectiveDate: form.effectiveDate.trim() || undefined, reviewDueAt, replacesDocumentId: replacesDocumentId ?? undefined };
      const { storageId: receiptStorageId, ...metadataForReceipt } = ingestion;
      await recordUpload({ storageId: receiptStorageId, metadata: metadataForReceipt });
      await ingest(ingestion);
      setNotice(sw ? "Chanzo kimeingizwa kwa ukaguzi huru. Toleo la zamani litatumika tu ikiwa tarehe yake ya ukaguzi bado ni halali." : "Source ingested for independent review. The previous version remains eligible only while its review date is current."); uploadedSource.current = null; setFile(null); setReplacesDocumentId(null); setForm((current) => ({ ...current, versionLabel: "", effectiveDate: "", reviewDate: "" }));
    } catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }

  async function createPromptVersion() {
    setBusy(true); setError("");
    try { const result = await submitPrompt({ prompt, changeNote }); setPrompt(""); setChangeNote(""); setNotice(sw ? `Toleo ${result.version} linasubiri idhini huru.` : `Version ${result.version} is awaiting independent approval.`); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }

  const shownCount = documents === undefined ? "…" : `${documents.length}${documentPage.status === "CanLoadMore" ? "+" : ""}`;
  const failedCount = documents === undefined ? "…" : documents.filter((item) => item.indexingStatus === "failed").length;
  const activePrompt = versions?.find((item) => item.status === "approved");

  return <Screen scrollRef={screenRef}>
    <AppHeader back title={sw ? "Usimamizi wa Haki Yangu AI" : "Haki Yangu AI governance"} eyebrow="LSF · APPROVED KNOWLEDGE" />
    <CivicPageIntro icon="library-outline" eyebrow="HAKI YANGU AI · KNOWLEDGE" title={sw ? "Maarifa yanayoaminika. Majibu salama." : "Trusted knowledge. Safer answers."} description={sw ? "Chanzo kipya hutumika tu baada ya ukaguzi na idhini." : "New sources enter answers only after review and approval."} tone="orange" />
    <View style={styles.metrics}><Metric value={shownCount} label={sourceTab === "pending" ? (sw ? "Vinasubiri" : "Pending shown") : sourceTab === "due" ? (sw ? "Ukaguzi unakaribia" : "Due shown") : sourceTab === "approved" ? (sw ? "Vilivyoidhinishwa" : "Approved shown") : (sw ? "Historia" : "History shown")} /><Metric value={failedCount} label={sw ? "Faharasa imeshindwa" : "Index failed shown"} /><Metric value={activePrompt ? `v${activePrompt.version}` : versions === undefined && isAdmin ? "…" : "—"} label={sw ? "Maagizo hai" : "Active instructions"} /></View>
    <Button label={sw ? "Fungua tathmini na ukaguzi wa majibu" : "Open answer evaluation workspace"} variant="secondary" onPress={() => router.push("/saada-evaluations")} />
    <View style={styles.tabs}><TabButton active={tab === "sources"} icon="documents-outline" label={sw ? "Vyanzo" : "Sources"} onPress={() => setTab("sources")} /><TabButton active={tab === "instructions"} icon="options-outline" label={sw ? "Sera" : "Policy"} onPress={() => setTab("instructions")} /><TabButton active={tab === "evidence"} icon="shield-checkmark-outline" label={sw ? "Ushahidi" : "Evidence"} onPress={() => setTab("evidence")} /><TabButton active={tab === "insights"} icon="stats-chart-outline" label={sw ? "Matumizi" : "Usage"} onPress={() => setTab("insights")} /></View>
    {error ? <Surface tone="orange"><Text accessibilityRole="alert" style={styles.error}>{error}</Text></Surface> : null}
    {notice ? <Surface tone="teal"><Text style={styles.notice}>{notice}</Text></Surface> : null}
    {tab === "sources" ? <>
      {(recoverableUploads.length > 0 || uploadPage.status === "CanLoadMore" || uploadPage.status === "LoadingMore") ? <Surface tone="teal"><Text style={styles.cardTitle}>{sw ? "Endeleza vyanzo ulivyopakia" : "Resume your uploaded sources"}</Text><Text style={styles.muted}>{sw ? "Upakiaji uliokamilika bila rekodi ya chanzo. Pakia risiti za zamani hapa chini. Idhini huru bado inahitajika." : "Completed uploads without a source record. Load older receipts below. Independent approval is still required."}</Text>{recoverableUploads.map((receipt) => <View key={receipt._id}><Text style={styles.muted}>{receipt.metadata.title} · {receipt.metadata.versionLabel}</Text><Button disabled={busy || receipt.metadata.reviewDueAt <= Date.now()} label={sw ? "Endeleza kuingiza chanzo" : "Resume ingestion"} variant="secondary" onPress={() => { setBusy(true); setError(""); void ingest({ storageId: receipt.storageId, ...receipt.metadata }).then(() => setNotice(sw ? "Chanzo kiko tayari kwa ukaguzi huru." : "Source indexed for independent review.")).catch((error) => setError(plainError(error, locale))).finally(() => setBusy(false)); }} />{receipt.metadata.reviewDueAt <= Date.now() ? <ReceiptDateCorrection id={receipt._id} disabled={busy} /> : null}</View>)}{uploadPage.status === "CanLoadMore" || uploadPage.status === "LoadingMore" ? <Button variant="secondary" disabled={uploadPage.status === "LoadingMore"} label={sw ? "Pakia upakiaji wa zamani" : "Load older uploads"} onPress={() => uploadPage.loadMore(20)} /> : null}</Surface> : null}
      <SectionHeading title={sw ? "Ongeza chanzo cha kisheria" : "Add a legal source"} />
      {replacesDocumentId ? <Surface tone="orange"><Text style={styles.cardTitle}>{sw ? "Unabadilisha chanzo kilichoidhinishwa" : "Replacing an approved source"}</Text><Text style={styles.muted}>{sw ? "PDF mpya lazima ipitiwe na msimamizi tofauti. Chanzo kilichopitwa na tarehe ya ukaguzi hakitatumika kujibu wakati kinasubiri kubadilishwa." : "A different administrator must review the new PDF. A source past its review date cannot support answers while its replacement awaits approval."}</Text><Button label={sw ? "Ghairi toleo mbadala" : "Cancel replacement"} variant="quiet" onPress={() => setReplacesDocumentId(null)} /></Surface> : null}
      <Surface tone="pink"><Text style={styles.cardTitle}>{sw ? "PDF, provenance na ukaguzi" : "PDF, provenance and review"}</Text><Text style={styles.muted}>{sw ? "Tumia sheria, kanuni, mwongozo rasmi au nyenzo iliyoidhinishwa. Chanzo kisicho na metadata kamili hakiwezi kuidhinishwa." : "Use laws, regulations, official guidance or approved material. A source without complete metadata cannot be approved."}</Text>
        <Pressable accessibilityRole="button" onPress={() => void chooseSource()} style={styles.filePicker}><Ionicons name={file ? "checkmark-circle-outline" : "cloud-upload-outline"} size={24} color={file ? colors.teal : colors.burgundy} /><View style={styles.flex}><Text style={styles.cardTitle}>{file?.name ?? (sw ? "Chagua PDF" : "Choose a PDF")}</Text><Text style={styles.muted}>{file ? `${((file.size ?? 0) / 1024 / 1024).toFixed(1)} MB` : (sw ? "PDF pekee · hadi MB 15" : "PDF only · up to 15 MB")}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></Pressable>
        <Field label={sw ? "Kichwa cha chanzo" : "Source title"} value={form.title} maxLength={180} onChangeText={(title) => setForm((v) => ({ ...v, title }))} placeholder={sw ? "Kichwa halisi cha hati" : "Exact document title"} />
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
      <View style={styles.tabs}><TabButton active={sourceTab === "pending"} icon="time-outline" label={sw ? "Vinasubiri" : "Pending"} onPress={() => setSourceTab("pending")} /><TabButton active={sourceTab === "due"} icon="calendar-outline" label={sw ? "Ukaguzi unakaribia" : "Review due"} onPress={() => setSourceTab("due")} /><TabButton active={sourceTab === "approved"} icon="checkmark-circle-outline" label={sw ? "Vimeidhinishwa" : "Approved"} onPress={() => setSourceTab("approved")} /><TabButton active={sourceTab === "history"} icon="archive-outline" label={sw ? "Historia" : "History"} onPress={() => setSourceTab("history")} /></View>
      {sourceTab === "due" ? <Surface tone="orange"><Text style={styles.muted}>{sw ? "Vyanzo vilivyoidhinishwa vyenye ukaguzi uliopita au unaofika ndani ya siku 30. Kagua PDF na asili yake kabla ya kuandaa toleo jipya." : "Approved sources with missing, overdue or next-30-day review dates. Recheck the PDF and provenance before preparing a replacement."}</Text></Surface> : null}
      {documents === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia maktaba..." : "Loading knowledge library..."}/></Surface> : documents.length ? documents.map((doc) => <Surface key={doc._id}>
        <View style={styles.sourceTop}><View style={styles.icon}><Ionicons name="document-text-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.cardTitle}>{doc.title}</Text><Text style={styles.muted}>{doc.publisher || (sw ? "Mchapishaji haujawekwa" : "Publisher missing")} · {doc.jurisdiction ?? "—"} · {doc.language ?? "—"}</Text></View><Status value={doc.approvalStatus === "approved" && (!doc.reviewDueAt || doc.reviewDueAt <= Date.now()) ? "expired" : doc.approvalStatus ?? "unreviewed"} sw={sw} /></View>
        <View style={styles.metadata}><Text style={styles.metaText}>{sw ? "Toleo" : "Version"}: {doc.versionLabel ?? "—"}</Text><Text style={styles.metaText}>{sw ? "Aina" : "Category"}: {doc.contentCategory ?? doc.type}</Text><Text style={styles.metaText}>{doc.indexingStatus === "failed" ? (sw ? "Faharasa imeshindwa" : "Index failed") : doc.indexingStatus === "ready" ? (sw ? "Faharasa tayari" : "Index ready") : (sw ? "Faharasa haijakamilika" : "Index pending")}</Text><Text style={styles.metaText}>{sw ? "Ukaguzi" : "Review due"}: {doc.reviewDueAt ? new Date(doc.reviewDueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ") : "—"}</Text></View>
        {doc.approvalStatus === "approved" && (!doc.reviewDueAt || doc.reviewDueAt <= Date.now()) ? <Text style={styles.warning}>{sw ? "Muda wa ukaguzi umepita au haujawekwa; chanzo hiki hakitumiki kwenye majibu ya Haki Yangu AI." : "Review is overdue or missing; this source is excluded from Haki Yangu AI answers."}</Text> : null}
        {doc.reviewNote ? <Text style={styles.reviewNote}>{sw ? "Sababu ya awali" : "Previous review note"}: {doc.reviewNote}</Text> : null}
        {doc.replacesDocumentId ? <Text style={styles.metaText}>{sw ? "Chanzo kilichobadilishwa" : "Replaces source"}: {String(doc.replacesDocumentId)}</Text> : null}
        {doc.approvalStatus === "approved" ? <Button label={sw ? "Tayarisha toleo jipya" : "Prepare replacement"} variant="quiet" onPress={() => { setReplacesDocumentId(doc._id); setFile(null); setError(""); setForm((current) => ({ ...current, publisher: doc.publisher ?? "", sourceUrl: doc.sourceUrl ?? "", jurisdiction: doc.jurisdiction ?? "national", language: doc.language ?? "bilingual", contentCategory: doc.contentCategory ?? "Law / legal guidance", versionLabel: "", effectiveDate: doc.effectiveDate ?? "", reviewDate: "" })); screenRef.current?.scrollTo({ y: 0, animated: true }); }} /> : null}
        <Button label={sw ? "Kagua chanzo na PDF" : "Review source and PDF"} variant="secondary" onPress={() => router.push({ pathname: "/saada-source/[id]", params: { id: doc._id } })} />
      </Surface>) : <Surface><Text style={styles.muted}>{sourceTab === "pending" ? (sw ? "Hakuna chanzo kinachosubiri ukaguzi." : "No source is awaiting review.") : sourceTab === "due" ? (sw ? "Hakuna chanzo kinachohitaji ukaguzi ndani ya siku 30." : "No source needs review within 30 days.") : sourceTab === "approved" ? (sw ? "Hakuna chanzo kilichoidhinishwa." : "No approved sources yet.") : (sw ? "Hakuna chanzo kwenye historia." : "No source history yet.")}</Text></Surface>}
      {documentPage.status === "CanLoadMore" ? <Button label={sw ? "Pakia vyanzo zaidi" : "Load more sources"} variant="secondary" onPress={() => documentPage.loadMore(20)} /> : documentPage.status === "LoadingMore" ? <Surface><BrandLoading compact text={sw ? "Inapakia zaidi..." : "Loading more..."}/></Surface> : null}
    </> : tab === "instructions" ? <>
      {!isAdmin ? <Surface tone="orange"><Text style={styles.muted}>{sw ? "Maagizo ya Haki Yangu AI yanaonekana kwa wasimamizi pekee." : "Haki Yangu AI instruction versions are restricted to administrators."}</Text></Surface> : <>
        <SectionHeading title={sw ? "Toleo la maagizo ya Haki Yangu AI" : "Haki Yangu AI instruction versions"} />
        <Surface tone="pink"><Text style={styles.cardTitle}>{sw ? "Pendekeza mabadiliko" : "Propose an instruction change"}</Text><Text style={styles.muted}>{sw ? "Maagizo mapya huanza kama rasimu na msimamizi mwingine lazima ayaidhinishe." : "New instructions start as pending; a different administrator must approve them before they take effect."}</Text><TextInput value={prompt} onChangeText={setPrompt} multiline maxLength={20000} style={[styles.input, styles.promptInput]} placeholder={sw ? "Maagizo ya msingi ya Haki Yangu AI (angalau herufi 100)..." : "Haki Yangu AI’s system instructions (at least 100 characters)..."} placeholderTextColor={colors.inkMuted} /><Text style={styles.counter}>{prompt.length}/20,000</Text><Field label={sw ? "Kwa nini maagizo yanabadilika?" : "Why are instructions changing?"} value={changeNote} onChangeText={setChangeNote} placeholder={sw ? "Sababu ya mabadiliko (herufi 10 au zaidi)" : "Change reason (10 characters or more)"} multiline /><Button label={busy ? (sw ? "Inawasilisha..." : "Submitting...") : (sw ? "Wasilisha kwa idhini huru" : "Submit for independent approval")} loading={busy} disabled={busy || prompt.trim().length < 100 || changeNote.trim().length < 10} onPress={() => void createPromptVersion()} /></Surface>
        <SectionHeading title={sw ? "Matoleo na maamuzi" : "Versions & decisions"} />
        {versions === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia matoleo..." : "Loading versions..."}/></Surface> : versions.length ? versions.map((version) => <Surface key={version._id}>
          <View style={styles.sourceTop}><View style={styles.icon}><Ionicons name="git-branch-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.cardTitle}>{sw ? "Toleo" : "Version"} {version.version}</Text><Text style={styles.muted}>{version.changeNote}</Text></View><Status value={version.status} /></View>
          {version.status === "approved" ? <Text style={styles.activeBanner}>{sw ? "Toleo hili ndilo linatumika sasa." : "This version is currently active."}</Text> : null}
          <Button label={sw ? "Soma na kagua toleo" : "Read and review version"} variant="secondary" onPress={() => router.push({ pathname: "/saada-policy/[id]", params: { id: version._id } })} />
          {version.reviewNote ? <Text style={styles.reviewNote}>{sw ? "Maelezo ya mkaguzi" : "Reviewer note"}: {version.reviewNote}</Text> : null}
        </Surface>) : <Surface><Text style={styles.muted}>{sw ? "Hakuna toleo la maagizo lililowasilishwa." : "No instruction versions have been submitted."}</Text></Surface>}
      </>}
    </> : tab === "evidence" ? <>
      <SectionHeading title={sw ? "Vyanzo vilivyofikiriwa kwa majibu" : "Sources considered for answers"} />
      <Surface tone="pink"><Text style={styles.cardTitle}>{sw ? "Kumbukumbu ya ufuatiliaji" : "Retrieval evidence"}</Text><Text style={styles.muted}>{sw ? "Hii inaonyesha vyanzo vilivyorejeshwa kwa ombi; si uthibitisho kwamba Haki Yangu AI alivitaja au alitoa jibu sahihi. Kagua jibu lenyewe kabla ya kutathmini." : "This shows sources retrieved for a request. It does not prove that Haki Yangu AI cited them or answered correctly. Review the actual answer before scoring it."}</Text></Surface>
      {evidence === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia ushahidi..." : "Loading evidence..."}/></Surface> : evidence.length === 0 ? <Surface><Text style={styles.muted}>{sw ? "Hakuna ushahidi uliorekodiwa bado." : "No retrieval evidence recorded yet."}</Text></Surface> : evidence.map((event) => <Surface key={event.id}><Text style={styles.cardTitle}>{new Date(event.createdAt).toLocaleString(sw ? "sw-TZ" : "en-TZ")}</Text><Text style={styles.muted}>{sw ? "Ombi" : "Request"}: {event.requestId} · {event.source}</Text><Text style={styles.muted}>{sw ? "Matokeo ya uhakika wa juu" : "High-confidence matches"}: {event.highConfidenceResultCount}</Text>{event.sources.length ? event.sources.map((source) => <View key={source.id}><Text style={styles.metaText}>{source.title} · {source.version} · {source.status}</Text><Button label={sw ? "Pitia chanzo" : "Review source"} variant="quiet" onPress={() => router.push({ pathname: "/saada-source/[id]", params: { id: source.id } })} /></View>) : <Text style={styles.warning}>{sw ? "Hakuna chanzo kilichorekodiwa kwa ombi hili." : "No source was recorded for this request."}</Text>}</Surface>)}
    </> : <>
      <SectionHeading title={sw ? "Matumizi na maoni wa Haki Yangu AI" : "Haki Yangu AI usage & feedback"} />
      {analytics === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia takwimu..." : "Loading usage data..."}/></Surface> : <>
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

function Field({ label, value, onChangeText, placeholder, multiline, autoCapitalize, maxLength }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; multiline?: boolean; maxLength?: number; autoCapitalize?: "none" | "sentences" | "words" | "characters" }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} maxLength={maxLength} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.inkMuted} multiline={multiline} autoCapitalize={autoCapitalize} style={[styles.input, multiline && styles.multiline]} /></View>; }
function ChoiceField({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (value: string) => void }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><View style={styles.choices}>{options.map(([key, title]) => <Pressable key={key} accessibilityRole="radio" accessibilityState={{ checked: key === value }} aria-checked={key === value} onPress={() => onChange(key)} style={[styles.choice, key === value && styles.choiceSelected]}><Text style={[styles.choiceText, key === value && styles.choiceTextSelected]}>{title}</Text></Pressable>)}</View></View>; }
function Metric({ value, label }: { value: number | string; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>; }
function Status({ value, sw = false }: { value: string; sw?: boolean }) { const good = value === "approved"; return <View style={[styles.status, good && styles.statusGood]}><Text style={[styles.statusText, good && styles.statusTextGood]}>{value === "expired" ? (sw ? "Ukaguzi umepita" : "Review overdue") : value.replaceAll("_", " ")}</Text></View>; }
function TabButton({ active, icon, label, onPress }: { active: boolean; icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; onPress: () => void }) { return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.tab, active && styles.tabActive]}><Ionicons name={icon} size={18} color={active ? colors.surface : colors.inkMuted} /><Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({
  flex: { flex: 1 }, hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center", marginBottom: spacing.xs }, kicker: { color: colors.peach, fontFamily: type.bold, fontWeight: "700", fontSize: 11, letterSpacing: 1.1 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontWeight: "700", fontSize: 26, lineHeight: 32 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, metrics: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.md }, analyticsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, metric: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: spacing.md, gap: spacing.xs }, metricValue: { color: colors.burgundy, fontFamily: type.bold, fontWeight: "700", fontSize: 22 }, metricLabel: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 11, lineHeight: 15 }, tabs: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.md }, tab: { flexBasis: "46%", flexGrow: 1, minHeight: 46, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, paddingHorizontal: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }, tabActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, tabText: { color: colors.inkMuted, fontFamily: type.bold, fontSize: 11 }, tabTextActive: { color: colors.surface }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 17 }, cardTitle: { color: colors.ink, fontFamily: type.bold, fontWeight: "700", fontSize: 15 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, cost: { color: colors.teal, fontFamily: type.bold, fontSize: 30, marginVertical: spacing.xs }, toolCount: { color: colors.burgundy, fontFamily: type.bold, fontSize: 18 }, field: { gap: spacing.xs, marginTop: spacing.sm }, label: { color: colors.ink, fontFamily: type.bold, fontSize: 12 }, choices: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }, choice: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, backgroundColor: colors.surface, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm }, choiceSelected: { backgroundColor: colors.softPink, borderColor: colors.burgundy }, choiceText: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 11 }, choiceTextSelected: { color: colors.burgundy }, input: { minHeight: 46, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, color: colors.ink, fontFamily: type.regular, fontSize: 14 }, multiline: { minHeight: 76, textAlignVertical: "top", paddingTop: spacing.md }, fieldRow: { flexDirection: "row", gap: spacing.sm }, filePicker: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: spacing.md, backgroundColor: colors.surface, marginTop: spacing.md, marginBottom: spacing.sm }, sourceTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm }, icon: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, status: { backgroundColor: colors.orangeSoft, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 5, maxWidth: 100 }, statusGood: { backgroundColor: colors.tealSoft }, statusText: { color: colors.orange, fontFamily: type.bold, fontSize: 10, textTransform: "capitalize" }, statusTextGood: { color: colors.teal }, metadata: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md }, metaText: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 11, backgroundColor: "#F7F5F6", borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 5 }, reviewNote: { marginTop: spacing.sm, color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 }, actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }, deleteAction: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, minHeight: 40, marginTop: spacing.sm }, deleteText: { color: colors.danger, fontFamily: type.medium, fontSize: 12 }, promptInput: { minHeight: 200, textAlignVertical: "top", paddingTop: spacing.md, fontFamily: "monospace" }, counter: { alignSelf: "flex-end", marginTop: -spacing.xs, color: colors.inkMuted, fontFamily: type.regular, fontSize: 11 }, activeBanner: { color: colors.teal, backgroundColor: colors.tealSoft, borderRadius: radius.sm, marginTop: spacing.md, padding: spacing.sm, fontFamily: type.medium, fontSize: 12 }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 13 }, notice: { color: colors.teal, fontFamily: type.medium, fontSize: 13, lineHeight: 19 },
  warning: { color: colors.danger, fontFamily: type.medium, fontSize: 13, marginTop: spacing.sm },
});

function ReceiptDateCorrection({ id, disabled }: { id: Id<"saada_upload_receipts">; disabled: boolean }) {
  const { locale } = useLanguage(); const sw = locale === "sw";
  const correct = useMutation(api.saadaUploadReceipts.correctReviewDate);
  const [date, setDate] = useState(""); const [reason, setReason] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function save() {
    const reviewDueAt = /^\d{4}-\d{2}-\d{2}$/.test(date) ? Date.parse(`${date}T12:00:00+03:00`) : NaN;
    if (!Number.isFinite(reviewDueAt) || new Date(reviewDueAt).toISOString().slice(0, 10) !== date) { setError(sw ? "Weka tarehe halali (YYYY-MM-DD)." : "Enter a valid date (YYYY-MM-DD)."); return; }
    setBusy(true); setError("");
    try { await correct({ id, reviewDueAt, reason }); } catch (error) { setError(plainError(error, locale)); } finally { setBusy(false); }
  }
  return <View><Text style={styles.muted}>{sw ? "Tarehe ya ukaguzi imepita. Rekebisha kwa sababu kabla ya kuendelea. Hii si idhini ya chanzo." : "The review date expired. Correct it with a reason before resuming. This does not approve the source."}</Text><Field label={sw ? "Tarehe mpya ya ukaguzi" : "New review date"} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" /><Field label={sw ? "Sababu ya marekebisho" : "Correction reason"} value={reason} onChangeText={setReason} placeholder={sw ? "Kwa nini tarehe inabadilika?" : "Why is the date changing?"} />{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<Button variant="secondary" disabled={disabled || busy || !date || reason.trim().length < 10} loading={busy} label={sw ? "Hifadhi marekebisho ya tarehe" : "Save review-date correction"} onPress={() => void save()} /></View>;
}
