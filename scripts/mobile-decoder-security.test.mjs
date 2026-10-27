import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
const mobileRequire = createRequire(new URL('../mobile/package.json', import.meta.url));
const queryString = mobileRequire('query-string');
const queryRequire = createRequire(mobileRequire.resolve('query-string'));
const decode = queryRequire('decode-uri-component').default;
test('query-string resolves the patched decoder and preserves ordinary deep-link parameters', () => {
  assert.equal(JSON.parse(readFileSync(join(dirname(queryRequire.resolve('decode-uri-component')), 'package.json'), 'utf8')).version, '0.5.0');
  const parsed = queryString.parse('region=Dar%20es%20Salaam&locale=sw&query=msaada+wa+kisheria&accent=%C3%A9');
  assert.equal(parsed.region, 'Dar es Salaam');
  assert.equal(parsed.locale, 'sw');
  assert.equal(parsed.query, 'msaada wa kisheria');
  assert.equal(parsed.accent, '\u00e9');
});
test('malformed percent escapes remain non-throwing, including the advisory input pattern', () => {
  for (const value of ['%', '%E0%A4%A', '%FF', '%C3', '%EE'.repeat(100_000)]) {
    assert.equal(typeof decode(value), 'string');
    assert.equal(typeof queryString.parse(`q=${value}`).q, 'string');
  }
});
