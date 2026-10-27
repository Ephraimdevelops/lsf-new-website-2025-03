import { usePlainError } from "@/i18n/usePlainError";
import { useCopy } from "@/i18n/useCopy";
import { useLanguage } from "@/providers/LanguageProvider";
import { displayLabel } from "../../../shared/plainLanguage";
import { useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
async function scannedUpload(url: string, blob: Blob, progress: (value: number) => void): Promise<Id<"_storage">> {
 const response = await new Promise<string>((resolve, reject) => {
  const xhr = new XMLHttpRequest(); xhr.open("POST", url); xhr.setRequestHeader("Content-Type", blob.type.split(";")[0]); xhr.timeout = 120000;
  xhr.upload.onprogress = event => { if (event.lengthComputable) progress(Math.min(95, Math.round(event.loaded / event.total * 95))); };
  xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve(xhr.responseText) : reject(new Error("File was not accepted. Check its type and size, then try again."));
  xhr.onerror = xhr.ontimeout = () => reject(new Error("Upload interrupted. Check your connection and try again.")); xhr.send(blob);
 });
 const result = JSON.parse(response); if (!result.storageId) throw new Error("Upload was not confirmed."); progress(100); return result.storageId;
}
function documentMime(file: File) {
 const supported = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png", "image/webp"];
 if (file.type) return supported.includes(file.type) ? file.type : null;
 const types: Record<string, string> = { pdf: supported[0], doc: supported[1], docx: supported[2], jpg: supported[3], jpeg: supported[3], png: supported[4], webp: supported[5] };
 return types[file.name.split(".").pop()?.toLowerCase() ?? ""] ?? null;
}
export function CaseDocumentUpload({ caseId }: { caseId: Id<"cases"> }) {
  const { locale } = useLanguage();
  const readError = usePlainError();
  const c = useCopy();
 const issue = useMutation(api.caseManagement.generateDocumentUploadUrl); const add = useMutation(api.caseManagement.addDocument);
 const [file, setFile] = useState<File | null>(null); const [category, setCategory] = useState<"evidence" | "identity" | "contract" | "letter" | "receipt" | "other">("evidence"); const [note, setNote] = useState(""); const [busy, setBusy] = useState(false); const [percent, setPercent] = useState(0); const [notice, setNotice] = useState("");
 const uploadLock = useRef(false);
 const retry = useRef<{ clientId: string; storageId?: Id<"_storage"> }>({ clientId: crypto.randomUUID() }); const input = useRef<HTMLInputElement>(null);
 async function upload() {
  if (!file || uploadLock.current || busy) return; if (!file.size || file.size > 10 * 1024 * 1024) { setNotice(c("Choose a file between 1 byte and 10 MB.")); return; }
  const mime = documentMime(file); if (!mime) { setNotice(c("Choose a PDF, Word document, JPG, PNG or WebP image.")); return; }
  uploadLock.current = true; setBusy(true); setNotice("");
  try { const storageId = retry.current.storageId ?? await scannedUpload(await issue({ caseId }), file.type ? file : new Blob([file], { type: mime }), setPercent); retry.current.storageId = storageId; await add({ caseId, storageId, clientDocumentId: retry.current.clientId, name: file.name, type: mime, size: file.size, category, note: note.trim() || undefined }); setNotice(c("Document added for review.")); setFile(null); setNote(""); retry.current = { clientId: crypto.randomUUID() }; if (input.current) input.current.value = ""; }
  catch (error) { setNotice(readError(error, "Could not add the file. Try again.")); } finally { uploadLock.current = false; setBusy(false); }
 }
 return <form className="grid gap-3 rounded-2xl border bg-teal-50 p-4" onSubmit={event => { event.preventDefault(); void upload(); }}><h3 className="mb-0 text-lg">{c("Add a case document")}</h3><p className="mb-0 text-sm text-neutral-600">{c("PDF, Word, JPG, PNG or WebP. Up to 10 MB.")}</p><label className="grid gap-2 text-sm">{c("Choose file")}<input ref={input} type="file" disabled={busy} accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp" onChange={event => { setFile(event.target.files?.[0] ?? null); retry.current = { clientId: crypto.randomUUID() }; setNotice(""); setPercent(0); }} className="min-h-12 rounded-xl border bg-white p-3" /></label><label className="grid gap-2 text-sm">{c("Document type")}<select disabled={busy} value={category} onChange={event => setCategory(event.target.value as typeof category)} className="min-h-12 rounded-xl border bg-white px-3">{["evidence","identity","contract","letter","receipt","other"].map(value => <option key={value} value={value}>{displayLabel(value, locale)}</option>)}</select></label><label className="grid gap-2 text-sm">{c("Note (optional)")}<Textarea disabled={busy} value={note} maxLength={500} onChange={event => setNote(event.target.value)} /></label>{busy && <p role="status" className="mb-0 text-sm">{percent < 95 ? `${c("Uploading")} ${percent}%…` : c("Checking and saving the file…")}</p>}{!!notice && <p role="status" className="mb-0 text-sm">{notice}</p>}<Button type="submit" disabled={busy || !file}>{busy ? c("Adding…") : c("Add document")}</Button></form>;
}
export function CaseVoiceNote({ caseId }: { caseId: Id<"cases"> }) {
  const readError = usePlainError();
  const c = useCopy();
 const issue = useMutation(api.caseManagement.generateVoiceMessageUploadUrl); const send = useMutation(api.caseManagement.sendVoiceMessage);
 const mounted = useRef(true);
 const recorder = useRef<MediaRecorder | null>(null); const stream = useRef<MediaStream | null>(null); const timer = useRef<ReturnType<typeof setTimeout> | null>(null); const started = useRef(0); const retry = useRef<{ clientId: string; storageId?: Id<"_storage"> }>({ clientId: crypto.randomUUID() });
 const [recording, setRecording] = useState(false); const [audio, setAudio] = useState<{ blob: Blob; duration: number; url: string } | null>(null); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState("");
 useEffect(() => { mounted.current = true; return () => { mounted.current = false; recorder.current?.state === "recording" && recorder.current.stop(); stream.current?.getTracks().forEach(track => track.stop()); if (timer.current) clearTimeout(timer.current); }; }, []);
 useEffect(() => () => { if (audio) URL.revokeObjectURL(audio.url); }, [audio]);
 async function start() {
  if (busy || recording) return; setBusy(true); setNotice("");
  try { if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") throw new Error("Voice recording is not available in this browser. You can send a text message."); stream.current = await navigator.mediaDevices.getUserMedia({ audio: true }); if (!mounted.current) { stream.current.getTracks().forEach(track => track.stop()); return; } const mime = ["audio/webm", "audio/mp4"].find(value => MediaRecorder.isTypeSupported(value)); if (!mime) { stream.current.getTracks().forEach(track => track.stop()); throw new Error("This browser cannot record a supported audio format."); }
   const chunks: BlobPart[] = []; const next = new MediaRecorder(stream.current, { mimeType: mime }); recorder.current = next; started.current = Date.now(); retry.current = { clientId: crypto.randomUUID() };
   next.ondataavailable = event => { if (event.data.size) chunks.push(event.data); }; next.onstop = () => { const duration = Math.min(120000, Date.now()-started.current); const blob = new Blob(chunks, { type: mime }); stream.current?.getTracks().forEach(track => track.stop()); if (timer.current) clearTimeout(timer.current); if (!mounted.current) return; setRecording(false); if (duration < 500 || !blob.size) { setNotice(c("Record at least one second, then try again.")); return; } setAudio({ blob, duration, url: URL.createObjectURL(blob) }); };
   next.start(); setRecording(true); timer.current = setTimeout(() => { if (next.state === "recording") next.stop(); }, 120000);
  } catch (error) { stream.current?.getTracks().forEach(track => track.stop()); setNotice(readError(error, "Microphone access was not granted.")); } finally { setBusy(false); }
 }
 async function submit() {
  if (!audio || busy) return; if (audio.blob.size > 8 * 1024 * 1024) { setNotice(c("Voice note must be under 8 MB. Record a shorter note.")); return; } setBusy(true); setNotice("");
  try { const storageId = retry.current.storageId ?? await scannedUpload(await issue({ caseId }), audio.blob, () => {}); retry.current.storageId = storageId; await send({ caseId, storageId, clientMessageId: retry.current.clientId, mimeType: audio.blob.type, durationMs: audio.duration }); setAudio(null); setNotice(c("Voice note sent.")); }
  catch (error) { setNotice(readError(error, "Could not send. Try again.")); } finally { setBusy(false); }
 }
 return <div className="grid gap-3 rounded-xl border bg-primary/5 p-4"><h3 className="mb-0 text-base">{c("Send a voice note")}</h3><p className="mb-0 text-sm text-neutral-600">{c("Up to two minutes. Listen before sending.")}</p>{audio && <audio controls src={audio.url} className="w-full" aria-label={c("Your voice note preview")} />}<div className="flex flex-wrap gap-2">{recording ? <Button variant="outline" onClick={() => recorder.current?.stop()}>{c("Stop recording")}</Button> : <Button disabled={busy} variant="outline" onClick={() => void start()}>{audio ? c("Record again") : c("Record voice note")}</Button>}{audio && !recording && <><Button disabled={busy} onClick={() => void submit()}>{busy ? c("Sending…") : c("Send voice note")}</Button><Button variant="ghost" disabled={busy} onClick={() => setAudio(null)}>{c("Discard")}</Button></>}</div>{!!notice && <p role="status" className="mb-0 text-sm">{notice}</p>}</div>;
}
