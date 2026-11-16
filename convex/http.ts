import { httpRouter } from "convex/server";
import { api, internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { receive, preflight, scanSource } from "./managedUploads";

import { inboundMessages, validMetaSignature } from "./lib/metaMessaging";
const http = httpRouter();
// The callback exchanges the code only after validating expiring, single-use
// operator state. No credential or query parameter is reflected to the browser.
http.route({path:"/meta-instagram-return",method:"GET",handler:httpAction(async (ctx,request)=>{
  const url=new URL(request.url);
  const ok=!url.searchParams.has('error')&&await ctx.runAction(internal.metaInstagramActions.complete,{code:url.searchParams.get('code')??'',state:url.searchParams.get('state')??''});
  return new Response(ok
    ? "Haki Yangu Instagram setup\n\nLSF Instagram authorization was saved securely in the Haki Yangu backend. Return to your administrator to verify message notifications and test replies. This is not confirmation of public bot availability."
    : "Haki Yangu Instagram setup\n\nThe backend could not confirm the connection. Return to your administrator to retry authorization. No token is displayed here.",
    {headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store","Referrer-Policy":"no-referrer","Content-Security-Policy":"default-src 'none'; frame-ancestors 'none'","X-Content-Type-Options":"nosniff"}});
})});
http.route({path:"/meta-messaging",method:"GET",handler:httpAction(async (_ctx,request)=>{
  const url=new URL(request.url); const expected=process.env.META_VERIFY_TOKEN;
  if(!expected||url.searchParams.get("hub.mode")!=="subscribe"||url.searchParams.get("hub.verify_token")!==expected) return new Response("Forbidden",{status:403});
  return new Response(url.searchParams.get("hub.challenge")??"",{status:200});
})});
http.route({path:"/meta-messaging",method:"POST",handler:httpAction(async(ctx,request)=>{
  if(process.env.META_MESSAGING_ENABLED!=="true")return new Response("Disabled",{status:503});
  const raw=await request.text(); if(raw.length>262144)return new Response("Too large",{status:413});
  if(!await validMetaSignature(process.env.META_APP_SECRET??"",raw,request.headers.get("x-hub-signature-256")))return new Response("Forbidden",{status:403});
  let body;try{body=JSON.parse(raw);}catch{return new Response("Invalid JSON",{status:400});}
  const instagram=await ctx.runQuery(internal.metaInstagram.account,{});
  const messages=inboundMessages(body,{whatsapp:process.env.META_WHATSAPP_PHONE_ID,messenger:process.env.META_PAGE_ID,instagram:instagram?.accountId??process.env.META_INSTAGRAM_ID});
  if(body.object==='instagram')await ctx.runMutation(internal.metaInstagram.recordWebhook,{acceptedMessages:messages.filter(x=>x.channel==='instagram').length});
  for(const message of messages)await ctx.runMutation(internal.socialMessaging.receive,message);
  return new Response("EVENT_RECEIVED");
})});
http.route({ path: "/secure-upload", method: "POST", handler: receive });
http.route({ path: "/secure-upload", method: "OPTIONS", handler: preflight });
http.route({ path: "/secure-scan-source", method: "POST", handler: scanSource });

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
