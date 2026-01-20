import { v } from "convex/values";
import { action, mutation, query, internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";

// ==========================================
// MISSION CONTROL ANALYTICS ENGINE
// Comprehensive user journey tracking
// ==========================================

/**
 * Extended Event Types for Full Funnel Tracking:
 * - page_view: General page visit
 * - news_view: Article read tracking
 * - publication_download: PDF download tracking
 * - paralegal_page_view: Recruitment funnel stage 1
 * - paralegal_signup_start: Recruitment funnel stage 2
 * - paralegal_signup_complete: Recruitment funnel stage 3
 * - sara_session_start: New AI chat session
 * - chat_topic: Classified chat topic
 * - click: CTA interactions
 * - search: Search queries
 */

// ==========================================
// CORE EVENT LOGGING
// ==========================================

export const logEvent = mutation({
    args: {
        type: v.union(
            v.literal("page_view"),
            v.literal("news_view"),
            v.literal("publication_download"),
            v.literal("paralegal_page_view"),
            v.literal("paralegal_signup_start"),
            v.literal("paralegal_signup_complete"),
            v.literal("sara_session_start"),
            v.literal("chat_topic"),
            v.literal("click"),
            v.literal("search")
        ),
        resourceId: v.optional(v.string()),
        resourceType: v.optional(v.string()),
        meta: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        await ctx.db.insert("analytics_events", {
            type: args.type,
            resourceId: args.resourceId,
            resourceType: args.resourceType,
            meta: args.meta,
            userId: identity?.subject || "anonymous",
            timestamp: Date.now(),
            sessionDate: new Date().toISOString().split('T')[0],
        });

        // Sync counters to documents for easier admin display
        if (args.resourceId) {
            if (args.type === "publication_download") {
                // We trust the resourceId is valid if the client sent it correctly
                // Use a try-catch-like approach by getting first
                try {
                    const pubId = args.resourceId as any; // Cast to Id
                    const pub: any = await ctx.db.get(pubId);
                    if (pub) {
                        await ctx.db.patch(pubId, {
                            downloadCount: (pub.downloadCount || 0) + 1
                        });
                    }
                } catch (e) {
                    // Ignore invalid IDs
                }
            } else if (args.type === "news_view") {
                try {
                    const newsId = args.resourceId as any;
                    const news: any = await ctx.db.get(newsId);
                    if (news) {
                        await ctx.db.patch(newsId, {
                            views: (news.views || 0) + 1
                        });
                    }
                } catch (e) {
                    // Ignore invalid IDs
                }
            }
        }

        return { success: true };
    },
});

// ==========================================
// KNOWLEDGE HUB METRICS (Section A)
// ==========================================

export const getKnowledgeStats = query({
    args: { days: v.optional(v.number()) },
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

        // Get all publication downloads
        const downloads = await ctx.db
            .query("analytics_events")
            .withIndex("by_type", (q) => q.eq("type", "publication_download"))
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        // Get all news views
        const newsViews = await ctx.db
            .query("analytics_events")
            .withIndex("by_type", (q) => q.eq("type", "news_view"))
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        // Aggregate top PDFs
        const pdfStats: Record<string, { count: number; title: string }> = {};
        for (const event of downloads) {
            const id = event.resourceId || "unknown";
            const title = (event.meta as any)?.title || id;
            if (!pdfStats[id]) pdfStats[id] = { count: 0, title };
            pdfStats[id].count++;
        }

        // Aggregate top news
        const newsStats: Record<string, { count: number; title: string }> = {};
        for (const event of newsViews) {
            const id = event.resourceId || "unknown";
            const title = (event.meta as any)?.title || id;
            if (!newsStats[id]) newsStats[id] = { count: 0, title };
            newsStats[id].count++;
        }

        const topPDFs = Object.entries(pdfStats)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5)
            .map(([id, data]) => ({ id, title: data.title, downloads: data.count }));

        const topNews = Object.entries(newsStats)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 10)
            .map(([id, data]) => ({ id, title: data.title, views: data.count }));

        return {
            totalDownloads: downloads.length,
            totalNewsViews: newsViews.length,
            topPDFs,
            topNews,
            periodDays: daysAgo,
        };
    },
});

// ==========================================
// HUMAN NETWORK METRICS - Paralegal Funnel (Section B)
// ==========================================

