import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {inboundMessages,validMetaSignature} from '../convex/lib/metaMessaging.ts';
const wa=(overrides={})=>({object:'whatsapp_business_account',entry:[{changes:[{value:{metadata:{phone_number_id:'business'},messages:[{id:'m1',from:'sender',type:'text',timestamp:String(Math.floor(Date.now()/1000)),text:{body:'hello'},...overrides}]}}]}]});
test('only authenticated body bytes pass HMAC verification',async()=>{const raw=JSON.stringify(wa());const sig='sha256='+createHmac('sha256','secret').update(raw).digest('hex');assert.equal(await validMetaSignature('secret',raw,sig),true);assert.equal(await validMetaSignature('secret',raw+' ',sig),false);assert.equal(await validMetaSignature('',raw,sig),false);assert.equal(await validMetaSignature('secret',raw,'sha256=bad'),false);});
test('only allowlisted WhatsApp account is ingested',()=>{assert.equal(inboundMessages(wa(),{whatsapp:'business'}).length,1);assert.equal(inboundMessages(wa(),{whatsapp:'other'}).length,0);});
test('old events and attachments never create AI input',()=>{assert.equal(inboundMessages(wa({timestamp:'1'}),{whatsapp:'business'}).length,0);assert.equal(inboundMessages(wa({type:'image'}),{whatsapp:'business'}).length,0);});
test('oversized text is excluded',()=>assert.equal(inboundMessages(wa({text:{body:'x'.repeat(4001)}}),{whatsapp:'business'}).length,0));
test('Messenger echo and wrong account cannot loop',()=>{const b={object:'page',entry:[{id:'page',messaging:[{timestamp:Date.now(),sender:{id:'sender'},message:{mid:'mid',text:'hello',is_echo:true}}]}]};assert.equal(inboundMessages(b,{messenger:'page'}).length,0);b.entry[0].messaging[0].message.is_echo=false;assert.equal(inboundMessages(b,{messenger:'page'}).length,1);assert.equal(inboundMessages(b,{messenger:'other'}).length,0);});
test('Instagram sender cannot become an app account identity',()=>{const b={object:'instagram',entry:[{id:'ig',messaging:[{timestamp:Date.now(),sender:{id:'ig'},message:{mid:'mid',text:'hello'}}]}]};assert.equal(inboundMessages(b,{instagram:'ig'}).length,0);});

test('voice notes are recorded as attachments without trusting or downloading their URLs',()=>{const rows=inboundMessages(wa({type:'audio',audio:{id:'media',url:'http://127.0.0.1/private'}}),{whatsapp:'business'});assert.equal(rows.length,1);assert.equal(rows[0].inputType,'audio');assert.doesNotMatch(JSON.stringify(rows),/127.0.0.1|private/);});
test('Messenger voice notes are detectable and echoes stay excluded',()=>{const body={object:'page',entry:[{id:'page',messaging:[{timestamp:Date.now(),sender:{id:'sender'},message:{mid:'voice-mid',attachments:[{type:'audio',payload:{url:'https://example.com/voice'}}]}}]}]};assert.equal(inboundMessages(body,{messenger:'page'})[0].inputType,'audio');body.entry[0].messaging[0].message.is_echo=true;assert.equal(inboundMessages(body,{messenger:'page'}).length,0);});

test('a voice note is acknowledged without being sent to an AI drafting action',async()=>{
 const {harness,loadHandlerModule}=await import('./test-support/convex-handler-harness.mjs');
 const h=harness();const handlers=loadHandlerModule('convex/socialMessaging.ts');
 await h.invoke(handlers.receive,{channel:'messenger',account:'page',sender:'person',eventId:'voice-event',text:'[Voice note received — not transcribed]',inputType:'audio',sentAt:Date.now()});
 const rows=await h.db.query('social_messages').collect();assert.equal(rows.length,1);assert.equal(rows[0].status,'approved');assert.match(rows[0].approvedText,/transcription is not available/);assert.equal(rows[0].inputType,'audio');
 assert.equal((await h.db.query('social_conversations').collect())[0].humanMode,false);
});

test('Instagram Unified Login uses the documented host and unsupported auth modes fail closed',async()=>{
 const {metaMessagingHost}=await import('../convex/lib/metaMessaging.ts');
 assert.equal(metaMessagingHost('instagram','unified'),'graph.facebook.com');assert.equal(metaMessagingHost('instagram','instagram_login'),'graph.instagram.com');assert.equal(metaMessagingHost('messenger','unified'),'graph.facebook.com');assert.throws(()=>metaMessagingHost('instagram','https://untrusted.example'),/Unsupported/);
});
