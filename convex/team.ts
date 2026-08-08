import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { requireAnyRole } from "./lib/auth";
import { resolveImageUrl } from "./lib/mediaHelpers";

// Get all team members
// Get all team members
export const get = query({
    args: {},
    handler: async (ctx) => {
        const team = await ctx.db.query("team_members").order("asc").collect();

        return await Promise.all(
            team.map(async (member) => {
                let storageId = undefined;
                if (member.image) {
                    const resolved = await resolveImageUrl(ctx, member.image);
                    if (resolved && resolved !== member.image) {
                        storageId = member.image; // Preserve original ID if it was resolved
                    }
                    member.image = resolved ?? "/lovable-uploads/placeholder.svg";
                }
                return { ...member, storageId };
            })
        );
    },
});

// Get team member by ID
export const getById = query({
    args: { id: v.id("team_members") },
    handler: async (ctx, args) => {
        const member = await ctx.db.get(args.id);
        if (!member) return null;

        let storageId = undefined;
        if (member.image) {
            const resolved = await resolveImageUrl(ctx, member.image);
            if (resolved && resolved !== member.image) {
                storageId = member.image; // Preserve original ID if it was resolved
            }
            member.image = resolved ?? "/lovable-uploads/placeholder.svg";
        }
        return { ...member, storageId };
    },
});

// Create team member
export const create = mutation({
    args: {
        name: v.string(),
        position: v.string(),
        bio: v.string(),
        image: v.string(),
        quote: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        email: v.optional(v.string()),
        twitter: v.optional(v.string()),
        type: v.union(v.literal("team"), v.literal("board"), v.literal("agm")),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

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
        quote: v.optional(v.string()),
        linkedin: v.optional(v.string()),
        email: v.optional(v.string()),
        twitter: v.optional(v.string()),
        type: v.union(v.literal("team"), v.literal("board"), v.literal("agm")),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

// Delete team member
export const remove = mutation({
    args: { id: v.id("team_members") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);

        await ctx.db.delete(args.id);
    },
});

// Seed initial team members
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

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
