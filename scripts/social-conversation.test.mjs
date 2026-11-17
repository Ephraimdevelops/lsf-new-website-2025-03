import test from 'node:test';
import assert from 'node:assert/strict';

import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const {replyEscalation,socialTriage}=loadHandlerModule('convex/lib/socialTriage.ts');
const {SOCIAL_TOOLS,socialConversationMessages,runSocialConversation}=loadHandlerModule('convex/lib/socialConversation.ts');
const answer=(reply,kind='information',sourceIds=[])=>({choices:[{message:{content:JSON.stringify({reply,kind,escalate:false,sourceIds})}}]});
const calls=(name,args={})=>({choices:[{message:{content:null,tool_calls:[{id:'tool-'+name,type:'function',function:{name,arguments:JSON.stringify(args)}}]}}]});
test('a short district reply retains Swahili context; an explicit English switch wins',()=>{
 const history=[{question:'Nina tatizo la nyumba ninayopanga',answer:'Unaishi wilaya gani?'},{question:'Kinondoni'}];
 assert.equal(socialConversationMessages('Kinondoni',history).locale,'sw');
 assert.equal(socialConversationMessages('Please answer in English',history).locale,'en');
});
test('staff messages stay assistant turns; the latest sender message is not duplicated',()=>{
 const {messages}=socialConversationMessages('What next?',[{question:'Staff reply',answer:'A recorded team reply',staffReply:true},{question:'What next?'}]);
 assert.equal(messages.filter(x=>x.role==='user').length,1);assert.equal(messages[1].role,'assistant');assert.ok(!JSON.stringify(messages).includes('"content":"Staff reply"'));
});
test('social tools cannot expose private cases, actions, staff reports or document readers',()=>{
 const names=SOCIAL_TOOLS.map(x=>x.function.name);assert.ok(names.includes('search_knowledge'));assert.ok(names.includes('find_services'));assert.ok(names.includes('load_skill'));
 for(const name of ['my_cases','my_requests','staff_workload','prepare_referral','read_my_document_summary'])assert.ok(!names.includes(name));
});
test('a retry can find legal evidence after an empty first search',async()=>{
 const responses=[calls('search_knowledge',{search:'mkataba ajira'}),calls('search_knowledge',{search:'written employment contract particulars'}),answer('Supported explanation.','legal',['law:reviewed'])],queries=[];
 const result=await runSocialConversation({messages:[],create:async()=>responses.shift(),execute:async(_name,args)=>{queries.push(args.search);return queries.length===1?{data:{passages:[]}}:{data:{passages:[{sourceId:'law:reviewed',text:'Reviewed fixture passage'}]},sources:[{id:'law:reviewed',kind:'legal',title:'Reviewed fixture law',url:'https://example.go.tz/law'}]};}});
 assert.equal(queries.length,2);assert.equal(result.legal,true);assert.equal(result.missingEvidence,false);
});
test('factual preparation needs no legal source and does not itself hand off',async()=>{
 const result=await runSocialConversation({messages:[],create:async()=>answer('Keep your existing receipts and write a factual timeline. What happened first?','preparation'),execute:async()=>{throw new Error('No tool needed');}});
 assert.equal(replyEscalation(result,{legal:result.legal,directory:result.directory,priorReplies:0}),undefined);
});
test('legal claims require a cited legal source, not just a publisher contact',async()=>{
 const responses=[calls('find_information_resources',{}),answer('An unsupported legal ruling.','legal',['publisher:lhrc'])];
 const result=await runSocialConversation({messages:[],create:async()=>responses.shift()??answer('An unsupported legal ruling.','legal',['publisher:lhrc']),execute:async()=>({data:{contacts:[]},sources:[{id:'publisher:lhrc',kind:'published',title:'Publisher contact'}]})});
 assert.equal(result.missingEvidence,true);assert.equal(replyEscalation(result,{legal:result.legal,directory:result.directory,priorReplies:0}),'no_verified_answer');
});
test('unknown citations fail closed; fabricated links are removed from model text',async()=>{
 await assert.rejects(runSocialConversation({messages:[],create:async()=>answer('A legal answer','legal',['invented']),execute:async()=>({data:[]})}),/Invalid social answer/);
 const result=await runSocialConversation({messages:[],create:async()=>answer('See https://invented.invalid and [a label](https://invented.invalid/x).'),execute:async()=>({data:[]})});
 assert.ok(!result.reply.includes('invented.invalid'));
});
test('an injected private tool call never reaches an executor',async()=>{
 const responses=[calls('my_cases',{}),answer('I cannot read private cases in this DM.')];let executed=false;
 await runSocialConversation({messages:[],create:async()=>responses.shift(),execute:async()=>{executed=true;return {data:[]};}});assert.equal(executed,false);
});
test('duplicate tool requests are cached and repeated tool loops are bounded',async()=>{
 let reads=0;const responses=[calls('find_guides',{search:'tenancy'}),calls('find_guides',{search:'tenancy'}),answer('What would you like help with?','clarification')];
 await runSocialConversation({messages:[],create:async()=>responses.shift(),execute:async()=>{reads++;return {data:[]};}});assert.equal(reads,1);
 await assert.rejects(runSocialConversation({messages:[],create:async()=>calls('find_guides',{search:'tenancy'}),execute:async()=>({data:[]})}),/limit exceeded/);
});
test('general questions about sensitive law do not imply an emergency; real disclosures still escalate',()=>{
 assert.equal(socialTriage('What is domestic violence?'),null);assert.equal(socialTriage('Explain the law on rape in Tanzania'),null);
 assert.equal(socialTriage('What is my right if I was raped?'),'urgent_safety');assert.equal(socialTriage('I am being attacked and want a human agent'),'human_request');
});
test('lexical retrieval excludes pending and expired documents and strips embedding vectors',async()=>{
 const h=harness(),sara=loadHandlerModule('convex/sara.ts');
 for(const [status,due] of [['approved',Date.now()+86400000],['pending',Date.now()+86400000],['approved',Date.now()-1]]){
  const id=await h.db.insert('documents',{title:'Employment fixture',approvalStatus:status,reviewDueAt:due});
  await h.db.insert('embeddings',{documentId:id,text:'A written employment contract fixture passage',embedding:[1,2,3],chunkIndex:0});
 }
 const rows=await h.invoke(sara.searchApprovedPassages,{search:'written employment contract'});assert.equal(rows.length,1);assert.equal(rows[0].embedding,undefined);
});

