import { v } from "convex/values";
export const sourceUploadMetadata = {
  sourceType: v.optional(v.union(v.literal("legal_reference"),v.literal("lsf_knowledge"))),
  publicationStatus: v.optional(v.union(v.literal("published"),v.literal("draft"),v.literal("unknown"))),
  reportingPeriod: v.optional(v.string()),
  title: v.string(), publisher: v.string(), sourceUrl: v.optional(v.string()),
  jurisdiction: v.union(v.literal("tanzania_mainland"), v.literal("zanzibar"), v.literal("national"), v.literal("other")),
  language: v.union(v.literal("sw"), v.literal("en"), v.literal("bilingual"), v.literal("other")),
  contentCategory: v.string(), versionLabel: v.string(), effectiveDate: v.optional(v.string()),
  reviewDueAt: v.number(), replacesDocumentId: v.optional(v.id("documents")),
};
