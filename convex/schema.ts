import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users (Synced from Clerk) - GDPR compliant with soft delete
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("staff"), v.literal("paralegal"), v.literal("stakeholder"), v.literal("user")),
    clerkId: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.string()), // For Convex Storage
    bio: v.optional(v.string()), // User biography
    lastLogin: v.optional(v.number()),
    // GDPR: Soft delete support for audit trails
    isDeleted: v.optional(v.boolean()),
    deletedAt: v.optional(v.number()),
  }).index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Legacy Heros (success stories from old site)
  heros: defineTable({
    title: v.string(),
    slug: v.string(), // URL-friendly identifier
    description: v.string(), // Cleaned HTML content
    image: v.optional(v.string()), // Full path to image or Convex storage URL
    date: v.number(), // Unix timestamp
    location: v.optional(v.string()), // Default: "Tanzania"
    readTime: v.optional(v.number()), // Minutes, auto-calculated from word count
  }).index("by_slug", ["slug"]),

  // News & Articles
  news: defineTable({
    title: v.string(),
    excerpt: v.string(),
    content: v.string(), // HTML content
    category: v.string(),
    image: v.optional(v.string()), // Legacy URL
    storageId: v.optional(v.string()), // Convex Storage ID
    date: v.string(), // ISO date string
    featured: v.boolean(),
    author: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
    views: v.optional(v.number()),
  }).index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_slug", ["slug"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["category"],
    }),

  // Publications (Reports, Briefs, etc.)
  publications: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // 'report', 'policy-brief', etc.
    type: v.string(), // specific type if different from category
    coverImageUrl: v.optional(v.string()),
    coverImageStorageId: v.optional(v.string()), // New
    pdfUrl: v.optional(v.string()),
    pdfStorageId: v.optional(v.string()), // New
    publishedDate: v.string(),
    authors: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    downloadCount: v.optional(v.number()),
    views: v.optional(v.number()),
  }).index("by_category", ["category"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["category"],
    }),

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
    quote: v.optional(v.string()), // Short highlight quote for detail page
    personName: v.string(),
    location: v.string(),
    imageUrl: v.optional(v.string()),
    storageId: v.optional(v.string()), // New
    readTime: v.optional(v.number()), // Minutes, auto-calculated or manual
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
    quote: v.optional(v.string()), // Personal quote for detail page
    linkedin: v.optional(v.string()),
    email: v.optional(v.string()),
    twitter: v.optional(v.string()),
    type: v.union(v.literal("team"), v.literal("board"), v.literal("agm")),
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

  // ==========================================
  // FORM SUBMISSIONS & NEWSLETTER MANAGEMENT
  // ==========================================

  // Newsletter Subscribers
  newsletter_subscribers: defineTable({
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    subscribedAt: v.number(),
    status: v.union(v.literal("active"), v.literal("unsubscribed"), v.literal("bounced")),
    source: v.optional(v.string()), // 'website', 'import', 'manual'
    tags: v.optional(v.array(v.string())), // For segmentation
    lastEmailSentAt: v.optional(v.number()),
    openCount: v.optional(v.number()),
    clickCount: v.optional(v.number()),
  }).index("by_email", ["email"])
    .index("by_status", ["status"]),

  // Newsletter Campaigns (for sending newsletters)
  newsletter_campaigns: defineTable({
    title: v.string(),
    subject: v.string(),
    previewText: v.optional(v.string()),
    content: v.string(), // HTML content
    pdfUrl: v.optional(v.string()), // Uploaded PDF newsletter
    coverImageUrl: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("scheduled"), v.literal("sent"), v.literal("archived")),
    scheduledAt: v.optional(v.number()),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
    createdBy: v.optional(v.string()),
    recipientCount: v.optional(v.number()),
    openRate: v.optional(v.number()),
    clickRate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())), // Target specific subscriber segments
  }).index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  // Newsletter Templates (reusable templates)
  newsletter_templates: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    content: v.string(), // HTML template
    thumbnailUrl: v.optional(v.string()),
    category: v.optional(v.string()), // 'announcement', 'update', 'event', etc.
    isDefault: v.optional(v.boolean()),
    createdAt: v.number(),
  }),

  // Contact Form Submissions
  contact_submissions: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    category: v.string(),
    subject: v.string(),
    message: v.string(),
    submittedAt: v.number(),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied"), v.literal("archived")),
    notes: v.optional(v.string()), // Admin notes
    assignedTo: v.optional(v.string()),
    repliedAt: v.optional(v.number()),
  }).index("by_status", ["status"])
    .index("by_category", ["category"]),

  // Whistleblower Reports
  whistleblower_reports: defineTable({
    reportType: v.string(), // 'fraud', 'misconduct', 'safety', 'harassment', etc.
    description: v.string(),
    evidenceUrls: v.optional(v.array(v.string())), // Uploaded evidence files
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    isAnonymous: v.boolean(),
    submittedAt: v.number(),
    status: v.union(v.literal("new"), v.literal("investigating"), v.literal("resolved"), v.literal("dismissed")),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical"))),
    assignedTo: v.optional(v.string()),
    resolution: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
  }).index("by_status", ["status"]),

  // Paralegal Applications
  paralegal_applications: defineTable({
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    whatsapp: v.optional(v.string()), // WhatsApp number (may differ from phone)
    region: v.string(),
    district: v.string(),
    ward: v.optional(v.string()),
    education: v.string(),
    experience: v.string(),
    motivation: v.string(),
    languages: v.optional(v.array(v.string())),
    resumeUrl: v.optional(v.string()),
    idDocumentUrl: v.optional(v.string()),
    submittedAt: v.number(),
    status: v.union(v.literal("pending"), v.literal("under_review"), v.literal("approved"), v.literal("rejected")),
    reviewNotes: v.optional(v.string()),
    reviewedBy: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    // New fields for approved paralegals
    isVerified: v.optional(v.boolean()),
    profileViews: v.optional(v.number()),
    bio: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    specializations: v.optional(v.array(v.string())),
    hasJoinedHakiYangu: v.optional(v.boolean()),
    onboardingCompleted: v.optional(v.boolean()),
    approvedAt: v.optional(v.number()),
  }).index("by_status", ["status"])
    .index("by_region", ["region"])
    .index("by_email", ["email"]),

  // ==========================================
  // SARA AI KNOWLEDGE BASE (RAG)
  // ==========================================

  // Documents (Sources)
  documents: defineTable({
    title: v.string(),
    text: v.optional(v.string()), // extracted text
    storageId: v.id("_storage"), // PDF file in Convex storage
    type: v.string(), // 'pdf', 'text', 'url'
    sourceUrl: v.optional(v.string()), // URL if applicable
    metadata: v.optional(v.any()), // PDF metadata
    uploadedAt: v.number(),
    processedAt: v.optional(v.number()),
    lastReviewedAt: v.optional(v.number()), // For content freshness alerts
  }),

  // Embeddings (Chunks)
  embeddings: defineTable({
    documentId: v.id("documents"),
    text: v.string(), // Chunk text
    embedding: v.array(v.number()), // Vector embedding (1536 dim for OpenAI)
    chunkIndex: v.number(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
  }).index("by_documentId", ["documentId"]),

  // SARA Chat History
  sara_chats: defineTable({
    userId: v.string(), // Clerk ID
    sessionId: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.number(),
    // Analytics & Metadata
    tokens: v.optional(v.number()),
    toolCalls: v.optional(v.array(v.string())), // Track tools used (e.g. "find_paralegals")
    metadata: v.optional(v.any()),
    // Feedback (for assistant messages)
    feedback: v.optional(v.union(v.literal("positive"), v.literal("negative"))),
  }).index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  // SARA Feedback (for detailed analytics)
  sara_feedback: defineTable({
    messageId: v.id("sara_chats"),
    userId: v.string(),
    rating: v.union(v.literal("positive"), v.literal("negative")),
    comment: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_rating", ["rating"])
    .index("by_timestamp", ["timestamp"]),

  // SARA Configuration (System Prompt, etc.)
  sara_config: defineTable({
    key: v.string(), // e.g. 'system_prompt'
    value: v.string(),
  }).index("by_key", ["key"]),

  // ==========================================
  // RATE LIMITING (Anti-Spam Protection)
  // ==========================================

  rate_limits: defineTable({
    identifier: v.string(), // Hashed IP or session ID
    count: v.number(), // Number of requests in window
    windowStart: v.number(), // Timestamp of window start
  }).index("by_identifier", ["identifier"]),

  // ==========================================
  // AUDIT LOGS (For compliance/accountability)
  // ==========================================

  audit_logs: defineTable({
    action: v.string(), // 'create', 'update', 'delete', 'login', etc.
    entityType: v.string(), // 'whistleblower_report', 'paralegal_application', etc.
    entityId: v.optional(v.string()), // ID of affected entity
    userId: v.string(), // Clerk ID of user performing action
    timestamp: v.number(),
    metadata: v.optional(v.any()), // Additional context
  }).index("by_action", ["action"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  // ==========================================
  // SITE SETTINGS (Admin configurable)
  // ==========================================

  site_settings: defineTable({
    key: v.string(), // Setting key (e.g., 'siteName', 'contactEmail')
    value: v.string(), // Setting value
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  // ==========================================
  // ANALYTICS EVENTS (Behavioral Tracking)
  // ==========================================

  analytics_events: defineTable({
    type: v.union(
      v.literal("page_view"),
      v.literal("news_view"),
      v.literal("publication_download"),
      v.literal("paralegal_page_view"),
      v.literal("paralegal_signup_start"),
      v.literal("paralegal_signup_complete"),
      v.literal("sara_session_start"),
      v.literal("chat_topic"),
      v.literal("click"),
      v.literal("search")
    ),
    resourceId: v.optional(v.string()), // Page URL, document ID, etc.
    resourceType: v.optional(v.string()), // 'publication', 'news', 'program', etc.
    meta: v.optional(v.any()), // Additional context
    userId: v.string(), // Clerk ID or "anonymous"
    timestamp: v.number(),
    sessionDate: v.optional(v.string()), // YYYY-MM-DD for daily aggregation
  }).index("by_type", ["type"])
    .index("by_timestamp", ["timestamp"])
    .index("by_user", ["userId"]),

  // ==========================================
  // LSF CONNECT (Quick Links / Mini-CMS)
  // ==========================================

  quick_links: defineTable({
    title: v.string(),
    subtitle: v.optional(v.string()), // Detailed context
    url: v.string(),
    variant: v.union(v.literal('emergency'), v.literal('primary'), v.literal('secondary')), // Hierarchy
    icon: v.optional(v.string()), // Lucide icon name (Restricted set in UI)
    order: v.number(), // Sort order
    isActive: v.boolean(), // Soft delete/hide
    openInNewTab: v.boolean(), // UX preference
    audience: v.optional(v.union(v.literal('public'), v.literal('paralegal'), v.literal('staff'))), // Future-proofing
    clicks: v.number(), // Basic analytics
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_order", ["order"])
    .index("by_active", ["isActive"]),
});

