import {formatHakiReply,selectConversationRecall,briefReplyPreference} from "./lib/saadaVoice";
import {v} from 'convex/values';
import {paginationOptsValidator} from 'convex/server';
import {query,mutation,internalMutation,internalQuery} from './_generated/server';
import {internal} from './_generated/api';
import {requireAnyRole} from './lib/auth';
import {socialTriage,socialLocale,handoffReply,consentReply,aiContinuationReply,acceptsSocialConsent} from './lib/socialTriage';
import {responseLocale} from './lib/saadaLanguage';
import {humanHandoffState,humanHandoffPatch,resumedAIReply} from './lib/socialHandoff';
const channel=v.union(v.literal('whatsapp'),v.literal('messenger'),v.literal('instagram'));
export const receive=internalMutation({args:{channel,account:v.string(),sender:v.string(),eventId:v.string(),text:v.string(),sentAt:v.number(),inputType:v.optional(v.literal("audio")),mediaId:v.optional(v.string())},handler:async(ctx,args)=>{
  if(await ctx.db.query('social_messages').withIndex('by_event',q=>q.eq('channel',args.channel).eq('eventId',args.eventId)).unique())return;
  const recent=await ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',args.channel).eq('account',args.account).eq('sender',args.sender)).order('desc').take(25);
  if(recent.filter(x=>x.sentAt>Date.now()-60000).length>=10)return;
  let conversation=await ctx.db.query('social_conversations').withIndex('by_identity',q=>q.eq('channel',args.channel).eq('account',args.account).eq('sender',args.sender)).unique();
  if(!conversation){const cid=await ctx.db.insert('social_conversations',{channel:args.channel,account:args.account,sender:args.sender,humanMode:false,consent:false,updatedAt:Date.now()});conversation=(await ctx.db.get(cid))!;}
  const legacyReason=recent.find(x=>x.escalationReason&&x.escalationReason!=='human_takeover')?.escalationReason;
  const oldReason=conversation.humanModeReason??legacyReason;
  // New policy: only an explicit human request or actual staff takeover pauses AI.
  // Release historical automatic holds on the next inbound message; never replay old drafts.
  const automaticHold=!!oldReason&&['urgent_safety','sensitive_case','not_helped','no_verified_answer','not_resolved','ai_handoff','invalid_ai_response','ai_unavailable'].includes(oldReason);
  if(conversation.humanMode&&automaticHold){const patch={humanMode:false,humanModeUntil:undefined,humanModeReason:undefined,updatedAt:Date.now()};await ctx.db.patch(conversation._id,patch);conversation={...conversation,...patch};}
  const previousHandoff=humanHandoffState(conversation,Date.now(),automaticHold?undefined:legacyReason);
  const resumeForNewMessage=previousHandoff.expired&&args.sentAt>=(previousHandoff.until??Infinity);
  if(conversation.humanMode&&!conversation.humanModeReason){
    const patch={humanModeUntil:previousHandoff.until,humanModeReason:previousHandoff.reason};
    await ctx.db.patch(conversation._id,patch);conversation={...conversation,...patch};
  }
  if(resumeForNewMessage){
    const patch={humanMode:false,humanModeUntil:undefined,humanModeReason:undefined,updatedAt:Date.now()};
    await ctx.db.patch(conversation._id,patch);conversation={...conversation,...patch};
  }
  const signal=socialTriage(args.text);
  const reason=signal==='human_request'?signal:null;
  const accepted=acceptsSocialConsent(args.text,recent.find(x=>!x.staffReply));
  if(accepted){
    const patch={consent:true,...(conversation.humanModeReason==='ai_opt_out'?{humanMode:false,humanModeUntil:undefined,humanModeReason:undefined}:{}),updatedAt:Date.now()};
    await ctx.db.patch(conversation._id,patch);conversation={...conversation,...patch};
  }
  const escalate=reason||conversation.humanMode;
  if(reason){
    const patch=humanHandoffPatch(previousHandoff.active&&['urgent_safety','sensitive_case','ai_opt_out'].includes(previousHandoff.reason)?previousHandoff.reason:reason,Date.now(),args.text);
    await ctx.db.patch(conversation._id,{...patch,...(patch.humanModeReason==='ai_opt_out'?{consent:false,voiceConsent:false}:{})});
  }
  const locale=responseLocale(args.text,conversation.replyLocale,recent.filter(x=>!x.staffReply).reverse().map(x=>x.text));
  const briefReply=briefReplyPreference(args.text,[],conversation.briefReply);
  await ctx.db.patch(conversation._id,{replyLocale:locale,briefReply});
  const pendingVoice=accepted?recent.find(x=>!x.staffReply):undefined;
  const inheritedVoice=pendingVoice?.channel==='whatsapp'&&pendingVoice.inputType==='audio'&&pendingVoice.mediaId&&pendingVoice.transcriptionStatus==='awaiting_consent'?pendingVoice:undefined;
  if(inheritedVoice&&conversation.consent){await ctx.db.patch(conversation._id,{voiceConsent:true});conversation={...conversation,voiceConsent:true};}
  const voiceMedia=args.mediaId??inheritedVoice?.mediaId;
  const canTranscribe=args.channel==='whatsapp'&&!!voiceMedia&&/^\d{5,40}$/.test(voiceMedia)&&conversation.consent&&!!conversation.voiceConsent&&!escalate;
  const isVoice=args.inputType==='audio'||!!inheritedVoice;
  const voiceNotice='I received your voice note, but voice transcription is not available here yet. Please type your question, or reply HUMAN for the LSF team.\n\nNimepokea ujumbe wako wa sauti, lakini bado siwezi kuusikiliza hapa. Tafadhali andika swali lako, au jibu MTU kwa msaada wa timu ya LSF.';
  const automaticReply=isVoice&&!escalate&&!canTranscribe?(args.channel==='whatsapp'&&voiceMedia&&(!conversation.consent||!conversation.voiceConsent)?(locale==='sw'?'Nimepokea ujumbe wako wa sauti. Ukiidhinisha, huduma ya AI itausoma kuwa maandishi ili nikujibu.':'I received your voice note. With your agreement, an AI service will transcribe it so I can answer.')+'\n\n'+consentReply(locale):voiceNotice+(!conversation.consent?'\n\n'+consentReply(locale):'')):reason&&!conversation.humanMode?handoffReply(locale):!escalate&&!conversation.consent&&!accepted?consentReply(locale):undefined;
  const id=await ctx.db.insert('social_messages',{...args,replyLocale:locale,briefReply,...(inheritedVoice?{voiceSourceMessageId:inheritedVoice._id}:{}),...(isVoice&&voiceMedia?{inputType:'audio' as const,mediaId:voiceMedia,transcriptionStatus:canTranscribe?'pending':'awaiting_consent'}:{}),status:automaticReply?'approved':escalate?'escalated':'drafting',...(resumeForNewMessage&&!escalate?{resumedAfterHandoff:true}:{}),...(escalate?{escalationReason:reason||'human_takeover'}:{}),...(automaticReply?{approvedText:formatHakiReply(automaticReply),automatic:true}:{})});
  if(inheritedVoice)await ctx.db.patch(inheritedVoice._id,{transcriptionStatus:'linked'});
  if(automaticReply)await ctx.scheduler.runAfter(0,internal.socialMessagingActions.send,{id});
  else if(!escalate)await ctx.scheduler.runAfter(0,canTranscribe?internal.socialVoice.transcribe:internal.socialMessagingActions.draft,{id});
}});
export const inbox=query({args:{},handler:async(ctx)=>{await requireAnyRole(ctx, ["admin"]);return ctx.db.query('social_messages').order('desc').take(100);}});
export const prepare=mutation({args:{id:v.id('social_messages'),consent:v.boolean()},handler:async(ctx,{id,consent})=>{
  const {user}=await requireAnyRole(ctx, ["admin"]); const row=await ctx.db.get(id);
  if(!row||!consent||!['received','draft','draft_failed','escalated'].includes(row.status))throw new Error('Explicit sender consent and an available message are required.');
  await ctx.db.patch(id,{status:'drafting',consentConfirmedBy:user._id,error:undefined});await ctx.scheduler.runAfter(0,internal.socialMessagingActions.draft,{id});
}});
export const approve=mutation({args:{id:v.id('social_messages'),text:v.string()},handler:async(ctx,{id,text})=>{
  const {user}=await requireAnyRole(ctx, ["admin"]);const row=await ctx.db.get(id);
  if(process.env.META_MESSAGING_ENABLED!=="true")throw new Error("Messaging is not enabled yet.");
  if(!row||!['received','draft','draft_failed','escalated'].includes(row.status)||!text.trim()||text.length>3500)throw new Error('Message cannot be approved.');
  // Conservative window: sends are never retried automatically after an uncertain result.
  if(Date.now()-row.sentAt>23*60*60*1000)throw new Error('Reply window expired. Use the official inbox and applicable channel policy.');
  const c=await ctx.db.query('social_conversations').withIndex('by_identity',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).unique();
  if(c?.humanMode)await ctx.db.patch(c._id,humanHandoffPatch(c.humanModeReason??row.escalationReason??'human_takeover'));
  await ctx.db.patch(id,{status:'approved',automatic:false,approvedText:text.trim(),approvedBy:user._id,approvedAt:Date.now()});await ctx.scheduler.runAfter(0,internal.socialMessagingActions.send,{id});
}});
export const get=internalQuery({args:{id:v.id('social_messages')},handler:async(ctx,{id})=>ctx.db.get(id)});
export const finishDraft=internalMutation({args:{id:v.id('social_messages'),text:v.optional(v.string()),kind:v.optional(v.string()),escalate:v.optional(v.string()),tools:v.optional(v.array(v.string())),sources:v.optional(v.array(v.string())),promptVersion:v.optional(v.string())},handler:async(ctx,{id,text,kind,escalate,tools,sources,promptVersion})=>{
  const row=await ctx.db.get(id);if(row?.status!=='drafting')return;
  if(tools||sources||promptVersion)await ctx.db.patch(id,{...(tools?{aiTools:tools.slice(0,6)}:{}),...(sources?{aiSourceUrls:sources.slice(0,3)}:{}),...(promptVersion?{aiPromptVersion:promptVersion}:{})});
  const conversation=await ctx.db.query('social_conversations').withIndex('by_identity',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).unique();
  const latest=await ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).order('desc').first();
  if(latest?._id!==id&&!row.consentConfirmedBy){await ctx.db.patch(id,{status:'superseded',...(text?{draft:text}:{})});return;}
  const reason=escalate||(!text?'ai_unavailable':undefined);
  if(conversation?.humanMode){
    await ctx.db.patch(id,{status:'escalated',escalationReason:conversation.humanModeReason||'human_takeover',...(text?{draft:text}:{})});
    return;
  }
  // An unsupported/model-failed response is withheld, not converted into a
  // human takeover. A fresh DM can immediately try the AI again.
  const recent=await ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).order('desc').take(25);
  const locale=row.transcriptionLocale??row.replyLocale??responseLocale(row.transcribedText??row.text,conversation?.replyLocale,recent.filter(x=>!x.staffReply&&x._id!==id).reverse().map(x=>x.transcribedText??x.text));
  const reply=formatHakiReply(reason?aiContinuationReply(locale,reason):text!);
  await ctx.db.patch(id,{status:'approved',automatic:true,aiKind:reason?'information':kind,escalationReason:undefined,...(reason?{error:'AI answer withheld: '+reason}:{}),approvedText:row.resumedAfterHandoff?resumedAIReply(reply,locale):reply});
  await ctx.scheduler.runAfter(0,internal.socialMessagingActions.send,{id});
}});
export const claimSend=internalMutation({args:{id:v.id('social_messages')},handler:async(ctx,{id})=>{
 const row=await ctx.db.get(id);if(!row||row.status!=='approved')return null;
 if(row.automatic){if(!row.approvedText||Date.now()-row.sentAt>23*60*60*1000)return null;
 const conversation=await ctx.db.query('social_conversations').withIndex('by_identity',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).unique();
 const latest=await ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).order('desc').first();
 const activeHandoff=conversation&&humanHandoffState(conversation,Date.now(),row.escalationReason).active;
 if(latest?._id!==id||(row.escalationReason?!activeHandoff:conversation?.humanMode)){await ctx.db.patch(id,{status:'superseded'});return null;}
 await ctx.db.patch(id,{status:'sending'});return row;}
 const actor=row.approvedBy?await ctx.db.get(row.approvedBy):null;
 if(!actor||actor.isDeleted||!row.approvedText||Date.now()-row.sentAt>23*60*60*1000)return null;
 const roles=await ctx.db.query('role_assignments').withIndex('by_user_status',q=>q.eq('userId',actor._id).eq('status','active')).collect();
 if(actor.role!=='admin'&&!roles.some(x=>x.role==='admin'))return null;
 await ctx.db.patch(id,{status:'sending'});return row;
}});
export const finishSend=internalMutation({args:{id:v.id('social_messages'),outboundId:v.optional(v.string())},handler:async(ctx,{id,outboundId})=>{
 const row=await ctx.db.get(id);if(row?.status==='sending')await ctx.db.patch(id,{status:outboundId?(row.escalationReason?'escalated':'sent'):'delivery_uncertain',...(outboundId?{outboundId}:{error:'Delivery not confirmed. Check Meta inbox before taking further action; no automatic resend.'})});
}});
export const history=internalQuery({args:{id:v.id('social_messages')},handler:async(ctx,{id})=>{
 const row=await ctx.db.get(id);if(!row)return [];
 const c=await ctx.db.query('social_conversations').withIndex('by_identity',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).unique();
 const memory=c?await ctx.db.query('conversation_context').withIndex('by_scope',q=>q.eq('scope','social:'+c._id)).unique():null;
 return (await ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).order('desc').take(12)).filter(x=>x.sentAt<=row.sentAt&&x.sentAt>(memory?.forgotBefore??0)).reverse().map(x=>({question:x.transcribedText??x.text,answer:x.outboundId?x.approvedText:null,kind:x.aiKind,staffReply:x.staffReply}));
}});

