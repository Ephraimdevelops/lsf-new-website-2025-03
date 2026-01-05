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

// Seed initial team members
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("team_members").collect();
        if (existing.length > 0) return;

        const team = [
            {
                name: 'Dr. John Doe',
                position: 'Executive Director',
                bio: 'Leading LSF with over 20 years of experience in legal aid and development.',
                image: '/lovable-uploads/placeholder.svg',
                type: 'team',
                order: 1
            },
            {
                name: 'Jane Smith',
                position: 'Head of Programs',
                bio: 'Expert in program management and community development.',
                image: '/lovable-uploads/placeholder.svg',
                type: 'team',
                order: 2
            },
            {
                name: 'Michael Johnson',
                position: 'Finance Manager',
                bio: 'Ensuring financial sustainability and transparency.',
                image: '/lovable-uploads/placeholder.svg',
                type: 'team',
                order: 3
            },
            {
                name: 'Sarah Williams',
                position: 'Board Chair',
                bio: 'Distinguished legal professional guiding our strategic vision.',
                image: '/lovable-uploads/placeholder.svg',
                type: 'board',
                order: 1
            },
            {
                name: 'David Brown',
                position: 'Board Member',
                bio: 'Advocate for human rights and social justice.',
                image: '/lovable-uploads/placeholder.svg',
                type: 'board',
                order: 2
            }
        ];

        for (const member of team) {
            // Cast type to union literal
            await ctx.db.insert("team_members", { ...member, type: member.type as "team" | "board" });
        }
    },
});
