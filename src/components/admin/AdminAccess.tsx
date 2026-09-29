import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { ShieldCheck, Users, Clock3, History } from 'lucide-react';


export default function AdminAccess() {
  const users = useQuery(api.admin.getUsersWithAccess);
  const accessRequests = useQuery(api.accessRequests.adminQueue, { status: "pending" });
  const organizations = useQuery(api.justiceServices.staffListOrganizations);
  const decideAccess = useMutation(api.accessRequests.decide);
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});
  const [decisionOrganizations, setDecisionOrganizations] = useState<Record<string, string>>({});
  const applications = useQuery(api.formSubmissions.listParalegalApplications, { status: 'pending' });
  const audit = useQuery(api.admin.listRoleAudit);
  const updateRole = useMutation(api.admin.updateUserRole);
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState<string | null>(null);
  const filtered = users?.filter((user) => !user.isDeleted && `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())) ?? [];

  async function decide(requestId: Id<'access_requests'>, decision: 'approved' | 'rejected') {
    setPending(requestId);
    try {
      const organizationId = decisionOrganizations[requestId] as Id<'justice_service_organizations'> | undefined;
      await decideAccess({ requestId, decision, decisionNote: decisionNotes[requestId] ?? '', organizationId: decision === 'approved' ? organizationId : undefined });
      toast.success(decision === 'approved' ? 'Access approved and audited.' : 'Request rejected and audited.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save this decision.');
    } finally { setPending(null); }
  }

  async function saveRole(userId: Id<'users'>) {
    setPending(userId);
    try {
      await updateRole({ userId, role: 'user' });
      toast.success('Role updated and recorded in the audit log.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update this role.');
    } finally { setPending(null); }
  }

  return <div className="space-y-7">
    <header className="rounded-2xl bg-gradient-to-r from-[#7f1236] to-[#a31b49] p-7 text-white">
      <p className="text-xs font-bold uppercase tracking-[.25em] text-pink-100">Haki Yangu · Internal platform</p>
      <h1 className="mt-3 text-2xl font-bold md:text-3xl">Users, approvals & access</h1>
      <p className="mt-2 max-w-2xl text-sm text-pink-50">Review applications, assign permitted roles and keep an accountable record of access changes.</p>
    </header>
    <div className="grid gap-4 sm:grid-cols-3">
      <Metric icon={<Users size={20} />} label="Active accounts" value={users?.filter((user) => !user.isDeleted).length} />
      <Metric icon={<Clock3 size={20} />} label="Professional requests awaiting review" value={accessRequests?.length} />
      <Metric icon={<History size={20} />} label="Recent role changes" value={audit?.length} />
    </div>
    <section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Professional access requests</h2>
      <p className="mt-1 text-sm text-gray-600">Review the applicant’s purpose. Select a verified organisation and record your decision. Provider staff require an active referral agreement.</p>
      {accessRequests === undefined ? <p role="status" className="py-6 text-gray-500">Loading requests…</p> : accessRequests.length === 0 ? <p className="py-6 text-sm text-gray-500">No requests awaiting review.</p> : <div className="mt-5 space-y-4">{accessRequests.map((request) => <article key={request._id} className="rounded-xl border border-gray-200 p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-bold text-gray-900">{request.applicant?.name ?? 'Account unavailable'}</h3><p className="text-sm text-gray-600">{request.applicant?.email}</p></div><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#8a1538]">{request.requestedRole.replaceAll('_', ' ')}</span></div><p className="mt-3 text-sm font-semibold text-gray-800">Claimed organisation: {request.organizationName}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">{request.statement}</p><div className="mt-4 grid gap-3 md:grid-cols-2"><select aria-label={`Verified organisation for ${request.applicant?.name ?? 'applicant'}`} value={decisionOrganizations[request._id] ?? ''} onChange={(event) => setDecisionOrganizations((current) => ({ ...current, [request._id]: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm"><option value="">Choose verified organisation</option>{organizations?.filter((org) => org.verificationStatus === 'verified' && (request.requestedRole !== 'provider_staff' || org.referralAgreementStatus === 'active') && (request.requestedRole !== 'staff' || org.organizationType === 'lsf')).map((org) => <option key={org._id} value={org._id}>{org.name}</option>)}</select><input aria-label={`Decision reason for ${request.applicant?.name ?? 'applicant'}`} placeholder="Reason for decision (required)" value={decisionNotes[request._id] ?? ''} onChange={(event) => setDecisionNotes((current) => ({ ...current, [request._id]: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" /></div><div className="mt-4 flex gap-2"><button disabled={pending === request._id || !decisionOrganizations[request._id] || (decisionNotes[request._id]?.trim().length ?? 0) < 10} onClick={() => void decide(request._id, 'approved')} className="rounded-lg bg-[#8a1538] px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Approve access</button><button disabled={pending === request._id || (decisionNotes[request._id]?.trim().length ?? 0) < 10} onClick={() => void decide(request._id, 'rejected')} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-bold text-[#8a1538] disabled:opacity-40">Reject</button></div></article>)}</div>}
    </section>
    <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-xl font-bold text-gray-900">Account directory</h2><p className="text-sm text-gray-600">Only administrators can change these roles. Admin and safeguarding roles require separate supervised review.</p></div><input aria-label="Search users" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className="rounded-xl border border-gray-200 px-4 py-2 text-sm" /></div>
      {users === undefined ? <p role="status" className="py-8 text-center text-gray-500">Loading accounts…</p> : filtered.length === 0 ? <p className="py-8 text-center text-gray-500">No matching accounts.</p> : <div className="space-y-3">{filtered.map((user) => <div key={user._id} className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 md:flex-row md:items-center"><div className="min-w-0 flex-1"><p className="font-semibold text-gray-900">{user.name}</p><p className="truncate text-sm text-gray-600">{user.email}</p></div><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8a1538]">{user.roles.join(' · ').replaceAll('_', ' ')}</span>{user.hasAssignments || user.role === 'admin' || user.role === 'safeguarding_officer' || user.role === 'paralegal' ? <span className="text-xs text-gray-500">Reviewed role</span> : user.role !== 'user' ? <button disabled={pending === user._id} onClick={() => void saveRole(user._id)} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-[#8a1538] disabled:opacity-40">Reset to beneficiary</button> : null}</div>)}</div>}
    </div>
    <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-bold"><ShieldCheck className="text-[#8a1538]" /> Review queue</h2><p className="mt-1 text-sm text-gray-600">Paralegal applications are reviewed under Admin → Submissions → Paralegals.</p>{applications?.slice(0, 5).map((item) => <div key={item._id} className="mt-3 rounded-xl bg-rose-50 p-3"><p className="font-semibold">{item.fullName}</p><p className="text-sm text-gray-600">{item.region} · {new Date(item.submittedAt).toLocaleDateString()}</p></div>)}{applications?.length === 0 && <p className="mt-4 text-sm text-gray-500">No pending paralegal applications.</p>}</section><section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-bold"><History className="text-[#8a1538]" /> Access history</h2><p className="mt-1 text-sm text-gray-600">Recent role changes made by administrators.</p>{audit?.slice(0, 5).map((item) => <div key={item._id} className="mt-3 border-b border-gray-100 pb-3 text-sm"><p className="font-medium">Role change · {item.entityId}</p><p className="text-gray-500">{new Date(item.timestamp).toLocaleString()}</p></div>)}{audit?.length === 0 && <p className="mt-4 text-sm text-gray-500">No role changes recorded yet.</p>}</section></div>
  </div>;
}
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value?: number }) { return <div className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><div className="rounded-full bg-rose-50 p-3 text-[#8a1538]">{icon}</div><div><p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p><p className="text-xs text-gray-600">{label}</p></div></div>; }
