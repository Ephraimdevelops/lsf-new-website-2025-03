import { randomBytes, createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const token = randomBytes(32).toString('hex');
const env = { ...process.env, PRIVATE_SCANNER_TOKEN: token };
const compose = ['compose', '-p', 'haki-scanner-verification', '-f', 'services/private-scanner/compose.yaml'];
const run = args => new Promise((resolve, reject) => {
  const child = spawn('docker', [...compose, ...args], { env, stdio: 'inherit' });
  child.on('error', reject);
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Docker verification command failed (${code})`)));
});
try {
  await run(['up', '--build', '-d', '--wait', '--wait-timeout', '360']);
  const scan = async (bytes, credential = token) => fetch('http://127.0.0.1:8088/scan', { method: 'POST', headers: { Authorization: `Bearer ${credential}` }, body: bytes, signal: AbortSignal.timeout(45_000) });
  const clean = Buffer.from('Synthetic scanner verification only. No personal data.');
  const response = await scan(clean);
  assert.equal(response.status, 200);
  const receipt = await response.json();
  assert.equal(receipt.clean, true);
  assert.equal(receipt.sha256, createHash('sha256').update(clean).digest('hex'));
  assert.ok(Date.now() - receipt.definitionsUpdatedAt < 48 * 60 * 60 * 1000);
  // EICAR is the harmless, standardized antivirus test file, not actual malware.
  const eicar = Buffer.from('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*');
  const rejected = await scan(eicar);
  assert.equal(rejected.status, 200);
  assert.equal((await rejected.json()).clean, false);
  assert.equal((await scan(clean, 'incorrect')).status, 401);
  console.log('PASS: real ClamAV clean file, exact SHA-256, fresh definitions, EICAR rejection, wrong-token refusal.');
} finally {
  await run(['down']);
}
