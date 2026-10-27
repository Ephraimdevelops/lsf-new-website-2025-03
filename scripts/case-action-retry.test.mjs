import test from 'node:test';
import assert from 'node:assert/strict';
import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const cases=loadHandlerModule('convex/caseManagement.ts');
async function setup(){const h=harness();const person=await h.user();const stranger=await h.user();const caseId=await h.db.insert('cases',{beneficiaryId:person,status:'assistance_underway',version:1});return {h,person,stranger,caseId};}
test('appointment replay creates one event and no additional quota charge, even after closure',async()=>{
 const s=await setup();const args={caseId:s.caseId,clientActionId:'offline-appointment-1',preferredMode:'phone',preferredTime:'Next week',note:'Synthetic test.'};
 const id=await s.h.invoke(cases.requestAppointment,args,s.person);await s.h.db.patch(s.caseId,{status:'closed'});
 assert.equal(await s.h.invoke(cases.requestAppointment,args,s.person),id);
 assert.equal((await s.h.db.query('case_events').collect()).filter(e=>e.type==='appointment_requested').length,1);
 assert.equal((await s.h.db.query('rate_limits').collect())[0].count,1);
 await assert.rejects(s.h.invoke(cases.requestAppointment,{...args,note:'Changed payload'},s.person),/retry must match/);
 await assert.rejects(s.h.invoke(cases.requestAppointment,args,s.stranger),/access denied/);
});
test('review replay cannot recreate an already resolved request or notify twice',async()=>{
 const s=await setup();const args={caseId:s.caseId,clientActionId:'offline-review-1',reason:'service_concern',note:'Synthetic concern.'};
 const id=await s.h.invoke(cases.requestCaseReview,args,s.person);await s.h.db.patch(id,{status:'resolved'});await s.h.db.patch(s.caseId,{status:'closed'});
 assert.equal(await s.h.invoke(cases.requestCaseReview,args,s.person),id);
 assert.equal((await s.h.db.query('case_review_requests').collect()).length,1);
 assert.equal((await s.h.db.query('case_events').collect()).filter(e=>e.type==='case_review_requested').length,1);
 await assert.rejects(s.h.invoke(cases.requestCaseReview,{...args,reason:'reassignment'},s.person),/retry must match/);
});
test('new review concern is not silently swallowed by another open request',async()=>{
 const s=await setup();await s.h.invoke(cases.requestCaseReview,{caseId:s.caseId,clientActionId:'first',reason:'service_concern',note:'Synthetic concern.'},s.person);
 await assert.rejects(s.h.invoke(cases.requestCaseReview,{caseId:s.caseId,clientActionId:'second',reason:'safety_concern',note:'Different synthetic concern.'},s.person),/already open/);
 assert.equal((await s.h.db.query('case_review_requests').collect()).length,1);
});
