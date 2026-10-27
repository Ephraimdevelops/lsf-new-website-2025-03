// Rehearse only synthetic records on the authorised named development deployment.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const root = path.resolve(import.meta.dirname,'..');
const accounts = JSON.parse(fs.readFileSync(path.join(root,'development-role-test-credentials.local'),'utf8')).accounts;
const report = process.argv.includes("--finish") ? JSON.parse(fs.readFileSync(path.join(root,"output/paralegal-revamp/complete-development-journey.json"),"utf8")) : { checkedAt:new Date().toISOString(), deployment:'joyous-spaniel-5', checks:{}, cases:[] };
function run(fn,args={},role) {
 const opts=['run',fn,JSON.stringify(args),'--deployment-name',report.deployment];
 if(role){const account=accounts.find(x=>x.role===role);assert.ok(account?.clerkId&&account.email.endsWith('+clerk_test@example.com'));opts.push('--identity',JSON.stringify({subject:account.clerkId,email:account.email,name:account.name}));}
 try { const outputPath=path.join('/tmp',`paralegal-cli-${process.pid}.json`);const descriptor=fs.openSync(outputPath,'w',0o600);try { execFileSync(process.execPath,[path.join(root,'node_modules/convex/bin/main.js'),...opts],{cwd:root,encoding:'utf8',stdio:['ignore',descriptor,'pipe'],timeout:60000}); } finally {fs.closeSync(descriptor);} const raw=fs.readFileSync(outputPath,'utf8').trim();fs.unlinkSync(outputPath);return raw?JSON.parse(raw):null; }
 catch(error){throw new Error(`${fn}: ${String(error.stderr||error.message).replace(/sk_(test|live)_\S+/g,'[redacted]').slice(0,1400)}`);}
}
function check(name,condition){assert.ok(condition,name);report.checks[name]=true;console.log(name);fs.mkdirSync(path.join(root,'output/paralegal-revamp'),{recursive:true});fs.writeFileSync(path.join(root,'output/paralegal-revamp/complete-development-journey.json'),JSON.stringify(report,null,2)+'\n');}
const scenario=`journey-${Date.now()}`;
const fixture=run('paralegalRehearsal:prepare',process.argv.includes('--finish') ? {} : {scenario});
check('synthetic services excluded from public list',!run('justiceServices:listPublicServices').some(s=>[fixture.destinationServiceId,fixture.onwardServiceId].includes(s._id)));
check('synthetic service detail excluded',run('justiceServices:getPublicService',{id:fixture.destinationServiceId})===null);
function newCase(f) {
 const {caseId}=run('caseManagement:createFromRequest',{requestId:f.requestId,summary:'TEST ONLY — fictional wage question. No real dispute or personal data.',priority:'standard'},'staff');
 const detail=run('caseManagement:getCase',{caseId},'staff');
 run('caseManagement:updateStatus',{caseId,status:'assignment_pending',expectedVersion:detail.case.version},'staff');
 const offer=run('caseManagement:offerAssignment',{caseId,assigneeId:f.providerId},'staff');
 run('caseManagement:respondToAssignment',{assignmentId:offer.assignmentId??offer,response:'accepted'},'paralegal');
 report.cases.push(caseId);return caseId;
}
const caseId=process.argv.includes('--finish') ? report.cases[0] : newCase(fixture);
if (!process.argv.includes('--finish')) {
 check('offer accepted and case visible to worker',run('caseManagement:myCases',{},'paralegal').some(c=>c._id===caseId));
 const messageArgs={caseId,clientMessageId:`${scenario}-message`,body:'TEST ONLY: please review the fictional next steps.'};
 const messageId=run('caseManagement:sendMessage',messageArgs,'paralegal');
 check('message retry does not duplicate',run('caseManagement:sendMessage',messageArgs,'paralegal')===messageId);
 run('caseManagement:sendMessage',{caseId,clientMessageId:`${scenario}-reply`,body:'TEST ONLY: the fictional beneficiary can see the message.'},'user');
 const letterArgs={caseId,clientDocumentId:`${scenario}-letter`,name:'Synthetic practice letter',textContent:'TEST ONLY — fictional practice letter. No personal data and no real legal instructions.'};
 const documentId=run('caseManagement:addGeneratedLetterDocument',letterArgs,'user');
 check('document retry does not duplicate',run('caseManagement:addGeneratedLetterDocument',letterArgs,'user')===documentId);
 run('caseManagement:reviewDocument',{documentId,status:'accepted',reviewNotes:'Synthetic document used to check review workflow.'},'paralegal');
 check('document review saved',run('caseManagement:getDocument',{documentId},'user').status==='accepted');
 const taskId=run('caseManagement:createTask',{caseId,title:'TEST ONLY — review fictional wage steps',dueAt:Date.now()+86400000},'paralegal');
 run('caseManagement:completeTask',{taskId},'paralegal');
 check('task completion saved',run('caseManagement:myTasks',{status:'done'},'paralegal').some(t=>t.task._id===taskId));
 const appointmentId=run('caseManagement:scheduleAppointment',{caseId,startsAt:Date.now()+86400000,mode:'phone'},'paralegal');
 run('caseManagement:updateAppointmentStatus',{appointmentId,status:'completed',statusNote:'TEST ONLY — simulated appointment result.'},'paralegal');
 check('appointment visible with recorded result',run('caseManagement:getAppointment',{appointmentId},'user').status==='completed');
 const proposal=run('referrals:createForCase',{caseId,destinationServiceId:fixture.destinationServiceId,destinationUserId:fixture.receiverId,reason:'TEST ONLY — fictional specialist guidance needed.',informationShared:['Only the fictional wage question.']},'paralegal');
 check('referral hidden before consent',run('referrals:getForDestination',{referralId:proposal.referralId},'provider_staff')===null);
 run('referrals:decideBeneficiaryConsent',{referralId:proposal.referralId,decision:'approved'},'user');
 const destination=run('referrals:getForDestination',{referralId:proposal.referralId},'provider_staff');
 check('destination sees approved information without full case access',destination?.canOpenCase===false&&destination.case.summary===undefined);
 run('referrals:respondAsDestination',{referralId:proposal.referralId,status:'accepted'},'provider_staff');
 const onward=run('referrals:createOnwardReferral',{parentReferralId:proposal.referralId,destinationServiceId:fixture.onwardServiceId,destinationUserId:fixture.providerId,reason:'TEST ONLY — fictional onward guidance.',informationShared:['Only the fictional wage question.']},'provider_staff');
 run('referrals:decideBeneficiaryConsent',{referralId:onward.referralId,decision:'approved'},'user');
 run('referrals:respondAsDestination',{referralId:onward.referralId,status:'accepted'},'paralegal');
 run('referrals:respondAsDestination',{referralId:onward.referralId,status:'service_delivered',note:'TEST ONLY — simulated support delivered.'},'paralegal');
 run('referrals:respondAsDestination',{referralId:onward.referralId,status:'closed',finalDisposition:'TEST ONLY — simulated referral completed.'},'paralegal');
 check('onward referral remains in closed history',run('referrals:myDestinationQueue',{status:'closed'},'paralegal').some(r=>r.referral._id===onward.referralId));
}
let detail=run('caseManagement:getCase',{caseId},'paralegal');
if (!detail.outcome) {
 if (detail.case.status !== 'assistance_underway') run('caseManagement:updateStatus',{caseId,status:'assistance_underway',expectedVersion:detail.case.version},'paralegal');
 run('caseManagement:recordOutcome',{caseId,outcomeCode:'advice_given',summary:'TEST ONLY — fictional guidance completed and the issue resolved in this rehearsal.',resolution:'resolved'},'paralegal');
}
let personal=run('caseManagement:getCase',{caseId},'user');
if (!personal.feedback) run('caseManagement:submitFeedback',{caseId,rating:4,comment:'TEST ONLY — synthetic feedback.'},'user');
if (!personal.reviewRequests.length) {
 const reviewRequestId=run('caseManagement:requestCaseReview',{caseId,reason:'other',note:'TEST ONLY — rehearse the review response.'},'user');
 run('caseManagement:resolveCaseReviewRequest',{reviewRequestId,status:'resolved',resolutionNote:'TEST ONLY — synthetic review completed.'},'staff');
}
personal=run('caseManagement:getCase',{caseId},'user');
check('outcome, feedback and review saved',!!personal.outcome&&personal.feedback?.rating===4&&personal.reviewRequests.some(r=>r.status==='resolved'));
detail=run('caseManagement:getCase',{caseId},'paralegal');
check('individual feedback and private reviews withheld from worker',detail.feedback===null&&detail.reviewRequests.length===0);
if (detail.case.status !== 'closed') run('caseManagement:updateStatus',{caseId,status:'closed',expectedVersion:detail.case.version},'paralegal');
check('final closure saved',run('caseManagement:getCase',{caseId},'user').case.status==='closed');
const supportId=run('paralegals:requestSupport',{type:'supervisor',note:'TEST ONLY — synthetic supervisor support enquiry.'},'paralegal');run('paralegals:respondToSupportRequest',{id:supportId,status:'responded',responseNote:'TEST ONLY — synthetic staff response.'},'staff');check('staff support response visible',run('paralegals:mySupportRequests',{},'paralegal').some(s=>s._id===supportId&&s.status==='responded'));
report.completedAt=new Date().toISOString();fs.writeFileSync(path.join(root,'output/paralegal-revamp/complete-development-journey.json'),JSON.stringify(report,null,2)+'\n');
console.log('Completed synthetic development journey.');
