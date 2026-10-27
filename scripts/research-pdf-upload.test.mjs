import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parseResearchPdfManifest, storageChecksumHex } from '../convex/lib/researchPdfManifest.ts';
import { harness, loadHandlerModule } from './test-support/convex-handler-harness.mjs';
const handlers = loadHandlerModule('convex/saadaResearchPdfs.ts');
const manifest = JSON.parse(readFileSync(new URL('../docs/haki-yangu/pdf-upload-preparation-2026-10-07/remaining-127-pdf-manifest.json', import.meta.url)));
const rows = parseResearchPdfManifest(manifest);
test('storage checksums match both observed Convex base64 and hex encodings',()=>{
  for(const row of rows){assert.equal(storageChecksumHex(Buffer.from(row.sha256,'hex').toString('base64')),row.sha256);assert.equal(storageChecksumHex(row.sha256.toUpperCase()),row.sha256);}
  assert.throws(()=>storageChecksumHex('not-a-hash'));
});
function setup() {
  const h = harness(); const files = new Map(); h.db.system = { get: async id => files.get(id) ?? null };
  return { h, files };
}
async function cleanReceipt(h, storageId, ownerId) {
  await h.db.insert('managed_uploads', { storageId, ownerId, status: 'clean', purpose: 'ai_source' });
}
test('all 127 original files match the manifest and preserve unapproved provenance', () => {
  assert.equal(rows.length,127); assert.equal(new Set(rows.map(row=>row.sha256)).size,127);
  for(const row of rows){
    const file=readFileSync(new URL('../docs/haki-yangu/saada-research-pack-2026-10-05/source-files/'+row.filename,import.meta.url));
    assert.equal(createHash('sha256').update(file).digest('hex'),row.sha256);assert.equal(file.length,row.byteSize);
    const original=JSON.parse(row.provenance);assert.equal(original.productionEligible,false);assert.equal(original.approvalStatus,'not_submitted');
  }
  assert.equal(rows.filter(row=>row.byteSize>15*1024*1024).length,2);
});
test('archive APIs reject guests, beneficiaries, providers, editors and supervisors',async()=>{
  const {h}=setup();
  for(const role of [null,'user','provider_staff','content_editor','supervisor']){
    const actor=role?await h.user(role==='user'?'user':'user',role==='user'?[]:[role]):null;
    await assert.rejects(h.invoke(handlers.lookup,{hashes:[rows[0].sha256]},actor),/Unauthorized|Forbidden/);
    await assert.rejects(h.invoke(handlers.record,{...rows[0],storageId:'file:1'},actor),/Unauthorized|Forbidden/);
    await assert.rejects(h.invoke(handlers.listPage,{archived:false,paginationOpts:{cursor:null,numItems:20}},actor),/Unauthorized|Forbidden/);
    await assert.rejects(h.invoke(handlers.setArchived,{id:'source:1',archived:true,reason:'Testing recoverable removal.'},actor),/Unauthorized|Forbidden/);
  }
});
test('server rejects missing, wrong-hash, wrong-size and non-PDF storage before recording',async()=>{
  const {h,files}=setup(),actor=await h.user('admin'),row=rows[0];
  await cleanReceipt(h, 'file:1', actor);
  for(const storage of [null,{sha256:'0'.repeat(64),size:row.byteSize,contentType:'application/pdf'},{sha256:row.sha256,size:1,contentType:'application/pdf'},{sha256:row.sha256,size:row.byteSize,contentType:'text/plain'}]){
    if(storage)files.set('file:1',storage);else files.delete('file:1');
    await assert.rejects(h.invoke(handlers.record,{...row,storageId:'file:1'},actor),/checksum, size or type/);
  }
  assert.equal((await h.db.query('saada_research_pdfs').collect()).length,0);
});
test('127 records retry idempotently; missing stored files cannot count as verified',async()=>{
  const {h,files}=setup(),actor=await h.user('staff');
  for(const [i,row]of rows.entries()){
    const storageId=`file:${i}`;files.set(storageId,{sha256:Buffer.from(row.sha256,'hex').toString('base64'),size:row.byteSize,contentType:'application/pdf'});
    await cleanReceipt(h, storageId, actor);
    const first=await h.invoke(handlers.record,{...row,storageId},actor);assert.equal(first.created,true);
    const retry=await h.invoke(handlers.record,{...row,storageId},actor);assert.equal(retry.created,false);assert.equal(retry.id,first.id);
  }
  const hashes=rows.map(row=>row.sha256);assert.equal((await h.invoke(handlers.lookup,{hashes},actor)).filter(row=>row.stored).length,127);
  files.delete('file:0');assert.equal((await h.invoke(handlers.lookup,{hashes},actor)).filter(row=>row.stored).length,126);
  assert.equal((await h.db.query('documents').collect()).length,0);assert.equal((await h.db.query('embeddings').collect()).length,0);
});
test('removal and restoration preserve files/provenance and create audit records',async()=>{
  const {h,files}=setup(),actor=await h.user('admin'),row=rows[0];files.set('file:1',{sha256:row.sha256,size:row.byteSize,contentType:'application/pdf'});
  await cleanReceipt(h, 'file:1', actor);
  const {id}=await h.invoke(handlers.record,{...row,storageId:'file:1'},actor);
  await assert.rejects(h.invoke(handlers.setArchived,{id,archived:true,reason:'short'},actor),/at least 10/);
  await h.invoke(handlers.setArchived,{id,archived:true,reason:'Remove pending further verification.'},actor);
  await h.invoke(handlers.setArchived,{id,archived:false,reason:'Restore for independent source review.'},actor);
  const saved=await h.db.get(id);assert.equal(saved.archived,false);assert.equal(saved.provenance,row.provenance);assert.equal(files.size,1);assert.equal((await h.db.query('audit_logs').collect()).length,3);
});
test('archive management shows the actual linked source status and keeps removed originals separate',async()=>{
  const {h,files}=setup(),actor=await h.user('admin'),row=rows[0];files.set('file:1',{sha256:row.sha256,size:row.byteSize,contentType:'application/pdf'});
  await cleanReceipt(h, 'file:1', actor);
  const {id}=await h.invoke(handlers.record,{...row,storageId:'file:1'},actor);
  await h.db.insert('documents',{storageId:'file:1',approvalStatus:'pending',indexingStatus:'failed'});
  const list={_handler:(ctx,args)=>handlers.listPage._handler({...ctx,storage:{getUrl:async id=>`https://storage.test.invalid/${id}`}},args)};
  const args={archived:false,paginationOpts:{cursor:null,numItems:20}};
  const result=await h.invoke(list,args,actor);assert.equal(result.page[0].indexingStatus,'failed');assert.equal(result.page[0].approvalStatus,'pending');
  const receipt=(await h.invoke(handlers.lookup,{hashes:[row.sha256]},actor))[0];assert.equal(receipt.indexingStatus,'failed');assert.equal(receipt.approvalStatus,'pending');assert.ok(receipt.sourceDocumentId);
  await h.invoke(handlers.setArchived,{id,archived:true,reason:'Archive only the research queue record.'},actor);
  assert.equal((await h.invoke(list,args,actor)).page.length,0);assert.equal((await h.invoke(list,{...args,archived:true},actor)).page.length,1);
});
test('legacy archive files get a clean byte-identical indexing copy without changing originals',async()=>{
 const {h,files}=setup(),actor=await h.user('admin'),row=rows[0];
 const id=await h.db.insert('saada_research_pdfs',{...row,storageId:'legacy-original',uploadedByClerkId:'legacy',archived:false});
 files.set('legacy-original',{sha256:row.sha256,size:row.byteSize,contentType:'application/pdf'});
 files.set('checked-copy',{sha256:row.sha256,size:row.byteSize,contentType:'application/pdf'});
 await assert.rejects(h.invoke(handlers.linkIndexingCopy,{id,storageId:'checked-copy'},actor),/ownership|scan/);
 await cleanReceipt(h,'checked-copy',actor);
 await h.invoke(handlers.linkIndexingCopy,{id,storageId:'checked-copy'},actor);
 const saved=await h.db.get(id);assert.equal(saved.storageId,'legacy-original');assert.equal(saved.provenance,row.provenance);assert.equal(saved.indexingStorageId,'checked-copy');
 await h.db.insert('documents',{storageId:'checked-copy',approvalStatus:'pending',indexingStatus:'ready'});
 const result=(await h.invoke(handlers.lookup,{hashes:[row.sha256]},actor))[0];assert.equal(result.stored,true);assert.equal(result.indexingStatus,'ready');assert.equal(result.approvalStatus,'pending');
 await h.invoke(handlers.linkIndexingCopy,{id,storageId:'checked-copy'},actor);assert.equal((await h.db.query('audit_logs').collect()).length,1);
});
test('linking scanned copies rejects wrong hashes, wrong owners and replacement after ingestion',async()=>{
 const {h,files}=setup(),actor=await h.user('staff'),other=await h.user('admin'),row=rows[0];
 const id=await h.db.insert('saada_research_pdfs',{...row,storageId:'original',archived:false});
 files.set('copy',{sha256:'0'.repeat(64),size:row.byteSize,contentType:'application/pdf'});await cleanReceipt(h,'copy',actor);
 await assert.rejects(h.invoke(handlers.linkIndexingCopy,{id,storageId:'copy'},other),/ownership|scan/);
 await assert.rejects(h.invoke(handlers.linkIndexingCopy,{id,storageId:'copy'},actor),/match the original/);
 files.set('copy',{sha256:row.sha256,size:row.byteSize,contentType:'application/pdf'});
 await h.db.insert('documents',{storageId:'original',approvalStatus:'approved'});
 await assert.rejects(h.invoke(handlers.linkIndexingCopy,{id,storageId:'copy'},actor),/already exists/);
});

