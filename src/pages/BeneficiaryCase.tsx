import { LoadingText } from '@/components/shared/BrandLoading';
import BrandLoading from '@/components/shared/BrandLoading';
import { WorkHeader, WorkPanel } from "@/components/dashboard/WorkArea";
import { displayLabel } from "../../shared/plainLanguage";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import { CaseDocumentUpload } from "@/components/paralegal/CaseMedia";
import CasePresence from "@/components/location/CasePresence";
import { useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";


const date = (value: number, locale: 'sw' | 'en') => new Date(value).toLocaleString((locale === "sw" ? "sw-TZ" : "en-TZ"), { timeZone: "Africa/Dar_es_Salaam" });

export default function BeneficiaryCase() {
  const c = useCopy();
  const { locale } = useLanguage();
  const { id } = useParams();
  const access = useQuery(api.users.currentAccess);
  const allCases = useQuery(api.caseManagement.myCases);
  const cases = access === undefined ? undefined : allCases?.filter(item => item.beneficiaryId === access.user._id);
  const selected = cases?.find(item => item._id === id);
  return <Layout><main className="work-page mx-auto max-w-5xl px-4 py-10">
    <Link className="text-primary underline" to="/dashboard/user">{c("Back to my account")}</Link>
    {cases === undefined ? <BrandLoading compact text={c("Loading your cases…")}/> : !selected ? <div className="py-8"><h1 className="text-2xl font-bold">{c("Case unavailable")}</h1><p>{c("This case is not available in your account. Return to your workspace to choose a case.")}</p></div> : <CaseWorkspace key={selected._id} caseId={selected._id} />}
  </main></Layout>;
}

function CaseWorkspace({ caseId }: { caseId: Id<"cases"> }) {
  const [params, setParams] = useSearchParams();
  const areas = ['overview','messages','appointments','documents','referrals','support','history'];
  const area = areas.includes(params.get('section') ?? '') ? params.get('section')! : 'overview';
  const c = useCopy();
  const { locale } = useLanguage();
  const record = useQuery(api.caseManagement.getCase, { caseId });
  const messages = useQuery(api.caseManagement.listMessages, { caseId });
  const documents = useQuery(api.caseManagement.listDocuments, { caseId });
  const referrals = useQuery(api.referrals.listForCase, { caseId });
  const decideReferralConsent = useMutation(api.referrals.decideBeneficiaryConsent);
  const send = useMutation(api.caseManagement.sendMessage);
  const submitFeedback = useMutation(api.caseManagement.submitFeedback);
  const requestCaseReview = useMutation(api.caseManagement.requestCaseReview);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [referralBusy, setReferralBusy] = useState<string | null>(null);
  const [referralError, setReferralError] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [reviewReason, setReviewReason] = useState<"reassignment" | "service_concern" | "safety_concern" | "other">("service_concern");
  const [reviewNote, setReviewNote] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const reviewAttempt = useRef<{ payload: string; id: string } | null>(null);
  const reviewLock = useRef(false);
  const pending = useRef<{ body: string; id: string } | null>(null);
  if (!record) return <BrandLoading compact text={c("Loading case details…")}/>;
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !body.trim()) return;
    setBusy(true); setError("");
    if (pending.current?.body !== body.trim()) pending.current = { body: body.trim(), id: crypto.randomUUID() };
    try {
      await send({ caseId, body: pending.current.body, clientMessageId: pending.current.id });
      setBody(""); pending.current = null;
    } catch { setError(c("Your message could not be confirmed. Your text is kept here; please try again.")); }
    finally { setBusy(false); }
  }
  const panel = "work-form-panel";
  return <div className="space-y-6 pt-6">
    <CasePresence caseId={caseId} />
    <WorkHeader eyebrow={c("My case")} title={record.case.publicId} description={displayLabel(record.case.status,locale)}/>
    <nav className="work-tabs" aria-label={c("Case work areas")}>{[['overview',c('Next step')],['messages',c('Messages')],['appointments',c('Appointments')],['documents',c('Documents')],['referrals',c('Other service')],['support',c('Help and feedback')],['history',c('History')]].map(([value,label])=><button key={value} type="button" aria-current={area===value?'page':undefined} onClick={()=>setParams(current=>{const next=new URLSearchParams(current);next.set('section',value);return next;})}>{label}</button>)}</nav>
    <section className={panel} hidden={area!=='overview'}><h2>{c("Case summary")}</h2><p className="mt-3 whitespace-pre-wrap leading-7">{record.case.summary}</p><div className="mt-5 flex flex-wrap gap-3"><button className="work-action" onClick={()=>setParams({section:'messages'})}>{c("Open case messages")}</button><button className="work-action is-secondary" onClick={()=>setParams({section:'support'})}>{c("Help and feedback")}</button></div></section>

    {record.outcome && <section className={panel} hidden={area!=="overview"}><h2 className="text-xl font-semibold">{c("Recorded outcome")}</h2><p className="mt-3 whitespace-pre-wrap">{record.outcome.summary}</p></section>}
    <section className={panel} hidden={area!=="support"}><h2 className="text-xl font-semibold">{c("Next steps and feedback")}</h2>
      {record.reviewRequests?.length ? <div className="mt-3 space-y-2">{record.reviewRequests.map(item => <p key={item._id} className="rounded-lg bg-primary/5 p-3 text-sm">{c("LSF review: ")}{displayLabel(item.reason, locale)} · {displayLabel(item.status, locale)}</p>)}</div> : null}
      {!["closed", "closed_unresolved"].includes(record.case.status) && !record.reviewRequests?.some(item => ["submitted", "under_review"].includes(item.status)) ? <form className="mt-4 space-y-3" onSubmit={async event => { event.preventDefault(); if (reviewLock.current) return; reviewLock.current = true; setActionBusy(true); setActionError(""); const payload = JSON.stringify([caseId, reviewReason, reviewNote.trim()]); if (reviewAttempt.current?.payload !== payload) reviewAttempt.current = { payload, id: crypto.randomUUID() }; try { await requestCaseReview({ caseId, clientActionId: reviewAttempt.current.id, reason: reviewReason, note: reviewNote.trim() || undefined }); setReviewNote(""); reviewAttempt.current = null; } catch { setActionError(c("Your review request could not be confirmed. Your details are still here; try again safely.")); } finally { reviewLock.current = false; setActionBusy(false); } }}><h3 className="font-semibold">{c("Ask LSF to review your case")}</h3><p className="text-sm text-neutral-600">{c("Ask for a review if help is delayed, unsuitable or unsafe. This does not reopen a closed case.")}</p><label className="block text-sm font-medium" htmlFor="review-reason">{c("Reason")}</label><select id="review-reason" className="w-full rounded-lg border p-2" value={reviewReason} onChange={event => setReviewReason(event.target.value as typeof reviewReason)}><option value="service_concern">{c("Concern about support")}</option><option value="reassignment">{c("Request another helper")}</option><option value="safety_concern">{c("Safety concern")}</option><option value="other">{c("Other")}</option></select><label className="block text-sm font-medium" htmlFor="review-note">{c("What should LSF know? (optional)")}</label><textarea id="review-note" className="min-h-24 w-full rounded-lg border p-3" maxLength={1200} value={reviewNote} onChange={event => setReviewNote(event.target.value)} /><Button type="submit" disabled={actionBusy}>{actionBusy ? c("Sending…") : c("Request review")}</Button></form> : null}
      {record.feedback ? <p className="mt-4 rounded-lg bg-green-50 p-3">{c("Thank you. Your ")}{record.feedback.rating}{c("-star feedback was recorded.")}</p> : record.outcome && ["resolved", "closed_unresolved", "closed"].includes(record.case.status) ? <form className="mt-5 space-y-3 border-t pt-4" onSubmit={async event => { event.preventDefault(); setActionBusy(true); setActionError(""); try { await submitFeedback({ caseId, rating, comment: feedbackComment.trim() || undefined }); setFeedbackComment(""); } catch { setActionError(c("Your feedback could not be confirmed. Please try again.")); } finally { setActionBusy(false); } }}><h3 className="font-semibold">{c("How was the support?")}</h3><label className="block text-sm font-medium" htmlFor="feedback-rating">{c("Rating")}</label><select id="feedback-rating" className="w-full rounded-lg border p-2" value={rating} onChange={event => setRating(Number(event.target.value))}>{[5,4,3,2,1].map(value => <option key={value} value={value}>{value}{c(" of 5")}</option>)}</select><label className="block text-sm font-medium" htmlFor="feedback-comment">{c("Tell us more (optional)")}</label><textarea id="feedback-comment" className="min-h-24 w-full rounded-lg border p-3" maxLength={2000} value={feedbackComment} onChange={event => setFeedbackComment(event.target.value)} /><Button type="submit" disabled={actionBusy}>{actionBusy ? c("Submitting…") : c("Send feedback")}</Button></form> : null}
      {actionError && <p role="alert" className="mt-3 text-red-700">{actionError}</p>}
      {["closed", "closed_unresolved"].includes(record.case.status) && <p className="mt-4 text-sm">{c("This case is closed. If you still need help, ")}<Link className="text-primary underline" to="/request-help">{c("start a new request")}</Link>.</p>}
    </section>
    <div className="space-y-6 work-case-areas">
      <section className={panel} hidden={area!=="referrals"}><h2 className="text-xl font-semibold">{c("Referrals and consent")}</h2><p className="text-sm text-neutral-600">{c("Review the destination and information before a provider receives your referral.")}</p>
        {referrals === undefined ? <BrandLoading compact text={c("Loading referrals…")}/> : !referrals.length ? <p className="mt-4">{c("No referrals have been proposed for this case.")}</p> : referrals.map(referral => <article key={referral._id} className="mt-4 space-y-3 rounded-xl border p-4">
          <p className="font-semibold">{referral.destinationService?.name ?? c("Service details unavailable")}</p><p className="text-sm capitalize">{displayLabel(referral.status, locale)}</p><p>{referral.reason}</p><div><p className="font-medium">{c("Information proposed for sharing")}</p><ul className="list-disc pl-5">{referral.informationShared.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
          {referral.status === "awaiting_beneficiary_consent" ? <div className="space-y-3 rounded-xl bg-primary/5 p-4"><p>{c("No information will be sent to this provider until you agree. You can decline and ask LSF for another option.")}</p><div className="flex flex-wrap gap-2"><Button disabled={Boolean(referralBusy)} onClick={async () => { setReferralBusy(referral._id); setReferralError(""); try { await decideReferralConsent({ referralId: referral._id, decision: "approved" }); } catch { setReferralError(c("We could not confirm your decision. Check the referral status before retrying.")); } finally { setReferralBusy(null); } }}>{c("I agree to this referral")}</Button><Button variant="outline" disabled={Boolean(referralBusy)} onClick={async () => { setReferralBusy(referral._id); setReferralError(""); try { await decideReferralConsent({ referralId: referral._id, decision: "declined" }); } catch { setReferralError(c("We could not confirm your decision. Check the referral status before retrying.")); } finally { setReferralBusy(null); } }}>{c("I do not agree")}</Button></div></div> : <p className="text-sm">{referral.consent?.granted ? c("You agreed to this referral.") : c("No consent recorded for this referral.")}</p>}
        </article>)}{referralError && <p role="alert" className="mt-3 text-red-700">{referralError}</p>}
      </section>
      <section className={panel} hidden={area!=="messages"}><h2 className="text-xl font-semibold">{c("Messages")}</h2><p className="text-sm text-neutral-600">{c("Communicate with your case team. Responses are not instant.")}</p>
        <LoadingText as="div" className="my-4 max-h-96 space-y-3 overflow-y-auto" aria-live="polite">{messages === undefined ? <BrandLoading compact text={c("Loading messages…")}/> : !messages.length ? <p>{c("No messages yet.")}</p> : messages.map(message => <article key={message._id} className="rounded-xl bg-neutral-50 p-3"><p className="whitespace-pre-wrap break-words">{message.body}</p><time className="text-xs text-neutral-500">{date(message.createdAt, locale)}</time></article>)}</LoadingText>
        <form onSubmit={submit}><label htmlFor="case-message" className="block text-sm font-medium">{c("Message to your case team")}</label><textarea id="case-message" className="mt-2 min-h-28 w-full rounded-lg border p-3" value={body} disabled={busy} onChange={event => setBody(event.target.value)} required />{error && <p role="alert" className="my-2 text-red-700">{error}</p>}<Button disabled={busy || !body.trim()} type="submit">{busy ? c("Sending…") : c("Send message")}</Button></form>
      </section>
      <section className={panel} hidden={area!=="appointments"}><h2 className="text-xl font-semibold">{c("Appointments")}</h2>{!record.appointments.length ? <p className="mt-4">{c("No appointments scheduled.")}</p> : record.appointments.map(item => <article className="border-b py-4" key={item._id}><p>{date(item.startsAt, locale)}</p><p className="capitalize">{displayLabel(item.mode, locale)} · {displayLabel(item.status, locale)}</p>{item.location && <p>{item.location}</p>}</article>)}{!["resolved", "closed_unresolved", "closed"].includes(record.case.status) && <AppointmentRequest caseId={caseId} />}</section>
      <section className={panel} hidden={area!=="documents"}><h2 className="text-xl font-semibold">{c("Documents")}</h2><Link className="text-sm text-primary underline" to="/dashboard/user/documents">{c("View all my documents")}</Link>{documents === undefined ? <BrandLoading compact text={c("Loading documents…")}/> : !documents.length ? <p className="mt-4">{c("No documents attached yet.")}</p> : documents.map(item => <article key={item._id} className="border-b py-4"><p className="font-medium">{item.name}</p><p className="text-sm capitalize">{displayLabel(item.status, locale)} · {displayLabel(item.category, locale)}</p>{item.reviewNotes && <p className="text-sm">{c("Review note: ")}{item.reviewNotes}</p>}{item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{c("Open document")}</a>}{item.textContent && <details><summary>{c("Read document text")}</summary><p className="whitespace-pre-wrap">{item.textContent}</p></details>}</article>)}
        {record.case.status !== "closed" && <div className="mt-5"><CaseDocumentUpload caseId={caseId} /></div>}
      </section>
      <section className={panel} hidden={area!=="history"}><h2 className="text-xl font-semibold">{c("Case history")}</h2>{!record.events.length ? <p className="mt-4">{c("No updates recorded yet.")}</p> : <ol>{record.events.map(item => <li key={item._id} className="border-b py-3"><p className="capitalize">{displayLabel(item.type, locale)}</p><time className="text-xs text-neutral-500">{date(item.occurredAt, locale)}</time></li>)}</ol>}</section>
    </div>
  </div>;
}

