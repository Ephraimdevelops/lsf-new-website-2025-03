// Applies the owner's removal/flagging instructions through existing admin APIs.
// Never changes identities, grants roles, deletes files, or bypasses independent review.
import fs from 'node:fs';
import {anyApi} from 'convex/server';
import {qaSession} from './test-support/qa-clerk-session.mjs';
const root='docs/haki-yangu/source-curation-2026-11-16';
const report={checkedAt:new Date().toISOString(),removed:[],flagged:[],approvalResults:[],missingInformation:[],counts:{}};
const save=()=>fs.writeFileSync(root+'/curation-results.json',JSON.stringify(report,null,2)+'\n');
const session=await qaSession('admin');
const strip=e=>(e instanceof Error?e.message:String(e)).split('Uncaught Error:').at(-1).split('\n')[0].trim();
async function pages(ref,args){let cursor=null,rows=[];do{const p=await session.call('query',ref,{...args,paginationOpts:{numItems:50,cursor}});rows.push(...p.page);cursor=p.isDone?null:p.continueCursor;}while(cursor);return rows;}
try{
 const docs=await pages(anyApi.sara.listDocumentsPage,{status:'pending'});
 const approved=await pages(anyApi.sara.listDocumentsPage,{status:'approved'});
 const originals=await pages(anyApi.saadaResearchPdfs.listPage,{archived:false});
 const casePattern=/Gyumi|Seth Japhet|Mabula Sayi|Capital Drilling|Eliahu Lonyamali|Latifa Awadh Saleh/i;
 const remove=docs.filter(d=>casePattern.test(d.title));
 const reason='Owner requested removing court judgments and case summaries from the active Haki Yangu knowledge library. Retain files and provenance for audit; use statutes, current procedures and practical guidance instead.';
 for(const d of remove){
  await session.call('mutation',anyApi.sara.withdrawDocument,{id:d._id,reason});
  const linked=originals.filter(o=>(o.indexingStorageId??o.storageId)===d.storageId);
  for(const o of linked)await session.call('mutation',anyApi.saadaResearchPdfs.setArchived,{id:o._id,archived:true,reason});
  report.removed.push({id:d._id,title:d.title,archivedOriginals:linked.length,status:'withdrawn_and_retained_for_audit'});save();
 }
 for(const d of docs.filter(d=>!casePattern.test(d.title))){
  const flags=[];
  if(!d.publisher||/publisher review pending/i.test(d.publisher))flags.push('Confirm publisher attribution against the original');
  if(!d.sourceUrl)flags.push('Attach the authoritative publisher source link');
  if(!d.versionLabel)flags.push('Confirm edition or Gazette reference');
  if(!d.jurisdiction||d.jurisdiction==='other')flags.push('Confirm Mainland, Zanzibar or national applicability');
  if(!d.reviewDueAt||d.reviewDueAt<=Date.now())flags.push('Set a current review due date after substantive review');
  if(d.indexingStatus!=='ready')flags.push('Finish or repair indexing before source review');
  if(/summary|counterpart candidate|versus cited|consolidated candidate/i.test(d.title))flags.push('Reconcile document identity and competing versions');
  if(/mirror|counterpart|original Gazette/i.test(d.title))flags.push('Check for a duplicate or superseded copy before approval');
  if(/amendment|annual supplement|miscellaneous/i.test(d.title))flags.push('Link amendments to the principal law and verify commencement');
  if(/provider.*list|registered legal aid/i.test(d.title))flags.push('Historical directory is not proof of current registration or intake');
  if(/forms?|notification|claim|confirmation form/i.test(d.title))flags.push('Verify current form and submission instructions; do not treat form text as legal authority');
  if(/Safe Homes/i.test(d.title))flags.push('Retain safe-home guidance; do not publish confidential shelter locations');
  const previous=d.curationFlags??[];const combined=[...new Set([...previous,...flags])].slice(0,12);
  if(combined.length){
   const note='Source curation on 16 November 2026: keep this useful research candidate pending until the listed provenance, version or applicability concerns are resolved. This is not a finding that the source is false or legally obsolete.';
   await session.call('mutation',anyApi.sara.flagDocument,{id:d._id,flags:combined,note});
   report.flagged.push({id:d._id,title:d.title,flags:combined});
  }else{
   try{await session.call('mutation',anyApi.sara.reviewDocument,{id:d._id,decision:'approved',note:'The product owner states the documents have been reviewed and requests approval of remaining sources. Apply existing indexing, provenance, expiry, OCR and independent-review controls; this curation does not waive them.'});report.approvalResults.push({id:d._id,title:d.title,approved:true});}
   catch(e){report.approvalResults.push({id:d._id,title:d.title,approved:false,reason:strip(e)});}
  }
  save();
 }
 report.counts={pendingBefore:docs.length,approvedBefore:approved.length,removed:report.removed.length,archivedOriginals:report.removed.reduce((n,r)=>n+r.archivedOriginals,0),flagged:report.flagged.length,approvedNow:report.approvalResults.filter(r=>r.approved).length,approvalBlocked:report.approvalResults.filter(r=>!r.approved).length};
 report.missingInformation=['Owner-confirmed paralegal and service roster with public contacts, geographic coverage, current intake, hours and review dates','Maintained Mainland and Zanzibar pathway guides with required documents, fees, deadlines, escalation contacts and authoritative source references','Current amendment and commencement crosswalk for each principal law','Bilingual everyday-question guides and source-backed answers','LSF operational handoff rules, response hours, named queue ownership and service expectations','Social-channel voice transcription with explicit processing notice/consent, protected media fetching, duration/size caps and uncertain-transcript handling'];
 save();console.log(JSON.stringify(report.counts));
}finally{await session.close();}
