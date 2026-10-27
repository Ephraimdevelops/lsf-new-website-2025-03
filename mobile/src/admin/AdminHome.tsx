import { LoadingText } from '../components/BrandLoading';
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { api } from '../backend/api';
import { CivicPageHeader } from '../components/CivicPageHeader';
import { CivicObject } from '../components/CivicObject';
import { useLanguage } from '../i18n';
import { colors, type } from '../theme';
import { AdminScreen } from './AdminScreen';
import { PersonalIntro } from '../components/PersonalIntro';
import { useSensitiveScreenProtection } from '../useSensitiveScreenProtection';

export function AdminHome() {
  useSensitiveScreenProtection('admin-home');
  const { locale } = useLanguage(); const sw = locale === 'sw';
  const access = useQuery(api.users.currentAccess); const admin = access?.roles.includes('admin');
  const requests = useQuery(api.legalHelp.staffQueue, admin ? {} : 'skip');
  const people = usePaginatedQuery(api.accessRequests.adminQueuePage, admin ? {} : 'skip', { initialNumItems: 5 });
  const support = useQuery(api.paralegals.staffSupportQueue, admin ? { status: 'submitted' } : 'skip');
  const reviews = useQuery(api.caseManagement.staffReviewRequests, admin ? { status: 'submitted' } : 'skip');
  const documents = useQuery(api.caseManagement.staffDocumentQueue, admin ? { status: 'pending_review' } : 'skip');
  if (!admin) return <AdminScreen><LoadingText style={styles.body}>{access === undefined ? (sw ? 'Inapakia…' : 'Loading…') : (sw ? 'Ruhusa ya msimamizi inahitajika.' : 'Administrator access is required.')}</LoadingText></AdminScreen>;
  const go = (href: string) => router.push(href as Href);
  return <AdminScreen>
    <CivicPageHeader compact title={sw ? 'Kazi za LSF leo' : 'LSF work today'} actionIcon="notifications-outline" actionLabel={sw ? 'Arifa' : 'Notifications'} onAction={() => go('/notifications')} />
    <PersonalIntro body={sw ? 'Kagua maombi na maamuzi yanayosubiri.' : 'Review requests and pending decisions.'} />
    <View style={styles.metrics}>
      <Metric label={sw ? 'Maombi' : 'Requests'} value={requests?.length} onPress={() => go('/operations')} />
      <Metric label={sw ? 'Maombi ya ruhusa' : 'Access requests'} value={people.status === 'LoadingFirstPage' ? undefined : `${people.results.length}${people.status === 'CanLoadMore' ? '+' : ''}`} onPress={() => go('/access-management')} />
      <Metric label={sw ? 'Msaada wa timu' : 'Team support'} value={support === undefined ? undefined : `${support.length}${support.length === 100 ? '+' : ''}`} onPress={() => go('/admin-support')} />
    </View>
    <Text style={styles.heading}>{sw ? 'Yanayohitaji hatua' : 'Needs your attention'}</Text>
    <Row title={sw ? 'Mapitio ya kesi' : 'Case review requests'} body={reviews === undefined ? (sw ? 'Inapakia…' : 'Loading…') : `${reviews.length}${reviews.length === 100 ? '+' : ''} ${sw ? 'yameonyeshwa' : 'shown'}`} icon="checkmark-circle-outline" onPress={() => go('/supervision')} />
    <Row title={sw ? 'Nyaraka za kukagua' : 'Documents to review'} body={documents === undefined ? (sw ? 'Inapakia…' : 'Loading…') : `${documents.length}${documents.length === 100 ? '+' : ''} ${sw ? 'zimeonyeshwa' : 'shown'}`} icon="document-text-outline" onPress={() => go('/admin-documents')} />
    {!!people.results.length && <Text style={styles.heading}>{sw ? "Kagua maombi ya kujiunga" : "Review applications to join"}</Text>}{people.results.slice(0, 3).map(item => <Row key={item._id} title={item.applicant?.name ?? (sw ? 'Mwombaji' : 'Applicant')} body={`${item.requestedRole.replaceAll('_', ' ')} · ${item.organizationName}`} icon="person-add-outline" onPress={() => router.push({ pathname: '/access-request/[id]', params: { id: item._id } })} />)}
    {people.status === 'Exhausted' && !people.results.length && reviews?.length === 0 && documents?.length === 0 ? <View style={styles.empty}><CivicObject kind="empty" size={64} /><Text style={[styles.body, { flex: 1 }]}>{sw ? 'Hakuna uamuzi unaosubiri hapa.' : 'No decisions waiting here.'}</Text></View> : null}
    <Text style={styles.heading}>{sw ? 'Zana za kazi' : 'Your work tools'}</Text>
    <Row title={sw ? 'Watu na huduma' : 'People and services'} body={sw ? 'Maombi, taasisi na ruhusa' : 'Applications, organisations and access'} icon="people-outline" onPress={() => go('/admin-tools?group=people')} />
    <Row title={sw ? 'Maarifa na mafunzo' : 'Knowledge and learning'} body={sw ? 'Haki Yangu AI, haki na mafunzo' : 'Haki Yangu AI, rights guides and training'} icon="book-outline" onPress={() => go('/admin-tools?group=knowledge')} />
    <Row title={sw ? 'Taarifa na historia' : 'Reports and history'} body={sw ? 'Matokeo na maamuzi ya LSF' : 'Impact and LSF decisions'} icon="bar-chart-outline" onPress={() => go('/admin-tools?group=insight')} />
  </AdminScreen>;
}
function Metric({ label, value, onPress }: { label: string; value: number | string | undefined; onPress: () => void }) { return <Pressable accessibilityRole="button" onPress={onPress} style={styles.metric}><Text style={styles.number}>{value ?? '…'}</Text><Text style={styles.small}>{label}</Text></Pressable>; }
export function Row({ title, body, icon, onPress }: { title: string; body: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) { return <Pressable accessibilityRole="button" style={styles.row} onPress={onPress}><View style={styles.icon}><Ionicons name={icon} size={22} color={colors.teal} /></View><View style={{ flex: 1, gap: 5 }}><Text style={styles.title}>{title}</Text><Text style={styles.body}>{body}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.teal} /></Pressable>; }
const styles = StyleSheet.create({ metrics: { flexDirection: 'row', gap: 8, marginBottom: 24 }, metric: { flex: 1, backgroundColor: colors.tealSoft, borderRadius: 16, padding: 12, minHeight: 96, gap: 6 }, number: { fontFamily: type.semibold, fontSize: 28, color: colors.ink }, small: { fontFamily: type.regular, fontSize: 12, lineHeight: 17, color: colors.ink }, heading: { fontFamily: type.semibold, fontSize: 21, color: colors.ink, marginTop: 16, marginBottom: 12 }, row: { flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 84, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line }, icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.tealSoft }, title: { fontFamily: type.semibold, fontSize: 16, color: colors.ink }, body: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.inkMuted }, empty: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16 } });
