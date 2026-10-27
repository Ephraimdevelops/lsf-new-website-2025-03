import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
export type MapPlace = { id: string; name: string; latitude?: number; longitude?: number };
let SDK: typeof import('@rnmapbox/maps').default | null = null;
// Preserve public browsing in Expo Go; it does not contain Mapbox native modules.
if (Constants.executionEnvironment !== ExecutionEnvironment.StoreClient) {
  try { SDK = require('@rnmapbox/maps').default; } catch { SDK = null; }
}
const token = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (SDK && token) { SDK.setAccessToken(token); SDK.setTelemetryEnabled(false); }
export default function ServiceMap({ places, onSelect, sw = false }: { places: MapPlace[]; onSelect: (id: string) => void; sw?: boolean }) {
  const [failed, setFailed] = useState(false), [attempt, setAttempt] = useState(0);
  const points = places.filter(p => Number.isFinite(p.latitude) && Number.isFinite(p.longitude) && Math.abs(p.latitude!) <= 90 && Math.abs(p.longitude!) <= 180);
  if (!points.length) return <Text>{sw ? 'Hakuna pini za ofisi zilizothibitishwa. Tumia orodha au panua utafutaji.' : 'No verified office pins in these results. Use the list or widen your search.'}</Text>;
  if (!SDK || !token) return <Text>{sw ? "Ramani haipatikani kwenye toleo hili. Tumia orodha au maelekezo ya nje." : 'Map unavailable in this version. Use the list or external directions.'}</Text>;
  const Mapbox = SDK;
  return <View style={{ gap: 12, marginVertical: 16 }}><Text>{sw ? 'Maeneo ya ofisi za umma pekee. Mapbox hupokea eneo la ramani. Eneo la mikutano halithibitishi miadi.' : 'Public offices only. Mapbox receives the map area. A meeting point does not confirm an appointment.'}</Text><Mapbox.MapView key={attempt} style={{ height: 350 }} styleURL="mapbox://styles/mapbox/streets-v12" onMapLoadingError={() => setFailed(true)} onDidFinishLoadingMap={() => setFailed(false)}><Mapbox.Camera bounds={points.length > 1 ? { ne: [Math.max(...points.map(p => p.longitude!)), Math.max(...points.map(p => p.latitude!))], sw: [Math.min(...points.map(p => p.longitude!)), Math.min(...points.map(p => p.latitude!))], paddingTop: 40, paddingBottom: 40, paddingLeft: 40, paddingRight: 40 } : undefined} centerCoordinate={[points[0].longitude!, points[0].latitude!]} zoomLevel={11} />{points.map(p => <Mapbox.PointAnnotation key={p.id} id={p.id} coordinate={[p.longitude!, p.latitude!]} onSelected={() => onSelect(p.id)}><View accessibilityLabel={p.name} style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#8A1538', borderWidth: 3, borderColor: 'white' }} /></Mapbox.PointAnnotation>)}</Mapbox.MapView>{failed && <><Text>{sw ? 'Ramani haijapakia. Tumia orodha au jaribu tena.' : 'Map could not load. Use the list or retry.'}</Text><Pressable accessibilityRole="button" style={{ minHeight: 48 }} onPress={() => { setFailed(false); setAttempt(v => v + 1); }}><Text>{sw ? 'Jaribu ramani tena' : 'Retry map'}</Text></Pressable></>}</View>;
}
