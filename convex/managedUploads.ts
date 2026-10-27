import { internalMutation, internalQuery, internalAction, httpAction } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { digestBytes, readBoundedBody, uploadPolicy, validateFileSignature, type UploadPurpose } from "./lib/uploadPolicy";
import { enforceRateLimit } from "./lib/rateLimits";
import { getActiveRoles, requireAnyRole } from "./lib/auth";
import { requireCleanOwnedUpload } from "./lib/managedUploads";

async function requireActiveTicketOwner(ctx: MutationCtx, ticket: Doc<"managed_uploads">) {
  const owner = await ctx.db.get(ticket.ownerId);
  if (!owner || owner.isDeleted) throw new Error("Upload access denied.");
  uploadPolicy(ticket.purpose as UploadPurpose);
  if (ticket.researchSourceId) {
    const original = await ctx.db.get(ticket.researchSourceId);
    if (!original || original.archived || original.sha256 !== ticket.expectedSha256 || original.byteSize !== ticket.expectedByteSize || ticket.purpose !== "ai_source") throw new Error("Research upload access denied.");
  }
  if (ticket.purpose === "ai_source" || ticket.purpose === "public_media") {
    const roles = await getActiveRoles(ctx, ticket.ownerId);
    if (!roles.some(role => role === "admin" || role === "staff")) throw new Error("Upload access denied.");
  }
}

export const authorizeSource = internalQuery({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    await requireCleanOwnedUpload(ctx, args.storageId, user._id, "ai_source");
    return true;
  },
});

export const reserveAiRequest = internalMutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject)).unique();
    if (!user || user.isDeleted) throw new Error("Unauthorized");
    await enforceRateLimit(ctx, `ai-minute:${user._id}`, 10, 60 * 1000);
    await enforceRateLimit(ctx, `ai-day:${user._id}`, 100, 24 * 60 * 60 * 1000);
  },
});

export const claim = internalMutation({
  args: { tokenHash: v.string() },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.query("managed_uploads").withIndex("by_token", q => q.eq("tokenHash", args.tokenHash)).unique();
    if (!ticket || ticket.status !== "issued" || ticket.expiresAt < Date.now()) throw new Error("Upload ticket expired or already used.");
    await requireActiveTicketOwner(ctx, ticket);
    await enforceRateLimit(ctx, `upload-start:${ticket.ownerId}`, 10, 60 * 1000);
    await ctx.db.patch(ticket._id, { status: "scanning" });
    return ticket;
  },
});

export const finish = internalMutation({
  args: { id: v.id("managed_uploads"), status: v.union(v.literal("clean"), v.literal("rejected"), v.literal("failed")), storageId: v.optional(v.id("_storage")), sha256: v.optional(v.string()), type: v.optional(v.string()), size: v.optional(v.number()), scannerVersion: v.optional(v.string()), definitionsUpdatedAt: v.optional(v.number()), diagnosticCode: v.optional(v.string()), scannerHttpStatus: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (!row || row.status !== "scanning") throw new Error("Upload state conflict.");
    if (args.status === "clean") {
      if (!args.storageId || !args.sha256 || !args.size || !args.scannerVersion || !args.definitionsUpdatedAt || !row.scanReservedAt || row.size !== args.size || row.type !== args.type) throw new Error("Incomplete clean scan receipt.");
      await requireActiveTicketOwner(ctx, row);
      if (!/^[a-f0-9]{64}$/.test(args.sha256) || !args.scannerVersion.trim() || !Number.isFinite(args.definitionsUpdatedAt) || Date.now() - args.definitionsUpdatedAt > 48 * 60 * 60 * 1000 || args.definitionsUpdatedAt > Date.now() + 60_000) throw new Error("Invalid clean scan receipt.");
      if (row.quarantineStorageId && (row.quarantineStorageId !== args.storageId || row.sha256 !== args.sha256 || !row.scanFetchClaimedAt)) throw new Error("Scan source mismatch.");
    }
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, scanTokenHash: undefined, scanTokenExpiresAt: undefined, cleanupPending: args.status !== "clean" && !!row.quarantineStorageId, ...(args.status === "clean" ? { quarantineStorageId: undefined } : {}) });
    if (args.status !== "clean" && row.quarantineStorageId) await ctx.scheduler.runAfter(0, internal.managedUploads.cleanupQuarantine, { id });
  },
});

export const reserveScan = internalMutation({
  args: { id: v.id("managed_uploads"), byteSize: v.number(), type: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (!row || row.status !== "scanning" || row.scanReservedAt) throw new Error("Scan reservation conflict.");
    await requireActiveTicketOwner(ctx, row);
    const policy = uploadPolicy(row.purpose as UploadPurpose);
    if (!Number.isSafeInteger(args.byteSize) || args.byteSize <= 0 || args.byteSize > policy.maxBytes || !policy.types.includes(args.type)) throw new Error("Invalid scan reservation.");
    const maximum = (row.purpose === "ai_source" ? 1024 : 100) * 1024 * 1024;
    const key = row.purpose === "ai_source" ? `research-scan-bytes:${row.ownerId}` : `upload-scan-bytes:${row.ownerId}`;
    await enforceRateLimit(ctx, key, maximum, 24 * 60 * 60 * 1000, args.byteSize);
    await ctx.db.patch(row._id, { scanReservedAt: Date.now(), size: args.byteSize, type: args.type });
  },
});

