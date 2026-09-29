import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const label = (value: string) => value.replaceAll("_", " ");
const date = (value: number) => new Date(value).toLocaleString("en-TZ", { timeZone: "Africa/Dar_es_Salaam" });

export default function BeneficiaryCase() {
  const { id } = useParams();
  const cases = useQuery(api.caseManagement.myCases);
  const selected = cases?.find(item => item._id === id);
  return <Layout><main className="mx-auto max-w-5xl px-4 py-10">
    <Link className="text-primary underline" to="/dashboard/user">Back to my workspace</Link>
    {cases === undefined ? <p role="status" className="py-8">Loading your cases…</p> : !selected ? <div className="py-8"><h1 className="text-2xl font-bold">Case unavailable</h1><p>This case is not available in your account. Return to your workspace to choose a case.</p></div> : <CaseWorkspace key={selected._id} caseId={selected._id} />}
  </main></Layout>;
}

function CaseWorkspace({ caseId }: { caseId: Id<"cases"> }) {
  const record = useQuery(api.caseManagement.getCase, { caseId });
  const messages = useQuery(api.caseManagement.listMessages, { caseId });
  const documents = useQuery(api.caseManagement.listDocuments, { caseId });
  const referrals = useQuery(api.referrals.listForCase, { caseId });
  const decideReferralConsent = useMutation(api.referrals.decideBeneficiaryConsent);
  const send = useMutation(api.caseManagement.sendMessage);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [referralBusy, setReferralBusy] = useState<string | null>(null);
  const [referralError, setReferralError] = useState("");
  const pending = useRef<{ body: string; id: string } | null>(null);
  if (!record) return <p role="status" className="py-8">Loading case details…</p>;
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !body.trim()) return;
    setBusy(true); setError("");
    if (pending.current?.body !== body.trim()) pending.current = { body: body.trim(), id: crypto.randomUUID() };
    try {
      await send({ caseId, body: pending.current.body, clientMessageId: pending.current.id });
      setBody(""); pending.current = null;
    } catch { setError("Your message could not be confirmed. Your text is kept here; please try again."); }
    finally { setBusy(false); }
  }
  const panel = "rounded-2xl border border-neutral-200 bg-white p-6";
  return <div className="space-y-6 pt-6">
    <header className="rounded-2xl bg-primary/5 p-6"><p className="text-sm font-semibold text-primary">My case · {record.case.publicId}</p><h1 className="text-2xl font-bold">{record.case.summary}</h1><p className="mt-3 capitalize">{label(record.case.status)}</p><p className="text-sm text-neutral-600">Dates and times shown in Tanzania time.</p></header>
    {record.outcome && <section className={panel}><h2 className="text-xl font-semibold">Recorded outcome</h2><p className="mt-3 whitespace-pre-wrap">{record.outcome.summary}</p></section>}
    <div className="grid gap-6 lg:grid-cols-2">
      <section className={panel}><h2 className="text-xl font-semibold">Referrals and consent</h2><p className="text-sm text-neutral-600">Review the destination and information before a provider receives your referral.</p>
        {referrals === undefined ? <p className="mt-4">Loading referrals…</p> : !referrals.length ? <p className="mt-4">No referrals have been proposed for this case.</p> : referrals.map(referral => <article key={referral._id} className="mt-4 space-y-3 rounded-xl border p-4">
          <p className="font-semibold">{referral.destinationService?.name ?? "Service details unavailable"}</p><p className="text-sm capitalize">{label(referral.status)}</p><p>{referral.reason}</p><div><p className="font-medium">Information proposed for sharing</p><ul className="list-disc pl-5">{referral.informationShared.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
          {referral.status === "awaiting_beneficiary_consent" ? <div className="space-y-3 rounded-xl bg-primary/5 p-4"><p>No information will be sent to this provider until you agree. You can decline and ask LSF for another option.</p><div className="flex flex-wrap gap-2"><Button disabled={Boolean(referralBusy)} onClick={async () => { setReferralBusy(referral._id); setReferralError(""); try { await decideReferralConsent({ referralId: referral._id, decision: "approved" }); } catch { setReferralError("Your decision could not be saved. Please try again."); } finally { setReferralBusy(null); } }}>I agree to this referral</Button><Button variant="outline" disabled={Boolean(referralBusy)} onClick={async () => { setReferralBusy(referral._id); setReferralError(""); try { await decideReferralConsent({ referralId: referral._id, decision: "declined" }); } catch { setReferralError("Your decision could not be saved. Please try again."); } finally { setReferralBusy(null); } }}>I do not agree</Button></div></div> : <p className="text-sm">{referral.consent?.granted ? "You agreed to this referral." : "No consent recorded for this referral."}</p>}
        </article>)}{referralError && <p role="alert" className="mt-3 text-red-700">{referralError}</p>}
      </section>
      <section className={panel}><h2 className="text-xl font-semibold">Messages</h2><p className="text-sm text-neutral-600">Communicate with your case team. Responses are not instant.</p>
        <div className="my-4 max-h-96 space-y-3 overflow-y-auto" aria-live="polite">{messages === undefined ? <p>Loading messages…</p> : !messages.length ? <p>No messages yet.</p> : messages.map(message => <article key={message._id} className="rounded-xl bg-neutral-50 p-3"><p className="whitespace-pre-wrap break-words">{message.body}</p><time className="text-xs text-neutral-500">{date(message.createdAt)}</time></article>)}</div>
        <form onSubmit={submit}><label htmlFor="case-message" className="block text-sm font-medium">Message to your case team</label><textarea id="case-message" className="mt-2 min-h-28 w-full rounded-lg border p-3" value={body} disabled={busy} onChange={event => setBody(event.target.value)} required />{error && <p role="alert" className="my-2 text-red-700">{error}</p>}<Button disabled={busy || !body.trim()} type="submit">{busy ? "Sending…" : "Send message"}</Button></form>
      </section>
      <section className={panel}><h2 className="text-xl font-semibold">Appointments</h2>{!record.appointments.length ? <p className="mt-4">No appointments scheduled.</p> : record.appointments.map(item => <article className="border-b py-4" key={item._id}><p>{date(item.startsAt)}</p><p className="capitalize">{label(item.mode)} · {label(item.status)}</p>{item.location && <p>{item.location}</p>}</article>)}{!["resolved", "closed_unresolved", "closed"].includes(record.case.status) && <AppointmentRequest caseId={caseId} />}</section>
      <section className={panel}><h2 className="text-xl font-semibold">Documents</h2>{documents === undefined ? <p>Loading documents…</p> : !documents.length ? <p className="mt-4">No documents attached yet.</p> : documents.map(item => <article key={item._id} className="border-b py-4"><p className="font-medium">{item.name}</p><p className="text-sm capitalize">{label(item.status)}</p>{item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Open document</a>}{item.textContent && <details><summary>Read document text</summary><p className="whitespace-pre-wrap">{item.textContent}</p></details>}</article>)}</section>
      <section className={panel}><h2 className="text-xl font-semibold">Case history</h2>{!record.events.length ? <p className="mt-4">No updates recorded yet.</p> : <ol>{record.events.map(item => <li key={item._id} className="border-b py-3"><p className="capitalize">{label(item.type)}</p><time className="text-xs text-neutral-500">{date(item.occurredAt)}</time></li>)}</ol>}</section>
    </div>
  </div>;
}

