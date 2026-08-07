import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";
import { resolveImageUrl } from "./lib/mediaHelpers";

// Get all slides
export const get = query({
    args: {},
    handler: async (ctx) => {
        const slides = await ctx.db.query("hero_slides").withIndex("by_order").collect();
        return await Promise.all(
            slides.map(async (slide) => {
                if (slide.imageUrl) {
                    const resolved = await resolveImageUrl(ctx, slide.imageUrl);
                    slide.imageUrl = resolved ?? undefined;
                }
                return slide;
            })
        );
    },
});

// Update slide order/content
export const update = mutation({
    args: {
        id: v.id("hero_slides"),
        title: v.string(),
        subtitle: v.optional(v.string()),
        description: v.string(),
        category: v.optional(v.string()),
        imageUrl: v.string(),
        ctaText: v.optional(v.string()),
        ctaLink: v.optional(v.string()),
        stat: v.optional(v.string()),
        statLabel: v.optional(v.string()),
        order: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

// Create slide
export const create = mutation({
    args: {
        title: v.string(),
        subtitle: v.optional(v.string()),
        description: v.string(),
        category: v.optional(v.string()),
        imageUrl: v.string(),
        ctaText: v.optional(v.string()),
        ctaLink: v.optional(v.string()),
        stat: v.optional(v.string()),
        statLabel: v.optional(v.string()),
        order: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        return await ctx.db.insert("hero_slides", args);
    },
});

// Delete slide
export const remove = mutation({
    args: { id: v.id("hero_slides") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);

        await ctx.db.delete(args.id);
    },
});

// Seed initial hero slides
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

        const existing = await ctx.db.query("hero_slides").collect();
        if (existing.length > 0) return;

        const slides = [
            {
                title: 'Justice for Every Tanzanian',
                subtitle: 'Empowering communities through accessible legal aid and innovative technology solutions that bridge the gap between law and people.',
                description: 'Empowering communities through accessible legal aid and innovative technology solutions that bridge the gap between law and people.',
                category: 'Legal Empowerment',
                imageUrl: '/lovable-uploads/background with mother umage .png',
                ctaText: 'Get Legal Help',
                ctaLink: '/legal-help',
                order: 1,
                isActive: true
            },
            {
                title: 'Haki Yangu Digital Platform',
                subtitle: 'Connecting communities with legal services through our revolutionary mobile app, making justice accessible at your fingertips.',
                description: 'Connecting communities with legal services through our revolutionary mobile app, making justice accessible at your fingertips.',
                category: 'Digital Innovation',
                imageUrl: '/lovable-uploads/haki yangu app uzinuzi.webp',
                ctaText: 'Download App',
                ctaLink: '/legal-help',
                order: 2,
                isActive: true
            },
            {
                title: 'Community Paralegal Network',
                subtitle: 'Training and empowering local champions who bring legal knowledge directly to rural communities across Tanzania.',
                description: 'Training and empowering local champions who bring legal knowledge directly to rural communities across Tanzania.',
                category: 'Community Impact',
                imageUrl: '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
                ctaText: 'Join Our Network',
                ctaLink: '/programs',
                order: 3,
                isActive: true
            }
        ];

        for (const slide of slides) {
            await ctx.db.insert("hero_slides", slide);
        }
    },
});

// Update categories for existing slides
export const updateCategories = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const slides = await ctx.db.query("hero_slides").collect();

        const categoryMap: Record<number, string> = {
            1: 'Legal Empowerment',
            2: 'Digital Innovation',
            3: 'Community Impact',
        };

        for (const slide of slides) {
            if (!slide.category) {
                const category = categoryMap[slide.order] || 'Featured';
                await ctx.db.patch(slide._id, { category });
            }
        }
    },
});
