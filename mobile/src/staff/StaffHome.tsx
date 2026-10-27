import { LoadingText } from '../components/BrandLoading';
import { BrandLoading } from '../components/BrandLoading';
import { useQuery } from 'convex/react';
import { router, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { api } from '../backend/api';
import { AdminScreen } from '../admin/AdminScreen';
import { Row } from '../admin/AdminHome';
import { PersonalIntro } from '../components/PersonalIntro';
import { ParalegalIntro } from '../components/ParalegalIntro';
import { CivicPageHeader } from '../components/CivicPageHeader';
import { SectionHeading, Surface } from '../components/Surface';
import { useLanguage } from '../i18n';
import { useSensitiveScreenProtection } from '../useSensitiveScreenProtection';
import { colors, type } from '../theme';
import { staffTools } from './tools';
export function StaffHome() {
  useSensitiveScreenProtection('staff-home');
  const sw = useLanguage().locale === 'sw';
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some(role => ['admin','staff'].includes(role));
  const requests = useQuery(api.legalHelp.staffQueue, allowed ? {status:'submitted'} : 'skip');
  const cases = useQuery(api.caseManagement.staffCaseQueue, allowed ? {} : 'skip');
  const support = useQuery(api.paralegals.staffSupportQueue, allowed ? {status:'submitted'} : 'skip');
  const active = cases?.filter(item => !['closed'].includes(item.status));
  return <AdminScreen><CivicPageHeader compact title={sw?'Kazi za LSF':'LSF workspace'} actionIcon="notifications-outline" actionLabel={sw?'Arifa':'Notifications'} onAction={()=>router.push('/notifications')} /><PersonalIntro body={sw?'Kagua maombi na ufuatilie kesi.':'Review requests and follow up on cases.'}/>{!allowed?<LoadingText style={styles.body}>{access===undefined?(sw?'Inapakia…':'Loading…'):(sw?'Ruhusa ya LSF inahitajika.':'LSF staff access is required.')}</LoadingText>:<>
    <ParalegalIntro pose="direction" title={sw?'Chagua kazi ya kuanza.':'Choose where to start.'} body={sw?'Soma ombi jipya, fuatilia kesi yako au jibu timu.':'Read a new request, follow your cases or reply to the team.'}/>
    <View style={styles.metrics}>{[[requests?.length,sw?'Maombi mapya':'New requests'],[active?.length,sw?'Kesi zangu':'My open cases'],[support?.length,sw?'Maombi ya timu':'Team requests']].map(([value,label])=><Surface key={label} tone="teal" style={{flex:1,padding:12}}><Text style={styles.value}>{value??'…'}</Text><Text style={styles.body}>{label}</Text></Surface>)}</View>
    <SectionHeading title={sw?'Hatua inayofuata':'Next steps'}/>{requests===undefined||cases===undefined||support===undefined?<BrandLoading compact text={sw?'Inapakia kazi…':'Loading work…'}/>:!requests.length&&!active?.length&&!support.length?<Surface tone="teal"><Text style={styles.title}>{sw?'Hakuna kazi mpya hapa.':'No new work here.'}</Text><Text style={styles.body}>{sw?'Fungua zana kuangalia kazi nyingine.':'Open tools to check other work.'}</Text></Surface>:null}
    {!!requests?.length && <SectionHeading title={sw ? "1. Pitia maombi mapya" : "1. Review new requests"} />}{requests?.slice(0,3).map(item=><Row key={item._id} title={item.publicId??(sw?'Ombi jipya':'New request')} body={sw?'Soma ombi na chagua hatua salama.':'Read the request and choose the next safe step.'} icon="document-text-outline" onPress={()=>router.push({pathname:'/operations-request/[id]',params:{id:item._id}})}/>)}
    {!!active?.length && <SectionHeading title={sw ? "2. Fuatilia kesi" : "2. Follow case work"} />}{active?.slice(0,2).map(item=><Row key={item._id} title={item.publicId} body={sw?'Fuatilia hatua inayofuata.':'Follow the next step.'} icon="folder-open-outline" onPress={()=>router.push({pathname:'/case/[id]',params:{id:item._id}})}/>)}
    {!!support?.length && <SectionHeading title={sw ? "3. Jibu timu" : "3. Reply to the team"} />}{support?.slice(0,2).map(item=><Row key={item.request._id} title={item.user?.name??(sw?'Ombi la timu':'Team request')} body={sw?'Timu inahitaji mwongozo wako.':'The team needs your guidance.'} icon="people-outline" onPress={()=>router.push({pathname:'/admin-support',params:{id:item.request._id}})}/>)}
    <SectionHeading title={sw?'Sehemu za kazi':'Work areas'}/>{staffTools.filter(item=>['requests','offers','referrals','reporting'].includes(item.key)).map(item=><Row key={item.key} title={sw?item.sw:item.en} body={sw?item.bodySw:item.body} icon={item.icon} onPress={()=>router.push(item.route as Href)}/>)}<Row title={sw?'Zana zote za LSF':'All LSF work tools'} body={sw?'Tafuta zana ya kazi':'Find a tool for your work'} icon="grid-outline" onPress={()=>router.push('/staff-tools')}/>
  </>}</AdminScreen>;
}
const styles=StyleSheet.create({metrics:{flexDirection:'row',gap:8},value:{fontFamily:type.semibold,color:colors.teal,fontSize:26},title:{fontFamily:type.semibold,color:colors.ink,fontSize:17},body:{fontFamily:type.regular,color:colors.inkMuted,fontSize:14,lineHeight:21}});
