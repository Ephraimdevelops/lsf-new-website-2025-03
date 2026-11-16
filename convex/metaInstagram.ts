import {v} from 'convex/values';
import {internalMutation,internalQuery} from './_generated/server';

// Only the signed, state-checked OAuth action may claim/store a connection.
export const claim=internalMutation({args:{stateHash:v.string(),configId:v.string()},handler:async(ctx,args)=>{
  if(args.stateHash!==process.env.META_INSTAGRAM_CONNECT_STATE_HASH||Date.now()>Number(process.env.META_INSTAGRAM_CONNECT_EXPIRES_AT||0))return null;
  if(await ctx.db.query('meta_instagram_connections').withIndex('by_state',q=>q.eq('stateHash',args.stateHash)).unique())return null;
  return ctx.db.insert('meta_instagram_connections',{...args,status:'processing',createdAt:Date.now()});
}});
export const finish=internalMutation({args:{id:v.id('meta_instagram_connections'),accountId:v.string(),username:v.string(),businessId:v.string(),accessToken:v.string(),expiresAt:v.number(),webhooksSubscribed:v.boolean()},handler:async(ctx,{id,...args})=>{
  const row=await ctx.db.get(id);
  if(row?.status!=='processing'||args.username.toLowerCase()!=='lsftanzania'||args.businessId!=='1083554938702231'||!args.accessToken||args.expiresAt<=Date.now()||args.expiresAt>Date.now()+60*86400000+600000)throw new Error('Connection validation failed');
  await ctx.db.patch(id,{...args,status:'connected'});
}});
export const fail=internalMutation({args:{id:v.id('meta_instagram_connections')},handler:async(ctx,{id})=>{const row=await ctx.db.get(id);if(row?.status==='processing')await ctx.db.patch(id,{status:'failed'});}});

export const credentials=internalQuery({args:{},handler:async(ctx)=>{
  const row=await ctx.db.query('meta_instagram_connections').withIndex('by_status',q=>q.eq('status','connected')).order('desc').first();
  if(!row?.accessToken||!row.accountId||!row.expiresAt||row.expiresAt<=Date.now())return null;
  return {accountId:row.accountId,token:row.accessToken,authMode:'unified' as const};
}});
export const account=internalQuery({args:{},handler:async(ctx)=>{
  const row=await ctx.db.query('meta_instagram_connections').withIndex('by_status',q=>q.eq('status','connected')).order('desc').first();
  return row?.accessToken&&row.expiresAt&&row.expiresAt>Date.now()?{accountId:row.accountId,username:row.username,expiresAt:row.expiresAt,webhooksSubscribed:row.webhooksSubscribed,lastWebhookAt:row.lastWebhookAt,lastAcceptedMessageAt:row.lastAcceptedMessageAt}:null;
}});
// No bodies, sender IDs or credentials are recorded in delivery diagnostics.
export const recordWebhook=internalMutation({args:{acceptedMessages:v.number()},handler:async(ctx,{acceptedMessages})=>{
  const row=await ctx.db.query('meta_instagram_connections').withIndex('by_status',q=>q.eq('status','connected')).order('desc').first();
  if(row)await ctx.db.patch(row._id,{lastWebhookAt:Date.now(),...(acceptedMessages>0?{lastAcceptedMessageAt:Date.now()}: {})});
}});
export const recentDelivery=internalQuery({args:{},handler:async(ctx)=>{
  const rows=await ctx.db.query('social_messages').filter(q=>q.eq(q.field('channel'),'instagram')).order('desc').take(10);
  return rows.map(x=>({receivedAt:x._creationTime,status:x.status,automatic:x.automatic,aiKind:x.aiKind,delivered:!!x.outboundId}));
}});
export const recordSubscription=internalMutation({args:{accountId:v.string(),subscribed:v.boolean()},handler:async(ctx,{accountId,subscribed})=>{
  const row=await ctx.db.query('meta_instagram_connections').withIndex('by_status',q=>q.eq('status','connected')).order('desc').first();
  if(row?.accountId===accountId)await ctx.db.patch(row._id,{webhooksSubscribed:subscribed});
}});