export const stageForScan = internalMutation({
  args: { id: v.id("managed_uploads"), storageId: v.id("_storage"), sha256: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (!row || row.status !== "scanning" || !row.scanReservedAt || row.quarantineStorageId || !/^[a-f0-9]{64}$/.test(args.sha256)) throw new Error("Invalid scan staging.");
    await requireActiveTicketOwner(ctx, row);
    const metadata = await ctx.db.system.get(args.storageId);
    if (!metadata || metadata.size !== row.size || metadata.contentType !== row.type) throw new Error("Scan staging mismatch.");
    const capability = await digestBytes(new TextEncoder().encode(await ctx.storage.generateUploadUrl()));
    await ctx.db.patch(row._id, { quarantineStorageId: args.storageId, sha256: args.sha256, scanTokenHash: await digestBytes(new TextEncoder().encode(capability)), scanTokenExpiresAt: Date.now() + 2 * 60 * 1000 });
    return capability;
  },
});

export const claimScanSource = internalMutation({
  args: { tokenHash: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db.query("managed_uploads").withIndex("by_scan_token", q => q.eq("scanTokenHash", args.tokenHash)).unique();
    if (!row || row.status !== "scanning" || !row.quarantineStorageId || row.scanFetchClaimedAt || !row.scanTokenExpiresAt || row.scanTokenExpiresAt < Date.now()) throw new Error("Scan access denied.");
    await requireActiveTicketOwner(ctx, row);
    await ctx.db.patch(row._id, { scanFetchClaimedAt: Date.now() });
    return { storageId: row.quarantineStorageId, size: row.size };
  },
});

export const rejectedQuarantine = internalQuery({
  args: { id: v.id("managed_uploads") },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    return row && (row.status === "failed" || row.status === "rejected") ? row.quarantineStorageId ?? null : null;
  },
});

export const cleanupQuarantine = internalAction({
  args: { id: v.id("managed_uploads") },
  handler: async (ctx, args) => {
    const storageId = await ctx.runQuery(internal.managedUploads.rejectedQuarantine, args);
    if (storageId) {
      try { await ctx.storage.delete(storageId); } catch (error) {
        if (!(error instanceof Error) || error.message !== `storage id ${storageId} not found`) throw error;
      }
      await ctx.runMutation(internal.managedUploads.acknowledgeQuarantineCleanup, { id: args.id, storageId });
    }
  },
});

export const acknowledgeQuarantineCleanup = internalMutation({
  args: { id: v.id("managed_uploads"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (row && (row.status === "failed" || row.status === "rejected") && row.quarantineStorageId === args.storageId) await ctx.db.patch(row._id, { quarantineStorageId: undefined, cleanupPending: false });
  },
});

export const retryQuarantineCleanup = internalMutation({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("managed_uploads").withIndex("by_cleanup_pending", q => q.eq("cleanupPending", true)).take(100);
    for (const row of rows) {
      if ((row.status === "failed" || row.status === "rejected") && row.quarantineStorageId) await ctx.scheduler.runAfter(0, internal.managedUploads.cleanupQuarantine, { id: row._id });
    }
    return { scheduled: rows.length };
  },
});

export const scanSource = httpAction(async (ctx, request) => {
  const responseHeaders = { "Cache-Control": "no-store", "Content-Type": "application/octet-stream", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" };
  try {
    const capability = request.headers.get("Authorization")?.replace(/^Bearer /, "");
    if (!capability || !/^[a-f0-9]{64}$/.test(capability)) throw new Error("Scan access denied.");
    const source = await ctx.runMutation(internal.managedUploads.claimScanSource, { tokenHash: await digestBytes(new TextEncoder().encode(capability)) });
    const blob = await ctx.storage.get(source.storageId);
    if (!blob || blob.size !== source.size) throw new Error("Scan source unavailable.");
    return new Response(blob, { headers: responseHeaders });
  } catch {
    return new Response(null, { status: 404, headers: responseHeaders });
  }
});

export const expireStaleTickets = internalMutation({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    if (!Number.isInteger(args.limit) || args.limit < 1 || args.limit > 100) throw new Error("Invalid ticket sweep limit.");
    let expired = 0;
    const cutoff = Date.now() - 15 * 60 * 1000;
    for (const status of ["scanning", "issued"] as const) {
      if (expired >= args.limit) break;
      const rows = await ctx.db.query("managed_uploads")
        .withIndex("by_status_created", q => q.eq("status", status).lt("createdAt", cutoff))
        .take(args.limit - expired);
      for (const row of rows) {
        // Never delete accepted evidence; only failed temporary quarantine is eligible.
        await ctx.db.patch(row._id, { status: "failed", cleanupPending: !!row.quarantineStorageId });
        if (row.quarantineStorageId) await ctx.scheduler.runAfter(0, internal.managedUploads.cleanupQuarantine, { id: row._id });
        expired++;
      }
    }
    return { expired };
  },
});

