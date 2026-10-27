import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { requireAnyRole, requireAuthenticatedUser } from "./lib/auth";

export const listConversations = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const { identity } = await requireAuthenticatedUser(ctx);
        return ctx.db.query("sara_conversations")
            .withIndex("by_user_updated", q => q.eq("userId", identity.subject))
            .order("desc").paginate(args.paginationOpts);
    },
});

export const getLegacyConversation = query({
    args: {},
    handler: async (ctx) => {
        const { identity } = await requireAuthenticatedUser(ctx);
        const message = await ctx.db.query("sara_chats")
            .withIndex("by_user_conversation", q => q.eq("userId", identity.subject).eq("conversationId", undefined))
            .order("desc").first();
        return message ? { updatedAt: message.timestamp } : null;
    },
});

export const getConversationMessages = query({
    args: { conversationId: v.optional(v.id("sara_conversations")), paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const { identity } = await requireAuthenticatedUser(ctx);
        if (args.conversationId) {
            const conversation = await ctx.db.get(args.conversationId);
            if (!conversation || conversation.userId !== identity.subject) throw new Error("Conversation not found.");
        }
        return ctx.db.query("sara_chats")
            .withIndex("by_user_conversation", q => q.eq("userId", identity.subject).eq("conversationId", args.conversationId))
            .order("desc").paginate(args.paginationOpts);
    },
});

export const createConversation = mutation({
    args: { title: v.string() },
    handler: async (ctx, args) => {
        const { identity } = await requireAuthenticatedUser(ctx);
        const title = args.title.trim().slice(0, 120);
        if (!title) throw new Error("A conversation title is required.");
        return ctx.db.insert("sara_conversations", { userId: identity.subject, title, updatedAt: Date.now() });
    },
});

export const checkConversationOwner = internalQuery({
    args: { conversationId: v.id("sara_conversations"), userId: v.string() },
    handler: async (ctx, args) => {
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation || conversation.userId !== args.userId) throw new Error("Conversation not found.");
        return true;
    },
});

export const getRecentHistoryInternal = internalQuery({
    args: { userId: v.string(), conversationId: v.optional(v.id("sara_conversations")) },
    handler: async (ctx, args) => {
        if (args.conversationId) {
            const conversation = await ctx.db.get(args.conversationId);
            if (!conversation || conversation.userId !== args.userId) throw new Error("Conversation not found.");
        }
        const messages = await ctx.db.query("sara_chats")
            .withIndex("by_user_conversation", (q) => q.eq("userId", args.userId).eq("conversationId", args.conversationId))
            .order("desc").take(26);
        return messages.reverse().filter((message) => message.content.trim())
            .map((message) => ({ role: message.role, content: message.content }));
    },
});

export const deleteConversation = mutation({
    args: { conversationId: v.id("sara_conversations") },
    handler: async (ctx, args) => {
        const { identity } = await requireAuthenticatedUser(ctx);
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation || conversation.userId !== identity.subject) throw new Error("Conversation not found.");
        const messages = await ctx.db.query("sara_chats")
            .withIndex("by_user_conversation", q => q.eq("userId", identity.subject).eq("conversationId", args.conversationId))
            .collect();
        for (const message of messages) await ctx.db.delete(message._id);
        await ctx.db.delete(args.conversationId);
    },
});

// Query to get chat history for the current user
export const getMessages = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            // If not logged in, return empty or throw. 
            // Better to return empty so the UI doesn't crash, but handles "Guest" state if needed.
            // But for SARA, we want strict user isolation.
            return [];
        }
        const userId = identity.subject;

        const messages = await ctx.db
            .query("sara_chats")
            .withIndex("by_user_conversation", (q) => q.eq("userId", userId).eq("conversationId", undefined))
            .order("asc") // Oldest first for chat UI
            .collect();

        return messages;
    },
});

