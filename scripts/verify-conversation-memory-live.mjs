import fs from 'node:fs';
import assert from 'node:assert/strict';
import {anyApi} from 'convex/server';
import {qaSession} from './test-support/qa-clerk-session.mjs';
const session=await qaSession('admin');
const output={checkedAt:new Date().toISOString(),scope:'Existing QA administrator; fictional facts only; development deployment',checks:[],turns:[]};
try{
 const conversationId=await session.call('mutation',anyApi.sara_chat.createConversation,{title:'QA fictional memory review 2026-11-16'});
 output.conversationId=conversationId;
 const ask=async(message)=>{await session.call('mutation',anyApi.sara_chat.sendMessage,{conversationId,content:message});const reply=await session.call('action',anyApi.sara_actions.ask,{conversationId,message,locale:'en',source:'web',clientRequestId:'memory-qa-'+crypto.randomUUID()});output.turns.push({message,reply});return reply;};
 await session.call('mutation',anyApi.conversationMemory.update,{conversationId,facts:{name:'Asha QA',location:'Kinondoni',issue:'unpaid wages',desiredOutcome:'prepare a factual request'}});
 assert.equal((await session.call('query',anyApi.conversationMemory.get,{conversationId})).facts.location,'Kinondoni');output.checks.push('structured facts saved and read');
 const firstReply=await ask('My name is Asha QA. I am in Kinondoni and I want to prepare a factual request about unpaid wages.');assert.doesNotMatch(firstReply,/Zanzibar Persons|Gazette7067B/);output.checks.push('factual employment request does not cite unrelated disability guidance');
 await session.call('mutation',anyApi.conversationMemory.update,{conversationId,facts:{name:'Asha QA',location:'Ilala',issue:'unpaid wages',desiredOutcome:'prepare a factual request'}});
 const corrected=await session.call('query',anyApi.conversationMemory.get,{conversationId});assert.equal(corrected.facts.location,'Ilala');output.checks.push('manual location correction persisted');
 const locationReply=await ask('What location is currently saved in my chat memory?');assert.match(locationReply,/Ilala/);assert.doesNotMatch(locationReply,/Sources:|Vyanzo:|Kinondoni/);output.checks.push('current saved location answered without stale location or unrelated citation');
 await session.call('mutation',anyApi.conversationMemory.clear,{conversationId});const cleared=await session.call('query',anyApi.conversationMemory.get,{conversationId});assert.deepEqual(cleared.facts,{});assert.ok(cleared.forgotBefore);output.checks.push('clear removes saved facts and establishes history cutoff');
 const forgottenReply=await ask('Do you remember my name and where I live?');assert.doesNotMatch(forgottenReply,/Asha|Ilala|Kinondoni|Sources:|Vyanzo:/);output.checks.push('post-clear answer does not recall earlier name or location');
 output.usage=await session.call('query',anyApi.aiUsage.status,{});
}finally{fs.writeFileSync('docs/haki-yangu/ai-improvements-2026-11-16/live-memory-check.json',JSON.stringify(output,null,2)+'\n');await session.close();}
console.log(JSON.stringify({checks:output.checks,turns:output.turns.length}));
