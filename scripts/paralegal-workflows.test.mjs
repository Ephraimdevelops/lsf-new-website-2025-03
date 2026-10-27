import test from 'node:test';
import assert from 'node:assert/strict';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
const referrals = loadHandlerModule('convex/referrals.ts');
const cases = loadHandlerModule('convex/caseManagement.ts');
async function setup() {
 const h = harness(); const provider = await h.user('paralegal'); const other = await h.user('provider_staff'); const beneficiary = await h.user();
 const org = await h.db.insert('justice_service_organizations', { verificationStatus: 'verified' });
 await h.db.insert('role_assignments', { userId: provider, organizationId: org, role: 'paralegal', status: 'active' });
 const service = await h.db.insert('justice_services', { organizationId: org, active: true, verificationStatus: 'verified', visibility: 'public', referralCapability: true });
 const caseId = await h.db.insert('cases', { beneficiaryId: beneficiary, publicId: 'QA-CASE', status: 'assigned', summary: 'Synthetic example', updatedAt: Date.now() });
 const consent = await h.db.insert('consents', { granted: true });
 const referral = await h.db.insert('referrals', { caseId, destinationUserId: provider, destinationServiceId: service, consentId: consent, status: 'closed' });
 return { h, provider, other, beneficiary, org, service, caseId, consent, referral };
}
test('destination can open completed history only with beneficiary consent', async () => {
 const s = await setup(); const args = { referralId: s.referral };
 assert.equal((await s.h.invoke(referrals.getForDestination, args, s.provider)).referral._id, s.referral);
 assert.equal(await s.h.invoke(referrals.getForDestination, args, s.other), null);
 await s.h.db.patch(s.consent, { granted: false });
 assert.equal(await s.h.invoke(referrals.getForDestination, args, s.provider), null);
 assert.deepEqual(await s.h.invoke(referrals.myDestinationQueue, { status: 'closed' }, s.provider), []);
 await assert.rejects(s.h.invoke(referrals.getForDestination, args, s.beneficiary), /Forbidden/);
});
test('blocked destination organisations cannot expose referral history', async () => {
 const s = await setup(); await s.h.db.patch(s.org, { verificationStatus: 'inactive' });
 assert.equal(await s.h.invoke(referrals.getForDestination, { referralId: s.referral }, s.provider), null);
});
test('onward provider list uses parent assignment and destination membership', async () => {
 const s = await setup(); await s.h.db.patch(s.referral, { status: 'accepted' });
 await s.h.db.insert('role_assignments', { userId: s.other, organizationId: s.org, role: 'provider_staff', status: 'active' });
 const args = { caseId: s.caseId, destinationServiceId: s.service, parentReferralId: s.referral };
 const rows = await s.h.invoke(referrals.destinationProviders, args, s.provider);
 assert.ok(rows.some(row => row._id === s.other && row.name === 'provider_staff'));
 assert.equal(rows.length, 2);
 assert.equal(rows[0].email, undefined);
 await assert.rejects(s.h.invoke(referrals.destinationProviders, args, s.other), /unavailable/);
});
test('personal and work conversations have distinct contexts for the same account', async () => {
 const s = await setup(); const personal = await s.h.db.insert('cases', { beneficiaryId: s.provider, publicId: 'QA-PERSONAL', summary: 'Private request', status: 'assigned', updatedAt: Date.now() });
 await s.h.db.insert('case_participants', { caseId: s.caseId, userId: s.provider, role: 'paralegal', scopeReviewDecision: 'independent', status: 'active' });
 const rows = await s.h.invoke(cases.myConversations, {}, s.provider);
 assert.equal(rows.find(row => row.caseId === personal).context, 'personal');
 assert.equal(rows.find(row => row.caseId === s.caseId)?.context, 'work');
});
test('closed work cases reject new appointments and initial referrals before writes', async () => {
 const s = await setup(); await s.h.db.patch(s.caseId, { status: 'closed' });
 await s.h.db.insert('case_participants', { caseId: s.caseId, userId: s.provider, role: 'paralegal', scopeReviewDecision: 'independent', status: 'active' });
 await assert.rejects(s.h.invoke(cases.scheduleAppointment, { caseId: s.caseId, startsAt: Date.now() + 86400000, mode: 'phone' }, s.provider), /closure/);
 await assert.rejects(s.h.invoke(referrals.createForCase, { caseId: s.caseId, destinationServiceId: s.service, reason: 'Synthetic reason', informationShared: ['Minimum details'] }, s.provider), /closure/);
 assert.equal((await s.h.db.query('case_appointments').collect()).length, 0);
});
test('unresolved outcomes retain the disposition and open beneficiary feedback', async () => {
 const s = await setup(); await s.h.db.patch(s.caseId, { status: 'assigned', version: 1 });
 await s.h.db.insert('case_participants', { caseId: s.caseId, userId: s.provider, role: 'paralegal', scopeReviewDecision: 'independent', status: 'active' });
 const outcome = await s.h.invoke(cases.recordOutcome, { caseId: s.caseId, outcomeCode: 'advice_given', summary: 'Guidance provided. The issue remains unresolved and needs further help.', resolution: 'closed_unresolved' }, s.provider);
 assert.equal((await s.h.db.get(s.caseId)).status, 'closed_unresolved');
 assert.equal((await s.h.db.get(outcome)).recordedBy, s.provider);
 await s.h.invoke(cases.submitFeedback, { caseId: s.caseId, rating: 3, comment: 'I need further support.' }, s.beneficiary);
 await assert.rejects(s.h.invoke(cases.submitFeedback, { caseId: s.caseId, rating: 5 }, s.provider), /Only the beneficiary/);
 assert.equal((await s.h.db.query('case_outcomes').collect()).length, 1);
});
test('outcome recording rejects incomplete summaries and unauthorised users', async () => {
 const s = await setup(); await s.h.db.patch(s.caseId, { status: 'assistance_underway', version: 1 });
 await s.h.db.insert('case_participants', { caseId: s.caseId, userId: s.provider, role: 'paralegal', scopeReviewDecision: 'independent', status: 'active' });
 const args = { caseId: s.caseId, outcomeCode: 'advice_given', summary: 'Too short' };
 await assert.rejects(s.h.invoke(cases.recordOutcome, args, s.provider), /20 characters/);
 await assert.rejects(s.h.invoke(cases.recordOutcome, { ...args, summary: 'Pretend to record an outcome for another person.' }, s.other), /access denied/);
 assert.equal((await s.h.db.query('case_outcomes').collect()).length, 0);
});
test('document detail remains available beyond list limits and blocks another provider', async () => {
 const s = await setup(); await s.h.db.insert('case_participants', { caseId: s.caseId, userId: s.provider, role: 'paralegal', scopeReviewDecision: 'independent', status: 'active' });
 const id = await s.h.db.insert('case_documents', { caseId: s.caseId, name: 'Old synthetic text document', textContent: 'No personal data.', status: 'accepted', createdAt: 1 });
 for (let i=0;i<105;i++) await s.h.db.insert('case_documents', { caseId: s.caseId, name: `Synthetic ${i}`, textContent: 'No personal data.', status: 'accepted', createdAt: i+2 });
 assert.equal((await s.h.invoke(cases.myDocuments, { context: 'work' }, s.provider)).length, 100);
 assert.equal((await s.h.invoke(cases.getDocument, { documentId: id }, s.provider))._id, id);
 await assert.rejects(s.h.invoke(cases.getDocument, { documentId: id }, s.other), /access denied/);
});
test('personal documents do not displace work records before the limit is applied', async () => {
 const s = await setup(); await s.h.db.insert('case_participants', { caseId: s.caseId, userId: s.provider, role: 'paralegal', scopeReviewDecision: 'independent', status: 'active' });
 const personal = await s.h.db.insert('cases', { beneficiaryId: s.provider, publicId: 'QA-PERSONAL', status: 'assigned' });
 await s.h.db.insert('case_documents', { caseId: s.caseId, name: 'Work fixture', status: 'accepted', createdAt: 1 });
 for (let i=0;i<105;i++) await s.h.db.insert('case_documents', { caseId: personal, name: `Personal fixture ${i}`, status: 'accepted', createdAt: i+2 });
 const rows = await s.h.invoke(cases.myDocuments, { context: 'work' }, s.provider);
 assert.equal(rows.length,1); assert.equal(rows[0].name,'Work fixture');
});
test('removing destination membership revokes history and onward access', async () => {
 const s = await setup(); await s.h.db.patch(s.referral, { status: 'accepted' });
 const membership = (await s.h.db.query('role_assignments').collect())[0]; await s.h.db.patch(membership._id, { status: 'revoked' });
 assert.equal(await s.h.invoke(referrals.getForDestination, { referralId: s.referral }, s.provider), null);
 await assert.rejects(s.h.invoke(referrals.respondAsDestination, { referralId: s.referral, status: 'scheduled' }, s.provider), /no longer active/);
 await assert.rejects(s.h.invoke(referrals.destinationProviders, { caseId: s.caseId, destinationServiceId: s.service, parentReferralId: s.referral }, s.provider), /unavailable/);
});
test('final closure waits for appointment disposition and results can be updated after an outcome', async () => {
 const s = await setup(); await s.h.db.patch(s.caseId, { status: 'assistance_underway', version: 1 });
 await s.h.db.insert('case_participants', { caseId: s.caseId, userId: s.provider, role: 'paralegal', scopeReviewDecision: 'independent', status: 'active' });
 const appointmentId = await s.h.db.insert('case_appointments', { caseId: s.caseId, status: 'scheduled', startsAt: Date.now()+86400000 });
 await s.h.invoke(cases.recordOutcome, { caseId: s.caseId, outcomeCode: 'advice_given', summary: 'Fictional guidance completed with clear next steps.', resolution: 'resolved' }, s.provider);
 await assert.rejects(s.h.invoke(cases.updateStatus, { caseId: s.caseId, status: 'closed', expectedVersion: 2 }, s.provider), /scheduled appointment/);
 await s.h.invoke(cases.updateAppointmentStatus, { appointmentId, status: 'cancelled', statusNote: 'Synthetic meeting no longer needed.' }, s.provider);
 const current = await s.h.db.get(s.caseId);
 await s.h.invoke(cases.updateStatus, { caseId: s.caseId, status: 'closed', expectedVersion: current.version }, s.provider);
 assert.equal((await s.h.db.get(s.caseId)).status, 'closed');
 assert.equal((await s.h.invoke(cases.getAppointment, { appointmentId }, s.beneficiary)).context, 'personal');
 await assert.rejects(s.h.invoke(cases.getAppointment, { appointmentId }, s.other), /access denied/);
});
test('legacy resolved cases can add the missing outcome without changing disposition', async () => {
 const s = await setup(); await s.h.db.patch(s.caseId, { status: 'resolved', version: 1 });
 await s.h.db.insert('case_participants', { caseId: s.caseId, userId: s.provider, role: 'paralegal', scopeReviewDecision: 'independent', status: 'active' });
 await s.h.invoke(cases.recordOutcome, { caseId: s.caseId, outcomeCode: 'advice_given', summary: 'Synthetic legacy outcome with a clear next step.' }, s.provider);
 assert.equal((await s.h.db.get(s.caseId)).status, 'resolved');
 assert.equal((await s.h.db.query('case_outcomes').collect())[0].resolution, 'resolved');
});
test('referral consent never grants the receiving provider the full case file', async () => {
 const s=await setup(); const detail=await s.h.invoke(referrals.getForDestination,{referralId:s.referral},s.provider);
 assert.equal(detail.case.summary,undefined); assert.equal(detail.case.beneficiaryId,undefined); assert.equal(detail.canOpenCase,false);
 assert.equal((await s.h.invoke(referrals.myDestinationQueue,{status:'closed'},s.provider))[0].case.summary,undefined);
 await s.h.db.insert('case_participants',{caseId:s.caseId,userId:s.provider,role:'paralegal',scopeReviewDecision:'independent',status:'active'});
 assert.equal((await s.h.invoke(referrals.getForDestination,{referralId:s.referral},s.provider)).canOpenCase,true);
});
test('proposal, beneficiary consent, destination acceptance, onward consent and closed history stay connected', async () => {
 const s=await setup(); const worker=await s.h.user('paralegal');
 await s.h.db.insert('case_participants',{caseId:s.caseId,userId:worker,role:'paralegal',scopeReviewDecision:'independent',status:'active'});
 const requestId=await s.h.db.insert('legal_help_requests',{ownerId:s.beneficiary,locale:'en'});await s.h.db.patch(s.caseId,{sourceRequestId:requestId,version:1});
 await s.h.db.insert('role_assignments',{userId:s.other,organizationId:s.org,role:'provider_staff',status:'active'});
 const secondService=await s.h.db.insert('justice_services',{organizationId:s.org,active:true,verificationStatus:'verified',visibility:'public',referralCapability:true});
 const initial=await s.h.invoke(referrals.createForCase,{caseId:s.caseId,destinationServiceId:s.service,destinationUserId:s.provider,reason:'Fictional specialist guidance needed.',informationShared:['Only the fictional wage question.']},worker);
 assert.equal(await s.h.invoke(referrals.getForDestination,{referralId:initial.referralId},s.provider),null);
 await assert.rejects(s.h.invoke(referrals.decideBeneficiaryConsent,{referralId:initial.referralId,decision:'approved'},worker),/access denied/);
 await s.h.invoke(referrals.decideBeneficiaryConsent,{referralId:initial.referralId,decision:'approved'},s.beneficiary);
 const notification=(await s.h.db.query('notifications').collect()).find(n=>n.userId===s.provider&&n.type==='referral.created');assert.equal(notification.resourceType,'referral');assert.equal(notification.resourceId,initial.referralId);
 await s.h.invoke(referrals.respondAsDestination,{referralId:initial.referralId,status:'accepted'},s.provider);
 const onward=await s.h.invoke(referrals.createOnwardReferral,{parentReferralId:initial.referralId,destinationServiceId:secondService,destinationUserId:s.other,reason:'Fictional onward specialist support.',informationShared:['Only the fictional wage question.']},s.provider);
 assert.equal((await s.h.db.get(initial.referralId)).status,'accepted');assert.equal(await s.h.invoke(referrals.getForDestination,{referralId:onward.referralId},s.other),null);
 await s.h.invoke(referrals.decideBeneficiaryConsent,{referralId:onward.referralId,decision:'approved'},s.beneficiary);
 assert.equal((await s.h.db.get(initial.referralId)).status,'referred_onward');
 await s.h.invoke(referrals.respondAsDestination,{referralId:onward.referralId,status:'accepted'},s.other);
 await s.h.invoke(referrals.respondAsDestination,{referralId:onward.referralId,status:'service_delivered',note:'Synthetic guidance provided.'},s.other);
 await s.h.invoke(referrals.respondAsDestination,{referralId:onward.referralId,status:'closed',finalDisposition:'Synthetic guidance completed.'},s.other);
 assert.ok((await s.h.invoke(referrals.myDestinationQueue,{status:'closed'},s.other)).some(row=>row.referral._id===onward.referralId));
});
test('open beneficiary review requests prevent final closure', async () => {
 const s=await setup();await s.h.db.patch(s.caseId,{status:'resolved',version:2});await s.h.db.insert('case_participants',{caseId:s.caseId,userId:s.provider,role:'paralegal',scopeReviewDecision:'independent',status:'active'});await s.h.db.insert('case_outcomes',{caseId:s.caseId,summary:'Synthetic guidance has been completed.'});const review=await s.h.db.insert('case_review_requests',{caseId:s.caseId,status:'submitted'});
 await assert.rejects(s.h.invoke(cases.updateStatus,{caseId:s.caseId,status:'closed',expectedVersion:2},s.provider),/open beneficiary review/);await s.h.db.patch(review,{status:'resolved'});await s.h.invoke(cases.updateStatus,{caseId:s.caseId,status:'closed',expectedVersion:2},s.provider);assert.equal((await s.h.db.get(s.caseId)).status,'closed');
});
test('document rejection requires a useful explanation', async()=>{
 const s=await setup();await s.h.db.insert('case_participants',{caseId:s.caseId,userId:s.provider,role:'paralegal',scopeReviewDecision:'independent',status:'active'});const documentId=await s.h.db.insert('case_documents',{caseId:s.caseId,status:'pending_review'});await assert.rejects(s.h.invoke(cases.reviewDocument,{documentId,status:'rejected'},s.provider),/Explain/);await s.h.invoke(cases.reviewDocument,{documentId,status:'rejected',reviewNotes:'Please provide a readable synthetic copy.'},s.provider);assert.equal((await s.h.db.get(documentId)).status,'rejected');
});
test('final closure rejects new document uploads and generated documents', async()=>{
 const s=await setup();await s.h.db.patch(s.caseId,{status:'closed'});
 await assert.rejects(s.h.invoke(cases.generateDocumentUploadUrl,{caseId:s.caseId},s.beneficiary),/closed/);
 await assert.rejects(s.h.invoke(cases.addGeneratedLetterDocument,{caseId:s.caseId,clientDocumentId:'closed-fixture',name:'Synthetic letter',textContent:'TEST ONLY — a new fictional letter.'},s.beneficiary),/closed/);
 assert.equal((await s.h.db.query('case_documents').collect()).length,0);
});
test('referral service options require worker scope and hide synthetic services from regular workers', async()=>{
 const s=await setup();await s.h.db.insert('case_participants',{caseId:s.caseId,userId:s.provider,role:'paralegal',scopeReviewDecision:'independent',status:'active'});await s.h.db.insert('justice_services',{active:true,visibility:'public',verificationStatus:'verified',referralCapability:true,syntheticDevelopmentFixture:true});
 const rows=await s.h.invoke(referrals.destinations,{caseId:s.caseId},s.provider);assert.equal(rows.length,1);assert.equal(rows[0]._id,s.service);
 await assert.rejects(s.h.invoke(referrals.destinations,{caseId:s.caseId},s.beneficiary),/worker access/);
 await assert.rejects(s.h.invoke(referrals.destinations,{caseId:s.caseId},s.other),/access denied/);
});

test('request author can track their own pending referral without notifying the destination', async () => {
 const s = await setup();
 await s.h.db.insert('case_participants',{caseId:s.caseId,userId:s.provider,role:'paralegal',scopeReviewDecision:'independent',status:'active'});
 await s.h.db.insert('case_participants',{caseId:s.caseId,userId:s.other,role:'provider_staff',organizationId:s.org,status:'active'});
 await s.h.db.insert('role_assignments',{userId:s.other,organizationId:s.org,role:'provider_staff',status:'active'});
 await s.h.db.patch(s.referral,{status:'awaiting_beneficiary_consent',createdBy:s.provider,destinationUserId:s.other});
 assert.equal((await s.h.invoke(referrals.listForCase,{caseId:s.caseId},s.provider)).length,1);
 assert.equal((await s.h.invoke(referrals.listForCase,{caseId:s.caseId},s.other)).length,0);
 assert.equal(await s.h.invoke(referrals.getForDestination,{referralId:s.referral},s.other),null);
 assert.equal((await s.h.invoke(referrals.listForCase,{caseId:s.caseId},s.beneficiary)).length,1);
});
