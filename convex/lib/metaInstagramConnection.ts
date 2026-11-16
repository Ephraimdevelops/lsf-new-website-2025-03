export function validateInstagramGrant(data:{is_valid?:boolean;app_id?:string;expires_at?:number;scopes?:string[]},appId:string,now=Date.now()){
  const scopes=data.scopes??[];
  const allowed=new Set(['instagram_basic','instagram_manage_messages','public_profile']);
  const expiresAt=(data.expires_at??0)*1000;
  if(!data.is_valid||data.app_id!==appId||!scopes.includes('instagram_basic')||!scopes.includes('instagram_manage_messages')||scopes.some(x=>!allowed.has(x))||expiresAt<=now||expiresAt>now+60*86400000+600000)throw new Error('Instagram grant exceeds the approved account, permissions or duration.');
  return expiresAt;
}

// CONVEX_SITE_URL is supplied by Convex for the deployment executing this action.
// Never reuse a development callback when the same code runs in production.
export function instagramRedirectUri(siteUrl?:string){
  if(!siteUrl)throw new Error('Backend site URL is not configured.');
  const site=new URL(siteUrl);
  if(site.protocol!=='https:'||site.username||site.password||site.search||site.hash||site.pathname!=='/'||!site.hostname.endsWith('.convex.site'))throw new Error('Expected the current Convex HTTPS site origin.');
  return new URL('/meta-instagram-return',site).toString();
}

// The Instagram subscribed_apps edge can return subscribed_fields without an
// application id, even when id is explicitly requested. Missing ids do not
// establish a missing subscription. Return no raw Graph values or identifiers.
export function instagramSubscriptionSummary(body:unknown){
  const rows=(body as {data?:unknown})?.data;
  if(!Array.isArray(rows))return {readable:false,messagesSubscribed:null};
  const fields=rows.map(x=>x&&typeof x==='object'?(x as {subscribed_fields?:unknown}).subscribed_fields:undefined);
  const found=fields.some(x=>Array.isArray(x)&&x.includes('messages'));
  return {readable:true,entryCount:rows.length,messagesSubscribed:found?true:fields.every(Array.isArray)?false:null};
}
