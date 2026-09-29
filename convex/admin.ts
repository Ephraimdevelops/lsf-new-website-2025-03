import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";

// Get dashboard analytics
export const getAnalytics = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

        // Parallelize queries for performance
        const [
            usersCount,
            news,
            publications,
            programs,
            opportunitiesCount
        ] = await Promise.all([
            ctx.db.query("users").collect().then(res => res.length),
            ctx.db.query("news").order("desc").take(5),
            ctx.db.query("publications").order("desc").take(5),
            ctx.db.query("programs").collect(),
            ctx.db.query("opportunities").collect().then(res => res.length),
        ]);

        const allPageViews = await ctx.db.query("analytics_events").withIndex("by_type", q => q.eq("type", "page_view")).collect();
        const allDownloads = await ctx.db.query("analytics_events").withIndex("by_type", q => q.eq("type", "publication_download")).collect();

        const totalNews = await ctx.db.query("news").collect().then(res => res.length);
        const totalPublications = await ctx.db.query("publications").collect().then(res => res.length);
        const totalPrograms = programs.length;

        // Accurate visitor data from events
        const uniqueVisitors = new Set<string>();
        allPageViews.forEach(event => {
            if (event.visitorId) uniqueVisitors.add(`vid_${event.visitorId}`);
        });
        const totalUniqueVisitors = uniqueVisitors.size || 1;

        // Daily traffic (last 14 days)
        const dailyMap = new Map<string, number>();
        const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
        for (let i = 0; i < 14; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (13 - i));
            dailyMap.set(d.toISOString().split('T')[0], 0);
        }

        allPageViews.forEach(e => {
            if (e.timestamp >= fourteenDaysAgo) {
                const date = new Date(e.timestamp).toISOString().split('T')[0];
                if (dailyMap.has(date)) {
                    dailyMap.set(date, dailyMap.get(date)! + 1);
                }
            }
        });

        const visitors = {
            total: totalUniqueVisitors,
            growth: 12.5, // Keep static or calculate real MoM
            daily: Array.from(dailyMap.entries()).map(([date, views]) => ({
                date: new Date(date).toISOString(),
                visitors: Math.ceil(views / 3) || 1 // Heuristic mapping views to visitors
            }))
        };

        // Calculate top downloads from real events
        const downloadMap: Record<string, number> = {};
        allDownloads.forEach(e => {
            const title = (e.meta as any)?.title || 'Document';
            downloadMap[title] = (downloadMap[title] || 0) + 1;
        });

        const downloads = Object.entries(downloadMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({
                name: name.substring(0, 20) + (name.length > 20 ? "..." : ""),
                downloads: count
            }));

        // Views data map by broad category
        let homeViews = 0, newsViews = 0, pubViews = 0, progViews = 0, aboutViews = 0;
        allPageViews.forEach(e => {
            const path = e.resourceId || '';
            if (path === '/') homeViews++;
            else if (path.startsWith('/news')) newsViews++;
            else if (path.startsWith('/publications')) pubViews++;
            else if (path.startsWith('/programs')) progViews++;
            else if (path.startsWith('/about')) aboutViews++;
        });

        const views = [
            { name: "Home", views: homeViews },
            { name: "News", views: newsViews },
            { name: "Publications", views: pubViews },
            { name: "Programs", views: progViews },
            { name: "About", views: aboutViews }
        ].sort((a, b) => b.views - a.views);

        const countPath = (startsWith: string) => allPageViews.filter((event) => (event.resourceId || "").startsWith(startsWith)).length;
        const newsReads = countPath("/news/");
        const newsViewsTotal = countPath("/news");
        const publicationViewsTotal = countPath("/publications");
        const opportunityViewsTotal = countPath("/opportunities");
        const paralegalViews = countPath("/paralegals") + countPath("/haki-yangu");
        const saadaSessions = allPageViews.filter((event) => ["/sara", "/sara-ai"].includes(event.resourceId || "")).length;
        const percentage = (part: number, total: number) => total ? Math.round((part / total) * 100) : 0;

        // Real top pages
        const pageCounts: Record<string, number> = {};
        allPageViews.forEach(e => {
            const url = e.resourceId || 'unknown';
            pageCounts[url] = (pageCounts[url] || 0) + 1;
        });

        const topPages = Object.entries(pageCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([page, count]) => ({ page, views: count }));

        // Combine recent activity
        const recentActivity = [
            ...news.map(n => ({
                id: n._id,
                type: "news",
                action: "Published",
                description: n.title,
                timestamp: n.date
            })),
            ...publications.map(p => ({
                id: p._id,
                type: "publication",
                action: "Uploaded",
                description: p.title,
                timestamp: p.publishedDate
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);

        return {
            visitors,
            content: {
                totalNews,
                totalPublications,
                totalPrograms
            },
            engagement: {
                downloads,
                views: views.filter(v => v.views > 0).length ? views : [{ name: "No data", views: 0 }],
                topPages: topPages.length ? topPages : [{ page: "No data", views: 0 }]
            },
            detailedMetrics: {
                news: {
                    views: newsViewsTotal,
                    reads: newsReads,
                    clicks: newsViewsTotal,
                    conversionRate: percentage(newsReads, newsViewsTotal),
                },
                opportunities: {
                    views: opportunityViewsTotal,
                    applies: 0,
                    conversionRate: 0,
                },
                paralegalFunnel: {
                    stage1Views: paralegalViews,
                    stage2Starts: 0,
                    stage3Completes: 0,
                    overallConversion: 0,
                },
                stories: {
                    views: countPath("/success-stories"),
                },
                donations: {
                    clicks: 0,
                },
                saadaAI: {
                    sessions: saadaSessions,
                },
            },
            recentActivity
        };
    },
});

