import test from 'node:test';
import assert from 'node:assert/strict';
import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';
import {HUMAN_HANDOFF_MS,humanHandoffState} from '../convex/lib/socialHandoff.ts';
const handlers=loadHandlerModule('convex/socialMessaging.ts');
async function setup(channel,overrides={}){
 const h=harness(),now=Date.now();
 const c=await h.db.insert('social_conversations',{channel,account:'office',sender:'person',humanMode:true,humanModeReason:'human_takeover',humanModeUntil:now-1,consent:true,updatedAt:now-HUMAN_HANDOFF_MS-1,...overrides});
 const old=await h.db.insert('social_messages',{channel,account:'office',sender:'person',eventId:'old',text:'Previous question',sentAt:now-3600000,status:'escalated',escalationReason:'human_takeover'});
 const receive=(text='Habari, naomba msaada',eventId='new')=>h.invoke(handlers.receive,{channel,account:'office',sender:'person',eventId,text,sentAt:Date.now()});
 return {h,c,old,receive};
}
for(const channel of ['messenger','instagram','whatsapp']){
 test(`${channel}: after 30 minutes only the new DM resumes AI and identifies it`,async()=>{
  const s=await setup(channel);await s.receive();
  const rows=await s.h.db.query('social_messages').order('desc').collect(),row=rows[0];
  assert.equal(row.status,'drafting');assert.equal(row.resumedAfterHandoff,true);assert.equal((await s.h.db.get(s.c)).humanMode,false);
  assert.equal((await s.h.db.get(s.old)).status,'escalated');
  await s.h.invoke(handlers.finishDraft,{id:row._id,text:'Naweza kukusaidia. Suala lako ni lipi?',kind:'clarification'});
  const answer=await s.h.db.get(row._id);assert.equal(answer.status,'approved');assert.match(answer.approvedText,/Mimi ni Haki Yangu AI/);
  assert.ok(await s.h.invoke(handlers.claimSend,{id:row._id}));
  await s.receive('Habari, naomba msaada');assert.equal((await s.h.db.query('social_messages').collect()).length,2);
 });
 test(`${channel}: user follow-ups before expiry remain with staff without extending the timer`,async()=>{
  const until=Date.now()+600000,s=await setup(channel,{humanModeUntil:until});
  await s.receive();const row=(await s.h.db.query('social_messages').order('desc').first());
  assert.equal(row.status,'escalated');assert.equal(row.approvedText,undefined);assert.equal((await s.h.db.get(s.c)).humanModeUntil,until);
 });
}
test('staff replies restart the 30-minute pause; a late model result cannot override staff',async()=>{
 const previous=process.env.META_MESSAGING_ENABLED;process.env.META_MESSAGING_ENABLED='true';
 try{
  const s=await setup('messenger');await s.receive();const incoming=await s.h.db.query('social_messages').order('desc').first();
  const admin=await s.h.user('admin'),before=Date.now();
  await s.h.invoke(handlers.reply,{conversationId:s.c,text:'An LSF team response'},admin);
  const state=await s.h.db.get(s.c);assert.equal(state.humanMode,true);assert.ok(state.humanModeUntil>=before+HUMAN_HANDOFF_MS);
  await s.h.invoke(handlers.finishDraft,{id:incoming._id,text:'A late AI answer',kind:'information'});
  const blocked=await s.h.db.get(incoming._id);assert.equal(blocked.status,'superseded');assert.equal(blocked.approvedText,undefined);
  assert.equal((await s.h.db.get(s.c)).humanModeUntil,state.humanModeUntil);
 }finally{if(previous===undefined)delete process.env.META_MESSAGING_ENABLED;else process.env.META_MESSAGING_ENABLED=previous;}
});
for(const reason of ['ai_opt_out']){
 test(`${reason}: elapsed time does not release a safety/privacy hold`,async()=>{
  const s=await setup('instagram',{humanModeReason:reason,updatedAt:Date.now()-86400000,consent:reason!=='ai_opt_out'});
  await s.receive('Where is your office?');const row=await s.h.db.query('social_messages').order('desc').first();assert.equal(row.status,'escalated');assert.equal((await s.h.db.get(s.c)).humanMode,true);
 });
}
test('legacy automatic handoffs release on the next DM',async()=>{
 for(const reason of ['human_takeover','urgent_safety']){
  const s=await setup('messenger',{humanModeUntil:undefined,humanModeReason:undefined,updatedAt:Date.now()-86400000});
  await s.h.db.patch(s.old,{escalationReason:reason});await s.receive();
  assert.equal((await s.h.db.query('social_messages').order('desc').first()).status,'drafting');
 }
});
test('consent stays required and urgent disclosures receive AI support without forced takeover',async()=>{
 const s=await setup('instagram',{consent:false});await s.receive();let row=await s.h.db.query('social_messages').order('desc').first();assert.equal(row.status,'approved');assert.match(row.approvedText,/NDIYO/);assert.equal((await s.h.db.get(s.c)).consent,false);
 const urgent=await setup('instagram');await urgent.receive('I am in immediate danger');row=await urgent.h.db.query('social_messages').order('desc').first();assert.equal(row.escalationReason,undefined);assert.equal(row.status,'drafting');assert.equal((await urgent.h.db.get(urgent.c)).humanMode,false);
});
test('explicit stop-AI request withdraws consent; explicit AI YES can opt back in',async()=>{
 const s=await setup('messenger');await s.receive('Stop AI');let c=await s.h.db.get(s.c);assert.equal(c.consent,false);assert.equal(c.humanModeReason,'ai_opt_out');assert.equal(c.humanModeUntil,undefined);
 await s.receive('AI YES','opt-back-in');c=await s.h.db.get(s.c);assert.equal(c.consent,true);assert.equal(c.humanMode,false);assert.equal((await s.h.db.query('social_messages').order('desc').first()).status,'drafting');
});
test('manual resolve can release a safety handoff; UI state changes exactly at expiry',async()=>{
 const s=await setup('messenger',{humanModeReason:'urgent_safety'}),admin=await s.h.user('admin');
 await s.h.invoke(handlers.resume,{id:s.old},admin);assert.equal((await s.h.db.get(s.c)).humanMode,false);await s.receive();assert.equal((await s.h.db.query('social_messages').order('desc').first()).status,'drafting');
 const c={humanMode:true,humanModeUntil:123,updatedAt:0};assert.equal(humanHandoffState(c,122).active,true);assert.equal(humanHandoffState(c,123).expired,true);
});
test('an expired queued handoff acknowledgement cannot send after AI resumes',async()=>{
 const s=await setup('messenger');
 await s.h.db.patch(s.old,{status:'approved',automatic:true,approvedText:'An old handoff acknowledgement'});
 await s.receive();assert.equal(await s.h.invoke(handlers.claimSend,{id:s.old}),null);assert.equal((await s.h.db.get(s.old)).status,'superseded');
});
test('an older model result cannot re-escalate a newer message after timeout',async()=>{
 const s=await setup('instagram');await s.h.db.patch(s.old,{status:'drafting'});await s.receive();
 await s.h.invoke(handlers.finishDraft,{id:s.old,text:'Old model handoff',escalate:'ai_handoff'});
 assert.equal((await s.h.db.get(s.c)).humanMode,false);assert.equal((await s.h.db.get(s.old)).status,'superseded');
});
test('a delayed webhook from before the timeout cannot release the staff handoff',async()=>{
 const until=Date.now()-1000,s=await setup('messenger',{humanModeUntil:until});
 await s.h.invoke(handlers.receive,{channel:'messenger',account:'office',sender:'person',eventId:'delayed',text:'An earlier follow-up',sentAt:until-10000});
 assert.equal((await s.h.db.get(s.c)).humanMode,true);assert.equal((await s.h.db.query('social_messages').order('desc').first()).status,'escalated');
});

