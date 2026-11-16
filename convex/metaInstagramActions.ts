"use node";
import {createHash,timingSafeEqual} from 'node:crypto';
import {v} from 'convex/values';
import {internalAction} from './_generated/server';
import {internal} from './_generated/api';
import {validateInstagramGrant,instagramRedirectUri,instagramSubscriptionSummary} from './lib/metaInstagramConnection';

export const complete=internalAction({args:{code:v.string(),state:v.string()},handler:async(ctx,{code,state}):Promise<boolean>=>{
  const appId='1285455393175806',configId='1397861945755911';
  const expected=process.env.META_INSTAGRAM_CONNECT_STATE_HASH??'';
  if(!code||code.length>8192||!/^[a-f0-9]{64}$/.test(state)||!/^[a-f0-9]{64}$/.test(expected))return false;
  const stateHash=createHash('sha256').update(state).digest('hex');
  if(!timingSafeEqual(Buffer.from(stateHash),Buffer.from(expected)))return false;
  const id=await ctx.runMutation(internal.metaInstagram.claim,{stateHash,configId});if(!id)return false;
  try{
    const version=process.env.META_GRAPH_VERSION,secret=process.env.META_APP_SECRET;
    if(!version||!/^v\d+\.\d+$/.test(version)||!secret)throw new Error('Meta configuration unavailable');
    const base=`https://graph.facebook.com/${version}/`;
    const redirectUri=instagramRedirectUri(process.env.CONVEX_SITE_URL);
    const exchange=new URL(base+'oauth/access_token');
    for(const [key,value] of Object.entries({client_id:appId,client_secret:secret,code,redirect_uri:redirectUri}))exchange.searchParams.set(key,value);
    const er=await fetch(exchange,{signal:AbortSignal.timeout(15000)});const grant=await er.json();
    if(!er.ok||typeof grant.access_token!=='string')throw new Error('Authorization exchange failed');
    const token=grant.access_token;
    const debug=new URL(base+'debug_token');debug.searchParams.set('input_token',token);
    const dr=await fetch(debug,{headers:{Authorization:`Bearer ${appId}|${secret}`},signal:AbortSignal.timeout(15000)});const details=await dr.json();
    if(!dr.ok)throw new Error('Grant verification failed');
    const expiresAt=validateInstagramGrant(details.data??{},appId);
    const headers={Authorization:`Bearer ${token}`};
    const br=await fetch(base+'me?fields=client_business_id',{headers,signal:AbortSignal.timeout(15000)});const business=await br.json();
    if(!br.ok||business.client_business_id!=='1083554938702231')throw new Error('Unexpected business portfolio');
    const ar=await fetch(base+'me/assigned_instagram_accounts?fields=id,username',{headers,signal:AbortSignal.timeout(15000)});const accounts=await ar.json();
    if(!ar.ok||accounts.data?.length!==1||accounts.data[0].username?.toLowerCase()!=='lsftanzania'||!/^\d+$/.test(accounts.data[0].id))throw new Error('Unexpected Instagram account');
    const accountId=accounts.data[0].id;
    // Existing app-level webhook verification is configured separately. This
    // subscribes only to incoming DMs for the approved Instagram account.
    const sr=await fetch(base+accountId+'/subscribed_apps',{method:'POST',headers:{...headers,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({subscribed_fields:'messages'}),signal:AbortSignal.timeout(15000)});
    const subscribed=await sr.json();
    await ctx.runMutation(internal.metaInstagram.finish,{id,accountId,username:'lsftanzania',businessId:business.client_business_id,accessToken:token,expiresAt,webhooksSubscribed:sr.ok&&subscribed.success===true});
    return true;
  }catch{
    // Never log or return authorization codes, tokens, raw Graph bodies or URLs.
    await ctx.runMutation(internal.metaInstagram.fail,{id});return false;
  }
}});

// Read-only operator diagnostics. Access tokens, message bodies, sender IDs,
// conversation IDs and raw Graph errors must never leave this server action.
export const diagnose=internalAction({args:{},handler:async(ctx):Promise<unknown>=>{
  const connection=await ctx.runQuery(internal.metaInstagram.credentials,{});
  const version=process.env.META_GRAPH_VERSION;
  if(!connection||!version||!/^v\d+\.\d+$/.test(version))return {configured:false};
  const base=`https://graph.facebook.com/${version}/`;
  const checks:Record<string,unknown>={configured:true};
  for(const [name,path] of Object.entries({account:`${connection.accountId}?fields=id,username`,subscriptions:`${connection.accountId}/subscribed_apps?fields=id,name,subscribed_fields`,conversations:`${connection.accountId}/conversations?platform=instagram&fields=updated_time&limit=1`})){
    try{
      const response=await fetch(base+path,{headers:{Authorization:`Bearer ${connection.token}`},signal:AbortSignal.timeout(15000)});
      const body=await response.json();
      if(!response.ok||body.error){
        checks[name]={ok:false,httpStatus:response.status,code:typeof body.error?.code==='number'?body.error.code:undefined,subcode:typeof body.error?.error_subcode==='number'?body.error.error_subcode:undefined,messageAccessDisabled:typeof body.error?.message==='string'&&/disabled access to Instagram Direct Messaging Outside|allow access to messages/i.test(body.error.message)};
      }else if(name==='account')checks[name]={ok:true,isExpectedAccount:body.username?.toLowerCase()==='lsftanzania'};
      else if(name==='subscriptions')checks[name]={ok:true,...instagramSubscriptionSummary(body)};
      else checks[name]={ok:true,visibleConversationCount:(body.data??[]).length,hasMore:!!body.paging?.next};
    }catch{checks[name]={ok:false,networkOrResponseError:true};}
  }
  return checks;
}});

export const subscribeMessages=internalAction({args:{},handler:async(ctx):Promise<unknown>=>{
  const connection=await ctx.runQuery(internal.metaInstagram.credentials,{}),version=process.env.META_GRAPH_VERSION;
  if(!connection||!version||!/^v\d+\.\d+$/.test(version))return {configured:false};
  try{
    const response=await fetch(`https://graph.facebook.com/${version}/${connection.accountId}/subscribed_apps`,{method:'POST',headers:{Authorization:`Bearer ${connection.token}`,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({subscribed_fields:'messages'}),signal:AbortSignal.timeout(15000)});
    const body=await response.json(),subscribed=response.ok&&body.success===true;
    await ctx.runMutation(internal.metaInstagram.recordSubscription,{accountId:connection.accountId,subscribed});
    return {ok:subscribed,httpStatus:response.status,...(typeof body.error?.code==='number'?{code:body.error.code}: {})};
  }catch{return {ok:false,networkOrResponseError:true};}
}});

// Restricted, read-only check for the owner's explicitly identified test sender.
// No message text, sender id or conversation id is returned to the operator.
export const checkTesterConversation=internalAction({args:{},handler:async(ctx):Promise<unknown>=>{
  const connection=await ctx.runQuery(internal.metaInstagram.credentials,{}),version=process.env.META_GRAPH_VERSION;
  if(!connection||!version||!/^v\d+\.\d+$/.test(version))return {configured:false};
  try{
    const url=new URL(`https://graph.facebook.com/${version}/${connection.accountId}/conversations`);
    url.searchParams.set('platform','instagram');url.searchParams.set('limit','5');url.searchParams.set('fields','updated_time,messages.limit(5){created_time,from}');
    const response=await fetch(url,{headers:{Authorization:`Bearer ${connection.token}`},signal:AbortSignal.timeout(20000)});const body=await response.json();
    if(!response.ok||body.error)return {ok:false,httpStatus:response.status,...(typeof body.error?.code==='number'?{code:body.error.code}:{})};
    const conversations=Array.isArray(body.data)?body.data:[];
    const matches=conversations.flatMap((c:any)=>Array.isArray(c.messages?.data)?c.messages.data:[]).filter((m:any)=>m.from?.username?.toLowerCase()==='ephraim_ngowi').map((m:any)=>Date.parse(m.created_time)).filter(Number.isFinite);
    return {ok:true,testSenderFound:matches.length>0,checkedConversationCount:conversations.length,...(matches.length?{newestTestMessageAt:Math.max(...matches)}:{})};
  }catch{return {ok:false,networkOrResponseError:true};}
}});
