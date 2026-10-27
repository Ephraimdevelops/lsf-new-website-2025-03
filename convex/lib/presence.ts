import type { QueryCtx, MutationCtx } from '../_generated/server';
import type { Doc } from '../_generated/dataModel';
export function presenceState(sessions: Array<{ updatedAt: number; foreground: boolean }>, now: number) {
  if (sessions.some(s => s.foreground && now - s.updatedAt < 90_000 && s.updatedAt <= now)) return 'online' as const;
  if (sessions.some(s => now - s.updatedAt < 300_000 && s.updatedAt <= now)) return 'away' as const;
  return 'unavailable' as const;
}
export async function visiblePresence(ctx: QueryCtx | MutationCtx, user: Doc<'users'> | null) {
  if (!user || user.isDeleted || !user.sharePresence) return 'unavailable' as const;
  const sessions = await ctx.db.query('presence_sessions').withIndex('by_user_updated', q => q.eq('userId', user._id)).order('desc').take(20);
  return presenceState(sessions, Date.now());
}
