import { internalQuery } from './_generated/server';
import { v } from 'convex/values';

// Small metadata pages only. Never scan or return the vector table for an inventory.
export const sources = internalQuery({
  args: { cursor: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const result = await ctx.db.query('documents').paginate({ numItems: 5, cursor: args.cursor ?? null });
    return {
      isDone: result.isDone,
      cursor: result.continueCursor,
      sources: result.page.map(doc => ({
        id: doc._id, title: doc.title, approvalStatus: doc.approvalStatus,
        indexingStatus: doc.indexingStatus, sourceUrl: doc.sourceUrl,
        versionLabel: doc.versionLabel, uploadedAt: doc.uploadedAt,
        textCharacters: doc.text?.length ?? 0,
        estimatedChunks: Math.ceil((doc.text?.length ?? 0) / 800),
      })),
    };
  },
});

export const compareSources = internalQuery({
  args: { leftId: v.id('documents'), rightId: v.id('documents') },
  handler: async (ctx, args) => {
    if (args.leftId === args.rightId) throw new Error('Choose two different sources.');
    const left = await ctx.db.get(args.leftId);
    const right = await ctx.db.get(args.rightId);
    if (!left || !right) throw new Error('Source not found.');
    return {
      leftId: left._id, rightId: right._id,
      identicalExtractedText: typeof left.text === 'string' && left.text.trim().length > 0 && left.text === right.text,
      sameStorageReference: left.storageId === right.storageId,
      leftCharacters: left.text?.length ?? 0, rightCharacters: right.text?.length ?? 0,
      note: 'Exact extracted-text equality is not a decision to delete either source or its legal provenance.',
    };
  },
});
