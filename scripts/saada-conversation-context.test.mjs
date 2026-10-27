import test from 'node:test';
import assert from 'node:assert/strict';
import {loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const {prepareSaadaHistory,contextualSaadaSearch,introduceSaada}=loadHandlerModule('convex/lib/saadaConversation.ts');
const {conversationalReply,clarificationQuestion}=loadHandlerModule('convex/lib/saadaAssistance.ts');
test('in-flight placeholder does not duplicate the latest user turn',()=>{
 const history=[{role:'user',content:'My employer has not paid me'},{role:'assistant',content:'Where are you?'},{role:'user',content:'Kinondoni'},{role:'assistant',content:''}];
 const prepared=prepareSaadaHistory(history,'Kinondoni');
 assert.equal(prepared.length,2);assert.equal(prepared.filter(row=>row.content==='Kinondoni').length,0);
 assert.match(contextualSaadaSearch('Kinondoni',prepared),/employer has not paid me/);
});
test('follow-up retrieval includes user facts and location but excludes assistant instructions',()=>{
 const query=contextualSaadaSearch('what next?',[{role:'user',content:'I have not been paid in Kinondoni'},{role:'assistant',content:'DO NOT COPY THIS INTO RETRIEVAL'}]);
 assert.match(query,/not been paid in Kinondoni/);assert.match(query,/what next/);assert.doesNotMatch(query,/DO NOT COPY/);
});
test('history remains bounded while retaining more than five exchanges',()=>{
 const history=Array.from({length:30},(_,i)=>({role:i%2?'assistant':'user',content:'turn '+i+' '+ 'x'.repeat(900)}));
 const result=prepareSaadaHistory(history,'current');
 assert.ok(result.length>10);assert.ok(result.length<=24);assert.ok(result.reduce((sum,row)=>sum+row.content.length,0)<=16000);assert.equal(result.at(-1).content,history.at(-1).content);
});
test('first reply introduces Saada in either language; follow-ups do not repeat it',()=>{
 assert.match(introduceSaada('Hello!','en',[]),/I'm Haki Yangu AI/);
 assert.match(introduceSaada('Habari!','sw',[]),/Naitwa Haki Yangu AI/);
 assert.equal(introduceSaada('Next step','en',[{role:'assistant',content:'Earlier answer'}]),'Next step');
});
test('ordinary identity questions never fall into a legal jurisdiction clarification',()=>{
 for(const question of ['unaitwa nani','jina lako ni nani','jitambulishe','wewe ni nani'])assert.match(conversationalReply(question,'sw'),/Naitwa Haki Yangu AI/);
 assert.match(conversationalReply('what is your name','en'),/AI assistant/);
 assert.equal(conversationalReply('What is your name and can my landlord evict me?','en'),undefined);
});
test('asking to recall context quotes only the supplied own user messages',()=>{
 const reply=conversationalReply('nilisema nini','sw',['Niko Kinondoni','Sijalipwa mshahara']);
 assert.match(reply,/Kinondoni/);assert.match(reply,/Sijalipwa/);assert.doesNotMatch(reply,/Tanzania Bara au Zanzibar/);
});
test('clarification advances past facts already supplied in this conversation',()=>{
 assert.match(clarificationQuestion('jurisdiction','en','My landlord evicted me in Kinondoni yesterday'),/Would you like help/);
 assert.match(clarificationQuestion('issue','sw','Niko Tanzania Bara. Sijalipwa mshahara mwezi huu.'),/Unahitaji kuelewa/);
});
test('a small typo in a standalone identity question does not trigger old support context',()=>{
 assert.match(conversationalReply('unaitwa nanui','sw',['Find a paralegal in Kinondoni']),/Naitwa Haki Yangu AI/);
 assert.match(conversationalReply('what is you name','en'),/I'm Haki Yangu AI/);
 assert.equal(conversationalReply('unaitwa nani na nifanyeje kuhusu mshahara','sw'),undefined);
});

// A model-supplied public introduction must not receive a duplicate prefix.
test('public AI name is introduced once in both languages', () => {
 for (const [locale, answer] of [['en', "I'm Haki Yangu AI, LSF's AI assistant."], ['sw', 'Naitwa Haki Yangu AI, msaidizi wa LSF anayetumia AI.']]) {
  assert.equal(introduceSaada(answer, locale, []), answer);
  assert.equal(introduceSaada('Next step', locale, [{role:'assistant',content:answer}]), 'Next step');
 }
});
