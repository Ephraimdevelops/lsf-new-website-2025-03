import { LanguageSwitch } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import { CalendarDays, ClipboardList, Clock3 } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useConvexAuth, useQuery } from 'convex/react';
import { ArrowUpRight, Bell, BookOpen, BriefcaseBusiness, Building2, ChartNoAxesCombined, ChevronDown, FileCheck2, FileText, HeartHandshake, Home, Inbox, Layers, LogOut, Menu, MessageSquare, Search, Newspaper, Settings, ShieldCheck, Users, X, type LucideIcon } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import { isWorkspacePath } from './workspacePaths';
import { usePersonalGreeting } from '@/hooks/usePersonalGreeting';
import './workspace.css';
import './work-area.css';

type Entry = { label: string; href: string; icon: LucideIcon };
type Group = { label: string; items: Entry[]; collapsible?: boolean };
const item = (label: string, href: string, icon: LucideIcon): Entry => ({ label, href, icon });
const adminTab = (label: string, tab: string, icon: LucideIcon) => item(label, `/admin?tab=${tab}`, icon);

function navigation(roles: readonly string[], simplify = false): Group[] {
  const groups: Group[] = [];
  const has = (...values: string[]) => values.some(value => roles.includes(value));
  if (has('admin')) groups.push({ label: 'Administration', items: [adminTab('Overview', 'home', Home), adminTab('People & access', 'access', Users), adminTab('Team support', 'support', HeartHandshake), adminTab('Decision history', 'audit', FileCheck2), adminTab('Settings', 'settings', Settings)] });
  if (has('supervisor') && !has('admin')) groups.push({label:'Supervision',items:[item('Today','/dashboard/supervisor',Home),item('Case reviews','/dashboard/staff?tab=reviews',ShieldCheck),item('Cases to accept','/dashboard/staff?tab=assignments',Clock3),item('Requests & cases','/dashboard/staff?tab=cases',BriefcaseBusiness),item('Team support','/dashboard/supervisor?view=support',HeartHandshake),item('Supervisor tools','/dashboard/supervisor?view=tools',Layers),item('Reports','/dashboard/reporting',ChartNoAxesCombined),item('Decision history','/dashboard/supervisor?view=audit',FileCheck2)]});
  if (has('staff') && !has('admin', 'supervisor')) groups.push({label:'LSF operations',items:[item('Today','/dashboard/staff',Home),item('New requests','/dashboard/staff?tab=requests',Inbox),item('My cases','/dashboard/staff?tab=cases',BriefcaseBusiness),item('Cases to accept','/dashboard/staff?tab=assignments',Clock3),item('Referrals','/dashboard/staff?tab=referrals',HeartHandshake),item('Team support','/dashboard/staff?view=support',Users),item('Work tools','/dashboard/staff?view=tools',Layers),item('Reports','/dashboard/reporting',ChartNoAxesCombined)]});
  if (has('admin')) groups.push({ label: 'Legal assistance', items: [item('Requests & cases', '/dashboard/staff', BriefcaseBusiness), item('Reporting', '/dashboard/reporting', ChartNoAxesCombined), ...(has('admin', 'staff') ? [item('Paralegal reviews', '/dashboard/paralegal-reviews', FileCheck2), item('Training management', '/dashboard/training-management', BookOpen), item('Haki Yangu AI evaluations', '/dashboard/saada-evaluations', MessageSquare)] : [])] });
  if (has('staff') && !has('admin')) groups.push({label:'Team development',collapsible:true,items:[item('Paralegal applications','/dashboard/paralegal-reviews',FileCheck2),item('Team learning','/dashboard/training-management',BookOpen),item('Haki Yangu AI quality checks','/dashboard/saada-evaluations',MessageSquare)]});
  if (has('admin', 'staff', 'supervisor', 'safeguarding_officer')) groups.push({ label: 'Safeguarding', items: [item('Safety concerns', '/dashboard/safeguarding', ShieldCheck), item('Service matches', '/dashboard/safeguarding?view=matches', HeartHandshake), item('Safety history', '/dashboard/safeguarding?view=history', FileCheck2)] });
  if (has('provider_staff')) groups.push({ label: 'Our service', items: [item('Today', '/dashboard/provider', Home), item('Cases', '/dashboard/provider?tab=cases', BriefcaseBusiness), item('Referrals received', '/dashboard/provider?tab=referrals', HeartHandshake), item('Appointments', '/dashboard/provider?tab=appointments', CalendarDays), item('Documents', '/dashboard/provider?tab=documents', FileText), item('Work tools', '/dashboard/provider?tab=tools', ClipboardList), item('Our organisation', '/dashboard/provider/organisation', Building2)] });
  else if (has('paralegal')) groups.push({ label: 'My work', items: [item('New case offers', '/dashboard/paralegal?tab=inbox', Inbox), item('My cases', '/dashboard/paralegal?tab=cases', BriefcaseBusiness), item('Referrals received', '/dashboard/paralegal?tab=referrals', HeartHandshake), item('Work tools', '/dashboard/paralegal?tab=tools', Layers), item('My organisation', '/dashboard/provider/organisation', Building2), item('Learning', '/dashboard/paralegal/learning', BookOpen)] });
  if (has('stakeholder', 'donor')) groups.push({ label: 'Partner workspace', items: [item('Overview', '/dashboard/stakeholder', ChartNoAxesCombined), item('Reports', '/dashboard/stakeholder?view=reports', FileText), item('What the figures mean', '/dashboard/stakeholder?view=meaning', BookOpen)] });
  if (has('user', 'paralegal', 'provider_staff')) groups.push({ label: 'My legal help', items: [item('My overview', '/dashboard/user', Home), item('Saved help', '/dashboard/user/saved-help', HeartHandshake), item('My documents', '/dashboard/user/documents', FileText)] });
  if (has('admin', 'content_editor')) groups.push({ label: 'Knowledge', items: [item('Guides', '/dashboard/editorial', BookOpen), item('Write guide', '/dashboard/editorial?view=author', FileText), item('Guide history', '/dashboard/editorial?view=history', FileCheck2), item('Import guide pack', '/dashboard/editorial?view=import', Layers)] });
  if (has('admin')) groups.push({ label: 'Website & content', collapsible: true, items: [adminTab('Website overview', 'website', Layers), adminTab('Hero slides', 'hero-slides', Layers), adminTab('News', 'news', Newspaper), adminTab('Success stories', 'stories', HeartHandshake), adminTab('Testimonials', 'testimonials', MessageSquare), adminTab('Publications', 'publications', BookOpen), adminTab('Opportunities', 'opportunities', BriefcaseBusiness), adminTab('Newsletter', 'newsletter', Inbox), adminTab('Submissions', 'submissions', FileText), adminTab('Paralegals', 'paralegals', Users), adminTab('Team', 'team', Users), item('Quick links', '/admin/quick-links', Layers)] }, { label: 'Insights & AI', collapsible: true, items: [adminTab('Website analytics', 'analytics', ChartNoAxesCombined), adminTab('Haki Yangu AI statistics', 'sara-analytics', ChartNoAxesCombined), item('Haki Yangu AI source library', '/sara/train', BookOpen)] });
  groups.push({ label: 'Account', items: [item('Notifications', '/notifications', Bell), item('My profile', '/profile', Settings), item('Account pathways', '/join', Users)] });
  if (!simplify && has('paralegal') && !has('provider_staff')) { const work = groups.find(group => group.label === 'My work'); if (work) work.items = [item('Assignments & cases', '/dashboard/paralegal', BriefcaseBusiness), item('My organisation', '/dashboard/provider/organisation', Building2), item('Learning', '/dashboard/paralegal/learning', BookOpen)]; }
  if (has('admin')) return [
    { label: 'Your work', items: [adminTab('Today', 'home', Home), item('Requests & cases', '/dashboard/staff', Inbox), adminTab('People & access', 'access', Users), adminTab('Team support', 'support', HeartHandshake), item('Reports', '/dashboard/reporting', ChartNoAxesCombined)] },
    { label: 'Guides & learning', collapsible: true, items: [item('Guides', '/dashboard/editorial', BookOpen), item('Write guide', '/dashboard/editorial?view=author', FileText), item('Guide history', '/dashboard/editorial?view=history', FileCheck2), item('Import guide pack', '/dashboard/editorial?view=import', Layers), item('Training management', '/dashboard/training-management', BookOpen), item('Paralegal reviews', '/dashboard/paralegal-reviews', Users)] },
    ...groups.filter(group => ['Website & content', 'Insights & AI'].includes(group.label)),
    { label: 'Safety & decisions', collapsible: true, items: [item('Safety concerns', '/dashboard/safeguarding', ShieldCheck), item('Service matches', '/dashboard/safeguarding?view=matches', HeartHandshake), item('Safety history', '/dashboard/safeguarding?view=history', FileCheck2), adminTab('Decision history', 'audit', FileCheck2), item('Haki Yangu AI evaluations', '/dashboard/saada-evaluations', MessageSquare)] },
    { label: 'Account', collapsible: true, items: [adminTab('Settings', 'settings', Settings), item('Notifications', '/notifications', Bell), item('My profile', '/profile', Users), item('Account pathways', '/join', Users)] },
  ];
  if (simplify) return groups.map(group => ({ ...group, collapsible: group.collapsible || ['Account', 'My legal help'].includes(group.label) || has('admin') && ['Legal assistance', 'Safeguarding', 'Knowledge'].includes(group.label) || !has('safeguarding_officer', 'admin') && group.label === 'Safeguarding' }));
  return groups;
}

