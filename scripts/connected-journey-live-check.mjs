// Run only for the owner's authorised existing QA accounts on named development.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {anyApi as api} from 'convex/server';
import {qaSession} from './test-support/qa-clerk-session.mjs';
const report={checkedAt:new Date().toISOString(),authentication:'Genuine Clerk development sessions created through Backend API; not a browser password-login test',environment:'named shared development',checks:[],blocked:[],sessionsRevoked:false};
const sessions=[];let mainError;
function check(name,condition){report.checks.push({name,passed:!!condition});assert.ok(condition,name);console.log('PASS: '+name);}
try{
 const users={};for(const role of ['user','staff','paralegal','provider_staff','admin']){const session=await qaSession(role);sessions.push(session);users[role]=session;const access=await session.call('query',api.users.currentAccess);check(role+' genuine JWT resolves correct role',access?.roles?.includes(role));users[role].id=access.user._id;}
 const person=users.user,staff=users.staff,worker=users.paralegal;
 report.readiness=await users.admin.call('query',api.sara.getReadiness);
 report.publicEligible={};for(const [key,ref]of [['services',api.justiceServices.listPublicServices],['paralegals',api.paralegals.listApprovedParalegals],['guides',api.publications.listPublicLegalGuides]])report.publicEligible[key]=(await person.call('query',ref)).length;
 if(!report.publicEligible.services)report.blocked.push('No current approved public services; real consented referral requires independently verified service inventory.');
 if(!report.readiness.approvedCurrentSourceDocuments)report.blocked.push('No current independently approved Saada legal sources; sourced legal-answer acceptance requires legal review.');
 const draft=await person.call('mutation',api.legalHelp.saveDraft,{clientRequestId:'qa-connected-'+randomUUID(),locale:'en',description:'TEST ONLY — fictional unpaid salary. No real client or employer is involved.',issueCategory:'employment',region:'Dar es Salaam',district:'Ilala',safeContactMethod:'in_app',preferredLanguage:'en',desiredHelp:'TEST ONLY — rehearse support and agreed follow-up.',urgency:'standard'});
 report.requestId=draft.requestId;
 const submitted=await person.call('mutation',api.legalHelp.submit,{requestId:draft.requestId,expectedVersion:draft.version,consentVersion:'service-v1'});
 const replay=await person.call('mutation',api.legalHelp.submit,{requestId:draft.requestId,expectedVersion:draft.version,consentVersion:'service-v1'});check('beneficiary submission is idempotent',submitted.publicId===replay.publicId);
 const created=await staff.call('mutation',api.caseManagement.createFromRequest,{requestId:draft.requestId,summary:'TEST ONLY — authorised cross-role QA rehearsal; fictional unpaid salary.',priority:'standard'});const caseId=created.caseId;report.caseId=caseId;
 let denied=false;try{await users.provider_staff.call('query',api.caseManagement.getCase,{caseId});}catch{denied=true;}check('unassigned provider cannot see case',denied);
 const recs=await staff.call('query',api.caseManagement.providerRecommendations,{caseId});const rec=recs.find(r=>r.id===worker.id);
 if(!rec)throw new Error('QA paralegal is not eligible; no role or approval will be fabricated.');
 const assignmentId=await staff.call('mutation',api.caseManagement.offerAssignment,{caseId,assigneeId:worker.id,...(rec.affiliations.length===1?{organizationId:rec.affiliations[0].organizationId}:{}),...(!rec.canOffer?{availabilityOverrideReason:'TEST ONLY — owner-authorised isolated QA worker rehearsal.'}:{})});report.assignmentId=assignmentId;
 let beforeDenied=false;try{await worker.call('query',api.caseManagement.getCase,{caseId});}catch{beforeDenied=true;}check('offer alone grants no case access',beforeDenied);
 await worker.call('mutation',api.caseManagement.respondToAssignment,{assignmentId,response:'accepted'});check('accepted assignment appears to beneficiary',(await person.call('query',api.caseManagement.getCase,{caseId})).case.status==='assigned');
 const marker='TEST ONLY — agreed fictional next step '+randomUUID();await worker.call('mutation',api.caseManagement.sendMessage,{caseId,clientMessageId:randomUUID(),body:marker});check('worker message reaches beneficiary',(await person.call('query',api.caseManagement.listMessages,{caseId})).some(m=>m.body===marker));
 const appointmentId=await worker.call('mutation',api.caseManagement.scheduleAppointment,{caseId,startsAt:Date.now()+86400000,mode:'phone'});check('appointment reaches beneficiary',(await person.call('query',api.caseManagement.getCase,{caseId})).appointments.some(a=>a._id===appointmentId));
 await worker.call('mutation',api.caseManagement.updateAppointmentStatus,{appointmentId,status:'completed',statusNote:'TEST ONLY — fictional QA meeting completed.'});
 let detail=await worker.call('query',api.caseManagement.getCase,{caseId});if(detail.case.status!=='assistance_underway')await worker.call('mutation',api.caseManagement.updateStatus,{caseId,status:'assistance_underway',expectedVersion:detail.case.version});
 await worker.call('mutation',api.caseManagement.recordOutcome,{caseId,outcomeCode:'other',resolution:'resolved',summary:'TEST ONLY — fictional support completed. No real-world justice outcome is claimed.'});
 await person.call('mutation',api.caseManagement.submitFeedback,{caseId,rating:5,comment:'TEST ONLY — QA feedback.'});detail=await worker.call('query',api.caseManagement.getCase,{caseId});check('closure requirements satisfied',detail.closureReadiness.canClose);
 await worker.call('mutation',api.caseManagement.updateStatus,{caseId,status:'closed',expectedVersion:detail.case.version});check('beneficiary sees final closure',(await person.call('query',api.caseManagement.getCase,{caseId})).case.status==='closed');
 for(const [key,message,locale]of [['en','What can you help me do in this app? Please answer in English.','en'],['sw','Nawezaje kupata msaada kupitia programu hii? Jibu kwa Kiswahili.','sw']]){const answer=await person.call('action',api.sara_actions.ask,{message,locale,source:'web',clientRequestId:randomUUID()});check('Saada '+key+' app-help response returns',typeof answer==='string'&&answer.trim().length>30);report['saada_'+key]={returned:true,characters:answer.length};}
}catch(error){mainError=error;report.failure=String(error.message).replace(/(?:sk|pk)_(?:test|live)_\S+/g,'[redacted]').slice(0,1200);console.log('REHEARSAL STOPPED: '+report.failure);}
finally{const cleanup=await Promise.allSettled(sessions.map(s=>s.close()));report.sessionsRevoked=cleanup.every(r=>r.status==='fulfilled');report.completedAt=new Date().toISOString();fs.writeFileSync('docs/haki-yangu/connected-journey-2026-10-19.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.checks.filter(c=>c.passed).length,failed:report.checks.filter(c=>!c.passed).length,blocked:report.blocked,sessionsRevoked:report.sessionsRevoked}));}
if(mainError||report.checks.some(c=>!c.passed))process.exitCode=1;