for(const text of ['I am in immediate danger','I need help with domestic violence','That is not helpful','passport number: AB1234567']){
 test('AI stays active without an explicit human request: '+text,async()=>{
  const s=await setup('messenger');await s.receive(text);const row=await s.h.db.query('social_messages').order('desc').first();assert.equal(row.status,'drafting');assert.equal((await s.h.db.get(s.c)).humanMode,false);
 });
}
for(const reason of ['urgent_safety','sensitive_case','ai_unavailable','not_helped','no_verified_answer']){
 test('historical automatic hold releases: '+reason,async()=>{
  const s=await setup('messenger',{humanModeReason:reason,humanModeUntil:undefined});await s.receive('Please continue');assert.equal((await s.h.db.get(s.c)).humanMode,false);
 });
}
for(const reason of ['no_verified_answer','ai_handoff','invalid_ai_response',undefined]){
 test('withheld AI reply does not create a human hold: '+reason,async()=>{
  const s=await setup('messenger');await s.receive();const row=await s.h.db.query('social_messages').order('desc').first();await s.h.invoke(handlers.finishDraft,{id:row._id,...(reason?{text:'Unsupported answer',escalate:reason}:{})});const saved=await s.h.db.get(row._id);assert.equal(saved.status,'approved');assert.equal(saved.escalationReason,undefined);assert.equal((await s.h.db.get(s.c)).humanMode,false);assert.doesNotMatch(saved.approvedText,/Unsupported answer|placed.*queue/);assert.ok(await s.h.invoke(handlers.claimSend,{id:row._id}));
 });
}
test('an explicit human request still pauses AI even when it also describes danger',async()=>{
 const s=await setup('messenger');await s.receive('I am in immediate danger; I want to talk to a person');assert.equal((await s.h.db.get(s.c)).humanMode,true);const row=await s.h.db.query('social_messages').order('desc').first();assert.equal(row.escalationReason,'human_request');
});

