// Explicitly unverified OCR sources, requiring transcription AND legal approval.
import fs from 'node:fs';import {anyApi} from 'convex/server';import {qaSession} from './test-support/qa-clerk-session.mjs';import {createHash} from 'node:crypto';
const base='output/pdf/research-indexing-2026-10-24/';const prepared=JSON.parse(fs.readFileSync(base+'verification.json','utf8'));
const originals=JSON.parse(fs.readFileSync('docs/haki-yangu/pdf-upload-preparation-2026-10-07/remaining-127-pdf-manifest.json','utf8')).entries;
const output='docs/haki-yangu/saada-ocr-indexing-completion-2026-10-24.json';const report=fs.existsSync(output)?JSON.parse(fs.readFileSync(output,'utf8')):{checkedAt:new Date().toISOString(),approved:0,receipts:[]};const save=()=>fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
const s=await qaSession('admin');
try{
 for(const part of prepared){
  const original=originals.find(o=>part.sourceFile.endsWith('/'+o.filename));const found=(await s.call('query',anyApi.saadaResearchPdfs.lookup,{hashes:[original.sha256]}))[0];
  if(found.indexingStatus==='ready'){console.log(JSON.stringify({source:original.researchSourceId,status:'already_ready'}));continue;}
  const draft=JSON.parse(original.provenance).candidate;
  const metadata={title:original.title.slice(0,180),sourceUrl:draft.sourceUrl,publisher:`Repository: ${new URL(draft.sourceUrl).hostname}; publisher review pending`,jurisdiction:'other',language:['en','sw','bilingual'].includes(draft.observedLanguage)?draft.observedLanguage:'other',contentCategory:draft.topicDraft??'research',versionLabel:((draft.versionLabelDraft??'Research copy')+'; unverified OCR').slice(0,80),reviewDueAt:Date.UTC(2027,0,22,9)};
  let receipt=report.receipts.find(r=>r.researchSourceId===original.researchSourceId);
  if(!receipt){
   const bytes=fs.readFileSync(part.derivativeFile);if(bytes.length!==part.bytes||bytes.length>15*1024*1024||createHash('sha256').update(bytes).digest('hex')!==part.derivativeSha256)throw Error('Derivative bytes do not match verified local output.');
   let response;
   for(let attempt=0;attempt<3;attempt++){
    if(attempt)await new Promise(resolve=>setTimeout(resolve,15000));
    const url=await s.call('mutation',anyApi.sara.generateUploadUrl,{});response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/pdf'},body:bytes,signal:AbortSignal.timeout(150000)});
    if(response.ok)break;
    console.log(JSON.stringify({source:original.researchSourceId,stage:'secure_upload_retry',attempt:attempt+1,httpStatus:response.status}));
   }
   if(!response?.ok)throw Error('OCR derivative did not pass secure upload after bounded retries.');
   const {storageId}=await response.json();receipt={researchSourceId:original.researchSourceId,archiveId:found.id,storageId,status:'scanned',metadata};report.receipts.push(receipt);save();
  }
  await s.call('mutation',anyApi.saadaResearchPdfs.linkIndexingDerivative,{id:found.id,storageId:receipt.storageId,sha256:part.derivativeSha256,byteSize:part.bytes,pageCount:part.pages});
  await s.call('mutation',anyApi.saadaUploadReceipts.record,{storageId:receipt.storageId,metadata:receipt.metadata});
  const result=await s.call('action',anyApi.sara_actions.ingestDocument,{storageId:receipt.storageId,...receipt.metadata});
  const verify=(await s.call('query',anyApi.saadaResearchPdfs.lookup,{hashes:[original.sha256]}))[0];if(verify.indexingStatus!=='ready'||verify.approvalStatus!=='pending')throw Error('OCR source not ready/pending.');
  Object.assign(receipt,{status:'ready_pending_transcription_and_legal_review',documentId:verify.sourceDocumentId});save();console.log(JSON.stringify({source:original.researchSourceId,status:receipt.status}));
 }
 report.finishedAt=new Date().toISOString();save();
}finally{await s.close();}
