import test from 'node:test';
import assert from 'node:assert/strict';
import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const directory=loadHandlerModule('convex/justiceServices.ts');
async function setup(){
 const h=harness(),staff=await h.user('staff'),reviewer=await h.user('admin'),beneficiary=await h.user('user'),provider=await h.user('user',['provider_staff']);
 const orgInput={name:'Fixture legal organisation',organizationType:'legal_aid_provider',verificationStatus:'draft',referralAgreementStatus:'none',safeguardingReady:false};
 const {id:org}=await h.invoke(directory.createOrganization,orgInput,staff);
 const serviceInput={name:'Fixture legal office',organizationId:org,servicePointType:'legal_aid_provider',classification:'community',visibility:'public',verificationStatus:'draft',active:false,country:'Tanzania',region:'Fixture region',district:'Fixture district',serviceCoverageRegions:['Fixture region'],issueCategories:['employment'],serviceTypes:['legal_information'],referralCapability:false,walkIn:true,appointmentRequired:false,remoteSupport:false,phoneSupport:true,phone:'+255000000000',currentIntakeState:'open',capacity:5,emergencyCapability:false,languages:['Kiswahili'],privacyAvailable:true,genderSensitive:true};
 const service=await h.invoke(directory.createService,serviceInput,staff);
 const assignment=(await h.db.query('role_assignments').collect())[0];await h.db.patch(assignment._id,{organizationId:org});
 return {h,staff,reviewer,beneficiary,provider,org,service,serviceInput};
}
async function verify(s){
 await s.h.invoke(directory.updateOrganization,{id:s.org,updates:{verificationStatus:'verified',notes:'Different reviewer confirmed this organisation.'}},s.reviewer);
 await s.h.invoke(directory.updateService,{id:s.service,decisionReason:'Reviewed contact and location with the service.',updates:{verificationStatus:'verified',active:true,source:'https://example.go.tz/office',verifyingAuthority:'Fixture reviewer',lastVerifiedAt:Date.now()-1000,nextReviewAt:Date.now()+86400000}},s.reviewer);
}
test('beneficiaries see only reviewed public services and cannot create, edit or remove them',async()=>{
 const s=await setup();assert.equal((await s.h.invoke(directory.listPublicServices)).length,0);
 await assert.rejects(s.h.invoke(directory.createService,s.serviceInput,s.beneficiary),/Forbidden/);
 await assert.rejects(s.h.invoke(directory.updateService,{id:s.service,updates:{phone:'wrong'}},s.beneficiary),/Forbidden/);
 await verify(s);const visible=await s.h.invoke(directory.listPublicServices);assert.equal(visible.length,1);assert.equal(visible[0].createdBy,undefined);assert.equal(visible[0].notes,undefined);
});
test('same person cannot verify drafts and material service edits remove public visibility until new review',async()=>{
 const s=await setup();await assert.rejects(s.h.invoke(directory.updateOrganization,{id:s.org,updates:{verificationStatus:'verified',notes:'I reviewed my own organisation.'}},s.staff),/different LSF/);
 await verify(s);
 await s.h.invoke(directory.updateService,{id:s.service,updates:{physicalLocation:'New fixture address'}},s.staff);
 assert.equal((await s.h.db.get(s.service)).verificationStatus,'expired');assert.equal((await s.h.invoke(directory.listPublicServices)).length,0);
});
test('organisation removal disables services; draft restoration does not silently republish',async()=>{
 const s=await setup();await verify(s);
 await s.h.invoke(directory.updateOrganization,{id:s.org,updates:{verificationStatus:'inactive',notes:'Remove unavailable fixture organisation.'}},s.staff);
 assert.equal((await s.h.db.get(s.service)).active,false);assert.equal((await s.h.invoke(directory.listPublicServices)).length,0);
 await s.h.invoke(directory.updateOrganization,{id:s.org,updates:{verificationStatus:'draft',notes:'Restore fixture for independent review.'}},s.staff);
 assert.equal((await s.h.db.get(s.service)).active,false);
 await assert.rejects(s.h.invoke(directory.updateOwnIntake,{serviceId:s.service,state:'open',capacity:5},s.provider),/not active and verified/);
});
test('provider staff can update their own verified intake but cannot access or change another organisation',async()=>{
 const s=await setup();await verify(s);
 await s.h.invoke(directory.updateOwnIntake,{serviceId:s.service,state:'closed',capacity:0},s.provider);
 assert.equal((await s.h.db.get(s.service)).currentIntakeState,'closed');
 const {id:otherOrg}=await s.h.invoke(directory.createOrganization,{name:'Other fixture organisation',organizationType:'cso',verificationStatus:'draft',referralAgreementStatus:'none',safeguardingReady:false},s.staff);
 const otherService=await s.h.invoke(directory.createService,{...s.serviceInput,organizationId:otherOrg,name:'Other fixture service'},s.staff);
 await assert.rejects(s.h.invoke(directory.updateOwnIntake,{serviceId:otherService,state:'open'},s.provider),/outside your organisation/);
 await assert.rejects(s.h.invoke(directory.myOrganizationMembers,{organizationId:otherOrg},s.provider),/outside your approved access/);
 await assert.rejects(s.h.invoke(directory.updateOwnIntake,{serviceId:s.service,state:'open',capacity:0},s.provider),/Select closed/);
});
test('safe-house addresses never enter public queries even with active verified flags',async()=>{
 const s=await setup();await verify(s);
 await s.h.db.insert('justice_services',{...s.serviceInput,servicePointType:'safe_house',visibility:'confidential',verificationStatus:'verified',active:true,nextReviewAt:Date.now()+86400000,physicalLocation:'Sensitive fixture location'});
 const records=await s.h.invoke(directory.listPublicServices);assert.equal(records.length,1);assert.ok(!JSON.stringify(records).includes('Sensitive fixture location'));
 await assert.rejects(s.h.invoke(directory.createService,{...s.serviceInput,servicePointType:'safe_house'},s.staff),/cannot be public/);
});