for(const yes of ['Yes','NDIYO','Nakubali','I agree']){
 test('a clear informed consent reply is accepted after the delivered notice: '+yes,async()=>{
  const s=await setup('whatsapp',{humanMode:false,consent:false});await s.receive('Habari, LSF inafanya nini?','consent-notice');const prompt=await s.h.db.query('social_messages').order('desc').first();assert.match(prompt.approvedText,/NDIYO/);await s.h.db.patch(prompt._id,{status:'sent',outboundId:'wamid.consent'});await s.receive(yes,'consent-yes');assert.equal((await s.h.db.get(s.c)).consent,true);assert.equal((await s.h.db.query('social_messages').order('desc').first()).status,'drafting');
 });
}
for(const input of ['Yes','Okay','NDIYO']){
 test('a short reply without a delivered consent notice cannot start AI processing: '+input,async()=>{
  const s=await setup('whatsapp',{humanMode:false,consent:false});await s.receive(input);assert.equal((await s.h.db.get(s.c)).consent,false);assert.match((await s.h.db.query('social_messages').order('desc').first()).approvedText,/AI/);
 });
}
test('a repeated consent notice preserves Swahili on an ambiguous short reply',async()=>{
 const s=await setup('whatsapp',{humanMode:false,consent:false});await s.receive('Habari, naomba msaada','notice');await s.receive('Okay','ambiguous');const row=await s.h.db.query('social_messages').order('desc').first();assert.match(row.approvedText,/mimi ni Haki Yangu AI/i);assert.equal((await s.h.db.get(s.c)).consent,false);
});
test('an undelivered or stale consent notice is not enough for a plain yes',async()=>{
 for(const stale of [false,true]){const s=await setup('whatsapp',{humanMode:false,consent:false});await s.receive('Habari','notice');const row=await s.h.db.query('social_messages').order('desc').first();if(stale)await s.h.db.patch(row._id,{outboundId:'wamid.old',sentAt:Date.now()-86400001});await s.receive('Yes','yes');assert.equal((await s.h.db.get(s.c)).consent,false);}
});
