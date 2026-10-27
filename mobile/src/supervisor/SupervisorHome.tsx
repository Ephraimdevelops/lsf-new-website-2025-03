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
import { colors,type } from '../theme';
export function SupervisorHome(){
 useSensitiveScreenProtection('supervisor-home');const sw=useLanguage().locale==='sw';const access=useQuery(api.users.currentAccess);const allowed=access?.roles.includes('supervisor');
 const submitted=useQuery(api.caseManagement.staffReviewRequests,allowed?{status:'submitted'}:'skip');const reviewing=useQuery(api.caseManagement.staffReviewRequests,allowed?{status:'under_review'}:'skip');const offers=useQuery(api.caseManagement.staffAssignmentOffers,allowed?{status:'offered'}:'skip');const support=useQuery(api.paralegals.staffSupportQueue,allowed?{status:'submitted'}:'skip');
 const reviews=submitted&&reviewing?[...submitted,...reviewing]:undefined;const overdue=offers?.filter(item=>item.history.isOverdue);
 return <AdminScreen><CivicPageHeader compact title={sw?'Kazi za msimamizi':'Supervisor workspace'} actionIcon="notifications-outline" actionLabel={sw?'Arifa':'Notifications'} onAction={()=>router.push('/notifications')}/><PersonalIntro body={sw?'Saidia timu. Fuatilia kesi. Hakikisha hatua inayofuata iko wazi.':'Support the team. Follow cases. Make the next step clear.'}/>{!allowed?<LoadingText style={styles.body}>{access===undefined?(sw?'Inapakia…':'Loading…'):(sw?'Idhini ya msimamizi inahitajika.':'Supervisor approval is required.')}</LoadingText>:<>
 <ParalegalIntro pose="review" title={sw?'Ona kinachohitaji msaada.':'See what needs your help.'} body={sw?'Anza na mapitio, ofa zilizochelewa na maombi ya timu.':'Start with reviews, overdue offers and team requests.'}/>
 <View style={styles.metrics}>{[[reviews?.length,sw?'Mapitio':'Reviews'],[overdue?.length,sw?'Ofa zilizochelewa':'Overdue offers'],[support?.length,sw?'Maombi ya timu':'Team requests']].map(([value,label])=><Surface key={label} tone="teal" style={{flex:1,padding:12}}><Text style={styles.value}>{value??'…'}</Text><Text style={styles.body}>{label}</Text></Surface>)}</View>
 <SectionHeading title={sw?'Hatua inayofuata':'Next steps'}/>{reviews===undefined||overdue===undefined||support===undefined?<BrandLoading compact text={sw?'Inapakia kazi…':'Loading work…'}/>:!reviews.length&&!overdue.length&&!support.length?<Surface tone="teal"><Text style={styles.title}>{sw?'Hakuna kazi mpya hapa.':'No new work here.'}</Text><Text style={styles.body}>{sw?'Fungua kesi au zana kufuatilia kazi inayoendelea.':'Open cases or tools to follow work already in progress.'}</Text></Surface>:null}
 {!!reviews?.length && <SectionHeading title={sw ? "Pitia maombi ya ukaguzi" : "Review case concerns"} />}{reviews?.slice(0,3).map(item=><Row key={item.review._id} title={item.case?.publicId??(sw?'Mapitio ya kesi':'Case review')} body={item.review.note ?? (sw?'Fungua ombi la mapitio':'Open the review request')} icon="shield-checkmark-outline" onPress={()=>router.push({pathname:'/safeguarding-review/[id]',params:{id:item.review._id,returnTo:'supervision'}})}/>)}
 {!!overdue?.length&&<Row title={sw?'Ofa zinahitaji jibu':'Offers need a reply'} body={sw?'Kagua muda na mtoa msaada kabla ya kubadilisha.':'Check the timing and helper before reassigning.'} icon="time-outline" onPress={()=>router.push('/supervision?view=offers' as Href)}/>}
 {!!support?.length && <SectionHeading title={sw ? "Jibu timu" : "Reply to the team"} />}{support?.slice(0,2).map(item=><Row key={item.request._id} title={item.user?.name??(sw?'Ombi la timu':'Team request')} body={item.request.note} icon="chatbubble-outline" onPress={()=>router.push({pathname:'/admin-support',params:{id:item.request._id}})}/>)}
 <Row title={sw?'Mapitio yote':'All reviews'} body={sw?'Maombi mapya na yanayopitiwa':'New requests and reviews in progress'} icon="shield-outline" onPress={()=>router.push('/supervision')}/>
 <SectionHeading title={sw?'Sehemu za kazi':'Work areas'}/>{[['/operations','Cases and requests','Kesi na maombi','folder-open-outline'],['/admin-support','Team support','Msaada kwa timu','people-outline'],['/reporting','Reports','Taarifa','bar-chart-outline'],['/supervisor-tools','All supervisor tools','Zana zote za msimamizi','grid-outline']].map(([route,en,label,icon])=><Row key={route} title={sw?label:en} body={sw?'Fungua sehemu ya kazi':'Open work area'} icon={icon as 'grid-outline'} onPress={()=>router.push(route as Href)}/>)}
 </>}</AdminScreen>
}
const styles=StyleSheet.create({metrics:{flexDirection:'row',gap:8},value:{fontFamily:type.semibold,color:colors.teal,fontSize:26},title:{fontFamily:type.semibold,color:colors.ink,fontSize:17},body:{fontFamily:type.regular,color:colors.inkMuted,fontSize:14,lineHeight:21}});
