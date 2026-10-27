import test from 'node:test';
import assert from 'node:assert/strict';
import { getLoadingCopy, loadingTaskForText, loadingLabel, isGenericLoading, isLoadingLabel, loadingCopy } from '../shared/loadingCopy.ts';

test('loading defaults to everyday Swahili and offers matching English tasks', () => {
 assert.equal(getLoadingCopy('account').title, 'Tunaunganisha akaunti yako');
 assert.equal(getLoadingCopy('account', 'en').title, 'Connecting your account');
 for (const key of Object.keys(loadingCopy)) for (const language of ['sw','en']) {
  const copy=getLoadingCopy(key,language);
  assert.ok(copy.title.trim() && copy.detail.trim());
  assert.doesNotMatch(copy.title+copy.detail,/\d+%|almost done|nearly finished|imekamilika|imehifadhiwa tayari/i);
 }
});
test('legacy task labels select the relevant work without confusing accounts and cases', () => {
 assert.equal(loadingTaskForText('Loading your cases…'),'cases');
 assert.equal(loadingTaskForText('Inapakia nyaraka…'),'documents');
 assert.equal(loadingTaskForText('Connecting your account'),'account');
 assert.equal(loadingTaskForText('Verifying access…'),'access');
 assert.equal(loadingTaskForText('Loading messages…'),'messages');
});
test('English-only legacy copy is localized without losing the subject', () => {
 assert.equal(loadingLabel('Loading invitations…','content','sw'),'Tunaleta mialiko…');
 assert.equal(loadingLabel('Loading invitations…','content','en'),'Loading invitations…');
 assert.equal(loadingLabel('Tunapakia miadi…','content','sw'),'Tunapakia miadi…');
 assert.equal(loadingLabel('Loading…','account','sw'),'Tunaunganisha akaunti yako');
 assert.ok(isGenericLoading('Loading...'));
 assert.ok(!isGenericLoading('Loading case documents…'));
});

test('loading text adapters leave denied, empty, error and numeric states intact', () => {
 for (const value of ['Loading cases…', 'Inapakia ruhusa…', 'Tunapakia miadi…']) assert.ok(isLoadingLabel(value));
 for (const value of ['Access denied', 'No cases yet', 'Could not load your account', 'Please retry', 0, 12, null, undefined]) assert.ok(!isLoadingLabel(value));
});
