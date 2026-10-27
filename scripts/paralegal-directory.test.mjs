import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';

const bundle = await build({ entryPoints: ['mobile/src/paralegalDirectory.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { matchesParalegal, paralegalAvailabilityLabel } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const person = { fullName: 'Synthetic Person', region: 'Dar es Salaam', district: 'Ilala', ward: 'Kariakoo', specializations: ['Employment'], languages: ['Kiswahili'], availabilityStatus: 'accepting_cases' };

test('search finds names, administrative areas, support topics and languages', () => {
  for (const query of [' synthetic ', 'DAR', 'Ilala', 'Kariakoo', 'employment', 'Kiswahili', '']) assert.equal(matchesParalegal(person, query, '', false), true);
  assert.equal(matchesParalegal(person, 'no match', '', false), false);
});
test('region and accepting filters combine, with unknown availability excluded', () => {
  assert.equal(matchesParalegal(person, 'employment', 'Dar es Salaam', true), true);
  assert.equal(matchesParalegal(person, '', 'Arusha', false), false);
  for (const status of ['limited', 'paused', 'unavailable', undefined]) assert.equal(matchesParalegal({ ...person, availabilityStatus: status }, '', '', true), false);
  assert.equal(matchesParalegal({ fullName: 'Another', region: '', district: '' }, 'another', '', false), true);
});
test('unknown availability never promises that a provider is accepting requests', () => {
  for (const status of [undefined, 'unknown', 'unexpected']) {
    assert.equal(paralegalAvailabilityLabel(status, 'en'), 'Check availability');
    assert.equal(paralegalAvailabilityLabel(status, 'sw'), 'Thibitisha upatikanaji');
  }
  assert.equal(paralegalAvailabilityLabel('accepting_cases', 'en'), 'Accepting new requests');
});
