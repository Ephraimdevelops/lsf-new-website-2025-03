/**
 * Legacy Data Migration Script
 * 
 * Imports data from PHP MySQL JSON exports into Convex database.
 * Processes: heros.json -> success_stories, news.json, publications.json
 * 
 * Features:
 * - HTML Cleanup: Strips Word-formatted attributes
 * - Read Time: Auto-calculated from word count
 * - Location: Defaults to "Tanzania"
 * - PersonName: Extracted from title or defaults
 * 
 * Run: npx ts-node scripts/seedLegacy.ts
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || "";
const BATCH_SIZE = 25;
const DEFAULT_LOCATION = "Tanzania";
const WORDS_PER_MINUTE = 200;

// Image folder mappings
const IMAGE_PATHS = {
    heros: "/HerosImages/",
    news: "/NewsImages/",
    publications: "/PublicationsImages/",
};

// ... (skipping unchanged lines)

async function migrate() {
    if (!CONVEX_URL) {
        console.error("❌ CONVEX_URL or NEXT_PUBLIC_CONVEX_URL environment variable not set");
        console.error("   Set it with: export CONVEX_URL='your-convex-url'");
        process.exit(1);
    }

    const client = new ConvexHttpClient(CONVEX_URL);
    const projectRoot = path.resolve(__dirname, "..");

    console.log("🚀 Starting legacy data migration...\n");
    console.log(`   📦 Batch size: ${BATCH_SIZE}`);
    console.log(`   📍 Default location: ${DEFAULT_LOCATION}`);
    console.log(`   📖 Words/min for read time: ${WORDS_PER_MINUTE}\n`);

    // =====================
    // 1. HEROS -> SUCCESS_STORIES
    // =====================
    const herosPath = path.join(projectRoot, "heros.json");
    if (fs.existsSync(herosPath)) {
        console.log("📖 Processing heros.json -> success_stories...");
        const herosRaw = JSON.parse(fs.readFileSync(herosPath, "utf-8"));
        const heros = extractData(herosRaw);

        await processBatch(
            heros,
            async (hero: any) => {
                try {
                    const cleanedStory = cleanHtml(hero.description);

                    await client.mutation(api.stories.createForMigration, {
                        title: hero.title || "Untitled Story",
                        story: cleanedStory,
                        personName: extractPersonName(hero.title || ""),
                        location: DEFAULT_LOCATION,
                        imageUrl: mapImagePath(hero.image, "heros"),
                        readTime: calculateReadTime(cleanedStory),
                        featured: false,
                    });
                } catch (error) {
                    console.error(`⚠️ Error inserting story: ${hero.title}`, error);
                }
            },
            "success_stories"
        );
        console.log(`✨ Heroes -> Success Stories migration complete!\n`);
    } else {
        console.log("⚠️ heros.json not found, skipping...\n");
    }

    // =====================
    // 2. NEWS
    // =====================
    const newsPath = path.join(projectRoot, "news.json");
    if (fs.existsSync(newsPath)) {
        console.log("📖 Processing news.json...");
        const newsRaw = JSON.parse(fs.readFileSync(newsPath, "utf-8"));
        const newsItems = extractData(newsRaw);

        await processBatch(
            newsItems,
            async (newsItem: any) => {
                try {
                    const cleanDesc = cleanHtml(newsItem.description);
                    const excerpt = cleanDesc.replace(/<[^>]*>/g, "").substring(0, 200) + "...";

                    await client.mutation(api.news.createForMigration, {
                        title: newsItem.title || "Untitled",
                        excerpt: excerpt,
                        content: cleanDesc,
                        category: "General",
                        image: mapImagePath(newsItem.image, "news"),
                        date: newsItem.date || new Date().toISOString().split("T")[0],
                        featured: false,
                        // Removed slug as it's not in schema or handled
                    });
                } catch (error) {
                    console.error(`⚠️ Error inserting news: ${newsItem.title}`, error);
                }
            },
            "news"
        );
        console.log(`✨ News migration complete!\n`);
    } else {
        console.log("⚠️ news.json not found, skipping...\n");
    }

    // =====================
    // 3. PUBLICATIONS
    // =====================
    const pubsPath = path.join(projectRoot, "publications.json");
    if (fs.existsSync(pubsPath)) {
        console.log("📖 Processing publications.json...");
        const pubsRaw = JSON.parse(fs.readFileSync(pubsPath, "utf-8"));
        const publications = extractData(pubsRaw);

        await processBatch(
            publications,
            async (pub: any) => {
                try {
                    await client.mutation(api.publications.createForMigration, {
                        title: pub.title || "Untitled",
                        description: cleanHtml(pub.description) || pub.title || "",
                        category: "report",
                        type: "legacy",
                        coverImageUrl: mapImagePath(pub.image, "publications"),
                        pdfUrl: mapImagePath(pub.file, "publications"),
                        publishedDate: pub.created_at?.split(" ")[0] || new Date().toISOString().split("T")[0],
                    });
                } catch (error) {
                    console.error(`⚠️ Error inserting publication: ${pub.title}`, error);
                }
            },
            "publications"
        );
        console.log(`✨ Publications migration complete!\n`);
    } else {
        console.log("⚠️ publications.json not found, skipping...\n");
    }

    console.log("🎉 Legacy data migration finished!");
}

// Run migration
migrate().catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
});
