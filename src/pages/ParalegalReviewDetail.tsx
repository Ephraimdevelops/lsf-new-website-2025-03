import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileCheck2, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';

export default function ParalegalReviewDetail() {
  const { id } = useParams();
  const applicationId = id as Id<'paralegal_applications'> | undefined;
  const access = useQuery(api.users.currentAccess);
  const canReview = access?.roles.some(role => role === 'admin' || role === 'staff') ?? false;
  const isAdmin = access?.roles.includes('admin') ?? false;
  const application = useQuery(api.formSubmissions.paralegalApplicationForReview, canReview && applicationId ? { id: applicationId } : 'skip');
  const review = useMutation(api.formSubmissions.reviewParalegalApplication);
  const [note, setNote] = useState('');
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const selfReview = Boolean(application && access?.user?.email?.toLowerCase() === application.email.toLowerCase());
  const identityReady = Boolean(application?.identityDocumentUrl);
  const credentialReady = Boolean(application?.certificateStorageId && application.certificateDocumentUrl);
  const finalReady = Boolean(application?.status === 'under_review' && note.trim().length >= 10 && !selfReview && decision && (decision !== 'approved' || (isAdmin && identityReady && credentialReady)));

  async function save(status: 'under_review' | 'approved' | 'rejected') {
    if (!application || busy || selfReview) return;
    setBusy(true); setError(''); setNotice('');
    try {
      await review({ id: application._id, status, reviewNotes: note.trim() || undefined });
      setDecision(null); setConfirming(false); setNote('');
      setNotice(status === 'under_review' ? 'Review started. The application remains in the LSF queue.' : status === 'approved' ? 'Paralegal approved. The decision is recorded.' : 'Application rejected. The decision is recorded.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the review.');
    } finally {
      setBusy(false);
    }
  }

  return <Layout><main className="min-h-screen bg-[#fcf9f8] py-10"><Container className="max-w-5xl">
    <Link to="/dashboard/paralegal-reviews" className="inline-flex items-center gap-2 text-sm font-bold text-[#870b3a] underline"><ArrowLeft size={16} /> Back to paralegal queue</Link>
    <header className="mt-6 rounded-3xl bg-gradient-to-r from-[#650b2d] to-[#a31b49] p-8 text-white"><p className="text-xs font-bold uppercase tracking-[.2em] text-rose-100">LSF · Paralegal verification</p><h1 className="mt-3 text-3xl font-black">{application?.fullName ?? 'Review application'}</h1><p className="mt-3 text-rose-50">Check the applicant’s identity, experience and supporting documents before a final decision.</p></header>
    {!canReview ? <p className="mt-6 rounded-2xl bg-white p-6">LSF review access is required.</p> : application === undefined ? <p role="status" className="mt-6 rounded-2xl bg-white p-6">Loading application…</p> : !application ? <p className="mt-6 rounded-2xl bg-white p-6">Application unavailable.</p> : <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="space-y-6">
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">{notice}</p>}
      <section className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><UserRoundCheck className="h-7 w-7 text-[#870b3a]" /><h2 className="text-xl font-bold">Applicant profile</h2></div><p className="mt-2 text-sm font-semibold capitalize text-[#870b3a]">Status: {application.status.replaceAll('_', ' ')}</p><dl className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Email" value={application.email} /><Field label="Phone" value={application.phone} /><Field label="Location" value={[application.ward, application.district, application.region].filter(Boolean).join(', ')} /><Field label="Education" value={application.education} /><Field label="Experience" value={application.experience} /><Field label="Languages" value={application.languages?.join(', ') || 'Not stated'} /><Field label="Submitted" value={new Date(application.submittedAt).toLocaleString('en-TZ')} /></dl><div className="mt-5 rounded-xl bg-[#fff5f7] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#870b3a]">Motivation</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{application.motivation}</p></div>{application.reviewNotes && <p className="mt-4 text-sm text-slate-600">Previous review note: {application.reviewNotes}</p>}</section>
      <section className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><FileCheck2 className="h-7 w-7 text-[#870b3a]" /><h2 className="text-xl font-bold">Verification documents</h2></div><div className="mt-5 space-y-3"><Document label="Identity document" url={application.identityDocumentUrl} /><Document label="Paralegal certificate" url={application.certificateDocumentUrl} /><Document label="Resume / CV" url={application.resumeDocumentUrl} /></div><p className="mt-4 text-sm text-slate-600">Identity and credential evidence are required for approval. Review the actual files before deciding.</p></section>
      {selfReview ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-900">Another LSF reviewer must review your own application.</p> : application.intakeOrigin ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-900">This is an invitation record. The applicant must sign in, complete their details and upload identity and credential evidence before LSF can begin review.</p> : application.status === 'pending' ? <section className="rounded-2xl border border-rose-100 bg-white p-6"><h2 className="text-xl font-bold">Begin review</h2><p className="mt-2 text-sm text-slate-600">Starting review moves this application to the under-review queue. It does not grant access.</p><button type="button" disabled={busy} onClick={() => void save('under_review')} className="mt-4 rounded-xl bg-[#870b3a] px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Start review'}</button></section>
      : application.status === 'under_review' ? <section className="rounded-2xl border border-rose-100 bg-white p-6"><h2 className="text-xl font-bold">Final decision</h2><p className="mt-2 text-sm text-slate-600">Administrators can approve after reviewing identity and credential evidence. An LSF reviewer can reject with a recorded reason.</p><label htmlFor="paralegal-review-note" className="mt-5 block text-sm font-semibold">Decision reason and findings (10+ characters)</label><textarea id="paralegal-review-note" maxLength={1000} value={note} onChange={event => { setNote(event.target.value); setConfirming(false); }} className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 p-3" /><div className="mt-4 flex flex-wrap gap-3">{isAdmin && <button type="button" onClick={() => { setDecision('approved'); setConfirming(false); }} className={`rounded-xl border px-5 py-3 font-bold ${decision === 'approved' ? 'bg-[#870b3a] text-white' : 'border-rose-200 text-[#870b3a]'}`}>Approve paralegal</button>}<button type="button" onClick={() => { setDecision('rejected'); setConfirming(false); }} className={`rounded-xl border px-5 py-3 font-bold ${decision === 'rejected' ? 'bg-[#870b3a] text-white' : 'border-rose-200 text-[#870b3a]'}`}>Reject application</button></div>{decision && <div className="mt-5 rounded-xl bg-[#fff5f7] p-4"><p className="font-semibold">{decision === 'approved' ? 'Approve this applicant as a paralegal?' : 'Reject this application?'}</p><p className="mt-1 text-sm text-slate-600">{decision === 'approved' ? 'Approval verifies the application and may activate a linked account’s paralegal role.' : 'The application will close with your recorded reason.'}</p>{decision === 'approved' && (!identityReady || !credentialReady) && <p className="mt-2 text-sm font-semibold text-amber-800">Identity and credential evidence must be present before approval.</p>}{confirming ? <div className="mt-4 flex gap-3"><button type="button" disabled={busy || !finalReady} onClick={() => void save(decision)} className="rounded-lg bg-[#870b3a] px-5 py-3 font-bold text-white disabled:opacity-40">{busy ? 'Saving…' : 'Confirm decision'}</button><button type="button" disabled={busy} onClick={() => setConfirming(false)} className="rounded-lg border px-5 py-3 font-semibold">Cancel</button></div> : <button type="button" disabled={!finalReady} onClick={() => setConfirming(true)} className="mt-4 rounded-lg bg-[#870b3a] px-5 py-3 font-bold text-white disabled:opacity-40">Review final decision</button>}</div>}</section>
      : <p className="rounded-xl border border-rose-100 bg-white p-5">A final decision is recorded. Further changes require a separate supervised process.</p>}
    </div><aside className="h-fit rounded-2xl border border-rose-100 bg-white p-6 shadow-sm"><ShieldCheck className="h-7 w-7 text-[#870b3a]" /><h2 className="mt-3 text-lg font-bold">Approval checklist</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700"><li>Open and review identity evidence.</li><li>Open and review paralegal credentials.</li><li>Check the applicant’s experience and location.</li><li>Record a clear reason before the final decision.</li></ul></aside></div>}
  </Container></main></Layout>;
}

function Field({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words font-semibold text-slate-900">{value}</dd></div>; }
function Document({ label, url }: { label: string; url?: string | null }) { return <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"><div><p className="font-semibold">{label}</p><p className="mt-1 text-xs text-slate-600">{url ? 'Available for review' : 'Missing'}</p></div>{url && <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#870b3a] underline">Open file <ExternalLink size={15} /></a>}</div>; }
