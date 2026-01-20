import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ==========================================
// ANALYTICS ENGINE
// Tracks user behavior for data-driven decisions
// ==========================================

/**
 * Event Types:
 * - page_view: User visited a page
 * - download: User downloaded a PDF/document
 * - search: User searched for content
 * - chat_topic: SARA conversation topic tracker
 * - click: User clicked a CTA or important element
 */

// Log an analytics event
export const logEvent = mutation({
    args: {
        type: v.union(
            v.literal("page_view"),
            v.literal("download"),
            v.literal("search"),
            v.literal("chat_topic"),
            v.literal("click")
        ),
        resourceId: v.optional(v.string()), // ID of the resource (page URL, document ID, etc.)
        resourceType: v.optional(v.string()), // 'publication', 'news', 'program', etc.
        meta: v.optional(v.any()), // Additional context (search query, topic category, etc.)
    },
    handler: async (ctx, args) => {
        // Get user identity (optional - can track anonymous users too)
        const identity = await ctx.auth.getUserIdentity();

        await ctx.db.insert("analytics_events", {
            type: args.type,
            resourceId: args.resourceId,
            resourceType: args.resourceType,
            meta: args.meta,
            userId: identity?.subject || "anonymous",
            timestamp: Date.now(),
            // Capture session info
            sessionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        });

        return { success: true };
    },
});

// Get page view analytics (Admin)
export const getPageViewStats = query({
    args: {
        days: v.optional(v.number()), // Default: 30 days
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (user?.role !== "admin") throw new Error("Forbidden");

        const daysAgo = args.days || 30;
        const cutoff = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);

        const events = await ctx.db
            .query("analytics_events")
            .withIndex("by_type", (q) => q.eq("type", "page_view"))
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        // Aggregate by page
        const pageStats: Record<string, number> = {};
        for (const event of events) {
            const page = event.resourceId || "unknown";
            pageStats[page] = (pageStats[page] || 0) + 1;
        }

        // Sort by count
        const sorted = Object.entries(pageStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20);

        return {
            totalViews: events.length,
            topPages: sorted.map(([page, count]) => ({ page, count })),
            periodDays: daysAgo,
        };
    },
});

// Get download analytics (Admin)
export const getDownloadStats = query({
    args: {
        days: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (user?.role !== "admin") throw new Error("Forbidden");

        const daysAgo = args.days || 30;
        const cutoff = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);

        const events = await ctx.db
            .query("analytics_events")
            .withIndex("by_type", (q) => q.eq("type", "download"))
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        // Aggregate by resource
        const downloadStats: Record<string, { count: number; name?: string }> = {};
        for (const event of events) {
            const resourceId = event.resourceId || "unknown";
            if (!downloadStats[resourceId]) {
                downloadStats[resourceId] = {
                    count: 0,
                    name: (event.meta as any)?.title || resourceId
                };
            }
            downloadStats[resourceId].count++;
        }

        // Sort by count
        const sorted = Object.entries(downloadStats)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 20);

        return {
            totalDownloads: events.length,
            topDownloads: sorted.map(([id, data]) => ({
                resourceId: id,
                title: data.name,
                count: data.count
            })),
            periodDays: daysAgo,
        };
    },
});

// Get SARA chat topic analytics (Admin)
export const getChatTopicStats = query({
    args: {
        days: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (user?.role !== "admin") throw new Error("Forbidden");

        const daysAgo = args.days || 30;
        const cutoff = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);

        const events = await ctx.db
            .query("analytics_events")
            .withIndex("by_type", (q) => q.eq("type", "chat_topic"))
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        // Aggregate by topic
        const topicStats: Record<string, number> = {};
        for (const event of events) {
            const topic = (event.meta as any)?.topic || event.resourceId || "general";
            topicStats[topic] = (topicStats[topic] || 0) + 1;
        }

        // Sort by count
        const sorted = Object.entries(topicStats)
            .sort(([, a], [, b]) => b - a);

        const total = events.length;

        return {
            totalChats: total,
            topicBreakdown: sorted.map(([topic, count]) => ({
                topic,
                count,
                percentage: total > 0 ? Math.round((count / total) * 100) : 0
            })),
            periodDays: daysAgo,
        };
    },
});

// Get daily trend data (Admin)
export const getDailyTrends = query({
    args: {
        days: v.optional(v.number()),
        eventType: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (user?.role !== "admin") throw new Error("Forbidden");

        const daysAgo = args.days || 14;
        const cutoff = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);

        // Get all events and filter
        const allEvents = await ctx.db
            .query("analytics_events")
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        // Filter by event type if specified
        const events = args.eventType
            ? allEvents.filter(e => e.type === args.eventType)
            : allEvents;

        // Aggregate by date
        const dailyStats: Record<string, number> = {};
        for (const event of events) {
            const date = event.sessionDate || new Date(event.timestamp).toISOString().split('T')[0];
            dailyStats[date] = (dailyStats[date] || 0) + 1;
        }

        // Fill in missing days with 0
        const result = [];
        for (let i = daysAgo - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            result.push({
                date: dateStr,
                count: dailyStats[dateStr] || 0,
            });
        }

        return result;
    },
});
