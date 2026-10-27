import { displayLabel } from "../../../shared/plainLanguage";
import { useCopy } from "@/i18n/useCopy";
import { useLanguage } from "@/providers/LanguageProvider";
import BrandLoading from '@/components/shared/BrandLoading';
import { useQuery } from 'convex/react';
import { Link } from 'react-router-dom';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { referralLabels } from '../../../mobile/src/provider/referralFlow';
import ReferralProposal from './ReferralProposal';
const date = (value: number, locale: 'sw' | 'en') => new Date(value).toLocaleString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', { timeZone: 'Africa/Dar_es_Salaam', dateStyle: 'medium', timeStyle: 'short' });
export default function CaseReferralRequests({ caseId, status, operations = false, supportHref = '/dashboard/paralegal?tab=tools' }: { caseId: Id<'cases'>; status: string; operations?: boolean; supportHref?: string }) {
 const c = useCopy(); const { locale } = useLanguage();
 const requests = useQuery(api.referrals.listForCase, { caseId });
 const finished = ['closed','resolved','closed_unresolved'].includes(status);
 return <section className="space-y-4"><div><h3 className="text-lg">{c("Requests to other services")}</h3><p className="text-sm text-neutral-600">{c("Track requests here. The receiving service replies in its own workspace.")}</p></div>
 {requests === undefined ? <BrandLoading compact text={"Loading requests\u2026"}/> : !requests.length ? <p className="text-sm">{c("No requests to another service yet.")}</p> : requests.map(item => <article key={item._id} className="rounded-xl border bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{item.destinationService?.name ?? c("Receiving service")}</strong><span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold">{referralLabels[item.status]?.[locale] ?? c("Request recorded")}</span></div><p className="mt-2 text-sm">{item.publicId} · {item.reason}</p>{item.status === 'awaiting_beneficiary_consent' && <p className="mb-0 text-sm font-semibold text-primary">{c("Waiting for the person's permission. The receiving service has not been notified.")}</p>}{item.finalDisposition && <p className="mb-0 text-sm">{c("Result:")} {item.finalDisposition}</p>}<details className="mt-3 text-sm"><summary className="cursor-pointer font-semibold text-primary">{c("Read request history")}</summary>{item.events.map(event => <p key={event._id} className="mt-2 border-t pt-2">{displayLabel(event.type, locale)} · {date(event.occurredAt, locale)}</p>)}</details></article>)}
 {finished ? <p className="text-sm">{c("Case work has finished. You can read earlier requests here. New requests cannot be added.")}</p> : <details open={!requests?.length} className="rounded-2xl border bg-white"><summary className="cursor-pointer p-4 font-semibold text-primary">{c("Ask another service to help")}</summary><ReferralProposal caseId={caseId} supportHref={supportHref} /></details>}
 {operations && <Link className="inline-block min-h-11 py-3 text-sm font-semibold text-primary" to="/dashboard/staff?tab=referrals">{c("Review permission evidence and follow all referrals →")}</Link>}
 </section>;
}
