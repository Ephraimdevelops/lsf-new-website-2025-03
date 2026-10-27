import { LoadingText } from '@/components/shared/BrandLoading';
import { BrandLoadingIcon } from '@/components/shared/BrandLoading';
import BrandLoading from '@/components/shared/BrandLoading';
import { useStatusLabel } from "@/i18n/useStatusLabel";
import { usePlainError } from "@/i18n/usePlainError";
import { useCopy } from "@/i18n/useCopy";
import { prepareResearchPdf } from "../lib/prepareResearchPdf";
import type { PreparedResearchRow } from "../components/haki-yangu/ResearchPdfUpload";
import SaadaReadiness from "../components/haki-yangu/SaadaReadiness";
import { canRetrySourceIndex, isStalledSourceIndex } from "../../convex/lib/saadaIndexRecovery";
import { useState, useEffect, useRef } from "react";
import { useMutation, useAction, useQuery, usePaginatedQuery } from "convex/react";
import type { Id, Doc } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import Layout from "../components/layout/Layout";
import Container from "../components/shared/Container";
import { Button } from "../components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Settings, Save, Database } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import ResearchPdfUpload from '../components/haki-yangu/ResearchPdfUpload';
import SourceMetadataEditor from '../components/haki-yangu/SourceMetadataEditor';
import { buildSaadaSystemPrompt, SAADA_DEFAULT_PROMPT, SAADA_PROMPT_VERSION } from '../../convex/lib/saadaPrompt';

