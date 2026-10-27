// Genuine development Clerk JWTs for explicitly authorised existing QA accounts.
// No password/token output, provisioning, identity overrides or production support.
import fs from 'node:fs';
import path from 'node:path';
import { ConvexHttpClient } from 'convex/browser';
const root=path.resolve(import.meta.dirname,'../..');
const settings=Object.fromEntries(fs.readFileSync(path.join(root,'.env.local'),'utf8').split(/\r?\n/).flatMap(line=>{const m=line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);return m?[[m[1],m[2].trim().replace(/^['"]|['"]$/g,'')]]:[]}));
const accounts=JSON.parse(fs.readFileSync(path.join(root,'development-role-test-credentials.local'),'utf8')).accounts;
if(!settings.CLERK_SECRET_KEY?.startsWith('sk_test_')||settings.CONVEX_DEPLOYMENT!=='dev:joyous-spaniel-5'||!settings.VITE_CONVEX_URL?.includes('joyous-spaniel-5.convex.cloud'))throw new Error('Expected named QA development environment.');
async function clerk(route,body){const response=await fetch('https://api.clerk.com/v1'+route,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+settings.CLERK_SECRET_KEY,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});const data=await response.json();if(!response.ok)throw new Error('Clerk '+response.status+': '+(data.errors??[]).map(e=>e.code).join(','));return data;}
export async function qaSession(role){
 const account=accounts.find(a=>a.role===role);if(!account?.email?.match(/^haki-qa-[a-z]+\+clerk_test@example\.com$/))throw new Error('Expected an existing authorised QA account.');
 const user=await clerk('/users/'+account.clerkId);if(!user.email_addresses?.some(e=>e.email_address===account.email))throw new Error('QA identity mismatch.');
 const session=await clerk('/sessions',{user_id:account.clerkId});const client=new ConvexHttpClient(settings.VITE_CONVEX_URL);
 return {role,async call(kind,ref,args={}){const token=await clerk('/sessions/'+session.id+'/tokens/convex',{});client.setAuth(token.jwt);return await client[kind](ref,args);},async close(){client.clearAuth();await clerk('/sessions/'+session.id+'/revoke',{});}};
}
