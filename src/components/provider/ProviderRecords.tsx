import { useState } from 'react';
import { useQuery } from 'convex/react';
import { CalendarDays, FileText } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import SearchFilterBar from '../shared/SearchFilterBar';
import { useLanguage } from '@/providers/LanguageProvider';
import { displayLabel } from '../../../shared/plainLanguage';
import { WorkList, WorkPanel } from '@/components/dashboard/WorkArea';
export default function ProviderRecords({kind}:{kind:'appointments'|'documents'}) {
 const {locale}=useLanguage();const t=(sw:string,en:string)=>locale==='sw'?sw:en;
 const appointments=useQuery(api.caseManagement.myAppointments,kind==='appointments'?{context:'work'}:'skip');const documents=useQuery(api.caseManagement.myDocuments,kind==='documents'?{context:'work'}:'skip');const [search,setSearch]=useState('');const [status,setStatus]=useState('all');
 const rows=kind==='appointments'?appointments:documents;const visible=rows?.filter(item=>[item.casePublicId,item.caseSummary,'name' in item?item.name:'',displayLabel(item.status,locale)].join(' ').toLowerCase().includes(search.trim().toLowerCase())&&(status==='all'||item.status===status));
 const states=kind==='appointments'?['scheduled','completed','cancelled','missed']:['pending_review','accepted','rejected'];
 return <div><SearchFilterBar value={search} onChange={setSearch} placeholder={kind==='appointments'?t('Tafuta kesi au miadi','Find a case or appointment'):t('Tafuta hati au kesi','Find a file or case')} label={t('Hali','Status')} title={t('Chagua hali','Choose status')} count={Number(status!=='all')} onReset={()=>setStatus('all')}><label className="grid gap-2">{t('Hali','Status')}<select value={status} onChange={event=>setStatus(event.target.value)}><option value="all">{t('Zote','All')}</option>{states.map(value=><option key={value} value={value}>{displayLabel(value,locale)}</option>)}</select></label></SearchFilterBar>
 <WorkPanel title={kind==='appointments'?t('Miadi ya kazi','Work appointments'):t('Hati za kesi','Case documents')} description={t('Taarifa 100 za karibuni ndani ya ruhusa zako. Saa ni za Tanzania.','The latest 100 records within your work access. Times use Tanzania time.')}><WorkList loading={rows===undefined} emptyTitle={search||status!=='all'?t('Hakuna taarifa zinazolingana.','No matching records.'):t('Hakuna taarifa hapa kwa sasa.','No records here yet.')} emptyDescription={search||status!=='all'?t('Futa chaguo au jaribu neno jingine.','Clear a filter or try another word.'):undefined} items={(visible??[]).map(item=>({key:item._id,title:'name' in item?item.name:item.casePublicId,description:item.casePublicId,status:displayLabel(item.status,locale),meta:'startsAt' in item?new Date(item.startsAt).toLocaleString(locale==='sw'?'sw-TZ':'en-TZ',{dateStyle:'medium',timeStyle:'short',timeZone:'Africa/Dar_es_Salaam'}):undefined,href:`/dashboard/provider?tab=cases&case=${item.caseId}&section=${kind}`,icon:kind==='appointments'?CalendarDays:FileText}))}/></WorkPanel></div>;
}
