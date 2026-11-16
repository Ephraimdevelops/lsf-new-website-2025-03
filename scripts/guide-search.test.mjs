import test from 'node:test';
import assert from 'node:assert/strict';
import { searchCurrentGuides } from '../convex/lib/guideSearch.ts';
const now=1000;
const guide={ titleEn:'Unpaid wages',titleSw:'Mshahara haujalipwa',summaryEn:'Request payment records.',summarySw:'Andaa hati za malipo.',category:'Employment',jurisdiction:'tanzania_mainland',reviewDueAt:2000,status:'approved' };
test('search excludes drafts, removed, rejected, expired guides and wrong jurisdictions',()=>{
 const records=[guide,...['pending','retired','rejected'].map(status=>({...guide,status})),{...guide,reviewDueAt:now},{...guide,jurisdiction:'zanzibar'}];
 assert.deepEqual(searchCurrentGuides(records,'mshahara','tanzania_mainland',now),[guide]);
});
test('bilingual search returns national and requested jurisdiction only, capped at ten',()=>{
 assert.equal(searchCurrentGuides([{...guide,jurisdiction:'national'}],'wages','zanzibar',now).length,1);
 assert.equal(searchCurrentGuides(Array(15).fill(guide),'mshahara',undefined,now).length,10);
 assert.equal(searchCurrentGuides([guide],'eviction',undefined,now).length,0);
});
test('full questions ignore generic words and match tenant/rent vocabulary across both languages',()=>{
 const tenancy={...guide,titleEn:'Rent and deposits',titleSw:'Kodi ya nyumba',summaryEn:'Tenancy information',summarySw:'Upangaji',category:'Land'};
 assert.deepEqual(searchCurrentGuides([guide,tenancy],'Help me understand my rights as a tenant',undefined,now),[tenancy]);
 assert.deepEqual(searchCurrentGuides([guide,tenancy],'Help me understand my rights',undefined,now),[]);
 assert.deepEqual(searchCurrentGuides([guide,tenancy],'Nisaidie kuhusu upangaji',undefined,now),[tenancy]);
});

test('an LSF office/contact question cannot turn generic guide wording into legal evidence',()=>{
 const rows=[{titleEn:'Disability support',titleSw:'Msaada',summaryEn:'Contact the LSF office for information.',summarySw:'Wasiliana na ofisi ya LSF.',category:'other',jurisdiction:'national',reviewDueAt:Date.now()+86400000,status:'approved'}];
 assert.deepEqual(searchCurrentGuides(rows,'Where is the LSF office and how can I contact LSF?'),[]);
});

test('a word fragment or a lone generic body overlap cannot qualify an unrelated guide',()=>{
 const unrelated={...guide,titleEn:'Disability benefits',titleSw:'Ulemavu',category:'Disability',summaryEn:'Contact an office if you work.',summarySw:''};
 assert.deepEqual(searchCurrentGuides([unrelated],'Which Act applies?',undefined,now),[]);
 assert.deepEqual(searchCurrentGuides([unrelated],'I work in Kinondoni and have unpaid salary',undefined,now),[]);
 assert.deepEqual(searchCurrentGuides([guide],'unpaid wages',undefined,now),[guide]);
});

test('personal memory questions do not match a guide merely through pronouns',()=>{
 const fixture={titleEn:'I need support with disability access',titleSw:'Nahitaji msaada kuhusu ulemavu',summaryEn:'Accessible public services',summarySw:'Huduma zinazofikika',category:'Disability',jurisdiction:'zanzibar',status:'approved',reviewDueAt:Date.now()+86400000};
 assert.deepEqual(searchCurrentGuides([fixture],'What location is currently saved in my chat memory?'),[]);
});

test('a factual wage request cannot retrieve disability guidance through generic preparation words',()=>{
 const fixture={titleEn:'Disability and access',titleSw:'Ulemavu na huduma',summaryEn:'Prepare a factual request with details.',summarySw:'Andaa ombi lenye maelezo.',category:'Disability',jurisdiction:'zanzibar',status:'approved',reviewDueAt:Date.now()+86400000};
 assert.deepEqual(searchCurrentGuides([fixture],'My name is Asha. I am in Kinondoni and want to prepare a factual request about unpaid wages.'),[]);
});
