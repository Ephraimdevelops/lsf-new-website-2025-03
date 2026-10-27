import BrandLoading from '@/components/shared/BrandLoading';
import { useCopy } from "@/i18n/useCopy";
import AdminPageIntro from "@/components/admin/AdminPageIntro";
import { useState } from 'react';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../convex/_generated/api';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';

export default function ParalegalReviewQueue() {
  const c = useCopy();
  const [status, setStatus] = useState<'pending' | 'under_review'>('pending');
  const access = useQuery(api.users.currentAccess);
  const page = usePaginatedQuery(api.formSubmissions.paralegalReviewQueuePage, { status }, { initialNumItems: 30 });
  return <Layout><main className="min-h-screen bg-[#fcf9f8] py-10"><Container className="max-w-5xl">
    <Link to="/admin?tab=platform" className="inline-flex items-center gap-2 text-sm font-bold text-[#870b3a] underline"><ArrowLeft size={16} />{c(" Back to LSF management")}</Link>
    <AdminPageIntro title={c("Paralegal applications")} body="Check identity, experience and documents before recording an approval decision." pose="review" />
    {access === undefined ? <BrandLoading compact text={c("Loading access…")}/> : !access?.roles.some(role => role === 'admin' || role === 'staff') ? <p className="mt-6 rounded-2xl bg-white p-6">{c("LSF review access is required.")}</p> : <>
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label={c("Application status")}>{(['pending', 'under_review'] as const).map(value => <button key={value} type="button" role="tab" aria-selected={status === value} onClick={() => setStatus(value)} className={`rounded-xl px-5 py-3 text-sm font-bold ${status === value ? 'bg-[#870b3a] text-white' : 'border border-rose-200 bg-white text-[#870b3a]'}`}>{value === 'pending' ? 'New applications' : c("Under review")}</button>)}</div>
      <section className="mt-5 space-y-3" aria-live="polite">{page.status === 'LoadingFirstPage' ? <BrandLoading compact text={c("Loading applications…")}/> : page.results.length === 0 ? <div className="rounded-2xl border border-dashed bg-white p-8"><ShieldCheck className="h-8 w-8 text-[#870b3a]" /><h2 className="mt-3 text-xl font-bold">{c("No ")}{status === 'pending' ? 'new' : 'in-review'}{c(" applications")}</h2><p className="mt-1 text-sm text-slate-600">{c("Applications will appear here when they need this step.")}</p></div> : page.results.map(item => <article key={item._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><div><h2 className="text-lg font-bold">{item.fullName}</h2><p className="mt-1 text-sm text-slate-600">{item.district}, {item.region} · {item.intakeOrigin ? 'Awaiting applicant documents' : `Submitted ${new Date(item.submittedAt).toLocaleDateString('en-TZ')}`}</p></div><Link to={`/dashboard/paralegal-reviews/${item._id}`} className="inline-flex items-center gap-2 rounded-xl bg-[#870b3a] px-4 py-3 text-sm font-bold text-white">{item.intakeOrigin ? 'View invitation' : 'Review application'} <ArrowRight size={16} /></Link></article>)}</section>
      {page.status === 'CanLoadMore' && <button type="button" onClick={() => page.loadMore(30)} className="mt-5 rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-bold text-[#870b3a]">{c("Load more applications")}</button>}
    </>}
  </Container></main></Layout>;
}
