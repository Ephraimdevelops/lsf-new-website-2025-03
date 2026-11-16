import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {getFunctionName} from 'convex/server';
const bundle=await build({entryPoints:['convex/socialMessagingActions.ts'],bundle:true,write:false,platform:'node',format:'esm',define:{'process.env.OPENAI_API_KEY':'"offline-key"'},plugins:[{name:'offline-social-model',setup(build){build.onResolve({filter:/^openai$/},()=>({path:'model',namespace:'test'}));build.onLoad({filter:/.*/,namespace:'test'},()=>({contents:`export default class {embeddings={create:async()=>({data:[{embedding:[0,1]}],usage:{prompt_tokens:2,total_tokens:2}})};chat={completions:{create:async(options)=>{globalThis.__socialCalls.push(options);const result=globalThis.__socialRounds.shift();if(!result)throw new Error('No offline round');return {...result,usage:{prompt_tokens:20,completion_tokens:10}};}}};}`}));}}]});
const actions=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const tool=(name,args)=>({choices:[{message:{tool_calls:[{id:'call-'+name,type:'function',function:{name,arguments:JSON.stringify(args)}}]}}]});
const answer=(reply,kind,sourceIds=[])=>({choices:[{message:{content:JSON.stringify({reply,kind,sourceIds,escalate:false})}}]});
function fixture(extra={}){
 const reads=[],writes=[],data={'socialMessaging:get':{status:'drafting',text:'Which details go in a written employment contract in Mainland Tanzania?'},'socialMessaging:hasConsent':true,'socialMessaging:history':[{question:'Which details go in a written employment contract in Mainland Tanzania?'}],'sara:getApprovedPromptInternal':null,'sara:getApprovedChunkIds':[],'sara:getChunks':[],'sara:searchApprovedPassages':[],...extra};
 return {reads,writes,ctx:{vectorSearch:async()=>[],runQuery:async(ref,args)=>{const name=getFunctionName(ref);reads.push({name,args});return data[name]??[];},runMutation:async(ref,args)=>{const name=getFunctionName(ref);writes.push({name,args});return 'usage-fixture';}}};
}
test('the real social action can use an approved lexical passage and emits server-bound citations',async()=>{
 globalThis.__socialCalls=[];globalThis.__socialRounds=[tool('search_knowledge',{search:'written employment contract particulars'}),answer('The reviewed passage supports this fixture explanation.','legal',['law:reviewed'])];
 const f=fixture({'sara:searchApprovedPassages':[{documentId:'reviewed',text:'Reviewed fixture passage.',sourceTitle:'Reviewed fixture employment statute',sourceUrl:'https://example.go.tz/reviewed',jurisdiction:'tanzania_mainland'}]});
 await actions.draft._handler(f.ctx,{id:'message-fixture'});
 const saved=f.writes.find(x=>x.name==='socialMessaging:finishDraft').args;
 assert.equal(saved.kind,'legal');assert.equal(saved.escalate,undefined);assert.match(saved.text,/https:\/\/example.go.tz\/reviewed/);assert.deepEqual(saved.tools,['search_knowledge']);
 assert.ok(f.reads.some(x=>x.name==='sara:searchApprovedPassages'&&x.args.search==='written employment contract particulars'));
 assert.ok(f.writes.some(x=>x.name==='aiUsage:reserveSocial'));assert.ok(!f.writes.some(x=>x.name==='aiUsage:reserve'));
});
test('closed public services remain usable as labelled contacts, without becoming an intake promise',async()=>{
 globalThis.__socialCalls=[];globalThis.__socialRounds=[tool('find_services',{district:'Kinondoni'}),answer('This is a published office contact; confirm whether it can accept your matter.','information',['service:office'])];
 const f=fixture({'socialMessaging:get':{status:'drafting',text:'I need an office contact in Kinondoni.'},'socialMessaging:history':[{question:'I need an office contact in Kinondoni.'}],'justiceServices:listPublicServices':[{_id:'office',name:'Fixture office',district:'Kinondoni',region:'Fixture region',currentIntakeState:'closed',phone:'+255000000000',physicalLocation:'Published fixture address',serviceTypes:['legal_information']}]});
 await actions.draft._handler(f.ctx,{id:'message-fixture'});
 const query=f.reads.find(x=>x.name==='justiceServices:listPublicServices');assert.equal(query.args.district,'Kinondoni');
 const context=globalThis.__socialCalls[1].messages.find(x=>x.role==='tool').content;assert.match(context,/"contactOnly":true/);assert.match(context,/"referralSent":false/);
 assert.equal(f.writes.find(x=>x.name==='socialMessaging:finishDraft').args.escalate,undefined);
 assert.ok(!f.reads.some(x=>/myCases|myRequests|caseManagement|role_assignments/.test(x.name)));
});
test('the consent gate prevents every model, retrieval and directory read',async()=>{
 globalThis.__socialCalls=[];globalThis.__socialRounds=[];const f=fixture({'socialMessaging:hasConsent':false});
 await actions.draft._handler(f.ctx,{id:'message-fixture'});assert.equal(globalThis.__socialCalls.length,0);assert.equal(f.writes.length,0);assert.equal(f.reads.length,2);
});
test('an invented citation is never sent as an approved legal answer',async()=>{
 globalThis.__socialCalls=[];globalThis.__socialRounds=[answer('A model claim.','legal',['fabricated'])];const f=fixture();
 await actions.draft._handler(f.ctx,{id:'message-fixture'});const saved=f.writes.find(x=>x.name==='socialMessaging:finishDraft').args;assert.equal(saved.text,undefined);
});

