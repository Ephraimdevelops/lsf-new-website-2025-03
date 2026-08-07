import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnyRole, requireAuthenticatedUser } from "./lib/auth";

// ==========================================
// PARALEGAL MANAGEMENT
// ==========================================

// Get all approved paralegals (from applications)
export const listApprovedParalegals = query({
    args: {
        region: v.optional(v.string()),
        verifiedOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        let paralegals = await ctx.db
            .query("paralegal_applications")
            .withIndex("by_status", (q) => q.eq("status", "approved"))
            .collect();

        if (args.region) {
            const searchRegion = args.region.toLowerCase();
            paralegals = paralegals.filter((p) => p.region.toLowerCase().includes(searchRegion));
        }

        if (args.verifiedOnly) {
            paralegals = paralegals.filter((p) => p.isVerified === true);
        }

        return paralegals;
    },
});

// Get paralegal by ID
export const getParalegal = query({
    args: { id: v.id("paralegal_applications") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get paralegal by email (for dashboard)
export const getParalegalByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const actor = await requireAuthenticatedUser(ctx);
        const isStaff = ["admin", "staff"].includes(actor.user.role);
        const isSelf = actor.identity.email?.toLowerCase() === args.email.toLowerCase();
        if (!isStaff && !isSelf) throw new Error("Forbidden");

        return await ctx.db
            .query("paralegal_applications")
            .filter((q) => q.eq(q.field("email"), args.email.toLowerCase()))
            .first();
    },
});

// Increment profile views
export const incrementProfileViews = mutation({
    args: { id: v.id("paralegal_applications") },
    handler: async (ctx, args) => {
        const paralegal = await ctx.db.get(args.id);
        if (paralegal && paralegal.status === "approved") {
            await ctx.db.patch(args.id, {
                profileViews: (paralegal.profileViews || 0) + 1,
            });
        }
    },
});

// Toggle verified status (admin only)
export const toggleVerified = mutation({
    args: { id: v.id("paralegal_applications") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const paralegal = await ctx.db.get(args.id);
        if (paralegal) {
            await ctx.db.patch(args.id, {
                isVerified: !paralegal.isVerified,
            });
        }
        return { success: true };
    },
});

// Update paralegal profile
export const updateParalegalProfile = mutation({
    args: {
        id: v.id("paralegal_applications"),
        fullName: v.optional(v.string()),
        phone: v.optional(v.string()),
        region: v.optional(v.string()),
        district: v.optional(v.string()),
        ward: v.optional(v.string()),
        bio: v.optional(v.string()),
        photoUrl: v.optional(v.string()),
        specializations: v.optional(v.array(v.string())),
        hasJoinedHakiYangu: v.optional(v.boolean()),
        onboardingCompleted: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const paralegal = await ctx.db.get(args.id);
        if (!paralegal) throw new Error("Paralegal not found");

        const actor = await requireAuthenticatedUser(ctx);
        const isStaff = ["admin", "staff"].includes(actor.user.role);
        const isSelf = actor.identity.email?.toLowerCase() === paralegal.email.toLowerCase();
        if (!isStaff && !isSelf) throw new Error("Forbidden");

        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
        return { success: true };
    },
});

// Deactivate paralegal
export const deactivateParalegal = mutation({
    args: { id: v.id("paralegal_applications") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        await ctx.db.patch(args.id, {
            status: "deactivated" as "rejected", // Using rejected as deactivated
        });
        return { success: true };
    },
});

// Get paralegal stats for admin
export const getParalegalStats = query({
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const all = await ctx.db.query("paralegal_applications").collect();
        const approved = all.filter((p) => p.status === "approved");

        // Group by region
        const byRegion: Record<string, number> = {};
        approved.forEach((p) => {
            byRegion[p.region] = (byRegion[p.region] || 0) + 1;
        });

        return {
            total: approved.length,
            verified: approved.filter((p) => p.isVerified).length,
            pending: all.filter((p) => p.status === "pending").length,
            byRegion,
        };
    },
});

