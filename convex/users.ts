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
                image: user.imageUrl,
                bio: user.bio,
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
            const patchData: any = {
                email: args.email,
                lastLogin: Date.now(),
            };
            // Only update name if it's currently placeholder "User" or empty
            if (existingUser.name === "User" || !existingUser.name) {
                patchData.name = args.name;
            }
            // Only update imageUrl if no custom storage image is set
            if (!existingUser.imageStorageId && args.imageUrl) {
                patchData.imageUrl = args.imageUrl;
            }

            await ctx.db.patch(existingUser._id, patchData);
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

// Make user admin by email (for initial admin setup)
export const makeAdmin = mutation({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();

        if (!user) {
            throw new Error(`User with email ${args.email} not found. Please sign up first.`);
        }

        await ctx.db.patch(user._id, { role: "admin" });
        return { success: true, message: `User ${args.email} is now an admin!` };
    },
});

// Update user profile
export const updateProfile = mutation({
    args: {
        name: v.string(),
        bio: v.optional(v.string()),
        imageStorageId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        const updateFields: any = {
            name: args.name,
            bio: args.bio,
        };

        // If a new image is uploaded, update storage ID and generate URL
        if (args.imageStorageId) {
            updateFields.imageStorageId = args.imageStorageId;
            updateFields.imageUrl = await ctx.storage.getUrl(args.imageStorageId);
        }

        await ctx.db.patch(user._id, updateFields);
        return { success: true };
    },
});

// Generate upload URL for profile pictures
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});
