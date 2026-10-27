import { LoadingText } from '@/components/shared/BrandLoading';
import { WorkHeader } from "@/components/dashboard/WorkArea";
import { useCopy } from "@/i18n/useCopy";
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import SearchFilterBar from '@/components/shared/SearchFilterBar';
import ParalegalIllustration from '@/components/paralegal/ParalegalIllustration';
import { Button } from '@/components/ui/button';
const statuses = ['submitted', 'in_review', 'responded', 'closed'] as const;
const labels = { submitted: 'New', in_review: 'Being reviewed', responded: 'Replied', closed: 'Closed' };
export default function AdminSupport() {
  const c = useCopy();
  const access = useQuery(api.users.currentAccess); const allowed = access?.roles.some(role => ['admin','staff','supervisor'].includes(role));
  const [params, setParams] = useSearchParams(); const id = params.get('request');
  const [status, setStatus] = useState<typeof statuses[number]>('submitted'); const [search, setSearch] = useState('');
  const rows = useQuery(api.paralegals.staffSupportQueue, allowed ? { status } : 'skip');
  const direct = useQuery(api.paralegals.getStaffSupportRequest, allowed && id ? { id: id as Id<'paralegal_support_requests'> } : 'skip');
  const respond = useMutation(api.paralegals.respondToSupportRequest);
  const [selected, setSelected] = useState<string | null>(id); const [note, setNote] = useState(''); const [review, setReview] = useState<'in_review' | 'responded' | 'closed' | null>(null); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState('');
  useEffect(() => { setSelected(id ?? null); setNote(''); setReview(null); }, [id]);
  const visible = (id ? (direct === undefined ? undefined : direct ? [direct] : []) : rows)?.filter(item => [item.user?.name, item.request.note, item.request.type].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  async function save(request: NonNullable<typeof rows>[number]['request']) { if (!review || busy) return; setBusy(true); setNotice(''); try { await respond({ id: request._id, status: review, expectedUpdatedAt: request.updatedAt, responseNote: note.trim() || undefined }); setSelected(null); setNote(''); setReview(null); setNotice(c('Saved. The paralegal will be notified.')); } catch (error) { setNotice(error instanceof Error ? error.message : c('Could not save.')); } finally { setBusy(false); } }
  if (!allowed) return <LoadingText as="p" role="status">{access === undefined ? c('Loading access…') : c('LSF staff access is required.')}</LoadingText>;
  return <div className="space-y-6"><WorkHeader eyebrow="LSF" title={c("Team support")} description={c("Give a clear next step to a paralegal who needs support.")}/>
    <SearchFilterBar value={search} onChange={setSearch} placeholder={c("Find a request or name")} label={c("Status")} title={c("Request status")} count={Number(status !== 'submitted')} summary={id ? c('Linked request') : c(labels[status])} onReset={() => { setStatus('submitted'); setParams(current => { current.delete('request'); return current; }); }}><label className="block text-sm font-medium">{c("Status")}<select value={status} onChange={event => { setStatus(event.target.value as typeof status); setParams(current => { current.delete('request'); return current; }); setSelected(null); setNote(''); setReview(null); }} className="mt-2 min-h-12 w-full rounded-xl border p-3">{statuses.map(state => <option key={state} value={state}>{c(labels[state])}</option>)}</select></label></SearchFilterBar>
    {!!notice && <p role="status" className="rounded-xl bg-[#e7f4f1] p-4">{notice}</p>}<LoadingText as="p" className="text-sm text-neutral-600">{visible === undefined ? c('Loading requests…') : `${visible.length} ${c('requests shown')}${id ? '' : c(' (up to 100 recent requests in this status)')}.`}</LoadingText>
    {visible?.map(({ request, user }) => <article key={request._id} className="work-form-panel space-y-4"><h2 className="text-lg font-semibold">{user?.name ?? c('Paralegal')}</h2><p className="text-sm text-neutral-600">{c({ supervisor: 'Supervisor guidance', peer_support: 'Peer support', wellbeing: 'Wellbeing', challenging_case: 'Difficult case', payment: 'Payment question' }[request.type])} · {c(labels[request.status])}</p><p className={selected===request._id?"whitespace-pre-wrap leading-7":"line-clamp-2 text-sm leading-6 text-neutral-600"}>{request.note}</p>{request.responseNote && <p className="rounded-xl bg-[#e7f4f1] p-3">{c("Reply:")} {request.responseNote}</p>}{request.status !== 'closed' && <Button variant="outline" onClick={() => { setSelected(request._id); setNote(''); setReview(null); }}>{c("Review and reply")}</Button>}{selected === request._id && request.status !== 'closed' && <div className="space-y-3"><label className="block text-sm font-medium">{c("Reply to the paralegal")}<textarea value={note} onChange={event => { setNote(event.target.value); setReview(null); }} maxLength={3000} placeholder={c("Guidance and next step")} className="mt-2 min-h-28 w-full rounded-xl border p-3" /></label>{!review ? <div className="flex flex-wrap gap-2">{request.status === 'submitted' && <Button variant="outline" onClick={() => setReview('in_review')}>{c("Start reviewing")}</Button>}<Button disabled={note.trim().length < 10} onClick={() => setReview('responded')}>{c("Review reply")}</Button>{request.status === 'responded' && (request.responseNote?.trim().length ?? 0) >= 10 && <Button variant="outline" onClick={() => setReview('closed')}>{c("Review closure")}</Button>}</div> : <div className="space-y-3 rounded-xl bg-[#f8eaf0] p-4"><h3 className="font-semibold">{c("Confirm next step:")} {c(labels[review])}</h3><p className="whitespace-pre-wrap">{note.trim() || request.responseNote || c('The team is starting a review.')}</p><div className="flex flex-wrap gap-2"><Button disabled={busy} onClick={() => void save(request)}>{c("Confirm and save")}</Button><Button variant="outline" onClick={() => setReview(null)}>{c("Edit")}</Button></div></div>}</div>}</article>)}{visible?.length === 0 && <p>{c("No matching request.")}</p>}
  </div>;
}