test('an empty keyword match retries the district without inventing issue eligibility',async()=>{
 globalThis.__socialCalls=[];globalThis.__socialRounds=[tool('find_services',{district:'Kinondoni',search:'msaada wa kisheria',issueCategory:'other'}),answer('Here is a public contact only; confirm suitability and availability directly.','directory',['service:office'])];
 const f=fixture({'socialMessaging:get':{status:'drafting',text:'Nahitaji mawasiliano ya ofisi Kinondoni.'},'socialMessaging:history':[{question:'Nahitaji mawasiliano ya ofisi Kinondoni.'}]}),original=f.ctx.runQuery;
 f.ctx.runQuery=async(ref,args)=>getFunctionName(ref)==='justiceServices:listPublicServices'?(args.search||args.issueCategory?[]:[{_id:'office',name:'Fixture office',district:'Kinondoni',currentIntakeState:'closed',serviceTypes:[]}]):original(ref,args);
 await actions.draft._handler(f.ctx,{id:'message-fixture'});
 const output=JSON.parse(globalThis.__socialCalls[1].messages.find(x=>x.role==='tool').content);
 assert.equal(output.data.broadenedSearch,true);assert.equal(output.data.issueMatchUnconfirmed,true);assert.equal(output.data.services[0].contactOnly,true);
 assert.equal(f.writes.find(x=>x.name==='socialMessaging:finishDraft').args.escalate,undefined);
});

test('WhatsApp delivery uses the configured phone ID and Cloud API text payload',async()=>{
 const keys=['META_MESSAGING_ENABLED','META_GRAPH_VERSION','META_WHATSAPP_PHONE_ID','META_WHATSAPP_TOKEN'];
 const saved=Object.fromEntries(keys.map(key=>[key,process.env[key]])),originalFetch=globalThis.fetch;
 const writes=[],requests=[];
 try{
  Object.assign(process.env,{META_MESSAGING_ENABLED:'true',META_GRAPH_VERSION:'v25.0',META_WHATSAPP_PHONE_ID:'test-phone-id',META_WHATSAPP_TOKEN:'offline-whatsapp-token'});
  globalThis.fetch=async(url,options)=>{requests.push({url,payload:JSON.parse(options.body)});return {ok:true,json:async()=>({messages:[{id:'wamid.fixture'}]})};};
  const ctx={runMutation:async(ref,args)=>{const name=getFunctionName(ref);writes.push({name,args});return name==='socialMessaging:claimSend'?{channel:'whatsapp',account:'test-phone-id',sender:'255000000000',approvedText:'Fixture answer'}:null;}};
  await actions.send._handler(ctx,{id:'message-fixture'});
  assert.equal(requests.length,1);assert.equal(requests[0].url,'https://graph.facebook.com/v25.0/test-phone-id/messages');
  assert.deepEqual(requests[0].payload,{messaging_product:'whatsapp',to:'255000000000',type:'text',text:{body:'Fixture answer'}});
  assert.equal(writes.at(-1).args.outboundId,'wamid.fixture');
 }finally{globalThis.fetch=originalFetch;for(const key of keys){if(saved[key]===undefined)delete process.env[key];else process.env[key]=saved[key];}}
});

