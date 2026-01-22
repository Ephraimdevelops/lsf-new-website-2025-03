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
const CONVEX_URL = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL || "";
const BATCH_SIZE = 25;
const DEFAULT_LOCATION = "Tanzania";
const WORDS_PER_MINUTE = 200;

// Image folder mappings
const IMAGE_PATHS = {
    heros: "/HerosImages/",
    news: "/NewsImages/",
    publications: "/PublicationsImages/",
};

// Allowed HTML tags (clean versions)
const ALLOWED_TAGS = ["p", "b", "strong", "em", "ul", "li", "br", "ol", "h1", "h2", "h3", "h4", "h5", "h6"];

/**
 * Strip HTML attributes and keep only clean tags
 */
function cleanHtml(html: string | null | undefined): string {
    if (!html) return "";

    // Decode HTML entities
    let cleaned = html
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/\\r\\n/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\\//g, "/");

    // Remove Word-specific tags like <o:p>
    cleaned = cleaned.replace(/<o:p>[\s\S]*?<\/o:p>/gi, "");
    cleaned = cleaned.replace(/<!\[if[\s\S]*?<!\[endif\]>/gi, "");

    // Remove all attributes from tags (class, style, align, lang, etc.)
    cleaned = cleaned.replace(/<(\w+)\s+[^>]*>/gi, (match, tagName) => {
        const lowerTag = tagName.toLowerCase();
        if (ALLOWED_TAGS.includes(lowerTag)) {
            return `<${lowerTag}>`;
        }
        return "";
    });

    // Clean closing tags for non-allowed elements
    cleaned = cleaned.replace(/<\/(\w+)>/gi, (match, tagName) => {
        const lowerTag = tagName.toLowerCase();
        if (ALLOWED_TAGS.includes(lowerTag)) {
            return `</${lowerTag}>`;
        }
        return "";
    });

    // Remove empty tags
    cleaned = cleaned.replace(/<(\w+)>\s*<\/\1>/gi, "");

    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    return cleaned;
}

/**
 * Calculate read time from text content (in minutes)
 */
function calculateReadTime(html: string): number {
    const plainText = html.replace(/<[^>]*>/g, " ");
    const words = plainText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/**
 * Extract person name from title (e.g., "Maria's Story" -> "Maria")
 */
function extractPersonName(title: string): string {
    // Try to extract name from patterns like "Maria's Story" or "Story of John"
    const possessiveMatch = title.match(/^(\w+)'s/i);
    if (possessiveMatch) return possessiveMatch[1];

    const ofMatch = title.match(/story of (\w+)/i);
    if (ofMatch) return ofMatch[1];

    // Default: Use first word of title or generic name
    const firstWord = title.split(/\s+/)[0];
    return firstWord || "Community Member";
}

/**
 * Map image filename to full path
 */
function mapImagePath(filename: string | null | undefined, type: "heros" | "news" | "publications"): string {
    if (!filename) return "/lovable-uploads/placeholder.svg";
    return IMAGE_PATHS[type] + filename;
}

/**
 * Extract actual data from JSON structure (handles phpMyAdmin export format)
 */
function extractData(jsonData: any[]): any[] {
    const tableEntry = jsonData.find((item) => item.type === "table" && item.data);
    if (tableEntry) {
        return tableEntry.data;
    }
    return jsonData.filter((item) => !item.type);
}

/**
 * Process records in batches
 */
async function processBatch<T>(
    items: T[],
    processor: (item: T) => Promise<void>,
    label: string
): Promise<void> {
    const total = items.length;
    let processed = 0;

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(processor));
        processed += batch.length;
        console.log(`✅ Imported ${processed}/${total} ${label} items...`);
    }
}

/**
 * Main migration function
 */
async function migrate() {
    if (!CONVEX_URL) {
        console.error("❌ CONVEX_URL or VITE_CONVEX_URL environment variable not set");
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
