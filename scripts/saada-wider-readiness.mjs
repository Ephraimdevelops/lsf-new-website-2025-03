// Development audit: report aggregate counts and legal-source review metadata only.
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';
async function exec(command,args) {
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),'saada-metadata-audit-'));const file=path.join(folder,'result.json');const fd=fs.openSync(file,'w',0o600);
 try {
  await new Promise((resolve,reject)=>{const child=spawn(command,args,{stdio:['ignore',fd,'pipe']});let error='';child.stderr.on('data',chunk=>{error+=chunk;});child.on('error',reject);child.on('close',code=>code===0?resolve():reject(new Error('Metadata audit command failed: '+error.slice(0,200))));});
  fs.closeSync(fd);return {stdout:fs.readFileSync(file,'utf8')};
 } finally {try{fs.closeSync(fd);}catch{}fs.rmSync(folder,{recursive:true,force:true});}
}
const local=fs.readFileSync('.env.local','utf8');
const url=local.match(/^VITE_CONVEX_URL\s*=\s*(.+)$/m)?.[1].trim().replace(/^['"]|['"]$/g,'');
if(!url)throw new Error('Development backend URL missing.');
const client=new ConvexHttpClient(url),now=Date.now();
const report={checkedAt:new Date(now).toISOString(),environment:'configured development backend',publicEligible:{},privateAggregates:{},sourceReviewQueue:[],archiveIndexingQueue:[],directoryReviewQueue:[],guideReviewQueue:[],bounds:'Paginated source and research metadata; no personal cases, source bodies, embeddings or contact details exported.'};
await Promise.all([['guides',anyApi.publications.listPublicLegalGuides],['services',anyApi.justiceServices.listPublicServices],['paralegals',anyApi.paralegals.listApprovedParalegals]].map(async([name,ref])=>{try{report.publicEligible[name]=(await client.query(ref,{})).length;}catch{report.publicEligible[name]='query_failed';}}));
for(const table of ['documents','legal_guides','saada_research_pdfs','directory_research']){
 let rows=[],cursor;
 for(let page=0;page<100;page++) {
  const result=await exec('npx',['convex','run','saadaReadinessAudit:page',JSON.stringify({table,...(cursor?{cursor}:{})})],{maxBuffer:4*1024*1024,timeout:60000});
  const data=JSON.parse(result.stdout);rows.push(...data.rows);if(data.isDone)break;cursor=data.cursor;
  if(page===99)throw new Error('Audit pagination limit reached.');
 }

 report.privateAggregates[table]={count:rows.length,possiblyTruncated:false};
 if(table==='documents'){
  report.privateAggregates[table].indexed=rows.filter(r=>r.indexingStatus==='ready').length;
  report.privateAggregates[table].approvedCurrent=rows.filter(r=>r.approvalStatus==='approved'&&(r.reviewDueAt??0)>now).length;
  report.sourceReviewQueue=rows.map(r=>({id:r.id,title:r.title,publisher:r.publisher,indexingStatus:r.indexingStatus,approvalStatus:r.approvalStatus,reviewDueAt:r.reviewDueAt,sourceUrl:r.sourceUrl,jurisdiction:r.jurisdiction,language:r.language,contentCategory:r.contentCategory,versionLabel:r.versionLabel,processedAt:r.processedAt}));
 }
 if(table==='saada_research_pdfs')report.archiveIndexingQueue=rows;
 if(table==='directory_research')report.directoryReviewQueue=rows;
 if(table==='legal_guides'){report.privateAggregates[table].statuses=rows.reduce((acc,r)=>(acc[r.status]=(acc[r.status]??0)+1,acc),{});report.guideReviewQueue=rows.filter(r=>r.status==='pending');}
}
for(const source of report.sourceReviewQueue){
 source.preReviewBlockers=[];
 if(source.indexingStatus!=='ready' || !source.processedAt)source.preReviewBlockers.push('Searchable indexing must finish');
 for(const field of ['publisher','jurisdiction','language','contentCategory','versionLabel'])if(!source[field])source.preReviewBlockers.push('Missing '+field);
 if(!source.reviewDueAt || source.reviewDueAt<=now)source.preReviewBlockers.push('Future review date required');
 if(/publisher review pending/i.test(source.publisher??''))source.preReviewBlockers.push('Confirm publisher attribution from the source');
 if(source.jurisdiction==='other')source.preReviewBlockers.push('Resolve legal jurisdiction before publication');
 source.nextStep=source.approvalStatus==='pending'?(source.preReviewBlockers.length?'Complete prerequisites, then independent legal review':'Independent legal review, including indexed passage check'):'Legacy record: classify and prepare a new reviewed version if useful';
}
report.archiveLinkage={linkedToSourceDocument:report.archiveIndexingQueue.filter(r=>r.linkedDocumentId).length,linkedReady:report.archiveIndexingQueue.filter(r=>r.linkedIndexingStatus==='ready').length,noLinkedSourceDocument:report.archiveIndexingQueue.filter(r=>!r.linkedDocumentId).length};
const register=JSON.parse(fs.readFileSync('docs/haki-yangu/saada-research-pack-2026-10-05/source-register.json','utf8')).sources;
for(const archive of report.archiveIndexingQueue){
 const entry=register.find(s=>s.id===archive.researchSourceId);
 archive.sourceTitle=entry?.title;archive.sourceUrl=entry?.downloadUrl;archive.topic=entry?.topic;archive.observedJurisdiction=entry?.jurisdictionObserved;
 const matches=report.sourceReviewQueue.filter(s=>(entry?.downloadUrl&&s.sourceUrl===entry.downloadUrl)||s.title===entry?.title||s.title===archive.title);
 archive.candidateMatchingDocumentIds=matches.map(s=>s.id);archive.nextStep=archive.linkedDocumentId?'Review linked source record; do not duplicate':matches.length?'Check candidate source identity and storage linkage before indexing':'Prepare scanned indexing copy and provenance, index, then independent review';
}
fs.writeFileSync('docs/haki-yangu/saada-wider-readiness-2026-10-24.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({checkedAt:report.checkedAt,publicEligible:report.publicEligible,privateAggregates:report.privateAggregates},null,2));
