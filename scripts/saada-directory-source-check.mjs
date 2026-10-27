// Public-source freshness and contact-presence evidence. Does NOT certify intake,
// approve directory entries, contact organisations, or publish private addresses.
import fs from 'node:fs';import {createHash} from 'node:crypto';
const file='docs/haki-yangu/upload-preparation-2026-10-07/directory-research-import.json';
const rows=JSON.parse(fs.readFileSync(file,'utf8')).entries;
const out='docs/haki-yangu/saada-directory-source-review-2026-10-24.json';
const prior=fs.existsSync(out)?JSON.parse(fs.readFileSync(out,'utf8')):null;
const results=new Map((prior?.sources??[]).map(r=>[r.url,r]));
const urls=[...new Set(rows.flatMap(r=>r.sourceUrls))];
const report={checkedAt:new Date().toISOString(),status:'machine_public_source_check_not_directory_verification',sources:[],records:[]};
function publicUrl(raw){const u=new URL(raw);if(u.protocol!=='https:'||!u.hostname.includes('.')||/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u.hostname)||u.username||u.password)throw Error('Unsupported source');return u;}
function save(){report.sources=[...results.values()];fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');}
async function inspect(url){
 if(results.has(url))return;
 const evidence={url,checkedAt:new Date().toISOString(),status:'unavailable'};
 try{
  let target=publicUrl(url),response;
  for(let attempt=0;attempt<5;attempt++){response=await fetch(target,{redirect:'manual',headers:{'User-Agent':'HakiYangu-ResearchReview/1.0'},signal:AbortSignal.timeout(20000)});if(response.status>=300&&response.status<400&&response.headers.get('location')){target=publicUrl(new URL(response.headers.get('location'),target).href);continue;}break;}
  evidence.httpStatus=response.status;evidence.finalUrl=target.href;evidence.contentType=(response.headers.get('content-type')??'').slice(0,120);
  if(!response.ok)throw Error('HTTP '+response.status);
  const reader=response.body.getReader(),chunks=[];let size=0;
  while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>1024*1024){await reader.cancel();evidence.truncated=true;break;}chunks.push(Buffer.from(part.value));}
  const bytes=Buffer.concat(chunks);evidence.sha256=createHash('sha256').update(bytes).digest('hex');
  if(/html|text/.test(evidence.contentType)){
   const html=bytes.toString('utf8');const visible=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|amp|quot|#39);/g,' ').replace(/\s+/g,' ').trim();
   evidence.pageTitle=(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]??'').replace(/\s+/g,' ').trim().slice(0,300);
   evidence.emails=[...new Set((visible.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)??[]).map(e=>e.toLowerCase()))].slice(0,30);
   evidence.phones=[...new Set(visible.match(/(?:\+?255|0)[\s().-]*(?:\d[\s().-]*){8,10}\d/g)??[])].map(p=>p.trim()).slice(0,40);
   evidence.contactExcerpt=(visible.match(/.{0,100}(?:contact us|legal aid|legal assistance|msaada wa kisheria|mawasiliano).{0,400}/i)?.[0]??'').slice(0,600);
   evidence.status='page_observed_not_intake_verified';
  }else evidence.status='binary_source_requires_document_review';
 }catch(error){evidence.error=/HTTP \d+/.test(String(error))?String(error.message):'Source could not be retrieved within the bounded request';}
 results.set(url,evidence);save();console.log(JSON.stringify({sourceDone:results.size,total:urls.length,status:evidence.status}));
}
let next=0;await Promise.all(Array.from({length:3},async()=>{while(next<urls.length){const url=urls[next++];await inspect(url);}}));
const digits=s=>(s??'').replace(/\D/g,'');
report.records=rows.map(row=>{
 const evidence=row.sourceUrls.map(url=>results.get(url));
 const required=['region','district','address','phone','email'];
 const missing=required.filter(key=>!row[key]?.trim());
 const phone=digits(row.phone),email=row.email?.toLowerCase();
 return {externalKey:row.externalKey,title:row.title,kind:row.kind,sourceUrls:row.sourceUrls,reachableSources:evidence.filter(e=>e?.status==='page_observed_not_intake_verified').length,phoneObserved:!!phone&&evidence.some(e=>e?.phones?.some(p=>digits(p).endsWith(phone.slice(-9)))),emailObserved:!!email&&evidence.some(e=>e?.emails?.includes(email)),missingFields:missing,independentReviewRequired:true,publicEligible:false,nextSteps:['Check that source and record refer to the same office','Confirm phone, district, region and safe public location','Confirm current intake, eligibility, coverage, hours, access needs and fees','Record independent reviewer, evidence and review date; activate through existing lifecycle']};
});
report.counts={records:rows.length,sourceUrls:urls.length,reachable:report.sources.filter(s=>s.status==='page_observed_not_intake_verified').length,unavailable:report.sources.filter(s=>s.status==='unavailable').length,recordsWithMissingLocation:report.records.filter(r=>r.missingFields.includes('region')||r.missingFields.includes('district')).length,verifiedPublic:0};save();console.log(JSON.stringify(report.counts));
