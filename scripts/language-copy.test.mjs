import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';
const {displayLabel,plainError,securityMethod}=loadHandlerModule('shared/plainLanguage.ts');
const {notificationCopy}=loadHandlerModule('shared/notificationCopy.ts');
const notifications=loadHandlerModule('convex/notifications.ts');
test('errors offer a localised remedy without exposing unknown service diagnostics',()=>{
 assert.match(plainError({errors:[{code:'form_code_incorrect'}]},'sw'),/Msimbo si sahihi/);
 assert.match(plainError(new Error('verification code expired'),'sw'),/Omba msimbo mpya/);
 assert.match(plainError(new Error('network timeout'),'en'),/connection/);
 const secret='INTERNAL: token SECRET server stack private-case-topic';
 assert.doesNotMatch(plainError(new Error(secret),'sw'),/SECRET|INTERNAL|private/);
 assert.equal(plainError(new Error(secret),'sw','Ombi halijatumwa.'),'Ombi halijatumwa.');
 assert.notEqual(securityMethod('totp','sw'),'totp');
});
test('states distinguish unsent, received, unresolved, cancelled and feedback; unknown values do not expose wire keys',()=>{
 assert.notEqual(displayLabel('draft','sw'),displayLabel('submitted','sw'));
 assert.notEqual(displayLabel('resolved','sw'),displayLabel('closed_unresolved','sw'));
 assert.match(displayLabel('cancelled','sw'),/ghairiwa/);
 assert.equal(displayLabel('case_message','sw'),'Ujumbe');
 assert.doesNotMatch(displayLabel('private_internal_enum','sw'),/private_internal/);
});
test('notification language saves only the signed-in caller and never enables push or changes categories',async()=>{
 const h=harness(),person=await h.user(),other=await h.user();
 const otherId=await h.db.insert('notification_preferences',{userId:other,pushEnabled:true,cases:false,messages:true,appointments:false,documents:true,service:true,locale:'en',updatedAt:1});
 await assert.rejects(h.invoke(notifications.setLanguage,{locale:'en'}));
 await h.invoke(notifications.setLanguage,{locale:'en'},person);
 let own=await h.db.query('notification_preferences').withIndex('by_user',q=>q.eq('userId',person)).unique();
 assert.equal(own.locale,'en');assert.equal(own.pushEnabled,false);
 await h.db.patch(own._id,{cases:false,messages:false,pushEnabled:true});
 await h.invoke(notifications.setLanguage,{locale:'sw'},person);
 own=await h.db.get(own._id);assert.equal(own.locale,'sw');assert.equal(own.cases,false);assert.equal(own.messages,false);assert.equal(own.pushEnabled,true);
 assert.equal((await h.db.get(otherId)).locale,'en');
});
test('push preview uses recipient locale and stays neutral for every copy category',()=>{
 const en={title:'Haki Yangu update',body:'You have a new update.'};
 assert.deepEqual(notificationCopy('request.message','en',en),en);
 for(const type of ['request.message','request.submitted','message.received','appointment.reminder','assignment.offered','unknown.event']){
  const sw=notificationCopy(type,'sw',en);assert.match(sw.title,/Taarifa/);assert.doesNotMatch(sw.body,/land|employment|beneficiary|caseId|private/);assert.ok(sw.body.length>5);
 }
});
test('primary copy uses everyday Kiswahili and retains named AI recipient and deletion confirmation',()=>{
 const catalogue=JSON.parse(fs.readFileSync(new URL('../src/i18n/uiCopy.json',import.meta.url),'utf8'));
 assert.equal(catalogue['My Haki Yangu workspace'],'Maombi yangu ya msaada');
 assert.equal(catalogue['Send message'],'Tuma ujumbe');
 assert.equal(catalogue['Current intake'],'Inapokea watu wapya?');
 const brief=fs.readFileSync(new URL('../mobile/app/saved-document/[id].tsx',import.meta.url),'utf8');
 assert.match(brief,/OpenAI/);assert.match(brief,/muhtasari/);
 const deletion=fs.readFileSync(new URL('../mobile/src/components/DeleteAccount.tsx',import.meta.url),'utf8');
 assert.match(deletion,/confirmation !== "DELETE"/);assert.match(deletion,/historia ya mabadiliko/);
});
