import test from 'node:test';
import assert from 'node:assert/strict';
import { workCaseJourney, workCaseBucket, finalChecks } from '../shared/workCaseJourney.ts';
import { caseTransitions } from '../convex/lib/caseLifecycle.ts';
test('worker guidance never offers an invalid status transition', () => {
 for (const status of Object.keys(caseTransitions)) for (const hasOutcome of [false,true]) for (const canClose of [false,true]) {
  const next = workCaseJourney(status,hasOutcome,canClose);
  if(next.transition) assert.ok(caseTransitions[status].includes(next.transition), `${status} -> ${next.transition}`);
 }
});
test('recording a result keeps a case in unfinished work until final close', () => {
 for (const status of ['resolved','closed_unresolved']) {
  assert.equal(workCaseBucket(status),'finish');
  assert.equal(workCaseJourney(status,true,false).area,'outcome');
  assert.equal(workCaseJourney(status,true,false).transition,null);
  assert.equal(workCaseJourney(status,true,true).transition,'closed');
 }
 assert.equal(workCaseBucket('closed'),'closed');
 assert.equal(workCaseJourney('closed',true,true).transition,null);
});
test('review and assignment stages do not prompt workers to start help prematurely', () => {
 for (const status of ['under_review','waiting_for_information','assignment_pending']) {
  assert.equal(workCaseJourney(status).stage,'prepare');
  assert.equal(workCaseJourney(status).transition,null);
 }
 for(const status of ['assigned','appointment_scheduled','referred']) assert.equal(workCaseJourney(status).transition,'assistance_underway');
});
test('final checks cover all six server requirements and lead to a real work area', () => {
 assert.deepEqual(finalChecks.map(check=>check.key).sort(),['outcomeRecorded','beneficiarySafeSummary','documentsReviewed','appointmentsRecorded','reviewRequestsResolved','feedbackRequested'].sort());
 assert.ok(finalChecks.every(check=>['overview','outcome','documents','appointments'].includes(check.area)));
});
test('Kiswahili guidance preserves the same workflow and actions', () => {
 for(const status of Object.keys(caseTransitions)) {
  const en=workCaseJourney(status,false,false), sw=workCaseJourney(status,false,false,true);
  assert.equal(sw.area,en.area); assert.equal(sw.transition,en.transition); assert.equal(sw.stage,en.stage); assert.notEqual(sw.title,en.title);
 }
});
