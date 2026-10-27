import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { colors, type } from '../theme';
export type SearchPoint = { latitude: number; longitude: number; expiresAt?: number };
export function NearbySearch({ origin, radiusKm, onChange, sw }: { origin?: SearchPoint; radiusKm?: number; onChange: (origin?: SearchPoint, radius?: number) => void; sw: boolean }) {
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const generation = useRef(0);
  const changeRef = useRef(onChange); changeRef.current = onChange;
  useEffect(() => () => { generation.current++; }, []);
  useEffect(() => { if (!origin) return; const timer = setTimeout(() => { generation.current++; changeRef.current(); setMessage(sw ? 'Eneo la utafutaji limeisha. Chagua tena.' : 'Search location expired. Choose it again.'); }, Math.max(0, (origin.expiresAt ?? Date.now() + 15 * 60_000) - Date.now())); return () => clearTimeout(timer); }, [origin, sw]);
  async function locate() {
    const attempt = ++generation.current; setBusy(true); setMessage('');
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (attempt !== generation.current) return;
      if (!permission.granted) { setMessage(sw ? 'Ruhusa haijatolewa. Chagua mkoa na wilaya.' : 'Permission not granted. Choose a region and district instead.'); return; }
      const position = await Promise.race([Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }), new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), 20_000); })]);
      if (attempt !== generation.current) return;
      if (position.coords.accuracy != null && position.coords.accuracy > 2000) throw new Error("imprecise");
      onChange({ latitude: position.coords.latitude, longitude: position.coords.longitude, expiresAt: Date.now() + 15 * 60_000 }, 25);
      setMessage(sw ? 'Umbali ni wa mstari wa moja kwa moja, si muda wa safari.' : 'Distances are straight-line estimates, not travel times.');
    } catch { if (attempt === generation.current) setMessage(sw ? 'Eneo halipatikani. Chagua mkoa na wilaya au jaribu tena.' : 'Location unavailable. Choose a region and district or retry.'); }
    finally { if (timer) clearTimeout(timer); if (attempt === generation.current) setBusy(false); }
  }
  const copy = { fontFamily: type.regular, fontSize: 13, lineHeight: 21, color: colors.inkMuted };
  return <View style={{ gap: 10, marginVertical: 12 }}><Text style={copy}>{sw ? 'Tumia eneo lako kwa utafutaji huu pekee. Halihifadhiwi kwenye ombi au kuonyeshwa kwa wengine.' : 'Use your location for this search only. It is not saved to your request or shown to others.'}</Text><Pressable accessibilityRole="button" disabled={busy} onPress={() => void locate()} style={{ minHeight: 48, justifyContent: 'center' }}><Text style={{ ...copy, color: colors.teal }}>{busy ? (sw ? 'Inatafuta eneo…' : 'Finding location…') : (sw ? 'Tumia eneo langu' : 'Use my location')}</Text></Pressable>{origin && <><View style={{ flexDirection: 'row', gap: 12 }}>{[5, 10, 25, 50].map(radius => <Pressable key={radius} accessibilityRole="radio" accessibilityState={{ checked: radiusKm === radius }} onPress={() => onChange(origin, radius)} style={{ minHeight: 48, padding: 10, backgroundColor: radiusKm === radius ? colors.tealSoft : colors.surface }}><Text style={copy}>{radius} km</Text></Pressable>)}</View><Text style={copy}>{sw ? 'Matokeo yasiyo na eneo linalofaa hayataonyeshwa ndani ya kipimo cha umbali.' : 'Records without eligible location data are excluded from radius results.'}</Text><Pressable accessibilityRole="button" onPress={() => { generation.current++; onChange(); setBusy(false); setMessage(''); }} style={{ minHeight: 48 }}><Text style={{ ...copy, color: colors.burgundy }}>{sw ? 'Futa eneo; tafuta kwa mkoa' : 'Clear location; search by area'}</Text></Pressable></>}<Text style={copy} accessibilityLiveRegion="polite">{message}</Text></View>;
}