function AppointmentRequest({ caseId }: { caseId: Id<"cases"> }) {
  const c = useCopy();
  const { locale } = useLanguage();
  const request = useMutation(api.caseManagement.requestAppointment);
  const attempt = useRef<{ payload: string; id: string } | null>(null);
  const lock = useRef(false);
  const [mode, setMode] = useState<"phone" | "remote" | "in_person">("phone");
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  return <form className="mt-6 space-y-3 border-t pt-4" onSubmit={async event => {
    event.preventDefault(); if (lock.current || busy || sent) return;
    lock.current = true;
    const payload = JSON.stringify([caseId, mode, time.trim()]);
    if (attempt.current?.payload !== payload) attempt.current = { payload, id: crypto.randomUUID() };
    setBusy(true); setError("");
    try { await request({ caseId, clientActionId: attempt.current.id, preferredMode: mode, preferredTime: time.trim() }); setSent(true); }
    catch { setError(c("We could not confirm your request. Your details are still here; try again safely.")); }
    finally { lock.current = false; setBusy(false); }
  }}><h3 className="font-semibold">{c("Request an appointment")}</h3><p className="text-sm text-neutral-600">{c("Your case team must confirm the appointment before it is scheduled.")}</p>
    {sent ? <p role="status">{c("Request sent. Your team will reply about a suitable time.")}</p> : <>
      <label className="block" htmlFor="appointment-mode">{c("How would you like to meet?")}</label><select id="appointment-mode" className="w-full rounded-lg border p-2" disabled={busy} value={mode} onChange={event => setMode(event.target.value as typeof mode)}><option value="phone">{c("Phone")}</option><option value="remote">{c("Online")}</option><option value="in_person">{c("In person")}</option></select>
      <label className="block" htmlFor="appointment-time">{c("Preferred day and time (Tanzania time)")}</label><input id="appointment-time" className="w-full rounded-lg border p-2" maxLength={160} required disabled={busy} value={time} onChange={event => setTime(event.target.value)} placeholder={c("For example, Monday afternoon")} />
      {error && <p role="alert" className="text-red-700">{error}</p>}<Button disabled={busy} type="submit">{busy ? c("Submitting…") : c("Request appointment")}</Button>
    </>}
  </form>;
}
