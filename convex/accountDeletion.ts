import { ConvexError, v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { getActiveRoles } from "./lib/auth";

export const deleteMyAccount = action({
  args: { confirmation: v.literal("DELETE") },
  handler: async (ctx): Promise<{ deleted: boolean }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");
    const secret = process.env.CLERK_SECRET_KEY;
    if (!secret) throw new ConvexError("Account deletion is not configured. Contact LSF support.");
    // Verify the key belongs to the account's Clerk instance before changing access.
    const account = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(identity.subject)}`, {
      headers: { Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(15000),
    });
    const previous = await ctx.runQuery(internal.accountDeletion.getState, { clerkId: identity.subject });
    if (!account.ok && !(account.status === 404 && previous?.loginDeletionStatus)) {
      throw new ConvexError("Could not verify your login. Nothing has been deleted. Please try again.");
    }
    await ctx.runMutation(internal.accountDeletion.prepare, { clerkId: identity.subject });
    return await ctx.runAction(internal.accountDeletion.removeLogin, { clerkId: identity.subject, attempt: 0 });
  },
});

export const getState = internalQuery({
  args: { clerkId: v.string() },
  handler: (ctx, { clerkId }) => ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", clerkId)).unique(),
});

export const prepare = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", clerkId)).unique();
    if (!user) throw new ConvexError("Account not found");
    if (user.loginDeletionStatus === "complete") return;
    if (!user.loginDeletionStatus) {
      if (user.isDeleted) throw new ConvexError("This account is already deactivated. Contact LSF support.");
      const roles = await getActiveRoles(ctx, user._id);
      if (roles.includes("admin")) {
        const legacy = await ctx.db.query("users").withIndex("by_role", q => q.eq("role", "admin")).collect();
        const assignments = await ctx.db.query("role_assignments").withIndex("by_role_status", q => q.eq("role", "admin").eq("status", "active")).collect();
        const ids = new Set([...legacy.map(item => item._id), ...assignments.map(item => item.userId)]);
        let anotherAdmin = false;
        for (const id of ids) { const candidate = await ctx.db.get(id); if (id !== user._id && candidate && !candidate.isDeleted) anotherAdmin = true; }
        if (!anotherAdmin) throw new ConvexError("Appoint another administrator before deleting the last administrator account.");
      }
      const now = Date.now();
      const assignments = await ctx.db.query("role_assignments").withIndex("by_user_status", q => q.eq("userId", user._id).eq("status", "active")).collect();
      for (const assignment of assignments) await ctx.db.patch(assignment._id, { status: "revoked", revokedAt: now });
      const subscriptions = await ctx.db.query("push_subscriptions").withIndex("by_user", q => q.eq("userId", user._id)).collect();
      for (const subscription of subscriptions) await ctx.db.patch(subscription._id, { enabled: false, updatedAt: now });
      await ctx.db.patch(user._id, { isDeleted: true, deletedAt: now, loginDeletionStatus: "pending" });
      await ctx.db.insert("audit_logs", { action: "account_deletion_requested", entityType: "user", entityId: user._id, userId: clerkId, timestamp: now });
    } else await ctx.db.patch(user._id, { loginDeletionStatus: "pending" });
    // Durable fallback even if the requesting browser closes before the action finishes.
    await ctx.scheduler.runAfter(30000, internal.accountDeletion.removeLogin, { clerkId, attempt: 1 });
  },
});

export const finish = internalMutation({
  args: { clerkId: v.string(), complete: v.boolean() },
  handler: async (ctx, { clerkId, complete }) => {
    const user = await ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", clerkId)).unique();
    if (!user?.loginDeletionStatus || user.loginDeletionStatus === "complete") return;
    await ctx.db.patch(user._id, { loginDeletionStatus: complete ? "complete" : "failed" });
    await ctx.db.insert("audit_logs", { action: complete ? "account_login_deleted" : "account_login_deletion_failed", entityType: "user", entityId: user._id, userId: clerkId, timestamp: Date.now() });
  },
});

export const removeLogin = internalAction({
  args: { clerkId: v.string(), attempt: v.number() },
  handler: async (ctx, { clerkId, attempt }): Promise<{ deleted: boolean }> => {
    const user = await ctx.runQuery(internal.accountDeletion.getState, { clerkId });
    if (!user?.loginDeletionStatus || !user.isDeleted) return { deleted: false };
    if (user.loginDeletionStatus === "complete") return { deleted: true };
    let complete = false;
    try {
      const secret = process.env.CLERK_SECRET_KEY;
      if (!secret) throw new Error("Missing Clerk configuration");
      const response = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(clerkId)}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(15000),
      });
      complete = response.ok || response.status === 404;
    } catch { /* The durable job retries transient network failures. */ }
    if (complete) await ctx.runMutation(internal.accountDeletion.finish, { clerkId, complete: true });
    else if (attempt >= 6) await ctx.runMutation(internal.accountDeletion.finish, { clerkId, complete: false });
    else if (attempt > 0) await ctx.scheduler.runAfter(Math.min(3600000, 30000 * 2 ** attempt), internal.accountDeletion.removeLogin, { clerkId, attempt: attempt + 1 });
    return { deleted: complete };
  },
});