function matches(entry: Entry, pathname: string, search: string) {
  const url = new URL(entry.href, 'https://workspace.local');
  if (url.pathname === '/admin') {
    const tab = new URLSearchParams(search).get('tab') || 'home';
    return pathname === '/admin' && (tab === 'platform' ? 'home' : tab) === url.searchParams.get('tab');
  }
  if (url.pathname === '/dashboard/stakeholder') return pathname === url.pathname && ((new URLSearchParams(search).get('view') === 'report' ? 'reports' : new URLSearchParams(search).get('view')) || 'overview') === (url.searchParams.get('view') || 'overview');
  if (url.pathname === '/dashboard/editorial') return pathname === url.pathname && (new URLSearchParams(search).get('view') || 'guides') === (url.searchParams.get('view') || 'guides');
  if (url.pathname === '/dashboard/safeguarding') return pathname === url.pathname && (new URLSearchParams(search).get('view') || 'cases') === (url.searchParams.get('view') || 'cases');
  if (url.pathname === '/dashboard/supervisor') return pathname === url.pathname && (new URLSearchParams(search).get('view') || 'today') === (url.searchParams.get('view') || 'today');
  if(url.pathname === '/dashboard/staff' && !url.searchParams.has('tab')) return pathname === url.pathname && !new URLSearchParams(search).has('tab') && (new URLSearchParams(search).get('view') || 'today') === (url.searchParams.get('view') || 'today');
  if(url.pathname === '/dashboard/staff' && !new URLSearchParams(search).has('tab')) return false;
  if (url.pathname === '/dashboard/paralegal') return pathname === url.pathname && (new URLSearchParams(search).get('tab') || 'inbox') === (url.searchParams.get('tab') || 'inbox');
  if (url.pathname === '/dashboard/provider' || url.pathname === '/dashboard/staff') {
    const tab = new URLSearchParams(search).get('tab') || (url.pathname === '/dashboard/provider' ? 'home' : 'requests');
    return pathname === url.pathname && tab === (url.searchParams.get('tab') || (url.pathname === '/dashboard/provider' ? 'home' : 'requests'));
  }
  return pathname === url.pathname || pathname.startsWith(`${url.pathname}/`);
}

