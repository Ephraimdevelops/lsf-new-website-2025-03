import { internalQuery, internalMutation } from './_generated/server';
import type { QueryCtx, MutationCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { v } from 'convex/values';

const args = { keepId: v.id('documents'), duplicateId: v.id('documents') };
async function compare(ctx: QueryCtx | MutationCtx, keepId: Id<'documents'>, duplicateId: Id<'documents'>, requireExact = true) {
  if (keepId === duplicateId) throw new Error('Choose different sources.');
  const keep = await ctx.db.get(keepId), duplicate = await ctx.db.get(duplicateId);
  if (!keep || !duplicate) throw new Error('Source not found.');
  // This narrow cleanup must not change reviewed legal sources or active ingestion.
  if (keep.approvalStatus !== undefined || duplicate.approvalStatus !== undefined || keep.indexingStatus === 'processing' || duplicate.indexingStatus === 'processing') throw new Error('Only idle legacy sources are eligible.');
  if (!keep.text?.trim() || keep.text !== duplicate.text || keep.title !== duplicate.title) throw new Error('Source text and title must match exactly.');
  const retained = await ctx.db.query('embeddings').withIndex('by_documentId', q => q.eq('documentId', keepId)).take(251);
  const redundant = await ctx.db.query('embeddings').withIndex('by_documentId', q => q.eq('documentId', duplicateId)).take(251);
  if (retained.length > 250 || redundant.length > 250) throw new Error('Source exceeds this bounded cleanup limit.');
  const byIndex = new Map(retained.map(chunk => [chunk.chunkIndex, chunk]));
  if (!retained.length || byIndex.size !== retained.length || retained.length !== redundant.length || new Set(redundant.map(chunk => chunk.chunkIndex)).size !== redundant.length) throw new Error('Chunk coverage does not match.');
  let differentPassages = 0, differentVectors = 0;
  for (const chunk of redundant) {
    const original = byIndex.get(chunk.chunkIndex);
    if (!original || original.text !== chunk.text) differentPassages++;
    if (!original || !chunk.embedding.length || original.embedding.length !== chunk.embedding.length || !original.embedding.every((value, index) => value === chunk.embedding[index])) differentVectors++;
  }
  if (requireExact && (differentPassages || differentVectors)) throw new Error('Stored passages and vectors are not exact duplicates.');
  return { duplicate, redundant, retainedCount: retained.length, differentPassages, differentVectors };
}

export const duplicatePlan = internalQuery({
  args,
  handler: async (ctx, { keepId, duplicateId }) => {
    const result = await compare(ctx, keepId, duplicateId, false);
    return { keepId, duplicateId, title: result.duplicate.title, candidateChunks: result.redundant.length, exactDuplicateChunks: result.differentPassages || result.differentVectors ? 0 : result.redundant.length, retainedChunks: result.retainedCount, differentPassages: result.differentPassages, differentVectors: result.differentVectors, eligible: result.differentPassages === 0 && result.differentVectors === 0, sourceDocumentsPreserved: true, originalFilesPreserved: true };
  },
});

export const removeExactLegacyDuplicate = internalMutation({
  args: { ...args, confirmation: v.literal('REMOVE_EXACT_DUPLICATE_EMBEDDINGS') },
  handler: async (ctx, { keepId, duplicateId }) => {
    // Revalidate in the deletion transaction; a prior dry-run is not authorization evidence.
    const result = await compare(ctx, keepId, duplicateId);
    for (const chunk of result.redundant) await ctx.db.delete(chunk._id);
    const metadata = result.duplicate.metadata && typeof result.duplicate.metadata === 'object' && !Array.isArray(result.duplicate.metadata) ? result.duplicate.metadata : {};
    const now = Date.now();
    await ctx.db.patch(duplicateId, {
      processedAt: undefined, indexingStatus: undefined,
      metadata: { ...metadata, embeddingDeduplication: { retainedDocumentId: keepId, removedChunks: result.redundant.length, at: now } },
    });
    await ctx.db.insert('audit_logs', { action: 'saada.exact_legacy_embedding_duplicate_removed', entityType: 'document', entityId: duplicateId, userId: 'system:storage-maintenance', timestamp: now, metadata: { retainedDocumentId: keepId, removedChunks: result.redundant.length, originalFilesPreserved: true } });
    return { removedChunks: result.redundant.length, retainedChunks: result.retainedCount, keepId, duplicateId };
  },
});
