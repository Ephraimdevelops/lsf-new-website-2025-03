import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const research=loadHandlerModule('convex/directoryResearch.ts'),guides=loadHandlerModule('convex/publications.ts');
const pack=JSON.parse(readFileSync(new URL('../docs/haki-yangu/upload-preparation-2026-10-07/directory-research-import.json',import.meta.url),'utf8')).entries;
const guide={titleEn:'Unpaid wages question',titleSw:'Swali la mshahara',summaryEn:'Keep payment records.',summarySw:'Hifadhi hati za malipo.',stepsEn:['Prepare employment records.'],stepsSw:['Andaa nyaraka za ajira.'],category:'Work and employment',jurisdiction:'tanzania_mainland',sourceTitle:'Reviewed source',sourceUrl:'https://example.go.tz/law',publisher:'Official publisher',reviewDueAt:Date.now()+86400000*30};
const page={paginationOpts:{cursor:null,numItems:20},archived:false};
test('beneficiary, provider, paralegal, editor and unauthenticated callers cannot manage private directory research',async()=>{
 const h=harness();
 for(const role of [null,'user','provider_staff','paralegal','content_editor','donor','stakeholder']){
  const actor=role?await h.user('user',role==='user'?[]:[role]):null;
  await assert.rejects(h.invoke(research.list,page,actor),/Unauthorized|Forbidden/);
  await assert.rejects(h.invoke(research.importDrafts,{entries:[pack[0]]},actor),/Unauthorized|Forbidden/);
 }
 assert.equal((await h.db.query('directory_research').collect()).length,0);
});
test('staff imports 71 drafts idempotently; supervisor can read but cannot edit, remove or import',async()=>{
 const h=harness(),staff=await h.user('staff'),supervisor=await h.user('user',['supervisor']);
 assert.deepEqual(await h.invoke(research.importDrafts,{entries:pack},staff),{added:71,skipped:0});
 assert.deepEqual(await h.invoke(research.importDrafts,{entries:pack},staff),{added:0,skipped:71});
 const result=await h.invoke(research.list,page,supervisor);assert.equal(result.page.length,20);
 const record=result.page[0];
 await assert.rejects(h.invoke(research.importDrafts,{entries:[pack[0]]},supervisor),/Forbidden/);
 await assert.rejects(h.invoke(research.setArchived,{id:record._id,archived:true,reason:'Duplicate source reference.'},supervisor),/Forbidden/);
 await assert.rejects(h.invoke(research.update,{id:record._id,...pack[0]},supervisor),/Forbidden/);
 assert.equal((await h.invoke(guides.listPublicLegalGuides)).length,0);
});
test('research search finds a match outside the first page and searches contacts',async()=>{
 const h=harness(),staff=await h.user('staff');
 await h.invoke(research.importDrafts,{entries:pack},staff);
 const result=await h.invoke(research.list,{...page,search:pack[0].title},staff);
 assert.ok(result.page.some(record=>record.externalKey===pack[0].externalKey));
 const phoneResult=await h.invoke(research.list,{...page,search:pack[0].phone},staff);assert.ok(phoneResult.page.length>0);
});
test('research edits keep original provenance, removal is recoverable and audited',async()=>{
 const h=harness(),admin=await h.user('admin');await h.invoke(research.importDrafts,{entries:[pack[0]]},admin);
 const record=(await h.invoke(research.list,page,admin)).page[0];
 await assert.rejects(h.invoke(research.update,{id:record._id,...pack[0],originalRecord:'{}'},admin),/provenance/);
 await h.invoke(research.update,{id:record._id,...pack[0],district:'Confirmed test district',phone:''},admin);
 assert.equal((await h.db.get(record._id)).phone,'');
 await h.invoke(research.setArchived,{id:record._id,archived:true,reason:'Duplicate research record.'},admin);
 assert.equal((await h.invoke(research.list,page,admin)).page.length,0);
 await h.invoke(research.setArchived,{id:record._id,archived:false,reason:'Restore for further review.'},admin);
 assert.equal((await h.invoke(research.list,page,admin)).page.length,1);
 assert.equal((await h.db.query('audit_logs').collect()).length,4);
});
test('deleted staff and revoked assignments cannot access management',async()=>{
 const h=harness(),deleted=await h.user('staff',[],true),revoked=await h.user('user');
 await h.db.insert('role_assignments',{userId:revoked,role:'staff',status:'revoked'});
 await assert.rejects(h.invoke(research.list,page,deleted),/Unauthorized/);
 await assert.rejects(h.invoke(research.list,page,revoked),/Forbidden/);
});
test('guide import receipts accurately report retry without extending review date or approving content',async()=>{
 const h=harness(),editor=await h.user('user',['content_editor']);
 const first=await h.invoke(guides.importPreparedLegalGuide,guide,editor);assert.equal(first.created,true);
 const retry=await h.invoke(guides.importPreparedLegalGuide,{...guide,reviewDueAt:guide.reviewDueAt+86400000},editor);
 assert.deepEqual(retry,{id:first.id,created:false});assert.equal((await h.db.get(first.id)).reviewDueAt,guide.reviewDueAt);
 assert.equal((await h.db.get(first.id)).status,'pending');assert.equal((await h.invoke(guides.listPublicLegalGuides)).length,0);
});
test('only author edits pending content; independent admin review controls public visibility and removal',async()=>{
 const h=harness(),editor=await h.user('user',['content_editor']),other=await h.user('user',['content_editor']),admin=await h.user('admin');
 const id=await h.invoke(guides.submitLegalGuide,guide,editor);
 await assert.rejects(h.invoke(guides.updatePendingLegalGuide,{id,...guide},other),/own|author|pending/i);
 await h.invoke(guides.updatePendingLegalGuide,{id,...guide,summaryEn:'Updated payment records.'},editor);
 await h.invoke(guides.reviewLegalGuide,{id,decision:'approved',note:'Independent source and language review.'},admin);
 const publicGuides=await h.invoke(guides.searchPublicLegalGuides,{search:'mshahara',jurisdiction:'tanzania_mainland'});
 assert.equal(publicGuides.length,1);assert.equal(publicGuides[0].submittedBy,undefined);assert.equal(publicGuides[0].reviewNote,undefined);
 await assert.rejects(h.invoke(guides.archiveLegalGuide,{id,reason:'Remove obsolete guidance.'},editor),/administrator/);
 await h.invoke(guides.archiveLegalGuide,{id,reason:'Remove obsolete guidance.'},admin);
 assert.equal((await h.invoke(guides.searchPublicLegalGuides,{search:'mshahara'})).length,0);
 assert.equal((await h.db.get(id)).status,'retired');
});
test('author with admin role cannot approve their own guide; beneficiary cannot submit or edit',async()=>{
 const h=harness(),admin=await h.user('admin'),beneficiary=await h.user('user');const id=await h.invoke(guides.submitLegalGuide,guide,admin);
 await assert.rejects(h.invoke(guides.reviewLegalGuide,{id,decision:'approved',note:'Review of my own content.'},admin),/different administrator/);
 await assert.rejects(h.invoke(guides.submitLegalGuide,guide,beneficiary),/Forbidden/);
 await assert.rejects(h.invoke(guides.updatePendingLegalGuide,{id,...guide},beneficiary),/Forbidden/);
});
