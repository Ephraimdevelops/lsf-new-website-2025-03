import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
export type MapPlace = { id: string; name: string; latitude?: number; longitude?: number };
export default function ServiceMap({ places, onSelect }: { places: MapPlace[]; onSelect: (id: string) => void }) {
  const host = useRef<HTMLDivElement>(null), selectRef = useRef(onSelect); selectRef.current = onSelect;
  const [failed, setFailed] = useState(false), [attempt, setAttempt] = useState(0);
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const points = places.filter(p => Number.isFinite(p.latitude) && Number.isFinite(p.longitude) && Math.abs(p.latitude!) <= 90 && Math.abs(p.longitude!) <= 180);
  const snapshot = JSON.stringify(points);
  useEffect(() => {
    if (!host.current || !token || !points.length) return;
    let map: mapboxgl.Map | undefined;
    setFailed(false);
    try {
      map = new mapboxgl.Map({ container: host.current, accessToken: token, style: 'mapbox://styles/mapbox/streets-v12', center: [points[0].longitude!, points[0].latitude!], zoom: 11, cooperativeGestures: true });
      map.addControl(new mapboxgl.NavigationControl());
      map.on('error', () => setFailed(true));
      const bounds = new mapboxgl.LngLatBounds();
      for (const p of points) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = 'View ' + p.name; button.style.minHeight = '48px'; button.onclick = () => selectRef.current(p.id);
        new mapboxgl.Marker({ color: '#8A1538' }).setLngLat([p.longitude!, p.latitude!]).setPopup(new mapboxgl.Popup().setDOMContent(button)).addTo(map);
        bounds.extend([p.longitude!, p.latitude!]);
      }
      if (points.length > 1) map.fitBounds(bounds, { padding: 45, maxZoom: 13, duration: 0 });
    } catch { setFailed(true); }
    return () => map?.remove();
  }, [snapshot, token, attempt]);
  if (!token) return <p role="status">Map configuration unavailable. Use the service list.</p>;
  if (!points.length) return <p role="status">No verified office coordinates in these results. Use the service list or widen your search.</p>;
  return <section className="my-5 space-y-2"><p className="text-sm">Public office locations only. Mapbox receives the map area displayed. Meeting points do not guarantee appointments.</p><div ref={host} aria-label="Map of matching public offices" style={{ height: 360, borderRadius: 16 }} />{failed && <p role="status">Map could not load. The service list remains available. <button type="button" className="underline min-h-12" onClick={() => setAttempt(v => v + 1)}>Retry map</button></p>}</section>;
}
