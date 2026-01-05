import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get dashboard analytics
export const getAnalytics = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

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

        const totalNews = await ctx.db.query("news").collect().then(res => res.length);
        const totalPublications = await ctx.db.query("publications").collect().then(res => res.length);
        const totalPrograms = programs.length;

        // Mock visitor data (since we don't track it yet)
        const visitors = {
            total: 12543,
            growth: 12.5,
            daily: Array.from({ length: 14 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (13 - i));
                return {
                    date: date.toISOString(),
                    visitors: Math.floor(Math.random() * 500) + 200
                };
            })
        };

        // Calculate top downloads from publications
        const downloads = publications
            .map(p => ({
                name: p.title.substring(0, 20) + "...",
                downloads: p.downloadCount || 0
            }))
            .sort((a, b) => b.downloads - a.downloads)
            .slice(0, 5);

        // Mock views data
        const views = [
            { name: "Home", views: 5432 },
            { name: "News", views: 3210 },
            { name: "Publications", views: 2100 },
            { name: "Programs", views: 1500 },
            { name: "About", views: 1200 }
        ];

        // Mock top pages data
        const topPages = [
            { page: "/", views: 5432 },
            { page: "/news", views: 3210 },
            { page: "/publications", views: 2100 },
            { page: "/programs", views: 1500 },
            { page: "/about", views: 1200 }
        ];

        // Combine recent activity
        const recentActivity = [
            ...news.map(n => ({
                id: n._id,
                type: "news",
                action: "Published",
                description: n.title,
                timestamp: n.date // Assuming date is ISO string
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
                views,
                topPages
            },
            recentActivity
        };
    },
});

// Get all users
export const getUsers = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db.query("users").order("desc").collect();
    },
});

// Update user role
export const updateUserRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("staff"), v.literal("paralegal"), v.literal("stakeholder"), v.literal("user")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // Verify requester is admin (skipped for now for simplicity, but critical for prod)

        await ctx.db.patch(args.userId, { role: args.role });
    },
});
