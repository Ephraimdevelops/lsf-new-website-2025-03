import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { issueManagedUpload, requireCleanOwnedUpload } from "./lib/managedUploads";
import { digestBytes, type UploadPurpose } from "./lib/uploadPolicy";

const developmentSite = "https://joyous-spaniel-5.convex.site";
function requireRehearsalDeployment() {
  if (process.env.CONVEX_SITE_URL !== developmentSite) throw new Error("Synthetic rehearsal is restricted to the named development deployment.");
}

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    requireRehearsalDeployment();
    const nonce = await digestBytes(new TextEncoder().encode(await ctx.storage.generateUploadUrl()));
    const ownerId = await ctx.db.insert("users", { name: "Synthetic Scanner Rehearsal", email: "scanner-rehearsal@example.invalid", role: "staff", clerkId: `synthetic-scanner-rehearsal-${nonce}` });
    const otherOwnerId = await ctx.db.insert("users", { name: "Synthetic Other Owner", email: "scanner-other@example.invalid", role: "user", clerkId: `synthetic-scanner-rehearsal-other-${nonce}` });
    const purposes: UploadPurpose[] = ["application", "request_attachment", "case_document", "personal_document", "case_voice", "referral_consent", "profile_photo", "public_media", "ai_source"];
    const uploads: { purpose: UploadPurpose; entityId?: string; url: string; large?: boolean }[] = [];
    for (const purpose of purposes) {
      const entityId = ["case_document", "case_voice", "referral_consent"].includes(purpose) ? "synthetic-case-a" : undefined;
      uploads.push({ purpose, entityId, url: await issueManagedUpload(ctx, ownerId, purpose, entityId) });
    }
    uploads.push({ purpose: "ai_source", large: true, url: await issueManagedUpload(ctx, ownerId, "ai_source") });
    const infectedUrl = await issueManagedUpload(ctx, ownerId, "request_attachment");
    return { ownerId, otherOwnerId, ownerClerkId: `synthetic-scanner-rehearsal-${nonce}`, otherClerkId: `synthetic-scanner-rehearsal-other-${nonce}`, uploads, infectedUrl };
  },
});

export const verifyBinding = internalMutation({
  args: { ownerId: v.id("users"), otherOwnerId: v.id("users"), storageId: v.id("_storage"), purpose: v.string(), entityId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    requireRehearsalDeployment();
    await requireCleanOwnedUpload(ctx, args.storageId, args.ownerId, args.purpose as UploadPurpose, args.entityId);
    let otherOwnerDenied = false; let otherCaseDenied = args.entityId === undefined;
    try { await requireCleanOwnedUpload(ctx, args.storageId, args.otherOwnerId, args.purpose as UploadPurpose, args.entityId); } catch { otherOwnerDenied = true; }
    if (args.entityId) {
      try { await requireCleanOwnedUpload(ctx, args.storageId, args.ownerId, args.purpose as UploadPurpose, "synthetic-case-b"); } catch { otherCaseDenied = true; }
    }
    if (!otherOwnerDenied || !otherCaseDenied) throw new Error("Synthetic ownership rehearsal failed.");
    return { otherOwnerDenied, otherCaseDenied };
  },
});

export const cleanup = internalMutation({
  args: { users: v.array(v.id("users")) },
  handler: async (ctx, args) => {
    requireRehearsalDeployment();
    if (args.users.length < 1 || args.users.length > 2) throw new Error("Invalid synthetic cleanup scope.");
    for (const id of args.users) {
      const user = await ctx.db.get(id);
      if (!user?.clerkId.startsWith("synthetic-scanner-rehearsal-")) throw new Error("Not a synthetic rehearsal account.");
    }
    for (const id of args.users) {
      const documents = await ctx.db.query("personal_documents").withIndex("by_owner", q => q.eq("ownerId", id)).take(100);
      for (const document of documents) await ctx.db.delete(document._id);
      const receipts = await ctx.db.query("managed_uploads").withIndex("by_owner", q => q.eq("ownerId", id)).take(100);
      for (const receipt of receipts) {
        for (const storageId of new Set([receipt.storageId, receipt.quarantineStorageId].filter(Boolean))) {
          if (!await ctx.db.system.get(storageId!)) continue;
          try { await ctx.storage.delete(storageId!); } catch (error) {
            // The asynchronous quarantine cleaner may win this test-only race.
            if (!(error instanceof Error) || error.message !== `storage id ${storageId} not found`) throw error;
          }
        }
        await ctx.db.delete(receipt._id);
      }
      await ctx.db.delete(id);
    }
    return { cleaned: true };
  },
});

export const abandonedFixtures = internalQuery({
  args: {},
  handler: async (ctx) => {
    requireRehearsalDeployment();
    const prefix = "synthetic-scanner-rehearsal-";
    const users = await ctx.db.query("users").withIndex("by_clerk_id", q => q.gte("clerkId", prefix).lt("clerkId", `${prefix}~`)).take(20);
    return users.map(user => user._id);
  },
});

