import { speechParts } from "./lib/saadaSpeech";
import { internalMutation, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireAuthenticatedUser } from "./lib/auth";
import { issueManagedUpload, requireCleanOwnedUpload } from "./lib/managedUploads";
import { enforceRateLimit } from "./lib/rateLimits";

export const generateAudioUploadUrl = mutation({args:{},handler:async ctx=>{
  const {user}=await requireAuthenticatedUser(ctx);
  return issueManagedUpload(ctx,user._id,"saada_audio");
}});
export const reserveAudio = internalMutation({args:{storageId:v.id("_storage"),consent:v.boolean()},handler:async(ctx,args)=>{
  const {user}=await requireAuthenticatedUser(ctx);
  if(!args.consent) throw new ConvexError("Transcription requires your consent.");
  const receipt=await requireCleanOwnedUpload(ctx,args.storageId,user._id,"saada_audio");
  if(!receipt.size || receipt.size>10*1024*1024 || !["audio/wav","audio/x-wav","audio/mp4","audio/m4a"].includes(receipt.type||"")) throw new ConvexError("Record a WAV or M4A voice question under 10 MB.");
  await enforceRateLimit(ctx,`saada-transcription:${user._id}`,5,10*60*1000);
  return {type:receipt.type!};
}});
export const discardAudio = mutation({args:{storageId:v.id("_storage")},handler:async(ctx,args)=>{
  const {user}=await requireAuthenticatedUser(ctx);
  await requireCleanOwnedUpload(ctx,args.storageId,user._id,"saada_audio");
  await ctx.storage.delete(args.storageId);
}});

// Only the server's completed answer can be spoken. A client cannot supply text,
// another person's message, or an in-progress model draft to this paid endpoint.
export const reserveSpeech = internalMutation({
  args: { messageId: v.id('sara_chats'), partIndex: v.number(), consent: v.boolean() },
  handler: async (ctx, args) => {
    const { identity, user } = await requireAuthenticatedUser(ctx);
    if (!args.consent) throw new ConvexError('Consent is required to create spoken audio.');
    const message = await ctx.db.get(args.messageId);
    if (!message || message.userId !== identity.subject || message.role !== 'assistant') throw new ConvexError('Answer not found.');
    if (!message.metadata?.completedAt || message.metadata?.failureCode) throw new ConvexError('Wait for the answer to finish.');
    if (message.conversationId) {
      const conversation = await ctx.db.get(message.conversationId);
      if (!conversation || conversation.userId !== identity.subject) throw new ConvexError('Conversation not found.');
    }
    const parts = speechParts(message.content);
    if (!Number.isInteger(args.partIndex) || args.partIndex < 0 || args.partIndex >= parts.length) throw new ConvexError('Invalid audio section.');
    await enforceRateLimit(ctx, `saada-speech:${user._id}`, 20, 10 * 60 * 1000);
    return { text: parts[args.partIndex], partCount: parts.length };
  },
});