test('archive batch tickets bind original bytes, preserve normal upload quota and reject unauthorised or existing sources',async()=>{
 const {h}=setup(),actor=await h.user('admin'),other=await h.user(),row=rows[0];
 const id=await h.db.insert('saada_research_pdfs',{...row,storageId:'original',archived:false});
 const old={site:process.env.CONVEX_SITE_URL,url:process.env.PRIVATE_SCANNER_URL,token:process.env.PRIVATE_SCANNER_TOKEN};
 process.env.CONVEX_SITE_URL='https://development.convex.site';process.env.PRIVATE_SCANNER_URL='https://scanner.invalid';process.env.PRIVATE_SCANNER_TOKEN='x'.repeat(32);
 const wrapped={_handler:(ctx,args)=>handlers.generateIndexingUploadUrl._handler({...ctx,storage:{generateUploadUrl:async()=>Math.random().toString()}},args)};
 try{
  await assert.rejects(h.invoke(wrapped,{id},other),/Forbidden/);await assert.rejects(h.invoke(wrapped,{id}),/Unauthorized/);
  for(let n=0;n<31;n++)await h.invoke(wrapped,{id},actor);
  const tickets=await h.db.query('managed_uploads').collect();assert.equal(tickets.length,31);assert.equal(tickets[0].expectedSha256,row.sha256);assert.equal(tickets[0].expectedByteSize,row.byteSize);assert.equal(tickets[0].researchSourceId,id);
  const limits=await h.db.query('rate_limits').collect();assert.ok(limits.some(r=>r.identifier===`research-index-upload:${actor}`));assert.ok(!limits.some(r=>r.identifier===`upload:${actor}`));
  await h.db.insert('documents',{storageId:'original',indexingStatus:'ready'});await assert.rejects(h.invoke(wrapped,{id},actor),/already/);
 }finally{for(const [key,value]of [['CONVEX_SITE_URL',old.site],['PRIVATE_SCANNER_URL',old.url],['PRIVATE_SCANNER_TOKEN',old.token]])if(value===undefined)delete process.env[key];else process.env[key]=value;}
});

