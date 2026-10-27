// Synthetic development data only. Prepares an offer for the browser acceptance-to-closure check.
import fs from 'node:fs';
import { runDevelopment as run } from './test-support/named-development.mjs';
const fixture = run('paralegalRehearsal:prepare',{scenario:`workspace-simplification-${Date.now()}`});
const {caseId} = run('caseManagement:createFromRequest',{requestId:fixture.requestId,summary:'TEST ONLY — workspace usability check. A fictional person asks for wage guidance. No real dispute or personal data.',priority:'standard'},'staff');
const detail = run('caseManagement:getCase',{caseId},'staff');
run('caseManagement:updateStatus',{caseId,status:'assignment_pending',expectedVersion:detail.case.version},'staff');
const offer = run('caseManagement:offerAssignment',{caseId,assigneeId:fixture.providerId},'staff');
const report={deployment:'joyous-spaniel-5',preparedAt:new Date().toISOString(),caseId,publicId:detail.case.publicId,assignmentId:offer.assignmentId??offer,checks:{syntheticOfferPrepared:true}};
fs.mkdirSync('output/workspace-simplification',{recursive:true});fs.writeFileSync('output/workspace-simplification/development-journey.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({publicId:report.publicId,caseId,syntheticOfferPrepared:true}));
