import { useCopy } from "@/i18n/useCopy";
import CurrentLocationSharing from "./CurrentLocationSharing";
import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAccountSync } from '@/hooks/useStoreUserEffect';
export default function PresenceSettings() {
  const c = useCopy();
  const ready = useAccountSync().status === 'ready';
  const prefs = useQuery(api.presence.preferences, ready ? {} : 'skip');
  const meeting = useQuery(api.paralegals.myMeetingPoint, ready ? {} : 'skip');
  const offices = useQuery(api.justiceServices.listPublicServices, {});
  const setSharing = useMutation(api.presence.setSharing), setMeeting = useMutation(api.paralegals.setMeetingPoint);
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  async function save(action: () => Promise<unknown>) { setBusy(true); setMessage(''); try { await action(); setMessage(c("Saved.")); } catch { setMessage(c("Could not save. Please retry.")); } finally { setBusy(false); } }
  return <section className="my-6 rounded-2xl border bg-white p-5 space-y-4"><h2 className="text-xl font-bold">{c("Presence and public meeting point")}</h2><p className="text-sm text-gray-600">{c("Sharing is off by default. Your support team may see your online status; verified paralegals can also show it on the public directory. It does not share your location or mean you are accepting cases.")}</p><label className="flex gap-3 items-center"><input type="checkbox" checked={prefs?.sharePresence ?? false} disabled={busy || !prefs} onChange={e => void save(() => setSharing({ enabled: e.target.checked }))} />{c("Share my online status")}</label>{meeting && <CurrentLocationSharing />}{meeting && <label className="block">{c("Public meeting office")}<select className="mt-2 w-full rounded-xl border p-3" disabled={busy} value={meeting.serviceId ?? ''} onChange={e => void save(() => setMeeting({ serviceId: e.target.value ? e.target.value as NonNullable<typeof meeting.serviceId> : null }))}><option value="">{c("No public meeting point")}</option>{offices?.filter(o => Number.isFinite(o.latitude) && Number.isFinite(o.longitude)).map(o => <option key={String(o._id)} value={String(o._id)}>{o.name} · {o.district}</option>)}</select><p className="text-sm text-gray-600">{c("Choose an office where meetings have been agreed. This does not claim employment or guarantee an appointment. Never enter your home location.")}</p></label>}<p role="status">{message}</p></section>;
}
