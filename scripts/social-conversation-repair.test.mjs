import test from 'node:test';
import assert from 'node:assert/strict';
import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const {responseLocale}=loadHandlerModule('convex/lib/saadaLanguage.ts');
const {formatHakiReply}=loadHandlerModule('convex/lib/saadaVoice.ts');
const {lsfInformationTopic,lsfInformationReply}=loadHandlerModule('convex/lib/lsfInformation.ts');
const {socialConversationMessages,runSocialConversation}=loadHandlerModule('convex/lib/socialConversation.ts');
const messaging=loadHandlerModule('convex/socialMessaging.ts');
const answer=(reply,kind='information',sourceIds=[])=>({choices:[{message:{content:JSON.stringify({reply,kind,sourceIds,escalate:false})}}]});
test('inability to understand English persists as Kiswahili preference, including common spelling',()=>{
 for(const spelling of ['Kingereza sielewi','Kiingereza sielewi','Sielewi Kiingereza']){
  assert.equal(responseLocale(spelling,'en'), 'sw');
  assert.equal(responseLocale('CEO ni nani?', 'en',[spelling]),'sw');
 }
 assert.equal(responseLocale('I don’t understand Swahili','sw'),'en');
});
test('ordinary word definitions do not fail on a model or evidence dependency',async()=>{
 const result=await runSocialConversation({messages:[{role:'user',content:'Rasimu ni nini?'}],create:async()=>{throw Error('Must not need model');},execute:async()=>{throw Error('Must not need law');}});
 assert.equal(result.kind,'information');assert.match(result.reply,/mfano wa kwanza/);assert.ok(result.reply.split(/\s+/).length<30);
});
test('simplification is tied to the actual previous turn, not a fresh intake',async()=>{
 const prepared=socialConversationMessages('Aisee sijakuelewa kabisa',[{question:'Nataka kuandika barua',answer:'Andaa rasimu.'},{question:'Aisee sijakuelewa kabisa'}]);
 assert.match(prepared.messages[0].content,/SIMPLER MODE/);
 let calls=0;
 const result=await runSocialConversation({messages:prepared.messages,create:async()=>++calls===1?answer('Long explanation. '.repeat(50)):answer('Anza kwa kuandika kilichotokea, kwa maneno yako.','preparation'),execute:async()=>({data:[]})});
 assert.equal(calls,2);assert.match(result.reply,/maneno yako/);
});
test('inline numbered items keep their labels attached and legal section numbers stay intact',()=>{
 const formatted=formatHakiReply('Unaweza: 1. Hifadhi risiti. 2. Andika tarehe. 3. Weka nakala.');
 assert.match(formatted,/\n1\. Hifadhi|\n\n1\. Hifadhi/);assert.match(formatted,/\n2\. Andika/);assert.doesNotMatch(formatted,/1\.\n/);assert.equal(formatHakiReply(formatted),formatted);
 assert.equal(formatHakiReply('Section 1.2 and Cap. 366 apply.'),'Section 1.2 and Cap. 366 apply.');
});
test('a missing directory record can be explained directly without losing the answer to a fallback',async()=>{
 let calls=0;
 const result=await runSocialConversation({messages:[{role:'user',content:'Nipe mawasiliano yao'}],create:async()=>++calls===1?answer('Sina msaidizi aliyethibitishwa hapa.','directory'):answer('Sina mawasiliano yaliyothibitishwa ya msaidizi wa kisheria katika eneo hilo.'),execute:async()=>({data:[]})});
 assert.equal(calls,2);assert.equal(result.missingEvidence,false);assert.equal(result.kind,'information');
});
test('unsupported invented bus routes get repaired before delivery',async()=>{
 let calls=0;
 const result=await runSocialConversation({messages:[{role:'user',content:'Nafikaje ofisini hapo?'}],create:async()=>++calls===1?answer('Panda basi hadi Kariakoo na shuka karibu na ofisi.'):answer('Sina anwani iliyothibitishwa ya ofisi hiyo, hivyo siwezi kukuelekeza njia sahihi.'),execute:async()=>({data:[]})});
 assert.equal(calls,2);assert.doesNotMatch(result.reply,/Kariakoo/);assert.equal(result.missingEvidence,false);
});
test('LSF leadership and network questions use specific dated publisher records',async()=>{
 assert.equal(lsfInformationTopic('LSF CEO ni nani?'),'leadership');assert.match(lsfInformationReply('sw','leadership'),/Lulu/);
 assert.equal(lsfInformationTopic('LSF ina wasaidizi wa kisheria wangapi?'),'network');
 assert.match(lsfInformationReply('en','network'),/2021/);assert.match(lsfInformationReply('en','network'),/not today/);
 let queried;
 const result=await runSocialConversation({messages:[{role:'user',content:'LSF CEO ni nani?'}],create:async()=>answer('Tovuti ya LSF inamtaja Lulu Ng’wanakilala kama Mkurugenzi Mtendaji.','information',['lsf:leadership']),execute:async(name,args)=>{queried={name,args};return {data:{name:'Lulu Ng’wanakilala',publishedRole:'Executive Director'},sources:[{id:'lsf:leadership',kind:'published',title:'LSF Secretariat',url:'https://lsftz.org/secretariat'}]};}});
 assert.deepEqual(queried,{name:'about_lsf',args:{topic:'leadership'}});assert.equal(result.cited[0].url,'https://lsftz.org/secretariat');
});
async function setup(){const h=harness();const c=await h.db.insert('social_conversations',{channel:'whatsapp',account:'office',sender:'fictional',humanMode:false,consent:true,updatedAt:Date.now()});return {h,c,receive:async(text,eventId)=>h.invoke(messaging.receive,{channel:'whatsapp',account:'office',sender:'fictional',eventId,text,sentAt:Date.now()})};}
test('language and simplicity survive a short-message history window and model failures',async()=>{
 const f=await setup();await f.receive('Kingereza sielewi, maelezo mengi nifupishie','first');
 // Simulate a long-running conversation without triggering the inbound rate limit.
 for(let i=0;i<30;i++)await f.h.db.insert('social_messages',{channel:'whatsapp',account:'office',sender:'fictional',eventId:'history-'+i,text:'sawa',sentAt:Date.now()-120000,status:'sent'});
 await f.receive('Aisee','latest');const row=await f.h.db.query('social_messages').order('desc').first();
 assert.equal(row.replyLocale,'sw');assert.equal(row.briefReply,true);
 await f.h.invoke(messaging.finishDraft,{id:row._id,escalate:'processing_invalid_answer'});
 const finished=await f.h.db.get(row._id);assert.match(finished.approvedText,/Samahani/);assert.doesNotMatch(finished.approvedText,/transferred|handover|hamisha/);
});
test('typing claim is consented, latest, single-use and blocked by a staff takeover',async()=>{
 const f=await setup();await f.receive('Habari','typing-1');let row=await f.h.db.query('social_messages').order('desc').first();
 assert.ok(await f.h.invoke(messaging.claimTyping,{id:row._id}));assert.equal(await f.h.invoke(messaging.claimTyping,{id:row._id}),null);
 await f.receive('Naomba msaada','typing-2');const newest=await f.h.db.query('social_messages').order('desc').first();
 assert.equal(await f.h.invoke(messaging.claimTyping,{id:row._id}),null);
 await f.h.db.patch(f.c,{humanMode:true});assert.equal(await f.h.invoke(messaging.claimTyping,{id:newest._id}),null);
 await f.h.db.patch(f.c,{humanMode:false,consent:false});assert.equal(await f.h.invoke(messaging.claimTyping,{id:newest._id}),null);
});
test('a new request for detail exits the remembered simpler style',()=>{
 const {briefReplyPreference}=loadHandlerModule('convex/lib/saadaVoice.ts');
 assert.equal(briefReplyPreference('Eleza kwa undani',['Nifupishie']),false);
 const prepared=socialConversationMessages('Eleza kwa undani',[{question:'Nifupishie'},{question:'Eleza kwa undani'}],undefined,undefined,undefined,{brief:false});
 assert.equal(prepared.brief,false);assert.doesNotMatch(prepared.messages[0].content,/SIMPLER MODE:/);
});
test('an inline model source footer is removed before paragraph splitting can duplicate it',async()=>{
 const result=await runSocialConversation({messages:[],create:async()=>answer('Taarifa hii ni ya kihistoria. Chanzo: LSF Annual Report'),execute:async()=>({data:[]})});
 assert.equal(result.reply,'Taarifa hii ni ya kihistoria.');
});

