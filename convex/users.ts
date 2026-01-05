import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user dashboard data
export const getDashboardData = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        // Mock tasks for now as we don't have a tasks table
        const tasks = [
            {
                id: "1",
                title: "Review Policy Draft",
                description: "Review the new legal aid policy draft.",
                status: "Pending",
                dueDate: "2023-12-01"
            },
            {
                id: "2",
                title: "Update Case Files",
                description: "Ensure all case files are digitized.",
                status: "In Progress",
                dueDate: "2023-12-05"
            }
        ];

        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            tasks
        };
    },
});

// Sync user from Clerk
export const syncUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        clerkId: v.string(),
        imageUrl: v.optional(v.string()),
        role: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (existingUser) {
            await ctx.db.patch(existingUser._id, {
                name: args.name,
                email: args.email,
                imageUrl: args.imageUrl,
                lastLogin: Date.now(),
            });
            return existingUser._id;
        }

        const role = (args.role as "admin" | "staff" | "paralegal" | "stakeholder" | "user") || "user";

        return await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            clerkId: args.clerkId,
            imageUrl: args.imageUrl,
            role: role,
            lastLogin: Date.now(),
        });
    },
});

// Get current user
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();
    },
});

// Alias for compatibility
export const current = getCurrentUser;
