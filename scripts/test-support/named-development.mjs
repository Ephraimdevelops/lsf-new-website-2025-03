import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const root=path.resolve(import.meta.dirname,'../..');
const accounts=JSON.parse(fs.readFileSync(path.join(root,'development-role-test-credentials.local'),'utf8')).accounts;
export function runDevelopment(fn,args={},role) {
 const opts=['run',fn,JSON.stringify(args),'--deployment-name','joyous-spaniel-5'];
 if(role){const account=accounts.find(x=>x.role===role);assert.ok(account?.clerkId&&account.email.endsWith('+clerk_test@example.com'));opts.push('--identity',JSON.stringify({subject:account.clerkId,email:account.email,name:account.name}));}
 try { const outputPath=path.join('/tmp',`paralegal-cli-${process.pid}.json`);const descriptor=fs.openSync(outputPath,'w',0o600);try { execFileSync(process.execPath,[path.join(root,'node_modules/convex/bin/main.js'),...opts],{cwd:root,encoding:'utf8',stdio:['ignore',descriptor,'pipe'],timeout:60000}); } finally {fs.closeSync(descriptor);} const raw=fs.readFileSync(outputPath,'utf8').trim();fs.unlinkSync(outputPath);return raw?JSON.parse(raw):null; }
 catch(error){throw new Error(`${fn}: ${String(error.stderr||error.message).replace(/sk_(test|live)_\S+/g,'[redacted]').slice(0,1400)}`);}
}
