import { query } from "./_generated/server";
import { v } from "convex/values";

// Debug: Get user by email
export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();
        return user;
    },
});

// Debug: List all admins
export const listAdmins = query({
    args: {},
    handler: async (ctx) => {
        const admins = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "admin"))
            .collect();

        return admins.map(u => ({ name: u.name, email: u.email, role: u.role, clerkId: u.clerkId }));
    },
});

// Debug: Check current session identity vs database user
export const checkCurrentSession = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { error: "Not logged in (no identity)" };
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        return {
            identitySubject: identity.subject,
            identityEmail: identity.email,
            userFoundInDb: !!user,
            userRole: user?.role || "N/A",
            userClerkId: user?.clerkId || "N/A",
            match: user?.clerkId === identity.subject,
        };
    },
});
