import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnyRole, requireAuthenticatedUser } from "./lib/auth";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

async function requireOrganisation(ctx: MutationCtx | QueryCtx, organizationId: Id<"justice_service_organizations">) {
  const actor = await requireAnyRole(ctx, ["provider_staff"]);
  if (!actor.assignments.some(item => item.role === "provider_staff" && item.organizationId === organizationId)) throw new Error("Organisation access denied.");
  const organization = await ctx.db.get(organizationId);
  if (!organization || organization.verificationStatus !== "verified" || organization.referralAgreementStatus !== "active") throw new Error("Invitations require a verified organisation and active referral agreement.");
  return { ...actor, organization };
}

export const create = mutation({
  args: { organizationId: v.id("justice_service_organizations"), email: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requireOrganisation(ctx, args.organizationId);
    const email = args.email.trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email === user.email.toLowerCase()) throw new Error("Enter another team member's email address.");
    const existing = await ctx.db.query("provider_invitations").withIndex("by_email_status", q => q.eq("email", email).eq("status", "pending")).collect();
    if (existing.some(item => item.organizationId === args.organizationId && item.expiresAt > Date.now())) throw new Error("An active invitation already exists.");
    const id = await ctx.db.insert("provider_invitations", { organizationId: args.organizationId, email, invitedBy: user._id, createdAt: Date.now(), expiresAt: Date.now() + 7 * 86400000, status: "pending" });
    await ctx.db.insert("audit_logs", { action: "provider.invitation_created", entityType: "provider_invitation", entityId: id, userId: user._id, timestamp: Date.now() });
    return id;
  },
});
export const listForOrganisation = query({
  args: { organizationId: v.id("justice_service_organizations") },
  handler: async (ctx, args) => {
    await requireOrganisation(ctx, args.organizationId);
    const invitations = await ctx.db.query("provider_invitations").withIndex("by_organization", q => q.eq("organizationId", args.organizationId)).order("desc").take(100);
    return Promise.all(invitations.map(async invitation => {
      const request = invitation.accessRequestId ? await ctx.db.get(invitation.accessRequestId) : null;
      // Expose only the status of the review attached to this invitation, never review notes.
      const linked = request?.invitationId === invitation._id && (!request.organizationId || request.organizationId === args.organizationId) && request.requestedRole === "provider_staff";
      const memberships = linked ? await ctx.db.query("role_assignments").withIndex("by_user_status", q => q.eq("userId", request.userId).eq("status", "active")).collect() : [];
      return { ...invitation, accessReviewStatus: linked ? request.status : null, hasActiveMembership: memberships.some(item => item.role === "provider_staff" && item.organizationId === args.organizationId) };
    }));
  },
});
export const mine = query({
  args: {},
  handler: async ctx => {
    const { identity } = await requireAuthenticatedUser(ctx);
    if (identity.emailVerified !== true || !identity.email) return [];
    const invitations = await ctx.db.query("provider_invitations").withIndex("by_email_status", q => q.eq("email", identity.email!.trim().toLowerCase()).eq("status", "pending")).collect();
    const result = await Promise.all(invitations.filter(item => item.expiresAt > Date.now()).map(async item => {
      const organization = await ctx.db.get(item.organizationId);
      return organization?.verificationStatus === "verified" && organization.referralAgreementStatus === "active" ? { id: item._id, organizationName: organization.name, expiresAt: item.expiresAt } : null;
    }));
    return result.filter(item => item !== null);
  },
});
export const respond = mutation({
  args: { id: v.id("provider_invitations"), accept: v.boolean() },
  handler: async (ctx, args) => {
    const { user, identity } = await requireAuthenticatedUser(ctx);
    const invitation = await ctx.db.get(args.id);
    if (identity.emailVerified !== true || !identity.email || !invitation || invitation.email !== identity.email.trim().toLowerCase()) throw new Error("Verify the invited email address on your account before responding.");
    if (invitation.status === "accepted" && args.accept) return invitation.accessRequestId;
    if (invitation.status !== "pending" || invitation.expiresAt <= Date.now()) throw new Error("Invitation is no longer available.");
    const organization = await ctx.db.get(invitation.organizationId);
    const inviter = await ctx.db.get(invitation.invitedBy);
    const memberships = await ctx.db.query("role_assignments").withIndex("by_user_status", q => q.eq("userId", invitation.invitedBy).eq("status", "active")).collect();
    if (!organization || organization.verificationStatus !== "verified" || organization.referralAgreementStatus !== "active" || !inviter || inviter.isDeleted || !memberships.some(item => item.role === "provider_staff" && item.organizationId === invitation.organizationId)) throw new Error("The inviting organisation or member is no longer eligible.");
    let accessRequestId;
    if (args.accept) {
      const pending = await ctx.db.query("access_requests").withIndex("by_user_status", q => q.eq("userId", user._id).eq("status", "pending")).first();
      if (pending) throw new Error("Complete your existing access review before accepting another invitation.");
      accessRequestId = await ctx.db.insert("access_requests", { userId: user._id, requestedRole: "provider_staff", organizationName: organization.name, organizationId: organization._id, invitationId: invitation._id, statement: "Accepted an organisation staff invitation. LSF must independently verify and approve this membership.", status: "pending", submittedAt: Date.now() });
    }
    await ctx.db.patch(invitation._id, { status: args.accept ? "accepted" : "declined", ...(accessRequestId ? { accessRequestId } : {}) });
    await ctx.db.insert("audit_logs", { action: args.accept ? "provider.invitation_accepted_for_review" : "provider.invitation_declined", entityType: "provider_invitation", entityId: invitation._id, userId: user._id, timestamp: Date.now() });
    return accessRequestId;
  },
});
export const cancel = mutation({
  args: { id: v.id("provider_invitations") },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.id);
    if (!invitation) throw new Error("Invitation not found.");
    const { user } = await requireOrganisation(ctx, invitation.organizationId);
    if (invitation.status !== "pending") throw new Error("Only a pending invitation can be cancelled.");
    await ctx.db.patch(invitation._id, { status: "cancelled" });
    await ctx.db.insert("audit_logs", { action: "provider.invitation_cancelled", entityType: "provider_invitation", entityId: invitation._id, userId: user._id, timestamp: Date.now() });
  },
});
