import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../backend/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { useLanguage } from '../i18n';
import { colors, type } from '../theme';
export function CasePresence({ caseId }: { caseId: Id<'cases'> }) {
  const sw = useLanguage().locale === 'sw', [refresh, setRefresh] = useState(0);
  useEffect(() => { const t = setInterval(() => setRefresh(v => v + 1), 30_000); return () => clearInterval(t); }, []);
  const people = useQuery(api.presence.forCase, { caseId, refresh });
  const copy = { fontFamily: type.regular, fontSize: 13, lineHeight: 21, color: colors.inkMuted };
  return <View style={{ gap: 8, marginVertical: 16 }}><Text style={copy}>{sw ? 'Hali ya timu ni hiari; si uthibitisho wa upatikanaji au ujumbe kusomwa.' : 'Team presence is optional; it does not confirm availability or that a message was read.'}</Text>{people?.map(p => <Text key={p.userId} style={copy}>{p.name} · {p.state === 'online' ? (sw ? 'Yuko mtandaoni' : 'Online') : p.state === 'away' ? (sw ? "Hayuko kwenye programu kwa sasa" : 'Away') : (sw ? 'Hali haipatikani' : 'Status unavailable')}</Text>)}</View>;
}
