import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all stats
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("stats").withIndex("by_order").collect();
    },
});

// Seed stats
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("stats").collect();
        if (existing.length > 0) return;

        const stats = [
            { label: 'Lives Transformed', value: '426K+', icon: 'Users', order: 1 },
            { label: 'Regions Covered', value: '31', icon: 'MapPin', order: 2 },
            { label: 'Years of Impact', value: '15+', icon: 'Award', order: 3 },
            { label: 'Legal Support', value: '24/7', icon: 'Phone', order: 4 }
        ];

        for (const stat of stats) {
            await ctx.db.insert("stats", stat);
        }
    },
});
