import BrandLoading from '@/components/shared/BrandLoading';
import { WorkHeader, WorkStats } from "@/components/dashboard/WorkArea";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import ParalegalIllustration from "@/components/paralegal/ParalegalIllustration";
import SearchFilterBar from "@/components/shared/SearchFilterBar";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { ShieldCheck, Users, Clock3, History } from 'lucide-react';


export default function AdminAccess() {
  const c = useCopy();
  const {locale} = useLanguage();
  const sw = locale === 'sw';
  const [accessArea, setAccessArea] = useState('requests');
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
    <WorkHeader eyebrow="LSF" title={sw?'Watu na ruhusa':'People and access'} description={sw?'Kagua ombi, taasisi na sababu kabla ya kutoa au kuondoa ruhusa.':'Check the request, organisation and reason before granting or removing access.'}/>

    <WorkStats items={[{label:sw?'Akaunti zinazoonyeshwa':'Active accounts shown',value:users?.filter(user=>!user.isDeleted).length,icon:Users},{label:sw?'Maombi ya ruhusa':'Work access applications',value:accessRequests===undefined?undefined:`${accessRequests.length}${accessPage.status==='CanLoadMore'?'+':''}`,icon:Clock3},{label:sw?'Mabadiliko ya karibuni':'Recent role changes',value:audit?.length,icon:History}]}/>
    <nav className="work-tabs" aria-label={sw?'Aina ya kazi ya ruhusa':'Access work area'}>{[['requests',sw?'Maombi':'Applications'],['accounts',sw?'Akaunti':'Accounts'],['decisions',sw?'Maamuzi':'Decisions'],['organisations',sw?'Taasisi':'Organisations'],['history',sw?'Historia':'History']].map(([value,label])=><button key={value} type="button" aria-current={accessArea===value?'page':undefined} onClick={()=>setAccessArea(value)}>{label}</button>)}</nav>

    <div hidden={accessArea !== 'organisations'} className="work-access-area"><OrganisationAccess /></div>
    <div hidden={accessArea !== 'requests'} className="work-access-area"><section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">{c("Professional access requests")}</h2>
      <p className="mt-1 text-sm text-gray-600">{c("Open an applicant to review their purpose, verified organisation and final access decision.")}</p>
      {accessRequests === undefined ? <BrandLoading compact text={c("Loading requests…")}/> : accessRequests.length === 0 ? <p className="py-6 text-sm text-gray-500">{c("No requests awaiting review.")}</p> : <div className="mt-5 space-y-3">{accessRequests.map((request) => <article key={request._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 p-4"><div><h3 className="font-bold text-gray-900">{request.applicant?.name ?? 'Account unavailable'}</h3><p className="text-sm text-gray-600">{request.requestedRole.replaceAll('_', ' ')} {c(" · ")}{request.organizationName}</p><p className="mt-1 text-xs text-gray-500">{c("Submitted ")}{new Date(request.submittedAt).toLocaleDateString('en-TZ')}</p></div><Link to={`/dashboard/access-requests/${request._id}`} className="rounded-lg bg-[#8a1538] px-4 py-3 text-sm font-bold text-white hover:bg-[#6b102b]">{c("Review application")}</Link></article>)}</div>}
      {accessPage.status === 'CanLoadMore' && <button type="button" onClick={() => accessPage.loadMore(30)} className="mt-4 rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-[#8a1538]">{c("Load more applications")}</button>}
    </section></div>
    <div hidden={accessArea !== 'decisions'} className="work-access-area"><section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><h2 className="text-xl font-bold text-gray-900">{c("Professional role revocations")}</h2><p className="mt-1 text-sm text-gray-600">{c("A different administrator must decide each request. Removing an extra role does not remove beneficiary access.")}</p>{revocations === undefined ? <BrandLoading compact text={c("Loading revocation requests…")}/> : revocations.length === 0 ? <p className="mt-4 text-sm text-gray-500">{c("No role revocations awaiting review.")}</p> : <div className="mt-4 space-y-4">{revocations.map(item => <article key={item._id} className="rounded-xl border p-4"><h3 className="font-semibold">{item.targetName} {c(" · ")}{item.role.replaceAll('_', ' ')}</h3><p className="mt-1 text-sm">{c("Reason: ")}{item.reason}</p><p className="text-xs text-gray-500">{c("Requested ")}{new Date(item.requestedAt).toLocaleString('en-TZ')}</p><label className="mt-3 block text-sm font-medium" htmlFor={`revocation-note-${item._id}`}>{c("Independent decision reason")}</label><input id={`revocation-note-${item._id}`} className="mt-1 w-full rounded-lg border p-2 text-sm" maxLength={2000} value={revocationReviewNotes[item._id] ?? ''} onChange={event => setRevocationReviewNotes(current => ({ ...current, [item._id]: event.target.value }))} /><div className="mt-3 flex gap-2"><button className="rounded-lg bg-[#8a1538] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40" disabled={pending === item._id || (revocationReviewNotes[item._id]?.trim().length ?? 0) < 10} onClick={() => void decideAssignmentRevocation(item._id, 'approved')}>{c("Approve revocation")}</button><button className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-[#8a1538] disabled:opacity-40" disabled={pending === item._id || (revocationReviewNotes[item._id]?.trim().length ?? 0) < 10} onClick={() => void decideAssignmentRevocation(item._id, 'rejected')}>{c("Keep role")}</button></div></article>)}</div>}</section></div>
    <div hidden={accessArea !== 'accounts'} className="work-access-area"><div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-xl font-bold text-gray-900">{c("Account directory")}</h2><p className="text-sm text-gray-600">{c("Base-role removal requires a reason and an independent administrator. The account retains beneficiary access.")}</p></div><SearchFilterBar value={search} onChange={setSearch} placeholder={c("Find a name or email")} /></div>
      {users === undefined ? <BrandLoading compact text={c("Loading accounts…")}/> : search.trim().length === 1 ? <p role="status" className="py-8 text-center text-gray-500">{c("Enter at least two characters to search.")}</p> : filtered.length === 0 ? <p className="py-8 text-center text-gray-500">{c("No matching accounts.")}</p> : <div className="space-y-3">{filtered.map((user) => <div key={user._id} className="rounded-xl border border-gray-100 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center"><div className="min-w-0 flex-1"><p className="font-semibold text-gray-900">{user.name}</p><p className="truncate text-sm text-gray-600">{user.email}</p><p className="text-xs text-gray-500">{c("Base role: ")}{user.role.replaceAll('_', ' ')}</p></div><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#8a1538]">{user.roles.join(' · ').replaceAll('_', ' ')}</span>{user.role !== 'user' ? <div className="flex flex-col gap-2 md:w-64"><input aria-label={`Reason to change ${user.name}'s base role`} value={baseRoleReasons[user._id] ?? ''} onChange={(event) => setBaseRoleReasons((current) => ({ ...current, [user._id]: event.target.value }))} placeholder={c("Reason (at least 10 characters)")} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" /><button disabled={pending === user._id || (baseRoleReasons[user._id]?.trim().length ?? 0) < 10} onClick={() => void requestRoleChange(user._id)} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-[#8a1538] disabled:opacity-40">{c("Request base-role review")}</button></div> : null}</div>{user.assignments.filter(assignment => assignment.role !== user.role).map(assignment => <div key={assignment.id} className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm"><span className="min-w-44 font-medium">{assignment.role.replaceAll('_', ' ')}{assignment.organizationName ? ` · ${assignment.organizationName}` : ''}</span>{assignment.pendingRevocation ? <span className="text-amber-700">{c("Revocation pending review")}</span> : <><input aria-label={`Reason to revoke ${assignment.role} for ${user.name}`} className="min-w-56 flex-1 rounded-lg border p-2" placeholder={c("Reason (10+ characters)")} maxLength={2000} value={revocationReasons[assignment.id] ?? ''} onChange={event => setRevocationReasons(current => ({ ...current, [assignment.id]: event.target.value }))} /><button className="rounded-lg border border-rose-200 px-3 py-2 font-semibold text-[#8a1538] disabled:opacity-40" disabled={pending === assignment.id || (revocationReasons[assignment.id]?.trim().length ?? 0) < 10} onClick={() => void requestAssignmentRevocation(assignment.id)}>{c("Request revocation")}</button></>}</div>)}</div>)}</div>}
    </div></div>
    <div hidden={accessArea !== 'accounts'} className="work-access-area">{!searching && usersPage.status === "CanLoadMore" ? <button onClick={() => usersPage.loadMore(40)} className="rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold text-[#8a1538]">{c("Load more accounts")}</button> : null}</div>
    <div hidden={accessArea !== 'decisions'} className="work-access-area"><section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><h2 className="text-xl font-bold text-gray-900">{c("Base-role decisions")}</h2><p className="mt-1 text-sm text-gray-600">{c("A different administrator reviews each request. The requester and target cannot approve it; the last active administrator is protected.")}</p>{baseRoleRequests === undefined ? <BrandLoading compact text={c("Loading reviews…")}/> : baseRoleRequests.filter((item) => item.status === 'pending').length === 0 ? <p className="mt-4 text-sm text-gray-500">{c("No base-role reviews pending.")}</p> : <div className="mt-4 space-y-4">{baseRoleRequests.filter((item) => item.status === 'pending').map((item) => <article key={item._id} className="rounded-xl border border-rose-100 p-4"><p className="font-semibold text-gray-900">{item.targetName} {c(" · ")}{item.previousRole.replaceAll('_', ' ')} {c(" → beneficiary")}</p><p className="mt-2 text-sm text-gray-600">{item.reason}</p><p className="mt-1 text-xs text-gray-500">{c("Current role: ")}{item.currentRole}</p><input aria-label={`Review reason for ${item.targetName}`} value={baseRoleReviewNotes[item._id] ?? ''} onChange={(event) => setBaseRoleReviewNotes((current) => ({ ...current, [item._id]: event.target.value }))} placeholder={c("Review reason (at least 10 characters)")} className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" /><div className="mt-3 flex flex-wrap gap-2"><button disabled={pending === item._id || (baseRoleReviewNotes[item._id]?.trim().length ?? 0) < 10} onClick={() => void reviewRoleChange(item._id, 'approved')} className="rounded-lg bg-[#8a1538] px-4 py-2 text-sm font-bold text-white disabled:opacity-40">{c("Approve change")}</button><button disabled={pending === item._id || (baseRoleReviewNotes[item._id]?.trim().length ?? 0) < 10} onClick={() => void reviewRoleChange(item._id, 'rejected')} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-bold text-[#8a1538] disabled:opacity-40">{c("Reject")}</button></div></article>)}</div>}</section></div>
    <div hidden={accessArea !== 'history'} className="work-access-area"><div className="grid gap-5 xl:grid-cols-2"><section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-bold"><ShieldCheck className="text-[#8a1538]" /> {c(" Review queue")}</h2><p className="mt-1 text-sm text-gray-600">{c("Open the focused paralegal review queue to inspect identity and credentials before deciding.")}</p><Link to="/dashboard/paralegal-reviews" className="mt-3 inline-block rounded-lg bg-[#8a1538] px-4 py-2 text-sm font-bold text-white">{c("Open paralegal reviews")}</Link>{applications?.slice(0, 5).map((item) => <div key={item._id} className="mt-3 rounded-xl bg-rose-50 p-3"><p className="font-semibold">{item.fullName}</p><p className="text-sm text-gray-600">{item.region} {c(" · ")}{new Date(item.submittedAt).toLocaleDateString()}</p></div>)}{applications?.length === 0 && <p className="mt-4 text-sm text-gray-500">{c("No pending paralegal applications.")}</p>}</section><section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-bold"><History className="text-[#8a1538]" /> {c(" Access history")}</h2><p className="mt-1 text-sm text-gray-600">{c("Recent role changes made by administrators.")}</p>{audit?.slice(0, 5).map((item) => <div key={item._id} className="mt-3 border-b border-gray-100 pb-3 text-sm"><p className="font-medium">{item.action.replaceAll(/[._]/g, ' ')} {c(" · ")}{item.targetName ?? 'Account unavailable'}{item.role ? ` · ${item.role.replaceAll('_', ' ')}` : ''}</p><p className="text-gray-500">{item.actorName ? `By ${item.actorName} · ` : ''}{new Date(item.timestamp).toLocaleString()}</p></div>)}{audit?.length === 0 && <p className="mt-4 text-sm text-gray-500">{c("No role changes recorded yet.")}</p>}</section></div></div>
  </div>;
}

function OrganisationAccess() {
  const c = useCopy();
  const [organizationId, setOrganizationId] = useState<Id<'justice_service_organizations'> | null>(null);
  const organizations = useQuery(api.justiceServices.staffListOrganizations);
  const members = useQuery(api.admin.listOrganizationMembers, organizationId ? { organizationId } : 'skip');
  const selected = organizations?.find((item) => item._id === organizationId);
  return <section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
    <h2 className="text-xl font-bold text-gray-900">{c("Organisation membership oversight")}</h2>
    <p className="mt-1 text-sm text-gray-600">{c("Review organisation affiliations here. Approve new access through Professional access requests; request removal through Account directory and independent review.")}</p>
    <label className="mt-4 block text-sm font-semibold" htmlFor="access-organisation">{c("Organisation")}</label>
    <select id="access-organisation" className="mt-2 w-full rounded-xl border p-3" value={organizationId ?? ''} onChange={(event) => setOrganizationId(event.target.value ? event.target.value as Id<'justice_service_organizations'> : null)} disabled={organizations === undefined}>
      <option value="">{organizations === undefined ? 'Loading organisations…' : 'Choose an organisation'}</option>
      {organizations?.map((item) => <option key={item._id} value={item._id}>{item.name} {c(" · ")}{item.verificationStatus}</option>)}
    </select>
    {organizations?.length === 0 && <p className="mt-3 text-sm text-gray-600">{c("No organisations are registered. Create and verify an organisation in directory management before approving its members.")}</p>}
    {selected && <p className="mt-3 text-sm text-gray-600">{c("Verification: ")}{selected.verificationStatus} {c(" · Referral agreement: ")}{selected.referralAgreementStatus}</p>}
    {organizationId && (members === undefined ? <BrandLoading compact text={c("Loading memberships…")}/> : members.length === 0 ? <p className="mt-4 text-sm text-gray-600">{c("No role memberships recorded for this organisation.")}</p> : <ul className="mt-4 space-y-3">{members.map((member) => <li key={member.id} className="rounded-xl border p-4"><p className="font-semibold">{member.name}</p><p className="text-sm text-gray-600">{member.role.replaceAll('_', ' ')} {c(" · ")}{member.status}</p><p className="mt-1 text-xs text-gray-500">{c("Granted ")}{new Date(member.grantedAt).toLocaleDateString('en-TZ')}{member.revokedAt ? ` · Revoked ${new Date(member.revokedAt).toLocaleDateString('en-TZ')}` : ''}</p></li>)}</ul>)}
  </section>;
}
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value?: number }) { return <div className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><div className="rounded-full bg-rose-50 p-3 text-[#8a1538]">{icon}</div><div><p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p><p className="text-xs text-gray-600">{label}</p></div></div>; }
