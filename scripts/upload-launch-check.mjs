import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFileSync, unlinkSync } from 'node:fs';

try { process.loadEnvFile('.env.local'); } catch {}
const deployment = process.env.CONVEX_DEPLOYMENT ?? '';
if (!deployment.startsWith('dev:')) throw new Error('This rehearsal targets only the configured development backend. Production requires a separately reviewed deployment.');
const name = deployment.slice(4);
if (!/^[a-z0-9-]+$/.test(name)) throw new Error('Invalid development deployment name.');
const site = `https://${name}.convex.site`;
function setting(key) {
  try {
    const value = execFileSync('npx', ['convex', 'env', 'get', key], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30_000 }).trim();
    return { read: true, value };
  } catch { return { read: false, value: '' }; }
}
const endpoint = setting('PRIVATE_SCANNER_URL');
const token = setting('PRIVATE_SCANNER_TOKEN');
const transport = setting('PRIVATE_SCANNER_TRANSPORT');
const validEndpoint = (() => { try { return new URL(endpoint.value).protocol === 'https:'; } catch { return false; } })();
const validToken = token.read && token.value.length >= 32 && !/not found|not set|undefined/i.test(token.value);
const checks = [
  { name: 'Private HTTPS scanner configured', passed: endpoint.read && validEndpoint },
  { name: 'Private scanner credential configured', passed: validToken },
];
async function check(name, work) {
  try { checks.push({ name, passed: await work() }); }
  catch { checks.push({ name, passed: false }); }
}
let deployedControls = [];
await check('Upload lifecycle controls deployed as internal transactional handlers', async () => {
  // CLI stdout can be truncated on exit; read its complete generated artifact.
  const output = execFileSync('npx', ['convex', 'function-spec', '--file'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30_000 });
  const file = output.match(/function_spec_[0-9]+\.json/)?.[0];
  if (!file) return false;
  let spec;
  try { spec = JSON.parse(readFileSync(file, 'utf8')); } finally { unlinkSync(file); }
  if (spec.url !== `https://${name}.convex.cloud`) return false;
  const expected = { authorizeSource: 'Query', claim: 'Mutation', finish: 'Mutation', reserveAiRequest: 'Mutation', reserveScan: 'Mutation', expireStaleTickets: 'Mutation', stageForScan: 'Mutation', claimScanSource: 'Mutation', rejectedQuarantine: 'Query', cleanupQuarantine: 'Action', acknowledgeQuarantineCleanup: 'Mutation', retryQuarantineCleanup: 'Mutation' };
  deployedControls = Object.entries(expected).map(([handler, type]) => {
    const entry = spec.functions.find(fn => fn.identifier === `managedUploads.js:${handler}`);
    return { handler, internal: entry?.visibility?.kind === 'internal', correctType: entry?.functionType === type };
  });
  return deployedControls.every(control => control.internal && control.correctType);
});
await check('Development upload route deployed', async () => (await fetch(`${site}/secure-upload`, { method: 'OPTIONS', signal: AbortSignal.timeout(15_000) })).status === 204);
let gatewayStatus;
await check('Configured gateway rejects an invalid one-use ticket', async () => {
  gatewayStatus = (await fetch(`${site}/secure-upload?ticket=synthetic-invalid-launch-check`, { method: 'POST', body: '%PDF-1.7\nSynthetic only', headers: { 'Content-Type': 'application/pdf' }, signal: AbortSignal.timeout(15_000) })).status;
  return gatewayStatus === 400;
});
let hostedRehearsal;
if (validEndpoint && validToken && transport.value === 'fetch') {
  await check('Hosted fetch-based gateway rehearsal passes all purposes, owner/case/replay denials and EICAR rejection', async () => {
    const output = execFileSync('npx', ['convex', 'run', 'uploadRehearsal:run', '{}', '--deployment-name', name], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 550_000 });
    hostedRehearsal = JSON.parse(output);
    return hostedRehearsal.passed === true;
  });
  await check('Hosted scanner rejects an incorrect credential', async () => (await fetch(endpoint.value, { method: 'POST', body: '{}', headers: { Authorization: 'Bearer synthetic-invalid-credential', 'Content-Type': 'application/json' }, redirect: 'error', signal: AbortSignal.timeout(30_000) })).status === 401);
} else if (validEndpoint && validToken) {
  const scan = async bytes => {
    const response = await fetch(endpoint.value, { method: 'POST', body: bytes, headers: { Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/octet-stream' }, redirect: 'error', signal: AbortSignal.timeout(45_000) });
    if (!response.ok) throw new Error('Scanner unavailable');
    return response.json();
  };
  await check('Hosted scanner accepts clean bytes with matching hash and fresh definitions', async () => {
    const bytes = Buffer.from('Synthetic launch rehearsal. No personal data.');
    const receipt = await scan(bytes);
    return receipt.clean === true && receipt.sha256 === createHash('sha256').update(bytes).digest('hex') && Number.isFinite(receipt.definitionsUpdatedAt) && receipt.definitionsUpdatedAt <= Date.now() + 60_000 && Date.now() - receipt.definitionsUpdatedAt < 48 * 60 * 60 * 1000;
  });
  await check('Hosted scanner rejects harmless EICAR antivirus fixture', async () => {
    const bytes = Buffer.from('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*');
    const receipt = await scan(bytes);
    return receipt.clean === false && receipt.sha256 === createHash('sha256').update(bytes).digest('hex');
  });
} else checks.push({ name: 'Hosted clean/infected scanner rehearsal', passed: false });
const report = { checkedAt: new Date().toISOString(), deployment, site, gatewayStatus, transport: transport.value || 'raw', deployedControls, hostedRehearsal, checks, ready: checks.every(check => check.passed), caveat: 'Synthetic development checks only. Does not prove production deployment, cross-account UI upload completion, legacy rescanning or release approval.' };
for (const check of checks) console.log(`${check.passed ? 'PASS' : 'OPEN'} ${check.name}`);
console.log(`Gateway status: ${gatewayStatus ?? 'unavailable'}. Secret values are never printed or saved.`);
if (process.argv[2]) await writeFile(process.argv[2], JSON.stringify(report, null, 2) + '\n');
if (!report.ready) process.exitCode = 1;
