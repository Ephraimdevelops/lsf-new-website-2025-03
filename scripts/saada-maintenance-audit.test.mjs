import test from 'node:test';import assert from 'node:assert/strict';import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const audit=loadHandlerModule('convex/saadaReadinessAudit.ts');
test('maintenance audit exports only its intended internal metadata endpoints',()=>{
 assert.deepEqual(Object.keys(audit).sort(),['page','uploadDiagnostics']);assert.equal(audit.page.isInternal,true);assert.equal(audit.uploadDiagnostics.isInternal,true);
 const archive=loadHandlerModule('convex/saadaResearchPdfs.ts');assert.deepEqual(Object.keys(archive).sort(),['generateIndexingUploadUrl','indexingUploadState','linkIndexingCopy','linkIndexingDerivative','listPage','lookup','record','reviewIndexingDerivative','setArchived']);
});
test('audit returns actual archive linkage and omits text, vectors, contacts and credentials',async()=>{
 const h=harness();const doc=await h.db.insert('documents',{storageId:'clean-copy',title:'Draft source',indexingStatus:'ready',approvalStatus:'pending',text:'PRIVATE SOURCE BODY'});
 await h.db.insert('saada_research_pdfs',{storageId:'original',indexingStorageId:'clean-copy',researchSourceId:'TEST',title:'Draft source',provenance:'PRIVATE PROVENANCE',indexingDerivative:{reviewStatus:'pending'}});
 await h.db.insert('directory_research',{title:'Research office',phone:'PRIVATE CONTACT',originalRecord:'PRIVATE ORIGINAL',notes:'PRIVATE NOTES'});
 const page=await h.invoke(audit.page,{table:'saada_research_pdfs'});assert.equal(page.rows[0].linkedDocumentId,doc);assert.equal(page.rows[0].ocrReviewStatus,'pending');
 for(const table of ['documents','directory_research','saada_research_pdfs'])assert.doesNotMatch(JSON.stringify(await h.invoke(audit.page,{table})),/PRIVATE|storageId|embedding|tokenHash/);
});
