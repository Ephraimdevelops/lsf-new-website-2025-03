import { LoadingText } from '../src/components/BrandLoading';
import { BrandLoading } from '../src/components/BrandLoading';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { api } from '../src/backend/api';
import { AdminScreen } from '../src/admin/AdminScreen';
import { Row } from '../src/admin/AdminHome';
import { PersonalIntro } from '../src/components/PersonalIntro';
import { ParalegalIntro } from '../src/components/ParalegalIntro';
import { CivicPageHeader } from '../src/components/CivicPageHeader';
import { SearchFilters } from '../src/components/SearchFilters';
import { Button } from '../src/components/Button';
import { SectionHeading, Surface } from '../src/components/Surface';
import { useLanguage } from '../src/i18n';
import { useSensitiveScreenProtection } from '../src/useSensitiveScreenProtection';
import { colors, type } from '../src/theme';
import { safetyLabel } from '../src/safeguarding/labels';
const date=(value:number,sw:boolean)=>new Date(value).toLocaleDateString(sw?'sw-TZ':'en-TZ',{timeZone:'Africa/Dar_es_Salaam',day:'numeric',month:'short',year:'numeric'});
export default function SafeguardingScreen(){
 useSensitiveScreenProtection('safeguarding');const sw=useLanguage().locale==='sw';const params=useLocalSearchParams<{view?:string}>();const view=params.view==='matches'?'matches':params.view==='history'?'history':'cases';const [search,setSearch]=useState('');
 const access=useQuery(api.users.currentAccess);const allowed=access?.roles.some(role=>['admin','staff','supervisor','safeguarding_officer'].includes(role));
 const submitted=useQuery(api.caseManagement.staffReviewRequests,allowed?{status:'submitted'}:'skip');const reviewing=useQuery(api.caseManagement.staffReviewRequests,allowed?{status:'under_review'}:'skip');
 const resolved=useQuery(api.caseManagement.staffReviewRequests,allowed&&view==='history'?{status:'resolved'}:'skip');const declined=useQuery(api.caseManagement.staffReviewRequests,allowed&&view==='history'?{status:'declined'}:'skip');const matches=useQuery(api.justiceServices.staffMatchingDecisionQueue,allowed?{}:'skip');
 const isSafety=(row:NonNullable<typeof submitted>[number])=>row.review.reason==='safety_concern'||row.case?.priority==='safeguarding';
 const open=submitted&&reviewing?[...submitted,...reviewing].filter(isSafety):undefined;const reviews=view==='history'?resolved&&declined?[...resolved,...declined].filter(isSafety):undefined:open;
 const needle=search.trim().toLowerCase();const visible=reviews?.filter(row=>[row.case?.publicId,row.review.note,row.review.resolutionNote,safetyLabel(row.review.status,sw)].join(' ').toLowerCase().includes(needle)).sort((a,b)=>b.review.updatedAt-a.review.updatedAt);
 const safetyMatches=matches?.filter(row=>row.decision.urgency==='immediate_safety'||['restricted','escalated'].includes(row.decision.reviewStatus??''));const pendingMatches=safetyMatches?.filter(row=>row.decision.reviewStatus!=='approved');const visibleMatches=(view==='history'?safetyMatches?.filter(row=>!!row.decision.reviewedAt):pendingMatches)?.filter(row=>[row.case?.publicId,row.request?.publicId,row.decision.reviewNote,...row.recommendedServices.map(service=>service.name)].join(' ').toLowerCase().includes(needle));
 return <AdminScreen><CivicPageHeader compact title={sw?'Ulinzi · LSF':'Safety · LSF'} actionIcon="notifications-outline" actionLabel={sw?'Arifa':'Notifications'} onAction={()=>router.push('/notifications')}/><PersonalIntro body={sw?'Soma wasiwasi. Linda mtu. Andika hatua inayofuata.':'Read the concern. Protect the person. Record the next step.'}/>{!allowed?<Surface tone="orange"><LoadingText style={styles.body}>{access===undefined?(sw?'Inapakia…':'Loading…'):(sw?'Ruhusa ya ulinzi inahitajika.':'LSF safety access is required.')}</LoadingText></Surface>:<>
 <ParalegalIntro pose={view==='history'?'review':'safety'} title={view==='history'?(sw?'Soma uamuzi uliorekodiwa.':'Follow the recorded decision.'):(sw?'Hatua inayofuata iwe salama.':'Keep the next step safe.')} body={view==='history'?(sw?'Maamuzi yaliyohifadhiwa na sababu zake.':'Read saved decisions and their reasons.'):(sw?'Kagua wasiwasi na eleza hatua ambayo timu inapaswa kuchukua.':'Check the concern and explain what the team should do.')}/>
 <View style={styles.metrics}>{[[open?.length,sw?'Wasiwasi':'Open concerns'],[pendingMatches?.length,sw?'Mapendekezo':'Suggested services']].map(([value,label])=><Surface tone="teal" key={label} style={{flex:1,padding:12}}><Text style={styles.value}>{value??'…'}</Text><Text style={styles.body}>{label}</Text></Surface>)}</View>
 <View style={{flexDirection:"row",flexWrap:"wrap",gap:8,marginBottom:16}}>{[['cases','Safety concerns','Wasiwasi wa usalama'],['matches','Suggested services','Mapendekezo ya huduma'],['history','Decision history','Historia ya maamuzi']].map(([key,en,translation])=><Button key={key} label={sw?translation:en} variant={view===key?'primary':'secondary'} onPress={()=>{setSearch('');router.replace({pathname:'/safeguarding',params:{view:key}});}}/>)}</View>
 <SearchFilters value={search} onChange={setSearch} sw={sw} placeholder={sw?"Tafuta kesi au jambo":"Find a case or concern"} />
 {view!=='matches'&&<><SectionHeading title={view==='history'?(sw?'Mapitio yaliyokamilika':'Completed case reviews'):(sw?'Wasiwasi wa usalama':'Safety concerns')}/>{visible===undefined?<BrandLoading compact text={sw?'Inapakia mapitio…':'Loading reviews…'}/>:!visible.length?<Surface tone="teal"><Text style={styles.body}>{sw?'Hakuna mapitio hapa.':'No reviews in this area.'}</Text></Surface>:visible.map(row=><Row key={row.review._id} title={row.case?.publicId??(sw?'Kesi iliyolindwa':'Protected case')} body={`${safetyLabel(row.review.status,sw)} · ${date(row.review.updatedAt,sw)}\n${row.review.resolutionNote??row.review.note??''}`} icon="shield-checkmark-outline" onPress={()=>router.push({pathname:'/safeguarding-review/[id]',params:{id:row.review._id,returnTo:view==='history'?'history':'safeguarding'}})}/>)}</>}
 {view!=='cases'&&<><SectionHeading title={view==='history'?(sw?'Maamuzi ya huduma':'Recorded service decisions'):(sw?'Mapendekezo ya huduma':'Suggested services')}/>{visibleMatches===undefined?<BrandLoading compact text={sw?'Inapakia mapendekezo…':'Loading suggested services…'}/>:!visibleMatches.length?<Surface tone="teal"><Text style={styles.body}>{sw?'Hakuna mapendekezo hapa.':'No suggested services in this area.'}</Text></Surface>:visibleMatches.map(row=><Row key={row.decision._id} title={row.case?.publicId??row.request?.publicId??(sw?'Ombi lililolindwa':'Protected request')} body={`${safetyLabel(row.decision.reviewStatus??'pending_review',sw)}${row.decision.reviewedAt?' · '+date(row.decision.reviewedAt,sw):''}\n${row.decision.reviewNote??(sw?'Soma sababu na huduma zilizopendekezwa.':'Read the reasons and suggested services.')}`} icon="compass-outline" onPress={()=>router.push({pathname:'/matching-review',params:{id:row.decision._id,history:view==='history'?'1':undefined}})}/>)}</>}
 <Text style={styles.foot}>{sw?'Mapitio 100 ya hivi karibuni kwa kila hali na mapendekezo 100.':'Up to 100 recent reviews per status and 100 suggested services.'}</Text>
 </>}</AdminScreen>;
}
const styles=StyleSheet.create({metrics:{flexDirection:'row',gap:8,marginBottom:16},value:{fontFamily:type.semibold,color:colors.teal,fontSize:26},body:{fontFamily:type.regular,color:colors.inkMuted,fontSize:14,lineHeight:21},foot:{fontFamily:type.regular,color:colors.inkMuted,fontSize:12,lineHeight:18,marginTop:16}});
