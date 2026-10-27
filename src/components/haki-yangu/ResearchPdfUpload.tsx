import { useRef, useState } from 'react';
import { useConvex, useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id, Doc } from '../../../convex/_generated/dataModel';
import { parseResearchPdfManifest, type ResearchPdfInput } from '../../../convex/lib/researchPdfManifest';

export type PreparedResearchRow = Doc<'saada_research_pdfs'> & { url: string | null; canReuseIndexingCopy: boolean };
export default function ResearchPdfUpload({ onPrepare }: { onPrepare: (row: PreparedResearchRow) => void }) {
  const convex = useConvex();
  const access = useQuery(api.users.currentAccess, {});
  const reviewOcr = useMutation(api.saadaResearchPdfs.reviewIndexingDerivative);
  const [ocrNotes, setOcrNotes] = useState<Record<string,string>>({});
  const generateUrl = useMutation(api.sara.generateUploadUrl);
  const record = useMutation(api.saadaResearchPdfs.record);
  const archive = useMutation(api.saadaResearchPdfs.setArchived);
  const [removed, setRemoved] = useState(false);
  const queue = usePaginatedQuery(api.saadaResearchPdfs.listPage, { archived: removed }, { initialNumItems: 20 });
  const [manifestFile, setManifestFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [entries, setEntries] = useState<ResearchPdfInput[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const [selected, setSelected] = useState<Id<'saada_research_pdfs'> | null>(null);
  const uploaded = useRef(new Map<string, Id<'_storage'>>());
  const receipts = useRef<unknown[]>([]);

  async function preview() {
    setError(''); setEntries([]); setMessage('');
    try {
      if (!manifestFile || manifestFile.size > 8 * 1024 * 1024) throw new Error('Choose a research manifest smaller than 8 MiB.');
      const rows = parseResearchPdfManifest(JSON.parse(await manifestFile.text()));
      const names = new Map(files.map(file => [file.name, file]));
      if (names.size !== files.length) throw new Error('Selected PDF filenames must be unique.');
      for (const row of rows) {
        const file = names.get(row.filename);
        if (!file || file.size !== row.byteSize) throw new Error(`Select the matching original PDF: ${row.filename}`);
      }
      setEntries(rows);
      setMessage(`${rows.length} original PDFs ready for private storage. Provenance will be preserved; none will be indexed or published by this upload.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not read manifest.'); }
  }
  async function upload() {
    if (!entries.length || busy) return;
    setBusy(true); setError(''); receipts.current = [];
    let added = 0, skipped = 0;
    try {
      const existing = await convex.query(api.saadaResearchPdfs.lookup, { hashes: entries.map(row => row.sha256) });
      const known = new Map(existing.filter(row => row.stored).map(row => [row.sha256, row]));
      for (let i = 0; i < entries.length; i++) {
        const row = entries[i];
        setMessage(`Storing ${i + 1} of ${entries.length}: ${row.title}`);
        if (known.has(row.sha256)) { skipped++; receipts.current.push({ ...row, ...known.get(row.sha256), created: false }); continue; }
        const file = files.find(file => file.name === row.filename)!;
        const bytes = await file.arrayBuffer();
        const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))).map(byte => byte.toString(16).padStart(2, '0')).join('');
        if (digest !== row.sha256) throw new Error(`Checksum mismatch: ${row.filename}`);
        const header = new TextDecoder().decode(bytes.slice(0, 1024));
        if (!header.includes('%PDF-')) throw new Error(`PDF signature missing: ${row.filename}`);
        let storageId = uploaded.current.get(row.sha256);
        if (!storageId) {
          const url = await generateUrl();
          const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: file });
          if (!response.ok) throw new Error(`Storage upload failed (${response.status}): ${row.filename}`);
          const result = await response.json();
          if (!result.storageId) throw new Error('Storage did not return a file reference.');
          storageId = result.storageId as Id<'_storage'>;
          uploaded.current.set(row.sha256, storageId);
        }
        const result = await record({ ...row, storageId });
        if (result.created) added++; else skipped++;
        receipts.current.push({ ...row, ...result });
      }
      const verified = await convex.query(api.saadaResearchPdfs.lookup, { hashes: entries.map(row => row.sha256) });
      const confirmed = verified.filter(row => row.stored).length;
      receipts.current.push({ verification: verified, verifiedAt: new Date().toISOString() });
      if (confirmed !== entries.length) throw new Error(`Only ${confirmed}/${entries.length} stored PDFs could be verified.`);
      setMessage(`${added} PDFs stored; ${skipped} existing PDFs skipped. ${confirmed}/${entries.length} server checksums and sizes verified. No indexing or publication performed.`);
    } catch (cause) {
      setError(`${added} PDFs confirmed saved; ${skipped} skipped before stopping. ${cause instanceof Error ? cause.message : 'Upload failed.'} Retry safely: saved hashes will be skipped.`);
    } finally { setBusy(false); }
  }
  function exportReceipts() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(receipts.current, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'saada-research-pdf-upload-receipts.json'; link.click(); URL.revokeObjectURL(url);
  }
  return <section className="my-8 rounded-xl border border-teal-200 bg-teal-50 p-5 space-y-4" aria-label="Private research PDF archive">
    <h2 className="text-xl font-semibold">Private research PDF archive</h2>
    <p className="text-sm">Store original PDFs and their research provenance before metadata review, OCR and indexing. Originals up to 50 MiB can be preserved here; the ingestion limit remains 15 MiB. These files do not appear in Haki Yangu AI answers.</p>
    <label className="block text-sm">Research PDF manifest<input type="file" accept=".json,application/json" disabled={busy} onChange={event => { setManifestFile(event.target.files?.[0] ?? null); setEntries([]); }} className="block mt-2" /></label>
    <label className="block text-sm">Original research PDFs<input type="file" accept=".pdf,application/pdf" multiple disabled={busy} onChange={event => { setFiles(Array.from(event.target.files ?? [])); setEntries([]); }} className="block mt-2" /></label>
    <p className="text-sm">{files.length} PDFs selected</p>
    <button className="rounded border px-3 py-2 disabled:opacity-50" disabled={busy || !manifestFile || !files.length} onClick={() => void preview()}>Preview private PDF upload</button>
    {entries.length > 0 && <><ul className="max-h-40 overflow-auto text-sm">{entries.map(row => <li key={row.sha256}>{row.researchSourceId} · {row.title} · {(row.byteSize / 1024 / 1024).toFixed(2)} MiB</li>)}</ul><button className="rounded bg-primary text-white px-4 py-2 disabled:opacity-50" disabled={busy} onClick={() => void upload()}>{busy ? 'Storing PDFs…' : `Store ${entries.length} research PDFs`}</button></>}
    {message && <p role="status" className="text-sm font-medium text-green-900">{message}</p>}
    {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
    {!busy && receipts.current.length > 0 && <button className="underline text-sm" onClick={exportReceipts}>Download PDF upload receipts</button>}
    <label className="block text-sm"><input type="checkbox" checked={removed} onChange={event => setRemoved(event.target.checked)} /> Show removed research PDFs</label>
    <ul className="grid items-start gap-4 lg:grid-cols-2">{queue.results.map(row => <li key={row._id} className="resource-management-card rounded-xl border border-gray-200 bg-white p-4 text-sm transition-colors hover:border-primary/30">
      <h3 className="resource-management-title text-gray-900">{row.title}</h3>
      <p className="mt-1 text-xs text-gray-500">{row.researchSourceId} · {(row.byteSize / 1024 / 1024).toFixed(2)} MiB</p>
      <div className="my-3 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">{row.indexingStatus ? `Index: ${row.indexingStatus}` : 'Not indexed'}</span><span className="rounded-full bg-amber-50 px-2 py-1 text-amber-800">Review: {row.approvalStatus ?? 'pending'}</span></div>
      {row.url && <a className="resource-management-links text-xs font-medium text-primary underline underline-offset-4" href={row.url} target="_blank" rel="noreferrer">Open original research PDF</a>}
      <details className="mt-4 border-t border-gray-100 pt-3"><summary className="cursor-pointer text-sm font-medium text-gray-700">Manage research PDF</summary>
      <details className="my-3"><summary className="cursor-pointer text-xs text-gray-600">Original provenance and unresolved checks</summary><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-3 text-xs">{JSON.stringify(JSON.parse(row.provenance), null, 2)}</pre></details>
      {row.indexingDerivative && <div className="my-3 space-y-2 rounded border border-amber-200 bg-amber-50 p-3">
        <p className="font-medium">Machine OCR transcription: {row.indexingDerivative.reviewStatus}</p>
        <p>Original pages preserved: {row.indexingDerivative.pageCount}. Check every page, including numbers, names, tables and schedules, against the original. Transcription verification does not approve legal applicability or publish this source.</p>
        {row.indexingUrl && <a href={row.indexingUrl} target="_blank" rel="noreferrer" className="underline">Open searchable OCR copy</a>}
        {row.indexingDerivative.reviewStatus === 'pending' && access?.roles.includes('admin') && access.user._id !== row.indexingDerivative.preparedBy && <>
          <label className="block">Independent transcription review notes<textarea className="mt-1 block w-full rounded border p-2" value={ocrNotes[row._id]??''} onChange={event=>setOcrNotes(current=>({...current,[row._id]:event.target.value}))}/></label>
          {(['verified','rejected'] as const).map(decision=><button key={decision} className="mr-3 underline disabled:opacity-50" disabled={busy||(ocrNotes[row._id]?.trim().length??0)<20} onClick={async()=>{setBusy(true);setError('');try{await reviewOcr({id:row._id,decision,note:ocrNotes[row._id]});}catch(cause){setError(cause instanceof Error?cause.message:'Review failed.');}finally{setBusy(false);}}}>{decision==='verified'?'Record verified transcription':'Reject transcription'}</button>)}
        </>}
      </div>}
      {!removed && <div className="my-2"><button className="underline disabled:opacity-50" disabled={row.byteSize > 15 * 1024 * 1024 || busy || !!row.indexingStatus} onClick={() => onPrepare(row)}>Prepare indexing metadata</button>{row.byteSize > 15 * 1024 * 1024 && <p>Use a prepared smaller copy for indexing; the original remains stored here.</p>}</div>}
      <button className="underline" onClick={() => { setSelected(row._id); setReason(''); }}>{removed ? 'Restore research PDF' : 'Remove research PDF'}</button>
      {selected === row._id && <div className="mt-2 space-y-2"><label className="block">Removal or restoration reason<input className="block w-full rounded border p-2" value={reason} onChange={event => setReason(event.target.value)} /></label><button disabled={reason.trim().length < 10} onClick={async () => { try { await archive({ id: row._id, archived: !removed, reason }); setSelected(null); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Change failed.'); } }}>Confirm {removed ? 'restoration' : 'recoverable removal'}</button><button className="ml-3 underline" onClick={() => setSelected(null)}>Cancel</button></div>}
      </details>
    </li>)}</ul>
    {queue.status === 'CanLoadMore' && <button className="underline" onClick={() => queue.loadMore(20)}>Load more research PDFs</button>}
  </section>;
}
