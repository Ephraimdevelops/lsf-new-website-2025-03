import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireAuthenticatedUser } from './lib/auth';
import { requireCaseAccess, getActorRoleSet, canAccessCaseParticipant } from './lib/hakiYangu';
import { visiblePresence } from './lib/presence';
export const preferences = query({ args: {}, handler: async ctx => {
  const { user } = await requireAuthenticatedUser(ctx);
  return { sharePresence: user.sharePresence === true };
}});
export const setSharing = mutation({ args: { enabled: v.boolean() }, handler: async (ctx, args) => {
  const { user } = await requireAuthenticatedUser(ctx);
  await ctx.db.patch(user._id, { sharePresence: args.enabled });
  if (!args.enabled) {
    const sessions = await ctx.db.query("presence_sessions").withIndex("by_user_updated", q => q.eq("userId", user._id)).collect();
    for (const session of sessions) await ctx.db.delete(session._id);
  }
}});
export const heartbeat = mutation({ args: { sessionId: v.string(), surface: v.union(v.literal('web'), v.literal('mobile')), foreground: v.boolean(), sequence: v.optional(v.number()) }, handler: async (ctx, args) => {
  const { user } = await requireAuthenticatedUser(ctx);
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(args.sessionId)) throw new Error('Invalid presence session.');
  if (args.sequence !== undefined && (!Number.isSafeInteger(args.sequence) || args.sequence < 0)) throw new Error("Invalid presence sequence.");
  if (!user.sharePresence) return;
  const session = await ctx.db.query('presence_sessions').withIndex('by_user_session', q => q.eq('userId', user._id).eq('sessionId', args.sessionId)).unique();
  if (session && args.sequence !== undefined && session.sequence !== undefined && args.sequence <= session.sequence) return;
  const fields = { ...args, updatedAt: Date.now() };
  if (session) await ctx.db.patch(session._id, fields);
  else await ctx.db.insert('presence_sessions', { ...fields, userId: user._id });
  // Bound stored sessions across repeated installs and browser tabs.
  const sessions = await ctx.db.query('presence_sessions').withIndex('by_user_updated', q => q.eq('userId', user._id)).order('desc').collect();
  for (const old of sessions.slice(20)) await ctx.db.delete(old._id);
}});
export const forCase = query({ args: { caseId: v.id('cases'), refresh: v.optional(v.number()) }, handler: async (ctx, args) => {
  await requireCaseAccess(ctx, args.caseId);
  const participants = await ctx.db.query('case_participants').withIndex('by_case', q => q.eq('caseId', args.caseId)).collect();
  const result = [];
  for (const participant of participants) {
    const user = await ctx.db.get(participant.userId);
    if (!user || user.isDeleted) continue;
    const roles = await getActorRoleSet(ctx, participant.userId);
    if (participant.status !== 'active' || !await canAccessCaseParticipant(ctx, participant, roles)) continue;
    result.push({ userId: user._id, name: user.name, state: await visiblePresence(ctx, user) });
  }
  return result;
}});
