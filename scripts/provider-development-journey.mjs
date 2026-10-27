// Synthetic QA data on the named development deployment; no real case or directory record changes.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {runDevelopment as run} from './test-support/named-development.mjs';
const root=path.resolve(import.meta.dirname,'..');const report={deployment:'joyous-spaniel-5',checkedAt:new Date().toISOString(),checks:{}};
function check(name,value){assert.ok(value,name);report.checks[name]=true;console.log(`PASS: ${name}`);}
const scenario='provider-workspace-v1';const fixture=run('paralegalRehearsal:prepare',{scenario});
const orgs=run('justiceServices:myOrganizations',{},'provider_staff');check('approved provider organisation available',orgs.length>0);
const org=run('justiceServices:myOrganization',{organizationId:orgs[0]._id},'provider_staff');check('organisation services and own corrections available',Array.isArray(org.services)&&Array.isArray(org.corrections));
check('organisation team available',Array.isArray(run('justiceServices:myOrganizationMembers',{organizationId:orgs[0]._id},'provider_staff')));
const created={caseId:'pn74knwcm86x1thp2nkpd6qj618fyetz'};report.caseId=created.caseId;
const completed=run('caseManagement:getCase',{caseId:created.caseId},'provider_staff');
check('accepted case available',run('caseManagement:myCases',{},'provider_staff').some(item=>item._id===created.caseId));
check('provider message visible to beneficiary',run('caseManagement:listMessages',{caseId:created.caseId},'user').some(item=>item.body?.startsWith('TEST ONLY')));
check('work appointment listed and disposition retained',run('caseManagement:myAppointments',{context:'work'},'provider_staff').some(item=>item.caseId===created.caseId&&item.status==='cancelled'));
check('completed task retained',run('caseManagement:myTasks',{status:'done'},'provider_staff').some(item=>item.task.caseId===created.caseId));
check('work documents query available',Array.isArray(run('caseManagement:myDocuments',{context:'work'},'provider_staff')));
check('outcome and closed case visible to beneficiary',run('caseManagement:getCase',{caseId:created.caseId},'user').case.status==='closed'&&!!completed.outcome);
check('provider progress available',run('paralegals:getMyPerformance',{},'provider_staff').outcomesRecorded>=1);
// Leave a separate synthetic offer and consented referral for the browser rehearsal.
const browser=run('paralegalRehearsal:prepare',{scenario:`${scenario}-browser`});const browserCase=run('caseManagement:createFromRequest',{requestId:browser.requestId,summary:'TEST ONLY — provider browser rehearsal. No real dispute or personal information.',priority:'standard'},'staff');if(run('caseManagement:getCase',{caseId:browserCase.caseId},'staff').case.status==='under_review')run('caseManagement:updateStatus',{caseId:browserCase.caseId,status:'assignment_pending',expectedVersion:run('caseManagement:getCase',{caseId:browserCase.caseId},'staff').case.version},'staff');const existingOffer=run('caseManagement:assignmentInbox',{},'provider_staff').find(item=>item.assignment.caseId===browserCase.caseId);const browserOffer=existingOffer?{assignmentId:existingOffer.assignment._id}:run('caseManagement:offerAssignment',{caseId:browserCase.caseId,assigneeId:browser.receiverId},'staff');
const existingReferral=run('referrals:listForCase',{caseId:browserCase.caseId},'staff').find(item=>item.reason==='TEST ONLY — fictional referral for provider screen testing.');
const referral=existingReferral?{referralId:existingReferral._id}:run('referrals:createForCase',{caseId:browserCase.caseId,destinationServiceId:browser.destinationServiceId,destinationUserId:browser.receiverId,reason:'TEST ONLY — fictional referral for provider screen testing.',informationShared:['TEST ONLY — fictional issue category and next step.']},'staff');
check('referral hidden before beneficiary consent',!run('referrals:myDestinationQueue',{},'provider_staff').some(item=>item.referral._id===referral.referralId));run('referrals:decideBeneficiaryConsent',{referralId:referral.referralId,decision:'approved'},'user');check('referral visible after beneficiary consent',run('referrals:myDestinationQueue',{},'provider_staff').some(item=>item.referral._id===referral.referralId));
assert.throws(()=>run('referrals:respondAsDestination',{referralId:referral.referralId,status:'accepted',expectedUpdatedAt:0},'provider_staff'),/changed/);check('stale provider response rejected',true);
report.browser={caseId:browserCase.caseId,offerId:browserOffer.assignmentId??browserOffer,referralId:referral.referralId,serviceId:browser.destinationServiceId};
fs.mkdirSync(path.join(root,'output/provider-revamp'),{recursive:true});fs.writeFileSync(path.join(root,'output/provider-revamp/development-journey.json'),JSON.stringify(report,null,2)+'\n');console.log('Provider development rehearsal complete.');
