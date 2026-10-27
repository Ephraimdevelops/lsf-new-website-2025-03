import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSync } from 'esbuild';
const load = path => import('data:text/javascript;base64,' + Buffer.from(buildSync({entryPoints:[path],bundle:true,write:false,platform:'node',format:'esm'}).outputFiles[0].text).toString('base64'));
const {decodeWebDraft,newWebDraft,webDraftKey,webDraftReady}=await load('src/lib/webIntakeDraft.ts');
const {requestReachedStages,requestNextStep}=await load('mobile/src/requestProgress.ts');
test('web drafts cannot be restored under another account or guest identity',()=>{
 const draft=newWebDraft(new URLSearchParams('issue=employment&region=Dar+es+Salaam'));
 const raw=JSON.stringify({owner:'alice',draft});assert.equal(decodeWebDraft(raw,'alice').issue,'employment');
 for(const owner of ['bob',null])assert.throws(()=>decodeWebDraft(raw,owner));
 assert.notEqual(webDraftKey('guest'),webDraftKey(null));assert.notEqual(webDraftKey('a/b'),webDraftKey('a%2Fb'));
});
test('invalid saved fields do not enter the request form',()=>{
 const draft=newWebDraft(new URLSearchParams());
 for(const patch of [{story:5},{contact:'publish'},{urgency:'critical'},{id:''},{sourceServiceId:42},{story:'a'.repeat(5001)}])assert.throws(()=>decodeWebDraft(JSON.stringify({owner:null,draft:{...draft,...patch}}),null));
});
test('review requires meaningful story and desired help before submission',()=>{
 const draft={...newWebDraft(new URLSearchParams()),region:'Dar es Salaam',district:'Ilala',story:'TEST ONLY — synthetic request.',desiredHelp:'Guidance'};
 assert.equal(webDraftReady(draft),true);
 assert.equal(webDraftReady({...draft,story:'a'}),false);assert.equal(webDraftReady({...draft,desiredHelp:'  '}),false);assert.equal(webDraftReady({...draft,district:''}),false);
});
test('request progress shows optional clarification and actual outcomes without promising assignment',()=>{
 assert.deepEqual(requestReachedStages('submitted'),['submitted']);
 assert.deepEqual(requestReachedStages('waiting_for_information'),['submitted','under_review','waiting_for_information']);
 assert.deepEqual(requestReachedStages('converted_to_case'),['submitted','under_review','converted_to_case']);
 assert.deepEqual(requestReachedStages('withdrawn'),['submitted','withdrawn']);
 for(const status of ['closed','referred','information_only'])assert.equal(requestReachedStages(status).at(-1),status);
 assert.match(requestNextStep('waiting_for_information','en'),/reply/);assert.match(requestNextStep('waiting_for_information','sw'),/jibu/);
});
