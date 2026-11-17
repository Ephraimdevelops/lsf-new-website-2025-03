import { useState } from 'react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import type { Doc } from '../../../convex/_generated/dataModel';
import { sourceMetadataSnapshot } from '../../../convex/lib/saadaSourceMetadata';
import { usePlainError } from '@/i18n/usePlainError';
import { Button } from '@/components/ui/button';

export default function SourceMetadataEditor({ source }: { source: Doc<'documents'> }) {
  const save = useMutation(api.sara.updatePendingSourceMetadata);
  const readError = usePlainError();
  const [open, setOpen] = useState(false), [busy, setBusy] = useState(false);
  const [snapshot, setSnapshot] = useState(''), [reason, setReason] = useState('');
  const [draft, setDraft] = useState({sourceType:'legal_reference',publicationStatus:'unknown',reportingPeriod:'',title: '', publisher: '', sourceUrl: '', jurisdiction: 'other', language: 'other', contentCategory: '', versionLabel: '', effectiveDate: '', reviewDate: '' });
  const begin = () => {
    setSnapshot(sourceMetadataSnapshot(source)); setReason('');
    setDraft({sourceType:source.sourceType??'legal_reference',publicationStatus:source.publicationStatus??'unknown',reportingPeriod:source.reportingPeriod??'',title: source.title, publisher: source.publisher ?? '', sourceUrl: source.sourceUrl ?? '', jurisdiction: source.jurisdiction ?? 'other', language: source.language ?? 'other', contentCategory: source.contentCategory ?? '', versionLabel: source.versionLabel ?? '', effectiveDate: source.effectiveDate ?? '', reviewDate: source.reviewDueAt ? new Date(source.reviewDueAt).toISOString().slice(0,10) : '' });
    setOpen(true);
  };
  if (!open) return <Button variant="outline" className="mt-3" onClick={begin}>Correct draft source details</Button>;
  const textFields = [['title','Exact title',180],['publisher','Publisher / authority',180],['sourceUrl','Publisher source URL',2000],['contentCategory','Category',100],['versionLabel','Edition / version',80]] as const;
  return <form className="mt-4 grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2" onSubmit={async event => {
    event.preventDefault(); setBusy(true);
    try {
      await save({ id: source._id, expectedSnapshot: snapshot, reason, metadata: {sourceType:draft.sourceType as 'legal_reference'|'lsf_knowledge',publicationStatus:draft.publicationStatus as 'published'|'draft'|'unknown',reportingPeriod:draft.reportingPeriod||undefined,title: draft.title, publisher: draft.publisher, sourceUrl: draft.sourceUrl || undefined, jurisdiction: draft.jurisdiction as NonNullable<Doc<'documents'>['jurisdiction']>, language: draft.language as NonNullable<Doc<'documents'>['language']>, contentCategory: draft.contentCategory, versionLabel: draft.versionLabel, effectiveDate: draft.effectiveDate || undefined, reviewDueAt: Date.parse(draft.reviewDate + 'T12:00:00Z') } });
      toast.success('Draft source details saved. Independent source approval is still required.'); setOpen(false);
    } catch (error) { toast.error(readError(error, 'Could not save source details.')); }
    finally { setBusy(false); }
  }}>
    <p className="text-sm text-gray-600 sm:col-span-2">Check these details against the PDF and publisher. This changes draft metadata and records your reason; it does not approve the source or replace its contents.</p>
    <label className="text-sm">Use of this source<select value={draft.sourceType} disabled={busy} onChange={e=>setDraft({...draft,sourceType:e.target.value})} className="mt-1 w-full rounded-lg border px-3 py-2"><option value="legal_reference">Law and legal guidance</option><option value="lsf_knowledge">LSF information and statistics</option></select></label>
    {draft.sourceType==='lsf_knowledge'&&<><label className="text-sm">Publication status<select value={draft.publicationStatus} disabled={busy} onChange={e=>setDraft({...draft,publicationStatus:e.target.value})} className="mt-1 w-full rounded-lg border px-3 py-2"><option value="unknown">Not confirmed</option><option value="draft">Draft — not for public AI</option><option value="published">Authorised published version</option></select></label><label className="text-sm">Reporting year or period<input maxLength={80} value={draft.reportingPeriod} disabled={busy} onChange={e=>setDraft({...draft,reportingPeriod:e.target.value})} className="mt-1 w-full rounded-lg border px-3 py-2"/></label></>}
    {textFields.map(([key,label,max]) => <label key={key} className="text-sm">{label}<input required={key !== 'sourceUrl'} maxLength={max} disabled={busy} value={draft[key]} onChange={event => setDraft(current => ({ ...current, [key]: event.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>)}
    <label className="text-sm">Jurisdiction<select disabled={busy} value={draft.jurisdiction} onChange={event => setDraft(current => ({ ...current, jurisdiction: event.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2"><option value="national">National</option><option value="tanzania_mainland">Tanzania Mainland</option><option value="zanzibar">Zanzibar</option><option value="other">Other / needs classification</option></select></label>
    <label className="text-sm">Source language<select disabled={busy} value={draft.language} onChange={event => setDraft(current => ({ ...current, language: event.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2"><option value="sw">Kiswahili</option><option value="en">English</option><option value="bilingual">Kiswahili and English</option><option value="other">Other</option></select></label>
    <label className="text-sm">Effective date<input type="date" disabled={busy} value={draft.effectiveDate} onChange={event => setDraft(current => ({ ...current, effectiveDate: event.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
    <label className="text-sm">Review due<input required type="date" disabled={busy} value={draft.reviewDate} onChange={event => setDraft(current => ({ ...current, reviewDate: event.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
    <label className="text-sm sm:col-span-2">Correction reason<textarea required minLength={10} maxLength={2000} disabled={busy} value={reason} onChange={event => setReason(event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
    <div className="flex gap-2 sm:col-span-2"><Button type="submit" disabled={busy || reason.trim().length < 10}>{busy ? 'Saving…' : 'Save draft details'}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => setOpen(false)}>Cancel</Button></div>
  </form>;
}
