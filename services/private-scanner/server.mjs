import http from 'node:http';
import net from 'node:net';
import { createHash, timingSafeEqual } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export function clamdCommand(command, bytes, { host = 'clamav', port = 3310, timeoutMs = 30_000 } = {}) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port });
    let reply = Buffer.alloc(0);
    let completed = false;
    const fail = error => { if (completed) return; completed = true; socket.destroy(); reject(error); };
    socket.setTimeout(timeoutMs, () => fail(new Error('Scanner timeout')));
    socket.on('error', fail);
    socket.on('connect', () => {
      socket.write(`z${command}\0`);
      if (bytes) {
        for (let offset = 0; offset < bytes.length; offset += 64 * 1024) {
          const chunk = bytes.subarray(offset, offset + 64 * 1024);
          const length = Buffer.alloc(4); length.writeUInt32BE(chunk.length);
          socket.write(length); socket.write(chunk);
        }
        socket.write(Buffer.alloc(4));
      }
    });
    socket.on('data', chunk => {
      reply = Buffer.concat([reply, chunk]);
      if (reply.length > 16 * 1024) return fail(new Error('Invalid scanner response'));
      if (reply.includes(0)) { completed = true; socket.destroy(); resolve(reply.toString('utf8').replace(/\0.*$/s, '').trim()); }
    });
    socket.on('end', () => { if (!reply.includes(0)) fail(new Error('Incomplete scanner response')); });
    socket.on('close', () => { if (!completed) fail(new Error('Scanner disconnected')); });
  });
}

export function scannerVersion(version, now = Date.now()) {
  const parts = version.split('/');
  const definitionsUpdatedAt = Date.parse(parts.slice(2).join('/'));
  if (!version.startsWith('ClamAV ') || !Number.isFinite(definitionsUpdatedAt) || definitionsUpdatedAt > now + 60_000 || now - definitionsUpdatedAt > 48 * 60 * 60 * 1000) throw new Error('Scanner definitions are stale or unavailable');
  return { engine: version.slice(0, 200), definitionsUpdatedAt };
}

export function createScannerServer({ token, command = clamdCommand, maximum = 20 * 1024 * 1024, concurrency = 2, sourceEndpoint, fetchSource = fetch, referenceOnly = false } = {}) {
  if (typeof token !== 'string' || token.length < 32) throw new Error('A private scanner token of at least 32 characters is required');
  const expected = Buffer.from(`Bearer ${token}`);
  if (sourceEndpoint) {
    const source = new URL(sourceEndpoint);
    if (source.protocol !== 'https:' || !/^[a-z0-9-]+\.convex\.site$/.test(source.hostname) || source.pathname !== '/secure-scan-source' || source.search || source.hash || source.username || source.password || source.port) throw new Error('Invalid private scan source');
  }
  if (referenceOnly && !sourceEndpoint) throw new Error('A private scan source is required');
  let active = 0;
  const server = http.createServer({ maxHeaderSize: 8192 }, async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    const reply = (status, value) => { response.writeHead(status); response.end(JSON.stringify(value)); };
    const supplied = Buffer.from(request.headers.authorization ?? '');
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) { reply(401, { error: 'Unauthorized' }); request.resume(); return; }
    if (request.method !== 'POST' || request.url !== '/scan') { reply(404, { error: 'Not found' }); request.resume(); return; }
    if (active >= concurrency) { reply(503, { error: 'Scanner busy' }); request.resume(); return; }
    active++;
    try {
      const reference = request.headers['content-type']?.split(';')[0].trim() === 'application/json';
      if (referenceOnly && !reference) { reply(415, { error: 'Reference required' }); request.resume(); return; }
      if (reference && !sourceEndpoint) { reply(415, { error: 'Reference unavailable' }); request.resume(); return; }
      const bodyMaximum = reference ? 2048 : maximum;
      const declared = Number(request.headers['content-length']);
      if (Number.isFinite(declared) && declared > bodyMaximum) { reply(413, { error: 'Size limit' }); request.resume(); return; }
      const chunks = []; let size = 0;
      for await (const chunk of request) {
        size += chunk.length;
        if (size > bodyMaximum) { reply(413, { error: 'Size limit' }); request.destroy(); return; }
        chunks.push(chunk);
      }
      if (!size) { reply(400, { error: 'Empty file' }); return; }
      let bytes = Buffer.concat(chunks);
      if (reference) {
        let input;
        try { input = JSON.parse(bytes.toString('utf8')); } catch { reply(400, { error: 'Invalid reference' }); return; }
        if (!input || Object.keys(input).some(key => !['capability', 'sha256', 'size'].includes(key)) || !/^[a-f0-9]{64}$/.test(input.capability) || !/^[a-f0-9]{64}$/.test(input.sha256) || !Number.isSafeInteger(input.size) || input.size <= 0 || input.size > maximum) { reply(400, { error: 'Invalid reference' }); return; }
        // Never fetch a caller-supplied URL or follow a redirect.
        const source = await fetchSource(sourceEndpoint, { method: 'POST', headers: { Authorization: `Bearer ${input.capability}` }, redirect: 'error', signal: AbortSignal.timeout(30_000) });
        if (!source.ok || !source.body) throw new Error('Private source unavailable');
        const reader = source.body.getReader(); const fetched = []; let fetchedSize = 0;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fetchedSize += value.byteLength;
            if (fetchedSize > input.size || fetchedSize > maximum) { await reader.cancel(); throw new Error('Source size mismatch'); }
            fetched.push(Buffer.from(value));
          }
        } finally { reader.releaseLock(); }
        bytes = Buffer.concat(fetched);
        if (bytes.length !== input.size || createHash('sha256').update(bytes).digest('hex') !== input.sha256) throw new Error('Source integrity mismatch');
      }
      const version = scannerVersion(await command('VERSION'));
      const verdict = await command('INSTREAM', bytes);
      if (verdict !== 'stream: OK' && !/^stream: .+ FOUND$/.test(verdict)) throw new Error('Scanner could not inspect file');
      const inspection = verdict === 'stream: OK' ? 'clean' : /^stream: Heuristics\.Limits\.Exceeded\./.test(verdict) ? 'inspection_limit' : /^stream: Heuristics\.Encrypted\./.test(verdict) ? 'encrypted' : 'rejected';
      reply(200, { clean: verdict === 'stream: OK', inspection, sha256: createHash('sha256').update(bytes).digest('hex'), ...version });
    } catch {
      if (!response.headersSent) reply(503, { error: 'Scanner unavailable' });
    } finally { active--; }
  });
  server.requestTimeout = 20_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5000;
  server.maxConnections = 32;
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const command = (name, bytes) => clamdCommand(name, bytes, { host: process.env.CLAMD_HOST ?? 'clamav', port: Number(process.env.CLAMD_PORT ?? 3310) });
  const server = createScannerServer({ token: process.env.PRIVATE_SCANNER_TOKEN, command });
  server.listen(Number(process.env.PORT ?? 8080), '0.0.0.0');
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}
