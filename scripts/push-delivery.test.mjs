import test from 'node:test';
import assert from 'node:assert/strict';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
import { getFunctionName } from 'convex/server';
const notifications=loadHandlerModule('convex/notifications.ts');
const {notificationTapKey}=loadHandlerModule('mobile/src/notificationTap.ts');
async function fixture(){
 const h=harness(),user=await h.user(),other=await h.user();
 await h.invoke(notifications.setPushEnabled,{enabled:true},user);
 const token='ExpoPushToken[synthetic_qa-token]';
 await h.invoke(notifications.registerPushToken,{token,projectId:'test-project',platform:'ios',enabled:true},user);
 const notificationId=await h.db.insert('notifications',{userId:user,type:'message.received',createdAt:Date.now()});
 const scheduled=[];
 const ctx={runQuery:async(ref,args)=>h.invoke(notifications[getFunctionName(ref).split(':')[1]],args),runMutation:async(ref,args)=>h.invoke(notifications[getFunctionName(ref).split(':')[1]],args),scheduler:{runAfter:async(...args)=>scheduled.push(args)}};
 return {h,user,other,token,notificationId,ctx,scheduled};
}
async function withFetch(result,run){const previous=globalThis.fetch;globalThis.fetch=async(_url,options)=>{assert.ok(options.signal);return {ok:true,status:200,json:async()=>result};};try{return await run();}finally{globalThis.fetch=previous;}}
test('both Expo token prefixes register while malformed tokens are rejected',async()=>{
 const s=await fixture();await s.h.invoke(notifications.registerPushToken,{token:'ExponentPushToken[synthetic-legacy]',enabled:true},s.user);
 for(const token of ['ExpoPushToken[]','ExpoPushToken[bad token]','https://example.test'])await assert.rejects(s.h.invoke(notifications.registerPushToken,{token,enabled:true},s.user),/Unsupported/);
});
test('empty and malformed successful HTTP responses never count as sent',async()=>{
 for(const result of [{},{data:{status:'ok'}},{data:{status:'error',details:{error:'DeviceNotRegistered'}}}]){
  const s=await fixture();const outcome=await withFetch(result,()=>notifications.deliverPushForNotification._handler(s.ctx,{notificationId:s.notificationId}));
  assert.equal(outcome.sent,0);assert.equal(outcome.failed,1);assert.equal(s.scheduled.length,0);
 }
});
test('a valid Expo ticket records acceptance and schedules receipt verification with neutral copy',async()=>{
 const s=await fixture(),previous=globalThis.fetch;
 globalThis.fetch=async(_url,options)=>{const body=JSON.parse(options.body);assert.deepEqual(body.data,{notificationId:s.notificationId});assert.doesNotMatch(JSON.stringify(body),/case summary|salary|TEST PRIVATE/);return {ok:true,status:200,json:async()=>({data:{status:'ok',id:'test-ticket'}})};};
 try {const result=await notifications.deliverPushForNotification._handler(s.ctx,{notificationId:s.notificationId});assert.equal(result.sent,1);assert.equal(s.scheduled.length,1);assert.equal(s.scheduled[0][0],15*60000);}finally{globalThis.fetch=previous;}
});
test('missing receipts are recorded as unconfirmed, never successful device delivery',async()=>{
 const s=await fixture();const tickets=[{notificationId:s.notificationId,userId:s.user,token:s.token,ticketId:'test-ticket'}];
 const result=await withFetch({data:{}},()=>notifications.checkExpoPushReceipts._handler(s.ctx,{tickets}));
 assert.equal(result.ok,0);assert.equal(result.failed,1);const attempts=await s.h.db.query('push_delivery_attempts').collect();assert.match(attempts[0].error,/unconfirmed/);
});
test('invalid provider credentials do not retire valid devices and stale receipts cannot disable a new owner token',async()=>{
 const s=await fixture();const args={notificationId:s.notificationId,userId:s.user,token:s.token,status:'failed'};
 await s.h.invoke(notifications.recordPushAttempt,{...args,error:'InvalidCredentials'});let subscription=(await s.h.db.query('push_subscriptions').collect())[0];assert.equal(subscription.enabled,true);
 await s.h.db.patch(subscription._id,{userId:s.other});await s.h.invoke(notifications.recordPushAttempt,{...args,error:'DeviceNotRegistered'});assert.equal((await s.h.db.get(subscription._id)).enabled,true);
 await s.h.invoke(notifications.recordPushAttempt,{...args,userId:s.other,error:'DeviceNotRegistered'});assert.equal((await s.h.db.get(subscription._id)).enabled,false);
});
test('in-app-only safe contact suppresses external push even when device alerts are enabled',async()=>{
 const s=await fixture();const requestId=await s.h.db.insert('legal_help_requests',{ownerId:s.user,safeContactMethod:'in_app'});await s.h.db.patch(s.notificationId,{resourceType:'legal_help_request',resourceId:requestId});
 const payload=await s.h.invoke(notifications.pushDeliveryPayload,{notificationId:s.notificationId});assert.equal(payload.skippedReason,'safe-contact-in-app-only');assert.equal(payload.subscriptions.length,0);
});
test('notification taps accept only app notification identifiers, never arbitrary URL navigation or dismissed actions',()=>{
 const response={actionIdentifier:'default',notification:{date:123,request:{identifier:'request-1',content:{data:{notificationId:'notification-1',url:'https://untrusted.example'}}}}};
 assert.equal(notificationTapKey(response,'default'),'request-1:123:notification-1');
 assert.equal(notificationTapKey({...response,actionIdentifier:'dismiss'},'default'),null);
 assert.equal(notificationTapKey({actionIdentifier:'default',notification:{request:{identifier:'x',content:{data:{url:'https://untrusted.example'}}}}},'default'),null);
});

