import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { internal } from "../_generated/api";

export type NotificationInput = {
  userId: Id<"users">;
  type: string;
  titleKey: string;
  bodyKey: string;
  resourceType?: string;
  resourceId?: string;
};

export async function createNotification(ctx: MutationCtx, input: NotificationInput) {
  const notificationId = await ctx.db.insert("notifications", {
    ...input,
    createdAt: Date.now(),
  });
  await ctx.scheduler.runAfter(0, internal.notifications.deliverPushForNotification, { notificationId });
  return notificationId;
}
