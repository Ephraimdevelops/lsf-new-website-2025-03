import test from 'node:test';
import assert from 'node:assert/strict';
import {loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const {socialTriage,replyEscalation}=loadHandlerModule('convex/lib/socialTriage.ts');
test('requests for a person override ordinary replies',()=>{for(const x of ['HUMAN','MTU','I want to talk to a person','nataka kuongea na mtu','sitaki AI'])assert.equal(socialTriage(x),'human_request');});
test('safety concerns escalate',()=>{for(const x of ['I want to kill myself','an ananipiga','ubakaji'])assert.equal(socialTriage(x),'urgent_safety');});
test('unhelpful conversations escalate in both languages',()=>{for(const x of ['That is not helpful','You didn’t help'.replace('’',"'"),'hujanisaidia','sijasaidiwa'])assert.equal(socialTriage(x),'not_helped');});
test('routine question is not a deterministic handoff',()=>assert.equal(socialTriage('How can I find help in Arusha?'),null));
const evidence={legal:false,directory:false,priorReplies:0};
const reply=(kind,escalate=false)=>({reply:'A response',kind,escalate});
test('no approved law means no automatic legal answer',()=>assert.equal(replyEscalation(reply('legal'),evidence),'no_verified_answer'));
test('no provider means directory question needs human help',()=>assert.equal(replyEscalation(reply('directory'),evidence),'no_verified_answer'));
test('supported answer and focused clarification can be automatic',()=>{assert.equal(replyEscalation(reply('legal'),{...evidence,legal:true}),undefined);assert.equal(replyEscalation(reply('clarification'),evidence),undefined);});
test('clarification does not force human takeover after an arbitrary turn count',()=>assert.equal(replyEscalation(reply('clarification'),{...evidence,priorReplies:3}),undefined));
test('model handoff and malformed result fail closed',()=>{assert.equal(replyEscalation(reply('greeting',true),evidence),'ai_handoff');assert.equal(replyEscalation({reply:'',kind:'legal',escalate:false},evidence),'invalid_ai_response');assert.equal(replyEscalation({reply:'answer',kind:'unknown',escalate:false},evidence),'invalid_ai_response');});
test('sensitive personal matters route to staff',()=>{assert.equal(socialTriage('I need help with domestic violence'),'sensitive_case');assert.equal(socialTriage('passport number: AB1234567'),'sensitive_case');});
test('mentioning a person is not itself a handoff request',()=>assert.equal(socialTriage('Mtu amechukua ardhi yangu'),null));

test('organization information does not require a verified legal source',()=>assert.equal(replyEscalation(reply('information'),evidence),undefined));

test('asking about required documents is not a sensitive disclosure',()=>assert.equal(socialTriage('Why do you need a passport number?'),null));
test('past normal replies do not exhaust the clarification allowance',()=>assert.equal(replyEscalation(reply('clarification'),{...evidence,priorReplies:8,consecutiveClarifications:0}),undefined));

test('requests to keep AI and informational mentions of staff do not request a human',()=>{for(const text of ['I do not want a human, please answer here','sitaki mtu, nijibu wewe','What does a mhudumu do?','What is a human agent?'])assert.notEqual(socialTriage(text),'human_request');});
