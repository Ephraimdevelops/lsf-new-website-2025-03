import { LoadingText } from '@/components/shared/BrandLoading';
import BrandLoading from '@/components/shared/BrandLoading';
import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import { useRef, useState } from 'react';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';

export default function RequestConversation({ requestId }: { requestId: Id<'legal_help_requests'> }) {
  const c = useCopy();
  const { locale } = useLanguage();
  const state = useQuery(api.requestMessages.state, { requestId });
  const { results, status, loadMore } = usePaginatedQuery(api.requestMessages.list, { requestId }, { initialNumItems: 20 });
  const send = useMutation(api.requestMessages.send);
  const [body, setBody] = useState('');
  const [requestInformation, setRequestInformation] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const lock = useRef(false);
  const pending = useRef<{ body: string; requestInformation: boolean; id: string }>();
  async function submit() {
    if (lock.current || !body.trim() || !state?.canSend) return;
    lock.current = true; setBusy(true); setError(''); setNotice('');
    const text = body.trim(); const ask = state.canRequestInformation && requestInformation;
    if (!pending.current || pending.current.body !== text || pending.current.requestInformation !== ask) pending.current = { body: text, requestInformation: ask, id: crypto.randomUUID() };
    try {
      await send({ requestId, body: text, requestInformation: ask, clientMessageId: pending.current.id });
      setBody(''); pending.current = undefined;
      setNotice(ask ? c("Question sent. The request is waiting for a reply.") : state.canRequestInformation ? c("Message sent to the requester.") : c("Message sent. LSF can see your reply in this request."));
    } catch { setError(c("Your message could not be confirmed. Your text is still here; try sending again.")); }
    finally { lock.current = false; setBusy(false); }
  }
  return <section className="space-y-4 rounded-2xl border border-[#D9E8E3] bg-white p-5 sm:p-7" aria-labelledby={`conversation-${requestId}`}>
    <header><h2 id={`conversation-${requestId}`} className="text-xl font-semibold">{c("Messages about this request")}</h2><p className="mt-2 text-sm text-neutral-600">{c("Talk to LSF about this request. Share only what is needed to help.")}</p></header>
    {status === 'CanLoadMore' || status === 'LoadingMore' ? <Button variant="outline" disabled={status === 'LoadingMore'} onClick={() => loadMore(20)}>{status === 'LoadingMore' ? c("Loading…") : c("Show earlier messages")}</Button> : null}
    <LoadingText as="div" className="space-y-3" role="log" aria-label={c("Request messages")} aria-live="polite" aria-relevant="additions">
      {status === 'LoadingFirstPage' ? <BrandLoading compact text={c("Loading messages…")}/> : !results.length ? <p className="rounded-xl bg-[#F2F7F5] p-4 text-sm text-neutral-600">{c("No messages yet. Questions and replies will appear here.")}</p> : [...results].reverse().map(message => <article key={message._id} className={`rounded-xl p-4 ${message.senderKind === 'staff' ? 'border border-[#D9E8E3] bg-[#F2F7F5]' : 'bg-[#FAF2F5]'}`}><div className="flex flex-wrap justify-between gap-2 text-xs text-neutral-600"><strong>{message.senderKind === 'staff' ? c("LSF review team") : state?.canRequestInformation ? c("Requester") : c("You")}</strong><time dateTime={new Date(message.createdAt).toISOString()}>{new Date(message.createdAt).toLocaleString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', { timeZone: 'Africa/Dar_es_Salaam' })}</time></div>{message.requestsInformation && <p className="mt-2 text-xs font-semibold text-primary">{c("Information requested")}</p>}<p className="mt-2 mb-0 whitespace-pre-wrap break-words text-sm leading-6">{message.body}</p></article>)}
    </LoadingText>
    {state?.canSend ? <form onSubmit={event => { event.preventDefault(); void submit(); }} className="space-y-3 border-t pt-4"><label className="block text-sm font-semibold" htmlFor={`reply-${requestId}`}>{state.canRequestInformation ? c("Message to the requester") : c("Your reply to LSF")}</label><textarea id={`reply-${requestId}`} value={body} onChange={event => setBody(event.target.value)} maxLength={3000} disabled={busy} className="min-h-28 w-full rounded-xl border p-3 text-sm" placeholder={state.status === 'waiting_for_information' ? c("Answer the question above in your own words") : c("Write your message")} /><p className="text-right text-xs text-neutral-500">{body.length}/3000</p>{state.canRequestInformation && <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={requestInformation} disabled={busy} onChange={event => setRequestInformation(event.target.checked)} />{c("Ask for information and wait for a reply")}</label>}<Button disabled={busy || !body.trim()} type="submit">{busy ? c("Sending…") : c("Send message")}</Button></form> : state ? <p className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">{c("This request no longer accepts replies. Continue in the case if one has been opened, or contact LSF for help.")}</p> : null}
    {notice && <p role="status" className="text-sm text-[#176A67]">{notice}</p>}{error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </section>;
}
