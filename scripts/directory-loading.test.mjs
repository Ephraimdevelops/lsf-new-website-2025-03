import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { withRequestDeadline } from '../mobile/src/backend/requestDeadline.ts';

test('directory deadlines preserve successful and empty results', async () => {
  assert.deepEqual(await withRequestDeadline(Promise.resolve([]), 20), []);
  assert.deepEqual(await withRequestDeadline(Promise.resolve([{ name: 'Synthetic provider' }]), 20), [{ name: 'Synthetic provider' }]);
});

test('stalled requests stop waiting and original failures remain failures', async () => {
  await assert.rejects(withRequestDeadline(new Promise(() => {}), 10), /Request timed out/);
  await assert.rejects(withRequestDeadline(Promise.reject(new Error('Offline')), 20), /Offline/);
});

test('late completion cannot replace a timed-out result', async () => {
  let complete;
  const work = new Promise(resolve => { complete = resolve; });
  const result = withRequestDeadline(work, 10);
  await assert.rejects(result, /Request timed out/);
  complete([{ name: 'Late provider' }]);
  await assert.rejects(result, /Request timed out/);
});

test('public recovery excludes private queries, cancels stale work and is used on all search screens', () => {
  const hook = readFileSync(new URL('../mobile/src/backend/usePublicDirectoryQuery.ts', import.meta.url), 'utf8');
  assert.match(hook, /publicDirectoryQueries\.has\(name\)/);
  assert.match(hook, /args\.includePrivate/);
  assert.match(hook, /disposed = true/);
  assert.match(hook, /controller\.abort\(\)/);
  assert.match(hook, /recovery\?\.key === key/);
  assert.match(hook, /makeFunctionReference\(name\)/);
  assert.doesNotMatch(hook, /setAuth|localStorage|AsyncStorage/);
  for (const screen of ['nearby-help', 'paralegals', 'find-services']) {
    const source = readFileSync(new URL(`../mobile/app/${screen}.tsx`, import.meta.url), 'utf8');
    assert.match(source, /usePublicDirectoryQuery/);
    assert.match(source, /DirectoryConnectionError/);
  }
  const matching = readFileSync(new URL('../mobile/app/find-services.tsx', import.meta.url), 'utf8');
  assert.match(matching, /withRequestDeadline\(matchServices/);
});
