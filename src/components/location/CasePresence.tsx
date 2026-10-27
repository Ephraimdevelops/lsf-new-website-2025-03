import { useCopy } from "@/i18n/useCopy";
import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
export default function CasePresence({ caseId }: { caseId: Id<'cases'> }) {
  const c = useCopy();
  const [refresh, setRefresh] = useState(0);
  useEffect(() => { const t = setInterval(() => setRefresh(v => v + 1), 30_000); return () => clearInterval(t); }, []);
  const people = useQuery(api.presence.forCase, { caseId, refresh });
  return <section className="rounded-xl border bg-white p-4"><h2 className="font-semibold">{c("Case team presence")}</h2><p className="text-sm text-gray-600">{c("Optional online status. This does not confirm availability or that a message was read.")}</p>{people?.map(p => <p key={p.userId} className="mt-2 text-sm">{p.name} · {p.state === 'online' ? c("Online") : p.state === 'away' ? c("Away") : c("Status unavailable")}</p>)}</section>;
}
