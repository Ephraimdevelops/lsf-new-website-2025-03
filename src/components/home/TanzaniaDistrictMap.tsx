import { useState } from 'react';
import { tanzaniaDistrictPaths } from './tanzaniaDistrictPaths';

/** A geographic illustration. Boundaries are not a live service-availability layer. */
const regionalAnchors = [
  { name: 'Mwanza', x: 160, y: 137, dx: -12, dy: -15, anchor: 'end' as const },
  { name: 'Arusha', x: 320, y: 173, dx: 10, dy: -12, anchor: 'start' as const },
  { name: 'Kigoma', x: 35, y: 237, dx: 12, dy: -12, anchor: 'start' as const },
  { name: 'Tabora', x: 157, y: 243, dx: -10, dy: 20, anchor: 'end' as const },
  { name: 'Dodoma', x: 281, y: 291, dx: -13, dy: 20, anchor: 'end' as const },
  { name: 'Dar es Salaam', x: 431, y: 319, dx: -13, dy: 22, anchor: 'end' as const },
  { name: 'Mbeya', x: 184, y: 407, dx: 10, dy: 19, anchor: 'start' as const },
  { name: 'Mtwara', x: 451, y: 465, dx: -12, dy: 19, anchor: 'end' as const },
];

// Region reference points from Open Admin Data Tanzania (OCHA COD-AB).
// They communicate national coverage, not individual LSF service locations.
const allRegions: readonly [string, number, number][] = [
  ['Dodoma', -5.845, 36.008], ['Arusha', -2.918, 36.089], ['Kilimanjaro', -3.732, 37.647],
  ['Tanga', -5.064, 38.120], ['Morogoro', -7.861, 36.920], ['Pwani', -7.177, 38.851],
  ['Dar es Salaam', -6.872, 39.280], ['Lindi', -9.334, 38.424], ['Mtwara', -10.771, 39.222],
  ['Ruvuma', -10.505, 36.341], ['Iringa', -7.964, 35.519], ['Mbeya', -8.292, 33.931],
  ['Songwe', -8.275, 32.855], ['Singida', -5.668, 34.421], ['Tabora', -5.427, 32.640],
  ['Rukwa', -7.979, 31.477], ['Kigoma', -4.699, 30.541], ['Shinyanga', -3.760, 32.958],
  ['Kagera', -2.172, 31.514], ['Mwanza', -2.551, 32.861], ['Mara', -1.762, 34.234],
  ['Manyara', -4.700, 36.432], ['Njombe', -9.601, 34.667], ['Katavi', -6.373, 31.331],
  ['Simiyu', -3.132, 34.323], ['Geita', -3.353, 31.971],
  ['Kaskazini Unguja', -5.881, 39.291], ['Kusini Unguja', -6.250, 39.425],
  ['Mjini Magharibi', -6.174, 39.248], ['Kaskazini Pemba', -5.036, 39.753],
  ['Kusini Pemba', -5.323, 39.709],
];
const labelledRegions = new Set(['Kagera', 'Mwanza', 'Arusha', 'Kigoma', 'Tabora', 'Dodoma', 'Mbeya', 'Dar es Salaam', 'Mtwara']);
const projectRegion = (latitude: number, longitude: number) => ({
  x: (longitude - 29.5895) * 42.375 + 20,
  y: (-0.9831 - latitude) * 42.375 + 71.65,
});

export default function TanzaniaDistrictMap({ showPresenceMarkers = false, showAllRegions = false }: { showPresenceMarkers?: boolean; showAllRegions?: boolean }) {
  const [district, setDistrict] = useState<string | null>(null);
  return <div className="nh-map-art">
    <div className="nh-map-art-head"><span>UNITED REPUBLIC OF TANZANIA</span><strong>National reach</strong></div>
    <svg viewBox="0 0 500 600" role="img" aria-label={showAllRegions ? 'Map of Tanzania with 31 regional reference markers illustrating LSF national reach' : showPresenceMarkers ? 'Map of Tanzania with district boundaries and labelled regional reference points illustrating LSF national reach' : 'Map of Tanzania showing district boundaries across Mainland Tanzania and Zanzibar'} preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="nh-district-fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#d8b7c8" /><stop offset="100%" stopColor="#a94d79" /></linearGradient></defs>
      <g className="nh-districts">{tanzaniaDistrictPaths.map(([name, path], index) => <path key={`${name}-${index}`} d={path} onMouseEnter={() => setDistrict(name)} onMouseLeave={() => setDistrict(null)}><title>{name}</title></path>)}</g>
      {showAllRegions ? <g className="nh-presence-markers nh-presence-markers--all">{allRegions.map(([name, latitude, longitude]) => { const { x, y } = projectRegion(latitude, longitude); return <g key={name}><title>{name}</title><circle className="nh-presence-halo" cx={x} cy={y} r="7" /><circle className="nh-presence-dot" cx={x} cy={y} r="3.5" />{labelledRegions.has(name) && <text x={x + (x > 300 ? -10 : 10)} y={y - 11} textAnchor={x > 300 ? 'end' : 'start'}>{name}</text>}</g>; })}</g> : showPresenceMarkers && <g className="nh-presence-markers">{regionalAnchors.map(({ name, x, y, dx, dy, anchor }) => <g key={name}><circle className="nh-presence-halo" cx={x} cy={y} r="10" /><circle className="nh-presence-dot" cx={x} cy={y} r="4.5" /><text x={x + dx} y={y + dy} textAnchor={anchor}>{name}</text></g>)}</g>}
    </svg>
    <div className="nh-map-art-foot"><span className="nh-map-key"><i /> District boundaries</span><span className="nh-map-district" aria-live="polite">{district || 'Hover to explore'}</span></div>
  </div>;
}
