import { v } from "convex/values";
export const sourceUploadMetadata = {
  title: v.string(), publisher: v.string(), sourceUrl: v.optional(v.string()),
  jurisdiction: v.union(v.literal("tanzania_mainland"), v.literal("zanzibar"), v.literal("national"), v.literal("other")),
  language: v.union(v.literal("sw"), v.literal("en"), v.literal("bilingual"), v.literal("other")),
  contentCategory: v.string(), versionLabel: v.string(), effectiveDate: v.optional(v.string()),
  reviewDueAt: v.number(), replacesDocumentId: v.optional(v.id("documents")),
};
