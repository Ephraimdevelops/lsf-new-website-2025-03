import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { getActiveRoles, requireAnyRole, requireAuthenticatedUser } from "./lib/auth";
import {
    activateParalegalRoleForUser,
    getApprovedParalegalProfileByEmail,
    markParalegalProfileJoined,
} from "./lib/paralegalAccess";

// Get user dashboard data
export const getDashboardData = query({
    args: {},
    handler: async (ctx) => {
        const { user } = await requireAuthenticatedUser(ctx);

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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity || identity.subject !== args.clerkId) {
            throw new Error("Unauthorized");
        }
        const now = Date.now();
        const approvedParalegalProfile = await getApprovedParalegalProfileByEmail(ctx, args.email);

        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (existingUser) {
            if (existingUser.isDeleted) {
                throw new Error("This Haki Yangu profile has been deactivated. Contact LSF support to restore access.");
            }
            const patchData: {
                email: string;
                lastLogin: number;
                name?: string;
                imageUrl?: string;
            } = {
                email: args.email,
                lastLogin: now,
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
            if (approvedParalegalProfile) {
                await activateParalegalRoleForUser(ctx, { userId: existingUser._id, now });
                await markParalegalProfileJoined(ctx, approvedParalegalProfile._id, now);
            }
            return existingUser._id;
        }

        const userId = await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            clerkId: identity.subject,
            imageUrl: args.imageUrl,
            // Role grants are managed by an authorized platform workflow only.
            role: approvedParalegalProfile ? "paralegal" : "user",
            lastLogin: now,
        });
        if (approvedParalegalProfile) {
            await markParalegalProfileJoined(ctx, approvedParalegalProfile._id, now);
        }
        return userId;
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
            .filter((q) => q.neq(q.field("isDeleted"), true))
            .first();
    },
});

// Alias for compatibility
export const current = getCurrentUser;

export const currentAccess = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!user || user.isDeleted) return null;
        return { user, roles: await getActiveRoles(ctx, user._id) };
    },
});

export const getRoleByClerkIdInternal = internalQuery({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (!user || user.isDeleted) return null;
        return user.role;
    },
});

// Make user admin by email (for initial admin setup)
export const makeAdmin = mutation({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);

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
        const { user } = await requireAuthenticatedUser(ctx);

        const updateFields: {
            name: string;
            bio?: string;
            imageStorageId?: string;
            imageUrl?: string;
        } = {
            name: args.name,
            bio: args.bio,
        };

        // If a new image is uploaded, update storage ID and generate URL
        if (args.imageStorageId) {
            const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
            if (!imageUrl) throw new Error("Uploaded image not found");
            updateFields.imageStorageId = args.imageStorageId;
            updateFields.imageUrl = imageUrl;
        }

        await ctx.db.patch(user._id, updateFields);
        return { success: true };
    },
});

export const deactivateMyProfile = mutation({
    args: {},
    handler: async (ctx) => {
        const { user } = await requireAuthenticatedUser(ctx);
        const roles = await getActiveRoles(ctx, user._id);
        if (roles.some((role) => ["admin", "staff", "supervisor"].includes(role))) {
            throw new Error("Staff and admin accounts must be deactivated by another administrator.");
        }

        const now = Date.now();
        const activeAssignments = await ctx.db
            .query("role_assignments")
            .withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", "active"))
            .collect();
        await Promise.all(activeAssignments.map((assignment) =>
            ctx.db.patch(assignment._id, { status: "revoked", revokedAt: now }),
        ));
        await ctx.db.patch(user._id, {
            isDeleted: true,
            deletedAt: now,
            lastLogin: now,
        });
        return { success: true };
    },
});

// Generate upload URL for profile pictures
export const generateUploadUrl = mutation(async (ctx) => {
    await requireAuthenticatedUser(ctx);
    return await ctx.storage.generateUploadUrl();
});
