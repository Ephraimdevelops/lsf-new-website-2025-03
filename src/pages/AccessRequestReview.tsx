import { LoadingText } from '@/components/shared/BrandLoading';
import BrandLoading from '@/components/shared/BrandLoading';
import { useStatusLabel } from "@/i18n/useStatusLabel";
import { usePlainError } from "@/i18n/usePlainError";
import { useCopy } from "@/i18n/useCopy";
import { useState } from 'react';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';

export default function AccessRequestReview() {
  const statusLabel = useStatusLabel();
  const readError = usePlainError();
  const c = useCopy();
  const { id } = useParams();
  const requestId = id as Id<'access_requests'> | undefined;
  const access = useQuery(api.users.currentAccess);
  const request = useQuery(api.accessRequests.adminRequestForReview, requestId ? { id: requestId } : 'skip');
  const organizationsPage = usePaginatedQuery(api.justiceServices.staffOrganizationsPage, { status: 'verified' }, { initialNumItems: 20 });
  const [search, setSearch] = useState('');
  const searching = search.trim().length >= 2;
  const searchResults = useQuery(api.justiceServices.staffSearchOrganizations, searching ? { search: search.trim() } : 'skip');
  const organizations = searching ? searchResults : search.trim().length === 1 ? [] : organizationsPage.status === 'LoadingFirstPage' ? undefined : organizationsPage.results;
  const decide = useMutation(api.accessRequests.decide);
  const [organizationId, setOrganizationId] = useState<Id<'justice_service_organizations'> | null>(null);
  const [note, setNote] = useState('');
  const [choice, setChoice] = useState<'approved' | 'rejected' | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<'approved' | 'rejected' | null>(null);
  const selfReview = request?.userId === access?.user?._id || Boolean(request?.invitationEvidence && request.invitationEvidence.invitedBy === access?.user?._id);
  const eligible = organizations?.filter(org => org.verificationStatus === 'verified'
    && (!request?.invitationId || org._id === request.organizationId)
    && (request?.requestedRole !== 'staff' || org.organizationType === 'lsf')
    && (request?.requestedRole !== 'provider_staff' || org.referralAgreementStatus === 'active')) ?? [];
  const selectedOrganization = eligible.find(org => org._id === organizationId);
  const canSubmit = Boolean(request && choice && !selfReview && note.trim().length >= 10 && (choice === 'rejected' || (selectedOrganization && (!request.invitationId || request.invitationEvidence?.inviterStillMember))));

  async function save() {
    if (!request || !choice || !canSubmit || busy) return;
    setBusy(true); setError('');
    try {
      await decide({ requestId: request._id, decision: choice, decisionNote: note.trim(), organizationId: choice === 'approved' ? organizationId! : undefined });
      setSaved(choice);
      setConfirming(false);
    } catch (cause) {
      setError(readError(cause, 'The decision was not saved.'));
    } finally {
      setBusy(false);
    }
  }

  return <Layout><main className="min-h-screen bg-[#fcf9f8] py-10"><Container className="max-w-5xl">
    <Link to="/admin?tab=access" className="inline-flex items-center gap-2 text-sm font-bold text-[#870b3a] underline underline-offset-4"><ArrowLeft size={16} />{c(" Back to access queue")}</Link>
    <header className="mt-6 rounded-3xl bg-gradient-to-r from-[#650b2d] to-[#a31b49] p-7 text-white sm:p-9">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-rose-100">{c("LSF · Access governance")}</p>
      <h1 className="mt-3 text-3xl font-black">{c("Review professional access")}</h1>
      <p className="mt-3 max-w-2xl text-rose-50">{c("Verify the person, requested role and organisation before granting access. The decision is recorded in the audit history.")}</p>
    </header>

    {access === undefined || request === undefined ? <BrandLoading compact text={c("Loading application…")}/>
      : !access?.roles.includes('admin') ? <p className="mt-6 rounded-2xl bg-white p-6">{c("Administrator access is required.")}</p>
      : !request ? <p className="mt-6 rounded-2xl bg-white p-6">{c("Application unavailable.")}</p>
      : saved ? <section role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-8"><ShieldCheck className="h-9 w-9 text-emerald-700" /><h2 className="mt-3 text-2xl font-bold">{saved === 'approved' ? c("Access approved") : 'Application rejected'}</h2><p className="mt-2">{c("The decision has been saved. The applicant’s access and audit record update through the shared platform backend.")}</p><Link className="mt-5 inline-block font-bold text-[#870b3a] underline" to="/admin?tab=access">{c("Return to queue")}</Link></section>
      : request.status !== 'pending' ? <section className="mt-6 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">{c("Already reviewed")}</h2><p className="mt-2">{c("This application is ")}{request.status}{c(". It cannot be decided again.")}</p></section>
      : <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><UserRoundCheck className="h-7 w-7 text-[#870b3a]" /><h2 className="text-xl font-bold">{c("Applicant and request")}</h2></div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label={c("Applicant")} value={request.applicant?.name ?? 'Account unavailable'} />
              <Field label={c("Email")} value={request.applicant?.email ?? 'Unavailable'} />
              <Field label={c("Requested role")} value={statusLabel(request.requestedRole)} />
              <Field label={c("Organisation stated")} value={request.organizationName} />
              <Field label={c("Submitted")} value={new Date(request.submittedAt).toLocaleString('en-TZ')} />
              {request.invitationEvidence && <><Field label={c("Invited by")} value={request.invitationEvidence.inviterName} /><Field label={c("Inviter membership")} value={request.invitationEvidence.inviterStillMember ? c("Currently active") : 'No longer active — approval blocked'} /></>}
            </dl>
            <div className="mt-5 rounded-xl bg-[#fff5f7] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#870b3a]">{c("Reason for applying")}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{request.statement}</p></div>
          </section>
          {selfReview ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">{c("Another administrator must review your own application.")}</p> : <>
            <section className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3"><Building2 className="h-7 w-7 text-[#870b3a]" /><h2 className="text-xl font-bold">{c("Verify the organisation")}</h2></div>
              <p className="mt-2 text-sm text-slate-600">{c("An approved role is linked to the verified organisation you choose here. Provider staff also require an active referral agreement.")}</p>
              {request.invitationId && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-[#870b3a]">{c("This is an accepted staff invitation from ")}{request.organizationName}{c(". Approval must stay with this organisation and requires an administrator other than the inviter.")}</p>}
              <label className="mt-5 block text-sm font-semibold" htmlFor="organization-search">{c("Search verified organisations")}</label>
              <input id="organization-search" className="mt-2 w-full rounded-xl border border-slate-300 p-3" value={search} onChange={event => { setSearch(event.target.value); setOrganizationId(null); setConfirming(false); }} placeholder={c("Search by name (2+ letters)")} />
              <LoadingText as="div" className="mt-4 max-h-72 space-y-2 overflow-y-auto" role="radiogroup" aria-label={c("Verified organisation")}>
                {organizations === undefined ? <BrandLoading compact text={c("Loading organisations…")}/> : search.trim().length === 1 ? <p className="text-sm text-slate-600">{c("Enter at least two letters to search.")}</p> : eligible.length ? eligible.map(org => <label key={org._id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${organizationId === org._id ? 'border-[#870b3a] bg-rose-50' : 'border-slate-200'}`}><input type="radio" name="organization" checked={organizationId === org._id} onChange={() => { setOrganizationId(org._id); setConfirming(false); }} /><span><strong className="block">{org.name}</strong><span className="text-xs capitalize text-slate-600">{statusLabel(org.organizationType)} · {statusLabel(org.referralAgreementStatus)}</span></span></label>) : <p className="text-sm text-slate-600">{c("No eligible organisation in these results. Refine the search or load more.")}</p>}
              </LoadingText>
              {!search.trim() && organizationsPage.status === 'CanLoadMore' && <button type="button" onClick={() => organizationsPage.loadMore(20)} className="mt-3 rounded-lg border border-rose-200 px-4 py-2 text-sm font-bold text-[#870b3a]">{c("Load more organisations")}</button>}
            </section>
            <section className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">{c("Record a decision")}</h2><label htmlFor="decision-note" className="mt-4 block text-sm font-semibold">{c("Auditable reason (at least 10 characters)")}</label><textarea id="decision-note" className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 p-3" maxLength={2000} value={note} onChange={event => { setNote(event.target.value); setConfirming(false); }} /><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => { setChoice('approved'); setConfirming(false); }} className={`rounded-xl border px-5 py-3 font-bold ${choice === 'approved' ? 'border-[#870b3a] bg-[#870b3a] text-white' : 'border-rose-200 text-[#870b3a]'}`}>{c("Approve access")}</button><button type="button" onClick={() => { setChoice('rejected'); setConfirming(false); }} className={`rounded-xl border px-5 py-3 font-bold ${choice === 'rejected' ? 'border-[#870b3a] bg-[#870b3a] text-white' : 'border-rose-200 text-[#870b3a]'}`}>{c("Reject request")}</button></div>
              {choice && <div className="mt-5 rounded-xl bg-[#fff5f7] p-4"><p className="font-semibold">{choice === 'approved' ? `Grant ${statusLabel(request.requestedRole)} access to ${request.applicant?.name ?? 'this applicant'} at ${selectedOrganization?.name ?? 'a selected verified organisation'}?` : `Reject ${request.applicant?.name ?? 'this applicant'}’s request without granting access?`}</p><p className="mt-1 text-sm text-slate-600">{c("This action changes the applicant’s access and creates an audit record.")}</p>{error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}{confirming ? <div className="mt-4 flex gap-3"><button type="button" disabled={busy} onClick={() => void save()} className="rounded-lg bg-[#870b3a] px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? 'Saving…' : c("Confirm decision")}</button><button type="button" disabled={busy} onClick={() => setConfirming(false)} className="rounded-lg border px-5 py-3 font-semibold">{c("Cancel")}</button></div> : <button type="button" disabled={!canSubmit} onClick={() => setConfirming(true)} className="mt-4 rounded-lg bg-[#870b3a] px-5 py-3 font-bold text-white disabled:opacity-40">{c("Review final decision")}</button>}</div>}
            </section>
          </>}
        </div>
        <aside className="h-fit rounded-2xl border border-rose-100 bg-white p-6 shadow-sm"><ShieldCheck className="h-7 w-7 text-[#870b3a]" /><h2 className="mt-3 text-lg font-bold">{c("Review checklist")}</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700"><li>{c("Confirm the applicant and purpose.")}</li><li>{c("Choose an eligible verified organisation for approval.")}</li><li>{c("Record a reason that another reviewer can understand.")}</li><li>{c("Check the final decision before saving.")}</li></ul></aside>
      </div>}
  </Container></main></Layout>;
}

function Field({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words font-semibold capitalize text-slate-900">{value}</dd></div>; }
