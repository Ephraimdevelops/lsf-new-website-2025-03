import { useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Issue = 'employment' | 'land' | 'family' | 'safety' | 'consumer' | 'other';
type Urgency = 'standard' | 'urgent' | 'immediate_safety';
type Contact = 'in_app' | 'phone' | 'sms' | 'email' | 'none';
const KEY = 'haki_yangu_web_intake';
const MAX_FILE = 10 * 1024 * 1024;
const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);
type Draft = { id: string; story: string; issue: Issue; region: string; district: string; desiredHelp: string; urgency: Urgency; contact: Contact; locale: 'sw' | 'en'; sourceServiceId?: string };
function newDraft(params: URLSearchParams): Draft { const requestedIssue = params.get('issue'); const issue: Issue = requestedIssue && ['employment', 'land', 'family', 'safety', 'consumer', 'other'].includes(requestedIssue) ? requestedIssue as Issue : 'other'; return { id: `web-${crypto.randomUUID()}`, story: '', issue, region: params.get('region') ?? '', district: params.get('district') ?? '', desiredHelp: '', urgency: 'standard', contact: 'in_app', locale: 'sw', sourceServiceId: params.get('serviceId') ?? undefined }; }
function initialDraft(params: URLSearchParams): Draft { try { const raw = sessionStorage.getItem(KEY); if (raw) { const saved = JSON.parse(raw) as Draft; const serviceId = params.get('serviceId'); return { ...newDraft(params), ...saved, ...(serviceId ? { sourceServiceId: serviceId, region: params.get('region') ?? saved.region, district: params.get('district') ?? saved.district } : {}) }; } } catch { /* storage may be unavailable */ } return newDraft(params); }