test('provider and support filters run on the server before matching limits its results',async()=>{
 const s=await setup();await verify(s);
 const {_id,_creationTime,...base}=await s.h.db.get(s.service);
 for(let index=0;index<6;index++) await s.h.db.insert('justice_services',{...base,name:`General legal office ${index}`});
 const government=await s.h.db.insert('justice_services',{...base,name:'Government labour office',servicePointType:'government_office',serviceTypes:['labour_guidance']});
 const listed=await s.h.invoke(directory.listPublicServices,{providerType:'government_office',serviceType:'labour_guidance',region:'Fixture region',district:'Fixture district',issueCategory:'employment'});
 assert.deepEqual(listed.map(item=>item._id),[government]);
 assert.equal((await s.h.invoke(directory.listPublicServices,{providerType:'government_office',serviceType:'legal_information'})).length,0);
 const matched=await s.h.invoke(directory.matchServices,{source:'directory',providerType:'government_office',serviceType:'labour_guidance',issueCategory:'employment',region:'Fixture region',district:'Fixture district',urgency:'standard'});
 assert.deepEqual(matched.recommendations.map(item=>item.service._id),[government]);
 const byOutcome=await s.h.invoke(directory.matchServices,{source:'directory',serviceType:'labour_guidance',issueCategory:'employment'});
 assert.deepEqual(byOutcome.recommendations.map(item=>item.service._id),[government]);
 const restricted=await s.h.invoke(directory.matchServices,{source:'directory',providerType:'government_office',urgency:'immediate_safety'});
 assert.equal(restricted.recommendations.length,0);
 const staffMatch=await s.h.invoke(directory.matchServices,{source:'staff',providerType:'government_office',serviceType:'labour_guidance',issueCategory:'employment'},s.staff);
 const decision=await s.h.db.get(staffMatch.decisionId);
 assert.equal(decision.providerType,'government_office');assert.equal(decision.serviceType,'labour_guidance');
});