test('referral notification resolution recognises beneficiaries even with another work role and isolates private case ids',async()=>{
 const s=await fixture();await s.h.db.patch(s.user,{role:'admin'});
 const caseId=await s.h.db.insert('cases',{beneficiaryId:s.user});
 const referral=await s.h.db.insert('referrals',{caseId,beneficiaryId:s.user,destinationUserId:s.other});
 await s.h.db.patch(s.notificationId,{resourceType:'referral',resourceId:referral});
 assert.deepEqual(await s.h.invoke(notifications.referralContext,{notificationId:s.notificationId},s.user),{beneficiaryCaseId:caseId});
 await assert.rejects(s.h.invoke(notifications.referralContext,{notificationId:s.notificationId},s.other),/access denied/);
 const otherNotification=await s.h.db.insert('notifications',{userId:s.other,resourceType:'referral',resourceId:referral});
 assert.deepEqual(await s.h.invoke(notifications.referralContext,{notificationId:otherNotification},s.other),{beneficiaryCaseId:null});
});

test('referral alerts obey beneficiary safe-contact choice and missing referral context fails closed',async()=>{
 const s=await fixture();const requestId=await s.h.db.insert('legal_help_requests',{ownerId:s.user,safeContactMethod:'in_app'});
 const caseId=await s.h.db.insert('cases',{beneficiaryId:s.user,sourceRequestId:requestId});
 const referralId=await s.h.db.insert('referrals',{beneficiaryId:s.user,caseId});
 await s.h.db.patch(s.notificationId,{type:'referral.consent_requested',resourceType:'referral',resourceId:referralId});
 let payload=await s.h.invoke(notifications.pushDeliveryPayload,{notificationId:s.notificationId});assert.equal(payload.skippedReason,'safe-contact-in-app-only');assert.equal(payload.subscriptions.length,0);
 await s.h.db.patch(referralId,{caseId:'cases:missing'});payload=await s.h.invoke(notifications.pushDeliveryPayload,{notificationId:s.notificationId});assert.equal(payload.skippedReason,'case-context-unavailable');
});
