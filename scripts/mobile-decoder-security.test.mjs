import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const lock = JSON.parse(readFileSync(new URL('../mobile/package-lock.json', import.meta.url), 'utf8'));

test('the SDK 58 mobile dependency tree excludes the legacy query-string decoder', () => {
  assert.match(lock.packages['node_modules/expo'].version, /^58\./);
  const legacy = Object.keys(lock.packages).filter(path => /(?:^|\/)node_modules\/(?:query-string|decode-uri-component)$/.test(path));
  assert.deepEqual(legacy, [], 'Review deep-link decoder security before reintroducing the removed parser');
});
