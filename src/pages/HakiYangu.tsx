import { ArrowRight, BookOpen, BriefcaseBusiness, FileText, FolderOpen, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';

const journeys = [
  { title: 'Find Help', description: 'Explore listed legal aid services and choose how to contact them.', to: '/find-help', icon: MapPin, style: 'bg-teal-700 text-white' },
  { title: 'Ask Saada', description: 'Ask a question and get guidance from the assistant.', to: '/sara', icon: MessageCircle, style: 'bg-rose-800 text-white' },
  { title: 'Request Help', description: 'Tell us what happened and send a request for human support.', to: '/request-help', icon: FileText, style: 'bg-orange-600 text-white' },
  { title: 'Know Your Rights', description: 'Read available guides in plain language.', to: '/know-your-rights', icon: BookOpen, style: 'bg-amber-100 text-slate-900' },
];

const nextSteps = [
  { title: 'Your cases', description: 'Check your request and case status, messages and next steps.', to: '/dashboard/user', icon: BriefcaseBusiness },
  { title: 'Saved help', description: 'Return to services you saved while exploring.', to: '/dashboard/user/saved-help', icon: FolderOpen },
  { title: 'Your documents', description: 'Open documents connected to your requests and cases.', to: '/dashboard/user/documents', icon: FileText },
];

export default function HakiYangu() {
  return (
    <Layout>
      <main className="bg-[#fcf9f8] text-slate-950">
        <section className="relative overflow-hidden bg-[#fffaf8] py-16 sm:py-20 lg:py-28">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-rose-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl" />
          <Container className="relative grid gap-12 lg:grid-cols-[1fr_.85fr] lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-900 shadow-sm">
                <ShieldCheck className="h-4 w-4" /> Haki Yangu · Legal help in Tanzania
              </span>
              <h1 className="mt-7 text-5xl font-black tracking-tight text-[#520a28] sm:text-6xl lg:text-7xl">A clearer way to find legal help.</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-700">Explore services, ask a question, or tell us what happened. Choose the path that feels right for you.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/find-help" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 font-bold text-white shadow-md transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">Find Help <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/request-help" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#870b3a] px-6 py-3 font-bold text-white shadow-md transition hover:bg-[#67062a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800">Request Help <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <p className="mt-5 text-sm text-slate-600">You can explore services and guides before signing in. Sending a request requires an account.</p>
            </div>
            <div className="rounded-[2rem] border border-rose-100 bg-white/90 p-5 shadow-[0_25px_70px_-30px_rgba(82,10,40,.35)] sm:p-7">
              <p className="mb-5 text-sm font-bold uppercase tracking-[.18em] text-[#870b3a]">How can we help today?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {journeys.map(({ title, description, to, icon: Icon, style }) => (
                  <Link key={to} to={to} className={`group flex min-h-44 flex-col rounded-2xl p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${style}`}>
                    <Icon className="h-9 w-9" strokeWidth={1.8} />
                    <strong className="mt-5 text-xl">{title}</strong>
                    <span className="mt-1 text-sm leading-snug opacity-90">{description}</span>
                    <ArrowRight className="ml-auto mt-auto h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16 sm:py-20" aria-labelledby="paths-heading">
          <Container>
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[.18em] text-rose-800">Two ways to begin</p>
              <h2 id="paths-heading" className="mt-3 text-3xl font-black text-[#520a28] sm:text-4xl">Your situation determines the next step.</h2>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <article className="rounded-3xl border border-rose-100 bg-[#fff1f4] p-7 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#870b3a] text-white"><FileText className="h-6 w-6" /></div>
                <h3 className="mt-5 text-2xl font-bold text-[#520a28]">I have a problem and need support</h3>
                <p className="mt-3 text-slate-700">Describe what happened, review what you will send, then follow your request and any next steps in your account.</p>
                <Link to="/request-help" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-[#870b3a] underline underline-offset-4">Start a request <ArrowRight className="h-4 w-4" /></Link>
              </article>
              <article className="rounded-3xl border border-teal-100 bg-[#eaf8f5] p-7 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white"><MapPin className="h-6 w-6" /></div>
                <h3 className="mt-5 text-2xl font-bold text-teal-950">I want to explore nearby help</h3>
                <p className="mt-3 text-slate-700">Search the service directory, read available details and save useful places. You can request support later if you still need it.</p>
                <Link to="/find-help" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-teal-800 underline underline-offset-4">Find services <ArrowRight className="h-4 w-4" /></Link>
              </article>
            </div>
          </Container>
        </section>

        <section className="border-y border-rose-100 bg-white py-16 sm:py-20" aria-labelledby="continue-heading">
          <Container>
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[.18em] text-rose-800">Continue your journey</p>
              <h2 id="continue-heading" className="mt-3 text-3xl font-black text-[#520a28] sm:text-4xl">Everything you need to follow up.</h2>
              <p className="mt-3 text-slate-700">Sign in to see information connected to your account.</p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {nextSteps.map(({ title, description, to, icon: Icon }) => (
                <Link key={to} to={to} className="group rounded-2xl border border-slate-200 bg-[#fcf9f8] p-6 shadow-sm transition hover:border-rose-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800">
                  <Icon className="h-7 w-7 text-[#870b3a]" />
                  <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#870b3a]">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-[#520a28] py-12 text-white">
          <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-2xl font-bold">Not sure where to begin?</h2><p className="mt-2 text-rose-100">Saada can help you understand your options before you decide what to do.</p></div>
            <Link to="/sara" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-[#520a28] transition hover:bg-rose-50">Ask Saada <ArrowRight className="h-4 w-4" /></Link>
          </Container>
        </section>
      </main>
    </Layout>
  );
}
