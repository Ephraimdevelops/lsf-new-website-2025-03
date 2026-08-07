import { GenericQueryCtx } from "convex/server";
import { DataModel, Id } from "../_generated/dataModel";

/**
 * Checks if a string is likely a Convex Storage ID.
 * Convex storage IDs typically do not start with http://, https://, or /
 */
export function isConvexStorageId(value: string | undefined | null): boolean {
    if (!value) return false;
    const trimmed = value.trim();
    if (trimmed === "") return false;
    
    // Legacy paths start with /
    if (trimmed.startsWith("/")) return false;
    
    // Absolute URLs start with http
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return false;
    
    // Assume it's a Convex Storage ID if it contains no slashes or typical URL characters
    // Convex IDs are typically alphanumeric (e.g., kg2e5rga5xwk4eamhed85pgzt982sgs3)
    return /^[a-zA-Z0-9_-]+$/.test(trimmed);
}

/**
 * Resolves an image URL safely.
 * If the value is a legacy URL or absolute HTTP URL, it returns it as-is.
 * If the value is a Convex Storage ID, it attempts to resolve it using ctx.storage.getUrl.
 * Returns null if a storage ID cannot be resolved (deleted file, invalid ID, etc.)
 * so that frontends can show a graceful fallback instead of a broken <img>.
 */
export async function resolveImageUrl(
    ctx: GenericQueryCtx<DataModel>, 
    value: string | undefined | null
): Promise<string | null> {
    if (!value) return null;
    
    if (isConvexStorageId(value)) {
        try {
            // Convex storage IDs can be passed directly to getUrl
            const url = await ctx.storage.getUrl(value as Id<"_storage">);
            
            // If getUrl returns null (e.g., deleted file), return null
            // so the frontend can render a graceful fallback instead of a broken image.
            return url ?? null; 
        } catch (e) {
            // Invalid ID format, corrupted reference, etc.
            console.error(`Failed to resolve storage ID ${value}:`, e);
            return null;
        }
    }
    
    // Legacy or absolute URL — pass through as-is
    return value;
}
