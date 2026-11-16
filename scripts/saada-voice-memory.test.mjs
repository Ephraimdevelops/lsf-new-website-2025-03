import test from 'node:test';
import assert from 'node:assert/strict';
import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const {formatHakiReply,selectConversationRecall}=loadHandlerModule('convex/lib/saadaVoice.ts');
const {consentReply,isSocialConsentNotice}=loadHandlerModule('convex/lib/socialTriage.ts');
test('consent notices have readable sentence paragraphs and remain recognisable',()=>{
 for(const locale of ['en','sw']){const reply=consentReply(locale);assert.ok(reply.split('\n\n').length>=5);assert.equal(isSocialConsentNotice(reply),true);assert.equal(isSocialConsentNotice(reply.replace(/\n\n/g,' ')),true);}
});
test('spacing is idempotent and preserves lists, legal abbreviations, links and cards',()=>{
 const value='Dr. Asha reviewed Cap. 366. We can continue. What changed?';
 const formatted=formatHakiReply(value);assert.equal(formatted,'Dr. Asha reviewed Cap. 366.\n\nWe can continue.\n\nWhat changed?');assert.equal(formatHakiReply(formatted),formatted);
 for(const text of ['1. Keep your receipts. They may help.\n2. Write the dates.','https://example.go.tz/source.pdf','::SERVICE_CARD:fixture::'])assert.equal(formatHakiReply(text),text);
 assert.equal(formatHakiReply('```\nx.y();\n```\n\nWe can help. Tell me more.'),'```\nx.y();\n```\n\nWe can help.\n\nTell me more.');
});
test('recall retains early identity and a relevant older fact with a bounded excerpt size',()=>{
 const rows=Array.from({length:125},(_,i)=>({role:'user',content:i===0?'Naitwa Asha.':i===30?'Niko Kinondoni, tatizo langu ni mshahara.':'turn '+i+' '+'x'.repeat(800),timestamp:i}));
 const recall=selectConversationRecall(rows,'Kinondoni');assert.ok(recall.some(x=>x.content.includes('Asha')));assert.ok(recall.some(x=>x.content.includes('Kinondoni')));assert.ok(recall.length<=20);assert.ok(recall.every(x=>x.content.length<=700));
});
test('social recall is isolated by sender, channel and recipient account and requires consent',async()=>{
 const h=harness(),handlers=loadHandlerModule('convex/socialMessaging.ts');
 const conversation=await h.db.insert('social_conversations',{channel:'whatsapp',account:'test-office',sender:'person',humanMode:false,consent:true,updatedAt:Date.now()});
 const now=Date.now();
 for(const [channel,account,sender,text]of [['whatsapp','test-office','person','Naitwa Asha, niko Kinondoni.'],['whatsapp','test-office','someone-else','OTHER PERSON SECRET'],['messenger','test-office','person','OTHER CHANNEL SECRET'],['whatsapp','other-office','person','OTHER OFFICE SECRET']])await h.db.insert('social_messages',{channel,account,sender,eventId:channel+account+sender,text,sentAt:now-60000,status:'sent'});
 const id=await h.db.insert('social_messages',{channel:'whatsapp',account:'test-office',sender:'person',eventId:'current',text:'Tuliishia wapi?',sentAt:now,status:'drafting'});
 const rows=await h.invoke(handlers.recallHistory,{id});assert.match(JSON.stringify(rows),/Asha/);assert.doesNotMatch(JSON.stringify(rows),/SECRET/);
 await h.db.patch(conversation,{consent:false});assert.equal((await h.invoke(handlers.recallHistory,{id})).length,0);
});
test('web/mobile recall cannot cross users or named chats and respects deletion',async()=>{
 const h=harness(),handlers=loadHandlerModule('convex/sara_chat.ts');
 const own=await h.db.insert('sara_conversations',{userId:'owner',title:'Own chat',updatedAt:Date.now()}),other=await h.db.insert('sara_conversations',{userId:'other',title:'Other chat',updatedAt:Date.now()});
 await h.db.insert('sara_chats',{userId:'owner',conversationId:own,role:'user',content:'Naitwa Asha.',timestamp:1});await h.db.insert('sara_chats',{userId:'other',conversationId:other,role:'user',content:'OTHER PERSON SECRET',timestamp:2});
 assert.match(JSON.stringify(await h.invoke(handlers.recallHistoryInternal,{userId:'owner',conversationId:own})),/Asha/);
 await assert.rejects(h.invoke(handlers.recallHistoryInternal,{userId:'owner',conversationId:other}),/not found/);
 const user=await h.db.insert('users',{clerkId:'owner',role:'user',email:'fixture@test.invalid'});await h.invoke(handlers.deleteConversation,{conversationId:own},user);
 await assert.rejects(h.invoke(handlers.recallHistoryInternal,{userId:'owner',conversationId:own}),/not found/);
});

test('delivered historical consent notices still accept a clear yes after the public wording changes',()=>{
 const {acceptsSocialConsent}=loadHandlerModule('convex/lib/socialTriage.ts');
 const original='I’m Haki Yangu AI, LSF’s automated assistant. I can help with information and finding support. For AI answers, this conversation’s messages will be processed by OpenAI. Avoid unnecessary personal details. Reply AI YES to agree, or HUMAN for the LSF team.';
 for(const notice of [original,original.replace('Reply AI YES to agree','Reply YES or AI YES to agree')])assert.equal(acceptsSocialConsent('Yes',{approvedText:notice,outboundId:'delivered',sentAt:Date.now()-1000}),true);
});