// Get all users
export const getUsers = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

        return await ctx.db.query("users").order("desc").collect();
    },
});

export const getUsersWithAccess = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);
        const users = await ctx.db.query("users").order("desc").take(300);
        return await Promise.all(users.map(async (user) => {
            const assignments = await ctx.db.query("role_assignments")
                .withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", "active"))
                .collect();
            return { _id: user._id, name: user.name, email: user.email, role: user.role,
                roles: [...new Set([user.role, ...assignments.map((item) => item.role)])],
                hasAssignments: assignments.some((item) => item.role !== "user"), isDeleted: user.isDeleted ?? false };
        }));
    },
});

// Role changes are limited to an authenticated administrator and written to the audit trail.
// Admin and safeguarding grants need a separate multi-review workflow.
export const updateUserRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.literal("user"),
    },
    handler: async (ctx, args) => {
        const { user: actor } = await requireAnyRole(ctx, ["admin"]);
        if (actor._id === args.userId) throw new Error("You cannot change your own role.");
        const target = await ctx.db.get(args.userId);
        if (!target || target.isDeleted) throw new Error("User is not available.");
        const activeAssignments = await ctx.db.query("role_assignments")
            .withIndex("by_user_status", (q) => q.eq("userId", args.userId).eq("status", "active"))
            .collect();
        if (activeAssignments.some((item) => item.role !== "user")) {
            throw new Error("Assigned professional roles require a supervised change process.");
        }
        if (target.role === "admin" || target.role === "safeguarding_officer" || target.role === "paralegal") {
            throw new Error("Sensitive roles require a separate supervised review.");
        }
        if (target.role === args.role) return { success: true };
        const previousRole = target.role;
        await ctx.db.patch(args.userId, { role: args.role });
        await ctx.db.insert("audit_logs", {
            action: "user.role_changed",
            entityType: "user",
            entityId: args.userId,
            userId: actor._id,
            timestamp: Date.now(),
            metadata: { previousRole, newRole: args.role },
        });
        return { success: true };
    },
});

export const listRoleAudit = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);
        return await ctx.db.query("audit_logs")
            .withIndex("by_action", (q) => q.eq("action", "user.role_changed"))
            .order("desc").take(50);
    },
});

export const listPlatformAudit = query({
    args: { actionPrefix: v.optional(v.string()), limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "supervisor"]);
        const limit = Math.min(Math.max(Math.trunc(args.limit ?? 100), 1), 250);
        const prefix = args.actionPrefix?.trim().toLowerCase();
        const rows = await ctx.db.query("audit_logs").order("desc").take(prefix ? 1000 : limit);
        const filtered = prefix ? rows.filter((row) => row.action.toLowerCase().startsWith(prefix)).slice(0, limit) : rows;
        return await Promise.all(filtered.map(async (row) => {
            const actorId = row.userId ? ctx.db.normalizeId("users", row.userId) : null;
            const actor = actorId ? await ctx.db.get(actorId) : null;
            const metadata = row.metadata as { changedFieldNames?: unknown } | undefined;
            const changedFieldNames = Array.isArray(metadata?.changedFieldNames)
                ? metadata.changedFieldNames.filter((item: unknown): item is string => typeof item === "string").slice(0, 20)
                : [];
            return {
                _id: row._id,
                action: row.action,
                entityType: row.entityType,
                entityId: row.entityId,
                timestamp: row.timestamp,
                actor: actor ? { name: actor.name, email: actor.email } : null,
                changedFieldNames,
            };
        }));
    },
});
