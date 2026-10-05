import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export function ProviderInviteInbox({ hideWhenEmpty = false }: { hideWhenEmpty?: boolean }) {
  const invitations = useQuery(api.providerInvitations.mine, {});
  const respond = useMutation(api.providerInvitations.respond);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  async function decide(id: Id<'provider_invitations'>, accept: boolean) {
    setBusy(id); setMessage('');
    try { await respond({ id, accept }); setMessage(accept ? 'Accepted. LSF must approve your membership before you receive work access.' : 'Invitation declined.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not respond. Try again.'); }
    finally { setBusy(null); }
  }
  if (hideWhenEmpty && !message && (!invitations || invitations.length === 0)) return null;
  return <section className="my-6 rounded-2xl border border-rose-100 bg-white p-6">
    <h2 className="text-xl font-bold">Team invitations</h2>
    <p className="mt-2 text-sm text-gray-600">Invitations appear for the email address on your account. Acceptance sends your membership to LSF for review.</p>
    {invitations === undefined ? <p role="status" className="mt-4">Loading invitations…</p> : invitations.length === 0 ? <p className="mt-4 text-sm text-gray-600">No active invitations.</p> : invitations.map(item => <article key={item.id} className="mt-4 rounded-xl border p-4"><h3 className="font-semibold">{item.organizationName}</h3><p className="text-sm">Provider staff · expires {new Date(item.expiresAt).toLocaleDateString('en-TZ')}</p><div className="mt-3 flex gap-3"><button disabled={busy !== null} onClick={() => void decide(item.id, true)} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white disabled:opacity-50">Accept for LSF review</button><button disabled={busy !== null} onClick={() => void decide(item.id, false)} className="rounded-xl border px-4 py-2 disabled:opacity-50">Decline</button></div></article>)}
    {message && <p role="status" className="mt-4 text-sm">{message}</p>}
  </section>;
}

export function ProviderInviteManager({ organizationId }: { organizationId: Id<'justice_service_organizations'> }) {
  const invitations = useQuery(api.providerInvitations.listForOrganisation, { organizationId });
  const create = useMutation(api.providerInvitations.create);
  const cancel = useMutation(api.providerInvitations.cancel);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function invite(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try { await create({ organizationId, email }); setEmail(''); setMessage('Invitation created. Ask your colleague to sign in with this email and open /join. LSF approval is required.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not create invitation.'); }
    finally { setBusy(false); }
  }
  async function withdraw(id: Id<'provider_invitations'>) {
    setBusy(true); setMessage('');
    try { await cancel({ id }); setMessage('Invitation cancelled.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not cancel invitation.'); }
    finally { setBusy(false); }
  }
  return <section className="rounded-3xl border border-[#EFDFE3] bg-white p-6">
    <h2 className="text-xl font-bold">Invite a colleague</h2>
    <p className="mt-2 text-sm text-gray-600">Create an in-app invitation for provider staff. Your colleague must accept using their own account; LSF then reviews access. Invitations expire after seven days.</p>
    <form onSubmit={event => void invite(event)} className="mt-4 space-y-3"><label className="block text-sm font-semibold">Colleague's account email<input type="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label><button disabled={busy} className="rounded-xl bg-primary px-4 py-3 font-semibold text-white disabled:opacity-50">Create invitation</button></form>
    {message && <p role="status" className="mt-4 text-sm">{message}</p>}
    <h3 className="mt-6 font-semibold">Recent invitations</h3>
    {invitations === undefined ? <p role="status">Loading invitations…</p> : invitations.length === 0 ? <p className="mt-2 text-sm">No invitations yet.</p> : <ul className="mt-3 space-y-3">{invitations.map(item => <li key={item._id} className="rounded-xl border p-3"><p className="break-all text-sm font-semibold">{item.email}</p><p className="text-xs">{item.status === 'pending' && item.expiresAt <= Date.now() ? 'expired' : item.status} · expires {new Date(item.expiresAt).toLocaleDateString('en-TZ')}</p>{item.status === 'pending' && item.expiresAt > Date.now() && <button disabled={busy} onClick={() => void withdraw(item._id)} className="mt-2 text-sm font-semibold text-primary underline">Cancel invitation</button>}</li>)}</ul>}
  </section>;
}
