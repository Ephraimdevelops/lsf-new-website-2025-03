// Updates private research drafts only. Original provenance is retained;
// nothing is verified, activated, referred or published by this migration.
import fs from 'node:fs';import {anyApi} from 'convex/server';import {qaSession} from './test-support/qa-clerk-session.mjs';
const evidence=JSON.parse(fs.readFileSync('docs/haki-yangu/saada-directory-source-review-2026-10-24.json','utf8'));
const tables=JSON.parse(fs.readFileSync('docs/haki-yangu/saada-zanzibar-provider-table-2026-10-24.json','utf8')).extractedRows.filter(r=>r[6]?.startsWith('LAP-'));
const norm=s=>s?.replace(/\s+/g,' ').trim();
const regionAlias={'KUSINI UNGUJA':'Kusini Unguja','KUSINI PEMBA':'Kusini Pemba','KASKAZINI UNGUJA':'Kaskazini Unguja','KASKAZINI PEMBA':'Kaskazini Pemba','MJINI MAGHARIB UNGUJA':'Mjini Magharibi'};
const districtAlias={KATI:'Kati','CHAKE CHAKE':'Chake Chake','MGHARIBI "B"':'Magharibi B','MGHARIBI "A"':'Magharibi A',"KASKAZINI 'A'":'Kaskazini A',"KASKAZINI 'B'":'Kaskazini B',MICHEWENI:'Micheweni',MKOANI:'Mkoani',MJINI:'Mjini',WETE:'Wete'};
const fields=['externalKey','kind','title','region','district','address','phone','email','notes','sourceUrls','originalRecord'];
const report={checkedAt:new Date().toISOString(),status:'private_drafts_prepared_not_verified_or_published',records:[],counts:{}};
const output='docs/haki-yangu/saada-directory-preparation-completion-2026-10-24.json';
const save=()=>fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
const s=await qaSession('admin');
try{
 let cursor=null,rows=[];do{const page=await s.call('query',anyApi.directoryResearch.list,{archived:false,paginationOpts:{numItems:10,cursor}});rows.push(...page.page);cursor=page.isDone?null:page.continueCursor;}while(cursor);
 for(const row of rows){
  const original=JSON.parse(row.originalRecord),draft=Object.fromEntries(fields.filter(k=>row[k]!==undefined).map(k=>[k,row[k]]));const changes={};
  const registry=tables.find(t=>norm(t[6])===original.registrationNumberObserved);
  if(registry){
   const title=norm(registry[1]),region=regionAlias[norm(registry[5])],district=districtAlias[norm(registry[4])];
   if(title&&title!==draft.title)changes.title=title;
   if(region)changes.region=region;if(district)changes.district=district;
   if(!draft.address&&norm(registry[2]))changes.address=norm(registry[2]);
  }else if(row.kind==='centre'){
   // Regions are taken only from office names; ambiguous districts stay blank.
   for(const region of ['Arusha','Dodoma','Mbeya','Mwanza','Tanga'])if(new RegExp('\\b'+region+'\\b','i').test(row.title)){changes.region=region;break;}
   if(/Kinondoni/i.test(row.title)){changes.region='Dar es Salaam';changes.district='Kinondoni';}
   if(/Dar es Salaam|TAWLA head office/i.test(row.title))changes.region='Dar es Salaam';
   if(/TAWLA Mwanza/i.test(row.title))changes.district='Ilemela';
   if(/TAWLA head office/i.test(row.title))changes.district='Ilala';
  }
  const check=evidence.records.find(e=>e.externalKey===row.externalKey);
  const reachable=check?.reachableSources??0;
  const caution=registry?'Registry table fields are observed in a historical published register, not proof of current registration. Check current Zanzibar registry and intake.':row.kind==='pathway'?'This is a pathway research lead, not an organisation or physical service location.':'Office-region candidates come from the named source office; verify exact district, contacts, hours, intake and coverage.';
  const marker='\n\n[Research preparation 2026-10-24]';const previous=draft.notes.split(marker)[0];
  changes.notes=previous+marker+' '+reachable+' HTML source page(s) retrieved in the source recheck. Phone observed: '+Boolean(check?.phoneObserved)+'. Email observed: '+Boolean(check?.emailObserved)+'. '+caution+' This automated check grants no verification, current-registration attestation, intake promise, provider membership or publication. See private review evidence packets. Preserve Mainland/Zanzibar applicability and never publish confidential shelter locations.';
  await s.call('mutation',anyApi.directoryResearch.update,{id:row._id,...draft,...changes});
  report.records.push({id:row._id,externalKey:row.externalKey,kind:row.kind,title:changes.title??row.title,changedFields:Object.keys(changes),regionCandidate:changes.region??row.region,districtCandidate:changes.district??row.district,sourceUrls:row.sourceUrls,historicalRegistrationNumber:original.registrationNumberObserved,missingLocation:row.kind!=='pathway'&&(!(changes.region??row.region)||!(changes.district??row.district)),requiresIndependentVerification:true,publicEligible:false});save();console.log(JSON.stringify({updated:report.records.length,total:rows.length,kind:row.kind}));
 }
 report.counts={total:report.records.length,officesOrProviderLeads:report.records.filter(r=>r.kind!=='pathway').length,pathwayLeads:report.records.filter(r=>r.kind==='pathway').length,withRegionCandidate:report.records.filter(r=>r.regionCandidate).length,withDistrictCandidate:report.records.filter(r=>r.districtCandidate).length,officesStillMissingLocation:report.records.filter(r=>r.missingLocation).length,verifiedOrPublished:0};save();
}finally{await s.close();}
