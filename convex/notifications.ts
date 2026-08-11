import { ConvexError, v } from "convex/values";
import { internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAuthenticatedUser } from "./lib/auth";
import { normalizeOptionalText, normalizeText } from "./lib/security";

const preferencesValidator = v.object({
  cases: v.boolean(),
  messages: v.boolean(),
  appointments: v.boolean(),
  documents: v.boolean(),
  service: v.boolean(),
});

const defaultPreferences = {
  cases: true,
  messages: true,
  appointments: true,
  documents: true,
  service: true,
};

const pushCopy: Record<string, { title: string; body: string }> = {
  "request.submitted": { title: "Haki Yangu update", body: "Your request was received." },
  "case.created": { title: "Haki Yangu update", body: "Your request is being reviewed." },
  "assignment.offered": { title: "Haki Yangu assignment", body: "You have a new assignment to review." },
  "assignment.accepted": { title: "Haki Yangu update", body: "There is an update on your support." },
  "assignment.ended": { title: "Haki Yangu assignment", body: "Your case access has changed." },
  "assignment.expired": { title: "Haki Yangu assignment", body: "An assignment offer has expired." },
  "case.status_changed": { title: "Haki Yangu update", body: "There is an update on your case." },
  "message.received": { title: "New Haki Yangu message", body: "You have a new message in Haki Yangu." },
  "appointment.created": { title: "Haki Yangu appointment", body: "There is an update about your appointment." },
  "appointment.changed": { title: "Haki Yangu appointment", body: "There is an update about your appointment." },
  "appointment.reminder": { title: "Haki Yangu appointment", body: "You have an upcoming appointment." },
  "appointment.requested": { title: "Haki Yangu appointment", body: "An appointment request needs attention." },
  "feedback.requested": { title: "Haki Yangu feedback", body: "Tell us about the support you received." },
  "case.review_requested": { title: "Haki Yangu review", body: "A case review request needs attention." },
  "case.review_closed": { title: "Haki Yangu update", body: "There is an update on your review request." },
};

const receiptTicketValidator = v.object({
  notificationId: v.id("notifications"),
  userId: v.id("users"),
  token: v.string(),
  ticketId: v.string(),
});

function notificationCategory(type: string) {
  if (type.startsWith("message.")) return "messages" as const;
  if (type.startsWith("appointment.")) return "appointments" as const;
  if (type.startsWith("document.")) return "documents" as const;
  if (type.startsWith("case.") || type.startsWith("assignment.") || type.startsWith("request.")) return "cases" as const;
  return "service" as const;
}

export const inbox = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const limit = Math.min(Math.max(Math.trunc(args.limit ?? 50), 1), 100);
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_created", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);
  },
});

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new ConvexError({ code: "NOT_FOUND", message: "Notification not found" });
    if (notification.userId !== user._id) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Notification access denied" });
    }
    if (!notification.readAt) await ctx.db.patch(notification._id, { readAt: Date.now() });
    return { success: true };
  },
});

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("readAt"), undefined))
      .collect();
    const now = Date.now();
    for (const notification of unread) await ctx.db.patch(notification._id, { readAt: now });
    return { updated: unread.length };
  },
});

export const getPreferences = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const existing = await ctx.db
      .query("notification_preferences")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    return existing ?? { userId: user._id, ...defaultPreferences, updatedAt: 0 };
  },
});

export const updatePreferences = mutation({
  args: { preferences: preferencesValidator },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const now = Date.now();
    const existing = await ctx.db
      .query("notification_preferences")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args.preferences, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("notification_preferences", {
      userId: user._id,
      ...args.preferences,
      updatedAt: now,
    });
  },
});

export const registerPushToken = mutation({
  args: {
    token: v.string(),
    platform: v.optional(v.string()),
    projectId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const token = normalizeText(args.token, "Push token", 300);
    if (!token.startsWith("ExponentPushToken[")) {
      throw new ConvexError({ code: "VALIDATION", message: "Unsupported push token" });
    }
    const now = Date.now();
    const existing = await ctx.db
      .query("push_subscriptions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    const patch = {
      userId: user._id,
      platform: normalizeOptionalText(args.platform, "Platform", 40),
      projectId: normalizeOptionalText(args.projectId, "Project ID", 80),
      enabled: true,
      updatedAt: now,
      lastSeenAt: now,
    };
    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }
    return await ctx.db.insert("push_subscriptions", {
      token,
      ...patch,
      createdAt: now,
    });
  },
});

export const disablePushToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const token = normalizeText(args.token, "Push token", 300);
    const existing = await ctx.db
      .query("push_subscriptions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    if (!existing) return { disabled: false };
    if (existing.userId !== user._id) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Push token access denied" });
    }
    await ctx.db.patch(existing._id, {
      enabled: false,
      updatedAt: Date.now(),
    });
    return { disabled: true };
  },
});

export const pushDeliveryPayload = internalQuery({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) return null;

    const category = notificationCategory(notification.type);
    const preferences = await ctx.db
      .query("notification_preferences")
      .withIndex("by_user", (q) => q.eq("userId", notification.userId))
      .unique();
    const mergedPreferences = preferences ?? defaultPreferences;
    if (!mergedPreferences[category]) {
      return { notification, subscriptions: [], skippedReason: "preference-disabled" };
    }

    const subscriptions = await ctx.db
      .query("push_subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", notification.userId))
      .filter((q) => q.eq(q.field("enabled"), true))
      .collect();
    return { notification, subscriptions, skippedReason: subscriptions.length ? undefined : "no-enabled-subscriptions" };
  },
});

