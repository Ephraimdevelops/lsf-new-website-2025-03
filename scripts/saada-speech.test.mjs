import assert from 'node:assert/strict';
import test from 'node:test';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
const { speechParts } = loadHandlerModule('convex/lib/saadaSpeech.ts');
const { readSpeechStream } = loadHandlerModule('convex/lib/speechStream.ts');
const media = loadHandlerModule('convex/saadaMedia.ts');
const pricing = loadHandlerModule('convex/lib/aiPricing.ts');
function stream(data, width = 13) {
  const bytes = new TextEncoder().encode(data);
  return new Response(new ReadableStream({ start(controller) { for (let i=0;i<bytes.length;i+=width) controller.enqueue(bytes.slice(i,i+width)); controller.close(); } }));
}
const event = value => 'data: '+JSON.stringify(value)+'\r\n\r\n';
const delta = value => event({type:'speech.audio.delta',audio:Buffer.from(value).toString('base64')});
const done = event({type:'speech.audio.done',usage:{input_tokens:14,output_tokens:101,total_tokens:115}});
test('spoken sections preserve English and Kiswahili and every word of a long answer',()=>{
  const text = Array.from({length:650},(_,i)=>`neno${i}`).join(' ');
  const parts = speechParts(text);assert.ok(parts.length>1);
  assert.equal(parts.join(' '),text);
  for(const part of parts) assert.ok(Buffer.byteLength(part)<=1200);
  assert.equal(speechParts('Hello. Habari yako?')[0],'Hello. Habari yako?');
  assert.throws(()=>speechParts('x'.repeat(24001)),/too long/);
});
test('speech removes markup and JSON while preserving support names and intake caveats',()=>{
  const text = '# Msaada\n**Piga** [LHRC](https://example.org). ::SERVICE_CARD:{"name":"Clinic","district":"Kinondoni","intake":"Intake unconfirmed","phone":"+255 123456789"}::';
  assert.equal(speechParts(text).join(' '),'Msaada Piga LHRC. Clinic. Kinondoni. Intake unconfirmed. +255 123456789');
  assert.throws(()=>speechParts(''),/no answer/);
});
test('only the owner can speak completed assistant answers; consent and part bounds are enforced',async()=>{
  const h=harness(),alice=await h.user(),bob=await h.user();
  const owner=(await h.db.get(alice)).clerkId;
  const messageId=await h.db.insert('sara_chats',{userId:owner,role:'assistant',content:'Habari yako?',metadata:{completedAt:1}});
  const args={messageId,partIndex:0,consent:true};
  await assert.rejects(h.invoke(media.reserveSpeech,args),/Unauthorized/);
  await assert.rejects(h.invoke(media.reserveSpeech,args,bob),/not found/);
  await assert.rejects(h.invoke(media.reserveSpeech,{...args,consent:false},alice),/Consent/);
  for(const partIndex of [-1,0.5,1,Infinity,NaN]) await assert.rejects(h.invoke(media.reserveSpeech,{...args,partIndex},alice),/Invalid audio/);
  assert.deepEqual(await h.invoke(media.reserveSpeech,args,alice),{text:'Habari yako?',partCount:1});
  await h.db.patch(messageId,{metadata:{}}); await assert.rejects(h.invoke(media.reserveSpeech,args,alice),/finish/);
  await h.db.patch(messageId,{metadata:{completedAt:1,failureCode:'unavailable'}}); await assert.rejects(h.invoke(media.reserveSpeech,args,alice),/finish/);
  await h.db.patch(messageId,{role:'user',metadata:{completedAt:1}}); await assert.rejects(h.invoke(media.reserveSpeech,args,alice),/not found/);
});
test('deleted conversation, deleted account and repeated generation fail closed',async()=>{
  const h=harness(),alice=await h.user(),bob=await h.user(); const owner=(await h.db.get(alice)).clerkId;
  const conversationId=await h.db.insert('sara_conversations',{userId:(await h.db.get(bob)).clerkId,title:'Other'});
  const messageId=await h.db.insert('sara_chats',{userId:owner,conversationId,role:'assistant',content:'Hello',metadata:{completedAt:1}});
  const args={messageId,partIndex:0,consent:true};
  await assert.rejects(h.invoke(media.reserveSpeech,args,alice),/Conversation not found/);
  await h.db.patch(conversationId,{userId:owner});
  for(let i=0;i<20;i++)await h.invoke(media.reserveSpeech,args,alice);
  await assert.rejects(h.invoke(media.reserveSpeech,args,alice),/Too many|rate|try again/i);
  await h.db.patch(alice,{isDeleted:true});await assert.rejects(h.invoke(media.reserveSpeech,args,alice),/Unauthorized/);
});
test('SSE reassembles independently padded deltas across arbitrary network boundaries and reconciles usage',async()=>{
  for(const width of [1,7,13,10000]){
    const result=await readSpeechStream(stream(delta('a')+delta('bc')+done,width));
    assert.equal(Buffer.from(result.audioBase64,'base64').toString(),'abc');assert.equal(result.usage.output_tokens,101);
  }
  assert.equal(pricing.costMicroUsd('gpt-4o-mini-tts',14,101),1221);
  assert.ok(pricing.quoteMicroUsd('gpt-4o-mini-tts',{text:'Habari'},16384)>190000);
});
test('truncated, empty, oversized, malformed and missing-usage responses never return playable audio',async()=>{
  for(const data of [delta('a'),done,delta('a')+event({type:'error',message:'bad'}),delta('a')+event({type:'speech.audio.done',usage:{input_tokens:1,output_tokens:-1}}),delta('a')+done+delta('b')]) await assert.rejects(readSpeechStream(stream(data)));
  await assert.rejects(readSpeechStream(stream(delta(Buffer.alloc(1024*1024+1))+done,65536)),/limit|large/);
});

test('action review cards never leak identifiers or JSON into spoken answers',()=>{
 assert.equal(speechParts('Review your request below. ::ACTION_CARD:{"id":"private-draft-id"}::').join(' '),'Review your request below.');
});
