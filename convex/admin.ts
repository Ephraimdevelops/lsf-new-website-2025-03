import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get dashboard analytics
export const getAnalytics = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // In a real app, verify admin role here

        const usersCount = (await ctx.db.query("users").collect()).length;
        const newsCount = (await ctx.db.query("news").collect()).length;
        const publicationsCount = (await ctx.db.query("publications").collect()).length;
        const opportunitiesCount = (await ctx.db.query("opportunities").collect()).length;

        return {
            users: usersCount,
            news: newsCount,
            publications: publicationsCount,
            opportunities: opportunitiesCount,
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
