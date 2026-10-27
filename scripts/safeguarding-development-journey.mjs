// Synthetic QA only on the named development deployment.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {runDevelopment as run} from './test-support/named-development.mjs';
const root=path.resolve(import.meta.dirname,'..'),report={deployment:'joyous-spaniel-5',checkedAt:new Date().toISOString(),checks:{}};
function check(name,value){assert.ok(value,name);report.checks[name]=true;console.log(`PASS: ${name}`);}
const fixture=run('paralegalRehearsal:prepare',{scenario:`safeguarding-${Date.now()}`});report.requestId=fixture.requestId;
const created=run('caseManagement:createFromRequest',{requestId:fixture.requestId,summary:'TEST ONLY — fictional safety review. No real person, incident or dispute.',priority:'safeguarding'},'staff');report.caseId=created.caseId;
report.reviewId=run('caseManagement:requestCaseReview',{caseId:created.caseId,reason:'safety_concern',note:'TEST ONLY — fictional concern for safeguarding screen checks. No real incident.'},'user');
check('safety concern direct link',run('caseManagement:staffReviewRequests',{reviewRequestId:report.reviewId},'safeguarding_officer').length===1);
assert.throws(()=>run('caseManagement:getCase',{caseId:report.caseId},'safeguarding_officer'),/access|forbidden/i);check('full case access stays restricted',true);
assert.throws(()=>run('admin:listPlatformAudit',{},'safeguarding_officer'),/Forbidden/);check('administration stays restricted',true);
const ordinary=run('justiceServices:matchServices',{source:'staff',region:'Dar es Salaam',district:'Ilala',issueCategory:'TEST ONLY fictional ordinary matching',urgency:'standard'},'staff');report.ordinaryDecisionId=ordinary.decisionId;
check('ordinary direct matching link excluded',run('justiceServices:staffMatchingDecisionQueue',{decisionId:ordinary.decisionId},'safeguarding_officer').length===0);
assert.throws(()=>run('justiceServices:reviewMatchingDecision',{decisionId:ordinary.decisionId,status:'approved',reviewNote:'TEST ONLY — fictional review.'},'safeguarding_officer'),/safety-sensitive/);check('ordinary matching write rejected',true);
const match=run('justiceServices:matchServices',{source:'staff',region:'Dar es Salaam',district:'Ilala',issueCategory:'TEST ONLY fictional safety matching',urgency:'immediate_safety'},'staff');report.decisionId=match.decisionId;
const decision=run('justiceServices:staffMatchingDecisionQueue',{decisionId:match.decisionId},'safeguarding_officer')[0].decision;check('protected matching direct link',decision.reviewStatus==='restricted');
assert.throws(()=>run('justiceServices:reviewMatchingDecision',{decisionId:match.decisionId,status:'approved',reviewNote:'short'},'safeguarding_officer'),/reason/);check('matching requires clear reason',true);
run('justiceServices:reviewMatchingDecision',{decisionId:match.decisionId,status:'escalated',reviewNote:'TEST ONLY — senior review rehearsal. No actual referral or safety incident.',expectedReviewedAt:decision.reviewedAt??0,expectedReviewStatus:decision.reviewStatus},'safeguarding_officer');
assert.throws(()=>run('justiceServices:reviewMatchingDecision',{decisionId:match.decisionId,status:'approved',reviewNote:'TEST ONLY — stale review attempt.',expectedReviewedAt:decision.reviewedAt??0,expectedReviewStatus:decision.reviewStatus},'safeguarding_officer'),/changed/);check('stale matching overwrite rejected',true);
check('saved matching reason visible',run('justiceServices:staffMatchingDecisionQueue',{decisionId:match.decisionId},'safeguarding_officer')[0].decision.reviewStatus==='escalated');
fs.mkdirSync(path.join(root,'output/safeguarding-revamp'),{recursive:true});fs.writeFileSync(path.join(root,'output/safeguarding-revamp/development-journey.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({deployment:report.deployment,checks:Object.keys(report.checks).length}));