export const getActivityEvents = query({
    args: {
        requestId: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { identity } = await requireAuthenticatedUser(ctx);
        const limit = Math.min(Math.max(Math.trunc(args.limit ?? 20), 1), 50);
        const events = args.requestId
            ? await ctx.db
                .query("saada_activity_events")
                .withIndex("by_user_request_time", (q) => q.eq("userId", identity.subject).eq("requestId", args.requestId!))
                .collect()
            : await ctx.db
                .query("saada_activity_events")
                .withIndex("by_user_time", (q) => q.eq("userId", identity.subject))
                .order("desc")
                .take(limit);
        return events.sort((a, b) => a.createdAt - b.createdAt).slice(-limit);
    },
});

// Internal mutation to save messages (called by the Action)
export const saveMessage = internalMutation({
    args: {
        userId: v.string(),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        toolCalls: v.optional(v.array(v.string())),
        tokens: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("sara_chats", {
            userId: args.userId,
            role: args.role,
            content: args.content,
            timestamp: Date.now(),
            toolCalls: args.toolCalls,
            tokens: args.tokens,
        });
    },
});

// Mutation for USER messages (called strictly from Frontend)
export const sendMessage = mutation({
    args: {
        content: v.string(),
        conversationId: v.optional(v.id("sara_conversations")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("You must be logged in to send messages.");
        }
        const userId = identity.subject;
        if (args.conversationId) {
            const conversation = await ctx.db.get(args.conversationId);
            if (!conversation || conversation.userId !== userId) throw new Error("Conversation not found.");
            await ctx.db.patch(args.conversationId, { updatedAt: Date.now() });
        }
        return await ctx.db.insert("sara_chats", {
            userId,
            conversationId: args.conversationId,
            role: "user",
            content: args.content,
            timestamp: Date.now(),
        });
    }
});

// Internal mutation to INITIALIZE a bot message 
export const createBotMessage = internalMutation({
    args: {
        userId: v.string(),
        conversationId: v.optional(v.id("sara_conversations")),
        clientRequestId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.conversationId) {
            const conversation = await ctx.db.get(args.conversationId);
            if (!conversation || conversation.userId !== args.userId) throw new Error("Conversation not found.");
        }
        return await ctx.db.insert("sara_chats", {
            userId: args.userId,
            conversationId: args.conversationId,
            role: "assistant",
            content: "", // Start empty
            timestamp: Date.now(),
            metadata: { clientRequestId: args.clientRequestId },
        });
    }
});

// Internal mutation to UPDATE a message token-by-token (or chunk)
export const updateMessage = internalMutation({
    args: {
        messageId: v.id("sara_chats"),
        content: v.string(),
        isDone: v.boolean(),
        tokens: v.optional(v.number()),
        toolCalls: v.optional(v.array(v.string())),
        questionAsked: v.optional(v.string()),
        clientRequestId: v.optional(v.string()),
        retrievedSources: v.optional(v.array(v.object({ documentId: v.string(), title: v.string(), publisher: v.optional(v.string()), versionLabel: v.optional(v.string()), sourceUrl: v.optional(v.string()) }))),
        failureCode: v.optional(v.literal("unavailable")),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.messageId);
        if (!existing || existing.role !== "assistant") throw new Error("Assistant message not found.");
        const previousMetadata = existing.metadata && typeof existing.metadata === "object" && !Array.isArray(existing.metadata) ? existing.metadata : {};
        await ctx.db.patch(args.messageId, {
            content: args.content,
            ...(args.tokens !== undefined && { tokens: args.tokens }),
            ...(args.toolCalls && { toolCalls: args.toolCalls }),
            ...(args.isDone ? { metadata: { ...previousMetadata, completedAt: Date.now(), questionAsked: args.questionAsked, clientRequestId: args.clientRequestId, retrievedSources: args.retrievedSources ?? [], failureCode: args.failureCode } } : {}),
        });
    }
});

// Mutation to clear history
export const clearHistory = mutation({
    args: {},
    handler: async (ctx) => {
        const { identity } = await requireAuthenticatedUser(ctx);
        const userId = identity.subject;

        const messages = await ctx.db
            .query("sara_chats")
            .withIndex("by_user_conversation", (q) => q.eq("userId", userId).eq("conversationId", undefined))
            .collect();

        for (const msg of messages) {
            await ctx.db.delete(msg._id);
        }
    }
});

