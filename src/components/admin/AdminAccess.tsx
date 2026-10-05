import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { ShieldCheck, Users, Clock3, History } from 'lucide-react';


export default function AdminAccess() {
  const [search, setSearch] = useState('');
  const searching = search.trim().length >= 2;
  const usersPage = usePaginatedQuery(api.admin.listUsersWithAccessPage, searching ? 'skip' : {}, { initialNumItems: 40 });
  const searchedUsers = useQuery(api.admin.searchUsersWithAccess, searching ? { search: search.trim() } : 'skip');
  const users = searching ? searchedUsers : usersPage.status === 'LoadingFirstPage' ? undefined : usersPage.results;
  const accessPage = usePaginatedQuery(api.accessRequests.adminQueuePage, {}, { initialNumItems: 30 });
  const accessRequests = accessPage.status === 'LoadingFirstPage' ? undefined : accessPage.results;
  const applications = useQuery(api.formSubmissions.listParalegalApplications, { status: 'pending' });
  const audit = useQuery(api.admin.listRoleAudit);
  const baseRoleRequests = useQuery(api.admin.listBaseRoleChanges);
  const revocations = useQuery(api.admin.listRoleRevocations);
  const requestBaseRoleChange = useMutation(api.admin.requestBaseRoleChange);
  const reviewBaseRoleChange = useMutation(api.admin.reviewBaseRoleChange);
  const requestRoleRevocation = useMutation(api.admin.requestRoleRevocation);
  const reviewRoleRevocation = useMutation(api.admin.reviewRoleRevocation);
  const [baseRoleReasons, setBaseRoleReasons] = useState<Record<string, string>>({});
  const [baseRoleReviewNotes, setBaseRoleReviewNotes] = useState<Record<string, string>>({});
  const [revocationReasons, setRevocationReasons] = useState<Record<string, string>>({});
  const [revocationReviewNotes, setRevocationReviewNotes] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<string | null>(null);
  const filtered = search.trim().length === 1 ? [] : users?.filter((user) => !user.isDeleted) ?? [];

  async function requestRoleChange(userId: Id<'users'>) {
    setPending(userId);
    try {
      await requestBaseRoleChange({ targetUserId: userId, reason: baseRoleReasons[userId]?.trim() ?? '' });
      setBaseRoleReasons((current) => ({ ...current, [userId]: '' }));
      toast.success('Base-role change sent to another administrator for review.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not request this change.');
    } finally { setPending(null); }
  }

  async function reviewRoleChange(id: Id<'base_role_change_requests'>, decision: 'approved' | 'rejected') {
    setPending(id);
    try {
      await reviewBaseRoleChange({ id, decision, note: baseRoleReviewNotes[id]?.trim() ?? '' });
      setBaseRoleReviewNotes((current) => ({ ...current, [id]: '' }));
      toast.success(decision === 'approved' ? 'Base role changed and audited.' : 'Request rejected and audited.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not record this decision.');
    } finally { setPending(null); }
  }

  async function requestAssignmentRevocation(assignmentId: Id<'role_assignments'>) {
    setPending(assignmentId);
    try { await requestRoleRevocation({ assignmentId, reason: revocationReasons[assignmentId]?.trim() ?? '' }); toast.success('Role revocation sent for independent review.'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Could not request role revocation.'); }
    finally { setPending(null); }
  }

  async function decideAssignmentRevocation(id: Id<'role_revocation_requests'>, decision: 'approved' | 'rejected') {
    setPending(id);
    try { await reviewRoleRevocation({ id, decision, note: revocationReviewNotes[id]?.trim() ?? '' }); toast.success(decision === 'approved' ? 'Role revoked and audited.' : 'Revocation rejected and audited.'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Could not review revocation.'); }
    finally { setPending(null); }
  }

  return <div className="space-y-7">
    <header className="rounded-2xl bg-gradient-to-r from-[#7f1236] to-[#a31b49] p-7 text-white">
      <p className="text-xs font-bold uppercase tracking-[.25em] text-pink-100">Haki Yangu · Internal platform</p>
      <h1 className="mt-3 text-2xl font-bold md:text-3xl">Users, approvals & access</h1>
      <p className="mt-2 max-w-2xl text-sm text-pink-50">Review applications, assign permitted roles and keep an accountable record of access changes.</p>
    </header>
    <div className="grid gap-4 sm:grid-cols-3">
      <Metric icon={<Users size={20} />} label="Active accounts shown" value={users?.filter((user) => !user.isDeleted).length} />
      <Metric icon={<Clock3 size={20} />} label="Professional requests awaiting review" value={accessRequests?.length} />
      <Metric icon={<History size={20} />} label="Recent role changes" value={audit?.length} />
    </div>
    <OrganisationAccess />
    <section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Professional access requests</h2>
      <p className="mt-1 text-sm text-gray-600">Open an applicant to review their purpose, verified organisation and final access decision.</p>
      {accessRequests === undefined ? <p role="status" className="py-6 text-gray-500">Loading requests…</p> : accessRequests.length === 0 ? <p className="py-6 text-sm text-gray-500">No requests awaiting review.</p> : <div className="mt-5 space-y-3">{accessRequests.map((request) => <article key={request._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 p-4"><div><h3 className="font-bold text-gray-900">{request.applicant?.name ?? 'Account unavailable'}</h3><p className="text-sm text-gray-600">{request.requestedRole.replaceAll('_', ' ')} · {request.organizationName}</p><p className="mt-1 text-xs text-gray-500">Submitted {new Date(request.submittedAt).toLocaleDateString('en-TZ')}</p></div><Link to={`/dashboard/access-requests/${request._id}`} className="rounded-lg bg-[#8a1538] px-4 py-3 text-sm font-bold text-white hover:bg-[#6b102b]">Review application</Link></article>)}</div>}
      {accessPage.status === 'CanLoadMore' && <button type="button" onClick={() => accessPage.loadMore(30)} className="mt-4 rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-[#8a1538]">Load more applications</button>}
    </section>
    <section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><h2 className="text-xl font-bold text-gray-900">Professional role revocations</h2><p className="mt-1 text-sm text-gray-600">A different administrator must decide each request. Removing an extra role does not remove beneficiary access.</p>{revocations === undefined ? <p role="status" className="mt-4">Loading revocation requests…</p> : revocations.length === 0 ? <p className="mt-4 text-sm text-gray-500">No role revocations awaiting review.</p> : <div className="mt-4 space-y-4">{revocations.map(item => <article key={item._id} className="rounded-xl border p-4"><h3 className="font-semibold">{item.targetName} · {item.role.replaceAll('_', ' ')}</h3><p className="mt-1 text-sm">Reason: {item.reason}</p><p className="text-xs text-gray-500">Requested {new Date(item.requestedAt).toLocaleString('en-TZ')}</p><label className="mt-3 block text-sm font-medium" htmlFor={`revocation-note-${item._id}`}>Independent decision reason</label><input id={`revocation-note-${item._id}`} className="mt-1 w-full rounded-lg border p-2 text-sm" maxLength={2000} value={revocationReviewNotes[item._id] ?? ''} onChange={event => setRevocationReviewNotes(current => ({ ...current, [item._id]: event.target.value }))} /><div className="mt-3 flex gap-2"><button className="rounded-lg bg-[#8a1538] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40" disabled={pending === item._id || (revocationReviewNotes[item._id]?.trim().length ?? 0) < 10} onClick={() => void decideAssignmentRevocation(item._id, 'approved')}>Approve revocation</button><button className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-[#8a1538] disabled:opacity-40" disabled={pending === item._id || (revocationReviewNotes[item._id]?.trim().length ?? 0) < 10} onClick={() => void decideAssignmentRevocation(item._id, 'rejected')}>Keep role</button></div></article>)}</div>}</section>
    <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-xl font-bold text-gray-900">Account directory</h2><p className="text-sm text-gray-600">Base-role removal requires a reason and an independent administrator. The account retains beneficiary access.</p></div><input aria-label="Search users" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className="rounded-xl border border-gray-200 px-4 py-2 text-sm" /></div>
      {users === undefined ? <p role="status" className="py-8 text-center text-gray-500">Loading accounts…</p> : search.trim().length === 1 ? <p role="status" className="py-8 text-center text-gray-500">Enter at least two characters to search.</p> : filtered.length === 0 ? <p className="py-8 text-center text-gray-500">No matching accounts.</p> : <div className="space-y-3">{filtered.map((user) => <div key={user._id} className="rounded-xl border border-gray-100 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center"><div className="min-w-0 flex-1"><p className="font-semibold text-gray-900">{user.name}</p><p className="truncate text-sm text-gray-600">{user.email}</p><p className="text-xs text-gray-500">Base role: {user.role.replaceAll('_', ' ')}</p></div><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8a1538]">{user.roles.join(' · ').replaceAll('_', ' ')}</span>{user.role !== 'user' ? <div className="flex flex-col gap-2 md:w-64"><input aria-label={`Reason to change ${user.name}'s base role`} value={baseRoleReasons[user._id] ?? ''} onChange={(event) => setBaseRoleReasons((current) => ({ ...current, [user._id]: event.target.value }))} placeholder="Reason (at least 10 characters)" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" /><button disabled={pending === user._id || (baseRoleReasons[user._id]?.trim().length ?? 0) < 10} onClick={() => void requestRoleChange(user._id)} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-[#8a1538] disabled:opacity-40">Request base-role review</button></div> : null}</div>{user.assignments.filter(assignment => assignment.role !== user.role).map(assignment => <div key={assignment.id} className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm"><span className="min-w-44 font-medium">{assignment.role.replaceAll('_', ' ')}{assignment.organizationName ? ` · ${assignment.organizationName}` : ''}</span>{assignment.pendingRevocation ? <span className="text-amber-700">Revocation pending review</span> : <><input aria-label={`Reason to revoke ${assignment.role} for ${user.name}`} className="min-w-56 flex-1 rounded-lg border p-2" placeholder="Reason (10+ characters)" maxLength={2000} value={revocationReasons[assignment.id] ?? ''} onChange={event => setRevocationReasons(current => ({ ...current, [assignment.id]: event.target.value }))} /><button className="rounded-lg border border-rose-200 px-3 py-2 font-semibold text-[#8a1538] disabled:opacity-40" disabled={pending === assignment.id || (revocationReasons[assignment.id]?.trim().length ?? 0) < 10} onClick={() => void requestAssignmentRevocation(assignment.id)}>Request revocation</button></>}</div>)}</div>)}</div>}
    </div>
    {!searching && usersPage.status === "CanLoadMore" ? <button onClick={() => usersPage.loadMore(40)} className="rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold text-[#8a1538]">Load more accounts</button> : null}
    <section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><h2 className="text-xl font-bold text-gray-900">Base-role decisions</h2><p className="mt-1 text-sm text-gray-600">A different administrator reviews each request. The requester and target cannot approve it; the last active administrator is protected.</p>{baseRoleRequests === undefined ? <p role="status" className="mt-4 text-sm text-gray-500">Loading reviews…</p> : baseRoleRequests.filter((item) => item.status === 'pending').length === 0 ? <p className="mt-4 text-sm text-gray-500">No base-role reviews pending.</p> : <div className="mt-4 space-y-4">{baseRoleRequests.filter((item) => item.status === 'pending').map((item) => <article key={item._id} className="rounded-xl border border-rose-100 p-4"><p className="font-semibold text-gray-900">{item.targetName} · {item.previousRole.replaceAll('_', ' ')} → beneficiary</p><p className="mt-2 text-sm text-gray-600">{item.reason}</p><p className="mt-1 text-xs text-gray-500">Current role: {item.currentRole}</p><input aria-label={`Review reason for ${item.targetName}`} value={baseRoleReviewNotes[item._id] ?? ''} onChange={(event) => setBaseRoleReviewNotes((current) => ({ ...current, [item._id]: event.target.value }))} placeholder="Review reason (at least 10 characters)" className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /><div className="mt-3 flex flex-wrap gap-2"><button disabled={pending === item._id || (baseRoleReviewNotes[item._id]?.trim().length ?? 0) < 10} onClick={() => void reviewRoleChange(item._id, 'approved')} className="rounded-lg bg-[#8a1538] px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Approve change</button><button disabled={pending === item._id || (baseRoleReviewNotes[item._id]?.trim().length ?? 0) < 10} onClick={() => void reviewRoleChange(item._id, 'rejected')} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-bold text-[#8a1538] disabled:opacity-40">Reject</button></div></article>)}</div>}</section>
    <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-bold"><ShieldCheck className="text-[#8a1538]" /> Review queue</h2><p className="mt-1 text-sm text-gray-600">Open the focused paralegal review queue to inspect identity and credentials before deciding.</p><Link to="/dashboard/paralegal-reviews" className="mt-3 inline-block rounded-lg bg-[#8a1538] px-4 py-2 text-sm font-bold text-white">Open paralegal reviews</Link>{applications?.slice(0, 5).map((item) => <div key={item._id} className="mt-3 rounded-xl bg-rose-50 p-3"><p className="font-semibold">{item.fullName}</p><p className="text-sm text-gray-600">{item.region} · {new Date(item.submittedAt).toLocaleDateString()}</p></div>)}{applications?.length === 0 && <p className="mt-4 text-sm text-gray-500">No pending paralegal applications.</p>}</section><section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-bold"><History className="text-[#8a1538]" /> Access history</h2><p className="mt-1 text-sm text-gray-600">Recent role changes made by administrators.</p>{audit?.slice(0, 5).map((item) => <div key={item._id} className="mt-3 border-b border-gray-100 pb-3 text-sm"><p className="font-medium">{item.action.replaceAll(/[._]/g, ' ')} · {item.targetName ?? 'Account unavailable'}{item.role ? ` · ${item.role.replaceAll('_', ' ')}` : ''}</p><p className="text-gray-500">{item.actorName ? `By ${item.actorName} · ` : ''}{new Date(item.timestamp).toLocaleString()}</p></div>)}{audit?.length === 0 && <p className="mt-4 text-sm text-gray-500">No role changes recorded yet.</p>}</section></div>
  </div>;
}

function OrganisationAccess() {
  const [organizationId, setOrganizationId] = useState<Id<'justice_service_organizations'> | null>(null);
  const organizations = useQuery(api.justiceServices.staffListOrganizations);
  const members = useQuery(api.admin.listOrganizationMembers, organizationId ? { organizationId } : 'skip');
  const selected = organizations?.find((item) => item._id === organizationId);
  return <section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
    <h2 className="text-xl font-bold text-gray-900">Organisation membership oversight</h2>
    <p className="mt-1 text-sm text-gray-600">Review organisation affiliations here. Approve new access through Professional access requests; request removal through Account directory and independent review.</p>
    <label className="mt-4 block text-sm font-semibold" htmlFor="access-organisation">Organisation</label>
    <select id="access-organisation" className="mt-2 w-full rounded-xl border p-3" value={organizationId ?? ''} onChange={(event) => setOrganizationId(event.target.value ? event.target.value as Id<'justice_service_organizations'> : null)} disabled={organizations === undefined}>
      <option value="">{organizations === undefined ? 'Loading organisations…' : 'Choose an organisation'}</option>
      {organizations?.map((item) => <option key={item._id} value={item._id}>{item.name} · {item.verificationStatus}</option>)}
    </select>
    {organizations?.length === 0 && <p className="mt-3 text-sm text-gray-600">No organisations are registered. Create and verify an organisation in directory management before approving its members.</p>}
    {selected && <p className="mt-3 text-sm text-gray-600">Verification: {selected.verificationStatus} · Referral agreement: {selected.referralAgreementStatus}</p>}
    {organizationId && (members === undefined ? <p role="status" className="mt-4">Loading memberships…</p> : members.length === 0 ? <p className="mt-4 text-sm text-gray-600">No role memberships recorded for this organisation.</p> : <ul className="mt-4 space-y-3">{members.map((member) => <li key={member.id} className="rounded-xl border p-4"><p className="font-semibold">{member.name}</p><p className="text-sm text-gray-600">{member.role.replaceAll('_', ' ')} · {member.status}</p><p className="mt-1 text-xs text-gray-500">Granted {new Date(member.grantedAt).toLocaleDateString('en-TZ')}{member.revokedAt ? ` · Revoked ${new Date(member.revokedAt).toLocaleDateString('en-TZ')}` : ''}</p></li>)}</ul>)}
  </section>;
}
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value?: number }) { return <div className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><div className="rounded-full bg-rose-50 p-3 text-[#8a1538]">{icon}</div><div><p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p><p className="text-xs text-gray-600">{label}</p></div></div>; }