const SaraTrain = () => {
  const readError = usePlainError();
  const c = useCopy();
    const generateUploadUrl = useMutation(api.sara.generateUploadUrl);
    const generateResearchUploadUrl = useMutation(api.saadaResearchPdfs.generateIndexingUploadUrl);
    const ingestDocument = useAction(api.sara_actions.ingestDocument);
    const linkIndexingCopy = useMutation(api.saadaResearchPdfs.linkIndexingCopy);
    const recordUpload = useMutation(api.saadaUploadReceipts.record);
    const uploadPage = usePaginatedQuery(api.saadaUploadReceipts.minePage, {}, { initialNumItems: 20 });
    const recoverableUploads = uploadPage.results;
    const correctReviewDate = useMutation(api.saadaUploadReceipts.correctReviewDate);
    const [corrections, setCorrections] = useState<Record<string, { date: string; reason: string }>>({});

    const uploadedFile = useRef<{ file: File; metadata: string; storageId: Id<"_storage"> } | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [storedResearch, setStoredResearch] = useState<{ id: Id<'saada_research_pdfs'>; storageId: Id<'_storage'>; filename: string; url: string | null; sha256: string; byteSize: number; needsSecurityScan: boolean } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState("");
    const [source, setSource] = useState({ title: "", publisher: "", sourceUrl: "", jurisdiction: "national", language: "bilingual", contentCategory: "Law / legal guidance", versionLabel: "", effectiveDate: "", reviewDate: "" });
    function prepareStoredResearch(row: PreparedResearchRow) {
        const candidate = JSON.parse(row.provenance).candidate ?? {};
        setStoredResearch({ id: row._id, storageId: row.canReuseIndexingCopy ? row.indexingStorageId ?? row.storageId : row.storageId, filename: row.filename, url: row.url, sha256: row.sha256, byteSize: row.byteSize, needsSecurityScan: !row.canReuseIndexingCopy });
        setFile(null); uploadedFile.current = null;
        setSource({ title: row.title, publisher: typeof candidate.publisher === 'string' ? candidate.publisher : '', sourceUrl: typeof candidate.sourceUrl === 'string' ? candidate.sourceUrl : '', jurisdiction: ['tanzania_mainland', 'zanzibar', 'national'].includes(candidate.approvedJurisdiction) ? candidate.approvedJurisdiction : 'other', language: ['sw', 'en', 'bilingual'].includes(candidate.observedLanguage) ? candidate.observedLanguage : 'other', contentCategory: typeof candidate.topicDraft === 'string' ? candidate.topicDraft : 'Law / legal guidance', versionLabel: typeof candidate.versionLabelDraft === 'string' ? candidate.versionLabelDraft.slice(0, 80) : '', effectiveDate: '', reviewDate: '' });
        setProgress('Stored original selected. Review the title, publisher, jurisdiction, edition and review date below before indexing. No approval has been granted.');
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            if (!selected.name.toLowerCase().endsWith(".pdf") || (selected.type && selected.type !== "application/pdf")) {
                toast.error("Choose a PDF document.");
                e.target.value = "";
                return;
            }
            if (!selected.size || selected.size > 15 * 1024 * 1024) {
                toast.error("Choose a non-empty PDF of 15MB or smaller.");
                e.target.value = "";
                return;
            }
            setFile(selected);
            setStoredResearch(null);
            setSource((current) => ({ ...current, title: current.title || selected.name.replace(/\.pdf$/i, "") }));
            setProgress("");
        }
        // Reset input value to allow selecting the same file again if needed
        e.target.value = "";
    };

    const handleUpload = async () => {
        if (!file && !storedResearch) return;

        const reviewDueAt = new Date(`${source.reviewDate}T12:00:00+03:00`).getTime();
        if (!source.title.trim() || !source.publisher.trim() || !source.contentCategory.trim() || !source.versionLabel.trim()) {
            toast.error("Enter the source title, publisher, category and edition.");
            return;
        }
        if (!Number.isFinite(reviewDueAt) || reviewDueAt <= Date.now() || new Date(reviewDueAt).toISOString().slice(0, 10) !== source.reviewDate) {
            toast.error("Choose a future review date.");
            return;
        }
        if (source.sourceUrl.trim()) {
            try {
                const url = new URL(source.sourceUrl.trim());
                if (!["https:", "http:"].includes(url.protocol)) throw new Error();
            } catch {
                toast.error("Enter a valid HTTP or HTTPS source URL.");
                return;
            }
        }
        setIsUploading(true);
        setProgress("Preparing secure upload...");

        try {
            const metadata = JSON.stringify(source);
            let storageId = (storedResearch && !storedResearch.needsSecurityScan ? storedResearch.storageId : undefined) ?? (uploadedFile.current?.file === file && uploadedFile.current.metadata === metadata ? uploadedFile.current.storageId : undefined);
            if (!storageId) {
                let fileToUpload = file;
                if (storedResearch?.needsSecurityScan) {
                    if (!storedResearch.url) throw new Error('Stored source is unavailable.');
                    setProgress('Checking the archived original and preparing a security-scanned copy...');
                    const original = await fetch(storedResearch.url);
                    if (!original.ok) throw new Error('Could not read the archived original.');
                    fileToUpload = await prepareResearchPdf(await original.blob(), storedResearch);
                }
                if (!fileToUpload) throw new Error('Choose a PDF or a stored research source.');
                const postUrl = storedResearch ? await generateResearchUploadUrl({id:storedResearch.id}) : await generateUploadUrl();
                setProgress("Uploading the source PDF...");
                const result = await fetch(postUrl, { method: "POST", headers: { "Content-Type": "application/pdf" }, body: fileToUpload });
                if (!result.ok) throw new Error("Upload failed");
                const body = await result.json() as { storageId?: Id<"_storage"> };
                if (!body.storageId) throw new Error("Upload did not return a storage reference.");
                storageId = body.storageId;
                uploadedFile.current = { file: fileToUpload, metadata, storageId };
                if (storedResearch) {
                    await linkIndexingCopy({ id: storedResearch.id, storageId });
                    setStoredResearch({ ...storedResearch, storageId, needsSecurityScan: false });
                }
            }

            // 3. Process Document (Parse + Embed)
            setProgress("Extracting text and indexing for independent review...");
            const ingestion = {
                storageId,
                title: source.title.trim(),
                publisher: source.publisher,
                sourceUrl: source.sourceUrl || undefined,
                jurisdiction: source.jurisdiction as "national",
                language: source.language as "bilingual",
                contentCategory: source.contentCategory,
                versionLabel: source.versionLabel,
                effectiveDate: source.effectiveDate || undefined,
                reviewDueAt,
            };
            const { storageId: receiptStorageId, ...metadataForReceipt } = ingestion;
            await recordUpload({ storageId: receiptStorageId, metadata: metadataForReceipt });
            await ingestDocument(ingestion);

            toast.success("Source uploaded. It will stay out of Haki Yangu AI answers until a different administrator approves it.");
            uploadedFile.current = null;
            setFile(null);
            setStoredResearch(null);
            setProgress("");
        } catch (error) {
            console.error(error);
            const errorMessage = readError(error, "Unknown error");
            toast.error(`Source ingestion failed: ${errorMessage}`);
            setProgress(`Error: ${errorMessage}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Layout>
            <Container className="py-20">
                <SaadaReadiness />
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-20"></div>
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                <img src="/sara-avatar-v2.png" alt="Haki Yangu AI" className="w-full h-full object-cover" />
                            </div>
                            <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">{c("Haki Yangu AI knowledge sources")}</h1>
                            <Link to="/dashboard/saada-evaluations" className="text-sm font-semibold text-primary underline">{c("Open answer evaluations")}</Link>
                            <p className="text-gray-600 text-lg max-w-lg leading-relaxed">{c("Upload legal source PDFs with their provenance and edition for independent review.")}</p>
                        </div>
                    </div>


                    <div className="bg-yellow-50 p-4 rounded-lg flex gap-3 text-sm text-yellow-800">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>
                            <strong>{c("Review gate:")}</strong>{c(" Uploaded PDFs are parsed and indexed for review. Haki Yangu AI cannot use them in public answers until a different administrator approves the source.")}</p>
                    </div>
                    {(recoverableUploads.length > 0 || uploadPage.status === "CanLoadMore" || uploadPage.status === "LoadingMore") && <section className="my-6 rounded-xl border border-teal-200 bg-teal-50 p-4" aria-label={c("Recover uploaded sources")}>
                        <h2 className="font-semibold">{c("Resume your uploaded sources")}</h2>
                        <p className="mt-1 text-sm">{c("Completed uploads with no source record. Load older receipts below. Resume indexing; independent approval is still required.")}</p>
                        {recoverableUploads.map((receipt) => <div key={receipt._id} className="mt-4 rounded-lg border bg-white p-3">
                            <div className="flex flex-wrap items-center justify-between gap-3"><span>{receipt.metadata.title} · {receipt.metadata.versionLabel}</span><Button disabled={isUploading || receipt.metadata.reviewDueAt <= Date.now()} variant="outline" onClick={async () => { setIsUploading(true); setProgress("Resuming saved PDF ingestion..."); try { await ingestDocument({ storageId: receipt.storageId, ...receipt.metadata }); setProgress(""); toast.success("Source indexed for independent review."); } catch (error) { toast.error(readError(error, "Could not resume ingestion.")); } finally { setIsUploading(false); } }}>{c("Resume ingestion")}</Button></div>
                            {receipt.metadata.reviewDueAt <= Date.now() && <div className="mt-3 space-y-2"><p className="text-sm text-amber-800">{c("The review date has expired. Correct it with a reason before resuming. This does not approve the source.")}</p><label className="block text-sm">{c("New review date")}<input type="date" disabled={isUploading} value={corrections[receipt._id]?.date ?? ""} onChange={e => setCorrections(current => ({ ...current, [receipt._id]: { reason: current[receipt._id]?.reason ?? "", date: e.target.value } }))} className="ml-2 rounded border p-2" /></label><input aria-label={`Correction reason for ${receipt.metadata.title}`} placeholder={c("Why is the review date changing?")} value={corrections[receipt._id]?.reason ?? ""} disabled={isUploading} onChange={e => setCorrections(current => ({ ...current, [receipt._id]: { date: current[receipt._id]?.date ?? "", reason: e.target.value } }))} className="w-full rounded border p-2" /><Button variant="outline" disabled={isUploading || !corrections[receipt._id]?.date || (corrections[receipt._id]?.reason.trim().length ?? 0) < 10} onClick={async () => { const correction = corrections[receipt._id]; const reviewDueAt = Date.parse(`${correction.date}T12:00:00+03:00`); if (!Number.isFinite(reviewDueAt) || new Date(reviewDueAt).toISOString().slice(0, 10) !== correction.date) { toast.error("Enter a valid review date."); return; } setIsUploading(true); try { await correctReviewDate({ id: receipt._id, reviewDueAt, reason: correction.reason }); toast.success("Review date corrected and recorded in the audit log."); } catch (error) { toast.error(readError(error, "Could not correct review date.")); } finally { setIsUploading(false); } }}>{c("Save review-date correction")}</Button></div>}
                        </div>)}
                        {uploadPage.status === "CanLoadMore" || uploadPage.status === "LoadingMore" ? <Button className="mt-4" variant="outline" disabled={uploadPage.status === "LoadingMore"} onClick={() => uploadPage.loadMore(20)}>{uploadPage.status === "LoadingMore" ? "Loading older uploads…" : c("Load older uploads")}</Button> : null}
                    </section>}
                    <ResearchPdfUpload onPrepare={prepareStoredResearch} />
                    {/* Upload Section */}
                    <div className="mb-12">
                        <div className="grid gap-3 sm:grid-cols-2 mb-5">
                            <label className="text-sm text-gray-600 sm:col-span-2">{c("Source title *")}<input value={source.title} maxLength={180} disabled={isUploading} onChange={(e) => setSource({ ...source, title: e.target.value })} placeholder={c("Exact document title")} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
                            <input aria-label={c("Official publisher / authority")} disabled={isUploading} value={source.publisher} onChange={(e) => setSource({ ...source, publisher: e.target.value })} placeholder={c("Official publisher / authority *")} className="rounded-lg border px-3 py-2" />
                            <input aria-label={c("Official source URL")} disabled={isUploading} value={source.sourceUrl} onChange={(e) => setSource({ ...source, sourceUrl: e.target.value })} placeholder={c("Official source URL (recommended)")} className="rounded-lg border px-3 py-2" />
                            <select aria-label={c("Jurisdiction")} disabled={isUploading} value={source.jurisdiction} onChange={(e) => setSource({ ...source, jurisdiction: e.target.value })} className="rounded-lg border px-3 py-2"><option value="national">{c("National")}</option><option value="tanzania_mainland">{c("Tanzania Mainland")}</option><option value="zanzibar">Zanzibar</option><option value="other">{c("Other")}</option></select>
                            <select aria-label={c("Source language")} disabled={isUploading} value={source.language} onChange={(e) => setSource({ ...source, language: e.target.value })} className="rounded-lg border px-3 py-2"><option value="bilingual">{c("Kiswahili & English")}</option><option value="sw">Kiswahili</option><option value="en">{c("English")}</option><option value="other">{c("Other")}</option></select>
                            <input aria-label={c("Content category")} disabled={isUploading} value={source.contentCategory} onChange={(e) => setSource({ ...source, contentCategory: e.target.value })} placeholder={c("Category *")} className="rounded-lg border px-3 py-2" />
                            <input aria-label={c("Edition / version / gazette reference")} disabled={isUploading} value={source.versionLabel} onChange={(e) => setSource({ ...source, versionLabel: e.target.value })} placeholder={c("Edition / version / gazette reference *")} className="rounded-lg border px-3 py-2" />
                            <label className="text-sm text-gray-600">{c("Effective date")}<input type="date" value={source.effectiveDate} onChange={(e) => setSource({ ...source, effectiveDate: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
                            <label className="text-sm text-gray-600">{c("Review due *")}<input type="date" value={source.reviewDate} onChange={(e) => setSource({ ...source, reviewDate: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
                        </div>
                        <div className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${isUploading ? 'border-primary/50 bg-primary/5' : 'border-gray-200 hover:border-primary hover:bg-gray-50 hover:shadow-lg'}`}>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="pdf-upload"
                                disabled={isUploading}
                            />
                            <label
                                htmlFor="pdf-upload"
                                className={`cursor-pointer flex flex-col items-center justify-center gap-4 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 ${isUploading ? 'bg-primary/10 text-primary scale-110' : 'bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-110'}`}>
                                    <Upload className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {file ? file.name : storedResearch ? storedResearch.filename : "Choose a source PDF"}
                                    </h3>
                                    <p className="text-gray-500">
                                        {file ? "Ready to ingest" : storedResearch ? "The original is preserved. Older files pass through security scanning before indexing; review metadata below." : "PDF only, up to 15MB"}
                                    </p>
                                </div>
                            </label>
                        </div>

                        {(file || storedResearch) && !isUploading && (
                            <div className="mt-6 flex justify-center">
                                <Button
                                    onClick={handleUpload}
                                    disabled={!source.title.trim() || !source.publisher.trim() || !source.contentCategory.trim() || !source.versionLabel.trim() || !source.reviewDate}
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-white px-8"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    {storedResearch ? 'Index stored PDF for review' : c("Upload for review")}
                                </Button>
                            </div>
                        )}

                        {isUploading && (
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-primary font-medium justify-center">
                                    <BrandLoadingIcon className="w-5 h-5 " />
                                    <span className="animate-pulse">{progress}</span>
                                </div>
                                <p className="text-center text-sm text-gray-500">{c("Keep this page open. Indexing time depends on the document size.")}</p>
                            </div>
                        )}
                    </div>

                    {!isUploading && progress.startsWith("Error:") && <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">{progress}{c(" Check the source list below before retrying: an interrupted response may still have created a record.")}</p>}
                    <DocumentList />

                    {/* System Instructions Section */}
                    <SystemInstructionsEditor />
                </div>
            </Container>
        </Layout >
    );
};

// Sub-component for System Instructions
const SystemInstructionsEditor = () => {
  const c = useCopy();
    const [prompt, setPrompt] = useState("");
    const [changeNote, setChangeNote] = useState("");
    const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // @ts-ignore
    const versions = useQuery(api.sara.listPromptVersions);
    const submitPrompt = useMutation(api.sara.submitPromptVersion);
    const reviewPrompt = useMutation(api.sara.reviewPromptVersion);
    const approvedVersion = versions?.find((item) => item.status === "approved");
    const currentPrompt = approvedVersion?.prompt ?? "";

    // Load initial prompt
    useEffect(() => {
        if (currentPrompt !== undefined) {
            setPrompt(currentPrompt || "");
        }
    }, [currentPrompt]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await submitPrompt({ prompt, changeNote });
            toast.success("Prompt submitted for independent approval."); setChangeNote("");
        } catch (error) {
            toast.error("Failed to update instructions.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mt-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{c("System Instructions")}</h2>
                    <p className="text-gray-500 text-sm">{c("Submit versioned instructions. A different administrator must approve them before use.")}</p>
                </div>
            </div>

            <div className="mb-5 rounded-xl border bg-gray-50 p-4 text-sm" data-testid="saada-prompt-preview">
                <LoadingText as="p" className="font-semibold">{versions === undefined ? 'Loading active instruction status…' : approvedVersion ? `Active custom prompt: version ${approvedVersion.version}` : `Active application default: ${SAADA_PROMPT_VERSION}`}</LoadingText>
                <p className="mt-1 text-gray-600">{c("One agent uses workflow skills, approved knowledge and authorized tools. The application always adds evidence, privacy and action limits. Retrieved context and conversation history change for each question.")}</p>
                {versions !== undefined && <details className="mt-3"><summary className="cursor-pointer underline">{c("Read the current system instructions")}</summary><pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-4 text-xs">{buildSaadaSystemPrompt({approvedPrompt: currentPrompt, locale: 'en', context: '[Approved reference passages are inserted for each question.]', confidenceWarning: '[Evidence confidence is inserted for each question.]'})}</pre></details>}
            </div>
            <textarea
                aria-label={c("Proposed system instructions")}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={c("You are Haki Yangu AI, a helpful legal assistant...")}
                className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm leading-relaxed resize-y mb-4"
            />
            {!currentPrompt && <Button variant="outline" className="mb-4" onClick={() => setPrompt(SAADA_DEFAULT_PROMPT)}>{c("Use application default as a draft")}</Button>}
            <input value={changeNote} onChange={(e) => setChangeNote(e.target.value)} placeholder={c("Why this prompt is changing (10+ characters)")} className="mb-4 w-full rounded-lg border px-3 py-2" />

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading || prompt.length < 100 || changeNote.trim().length < 10}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <BrandLoadingIcon size={18}/>
                    ) : (
                        <Save className="w-4 h-4" />
                    )}{c("Submit for approval")}</button>
            </div>
            <div className="mt-6 space-y-3">{versions?.map((version) => <div key={version._id} className="rounded-xl border p-4 text-sm"><div className="flex justify-between"><strong>{c("Version ")}{version.version}</strong><span>{version.status}</span></div><p className="mt-1 text-gray-600">{version.changeNote}</p>{version.status === "pending" && <div className="mt-3 flex gap-2"><input value={reviewNotes[version._id] ?? ""} onChange={(e) => setReviewNotes({ ...reviewNotes, [version._id]: e.target.value })} placeholder={c("Independent review reason")} className="flex-1 rounded-lg border px-3 py-2" /><Button variant="outline" disabled={(reviewNotes[version._id]?.trim().length ?? 0) < 10} onClick={() => void reviewPrompt({ id: version._id, decision: "approved", reviewNote: reviewNotes[version._id] })}>{c("Approve")}</Button><Button variant="outline" disabled={(reviewNotes[version._id]?.trim().length ?? 0) < 10} onClick={() => void reviewPrompt({ id: version._id, decision: "rejected", reviewNote: reviewNotes[version._id] })}>{c("Reject")}</Button></div>}</div>)}</div>
        </div>
    );
};

