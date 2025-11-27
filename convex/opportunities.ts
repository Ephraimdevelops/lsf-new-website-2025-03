import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all opportunities
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("opportunities").order("desc").collect();
    },
});

// Get single opportunity
export const getById = query({
    args: { id: v.id("opportunities") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create opportunity
export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        type: v.union(v.literal("job"), v.literal("grant"), v.literal("tender"), v.literal("consultancy"), v.literal("other")),
        category: v.string(),
        department: v.string(),
        location: v.string(),
        duration: v.string(),
        salary: v.string(),
        deadline: v.string(),
        status: v.union(v.literal("open"), v.literal("closed")),
        applicationLink: v.optional(v.string()),
        requirements: v.optional(v.array(v.string())),
        responsibilities: v.optional(v.array(v.string())),
        benefits: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db.insert("opportunities", args);
    },
});

// Update opportunity
export const update = mutation({
    args: {
        id: v.id("opportunities"),
        title: v.string(),
        description: v.string(),
        type: v.union(v.literal("job"), v.literal("grant"), v.literal("tender"), v.literal("consultancy"), v.literal("other")),
        category: v.string(),
        department: v.string(),
        location: v.string(),
        duration: v.string(),
        salary: v.string(),
        deadline: v.string(),
        status: v.union(v.literal("open"), v.literal("closed")),
        applicationLink: v.optional(v.string()),
        requirements: v.optional(v.array(v.string())),
        responsibilities: v.optional(v.array(v.string())),
        benefits: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

// Delete opportunity
export const remove = mutation({
    args: { id: v.id("opportunities") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    },
});
