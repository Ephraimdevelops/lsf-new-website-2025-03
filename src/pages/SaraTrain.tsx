import { useState, useEffect } from "react";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Layout from "../components/layout/Layout";
import Container from "../components/shared/Container";
import { Button } from "../components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Settings, Save, Trash2, Database } from "lucide-react";
import { toast } from "sonner";

const SaraTrain = () => {
    const generateUploadUrl = useMutation(api.sara.generateUploadUrl);
    const ingestDocument = useAction(api.sara_actions.ingestDocument);

    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
        // Reset input value to allow selecting the same file again if needed
        e.target.value = "";
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setProgress("Initializing upload...");

        try {
            // 1. Get Upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload File
            setProgress("Uploading PDF to Saada's brain...");
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");
            const { storageId } = await result.json();

            // 3. Process Document (Parse + Embed)
            setProgress("Reading and memorizing content (this may take a minute)...");
            await ingestDocument({
                storageId,
                title: file.name,
            });

            toast.success("Document successfully added to Saada's knowledge base!");
            setFile(null);
            setProgress("");
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Training Failed: ${errorMessage}`);
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
                            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Train Saada</h1>
                            <p className="text-gray-600 text-lg max-w-lg leading-relaxed">
                                Upload verified legal documents (PDFs) to expand Saada's knowledge base and improve her accuracy.
                            </p>
                        </div>
                    </div>


                    <div className="bg-yellow-50 p-4 rounded-lg flex gap-3 text-sm text-yellow-800">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>
                            <strong>Note:</strong> Uploaded documents are immediately processed.
                            Text is extracted, chunked, and embedded into Saada's vector database.
                            She will use this knowledge to answer future questions.
                        </p>
                    </div>
                    {/* Upload Section */}
                    <div className="mb-12">
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
                                        {file ? file.name : "Drop PDF here or click to upload"}
                                    </h3>
                                    <p className="text-gray-500">
                                        {file ? "Ready to ingest" : "Supports official Legal PDFs up to 10MB"}
                                    </p>
                                </div>
                            </label>
                        </div>

                        {file && !isUploading && (
                            <div className="mt-6 flex justify-center">
                                <Button
                                    onClick={handleUpload}
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-white px-8"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Start Training
                                </Button>
                            </div>
                        )}

                        {isUploading && (
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-primary font-medium justify-center">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="animate-pulse">{progress}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full w-2/3 animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                        )}
                    </div>

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
    const [loading, setLoading] = useState(false);

    // @ts-ignore
    const currentPrompt = useQuery(api.sara.getConfig, { key: "system_prompt" });
    // @ts-ignore
    const updateConfig = useMutation(api.sara.updateConfig);

    // Load initial prompt
    useEffect(() => {
        if (currentPrompt !== undefined) {
            setPrompt(currentPrompt || "");
        }
    }, [currentPrompt]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateConfig({ key: "system_prompt", value: prompt });
            toast.success("Instructions updated successfully!");
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
                    <p className="text-gray-500 text-sm">Define Saada's personality and rules.</p>
                </div>
            </div>

            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="You are Saada, a helpful legal assistant..."
                className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm leading-relaxed resize-y mb-4"
            />

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading || prompt === currentPrompt}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Instructions
                </button>
            </div>
        </div>
    );
};

const DocumentList = () => {
    const documents = useQuery(api.sara.getDocuments);
    const deleteDocument = useMutation(api.sara.deleteDocument);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: any, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

        setDeletingId(id);
        try {
            await deleteDocument({ id });
            toast.success("Document removed from knowledge base.");
        } catch (error) {
            toast.error("Failed to delete document.");
        } finally {
            setDeletingId(null);
        }
    };

    if (!documents) return null; // Loading state handled by parent or transparent

    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Knowledge Base</h2>
                    <p className="text-gray-500 text-sm">Manage documents Saada has been trained on.</p>
                </div>
            </div>

            {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    No documents found. Upload one above!
                </div>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc: any) => (
                        <div key={doc._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-100 transition-all">
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
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(doc._id, doc.title)}
                                disabled={deletingId === doc._id}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                                {deletingId === doc._id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SaraTrain;
