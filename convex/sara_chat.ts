import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get chat history for the current user
export const getMessages = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        // TODO: Re-enable strict auth after fixing Clerk session issue
        const userId = identity?.subject || "anonymous_dev_user";

        const messages = await ctx.db
            .query("sara_chats")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("asc") // Oldest first for chat UI
            .collect();

        return messages;
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
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        // TODO: Re-enable strict auth
        const userId = identity?.subject || "anonymous_dev_user";

        await ctx.db.insert("sara_chats", {
            userId,
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("sara_chats", {
            userId: args.userId,
            role: "assistant",
            content: "", // Start empty
            timestamp: Date.now(),
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
        toolCalls: v.optional(v.array(v.string()))
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.messageId, {
            content: args.content,
            ...(args.tokens && { tokens: args.tokens }),
            ...(args.toolCalls && { toolCalls: args.toolCalls }),
        });
    }
});

// Mutation to clear history
export const clearHistory = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        // TODO: Re-enable strict auth after fixing Clerk session issue  
        const userId = identity?.subject || "anonymous_dev_user";

        const messages = await ctx.db
            .query("sara_chats")
            .withIndex("by_user", (q) => q.eq("userId", userId))
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

// Submit feedback on a message
export const submitFeedback = mutation({
    args: {
        messageId: v.id("sara_chats"),
        rating: v.union(v.literal("positive"), v.literal("negative")),
        comment: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

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
