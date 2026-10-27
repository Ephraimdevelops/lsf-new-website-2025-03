import { cp, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { setTimeout as pause } from 'node:timers/promises';
import { clamdCommand, createScannerServer, scannerVersion } from './server.mjs';

function refreshDefinitions() {
  return new Promise((resolve, reject) => {
    const child = spawn('freshclam', ['--config-file=/app/freshclam.vercel.conf'], { stdio: 'ignore', timeout: 120_000 });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error('Definition update unavailable')));
  });
}

let daemon;
let ready;
let retryAfter = 0;
const command = (name, bytes) => clamdCommand(name, bytes, { host: '127.0.0.1', timeoutMs: 30_000 });
async function initialize() {
  await mkdir('/tmp/haki-definitions', { recursive: true });
  await cp('/var/lib/clamav', '/tmp/haki-definitions', { recursive: true });
  // A cold instance must not rely on the image's build-date definitions.
  await refreshDefinitions();
  daemon = spawn('clamd', ['--config-file=/app/clamd.vercel.conf'], { stdio: 'ignore' });
  let failed = false;
  daemon.once('error', () => { failed = true; });
  daemon.once('exit', () => { failed = true; });
  for (let attempt = 0; attempt < 60; attempt++) {
    if (failed) throw new Error('Scanner initialization failed');
    try { scannerVersion(await command('VERSION')); return; } catch {}
    await pause(1000);
  }
  throw new Error('Scanner initialization timed out');
}

function scannerReady() {
  if (daemon && (daemon.exitCode !== null || daemon.signalCode !== null)) ready = undefined;
  if (!ready) {
    if (Date.now() < retryAfter) return Promise.reject(new Error('Scanner retry deferred'));
    ready = initialize().catch(error => {
      daemon?.kill('SIGTERM'); daemon = undefined; ready = undefined;
      retryAfter = Date.now() + 60_000;
      console.error('Private scanner not ready; requests fail closed.');
      throw error;
    });
  }
  return ready;
}

const server = createScannerServer({
  token: process.env.PRIVATE_SCANNER_TOKEN,
  sourceEndpoint: process.env.SCAN_SOURCE_URL,
  referenceOnly: true,
  concurrency: 1,
  // Wrong-token traffic must not load the engine or trigger definition downloads.
  command: async (name, bytes) => { await scannerReady(); return command(name, bytes); },
});
server.listen(Number(process.env.PORT ?? 8080), '0.0.0.0');
const updater = setInterval(() => ready?.then(refreshDefinitions).catch(() => {
  console.error('Definition update unavailable; freshness checks remain enforced.');
}), 60 * 60 * 1000);
updater.unref();
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  clearInterval(updater);
  daemon?.kill('SIGTERM');
  server.close(() => process.exit(0));
});