test('OCR copies preserve originals, require matching hashes and page counts, and cannot be self-reviewed',async()=>{
 const {h,files}=setup(),actor=await h.user('admin'),reviewer=await h.user('admin'),row=rows[0];
 const id=await h.db.insert('saada_research_pdfs',{...row,provenance:JSON.stringify({extractionReview:{pages:2}}),storageId:'original',archived:false});
 const args={id,storageId:'ocr-copy',sha256:'f'.repeat(64),byteSize:100,pageCount:2};files.set('ocr-copy',{sha256:args.sha256,size:100,contentType:'application/pdf'});await cleanReceipt(h,'ocr-copy',actor);
 await assert.rejects(h.invoke(handlers.linkIndexingDerivative,{...args,pageCount:1},actor),/preserve every/);
 await assert.rejects(h.invoke(handlers.linkIndexingDerivative,{...args,sha256:'a'.repeat(64)},actor),/mismatch/);
 await h.invoke(handlers.linkIndexingDerivative,args,actor);const saved=await h.db.get(id);assert.equal(saved.storageId,'original');assert.equal(saved.indexingStorageId,'ocr-copy');assert.equal(saved.indexingDerivative.reviewStatus,'pending');
 await assert.rejects(h.invoke(handlers.reviewIndexingDerivative,{id,decision:'verified',note:'Checked every page against original.'},actor),/different administrator/);
 await h.invoke(handlers.reviewIndexingDerivative,{id,decision:'verified',note:'Test-only assertion of an independent reviewer boundary.'},reviewer);assert.equal((await h.db.get(id)).indexingDerivative.reviewStatus,'verified');
});
test('OCR sources remain excluded from approval until independent transcription review',async()=>{
 const {h}=setup(),uploader=await h.user('admin'),reviewer=await h.user('admin'),u=await h.db.get(uploader);
 const id=await h.db.insert('documents',{title:'Unverified OCR',storageId:'ocr-copy',uploadedByClerkId:u.clerkId,approvalStatus:'pending',indexingStatus:'ready',processedAt:Date.now(),publisher:'Test repository',jurisdiction:'zanzibar',language:'en',contentCategory:'research',versionLabel:'Test only',reviewDueAt:Date.now()+86400000});
 await h.db.insert('embeddings',{documentId:id});const archive=await h.db.insert('saada_research_pdfs',{indexingStorageId:'ocr-copy',indexingDerivative:{kind:'machine_ocr',reviewStatus:'pending',preparedBy:uploader}});
 const sara=loadHandlerModule('convex/sara.ts');await assert.rejects(h.invoke(sara.reviewDocument,{id,decision:'approved',note:'This is only an in-memory test of the review boundary.'},reviewer),/OCR transcription review/);
 assert.equal((await h.db.get(id)).approvalStatus,'pending');
});
