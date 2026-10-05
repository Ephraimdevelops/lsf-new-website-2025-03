import { useState, useEffect, useRef } from "react";
import { useMutation, useAction, useQuery } from "convex/react";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import Layout from "../components/layout/Layout";
import Container from "../components/shared/Container";
import { Button } from "../components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Settings, Save, Database } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const SaraTrain = () => {
    const generateUploadUrl = useMutation(api.sara.generateUploadUrl);
    const ingestDocument = useAction(api.sara_actions.ingestDocument);

    const uploadedFile = useRef<{ file: File; metadata: string; storageId: Id<"_storage"> } | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState("");
    const [source, setSource] = useState({ title: "", publisher: "", sourceUrl: "", jurisdiction: "national", language: "bilingual", contentCategory: "Law / legal guidance", versionLabel: "", effectiveDate: "", reviewDate: "" });

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
            setSource((current) => ({ ...current, title: current.title || selected.name.replace(/\.pdf$/i, "") }));
            setProgress("");
        }
        // Reset input value to allow selecting the same file again if needed
        e.target.value = "";
    };

    const handleUpload = async () => {
        if (!file) return;

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
            let storageId = uploadedFile.current?.file === file && uploadedFile.current.metadata === metadata ? uploadedFile.current.storageId : undefined;
            if (!storageId) {
                const postUrl = await generateUploadUrl();
                setProgress("Uploading the source PDF...");
                const result = await fetch(postUrl, { method: "POST", headers: { "Content-Type": "application/pdf" }, body: file });
                if (!result.ok) throw new Error("Upload failed");
                const body = await result.json() as { storageId?: Id<"_storage"> };
                if (!body.storageId) throw new Error("Upload did not return a storage reference.");
                storageId = body.storageId;
                uploadedFile.current = { file, metadata, storageId };
            }

            // 3. Process Document (Parse + Embed)
            setProgress("Extracting text and indexing for independent review...");
            await ingestDocument({
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
            });

            toast.success("Source uploaded. It will stay out of Saada answers until a different administrator approves it.");
            uploadedFile.current = null;
            setFile(null);
            setProgress("");
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Source ingestion failed: ${errorMessage}`);
            setProgress(`Error: ${errorMessage}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Layout>
            <Container className="py-20">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-20"></div>
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                <img src="/sara-avatar-v2.png" alt="Saada" className="w-full h-full object-cover" />
                            </div>
                            <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Saada knowledge sources</h1>
                            <Link to="/dashboard/saada-evaluations" className="text-sm font-semibold text-primary underline">Open answer evaluations</Link>
                            <p className="text-gray-600 text-lg max-w-lg leading-relaxed">
                                Upload legal source PDFs with their provenance and edition for independent review.
                            </p>
                        </div>
                    </div>


                    <div className="bg-yellow-50 p-4 rounded-lg flex gap-3 text-sm text-yellow-800">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>
                            <strong>Review gate:</strong> Uploaded PDFs are parsed and indexed for review. Saada cannot use them in public answers until a different administrator approves the source.
                        </p>
                    </div>
                    {/* Upload Section */}
                    <div className="mb-12">
                        <div className="grid gap-3 sm:grid-cols-2 mb-5">
                            <label className="text-sm text-gray-600 sm:col-span-2">Source title *<input value={source.title} maxLength={180} disabled={isUploading} onChange={(e) => setSource({ ...source, title: e.target.value })} placeholder="Exact document title" className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
                            <input aria-label="Official publisher / authority" disabled={isUploading} value={source.publisher} onChange={(e) => setSource({ ...source, publisher: e.target.value })} placeholder="Official publisher / authority *" className="rounded-lg border px-3 py-2" />
                            <input aria-label="Official source URL" disabled={isUploading} value={source.sourceUrl} onChange={(e) => setSource({ ...source, sourceUrl: e.target.value })} placeholder="Official source URL (recommended)" className="rounded-lg border px-3 py-2" />
                            <select aria-label="Jurisdiction" disabled={isUploading} value={source.jurisdiction} onChange={(e) => setSource({ ...source, jurisdiction: e.target.value })} className="rounded-lg border px-3 py-2"><option value="national">National</option><option value="tanzania_mainland">Tanzania Mainland</option><option value="zanzibar">Zanzibar</option><option value="other">Other</option></select>
                            <select aria-label="Source language" disabled={isUploading} value={source.language} onChange={(e) => setSource({ ...source, language: e.target.value })} className="rounded-lg border px-3 py-2"><option value="bilingual">Kiswahili & English</option><option value="sw">Kiswahili</option><option value="en">English</option><option value="other">Other</option></select>
                            <input aria-label="Content category" disabled={isUploading} value={source.contentCategory} onChange={(e) => setSource({ ...source, contentCategory: e.target.value })} placeholder="Category *" className="rounded-lg border px-3 py-2" />
                            <input aria-label="Edition / version / gazette reference" disabled={isUploading} value={source.versionLabel} onChange={(e) => setSource({ ...source, versionLabel: e.target.value })} placeholder="Edition / version / gazette reference *" className="rounded-lg border px-3 py-2" />
                            <label className="text-sm text-gray-600">Effective date<input type="date" value={source.effectiveDate} onChange={(e) => setSource({ ...source, effectiveDate: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
                            <label className="text-sm text-gray-600">Review due *<input type="date" value={source.reviewDate} onChange={(e) => setSource({ ...source, reviewDate: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
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
                                        {file ? file.name : "Choose a source PDF"}
                                    </h3>
                                    <p className="text-gray-500">
                                        {file ? "Ready to ingest" : "PDF only, up to 15MB"}
                                    </p>
                                </div>
                            </label>
                        </div>

                        {file && !isUploading && (
                            <div className="mt-6 flex justify-center">
                                <Button
                                    onClick={handleUpload}
                                    disabled={!source.title.trim() || !source.publisher.trim() || !source.contentCategory.trim() || !source.versionLabel.trim() || !source.reviewDate}
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-white px-8"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Upload for review
                                </Button>
                            </div>
                        )}

                        {isUploading && (
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-primary font-medium justify-center">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="animate-pulse">{progress}</span>
                                </div>
                                <p className="text-center text-sm text-gray-500">Keep this page open. Indexing time depends on the document size.</p>
                            </div>
                        )}
                    </div>

                    {!isUploading && progress.startsWith("Error:") && <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">{progress} Check the source list below before retrying: an interrupted response may still have created a record.</p>}
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
    const [prompt, setPrompt] = useState("");
    const [changeNote, setChangeNote] = useState("");
    const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // @ts-ignore
    const versions = useQuery(api.sara.listPromptVersions);
    const submitPrompt = useMutation(api.sara.submitPromptVersion);
    const reviewPrompt = useMutation(api.sara.reviewPromptVersion);
    const currentPrompt = versions?.find((item) => item.status === "approved")?.prompt ?? "";

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
                    <h2 className="text-xl font-bold text-gray-900">System Instructions</h2>
                    <p className="text-gray-500 text-sm">Submit versioned instructions. A different administrator must approve them before use.</p>
                </div>
            </div>

            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="You are Saada, a helpful legal assistant..."
                className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm leading-relaxed resize-y mb-4"
            />
            <input value={changeNote} onChange={(e) => setChangeNote(e.target.value)} placeholder="Why this prompt is changing (10+ characters)" className="mb-4 w-full rounded-lg border px-3 py-2" />

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading || prompt.length < 100 || changeNote.trim().length < 10}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Submit for approval
                </button>
            </div>
            <div className="mt-6 space-y-3">{versions?.map((version) => <div key={version._id} className="rounded-xl border p-4 text-sm"><div className="flex justify-between"><strong>Version {version.version}</strong><span>{version.status}</span></div><p className="mt-1 text-gray-600">{version.changeNote}</p>{version.status === "pending" && <div className="mt-3 flex gap-2"><input value={reviewNotes[version._id] ?? ""} onChange={(e) => setReviewNotes({ ...reviewNotes, [version._id]: e.target.value })} placeholder="Independent review reason" className="flex-1 rounded-lg border px-3 py-2" /><Button variant="outline" disabled={(reviewNotes[version._id]?.trim().length ?? 0) < 10} onClick={() => void reviewPrompt({ id: version._id, decision: "approved", reviewNote: reviewNotes[version._id] })}>Approve</Button><Button variant="outline" disabled={(reviewNotes[version._id]?.trim().length ?? 0) < 10} onClick={() => void reviewPrompt({ id: version._id, decision: "rejected", reviewNote: reviewNotes[version._id] })}>Reject</Button></div>}</div>)}</div>
        </div>
    );
};

const DocumentList = () => {
    const documents = useQuery(api.sara.getDocuments);
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
            toast.success(decision === "approved" ? "Source approved for Saada." : "Source rejected and excluded from Saada.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Review failed.");
        } finally { setReviewingId(null); }
    };
    const [changingId, setChangingId] = useState<string | null>(null);

    if (!documents) return <p role="status" className="mb-8 rounded-xl border bg-white p-5">Loading Saada sources…</p>;

    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Knowledge Base</h2>
                    <p className="text-gray-500 text-sm">Review provenance, indexing and expiry before approval. Withdraw outdated approved sources from future answers.</p>
                </div>
            </div>

            {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    No documents found. Upload one above!
                </div>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc: any) => (
                        <div key={doc._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-100 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-400">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                                    <p className="text-xs text-gray-500">
                                        Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 grid gap-1 text-xs text-gray-600 sm:grid-cols-2">
                                <p>Publisher: {doc.publisher || "Not recorded"}</p><p>Jurisdiction: {doc.jurisdiction?.replaceAll("_", " ") || "Not recorded"}</p>
                                <p>Language: {doc.language || "Not recorded"} · Version: {doc.versionLabel || "Not recorded"}</p>
                                <p>Review due: {doc.reviewDueAt ? new Date(doc.reviewDueAt).toLocaleDateString("en-TZ") : "Not recorded"}</p>
                                <p>Index: {doc.indexingStatus || "Unknown"}</p>
                                {doc.replacesDocumentId && <p>Replacement of an earlier source</p>}
                            </div>
                            {doc.indexingError && <p role="alert" className="mt-2 text-xs text-red-700">Indexing error: {doc.indexingError}</p>}
                            {doc.reviewNote && <p className="mt-2 text-xs text-gray-600">Last review reason: {doc.reviewNote}</p>}
                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                                <span className={`rounded-full px-3 py-1 font-bold ${doc.approvalStatus === "approved" ? "bg-green-100 text-green-800" : doc.approvalStatus === "rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{doc.approvalStatus ?? "Needs legacy review"}</span>
                                {doc.sourcePdfUrl && <a href={doc.sourcePdfUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Open source PDF for review</a>}
                                {doc.sourceUrl && <a href={doc.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Open publisher source</a>}
                            </div>
                            {doc.approvalStatus === "pending" && <div className="mt-3 flex flex-wrap gap-2"><input aria-label={`Review reason for ${doc.title}`} value={reviewNotes[doc._id] ?? ""} onChange={(event) => setReviewNotes((current) => ({ ...current, [doc._id]: event.target.value }))} placeholder="Record review reason (10+ characters)" className="min-w-64 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /><Button variant="outline" disabled={reviewingId === doc._id || doc.indexingStatus !== "ready" || !doc.reviewDueAt || doc.reviewDueAt <= Date.now() || (reviewNotes[doc._id]?.trim().length ?? 0) < 10} onClick={() => void handleReview(doc._id, "approved")}>Approve</Button><Button variant="outline" disabled={reviewingId === doc._id || (reviewNotes[doc._id]?.trim().length ?? 0) < 10} onClick={() => void handleReview(doc._id, "rejected")}>Reject</Button></div>}
                            {doc.approvalStatus === "pending" && doc.indexingStatus === "failed" && <Button className="mt-3" variant="outline" disabled={changingId === doc._id} onClick={async () => { setChangingId(doc._id); try { await retryDocumentIndex({ id: doc._id }); toast.success("Index retry started."); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not retry indexing."); } finally { setChangingId(null); } }}>Retry indexing</Button>}
                            {doc.approvalStatus === "approved" && <div className="mt-4 flex flex-wrap gap-2"><input aria-label={`Withdrawal reason for ${doc.title}`} value={withdrawReasons[doc._id] ?? ""} onChange={event => setWithdrawReasons(current => ({ ...current, [doc._id]: event.target.value }))} placeholder="Reason to withdraw from answers (10+ characters)" className="min-w-64 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" /><Button variant="outline" disabled={changingId === doc._id || (withdrawReasons[doc._id]?.trim().length ?? 0) < 10} onClick={async () => { setChangingId(doc._id); try { await withdrawDocument({ id: doc._id, reason: withdrawReasons[doc._id].trim() }); toast.success("Source withdrawn from future Saada answers and retained for audit."); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not withdraw source."); } finally { setChangingId(null); } }}>Withdraw source</Button></div>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SaraTrain;
