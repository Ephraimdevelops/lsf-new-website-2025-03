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
 * Run: NEXT_PUBLIC_CONVEX_URL=https://your-url.convex.cloud npx tsx scripts/seedLegacy.ts
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
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.VITE_CONVEX_URL || process.env.CONVEX_URL || "";
const BATCH_SIZE = 25;
const DEFAULT_LOCATION = "Tanzania";
const WORDS_PER_MINUTE = 200;

// Image folder mappings
const IMAGE_PATHS: Record<string, string> = {
    heros: "/HerosImages/",
    news: "/NewsImages/",
    publications: "/PublicationsImages/",
};

// =====================
// HELPER FUNCTIONS
// =====================

/**
 * Extract array data from various JSON formats, including phpMyAdmin exports
 */
function extractData(raw: any): any[] {
    // Direct array
    if (Array.isArray(raw)) {
        // Check if this is a phpMyAdmin export (array with header, database, table objects)
        if (raw.length > 0 && raw[0]?.type === "header") {
            // Find the table entry with data
            for (const item of raw) {
                if (item?.type === "table" && Array.isArray(item?.data)) {
                    return item.data;
                }
            }
        }
        return raw;
    }
    // Nested data property
    if (raw?.data && Array.isArray(raw.data)) return raw.data;
    if (raw?.records && Array.isArray(raw.records)) return raw.records;
    if (raw?.items && Array.isArray(raw.items)) return raw.items;
    // Try to find first array property
    for (const key of Object.keys(raw)) {
        if (Array.isArray(raw[key])) return raw[key];
    }
    return [];
}

/**
 * Clean HTML content - remove Word/MS formatting and normalize
 */
function cleanHtml(html: string): string {
    if (!html) return "";

    return html
        // Remove MS Word namespaced tags
        .replace(/<o:p[^>]*>[\s\S]*?<\/o:p>/gi, "")
        .replace(/<w:[^>]+>[\s\S]*?<\/w:[^>]+>/gi, "")
        // Remove style attributes with MS Word styles
        .replace(/\s*mso-[^:]+:[^;"]+;?/gi, "")
        // Remove class attributes
        .replace(/\s*class="[^"]*"/gi, "")
        // Remove empty style attributes
        .replace(/\s*style="\s*"/gi, "")
        // Clean up remaining style attributes
        .replace(/style="([^"]*)"/gi, (match, styles) => {
            const cleanStyles = styles
                .split(";")
                .filter((s: string) => !s.includes("mso-") && s.trim())
                .join(";");
            return cleanStyles ? `style="${cleanStyles}"` : "";
        })
        // Remove empty paragraphs
        .replace(/<p[^>]*>\s*(&nbsp;|\s)*<\/p>/gi, "")
        // Normalize whitespace
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Calculate read time from content (in minutes)
 */
function calculateReadTime(content: string): number {
    const text = content.replace(/<[^>]*>/g, ""); // Strip HTML
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/**
 * Extract person name from title (common patterns)
 */
function extractPersonName(title: string): string {
    // Try to find name patterns like "John's Story" or "Story of Mary"
    const patterns = [
        /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)'s\s+/i, // "John's Story"
        /story\s+of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i, // "Story of John"
        /meet\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i, // "Meet John"
        /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*[-:]/i, // "John: My Story"
    ];

    for (const pattern of patterns) {
        const match = title.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }

    // Default: take first 2 capitalized words
    const words = title.split(/\s+/).slice(0, 2).filter(w => /^[A-Z]/.test(w));
    return words.length > 0 ? words.join(" ") : "Community Member";
}

/**
 * Map image filename to full path
 */
function mapImagePath(filename: string | undefined, type: "heros" | "news" | "publications"): string {
    if (!filename) return "/placeholder-image.jpg";
    if (filename.startsWith("http") || filename.startsWith("/")) {
        return filename;
    }
    return `${IMAGE_PATHS[type]}${filename}`;
}

/**
 * Process items in batches with delay
 */
async function processBatch<T>(
    items: T[],
    processor: (item: T) => Promise<void>,
    label: string
): Promise<void> {
    console.log(`   Found ${items.length} ${label} items`);

    let processed = 0;
    let errors = 0;

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);

        await Promise.all(batch.map(async (item) => {
            try {
                await processor(item);
                processed++;
            } catch (error) {
                errors++;
                // Error is logged in processor
            }
        }));

        console.log(`   Processed ${Math.min(i + BATCH_SIZE, items.length)}/${items.length}`);

        // Small delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < items.length) {
            await new Promise(r => setTimeout(r, 500));
        }
    }

    console.log(`   ✓ ${processed} inserted, ${errors} errors`);
}

// =====================
// MAIN MIGRATION
// =====================

async function migrate() {
    if (!CONVEX_URL) {
        console.error("❌ CONVEX_URL environment variable not set");
        console.error("   Set it with: export NEXT_PUBLIC_CONVEX_URL='https://your-url.convex.cloud'");
        process.exit(1);
    }

    const client = new ConvexHttpClient(CONVEX_URL);
    const projectRoot = path.resolve(__dirname, "..");

    console.log("🚀 Starting legacy data migration...\n");
    console.log(`   🔗 Convex URL: ${CONVEX_URL}`);
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