test('an invalid answer gets one bounded correction and can recover with fresh evidence',async()=>{
 let round=0;
 const result=await runSocialConversation({messages:[],create:async()=>{
  round++;
  if(round===1)return {choices:[{message:{content:'{unfinished'}}]};
  return {choices:[{message:{content:JSON.stringify({reply:'Let’s organise the dates and what happened first.',kind:'preparation',escalate:false,sourceIds:[]})}}]};
 },execute:async()=>{throw new Error('No tool needed');}});
 assert.equal(round,2);assert.equal(result.kind,'preparation');assert.equal(result.escalate,false);
});

test('a substantive legal question retrieves evidence before a model can relabel law as information',async()=>{
 let searched=0;
 const result=await runSocialConversation({messages:[{role:'user',content:'What must an employment contract contain?'}],execute:async(name)=>{assert.equal(name,'search_knowledge');searched++;return {data:{passages:[]}};},create:async()=>answer('The law requires invented particulars.','information')});
 assert.equal(searched,1);assert.equal(result.missingEvidence,true);assert.equal(replyEscalation(result,{legal:false,directory:false,priorReplies:0}),'no_verified_answer');
});
test('direct processing questions disclose OpenAI truthfully without a model call',async()=>{
 const result=await runSocialConversation({messages:[{role:'user',content:'Which company processes my AI messages?'}],create:async()=>{throw new Error('Should not call model');},execute:async()=>{throw new Error('No tool');}});
 assert.match(result.reply,/OpenAI/);assert.equal(result.escalate,false);
});

