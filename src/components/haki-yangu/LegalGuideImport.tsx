import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { guideImportKey, parseGuideImport, type GuideContent } from '../../../convex/lib/legalGuideContent';

export default function LegalGuideImport({ existing }: { existing?: GuideContent[] }) {
  const submit = useMutation(api.publications.importPreparedLegalGuide);
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState('');
  const [preview, setPreview] = useState<GuideContent[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submittedKeys, setSubmittedKeys] = useState<Set<string>>(new Set());

  async function prepare() {
    setPreview([]); setError(''); setMessage('');
    try {
      if (!file || file.size > 2 * 1024 * 1024) throw new Error('Choose a JSON guide pack smaller than 2 MiB.');
      const reviewDueAt = Date.parse(`${date}T12:00:00+03:00`);
      setPreview(parseGuideImport(JSON.parse(await file.text()), reviewDueAt));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not read the guide pack.'); }
  }

  async function upload() {
    if (!preview.length || existing === undefined || busy) return;
    setBusy(true); setError('');
    const known = new Set([...existing.map(guideImportKey), ...submittedKeys]);
    const completed = new Set(submittedKeys);
    let added = 0, skipped = 0;
    try {
      for (const guide of preview) {
        const key = guideImportKey(guide);
        if (known.has(key)) { skipped++; continue; }
        setMessage(`Submitting ${added + 1}… ${guide.titleEn}`);
        const result = await submit(guide);
        if (result.created) added++; else skipped++; known.add(key); completed.add(key);
        setSubmittedKeys(new Set(completed));
      }
      setMessage(`${added} guides submitted for independent review; ${skipped} already listed/submitted entries skipped. Nothing was published.`);
      setPreview([]);
    } catch (cause) {
      setError(`${added} guides confirmed submitted before stopping. ${cause instanceof Error ? cause.message : 'Upload failed.'} Check the review queue before retrying if a response was lost.`);
    } finally { setBusy(false); }
  }

  return <section className="space-y-4 rounded-2xl border bg-white p-6">
    <h2 className="text-xl font-semibold">Import prepared guides</h2>
    <p className="text-sm text-gray-600">Choose a bilingual JSON pack and a date to review its sources again. Imported guides go to independent review. Legal and language checks remain required before publication.</p>
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium">Guide JSON file<input disabled={busy} type="file" accept=".json,application/json" className="mt-2 block w-full" onChange={event => { setFile(event.target.files?.[0] ?? null); setPreview([]); }} /></label>
      <label className="text-sm font-medium">Next source review date<input disabled={busy} type="date" value={date} onChange={event => { setDate(event.target.value); setPreview([]); }} className="mt-2 block w-full rounded-lg border p-3" /></label>
    </div>
    <button disabled={busy || !file || !date} type="button" onClick={() => void prepare()} className="rounded-lg border px-4 py-2 font-semibold disabled:opacity-50">Check and preview pack</button>
    {preview.length > 0 && <><p className="font-medium">{preview.length} guides · {new Set(preview.map(g => g.category)).size} categories</p><ul className="max-h-60 space-y-1 overflow-auto text-sm">{preview.map((guide, index) => <li key={index}>{index + 1}. {guide.titleEn} · {guide.jurisdiction.replaceAll('_', ' ')}</li>)}</ul><button disabled={busy || existing === undefined} type="button" onClick={() => void upload()} className="rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Submitting…' : `Submit ${preview.length} guides for review`}</button></>}
    {message && <p role="status" className="text-sm text-green-800">{message}</p>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </section>;
}
