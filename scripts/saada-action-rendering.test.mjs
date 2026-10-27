import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync('mobile/src/chat/ChatResponse.tsx','utf8');
const functionSource=source.slice(source.indexOf('export function parseChatContent'),source.indexOf('export const ChatResponse'));
const js=ts.transpileModule(functionSource,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const parse=new Function('exports',js+';return parseChatContent;')({});
test('chat renders a server action marker as a review card between normal answer sections',()=>{
 assert.deepEqual(parse('Before ::ACTION_CARD:{"id":"owned-id"}:: After'),[{type:'text',text:'Before'},{type:'action',id:'owned-id'},{type:'text',text:'After'}]);
});
test('streamed, malformed and wrongly shaped action markers never display raw payloads or provider cards',()=>{
 assert.deepEqual(parse('Review ::ACTION_CARD:{"id":"half'),[{type:'text',text:'Review'}]);
 for(const raw of ['::ACTION_CARD:{"name":"Fake provider"}::','::ACTION_CARD:{"id":123}::','::ACTION_CARD:{broken}::'])assert.deepEqual(parse(raw),[]);
});