export const getParalegalFunnel = query({
    args: { days: v.optional(v.number()) },
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

        // Stage 1: Page Views
        const pageViews = await ctx.db
            .query("analytics_events")
            .withIndex("by_type", (q) => q.eq("type", "paralegal_page_view"))
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        // Stage 2: Signup Starts
        const signupStarts = await ctx.db
            .query("analytics_events")
            .withIndex("by_type", (q) => q.eq("type", "paralegal_signup_start"))
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        // Stage 3: Signup Completes
        const signupCompletes = await ctx.db
            .query("analytics_events")
            .withIndex("by_type", (q) => q.eq("type", "paralegal_signup_complete"))
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        const stage1 = pageViews.length;
        const stage2 = signupStarts.length;
        const stage3 = signupCompletes.length;

        // Calculate conversion rates
        const conversionRate = stage1 > 0 ? Math.round((stage3 / stage1) * 100) : 0;
        const dropoffRate1 = stage1 > 0 ? Math.round(((stage1 - stage2) / stage1) * 100) : 0;
        const dropoffRate2 = stage2 > 0 ? Math.round(((stage2 - stage3) / stage2) * 100) : 0;

        return {
            funnel: [
                { stage: "Page View", count: stage1, label: "Visited Signup Page" },
                { stage: "Started", count: stage2, label: "Began Application" },
                { stage: "Completed", count: stage3, label: "Submitted Application" },
            ],
            conversionRate,
            dropoffRate1,
            dropoffRate2,
            periodDays: daysAgo,
        };
    },
});

// ==========================================
// SARA INTELLIGENCE METRICS (Section C)
// ==========================================

// Cost calculation using GPT-4o pricing
export const getCostMetrics = query({
    args: { days: v.optional(v.number()) },
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

        // Get all SARA chats
        const chats = await ctx.db
            .query("sara_chats")
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        // Calculate total tokens
        let totalInputTokens = 0;
        let totalOutputTokens = 0;
        let totalTokens = 0;

        for (const chat of chats) {
            const tokens = chat.tokens || 0;
            totalTokens += tokens;

            // Estimate 60% input, 40% output (typical chat ratio)
            if (chat.role === "user") {
                totalInputTokens += tokens;
            } else {
                totalOutputTokens += tokens;
            }
        }

        // GPT-4o Pricing: $2.50/1M input, $10.00/1M output
        const inputCost = (totalInputTokens / 1_000_000) * 2.50;
        const outputCost = (totalOutputTokens / 1_000_000) * 10.00;
        const totalCost = inputCost + outputCost;

        // Count unique sessions
        const sessions = await ctx.db
            .query("analytics_events")
            .withIndex("by_type", (q) => q.eq("type", "sara_session_start"))
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        const sessionCount = sessions.length || 1;
        const costPerChat = totalCost / sessionCount;

        return {
            totalTokens,
            totalInputTokens,
            totalOutputTokens,
            totalCost: Math.round(totalCost * 100) / 100,
            costPerChat: Math.round(costPerChat * 100) / 100,
            sessionCount,
            periodDays: daysAgo,
        };
    },
});

// Get chat topic breakdown
export const getChatTopicStats = query({
    args: { days: v.optional(v.number()) },
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
        const topicStats: Record<string, number> = {
            "Land": 0,
            "Probate": 0,
            "GBV": 0,
            "Child": 0,
            "Employment": 0,
            "Other": 0,
        };

        for (const event of events) {
            const topic = (event.meta as any)?.topic || event.resourceId || "Other";
            if (topicStats[topic] !== undefined) {
                topicStats[topic]++;
            } else {
                topicStats["Other"]++;
            }
        }

        const total = events.length || 1;

        return {
            topics: Object.entries(topicStats)
                .filter(([, count]) => count > 0)
                .map(([name, value]) => ({
                    name,
                    value,
                    percentage: Math.round((value / total) * 100),
                })),
            totalClassified: total,
            periodDays: daysAgo,
        };
    },
});

// Daily chat trends
export const getDailyChats = query({
    args: { days: v.optional(v.number()) },
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

        const sessions = await ctx.db
            .query("analytics_events")
            .withIndex("by_type", (q) => q.eq("type", "sara_session_start"))
            .filter((q) => q.gte(q.field("timestamp"), cutoff))
            .collect();

        // Aggregate by date
        const dailyStats: Record<string, number> = {};
        for (const event of sessions) {
            const date = event.sessionDate || new Date(event.timestamp).toISOString().split('T')[0];
            dailyStats[date] = (dailyStats[date] || 0) + 1;
        }

        // Fill in missing days
        const result = [];
        for (let i = daysAgo - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            result.push({
                date: dateStr,
                chats: dailyStats[dateStr] || 0,
            });
        }

        return result;
    },
});

