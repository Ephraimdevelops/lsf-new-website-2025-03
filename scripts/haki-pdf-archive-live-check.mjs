// Read-only deployed authorization checks. No user token or identity override.
import fs from 'node:fs';
import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';
const env=Object.fromEntries(fs.readFileSync('.env.local','utf8').split(/\r?\n/).filter(line=>line&&!line.startsWith('#')&&line.includes('=')).map(line=>{const i=line.indexOf('=');return[line.slice(0,i),line.slice(i+1).trim().replace(/^['"]|['"]$/g,'')];}));
const client=new ConvexHttpClient(env.VITE_CONVEX_URL);
const report={checkedAt:new Date().toISOString(),deploymentType:env.CONVEX_DEPLOYMENT?.split(':')[0],identity:'guest_no_token',checks:[],recordMutationsPerformed:0};
for(const [name,ref,args]of [
  ['Guest cannot read PDF archive',anyApi.saadaResearchPdfs.listPage,{paginationOpts:{numItems:10,cursor:null},archived:false}],
  ['Guest cannot inspect stored PDF receipts',anyApi.saadaResearchPdfs.lookup,{hashes:[]}],
]){
  try{await client.query(ref,args);report.checks.push({name,passed:false,error:'Unexpected access.'});}
  catch(error){report.checks.push({name,passed:/Unauthorized|Forbidden/.test(String(error)),denied:/Unauthorized|Forbidden/.test(String(error))});}
}
for(const [name,ref,args]of [
  ['Public approved guides',anyApi.publications.listPublicLegalGuides,{}],
  ['Public verified services',anyApi.justiceServices.listPublicServices,{}],
]){
  try{report.checks.push({name,passed:true,count:(await client.query(ref,args)).length});}
  catch{report.checks.push({name,passed:false});}
}
fs.writeFileSync('docs/haki-yangu/pdf-upload-preparation-2026-10-07/deployed-privacy-check.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(report.checks.some(check=>!check.passed))process.exitCode=1;
