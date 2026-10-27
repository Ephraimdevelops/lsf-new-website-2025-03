import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { requireAnyRole } from './lib/auth';
import { issueManagedUpload, requireCleanOwnedUpload } from './lib/managedUploads';
import { validateResearchPdf, storageChecksumHex } from './lib/researchPdfManifest';
import { normalizeText } from './lib/security';

const input = { researchSourceId: v.string(), filename: v.string(), sha256: v.string(), byteSize: v.number(), title: v.string(), provenance: v.string() };
export const record = mutation({
 args:{...input,storageId:v.id('_storage')},handler:async(ctx,args)=>{
  const {user,identity}=await requireAnyRole(ctx,["admin","staff"]);validateResearchPdf(args);
  await requireCleanOwnedUpload(ctx,args.storageId,user._id,'ai_source');
  const stored=await ctx.db.system.get(args.storageId);
  if(!stored||storageChecksumHex(stored.sha256)!==args.sha256||stored.size!==args.byteSize||stored.contentType!=='application/pdf')throw new Error('Stored PDF checksum, size or type does not match the research manifest.');
  const existing=await ctx.db.query('saada_research_pdfs').withIndex('by_sha256',q=>q.eq('sha256',args.sha256)).first();
  if(existing)return {id:existing._id,created:false,storageId:existing.storageId};
  const id=await ctx.db.insert('saada_research_pdfs',{...args,uploadedByClerkId:identity.subject,uploadedAt:Date.now(),archived:false});
  await ctx.db.insert('audit_logs',{action:'saada.research_pdf_stored',entityType:'saada_research_pdf',entityId:id,userId:user._id,timestamp:Date.now(),metadata:{researchSourceId:args.researchSourceId,sha256:stored.sha256,size:stored.size}});
  return {id,created:true,storageId:args.storageId};
 }
});
export const lookup=query({args:{hashes:v.array(v.string())},handler:async(ctx,args)=>{
 await requireAnyRole(ctx,["admin","staff"]);
 if(args.hashes.length>250||args.hashes.some(hash=>!/^[a-f0-9]{64}$/.test(hash)))throw new Error('Invalid checksum batch.');
 return Promise.all(args.hashes.map(async sha256=>{
  const row=await ctx.db.query('saada_research_pdfs').withIndex('by_sha256',q=>q.eq('sha256',sha256)).first();if(!row)return {sha256,stored:false};
  const file=await ctx.db.system.get(row.storageId);
  const document=await ctx.db.query('documents').withIndex('by_storageId',q=>q.eq('storageId',row.indexingStorageId??row.storageId)).first();
  return {sha256,stored:!!file&&storageChecksumHex(file.sha256)===sha256&&file.size===row.byteSize,id:row._id,storageId:row.storageId,archived:row.archived,sourceDocumentId:document?._id??null,indexingStatus:document?.indexingStatus??null,approvalStatus:document?.approvalStatus??null};
 }));
}});
export const listPage=query({args:{paginationOpts:paginationOptsValidator,archived:v.boolean()},handler:async(ctx,args)=>{
 const {user}=await requireAnyRole(ctx,["admin","staff"]);
 const page=await ctx.db.query('saada_research_pdfs').withIndex('by_archived',q=>q.eq('archived',args.archived)).order('desc').paginate(args.paginationOpts);
 return {...page,page:await Promise.all(page.page.map(async row=>{
  const document=await ctx.db.query('documents').withIndex('by_storageId',q=>q.eq('storageId',row.indexingStorageId??row.storageId)).first();
  const receipt=await ctx.db.query('managed_uploads').withIndex('by_storage',q=>q.eq('storageId',row.indexingStorageId??row.storageId)).unique();
  const canReuseIndexingCopy=!!receipt&&receipt.ownerId===user._id&&receipt.status==='clean'&&receipt.purpose==='ai_source'&&receipt.entityId===undefined;
  return {...row,canReuseIndexingCopy,url:await ctx.storage.getUrl(row.storageId),indexingUrl:row.indexingDerivative&&row.indexingStorageId?await ctx.storage.getUrl(row.indexingStorageId):null,indexingStatus:document?.indexingStatus??null,approvalStatus:document?.approvalStatus??null};
 }))};
}});
export const setArchived=mutation({args:{id:v.id('saada_research_pdfs'),archived:v.boolean(),reason:v.string()},handler:async(ctx,args)=>{
 const {user}=await requireAnyRole(ctx,["admin","staff"]);const reason=normalizeText(args.reason,'Removal or restoration reason',500);
 if(reason.length<10)throw new Error('Explain the change in at least 10 characters.');
 if(!await ctx.db.get(args.id))throw new Error('Research source not found.');
 await ctx.db.patch(args.id,{archived:args.archived});
 await ctx.db.insert('audit_logs',{action:args.archived?'saada.research_pdf_archived':'saada.research_pdf_restored',entityType:'saada_research_pdf',entityId:args.id,userId:user._id,timestamp:Date.now(),metadata:{reason}});
}});
// Byte-identical scanned copies preserve the original archive and provenance.
export const linkIndexingCopy=mutation({args:{id:v.id('saada_research_pdfs'),storageId:v.id('_storage')},handler:async(ctx,args)=>{
 const {user}=await requireAnyRole(ctx,["admin","staff"]);const row=await ctx.db.get(args.id);
 if(!row||row.archived)throw new Error('Active research source required.');
 await requireCleanOwnedUpload(ctx,args.storageId,user._id,'ai_source');
 const file=await ctx.db.system.get(args.storageId);
 if(!file||file.size>15*1024*1024||file.size!==row.byteSize||storageChecksumHex(file.sha256)!==row.sha256||file.contentType!=='application/pdf')throw new Error('Scanned copy must match the original PDF checksum, size and type.');
 if(row.indexingStorageId===args.storageId)return;
 const existing=await ctx.db.query('documents').withIndex('by_storageId',q=>q.eq('storageId',row.indexingStorageId??row.storageId)).first();
 if(existing)throw new Error('A source record already exists. Use its indexing recovery or review controls.');
 await ctx.db.patch(row._id,{indexingStorageId:args.storageId});
 await ctx.db.insert('audit_logs',{action:'saada.research_indexing_copy_linked',entityType:'saada_research_pdf',entityId:row._id,userId:user._id,timestamp:Date.now(),metadata:{sha256:row.sha256,...(row.indexingStorageId?{previousIndexingStorageId:row.indexingStorageId}:{}),indexingStorageId:args.storageId}});
}});
// A separate bounded queue, bound to each archived original's exact bytes.
export const generateIndexingUploadUrl=mutation({args:{id:v.id('saada_research_pdfs')},handler:async(ctx,args)=>{
 const {user}=await requireAnyRole(ctx,["admin","staff"]);const row=await ctx.db.get(args.id);
 if(!row||row.archived||row.byteSize>15*1024*1024)throw new Error('Choose an active research PDF of 15 MiB or smaller.');
 const existing=await ctx.db.query('documents').withIndex('by_storageId',q=>q.eq('storageId',row.indexingStorageId??row.storageId)).first();
 if(existing)throw new Error('This source already has an indexing record. Use recovery or review.');
 return issueManagedUpload(ctx,user._id,'ai_source',undefined,{sourceId:row._id,sha256:row.sha256,byteSize:row.byteSize});
}});
export const indexingUploadState=query({args:{id:v.id('saada_research_pdfs')},handler:async(ctx,args)=>{
 await requireAnyRole(ctx,["admin","staff"]);
 if(!await ctx.db.get(args.id))throw new Error('Research source unavailable.');
 const latest=await ctx.db.query('managed_uploads').withIndex('by_research_source',q=>q.eq('researchSourceId',args.id)).order('desc').first();
 return latest?{status:latest.status,diagnosticCode:latest.diagnosticCode,createdAt:latest.createdAt}:null;
}});

