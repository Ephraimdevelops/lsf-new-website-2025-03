import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all team members
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("team_members").order("asc").collect();
    },
});

// Create team member
export const create = mutation({
    args: {
        name: v.string(),
        position: v.string(),
        bio: v.string(),
        image: v.string(),
        linkedin: v.optional(v.string()),
        email: v.optional(v.string()),
        twitter: v.optional(v.string()),
        type: v.union(v.literal("team"), v.literal("board")),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db.insert("team_members", args);
    },
});

// Update team member
export const update = mutation({
    args: {
        id: v.id("team_members"),
        name: v.string(),
        position: v.string(),
        bio: v.string(),
        image: v.string(),
        linkedin: v.optional(v.string()),
        email: v.optional(v.string()),
        twitter: v.optional(v.string()),
        type: v.union(v.literal("team"), v.literal("board")),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

// Delete team member
export const remove = mutation({
    args: { id: v.id("team_members") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    },
});
