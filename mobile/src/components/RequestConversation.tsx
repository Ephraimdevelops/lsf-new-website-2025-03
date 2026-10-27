import { BrandLoading } from './BrandLoading';
import { useRef, useState } from 'react';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { api } from '../backend/api';
import { useLanguage } from '../i18n';
import { colors, type } from '../theme';
import { Button } from './Button';

export function RequestConversation({ requestId }: { requestId: Id<'legal_help_requests'> }) {
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
  return <View style={styles.section}>
    <Text accessibilityRole="header" style={styles.heading}>{sw ? 'Ujumbe kuhusu ombi' : 'Messages about this request'}</Text>
    <Text style={styles.body}>{sw ? 'Zungumza na LSF kuhusu ombi hili. Tuma taarifa zinazohitajika kukusaidia tu.' : 'Talk to LSF about this request. Share only what is needed to help.'}</Text>
    {(status === 'CanLoadMore' || status === 'LoadingMore') && <Button variant="secondary" loading={status === 'LoadingMore'} label={sw ? 'Ujumbe wa awali' : 'Show earlier messages'} onPress={() => loadMore(20)} />}
    {status === 'LoadingFirstPage' ? <BrandLoading compact text={sw ? 'Inapakia ujumbe…' : 'Loading messages…'}/> : !results.length ? <Text style={styles.body}>{sw ? 'Hakuna ujumbe bado. Maswali na majibu yataonekana hapa.' : 'No messages yet. Questions and replies will appear here.'}</Text> : [...results].reverse().map(message => <View key={message._id} style={[styles.message, message.senderKind === 'staff' ? styles.staff : styles.requester]}><Text style={styles.author}>{message.senderKind === 'staff' ? (sw ? 'Timu ya LSF' : 'LSF review team') : (state?.canRequestInformation ? (sw ? 'Aliyeomba msaada' : 'Requester') : (sw ? 'Wewe' : 'You'))}</Text>{message.requestsInformation && <Text style={styles.caption}>{sw ? 'Taarifa zinaombwa' : 'Information requested'}</Text>}<Text selectable style={styles.messageBody}>{message.body}</Text><Text style={styles.caption}>{new Date(message.createdAt).toLocaleString(sw ? 'sw-TZ' : 'en-TZ', { timeZone: 'Africa/Dar_es_Salaam' })}</Text></View>)}
    {state?.canSend ? <View style={styles.composer}><Text style={styles.author}>{state.canRequestInformation ? (sw ? 'Ujumbe kwa aliyeomba msaada' : 'Message to the requester') : (sw ? 'Jibu lako kwa LSF' : 'Your reply to LSF')}</Text><TextInput accessibilityLabel={sw ? 'Ujumbe kuhusu ombi' : 'Request message'} multiline textAlignVertical="top" value={body} onChangeText={setBody} editable={!busy} maxLength={3000} style={styles.input} placeholder={sw ? 'Andika ujumbe wako' : 'Write your message'} placeholderTextColor={colors.inkMuted} /><Text style={styles.counter}>{body.length}/3000</Text>{state.canRequestInformation && <Button variant="quiet" disabled={busy} accessibilityRole="checkbox" accessibilityState={{ checked: ask }} label={`${ask ? '✓ ' : ''}${sw ? 'Omba taarifa na subiri jibu' : 'Ask for information and wait for a reply'}`} onPress={() => setAsk(value => !value)} />}<Button disabled={!body.trim() || busy} loading={busy} label={sw ? 'Tuma ujumbe' : 'Send message'} onPress={() => void submit()} /></View> : state ? <Text style={styles.body}>{sw ? 'Ombi hili halipokei majibu tena. Endelea kwenye kesi ikiwa imefunguliwa, au wasiliana na LSF.' : 'This request no longer accepts replies. Continue in the case if one has been opened, or contact LSF.'}</Text> : null}
    {sent && <Text accessibilityLiveRegion="polite" style={styles.success}>{sw ? 'Ujumbe umetumwa.' : 'Message sent.'}</Text>}{!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
  </View>;
}
const styles = StyleSheet.create({ section: { marginVertical: 20, gap: 14, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 22 }, heading: { fontFamily: type.semibold, fontSize: 19, color: colors.ink }, body: { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted }, message: { padding: 16, gap: 8, borderRadius: 10 }, staff: { backgroundColor: '#EEF5F3' }, requester: { backgroundColor: '#FAF2F5' }, author: { fontFamily: type.semibold, fontSize: 13, color: colors.ink }, messageBody: { fontFamily: type.regular, fontSize: 15, lineHeight: 23, color: colors.ink }, caption: { fontFamily: type.regular, fontSize: 11, color: colors.inkMuted }, composer: { gap: 10 }, input: { borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: 14, minHeight: 112, fontFamily: type.regular, fontSize: 15, color: colors.ink, backgroundColor: colors.surface }, counter: { textAlign: 'right', color: colors.inkMuted, fontSize: 11 }, success: { color: colors.teal, fontFamily: type.medium }, error: { color: colors.danger, fontFamily: type.medium, lineHeight: 21 } });
