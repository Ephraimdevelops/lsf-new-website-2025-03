import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAnyRole } from "./lib/auth";
import { escapeHtml, normalizeEmail, normalizeOptionalText, sanitizeRichHtml } from "./lib/security";

// ==========================================
// NEWSLETTER SUBSCRIBERS
// ==========================================

export const subscribe = mutation({
    args: {
        email: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        source: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const email = normalizeEmail(args.email);
        const firstName = normalizeOptionalText(args.firstName, "First name", 80);
        const lastName = normalizeOptionalText(args.lastName, "Last name", 80);
        const source = normalizeOptionalText(args.source, "Source", 80);

        // Check if already subscribed
        const existing = await ctx.db
            .query("newsletter_subscribers")
            .withIndex("by_email", (q) => q.eq("email", email))
            .first();

        if (existing) {
            if (existing.status === "unsubscribed") {
                // Re-subscribe
                await ctx.db.patch(existing._id, {
                    status: "active",
                    subscribedAt: Date.now(),
                });
                return { success: true, message: "Welcome back! You've been re-subscribed." };
            }
            return { success: false, message: "This email is already subscribed." };
        }

        await ctx.db.insert("newsletter_subscribers", {
            email,
            firstName,
            lastName,
            subscribedAt: Date.now(),
            status: "active",
            source: source || "website",
            openCount: 0,
            clickCount: 0,
        });

        // Send notification email to admin
        try {
            await ctx.scheduler.runAfter(0, internal.resend.sendTransactionalEmail, {
                to: "info@lsftz.org",
                subject: "New Newsletter Subscriber",
                html: `
                    <h2>New Newsletter Subscription</h2>
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                    <p><strong>Name:</strong> ${escapeHtml(firstName || "")} ${escapeHtml(lastName || "")}</p>
                    <p><strong>Source:</strong> ${escapeHtml(source || "website")}</p>
                `
            });
        } catch (error) {
            console.error("Failed to schedule newsletter notification", error);
        }

        return { success: true, message: "Successfully subscribed!" };
    },
});

export const unsubscribe = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const email = normalizeEmail(args.email);
        const subscriber = await ctx.db
            .query("newsletter_subscribers")
            .withIndex("by_email", (q) => q.eq("email", email))
            .first();

        if (subscriber) {
            await ctx.db.patch(subscriber._id, { status: "unsubscribed" });
        }

        return { success: true };
    },
});

export const listSubscribers = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        if (args.status) {
            return await ctx.db
                .query("newsletter_subscribers")
                .withIndex("by_status", (q) => q.eq("status", args.status as "active" | "unsubscribed" | "bounced"))
                .collect();
        }
        return await ctx.db.query("newsletter_subscribers").collect();
    },
});

export const getSubscriberStats = query({
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const all = await ctx.db.query("newsletter_subscribers").collect();
        const active = all.filter((s) => s.status === "active").length;
        const unsubscribed = all.filter((s) => s.status === "unsubscribed").length;
        const bounced = all.filter((s) => s.status === "bounced").length;

        return {
            total: all.length,
            active,
            unsubscribed,
            bounced,
            growthThisMonth: active, // Simplified for now
        };
    },
});

export const updateSubscriber = mutation({
    args: {
        id: v.id("newsletter_subscribers"),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        status: v.optional(v.union(v.literal("active"), v.literal("unsubscribed"), v.literal("bounced"))),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
        return { success: true };
    },
});

export const deleteSubscriber = mutation({
    args: { id: v.id("newsletter_subscribers") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);

        await ctx.db.delete(args.id);
        return { success: true };
    },
});