function AppointmentRequest({ caseId }: { caseId: Id<"cases"> }) {
  const request = useMutation(api.caseManagement.requestAppointment);
  const [mode, setMode] = useState<"phone" | "remote" | "in_person">("phone");
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  return <form className="mt-6 space-y-3 border-t pt-4" onSubmit={async event => {
    event.preventDefault(); if (busy || sent) return;
    setBusy(true); setError("");
    try { await request({ caseId, preferredMode: mode, preferredTime: time }); setSent(true); }
    catch { setError("We could not confirm your request. Check the case history before submitting again."); }
    finally { setBusy(false); }
  }}><h3 className="font-semibold">Request an appointment</h3><p className="text-sm text-neutral-600">Your case team must confirm the appointment before it is scheduled.</p>
    {sent ? <p role="status">Request submitted. Your team will confirm a suitable time.</p> : <>
      <label className="block" htmlFor="appointment-mode">How would you like to meet?</label><select id="appointment-mode" className="w-full rounded-lg border p-2" disabled={busy} value={mode} onChange={event => setMode(event.target.value as typeof mode)}><option value="phone">Phone</option><option value="remote">Online</option><option value="in_person">In person</option></select>
      <label className="block" htmlFor="appointment-time">Preferred day and time (Tanzania time)</label><input id="appointment-time" className="w-full rounded-lg border p-2" maxLength={160} required disabled={busy} value={time} onChange={event => setTime(event.target.value)} placeholder="For example, Monday afternoon" />
      {error && <p role="alert" className="text-red-700">{error}</p>}<Button disabled={busy} type="submit">{busy ? "Submitting…" : "Request appointment"}</Button>
    </>}
  </form>;
}
