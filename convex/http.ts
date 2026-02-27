import { httpRouter } from "convex/server";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
    path: "/sitemap.xml",
    method: "GET",
    handler: httpAction(async (ctx) => {
        const pages = await ctx.runQuery(api.seo.getSitemapData);
        const domain = "https://lsftz.org";

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(pages as string[])
                .map(
                    (page: string) => `  <url>
    <loc>${domain}/${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`
                )
                .join("\n")}
</urlset>`;

        return new Response(sitemap, {
            status: 200,
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, max-age=3600, s-maxage=3600",
            },
        });
    }),
});

export default http;
