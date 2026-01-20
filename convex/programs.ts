import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all programs
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("programs").collect();
    },
});

// Get program by slug
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("programs")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
    },
});

// Get program by ID
export const getById = query({
    args: { id: v.id("programs") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create program
export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        slug: v.string(),
        imageUrl: v.string(),
        objectives: v.optional(v.array(v.string())),
        impact: v.optional(v.string()),
        status: v.union(v.literal("active"), v.literal("completed")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db.insert("programs", args);
    },
});

// Update program
export const update = mutation({
    args: {
        id: v.id("programs"),
        title: v.string(),
        description: v.string(),
        slug: v.string(),
        imageUrl: v.string(),
        objectives: v.optional(v.array(v.string())),
        impact: v.optional(v.string()),
        status: v.union(v.literal("active"), v.literal("completed")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

// Delete program (with orphan cleanup)
export const remove = mutation({
    args: { id: v.id("programs") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // Admin check
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (user?.role !== "admin") throw new Error("Forbidden: Admin access required");

        // =====================================================
        // ORPHAN DATA CLEANUP
        // Find and unlink all success_stories referencing this program
        // This prevents "ghost data" accumulation in the database
        // =====================================================
        const linkedStories = await ctx.db
            .query("success_stories")
            .filter((q) => q.eq(q.field("programId"), args.id.toString()))
            .collect();

        for (const story of linkedStories) {
            // Option: Unlink (safe) vs Delete (aggressive)
            // Using unlink to preserve the story data
            await ctx.db.patch(story._id, { programId: undefined });
            console.log(`[DATA CLEANUP] Unlinked success_story ${story._id} from deleted program`);
        }

        // Now safe to delete the program
        await ctx.db.delete(args.id);

        console.log(`[ADMIN] Program ${args.id} deleted. ${linkedStories.length} stories unlinked.`);
    },
});
