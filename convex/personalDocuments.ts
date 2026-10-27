import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./lib/auth";
import { issueManagedUpload, requireCleanOwnedUpload } from "./lib/managedUploads";
import { enforceRateLimit } from "./lib/rateLimits";
import { normalizeText } from "./lib/security";

export const generateUploadUrl = mutation({
  args: {}, handler: async ctx => {
    const { user } = await requireAuthenticatedUser(ctx);
    return issueManagedUpload(ctx, user._id, "personal_document");
  },
});

export const save = mutation({
  args: { storageId: v.id("_storage"), name: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const receipt = await requireCleanOwnedUpload(ctx, args.storageId, user._id, "personal_document");
    const existing = await ctx.db.query("personal_documents").withIndex("by_storage", q => q.eq("storageId", args.storageId)).unique();
    if (existing) {
      if (existing.ownerId !== user._id) throw new ConvexError("Forbidden");
      return existing._id;
    }
    await enforceRateLimit(ctx, `document-save:${user._id}`, 30, 60 * 60 * 1000);
    if (!receipt.type || !receipt.size) throw new ConvexError("Missing verified file metadata");
    return ctx.db.insert("personal_documents", { ownerId: user._id, storageId: args.storageId, name: normalizeText(args.name, "Document name", 180), type: receipt.type, size: receipt.size, createdAt: Date.now() });
  },
});

export const list = query({
  args: {}, handler: async ctx => {
    const { user } = await requireAuthenticatedUser(ctx);
    return ctx.db.query("personal_documents").withIndex("by_owner", q => q.eq("ownerId", user._id)).order("desc").take(200);
  },
});

export const get = query({
  args: { id: v.id("personal_documents") }, handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const document = await ctx.db.get(args.id);
    if (!document || document.ownerId !== user._id) throw new ConvexError("Document not found");
    await requireCleanOwnedUpload(ctx, document.storageId, user._id, "personal_document");
    return { ...document, url: await ctx.storage.getUrl(document.storageId) };
  },
});

export const reserveBrief = mutation({
  args: { id: v.id("personal_documents"), consent: v.boolean() }, handler: async (ctx, args) => {
    if (!args.consent) throw new ConvexError("AI analysis requires your consent");
    const { user } = await requireAuthenticatedUser(ctx);
    const document = await ctx.db.get(args.id);
    if (!document || document.ownerId !== user._id) throw new ConvexError("Document not found");
    await requireCleanOwnedUpload(ctx, document.storageId, user._id, "personal_document");
    await enforceRateLimit(ctx, `document-brief:${user._id}`, 10, 60 * 60 * 1000);
    return { ownerId: user._id, document };
  },
});

export const storeBrief = internalMutation({
  args: { id: v.id("personal_documents"), ownerId: v.id("users"), brief: v.string(), locale: v.union(v.literal("sw"), v.literal("en")) },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.ownerId);
    const document = await ctx.db.get(args.id);
    if (!user || user.isDeleted || !document || document.ownerId !== args.ownerId) throw new ConvexError("Document not found");
    await ctx.db.patch(document._id, { brief: normalizeText(args.brief, "AI brief", 5000), briefLocale: args.locale });
  },
});
