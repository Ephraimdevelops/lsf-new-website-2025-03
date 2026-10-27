import { CurrentLocationSharing } from "./CurrentLocationSharing";
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../backend/api';
import { useAccountSync } from '../useStoreUserEffect';
import { useLanguage } from '../i18n';
import { IntakeSelect } from '../intake/IntakeSelect';
import { colors, type } from '../theme';
export function PresenceSettings() {
  const { ready } = useAccountSync(), sw = useLanguage().locale === 'sw';
  const prefs = useQuery(api.presence.preferences, ready ? {} : 'skip');
  const meeting = useQuery(api.paralegals.myMeetingPoint, ready ? {} : 'skip');
  const offices = useQuery(api.justiceServices.listPublicServices, {});
  const setSharing = useMutation(api.presence.setSharing), setMeeting = useMutation(api.paralegals.setMeetingPoint);
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  async function save(action: () => Promise<unknown>) { setBusy(true); setMessage(''); try { await action(); setMessage(sw ? 'Imehifadhiwa.' : 'Saved.'); } catch { setMessage(sw ? 'Haijahifadhiwa. Jaribu tena.' : 'Could not save. Please retry.'); } finally { setBusy(false); } }
  const copy = { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted };
  return <View style={{ marginVertical: 20, gap: 12 }}><Text style={{ ...copy, fontFamily: type.semibold, color: colors.ink }}>{sw ? 'Hali ya mtandaoni na eneo la mikutano' : 'Presence and meeting point'}</Text><Text style={copy}>{sw ? "Kushiriki ni hiari. Timu ya kesi inaweza kuona hali yako; kwa msaidizi wa kisheria aliyethibitishwa pia inaweza kuonekana kwenye orodha ya umma. Hii haishiriki eneo lako wala upatikanaji wa kesi." : 'Sharing is optional. Your case team may see your status; verified paralegals may also show it publicly. This shares neither your location nor case availability.'}</Text><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><Text style={{ ...copy, flex: 1 }}>{sw ? 'Shiriki hali yangu ya mtandaoni' : 'Share my online status'}</Text><Switch accessibilityLabel={sw ? 'Shiriki hali ya mtandaoni' : 'Share online status'} disabled={!prefs || busy} value={prefs?.sharePresence ?? false} onValueChange={enabled => void save(() => setSharing({ enabled }))} /></View>{meeting && <CurrentLocationSharing />}{meeting && <><IntakeSelect sw={sw} label={sw ? 'Ofisi ya mikutano ya umma' : 'Public meeting office'} value={meeting.serviceId ?? ''} options={[{ value: '', label: sw ? 'Hakuna eneo la umma' : 'No public meeting point' }, ...(offices ?? []).filter(o => Number.isFinite(o.latitude) && Number.isFinite(o.longitude)).map(o => ({ value: String(o._id), label: o.name + ' · ' + o.district }))]} onChange={value => { if (!busy) void save(() => setMeeting({ serviceId: value ? value as NonNullable<typeof meeting.serviceId> : null })); }} /><Text style={copy}>{sw ? 'Chagua ofisi yenye makubaliano ya kukutana. Hii si uthibitisho wa ajira au miadi. Usitumie anwani ya nyumbani.' : 'Choose an office where meetings have been agreed. This does not claim employment or confirm an appointment. Never use a home address.'}</Text></>}<Text accessibilityLiveRegion="polite" style={copy}>{message}</Text></View>;
}