// Admin Analytics
export const getAnalytics = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const allMessages = await ctx.db.query("sara_chats").collect();
        const allFeedback = await ctx.db.query("sara_feedback").collect();

        const totalMessages = allMessages.length;
        const totalConversations = new Set(allMessages.map(m => m.userId)).size;
        const toolUsage = allMessages.reduce((acc, curr) => {
            if (curr.toolCalls) {
                curr.toolCalls.forEach(tool => {
                    acc[tool] = (acc[tool] || 0) + 1;
                });
            }
            return acc;
        }, {} as Record<string, number>);

        // Feedback stats
        const positiveFeedback = allFeedback.filter(f => f.rating === "positive").length;
        const negativeFeedback = allFeedback.filter(f => f.rating === "negative").length;

        // Token/cost tracking
        const totalTokens = allMessages.reduce((sum, m) => sum + (m.tokens || 0), 0);
        const estimatedCost = (totalTokens / 1000) * 0.01; // Rough estimate for GPT-4o

        return {
            totalMessages,
            activeUsers: totalConversations,
            toolUsage,
            last24h: allMessages.filter(m => m.timestamp > Date.now() - 24 * 60 * 60 * 1000).length,
            feedback: {
                positive: positiveFeedback,
                negative: negativeFeedback,
                total: allFeedback.length
            },
            tokens: {
                total: totalTokens,
                estimatedCost: `$${estimatedCost.toFixed(2)}`
            }
        };
    }
});

export const getRiskEvents = query({
    args: {
        dispositionStatus: v.optional(v.union(
            v.literal("open"),
            v.literal("reviewed"),
            v.literal("escalated"),
            v.literal("case_follow_up"),
            v.literal("false_positive"),
        )),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);
        const events = args.dispositionStatus
            ? await ctx.db
                .query("saada_risk_events")
                .withIndex("by_disposition", (q) => q.eq("dispositionStatus", args.dispositionStatus))
                .order("desc").take(50)
            : await ctx.db.query("saada_risk_events").withIndex("by_created").order("desc").take(50);
        return events;
    },
});

export const getRiskEventForReview = query({
    args: { eventId: v.id("saada_risk_events") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);
        return ctx.db.get(args.eventId);
    },
});

export const getRiskEventsPage = query({
    args: {
        dispositionStatus: v.union(
            v.literal("open"), v.literal("reviewed"), v.literal("escalated"),
            v.literal("case_follow_up"), v.literal("false_positive"),
        ),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);
        const result = await ctx.db.query("saada_risk_events")
            .withIndex("by_disposition", (q) => q.eq("dispositionStatus", args.dispositionStatus))
            .order("desc").paginate(args.paginationOpts);
        return {
            ...result,
            page: result.page.map((event) => ({
                _id: event._id,
                eventType: event.eventType,
                source: event.source,
                dispositionStatus: event.dispositionStatus ?? "open",
                followUpStatus: event.followUpStatus,
                createdAt: event.createdAt,
            })),
        };
    },
});

export const resolveRiskEvent = mutation({
    args: {
        eventId: v.id("saada_risk_events"),
        dispositionStatus: v.union(
            v.literal("reviewed"),
            v.literal("escalated"),
            v.literal("case_follow_up"),
            v.literal("false_positive"),
        ),
        reviewNote: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
        const event = await ctx.db.get(args.eventId);
        if (!event) throw new Error("Saada risk event not found.");
        if (event.dispositionStatus && event.dispositionStatus !== "open") throw new Error("This risk event has already been reviewed.");
        const reviewNote = args.reviewNote?.trim() ?? "";
        if (reviewNote.length < 10 || reviewNote.length > 1000) throw new Error("Record a review reason of 10–1000 characters.");
        const reviewedAt = Date.now();
        await ctx.db.patch(args.eventId, {
            dispositionStatus: args.dispositionStatus,
            reviewedBy: user._id,
            reviewedAt,
            reviewNote,
            followUpStatus: args.dispositionStatus === "escalated" || args.dispositionStatus === "case_follow_up" ? "pending" : undefined,
        });
        await ctx.db.insert("audit_logs", {
            action: "saada.risk_event_reviewed",
            entityType: "saada_risk_event",
            entityId: args.eventId,
            userId: user._id,
            timestamp: reviewedAt,
            metadata: { dispositionStatus: args.dispositionStatus, eventType: event.eventType },
        });
        return { success: true };
    },
});

