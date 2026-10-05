import { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, ShieldCheck, ArrowRight } from 'lucide-react';
import SaveServiceButton from '@/components/haki-yangu/SaveServiceButton';
import PublicInformationLinks from '@/components/haki-yangu/PublicInformationLinks';

export default function FindHelp() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [region, setRegion] = useState(params.get('region') ?? '');
  const [issue, setIssue] = useState(params.get('issue') ?? '');
  const requestParams = new URLSearchParams();
  if (region.trim()) requestParams.set('region', region.trim());
  if (['employment', 'land', 'family', 'safety', 'consumer', 'other'].includes(issue.trim().toLowerCase())) requestParams.set('issue', issue.trim().toLowerCase());
  const requestHref = `/request-help${requestParams.size ? `?${requestParams}` : ''}`;
  const services = useQuery(api.justiceServices.listPublicServices, {});
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

  return <Layout><section className="bg-[#FFF9F8] py-12 sm:py-20"><Container>
    <p className="text-sm font-bold uppercase tracking-widest text-primary">Haki Yangu · Find Help</p>
    <h1 className="mt-3 max-w-3xl text-4xl font-bold text-[#241820] sm:text-5xl">Find support that fits your situation</h1>
    <p className="mt-4 max-w-2xl text-[#665963]">Explore LSF-verified public services. You can ask Haki Yangu for help even when no nearby service is listed.</p>
    <div className="mt-8 grid gap-3 rounded-[28px] border border-[#EFDFE3] bg-white p-5 shadow-sm md:grid-cols-[1fr_1fr_1fr_auto]">
      <label className="text-sm font-semibold">Service or keyword<Input aria-label="Service or keyword" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Legal aid, office, provider" className="mt-2" /></label>
      <label className="text-sm font-semibold">Region or district<Input aria-label="Region or district" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Arusha" className="mt-2" /></label>
      <label className="text-sm font-semibold">Issue<Input aria-label="Issue" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. land" className="mt-2" /></label>
      <div className="flex items-end"><Button type="button" className="w-full gap-2 md:w-auto" onClick={recordSearch}><Search className="h-4 w-4" /> Search</Button></div>
    </div>
  </Container></section>
  <section id="service-results" className="py-12"><Container>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">Verified public services</h2><p className="text-sm text-[#665963]">Only current, verified public entries are shown.</p></div><Link to={requestHref}><Button variant="outline" className="gap-2">Ask for help <ArrowRight className="h-4 w-4" /></Button></Link></div>
    {services === undefined ? <p role="status">Loading services…</p> : results.length === 0 ? <div className="rounded-[24px] border border-[#EFDFE3] bg-[#FFF9F8] p-8"><h3 className="text-xl font-bold">No matching verified services listed yet</h3><p className="mt-2 text-[#665963]">Try a wider location or issue. You can still send a request to LSF for review.</p><Link to={requestHref} className="mt-5 inline-block"><Button>Request help from LSF</Button></Link></div> : <div className="grid gap-4 lg:grid-cols-2">{results.map((service) => <article key={String(service._id)} className="rounded-[24px] border border-[#EFDFE3] bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold text-[#241820]">{service.name}</h3><p className="text-sm text-[#665963]">{service.organizationName}</p></div><ShieldCheck aria-label="Verified" className="h-5 w-5 text-emerald-700" /></div><p className="mt-4 flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary" />{service.district}, {service.region}</p><p className="mt-2 text-sm text-[#665963]">{service.issueCategories.join(' · ') || service.serviceTypes.join(' · ')}</p><div className="mt-5 flex flex-wrap gap-2"><Link to={`/find-help/${encodeURIComponent(String(service._id))}`}><Button variant="outline">View details</Button></Link><Link to={`/request-help?serviceId=${encodeURIComponent(String(service._id))}&region=${encodeURIComponent(service.region)}&district=${encodeURIComponent(service.district)}`}><Button>Ask for support</Button></Link><SaveServiceButton serviceId={service._id as Id<'justice_services'>} /></div></article>)}</div>}
    {services !== undefined && results.length === 0 && <PublicInformationLinks issue={issue} />}
  </Container></section></Layout>;
}
