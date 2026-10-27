// Authorised QA fixture preparation on one named development deployment only.
import fs from 'node:fs';
import path from 'node:path';
import { runDevelopment as run } from './test-support/named-development.mjs';
const root = path.resolve(import.meta.dirname, '..');
const fixture = run('paralegalRehearsal:prepare', {});
const result = run('caseManagement:createFromRequest', { requestId: fixture.requestId, summary: 'TEST ONLY — fictional unpaid wage guidance in Ilala. No real personal information or legal dispute.', priority: 'standard' }, 'staff');
const detail = run('caseManagement:getCase', { caseId: result.caseId }, 'staff');
if (detail.case.status === 'under_review') run('caseManagement:updateStatus', { caseId: result.caseId, status: 'assignment_pending', expectedVersion: detail.case.version }, 'staff');
const offers = run('caseManagement:assignmentInbox', {}, 'paralegal');
const ownCases = run('caseManagement:myCases', {}, 'paralegal');
let assignmentId = offers.find(item => item.assignment.caseId === result.caseId)?.assignment._id;
if (!assignmentId && !ownCases.some(item => item._id === result.caseId)) { const offered = run('caseManagement:offerAssignment', { caseId: result.caseId, assigneeId: fixture.providerId }, 'staff'); assignmentId = offered.assignmentId ?? offered; }
const report = { checkedAt: new Date().toISOString(), deployment: 'joyous-spaniel-5', ...fixture, caseId: result.caseId, assignmentId, state: run('caseManagement:getCase', { caseId: result.caseId }, 'staff').case.status, checks: { publicDirectoryExcludesFixture: !run('paralegals:listApprovedParalegals', {}).some(item => item._id === fixture.profileId) } };
if (!report.checks.publicDirectoryExcludesFixture) throw new Error('Synthetic professional was exposed in the public directory.');
fs.mkdirSync(path.join(root,'output/paralegal-revamp'), { recursive: true });
fs.writeFileSync(path.join(root,'output/paralegal-revamp/development-journey.json'), JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ deployment: report.deployment, state: report.state, checks: report.checks }));
