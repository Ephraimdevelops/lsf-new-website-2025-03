import test from 'node:test';
import assert from 'node:assert/strict';
import { getFunctionName } from 'convex/server';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
const drafts=loadHandlerModule('convex/saadaActionDrafts.ts');
const confirm=loadHandlerModule('convex/saadaActionConfirm.ts').confirm;
const referrals=loadHandlerModule('convex/referrals.ts');
const cases=loadHandlerModule('convex/caseManagement.ts');
async function fixture(role='user') {
 const h=harness(),owner=await h.user(role),other=await h.user();
 const c=await h.db.insert('cases',{publicId:'HY-CASE-1',beneficiaryId:role==='user'?owner:other,status:'assigned'});
 const u=await h.db.get(owner);const message=await h.db.insert('sara_chats',{role:'assistant',userId:u.clerkId,metadata:{completedAt:Date.now()}});
 const args={assistantMessageId:message,caseReference:'HY-CASE-1',kind:'appointment',preferredMode:'phone',preferredTime:'Monday afternoon',note:'Please call after lunch.'};
 const prepare=async(override={})=>h.invoke(drafts.prepare,{...args,...override},owner);
 const act=async(id,actor=owner,after)=>confirm._handler({auth:{getUserIdentity:async()=>({subject:(await h.db.get(actor)).clerkId})},runMutation:async(ref,args)=>{
  const name=getFunctionName(ref),fn=name==='saadaActionDrafts:claim'?drafts.claim:name==='saadaActionDrafts:complete'?drafts.complete:name==='caseManagement:requestAppointment'?cases.requestAppointment:referrals.createForCase;
  const result=await h.invoke(fn,args,actor);if(after)await after(name);return result;
 }},{id,confirmed:true});
 return {...h,owner,other,c,message,prepare,act};
}
async function service(f){
 const org=await f.db.insert('justice_service_organizations',{verificationStatus:'verified',referralAgreementStatus:'active',safeguardingReady:true,dataSharingAgreementVersion:'v1'});
 const provider=await f.user('provider_staff');await f.db.insert('role_assignments',{userId:provider,role:'provider_staff',organizationId:org,status:'active'});
 const id=await f.db.insert('justice_services',{name:'Reviewed help centre',district:'Kinondoni',active:true,visibility:'public',verificationStatus:'verified',referralCapability:true,nextReviewAt:Date.now()+86400000,organizationId:org,servicePointType:'legal_aid_provider'});
 return {org,provider,id};
}
const records=(f,table)=>[...f.records.values()].filter(r=>r._id.startsWith(table+':'));
test('preparation saves only a review draft, deduplicates, and does not request an appointment',async()=>{
 const f=await fixture(),a=await f.prepare(),b=await f.prepare();assert.equal(a.id,b.id);assert.equal(records(f,'case_events').length,0);
 assert.equal((await f.invoke(drafts.get,{id:a.id},f.owner)).status,'pending');
 assert.equal(await f.invoke(drafts.get,{id:a.id},f.other),null);
 await assert.rejects(f.invoke(drafts.claim,{id:a.id,confirmed:false},f.owner),/confirm/);
 await assert.rejects(f.act(a.id,f.other),/unavailable/);
});
test('chat ownership, completed response, accessible case and active account are enforced',async()=>{
 const f=await fixture();await assert.rejects(f.invoke(drafts.prepare,{assistantMessageId:f.message,caseReference:'HY-CASE-1',kind:'appointment'},f.other),/unavailable/);
 const {id}=await f.prepare();await f.db.patch(f.message,{metadata:{}});assert.equal(await f.invoke(drafts.get,{id},f.owner),null);await assert.rejects(f.act(id),/unavailable/);
 await f.db.patch(f.message,{metadata:{completedAt:Date.now()}});await f.db.patch(f.c,{beneficiaryId:f.other});assert.equal(await f.invoke(drafts.get,{id},f.owner),null);await assert.rejects(f.act(id));
 await f.db.patch(f.c,{beneficiaryId:f.owner});await f.db.patch(f.owner,{isDeleted:true});await assert.rejects(f.act(id),/Unauthorized/);
});
test('expired, cancelled and closed-case drafts cannot execute',async()=>{
 const f=await fixture(),a=await f.prepare();await f.db.patch(a.id,{expiresAt:Date.now()-1});await assert.rejects(f.act(a.id),/expired/);
 const b=await f.prepare();await f.invoke(drafts.cancel,{id:b.id},f.owner);await assert.rejects(f.act(b.id),/cancelled/);
 const c=await f.prepare();await f.db.patch(f.c,{status:'resolved'});await assert.rejects(f.act(c.id),/closed/);assert.equal(records(f,'case_events').length,0);
});
test('explicit confirmation requests, does not schedule, and repeated confirmations are idempotent',async()=>{
 const f=await fixture(),{id}=await f.prepare();const result=await f.act(id);assert.equal(result.status,'appointment_requested');assert.deepEqual(await f.act(id),result);
 assert.equal(records(f,'case_events').filter(r=>r.type==='appointment_requested').length,1);assert.equal(records(f,'appointments').length,0);
 assert.equal((await f.invoke(drafts.get,{id},f.owner)).status,'submitted');
});
test('retry after downstream success but before receipt persistence does not duplicate the request',async()=>{
 const f=await fixture(),{id}=await f.prepare();await assert.rejects(f.act(id,f.owner,async name=>{if(name==='caseManagement:requestAppointment')throw Error('connection interrupted');}),/interrupted/);
 assert.equal((await f.db.get(id)).status,'confirming');assert.equal((await f.act(id)).status,'appointment_requested');assert.equal(records(f,'case_events').filter(r=>r.type==='appointment_requested').length,1);
});
test('beneficiary cannot use worker referral tools or approve a referral draft',async()=>{
 const f=await fixture(),s=await service(f);await assert.rejects(f.invoke(drafts.referralOptions,{caseReference:'HY-CASE-1'},f.owner),/worker/);
 await assert.rejects(f.prepare({kind:'referral',destinationServiceId:s.id,destinationUserId:s.provider,reason:'Please offer legal support.',information:'Issue summary only.'}),/worker/);
});
test('verified public destination and active matching provider produce a consent request only',async()=>{
 const f=await fixture('admin'),s=await service(f);const options=await f.invoke(drafts.referralOptions,{caseReference:'HY-CASE-1',serviceId:s.id},f.owner);assert.equal(options.providers[0].id,s.provider);
 const {id}=await f.prepare({kind:'referral',destinationServiceId:s.id,destinationUserId:s.provider,reason:'Please offer legal support.',information:'Issue summary only.'});
 const receipt=await f.act(id);assert.equal(receipt.status,'awaiting_beneficiary_consent');assert.deepEqual(await f.act(id),receipt);assert.equal(records(f,'referrals').length,1);
 assert.equal(records(f,'consents')[0].granted,false);assert.match(records(f,'consents')[0].statement,/No consent/);
 assert.equal(records(f,'notifications').some(n=>n.userId===s.provider),false);
});
test('private, safe-house, overdue, unverified and synthetic destinations cannot be selected',async()=>{
 for(const patch of [{visibility:'private'},{servicePointType:'safe_house'},{nextReviewAt:Date.now()-1},{verificationStatus:'draft'},{syntheticDevelopmentFixture:true}]){
  const f=await fixture('admin'),s=await service(f);await f.db.patch(s.id,patch);
  const opts=await f.invoke(drafts.referralOptions,{caseReference:'HY-CASE-1'},f.owner);assert.equal(opts.services.length,0);
  await assert.rejects(f.prepare({kind:'referral',destinationServiceId:s.id,destinationUserId:s.provider,reason:'Please offer legal support.',information:'Issue summary only.'}));
 }
});
test('revoked organisation readiness and provider membership are rechecked at confirmation',async()=>{
 for(const orgPatch of [{referralAgreementStatus:'suspended'},{safeguardingReady:false},{dataSharingAgreementVersion:''}]){
  const f=await fixture('admin'),s=await service(f),{id}=await f.prepare({kind:'referral',destinationServiceId:s.id,destinationUserId:s.provider,reason:'Please offer legal support.',information:'Issue summary only.'});await f.db.patch(s.org,orgPatch);await assert.rejects(f.act(id),/cannot receive/);assert.equal(records(f,'referrals').length,0);
 }
 const f=await fixture('admin'),s=await service(f),{id}=await f.prepare({kind:'referral',destinationServiceId:s.id,destinationUserId:s.provider,reason:'Please offer legal support.',information:'Issue summary only.'});await f.db.patch(s.provider,{isDeleted:true});await assert.rejects(f.act(id),/provider/);
});
test('commit transaction rejects a destination revoked after claim, before creation',async()=>{
 const f=await fixture('admin'),s=await service(f),{id}=await f.prepare({kind:'referral',destinationServiceId:s.id,destinationUserId:s.provider,reason:'Please offer legal support.',information:'Issue summary only.'});
 await assert.rejects(f.act(id,f.owner,async name=>{if(name==='saadaActionDrafts:claim')await f.db.patch(s.org,{referralAgreementStatus:'suspended'});}),/no longer ready/);assert.equal(records(f,'referrals').length,0);
});
test('referral retry with a changed payload is rejected',async()=>{
 const f=await fixture('admin'),s=await service(f),{id}=await f.prepare({kind:'referral',destinationServiceId:s.id,destinationUserId:s.provider,reason:'Please offer legal support.',information:'Issue summary only.'});await f.act(id);
 await assert.rejects(f.invoke(referrals.createForCase,{caseId:f.c,clientActionId:`saada:${id}`,destinationServiceId:s.id,destinationUserId:s.provider,reason:'Different requested reason',informationShared:['Issue summary only.']},f.owner),/must match/);assert.equal(records(f,'referrals').length,1);
});
test('cleanup removes aged drafts even when newer confirming requests remain',async()=>{
 const f=await fixture();const now=Date.now();for(let n=0;n<30;n++)await f.db.insert('saada_action_drafts',{status:'confirming',createdAt:now-2*86400000});
 const old=await f.db.insert('saada_action_drafts',{status:'pending',createdAt:now-2*86400000});assert.equal(await f.invoke(drafts.purge),1);assert.equal(await f.db.get(old),null);assert.equal(records(f,'saada_action_drafts').length,30);
});

test('recipient lookup works for an eligible selected service beyond the first twenty results',async()=>{
 const f=await fixture('admin');for(let n=0;n<22;n++)await service(f);const selected=await service(f);
 const result=await f.invoke(drafts.referralOptions,{caseReference:'HY-CASE-1',serviceId:selected.id},f.owner);assert.equal(result.providers[0].id,selected.provider);assert.equal(result.services.length,20);assert.equal(result.moreResultsPossible,true);
});
test('district searches preserve the requested location and exclude private matches',async()=>{
 const f=await fixture('admin'),a=await service(f),b=await service(f);await f.db.patch(b.id,{district:'Ilala'});
 const result=await f.invoke(drafts.referralOptions,{caseReference:'HY-CASE-1',district:'Kinondoni'},f.owner);assert.deepEqual(result.services.map(s=>s.id),[a.id]);
 await f.db.patch(a.id,{visibility:'restricted'});assert.equal((await f.invoke(drafts.referralOptions,{caseReference:'HY-CASE-1',district:'Kinondoni'},f.owner)).services.length,0);
});
