// Resume-safe development archive migration. Uses genuine scoped QA admin JWTs,
// byte-bound scanned uploads and the existing pending-source ingestion lifecycle.
// Does not approve, publish, impersonate a reviewer or relax spending limits.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {anyApi} from 'convex/server';
import {qaSession} from './test-support/qa-clerk-session.mjs';
const root=process.cwd(),base=path.join(root,'docs/haki-yangu');
const reportPath=path.join(base,'saada-archive-indexing-completion-2026-10-24.json');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'pdf-upload-preparation-2026-10-07/remaining-127-pdf-manifest.json'),'utf8')).entries;
const previous=fs.existsSync(reportPath)?JSON.parse(fs.readFileSync(reportPath,'utf8')):{};
const report={...previous,startedAt:previous.startedAt??new Date().toISOString(),updatedAt:new Date().toISOString(),environment:'dev:joyous-spaniel-5',approved:0,receipts:previous.receipts??[],exceptions:previous.exceptions??[]};
const save=()=>{report.updatedAt=new Date().toISOString();fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');};
const put=(key,value)=>{report[key]=report[key].filter(r=>r.researchSourceId!==value.researchSourceId);report[key].push(value);save();};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const limit=Number(process.env.SAADA_INDEX_LIMIT??150);
const s=await qaSession('admin');
try{
 report.usageBefore=await s.call('query',anyApi.aiUsage.status,{});save();
 if(report.usageBefore.limitUSD!==5 || report.usageBefore.unpricedCalls || report.usageBefore.alert==='limit_reached')throw new Error('Review the existing spending allowance before migration.');
 const receipts=await s.call('query',anyApi.saadaResearchPdfs.lookup,{hashes:manifest.map(r=>r.sha256)});
 const archived=manifest.map(original=>{const found=receipts.find(r=>r.sha256===original.sha256);if(!found?.stored)throw new Error('Original storage verification failed: '+original.researchSourceId);return {...original,...found,_id:found.id,canReuseIndexingCopy:false};});
 console.log(JSON.stringify({stage:'archive_metadata',loaded:archived.length}));
 let processed=0,lastUpload=0;
 for(const original of manifest){
  const row=archived.find(r=>r.sha256===original.sha256);if(!row)throw new Error('Archived original missing: '+original.researchSourceId);
  if(report.exceptions.some(e=>e.researchSourceId===row.researchSourceId&&e.reason==='scanner_rejected_original_requires_security_review')){console.log(JSON.stringify({source:row.researchSourceId,status:'excluded_pending_security_review'}));continue;}
  if(row.indexingStatus==='ready'){put('receipts',{...report.receipts.find(r=>r.researchSourceId===row.researchSourceId),researchSourceId:row.researchSourceId,status:'already_ready',archiveId:row._id,documentId:row.sourceDocumentId});continue;}
  if(row.indexingStatus==='processing'){put('receipts',{...report.receipts.find(r=>r.researchSourceId===row.researchSourceId),researchSourceId:row.researchSourceId,archiveId:row._id,documentId:row.sourceDocumentId,status:'processing_in_backend'});continue;}
  if(processed>=limit)break;
  const provenance=JSON.parse(row.provenance),candidate=provenance.candidate??{};
  const textPath=path.join(base,'saada-research-pack-2026-10-05/extracted-text',original.filename.replace(/\.pdf$/i,'.txt'));
  const native=fs.existsSync(textPath)?fs.readFileSync(textPath,'utf8').trim():'';
  if(row.byteSize>15*1024*1024 || native.length<100){put('exceptions',{researchSourceId:row.researchSourceId,archiveId:row._id,title:row.title,reason:row.byteSize>15*1024*1024?'oversize_original_requires_smaller_searchable_derivative':'scanned_pdf_requires_ocr',bytes:row.byteSize});continue;}
  const sourceUrl=candidate.sourceUrl??provenance.sourceRegister?.downloadUrl;
  if(!sourceUrl || !/^https:\/\//.test(sourceUrl)){put('exceptions',{researchSourceId:row.researchSourceId,reason:'original_source_url_requires_review'});continue;}
  const safeHost=new URL(sourceUrl).hostname;
  const observed=candidate.observedJurisdiction;
  const metadata={title:row.title.slice(0,180),sourceUrl,publisher:typeof candidate.publisher==='string'&&candidate.publisher.trim()?candidate.publisher.slice(0,180):`Repository: ${safeHost}; publisher review pending`,jurisdiction:observed==='zanzibar'?'zanzibar':observed==='mainland_source_indicated'?'tanzania_mainland':'other',language:['en','sw','bilingual'].includes(candidate.observedLanguage)?candidate.observedLanguage:'other',contentCategory:candidate.topicDraft??'research',versionLabel:(candidate.versionLabelDraft||'Research copy; edition needs review').slice(0,80),reviewDueAt:Date.UTC(2027,0,22,9)};
  try{
   console.log(JSON.stringify({source:row.researchSourceId,stage:'starting_index_preparation'}));
   let storageId=row.canReuseIndexingCopy?(row.indexingStorageId??row.storageId):undefined;
   const prior=report.receipts.find(r=>r.researchSourceId===row.researchSourceId);
   // Persisted storage references are reused only after server ownership checks.
   storageId??=prior?.storageId;
   if(!storageId){
    const bytes=fs.readFileSync(path.join(base,'saada-research-pack-2026-10-05/source-files',original.filename));
    if(bytes.length!==row.byteSize||createHash('sha256').update(bytes).digest('hex')!==row.sha256)throw new Error('Local PDF does not match archived original.');
    if(Date.now()-lastUpload<6500)await wait(6500-(Date.now()-lastUpload));
    let result, excluded=false, failure='unknown_stage';
    for(let attempt=0;attempt<3;attempt++){
     if(attempt)await wait(15000);
     const url=await s.call('mutation',anyApi.saadaResearchPdfs.generateIndexingUploadUrl,{id:row._id});lastUpload=Date.now();
     result=await fetch(url,{method:'POST',headers:{'Content-Type':'application/pdf'},body:bytes,signal:AbortSignal.timeout(150000)});
     if(result.ok)break;
     const state=await s.call('query',anyApi.saadaResearchPdfs.indexingUploadState,{id:row._id});failure=state?.diagnosticCode??'unknown_stage';
     if(['scanner_rejected','scanner_inspection_limit','scanner_encrypted'].includes(failure)){
      const reason=failure==='scanner_rejected'?'scanner_rejected_original_requires_security_review':failure==='scanner_inspection_limit'?'scanner_inspection_limit_requires_smaller_reviewed_derivative':'encrypted_original_requires_reviewed_copy';
      put('exceptions',{researchSourceId:row.researchSourceId,archiveId:row._id,title:row.title,reason});console.log(JSON.stringify({source:row.researchSourceId,status:'excluded_pending_security_review',reason}));excluded=true;break;
     }
     console.log(JSON.stringify({source:row.researchSourceId,stage:'secure_upload_retry',attempt:attempt+1,diagnostic:failure}));
    }
    if(excluded)continue;
    if(!result?.ok)throw new Error('Secure scanner/upload failed at '+failure);
    storageId=(await result.json()).storageId;
    if(!storageId)throw new Error('Missing scanned storage receipt.');
    put('receipts',{researchSourceId:row.researchSourceId,status:'scanned',archiveId:row._id,storageId,metadata});
   }
   if(!row.indexingStatus){await s.call('mutation',anyApi.saadaResearchPdfs.linkIndexingCopy,{id:row._id,storageId});await s.call('mutation',anyApi.saadaUploadReceipts.record,{storageId,metadata});}
   let result;
   if(row.indexingStatus==='failed'){
    const found=(await s.call('query',anyApi.saadaResearchPdfs.lookup,{hashes:[row.sha256]}))[0];result=await s.call('action',anyApi.sara_actions.retryDocumentIndex,{id:found.sourceDocumentId});
   }else result=await s.call('action',anyApi.sara_actions.ingestDocument,{storageId,...metadata});
   const check=(await s.call('query',anyApi.saadaResearchPdfs.lookup,{hashes:[row.sha256]}))[0];
   if(check.indexingStatus!=='ready'||check.approvalStatus!=='pending')throw new Error('Source did not finish in ready/pending state.');
   put('receipts',{researchSourceId:row.researchSourceId,status:'ready_pending_independent_review',archiveId:row._id,storageId,documentId:check.sourceDocumentId,metadata,publisherNeedsReview:!candidate.publisher,jurisdictionNeedsReview:metadata.jurisdiction==='other'});
   report.exceptions=report.exceptions.filter(r=>r.researchSourceId!==row.researchSourceId);processed++;save();console.log(JSON.stringify({processed,source:row.researchSourceId,status:'ready_pending_independent_review'}));
  }catch(error){
   const message=String(error?.message??error).replace(/https?:\/\/\S+/g,'[URL]').slice(0,700);
   put('exceptions',{researchSourceId:row.researchSourceId,archiveId:row._id,title:row.title,reason:message});console.log(JSON.stringify({source:row.researchSourceId,status:'needs_attention',reason:message}));
   // Stop on shared infrastructure/cost/quota failures; do not hammer every source.
   if(/scanner|upload failed|spending|allowance|RATE_LIMITED|securely|AI cost|fetch failed/i.test(message))throw new Error(message);
  }
 }
 report.usageAfter=await s.call('query',anyApi.aiUsage.status,{});report.finishedAt=new Date().toISOString();save();
 console.log(JSON.stringify({receipts:report.receipts.length,exceptions:report.exceptions.length,approved:0}));
}finally{await s.close();save();}