export const claimRiskFollowUp = mutation({
    args: { eventId: v.id("saada_risk_events") },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
        const event = await ctx.db.get(args.eventId);
        if (!event || event.dispositionStatus !== "escalated" && event.dispositionStatus !== "case_follow_up") throw new Error("Follow-up event not found.");
        if (event.followUpOwnerId || event.followUpStatus === "completed") throw new Error("This follow-up is already claimed or completed.");
        const now = Date.now();
        await ctx.db.patch(args.eventId, { followUpStatus: "in_progress", followUpOwnerId: user._id, followUpClaimedAt: now });
        await ctx.db.insert("audit_logs", { action: "saada.risk_follow_up_claimed", entityType: "saada_risk_event", entityId: args.eventId, userId: user._id, timestamp: now, metadata: { dispositionStatus: event.dispositionStatus } });
        return { success: true };
    },
});

export const completeRiskFollowUp = mutation({
    args: { eventId: v.id("saada_risk_events"), outcome: v.string() },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
        const event = await ctx.db.get(args.eventId);
        if (!event || event.followUpStatus !== "in_progress" || event.followUpOwnerId !== user._id) throw new Error("Only the assigned reviewer can complete this follow-up.");
        const outcome = args.outcome.trim();
        if (outcome.length < 10 || outcome.length > 2000) throw new Error("Record a follow-up outcome of 10–2000 characters.");
        const now = Date.now();
        await ctx.db.patch(args.eventId, { followUpStatus: "completed", followUpCompletedAt: now, followUpOutcome: outcome });
        await ctx.db.insert("audit_logs", { action: "saada.risk_follow_up_completed", entityType: "saada_risk_event", entityId: args.eventId, userId: user._id, timestamp: now, metadata: { dispositionStatus: event.dispositionStatus } });
        return { success: true };
    },
});

export const releaseRiskFollowUp = mutation({
    args: { eventId: v.id("saada_risk_events"), reason: v.string() },
    handler: async (ctx, args) => {
        const { user } = await requireAnyRole(ctx, ["admin"]);
        const event = await ctx.db.get(args.eventId);
        if (!event || event.followUpStatus !== "in_progress" || !event.followUpOwnerId) throw new Error("An active follow-up assignment is required.");
        const reason = args.reason.trim();
        if (reason.length < 10 || reason.length > 1000) throw new Error("Record why this assignment is being released.");
        const now = Date.now();
        await ctx.db.patch(args.eventId, { followUpStatus: "pending", followUpOwnerId: undefined, followUpClaimedAt: undefined });
        await ctx.db.insert("audit_logs", { action: "saada.risk_follow_up_released", entityType: "saada_risk_event", entityId: args.eventId, userId: user._id, timestamp: now, metadata: { reason, previousOwnerId: event.followUpOwnerId } });
        return { success: true };
    },
});

// Submit feedback on a message
export const submitFeedback = mutation({
    args: {
        messageId: v.id("sara_chats"),
        rating: v.union(v.literal("positive"), v.literal("negative")),
        comment: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { identity } = await requireAuthenticatedUser(ctx);

        const message = await ctx.db.get(args.messageId);
        if (!message || message.userId !== identity.subject) {
            throw new Error("Forbidden");
        }

        // Update the message with feedback
        await ctx.db.patch(args.messageId, {
            feedback: args.rating
        });

        // Also store in detailed feedback table
        await ctx.db.insert("sara_feedback", {
            messageId: args.messageId,
            userId: identity.subject,
            rating: args.rating,
            comment: args.comment,
            timestamp: Date.now(),
        });

        return { success: true };
    }
});

// Get feedback for admin review
export const getFeedbackList = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const feedback = await ctx.db
            .query("sara_feedback")
            .order("desc")
            .take(50);

        // Get the associated messages
        const feedbackWithMessages = await Promise.all(
            feedback.map(async (f) => {
                const message = await ctx.db.get(f.messageId);
                return {
                    ...f,
                    messageContent: message?.content || "[deleted]"
                };
            })
        );

        return feedbackWithMessages;
    }
});
