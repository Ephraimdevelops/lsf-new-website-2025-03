import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../backend/api';
import { useLanguage } from '../i18n';
import { colors } from '../theme';
export function CurrentLocationSharing() {
  const sw = useLanguage().locale === 'sw';
  const status = useQuery(api.paralegalLocation.status, {}), share = useMutation(api.paralegalLocation.share), stop = useMutation(api.paralegalLocation.stop);
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 10000); return () => clearInterval(timer); }, []);
  async function locate() { setBusy(true); setMessage(''); let timer: ReturnType<typeof setTimeout> | undefined; try {
    if (!(await Location.requestForegroundPermissionsAsync()).granted) throw new Error('permission');
    const point = await Promise.race([Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }), new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), 20000); })]);
    if (point.coords.accuracy == null) throw new Error('accuracy');
    await share({ latitude: point.coords.latitude, longitude: point.coords.longitude, accuracy: point.coords.accuracy, capturedAt: point.timestamp });
    setMessage(sw ? 'Eneo la makadirio limeshirikiwa kwa dakika tano.' : 'Approximate location shared for five minutes.');
  } catch { setMessage(sw ? 'Eneo halijashirikiwa. Ruhusu GPS na ujaribu tena. Ofisi yako bado ni chaguo la ziada.' : 'Location could not be shared. Allow GPS and retry. Your office remains the fallback.'); } finally { if (timer) clearTimeout(timer); setBusy(false); } }
  async function clear() { setBusy(true); try { await stop({}); setMessage(sw ? 'Eneo limeondolewa.' : 'Location removed.'); } catch { setMessage(sw ? 'Jaribu kusitisha tena.' : 'Could not stop sharing. Retry.'); } finally { setBusy(false); } }
  const active = status?.expiresAt && status.expiresAt > now;
  return <View style={{ gap: 12, padding: 16, borderWidth: 1, borderColor: colors.line, borderRadius: 16 }}><Text style={{ fontWeight: '700' }}>{sw ? 'Eneo la sasa kwa ulinganishaji wa karibu' : 'Current location for nearby matching'}</Text><Text>{sw ? 'Shiriki ukiwa salama na tayari kusaidia. Eneo la makadirio hutumika kabla ya ofisi kwa dakika tano. Wengine huona umbali wa makadirio, si pini yako binafsi. Hii haibadili upatikanaji wako wa kesi.' : 'Share when safe and ready to help. Approximate current location takes priority over your office for five minutes. Others see approximate distance, not your personal map pin. This does not change case availability.'}</Text><Text>{active ? (sw ? 'Eneo linashirikiwa' : 'Sharing for nearby matching') : (sw ? 'Eneo halishirikiwi' : 'Current location is not shared')}</Text><Pressable accessibilityRole="button" disabled={busy} style={{ minHeight: 48, justifyContent: 'center' }} onPress={() => void locate()}><Text>{busy ? (sw ? 'Subiri…' : 'Please wait…') : active ? (sw ? 'Sasisha eneo la sasa' : 'Refresh current location') : (sw ? 'Shiriki eneo kwa dakika 5' : 'Share current location for 5 minutes')}</Text></Pressable>{active && <Pressable accessibilityRole="button" disabled={busy} style={{ minHeight: 48, justifyContent: 'center' }} onPress={() => void clear()}><Text>{sw ? 'Sitisha kushiriki' : 'Stop sharing'}</Text></Pressable>}<Text accessibilityLiveRegion="polite">{message}</Text></View>;
}
