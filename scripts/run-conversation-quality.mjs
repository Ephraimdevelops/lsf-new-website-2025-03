import fs from 'node:fs';
import {anyApi} from 'convex/server';
import {qaSession} from './test-support/qa-clerk-session.mjs';
const source=JSON.parse(fs.readFileSync('docs/haki-yangu/conversation-quality-review-cases-2026-11-16.json','utf8'));
const output=process.argv[2]??'docs/haki-yangu/ai-improvements-2026-11-16/model-comparison.json';
const report=fs.existsSync(output)?JSON.parse(fs.readFileSync(output,'utf8')):{startedAt:new Date().toISOString(),models:['gpt-4o','gpt-4o-mini'],results:[],errors:[]};
const save=()=>fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
for(const model of report.models){const session=await qaSession('admin');try{
 for(const test of source.cases.filter(test=>!process.argv[3]||process.argv[3].split(',').includes(test.id))){if(report.results.some(row=>row.caseId===test.id&&row.model===model))continue;
  try{const result=await session.call('action',anyApi.aiQuality.evaluate,{caseId:test.id,model});report.results.push(result);report.errors=report.errors.filter(x=>x.caseId!==test.id||x.model!==model);save();console.log(JSON.stringify({model,case:test.id,completed:report.results.length,calls:result.calls,chatCost:result.chatCostEstimateUSD}));}
  catch(error){const message=String(error.message??error).replace(/https?:\/\/\S+/g,'[URL]').slice(0,400);report.errors.push({model,caseId:test.id,message});save();console.log(JSON.stringify({model,case:test.id,error:message}));if(/allowance|spending|budget|cost cannot|rate.limit|authentication|Unauthorized|Administrator required/i.test(message))throw new Error('Evaluation stopped by budget/access/rate controls');}
 }
}finally{await session.close();}}
report.finishedAt=new Date().toISOString();report.summary=report.models.map(model=>{const results=report.results.filter(x=>x.model===model);return {model,cases:results.length,calls:results.reduce((a,x)=>a+x.calls,0),chatCostEstimateUSD:results.reduce((a,x)=>a+x.chatCostEstimateUSD,0),latencyMs:results.reduce((a,x)=>a+x.latencyMs,0),withheldTurns:results.flatMap(x=>x.turns).filter(x=>x.withheld).length};});save();console.log(JSON.stringify(report.summary));
