import { useCopy } from "@/i18n/useCopy";
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
export default function CurrentLocationSharing() {
  const c = useCopy();
  const status = useQuery(api.paralegalLocation.status, {}), share = useMutation(api.paralegalLocation.share), stop = useMutation(api.paralegalLocation.stop);
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 10000); return () => clearInterval(timer); }, []);
  async function locate() { setBusy(true); setMessage(''); try {
    if (!navigator.geolocation) throw new Error('unavailable');
    const point = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }));
    await share({ latitude: point.coords.latitude, longitude: point.coords.longitude, accuracy: point.coords.accuracy, capturedAt: point.timestamp });
    setMessage('Approximate current location shared for five minutes.');
  } catch { setMessage('Location could not be shared. Allow GPS and retry with a fresh, accurate location. Your office remains the fallback.'); } finally { setBusy(false); } }
  async function clear() { setBusy(true); try { await stop({}); setMessage('Current location removed.'); } catch { setMessage('Could not stop sharing. Please retry.'); } finally { setBusy(false); } }
  const active = status?.expiresAt && status.expiresAt > now;
  return <section className="space-y-3 rounded-xl border p-4"><h3 className="font-semibold">{c("Current location for nearby matching")}</h3><p className="text-sm">Share only when safe and ready to offer support. Your approximate current location takes priority over your office for five minutes. Others see approximate distance, never your personal map pin. This does not change your case availability.</p><p role="status">{active ? c("Sharing for nearby matching") : c("Current location is not shared")}</p><button type="button" disabled={busy} className="min-h-12 underline" onClick={() => void locate()}>{busy ? c("Please wait…") : active ? c("Refresh current location") : c("Share current location for 5 minutes")}</button>{active && <button type="button" disabled={busy} className="min-h-12 ml-4 underline" onClick={() => void clear()}>{c("Stop sharing")}</button>}<p role="status">{message}</p></section>;
}
