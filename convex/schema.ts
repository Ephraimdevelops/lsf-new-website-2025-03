import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users (Synced from Clerk)
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff"), v.literal("paralegal"), v.literal("stakeholder"), v.literal("user")),
    clerkId: v.string(),
    imageUrl: v.optional(v.string()),
    lastLogin: v.optional(v.number()),
  }).index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // News & Articles
  news: defineTable({
    title: v.string(),
    excerpt: v.string(),
    content: v.string(), // HTML content
    category: v.string(),
    image: v.string(),
    date: v.string(), // ISO date string
    featured: v.boolean(),
    author: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
  }).index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_slug", ["slug"]),

  // Publications (Reports, Briefs, etc.)
  publications: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // 'report', 'policy-brief', etc.
    type: v.string(), // specific type if different from category
    coverImageUrl: v.string(),
    pdfUrl: v.string(),
    publishedDate: v.string(),
    authors: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    downloadCount: v.optional(v.number()),
  }).index("by_category", ["category"]),

  // Opportunities (Jobs, Grants, Tenders)
  opportunities: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.union(v.literal("job"), v.literal("grant"), v.literal("tender"), v.literal("consultancy"), v.literal("other")),
    category: v.string(), // e.g. 'Employment', 'Internship', 'Volunteer'
    department: v.string(),
    location: v.string(),
    duration: v.string(),
    salary: v.string(),
    deadline: v.string(),
    status: v.union(v.literal("open"), v.literal("closed")),
    applicationLink: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    responsibilities: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
  }).index("by_status", ["status"])
    .index("by_type", ["type"]),

  // Success Stories
  success_stories: defineTable({
    title: v.string(),
    story: v.string(), // HTML or text
    personName: v.string(),
    location: v.string(),
    imageUrl: v.string(),
    impactMetrics: v.optional(v.any()), // Flexible JSON object for metrics
    programId: v.optional(v.string()), // Link to a program
    featured: v.optional(v.boolean()),
  }),

  // Programs
  programs: defineTable({
    title: v.string(),
    description: v.string(),
    slug: v.string(),
    imageUrl: v.string(),
    objectives: v.optional(v.array(v.string())),
    impact: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("completed")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    location: v.optional(v.array(v.string())),
    approach: v.optional(v.string()),
    results: v.optional(v.array(v.object({ value: v.string(), title: v.string() }))),
    bestPractices: v.optional(v.array(v.string())),
    geographicCoverage: v.optional(v.array(v.string())),
    resources: v.optional(v.array(v.object({ url: v.string(), title: v.string(), type: v.string() }))),
    gallery: v.optional(v.array(v.string())),
    beneficiaries: v.optional(v.object({
      total: v.optional(v.number()),
      women: v.optional(v.number()),
      children: v.optional(v.number()),
      disputes: v.optional(v.number()),
    })),
    donors: v.optional(v.array(v.string())),
    partners: v.optional(v.array(v.string())),
  }).index("by_slug", ["slug"]),

  // Hero Slides (Homepage)
  hero_slides: defineTable({
    title: v.string(),
    subtitle: v.optional(v.string()), // Added
    description: v.string(),
    category: v.optional(v.string()), // Added
    imageUrl: v.string(),
    ctaText: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    stat: v.optional(v.string()), // Added
    statLabel: v.optional(v.string()), // Added
    order: v.number(),
    isActive: v.boolean(),
  }).index("by_order", ["order"]),

  // Team Members
  team_members: defineTable({
    name: v.string(),
    position: v.string(),
    bio: v.string(),
    image: v.string(),
    linkedin: v.optional(v.string()),
    email: v.optional(v.string()),
    twitter: v.optional(v.string()),
    type: v.union(v.literal("team"), v.literal("board")),
    order: v.optional(v.number()),
  }).index("by_type", ["type"])
    .index("by_order", ["order"]),

  // Media Library (for file management)
  media_library: defineTable({
    name: v.string(),
    url: v.string(),
    type: v.string(), // 'image', 'document', etc.
    size: v.number(),
    uploadedBy: v.string(),
    uploadedAt: v.number(),
  }),

  // Testimonials
  testimonials: defineTable({
    name: v.string(),
    role: v.string(),
    location: v.string(),
    content: v.string(),
    imageUrl: v.string(),
    rating: v.number(),
    category: v.string(),
    featured: v.boolean(),
  }).index("by_featured", ["featured"]),

  // Global Stats
  stats: defineTable({
    label: v.string(),
    value: v.string(),
    icon: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),
});
