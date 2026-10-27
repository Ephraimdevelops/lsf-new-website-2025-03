// Reachability evidence only. Does not certify current law or approve a guide.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const base='docs/haki-yangu/';
const guides=JSON.parse(fs.readFileSync(base+'saada-guide-review-completion-2026-10-24.json','utf8')).records.filter(r=>!r.titleEn.startsWith('TEST ONLY'));
const prior=JSON.parse(fs.readFileSync(base+'saada-directory-source-review-2026-10-24.json','utf8')).sources;
const urls=[...new Set(guides.map(r=>r.sourceUrl))],sources=[];
const allowed=raw=>{const u=new URL(raw);if(u.protocol!=='https:'||!u.hostname.endsWith('.go.tz')||u.username||u.password||u.port)throw Error('Unexpected citation redirect; manual review required.');return u;};
for(const url of urls){
 const cached=prior.find(r=>r.url===url);
 if(cached){sources.push({url,checkedAt:cached.checkedAt,status:cached.status,httpStatus:cached.httpStatus,finalUrl:cached.finalUrl,pageTitle:cached.pageTitle,evidenceOrigin:'Same-day directory source check',truncated:cached.truncated??false});continue;}
 const evidence={url,checkedAt:new Date().toISOString(),status:'unavailable'};
 try{
  let target=allowed(url),response;
  for(let i=0;i<5;i++){response=await fetch(target,{redirect:'manual',signal:AbortSignal.timeout(20000)});if(response.status>=300&&response.status<400&&response.headers.get('location')){target=allowed(new URL(response.headers.get('location'),target).href);continue;}break;}
  evidence.httpStatus=response.status;evidence.finalUrl=target.href;evidence.contentType=response.headers.get('content-type')??'';
  if(!response.ok)throw Error('HTTP '+response.status);
  let size=0;const chunks=[],reader=response.body.getReader();
  while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>1024*1024){evidence.truncated=true;await reader.cancel();break;}chunks.push(Buffer.from(part.value));}
  const bytes=Buffer.concat(chunks);evidence.observedBytesSha256=createHash('sha256').update(bytes).digest('hex');
  if(/html|text/.test(evidence.contentType)){evidence.pageTitle=(bytes.toString('utf8').match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]??'').replace(/\s+/g,' ').trim().slice(0,300);evidence.status='page_observed_requires_legal_review';}
  else evidence.status='binary_source_requires_document_review';
 }catch(error){evidence.error=/^HTTP \d+$/.test(error.message)?error.message:'Source could not be retrieved within bounded check; no conclusion about service availability.';}
 sources.push(evidence);
}
const report={checkedAt:new Date().toISOString(),status:'citation_reachability_not_legal_approval',sources,counts:{realGuideDrafts:guides.length,uniqueCitedUrls:urls.length,unavailable:sources.filter(r=>r.status==='unavailable').length},guideCitations:guides.map(g=>({id:g.id,title:g.titleEn,sourceUrl:g.sourceUrl,sourceStatus:sources.find(s=>s.url===g.sourceUrl)?.status}))};
fs.writeFileSync(base+'saada-guide-citation-check-2026-10-24.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.counts));
