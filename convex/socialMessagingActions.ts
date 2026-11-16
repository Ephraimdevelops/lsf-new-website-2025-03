"use node";
import {metaMessagingHost} from './lib/metaMessaging';
import {internalAction} from './_generated/server';
import {v} from 'convex/values';
import {api,internal} from './_generated/api';
import OpenAI from 'openai';
import {meteredAi} from './lib/meteredAi';
import {makeSocialTools} from './lib/socialPublicTools';
import {replyEscalation} from './lib/socialTriage';
import {SOCIAL_PROMPT_VERSION,runSocialConversation,socialConversationMessages} from './lib/socialConversation';

export const draft=internalAction({args:{id:v.id('social_messages')},handler:async(ctx,{id})=>{
 try{
  const row=await ctx.runQuery(internal.socialMessaging.get,{id});
  if(row?.status!=='drafting'||(!row.consentConfirmedBy&&!await ctx.runQuery(internal.socialMessaging.hasConsent,{id})))return;
  const [history,approvedPrompt,memory]=await Promise.all([ctx.runQuery(internal.socialMessaging.history,{id}),ctx.runQuery(internal.sara.getApprovedPromptInternal,{}),ctx.runQuery(internal.conversationMemory.socialInternal,{id})]);
  const {messages,locale}=socialConversationMessages(row.transcribedText??row.text,history,approvedPrompt?.prompt,memory?.facts,row.transcribedText?row.transcriptionLocale:undefined);
  const ai=new OpenAI({apiKey:process.env.OPENAI_API_KEY,timeout:20000,maxRetries:0});
  const model=process.env.SAADA_CHAT_MODEL||'gpt-4o';
  const result=await runSocialConversation({messages,
   create:async(turns,tools,remainingMs)=>meteredAi(ctx,{socialMessageId:id,feature:'social_draft',model,input:{messages:turns,tools},maxOutputTokens:900},()=>ai.chat.completions.create({model,messages:turns,max_completion_tokens:900,response_format:{type:'json_object'},store:false,...(tools.length?{tools,tool_choice:'auto' as const}:{})},{timeout:Math.min(20000,remainingMs)})),
   execute:makeSocialTools(ctx,{ai,locale,id})
  });
  const escalation=replyEscalation(result,{legal:result.legal,directory:result.directory,priorReplies:history.filter(x=>x.answer).length,consecutiveClarifications:(()=>{let count=0;for(const turn of [...history].reverse()){if(!turn.answer)continue;if(turn.kind!=='clarification')break;count++;}return count;})()});
  const urls=result.cited.filter(x=>x.url&&/^https?:\/\//.test(x.url)).slice(0,2);
  let suffix=urls.length?'\n\n'+(locale==='sw'?'Chanzo: ':'Source: ')+urls.map(x=>x.title+' — '+x.url).join('\n'):'';
  // Keep room for the resume notice within Messenger's short text envelope.
  // Never cut a legal answer midway through a condition or safety caveat.
  if(result.reply.length>1700)throw new Error('Social answer exceeds delivery budget');
  if(result.reply.length+suffix.length>1800)suffix='';
  await ctx.runMutation(internal.socialMessaging.finishDraft,{id,text:result.reply+suffix,kind:result.kind,...(escalation?{escalate:escalation}:{}),tools:result.usedTools,sources:urls.map(x=>x.url!),promptVersion:SOCIAL_PROMPT_VERSION});
 }catch(error){
  // Operational category only: never store provider bodies, credentials or DM text.
  const message=error instanceof Error?error.message:'';
  const status=typeof error==='object'&&error!==null&&'status' in error?Number(error.status):0;
  const code=status===429?'provider_rate_limit':status===401?'provider_auth':status>=400?'provider_error':/timeout|timed out/i.test(message)?'timeout':/delivery budget/i.test(message)?'answer_too_long':/budget|limit.*cost|spend/i.test(message)?'budget':/JSON|Unexpected token|Unterminated/i.test(message)?'response_format':/tool limit|Too many social tools/i.test(message)?'tool_limit':/Invalid social answer/i.test(message)?'invalid_answer':'processing_error';
  await ctx.runMutation(internal.socialMessaging.finishDraft,{id,escalate:'processing_'+code});
 }
}});
export const send=internalAction({args:{id:v.id('social_messages')},handler:async(ctx,{id})=>{
 if(process.env.META_MESSAGING_ENABLED!=='true')return;
 const row=await ctx.runMutation(internal.socialMessaging.claimSend,{id});if(!row)return;
 let outboundId:string|undefined;
 try{
  const version=process.env.META_GRAPH_VERSION;if(!version||!/^v\d+\.\d+$/.test(version))throw new Error('Missing Graph version');
  const instagram=row.channel==='instagram'?await ctx.runQuery(internal.metaInstagram.credentials,{}):null;
  const token=row.channel==='whatsapp'?process.env.META_WHATSAPP_TOKEN:row.channel==='instagram'?(instagram?.token??process.env.META_INSTAGRAM_TOKEN):process.env.META_PAGE_TOKEN;
  const expected=row.channel==='whatsapp'?process.env.META_WHATSAPP_PHONE_ID:row.channel==='instagram'?(instagram?.accountId??process.env.META_INSTAGRAM_ID):process.env.META_PAGE_ID;
  if(!token||expected!==row.account)throw new Error('Channel not configured');
  const payload=row.channel==='whatsapp'?{messaging_product:'whatsapp',to:row.sender,type:'text',text:{body:row.approvedText}}:{recipient:{id:row.sender},message:{text:row.approvedText},...(row.channel==='messenger'?{messaging_type:'RESPONSE'}:{})};
  const host=metaMessagingHost(row.channel,instagram?.authMode??process.env.META_INSTAGRAM_AUTH_MODE);
  const response=await fetch(`https://${host}/${version}/${row.account}/messages`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
  const body=await response.json();if(response.ok)outboundId=body.messages?.[0]?.id??body.message_id;
 }catch{/* Never log message bodies or credentials. An uncertain send must not be replayed. */}
 await ctx.runMutation(internal.socialMessaging.finishSend,{id,...(outboundId?{outboundId}:{})});
}});
