import { mutation, query } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";

// ==========================================
// OPS DASHBOARD BACKEND
// ==========================================

// 1. BUDGET HEALTH
// Logic: Count total tokens used by SARA, multiply by cost factor.
// Cost factor: ~$5.00 / 1M input tokens, ~$15.00 / 1M output tokens.
// Simplified blended rate: $10.00 / 1M tokens ($0.01 / 1k tokens) as per sara_chat.ts
export const getBudgetStatus = query({
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

        // Calculate usage
        const allMessages = await ctx.db.query("sara_chats").collect();
        const totalTokens = allMessages.reduce((sum, m) => sum + (m.tokens || 0), 0);

        // Cost calculation
        const costPer1k = 0.01;
        const currentUsage = (totalTokens / 1000) * costPer1k;

        // Hardcoded budget limit
        const BUDGET_LIMIT = 20.00;

        return {
            usage: currentUsage,
            limit: BUDGET_LIMIT,
            isLocked: currentUsage >= BUDGET_LIMIT
        };
    },
});

// 2. CONTENT FRESHNESS (Stale Documents)
// Logic: List PDFs not reviewed in > 365 days
export const listStaleDocuments = query({
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

        const now = Date.now();
        const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);

        const allDocs = await ctx.db.query("documents").collect();

        // Filter for stale docs
        // If lastReviewedAt is missing, assume it's stale if created > 1 year ago? 
        // Or if missing, use uploadedAt.
        const staleDocs = allDocs.filter(doc => {
            const lastCheck = doc.lastReviewedAt || doc.uploadedAt;
            return lastCheck < oneYearAgo;
        });

        return staleDocs.map(doc => ({
            _id: doc._id,
            title: doc.title,
            lastReviewed: doc.lastReviewedAt || doc.uploadedAt,
            daysSinceReview: Math.floor((now - (doc.lastReviewedAt || doc.uploadedAt)) / (24 * 60 * 60 * 1000))
        }));
    },
});

// 3. SYSTEM KILL SWITCH (SARA)
export const getSystemStatus = query({
    handler: async (ctx) => {
        // Publicly accessible (for chatbot to check)
        const config = await ctx.db
            .query("sara_config")
            .withIndex("by_key", (q) => q.eq("key", "system_status"))
            .unique();

        return {
            status: config?.value || "active", // Default to active
            isMaintenance: config?.value === "maintenance"
        };
    },
});

export const toggleSystemStatus = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

        const config = await ctx.db
            .query("sara_config")
            .withIndex("by_key", (q) => q.eq("key", "system_status"))
            .unique();

        const currentStatus = config?.value || "active";
        const newStatus = currentStatus === "active" ? "maintenance" : "active";

        if (config) {
            await ctx.db.patch(config._id, { value: newStatus });
        } else {
            await ctx.db.insert("sara_config", { key: "system_status", value: newStatus });
        }

        return newStatus;
    },
});
