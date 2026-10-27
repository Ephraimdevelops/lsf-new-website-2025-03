import test from 'node:test';import assert from 'node:assert/strict';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
const {replayPendingActions}=loadHandlerModule('mobile/src/replayPendingActions.ts');
const cases=loadHandlerModule('convex/caseManagement.ts');
test('replay sends oldest first and stops at the first uncertain delivery',async()=>{
 const sent=[],acknowledged=[],failures=[];
 await assert.rejects(replayPendingActions([{id:'later',createdAt:2},{id:'first',createdAt:1}],{active:()=>true,send:async action=>{sent.push(action.id);throw new Error('Network timeout');},acknowledge:async id=>acknowledged.push(id),failed:async id=>failures.push(id)}),/timeout/);
 assert.deepEqual(sent,['first']);assert.deepEqual(acknowledged,[]);assert.deepEqual(failures,['first']);
});
test('navigation/account cancellation leaves unsent items and unacknowledged successes for idempotent recovery',async()=>{
 let active=true;const sent=[],removed=[];
 const result=await replayPendingActions([{id:'first',createdAt:1},{id:'next',createdAt:2}],{active:()=>active,send:async action=>{sent.push(action.id);active=false;},acknowledge:async id=>removed.push(id),failed:async()=>{}});
 assert.equal(result,0);assert.deepEqual(sent,['first']);assert.deepEqual(removed,[]);
});
test('lost acknowledgement followed by retry does not duplicate a real registered case message',async()=>{
 const h=harness(),owner=await h.user(),caseId=await h.db.insert('cases',{beneficiaryId:owner,status:'assigned'});
 await h.db.insert('case_conversations',{caseId,status:'active'});
 const action={id:'retry-1',createdAt:1,caseId,body:'TEST ONLY — offline retry message.',clientMessageId:'stable-message-id'};
 const send=message=>h.invoke(cases.sendMessage,{caseId:message.caseId,body:message.body,clientMessageId:message.clientMessageId},owner);
 await assert.rejects(replayPendingActions([action],{active:()=>true,send,acknowledge:async()=>{throw new Error('Secure storage unavailable');},failed:async()=>{}}),/storage/);
 assert.equal((await h.db.query('case_messages').collect()).length,1);
 const removed=[];await replayPendingActions([action],{active:()=>true,send,acknowledge:async id=>removed.push(id),failed:async()=>{}});
 assert.equal((await h.db.query('case_messages').collect()).length,1);assert.deepEqual(removed,['retry-1']);
});
test('permission failures retain the action and prevent later work from being transmitted',async()=>{
 const h=harness(),owner=await h.user(),other=await h.user(),caseId=await h.db.insert('cases',{beneficiaryId:other,status:'assigned'});let removed=0,failed=0;
 await assert.rejects(replayPendingActions([{id:'one',createdAt:1},{id:'two',createdAt:2}],{active:()=>true,send:()=>h.invoke(cases.sendMessage,{caseId,body:'TEST ONLY — cannot send.',clientMessageId:'retry'},owner),acknowledge:async()=>removed++,failed:async()=>failed++}),/access|Forbidden/i);
 assert.equal(removed,0);assert.equal(failed,1);assert.equal((await h.db.query('case_messages').collect()).length,0);
});

const {uploadWithDeadline}=loadHandlerModule('mobile/src/intake/uploadDeadline.ts');
test('a stalled native upload is cancelled and releases its caller for retry',async()=>{
 let cancelled=0;
 await assert.rejects(uploadWithDeadline({uploadAsync:()=>new Promise(()=>{}),cancelAsync:async()=>{cancelled++;}},5),/timed out/);
 assert.equal(cancelled,1);
});
test('successful uploads and immediate upload failures do not trigger late cancellation',async()=>{
 let cancelled=0;
 assert.equal(await uploadWithDeadline({uploadAsync:async()=> 'confirmed-storage-id',cancelAsync:async()=>{cancelled++;}},5),'confirmed-storage-id');
 await assert.rejects(uploadWithDeadline({uploadAsync:async()=>{throw new Error('device file missing');},cancelAsync:async()=>{cancelled++;}},5),/file missing/);
 await new Promise(resolve=>setTimeout(resolve,10));assert.equal(cancelled,0);
});
