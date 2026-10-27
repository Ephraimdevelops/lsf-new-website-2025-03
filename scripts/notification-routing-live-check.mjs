// Read-only application checks with the owner's existing QA accounts.
import fs from 'node:fs';import assert from 'node:assert/strict';import {anyApi as api} from 'convex/server';import {qaSession} from './test-support/qa-clerk-session.mjs';
const report={checkedAt:new Date().toISOString(),environment:'named development; genuine temporary Clerk sessions',checks:[],open:[],sessionsRevoked:false};const sessions=[];
function check(name,passed){report.checks.push({name,passed:!!passed});assert.ok(passed,name);console.log('PASS: '+name);}
try{
 const person=await qaSession('user');sessions.push(person);const staff=await qaSession('staff');sessions.push(staff);
 const inbox=await person.call('query',api.notifications.inbox,{limit:100});check('signed-in beneficiary notification inbox loads',Array.isArray(inbox));
 if(inbox[0]){let denied=false;try{await staff.call('query',api.notifications.referralContext,{notificationId:inbox[0]._id});}catch{denied=true;}check('another account cannot resolve a beneficiary notification',denied);}
 const referral=inbox.find(n=>n.resourceType==='referral');
 if(referral){const target=await person.call('query',api.notifications.referralContext,{notificationId:referral._id});check('existing beneficiary referral notification resolves a beneficiary case',!!target.beneficiaryCaseId);}else report.open.push('No referral notification in latest 100 beneficiary entries; live consent/referral routing still requires an eligible reviewed service.');
 report.open.push('External push delivery/tap acceptance still requires configured project credentials and the actual native build.');
}catch(e){report.failure=String(e.message).slice(0,800);process.exitCode=1;}
finally{const cleanup=await Promise.allSettled(sessions.map(s=>s.close()));report.sessionsRevoked=cleanup.every(r=>r.status==='fulfilled');fs.writeFileSync('docs/haki-yangu/notification-routing-2026-10-19.json',JSON.stringify(report,null,2)+'\n');}
