import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const exportDirectory = process.argv[2];
if (!exportDirectory) throw new Error('Supply an Expo release export directory with source maps.');
const roots = {
  braces: { advisory: 'GHSA-vfj7-8cjw-p6xm', severity: 'high', decision: 'No upstream patch. Exclude from shipped bundles; use trusted build inputs and do not publicly expose Metro.', reviewBy: '2026-10-15' },
  'node-forge': { advisory: 'GHSA-86w9-cpqp-85rv', severity: 'high', decision: 'No upstream patch. Build-only signing tooling; require trusted signing certificates and keys. Do not accept attacker-supplied certificates.', reviewBy: '2026-10-15' },
  uuid: { advisory: 'GHSA-w5hq-g745-h8pq', severity: 'moderate', decision: 'xcode uses v4() without a caller buffer; affected v3/v5/v6 paths not called. Exclude xcode/uuid from shipped bundles; avoid breaking native tooling with a forced major override.', reviewBy: '2026-10-15' },
};
let audit;
try { audit = JSON.parse(execFileSync('npm', ['audit', '--json'], { cwd: resolve('mobile'), encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })); }
catch (error) { if (!error.stdout) throw error; audit = JSON.parse(error.stdout); }
if (!audit.vulnerabilities || audit.error) throw new Error('Audit data unavailable.');
const bundleEvidence = [];
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await inspect(path);
    else if (entry.name.endsWith('.js.map')) {
      const raw = await readFile(path);
      const map = JSON.parse(raw);
      const parser = map.sources.findIndex(source => source.replaceAll('\\', '/').includes('node_modules/query-string/index.js'));
      if (parser >= 0) throw new Error(`Legacy query-string parser reintroduced; review decoder security: ${path}`);
      const occurrences = Object.fromEntries(Object.keys(roots).map(name => [name, map.sources.filter(source => source.replaceAll('\\', '/').includes(`node_modules/${name}/`)).length]));
      if (Object.values(occurrences).some(Boolean)) throw new Error(`Vulnerable package found in release map: ${path}`);
      bundleEvidence.push({ file: path.slice(resolve(exportDirectory).length + 1), sha256: createHash('sha256').update(raw).digest('hex'), sourceCount: map.sources.length, occurrences, decoderInterop: parser >= 0 ? 'verified' : 'parser-not-in-bundle' });
    }
  }
}
await inspect(resolve(exportDirectory));
for (const platform of ['ios', 'android', 'web']) if (!bundleEvidence.some(row => row.file.includes(`/js/${platform}/`))) throw new Error(`Missing ${platform} release source-map evidence.`);
function underlying(name, seen = new Set()) {
  if (seen.has(name)) return [];
  seen.add(name);
  const item = audit.vulnerabilities[name];
  if (!item) throw new Error(`Missing audit dependency: ${name}`);
  if (Object.hasOwn(roots, name)) {
    const direct = item.via.filter(value => typeof value !== 'string');
    if (direct.length !== 1 || !direct[0].url?.endsWith(`/${roots[name].advisory}`) || item.severity !== roots[name].severity) throw new Error(`Changed direct advisory requires review: ${name}`);
    return [name];
  }
  if (item.via.some(value => typeof value !== 'string')) throw new Error(`New direct advisory requires review: ${name}`);
  return [...new Set(item.via.flatMap(value => underlying(value, new Set(seen))))];
}
const affectedPackages = Object.values(audit.vulnerabilities).map(item => ({ package: item.name, severity: item.severity, isDirect: item.isDirect, nodes: item.nodes, underlying: underlying(item.name), disposition: 'Build-tool exposure only in verified release exports; retained advisory requires upstream monitoring.' }));
if (affectedPackages.some(item => !item.underlying.length)) throw new Error('Unclassified dependency finding.');
const lock = await readFile('mobile/package-lock.json');
const report = { generatedAt: new Date().toISOString(), status: 'triaged-not-zero-advisories', initialAffectedPackages: 35, remaining: audit.metadata.vulnerabilities, lockfileSha256: createHash('sha256').update(lock).digest('hex'), patches: ['@xmldom/xmldom 0.8.15 and 0.9.12', 'brace-expansion 5.0.12', 'source-map-js 1.2.2'], roots, bundleEvidence, affectedPackages, caveat: 'Source-map absence establishes shipped JS reachability, not safety of CI or all future imports. Re-run after dependency or build changes. Risk acceptance and build isolation remain release decisions.' };
if (process.argv[3]) await writeFile(process.argv[3], JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, affectedPackages: affectedPackages.length, underlyingAdvisories: Object.keys(roots).length, verifiedMaps: bundleEvidence.length }));
