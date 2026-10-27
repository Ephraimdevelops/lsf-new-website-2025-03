import { internalQuery } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { v } from 'convex/values';

// Maintenance metadata only: never bodies, embeddings, contacts or case data.
export const page = internalQuery({
 args:{table:v.union(v.literal('documents'),v.literal('legal_guides'),v.literal('saada_research_pdfs'),v.literal('directory_research')),cursor:v.optional(v.string())},
 handler:async(ctx,args)=>{
  const result=await ctx.db.query(args.table).paginate({numItems:50,cursor:args.cursor??null});
  const rows=await Promise.all(result.page.map(async record=>{
   const row=record as unknown as Record<string,unknown>;
   const keys=args.table==='documents'?['title','publisher','indexingStatus','approvalStatus','reviewDueAt','sourceUrl','jurisdiction','versionLabel','contentCategory','language','processedAt']
    :args.table==='legal_guides'?['titleEn','titleSw','status','reviewDueAt','jurisdiction']
    :args.table==='saada_research_pdfs'?['title','researchSourceId','archived']:['title','archived'];
   const metadata:Record<string,unknown>=Object.fromEntries([['id',record._id],...keys.filter(k=>row[k]!==undefined).map(k=>[k,row[k]])]);
   if(args.table==='saada_research_pdfs'){
    const storageId=(row.indexingStorageId??row.storageId) as Id<'_storage'>;
    const doc=await ctx.db.query('documents').withIndex('by_storageId',q=>q.eq('storageId',storageId)).first();
    metadata.linkedDocumentId=doc?._id??null;metadata.linkedIndexingStatus=doc?.indexingStatus??null;metadata.linkedApprovalStatus=doc?.approvalStatus??null;
    if(row.indexingDerivative)metadata.ocrReviewStatus=(row.indexingDerivative as {reviewStatus:string}).reviewStatus;
   }
   return metadata;
  }));
  return {isDone:result.isDone,cursor:result.continueCursor,rows};
 }
});
export const uploadDiagnostics=internalQuery({args:{},handler:async ctx=>{
 const rows=await ctx.db.query('managed_uploads').order('desc').take(50);
 return rows.filter(r=>r.purpose==='ai_source').map(r=>({id:r._id,createdAt:r.createdAt,status:r.status,researchSourceId:r.researchSourceId,diagnosticCode:r.diagnosticCode,scannerHttpStatus:r.scannerHttpStatus,scannerVersion:r.scannerVersion,definitionsUpdatedAt:r.definitionsUpdatedAt}));
}});