// Get paralegal dashboard data
export const getDashboardData = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const actor = await requireAuthenticatedUser(ctx);
        const isStaff = ["admin", "staff"].includes(actor.user.role);
        const isSelf = actor.identity.email?.toLowerCase() === args.email.toLowerCase();
        if (!isStaff && !isSelf) throw new Error("Forbidden");

        const paralegal = await ctx.db
            .query("paralegal_applications")
            .filter((q) => q.eq(q.field("email"), args.email.toLowerCase()))
            .first();

        if (!paralegal || paralegal.status !== "approved") {
            return null;
        }

        // Get all approved paralegals for ranking
        const allApproved = await ctx.db
            .query("paralegal_applications")
            .withIndex("by_status", (q) => q.eq("status", "approved"))
            .collect();

        const rank = allApproved
            .sort((a, b) => (b.profileViews || 0) - (a.profileViews || 0))
            .findIndex((p) => p._id === paralegal._id) + 1;

        return {
            paralegal,
            stats: {
                profileViews: paralegal.profileViews || 0,
                rank,
                totalParalegals: allApproved.length,
                isVerified: paralegal.isVerified || false,
            },
        };
    },
});

// Admin ONLY: Add Paralegal Manually
export const addParalegalManually = mutation({
    args: {
        fullName: v.string(),
        email: v.string(),
        phone: v.string(),
        region: v.string(),
        district: v.string(),
        specializations: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        // Check if an application for this email already exists
        const existing = await ctx.db
            .query("paralegal_applications")
            .filter((q) => q.eq(q.field("email"), args.email.toLowerCase()))
            .first();

        if (existing) {
            throw new Error("A paralegal with this email already exists.");
        }

        // Insert directly as approved
        const id = await ctx.db.insert("paralegal_applications", {
            fullName: args.fullName,
            email: args.email.toLowerCase(),
            phone: args.phone,
            region: args.region,
            district: args.district,
            education: "Manual Entry",
            experience: "Manual Entry",
            motivation: "Added by Admin",
            specializations: args.specializations || [],
            isVerified: true, // Auto-verified since admin added them
            status: "approved",
            submittedAt: Date.now(),
            approvedAt: Date.now(),
            profileViews: 0,
            hasJoinedHakiYangu: false,
            onboardingCompleted: true,
        });

        return { success: true, id };
    },
});

// ==========================================
// BULK CSV IMPORT
// ==========================================
export const importParalegalsBatch = mutation({
    args: {
        records: v.array(
            v.object({
                fullName: v.string(),
                email: v.string(),
                phone: v.string(),
                region: v.string(),
                district: v.string(),
                bio: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        let imported = 0;
        let duplicates = 0;
        const errors: string[] = [];

        for (const record of args.records) {
            try {
                // Skip if email already exists
                const existing = await ctx.db
                    .query("paralegal_applications")
                    .filter((q) => q.eq(q.field("email"), record.email.toLowerCase()))
                    .first();

                if (existing) {
                    duplicates++;
                    continue;
                }

                await ctx.db.insert("paralegal_applications", {
                    fullName: record.fullName.trim(),
                    email: record.email.toLowerCase().trim(),
                    phone: record.phone.trim(),
                    region: record.region.trim(),
                    district: record.district.trim(),
                    bio: record.bio || undefined,
                    education: "CSV Import",
                    experience: "CSV Import",
                    motivation: "Imported from CSV",
                    isVerified: true,
                    status: "approved",
                    submittedAt: Date.now(),
                    approvedAt: Date.now(),
                    profileViews: 0,
                    hasJoinedHakiYangu: false,
                    onboardingCompleted: true,
                });
                imported++;
            } catch (e: any) {
                errors.push(`${record.fullName}: ${e.message}`);
            }
        }

        return { imported, duplicates, errors };
    },
});
