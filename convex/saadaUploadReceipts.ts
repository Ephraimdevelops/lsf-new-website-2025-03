import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { requireAnyRole } from "./lib/auth";
import { normalizeText } from "./lib/security";
import { sourceUploadMetadata } from "./lib/saadaUploadMetadata";
import { requireCleanOwnedUpload } from "./lib/managedUploads";
export const record = mutation({
  args: { storageId: v.id("_storage"), metadata: v.object(sourceUploadMetadata) },
  handler: async (ctx, args) => {
    const { identity, user } = await requireAnyRole(ctx, ["admin", "staff"]);
    await requireCleanOwnedUpload(ctx, args.storageId, user._id, "ai_source");
    const metadata = { ...args.metadata, title: normalizeText(args.metadata.title, "Title", 180), publisher: normalizeText(args.metadata.publisher, "Publisher", 180), contentCategory: normalizeText(args.metadata.contentCategory, "Category", 100), versionLabel: normalizeText(args.metadata.versionLabel, "Version", 80) };
    if (!Number.isFinite(metadata.reviewDueAt) || metadata.reviewDueAt <= Date.now()) throw new Error("Choose a future review date.");
    if (metadata.sourceUrl) { const url = new URL(metadata.sourceUrl); if (!["https:", "http:"].includes(url.protocol)) throw new Error("Source URL must use HTTP(S)."); }
    if (!await ctx.storage.getUrl(args.storageId)) throw new Error("Uploaded PDF is unavailable.");
    const existing = await ctx.db.query("saada_upload_receipts").withIndex("by_storage", q => q.eq("storageId", args.storageId)).first();
    if (existing) {
      if (existing.uploadedByClerkId !== identity.subject || Object.keys(sourceUploadMetadata).some(key => existing.metadata[key as keyof typeof metadata] !== metadata[key as keyof typeof metadata])) throw new Error("Upload receipt must match its original owner and metadata.");
      return existing._id;
    }
    return await ctx.db.insert("saada_upload_receipts", { storageId: args.storageId, metadata, uploadedByClerkId: identity.subject, createdAt: Date.now() });
  },
});
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const { identity } = await requireAnyRole(ctx, ["admin", "staff"]);
    const receipts = await ctx.db.query("saada_upload_receipts").withIndex("by_uploader", q => q.eq("uploadedByClerkId", identity.subject)).order("desc").take(50);
    const pending = [];
    for (const receipt of receipts) {
      const document = await ctx.db.query("documents").withIndex("by_storageId", q => q.eq("storageId", receipt.storageId)).first();
      if (!document) pending.push({ _id: receipt._id, storageId: receipt.storageId, metadata: receipt.metadata, createdAt: receipt.createdAt });
    }
    return pending;
  },
});

export const minePage = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { identity } = await requireAnyRole(ctx, ["admin", "staff"]);
    const page = await ctx.db.query("saada_upload_receipts").withIndex("by_uploader", q => q.eq("uploadedByClerkId", identity.subject)).order("desc").paginate(args.paginationOpts);
    const rows = await Promise.all(page.page.map(async receipt => {
      const document = await ctx.db.query("documents").withIndex("by_storageId", q => q.eq("storageId", receipt.storageId)).first();
      return document ? null : { _id: receipt._id, storageId: receipt.storageId, metadata: receipt.metadata, createdAt: receipt.createdAt };
    }));
    return { ...page, page: rows.filter(row => row !== null) };
  },
});

export const correctReviewDate = mutation({
  args: { id: v.id("saada_upload_receipts"), reviewDueAt: v.number(), reason: v.string() },
  handler: async (ctx, args) => {
    const { identity, user } = await requireAnyRole(ctx, ["admin", "staff"]);
    const receipt = await ctx.db.get(args.id);
    if (!receipt || receipt.uploadedByClerkId !== identity.subject) throw new Error("Upload receipt access denied.");
    const document = await ctx.db.query("documents").withIndex("by_storageId", q => q.eq("storageId", receipt.storageId)).first();
    if (document) throw new Error("A source record already exists. Use its source-review lifecycle.");
    if (!Number.isFinite(args.reviewDueAt) || args.reviewDueAt <= Date.now()) throw new Error("Choose a future review date.");
    const reason = normalizeText(args.reason, "Correction reason", 500);
    if (reason.length < 10) throw new Error("Explain the correction in at least 10 characters.");
    if (receipt.metadata.reviewDueAt === args.reviewDueAt) return;
    await ctx.db.patch(receipt._id, { metadata: { ...receipt.metadata, reviewDueAt: args.reviewDueAt } });
    await ctx.db.insert("audit_logs", { action: "saada.upload_review_date_corrected", entityType: "saada_upload_receipt", entityId: receipt._id, userId: user._id, timestamp: Date.now(), metadata: { previousReviewDueAt: receipt.metadata.reviewDueAt, reviewDueAt: args.reviewDueAt, reason } });
  },
});
