// Public-query counts only: no private applications, chat records or source bodies.
import fs from 'node:fs';
import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';
const url=fs.readFileSync('.env.local','utf8').match(/^VITE_CONVEX_URL\s*=\s*(.+)$/m)?.[1].trim().replace(/^['"]|['"]$/g,'');
const client=new ConvexHttpClient(url);
const result={checkedAt:new Date().toISOString(),environment:'configured development backend',publicEligible:{}};
for(const [name,ref,args] of [['guides',anyApi.publications.listPublicLegalGuides,{}],['services',anyApi.justiceServices.listPublicServices,{}],['paralegals',anyApi.paralegals.listApprovedParalegals,{}],['kinondoniServices',anyApi.justiceServices.listPublicServices,{district:'Kinondoni'}]]){
 try{result.publicEligible[name]=(await client.query(ref,args)).length;}catch{result.publicEligible[name]='query_failed';}
}
fs.writeFileSync('docs/haki-yangu/saada-public-readiness-2026-10-16.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
