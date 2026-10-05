import type { Id } from "../_generated/dataModel";
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export async function getApprovedParalegalProfileByEmail(ctx: MutationCtx, email: string) {
  const normalizedEmail = email.toLowerCase();
  const profile = await ctx.db
    .query("paralegal_applications")
    .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
    .collect();

  return profile.find((candidate) => candidate.status === "approved" && candidate.isVerified === true && Boolean(candidate.reviewedBy) && Boolean(candidate.idDocumentStorageId || candidate.idDocumentUrl) && Boolean(candidate.certificateStorageId)) ?? null;
}

export function isParalegalReady(profile: Doc<"paralegal_applications"> | null | undefined) {
  return Boolean(profile?.status === "approved" && profile.isVerified && profile.reviewedBy
    && (profile.idDocumentStorageId || profile.idDocumentUrl) && profile.certificateStorageId
    && profile.onboardingCompleted && profile.ethicsAcceptedAt && profile.codeOfConductAcceptedAt
    && profile.safeguardingTrainingCompletedAt);
}

export async function markParalegalProfileJoined(
  ctx: MutationCtx,
  profileId: Id<"paralegal_applications">,
  now: number,
) {
  const profile = await ctx.db.get(profileId);
  if (!profile) return;
  await ctx.db.patch(profileId, {
    hasJoinedHakiYangu: true,
    approvedAt: profile.approvedAt ?? now,
  });
}

export async function activateParalegalRoleForUser(
  ctx: MutationCtx,
  args: {
    userId: Id<"users">;
    grantedBy?: Id<"users">;
    now: number;
  },
) {
  const user = await ctx.db.get(args.userId);
  if (!user || user.isDeleted) return;

  if (user.role === "user") {
    await ctx.db.patch(user._id, { role: "paralegal" });
  }

  if (!args.grantedBy) return;

  const activeAssignments = await ctx.db
    .query("role_assignments")
    .withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", "active"))
    .collect();

  if (activeAssignments.some((assignment) => assignment.role === "paralegal")) return;

  await ctx.db.insert("role_assignments", {
    userId: user._id,
    role: "paralegal",
    status: "active",
    grantedBy: args.grantedBy,
    grantedAt: args.now,
  });
}
