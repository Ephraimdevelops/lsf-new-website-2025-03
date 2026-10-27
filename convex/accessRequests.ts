import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireAnyRole, requireAuthenticatedUser } from './lib/auth';
import { paginationOptsValidator } from 'convex/server';
import { enforceRateLimit } from './lib/rateLimits';

const requestedRole = v.union(v.literal('staff'), v.literal('content_editor'), v.literal('provider_staff'), v.literal('stakeholder'), v.literal('donor'));

export const request = mutation({
  args: { requestedRole, organizationName: v.string(), statement: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const organizationName = args.organizationName.trim();
    const statement = args.statement.trim();
    if (organizationName.length < 2 || organizationName.length > 160 || statement.length < 20 || statement.length > 2000) {
      throw new Error('Enter your organisation and a 20–2000 character reason for requesting access.');
    }
    const pending = await ctx.db.query('access_requests')
      .withIndex('by_user_status', (q) => q.eq('userId', user._id).eq('status', 'pending')).first();
    if (pending) throw new Error('You already have an access request awaiting review.');
    await enforceRateLimit(ctx, `access-request:${user._id}`, 3, 60 * 60 * 1000);
    const id = await ctx.db.insert('access_requests', {
      userId: user._id, requestedRole: args.requestedRole, organizationName, statement,
      status: 'pending', submittedAt: Date.now(),
    });
    await ctx.db.insert('audit_logs', { action: 'access.requested', entityType: 'access_request', entityId: id, userId: user._id, timestamp: Date.now(), metadata: { requestedRole: args.requestedRole } });
    return id;
  },
});

export const myRequests = query({
  args: {}, handler: async (ctx) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const requests = await ctx.db.query('access_requests').withIndex('by_user_status', (q) => q.eq('userId', user._id)).order('desc').take(10);
    return requests.map(({ _id, requestedRole, organizationName, status, submittedAt, reviewedAt, decisionNote }) => ({ _id, requestedRole, organizationName, status, submittedAt, reviewedAt, decisionNote }));
  },
});

export const adminQueue = query({
  args: { status: v.optional(v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected'))) },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin"]);
    const requests = await ctx.db.query('access_requests')
      .withIndex('by_status_submitted', (q) => q.eq('status', args.status ?? 'pending')).order('desc').take(100);
    return await Promise.all(requests.map(async (request) => {
      const applicant = await ctx.db.get(request.userId);
      return { ...request, applicant: applicant ? { name: applicant.name, email: applicant.email } : null };
    }));
  },
});

export const adminQueuePage = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin"]);
    const result = await ctx.db.query('access_requests')
      .withIndex('by_status_submitted', (q) => q.eq('status', 'pending'))
      .order('desc').paginate(args.paginationOpts);
    return {
      ...result,
      page: await Promise.all(result.page.map(async (request) => {
        const applicant = await ctx.db.get(request.userId);
        return { ...request, applicant: applicant ? { name: applicant.name, email: applicant.email } : null };
      })),
    };
  },
});

export const adminRequestForReview = query({
  args: { id: v.id('access_requests') },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin"]);
    const request = await ctx.db.get(args.id);
    if (!request) return null;
    const applicant = await ctx.db.get(request.userId);
    const invitation = request.invitationId ? await ctx.db.get(request.invitationId) : null;
    const inviter = invitation ? await ctx.db.get(invitation.invitedBy) : null;
    const memberships = invitation ? await ctx.db.query('role_assignments')
      .withIndex('by_user_status', q => q.eq('userId', invitation.invitedBy).eq('status', 'active')).collect() : [];
    return { ...request, applicant: applicant ? { name: applicant.name, email: applicant.email } : null,
      invitationEvidence: invitation ? {
        invitedBy: invitation.invitedBy,
        inviterName: inviter?.name ?? 'Account unavailable',
        createdAt: invitation.createdAt,
        status: invitation.status,
        inviterStillMember: Boolean(inviter && !inviter.isDeleted && memberships.some(item => item.role === 'provider_staff' && item.organizationId === invitation.organizationId)),
      } : null,
    };
  },
});

export const decide = mutation({
  args: { requestId: v.id('access_requests'), decision: v.union(v.literal('approved'), v.literal('rejected')), decisionNote: v.string(), organizationId: v.optional(v.id('justice_service_organizations')) },
  handler: async (ctx, args) => {
    const { user: reviewer } = await requireAnyRole(ctx, ["admin"]);
    const request = await ctx.db.get(args.requestId);
    if (!request || request.status !== 'pending') throw new Error('This request is no longer awaiting review.');
    if (reviewer._id === request.userId) throw new Error('You cannot approve your own access.');
    if (request.invitationId) {
      const invitation = await ctx.db.get(request.invitationId);
      if (!invitation || invitation.accessRequestId !== request._id || invitation.status !== 'accepted') throw new Error('Invitation evidence is unavailable.');
      if (reviewer._id === invitation.invitedBy) throw new Error('A different administrator must review an invitation you created.');
      if (args.decision === 'approved') {
        const inviter = await ctx.db.get(invitation.invitedBy);
        const memberships = await ctx.db.query('role_assignments')
          .withIndex('by_user_status', q => q.eq('userId', invitation.invitedBy).eq('status', 'active')).collect();
        if (!inviter || inviter.isDeleted || !memberships.some(item => item.role === 'provider_staff' && item.organizationId === invitation.organizationId)) {
          throw new Error('The inviter no longer represents this organisation. Reject this request and obtain a fresh invitation.');
        }
      }
    }
    const applicant = await ctx.db.get(request.userId);
    if (!applicant || applicant.isDeleted) throw new Error('Applicant account is unavailable.');
    const note = args.decisionNote.trim();
    if (note.length < 10 || note.length > 2000) throw new Error('Record a decision reason of 10–2000 characters.');
    if (args.decision === 'approved') {
      if (!args.organizationId) throw new Error('Choose a verified organisation before granting access.');
      if (request.invitationId && args.organizationId !== request.organizationId) throw new Error('An invited membership must be approved for its original organisation.');
      const organization = await ctx.db.get(args.organizationId);
      if (!organization || organization.verificationStatus !== 'verified') throw new Error('The organisation must be verified.');
      if (request.requestedRole === 'staff' && organization.organizationType !== 'lsf') throw new Error('LSF staff must belong to a verified LSF organisation.');
      if (request.requestedRole === 'provider_staff' && organization.referralAgreementStatus !== 'active') throw new Error('Provider access requires an active referral agreement.');
      const active = await ctx.db.query('role_assignments')
        .withIndex('by_user_status', (q) => q.eq('userId', applicant._id).eq('status', 'active')).collect();
      const organizationId = args.organizationId as string;
      if (!active.some((assignment) => assignment.role === request.requestedRole && assignment.organizationId === organizationId)) {
        await ctx.db.insert('role_assignments', { userId: applicant._id, role: request.requestedRole, organizationId, status: 'active', grantedBy: reviewer._id, grantedAt: Date.now() });
      }
    }
    const now = Date.now();
    await ctx.db.patch(request._id, { status: args.decision, decisionNote: note, reviewedAt: now, reviewedBy: reviewer._id, organizationId: args.decision === 'approved' ? args.organizationId : undefined });
    await ctx.db.insert('audit_logs', { action: `access.${args.decision}`, entityType: 'access_request', entityId: request._id, userId: reviewer._id, timestamp: now, metadata: { applicantId: applicant._id, role: request.requestedRole, organizationId: args.organizationId } });
    return { success: true };
  },
});
