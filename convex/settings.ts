import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ==========================================
// SITE SETTINGS PERSISTENCE
// ==========================================

/**
 * Get all site settings.
 * Returns a flat object with all settings.
 */
export const getSettings = query({
    handler: async (ctx) => {
        const settings = await ctx.db.query("site_settings").collect();

        // Convert array to object for easier frontend usage
        const settingsObj: Record<string, string> = {};
        for (const setting of settings) {
            settingsObj[setting.key] = setting.value;
        }

        // Return with defaults if not set
        return {
            siteName: settingsObj.siteName || "Legal Services Facility",
            contactEmail: settingsObj.contactEmail || "info@lsftz.org",
            contactPhone: settingsObj.contactPhone || "+255 123 456 789",
            facebookUrl: settingsObj.facebookUrl || "https://facebook.com/lsftz",
            twitterUrl: settingsObj.twitterUrl || "https://twitter.com/lsftz",
            instagramUrl: settingsObj.instagramUrl || "https://instagram.com/lsftz",
            linkedinUrl: settingsObj.linkedinUrl || "",
            address: settingsObj.address || "Dar es Salaam, Tanzania",
        };
    },
});

/**
 * Update multiple settings at once.
 * Only admins can update settings.
 */
export const updateSettings = mutation({
    args: {
        settings: v.object({
            siteName: v.optional(v.string()),
            contactEmail: v.optional(v.string()),
            contactPhone: v.optional(v.string()),
            facebookUrl: v.optional(v.string()),
            twitterUrl: v.optional(v.string()),
            instagramUrl: v.optional(v.string()),
            linkedinUrl: v.optional(v.string()),
            address: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        // Admin check
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (user?.role !== "admin") throw new Error("Forbidden: Admin access required");

        // Update each setting
        for (const [key, value] of Object.entries(args.settings)) {
            if (value === undefined) continue;

            // Check if setting exists
            const existing = await ctx.db
                .query("site_settings")
                .withIndex("by_key", (q) => q.eq("key", key))
                .unique();

            if (existing) {
                await ctx.db.patch(existing._id, { value, updatedAt: Date.now() });
            } else {
                await ctx.db.insert("site_settings", {
                    key,
                    value,
                    updatedAt: Date.now(),
                });
            }
        }

        return { success: true };
    },
});

/**
 * Get a single setting by key.
 */
export const getSetting = query({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        const setting = await ctx.db
            .query("site_settings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();

        return setting?.value || null;
    },
});
