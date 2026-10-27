import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

// query-string 7 is CommonJS; the patched decoder 0.5 exports an ESM default.
// Keep the existing parser API and the upstream decoder, changing only interop.
const require = createRequire(new URL('../package.json', import.meta.url));
const entry = require.resolve('query-string');
const packageJson = JSON.parse(readFileSync(join(dirname(entry), 'package.json'), 'utf8'));
if (packageJson.version !== '7.1.3') throw new Error('Review the decoder compatibility patch for this query-string version.');
const before = "const decodeComponent = require('decode-uri-component');";
const after = "const decodeModule = require('decode-uri-component');\nconst decodeComponent = typeof decodeModule === 'function' ? decodeModule : decodeModule.default;";
const source = readFileSync(entry, 'utf8');
if (source.includes(after)) process.exit(0);
if (source.split(before).length !== 2) throw new Error('Unexpected query-string source; compatibility patch was not applied.');
const decoder = createRequire(entry)('decode-uri-component');
if (typeof decoder.default !== 'function') throw new Error('Unexpected decoder exports.');
writeFileSync(entry, source.replace(before, after));
console.log('Applied query-string decoder module compatibility patch.');
