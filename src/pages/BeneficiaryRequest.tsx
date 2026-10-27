import BrandLoading from '@/components/shared/BrandLoading';
import { WorkHeader } from "@/components/dashboard/WorkArea";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import RequestConversation from '@/components/haki-yangu/RequestConversation';
import { requestLabels, requestNextStep, requestReachedStages } from '../../mobile/src/requestProgress';

export default function BeneficiaryRequest() {
  const c = useCopy();
  const { locale } = useLanguage();
  const { id } = useParams();
  const requests = useQuery(api.legalHelp.myRequests, {});
  const owns = requests?.some(item => item._id === id);
  const detail = useQuery(api.legalHelp.getMyRequest, owns ? { requestId: id as Id<'legal_help_requests'> } : 'skip');
  const withdraw = useMutation(api.legalHelp.withdrawMyRequest);
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  return <Layout><main className="work-page"><Link className="mb-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary" to="/dashboard/user">{c("← My account")}</Link><WorkHeader eyebrow={c("Haki Yangu · My request")} title={detail?.request.publicId ?? c("Your request, step by step.")} description={c("See what LSF has received and what happens next.")}/>
      {requests === undefined || (owns && detail === undefined) ? <BrandLoading compact text={c("Loading your request…")}/> : !owns || !detail ? <div role="alert" className="rounded-2xl border p-7"><h2 className="text-xl font-semibold">{c("Request unavailable")}</h2><p className="mt-2">{c("This request is not available in your account.")}</p><Link to="/dashboard/user" className="mt-4 inline-block text-primary underline">{c("Back to my account")}</Link></div> : <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-2xl border border-[#D9E8E3] bg-[#EEF5F3] p-6"><p className="text-xs font-semibold text-neutral-600">{detail.request.publicId}</p><h2 className="mt-2 text-2xl font-semibold">{requestLabels[detail.request.status]?.[locale] ?? c("Request update")}</h2><p className="mt-3 leading-7 text-neutral-700">{requestNextStep(detail.request.status, locale)}</p>{detail.caseId && <Button asChild className="mt-4"><Link to={`/dashboard/user/cases/${detail.caseId}`}>{c("Open your case")}</Link></Button>}</section>
          <RequestConversation key={detail.request._id} requestId={detail.request._id} />
          <details className="rounded-2xl border bg-white p-6"><summary className="min-h-11 cursor-pointer text-lg font-semibold">{c("Your request details")}</summary><p className="mt-3 text-sm text-neutral-600">{detail.request.submittedAt ? `${locale === 'sw' ? 'Limetumwa' : 'Submitted'} ${new Date(detail.request.submittedAt).toLocaleString((locale === 'sw' ? 'sw-TZ' : 'en-TZ'), { timeZone: 'Africa/Dar_es_Salaam' })}` : c("Not submitted yet")}</p><h3 className="mt-5 font-semibold">{c("Your situation")}</h3><p className="mt-2 whitespace-pre-wrap break-words leading-7">{detail.request.description || c("No description saved.")}</p><h3 className="mt-5 font-semibold">{c("What you asked for")}</h3><p className="mt-2 whitespace-pre-wrap break-words">{detail.request.desiredHelp || c("Not specified")}</p><p className="mt-5 text-sm text-neutral-600">{[detail.request.district, detail.request.region].filter(Boolean).join(', ')}</p>{detail.sourceService && <p className="mt-3 text-sm">{c("Found via: ")}{detail.sourceService.name}</p>}<h3 className="mt-6 font-semibold">{c("Evidence sent with this request")}</h3>{detail.attachments.length ? <ul className="mt-3 space-y-2">{detail.attachments.map(item => <li key={item._id} className="break-words rounded-xl bg-[#FFF9F8] p-3 text-sm">{item.url ? <a className="font-semibold text-primary underline" href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a> : <span>{item.name}{c(" · unavailable for download")}</span>}<span className="ml-2 text-neutral-600">{Math.ceil(item.size / 1024)} KB</span></li>)}</ul> : <p className="mt-2 text-sm text-neutral-600">{c("No evidence was attached.")}</p>}</details>
        </div>
        <aside className="space-y-5"><section className="rounded-2xl border bg-white p-6"><h2 className="text-lg font-semibold">{c("Progress so far")}</h2><ol className="mt-4 space-y-4">{requestReachedStages(detail.request.status).map(stage => <li key={stage} className="flex gap-3 text-sm"><span className="text-[#176A67]" aria-hidden="true">✓</span>{requestLabels[stage]?.[locale]}</li>)}</ol></section><section className="rounded-2xl border bg-white p-6"><h2 className="text-lg font-semibold">{c("Need more help?")}</h2><Link className="mt-3 block min-h-11 py-2 text-primary underline" to="/find-help">{c("Find nearby help")}</Link><Link className="block min-h-11 py-2 text-primary underline" to="/contact">{c("Contact LSF")}</Link></section>
          {['submitted', 'under_review', 'waiting_for_information'].includes(detail.request.status) && <section className="rounded-2xl border bg-white p-6"><h2 className="text-lg font-semibold">{c("Withdraw this request")}</h2><p className="mt-2 text-sm text-neutral-600">{c("LSF will stop reviewing it. Your request history will remain.")}</p>{confirmWithdraw ? <div className="mt-4 space-y-3"><p className="text-sm font-semibold">{c("Are you sure you want to withdraw?")}</p><div className="flex flex-wrap gap-2"><Button variant="destructive" disabled={busy} onClick={async () => { setBusy(true); setError(''); try { await withdraw({ requestId: detail.request._id }); setConfirmWithdraw(false); } catch { setError(c("We could not confirm the withdrawal. Check the request status before retrying.")); } finally { setBusy(false); } }}>{busy ? c("Withdrawing…") : c("Yes, withdraw")}</Button><Button variant="outline" disabled={busy} onClick={() => setConfirmWithdraw(false)}>{c("Keep request")}</Button></div></div> : <Button className="mt-4" variant="outline" onClick={() => setConfirmWithdraw(true)}>{c("Withdraw request")}</Button>}{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</section>}
        </aside>
      </div>}
  </main></Layout>;
}