// A machine OCR derivative remains a separate, explicitly unverified copy.
export const linkIndexingDerivative=mutation({args:{id:v.id('saada_research_pdfs'),storageId:v.id('_storage'),sha256:v.string(),byteSize:v.number(),pageCount:v.number()},handler:async(ctx,args)=>{
 const {user}=await requireAnyRole(ctx,["admin","staff"]);const row=await ctx.db.get(args.id);
 if(!row||row.archived)throw new Error('Active research source required.');
 if(!/^[a-f0-9]{64}$/.test(args.sha256)||!Number.isSafeInteger(args.byteSize)||args.byteSize<1||args.byteSize>15*1024*1024||!Number.isSafeInteger(args.pageCount)||args.pageCount<1||args.pageCount>1000)throw new Error('Invalid OCR derivative metadata.');
 const original=JSON.parse(row.provenance);const observedPages=original.extractionReview?.pages;
 if(typeof observedPages==='number'&&observedPages!==args.pageCount)throw new Error('OCR derivative must preserve every original page.');
 await requireCleanOwnedUpload(ctx,args.storageId,user._id,'ai_source');const file=await ctx.db.system.get(args.storageId);
 if(!file||file.contentType!=='application/pdf'||file.size!==args.byteSize||storageChecksumHex(file.sha256)!==args.sha256)throw new Error('OCR derivative checksum, size or type mismatch.');
 if(row.indexingStorageId===args.storageId&&row.indexingDerivative?.sha256===args.sha256)return;
 const existing=await ctx.db.query('documents').withIndex('by_storageId',q=>q.eq('storageId',row.indexingStorageId??row.storageId)).first();
 if(existing)throw new Error('A source record already exists. Use its review lifecycle.');
 await ctx.db.patch(row._id,{indexingStorageId:args.storageId,indexingDerivative:{kind:'machine_ocr',sha256:args.sha256,byteSize:args.byteSize,pageCount:args.pageCount,preparedBy:user._id,reviewStatus:'pending'}});
 await ctx.db.insert('audit_logs',{action:'saada.ocr_derivative_linked',entityType:'saada_research_pdf',entityId:row._id,userId:user._id,timestamp:Date.now(),metadata:{originalSha256:row.sha256,derivativeSha256:args.sha256,pageCount:args.pageCount}});
}});
export const reviewIndexingDerivative=mutation({args:{id:v.id('saada_research_pdfs'),decision:v.union(v.literal('verified'),v.literal('rejected')),note:v.string()},handler:async(ctx,args)=>{
 const {user}=await requireAnyRole(ctx,["admin"]);const row=await ctx.db.get(args.id),derivative=row?.indexingDerivative;
 if(!row||!derivative||derivative.reviewStatus!=='pending')throw new Error('Pending OCR transcription review required.');
 if(derivative.preparedBy===user._id)throw new Error('A different administrator must review the OCR transcription.');
 const note=normalizeText(args.note,'Transcription review reason',2000);if(note.length<20)throw new Error('Record a substantive transcription review reason.');
 await ctx.db.patch(row._id,{indexingDerivative:{...derivative,reviewStatus:args.decision,reviewedBy:user._id,reviewNote:note}});
 await ctx.db.insert('audit_logs',{action:'saada.ocr_transcription_'+args.decision,entityType:'saada_research_pdf',entityId:row._id,userId:user._id,timestamp:Date.now(),metadata:{note,derivativeSha256:derivative.sha256}});
}});
