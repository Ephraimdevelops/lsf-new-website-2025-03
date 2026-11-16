import { mutation, query } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";
import { monthlyLimitMicroUsd } from "./lib/aiPricing";

// ==========================================
// OPS DASHBOARD BACKEND
// ==========================================

// 1. BUDGET HEALTH
// Read the same monthly ledger used by AI spending enforcement.
export const getBudgetStatus = query({
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

        const month = new Date().toISOString().slice(0, 7);
        const row = await ctx.db.query("ai_usage_months")
            .withIndex("by_month", q => q.eq("month", month)).unique();
        const limit = monthlyLimitMicroUsd(process.env.SAADA_MONTHLY_BUDGET_USD);
        const usage = (row?.committedMicroUsd ?? 0) + (row?.reservedMicroUsd ?? 0);
        const unpricedCalls = row?.unpricedCalls ?? 0;
        return {
            month,
            usage: usage / 1e6,
            limit: limit === null ? null : limit / 1e6,
            unpricedCalls,
            isLocked: limit !== null && (usage >= limit || unpricedCalls > 0),
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
