import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { query, mutation } from './_generated/server';
import { requireAnyRole } from './lib/auth';
import { researchSearchText, validateResearchEntry } from './lib/researchEntry';
const input = { externalKey: v.string(), kind: v.union(v.literal('organisation'),v.literal('centre'),v.literal('pathway')), title: v.string(), region: v.optional(v.string()), district: v.optional(v.string()), address: v.optional(v.string()), phone: v.optional(v.string()), email: v.optional(v.string()), notes: v.string(), sourceUrls: v.array(v.string()), originalRecord: v.string() };
// Private research is deliberately separate from public recommendations and provider memberships.
export const list = query({
 args: { paginationOpts: paginationOptsValidator, search: v.optional(v.string()), archived: v.boolean() },
 handler: async(ctx,args) => {
  await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
  const search=(args.search ?? '').trim().toLowerCase();
  if(search.length > 200) throw new Error('Use a shorter search.');
  if (search) return ctx.db.query('directory_research').withSearchIndex('search_research', q => q.search('searchText', search).eq('archived', args.archived)).paginate(args.paginationOpts);
  return ctx.db.query('directory_research').withIndex('by_archived',q=>q.eq('archived',args.archived)).order('desc').paginate(args.paginationOpts);
 }
});
export const importDrafts = mutation({
 args:{entries:v.array(v.object(input))},
 handler:async(ctx,args)=>{
  const {user}=await requireAnyRole(ctx, ["admin", "staff"]);
  if(args.entries.length<1 || args.entries.length>100) throw new Error('Import 1–100 research records per batch.');
  let added=0,skipped=0;
  for(const entry of args.entries){
   validateResearchEntry(entry);
   const existing=await ctx.db.query('directory_research').withIndex('by_external_key',q=>q.eq('externalKey',entry.externalKey)).first();
   if(existing){skipped++;continue;}
   await ctx.db.insert('directory_research',{...entry,searchText:researchSearchText(entry),title:entry.title.trim(),archived:false,createdBy:user._id,updatedBy:user._id,updatedAt:Date.now()});added++;
  }
  await ctx.db.insert('audit_logs',{action:'directory.research_imported',entityType:'directory_research',entityId:'batch',userId:user._id,timestamp:Date.now(),metadata:{added,skipped}});
  return {added,skipped};
 }
});
export const update = mutation({
 args:{id:v.id('directory_research'),...input},
 handler:async(ctx,args)=>{
  const {user}=await requireAnyRole(ctx, ["admin", "staff"]);
  const old=await ctx.db.get(args.id);if(!old)throw new Error('Research record not found.');
  validateResearchEntry(args);
  if(args.externalKey!==old.externalKey || args.originalRecord!==old.originalRecord)throw new Error('Original provenance must be retained.');
  const {id,...entry}=args;
  await ctx.db.patch(id,{...entry,searchText:researchSearchText(entry),title:entry.title.trim(),updatedBy:user._id,updatedAt:Date.now()});
  await ctx.db.insert('audit_logs',{action:'directory.research_updated',entityType:'directory_research',entityId:id,userId:user._id,timestamp:Date.now(),metadata:{previous:old}});
 }
});
export const setArchived = mutation({
 args:{id:v.id('directory_research'),archived:v.boolean(),reason:v.string()},
 handler:async(ctx,args)=>{
  const {user}=await requireAnyRole(ctx, ["admin", "staff"]);
  if(args.reason.trim().length<10 || args.reason.length>2000)throw new Error('Record a 10–2000 character reason.');
  if(!await ctx.db.get(args.id))throw new Error('Research record not found.');
  await ctx.db.patch(args.id,{archived:args.archived,updatedBy:user._id,updatedAt:Date.now()});
  await ctx.db.insert('audit_logs',{action:args.archived?'directory.research_archived':'directory.research_restored',entityType:'directory_research',entityId:args.id,userId:user._id,timestamp:Date.now(),metadata:{reason:args.reason}});
 }
});
