import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ==========================================
// RATE LIMITING CONFIGURATION
// ==========================================

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_SUBMISSIONS_PER_WINDOW = 3; // 3 submissions per IP per hour

// ==========================================
// HELPER: Check Rate Limit
// ==========================================

async function checkRateLimit(
    ctx: any,
    identifier: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();

    // Query existing rate limit entry
    const existing = await ctx.db
        .query("rate_limits")
        .withIndex("by_identifier", (q: any) => q.eq("identifier", identifier))
        .first();

    if (!existing) {
        // First request - allow and create entry
        await ctx.db.insert("rate_limits", {
            identifier,
            count: 1,
            windowStart: now,
        });
        return {
            allowed: true,
            remaining: MAX_SUBMISSIONS_PER_WINDOW - 1,
            resetAt: now + RATE_LIMIT_WINDOW
        };
    }

    // Check if window expired
    if (now - existing.windowStart > RATE_LIMIT_WINDOW) {
        // Reset window
        await ctx.db.patch(existing._id, { count: 1, windowStart: now });
        return {
            allowed: true,
            remaining: MAX_SUBMISSIONS_PER_WINDOW - 1,
            resetAt: now + RATE_LIMIT_WINDOW
        };
    }

    // Check if limit exceeded
    if (existing.count >= MAX_SUBMISSIONS_PER_WINDOW) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: existing.windowStart + RATE_LIMIT_WINDOW
        };
    }

    // Increment count
    await ctx.db.patch(existing._id, { count: existing.count + 1 });
    return {
        allowed: true,
        remaining: MAX_SUBMISSIONS_PER_WINDOW - existing.count - 1,
        resetAt: existing.windowStart + RATE_LIMIT_WINDOW
    };
}

// ==========================================
// HELPER: Validate Honeypot
// ==========================================

function validateHoneypot(honeypotValue: string | undefined): boolean {
    // If honeypot field is filled, it's a bot
    return !honeypotValue || honeypotValue.trim() === "";
}

// ==========================================
// HELPER: Role-Based Access Control
// ==========================================

async function requireAdminOrStaff(ctx: any): Promise<void> {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthorized: You must be logged in");
    }

    const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
        .unique();

    if (!user || !["admin", "staff"].includes(user.role)) {
        throw new Error("Forbidden: Insufficient privileges. Admin or Staff role required.");
    }
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
        // Rate limiting identifier (hashed IP or session)
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
        const identifier = args.clientIdentifier || "anonymous";
        const rateCheck = await checkRateLimit(ctx, `whistleblower:${identifier}`);

        if (!rateCheck.allowed) {
            const resetTime = new Date(rateCheck.resetAt).toLocaleTimeString();
            throw new Error(
                `Rate limit exceeded. You can submit again after ${resetTime}. ` +
                `Mpaka wa mawasiliano umefikiwa. Jaribu tena baada ya ${resetTime}.`
            );
        }

        // Create the report
        const id = await ctx.db.insert("whistleblower_reports", {
            reportType: args.reportType,
            description: args.description,
            evidenceUrls: args.evidenceUrls,
            contactEmail: args.contactEmail,
            contactPhone: args.contactPhone,
            isAnonymous: args.isAnonymous,
            submittedAt: Date.now(),
            status: "new",
            priority: "medium",
        });

        return {
            success: true,
            id,
            remaining: rateCheck.remaining,
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
        await requireAdminOrStaff(ctx);

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
        await requireAdminOrStaff(ctx);
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
        await requireAdminOrStaff(ctx);

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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        // Only admin can delete (not staff)
        if (!user || user.role !== "admin") {
            throw new Error("Forbidden: Only administrators can delete reports.");
        }

        await ctx.db.delete(args.id);
        return { success: true };
    },
});

// PRIVATE: Get statistics (ADMIN/STAFF ONLY)
export const getStats = query({
    handler: async (ctx) => {
        await requireAdminOrStaff(ctx);

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
