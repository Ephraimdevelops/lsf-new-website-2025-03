import SourceUploadProgress, {type SourceUploadStage} from "../components/haki-yangu/SourceUploadProgress";
import {uploadSourcePdf} from "../lib/uploadSourcePdf";
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
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Settings, Save, Database, Plus, ArrowRight, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import ResearchPdfUpload from '../components/haki-yangu/ResearchPdfUpload';
import './SaraTrain.css';
import SourceMetadataEditor from '../components/haki-yangu/SourceMetadataEditor';
import { buildSaadaSystemPrompt, SAADA_DEFAULT_PROMPT, SAADA_PROMPT_VERSION } from '../../convex/lib/saadaPrompt';

const SaraTrain = () => {
  const readError = usePlainError();
  const c = useCopy();
    const [view,setView]=useState<"approved"|"pending"|"files"|"add"|"settings">("approved");
    const readiness=useQuery(api.sara.getReadiness);
    const [sourceSearch,setSourceSearch]=useState("");
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
    const [uploadStage,setUploadStage]=useState<SourceUploadStage|null>(null),[transferPercent,setTransferPercent]=useState<number|null>(null),[uploadTitle,setUploadTitle]=useState('');
    const [activeStorageId,setActiveStorageId]=useState<Id<'_storage'>|null>(null);
    const uploadStatus=useQuery(api.sara.myUploadStatus,activeStorageId?{storageId:activeStorageId}:'skip');
    useEffect(()=>{if(uploadStatus?.stage)setUploadStage(uploadStatus.stage);},[uploadStatus?.stage]);
    const [source, setSource] = useState({ sourceType:"legal_reference",publicationStatus:"unknown",reportingPeriod:"",title: "", publisher: "", sourceUrl: "", jurisdiction: "national", language: "bilingual", contentCategory: "Law / legal guidance", versionLabel: "", effectiveDate: "", reviewDate: "" });
    function prepareStoredResearch(row: PreparedResearchRow) {
        setView("add");
        const candidate = JSON.parse(row.provenance).candidate ?? {};
        setStoredResearch({ id: row._id, storageId: row.canReuseIndexingCopy ? row.indexingStorageId ?? row.storageId : row.storageId, filename: row.filename, url: row.url, sha256: row.sha256, byteSize: row.byteSize, needsSecurityScan: !row.canReuseIndexingCopy });
        setFile(null); uploadedFile.current = null;
        setSource({sourceType:"legal_reference",publicationStatus:"unknown",reportingPeriod:"",title: row.title, publisher: typeof candidate.publisher === 'string' ? candidate.publisher : '', sourceUrl: typeof candidate.sourceUrl === 'string' ? candidate.sourceUrl : '', jurisdiction: ['tanzania_mainland', 'zanzibar', 'national'].includes(candidate.approvedJurisdiction) ? candidate.approvedJurisdiction : 'other', language: ['sw', 'en', 'bilingual'].includes(candidate.observedLanguage) ? candidate.observedLanguage : 'other', contentCategory: typeof candidate.topicDraft === 'string' ? candidate.topicDraft : 'Law / legal guidance', versionLabel: typeof candidate.versionLabelDraft === 'string' ? candidate.versionLabelDraft.slice(0, 80) : '', effectiveDate: '', reviewDate: '' });
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
            uploadedFile.current=null;setUploadStage(null);setActiveStorageId(null);
            setStoredResearch(null);
            setSource((current) => ({ ...current, title: selected.name.replace(/\.pdf$/i, ""),...(/LSF|annual.*report|fact.*sheet|capability|midterm|strategic.*approach/i.test(selected.name)?{sourceType:"lsf_knowledge",publicationStatus:/draft/i.test(selected.name)?"draft":"unknown"}:{}) }));
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
        setIsUploading(true);setUploadTitle(source.title.trim());setTransferPercent(0);setUploadStage("uploading");setActiveStorageId(null);
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
                storageId = await uploadSourcePdf(postUrl,fileToUpload,state=>{setTransferPercent(state.percent);setUploadStage(state.phase);}) as Id<'_storage'>;
                uploadedFile.current = { file: fileToUpload, metadata, storageId };
                if (storedResearch) {
                    await linkIndexingCopy({ id: storedResearch.id, storageId });
                    setStoredResearch({ ...storedResearch, storageId, needsSecurityScan: false });
                }
            }

            // 3. Process Document (Parse + Embed)
            setActiveStorageId(storageId);setUploadStage("extracting");
            setProgress("Extracting text and indexing for independent review...");
            const ingestion = {
                sourceType:source.sourceType as "legal_reference"|"lsf_knowledge",publicationStatus:source.publicationStatus as "published"|"draft"|"unknown",reportingPeriod:source.reportingPeriod.trim()||undefined,
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
            await ingestDocument(ingestion);setUploadStage("review");

            toast.success("Source uploaded. It will stay out of Haki Yangu AI answers until a different administrator approves it.");
            uploadedFile.current = null;
            setFile(null);
            setStoredResearch(null);
            setProgress("");
        } catch (error) {
            console.error(error);
            const errorMessage = readError(error, "Unknown error");
            toast.error(`Source ingestion failed: ${errorMessage}`);
            setProgress(`Error: ${errorMessage}`);setUploadStage("failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Layout>
            <Container className="ai-resource-hub py-6">
                <header className="resource-hub-heading"><div><p className="resource-hub-eyebrow">Haki Yangu AI</p><h1>AI resources</h1><p>Manage the information the assistant uses to help people.</p></div><Button disabled={isUploading} onClick={()=>setView("add")} className="gap-2"><Plus className="h-4 w-4"/>Add a document</Button></header>
                <SaadaReadiness />
                {uploadStage&&<SourceUploadProgress title={uploadTitle} stage={uploadStage} transferPercent={transferPercent} approvalStatus={uploadStatus&&'approvalStatus' in uploadStatus?uploadStatus.approvalStatus:undefined} completed={uploadStatus&&'indexingCompletedChunks' in uploadStatus?uploadStatus.indexingCompletedChunks:undefined} total={uploadStatus&&'indexingTotalChunks' in uploadStatus?uploadStatus.indexingTotalChunks:undefined} error={progress.startsWith('Error:')?progress.slice(7):undefined} onReview={()=>{setSourceSearch(uploadTitle);setView('pending');}}/>}
                <nav className="resource-hub-tabs" aria-label="Resource sections">{([{id:'approved',label:'Ready for AI',count:readiness?.approvedCurrentSourceDocuments},{id:'pending',label:'Needs review',count:readiness?.pendingSourceDocuments},{id:'files',label:'Saved files'},{id:'settings',label:'AI settings'}] as const).map(tab=><button key={tab.id} type="button" aria-current={view===tab.id?'page':undefined} onClick={()=>setView(tab.id)}>{tab.label}{'count' in tab&&tab.count!==undefined&&<span>{tab.count}</span>}</button>)}</nav>
                <div className="resource-hub-panel">
                    {view==='files'&&<><div className="resource-hub-section-heading"><h2>Saved files</h2><p>Keep original research PDFs here. Saving a file does not make it available to the AI.</p></div><ResearchPdfUpload onPrepare={prepareStoredResearch}/><details className="resource-hub-advanced"><summary>Removed or rejected documents</summary><DocumentList initialStatus="history"/></details></>}
                    {view==='add'&&<div className="resource-hub-upload"><div className="resource-hub-section-heading"><h2>Add a document</h2><p>Add the PDF and its source details. Word files need a PDF copy first. A different administrator reviews the document before the AI can use it.</p></div>
                    {(recoverableUploads.length > 0 || uploadPage.status === "CanLoadMore" || uploadPage.status === "LoadingMore") && <details className="my-6 rounded-xl border bg-slate-50 p-4" aria-label={c("Recover uploaded sources")}><summary className="cursor-pointer text-sm font-medium">Resume an interrupted upload</summary>

                        <p className="mt-1 text-sm">{c("If an upload was interrupted, finish it here. The document still needs review.")}</p>
                        {recoverableUploads.map((receipt) => <div key={receipt._id} className="mt-4 rounded-lg border bg-white p-3">
                            <div className="flex flex-wrap items-center justify-between gap-3"><span>{receipt.metadata.title} · {receipt.metadata.versionLabel}</span><Button disabled={isUploading || receipt.metadata.reviewDueAt <= Date.now()} variant="outline" onClick={async () => { setIsUploading(true); setProgress("Resuming saved PDF ingestion..."); try { await ingestDocument({ storageId: receipt.storageId, ...receipt.metadata }); setProgress(""); toast.success("Source indexed for independent review."); } catch (error) { toast.error(readError(error, "Could not resume ingestion.")); } finally { setIsUploading(false); } }}>{c("Resume ingestion")}</Button></div>
                            {receipt.metadata.reviewDueAt <= Date.now() && <div className="mt-3 space-y-2"><p className="text-sm text-amber-800">{c("The review date has expired. Correct it with a reason before resuming. This does not approve the source.")}</p><label className="block text-sm">{c("New review date")}<input type="date" disabled={isUploading} value={corrections[receipt._id]?.date ?? ""} onChange={e => setCorrections(current => ({ ...current, [receipt._id]: { reason: current[receipt._id]?.reason ?? "", date: e.target.value } }))} className="ml-2 rounded border p-2" /></label><input aria-label={`Correction reason for ${receipt.metadata.title}`} placeholder={c("Why is the review date changing?")} value={corrections[receipt._id]?.reason ?? ""} disabled={isUploading} onChange={e => setCorrections(current => ({ ...current, [receipt._id]: { date: current[receipt._id]?.date ?? "", reason: e.target.value } }))} className="w-full rounded border p-2" /><Button variant="outline" disabled={isUploading || !corrections[receipt._id]?.date || (corrections[receipt._id]?.reason.trim().length ?? 0) < 10} onClick={async () => { const correction = corrections[receipt._id]; const reviewDueAt = Date.parse(`${correction.date}T12:00:00+03:00`); if (!Number.isFinite(reviewDueAt) || new Date(reviewDueAt).toISOString().slice(0, 10) !== correction.date) { toast.error("Enter a valid review date."); return; } setIsUploading(true); try { await correctReviewDate({ id: receipt._id, reviewDueAt, reason: correction.reason }); toast.success("Review date corrected and recorded in the audit log."); } catch (error) { toast.error(readError(error, "Could not correct review date.")); } finally { setIsUploading(false); } }}>{c("Save review-date correction")}</Button></div>}
                        </div>)}
                        {uploadPage.status === "CanLoadMore" || uploadPage.status === "LoadingMore" ? <Button className="mt-4" variant="outline" disabled={uploadPage.status === "LoadingMore"} onClick={() => uploadPage.loadMore(20)}>{uploadPage.status === "LoadingMore" ? "Loading older uploads…" : c("Load older uploads")}</Button> : null}
                    </details>}

                    {/* Upload Section */}
                    <div className="mb-6">
                        <h3 className="resource-hub-form-step">1. Choose a PDF</h3>
                        <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${isUploading ? 'border-primary/50 bg-primary/5' : 'border-gray-200 hover:border-primary hover:bg-gray-50 hover:shadow-lg'}`}>
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
                                        {file ? "Ready to upload" : storedResearch ? "The original is preserved. Older files pass through security scanning before indexing; review metadata below." : "PDF only, up to 15MB"}
                                    </p>
                                </div>
                            </label>
                        </div>

                        <h3 className="resource-hub-form-step">2. Add the source details</h3>
                        <div className="grid gap-3 sm:grid-cols-2 mb-5">
                            <label className="text-sm text-gray-600">Use of this source<select aria-label="Use of this source" disabled={isUploading} value={source.sourceType} onChange={e=>setSource({...source,sourceType:e.target.value})} className="mt-1 w-full rounded-lg border px-3 py-2"><option value="legal_reference">Law and legal guidance</option><option value="lsf_knowledge">LSF information, reports and statistics</option></select></label>
                            {source.sourceType==='lsf_knowledge'&&<><label className="text-sm text-gray-600">Publication status<select aria-label="Publication status" disabled={isUploading} value={source.publicationStatus} onChange={e=>setSource({...source,publicationStatus:e.target.value})} className="mt-1 w-full rounded-lg border px-3 py-2"><option value="unknown">Not confirmed — reviewer to check</option><option value="draft">Draft — not for public AI answers</option><option value="published">Authorised published version</option></select></label><label className="text-sm text-gray-600">Reporting year or period<input aria-label="Reporting year or period" maxLength={80} disabled={isUploading} value={source.reportingPeriod} onChange={e=>setSource({...source,reportingPeriod:e.target.value})} placeholder="For example: 2025 or 2016–2020" className="mt-1 w-full rounded-lg border px-3 py-2"/></label><p className="self-center text-xs text-gray-500">Figures describe the period in this report. Older reports are historical references, not current totals. Drafts remain outside public AI answers.</p></>}
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
                        {(file||storedResearch)&&!isUploading&&(!source.title.trim()||!source.publisher.trim()||!source.contentCategory.trim()||!source.versionLabel.trim()||!source.reviewDate)&&<p role="status" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-950">Complete these required details to enable uploading: {[!source.title.trim()&&'title',!source.publisher.trim()&&'publisher',!source.contentCategory.trim()&&'category',!source.versionLabel.trim()&&'edition / version',!source.reviewDate&&'review due date'].filter(Boolean).join(', ')}.</p>}
                        {(file || storedResearch) && !isUploading && (
                            <div className="mt-6 flex justify-center">
                                <Button
                                    onClick={handleUpload}
                                    disabled={!source.title.trim() || !source.publisher.trim() || !source.contentCategory.trim() || !source.versionLabel.trim() || !source.reviewDate}
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-white px-8"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    {storedResearch ? 'Prepare saved PDF for review' : c("Upload for review")}
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
                    </div>}
                    {(view==='approved'||view==='pending')&&<><div className="resource-hub-section-heading"><div><h2>{view==='approved'?'Ready for AI':'Needs review'}</h2><p>{view==='approved'?'Approved documents. The AI uses those with current review dates; manage outdated sources here.':'Open a document, check the highlighted issues, then record your review decision.'}</p></div><input aria-label="Search documents" placeholder="Search documents" value={sourceSearch} onChange={e=>setSourceSearch(e.target.value)} className="resource-hub-search"/></div><DocumentList key={view} initialStatus={view} search={sourceSearch}/></>}
                    {view==='settings'&&<><div className="resource-hub-section-heading"><h2>AI settings</h2><p>Change how the assistant behaves. These settings do not add legal knowledge.</p></div><Link className="resource-hub-text-link" to="/dashboard/saada-evaluations">Check answer quality <ArrowRight className="h-4 w-4"/></Link><details className="resource-hub-advanced"><summary>Advanced: assistant instructions</summary><SystemInstructionsEditor/></details></>}

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

const DocumentList = ({initialStatus="approved",search=""}:{initialStatus?:"approved"|"pending"|"history";search?:string}) => {
    const batchReview = useAction(api.sara_actions.reviewDocuments);
    const [selectedSources,setSelectedSources]=useState<string[]>([]);
    const [batchNote,setBatchNote]=useState('');
    const [batchBusy,setBatchBusy]=useState(false);
    const [batchResults,setBatchResults]=useState<Array<{id:string;approved:boolean;reason?:string}>>([]);

  const statusLabel = useStatusLabel();
  const readError = usePlainError();
  const c = useCopy();
    const [sourceStatus, setSourceStatus] = useState<"pending" | "approved" | "due" | "history">(initialStatus);
    const documentPage = usePaginatedQuery(api.sara.listDocumentsPage, { status: sourceStatus,search:search.trim()||undefined }, { initialNumItems: 20 });
    const documents = documentPage.results;
    useEffect(()=>setSelectedSources([]),[search,sourceStatus]);
    const withdrawDocument = useMutation(api.sara.withdrawDocument);
    const reviewDocument = useMutation(api.sara.reviewDocument);
    const flagDocument = useMutation(api.sara.flagDocument);
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
        <div className="mb-8">
            {initialStatus==='approved'&&<label className="mb-4 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center">Review dates<select aria-label="Source review queue" value={sourceStatus} onChange={event => setSourceStatus(event.target.value as typeof sourceStatus)} className="min-w-0 rounded-lg border px-3 py-2"><option value="approved">All approved documents</option><option value="due">Review due within 30 days</option></select></label>}
            {sourceStatus === 'pending' && !!selectedSources.length && <div className="mb-5 rounded-xl border border-rose-100 bg-rose-50/40 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3"><strong className="text-sm">{selectedSources.length} selected</strong><div className="flex gap-3"><button className="text-sm underline" onClick={()=>setSelectedSources(documents.slice(0,50).map(x=>x._id))}>Select these documents (up to 50)</button><button className="text-sm underline" onClick={()=>setSelectedSources([])}>Clear</button></div></div>
              <p className="text-xs text-slate-600">Use one review note for the documents you have reviewed. Each source keeps its own reviewer and audit entry. Indexing, provenance, expiry, OCR and independent-review checks still apply; blocked sources stay pending.</p>
              <label className="block text-sm">Review note<textarea className="mt-1 w-full rounded-lg border p-2" rows={2} maxLength={2000} value={batchNote} onChange={e=>setBatchNote(e.target.value)} placeholder="What did you review and confirm for these selected sources?"/></label>
              {selectedSources.some(id=>documents.find(d=>d._id===id)?.approvalBlockers?.length)&&<p className="text-xs text-amber-900">Some selected documents still have approval blockers. Open Review document to see what to fix. Only eligible documents can be approved.</p>}
              <Button disabled={batchBusy||!selectedSources.some(id=>!documents.find(d=>d._id===id)?.approvalBlockers?.length)||batchNote.trim().length<10} onClick={async()=>{setBatchBusy(true);try{const results=await batchReview({ids:selectedSources.filter(id=>!documents.find(d=>d._id===id)?.approvalBlockers?.length) as Id<'documents'>[],note:batchNote});setBatchResults(results);setSelectedSources([]);toast.success(`${results.filter(x=>x.approved).length} approved; ${results.filter(x=>!x.approved).length} need attention.`);}catch(error){toast.error(readError(error,'Batch review failed.'));}finally{setBatchBusy(false);}}}>{batchBusy?'Reviewing selected sources…':'Approve reviewed selection'}</Button>
              {!!batchResults.length&&<div role="status" className="text-sm"><p>{batchResults.filter(x=>x.approved).length} approved · {batchResults.filter(x=>!x.approved).length} blocked</p><details className="mt-2"><summary className="cursor-pointer text-sm font-medium">View blocked sources and reasons</summary><ul className="mt-2 space-y-1">{batchResults.filter(x=>!x.approved).map(x=><li key={x.id}>{documents.find(d=>d._id===x.id)?.title||x.id}: {x.reason}</li>)}</ul></details></div>}
            </div>}
            {documentPage.status === "LoadingFirstPage" ? <BrandLoading compact text={c("Loading Haki Yangu AI sources…")} /> : documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">{c("No documents match this view.")}</div>
            ) : (
                <div className="grid items-start gap-4">
                    {documents.map((doc: any) => (
                        <div key={doc._id} className="resource-management-card resource-horizontal rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-primary/30">
                            <div className="flex items-start gap-3">
                                {sourceStatus==='pending'&&<input aria-label={`Select ${doc.title}`} className="mt-2 h-4 w-4" type="checkbox" checked={selectedSources.includes(doc._id)} disabled={batchBusy} onChange={e=>setSelectedSources(current=>e.target.checked?[...current,doc._id].slice(0,50):current.filter(id=>id!==doc._id))}/>}
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="resource-management-title text-gray-900">{doc.title}</h4>
                                    <p className="mt-1 text-xs text-gray-500">{doc.approvalStatus==="approved"?`Review by ${doc.reviewDueAt?new Date(doc.reviewDueAt).toLocaleDateString():"date needed"}`:`Added ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                <span className={`rounded-full px-2 py-1 font-medium ${doc.approvalStatus === "approved" ? "bg-green-50 text-green-800" : doc.approvalStatus === "rejected" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-800"}`}>{doc.approvalStatus==="approved"&&(doc.reviewDueAt??0)<=Date.now()?"Review expired · unavailable to AI":doc.approvalStatus==="pending"?"Needs review":doc.approvalStatus==="withdrawn"?"Removed":statusLabel(doc.approvalStatus) || "Needs review"}</span>
                                {doc.sourceType==="lsf_knowledge"&&<span className="rounded-full bg-blue-50 px-2 py-1 text-blue-800">LSF knowledge · {doc.publicationStatus??"publication to check"}{doc.reportingPeriod?` · ${doc.reportingPeriod}`:""}</span>}
                                {doc.indexingStatus==="processing"&&doc.indexingTotalChunks&&<span className="rounded-full bg-blue-50 px-2 py-1 text-blue-800">Indexing {Math.min(100,Math.floor((doc.indexingCompletedChunks??0)/doc.indexingTotalChunks*100))}% · {doc.indexingCompletedChunks??0}/{doc.indexingTotalChunks} parts</span>}
                                {doc.indexingStatus!=="ready"&&<span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">{doc.indexingStatus==="processing"?"Preparing document":"Processing needs attention"}</span>}
                            </div>
                            {!!doc.curationFlags?.length&&<p className="resource-hub-flag-summary">{doc.curationFlags.length} review issues · {doc.curationFlags[0]}</p>}
                            <div className="resource-management-links mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-primary">
                                {doc.sourcePdfUrl && <a href={doc.sourcePdfUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{c("Open source PDF for review")}</a>}
                                {doc.sourceUrl && <a href={doc.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{c("Open publisher source")}</a>}
                            </div>
                            <details className="mt-4 border-t border-gray-100 pt-3">
                            <summary className="inline-flex min-h-10 cursor-pointer items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">{doc.approvalStatus==="pending"?"Review document":"Manage document"}</summary>
                            {!!doc.curationFlags?.length&&<div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-950"><strong>Resolve these issues</strong><ul className="mt-2 list-disc pl-4">{doc.curationFlags.map((flag:string)=><li key={flag}>{flag}</li>)}</ul><p className="mt-2">{doc.curationNote}</p></div>}
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
                            {doc.approvalStatus==="pending"&&!!doc.approvalBlockers?.length&&<div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950" role="status"><strong>Not ready to approve yet</strong><ul className="mt-2 list-disc space-y-1 pl-4">{doc.approvalBlockers.map((reason:string)=><li key={reason}>{reason}</li>)}</ul><p className="mt-2">Correct the source details and review issues below. If you uploaded this file, another administrator must make the final decision.</p></div>}
                            {doc.approvalStatus === "pending" && <div className="mt-3 flex flex-wrap gap-2"><input aria-label={`Review reason for ${doc.title}`} value={reviewNotes[doc._id] ?? ""} onChange={(event) => setReviewNotes((current) => ({ ...current, [doc._id]: event.target.value }))} placeholder={c("Record review reason (10+ characters)")} className="min-w-0 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /><Button variant="outline" disabled={!!doc.approvalBlockers?.length || reviewingId === doc._id || doc.indexingStatus !== "ready" || !doc.reviewDueAt || doc.reviewDueAt <= Date.now() || (reviewNotes[doc._id]?.trim().length ?? 0) < 10} onClick={() => void handleReview(doc._id, "approved")}>{c("Approve")}</Button><Button variant="outline" disabled={doc.uploaderIsCurrentUser || reviewingId === doc._id || (reviewNotes[doc._id]?.trim().length ?? 0) < 10} onClick={() => void handleReview(doc._id, "rejected")}>{c("Reject")}</Button></div>}
                            {doc.approvalStatus === "pending" && !!doc.curationFlags?.length && <Button variant="outline" className="mt-3" disabled={changingId===doc._id||(reviewNotes[doc._id]?.trim().length??0)<10} onClick={async()=>{setChangingId(doc._id);try{await flagDocument({id:doc._id,flags:[],note:reviewNotes[doc._id].trim()});toast.success("Curation flags resolved. Independent source approval is still required.");}catch(error){toast.error(readError(error,"Could not resolve flags."));}finally{setChangingId(null);}}}>Resolve curation flags using review note</Button>}
                            {canRetrySourceIndex(doc) && <Button className="mt-3" variant="outline" disabled={changingId === doc._id} onClick={async () => { setChangingId(doc._id); try { await retryDocumentIndex({ id: doc._id }); toast.success("Indexing completed; the source still needs independent approval."); } catch (error) { toast.error(readError(error, "Could not retry indexing.")); } finally { setChangingId(null); } }}>{isStalledSourceIndex(doc) ? c("Recover stalled indexing") : c("Retry indexing")}</Button>}
                            {["pending","approved"].includes(doc.approvalStatus) && <div className="mt-4 flex flex-wrap gap-2"><input aria-label={`Withdrawal reason for ${doc.title}`} value={withdrawReasons[doc._id] ?? ""} onChange={event => setWithdrawReasons(current => ({ ...current, [doc._id]: event.target.value }))} placeholder={c("Reason to withdraw from answers (10+ characters)")} className="min-w-0 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /><Button variant="outline" disabled={changingId === doc._id || (withdrawReasons[doc._id]?.trim().length ?? 0) < 10} onClick={async () => { setChangingId(doc._id); try { await withdrawDocument({ id: doc._id, reason: withdrawReasons[doc._id].trim() }); toast.success("Source withdrawn from future Haki Yangu AI answers and retained for audit."); } catch (error) { toast.error(readError(error, "Could not withdraw source.")); } finally { setChangingId(null); } }}>{c("Withdraw source")}</Button></div>}
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
