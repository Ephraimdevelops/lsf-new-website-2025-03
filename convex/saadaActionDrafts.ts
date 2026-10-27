import { v, ConvexError } from 'convex/values';
import { query, mutation, internalMutation } from './_generated/server';
import type { MutationCtx, QueryCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { requireAuthenticatedUser } from './lib/auth';
import { requireCaseAccess, requireCaseWorker } from './lib/hakiYangu';
import { enforceRateLimit } from './lib/rateLimits';
import { hasCurrentServiceReview, isReferralOrganisationBlocked } from './lib/directoryLifecycle';

const kinds = v.union(v.literal('appointment'),v.literal('referral'));
const modes = v.union(v.literal('phone'),v.literal('remote'),v.literal('in_person'));
function short(value:string|undefined,label:string,max:number,required=false) {
  const text=value?.trim();
  if((required && (!text || text.length<10)) || (text && text.length>max)) throw new ConvexError(`Check ${label}.`);
  return text || undefined;
}
async function source(ctx:QueryCtx|MutationCtx,id:Id<'sara_chats'>,finished:boolean) {
  const {identity,user}=await requireAuthenticatedUser(ctx); const message=await ctx.db.get(id);
  if(!message || message.role!=='assistant' || message.userId!==identity.subject || (finished && (!message.metadata?.completedAt || message.metadata?.failureCode))) throw new ConvexError('This chat action is unavailable.');
  if(message.conversationId){const conversation=await ctx.db.get(message.conversationId);if(!conversation || conversation.userId!==identity.subject)throw new ConvexError('Conversation unavailable.');}
  return user;
}
async function caseFor(ctx:QueryCtx|MutationCtx,reference:string,kind:'appointment'|'referral') {
  if(!reference.trim() || reference.length>100)throw new ConvexError('Choose a case reference.');
  const record=await ctx.db.query('cases').withIndex('by_public_id',q=>q.eq('publicId',reference.trim())).unique();
  if(!record)throw new ConvexError('Case unavailable.');
  if(kind==='referral')await requireCaseWorker(ctx,record._id);else await requireCaseAccess(ctx,record._id);
  if(['resolved','closed_unresolved','closed'].includes(record.status))throw new ConvexError('This case is closed.');
  return record;
}
async function destination(ctx:QueryCtx|MutationCtx,caseId:Id<'cases'>,serviceId:Id<'justice_services'>,providerId:Id<'users'>) {
  await requireCaseWorker(ctx,caseId);
  const service=await ctx.db.get(serviceId);
  if(!service || !service.active || service.visibility!=='public' || service.verificationStatus!=='verified' || !service.referralCapability || service.servicePointType==='safe_house' || !hasCurrentServiceReview(service.nextReviewAt,Date.now()) || !service.organizationId)throw new ConvexError('Choose a current public referral service.');
  const organisation=await ctx.db.get(service.organizationId);
  if(!organisation || organisation.verificationStatus!=='verified' || organisation.referralAgreementStatus!=='active' || !organisation.safeguardingReady || !organisation.dataSharingAgreementVersion?.trim() || isReferralOrganisationBlocked(organisation.verificationStatus))throw new ConvexError('This organisation cannot receive referrals.');
  const provider=await ctx.db.get(providerId);
  const memberships=await ctx.db.query('role_assignments').withIndex('by_user_status',q=>q.eq('userId',providerId).eq('status','active')).collect();
  if(!provider || provider.isDeleted || !memberships.some(row=>row.organizationId===service.organizationId && ['paralegal','provider_staff'].includes(row.role)))throw new ConvexError('Choose a provider from this service.');
  const {user}=await requireAuthenticatedUser(ctx);
  const synthetic=service.syntheticDevelopmentFixture;
  const qa=process.env.CONVEX_SITE_URL==='https://joyous-spaniel-5.convex.site' && user.email.startsWith('haki-qa-') && user.email.endsWith('+clerk_test@example.com');
  if(synthetic && !qa)throw new ConvexError('Development service unavailable.');
  return {service,provider};
}
export const caseContext=query({args:{caseReference:v.string(),kind:kinds},handler:async(ctx,args)=>{
  const record=await caseFor(ctx,args.caseReference,args.kind);await requireCaseAccess(ctx,record._id);return {id:record._id,reference:record.publicId,status:record.status};
}});
export const referralOptions=query({args:{caseReference:v.string(),serviceId:v.optional(v.id('justice_services')),district:v.optional(v.string()),search:v.optional(v.string())},handler:async(ctx,args)=>{
  const record=await caseFor(ctx,args.caseReference,'referral');await requireCaseWorker(ctx,record._id);
  const {user}=await requireAuthenticatedUser(ctx);
  const qa=process.env.CONVEX_SITE_URL==='https://joyous-spaniel-5.convex.site' && user.email.startsWith('haki-qa-') && user.email.endsWith('+clerk_test@example.com');
  const district=short(args.district,'district',200),search=short(args.search,'service name',200);
  const candidates=district ? await ctx.db.query('justice_services').withSearchIndex('search_district',q=>q.search('district',district)).take(101)
    : search ? await ctx.db.query('justice_services').withSearchIndex('search_name',q=>q.search('name',search)).take(101)
    : await ctx.db.query('justice_services').withIndex('by_active_visibility',q=>q.eq('active',true).eq('visibility','public')).take(101);
  // A selected ID is checked directly; it need not occur in the first results page.
  if(args.serviceId){const selected=await ctx.db.get(args.serviceId);if(selected){const prior=candidates.findIndex(row=>row._id===selected._id);if(prior>=0)candidates.splice(prior,1);candidates.unshift(selected);}}

  const services=[];
  for(const service of candidates.slice(0,100)) {
    if(!service.active || service.visibility!=='public' || service.verificationStatus!=='verified' || !service.referralCapability || service.servicePointType==='safe_house' || !hasCurrentServiceReview(service.nextReviewAt,Date.now()) || !service.organizationId || (service.syntheticDevelopmentFixture && !qa))continue;
    const organisation=await ctx.db.get(service.organizationId);
    if(!organisation || organisation.verificationStatus!=='verified' || organisation.referralAgreementStatus!=='active' || !organisation.safeguardingReady || !organisation.dataSharingAgreementVersion?.trim())continue;
    services.push({id:service._id,name:service.name,district:service.district,region:service.region});
    if(services.length===20)break;
  }
  const providers:{id:Id<"users">;name:string}[]=[];
  if(args.serviceId){
    if(!services.some(row=>row.id===args.serviceId))throw new ConvexError('Choose a current service from these options.');
    const service=await ctx.db.get(args.serviceId);
    const memberships=await ctx.db.query('role_assignments').withIndex('by_organization',q=>q.eq('organizationId',service!.organizationId)).collect();
    for(const membership of memberships){if(membership.status!=='active' || !['paralegal','provider_staff'].includes(membership.role))continue;const provider=await ctx.db.get(membership.userId);if(provider && !provider.isDeleted && !providers.some(row=>row.id===provider._id))providers.push({id:provider._id,name:provider.name});if(providers.length===20)break;}
  }
  return {caseReference:record.publicId,services,providers,limit:20,moreResultsPossible:candidates.length>100 || services.length===20,note:'Only current public services with verified organisations and active referral agreements. No referral sent.'};
}});
export const prepare=mutation({args:{assistantMessageId:v.id('sara_chats'),caseReference:v.string(),kind:kinds,preferredMode:v.optional(modes),preferredTime:v.optional(v.string()),note:v.optional(v.string()),destinationServiceId:v.optional(v.id('justice_services')),destinationUserId:v.optional(v.id('users')),reason:v.optional(v.string()),information:v.optional(v.string())},handler:async(ctx,args)=>{
  const user=await source(ctx,args.assistantMessageId,false);const record=await caseFor(ctx,args.caseReference,args.kind);
  await enforceRateLimit(ctx,`saada-action-draft:${user._id}`,10,10*60*1000);
  let payload;
  if(args.kind==='appointment')payload={kind:'appointment' as const,preferredMode:args.preferredMode??'phone',preferredTime:short(args.preferredTime,'preferred time',160),note:short(args.note,'appointment note',800)};
  else {
    if(!args.destinationServiceId || !args.destinationUserId)throw new ConvexError('Choose a service and provider.');
    const {service,provider}=await destination(ctx,record._id,args.destinationServiceId,args.destinationUserId);
    payload={kind:'referral' as const,destinationServiceId:service._id,destinationUserId:provider._id,destinationName:service.name,providerName:provider.name,reason:short(args.reason,'referral reason',2000,true)!,information:short(args.information,'information to share',160,true)!};
  }
  const prior=await ctx.db.query('saada_action_drafts').withIndex('by_message',q=>q.eq('assistantMessageId',args.assistantMessageId)).collect();
  const same=prior.find(row=>row.ownerId===user._id && row.status==='pending' && row.caseId===record._id && row.expiresAt>Date.now() && JSON.stringify(row.payload)===JSON.stringify(payload));
  if(same)return {id:same._id,kind:same.kind};
  const id=await ctx.db.insert('saada_action_drafts',{ownerId:user._id,assistantMessageId:args.assistantMessageId,caseId:record._id,caseReference:record.publicId,kind:args.kind,payload,status:'pending',createdAt:Date.now(),expiresAt:Date.now()+15*60*1000});
  return {id,kind:args.kind};
}});
async function owned(ctx:QueryCtx|MutationCtx,id:Id<'saada_action_drafts'>) {
  const {user}=await requireAuthenticatedUser(ctx);const draft=await ctx.db.get(id);
  if(!draft || draft.ownerId!==user._id)throw new ConvexError('Draft unavailable.');
  await source(ctx,draft.assistantMessageId,true);return draft;
}
export const get=query({args:{id:v.id('saada_action_drafts')},handler:async(ctx,args)=>{
  const {user}=await requireAuthenticatedUser(ctx);const draft=await ctx.db.get(args.id);
  if(!draft || draft.ownerId!==user._id)return null;
  try{await source(ctx,draft.assistantMessageId,true);await requireCaseAccess(ctx,draft.caseId);}catch{return null;}
  return {...draft,expired:draft.status==='pending' && draft.expiresAt<=Date.now()};
}});
export const cancel=mutation({args:{id:v.id('saada_action_drafts')},handler:async(ctx,args)=>{
  await requireAuthenticatedUser(ctx);
  const draft=await owned(ctx,args.id);
  if(draft.status==='confirming' || draft.status==='submitted')throw new ConvexError('This request is already processing or submitted. Check the case.');
  await ctx.db.patch(draft._id,{status:'cancelled'});
}});
export const claim=internalMutation({args:{id:v.id('saada_action_drafts'),confirmed:v.boolean()},handler:async(ctx,args)=>{
  if(!args.confirmed)throw new ConvexError('Review and confirm this request first.');
  const draft=await owned(ctx,args.id);
  if(draft.status==='submitted')return draft;
  if(draft.status==='cancelled' || (draft.status==='pending' && draft.expiresAt<=Date.now()))throw new ConvexError('This draft has expired or was cancelled. Prepare a new one.');
  await caseFor(ctx,draft.caseReference,draft.kind);
  if(draft.payload.kind==='referral')await destination(ctx,draft.caseId,draft.payload.destinationServiceId,draft.payload.destinationUserId);
  await ctx.db.patch(draft._id,{status:'confirming'});return draft;
}});
export const complete=internalMutation({args:{id:v.id('saada_action_drafts'),result:v.object({id:v.string(),reference:v.string(),status:v.string()})},handler:async(ctx,args)=>{
  const {user}=await requireAuthenticatedUser(ctx);const draft=await ctx.db.get(args.id);
  if(!draft || draft.ownerId!==user._id || !['confirming','submitted'].includes(draft.status))throw new ConvexError('Draft unavailable.');
  if(draft.status==='submitted')return draft.result;
  await ctx.db.patch(draft._id,{status:'submitted',result:args.result});return args.result;
}});
export const purge=internalMutation({args:{},handler:async ctx=>{
  let removed=0;
  for(const status of ['pending','cancelled','submitted','confirming'] as const){
    const retention=status==='confirming'?7:1;
    const rows=await ctx.db.query('saada_action_drafts').withIndex('by_status_created',q=>q.eq('status',status).lt('createdAt',Date.now()-retention*24*60*60*1000)).take(25);
    for(const row of rows){await ctx.db.delete(row._id);removed++;}
  }
  return removed;
}});
