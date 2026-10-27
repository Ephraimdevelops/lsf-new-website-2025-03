import { useAction,useMutation,useQuery } from 'convex/react';
import { useRef,useState } from 'react';
import { Pressable,Text,View,StyleSheet } from 'react-native';
import { api } from '../backend/api';
import { useAuth } from '../auth';
import type { Id } from '../../../convex/_generated/dataModel';
import { colors,type } from '../theme';
export function SaadaActionCard({id,sw}:{id:string;sw:boolean}) {
 const {isSignedIn,userId}=useAuth(); const valid=/^[a-z0-9]{20,64}$/.test(id);
 const draft=useQuery(api.saadaActionDrafts.get,isSignedIn&&valid?{id:id as Id<'saada_action_drafts'>}:'skip');
 const confirm=useAction(api.saadaActionConfirm.confirm),cancel=useMutation(api.saadaActionDrafts.cancel);
 const [busy,setBusy]=useState(false),[error,setError]=useState('');const lock=useRef(false),owner=useRef(userId);owner.current=userId;
 if(!isSignedIn||!valid)return null;
 if(draft===undefined)return <Text style={styles.body}>{sw?'Inafungua rasimu…':'Opening draft…'}</Text>;
 if(!draft)return <Text style={styles.body}>{sw?'Rasimu haipatikani. Kagua taarifa za kesi.':'Draft unavailable. Check the case updates.'}</Text>;
 const p=draft.payload;
 async function act(kind:'confirm'|'cancel') {if(lock.current)return;lock.current=true;setBusy(true);setError('');const requestOwner=owner.current;
 try{if(kind==='confirm')await confirm({id:id as Id<'saada_action_drafts'>,confirmed:true});else await cancel({id:id as Id<'saada_action_drafts'>});}
 catch{if(owner.current===requestOwner)setError(sw?'Matokeo hayajathibitishwa. Kagua kesi au ujaribu tena; ombi lilelile halitatumwa mara mbili.':'Result not confirmed. Check the case or retry; the same request will not be submitted twice.');}
 finally{if(owner.current===requestOwner){lock.current=false;setBusy(false);}}}
 return <View style={styles.panel} accessibilityLabel={sw?'Kagua ombi':'Review request'}>
  <Text style={styles.heading}>{p.kind==='appointment'?(sw?'Kagua ombi la miadi':'Review appointment request'):(sw?'Kagua pendekezo la rufaa':'Review referral proposal')}</Text>
  <Text style={styles.body}>{sw?'Kesi':'Case'}: {draft.caseReference}</Text>
  {p.kind==='appointment'?<><Text style={styles.body}>{p.preferredMode==='phone'?(sw?'Kwa simu':'Phone'):p.preferredMode==='remote'?(sw?'Mtandaoni':'Online'):(sw?'Ana kwa ana':'In person')}</Text><Text style={styles.body}>{p.preferredTime||(sw?'Muda utapangwa na timu ya kesi.':'Time to be agreed with the case team.')}</Text>{!!p.note&&<Text style={styles.body}>{p.note}</Text>}</>:<><Text style={styles.body}>{p.destinationName} · {p.providerName}</Text><Text style={styles.body}>{p.reason}</Text><Text style={styles.body}>{sw?'Taarifa zinazopendekezwa kushirikiwa:':'Proposed information to share:'} {p.information}</Text></>}
  <Text style={styles.small}>{p.kind==='appointment'?(sw?'Timu ya kesi bado inahitaji kuthibitisha miadi.':'The case team must still confirm the appointment.'):(sw?'Mnufaika lazima akubali kabla ya maelezo kufikishwa kwa mtoa huduma.':'The beneficiary must agree before the provider receives details.')}</Text>
  {draft.status==='submitted'?<Text accessibilityRole="alert" style={styles.success}>{p.kind==='appointment'?(sw?'Ombi limetumwa kwa timu ya kesi.':'Request submitted to the case team.'):(sw?'Pendekezo linasubiri ridhaa ya mnufaika.':'Proposal awaiting beneficiary consent.')} {draft.result?.reference}</Text>:draft.status==='cancelled'||draft.expired?<Text style={styles.body}>{draft.status==='cancelled'?(sw?'Rasimu imeghairiwa.':'Draft cancelled.'):(sw?'Rasimu imekwisha muda. Omba mpya.':'Draft expired. Ask for a new one.')}</Text>:<View style={styles.buttons}><Pressable disabled={busy} accessibilityRole="button" style={styles.primary} onPress={()=>void act('confirm')}><Text style={styles.primaryText}>{busy?(sw?'Inathibitisha…':'Confirming…'):draft.status==='confirming'?(sw?'Kagua na ujaribu tena':'Check and retry'):(sw?'Thibitisha ombi':'Confirm request')}</Text></Pressable>{draft.status==='pending'&&<Pressable disabled={busy} accessibilityRole="button" style={styles.cancel} onPress={()=>void act('cancel')}><Text style={styles.body}>{sw?'Ghairi rasimu':'Cancel draft'}</Text></Pressable>}</View>}
  {!!error&&<Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
 </View>;
}
const styles=StyleSheet.create({panel:{marginVertical:12,padding:16,borderRadius:16,borderWidth:1,borderColor:colors.line,backgroundColor:'#F7F5F3',gap:10},heading:{fontFamily:type.semibold,fontSize:16,color:colors.charcoal},body:{fontFamily:type.regular,fontSize:14,lineHeight:21,color:colors.charcoal},small:{fontFamily:type.regular,fontSize:12,lineHeight:18,color:colors.inkMuted},success:{fontFamily:type.medium,fontSize:14,lineHeight:21,color:colors.green},error:{fontFamily:type.regular,fontSize:13,lineHeight:19,color:colors.burgundy},buttons:{flexDirection:'row',flexWrap:'wrap',gap:8},primary:{minHeight:48,paddingHorizontal:14,paddingVertical:12,borderRadius:12,backgroundColor:colors.burgundy},primaryText:{fontFamily:type.medium,fontSize:14,color:'#FFFFFF'},cancel:{minHeight:48,padding:12}});