export function WorkspaceShell({ children, roles, name, imageUrl, onSignOut }: { children: ReactNode; roles: readonly string[]; name: string; imageUrl?: string; onSignOut: () => void }) {
  const c = useCopy();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const sidebarRef = useRef<HTMLElement>(null);
  const personalHelp = location.pathname.startsWith('/dashboard/user');
  const worker = roles.some(role => ['admin', 'staff', 'supervisor', 'paralegal', 'provider_staff', 'safeguarding_officer', 'content_editor', 'stakeholder', 'donor'].includes(role));
  const groups = navigation(roles, worker && !personalHelp);
  const visibleGroups = navSearch.trim() ? groups.map(group => ({...group, items:group.items.filter(entry => `${c(entry.label)} ${entry.label} ${c(group.label)}`.toLowerCase().includes(navSearch.trim().toLowerCase()))})).filter(group => group.items.length) : groups;
  const active = groups.flatMap(group => group.items).filter(entry => matches(entry, location.pathname, location.search)).sort((a, b) => b.href.length - a.href.length)[0] ?? (location.pathname === '/workspace-preview' ? groups[0]?.items[0] : undefined);
  const title = location.pathname.includes('/cases/') ? 'Case details' : location.pathname.includes('/requests/') ? 'Request details' : active?.label ?? (location.pathname === '/workspace-preview' ? 'Design preview' : 'Record review');
  useEffect(() => { setMenuOpen(false); setNavSearch(''); }, [location.pathname, location.search]);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const controls = () => Array.from(sidebarRef.current?.querySelectorAll<HTMLElement>('a, button, summary') ?? []).filter(element => element.getClientRects().length > 0);
    controls()[0]?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
      if (event.key === 'Tab') {
        const elements = controls();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('keydown', close); document.body.style.overflow = overflow; previous?.focus(); };
  }, [menuOpen]);
  const links = (entries: Entry[]) => entries.map(entry => {
    const selected = entry.href === active?.href;
    return <Link key={entry.href} to={entry.href} className={`workspace-link${selected ? ' is-active' : ''}`} aria-current={selected ? 'page' : undefined}><entry.icon size={18} aria-hidden="true" /><span>{c(entry.label)}</span></Link>;
  });
  return <div className="workspace">
    <a className="workspace-skip" href="#workspace-content">{c("Skip to content")}</a>
    {menuOpen && <button className="workspace-backdrop" aria-label={c("Close navigation")} onClick={() => setMenuOpen(false)} />}
    <aside ref={sidebarRef} className={`workspace-sidebar${menuOpen ? ' is-open' : ''}`} aria-label={c("Workspace navigation")}>
      <div className="workspace-brand"><Link to="/" aria-label={c("LSF public website")}><img src="/lsf-logo.png" alt="Legal Services Facility" /></Link><button className="workspace-icon workspace-close" aria-label={c("Close navigation")} onClick={() => setMenuOpen(false)}><X size={20} /></button></div>
      <div className="workspace-identity"><span className="workspace-mark"><HeartHandshake size={20} /></span><div><strong>Haki Yangu</strong><span>{c("Your secure workspace")}</span></div></div>
      <label className="workspace-nav-search"><Search size={16} aria-hidden="true" /><span className="sr-only">{c("Find a page")}</span><input type="search" value={navSearch} onChange={event=>setNavSearch(event.target.value)} placeholder={c("Find a page")} /></label>
      <nav aria-label={c("Workspace navigation")}>{visibleGroups.length === 0 && <p className="workspace-search-empty" role="status">{c("No matching page. Try another word.")}</p>}{visibleGroups.map(group => group.collapsible && !navSearch.trim() ? <details key={c(group.label)} className="workspace-group" open={group.items.some(entry => matches(entry, location.pathname, location.search)) || undefined}><summary>{c(group.label)}<ChevronDown size={15} /></summary>{links(group.items)}</details> : <div key={c(group.label)} className="workspace-group"><p>{c(group.label)}</p>{links(group.items)}</div>)}</nav>
      <div className="workspace-sidebar-help"><HeartHandshake size={22} /><strong>{c("Need a hand?")}</strong><p>{c("Find help with your next step.")}</p><Link to="/contact">{c("Contact & support")}<ArrowUpRight size={15} /></Link></div>
      <div className="workspace-sidebar-footer"><Link to="/" className="workspace-link"><ArrowUpRight size={18} />{c("Public website")}</Link><button className="workspace-link" onClick={onSignOut}><LogOut size={18} />{c("Log out")}</button></div>
    </aside>
    <div className="workspace-body">
      <header className="workspace-topbar"><div className="workspace-location"><button className="workspace-icon workspace-menu" aria-label={c("Open navigation")} aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={21} /></button><span>Haki Yangu</span><span aria-hidden="true">/</span><strong>{c(title)}</strong></div><div className="workspace-account"><LanguageSwitch /><Link className="workspace-icon" to="/notifications" aria-label={c("Notifications")} title={c("Notifications")}><Bell size={20} /></Link><Link to="/profile" className="workspace-person"><span className="workspace-avatar">{imageUrl ? <img src={imageUrl} alt="" /> : name.slice(0, 1).toUpperCase()}</span><span>{name}</span></Link><button className="workspace-icon" onClick={onSignOut} aria-label={c("Log out")} title={c("Log out")}><LogOut size={20} /></button></div></header>
      <div id="workspace-content" tabIndex={-1} className="workspace-content work-surface">{children}</div>
      <footer className="workspace-footer"><span>Legal Services Facility</span><Link to="/privacy">{c("Privacy")}</Link><Link to="/contact">{c("Contact & support")}</Link></footer>
    </div>
  </div>;
}

function SignedInWorkspace({ children }: { children: ReactNode }) {
  const { name: personalName, imageUrl } = usePersonalGreeting();
  const { signOut, isSignedIn } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const access = useQuery(api.users.currentAccess, isAuthenticated ? {} : 'skip');
  if (!isSignedIn) return <>{children}</>;
  return <WorkspaceShell roles={access?.roles ?? []} name={personalName || 'My account'} imageUrl={imageUrl} onSignOut={() => void signOut({ redirectUrl: '/' })}>{children}</WorkspaceShell>;
}

export default function WorkspaceFrame({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return isWorkspacePath(pathname) ? <SignedInWorkspace>{children}</SignedInWorkspace> : <>{children}</>;
}
