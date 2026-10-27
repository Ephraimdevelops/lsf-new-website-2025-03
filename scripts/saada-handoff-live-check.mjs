import fs from 'node:fs';import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';import {anyApi as api} from 'convex/server';import {qaSession} from './test-support/qa-clerk-session.mjs';
const report={checkedAt:new Date().toISOString(),environment:'authorised QA account; shared development',checks:[],sessionsRevoked:false};const sessions=[];
function check(name,passed){report.checks.push({name,passed:!!passed});assert.ok(passed,name);console.log('PASS: '+name);}
try{
 const person=await qaSession('user');sessions.push(person);const staff=await qaSession('staff');sessions.push(staff);
 const journey=JSON.parse(fs.readFileSync('docs/haki-yangu/connected-journey-2026-10-19.json','utf8'));
 const notices=await person.call('query',api.notifications.inbox,{limit:100});check('case journey generated beneficiary in-app notifications',notices.some(n=>n.resourceId===journey.caseId));
 const conversationId=await person.call('mutation',api.sara_chat.createConversation,{title:'TEST ONLY — factual request worksheet rehearsal'});report.conversationId=conversationId;
 const before=(await person.call('query',api.legalHelp.myRequests)).length;
 const answer=await person.call('action',api.sara_actions.ask,{conversationId,clientRequestId:randomUUID(),source:'web',locale:'en',message:'TEST ONLY, fictional QA scenario: My employer has not paid my salary for two months. I am in Ilala, Dar es Salaam, Mainland Tanzania. I want help understanding next steps, and contact only in this app. Please prepare an unsaved factual help-request worksheet from my words for me to review. Do not submit, send a referral, or make legal claims.'});
 const messages=await person.call('query',api.sara_chat.getConversationMessages,{conversationId,paginationOpts:{numItems:20,cursor:null}});const assistant=messages.page.find(m=>m.role==='assistant');
 report.agentTools=assistant?.toolCalls??[];report.answerCharacters=answer.length;
 check('Saada returned a factual reviewable response',typeof answer==='string'&&answer.length>50);
 check('Saada used the governed draft tool',report.agentTools.includes('prepare_help_draft'));
 check('Saada did not silently create a legal-help request',(await person.call('query',api.legalHelp.myRequests)).length===before);
 let denied=false;try{await staff.call('query',api.sara_chat.getConversationMessages,{conversationId,paginationOpts:{numItems:20,cursor:null}});}catch{denied=true;}check('another role cannot read beneficiary private Saada conversation',denied);
 report.legalEvidenceGate='No approved legal sources exist; no sourced legal answer claimed.';
}catch(e){report.failure=String(e.message).slice(0,1200);console.log('STOPPED: '+report.failure);process.exitCode=1;}
finally{const cleanup=await Promise.allSettled(sessions.map(s=>s.close()));report.sessionsRevoked=cleanup.every(r=>r.status==='fulfilled');fs.writeFileSync('docs/haki-yangu/saada-handoff-2026-10-19.json',JSON.stringify(report,null,2)+'\n');}