test('the same ordinary definition is available before web/mobile legal retrieval',()=>{
 const {conversationalReply}=loadHandlerModule('convex/lib/saadaAssistance.ts');
 assert.match(conversationalReply('Rasimu ni nini?','sw'),/mfano wa kwanza/);
 assert.equal(conversationalReply('Rasimu ni nini na nina siku ngapi kukata rufaa?','sw'),undefined);
});
test('a real directory listing does not grant permission to invent a bus route',async()=>{
 let calls=0;
 const result=await runSocialConversation({messages:[{role:'user',content:'Nafikaje ofisini hapo?'}],create:async()=>++calls===1?{choices:[{message:{tool_calls:[{id:'office',type:'function',function:{name:'find_services',arguments:'{}'}}]}}]}:calls===2?answer('Panda basi hadi Kariakoo na shuka kituoni.','directory',['office:fixture']):answer('Anwani iliyochapishwa ni Fixture Road. Sina njia ya usafiri iliyothibitishwa.','directory',['office:fixture']),execute:async()=>({data:{name:'Fixture office',address:'Fixture Road'},sources:[{id:'office:fixture',kind:'directory',title:'Fixture office'}]})});
 assert.equal(calls,3);assert.doesNotMatch(result.reply,/Kariakoo/);assert.equal(result.missingEvidence,false);
});
test('LSF travel follow-ups render only the current published office facts, without model route or appointment claims',async()=>{
 let queries=0;
 const result=await runSocialConversation({messages:[{role:'assistant',content:'Unaweza kuwasiliana na ofisi ya LSF.'},{role:'user',content:'Nawezaje kufika hapo?'}],create:async()=>{throw Error('No model itinerary permitted');},execute:async(name,args)=>{queries++;assert.equal(name,'about_lsf');assert.equal(args.topic,'contact');return {data:{profile:{contact:{address:'Published fixture address',phone:'+255000000000'}}},sources:[{id:'lsf:contact',kind:'published',title:'LSF contact',url:'https://lsftz.org/contact'}]};}});
 assert.equal(queries,1);assert.match(result.reply,/Published fixture address/);assert.match(result.reply,/Sina njia/);assert.doesNotMatch(result.reply,/daladala|bodaboda|miadi/);assert.equal(result.cited[0].url,'https://lsftz.org/contact');
});
test('preparation must not imply a title deed is a prerequisite without supporting law',async()=>{
 let calls=0;
 const result=await runSocialConversation({messages:[{role:'user',content:'Nyumba yangu imebomolewa.'}],create:async()=>++calls===1?answer('Hakikisha una nyaraka zote muhimu kama hatimiliki.','preparation'):answer('Hifadhi picha na nyaraka zinazohusiana na tukio kama unazo. Nyumba hiyo iko eneo gani?','preparation'),execute:async()=>({data:[]})});
 assert.equal(calls,2);assert.match(result.reply,/kama unazo/);assert.equal(result.missingEvidence,false);
});
test('a common typo in rasimu still gets the short definition, without consuming a legal follow-up',async()=>{
 for(const word of ['Rasimi','Rasmu']){
  const result=await runSocialConversation({messages:[{role:'user',content:word+' ni nini?'}],create:async()=>{throw Error('No model needed for this spelling');},execute:async()=>{throw Error('No legal source needed');}});
  assert.match(result.reply,/mfano wa kwanza/);assert.doesNotMatch(result.reply,/waraka|kuthibitishwa rasmi/);assert.ok(result.reply.split(/\s+/).length<30);
 }
 const {plainVocabularyReply}=loadHandlerModule('convex/lib/saadaVoice.ts');assert.equal(plainVocabularyReply('Rasimi ni nini na nina siku ngapi kukata rufaa?','sw'),undefined);
});
