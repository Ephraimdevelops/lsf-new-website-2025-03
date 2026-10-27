import BrandLoading from '@/components/shared/BrandLoading';
import { displayLabel } from "../../shared/plainLanguage";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Link } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Bookmark, CalendarDays, MapPin } from 'lucide-react';

export default function SavedHelp() {
  const c = useCopy();
  const { locale } = useLanguage();
  const saved = useQuery(api.justiceServices.mySavedServices, {});
  const visits = useQuery(api.justiceServices.myServiceVisits, {});
  const toggle = useMutation(api.justiceServices.toggleSavedService);
  const cancelVisit = useMutation(api.justiceServices.cancelServiceVisit);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  async function remove(serviceId: Id<'justice_services'>) { setBusy(serviceId); setError(''); try { await toggle({ serviceId, saved: false }); } catch { setError('Could not remove this service. Please try again.'); } finally { setBusy(null); } }
  async function cancel(visitId: Id<'justice_service_visits'>) { setBusy(visitId); setError(''); try { await cancelVisit({ visitId }); } catch { setError('Could not cancel this plan. Please try again.'); } finally { setBusy(null); } }
  return <Layout><section className="bg-[#FFF9F8] py-12"><Container><p className="text-sm font-bold uppercase tracking-widest text-primary">{c("Haki Yangu · Your support")}</p><h1 className="mt-3 text-4xl font-bold">{c("Saved help and visit plans")}</h1><p className="mt-3 max-w-2xl text-[#665963]">{c("Return to verified services and personal plans you made while exploring help.")}</p><div className="mt-5 flex flex-wrap gap-3"><Link to="/dashboard/user"><Button variant="outline">{c("My dashboard")}</Button></Link><Link to="/find-help"><Button>{c("Find more help")}</Button></Link></div></Container></section>
    <section className="py-10"><Container>{error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}<div className="grid gap-8 lg:grid-cols-2"><div><h2 className="mb-4 flex items-center gap-2 text-2xl font-bold"><Bookmark className="h-6 w-6 text-primary" />{c(" Saved services")}</h2>{saved === undefined ? <BrandLoading compact text={c("Loading saved services…")}/> : saved.length === 0 ? <div className="rounded-3xl border border-dashed p-8"><p>{c("No services saved yet.")}</p><Link className="mt-3 inline-block font-semibold text-primary underline" to="/find-help">{c("Explore verified services")}</Link></div> : <div className="space-y-3">{saved.map(({ service }) => <article key={String(service._id)} className="rounded-3xl border border-[#EFDFE3] bg-white p-5"><h3 className="text-lg font-bold">{service.name}</h3><p className="mt-2 flex items-center gap-2 text-sm text-[#665963]"><MapPin className="h-4 w-4" />{service.district}, {service.region}</p><p className="mt-2 text-sm text-emerald-700">{c("Verified public service")}</p><div className="mt-4 flex flex-wrap gap-2"><Link to={`/find-help/${encodeURIComponent(String(service._id))}`}><Button variant="outline">{c("View service")}</Button></Link><Link to={`/request-help?serviceId=${encodeURIComponent(String(service._id))}&region=${encodeURIComponent(service.region)}&district=${encodeURIComponent(service.district)}`}><Button>{c("Ask for support")}</Button></Link><Button disabled={busy === String(service._id)} variant="ghost" onClick={() => void remove(service._id as Id<'justice_services'>)}>{c("Remove")}</Button></div></article>)}</div>}</div>
    <div><h2 className="mb-4 flex items-center gap-2 text-2xl font-bold"><CalendarDays className="h-6 w-6 text-primary" />{c(" Visit and call plans")}</h2>{visits === undefined ? <BrandLoading compact text={c("Loading plans…")}/> : visits.filter(({ visit }) => visit.status === 'planned').length === 0 ? <div className="rounded-3xl border border-dashed p-8"><p>{c("No upcoming personal plans.")}</p><p className="mt-2 text-sm text-[#665963]">{c("A visit plan is a reminder for you; the service has not confirmed an appointment.")}</p></div> : <div className="space-y-3">{visits.filter(({ visit }) => visit.status === 'planned').map(({ visit, service }) => <article key={visit._id} className="rounded-3xl border border-[#EFDFE3] bg-white p-5"><h3 className="text-lg font-bold">{service?.name ?? 'Service no longer listed'}</h3><p className="mt-2 text-sm">{new Date(visit.plannedFor).toLocaleString((locale === 'sw' ? 'sw-TZ' : 'en-TZ'), { timeZone: 'Africa/Dar_es_Salaam', dateStyle: 'medium', timeStyle: 'short' })} · {displayLabel(visit.channel, locale)}</p><p className="mt-2 text-sm text-[#665963]">{c("Personal plan, not a confirmed appointment.")}</p><Button className="mt-4" variant="outline" disabled={busy === visit._id} onClick={() => void cancel(visit._id)}>{c("Cancel plan")}</Button></article>)}</div>}</div></div></Container></section></Layout>;
}