test('WhatsApp configuration mismatch cannot send to another business phone account',async()=>{
 const keys=['META_MESSAGING_ENABLED','META_GRAPH_VERSION','META_WHATSAPP_PHONE_ID','META_WHATSAPP_TOKEN'];
 const saved=Object.fromEntries(keys.map(key=>[key,process.env[key]])),originalFetch=globalThis.fetch;let fetches=0;const writes=[];
 try{
  Object.assign(process.env,{META_MESSAGING_ENABLED:'true',META_GRAPH_VERSION:'v25.0',META_WHATSAPP_PHONE_ID:'authorized-phone',META_WHATSAPP_TOKEN:'offline-whatsapp-token'});
  globalThis.fetch=async()=>{fetches++;throw new Error('Must not send');};
  const ctx={runMutation:async(ref,args)=>{const name=getFunctionName(ref);writes.push({name,args});return name==='socialMessaging:claimSend'?{channel:'whatsapp',account:'different-phone',sender:'255000000000',approvedText:'Fixture answer'}:null;}};
  await actions.send._handler(ctx,{id:'message-fixture'});assert.equal(fetches,0);assert.equal(writes.at(-1).name,'socialMessaging:finishSend');assert.equal(writes.at(-1).args.outboundId,undefined);
 }finally{globalThis.fetch=originalFetch;for(const key of keys){if(saved[key]===undefined)delete process.env[key];else process.env[key]=saved[key];}}
});

test('social recall uses only the inbound message identity and spaces sentence replies',async()=>{
 globalThis.__socialCalls=[];globalThis.__socialRounds=[tool('recall_conversation',{}),answer('Ulisema unaitwa Asha. Ulisema uko Kinondoni. Tuendelee ulipoishia?','information')];
 const f=fixture({'socialMessaging:get':{status:'drafting',text:'Unakumbuka tulipoishia?'},'socialMessaging:history':[{question:'Unakumbuka tulipoishia?'}],'socialMessaging:recallHistory':[{role:'user',content:'Naitwa Asha, niko Kinondoni.',timestamp:1}]});
 await actions.draft._handler(f.ctx,{id:'message-fixture'});
 assert.deepEqual(f.reads.find(x=>x.name==='socialMessaging:recallHistory').args,{id:'message-fixture',search:undefined});
 const saved=f.writes.find(x=>x.name==='socialMessaging:finishDraft').args;assert.match(saved.text,/Asha\.\n\nUlisema/);assert.equal(saved.escalate,undefined);assert.deepEqual(saved.tools,['recall_conversation']);
});

