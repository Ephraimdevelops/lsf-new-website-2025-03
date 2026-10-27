import BrandLoading from '@/components/shared/BrandLoading';
import type { ReactNode, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, CircleDashed, Inbox, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import './work-area.css';

export type WorkMetric = { label: string; value?: number | string; note?: string; href?: string; icon?: LucideIcon };
export type WorkItem = { key: string; title: string; description?: ReactNode; href: string; status?: string; meta?: string; action?: string; icon?: LucideIcon; attention?: boolean };
export function WorkHeader({ eyebrow, title, description, action, aside }: { eyebrow?: string; title: string; description?: ReactNode; action?: ReactNode; aside?: ReactNode }) {
 return <header className="work-heading"><div>{eyebrow&&<p className="work-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description&&<p className="work-description">{description}</p>}</div>{(action||aside)&&<div className="work-heading-actions">{aside}{action}</div>}</header>;
}
export function WorkAction({to,children,secondary=false}:{to:string;children:ReactNode;secondary?:boolean}) {return <Link className={`work-action${secondary?' is-secondary':''}`} to={to}>{children}<ArrowRight size={17} aria-hidden="true"/></Link>;}
export function WorkStats({items}:{items:WorkMetric[]}) {
 const {locale}=useLanguage();return <div className="work-stats" style={{'--work-stat-count':Math.min(items.length,4)} as CSSProperties}>{items.map(({label,value,note,href,icon:Icon},i)=>{
 const body=<><span className={`work-stat-icon tone-${i%4}`}>{Icon?<Icon size={20} aria-hidden="true"/>:<Inbox size={20} aria-hidden="true"/>}</span><span className="work-stat-data"><strong className={typeof value === "string" && value.length > 12 ? "is-copy" : undefined} aria-label={value===undefined?(locale==='sw'?'Inapakia':'Loading'):undefined}>{value??'…'}</strong><span>{label}</span>{note&&<small>{note}</small>}</span>{href&&<ChevronRight className="work-stat-arrow" size={17} aria-hidden="true"/>}</>;
 return href?<Link className="work-stat" key={label} to={href}>{body}</Link>:<div className="work-stat" key={label}>{body}</div>;
 })}</div>;
}
export function WorkPanel({ title, description, action, children, className='' }: {title:string;description?:ReactNode;action?:ReactNode;children:ReactNode;className?:string}) {return <section className={`work-panel ${className}`}><div className="work-panel-heading"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{action}</div><div className="work-panel-body">{children}</div></section>;}
export function WorkState({loading=false,title,description,action}:{loading?:boolean;title:string;description?:ReactNode;action?:ReactNode}) {if(loading)return <BrandLoading compact text={title} detail={typeof description==='string'?description:undefined}/>;const Icon=CheckCircle2;return <div className={`work-state${loading?' is-loading':''}`} role={loading?'status':undefined}><span><Icon size={24} aria-hidden="true"/></span><h3>{title}</h3>{description&&<p>{description}</p>}{action}</div>;}
export function WorkList({items,loading,emptyTitle,emptyDescription}:{items:WorkItem[];loading?:boolean;emptyTitle?:string;emptyDescription?:string}) {
 const {locale}=useLanguage();const sw=locale==='sw';if(loading)return <WorkState loading title={sw?'Inapakia kazi…':'Loading work…'}/>;
 if(!items.length)return <WorkState title={emptyTitle??(sw?'Hakuna kazi inayosubiri hapa.':'Nothing is waiting here.')} description={emptyDescription}/>;
 return <ul className="work-list">{items.map(({key,title,description,href,status,meta,action,icon:Icon=Inbox,attention})=><li key={key}><Link className={`work-row${attention?' needs-attention':''}`} to={href}><span className="work-row-symbol"><Icon size={20} aria-hidden="true"/></span><span className="work-row-copy"><strong>{title}</strong>{description&&<span>{description}</span>}{meta&&<small>{meta}</small>}</span><span className={`work-row-end${status && /^[0-9+…]+$/.test(status) ? " has-count" : ""}`}>{status&&<span className="work-status">{status}</span>}<span className="work-row-open">{action??(sw?'Fungua':'Open')}<ArrowRight size={16} aria-hidden="true"/></span></span></Link></li>)}</ul>;
}
export function WorkDashboard({eyebrow,title,description,action,metrics,children,aside,footer}:{eyebrow?:string;title:string;description?:ReactNode;action?:ReactNode;metrics:WorkMetric[];children:ReactNode;aside?:ReactNode;footer?:ReactNode}) {return <div className="work-dashboard"><WorkHeader eyebrow={eyebrow} title={title} description={description} action={action}/><WorkStats items={metrics}/><div className={`work-columns${aside?'':' is-single'}`}><div className="work-main">{children}</div>{aside&&<aside className="work-aside">{aside}</aside>}</div>{footer&&<div className="work-dashboard-footer">{footer}</div>}</div>;}
