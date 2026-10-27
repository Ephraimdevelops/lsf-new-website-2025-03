import BrandLoading from '@/components/shared/BrandLoading';
import { legalTopicLabel } from "@/lib/legalTopicLabel";
import { directoryLabel } from "../../mobile/src/directoryLabels";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import ParalegalDirectory from "@/components/location/ParalegalDirectory";
import { lazy, Suspense } from "react";
const ServiceMap = lazy(() => import("@/components/location/ServiceMap"));
import { useNavigate } from "react-router-dom";
import NearbySearch, { type SearchPoint } from "@/components/location/NearbySearch";
import SearchFilterBar from '@/components/shared/SearchFilterBar';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import SaveServiceButton from '@/components/haki-yangu/SaveServiceButton';
import PublicInformationLinks from '@/components/haki-yangu/PublicInformationLinks';

export default function FindHelp() {
  const c = useCopy();
  const { locale } = useLanguage();
  const navigate = useNavigate();
  const [mapVisible, setMapVisible] = useState(false);
  const [origin, setOrigin] = useState<SearchPoint>();
  const [radiusKm, setRadius] = useState<number>();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [region, setRegion] = useState(params.get('region') ?? '');
  const [issue, setIssue] = useState(params.get('issue') ?? '');
  const requestParams = new URLSearchParams();
  if (region.trim()) requestParams.set('region', region.trim());
  if (['employment', 'land', 'family', 'safety', 'consumer', 'other'].includes(issue.trim().toLowerCase())) requestParams.set('issue', issue.trim().toLowerCase());
  const requestHref = `/request-help${requestParams.size ? `?${requestParams}` : ''}`;
  const services = useQuery(api.justiceServices.listPublicServices, { origin: origin ? { latitude: origin.latitude, longitude: origin.longitude } : undefined, radiusKm });
  const recordJourney = useMutation(api.journeyAnalytics.record);
  function recordSearch() {
    if (services === undefined) return;
    void recordJourney({ surface: 'web', step: 'find_help_search' }).catch(() => undefined);
    if (results.length === 0) void recordJourney({ surface: 'web', step: 'find_help_no_results' }).catch(() => undefined);
    document.getElementById('service-results')?.scrollIntoView({ behavior: 'smooth' });
  }
  const results = useMemo(() => (services ?? []).filter((service) => {
    const text = `${service.name} ${service.organizationName ?? ''} ${service.district} ${service.region} ${service.issueCategories.join(' ')} ${service.serviceTypes.join(' ')}`.toLowerCase();
    return (!search.trim() || text.includes(search.trim().toLowerCase()))
      && (!region.trim() || service.region.toLowerCase().includes(region.trim().toLowerCase()) || service.district.toLowerCase().includes(region.trim().toLowerCase()))
      && (!issue.trim() || service.issueCategories.some((item) => item.toLowerCase().includes(issue.trim().toLowerCase())));
  }), [services, search, region, issue]);

  return <Layout><section className="bg-[#FFF9F8] py-8 sm:py-12"><Container>
    <p className="text-sm font-bold uppercase tracking-widest text-primary">{c("Haki Yangu · Find Help")}</p>
    <h1 className="mt-3 max-w-3xl text-4xl font-bold text-[#241820] sm:text-5xl">{c("Find help near you")}</h1>
    <p className="mt-4 max-w-2xl text-[#665963]">{c("Find a service in your area, or ask LSF for help.")}</p>
    <div className="mt-6">
      <NearbySearch origin={origin} radiusKm={radiusKm} onChange={(point, radius) => { if (point && point !== origin) setRegion(""); setOrigin(point); setRadius(radius); }} />
    <SearchFilterBar sw={locale === "sw"} value={search} onChange={setSearch} placeholder={c("Find help")} label={c("Area")} title={c("Choose an area or topic")} count={Number(!!region.trim()) + Number(!!issue)} summary={[region.trim(), issue === 'employment' ? 'Work' : issue === 'consumer' ? 'Goods and services' : issue.charAt(0).toUpperCase() + issue.slice(1)].filter(Boolean).join(' · ')} onSubmit={recordSearch} onReset={() => { setRegion(''); setIssue(''); }}>
        <label className="block text-sm font-semibold">{c("Region or district")}<Input value={region} onChange={e => setRegion(e.target.value)} placeholder={c("e.g. Dar es Salaam")} className="mt-2 min-h-12" /></label>
        <label className="block text-sm font-semibold">{c("What do you need help with?")}<select value={issue} onChange={e => setIssue(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border bg-white px-3"><option value="">{c("All topics")}</option>{['employment', 'land', 'family', 'safety', 'consumer', 'other'].map(value => <option key={value} value={value}>{legalTopicLabel(value, locale)}</option>)}</select></label>
      </SearchFilterBar>
    </div>
  </Container></section>
  <section id="service-results" className="py-8"><Container>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">{c("Verified public services")}</h2><p className="text-sm text-[#665963]">{c("Only current, verified public entries are shown.")}</p></div><Link to={requestHref}><Button variant="outline" className="gap-2">{c("Ask for help ")}<ArrowRight className="h-4 w-4" /></Button></Link></div>
    <button type="button" className="min-h-12 font-semibold text-primary" aria-pressed={mapVisible} onClick={() => setMapVisible(v => !v)}>{mapVisible ? c("Hide map") : "Show matching offices on map"}</button>
    {mapVisible && <Suspense fallback={<BrandLoading compact text={c("Loading map…")}/>}><ServiceMap places={results.map(s => ({ id: String(s._id), name: s.name, latitude: s.latitude, longitude: s.longitude }))} onSelect={id => navigate(`/find-help/${encodeURIComponent(id)}`)} /></Suspense>}
    {services === undefined ? <BrandLoading compact text={c("Loading services…")}/> : results.length === 0 ? <div className="rounded-[24px] border border-[#EFDFE3] bg-[#FFF9F8] p-8"><h3 className="text-xl font-bold">{c("No matching verified services listed yet")}</h3><p className="mt-2 text-[#665963]">{c("Try a wider location or issue. You can still send a request to LSF for review.")}</p><Link to={requestHref} className="mt-5 inline-block"><Button>{c("Request help from LSF")}</Button></Link></div> : <div className="grid gap-4 lg:grid-cols-2">{results.map((service) => <article key={String(service._id)} className="rounded-[24px] border border-[#EFDFE3] bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold text-[#241820]">{service.name}</h3><p className="text-sm text-[#665963]">{service.organizationName}</p></div><ShieldCheck aria-label={c("Verified")} className="h-5 w-5 text-emerald-700" /></div><p className="mt-4 flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary" />{service.distanceKm != null ? `${service.distanceKm.toFixed(1)} km · ${locale === "sw" ? "mstari wa moja kwa moja" : "straight-line"} · ` : ""}{service.district}, {service.region}</p><p className="mt-2 text-sm text-[#665963]">{service.issueCategories.map(value => legalTopicLabel(value, locale)).join(' · ') || service.serviceTypes.map(value => directoryLabel(value, locale === 'sw')).join(' · ')}</p><div className="mt-5 flex flex-wrap gap-2"><Link to={`/find-help/${encodeURIComponent(String(service._id))}`}><Button variant="outline">{c("View details")}</Button></Link><Link to={`/request-help?serviceId=${encodeURIComponent(String(service._id))}&region=${encodeURIComponent(service.region)}&district=${encodeURIComponent(service.district)}`}><Button>{c("Ask for support")}</Button></Link><SaveServiceButton serviceId={service._id as Id<'justice_services'>} /></div></article>)}</div>}
    {services !== undefined && results.length === 0 && <PublicInformationLinks issue={issue} />}
    <ParalegalDirectory origin={origin} radiusKm={radiusKm} region={region} issue={issue} />
  </Container></section></Layout>;
}
