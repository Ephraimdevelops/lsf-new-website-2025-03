import test from 'node:test';
import assert from 'node:assert/strict';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
import { sourceMetadataSnapshot } from '../convex/lib/saadaSourceMetadata.ts';
import { requireReadySourceForApproval } from '../convex/lib/saadaSourceLifecycle.ts';
const handlers = loadHandlerModule('convex/sara.ts');
const metadata = () => ({ title:'Test source',publisher:'Published authority',jurisdiction:'tanzania_mainland',language:'en',contentCategory:'procedure',versionLabel:'R.E. 2023',reviewDueAt:Date.now()+86400000 });
async function setup() {
 const h=harness(),admin=await h.user('admin'),original=metadata();
 const id=await h.db.insert('documents',{...original,storageId:'original-pdf',text:'Unchanged source text',indexingStatus:'ready',processedAt:Date.now(),approvalStatus:'pending',uploadedByClerkId:'original-uploader'});
 return {h,admin,id,args:{id,expectedSnapshot:sourceMetadataSnapshot(original),reason:'Verified the publisher attribution from the original PDF.',metadata:{...original,publisher:'Corrected publisher'}}};
}
test('draft corrections require admin, keep content and independence, and reject stale edits',async()=>{
 const {h,admin,id,args}=await setup();
 for(const actor of [null,await h.user('user'),await h.user('staff')])await assert.rejects(h.invoke(handlers.updatePendingSourceMetadata,args,actor),/Unauthorized|Forbidden/);
 await h.invoke(handlers.updatePendingSourceMetadata,args,admin);
 const doc=await h.db.get(id);assert.equal(doc.publisher,'Corrected publisher');assert.equal(doc.storageId,'original-pdf');assert.equal(doc.text,'Unchanged source text');assert.equal(doc.uploadedByClerkId,'original-uploader');assert.equal(doc.approvalStatus,'pending');assert.equal(doc.indexingStatus,'ready');
 await assert.rejects(h.invoke(handlers.updatePendingSourceMetadata,args,admin),/metadata changed/);
 assert.equal((await h.db.query('audit_logs').collect()).filter(r=>r.action==='saada.source_metadata_corrected').length,1);
});
test('approved or indexing sources cannot be relabelled and invalid metadata cannot be saved',async()=>{
 const {h,admin,id,args}=await setup();
 for(const changes of [{approvalStatus:'approved'},{approvalStatus:'pending',indexingStatus:'processing'}]){await h.db.patch(id,changes);await assert.rejects(h.invoke(handlers.updatePendingSourceMetadata,args,admin),/indexed pending/);}
 await h.db.patch(id,{approvalStatus:'pending',indexingStatus:'ready'});
 for(const changes of [{publisher:' '},{reviewDueAt:1},{sourceUrl:'javascript:alert(1)'},{sourceUrl:'https://user:password@example.org/'},{versionLabel:'x'.repeat(81)},{effectiveDate:'2026-02-30'}])await assert.rejects(h.invoke(handlers.updatePendingSourceMetadata,{...args,metadata:{...args.metadata,...changes}},admin));
 await assert.rejects(h.invoke(handlers.updatePendingSourceMetadata,{...args,reason:'yes'},admin),/correction reason/);
});
test('unresolved repository attribution cannot pass legal approval readiness',()=>{
 assert.throws(()=>requireReadySourceForApproval({...metadata(),publisher:'Repository: official.example; publisher review pending',indexingStatus:'ready',processedAt:Date.now()},true,Date.now()),/publisher attribution/);
});

test('curation flags are admin-only, audited, block approval and can be resolved without approving',async()=>{
 const {h,admin,id}=await setup();
 const args={id,flags:['Confirm source identity'],note:'The title and official reference need reconciliation.'};
 await assert.rejects(h.invoke(handlers.flagDocument,args,await h.user('staff')),/Forbidden/);
 await h.invoke(handlers.flagDocument,args,admin);
 await assert.rejects(h.invoke(handlers.reviewDocument,{id,decision:'approved',note:'Reviewed the document and all its current metadata.'},admin),/curation flags/);
 await h.invoke(handlers.flagDocument,{...args,flags:[],note:'Reconciled the original title with the publisher record.'},admin);
 assert.deepEqual((await h.db.get(id)).curationFlags,[]);
 assert.equal((await h.db.get(id)).approvalStatus,'pending');
 assert.equal((await h.db.query('audit_logs').collect()).filter(x=>x.action==='saada.source_curated').length,2);
});
test('removing a pending source retains source text and storage and records the reason',async()=>{
 const {h,admin,id}=await setup();
 await h.invoke(handlers.withdrawDocument,{id,reason:'Owner requested removing court-case references from active knowledge.'},admin);
 const doc=await h.db.get(id);assert.equal(doc.approvalStatus,'withdrawn');assert.equal(doc.storageId,'original-pdf');assert.equal(doc.text,'Unchanged source text');
 assert.equal((await h.db.query('audit_logs').collect()).filter(x=>x.action==='saada.document_withdrawn').length,1);
});

test('read-only approval guidance explains uploader, curation and provenance blockers before submission',async()=>{
 const {sourceApprovalBlockers}=loadHandlerModule('convex/lib/sourceApprovalReadiness.ts');
 const source={...metadata(),approvalStatus:'pending',indexingStatus:'ready',processedAt:Date.now(),uploadedByClerkId:'uploader',curationFlags:['Check original'],publisher:'Repository: source; publisher review pending',jurisdiction:'other'};
 const reasons=sourceApprovalBlockers(source,'uploader');assert.ok(reasons.some(r=>/different administrator/.test(r)));assert.ok(reasons.some(r=>/highlighted/.test(r)));assert.ok(reasons.some(r=>/publisher/.test(r)));assert.ok(reasons.some(r=>/Mainland/.test(r)));
 assert.deepEqual(sourceApprovalBlockers({...source,publisher:'Government',jurisdiction:'national',curationFlags:[]},'independent-reviewer'),[]);
});