export default function RequestHelp() {
  const [params] = useSearchParams();
  const { isSignedIn } = useAuth();
  const [draft, setDraft] = useState<Draft>(() => initialDraft(params));
  const [file, setFile] = useState<File | null>(null);
  const uploadedFile = useRef<{ file: File; requestId: string; storageId: Id<'_storage'> } | null>(null);
  const [attachmentRecorded, setAttachmentRecorded] = useState(false);
  const [cleanupFailed, setCleanupFailed] = useState(false);
  const [step, setStep] = useState<'write' | 'review' | 'done'>('write');
  const [reference, setReference] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const existing = useQuery(api.legalHelp.getDraft, isSignedIn ? { clientRequestId: draft.id } : 'skip');
  const saveDraft = useMutation(api.legalHelp.saveDraft);
  const generateUploadUrl = useMutation(api.legalHelp.generateAttachmentUploadUrl);
  const attach = useMutation(api.legalHelp.attachToDraft);
  const submit = useMutation(api.legalHelp.submit);
  const recordJourney = useMutation(api.journeyAnalytics.record);
  function review() {
    setStep('review');
    void recordJourney({ surface: 'web', step: 'request_review' }).catch(() => undefined);
  }
  function update(partial: Partial<Draft>) { setDraft((current) => { const next = { ...current, ...partial }; try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* user can still continue in this tab */ } return next; }); }
  function chooseFile(next: File | null) {
    setError('');
    if (!next) { setFile(null); return; }
    if (!allowedTypes.has(next.type) || next.size < 1 || next.size > MAX_FILE) {
      setError('Choose a PDF, JPG or PNG file smaller than 10 MB.');
      return;
    }
    setFile(next);
  }
  function confirmSubmission(publicId: string) {
    setReference(publicId); setStep('done');
    try { sessionStorage.removeItem(KEY); setCleanupFailed(false); }
    catch { setCleanupFailed(true); }
  }
  async function send() {
    if (busy || !isSignedIn || existing === undefined) return;
    setBusy(true); setError('');
    try {
      const saved = await saveDraft({
        clientRequestId: draft.id, locale: draft.locale, description: draft.story.trim(),
        issueCategory: draft.issue, region: draft.region.trim(), district: draft.district.trim(),
        desiredHelp: draft.desiredHelp.trim(), safeContactMethod: draft.contact,
        preferredLanguage: draft.locale, urgency: draft.urgency,
        hasDocuments: Boolean(file || attachmentRecorded || existing?.attachments.length),
        sourceServiceId: draft.sourceServiceId as Id<'justice_services'> | undefined,
      });
      if (saved.status === 'withdrawn') throw new Error('This request was withdrawn. Check your requests before starting a new one.');
      if (saved.status !== 'draft') {
        confirmSubmission(saved.publicId); return;
      }
      let expectedVersion = saved.version;
      if (file && !attachmentRecorded && !existing?.attachments.length) {
        let storageId = uploadedFile.current?.file === file && uploadedFile.current.requestId === saved.requestId ? uploadedFile.current.storageId : undefined;
        if (!storageId) {
          const uploadUrl = await generateUploadUrl({});
          const response = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
          if (!response.ok) throw new Error('Evidence upload failed. Your request has not been sent. Please try again.');
          storageId = (await response.json() as { storageId: Id<'_storage'> }).storageId;
          uploadedFile.current = { file, requestId: saved.requestId, storageId };
        }
        const attached = await attach({ requestId: saved.requestId, storageId, name: file.name, type: file.type, size: file.size });
        setAttachmentRecorded(true);
        expectedVersion = attached.version;
      }
      const result = await submit({ requestId: saved.requestId, expectedVersion, consentVersion: 'service-v1' });
      confirmSubmission(result.publicId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not send your request. Please try again.');
    } finally { setBusy(false); }
  }
  return <Layout><section className="bg-[#FFF9F8] py-12 sm:py-20"><Container><div className="mx-auto max-w-2xl"><p className="text-sm font-bold uppercase tracking-widest text-primary">Haki Yangu · Request Help</p><h1 className="mt-3 text-4xl font-bold text-[#241820]">Tell us what happened</h1><p className="mt-3 text-[#665963]">LSF will review your request. You choose what to share and how we may contact you.</p>
    {step === 'done' ? <div className="mt-8 rounded-[28px] border border-emerald-200 bg-white p-7"><h2 className="text-2xl font-bold">Your request was sent</h2>{cleanupFailed && <p role="alert" className="mt-3 text-sm text-amber-800">The request was sent, but this tab could not clear its local draft. Do not submit again; use your reference below.</p>}<p className="mt-2">Reference: <strong>{reference}</strong></p><p className="mt-2 text-sm text-[#665963]">You can follow updates from your dashboard.</p><Link to="/dashboard/user" className="mt-5 inline-block"><Button>View my requests</Button></Link></div> : <div className="mt-8 rounded-[28px] border border-[#EFDFE3] bg-white p-6 shadow-sm sm:p-8">
      {step === 'write' ? <div className="space-y-5"><label className="block text-sm font-semibold">What is your issue?<select className="mt-2 w-full rounded-xl border p-3" value={draft.issue} onChange={(e) => update({ issue: e.target.value as Issue })}>{(['employment','land','family','safety','consumer','other'] as const).map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label className="block text-sm font-semibold">What happened?<textarea className="mt-2 min-h-32 w-full rounded-xl border p-3" value={draft.story} maxLength={5000} onChange={(e) => update({ story: e.target.value })} placeholder="Describe the situation in your own words" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Region<Input className="mt-2" value={draft.region} onChange={(e) => update({ region: e.target.value })} /></label><label className="text-sm font-semibold">District<Input className="mt-2" value={draft.district} onChange={(e) => update({ district: e.target.value })} /></label></div><label className="block text-sm font-semibold">What support would you like?<textarea className="mt-2 min-h-20 w-full rounded-xl border p-3" value={draft.desiredHelp} maxLength={1000} onChange={(e) => update({ desiredHelp: e.target.value })} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Urgency<select className="mt-2 w-full rounded-xl border p-3" value={draft.urgency} onChange={(e) => update({ urgency: e.target.value as Urgency })}><option value="standard">Standard</option><option value="urgent">Urgent</option><option value="immediate_safety">Immediate safety concern</option></select></label><label className="text-sm font-semibold">Safe way to contact you<select className="mt-2 w-full rounded-xl border p-3" value={draft.contact} onChange={(e) => update({ contact: e.target.value as Contact })}><option value="in_app">In the app / website</option><option value="phone">Phone</option><option value="sms">SMS</option><option value="email">Email</option><option value="none">Do not contact me</option></select></label></div><label className="block text-sm font-semibold">Preferred language<select className="mt-2 w-full rounded-xl border p-3" value={draft.locale} onChange={(e) => update({ locale: e.target.value as 'sw' | 'en' })}><option value="sw">Kiswahili</option><option value="en">English</option></select></label><div className="rounded-2xl border border-dashed border-[#DCC9CF] p-4"><label htmlFor="request-evidence" className="block text-sm font-semibold">Evidence (optional)</label><p className="mt-1 text-xs text-[#665963]">One PDF, JPG or PNG file, up to 10 MB. Only share information needed for this request.</p>{existing?.attachments.length ? <p className="mt-3 text-sm font-medium">Attached to this draft: {existing.attachments.map((item) => item.name).join(', ')}</p> : <><input id="request-evidence" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="mt-3 block w-full text-sm" onChange={(e) => chooseFile(e.target.files?.[0] ?? null)} />{file && <p className="mt-2 text-sm">Selected: {file.name}</p>}</>}</div>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<Button disabled={!draft.story.trim() || !draft.region.trim() || !draft.district.trim() || !draft.desiredHelp.trim()} onClick={review}>Review request</Button></div> : <div className="space-y-4"><h2 className="text-2xl font-bold">Review before sending</h2><p className="rounded-xl bg-[#FFF9F8] p-4 whitespace-pre-wrap">{draft.story}</p><p><strong>Issue:</strong> {draft.issue}</p><p><strong>Location:</strong> {draft.district}, {draft.region}</p><p><strong>Requested help:</strong> {draft.desiredHelp}</p><p><strong>Urgency:</strong> {draft.urgency.replaceAll('_',' ')}</p><p><strong>Contact:</strong> {draft.contact.replaceAll('_',' ')}</p><p><strong>Evidence:</strong> {existing?.attachments.map((item) => item.name).join(', ') || file?.name || 'None selected'}</p><p className="text-sm text-[#665963]">By sending, you consent to LSF using this information to review and respond to your request. Any onward referral requires a separate decision from you.</p>{!isSignedIn && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">Sign in to send. Your text draft will stay in this browser tab; select your file again afterward. <Link className="font-bold underline" to="/login?returnTo=%2Frequest-help">Sign in</Link></div>}{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<div className="flex gap-3"><Button variant="outline" onClick={() => setStep('write')}>Edit</Button><Button disabled={!isSignedIn || existing === undefined || busy} onClick={() => void send()}>{busy ? 'Sending…' : 'Send request'}</Button></div></div>}
    </div>}
  </div></Container></section></Layout>;
}
