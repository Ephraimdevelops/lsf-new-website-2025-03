import fs from 'node:fs';
import {anyApi} from 'convex/server';
import {qaSession} from './test-support/qa-clerk-session.mjs';
const folder='docs/haki-yangu/ai-improvements-2026-11-16/';
const audit=JSON.parse(fs.readFileSync(folder+'directory-source-check.json','utf8'));
const session=await qaSession('admin'),result={checkedAt:new Date().toISOString(),updated:[],unchanged:[],failed:[],publicApprovals:0};
try{
 let cursor=null;
 do{const page=await session.call('query',anyApi.directoryResearch.list,{archived:false,paginationOpts:{numItems:100,cursor}});
 for(const row of page.page){const check=audit.records.find(x=>x.externalKey===row.externalKey);if(!check)continue;
 const note='[Source recheck 2026-11-16] '+check.reachableSources+' source HTML page(s) reachable. This is a source reachability check, not independent legal review or verification of a provider. '+(row.kind==='pathway'?'This is a pathway, not a physical office: region/district/contact fields are not a physical-office completeness requirement. Verify jurisdiction-specific forum, procedure, safety exclusions and current law.':'Confirm the actual office’s region, district, public address, contacts and current intake. Missing fields: '+check.missingFields.join(', ')+'. Resolve duplicate office leads before activation.');
 const notes=row.notes.replace(/\n\n\[Source recheck 2026-11-16\][\s\S]*$/,'')+'\n\n'+note;
 if(notes===row.notes){result.unchanged.push(row._id);continue;}
 const fields=['externalKey','kind','title','region','district','address','phone','email','sourceUrls','originalRecord'];
 await session.call('mutation',anyApi.directoryResearch.update,{id:row._id,...Object.fromEntries(fields.filter(k=>row[k]!==undefined).map(k=>[k,row[k]])),notes});result.updated.push(row._id);
 }
 cursor=page.isDone?null:page.continueCursor;
 }while(cursor);
}catch(error){result.failed.push(String(error.message).slice(0,400));throw error;}finally{fs.writeFileSync(folder+'directory-review-refresh.json',JSON.stringify(result,null,2)+'\n');await session.close();}
console.log(JSON.stringify({updated:result.updated.length,unchanged:result.unchanged.length,publicApprovals:0}));
