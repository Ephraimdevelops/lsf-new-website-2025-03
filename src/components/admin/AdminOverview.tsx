import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileCheck2, FileText, HeartHandshake, Inbox, Search, Users } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { displayLabel } from '../../../shared/plainLanguage';
import { adminGroups, adminTools } from '../../../mobile/src/admin/adminTools';
import { WorkAction, WorkDashboard, WorkList, WorkPanel, WorkState, type WorkItem } from '@/components/dashboard/WorkArea';
import './admin-overview.css';
export type AdminOverviewData = { requests?: number; access?: string; support?: string; reviews?: string; documents?: string; applications?: string; people?: {id:string;name:string;role:string;organisation?:string}[] };
export default function AdminOverview({greeting,data,preview=false}:{greeting:string;data:AdminOverviewData;preview?:boolean}) {
 const {locale}=useLanguage();const sw=locale==='sw';const t=(a:string,b:string)=>sw?a:b;const [group,setGroup]=useState('cases');const [search,setSearch]=useState('');
 const empty=data.requests===0&&[data.access,data.support,data.reviews,data.documents].every(value=>value==='0');
 const queues=[
 {key:'requests',title:t('Maombi ya msaada','Help requests'),description:t('Soma maelezo na uamue hatua inayofuata.','Read the details and decide the next step.'),status:data.requests===undefined?'…':String(data.requests),href:'/dashboard/staff?tab=requests',icon:Inbox},
 {key:'access',title:t('Maombi ya ruhusa','Access requests'),description:t('Kagua maombi kabla ya kutoa ruhusa.','Review applications before granting access.'),status:data.access??'…',href:'/admin?tab=access',icon:Users},
 {key:'support',title:t('Msaada kwa timu','Team support'),description:t('Jibu wanaohitaji mwongozo au msaada.','Reply to people who need guidance or support.'),status:data.support??'…',href:'/admin?tab=support',icon:HeartHandshake},
 {key:'reviews',title:t('Maombi ya kukagua kesi','Case review requests'),description:t('Soma wasiwasi kuhusu huduma.','Read concerns about support.'),status:data.reviews??'…',href:'/dashboard/staff?tab=reviews',icon:FileCheck2},
 {key:'documents',title:t('Hati za kukagua','Documents to review'),description:t('Soma hati na eleza uamuzi wako.','Read each document and explain your decision.'),status:data.documents??'…',href:'/dashboard/staff?tab=documents',icon:FileText},
 ];
 const tools=adminTools.filter(tool=>(search.trim()||tool.group===group)&&[tool.en,tool.sw,tool.detail,tool.detailSw].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
 return <WorkDashboard eyebrow={greeting} title={t('Kazi za LSF','LSF work overview')} description={empty?t('Hakuna kazi inayosubiri hapa.','No work is waiting in these queues.'):t('Kagua maombi na maamuzi yanayosubiri.','Review requests and pending decisions.')} action={<WorkAction to="/dashboard/staff?tab=requests">{t('Fungua maombi','Open requests')}</WorkAction>} metrics={[
 {label:t('Maombi ya msaada','Help requests'),value:data.requests,href:queues[0].href,icon:Inbox},
 {label:t('Maombi ya ruhusa','Access requests'),value:data.access,href:queues[1].href,icon:Users},
 {label:t('Msaada kwa timu','Team support'),value:data.support,href:queues[2].href,icon:HeartHandshake},
 ]} aside={<><WorkPanel title={t('Wanaomba kujiunga','People joining')} description={t('Soma maombi kabla ya kutoa ruhusa.','Read applications before granting access.')} action={<Link to="/admin?tab=access">{t('Ona yote','View all')}</Link>}><WorkList loading={data.people===undefined} emptyTitle={t('Hakuna ombi linalosubiri.','No application is waiting.')} items={(data.people??[]).slice(0,3).map(person=>({key:person.id,title:person.name,description:[displayLabel(person.role,locale),person.organisation].filter(Boolean).join(' · '),href:preview?'/admin?tab=access':`/dashboard/access-requests/${person.id}`,icon:Users}))}/></WorkPanel>
 <WorkPanel title={t('Njia za haraka','Quick actions')}><div className="work-quiet-links"><Link to="/dashboard/paralegal-reviews">{t('Maombi ya wasaidizi wa kisheria','Paralegal applications')}<span>{data.applications??'…'}</span></Link><Link to="/dashboard/safeguarding">{t('Masuala ya usalama','Safety concerns')}</Link><Link to="/dashboard/reporting">{t('Ripoti','Reports')}</Link><Link to="/admin?tab=website">{t('Tovuti na machapisho','Website and publishing')}</Link></div></WorkPanel><p className="work-note">{t('“+” ina maana kuna taarifa zaidi. Idadi ni za orodha hizi tu.','“+” means more records are available. Counts refer only to these queues.')}</p></>}>
 <WorkPanel title={t('Kazi za kukagua','Work to review')} description={t('Chagua kazi ya kukagua.','Choose work to review.')}><WorkList items={queues}/></WorkPanel>
 <WorkPanel title={t('Unataka kufanya nini?','What would you like to do?')} description={t('Tafuta zana au chagua aina ya kazi.','Search for a tool or choose a work category.')}><label className="work-tool-finder"><Search size={18} aria-hidden="true"/><span className="sr-only">{t('Tafuta zana ya kazi','Find a work tool')}</span><input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder={t('Tafuta zana ya kazi','Find a work tool')}/></label><div className="work-tabs" role="group" aria-label={t('Aina ya kazi','Type of work')}>{adminGroups.filter(item=>item.key!=='all').map(item=><button key={item.key} type="button" aria-current={group===item.key&&!search.trim()?'page':undefined} onClick={()=>{setGroup(item.key);setSearch('');}}>{sw?item.sw:item.en}</button>)}</div><WorkList items={tools.map(tool=>({key:tool.key,title:sw?tool.sw:tool.en,description:sw?tool.detailSw:tool.detail,href:tool.web,icon:tool.group==='people'?Users:tool.group==='knowledge'?BookOpen:FileCheck2}))} emptyTitle={t('Hakuna zana yenye jina hilo','No tool matches that search')} emptyDescription={t('Jaribu neno jingine au chagua aina ya kazi.','Try another word or choose a work category.')}/></WorkPanel>
 </WorkDashboard>;
}
