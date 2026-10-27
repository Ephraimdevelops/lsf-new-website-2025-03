import test from 'node:test';
import assert from 'node:assert/strict';
import { loadHandlerModule } from './test-support/convex-handler-harness.mjs';
const {responseLocale,explicitResponseLocale}=loadHandlerModule('convex/lib/saadaLanguage.ts');
const {conversationalReply,clarificationQuestion,assistanceFallback}=loadHandlerModule('convex/lib/saadaAssistance.ts');

for(const [message,ui,expected] of [
 ['Help me understand my rights as a tenant','sw','en'],
 ['Nielewe haki zangu kama mpangaji','en','sw'],
 ['Sijalipwa mshahara. Nianzie wapi?','en','sw'],
 ['I am in Kinondoni','sw','en'],['Niko Kinondoni','en','sw'],
 ['Hello','sw','en'],['Habari','en','sw'],
 ['Please answer in English.','sw','en'],['Jibu kwa Kiswahili.','en','sw'],
 ['Naomba unijibu kwa Kiingereza','sw','en'],['Kiswahili tafadhali','en','sw'],
])test('reply language: '+message,()=>assert.equal(responseLocale(message,ui),expected));

test('short follow-ups retain conversation language and explicit preferences persist',()=>{
 assert.equal(responseLocale('sawa','en',['Sijalipwa mshahara']),'sw');
 assert.equal(responseLocale('yes','sw',['My landlord changed the lock']),'en');
 assert.equal(responseLocale('Nieleze haki zangu','sw',['Please reply in English']),'en');
 assert.equal(responseLocale('What next?','en',['Jibu kwa Kiswahili']),'sw');
 assert.equal(responseLocale('Reply in English','sw',['Jibu kwa Kiswahili']),'en');
});
test('manual reply choice overrides automatic detection; a current explicit request wins',()=>{
 assert.equal(responseLocale('Niko Kinondoni','sw',[],'en'),'en');
 assert.equal(responseLocale('What can you do?','en',[],'sw'),'sw');
 assert.equal(responseLocale('Please answer in English','sw',[],'sw'),'en');
 assert.equal(explicitResponseLocale('I have a contract in English'),undefined);
});
test('ordinary conversation is friendly in both languages without invented legal facts or identity',()=>{
 assert.match(conversationalReply('Habari','sw'),/Habari!/);
 assert.match(conversationalReply('Hello','en'),/Hello!/);
 assert.match(conversationalReply('Asante sana','sw'),/Karibu/);
 assert.doesNotMatch(conversationalReply('Thank you','en'),/Mainland|Zanzibar|\?/);
 assert.match(conversationalReply('Are you human?','en'),/AI assistant/);
 assert.match(conversationalReply('Jibu kwa Kiswahili','sw'),/tutaendelea kwa Kiswahili/);
 assert.equal(conversationalReply('Hello, can my landlord evict me tomorrow?','en'),undefined);
 assert.equal(conversationalReply('Thank you. How many days do I have to appeal?','en'),undefined);
});
test('clarification uses shared facts, asks one question, and does not assume every issue is tenancy',()=>{
 const first=clarificationQuestion('jurisdiction','en','Help with rent');
 assert.equal((first.match(/\?/g)??[]).length,1);
 assert.doesNotMatch(clarificationQuestion('jurisdiction','en','This is Mainland Tanzania. My employer has not paid me.'),/Mainland|tenancy|rent/);
 assert.match(clarificationQuestion('issue','en','My landlord is asking me to leave'),/When did this happen/);
 assert.match(assistanceFallback('Kinondoni','sw','Nahitaji msaada wa kisheria'),/Kinondoni Legal Aid Clinic/);
});
