import { LoadingText } from '../src/components/BrandLoading';
import { BrandLoading } from '../src/components/BrandLoading';
import { plainError } from "../../shared/plainLanguage";
import { useMutation, useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '../src/backend/api';
import { AdminScreen } from '../src/admin/AdminScreen';
import { AdminIntro } from '../src/admin/AdminIntro';
import { CivicPageHeader } from '../src/components/CivicPageHeader';
import { SearchFilters } from '../src/components/SearchFilters';
import { Button } from '../src/components/Button';
import { Surface } from '../src/components/Surface';
import { useLanguage } from '../src/i18n';
import { colors, type } from '../src/theme';
import { useSensitiveScreenProtection } from '../src/useSensitiveScreenProtection';
const states = ['submitted', 'in_review', 'responded', 'closed'] as const;
const labels = { submitted: ['New', 'Mapya'], in_review: ['Being reviewed', 'Yanapitiwa'], responded: ['Replied', 'Yamejibiwa'], closed: ['Closed', 'Yamefungwa'] };
const types = { supervisor: ['Supervisor guidance', 'Mwongozo wa msimamizi'], peer_support: ['Peer support', 'Msaada wa wenzako'], wellbeing: ['Wellbeing', 'Ustawi'], challenging_case: ['Difficult case', 'Kesi ngumu'], payment: ['Payment question', 'Swali la malipo'] };
export default function AdminSupport() {
  useSensitiveScreenProtection('admin-support');
  const access = useQuery(api.users.currentAccess); const allowed = access?.roles.some(role => ['admin', 'staff', 'supervisor'].includes(role));
  const { locale } = useLanguage(); const sw = locale === 'sw'; const { id } = useLocalSearchParams<{ id?: string }>();
  const [status, setStatus] = useState<typeof states[number]>('submitted'); const [search, setSearch] = useState('');
  const rows = useQuery(api.paralegals.staffSupportQueue, allowed ? { status } : 'skip');
  const direct = useQuery(api.paralegals.getStaffSupportRequest, allowed && id ? { id: id as import('../../convex/_generated/dataModel').Id<'paralegal_support_requests'> } : 'skip');
  const respond = useMutation(api.paralegals.respondToSupportRequest);
  const [selected, setSelected] = useState<string | null>(id ?? null); const [note, setNote] = useState(''); const [review, setReview] = useState<'in_review' | 'responded' | 'closed' | null>(null); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState('');
  useEffect(() => { setSelected(id ?? null); setNote(''); setReview(null); }, [id]);
  const visible = (id ? (direct === undefined ? undefined : direct ? [direct] : []) : rows)?.filter(item => [item.user?.name, item.request.note, item.request.type].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  async function save(request: NonNullable<typeof rows>[number]['request']) { if (!review || busy) return; setBusy(true); setNotice(''); try { await respond({ id: request._id, status: review, expectedUpdatedAt: request.updatedAt, responseNote: note.trim() || undefined }); setSelected(null); setNote(''); setReview(null); setNotice(sw ? "Hatua imehifadhiwa. Msaidizi wa kisheria ataarifiwa." : 'Saved. The paralegal will be notified.'); } catch (error) { setNotice(plainError(error, locale, sw ? 'Hatukuweza kuthibitisha mabadiliko. Angalia hali ya ombi kabla ya kujaribu tena.' : 'We could not confirm the changes. Check the request status before retrying.')); } finally { setBusy(false); } }
  return <AdminScreen><CivicPageHeader back compact title={sw ? 'Saidia timu' : 'Help the team'} />{!allowed ? <LoadingText style={styles.body}>{access === undefined ? (sw ? 'Inapakia…' : 'Loading…') : (sw ? 'Ruhusa ya LSF inahitajika.' : 'LSF access is required.')}</LoadingText> : <>
    <AdminIntro icon="heart-outline" eyebrow="LSF" title={sw ? 'Saidia timu yako' : 'Support your team'} description={sw ? "Jibu ombi na eleza hatua inayofuata." : 'Reply to a request with a clear next step.'} />
    <SearchFilters sw={sw} value={search} onChange={setSearch} placeholder={sw ? 'Tafuta ombi au jina' : 'Find a request or name'} label={sw ? 'Hali' : 'Status'} title={sw ? 'Hali ya ombi' : 'Request status'} count={Number(status !== 'submitted')} summary={id ? (sw ? 'Ombi lililofunguliwa' : 'Opened request') : labels[status][Number(sw)]} onReset={() => { setStatus('submitted'); router.setParams({ id: '' }); setSelected(null); setNote(''); setReview(null); }}><View style={{ gap: 8 }}>{states.map(state => <Button key={state} label={labels[state][Number(sw)]} variant={status === state ? 'primary' : 'secondary'} onPress={() => { setStatus(state); router.setParams({ id: '' }); setReview(null); setSelected(null); setNote(''); }} />)}</View></SearchFilters>
    {!!notice && <Text accessibilityRole="alert" style={styles.body}>{notice}</Text>}
    {visible === undefined ? <BrandLoading compact text={sw ? 'Inapakia maombi…' : 'Loading requests…'}/> : <Text style={styles.body}>{visible.length} {id ? (sw ? 'yameonyeshwa.' : 'shown.') : (sw ? 'yameonyeshwa; hadi maombi 100 mapya katika hali hii.' : 'shown; latest 100 requests in this status.')}</Text>}
    {visible?.map(({ request, user }) => <Surface key={request._id}><Text style={styles.title}>{user?.name ?? (sw ? "Msaidizi wa kisheria" : 'Paralegal')}</Text><Text style={styles.body}>{types[request.type][Number(sw)]} · {labels[request.status][Number(sw)]}</Text><Text style={styles.body}>{request.note}</Text>{request.responseNote && <Text style={styles.body}>{sw ? 'Jibu' : 'Reply'}: {request.responseNote}</Text>}{request.status !== 'closed' && <Button label={sw ? 'Kagua na ujibu' : 'Review and reply'} variant="secondary" onPress={() => { setSelected(request._id); setReview(null); setNote(''); }} />}{selected === request._id && request.status !== 'closed' && <>
      <TextInput multiline accessibilityLabel={sw ? "Jibu kwa msaidizi wa kisheria" : 'Reply to the paralegal'} value={note} onChangeText={value => { setNote(value); setReview(null); }} maxLength={3000} placeholder={sw ? 'Mwongozo na hatua inayofuata' : 'Guidance and next step'} style={styles.input} />
      {!review ? <View style={{ gap: 8 }}>{request.status === 'submitted' && <Button label={sw ? 'Anza kukagua' : 'Start reviewing'} variant="secondary" onPress={() => setReview('in_review')} />}<Button label={sw ? 'Hakiki jibu' : 'Review reply'} disabled={note.trim().length < 10} onPress={() => setReview('responded')} />{request.status === 'responded' && (request.responseNote?.trim().length ?? 0) >= 10 && <Button label={sw ? 'Kagua kabla ya kufunga' : 'Review before closing'} variant="secondary" onPress={() => setReview('closed')} />}</View> : <Surface tone="pink"><Text style={styles.title}>{sw ? 'Thibitisha hatua' : 'Confirm next step'}</Text><Text style={styles.body}>{labels[review][Number(sw)]}</Text><Text style={styles.body}>{note.trim() || request.responseNote || (sw ? 'Timu inaanza kupitia ombi.' : 'The team is starting a review.')}</Text><Button label={sw ? 'Thibitisha na uhifadhi' : 'Confirm and save'} disabled={busy} loading={busy} onPress={() => void save(request)} /><Button label={sw ? 'Badili' : 'Edit'} variant="quiet" onPress={() => setReview(null)} /></Surface>}
    </>}</Surface>)}{visible?.length === 0 && <Text style={styles.body}>{sw ? 'Hakuna ombi linalolingana.' : 'No matching request.'}</Text>}
  </>}</AdminScreen>;
}
const styles = StyleSheet.create({ title: { fontFamily: type.semibold, fontSize: 17, color: colors.ink }, body: { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted, marginBottom: 8 }, input: { minHeight: 112, borderWidth: 1, borderColor: colors.line, padding: 12, borderRadius: 12, textAlignVertical: 'top', fontFamily: type.regular, fontSize: 15, color: colors.ink } });