export const importSubscribers = mutation({
    args: {
        subscribers: v.array(v.object({
            email: v.string(),
            firstName: v.optional(v.string()),
            lastName: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        let imported = 0;
        let skipped = 0;

        for (const sub of args.subscribers) {
            const email = normalizeEmail(sub.email);
            const firstName = normalizeOptionalText(sub.firstName, "First name", 80);
            const lastName = normalizeOptionalText(sub.lastName, "Last name", 80);
            const existing = await ctx.db
                .query("newsletter_subscribers")
                .withIndex("by_email", (q) => q.eq("email", email))
                .first();

            if (!existing) {
                await ctx.db.insert("newsletter_subscribers", {
                    email,
                    firstName,
                    lastName,
                    subscribedAt: Date.now(),
                    status: "active",
                    source: "import",
                    openCount: 0,
                    clickCount: 0,
                });
                imported++;
            } else {
                skipped++;
            }
        }

        return { imported, skipped };
    },
});

// ==========================================
// NEWSLETTER CAMPAIGNS
// ==========================================

export const createCampaign = mutation({
    args: {
        title: v.string(),
        subject: v.string(),
        previewText: v.optional(v.string()),
        content: v.string(),
        pdfUrl: v.optional(v.string()),
        coverImageUrl: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const id = await ctx.db.insert("newsletter_campaigns", {
            ...args,
            content: sanitizeRichHtml(args.content),
            status: "draft",
            createdAt: Date.now(),
        });
        return id;
    },
});

export const updateCampaign = mutation({
    args: {
        id: v.id("newsletter_campaigns"),
        title: v.optional(v.string()),
        subject: v.optional(v.string()),
        previewText: v.optional(v.string()),
        content: v.optional(v.string()),
        pdfUrl: v.optional(v.string()),
        coverImageUrl: v.optional(v.string()),
        status: v.optional(v.union(v.literal("draft"), v.literal("scheduled"), v.literal("sent"), v.literal("archived"))),
        scheduledAt: v.optional(v.number()),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const { id, ...updates } = args;
        await ctx.db.patch(id, {
            ...updates,
            ...(updates.content !== undefined && { content: sanitizeRichHtml(updates.content) }),
        });
        return { success: true };
    },
});

export const deleteCampaign = mutation({
    args: { id: v.id("newsletter_campaigns") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);

        await ctx.db.delete(args.id);
        return { success: true };
    },
});

export const listCampaigns = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        if (args.status) {
            return await ctx.db
                .query("newsletter_campaigns")
                .withIndex("by_status", (q) => q.eq("status", args.status as "draft" | "scheduled" | "sent" | "archived"))
                .order("desc")
                .collect();
        }
        return await ctx.db.query("newsletter_campaigns").order("desc").collect();
    },
});

export const getCampaign = query({
    args: { id: v.id("newsletter_campaigns") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        return await ctx.db.get(args.id);
    },
});

export const sendCampaign = mutation({
    args: { id: v.id("newsletter_campaigns") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const campaign = await ctx.db.get(args.id);
        if (!campaign) throw new Error("Campaign not found");

        const activeSubscribers = await ctx.db
            .query("newsletter_subscribers")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();

        if (activeSubscribers.length === 0) {
            throw new Error("No active subscribers to send to");
        }

        // Mark as sending (in progress)
        await ctx.db.patch(args.id, {
            status: "sent",
            sentAt: Date.now(),
            recipientCount: activeSubscribers.length,
        });

        // Update last email sent for subscribers
        for (const sub of activeSubscribers) {
            await ctx.db.patch(sub._id, { lastEmailSentAt: Date.now() });
        }

        // Note: Actual email sending happens via the Resend action
        // which should be called from the frontend after this mutation succeeds
        // Frontend will call api.resend.sendEmail with the subscriber list

        return {
            success: true,
            recipientCount: activeSubscribers.length,
            subscribers: activeSubscribers.map(s => s.email),
            campaignSubject: campaign.subject,
            campaignContent: campaign.content,
        };
    },
});

// ==========================================
// NEWSLETTER TEMPLATES
// ==========================================

export const createTemplate = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        content: v.string(),
        thumbnailUrl: v.optional(v.string()),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const id = await ctx.db.insert("newsletter_templates", {
            ...args,
            content: sanitizeRichHtml(args.content),
            createdAt: Date.now(),
        });
        return id;
    },
});

export const listTemplates = query({
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        return await ctx.db.query("newsletter_templates").collect();
    },
});

export const deleteTemplate = mutation({
    args: { id: v.id("newsletter_templates") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);

        await ctx.db.delete(args.id);
        return { success: true };
    },
});
