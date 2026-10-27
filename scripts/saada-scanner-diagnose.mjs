// Read-only private service diagnostics. Never emits credentials, request bodies,
// source URLs, deploy logs or beneficiary data.
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
const auth=JSON.parse(fs.readFileSync(path.join(os.homedir(),'Library/Application Support/com.vercel.cli/auth.json'),'utf8'));
const endpoint='https://api.vercel.com';
async function read(route){const r=await fetch(endpoint+route,{headers:{Authorization:'Bearer '+auth.token},signal:AbortSignal.timeout(30000)});const body=await r.json();if(!r.ok)throw Error('Vercel API '+r.status+': '+(body.error?.code??'unknown'));return body;}
const project=await read('/v9/projects/haki-yangu-private-scanner-dev');
const deployments=await read('/v6/deployments?projectId='+encodeURIComponent(project.id)+'&limit=3');
const report={checkedAt:new Date().toISOString(),project:{id:project.id,name:project.name},deployments:deployments.deployments.map(d=>({id:d.uid,state:d.state,created:d.createdAt,target:d.target})),productionEnvironmentNames:[],errors:[]};
try{const env=await read('/v10/projects/'+project.id+'/env');report.productionEnvironmentNames=env.envs.filter(e=>e.target?.includes('production')).map(e=>e.key);}catch{report.errors.push('Could not read environment-variable names.');}
fs.writeFileSync('docs/haki-yangu/saada-scanner-diagnosis-2026-10-24.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
