// Read-only smoke checks against the configured backend, without an identity override.
import fs from 'node:fs';
import {ConvexHttpClient} from 'convex/browser';
import {anyApi} from 'convex/server';
const env=Object.fromEntries(fs.readFileSync('.env.local','utf8').split(/\r?\n/).filter(line=>line&& !line.startsWith('#')&&line.includes('=')).map(line=>{const i=line.indexOf('=');return[line.slice(0,i),line.slice(i+1).trim().replace(/^['"]|['"]$/g,'')];}));
const client=new ConvexHttpClient(env.VITE_CONVEX_URL);
const report={checkedAt:new Date().toISOString(),deploymentType:env.CONVEX_DEPLOYMENT?.split(':')[0],identity:'guest_no_token',checks:[],recordMutationsPerformed:0};
async function check(name,fn){try{report.checks.push({name,passed:true,...await fn()});}catch(e){report.checks.push({name,passed:false,error:String(e).replace(/https:\/\/[^\s]+/g,'[endpoint]')});}}
await check('Current public guides are queryable',async()=>{const rows=await client.query(anyApi.publications.listPublicLegalGuides,{});return {count:rows.length};});
await check('Approved guide search is deployed',async()=>{const rows=await client.query(anyApi.publications.searchPublicLegalGuides,{search:'mshahara',jurisdiction:'tanzania_mainland'});return {count:rows.length};});
await check('Public service directory is queryable',async()=>{const rows=await client.query(anyApi.justiceServices.listPublicServices,{});return {count:rows.length};});
for(const [name,ref,args]of [
 ['Guest cannot read private research',anyApi.directoryResearch.list,{paginationOpts:{numItems:10,cursor:null},archived:false}],
 ['Guest cannot read editorial queue',anyApi.publications.listLegalGuidesPage,{paginationOpts:{numItems:10,cursor:null},status:'pending'}],
 ['Guest cannot read provider membership',anyApi.justiceServices.myOrganizations,{}],
])await check(name,async()=>{try{await client.query(ref,args);}catch(e){if(/Unauthorized|Forbidden/.test(String(e)))return {denied:true};throw e;}throw new Error('Guest unexpectedly received protected records.');});
fs.writeFileSync('docs/haki-yangu/management-live-check-2026-10-07.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(report.checks.some(check=>!check.passed))process.exitCode=1;
