import test from 'node:test';
import assert from 'node:assert/strict';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
const cases=loadHandlerModule('convex/caseManagement.ts');const referrals=loadHandlerModule('convex/referrals.ts');const directory=loadHandlerModule('convex/justiceServices.ts');
async function fixture() {
 const h=harness();const provider=await h.user('provider_staff');const other=await h.user('provider_staff');const beneficiary=await h.user();
 // These acceptance tests exercise lifecycle transitions with explicitly declared capacity.
 await h.db.insert('paralegal_applications',{email:(await h.db.get(provider)).email,availabilityStatus:'accepting_cases',weeklyCapacity:2});
 const org=await h.db.insert('justice_service_organizations',{name:'Test organisation',verificationStatus:'verified'});const foreign=await h.db.insert('justice_service_organizations',{name:'Other organisation',verificationStatus:'verified'});
 await h.db.insert('role_assignments',{userId:provider,organizationId:org,role:'provider_staff',status:'active'});await h.db.insert('role_assignments',{userId:other,organizationId:foreign,role:'provider_staff',status:'active'});
 const service=await h.db.insert('justice_services',{name:'Test service',organizationId:org,active:true,verificationStatus:'verified',visibility:'public',currentIntakeState:'open',capacity:5});const caseId=await h.db.insert('cases',{beneficiaryId:beneficiary,publicId:'TEST-CASE',status:'referred',summary:'Fictional example'});const consent=await h.db.insert('consents',{granted:true});const referral=await h.db.insert('referrals',{caseId,beneficiaryId:beneficiary,destinationUserId:provider,destinationServiceId:service,consentId:consent,status:'created',updatedAt:20});
 return {h,provider,other,beneficiary,org,foreign,service,caseId,consent,referral};
}
test('provider referral response rejects stale decisions and foreign destination staff',async()=>{
 const s=await fixture();await assert.rejects(s.h.invoke(referrals.respondAsDestination,{referralId:s.referral,status:'accepted',expectedUpdatedAt:19},s.provider),/changed/);await assert.rejects(s.h.invoke(referrals.respondAsDestination,{referralId:s.referral,status:'accepted'},s.other),/access denied/);
 await s.h.invoke(referrals.respondAsDestination,{referralId:s.referral,status:'accepted',expectedUpdatedAt:20},s.provider);assert.equal((await s.h.db.get(s.referral)).status,'accepted');assert.equal((await s.h.db.query('case_participants').collect()).length,0);
});
test('onward referrals stay in the provider queue and can be closed with their history retained',async()=>{
 const s=await fixture();await s.h.db.patch(s.referral,{status:'referred_onward'});assert.ok((await s.h.invoke(referrals.myDestinationQueue,{},s.provider)).some(item=>item.referral._id===s.referral));await s.h.invoke(referrals.respondAsDestination,{referralId:s.referral,status:'closed',finalDisposition:'Fictional onward handoff completed.',note:'Fictional onward handoff completed.'},s.provider);assert.equal((await s.h.invoke(referrals.getForDestination,{referralId:s.referral},s.provider)).referral.status,'closed');
});
test('organisation correction history contains only the current provider requests and omits internal review metadata',async()=>{
 const s=await fixture();const own=await s.h.db.insert('directory_correction_requests',{organizationId:s.org,serviceId:s.service,requestedBy:s.provider,status:'pending',submittedAt:20,proposedDetails:'Test opening hours',reviewNote:'Private review material',reviewedBy:s.other});await s.h.db.insert('directory_correction_requests',{organizationId:s.org,serviceId:s.service,requestedBy:s.other,status:'pending',submittedAt:30});const record=await s.h.invoke(directory.myOrganization,{organizationId:s.org},s.provider);assert.equal(record.corrections.length,1);assert.equal(record.corrections[0]._id,own);assert.equal(record.corrections[0].reviewNote,undefined);assert.equal(record.corrections[0].reviewedBy,undefined);await assert.rejects(s.h.invoke(directory.myOrganization,{organizationId:s.foreign},s.provider),/outside/);
});
test('losing organisation membership revokes provider referral response and service updates',async()=>{
 const s=await fixture();const role=(await s.h.db.query('role_assignments').collect()).find(row=>row.userId===s.provider);await s.h.db.patch(role._id,{status:'revoked'});assert.equal(await s.h.invoke(referrals.getForDestination,{referralId:s.referral},s.provider),null);await assert.rejects(s.h.invoke(referrals.respondAsDestination,{referralId:s.referral,status:'accepted'},s.provider),/no longer active/);await assert.rejects(s.h.invoke(directory.updateOwnIntake,{serviceId:s.service,state:'limited',capacity:3},s.provider),/outside/);
});

test('accepting an outstanding provider offer preserves referral, meeting and assistance progress',async()=>{
 for(const status of ['referred','appointment_scheduled','assistance_underway']) {
  const s=await fixture();s.h.db.normalizeId=(table,id)=>String(id).startsWith(`${table}:`)?id:null;await s.h.db.patch(s.caseId,{status,version:2});const id=await s.h.db.insert('case_assignments',{caseId:s.caseId,assigneeId:s.provider,assigneeRole:'provider_staff',organizationId:s.org,offeredBy:s.other,status:'offered',offeredAt:Date.now(),expiresAt:Date.now()+86400000});
  await s.h.invoke(cases.respondToAssignment,{assignmentId:id,response:'accepted'},s.provider);assert.equal((await s.h.db.get(s.caseId)).status,status);assert.equal((await s.h.db.get(s.caseId)).version,3);assert.equal((await s.h.db.query('case_participants').collect())[0].userId,s.provider);
 }
});
test('an outstanding offer cannot reopen a closed case or grant a participant link',async()=>{
 const s=await fixture();s.h.db.normalizeId=(table,id)=>String(id).startsWith(`${table}:`)?id:null;await s.h.db.patch(s.caseId,{status:'closed',version:2});const id=await s.h.db.insert('case_assignments',{caseId:s.caseId,assigneeId:s.provider,assigneeRole:'provider_staff',organizationId:s.org,offeredBy:s.other,status:'offered',offeredAt:Date.now(),expiresAt:Date.now()+86400000});await assert.rejects(s.h.invoke(cases.respondToAssignment,{assignmentId:id,response:'accepted'},s.provider),/Invalid case transition/);assert.equal((await s.h.db.query('case_participants').collect()).length,0);assert.equal((await s.h.db.get(id)).status,'offered');
});
