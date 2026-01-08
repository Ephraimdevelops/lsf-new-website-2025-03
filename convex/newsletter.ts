import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
        // Check if already subscribed
        const existing = await ctx.db
            .query("newsletter_subscribers")
            .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
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
            email: args.email.toLowerCase(),
            firstName: args.firstName,
            lastName: args.lastName,
            subscribedAt: Date.now(),
            status: "active",
            source: args.source || "website",
            openCount: 0,
            clickCount: 0,
        });

        return { success: true, message: "Successfully subscribed!" };
    },
});

export const unsubscribe = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const subscriber = await ctx.db
            .query("newsletter_subscribers")
            .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
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
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
        return { success: true };
    },
});

export const deleteSubscriber = mutation({
    args: { id: v.id("newsletter_subscribers") },
    handler: async (ctx, args) => {
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
        let imported = 0;
        let skipped = 0;

        for (const sub of args.subscribers) {
            const existing = await ctx.db
                .query("newsletter_subscribers")
                .withIndex("by_email", (q) => q.eq("email", sub.email.toLowerCase()))
                .first();

            if (!existing) {
                await ctx.db.insert("newsletter_subscribers", {
                    email: sub.email.toLowerCase(),
                    firstName: sub.firstName,
                    lastName: sub.lastName,
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
        const id = await ctx.db.insert("newsletter_campaigns", {
            ...args,
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
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
        return { success: true };
    },
});

export const deleteCampaign = mutation({
    args: { id: v.id("newsletter_campaigns") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    },
});

export const listCampaigns = query({
    args: {
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
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
        return await ctx.db.get(args.id);
    },
});

export const sendCampaign = mutation({
    args: { id: v.id("newsletter_campaigns") },
    handler: async (ctx, args) => {
        const campaign = await ctx.db.get(args.id);
        if (!campaign) throw new Error("Campaign not found");

        const activeSubscribers = await ctx.db
            .query("newsletter_subscribers")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();

        // In a real app, this would integrate with an email service (SendGrid, Mailchimp, etc.)
        // For now, we just mark it as sent
        await ctx.db.patch(args.id, {
            status: "sent",
            sentAt: Date.now(),
            recipientCount: activeSubscribers.length,
        });

        // Update last email sent for subscribers
        for (const sub of activeSubscribers) {
            await ctx.db.patch(sub._id, { lastEmailSentAt: Date.now() });
        }

        return { success: true, recipientCount: activeSubscribers.length };
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
        const id = await ctx.db.insert("newsletter_templates", {
            ...args,
            createdAt: Date.now(),
        });
        return id;
    },
});

export const listTemplates = query({
    handler: async (ctx) => {
        return await ctx.db.query("newsletter_templates").collect();
    },
});

export const deleteTemplate = mutation({
    args: { id: v.id("newsletter_templates") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    },
});
