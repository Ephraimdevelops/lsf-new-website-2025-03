import { useLanguage } from "@/providers/LanguageProvider";
import BrandLoading from '@/components/shared/BrandLoading';
import { useCopy } from "@/i18n/useCopy";
import { usePlainError } from "@/i18n/usePlainError";
import { useState } from 'react';
import ParalegalIllustration from '@/components/paralegal/ParalegalIllustration';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export function ProviderInviteInbox({ hideWhenEmpty = false }: { hideWhenEmpty?: boolean }) {
  const c = useCopy(); const { locale } = useLanguage();
  const readError = usePlainError();
  const invitations = useQuery(api.providerInvitations.mine, {});
  const respond = useMutation(api.providerInvitations.respond);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  async function decide(id: Id<'provider_invitations'>, accept: boolean) {
    setBusy(id); setMessage('');
    try { await respond({ id, accept }); setMessage(accept ? c("Accepted. LSF must approve your membership before you receive work access.") : c("Invitation declined.")); }
    catch (error) { setMessage(readError(error, 'Could not respond. Try again.')); }
    finally { setBusy(null); }
  }
  if (hideWhenEmpty && !message && (!invitations || invitations.length === 0)) return null;
  return <section className="my-6 rounded-2xl border border-rose-100 bg-white p-6">
    <h2 className="text-xl font-bold">{c("Team invitations")}</h2>
    <p className="mt-2 text-sm text-gray-600">{c("Invitations appear for the email address on your account. Acceptance sends your membership to LSF for review.")}</p>
    {invitations === undefined ? <BrandLoading compact text={"Loading invitations\u2026"}/> : invitations.length === 0 ? <p className="mt-4 text-sm text-gray-600">{c("No active invitations.")}</p> : invitations.map(item => <article key={item.id} className="mt-4 rounded-xl border p-4"><h3 className="font-semibold">{item.organizationName}</h3><p className="text-sm">{c("Provider staff")} · {c("Expires:")} {new Date(item.expiresAt).toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', { timeZone: 'Africa/Dar_es_Salaam' })}</p><div className="mt-3 flex gap-3"><button disabled={busy !== null} onClick={() => void decide(item.id, true)} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white disabled:opacity-50">{c("Accept for LSF review")}</button><button disabled={busy !== null} onClick={() => void decide(item.id, false)} className="rounded-xl border px-4 py-2 disabled:opacity-50">{c("Decline")}</button></div></article>)}
    {message && <p role="status" className="mt-4 text-sm">{message}</p>}
  </section>;
}

export function ProviderInviteManager({ organizationId }: { organizationId: Id<'justice_service_organizations'> }) {
  const c = useCopy(); const { locale } = useLanguage();
  const readError = usePlainError();
  const invitations = useQuery(api.providerInvitations.listForOrganisation, { organizationId });
  const create = useMutation(api.providerInvitations.create);
  const cancel = useMutation(api.providerInvitations.cancel);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const statusLabels: Record<string, string> = { pending: 'Waiting for a reply', accepted: 'Accepted', declined: 'Declined', cancelled: 'Cancelled', expired: 'Expired' };
  async function invite(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try { await create({ organizationId, email }); setEmail(''); setMessage(c("Invitation created. Ask your colleague to sign in with this email and open Join. LSF approval is required.")); }
    catch (error) { setMessage(readError(error, 'Could not create invitation.')); }
    finally { setBusy(false); }
  }
  async function withdraw(id: Id<'provider_invitations'>) {
    setBusy(true); setMessage('');
    try { await cancel({ id }); setMessage(c("Invitation cancelled.")); }
    catch (error) { setMessage(readError(error, 'Could not cancel invitation.')); }
    finally { setBusy(false); }
  }
  return <section className="rounded-3xl border border-[#EFDFE3] bg-white p-6">
<div className="flex items-center gap-3"><div className="flex-1"><h2 className="text-xl font-bold">{c("Invite a colleague")}</h2><p className="mt-2 text-sm text-gray-600">{c("Your colleague accepts. LSF then approves work access. The invitation lasts seven days.")}</p></div><ParalegalIllustration pose="contact" size={64} /></div>
    <button type="button" aria-expanded={showForm} onClick={() => setShowForm(value => !value)} className="mt-3 min-h-11 text-sm font-semibold text-primary">{showForm ? c("Hide form") : c("New invitation")}</button>
    {showForm && <form onSubmit={event => void invite(event)} className="mt-4 space-y-3"><label className="block text-sm font-semibold">{c("Colleague’s account email")}<input type="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label><button disabled={busy} className="rounded-xl bg-primary px-4 py-3 font-semibold text-white disabled:opacity-50">{c("Create invitation")}</button></form>}
    {message && <p role="status" className="mt-4 text-sm">{message}</p>}
    <h3 className="mt-6 font-semibold">{c("Recent invitations")}</h3>
    {invitations === undefined ? <BrandLoading compact text={"Loading invitations\u2026"}/> : invitations.length === 0 ? <p className="mt-2 text-sm">{c("No invitations yet.")}</p> : <ul className="mt-3 space-y-3">{invitations.map(item => <li key={item._id} className="rounded-xl border p-3"><p className="break-all text-sm font-semibold">{item.email}</p><p className="text-xs">{item.status === 'pending' && item.expiresAt <= Date.now() ? c("Expired") : c(statusLabels[item.status] ?? "Status unavailable")} · {c("Expires:")} {new Date(item.expiresAt).toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', { timeZone: 'Africa/Dar_es_Salaam' })}</p>{item.status === 'accepted' && <p className="mt-2 text-sm">{item.accessReviewStatus === 'pending' ? c("Waiting for LSF approval. Work access has not been granted.") : item.accessReviewStatus === 'rejected' ? c("LSF declined the access request.") : item.accessReviewStatus === 'approved' ? (item.hasActiveMembership ? c("LSF approved · organisation membership active.") : c("LSF approved previously · organisation membership is not currently active.")) : c("Review status unavailable. Contact LSF before assuming access.")}</p>}{item.status === 'pending' && item.expiresAt > Date.now() && <button disabled={busy} onClick={() => void withdraw(item._id)} className="mt-2 text-sm font-semibold text-primary underline">{c("Cancel invitation")}</button>}</li>)}</ul>}
  </section>;
}
