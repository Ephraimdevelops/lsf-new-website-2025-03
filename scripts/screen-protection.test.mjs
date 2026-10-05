import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const dir = await mkdtemp(join(tmpdir(), 'haki-protection-'));
await build({ entryPoints: ['mobile/src/screenProtection.ts'], bundle: true, platform: 'node', format: 'esm', outfile: join(dir, 'controller.mjs') });
const { createScreenProtection } = await import(pathToFileURL(join(dir, 'controller.mjs')).href);
await rm(dir, { recursive: true });
test('overlapping sensitive screens protect once and release only after last blur', async () => {
  const calls = [];
  const controller = createScreenProtection({ enable: async () => calls.push('on'), disable: async () => calls.push('off') });
  const first = controller.acquire('saada'); await controller.settled();
  const second = controller.acquire('case'); await controller.settled();
  first(); await controller.settled(); assert.deepEqual(calls, ['on']);
  second(); await controller.settled(); assert.deepEqual(calls, ['on', 'off']);
});
test('blur while native enable is pending ends unprotected without racing', async () => {
  const calls = []; let resolve;
  const gate = new Promise(r => { resolve = r; });
  const controller = createScreenProtection({ enable: async () => { calls.push('on'); await gate; }, disable: async () => calls.push('off') });
  const release = controller.acquire('saada'); await Promise.resolve();
  release(); resolve(); await controller.settled();
  assert.deepEqual(calls, ['on', 'off']);
});
test('unsupported runtime does not poison future transitions', async () => {
  let attempts = 0; const calls = [];
  const controller = createScreenProtection({ enable: async () => { if (++attempts === 1) throw new Error('unavailable'); calls.push('on'); }, disable: async () => calls.push('off') });
  const first = controller.acquire('saada'); await controller.settled(); first(); await controller.settled();
  const second = controller.acquire('case'); await controller.settled(); second(); await controller.settled();
  assert.deepEqual(calls, ['on', 'off']);
});
