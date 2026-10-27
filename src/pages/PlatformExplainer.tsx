import { useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Bot, Check, ChevronDown, Database, FileText, GitBranch, KeyRound, Layers, MapPin, Monitor, ShieldCheck, Smartphone, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/shared/SEOHead';
import Container from '@/components/shared/Container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { nodes, aiFlows, aiBoundaries, matchFlows, personas, dataPaths, platformDetails } from '@/content/platformExplainer';

const sections = [
  ['map', 'Platform map', Layers], ['ai', 'AI engine', Bot], ['help', 'Finding help', MapPin],
  ['people', 'People & cases', Users], ['data', 'Data & security', ShieldCheck],
  ['tools', 'Engineering tools', Database], ['readiness', 'Review & readiness', Check],
] as const;
const scenarioOptions = [['rights', 'Explain my legal options'], ['support', 'Find a nearby paralegal'], ['appointment', 'Request an appointment'], ['referral', 'Staff: prepare a referral'], ['voice', 'Ask by voice'], ['document', 'Discuss my document']];
const matchOptions = [['browse', 'Website directory / AI service search'], ['service', 'Mobile: ranked service recommendations'], ['paralegal', 'Public paralegal directory'], ['assignment', 'Staff: assignment recommendations']];
const personaOptions = [['user', 'Beneficiary'], ['paralegal', 'Paralegal'], ['provider_staff', 'Partner organisation worker'], ['staff', 'LSF staff'], ['supervisor', 'Supervisor'], ['safeguarding_officer', 'Safeguarding officer'], ['content_editor', 'Content editor'], ['admin', 'Administrator'], ['donor', 'Donor'], ['stakeholder', 'Stakeholder']];
const dataOptions = [['law', 'Legal knowledge library'], ['private', 'Private document or photo'], ['voice', 'Voice inquiry and spoken answer'], ['security', 'Access, consent and safeguards']];

function Facts({ rows }: { rows: string[][] }) {
  return <dl className="divide-y divide-slate-200">{rows.map(([term, detail]) => <div key={term} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)] sm:gap-6"><dt className="text-sm font-semibold text-slate-900">{term}</dt><dd className="min-w-0 break-words text-sm leading-relaxed text-slate-600">{detail}</dd></div>)}</dl>;
}
function Flow({ rows }: { rows: string[][] }) {
  return <ol className="my-8 space-y-0" aria-live="polite">{rows.map(([title, detail], index) => <li key={title} className="relative flex gap-4 pb-7 last:pb-0">{index < rows.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[17px] top-9 w-px bg-rose-200" />}<span aria-hidden="true" className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-900">{index + 1}</span><div className="min-w-0 pt-1"><h3 className="text-base font-semibold text-slate-900">{title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{detail}</p></div></li>)}</ol>;
}
function Picker({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: string[][]; onChange: (value: string) => void }) {
  return <div className="max-w-xl"><label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">{label}</label><select id={id} value={value} onChange={event => onChange(event.target.value)} className="min-h-12 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800">{options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></div>;
}
function Disclosure({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return <details open={open || undefined} className="group rounded-2xl border border-slate-200 bg-white"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-800">{title}<ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" /></summary><div className="px-5 pb-5">{children}</div></details>;
}
function Boundary({ children }: { children: ReactNode }) {
  return <p className="my-6 border-l-2 border-teal-600 bg-teal-50 px-4 py-3 text-sm leading-relaxed text-teal-950">{children}</p>;
}

export default function PlatformExplainer() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('section');
  const section = sections.some(([id]) => id === requested) ? requested! : 'map';
  const [node, setNode] = useState('ai');
  const [scenario, setScenario] = useState('rights');
  const [matcher, setMatcher] = useState('browse');
  const [persona, setPersona] = useState('user');
  const [dataPath, setDataPath] = useState('law');
  const selected = nodes[node];
  const match = matchFlows[matcher];
  const person = personas[persona];
  const data = dataPaths[dataPath];
  const chooseSection = (value: string) => { const next = new URLSearchParams(params); next.set('section', value); setParams(next, { preventScrollReset: true }); };
  const nodeButton = (id: string, label: string, Icon: typeof Bot) => <button key={id} type="button" aria-pressed={node === id} onClick={() => setNode(id)} className={`flex min-h-16 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800 ${node === id ? 'border-rose-800 bg-rose-50 text-rose-950 shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50/50'}`}><Icon aria-hidden="true" className="h-5 w-5 shrink-0" /><span>{label}</span></button>;
  const arrow = <div className="flex justify-center py-3" aria-hidden="true"><ArrowDown className="h-5 w-5 text-slate-400" /></div>;
  return <Layout><SEOHead title="How Haki Yangu Works" description="Explore how Haki Yangu connects legal help, Saada AI, paralegals, casework, reviewed knowledge and secure web and mobile services." /><div lang="en" className="bg-[#fcf9f8] text-slate-950">
    <section className="border-b border-rose-100 bg-gradient-to-br from-rose-50 via-white to-teal-50 py-10 sm:py-14">
      <Container>
        <Link to="/haki-yangu" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-rose-900 hover:underline"><ArrowLeft className="h-4 w-4" />Haki Yangu</Link>
        <div className="mt-5 flex max-w-4xl flex-col items-start gap-5">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-teal-800"><GitBranch className="h-4 w-4" />Inside the platform</span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#520a28] sm:text-4xl">How Haki Yangu works</h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600">From your first question to finding support and following a case. Explore the people, AI, knowledge and engineering that connect the website and mobile app.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600"><span>Architecture reviewed 26 October 2026</span><span>Informational walkthrough · not a live status dashboard</span></div>
        </div>
      </Container>
    </section>
    <Container className="py-8 sm:py-12">
      <Tabs value={section} onValueChange={chooseSection}>
        <TabsList aria-label="Explore the Haki Yangu platform" className="mb-7 flex h-auto w-full flex-wrap justify-start gap-2 rounded-none bg-transparent p-0">{sections.map(([id, label, Icon]) => <TabsTrigger key={id} value={id} className="min-h-11 whitespace-normal rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 data-[state=active]:border-rose-800 data-[state=active]:bg-rose-800 data-[state=active]:text-white"><Icon className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />{label}</TabsTrigger>)}</TabsList>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
          <TabsContent value="map" className="mt-0">
            <h2 className="text-xl font-semibold text-slate-900">One platform, connected services</h2><p className="mt-2 text-sm text-slate-600">Select a component to see its role.</p>
            <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <figure className="min-w-0" aria-label="People use web and mobile, connected through identity and a shared backend to six product services.">
                <figcaption className="text-center text-sm leading-relaxed text-slate-600">Beneficiaries · Paralegals · Partner teams · LSF · Editors · Donors</figcaption>{arrow}
                <div className="grid gap-3 sm:grid-cols-2">{nodeButton('web', 'Website', Monitor)}{nodeButton('mobile', 'Mobile app', Smartphone)}</div>{arrow}
                <div className="grid gap-3 sm:grid-cols-2">{nodeButton('identity', 'Clerk · identity', KeyRound)}{nodeButton('backend', 'Convex · shared backend', Database)}</div>{arrow}
                <p className="mb-3 text-center text-xs text-slate-500">Product services · server-authorised access</p>
                <div className="grid gap-3 sm:grid-cols-2">{nodeButton('ai', 'Saada AI', Bot)}{nodeButton('help', 'Find help', MapPin)}{nodeButton('cases', 'Cases & referrals', Users)}{nodeButton('documents', 'Documents & letters', FileText)}{nodeButton('learning', 'Rights & training', BookOpen)}{nodeButton('operations', 'Admin & reporting', ShieldCheck)}</div>{arrow}
                <p className="text-center text-xs leading-relaxed text-slate-500">OpenAI · Mapbox · Expo Push · Resend · Sentry · private file scanner</p>
              </figure>
              <aside aria-live="polite" aria-atomic="true" className="min-w-0 self-start rounded-2xl bg-slate-50 p-5 sm:p-6"><span className="text-xs font-semibold uppercase tracking-wider text-rose-800">Selected component</span><h3 className="mb-5 mt-2 text-lg font-semibold">{selected.name}</h3><Facts rows={selected.facts} /></aside>
            </div>
          </TabsContent>
          <TabsContent value="ai" className="mt-0">
            <h2 className="text-xl font-semibold">Saada / Haki Yangu AI</h2><p className="mb-6 mt-2 text-sm text-slate-600">One main agent · 24 server tools · 8 workflow skills · English and Kiswahili</p>
            <Picker id="platform-scenario" label="Trace a request" value={scenario} options={scenarioOptions} onChange={setScenario} /><Flow rows={aiFlows[scenario]} /><Boundary>{aiBoundaries[scenario]}</Boundary>
            <div className="space-y-3"><Disclosure title="What controls the agent"><Facts rows={platformDetails.agentRules} /></Disclosure><Disclosure title="Explore all 24 tools"><Facts rows={platformDetails.toolGroups} /></Disclosure><Disclosure title="Explore the 8 workflow skills"><ul className="grid list-inside list-disc gap-3 text-sm text-slate-600 sm:grid-cols-2">{platformDetails.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></Disclosure></div>
          </TabsContent>
          <TabsContent value="help" className="mt-0">
            <h2 className="mb-6 text-xl font-semibold">How help is found and recommended</h2><Picker id="platform-matcher" label="Which matching path?" value={matcher} options={matchOptions} onChange={setMatcher} />
            <Flow rows={match.flow} /><h3 className="mb-5 text-base font-semibold">{match.caption}</h3><Facts rows={match.rows} /><Boundary>{match.boundary}</Boundary>
            {platformDetails.organisationDetails.map(detail => <Disclosure key={detail.title} title={detail.title}><Facts rows={detail.rows} /></Disclosure>)}
          </TabsContent>
          <TabsContent value="people" className="mt-0">
            <h2 className="mb-6 text-xl font-semibold">People, permissions and casework</h2><Picker id="platform-persona" label="Whose work are we following?" value={persona} options={personaOptions} onChange={setPersona} />
            <div aria-live="polite"><Flow rows={person.flow} /><Facts rows={person.rows} /></div><div className="mt-7"><Disclosure title="The shared case lifecycle"><Flow rows={platformDetails.lifecycle} /></Disclosure></div>
          </TabsContent>
          <TabsContent value="data" className="mt-0">
            <h2 className="mb-6 text-xl font-semibold">Knowledge, consent and safeguards</h2><Picker id="platform-data" label="Follow the data" value={dataPath} options={dataOptions} onChange={setDataPath} />
            <Flow rows={data.flow} /><Boundary>{data.boundary}</Boundary>{platformDetails.securityDetails.map(detail => <Disclosure key={detail.title} title={detail.title}><Facts rows={detail.rows} /></Disclosure>)}
          </TabsContent>
          <TabsContent value="tools" className="mt-0">
            <h2 className="text-xl font-semibold">The engineering behind the experience</h2><p className="mb-6 mt-2 text-sm text-slate-600">Tools and responsibilities from the reviewed implementation. Model defaults and release configuration can change.</p>
            <div className="space-y-3">{platformDetails.engineeringDetails.map((detail, i) => <Disclosure key={detail.title} title={detail.title} open={i === 0}><Facts rows={detail.rows} /></Disclosure>)}</div>
          </TabsContent>
          <TabsContent value="readiness" className="mt-0">
            <h2 className="text-xl font-semibold">What makes the platform useful and ready?</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">Working screens and tools need reviewed knowledge, verified services and tested operations. This page explains those requirements; it does not measure current availability.</p>
            <Flow rows={[
              ['Review legal sources independently', 'Confirm publisher, jurisdiction, edition, amendments, extraction and currency. Searchable OCR copies also need transcription review.'],
              ['Publish reviewed guides and pathways', 'Check legal claims, citations and the meaning in English and Kiswahili. Retire or correct outdated material.'],
              ['Verify providers and public contacts', 'Confirm region, district, coverage, eligibility, safe contact details and current intake before recommendations. Keep confidential locations restricted.'],
              ['Test complete user journeys', 'Rehearse questions, voice, documents, request submission, worker acceptance, appointments and consented referrals across roles.'],
              ['Verify release and operations', 'Test real devices, production authentication, notifications, signing, backup/restore, alert ownership and incident response before release.'],
            ]} />
            <Boundary>Uploading is not approval. A search result is not a confirmed appointment. An AI draft is not a submitted request or sent referral.</Boundary>
            <p className="text-sm leading-relaxed text-slate-600">Authorised teams manage source reviews, directory records, access and AI governance in their existing workspaces. Live readiness and operational details remain within those permission-controlled tools.</p>
          </TabsContent>
        </div>
      </Tabs>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-teal-50 p-6"><div><h2 className="text-base font-semibold text-teal-950">Choose your next step</h2><p className="mt-1 text-sm text-teal-900">Explore help, ask a question, or send a request for human review.</p></div><div className="flex flex-wrap gap-3">{[['/find-help', 'Find help'], ['/sara', 'Ask Saada'], ['/request-help', 'Request help']].map(([to, label]) => <Link key={to} to={to} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-900 hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{label}<ArrowRight className="h-4 w-4" /></Link>)}</div></div>
    </Container>
  </div></Layout>;
}
