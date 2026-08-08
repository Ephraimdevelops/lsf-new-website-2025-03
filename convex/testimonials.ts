import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";
import { resolveImageUrl } from "./lib/mediaHelpers";

// Get all testimonials
export const get = query({
    args: {},
    handler: async (ctx) => {
        const testimonials = await ctx.db.query("testimonials").collect();
        return await Promise.all(
            testimonials.map(async (testimonial) => {
                if (testimonial.imageUrl) {
                    const resolved = await resolveImageUrl(ctx, testimonial.imageUrl);
                    testimonial.imageUrl = resolved ?? "/lovable-uploads/placeholder.svg";
                }
                return testimonial;
            })
        );
    },
});

// Get featured testimonials
export const getFeatured = query({
    args: {},
    handler: async (ctx) => {
        const testimonials = await ctx.db
            .query("testimonials")
            .withIndex("by_featured", (q) => q.eq("featured", true))
            .collect();
        return await Promise.all(
            testimonials.map(async (testimonial) => {
                if (testimonial.imageUrl) {
                    const resolved = await resolveImageUrl(ctx, testimonial.imageUrl);
                    testimonial.imageUrl = resolved ?? "/lovable-uploads/placeholder.svg";
                }
                return testimonial;
            })
        );
    },
});

// Create a testimonial
export const create = mutation({
    args: {
        name: v.string(),
        role: v.string(),
        location: v.string(),
        content: v.string(),
        imageUrl: v.string(),
        rating: v.number(),
        category: v.string(),
        featured: v.boolean(),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        return await ctx.db.insert("testimonials", args);
    },
});

// Update a testimonial
export const update = mutation({
    args: {
        id: v.id("testimonials"),
        name: v.optional(v.string()),
        role: v.optional(v.string()),
        location: v.optional(v.string()),
        content: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        rating: v.optional(v.number()),
        category: v.optional(v.string()),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin", "staff"]);

        const { id, ...rest } = args;
        await ctx.db.patch(id, rest);
    },
});

// Remove a testimonial
export const remove = mutation({
    args: { id: v.id("testimonials") },
    handler: async (ctx, args) => {
        await requireAnyRole(ctx, ["admin"]);

        await ctx.db.delete(args.id);
    },
});

// Seed initial testimonials
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAnyRole(ctx, ["admin"]);

        const existing = await ctx.db.query("testimonials").collect();
        if (existing.length > 0) return;

        const testimonials = [
            {
                name: 'Sarah Mwalimu',
                role: 'Teacher',
                location: 'Dar es Salaam',
                content: 'Haki Yangu helped me understand my land rights when my family was facing eviction. The paralegal connected me with was so knowledgeable and supportive. I got the help I needed within hours.',
                imageUrl: '/lovable-uploads/testimonial-1.jpg',
                rating: 5,
                category: 'Land Rights',
                featured: true
            },
            {
                name: 'Juma Kimaro',
                role: 'Farmer',
                location: 'Arusha',
                content: 'As someone living in a remote village, I never thought I could access legal help. This app changed everything. Now I can get legal advice right from my phone, even without internet.',
                imageUrl: '/lovable-uploads/testimonial-2.jpg',
                rating: 5,
                category: 'Rural Access',
                featured: true
            },
            {
                name: 'Grace Mwamba',
                role: 'Small Business Owner',
                location: 'Mwanza',
                content: 'The document templates saved me thousands of shillings. I was able to create proper contracts for my business without hiring expensive lawyers. The app is a game-changer!',
                imageUrl: '/lovable-uploads/testimonial-3.jpg',
                rating: 5,
                category: 'Business Law',
                featured: true
            },
            {
                name: 'Ahmed Hassan',
                role: 'Student',
                location: 'Zanzibar',
                content: 'The educational videos helped me understand my rights as a tenant. When my landlord tried to increase rent unfairly, I knew exactly what to do. Knowledge is power!',
                imageUrl: '/lovable-uploads/testimonial-4.jpg',
                rating: 5,
                category: 'Tenant Rights',
                featured: true
            },
            {
                name: 'Mary Kisanga',
                role: 'Community Leader',
                location: 'Dodoma',
                content: 'Our entire village now uses Haki Yangu. We\'ve resolved so many disputes that used to divide our community. It\'s bringing peace and understanding to our people.',
                imageUrl: '/lovable-uploads/testimonial-5.jpg',
                rating: 5,
                category: 'Community Harmony',
                featured: true
            },
            {
                name: 'Peter Mwangi',
                role: 'Driver',
                location: 'Kilimanjaro',
                content: 'When I had an accident and the insurance company was giving me trouble, Haki Yangu connected me with a legal expert who helped me get fair compensation.',
                imageUrl: '/lovable-uploads/testimonial-6.jpg',
                rating: 5,
                category: 'Insurance Justice',
                featured: true
            }
        ];

        for (const testimonial of testimonials) {
            await ctx.db.insert("testimonials", testimonial);
        }
    },
});