const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "Content-Type": "application/json" };
export const preflight = httpAction(async () => new Response(null, { status: 204, headers }));
export const receive = httpAction(async (ctx, request) => {
  const endpoint = process.env.PRIVATE_SCANNER_URL;
  const secret = process.env.PRIVATE_SCANNER_TOKEN;
  if (!endpoint?.startsWith("https://") || !secret || secret.length < 32) return new Response(JSON.stringify({ error: "Secure uploads unavailable." }), { status: 503, headers });
  let ticket;
  let stored;
  let diagnosticCode = "ticket";
  let scannerHttpStatus: number | undefined;
  try {
    const capability = new URL(request.url).searchParams.get("ticket");
    if (!capability || !/^[a-f0-9]{64}$/.test(capability)) throw new Error("Upload access denied.");
    ticket = await ctx.runMutation(internal.managedUploads.claim, { tokenHash: await digestBytes(new TextEncoder().encode(capability)) });
    diagnosticCode = "file_validation";
    const policy = uploadPolicy(ticket.purpose as UploadPurpose);
    const type = (request.headers.get("Content-Type") ?? "").split(";")[0].trim().toLowerCase();
    if (!policy.types.includes(type)) throw new Error("Unsupported file format.");
    const bytes = await readBoundedBody(request, policy.maxBytes);
    validateFileSignature(bytes, type);
    diagnosticCode = "scan_reservation";
    await ctx.runMutation(internal.managedUploads.reserveScan, { id: ticket._id, byteSize: bytes.length, type });
    const sha256 = await digestBytes(bytes);
    if (ticket.researchSourceId && (ticket.expectedSha256 !== sha256 || ticket.expectedByteSize !== bytes.length)) throw new Error("Research bytes do not match the archived original.");
    const fetchTransport = process.env.PRIVATE_SCANNER_TRANSPORT === "fetch";
    let scanBody: BodyInit = bytes as BodyInit;
    if (fetchTransport) {
      stored = await ctx.storage.store(new Blob([bytes as BlobPart], { type }));
      const capability = await ctx.runMutation(internal.managedUploads.stageForScan, { id: ticket._id, storageId: stored, sha256 });
      scanBody = JSON.stringify({ capability, sha256, size: bytes.length });
    }
    diagnosticCode = "scanner_transport";
    const scan = await fetch(endpoint, { method: "POST", headers: { "Authorization": `Bearer ${secret}`, "Content-Type": fetchTransport ? "application/json" : "application/octet-stream" }, body: scanBody, signal: AbortSignal.timeout(120_000), redirect: "error" });
    scannerHttpStatus = scan.status;
    if (!scan.ok) throw new Error("The private scanner is unavailable. Please try again.");
    diagnosticCode = "scanner_response";
    const result = await scan.json();
    diagnosticCode = result.clean !== true ? (result.inspection === "inspection_limit" ? "scanner_inspection_limit" : result.inspection === "encrypted" ? "scanner_encrypted" : "scanner_rejected") : result.sha256 !== sha256 ? "scanner_hash_mismatch" : typeof result.engine !== "string" ? "scanner_engine_missing" : "scanner_definitions_stale";
    if (result.clean !== true || result.sha256 !== sha256 || typeof result.engine !== "string" || !Number.isFinite(result.definitionsUpdatedAt) || Date.now() - result.definitionsUpdatedAt > 48 * 60 * 60 * 1000 || result.definitionsUpdatedAt > Date.now() + 60_000) {
      await ctx.runMutation(internal.managedUploads.finish, { id: ticket._id, status: "rejected", diagnosticCode, scannerHttpStatus });
      ticket = undefined;
      throw new Error("This file could not pass the security check.");
    }
    diagnosticCode = "clean_receipt_persistence";
    stored ??= await ctx.storage.store(new Blob([bytes as BlobPart], { type }));
    await ctx.runMutation(internal.managedUploads.finish, { id: ticket._id, status: "clean", storageId: stored, type, size: bytes.length, sha256, scannerVersion: result.engine.slice(0, 200), definitionsUpdatedAt: result.definitionsUpdatedAt });
    return new Response(JSON.stringify({ storageId: stored }), { status: 200, headers });
  } catch {
    if (stored) await ctx.storage.delete(stored).catch(() => undefined);
    if (ticket) await ctx.runMutation(internal.managedUploads.finish, { id: ticket._id, status: "failed", diagnosticCode, scannerHttpStatus }).catch(() => undefined);
    // Do not echo capability URLs, scanner details, or private metadata.
    return new Response(JSON.stringify({ error: "The file could not be uploaded securely. Please retry or choose another file." }), { status: 400, headers });
  }
});
