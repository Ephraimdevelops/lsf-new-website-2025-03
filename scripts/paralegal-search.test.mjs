import test from 'node:test';import assert from 'node:assert/strict';import {loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const {matchesParalegalArea}=loadHandlerModule('convex/lib/paralegalSearch.ts');
const person={region:'Dar es Salaam',district:'Ilala',ward:'Ukonga'};
test('AI location search accepts a recorded ward without pretending it is a district',()=>{
 for(const value of ['Ukonga',' KATA YA UKONGA ','ukonga ward','Ilala','Ilala MC','Ilala DC','WILAYA YA ILALA','Dar','DSM','Dar  es  Salaam'])assert.equal(matchesParalegalArea(person,undefined,value),true);
 assert.equal(matchesParalegalArea(person,'Ukonga'),true);assert.equal(matchesParalegalArea(person,'Dar','Ukonga'),true);
});
test('unknown or ambiguous spelling does not silently change a persons location',()=>{
 for(const value of ['Ukongaa','Kinondoni','Arusha','Kigamboni'])assert.equal(matchesParalegalArea(person,undefined,value),false);
 assert.equal(matchesParalegalArea(person,'Arusha','Ukonga'),false);assert.equal(matchesParalegalArea(person),true);
});