test('native WhatsApp typing uses the inbound event and cannot block the AI answer',async()=>{
 const keys=['META_MESSAGING_ENABLED','META_GRAPH_VERSION','META_WHATSAPP_PHONE_ID','META_WHATSAPP_TOKEN'];
 const saved=Object.fromEntries(keys.map(key=>[key,process.env[key]])),originalFetch=globalThis.fetch,requests=[];
 try{
  Object.assign(process.env,{META_MESSAGING_ENABLED:'true',META_GRAPH_VERSION:'v25.0',META_WHATSAPP_PHONE_ID:'typing-office',META_WHATSAPP_TOKEN:'offline-token'});
  globalThis.fetch=async(url,options)=>{requests.push({url,payload:JSON.parse(options.body)});throw Error('Activity API unavailable');};
  globalThis.__socialCalls=[];globalThis.__socialRounds=[answer('Karibu, naweza kukusaidiaje?','greeting')];
  const f=fixture({'socialMessaging:get':{status:'drafting',text:'Habari'},'socialMessaging:history':[{question:'Habari'}]});
  const mutate=f.ctx.runMutation;f.ctx.runMutation=async(ref,args)=>getFunctionName(ref)==='socialMessaging:claimTyping'?{channel:'whatsapp',account:'typing-office',sender:'fictional',eventId:'wamid.inbound-fixture'}:mutate(ref,args);
  await actions.draft._handler(f.ctx,{id:'message-fixture'});
  assert.equal(requests.length,1);assert.deepEqual(requests[0].payload,{messaging_product:'whatsapp',status:'read',message_id:'wamid.inbound-fixture',typing_indicator:{type:'text'}});
  assert.equal(f.writes.find(x=>x.name==='socialMessaging:finishDraft').args.kind,'greeting');
 }finally{globalThis.fetch=originalFetch;for(const key of keys){if(saved[key]===undefined)delete process.env[key];else process.env[key]=saved[key];}}
});

test('an empty directory returns a real published LSF office alternative without inventing an individual',async()=>{
 globalThis.__socialCalls=[];globalThis.__socialRounds=[tool('find_paralegals',{district:'Ilala'}),answer('Sina msaidizi aliyethibitishwa hapo. Haya ni mawasiliano ya ofisi ya LSF kwa kuulizia msaada.','information',['lsf:contact'])];
 const f=fixture({'socialMessaging:get':{status:'drafting',text:'Nahitaji msaidizi wa kisheria Ilala'},'socialMessaging:history':[{question:'Nahitaji msaidizi wa kisheria Ilala'}]});
 await actions.draft._handler(f.ctx,{id:'message-fixture'});
 const context=JSON.parse(globalThis.__socialCalls[1].messages.find(x=>x.role==='tool').content);
 assert.deepEqual(context.data.paralegals,[]);assert.equal(context.data.publishedOfficeAlternative.phone,'+255 22 260 1534');
 assert.match(context.data.publishedOfficeAlternative.note,/Not the nearest/);
 const saved=f.writes.find(x=>x.name==='socialMessaging:finishDraft').args;assert.equal(saved.escalate,undefined);assert.match(saved.text,/https:\/\/lsftz.org\/contact/);
});

test('AI finds a recorded ward and receives only the selected public meeting office',async()=>{
 globalThis.__socialCalls=[];globalThis.__socialRounds=[tool('find_paralegals',{district:'Kata ya Ukonga'}),answer('A verified fixture profile matches the recorded ward.','directory',['paralegal:ward-fixture'])];
 const f=fixture({'socialMessaging:get':{status:'drafting',text:'Nahitaji msaidizi wa kisheria Ukonga'},'socialMessaging:history':[{question:'Nahitaji msaidizi wa kisheria Ukonga'}],'paralegals:listApprovedParalegals':[{_id:'ward-fixture',fullName:'Fictional Person',region:'Dar es Salaam',district:'Ilala',ward:'Ukonga',phone:'+255000000000',meetingPoint:{id:'office-fixture',name:'Public meeting office'}}],'justiceServices:getPublicService':{name:'Public meeting office',physicalLocation:'Published fixture address',phone:'+255000000001',openingHours:'Published fixture hours',servicePointType:'legal_aid_provider'}});
 await actions.draft._handler(f.ctx,{id:'message-fixture'});
 const data=JSON.parse(globalThis.__socialCalls[1].messages.find(x=>x.role==='tool').content).data;
 assert.equal(data.paralegals.length,1);assert.equal(data.paralegals[0].ward,'Ukonga');assert.equal(data.paralegals[0].district,'Ilala');assert.equal(data.paralegals[0].meetingOffice.address,'Published fixture address');
 assert.deepEqual(f.reads.find(x=>x.name==='paralegals:listApprovedParalegals').args,{});
 assert.equal(f.writes.find(x=>x.name==='socialMessaging:finishDraft').args.escalate,undefined);
});
