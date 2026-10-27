import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createScannerServer, scannerVersion } from '../services/private-scanner/server.mjs';
import { createHash } from 'node:crypto';

const token = 'synthetic-test-only-credential-at-least-32';
async function fixture(command, run, options = {}) {
  const server = createScannerServer({ token, command, ...options });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const url = `http://127.0.0.1:${server.address().port}/scan`;
  const post = (body, auth = token, type) => fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${auth}`, ...(type ? { 'Content-Type': type } : {}) }, body });
  try { await run(post); } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}
const version = () => `ClamAV 1.4.3/12345/${new Date().toUTCString()}`;
test('scanner accepts only authenticated clean results and hashes the exact bytes', async () => {
  await fixture(async name => name === 'VERSION' ? version() : 'stream: OK', async post => {
    assert.equal((await post('synthetic', 'wrong')).status, 401);
    const response = await post('synthetic');
    const result = await response.json();
    assert.equal(result.clean, true);
    assert.equal(result.sha256, createHash('sha256').update('synthetic').digest('hex'));
  });
});

test('fetch transport pins its source and verifies exact size/hash before scanning', async () => {
  const bytes = Buffer.from('Synthetic reference payload');
  const input = { capability: 'a'.repeat(64), sha256: createHash('sha256').update(bytes).digest('hex'), size: bytes.length };
  const sourceEndpoint = 'https://development.convex.site/secure-scan-source';
  let scans = 0; let fetched = 0;
  await fixture(async name => { if (name === 'VERSION') return version(); scans++; return 'stream: OK'; }, async post => {
    assert.equal((await post('raw')).status, 415);
    const response = await post(JSON.stringify(input), token, 'application/json');
    assert.equal(response.status, 200);
    assert.equal((await response.json()).sha256, input.sha256);
    assert.equal(scans, 1);
    assert.equal(fetched, 1);
    assert.equal((await post(JSON.stringify({ ...input, url: 'https://untrusted.test' }), token, 'application/json')).status, 400);
    assert.equal(fetched, 1);
  }, { referenceOnly: true, sourceEndpoint, fetchSource: async (url, options) => {
    fetched++; assert.equal(url, sourceEndpoint); assert.equal(options.redirect, 'error');
    assert.equal(options.headers.Authorization, `Bearer ${input.capability}`);
    return new Response(bytes);
  } });
  for (const changed of [{ size: bytes.length - 1 }, { sha256: 'b'.repeat(64) }]) {
    await fixture(async () => { throw new Error('Must not scan mismatched bytes'); }, async post => {
      assert.equal((await post(JSON.stringify({ ...input, ...changed }), token, 'application/json')).status, 503);
    }, { sourceEndpoint, fetchSource: async () => new Response(bytes) });
  }
});

test('fetch transport rejects arbitrary hosts, source redirects and unavailable quarantine', async () => {
  for (const sourceEndpoint of ['https://untrusted.test/secure-scan-source', 'http://development.convex.site/secure-scan-source', 'https://development.convex.site/other', 'https://development.convex.site/secure-scan-source?token=unsafe']) {
    assert.throws(() => createScannerServer({ token, sourceEndpoint }), /Invalid private/);
  }
  assert.throws(() => createScannerServer({ token, referenceOnly: true }), /required/);
  const input = { capability: 'a'.repeat(64), sha256: 'b'.repeat(64), size: 10 };
  await fixture(async () => { throw new Error('Must not scan an unavailable source'); }, async post => {
    assert.equal((await post(JSON.stringify(input), token, 'application/json')).status, 503);
  }, { sourceEndpoint: 'https://development.convex.site/secure-scan-source', fetchSource: async () => new Response(null, { status: 404 }) });
});
test('malware and scan-limit verdicts are rejected, not interpreted as clean', async () => {
  for (const verdict of ['stream: Eicar-Signature FOUND', 'stream: Heuristics.Limits.Exceeded FOUND']) {
    await fixture(async name => name === 'VERSION' ? version() : verdict, async post => {
      assert.equal((await (await post('synthetic')).json()).clean, false);
    });
  }
});
test('engine errors and stale definitions fail closed', async () => {
  for (const command of [async () => { throw new Error('Synthetic outage'); }, async name => name === 'VERSION' ? version() : 'stream: ERROR']) {
    await fixture(command, async post => assert.equal((await post('synthetic')).status, 503));
  }
  assert.throws(() => scannerVersion('ClamAV 1.4.3/123/Mon Jan 01 00:00:00 2024'), /stale/);
});
test('scanner enforces body size and refuses empty data', async () => {
  await fixture(async name => name === 'VERSION' ? version() : 'stream: OK', async post => {
    assert.equal((await post('')).status, 400);
    assert.equal((await post('12345')).status, 413);
  }, { maximum: 4 });
});

test('scan limits and encryption remain rejected and are distinguishable for safe recovery',async()=>{
 for(const [verdict,inspection] of [['stream: Heuristics.Limits.Exceeded.MaxScanTime FOUND','inspection_limit'],['stream: Heuristics.Encrypted.PDF FOUND','encrypted'],['stream: Synthetic.Signature FOUND','rejected']]){
  await fixture(async name=>name==='VERSION'?version():verdict,async post=>{const result=await (await post('synthetic')).json();assert.equal(result.clean,false);assert.equal(result.inspection,inspection);});
 }
});
