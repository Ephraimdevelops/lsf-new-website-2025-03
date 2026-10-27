import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateResearchEntry} from '../convex/lib/researchEntry.ts';
const entries=JSON.parse(readFileSync(new URL('../docs/haki-yangu/upload-preparation-2026-10-07/directory-research-import.json',import.meta.url),'utf8')).entries;
test('71 staged inputs preserve provenance without inventing live service records',()=>{
 assert.equal(entries.length,71);assert.equal(new Set(entries.map(e=>e.externalKey)).size,71);
 assert.equal(entries.filter(e=>e.kind==='pathway').length,34);
 for(const entry of entries){assert.doesNotThrow(()=>validateResearchEntry(entry));assert.equal(JSON.parse(entry.originalRecord).productionEligible,false);}
});
test('research rejects unsafe links, unsupported record kinds and excessive provenance',()=>{
 assert.throws(()=>validateResearchEntry({...entries[0],sourceUrls:['javascript:alert(1)']}));
 assert.throws(()=>validateResearchEntry({...entries[0],kind:'verified_service'}));
 assert.throws(()=>validateResearchEntry({...entries[0],originalRecord:'x'.repeat(50001)}));
});
