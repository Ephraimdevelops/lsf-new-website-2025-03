import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        // Check if we've already stored this identity before.
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (user !== null) {
            // If we've seen this identity before but the name has changed, patch the value.
            if (user.name !== identity.name || user.email !== identity.email) {
                await ctx.db.patch(user._id, { name: identity.name!, email: identity.email! });
            }
            return user._id;
        }

        // If it's a new identity, create a new `User`.
        // Default role is 'user', admin can update it later.
        // For the very first user, we might want to make them admin? 
        // For now, let's just default to 'user' and use the database dashboard to promote.
        return await ctx.db.insert("users", {
            name: identity.name!,
            email: identity.email!,
            clerkId: identity.subject,
            role: "user",
            imageUrl: identity.pictureUrl,
            lastLogin: Date.now(),
        });
    },
});

export const current = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();
    },
});