export const resume=mutation({args:{id:v.id('social_messages')},handler:async(ctx,{id})=>{await requireAnyRole(ctx, ["admin"]);const row=await ctx.db.get(id);if(!row)throw new Error('Not found');const conversation=await ctx.db.query('social_conversations').withIndex('by_identity',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).unique();if(conversation)await ctx.db.patch(conversation._id,{humanMode:false,humanModeUntil:undefined,humanModeReason:undefined,updatedAt:Date.now()});}});
export const hasConsent=internalQuery({args:{id:v.id('social_messages')},handler:async(ctx,{id})=>{const row=await ctx.db.get(id);if(!row)return false;const c=await ctx.db.query('social_conversations').withIndex('by_identity',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).unique();return !!c?.consent&&!c.humanMode;}});

export const conversations=query({args:{},handler:async(ctx)=>{
 await requireAnyRole(ctx, ["admin"]);
 const rows=await ctx.db.query('social_conversations').order('desc').take(100);
 return Promise.all(rows.map(async c=>{const recent=await ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',c.channel as any).eq('account',c.account).eq('sender',c.sender)).order('desc').take(25);const state=humanHandoffState(c,Date.now(),recent.find(x=>x.escalationReason&&x.escalationReason!=='human_takeover')?.escalationReason);return {...c,humanModeUntil:state.until,humanModeReason:state.reason,last:recent[0]??null};}));
}});
export const conversationMessages=query({args:{conversationId:v.id('social_conversations'),paginationOpts:paginationOptsValidator},handler:async(ctx,{conversationId,paginationOpts})=>{
 await requireAnyRole(ctx, ["admin"]);const c=await ctx.db.get(conversationId);if(!c)throw new Error('Conversation not found');
 return ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',c.channel as any).eq('account',c.account).eq('sender',c.sender)).order('desc').paginate(paginationOpts);
}});
export const reply=mutation({args:{conversationId:v.id('social_conversations'),text:v.string()},handler:async(ctx,{conversationId,text})=>{
 const {user}=await requireAnyRole(ctx, ["admin"]);const c=await ctx.db.get(conversationId);
 if(!c||process.env.META_MESSAGING_ENABLED!=='true'||!text.trim()||text.length>3500)throw new Error('Reply unavailable');
 const recent=await ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',c.channel as any).eq('account',c.account).eq('sender',c.sender)).order('desc').take(100);
 const incoming=recent.find(x=>!x.staffReply);if(!incoming||Date.now()-incoming.sentAt>23*60*60*1000)throw new Error('Reply window expired; use the official channel inbox.');
 const state=humanHandoffState(c,Date.now(),recent.find(x=>x.escalationReason&&x.escalationReason!=='human_takeover')?.escalationReason);
 await ctx.db.patch(c._id,humanHandoffPatch(['urgent_safety','sensitive_case','ai_opt_out'].includes(state.reason)&&c.humanMode?state.reason:'human_takeover'));
 const id=await ctx.db.insert('social_messages',{channel:c.channel as any,account:c.account,sender:c.sender,eventId:'staff:'+conversationId+':'+Date.now(),text:'Staff reply',sentAt:incoming.sentAt,status:'approved',staffReply:true,automatic:false,approvedText:text.trim(),approvedBy:user._id,approvedAt:Date.now()});
 await ctx.scheduler.runAfter(0,internal.socialMessagingActions.send,{id});
}});

export const recallHistory=internalQuery({args:{id:v.id('social_messages'),search:v.optional(v.string())},handler:async(ctx,{id,search})=>{
 const row=await ctx.db.get(id);if(!row)return [];
 const conversation=await ctx.db.query('social_conversations').withIndex('by_identity',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).unique();
 if(!conversation?.consent||conversation.humanMode)return [];
 const query=()=>ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender));
 const [first,recent]=await Promise.all([query().order('asc').take(6),query().order('desc').take(120)]);
 const memory=await ctx.db.query('conversation_context').withIndex('by_scope',q=>q.eq('scope','social:'+conversation._id)).unique();
 const rows=[...new Map([...first,...recent].map(x=>[x._id,x])).values()].filter(x=>x.sentAt<=row.sentAt&&x.sentAt>(memory?.forgotBefore??0));
 return selectConversationRecall(rows.flatMap(x=>[...(!x.staffReply?[{role:'user',content:x.transcribedText??x.text,timestamp:x.sentAt}]:[]),...(x.outboundId&&x.approvedText?[{role:'assistant',content:x.approvedText,timestamp:x.approvedAt??x.sentAt}]:[])]),search);
}});

export const finishTranscription=internalMutation({args:{id:v.id('social_messages'),text:v.optional(v.string())},handler:async(ctx,{id,text})=>{
 const row=await ctx.db.get(id);if(!row||row.status!=='drafting'||row.transcriptionStatus!=='processing')return;
 const c=await ctx.db.query('social_conversations').withIndex('by_identity',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).unique();
 const latest=await ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).order('desc').first();
 if(!c?.consent||c.humanMode||latest?._id!==id){await ctx.db.patch(id,{status:'superseded',transcriptionStatus:'cancelled'});return;}
 if(!text?.trim()||text.length>4000){await ctx.db.patch(id,{transcriptionStatus:'failed'});await ctx.scheduler.runAfter(0,internal.socialMessaging.finishDraft,{id,text:row.transcriptionLocale==='en'?'I could not clearly understand this recording. Please send a clearer, shorter voice note or type your question.':'Sijasikia vizuri kwenye rekodi hii. Tafadhali tuma sauti fupi iliyo wazi, au andika swali lako.',kind:'information'});return;}
 const reason=socialTriage(text);await ctx.db.patch(id,{transcribedText:text.trim(),transcriptionStatus:'ready'});
 if(reason==='human_request'){
  await ctx.db.patch(c._id,{...humanHandoffPatch(reason,Date.now(),text),...(/\b(stop ai|no ai|sitaki ai)\b/i.test(text)?{consent:false,voiceConsent:false}:{})});
  await ctx.db.patch(id,{status:'approved',automatic:true,escalationReason:reason,approvedText:formatHakiReply(handoffReply(socialLocale(text)))});await ctx.scheduler.runAfter(0,internal.socialMessagingActions.send,{id});
 }else await ctx.scheduler.runAfter(0,internal.socialMessagingActions.draft,{id});
}});
export const claimTranscription=internalMutation({args:{id:v.id('social_messages')},handler:async(ctx,{id})=>{
 const row=await ctx.db.get(id);if(!row||row.channel!=='whatsapp'||row.status!=='drafting'||row.transcriptionStatus!=='pending'||!row.mediaId)return null;
 const c=await ctx.db.query('social_conversations').withIndex('by_identity',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).unique();
 if(!c?.consent||!c.voiceConsent||c.humanMode)return null;
 const recent=await ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).order('desc').take(24);
 const transcriptionLocale=responseLocale('',undefined,recent.filter(x=>!x.staffReply&&x.inputType!=='audio').reverse().map(x=>x.text));
 await ctx.db.patch(id,{transcriptionStatus:'processing',transcriptionLocale});return {...row,transcriptionLocale};
}});

// Best-effort activity signal only for a current, consented automatic draft.
// Repeated jobs, staff takeovers and superseded messages must never reactivate it.
export const claimTyping=internalMutation({args:{id:v.id('social_messages')},handler:async(ctx,{id})=>{
 const row=await ctx.db.get(id);
 if(!row||row.status!=='drafting'||row.typingStartedAt||!['whatsapp','messenger'].includes(row.channel)||Date.now()-row.sentAt>23*60*60*1000)return null;
 const c=await ctx.db.query('social_conversations').withIndex('by_identity',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).unique();
 const latest=await ctx.db.query('social_messages').withIndex('by_sender',q=>q.eq('channel',row.channel).eq('account',row.account).eq('sender',row.sender)).order('desc').first();
 if(!c?.consent||c.humanMode||latest?._id!==id)return null;
 await ctx.db.patch(id,{typingStartedAt:Date.now()});return row;
}});
