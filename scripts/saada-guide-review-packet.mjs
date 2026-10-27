// Structural and source-readiness review only; no automatic legal approval.
import fs from 'node:fs';import {anyApi} from 'convex/server';import {qaSession} from './test-support/qa-clerk-session.mjs';
const s=await qaSession('admin'),guides=[];
try{let cursor=null;do{const result=await s.call('query',anyApi.publications.listLegalGuidesPage,{status:'pending',paginationOpts:{numItems:10,cursor}});guides.push(...result.page);cursor=result.isDone?null:result.continueCursor;}while(cursor);}finally{await s.close();}
const audit=JSON.parse(fs.readFileSync('docs/haki-yangu/saada-wider-readiness-2026-10-24.json','utf8'));
const register=JSON.parse(fs.readFileSync('docs/haki-yangu/saada-research-pack-2026-10-05/source-register.json','utf8')).sources;
const citationPath='docs/haki-yangu/saada-guide-citation-check-2026-10-24.json';
const citationCheck=fs.existsSync(citationPath)?JSON.parse(fs.readFileSync(citationPath,'utf8')):null;
const correctionsPath='docs/haki-yangu/saada-guide-citation-corrections-2026-10-24.json';
const corrections=fs.existsSync(correctionsPath)?JSON.parse(fs.readFileSync(correctionsPath,'utf8')).receipts:[];
const report={checkedAt:new Date().toISOString(),status:'prepared_for_independent_legal_and_language_review',approved:0,records:guides.map(g=>{
 const issues=[];
 for(const field of ['titleEn','titleSw','summaryEn','summarySw','sourceTitle','sourceUrl','publisher','jurisdiction'])if(!g[field]?.trim())issues.push('Missing '+field);
 for(const field of ['stepsEn','stepsSw'])if(!Array.isArray(g[field])||g[field].length<1)issues.push('Missing '+field);
 if(g.stepsEn?.length!==g.stepsSw?.length)issues.push('English and Kiswahili step counts differ; review translation');
 if(!(g.reviewDueAt>Date.now()))issues.push('Review date is missing or expired');
 const aliases=register.filter(r=>r.recordUrl===g.sourceUrl||r.downloadUrl===g.sourceUrl);
 const sources=audit.sourceReviewQueue.filter(r=>r.sourceUrl===g.sourceUrl||aliases.some(a=>a.downloadUrl===r.sourceUrl||a.recordUrl===r.sourceUrl));
 const text=[g.summaryEn,...(g.stepsEn??[]),g.summarySw,...(g.stepsSw??[])].join(' ');
 const quantitativeClaims=[...new Set(text.match(/\b\d+\s*(?:days?|hours?|months?|years?|siku|miezi|miaka|saa)\b/gi)??[])];
 return {id:g._id,titleEn:g.titleEn,titleSw:g.titleSw,category:g.category,jurisdiction:g.jurisdiction,sourceTitle:g.sourceTitle,sourceUrl:g.sourceUrl,citationReachability:citationCheck?.sources.find(s=>s.url===g.sourceUrl)?.status??'not_checked',preparedCitationCorrection:corrections.find(r=>r.id===g._id),citedSourceKind:aliases.some(r=>r.downloadUrl)||/\.pdf(?:$|\?)|\/download(?:$|\?)/i.test(g.sourceUrl)?'pdf_or_catalogue':'publisher_web_page',reviewDueAt:g.reviewDueAt,editVersion:g.editVersion??1,structuralIssues:issues,quantitativeClaimsToVerify:quantitativeClaims,matchingSourceDocuments:sources.map(r=>({id:r.id,indexingStatus:r.indexingStatus,approvalStatus:r.approvalStatus})),independentLegalReviewRequired:true,bilingualReviewRequired:true,publicEligible:false,nextSteps:['Check source identity, current amendments, commencement and jurisdiction','Verify each legal claim and action step against source passages and actual pathway','Check Kiswahili meaning against English and source; preserve distinctions','Use existing review form to record a reasoned independent decision']};
})};
report.counts={pending:report.records.length,structurallyComplete:report.records.filter(g=>!g.structuralIssues.length).length,withQuantitativeClaims:report.records.filter(g=>g.quantitativeClaimsToVerify.length).length,withoutMatchingIndexedSource:report.records.filter(g=>!g.matchingSourceDocuments.some(s=>s.indexingStatus==='ready')).length};
fs.writeFileSync('docs/haki-yangu/saada-guide-review-completion-2026-10-24.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.counts));
