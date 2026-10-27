import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";
import { enforceRateLimit } from "./lib/rateLimits";
import { normalizeText, normalizeOptionalEmail, normalizeOptionalText } from "./lib/security";

// ==========================================
// HELPER: Validate Honeypot
// ==========================================

function validateHoneypot(honeypotValue: string | undefined): boolean {
    // If honeypot field is filled, it's a bot
    return !honeypotValue || honeypotValue.trim() === "";
}

// ==========================================
// WHISTLEBLOWER REPORTS
// ==========================================

// PUBLIC: Submit a whistleblower report (rate limited + honeypot protected)
export const submit = mutation({
    args: {
        reportType: v.string(),
        description: v.string(),
        evidenceUrls: v.optional(v.array(v.string())),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        isAnonymous: v.boolean(),
        // Retained for client compatibility; never trusted for admission control.
        clientIdentifier: v.optional(v.string()),
        // Honeypot field (should always be empty)
        roleTitle: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // SECURITY: Honeypot check - reject if filled (bot detected)
        if (!validateHoneypot(args.roleTitle)) {
            // Silently reject - don't tell the bot it failed
            console.log("[SECURITY] Honeypot triggered, rejecting submission");
            return { success: true, id: "rejected" }; // Fake success to confuse bots
        }

        // SECURITY: Rate limiting
        await enforceRateLimit(ctx, "public-whistleblower:global", 60, 60 * 60 * 1000);
        if ((args.evidenceUrls?.length ?? 0) > 10) throw new Error("Include at most ten evidence links.");

        // Create the report
        const id = await ctx.db.insert("whistleblower_reports", {
            reportType: normalizeText(args.reportType, "Report type", 120),
            description: normalizeText(args.description, "Description", 8000),
            evidenceUrls: args.evidenceUrls?.map(value => {
                const url = new URL(normalizeText(value, "Evidence URL", 1000));
                if (url.protocol !== "https:") throw new Error("Evidence links must use HTTPS.");
                return url.href;
            }),
            contactEmail: normalizeOptionalEmail(args.contactEmail),
            contactPhone: normalizeOptionalText(args.contactPhone, "Contact phone", 40),
            isAnonymous: args.isAnonymous,
            submittedAt: Date.now(),
            status: "new",
            priority: "medium",
        });

        return {
            success: true,
            id,
            remaining: undefined,
            message: "Report submitted successfully. Ripoti yako imepokelewa."
        };
    },
});

// PRIVATE: List all reports (ADMIN/STAFF ONLY - RLS enforced)
export const list = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // SECURITY: Require admin or staff role
        await requireAnyRole(ctx, ["admin", "staff"]);

        if (args.status) {
            return await ctx.db
                .query("whistleblower_reports")
                .withIndex("by_status", (q) =>
                    q.eq("status", args.status as "new" | "investigating" | "resolved" | "dismissed")
                )
                .order("desc")
                .collect();
        }

        return await ctx.db.query("whistleblower_reports").order("desc").collect();
    },
});

// PRIVATE: Get single report by ID (ADMIN/STAFF ONLY)
export const getById = query({
    args: { id: v.id("whistleblower_reports") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);
        return await ctx.db.get(args.id);
    },
});

// PRIVATE: Update report status (ADMIN/STAFF ONLY)
export const updateStatus = mutation({
    args: {
        id: v.id("whistleblower_reports"),
        status: v.optional(
            v.union(
                v.literal("new"),
                v.literal("investigating"),
                v.literal("resolved"),
                v.literal("dismissed")
            )
        ),
        priority: v.optional(
            v.union(
                v.literal("low"),
                v.literal("medium"),
                v.literal("high"),
                v.literal("critical")
            )
        ),
        assignedTo: v.optional(v.string()),
        resolution: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const { id, ...updates } = args;

        // Add resolved timestamp if status is resolved
        if (updates.status === "resolved") {
            (updates as Record<string, unknown>).resolvedAt = Date.now();
        }

        await ctx.db.patch(id, updates);
        return { success: true };
    },
});

// PRIVATE: Delete report (ADMIN ONLY - more restrictive)
export const remove = mutation({
    args: { id: v.id("whistleblower_reports") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);

        await ctx.db.delete(args.id);
        return { success: true };
    },
});

// PRIVATE: Get statistics (ADMIN/STAFF ONLY)
export const getStats = query({
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const all = await ctx.db.query("whistleblower_reports").collect();

        return {
            total: all.length,
            new: all.filter((r) => r.status === "new").length,
            investigating: all.filter((r) => r.status === "investigating").length,
            resolved: all.filter((r) => r.status === "resolved").length,
            dismissed: all.filter((r) => r.status === "dismissed").length,
            critical: all.filter((r) => r.priority === "critical").length,
            high: all.filter((r) => r.priority === "high").length,
        };
    },
});