test('a model cannot append duplicate source footers before the validated server citation',async()=>{
 const result=await runSocialConversation({messages:[{role:'user',content:'Tell me about LSF'}],create:async()=>answer('LSF information.\n\nChanzo: LSF published information — https://invented.invalid'),execute:async()=>({data:[]})});assert.equal(result.reply,'LSF information.');
});

test('YES after a Swahili greeting remains Swahili without another introduction',async()=>{
 const result=await runSocialConversation({messages:[{role:'user',content:'Habari'},{role:'assistant',content:'Consent notice'},{role:'user',content:'Yes'}],create:async()=>{throw new Error('No model needed');},execute:async()=>({data:[]})});assert.match(result.reply,/Naweza kukusaidiaje/);assert.doesNotMatch(result.reply,/Hello|Mimi ni/);
});

test('a poorly spelled voice transcript retains its validated conversation language',()=>{const prepared=socialConversationMessages('Abari LSF unapagyanini',[{question:'Hello Abari Elese'},{question:'Abari LSF unapagyanini'}],undefined,{},'sw');assert.equal(prepared.locale,'sw');assert.match(prepared.messages[0].content,/Confirm important names, dates, amounts/);});
test('reporting invalidates earlier lookup caches and removes the disputed citation in the same turn',async()=>{
 const responses=[calls('find_services',{district:'Kinondoni'}),calls('report_information_problem',{referenceId:'service:old',category:'wrong_contact'}),calls('find_services',{district:'Kinondoni'}),answer('Here is a different office contact.','information',['service:next'])];let lookups=0;
 const result=await runSocialConversation({messages:[],create:async()=>responses.shift(),execute:async name=>name==='report_information_problem'?{data:{excludedIds:['service:old']}}:{data:{},sources:[{id:++lookups===1?'service:old':'service:next',kind:'directory',title:'Fixture office'}]}});
 assert.equal(lookups,2);assert.equal(result.cited[0].id,'service:next');
});
test('registration questions retrieve the approved guide before any model answer',async()=>{const reads=[];const result=await runSocialConversation({messages:[{role:'user',content:'Nilizaliwa nyumbani na sina cheti cha kuzaliwa. Nifanye nini?'}],create:async()=>answer('RITA inaeleza njia ya usajili uliochelewa; thibitisha mahitaji kwa hali yako.','legal',['guide:registration-fixture']),execute:async(name,args)=>{reads.push({name,args});return {data:{guide:'Reviewed optional preparation'},sources:[{id:'guide:registration-fixture',kind:'legal',title:'Reviewed RITA guidance'}]};}});assert.equal(reads[0].name,'find_guides');assert.equal(result.missingEvidence,false);assert.ok(result.usedTools.includes('find_guides'));});
test('calling an unsupported registration procedure preparation does not bypass evidence checks',async()=>{const result=await runSocialConversation({messages:[{role:'user',content:'Sina cheti cha kuzaliwa. Nifanye nini?'}],create:async()=>answer('Nenda ofisi ya mtaa waombe barua kisha peleka RITA.','preparation'),execute:async()=>({data:{guides:[]}})});assert.equal(result.missingEvidence,true);});
test('a named organisation contact is retrieved before generation instead of silently substituting a different provider',async()=>{const reads=[];const result=await runSocialConversation({messages:[{role:'user',content:'Naomba namba ya WiLDAF Dar es Salaam.'}],create:async()=>answer('Namba iliyochapishwa ya WiLDAF ni 0800780070.','information',['research:contact-fixture']),execute:async(name,args)=>{reads.push({name,args});return {data:{phone:'0800780070'},sources:[{id:'research:contact-fixture',kind:'published',title:'WiLDAF public contact',phone:'0800780070'}]};}});assert.deepEqual(reads[0],{name:'find_information_resources',args:{search:'WiLDAF'}});assert.equal(result.missingEvidence,false);assert.match(result.reply,/0800780070/);});
