import { useCopy } from "@/i18n/useCopy";
import { useEffect, useRef, useState } from 'react';
export type SearchPoint = { latitude: number; longitude: number; expiresAt?: number };
export default function NearbySearch({ origin, radiusKm, onChange }: { origin?: SearchPoint; radiusKm?: number; onChange: (point?: SearchPoint, radius?: number) => void }) {
  const c = useCopy();
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''); const generation = useRef(0);
  const changeRef = useRef(onChange); changeRef.current = onChange;
  useEffect(() => () => { generation.current++; }, []);
  useEffect(() => { if (!origin) return; const timer = setTimeout(() => { generation.current++; changeRef.current(); setMessage(c("Search location expired. Choose it again.")); }, Math.max(0, (origin.expiresAt ?? Date.now() + 15 * 60_000) - Date.now())); return () => clearTimeout(timer); }, [origin]);
  function locate() {
    if (!navigator.geolocation) { setMessage(c("Location is unavailable. Search by region or district.")); return; }
    const attempt = ++generation.current; setBusy(true); setMessage('');
    navigator.geolocation.getCurrentPosition(p => { if (attempt !== generation.current) return; if (p.coords.accuracy > 2000) { setBusy(false); setMessage(c("Location is too imprecise. Choose a region and district or retry.")); return; } onChange({ latitude: p.coords.latitude, longitude: p.coords.longitude, expiresAt: Date.now() + 15 * 60_000 }, 25); setBusy(false); setMessage(c("Straight-line distance, not travel time.")); }, () => { if (attempt !== generation.current) return; setBusy(false); setMessage(c("Location unavailable or permission denied. Search by area or retry.")); }, { enableHighAccuracy: false, timeout: 20_000, maximumAge: 60_000 });
  }
  return <section className="my-4 rounded-xl border bg-white p-4 space-y-3"><p className="text-sm text-gray-600">{c("Your location is used for this search only. It is not saved to your request or displayed to others.")}</p><button type="button" className="min-h-12 font-semibold text-primary" disabled={busy} onClick={locate}>{busy ? c("Finding location…") : c("Use my location")}</button>{origin && <><label className="block">{c("Search radius")}<select value={radiusKm ?? 25} onChange={e => onChange(origin, Number(e.target.value))} className="ml-3 rounded-lg border p-2">{[5, 10, 25, 50].map(r => <option key={r} value={r}>{r} km</option>)}</select></label><p className="text-sm">{c("Records without eligible location data are excluded from radius results.")}</p><button type="button" className="min-h-12 underline" onClick={() => { generation.current++; onChange(); setBusy(false); setMessage(''); }}>{c("Clear location; search by area")}</button></>}<p role="status" className="text-sm">{message}</p></section>;
}
