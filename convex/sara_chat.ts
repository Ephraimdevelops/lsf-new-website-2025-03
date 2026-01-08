import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get chat history for the current user
export const getMessages = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const messages = await ctx.db
            .query("sara_chats")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
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

// Mutation to clear history
export const clearHistory = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const messages = await ctx.db
            .query("sara_chats")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
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
        // In a real app, check for admin role here
        // const identity = await ctx.auth.getUserIdentity();
        // if (!identity || identity.role !== "admin") ...

        const allMessages = await ctx.db.query("sara_chats").collect();

        const totalMessages = allMessages.length;
        const totalConversations = new Set(allMessages.map(m => m.userId)).size; // Approx as unique users
        const toolUsage = allMessages.reduce((acc, curr) => {
            if (curr.toolCalls) {
                curr.toolCalls.forEach(tool => {
                    acc[tool] = (acc[tool] || 0) + 1;
                });
            }
            return acc;
        }, {} as Record<string, number>);

        return {
            totalMessages,
            activeUsers: totalConversations,
            toolUsage,
            last24h: allMessages.filter(m => m.timestamp > Date.now() - 24 * 60 * 60 * 1000).length
        };
    }
});