export const recordPushAttempt = internalMutation({
  args: {
    notificationId: v.id("notifications"),
    userId: v.id("users"),
    token: v.string(),
    status: v.union(v.literal("sent"), v.literal("failed"), v.literal("skipped"), v.literal("receipt_ok")),
    error: v.optional(v.string()),
    ticketId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("push_delivery_attempts", {
      notificationId: args.notificationId,
      userId: args.userId,
      token: normalizeText(args.token, "Push token", 300),
      status: args.status,
      provider: "expo",
      error: normalizeOptionalText(args.error, "Push error", 500),
      ticketId: normalizeOptionalText(args.ticketId, "Push ticket", 120),
      createdAt: Date.now(),
    });
    if (args.status === "failed" && args.error && /DeviceNotRegistered|InvalidCredentials/.test(args.error)) {
      const subscription = await ctx.db
        .query("push_subscriptions")
        .withIndex("by_token", (q) => q.eq("token", args.token))
        .unique();
      if (subscription) await ctx.db.patch(subscription._id, { enabled: false, updatedAt: Date.now() });
    }
  },
});

export const deliverPushForNotification = internalAction({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const payload = await ctx.runQuery(internal.notifications.pushDeliveryPayload, {
      notificationId: args.notificationId,
    });
    if (!payload) return { sent: 0, skipped: 0, failed: 0 };

    const { notification, subscriptions, skippedReason } = payload;
    if (skippedReason) {
      await ctx.runMutation(internal.notifications.recordPushAttempt, {
        notificationId: notification._id,
        userId: notification.userId,
        token: "no-token",
        status: "skipped",
        error: skippedReason,
      });
      return { sent: 0, skipped: 1, failed: 0 };
    }

    const copy = pushCopy[notification.type] ?? { title: "Haki Yangu update", body: "You have a new Haki Yangu update." };
    let sent = 0;
    let failed = 0;
    const receiptTickets: Array<{
      notificationId: typeof notification._id;
      userId: typeof notification.userId;
      token: string;
      ticketId: string;
    }> = [];

    for (const subscription of subscriptions) {
      try {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: subscription.token,
            title: copy.title,
            body: copy.body,
            data: {
              notificationId: notification._id,
              type: notification.type,
              resourceType: notification.resourceType,
              resourceId: notification.resourceId,
            },
            sound: "default",
            priority: "default",
          }),
        });
        const result = await response.json() as {
          data?: { status?: string; id?: string; message?: string; details?: { error?: string } };
          errors?: Array<{ message?: string }>;
        };
        const error = result.data?.details?.error ?? result.data?.message ?? result.errors?.[0]?.message;
        if (!response.ok || result.data?.status === "error" || error) {
          failed += 1;
          await ctx.runMutation(internal.notifications.recordPushAttempt, {
            notificationId: notification._id,
            userId: notification.userId,
            token: subscription.token,
            status: "failed",
            error: error ?? `Expo push HTTP ${response.status}`,
          });
        } else {
          sent += 1;
          if (result.data?.id) {
            receiptTickets.push({
              notificationId: notification._id,
              userId: notification.userId,
              token: subscription.token,
              ticketId: result.data.id,
            });
          }
          await ctx.runMutation(internal.notifications.recordPushAttempt, {
            notificationId: notification._id,
            userId: notification.userId,
            token: subscription.token,
            status: "sent",
            ticketId: result.data?.id,
          });
        }
      } catch (error) {
        failed += 1;
        await ctx.runMutation(internal.notifications.recordPushAttempt, {
          notificationId: notification._id,
          userId: notification.userId,
          token: subscription.token,
          status: "failed",
          error: error instanceof Error ? error.message : "Expo push request failed",
        });
      }
    }

    if (receiptTickets.length > 0) {
      await ctx.scheduler.runAfter(15 * 60 * 1000, internal.notifications.checkExpoPushReceipts, {
        tickets: receiptTickets,
      });
    }

    return { sent, skipped: 0, failed };
  },
});

export const checkExpoPushReceipts = internalAction({
  args: { tickets: v.array(receiptTicketValidator) },
  handler: async (ctx, args) => {
    if (args.tickets.length === 0) return { ok: 0, failed: 0 };
    const response = await fetch("https://exp.host/--/api/v2/push/getReceipts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: args.tickets.map((ticket) => ticket.ticketId) }),
    });
    const result = await response.json() as {
      data?: Record<string, { status?: string; message?: string; details?: { error?: string } }>;
      errors?: Array<{ message?: string }>;
    };
    let ok = 0;
    let failed = 0;
    const topLevelError = result.errors?.[0]?.message;

    for (const ticket of args.tickets) {
      const receipt = result.data?.[ticket.ticketId];
      const error = topLevelError ?? receipt?.details?.error ?? receipt?.message;
      if (!response.ok || receipt?.status === "error" || error) {
        failed += 1;
        await ctx.runMutation(internal.notifications.recordPushAttempt, {
          notificationId: ticket.notificationId,
          userId: ticket.userId,
          token: ticket.token,
          status: "failed",
          ticketId: ticket.ticketId,
          error: error ?? `Expo receipt HTTP ${response.status}`,
        });
      } else if (receipt?.status === "ok") {
        ok += 1;
        await ctx.runMutation(internal.notifications.recordPushAttempt, {
          notificationId: ticket.notificationId,
          userId: ticket.userId,
          token: ticket.token,
          status: "receipt_ok",
          ticketId: ticket.ticketId,
        });
      }
    }
    return { ok, failed };
  },
});
