import test from 'node:test';
import assert from 'node:assert/strict';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
const cases=loadHandlerModule('convex/caseManagement.ts'),help=loadHandlerModule('convex/legalHelp.ts');
const {declaredCapacity}=loadHandlerModule('convex/lib/workerMatching.ts');
async function setup(){
 const h=harness(),person=await h.user(),worker=await h.user('paralegal'),staff=await h.user('staff'),outsider=await h.user();
 const u=await h.db.get(worker);
 const profile=await h.db.insert('paralegal_applications',{email:u.email,status:'approved',isVerified:true,reviewedBy:staff,idDocumentStorageId:'test:id',certificateStorageId:'test:certificate',onboardingCompleted:true,ethicsAcceptedAt:1,codeOfConductAcceptedAt:1,safeguardingTrainingCompletedAt:1,region:'Dar es Salaam',district:'Ilala',specializations:['Employment'],languages:['English'],availabilityStatus:'accepting_cases',weeklyCapacity:2});
 const draft=await h.invoke(help.saveDraft,{clientRequestId:'connected-journey-qa',locale:'en',description:'TEST ONLY — fictional unpaid salary problem.',issueCategory:'employment',region:'Dar es Salaam',district:'Ilala',safeContactMethod:'in_app',preferredLanguage:'en',desiredHelp:'TEST ONLY — understand options and receive support.',urgency:'standard'},person);
 await h.invoke(help.submit,{requestId:draft.requestId,expectedVersion:draft.version,consentVersion:'service-v1'},person);
 const created=await h.invoke(cases.createFromRequest,{requestId:draft.requestId,summary:'TEST ONLY — fictional unpaid salary case.',priority:'standard'},staff);
 return {h,person,worker,staff,outsider,profile,caseId:created.caseId};
}
test('undeclared availability and capacity remain unknown, not invented',()=>{
 assert.deepEqual(declaredCapacity(null,0),{availabilityStatus:'unknown',weeklyCapacity:null,remainingCapacity:null,canOffer:false});
 assert.equal(declaredCapacity({availabilityStatus:'accepting_cases'},0).canOffer,false);
 assert.equal(declaredCapacity({availabilityStatus:'accepting_cases',weeklyCapacity:0},0).canOffer,false);
 assert.equal(declaredCapacity({availabilityStatus:'limited',weeklyCapacity:2},1).canOffer,true);
});
test('LSF recommendations share proximity rules, protect location and reject unauthorised access',async()=>{
 const s=await setup();const now=Date.now();const loc=await s.h.db.insert('paralegal_locations',{userId:s.worker,latitude:-6.81,longitude:39.21,capturedAt:now,expiresAt:now+300000});
 await assert.rejects(s.h.invoke(cases.providerRecommendations,{caseId:s.caseId},s.outsider),/access|Forbidden|workers/i);
 const result=await s.h.invoke(cases.providerRecommendations,{caseId:s.caseId,origin:{latitude:-6.81,longitude:39.21},radiusKm:5},s.staff);
 assert.equal(result[0].distanceSource,'current_location');assert.equal(result[0].distanceKm,0);assert.equal(result[0].canOffer,true);assert.equal('latitude' in result[0],false);assert.equal('longitude' in result[0],false);
 assert.equal('origin' in await s.h.db.get(s.caseId),false);
 await s.h.db.patch(loc,{expiresAt:now-1});const expired=await s.h.invoke(cases.providerRecommendations,{caseId:s.caseId,origin:{latitude:-6.81,longitude:39.21},radiusKm:5},s.staff);assert.equal(expired.length,0);
});
test('unknown/full availability is enforced on offers and acceptance, with recorded exceptions',async()=>{
 const s=await setup();await s.h.db.patch(s.profile,{weeklyCapacity:undefined,availabilityStatus:undefined});
 const candidates=await s.h.invoke(cases.providerRecommendations,{caseId:s.caseId},s.staff);assert.equal(candidates[0].weeklyCapacity,null);assert.equal(candidates[0].availabilityStatus,'unknown');assert.equal(candidates[0].canOffer,false);
 await assert.rejects(s.h.invoke(cases.offerAssignment,{caseId:s.caseId,assigneeId:s.worker},s.staff),/unknown|capacity/i);
 await assert.rejects(s.h.invoke(cases.offerAssignment,{caseId:s.caseId,assigneeId:s.worker,availabilityOverrideReason:'ok'},s.staff),/10 characters/);
 const id=await s.h.invoke(cases.offerAssignment,{caseId:s.caseId,assigneeId:s.worker,availabilityOverrideReason:'TEST ONLY — confirmed worker capacity directly.'},s.staff);
 assert.match((await s.h.db.get(id)).availabilityOverrideReason,/confirmed/);
 await s.h.invoke(cases.respondToAssignment,{assignmentId:id,response:'accepted'},s.worker);
 assert.equal((await s.h.db.get(id)).status,'accepted');
});
test('connected beneficiary request reaches worker acceptance, appointment, outcome, feedback and closure',async()=>{
 const s=await setup();const id=await s.h.invoke(cases.offerAssignment,{caseId:s.caseId,assigneeId:s.worker},s.staff);
 await assert.rejects(s.h.invoke(cases.getCase,{caseId:s.caseId},s.worker),/access|Forbidden/i);
 await s.h.invoke(cases.respondToAssignment,{assignmentId:id,response:'accepted'},s.worker);
 assert.equal((await s.h.invoke(cases.getCase,{caseId:s.caseId},s.person)).case.status,'assigned');
 const appointment=await s.h.invoke(cases.scheduleAppointment,{caseId:s.caseId,startsAt:Date.now()+86400000,mode:'phone'},s.worker);
 await s.h.invoke(cases.updateAppointmentStatus,{appointmentId:appointment.appointmentId??appointment,status:'completed',statusNote:'TEST ONLY — discussed agreed options.'},s.worker);
 let detail=await s.h.invoke(cases.getCase,{caseId:s.caseId},s.worker);
 if(detail.case.status!=='assistance_underway')await s.h.invoke(cases.updateStatus,{caseId:s.caseId,status:'assistance_underway',expectedVersion:detail.case.version},s.worker);
 await s.h.invoke(cases.recordOutcome,{caseId:s.caseId,outcomeCode:'other',resolution:'resolved',summary:'TEST ONLY — fictional support completed and next steps explained.'},s.worker);
 await s.h.invoke(cases.submitFeedback,{caseId:s.caseId,rating:5,comment:'TEST ONLY — clear next steps.'},s.person);
 detail=await s.h.invoke(cases.getCase,{caseId:s.caseId},s.worker);assert.equal(detail.closureReadiness.canClose,true);
 await s.h.invoke(cases.updateStatus,{caseId:s.caseId,status:'closed',expectedVersion:detail.case.version},s.worker);
 assert.equal((await s.h.invoke(cases.getCase,{caseId:s.caseId},s.person)).case.status,'closed');
 await assert.rejects(s.h.invoke(cases.getCase,{caseId:s.caseId},s.outsider),/access|Forbidden/i);
});

test('capacity changes between offer and acceptance are rechecked before case access',async()=>{
 const s=await setup();const id=await s.h.invoke(cases.offerAssignment,{caseId:s.caseId,assigneeId:s.worker},s.staff);
 await s.h.db.patch(s.profile,{weeklyCapacity:0});
 await assert.rejects(s.h.invoke(cases.respondToAssignment,{assignmentId:id,response:'accepted'},s.worker),/capacity/i);
 assert.equal((await s.h.db.get(id)).status,'offered');
 await assert.rejects(s.h.invoke(cases.getCase,{caseId:s.caseId},s.worker),/access|Forbidden/i);
});
