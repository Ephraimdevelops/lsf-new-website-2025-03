import { StaffWorkHome } from "@/components/dashboard/LiveWorkHome";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import Layout from '@/components/layout/Layout';
import StaffDashboard from './StaffDashboard';
import AdminSupport from '@/components/admin/AdminSupport';
import SupervisorPartners from '@/components/supervisor/SupervisorPartners';
import ParalegalIllustration from '@/components/paralegal/ParalegalIllustration';
import SearchFilterBar from '@/components/shared/SearchFilterBar';
import { staffTools } from '../../mobile/src/staff/tools';
import { usePersonalGreeting } from '@/hooks/usePersonalGreeting';
export default function StaffWorkspace(){
  const c = useCopy();
  const {locale} = useLanguage();
  const [params]=useSearchParams();
  if(params.has('tab')) return <StaffDashboard/>;
  const view=params.get('view')??'today';
  return <Layout><main className="work-page mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8"><nav aria-label={c("LSF work areas")} className="work-tabs">{[['today','Today'],['tools','Tools'],['support','Team support'],['partners','Partners']].map(([value,label])=><Link key={value} aria-current={view===value?'page':undefined} to={`/dashboard/staff${value==='today'?'':`?view=${value}`}`} className={`min-h-11 rounded-xl px-4 py-3 text-sm font-semibold ${view===value?'bg-primary text-white':'border bg-white text-neutral-600'}`}>{c(label)}</Link>)}</nav>{view==='support'?<AdminSupport/>:view==='partners'?<SupervisorPartners/>:view==='tools'?<Tools/>:<Today/>}</main></Layout>;
}
function Today(){return <StaffWorkHome/>;}
function Tools(){
  const c = useCopy();
  const {locale} = useLanguage();const [search,setSearch]=useState('');const [group,setGroup]=useState('');const visible=staffTools.filter(item=>(!group||group===item.group)&&[item.en,item.sw,item.body,item.bodySw].join(' ').toLowerCase().includes(search.trim().toLowerCase()));return <section className="space-y-5"><header className="flex items-center gap-4"><div className="flex-1"><h1 className="text-3xl font-semibold">{c("The right next step, in one place.")}</h1><p className="mt-2 text-neutral-600">{c("Find a tool for requests, cases or the team.")}</p></div><ParalegalIllustration pose="documents"/></header><SearchFilterBar value={search} onChange={setSearch} placeholder={c("Find a work tool")} label={c("Type")} title={c("Type of work")} count={Number(!!group)} onReset={()=>setGroup('')}><label className="block text-sm">{c("Type")}<select value={group} onChange={event=>setGroup(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border p-3">{[['','All tools'],['cases','Cases'],['team','Team'],['reports','Reports']].map(([value,label])=><option key={value} value={value}>{c(label)}</option>)}</select></label></SearchFilterBar><div className="grid gap-3 sm:grid-cols-2">{visible.map(item=><Link key={item.key} to={item.web} className="rounded-2xl border bg-white p-5"><h2 className="text-lg font-semibold">{locale === "sw" ? item.sw : item.en}</h2><p className="mb-0 mt-2 text-sm text-neutral-600">{locale === "sw" ? item.bodySw : item.body}</p></Link>)}</div>{!visible.length&&<p>{c("No matching tool. Try another word.")}</p>}</section>}
