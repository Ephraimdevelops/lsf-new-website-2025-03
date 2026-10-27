import { usePlainError } from "@/i18n/usePlainError";
import { useCopy } from "@/i18n/useCopy";
import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { Link, Navigate } from 'react-router-dom';
import { HeartHandshake, Scale, Building2, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { api } from '../../convex/_generated/api';

import { ProviderInviteInbox } from '@/components/auth/ProviderInvitations';

type Role = 'staff' | 'content_editor' | 'provider_staff' | 'stakeholder' | 'donor';
const paths = [
  { icon: HeartHandshake, title: 'I need legal help', body: 'Ask Haki Yangu AI, find nearby services, and follow your own case.', href: '/dashboard/user', action: 'Go to my dashboard' },
  { icon: Scale, title: 'I am a paralegal', body: 'Apply to join the network. LSF reviews your application before granting work access.', href: '/become-a-paralegal', action: 'Apply for review' },
];
export default function Join() {
  const readError = usePlainError();
  const c = useCopy();
  const { isLoaded, isSignedIn } = useAuth();
  const access = useQuery(api.users.currentAccess);
  const requests = useQuery(api.accessRequests.myRequests, isSignedIn && access ? {} : 'skip');
  const requestAccess = useMutation(api.accessRequests.request);
  const updateProfile = useMutation(api.users.updateProfile);
  const [role, setRole] = useState<Role>('provider_staff');
  const [organizationName, setOrganizationName] = useState('');
  const [statement, setStatement] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [accountName, setAccountName] = useState('');
  const needsName = access && ['user', 'haki yangu user'].includes(access.user.name.trim().toLowerCase());
  async function saveAccountName(event: React.FormEvent) {
    event.preventDefault();
    if (accountName.trim().length < 2) return;
    setError(''); setSaving(true);
    try { await updateProfile({ name: accountName.trim() }); }
    catch (caught) { setError(readError(caught, 'Could not save your name.')); }
    finally { setSaving(false); }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(''); setSaving(true);
    try { await requestAccess({ requestedRole: role, organizationName, statement }); setShowForm(false); }
    catch (caught) { setError(readError(caught, 'Could not submit request.')); }
    finally { setSaving(false); }
  }
  const hasPending = requests?.some((item) => item.status === 'pending');
  if (isLoaded && !isSignedIn) return <Navigate to="/login" replace />;
  if (needsName) return <Layout><section className="bg-gray-50 px-4 py-14"><form onSubmit={(event) => void saveAccountName(event)} className="mx-auto max-w-md space-y-4 rounded-2xl border border-rose-100 bg-white p-7 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-[#8a1538]">Haki Yangu · LSF</p><h1 className="text-2xl font-bold text-gray-900">{c("What should we call you?")}</h1><p className="text-sm text-gray-600">{c("Your name appears on your profile and applications. You can change it later.")}</p><label className="block text-sm font-semibold">{c("Name")}<input value={accountName} onChange={(event) => setAccountName(event.target.value)} required minLength={2} maxLength={160} autoComplete="name" className="mt-1 block w-full rounded-xl border border-gray-200 p-3" /></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={saving} className="rounded-xl bg-[#8a1538] px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : c("Continue")}</button></form></section></Layout>;
  return <Layout><section className="bg-gray-50 px-4 py-14"><div className="mx-auto max-w-5xl"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#8a1538]">Haki Yangu · LSF</p><h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">{c("How will you use Haki Yangu?")}</h1><p className="mt-3 max-w-2xl text-gray-600">{c("Your account works across the website and mobile app. Professional access follows LSF review.")}</p><div className="mt-9 grid gap-5 md:grid-cols-3">{paths.map(({ icon: Icon, title, body, href, action }) => <article key={title} className="flex flex-col rounded-2xl border border-rose-100 bg-white p-7 shadow-sm"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-[#8a1538]"><Icon size={24} /></div><h2 className="text-xl font-bold text-gray-900">{title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{body}</p><Link to={href} className="mt-7 inline-flex items-center gap-2 font-semibold text-[#8a1538] hover:underline">{action}<ArrowRight size={17} /></Link></article>)}<article className="flex flex-col rounded-2xl border border-rose-100 bg-white p-7 shadow-sm"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-[#8a1538]"><Building2 size={24} /></div><h2 className="text-xl font-bold text-gray-900">{c("I work with LSF or a partner")}</h2><p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{c("Request access using your work account. LSF verifies your organisation and role.")}</p>{hasPending ? <p className="mt-7 text-sm font-semibold text-[#8a1538]">{c("Your request is awaiting LSF review.")}</p> : <button onClick={() => setShowForm((value) => !value)} className="mt-7 inline-flex items-center gap-2 font-semibold text-[#8a1538] hover:underline">{c("Request work access")}<ArrowRight size={17} /></button>}</article></div>{showForm && !hasPending && <form onSubmit={(event) => void submit(event)} className="mt-7 max-w-2xl space-y-4 rounded-2xl border border-rose-100 bg-white p-7 shadow-sm"><h2 className="text-xl font-bold">{c("Professional access request")}</h2><p className="text-sm text-gray-600">{c("This request does not grant access. An LSF administrator must verify your organisation and approve it.")}</p><label className="block text-sm font-semibold">{c("Requested role")}<select value={role} onChange={(event) => setRole(event.target.value as Role)} className="mt-1 block w-full rounded-xl border border-gray-200 p-3"><option value="provider_staff">{c("Provider team")}</option><option value="staff">{c("LSF staff")}</option><option value="content_editor">{c("Content editor")}</option><option value="stakeholder">{c("Partner")}</option><option value="donor">{c("Donor")}</option></select></label><label className="block text-sm font-semibold">{c("Organisation")}<input value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} required minLength={2} maxLength={160} className="mt-1 block w-full rounded-xl border border-gray-200 p-3" /></label><label className="block text-sm font-semibold">{c("Your work and reason for access")}<textarea value={statement} onChange={(event) => setStatement(event.target.value)} required minLength={20} maxLength={2000} rows={4} className="mt-1 block w-full rounded-xl border border-gray-200 p-3" /></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={saving || !access} className="rounded-xl bg-[#8a1538] px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? c("Submitting…") : 'Send to LSF for review'}</button></form>}<ProviderInviteInbox /><p className="mt-7 text-sm text-gray-500">{c("Choosing a path does not change your access. LSF approves professional roles.")}</p></div></section></Layout>;
}
