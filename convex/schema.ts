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

  // Additive role assignments allow scoped and multiple roles while legacy users.role
  // remains available during migration.
  role_assignments: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("staff"),
      v.literal("supervisor"),
      v.literal("content_editor"),
      v.literal("paralegal"),
      v.literal("provider_staff"),
      v.literal("stakeholder"),
      v.literal("donor"),
      v.literal("user"),
    ),
    organizationId: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("suspended"), v.literal("revoked")),
    grantedBy: v.id("users"),
    grantedAt: v.number(),
    revokedAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_role_status", ["role", "status"]),

  consents: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("privacy"),
      v.literal("service"),
      v.literal("referral"),
      v.literal("ai"),
      v.literal("communications"),
    ),
    version: v.string(),
    granted: v.boolean(),
    locale: v.union(v.literal("sw"), v.literal("en")),
    method: v.optional(v.union(
      v.literal("documented_verbal"),
      v.literal("written"),
      v.literal("sms"),
      v.literal("email"),
      v.literal("signed_document"),
    )),
    statement: v.optional(v.string()),
    evidenceNote: v.optional(v.string()),
    evidenceStorageId: v.optional(v.id("_storage")),
    evidenceFileName: v.optional(v.string()),
    evidenceFileType: v.optional(v.string()),
    evidenceFileSize: v.optional(v.number()),
    retentionUntil: v.optional(v.number()),
    reviewStatus: v.optional(v.union(v.literal("pending_review"), v.literal("accepted"), v.literal("rejected"))),
    informationShared: v.optional(v.array(v.string())),
    relatedCaseId: v.optional(v.id("cases")),
    relatedReferralId: v.optional(v.id("referrals")),
    destinationServiceId: v.optional(v.id("justice_services")),
    recordedBy: v.optional(v.id("users")),
    recordedAt: v.number(),
    withdrawnAt: v.optional(v.number()),
  }).index("by_user_type", ["userId", "type"]),

  legal_help_requests: defineTable({
    publicId: v.string(),
    ownerId: v.id("users"),
    clientRequestId: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("waiting_for_information"),
      v.literal("information_only"),
      v.literal("referred"),
      v.literal("converted_to_case"),
      v.literal("withdrawn"),
      v.literal("closed"),
    ),
    locale: v.union(v.literal("sw"), v.literal("en")),
    description: v.optional(v.string()),
    safeContactMethod: v.optional(v.union(
      v.literal("in_app"),
      v.literal("phone"),
      v.literal("sms"),
      v.literal("email"),
      v.literal("none"),
    )),
    preferredLanguage: v.optional(v.union(
      v.literal("sw"),
      v.literal("en"),
      v.literal("both"),
      v.literal("other"),
    )),
    preferredLanguageOther: v.optional(v.string()),
    region: v.optional(v.string()),
    district: v.optional(v.string()),
    occurredAt: v.optional(v.number()),
    desiredHelp: v.optional(v.string()),
    hasDocuments: v.optional(v.boolean()),
    urgency: v.optional(v.union(
      v.literal("standard"),
      v.literal("urgent"),
      v.literal("immediate_safety"),
    )),
    consentVersion: v.optional(v.string()),
    version: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    submittedAt: v.optional(v.number()),
  }).index("by_public_id", ["publicId"])
    .index("by_owner", ["ownerId"])
    .index("by_owner_client_request", ["ownerId", "clientRequestId"])
    .index("by_status", ["status"]),

  intake_answers: defineTable({
    requestId: v.id("legal_help_requests"),
    ownerId: v.id("users"),
    questionKey: v.string(),
    value: v.string(),
    updatedAt: v.number(),
  }).index("by_request", ["requestId"])
    .index("by_request_question", ["requestId", "questionKey"]),

  cases: defineTable({
    publicId: v.string(),
    sourceRequestId: v.id("legal_help_requests"),
    beneficiaryId: v.id("users"),
    status: v.union(
      v.literal("under_review"),
      v.literal("waiting_for_information"),
      v.literal("assignment_pending"),
      v.literal("assigned"),
      v.literal("appointment_scheduled"),
      v.literal("referred"),
      v.literal("assistance_underway"),
      v.literal("resolved"),
      v.literal("closed_unresolved"),
      v.literal("closed"),
    ),
    priority: v.union(
      v.literal("standard"),
      v.literal("urgent"),
      v.literal("safeguarding"),
    ),
    summary: v.string(),
    createdBy: v.id("users"),
    version: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    closedAt: v.optional(v.number()),
  }).index("by_public_id", ["publicId"])
    .index("by_source_request", ["sourceRequestId"])
    .index("by_beneficiary", ["beneficiaryId"])
    .index("by_status", ["status"]),

  case_participants: defineTable({
    caseId: v.id("cases"),
    userId: v.id("users"),
    role: v.union(
      v.literal("beneficiary"),
      v.literal("paralegal"),
      v.literal("case_officer"),
      v.literal("supervisor"),
      v.literal("provider_staff"),
    ),
    status: v.union(v.literal("active"), v.literal("inactive")),
    addedBy: v.id("users"),
    addedAt: v.number(),
    removedAt: v.optional(v.number()),
  }).index("by_case", ["caseId"])
    .index("by_user", ["userId"])
    .index("by_case_user", ["caseId", "userId"]),

  case_assignments: defineTable({
    caseId: v.id("cases"),
    assigneeId: v.id("users"),
    offeredBy: v.id("users"),
    status: v.union(
      v.literal("offered"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("expired"),
      v.literal("ended"),
    ),
    reason: v.optional(v.string()),
    availabilityStatus: v.optional(v.string()),
    availabilityOverrideReason: v.optional(v.string()),
    offeredAt: v.number(),
    expiresAt: v.optional(v.number()),
    respondedAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
  }).index("by_case", ["caseId"])
    .index("by_assignee_status", ["assigneeId", "status"])
    .index("by_status_expires", ["status", "expiresAt"]),

  case_events: defineTable({
    caseId: v.id("cases"),
    type: v.string(),
    actorId: v.id("users"),
    audience: v.union(v.literal("beneficiary"), v.literal("workers"), v.literal("all")),
    publicLabelKey: v.optional(v.string()),
    metadata: v.optional(v.any()),
    occurredAt: v.number(),
  }).index("by_case", ["caseId"])
    .index("by_case_time", ["caseId", "occurredAt"]),

  case_conversations: defineTable({
    caseId: v.id("cases"),
    status: v.union(v.literal("active"), v.literal("closed")),
    createdAt: v.number(),
  }).index("by_case", ["caseId"]),

  case_messages: defineTable({
    conversationId: v.id("case_conversations"),
    caseId: v.id("cases"),
    senderId: v.id("users"),
    clientMessageId: v.string(),
    type: v.union(v.literal("text"), v.literal("system")),
    body: v.string(),
    createdAt: v.number(),
  }).index("by_conversation_time", ["conversationId", "createdAt"])
    .index("by_sender_client", ["senderId", "clientMessageId"]),

  case_documents: defineTable({
    caseId: v.id("cases"),
    uploaderId: v.id("users"),
    storageId: v.optional(v.id("_storage")),
    clientDocumentId: v.string(),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    category: v.union(
      v.literal("evidence"),
      v.literal("identity"),
      v.literal("contract"),
      v.literal("letter"),
      v.literal("receipt"),
      v.literal("other"),
    ),
    textContent: v.optional(v.string()),
    source: v.optional(v.union(v.literal("upload"), v.literal("letter_builder"), v.literal("document_checker"))),
    note: v.optional(v.string()),
    status: v.union(v.literal("pending_review"), v.literal("accepted"), v.literal("rejected")),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewNotes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_case", ["caseId"])
    .index("by_case_status", ["caseId", "status"])
    .index("by_uploader_client", ["uploaderId", "clientDocumentId"]),

  case_appointments: defineTable({
    caseId: v.id("cases"),
    createdBy: v.id("users"),
    startsAt: v.number(),
    mode: v.union(v.literal("in_person"), v.literal("phone"), v.literal("remote")),
    location: v.optional(v.string()),
    status: v.union(v.literal("scheduled"), v.literal("completed"), v.literal("cancelled"), v.literal("missed")),
    statusNote: v.optional(v.string()),
    statusUpdatedBy: v.optional(v.id("users")),
    statusUpdatedAt: v.optional(v.number()),
    reminderSentAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_case", ["caseId"])
    .index("by_start", ["startsAt"])
    .index("by_status_start", ["status", "startsAt"]),

  case_outcomes: defineTable({
    caseId: v.id("cases"),
    recordedBy: v.id("users"),
    outcomeCode: v.string(),
    summary: v.string(),
    beneficiaryAgrees: v.optional(v.boolean()),
    recordedAt: v.number(),
  }).index("by_case", ["caseId"]),

  case_feedback: defineTable({
    caseId: v.id("cases"),
    beneficiaryId: v.id("users"),
    rating: v.number(),
    comment: v.optional(v.string()),
    submittedAt: v.number(),
  }).index("by_case", ["caseId"])
    .index("by_beneficiary", ["beneficiaryId"]),

  case_review_requests: defineTable({
    caseId: v.id("cases"),
    requestedBy: v.id("users"),
    reason: v.union(
      v.literal("reassignment"),
      v.literal("service_concern"),
      v.literal("safety_concern"),
      v.literal("other"),
    ),
    note: v.optional(v.string()),
    status: v.union(
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("resolved"),
      v.literal("declined"),
    ),
    resolutionNote: v.optional(v.string()),
    resolvedBy: v.optional(v.id("users")),
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_case", ["caseId"])
    .index("by_status", ["status"])
    .index("by_requester", ["requestedBy"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    titleKey: v.string(),
    bodyKey: v.string(),
    resourceType: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"]),

  notification_preferences: defineTable({
    userId: v.id("users"),
    cases: v.boolean(),
    messages: v.boolean(),
    appointments: v.boolean(),
    documents: v.boolean(),
    service: v.boolean(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  push_subscriptions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    platform: v.optional(v.string()),
    projectId: v.optional(v.string()),
    enabled: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastSeenAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_token", ["token"]),

  push_delivery_attempts: defineTable({
    notificationId: v.id("notifications"),
    userId: v.id("users"),
    token: v.string(),
    status: v.union(v.literal("sent"), v.literal("failed"), v.literal("skipped"), v.literal("receipt_ok")),
    provider: v.literal("expo"),
    error: v.optional(v.string()),
    ticketId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_notification", ["notificationId"])
    .index("by_user", ["userId"])
    .index("by_ticket", ["ticketId"]),

  justice_services: defineTable({
    name: v.string(),
    organizationName: v.optional(v.string()),
    servicePointType: v.union(
      v.literal("paralegal"),
      v.literal("legal_aid_provider"),
      v.literal("partner_organisation"),
      v.literal("government_office"),
      v.literal("local_government"),
      v.literal("police_gender_children_desk"),
      v.literal("social_welfare"),
      v.literal("court_or_tribunal"),
      v.literal("labour_service"),
      v.literal("land_service"),
      v.literal("mediation"),
      v.literal("cso"),
      v.literal("protection_service"),
      v.literal("safe_house"),
      v.literal("other"),
    ),
    classification: v.union(
      v.literal("public"),
      v.literal("community"),
      v.literal("government"),
      v.literal("private"),
      v.literal("restricted"),
    ),
    visibility: v.union(v.literal("public"), v.literal("restricted"), v.literal("confidential")),
    verificationStatus: v.union(v.literal("draft"), v.literal("verified"), v.literal("expired"), v.literal("inactive")),
    verifyingAuthority: v.optional(v.string()),
    source: v.optional(v.string()),
    lastVerifiedAt: v.optional(v.number()),
    nextReviewAt: v.optional(v.number()),
    active: v.boolean(),
    country: v.string(),
    region: v.string(),
    district: v.string(),
    council: v.optional(v.string()),
    ward: v.optional(v.string()),
    villageOrMtaa: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    physicalLocation: v.optional(v.string()),
    serviceCoverageRegions: v.array(v.string()),
    issueCategories: v.array(v.string()),
    serviceTypes: v.array(v.string()),
    jurisdiction: v.optional(v.string()),
    referralCapability: v.boolean(),
    eligibility: v.optional(v.string()),
    openingHours: v.optional(v.string()),
    walkIn: v.boolean(),
    appointmentRequired: v.boolean(),
    remoteSupport: v.boolean(),
    phoneSupport: v.boolean(),
    phone: v.optional(v.string()),
    currentIntakeState: v.union(v.literal("open"), v.literal("limited"), v.literal("closed"), v.literal("emergency_only")),
    capacity: v.optional(v.number()),
    emergencyCapability: v.boolean(),
    languages: v.array(v.string()),
    disabilityAccess: v.optional(v.string()),
    privacyAvailable: v.boolean(),
    genderSensitive: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_active_visibility", ["active", "visibility"])
    .index("by_verification", ["verificationStatus"])
    .index("by_region", ["region"])
    .index("by_district", ["district"])
    .index("by_type", ["servicePointType"]),

  matching_decisions: defineTable({
    requesterId: v.optional(v.id("users")),
    requestId: v.optional(v.id("legal_help_requests")),
    caseId: v.optional(v.id("cases")),
    source: v.union(v.literal("navigator"), v.literal("saada"), v.literal("staff"), v.literal("directory")),
    issueCategory: v.optional(v.string()),
    ordinaryProblem: v.optional(v.string()),
    region: v.optional(v.string()),
    district: v.optional(v.string()),
    urgency: v.optional(v.union(v.literal("standard"), v.literal("urgent"), v.literal("immediate_safety"))),
    recommendedServiceIds: v.array(v.id("justice_services")),
    explanation: v.array(v.string()),
    safetyFlags: v.array(v.string()),
    modelAssisted: v.boolean(),
    createdAt: v.number(),
  }).index("by_requester", ["requesterId"])
    .index("by_request", ["requestId"])
    .index("by_case", ["caseId"])
    .index("by_created", ["createdAt"]),

  referrals: defineTable({
    publicId: v.string(),
    caseId: v.id("cases"),
    requestId: v.optional(v.id("legal_help_requests")),
    sourceServiceId: v.optional(v.id("justice_services")),
    destinationServiceId: v.id("justice_services"),
    destinationUserId: v.optional(v.id("users")),
    createdBy: v.id("users"),
    beneficiaryId: v.id("users"),
    reason: v.string(),
    informationShared: v.array(v.string()),
    consentId: v.optional(v.id("consents")),
    consentCollectedAt: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("consent_collected"),
      v.literal("created"),
      v.literal("destination_notified"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("scheduled"),
      v.literal("service_delivered"),
      v.literal("referred_onward"),
      v.literal("closed"),
      v.literal("returned"),
      v.literal("escalated"),
    ),
    declineReason: v.optional(v.string()),
    onwardReferralId: v.optional(v.id("referrals")),
    finalDisposition: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    closedAt: v.optional(v.number()),
  }).index("by_case", ["caseId"])
    .index("by_beneficiary", ["beneficiaryId"])
    .index("by_destination_status", ["destinationServiceId", "status"])
    .index("by_destination_user_status", ["destinationUserId", "status"])
    .index("by_status", ["status"])
    .index("by_public_id", ["publicId"]),

  referral_events: defineTable({
    referralId: v.id("referrals"),
    caseId: v.id("cases"),
    actorId: v.id("users"),
    type: v.string(),
    publicLabelKey: v.optional(v.string()),
    note: v.optional(v.string()),
    metadata: v.optional(v.any()),
    occurredAt: v.number(),
  }).index("by_referral", ["referralId"])
    .index("by_case", ["caseId"])
    .index("by_referral_time", ["referralId", "occurredAt"]),

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
    storageId: v.optional(v.id("_storage")), // Convex Storage ID
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
    availabilityStatus: v.optional(v.union(
      v.literal("accepting_cases"),
      v.literal("limited"),
      v.literal("paused"),
      v.literal("unavailable"),
    )),
    weeklyCapacity: v.optional(v.number()),
    workingHours: v.optional(v.string()),
    availabilityNotes: v.optional(v.string()),
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
      v.literal("news_read"),
      v.literal("news_click"),
      v.literal("publication_download"),
      v.literal("paralegal_page_view"),
      v.literal("paralegal_signup_start"),
      v.literal("paralegal_signup_complete"),
      v.literal("sara_session_start"),
      v.literal("chat_topic"),
      v.literal("opportunity_view"),
      v.literal("opportunity_apply_click"),
      v.literal("story_view"),
      v.literal("donation_click"),
      v.literal("click"),
      v.literal("search")
    ),
    resourceId: v.optional(v.string()), // Page URL, document ID, etc.
    resourceType: v.optional(v.string()), // 'publication', 'news', 'program', etc.
    meta: v.optional(v.any()), // Additional context
    userId: v.string(), // Clerk ID or "anonymous"
    visitorId: v.optional(v.string()), // Persistent anonymous UUID
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