export const cleanupAbandoned = internalAction({
  args: {},
  handler: async (ctx): Promise<{ cleaned: number }> => {
    requireRehearsalDeployment();
    const users = await ctx.runQuery(internal.uploadRehearsal.abandonedFixtures, {});
    for (let index = 0; index < users.length; index += 2) await ctx.runMutation(internal.uploadRehearsal.cleanup, { users: users.slice(index, index + 2) });
    return { cleaned: users.length };
  },
});

export const verifyRejected = internalQuery({
  args: { tokenHash: v.string(), sha256: v.string() },
  handler: async (ctx, args) => {
    requireRehearsalDeployment();
    const receipt = await ctx.db.query("managed_uploads").withIndex("by_token", q => q.eq("tokenHash", args.tokenHash)).unique();
    return receipt?.status === "rejected" && receipt.sha256 === args.sha256 && !!receipt.scanFetchClaimedAt && !receipt.storageId;
  },
});

export const run = internalAction({
  args: { purpose: v.optional(v.literal("personal_document")) },
  handler: async (ctx, args): Promise<unknown> => {
    requireRehearsalDeployment();
    const fixture = await ctx.runMutation(internal.uploadRehearsal.seed, {});
    const results = [];
    try {
      const uploads = fixture.uploads.filter(upload => !args.purpose || upload.purpose === args.purpose);
      if (!uploads.length) throw new Error("No upload fixture matched the requested purpose.");
      for (const upload of uploads) {
        let type = "application/pdf";
        let bytes = new TextEncoder().encode("%PDF-1.7\nSynthetic scanner rehearsal; no personal data.\n%%EOF");
        if (upload.large) {
          bytes = new Uint8Array(16 * 1024 * 1024).fill(32);
          bytes.set(new TextEncoder().encode("%PDF-1.7\nSynthetic large-file rehearsal; no personal data.\n"));
          bytes.set(new TextEncoder().encode("\n%%EOF"), bytes.length - 6);
        }
        if (upload.purpose === "request_attachment") { type = "text/plain"; bytes = new TextEncoder().encode("Synthetic scanner rehearsal only."); }
        if (upload.purpose === "profile_photo" || upload.purpose === "public_media") {
          type = "image/png";
          bytes = Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jB5kAAAAASUVORK5CYII="), character => character.charCodeAt(0));
        }
        if (upload.purpose === "case_voice") {
          type = "audio/wav"; bytes = new Uint8Array(44);
          const view = new DataView(bytes.buffer);
          bytes.set(new TextEncoder().encode("RIFF")); view.setUint32(4, 36, true); bytes.set(new TextEncoder().encode("WAVEfmt "), 8);
          view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, 8000, true);
          view.setUint32(28, 16000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); bytes.set(new TextEncoder().encode("data"), 36);
        }
        const response = await fetch(upload.url, { method: "POST", headers: { "Content-Type": type }, body: bytes as BodyInit, redirect: "error", signal: AbortSignal.timeout(150_000) });
        if (!response.ok) { results.push({ purpose: upload.purpose, passed: false, status: response.status }); continue; }
        const result = await response.json();
        const binding = await ctx.runMutation(internal.uploadRehearsal.verifyBinding, { ownerId: fixture.ownerId, otherOwnerId: fixture.otherOwnerId, storageId: result.storageId, purpose: upload.purpose, entityId: upload.entityId });
        const replay = await fetch(upload.url, { method: "POST", headers: { "Content-Type": type }, body: bytes as BodyInit, signal: AbortSignal.timeout(30_000) });
        results.push({ purpose: upload.purpose, byteSize: bytes.length, passed: replay.status === 400, replayDenied: replay.status === 400, ...binding });
      }
      const eicar = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";
      const infected = await fetch(fixture.infectedUrl, { method: "POST", headers: { "Content-Type": "text/plain" }, body: eicar, redirect: "error", signal: AbortSignal.timeout(150_000) });
      const rejectedReceipt = await ctx.runQuery(internal.uploadRehearsal.verifyRejected, { tokenHash: await digestBytes(new TextEncoder().encode(new URL(fixture.infectedUrl).searchParams.get("ticket")!)), sha256: await digestBytes(new TextEncoder().encode(eicar)) });
      results.push({ purpose: "harmless-EICAR", passed: infected.status === 400 && rejectedReceipt, status: infected.status, rejectedReceipt });
      return { results, passed: results.every(result => result.passed), scope: "Named development only; synthetic gateway/binding rehearsal, not authenticated mobile UI or production verification." };
    } finally {
      await ctx.runMutation(internal.uploadRehearsal.cleanup, { users: [fixture.ownerId, fixture.otherOwnerId] });
    }
  },
});
