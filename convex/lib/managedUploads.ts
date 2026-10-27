import { requireAnyRole } from "./auth";
import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { enforceRateLimit } from "./rateLimits";
import { digestBytes, type UploadPurpose } from "./uploadPolicy";

export async function issueManagedUpload(ctx: MutationCtx, ownerId: Id<"users">, purpose: UploadPurpose, entityId?: string, research?: { sourceId: Id<"saada_research_pdfs">; sha256: string; byteSize: number }) {
  const site = process.env.CONVEX_SITE_URL;
  if (!site || !process.env.PRIVATE_SCANNER_URL?.startsWith("https://") || (process.env.PRIVATE_SCANNER_TOKEN?.length ?? 0) < 32) throw new ConvexError("Secure uploads are temporarily unavailable. Please try again later.");
  if (research) {
    const actor = await requireAnyRole(ctx, ["admin", "staff"]);
    const original = await ctx.db.get(research.sourceId);
    if (actor.user._id !== ownerId || purpose !== "ai_source" || entityId !== undefined || !original || original.archived || original.sha256 !== research.sha256 || original.byteSize !== research.byteSize || research.byteSize > 15 * 1024 * 1024) throw new ConvexError("Research upload scope mismatch.");
    await enforceRateLimit(ctx, `research-index-upload:${ownerId}`, 150, 24 * 60 * 60 * 1000);
  } else await enforceRateLimit(ctx, `upload:${ownerId}`, 30, 60 * 60 * 1000);
  // Convex supplies the cryptographically unguessable capability. Its underlying
  // storage URL is never exposed: clients receive only our one-use gateway URL.
  const nativeCapability = await ctx.storage.generateUploadUrl();
  const capability = await digestBytes(new TextEncoder().encode(nativeCapability));
  const tokenHash = await digestBytes(new TextEncoder().encode(capability));
  await ctx.db.insert("managed_uploads", { tokenHash, ownerId, purpose, entityId, status: "issued", createdAt: Date.now(), expiresAt: Date.now() + 5 * 60 * 1000, ...(research ? { researchSourceId: research.sourceId, expectedSha256: research.sha256, expectedByteSize: research.byteSize } : {}) });
  return `${site}/secure-upload?ticket=${encodeURIComponent(capability)}`;
}

export async function requireCleanOwnedUpload(ctx: MutationCtx | QueryCtx, storageId: Id<"_storage">, ownerId: Id<"users">, purpose: UploadPurpose, entityId?: string) {
  const receipt = await ctx.db.query("managed_uploads").withIndex("by_storage", q => q.eq("storageId", storageId)).unique();
  if (!receipt || receipt.ownerId !== ownerId || receipt.status !== "clean" || receipt.purpose !== purpose || receipt.entityId !== entityId) {
    throw new ConvexError("File ownership, purpose or malware scan could not be verified. Upload this file again.");
  }
  return receipt;
}

// Public editors may share approved public-media uploads, never private evidence.
export async function requirePublicMediaReference(ctx: MutationCtx, value?: string, previous?: string) {
  if (!value || value === previous) return;
  let storageId: string | undefined;
  if (/^[a-zA-Z0-9_-]+$/.test(value)) storageId = value;
  else if (/^https?:/i.test(value)) {
    const url = new URL(value);
    if (url.hostname.endsWith(".convex.cloud") && url.pathname.startsWith("/api/storage/")) storageId = url.pathname.slice("/api/storage/".length);
  }
  if (!storageId) return;
  const receipt = await ctx.db.query("managed_uploads").withIndex("by_storage", q => q.eq("storageId", storageId as Id<"_storage">)).unique();
  if (!receipt || receipt.status !== "clean" || receipt.purpose !== "public_media") throw new ConvexError("Choose a security-checked public media upload, not a private document.");
}
