import test from 'node:test';
import assert from 'node:assert/strict';
import {validateInstagramGrant,instagramRedirectUri,instagramSubscriptionSummary} from '../convex/lib/metaInstagramConnection.ts';
import {harness,loadHandlerModule} from './test-support/convex-handler-harness.mjs';

test('Instagram subscription readback uses field membership, not optional app identifiers',()=>{
 assert.equal(instagramSubscriptionSummary({data:[{subscribed_fields:['messages']}]}).messagesSubscribed,true);
 assert.equal(instagramSubscriptionSummary({data:[]}).messagesSubscribed,false);
 assert.equal(instagramSubscriptionSummary({data:[{subscribed_fields:['comments']}]}).messagesSubscribed,false);
 assert.equal(instagramSubscriptionSummary({data:[{}]}).messagesSubscribed,null);
 assert.equal(instagramSubscriptionSummary({}).readable,false);
 assert.ok(!JSON.stringify(instagramSubscriptionSummary({data:[{subscribed_fields:['messages'],access_token:'private-fixture'}]})).includes('private-fixture'));
});

test('OAuth callback follows the executing deployment and rejects unsafe origins',()=>{
 assert.equal(instagramRedirectUri('https://fixture-development.convex.site'),'https://fixture-development.convex.site/meta-instagram-return');
 assert.equal(instagramRedirectUri('https://fixture-production.convex.site/'),'https://fixture-production.convex.site/meta-instagram-return');
 for(const site of [undefined,'http://fixture.convex.site','https://unrelated.example','https://fixture.convex.site/other','https://fixture.convex.site?x=1','https://user:pass@fixture.convex.site'])assert.throws(()=>instagramRedirectUri(site));
});

test('only the approved app, DM/profile scopes and finite 60-day duration are accepted',()=>{
 const now=Date.now(),good={is_valid:true,app_id:'app',scopes:['instagram_basic','instagram_manage_messages'],expires_at:Math.floor((now+59*86400000)/1000)};
 assert.ok(validateInstagramGrant(good,'app',now)>now);
 for(const bad of [{...good,is_valid:false},{...good,app_id:'other'},{...good,expires_at:0},{...good,expires_at:Math.floor((now+90*86400000)/1000)},{...good,scopes:['instagram_basic']},{...good,scopes:[...good.scopes,'ads_management']}])assert.throws(()=>validateInstagramGrant(bad,'app',now));
});

test('OAuth state is expiring and single-use; public metadata never includes the token',async()=>{
 const handlers=loadHandlerModule('convex/metaInstagram.ts'),h=harness();
 const previousHash=process.env.META_INSTAGRAM_CONNECT_STATE_HASH,previousExpiry=process.env.META_INSTAGRAM_CONNECT_EXPIRES_AT;
 try{
  process.env.META_INSTAGRAM_CONNECT_STATE_HASH='expected';process.env.META_INSTAGRAM_CONNECT_EXPIRES_AT=String(Date.now()+60000);
  assert.equal(await h.invoke(handlers.claim,{stateHash:'wrong',configId:'config'}),null);
  const id=await h.invoke(handlers.claim,{stateHash:'expected',configId:'config'});assert.ok(id);
  assert.equal(await h.invoke(handlers.claim,{stateHash:'expected',configId:'config'}),null);
  const input={id,accountId:'123',username:'lsftanzania',businessId:'1083554938702231',accessToken:'private-fixture-token',expiresAt:Date.now()+86400000,webhooksSubscribed:false};
  await assert.rejects(h.invoke(handlers.finish,{...input,username:'other_account'}),/validation/);
  await h.invoke(handlers.finish,input);
  const account=await h.invoke(handlers.account,{});assert.equal(account.accountId,'123');assert.ok(!JSON.stringify(account).includes('private-fixture-token'));
  await h.invoke(handlers.recordSubscription,{accountId:'123',subscribed:true});assert.equal((await h.invoke(handlers.account,{})).webhooksSubscribed,true);
  await h.invoke(handlers.recordSubscription,{accountId:'another-account',subscribed:false});assert.equal((await h.invoke(handlers.account,{})).webhooksSubscribed,true);
  assert.equal((await h.invoke(handlers.credentials,{})).token,'private-fixture-token');
  await assert.rejects(h.invoke(handlers.finish,input),/validation/);
  await h.db.patch(id,{expiresAt:Date.now()-1});assert.equal(await h.invoke(handlers.credentials,{}),null);assert.equal(await h.invoke(handlers.account,{}),null);
  process.env.META_INSTAGRAM_CONNECT_STATE_HASH='expired';process.env.META_INSTAGRAM_CONNECT_EXPIRES_AT=String(Date.now()-1);
  assert.equal(await h.invoke(handlers.claim,{stateHash:'expired',configId:'config'}),null);
 }finally{
  if(previousHash===undefined)delete process.env.META_INSTAGRAM_CONNECT_STATE_HASH;else process.env.META_INSTAGRAM_CONNECT_STATE_HASH=previousHash;
  if(previousExpiry===undefined)delete process.env.META_INSTAGRAM_CONNECT_EXPIRES_AT;else process.env.META_INSTAGRAM_CONNECT_EXPIRES_AT=previousExpiry;
 }
});
