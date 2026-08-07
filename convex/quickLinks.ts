import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAnyRole } from "./lib/auth";

// Get public links (only active ones)
export const getPublic = query({
    args: {},
    handler: async (ctx) => {
        const links = await ctx.db
            .query("quick_links")
            .withIndex("by_active", (q) => q.eq("isActive", true))
            .collect();

        // Sort by order
        return links.sort((a, b) => a.order - b.order);
    },
});

// Get all links (for admin)
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);
        const links = await ctx.db.query("quick_links").collect();
        // Sort by order
        return links.sort((a, b) => a.order - b.order);
    },
});

// Create a new link
export const create = mutation({
    args: {
        title: v.string(),
        subtitle: v.optional(v.string()),
        url: v.string(),
        variant: v.union(v.literal("emergency"), v.literal("primary"), v.literal("secondary")),
        icon: v.optional(v.string()),
        isActive: v.boolean(),
        openInNewTab: v.boolean(),
        audience: v.optional(v.union(v.literal("public"), v.literal("paralegal"), v.literal("staff"))),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);
        // Get the current highest order to append to end
        const existing = await ctx.db.query("quick_links").collect();
        const maxOrder = existing.reduce((max, link) => Math.max(max, link.order), 0);

        await ctx.db.insert("quick_links", {
            ...args,
            order: maxOrder + 1,
            clicks: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

// Update an existing link
export const update = mutation({
    args: {
        id: v.id("quick_links"),
        title: v.optional(v.string()),
        subtitle: v.optional(v.string()),
        url: v.optional(v.string()),
        variant: v.optional(v.union(v.literal("emergency"), v.literal("primary"), v.literal("secondary"))),
        icon: v.optional(v.string()),
        isActive: v.optional(v.boolean()),
        openInNewTab: v.optional(v.boolean()),
        audience: v.optional(v.union(v.literal("public"), v.literal("paralegal"), v.literal("staff"))),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);
        const { id, ...updates } = args;
        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});

// Swap order of two links (for Up/Down buttons)
export const swapOrder = mutation({
    args: {
        id1: v.id("quick_links"),
        id2: v.id("quick_links"),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);
        const link1 = await ctx.db.get(args.id1);
        const link2 = await ctx.db.get(args.id2);

        if (!link1 || !link2) throw new Error("Link not found");

        const order1 = link1.order;
        const order2 = link2.order;

        await ctx.db.patch(args.id1, { order: order2 });
        await ctx.db.patch(args.id2, { order: order1 });
    },
});

// Toggle active status (Soft Delete/Hide)
export const toggleStatus = mutation({
    args: {
        id: v.id("quick_links"),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);
        await ctx.db.patch(args.id, {
            isActive: args.isActive,
            updatedAt: Date.now(),
        });
    },
});

// Track click (Analytics)
export const trackClick = mutation({
    args: {
        id: v.id("quick_links"),
    },
    handler: async (ctx, args) => {
        const link = await ctx.db.get(args.id);
        if (!link) return;

        await ctx.db.patch(args.id, {
            clicks: (link.clicks || 0) + 1,
        });
    },
});
