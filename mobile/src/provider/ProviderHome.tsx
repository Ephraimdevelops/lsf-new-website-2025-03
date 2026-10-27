import { LoadingText } from '../components/BrandLoading';
import { BrandLoading } from '../components/BrandLoading';
import { useQuery } from 'convex/react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { api } from '../backend/api';
import { Screen } from '../components/Screen';
import { CivicPageHeader } from '../components/CivicPageHeader';
import { PersonalIntro } from '../components/PersonalIntro';
import { CivicObject } from '../components/CivicObject';
import { ProviderNavigation } from './ProviderNavigation';
import { useLanguage } from '../i18n';
import { colors, type } from '../theme';
import { useSensitiveScreenProtection } from '../useSensitiveScreenProtection';
export function ProviderHome() {
  useSensitiveScreenProtection('provider-home');
  const { locale } = useLanguage(); const sw = locale === 'sw';
  const access = useQuery(api.users.currentAccess); const allowed = access?.roles.includes('provider_staff');
  const offers = useQuery(api.caseManagement.assignmentInbox, allowed ? {} : 'skip');
  const cases = useQuery(api.caseManagement.myCases, allowed ? {} : 'skip');
  const referrals = useQuery(api.referrals.myDestinationQueue, allowed ? {} : 'skip');
  const tasks = useQuery(api.caseManagement.myTasks, allowed ? {} : 'skip');
  const appointments = useQuery(api.caseManagement.myAppointments, allowed ? { context: 'work' } : 'skip');
  const organisations = useQuery(api.justiceServices.myOrganizations, allowed ? {} : 'skip');
  const active = cases?.filter(item => item.beneficiaryId !== access?.user._id && !['closed'].includes(item.status));
  const waiting = referrals?.filter(item => ['created','destination_notified','escalated'].includes(item.referral.status));
  const upcoming = appointments?.filter(item => item.status === 'scheduled' && item.startsAt >= Date.now());
  return <Screen footer={allowed ? <ProviderNavigation current="home" /> : undefined}>
    <CivicPageHeader compact title={sw ? 'Huduma yako leo' : 'Your service today'} actionIcon="notifications-outline" actionLabel={sw ? 'Arifa' : 'Notifications'} onAction={() => router.push('/notifications')} />
    <PersonalIntro body={sw ? 'Kagua maombi na kesi zinazosubiri jibu.' : 'Review referrals and cases awaiting a reply.'} />
    {!allowed ? <LoadingText style={styles.body}>{access === undefined ? (sw ? 'Inapakia…' : 'Loading…') : (sw ? 'Idhini ya mtoa huduma inahitajika.' : 'Provider access requires approval.')}</LoadingText> : <>
    <View style={styles.metrics}><Metric value={waiting?.length} label={sw ? 'Rufaa za kujibu' : 'Referrals awaiting reply'} route="/provider-referrals" /><Metric value={offers?.length} label={sw ? 'Kesi za kupokea' : 'Cases to accept'} route="/paralegal-assignments" /><Metric value={active?.length} label={sw ? 'Kesi zinazoendelea' : 'Active cases'} route="/paralegal-assignments?view=active" /></View>
    <Text style={styles.heading}>{sw ? 'Anza hapa' : 'Start here'}</Text>
    {organisations === undefined ? <BrandLoading compact text={sw ? 'Inapakia taasisi…' : 'Loading organisations…'}/> : <ProviderRow icon="business-outline" title={organisations.length ? organisations.map(item => item.name).join(' · ') : (sw ? 'Unganisha taasisi yako' : 'Link your organisation')} body={organisations.length ? (sw ? 'Huduma, nafasi na timu yako' : 'Your services, available places and team') : (sw ? 'LSF inahitaji kuidhinisha uhusiano wa akaunti na taasisi.' : 'LSF needs to approve your organisation link.')} route="/my-organisation" />}
    {referrals === undefined || offers === undefined || tasks === undefined ? <BrandLoading compact text={sw ? 'Inapakia kazi…' : 'Loading work…'}/> : <>
    {!!waiting?.length && <Text style={styles.heading}>{sw ? "Jibu rufaa ulizopokea" : "Reply to referrals received"}</Text>}{waiting?.slice(0,2).map(item => <ProviderRow key={item.referral._id} icon="paper-plane-outline" title={item.referral.publicId} body={item.destinationService?.name ?? (sw ? 'Kagua rufaa' : 'Review referral')} route={`/provider-referral/${item.referral._id}`} />)}
    {!!offers.length && <Text style={styles.heading}>{sw ? "Jibu maombi ya kesi" : "Respond to case assignments"}</Text>}{offers.slice(0,2).map(item => <ProviderRow key={item.assignment._id} icon="briefcase-outline" title={sw ? 'Kagua kesi uliyopewa' : 'Review a case assignment'} body={item.case?.publicId} route={`/assignment/${item.assignment._id}`} />)}
    {!!tasks.length && <Text style={styles.heading}>{sw ? "Fuatilia kazi" : "Follow up on tasks"}</Text>}{tasks.slice(0,2).map(item => <ProviderRow key={item.task._id} icon="checkbox-outline" title={item.task.title} body={item.case?.publicId} route={`/task/${item.task._id}`} />)}
    {!waiting?.length && !offers.length && !tasks.length && <View style={styles.empty}><CivicObject kind="empty" size={64} /><Text style={[styles.body,{flex:1}]}>{sw ? 'Hakuna kazi mpya inayosubiri. Rufaa na kazi zitaonekana hapa.' : 'No new work waiting. Referrals and tasks will appear here.'}</Text></View>}
    </>}
    {!!active?.filter(item => ['resolved','closed_unresolved'].includes(item.status)).length && <><Text style={styles.heading}>{sw ? 'Kamilisha kesi' : 'Needs final checks'}</Text>{active!.filter(item => ['resolved','closed_unresolved'].includes(item.status)).slice(0,3).map(item => <ProviderRow key={item._id} icon="checkmark-done-outline" title={item.publicId} body={sw ? 'Matokeo yamehifadhiwa. Kamilisha ukaguzi wa mwisho.' : 'Result recorded. Complete the final checks.'} route={`/case/${item._id}?section=feedback`} />)}</>}
    <Text style={styles.heading}>{sw ? 'Miadi inayokuja' : 'Upcoming appointments'}</Text>
    {appointments === undefined ? <BrandLoading compact text={sw ? 'Inapakia miadi…' : 'Loading appointments…'}/> : upcoming?.length ? upcoming.slice(0,3).map(item => <ProviderRow key={item._id} icon="calendar-outline" title={item.casePublicId} body={new Date(item.startsAt).toLocaleString(sw ? 'sw-TZ' : 'en-TZ', {dateStyle:'medium',timeStyle:'short',timeZone:'Africa/Dar_es_Salaam'})} route={`/appointment/${item._id}`} />) : <Text style={styles.body}>{sw ? 'Hakuna miadi ijayo kwenye kesi zako.' : 'No upcoming appointments in your work cases.'}</Text>}
    <ProviderRow icon="calendar-outline" title={sw ? 'Angalia miadi yote' : 'View all appointments'} route="/work-appointments" />
    <ProviderRow icon="grid-outline" title={sw ? 'Zana zako za kazi' : 'Your work tools'} body={sw ? 'Ujumbe, nyaraka, kazi na msaada wa LSF' : 'Messages, documents, tasks and LSF support'} route="/provider-tools" />
    </>}
  </Screen>;
}
export function ProviderRow({ icon, title, body, route }: { icon: keyof typeof Ionicons.glyphMap; title: string; body?: string; route: string }) {
  return <Pressable accessibilityRole="button" style={styles.row} onPress={() => router.push(route as Href)}><View style={styles.icon}><Ionicons name={icon} color={colors.teal} size={22} /></View><View style={{flex:1}}><Text style={styles.title}>{title}</Text>{body && <Text style={styles.body}>{body}</Text>}</View><Ionicons name="chevron-forward" color={colors.inkMuted} size={18} /></Pressable>;
}
function Metric({value,label,route}: {value?:number;label:string;route:string}) {return <Pressable accessibilityRole="button" style={styles.metric} onPress={() => router.push(route as Href)}><Text style={styles.value}>{value ?? '—'}</Text><Text style={styles.label}>{label}</Text></Pressable>;}
const styles=StyleSheet.create({metrics:{flexDirection:'row',gap:8},metric:{flex:1,padding:14,borderRadius:18,backgroundColor:colors.tealSoft},value:{fontFamily:type.semibold,fontSize:27,color:colors.teal},label:{fontFamily:type.medium,fontSize:12,color:colors.ink},heading:{fontFamily:type.semibold,fontSize:20,color:colors.ink,marginTop:24,marginBottom:8},row:{flexDirection:'row',alignItems:'center',gap:12,minHeight:72,paddingVertical:12,borderBottomWidth:1,borderBottomColor:colors.line},icon:{backgroundColor:colors.tealSoft,borderRadius:14,padding:10},title:{fontFamily:type.semibold,fontSize:16,color:colors.ink},body:{fontFamily:type.regular,fontSize:14,lineHeight:22,color:colors.inkMuted},empty:{flexDirection:'row',gap:12,alignItems:'center',paddingVertical:16}});
