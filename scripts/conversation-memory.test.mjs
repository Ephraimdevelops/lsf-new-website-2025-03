import test from 'node:test';import assert from 'node:assert/strict';import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const memory=loadHandlerModule('convex/conversationMemory.ts'),chat=loadHandlerModule('convex/sara_chat.ts'),social=loadHandlerModule('convex/socialMessaging.ts');
test('only the owner can edit named-chat facts; invented model memories are rejected',async()=>{
 const h=harness(),alice=await h.user(),bob=await h.user(),user=await h.db.get(alice),c=await h.db.insert('sara_conversations',{userId:user.clerkId,title:'Own',updatedAt:Date.now()});
 await h.invoke(memory.update,{conversationId:c,facts:{name:'Asha',location:'Kinondoni'}},alice);assert.equal((await h.invoke(memory.get,{conversationId:c},alice)).facts.name,'Asha');await assert.rejects(h.invoke(memory.get,{conversationId:c},bob),/not found/);await assert.rejects(h.invoke(memory.update,{conversationId:c,facts:{name:'Changed'}},bob),/not found/);
 await assert.rejects(h.invoke(memory.rememberApp,{conversationId:c,field:'location',value:'Ilala',currentMessage:'Niko Kinondoni'},alice),/supplied/);await h.invoke(memory.rememberApp,{conversationId:c,field:'location',value:'Ilala',currentMessage:'Nimehamia Ilala'},alice);assert.equal((await h.invoke(memory.get,{conversationId:c},alice)).facts.location,'Ilala');
});
test('forgetting blocks earlier context from normal and archive retrieval, not just the summary',async()=>{
 const h=harness(),alice=await h.user(),owner=(await h.db.get(alice)).clerkId,c=await h.db.insert('sara_conversations',{userId:owner,title:'Own',updatedAt:Date.now()});
 await h.db.insert('sara_chats',{userId:owner,conversationId:c,role:'user',content:'My old details',timestamp:Date.now()-10000});await h.invoke(memory.update,{conversationId:c,facts:{name:'Asha'}},alice);await h.invoke(memory.clear,{conversationId:c},alice);
 assert.equal((await h.invoke(memory.get,{conversationId:c},alice)).facts.name,undefined);assert.equal((await h.invoke(chat.getRecentHistoryInternal,{userId:owner,conversationId:c},alice)).length,0);assert.equal((await h.invoke(chat.recallHistoryInternal,{userId:owner,conversationId:c},alice)).length,0);
 await h.invoke(chat.deleteConversation,{conversationId:c},alice);assert.equal((await h.db.query('conversation_context').collect()).length,0);
});
test('social memory is scoped and cannot store an unprovided fact or clear without a request',async()=>{
 const h=harness(),c=await h.db.insert('social_conversations',{channel:'whatsapp',account:'office',sender:'person',humanMode:false,consent:true,updatedAt:Date.now()}),id=await h.db.insert('social_messages',{channel:'whatsapp',account:'office',sender:'person',text:'Naitwa Asha. Niko Kinondoni.',eventId:'event',sentAt:Date.now(),status:'drafting'});
 await h.invoke(memory.rememberSocial,{id,field:'name',value:'Asha'});assert.equal((await h.invoke(memory.socialInternal,{id})).facts.name,'Asha');await assert.rejects(h.invoke(memory.rememberSocial,{id,field:'location',value:'Ilala'}),/supplied/);await assert.rejects(h.invoke(memory.forgetSocial,{id}),/explicit/);
 await h.db.patch(id,{text:'Futa kumbukumbu zangu'});await h.invoke(memory.forgetSocial,{id});assert.deepEqual(Object.keys((await h.invoke(memory.socialInternal,{id})).facts),[]);await h.db.patch(c,{consent:false});await assert.rejects(h.invoke(memory.socialInternal,{id}),/consent/);
});