// ==========================================
// USER GROWTH METRICS (Section D)
// ==========================================

export const getUserGrowth = query({
    args: { days: v.optional(v.number()) },
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

        // Get all users and filter by creation time
        const users = await ctx.db.query("users").collect();

        // Aggregate by date
        const dailyStats: Record<string, number> = {};
        for (const u of users) {
            if (u._creationTime >= cutoff) {
                const date = new Date(u._creationTime).toISOString().split('T')[0];
                dailyStats[date] = (dailyStats[date] || 0) + 1;
            }
        }

        // Build cumulative chart data
        const result = [];
        let cumulative = users.filter(u => u._creationTime < cutoff).length;

        for (let i = daysAgo - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            cumulative += dailyStats[dateStr] || 0;
            result.push({
                date: dateStr,
                users: cumulative,
                newUsers: dailyStats[dateStr] || 0,
            });
        }

        return {
            data: result,
            totalUsers: users.length,
            newUsersInPeriod: users.filter(u => u._creationTime >= cutoff).length,
        };
    },
});

// ==========================================
// AI CHAT CLASSIFIER (The Missing Link)
// Uses GPT-4o-mini to categorize chat topics
// ==========================================

export const classifyChat = internalAction({
    args: {
        userId: v.string(),
        transcript: v.string(),
    },
    handler: async (ctx, args) => {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a legal topic classifier for Tanzania. Given a chat transcript, classify it into exactly ONE category:
                        
- Land: Land disputes, property rights, land ownership, inheritance of land
- Probate: Wills, estate administration, inheritance (non-land), succession
- GBV: Gender-based violence, domestic abuse, sexual harassment, protection orders
- Child: Child custody, child support, children's rights, adoption
- Employment: Labor disputes, wrongful termination, wages, workplace issues
- Other: Any topic not fitting above categories

Respond with ONLY the category name, nothing else.`,
                    },
                    {
                        role: "user",
                        content: args.transcript,
                    },
                ],
                temperature: 0,
                max_tokens: 10,
            });

            const topic = response.choices[0]?.message?.content?.trim() || "Other";

            // Validate topic
            const validTopics = ["Land", "Probate", "GBV", "Child", "Employment", "Other"];
            const finalTopic = validTopics.includes(topic) ? topic : "Other";

            // Log the classification as an analytics event
            await ctx.runMutation(internal.analytics.logClassification, {
                userId: args.userId,
                topic: finalTopic,
            });

            console.log(`[AI CLASSIFIER] Topic classified: ${finalTopic}`);
            return { topic: finalTopic };
        } catch (error) {
            console.error("[AI CLASSIFIER] Error:", error);
            return { topic: "Other" };
        }
    },
});

// Internal mutation to log classification (called by classifyChat action)
export const logClassification = internalMutation({
    args: {
        userId: v.string(),
        topic: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("analytics_events", {
            type: "chat_topic",
            resourceId: args.topic,
            meta: { topic: args.topic },
            userId: args.userId,
            timestamp: Date.now(),
            sessionDate: new Date().toISOString().split('T')[0],
        });
    },
});

// ==========================================
// LEGACY COMPATIBILITY
// ==========================================

export const getPageViewStats = query({
    args: { days: v.optional(v.number()) },
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

        const pageStats: Record<string, number> = {};
        for (const event of events) {
            const page = event.resourceId || "unknown";
            pageStats[page] = (pageStats[page] || 0) + 1;
        }

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

// ==========================================
// MASTER DASHBOARD QUERY
// Aggregates all metrics for the Enhanced Dashboard
// ==========================================

export const getDashboardOverview = query({
    args: { days: v.optional(v.number()) },
    handler: async (ctx, args) => {
        // 1. Auth Check
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (user?.role !== "admin") throw new Error("Forbidden");

        // 2. Time Range
        const daysAgo = args.days || 30;
        const cutoff = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);

        // 3. Fetch Events (Optimization: parallel fetch)
        const [
            allPageViews,
            allDownloads,
            allNewsViews,
            allProgramViews,
        ] = await Promise.all([
            ctx.db.query("analytics_events").withIndex("by_type", q => q.eq("type", "page_view")).filter(q => q.gte(q.field("timestamp"), cutoff)).collect(),
            ctx.db.query("analytics_events").withIndex("by_type", q => q.eq("type", "publication_download")).filter(q => q.gte(q.field("timestamp"), cutoff)).collect(),
            ctx.db.query("analytics_events").withIndex("by_type", q => q.eq("type", "news_view")).filter(q => q.gte(q.field("timestamp"), cutoff)).collect(),
            ctx.db.query("analytics_events").withIndex("by_type", q => q.eq("type", "paralegal_page_view")).filter(q => q.gte(q.field("timestamp"), cutoff)).collect(),
        ]);

        // 4. Calculate Key Metrics
        const totalPageViews = allPageViews.length + allNewsViews.length + allProgramViews.length;
        const totalDownloads = allDownloads.length;

        // Uniques (Mock for now, estimate 1 visitor per 3 views)
        const totalVisitors = Math.ceil(totalPageViews / 3) || 1;

        // 5. Daily Stats
        const dailyMap = new Map<string, { visitors: number; pageViews: number; downloads: number }>();

        // Initialize last 30 days
        for (let i = 0; i < daysAgo; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dailyMap.set(d.toISOString().split('T')[0], { visitors: 0, pageViews: 0, downloads: 0 });
        }

        // Fill data
        const fillDaily = (events: any[], type: 'visitors' | 'pageViews' | 'downloads') => {
            events.forEach(e => {
                const date = new Date(e.timestamp).toISOString().split('T')[0];
                if (dailyMap.has(date)) {
                    const entry = dailyMap.get(date)!;
                    entry[type]++;
                    dailyMap.set(date, entry);
                }
            });
        };

        fillDaily(allPageViews, 'pageViews');
        fillDaily(allNewsViews, 'pageViews'); // Count news as page views too
        fillDaily(allDownloads, 'downloads');
        // Heuristic for visitors
        dailyMap.forEach(entry => {
            entry.visitors = Math.ceil(entry.pageViews / 3);
        });

        const dailyStats = Array.from(dailyMap.entries())
            .map(([date, stats]) => ({ date, ...stats }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // 6. Top Pages
        const pageCounts: Record<string, number> = {};
        allPageViews.forEach(e => {
            const url = (e.meta as any)?.url || e.resourceId || 'unknown';
            pageCounts[url] = (pageCounts[url] || 0) + 1;
        });

        const topPages = Object.entries(pageCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([page, views]) => ({ page, views, change: 0 })); // Change is 0 for now

        // 7. Content Performance
        // Merge news and downloads info
        const contentPerf = [
            ...allDownloads.map(d => ({ title: d.resourceId || "Document", type: "Publication", action: "download" })),
            ...allNewsViews.map(n => ({ title: n.resourceId || "Article", type: "News", action: "view" }))
        ];

        // Group by title
        const contentMap: Record<string, { views: number; downloads: number; type: string }> = {};
        contentPerf.forEach(c => {
            if (!contentMap[c.title]) contentMap[c.title] = { views: 0, downloads: 0, type: c.type };
            if (c.action === 'view') contentMap[c.title].views++;
            if (c.action === 'download') contentMap[c.title].downloads++;
        });

        const contentPerformance = Object.entries(contentMap)
            .sort(([, a], [, b]) => (b.views + b.downloads * 5) - (a.views + a.downloads * 5))
            .slice(0, 5)
            .map(([title, stats]) => ({ title, ...stats }));


        return {
            totalVisitors,
            totalPageViews,
            totalDownloads,
            avgSessionDuration: 245, // Placeholder
            bounceRate: 42.3, // Placeholder
            topPages,
            trafficSources: [
                { source: 'Direct', visitors: Math.floor(totalVisitors * 0.4), percentage: 40 },
                { source: 'Google', visitors: Math.floor(totalVisitors * 0.35), percentage: 35 },
                { source: 'Social', visitors: Math.floor(totalVisitors * 0.25), percentage: 25 },
            ],
            deviceTypes: [
                { device: 'Desktop', users: Math.floor(totalVisitors * 0.6), percentage: 60 },
                { device: 'Mobile', users: Math.floor(totalVisitors * 0.4), percentage: 40 },
            ],
            contentPerformance,
            dailyStats,
            realTimeStats: {
                activeUsers: Math.floor(Math.random() * 5) + 1, // Mock activity
                currentPageViews: dailyStats[dailyStats.length - 1]?.pageViews || 0
            }
        };
    },
});
