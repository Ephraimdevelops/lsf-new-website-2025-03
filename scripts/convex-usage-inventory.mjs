// Read-only after the internal usageInventory:sources query is deployed.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
const { values } = parseArgs({ options: { deployment: { type: 'string' }, output: { type: 'string', default: '/tmp/convex-usage-inventory.json' } } });
let cursor;
const sources = [];
for (let page = 0; page < 200; page++) {
  const flags = values.deployment ? ['--deployment-name', values.deployment] : [];
  const raw = execFileSync('npx', ['convex', 'run', 'usageInventory:sources', JSON.stringify(cursor ? { cursor } : {}), ...flags], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024, timeout: 60000 });
  const result = JSON.parse(raw);
  sources.push(...result.sources);
  if (result.isDone) break;
  if (!result.cursor || result.cursor === cursor || page === 199) throw new Error('Inventory did not finish. No partial report was saved.');
  cursor = result.cursor;
}
const groups = new Map();
for (const source of sources) {
  if (!source.sourceUrl) continue;
  const key = JSON.stringify([source.sourceUrl.trim(), source.versionLabel ?? '']);
  groups.set(key, [...(groups.get(key) ?? []), source.id]);
}
const report = {
  checkedAt: new Date().toISOString(), deployment: values.deployment ?? 'configured development deployment',
  sources: sources.sort((a, b) => b.estimatedChunks - a.estimatedChunks),
  duplicateCandidates: [...groups.values()].filter(ids => ids.length > 1),
  note: 'Candidate groups share a URL and version, not necessarily identical content. Estimates are not billed byte counts. No source bodies, vectors or case records exported. Nothing deleted.',
};
writeFileSync(values.output, JSON.stringify(report, null, 2) + '\n', { mode: 0o600 });
console.log(JSON.stringify({ sources: sources.length, duplicateCandidateGroups: report.duplicateCandidates.length, report: values.output }));
