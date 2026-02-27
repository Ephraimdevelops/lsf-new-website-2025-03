import { query } from "./_generated/server";

export const getSitemapData = query({
    args: {},
    handler: async (ctx) => {
        const news = await ctx.db.query("news").collect();
        const stories = await ctx.db.query("success_stories").collect();
        const publications = await ctx.db.query("publications").collect();
        const opportunities = await ctx.db.query("opportunities").collect();
        const programsFromDb = await ctx.db.query("programs").collect();

        // Static pages
        const staticPages = [
            "",
            "about",
            "programs",
            "legal-help",
            "how-we-work",
            "impact",
            "news",
            "heroes",
            "publications",
            "opportunities",
            "gallery",
            "contact",
            "lsfchatbot",
            "donate",
            "what-we-do",
            "strategic-focuses",
            "approaches",
            "what-we-do/grant-making",
            "what-we-do/direct-implementation",
            "what-we-do/advocacy-policy",
            "what-we-do/capacity-building",
            "what-we-do/learning-research",
            "what-we-do/partnerships-networking",
            "focus-areas/accessible-legal-aid",
            "focus-areas/empowered-communities",
            "focus-areas/conducive-environment",
            "focus-areas/institutional-development",
            "focus-areas/climate-justice",
            "focus-areas/digital-transformation",
        ];

        // Hardcoded programs (if not in DB yet)
        const hardcodedPrograms = [
            "sauti-ya-mwanamke",
            "wanawake-tunaweza",
            "mama-samia-legal-aid-campaign",
            "climate-justice",
        ];

        const dynamicPages: string[] = [];

        // News
        news.forEach(item => {
            dynamicPages.push(`news/${item.slug || item._id}`);
        });

        // Stories
        stories.forEach(item => {
            dynamicPages.push(`stories/${item._id}`);
        });

        // Publications
        publications.forEach(item => {
            dynamicPages.push(`publications/${item._id}`);
        });

        // Opportunities
        opportunities.forEach(item => {
            dynamicPages.push(`opportunities/${item._id}`);
        });

        // Programs
        programsFromDb.forEach(item => {
            dynamicPages.push(`programs/${item.slug}`);
        });
        hardcodedPrograms.forEach(slug => {
            if (!programsFromDb.some(p => p.slug === slug)) {
                dynamicPages.push(`programs/${slug}`);
            }
        });

        return [...staticPages, ...dynamicPages];
    },
});
