import { LoadingText } from '@/components/shared/BrandLoading';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import SearchFilterBar from '@/components/shared/SearchFilterBar';
import ParalegalIllustration from '@/components/paralegal/ParalegalIllustration';
export default function AdminAudit() {
  const access = useQuery(api.users.currentAccess); const allowed = access?.roles.some(role => ['admin','supervisor'].includes(role));
  const [search,setSearch] = useState(''); const [prefix,setPrefix] = useState('');
  const rows = useQuery(api.admin.listPlatformAudit, allowed ? { limit: 150, actionPrefix: prefix || undefined } : 'skip');
  const visible = rows?.filter(row => [row.action,row.entityType,row.actor?.name,row.actor?.email].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  if (!allowed) return <LoadingText as="p">{access === undefined ? 'Loading access…' : 'Administrator or supervisor access is required.'}</LoadingText>;
  return <div className="space-y-6"><header className="flex items-center gap-4"><div className="flex-1"><p className="workspace-eyebrow">LSF · Decision history</p><h1 className="text-3xl font-semibold">Who changed what and when.</h1><p className="mt-2 text-neutral-600">Follow decisions without showing private case contents.</p></div><ParalegalIllustration pose="review" /></header>
    <SearchFilterBar value={search} onChange={setSearch} placeholder="Find an action or name" label="Type" title="Type of decision" count={Number(!!prefix)} onReset={() => setPrefix('')}><label className="block text-sm">Type<select className="mt-2 min-h-12 w-full rounded-xl border p-3" value={prefix} onChange={event => setPrefix(event.target.value)}>{[['','All'],['access.','Access'],['directory.','Services'],['saada.','Haki Yangu AI'],['paralegal.','Paralegals'],['case.','Cases']].map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label></SearchFilterBar>
    <LoadingText as="p" className="text-sm text-neutral-600">{rows === undefined ? 'Loading history…' : `${visible?.length} shown. Search uses these 150 events; type checks the latest 1,000.`}</LoadingText>
    {visible?.map(row => <article key={row._id} className="space-y-2 rounded-2xl border bg-white p-4"><h2 className="font-semibold">{row.action.replaceAll(/[._]/g,' ')}</h2><p className="text-sm text-neutral-600">{new Date(row.timestamp).toLocaleString('en-TZ',{timeZone:'Africa/Dar_es_Salaam'})} · EAT</p><p className="text-sm">By {row.actor?.name || 'System'} · {row.entityType}</p>{row.changedFieldNames.length > 0 && <p className="text-sm text-neutral-600">Fields: {row.changedFieldNames.join(', ')}</p>}</article>)}{visible?.length === 0 && <p>No matching event.</p>}
  </div>;
}