const DocumentList = () => {
  const statusLabel = useStatusLabel();
  const readError = usePlainError();
  const c = useCopy();
    const [sourceStatus, setSourceStatus] = useState<"pending" | "approved" | "due" | "history">("pending");
    const documentPage = usePaginatedQuery(api.sara.listDocumentsPage, { status: sourceStatus }, { initialNumItems: 20 });
    const documents = documentPage.results;
    const withdrawDocument = useMutation(api.sara.withdrawDocument);
    const reviewDocument = useMutation(api.sara.reviewDocument);
    const retryDocumentIndex = useAction(api.sara_actions.retryDocumentIndex);
    const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
    const [withdrawReasons, setWithdrawReasons] = useState<Record<string, string>>({});
    const [reviewingId, setReviewingId] = useState<string | null>(null);

    const handleReview = async (id: any, decision: "approved" | "rejected") => {
        setReviewingId(id);
        try {
            await reviewDocument({ id, decision, note: reviewNotes[id] || "" });
            toast.success(decision === "approved" ? "Source approved for Haki Yangu AI." : "Source rejected and excluded from Haki Yangu AI.");
        } catch (error) {
            toast.error(readError(error, "Review failed."));
        } finally { setReviewingId(null); }
    };
    const [changingId, setChangingId] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm mb-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{c("Knowledge Base")}</h2>
                    <p className="text-gray-500 text-sm">{c("Review provenance, indexing and expiry before approval. Withdraw outdated approved sources from future answers.")}</p>
                </div>
            </div>

            <label className="mb-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center">Source review queue<select aria-label="Source review queue" value={sourceStatus} onChange={event => setSourceStatus(event.target.value as typeof sourceStatus)} className="min-w-0 rounded-lg border px-3 py-2"><option value="pending">Awaiting independent review</option><option value="approved">Approved sources</option><option value="due">Reviews due within 30 days</option><option value="history">Rejected, withdrawn and legacy records</option></select></label>
            {documentPage.status === "LoadingFirstPage" ? <BrandLoading compact text={c("Loading Haki Yangu AI sources…")} /> : documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">{c("No documents found. Upload one above!")}</div>
            ) : (
                <div className="grid items-start gap-4 lg:grid-cols-2">
                    {documents.map((doc: any) => (
                        <div key={doc._id} className="resource-management-card rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-primary/30">
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="resource-management-title text-gray-900">{doc.title}</h4>
                                    <p className="mt-1 text-xs text-gray-500">{c("Uploaded ")}{new Date(doc.uploadedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                <span className={`rounded-full px-2 py-1 font-medium ${doc.approvalStatus === "approved" ? "bg-green-50 text-green-800" : doc.approvalStatus === "rejected" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-800"}`}>{statusLabel(doc.approvalStatus) || "Needs legacy review"}</span>
                                <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">{c("Index: ")}{doc.indexingStatus || "Unknown"}</span>
                            </div>
                            <div className="resource-management-links mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-primary">
                                {doc.sourcePdfUrl && <a href={doc.sourcePdfUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{c("Open source PDF for review")}</a>}
                                {doc.sourceUrl && <a href={doc.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{c("Open publisher source")}</a>}
                            </div>
                            <details className="mt-4 border-t border-gray-100 pt-3">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700">Review and manage</summary>
                            <div className="resource-management-metadata mt-4 grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
                                <p>{c("Publisher: ")}{doc.publisher || "Not recorded"}</p><p>{c("Jurisdiction: ")}{statusLabel(doc.jurisdiction) || "Not recorded"}</p>
                                <p>{c("Language: ")}{doc.language || "Not recorded"}{c(" · Version: ")}{doc.versionLabel || "Not recorded"}</p>
                                <p>{c("Review due: ")}{doc.reviewDueAt ? new Date(doc.reviewDueAt).toLocaleDateString("en-TZ") : "Not recorded"}</p>
                                <p>{c("Index: ")}{doc.indexingStatus || "Unknown"}</p>
                                {doc.replacesDocumentId && <p>{c("Replacement of an earlier source")}</p>}
                            </div>
                            {doc.approvalStatus === "pending" && doc.indexingStatus === "ready" && <SourceMetadataEditor source={doc} />}
                            {doc.indexingError && <p role="alert" className="mt-2 text-xs text-red-700">{c("Indexing error: ")}{doc.indexingError}</p>}
                            {doc.reviewNote && <p className="mt-2 text-xs text-gray-600">{c("Last review reason: ")}{doc.reviewNote}</p>}
                            {doc.approvalStatus === "pending" && <div className="mt-3 flex flex-wrap gap-2"><input aria-label={`Review reason for ${doc.title}`} value={reviewNotes[doc._id] ?? ""} onChange={(event) => setReviewNotes((current) => ({ ...current, [doc._id]: event.target.value }))} placeholder={c("Record review reason (10+ characters)")} className="min-w-0 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /><Button variant="outline" disabled={reviewingId === doc._id || doc.indexingStatus !== "ready" || !doc.reviewDueAt || doc.reviewDueAt <= Date.now() || (reviewNotes[doc._id]?.trim().length ?? 0) < 10} onClick={() => void handleReview(doc._id, "approved")}>{c("Approve")}</Button><Button variant="outline" disabled={reviewingId === doc._id || (reviewNotes[doc._id]?.trim().length ?? 0) < 10} onClick={() => void handleReview(doc._id, "rejected")}>{c("Reject")}</Button></div>}
                            {canRetrySourceIndex(doc) && <Button className="mt-3" variant="outline" disabled={changingId === doc._id} onClick={async () => { setChangingId(doc._id); try { await retryDocumentIndex({ id: doc._id }); toast.success("Indexing completed; the source still needs independent approval."); } catch (error) { toast.error(readError(error, "Could not retry indexing.")); } finally { setChangingId(null); } }}>{isStalledSourceIndex(doc) ? c("Recover stalled indexing") : c("Retry indexing")}</Button>}
                            {doc.approvalStatus === "approved" && <div className="mt-4 flex flex-wrap gap-2"><input aria-label={`Withdrawal reason for ${doc.title}`} value={withdrawReasons[doc._id] ?? ""} onChange={event => setWithdrawReasons(current => ({ ...current, [doc._id]: event.target.value }))} placeholder={c("Reason to withdraw from answers (10+ characters)")} className="min-w-0 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /><Button variant="outline" disabled={changingId === doc._id || (withdrawReasons[doc._id]?.trim().length ?? 0) < 10} onClick={async () => { setChangingId(doc._id); try { await withdrawDocument({ id: doc._id, reason: withdrawReasons[doc._id].trim() }); toast.success("Source withdrawn from future Haki Yangu AI answers and retained for audit."); } catch (error) { toast.error(readError(error, "Could not withdraw source.")); } finally { setChangingId(null); } }}>{c("Withdraw source")}</Button></div>}
                            </details>
                        </div>
                    ))}
                </div>
            )}
            {(documentPage.status === "CanLoadMore" || documentPage.status === "LoadingMore") && <Button variant="outline" className="mt-4" disabled={documentPage.status === "LoadingMore"} onClick={() => documentPage.loadMore(20)}>{documentPage.status === "LoadingMore" ? "Loading sources…" : "Load more sources"}</Button>}
        </div>
    );
};

export default SaraTrain;
