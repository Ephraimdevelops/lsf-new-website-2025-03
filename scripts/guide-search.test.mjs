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
