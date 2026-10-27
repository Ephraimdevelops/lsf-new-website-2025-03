// Synthetic support rehearsal and read-only admin checks on one named development deployment.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { runDevelopment as run } from './test-support/named-development.mjs';
const root=path.resolve(import.meta.dirname,'..');
const report={checkedAt:new Date().toISOString(),deployment:'joyous-spaniel-5',checks:{}};
function check(name,condition){ assert.ok(condition,name); report.checks[name]=true; }
for(const [name,fn,args] of [
 ['request queue','legalHelp:staffQueue',{}],['case queue','caseManagement:staffCaseQueue',{}],['document review queue','caseManagement:staffDocumentQueue',{status:'pending_review'}],['case review queue','caseManagement:staffReviewRequests',{status:'submitted'}],['people access queue','accessRequests:adminQueuePage',{paginationOpts:{numItems:5,cursor:null}}],['paralegal application queue','formSubmissions:paralegalReviewQueuePage',{status:'pending',paginationOpts:{numItems:3,cursor:null}}],['decision history','admin:listPlatformAudit',{limit:20}]
]) check(name,run(fn,args,'admin')!==null);
const id=run('paralegals:requestSupport',{type:'challenging_case',note:'TEST ONLY — admin workspace rehearsal. Fictional support question with no real dispute or personal information.'},'paralegal');
report.supportRequestId=id;
assert.throws(()=>run('paralegals:respondToSupportRequest',{id,status:'responded'},'admin'),/useful reply/);check('empty reply rejected',true);
assert.throws(()=>run('paralegals:respondToSupportRequest',{id,status:'closed'},'admin'),/Reply/);check('unanswered closure rejected',true);
const direct=run('paralegals:getStaffSupportRequest',{id},'admin');
assert.throws(()=>run('paralegals:getStaffSupportRequest',{id},'paralegal'),/forbidden|unauthorized|permission|access/i);check('private staff detail denied to worker',true);
assert.throws(()=>run('paralegals:respondToSupportRequest',{id,status:'responded',responseNote:'TEST ONLY — fictional reply.',expectedUpdatedAt:0},'admin'),/changed/);check('stale reply rejected',true);
run('paralegals:respondToSupportRequest',{id,status:'in_review',expectedUpdatedAt:direct.request.updatedAt},'admin');
const reviewing=run('paralegals:getStaffSupportRequest',{id},'admin');
run('paralegals:respondToSupportRequest',{id,status:'responded',expectedUpdatedAt:reviewing.request.updatedAt,responseNote:'TEST ONLY — review the fictional practice case with your supervisor. This is a development test, not legal advice.'},'admin');
const worker=run('paralegals:mySupportRequests',{},'paralegal').find(row=>row._id===id);check('admin reply visible to paralegal',worker?.status==='responded'&&worker.responseNote.startsWith('TEST ONLY'));
const responded=run('paralegals:getStaffSupportRequest',{id},'admin');
run('paralegals:respondToSupportRequest',{id,status:'closed',expectedUpdatedAt:responded.request.updatedAt},'admin');
check('closed support retained for direct notification links',run('paralegals:getStaffSupportRequest',{id},'admin').request.status==='closed');
const audit=run('admin:listPlatformAudit',{actionPrefix:'paralegal.',limit:20},'admin');check('support decision audited',audit.some(row=>row.entityId===id));
fs.mkdirSync(path.join(root,'output/admin-revamp'),{recursive:true});fs.writeFileSync(path.join(root,'output/admin-revamp/development-journey.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({deployment:report.deployment,checks:report.checks}));
