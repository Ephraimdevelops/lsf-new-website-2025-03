import { LoadingText } from '../src/components/BrandLoading';
import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { adminGroups, adminTools, matchesAdminTool } from '../src/admin/adminTools';
import { api } from '../src/backend/api';
import { AdminScreen } from '../src/admin/AdminScreen';
import { AdminIntro } from '../src/admin/AdminIntro';
import { Row } from '../src/admin/AdminHome';
import { CivicPageHeader } from '../src/components/CivicPageHeader';
import { SearchFilters } from '../src/components/SearchFilters';
import { useLanguage } from '../src/i18n';
import { colors, type } from '../src/theme';
export default function AdminTools() {
  const access = useQuery(api.users.currentAccess); const { locale } = useLanguage(); const sw = locale === 'sw';
  const params = useLocalSearchParams<{ group?: string }>();
  const [search, setSearch] = useState(''); const [group, setGroup] = useState<string>(adminGroups.some(item => item.key === params.group) ? params.group! : 'all');
  useEffect(() => { setGroup(adminGroups.some(item => item.key === params.group) ? params.group! : 'all'); }, [params.group]);
  const visible = adminTools.filter(tool => matchesAdminTool(tool, search, group));
  return <AdminScreen><CivicPageHeader back compact title={sw ? 'Zana za LSF' : 'LSF tools'} />{access?.roles.includes('admin') ? <>
    <AdminIntro icon="grid-outline" eyebrow="LSF" title={sw ? 'Unataka kufanya nini?' : 'What do you need to do?'} description={sw ? 'Chagua aina ya kazi au tafuta zana.' : 'Choose a type of work or find a tool.'} />
    <SearchFilters sw={sw} value={search} onChange={setSearch} placeholder={sw ? 'Tafuta zana' : 'Find a tool'} label={sw ? 'Aina' : 'Type'} title={sw ? 'Aina ya kazi' : 'Type of work'} count={Number(group !== 'all')} summary={group !== 'all' ? adminGroups.find(item => item.key === group)?.[sw ? 'sw' : 'en'] : undefined} onReset={() => setGroup('all')}><View style={styles.options}>{adminGroups.map(item => <Pressable key={item.key} accessibilityRole="radio" accessibilityState={{ checked: group === item.key }} onPress={() => setGroup(item.key)} style={[styles.option, group === item.key && styles.active]}><Text style={styles.text}>{item[sw ? 'sw' : 'en']}</Text></Pressable>)}</View></SearchFilters>
    {!search.trim() && group === "all" ? adminGroups.filter(item => item.key !== "all").map(item => <Row key={item.key} title={sw ? item.sw : item.en} body={sw ? "Chagua aina ya kazi" : "Choose this type of work"} icon="folder-open-outline" onPress={() => setGroup(item.key)} />) : visible.map(tool => <Row key={tool.key} title={tool[sw ? 'sw' : 'en']} body={tool[sw ? 'detailSw' : 'detail']} icon={tool.icon} onPress={() => router.push(tool.mobile as Href)} />)}{!visible.length && <Text style={styles.text}>{sw ? 'Hakuna zana inayolingana. Jaribu neno jingine.' : 'No matching tool. Try another word.'}</Text>}
  </> : <LoadingText style={styles.text}>{access === undefined ? (sw ? 'Inapakia…' : 'Loading…') : (sw ? 'Ruhusa ya msimamizi inahitajika.' : 'Administrator access is required.')}</LoadingText>}</AdminScreen>;
}
const styles = StyleSheet.create({ options: { gap: 8 }, option: { minHeight: 48, justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: colors.line, borderRadius: 12 }, active: { backgroundColor: colors.burgundySoft, borderColor: colors.burgundy }, text: { fontFamily: type.medium, fontSize: 15, lineHeight: 23, color: colors.ink } });
