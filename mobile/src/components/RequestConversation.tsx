import { BrandLoading } from './BrandLoading';
import { useRef, useState } from 'react';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { api } from '../backend/api';
import { useLanguage } from '../i18n';
import { colors, type } from '../theme';
import { Button } from './Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { typography } from '../theme';

export function RequestConversation({ requestId, compact = false }: { requestId: Id<'legal_help_requests'>; compact?: boolean }) {
  const sw = useLanguage().locale === 'sw';
  const state = useQuery(api.requestMessages.state, { requestId });
  const { results, status, loadMore } = usePaginatedQuery(api.requestMessages.list, { requestId }, { initialNumItems: 20 });
  const send = useMutation(api.requestMessages.send);
  const [body, setBody] = useState(''); const [ask, setAsk] = useState(true);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [sent, setSent] = useState(false);
  const lock = useRef(false);
  const pending = useRef<{ body: string; ask: boolean; id: string } | undefined>(undefined);
  async function submit() {
    if (lock.current || !state?.canSend || !body.trim()) return;
    lock.current = true; setBusy(true); setError(''); setSent(false);
    const text = body.trim(); const requestInformation = state.canRequestInformation && ask;
    if (!pending.current || pending.current.body !== text || pending.current.ask !== requestInformation) pending.current = { body: text, ask: requestInformation, id: `reply-${Date.now()}-${Math.random().toString(36).slice(2)}` };
    try { await send({ requestId, body: text, requestInformation, clientMessageId: pending.current.id }); setBody(''); pending.current = undefined; setSent(true); }
    catch { setError(sw ? 'Hatujaweza kuthibitisha ujumbe. Maandishi yako bado yapo; jaribu kutuma tena.' : 'Your message could not be confirmed. Your text is still here; try sending again.'); }
    finally { lock.current = false; setBusy(false); }
  }
  return <View style={[styles.section, compact && styles.compactSection]}>
    <View style={styles.sectionHeading}>{compact && <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.burgundy} />}<Text accessibilityRole="header" style={styles.heading}>{sw ? 'Ujumbe kuhusu ombi' : 'Messages about this request'}</Text></View>
    <Text style={styles.body}>{compact ? (sw ? 'Tuma kwa LSF taarifa zinazohusu ombi hili tu.' : 'Share only information relevant to this request with LSF.') : (sw ? 'Zungumza na LSF kuhusu ombi hili. Tuma taarifa zinazohitajika kukusaidia tu.' : 'Talk to LSF about this request. Share only what is needed to help.')}</Text>
    {(status === 'CanLoadMore' || status === 'LoadingMore') && <Button variant="secondary" loading={status === 'LoadingMore'} label={sw ? 'Ujumbe wa awali' : 'Show earlier messages'} onPress={() => loadMore(20)} />}
    {status === 'LoadingFirstPage' ? <BrandLoading compact text={sw ? 'Inapakia ujumbe…' : 'Loading messages…'}/> : !results.length ? <Text style={styles.body}>{sw ? 'Hakuna ujumbe bado. Maswali na majibu yataonekana hapa.' : 'No messages yet. Questions and replies will appear here.'}</Text> : [...results].reverse().map(message => <View key={message._id} style={[styles.message, message.senderKind === 'staff' ? styles.staff : styles.requester]}><Text style={styles.author}>{message.senderKind === 'staff' ? (sw ? 'Timu ya LSF' : 'LSF review team') : (state?.canRequestInformation ? (sw ? 'Aliyeomba msaada' : 'Requester') : (sw ? 'Wewe' : 'You'))}</Text>{message.requestsInformation && <Text style={styles.caption}>{sw ? 'Taarifa zinaombwa' : 'Information requested'}</Text>}<Text selectable style={styles.messageBody}>{message.body}</Text><Text style={styles.caption}>{new Date(message.createdAt).toLocaleString(sw ? 'sw-TZ' : 'en-TZ', { timeZone: 'Africa/Dar_es_Salaam' })}</Text></View>)}
    {state?.canSend ? <View style={styles.composer}>
      {!compact && <Text style={styles.author}>{state.canRequestInformation ? (sw ? 'Ujumbe kwa aliyeomba msaada' : 'Message to the requester') : (sw ? 'Jibu lako kwa LSF' : 'Your reply to LSF')}</Text>}
      <TextInput accessibilityLabel={sw ? 'Ujumbe kuhusu ombi' : 'Request message'} multiline textAlignVertical="top" value={body} onChangeText={setBody} editable={!busy} maxLength={3000} style={[styles.input, compact && styles.compactInput]} placeholder={sw ? 'Andika ujumbe wako' : 'Write your message'} placeholderTextColor={colors.inkMuted} />
      {state.canRequestInformation && <Button variant="quiet" disabled={busy} accessibilityRole="checkbox" accessibilityState={{ checked: ask }} label={`${ask ? '✓ ' : ''}${sw ? 'Omba taarifa na subiri jibu' : 'Ask for information and wait for a reply'}`} onPress={() => setAsk(value => !value)} />}
      <View style={compact ? styles.composerFooter : undefined}><Text style={[styles.counter, compact && styles.compactCounter]}>{body.length}/3000</Text><Button style={compact ? styles.sendButton : undefined} disabled={!body.trim() || busy} loading={busy} label={sw ? 'Tuma ujumbe' : 'Send message'} onPress={() => void submit()} /></View>
    </View> : state ? <Text style={styles.body}>{sw ? 'Ombi hili halipokei majibu tena. Endelea kwenye kesi ikiwa imefunguliwa, au wasiliana na LSF.' : 'This request no longer accepts replies. Continue in the case if one has been opened, or contact LSF.'}</Text> : null}
    {sent && <Text accessibilityLiveRegion="polite" style={styles.success}>{sw ? 'Ujumbe umetumwa.' : 'Message sent.'}</Text>}{!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
  </View>;
}
const styles = StyleSheet.create({
  section: { marginVertical: 20, gap: 14, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 22 },
  compactSection: { marginTop: 12, marginBottom: 4, paddingTop: 16, gap: 10 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heading: { ...typography.itemTitle, flex: 1 }, body: { ...typography.supporting },
  message: { padding: 14, gap: 6, borderRadius: 8 },
  staff: { backgroundColor: '#EEF5F3' }, requester: { backgroundColor: '#FAF2F5' },
  author: { ...typography.supporting, fontFamily: type.semibold, color: colors.ink },
  messageBody: { ...typography.body }, caption: { ...typography.metadata },
  composer: { gap: 10 },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 12, minHeight: 112, ...typography.body, backgroundColor: colors.surface },
  compactInput: { minHeight: 72, maxHeight: 160 },
  composerFooter: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sendButton: { minHeight: 44, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  counter: { ...typography.metadata, textAlign: 'right' }, compactCounter: { textAlign: 'left' },
  success: { color: colors.teal, fontFamily: type.medium }, error: { color: colors.danger, fontFamily: type.medium, lineHeight: 21 },
});
