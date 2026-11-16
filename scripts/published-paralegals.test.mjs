import test from 'node:test';import assert from 'node:assert/strict';import {loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const {preparePublishedParalegals,publishedParalegalMatches,readPublishedParalegals}=loadHandlerModule('convex/lib/publishedParalegals.ts');
const person=(extra={})=>({_id:'fixture-a',fullName:'Fictional A',phone:'0600000001',region:'Dar es Salaam',district:'Ilala',ward:'Ukonga',email:'PRIVATE-NOT-RETURNED',age:55,gender:'PRIVATE-NOT-RETURNED',isVerified:true,availabilityStatus:'accepting_cases',...extra});
test('published contacts expose minimal fields and do not inherit claims of current availability or platform verification',()=>{
 const result=preparePublishedParalegals([person()]);assert.equal(result.contacts[0].phone,'+255600000001');assert.equal(result.contacts[0].availability,'unconfirmed');assert.equal(result.contacts[0].platformVerified,false);assert.doesNotMatch(JSON.stringify(result.contacts),/PRIVATE|email|age|gender|accepting_cases/);
});
test('bad numbers, exact duplicates, conflicting areas and shared numbers cannot become unqualified contact matches',()=>{
 const result=preparePublishedParalegals([person(),person({_id:'duplicate'}),person({_id:'bad',fullName:'Fictional B',phone:'06000000010600000002'})]);assert.equal(result.contacts.length,1);assert.equal(result.stats.invalid,1);assert.equal(result.stats.duplicates,1);
 assert.equal(preparePublishedParalegals([person(),person({_id:'different-area',district:'Kinondoni'})]).contacts.length,0);
 assert.equal(preparePublishedParalegals([person(),person({_id:'different-name',fullName:'Fictional B'})]).contacts.length,0);
});
test('public contacts match their recorded areas and never invent a neighbouring location',()=>{
 const {contacts}=preparePublishedParalegals([person()]);assert.equal(publishedParalegalMatches(contacts,undefined,'Kata ya Ukonga').length,1);assert.equal(publishedParalegalMatches(contacts,'Dar','Ilala').length,1);assert.equal(publishedParalegalMatches(contacts,undefined,'Kinondoni').length,0);
});
test('disabled connector cannot call any external service',async()=>{
 const saved=process.env.LSF_PUBLIC_PARALEGAL_DIRECTORY_ENABLED,original=globalThis.fetch;delete process.env.LSF_PUBLIC_PARALEGAL_DIRECTORY_ENABLED;
 try{globalThis.fetch=()=>{throw Error('Must not fetch');};assert.equal((await readPublishedParalegals()).available,false);}finally{globalThis.fetch=original;if(saved===undefined)delete process.env.LSF_PUBLIC_PARALEGAL_DIRECTORY_ENABLED;else process.env.LSF_PUBLIC_PARALEGAL_DIRECTORY_ENABLED=saved;}
});
