import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users (Synced from Clerk) - GDPR compliant with soft delete
  users: defineTable({
    name: v.string(),
    email: v.string(),
    phoneNumber: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("staff"), v.literal("safeguarding_officer"), v.literal("paralegal"), v.literal("stakeholder"), v.literal("user")),
    clerkId: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.string()), // For Convex Storage
    bio: v.optional(v.string()), // User biography
    lastLogin: v.optional(v.number()),
    // GDPR: Soft delete support for audit trails
    isDeleted: v.optional(v.boolean()),
    deletedAt: v.optional(v.number()),
  }).index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .searchIndex("search_name", { searchField: "name" })
    .searchIndex("search_email", { searchField: "email" }),

  // Additive role assignments allow scoped and multiple roles while legacy users.role
  // remains available during migration.
  provider_invitations: defineTable({
    organizationId: v.id("justice_service_organizations"),
    email: v.string(),
    invitedBy: v.id("users"),
    createdAt: v.number(),
    expiresAt: v.number(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("declined"), v.literal("cancelled")),
    accessRequestId: v.optional(v.id("access_requests")),
  }).index("by_email_status", ["email", "status"])
    .index("by_organization", ["organizationId"]),
  access_requests: defineTable({
    userId: v.id("users"),
    requestedRole: v.union(v.literal("staff"), v.literal("content_editor"), v.literal("provider_staff"), v.literal("stakeholder"), v.literal("donor")),
    organizationName: v.string(),
    statement: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    submittedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.id("users")),
    decisionNote: v.optional(v.string()),
    organizationId: v.optional(v.id("justice_service_organizations")),
    invitationId: v.optional(v.id("provider_invitations")),
  }).index("by_user_status", ["userId", "status"])
    .index("by_status_submitted", ["status", "submittedAt"]),

  role_assignments: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("staff"),
      v.literal("safeguarding_officer"),
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
    .index("by_role_status", ["role", "status"])
    .index("by_organization", ["organizationId"]),

  role_revocation_requests: defineTable({
    assignmentId: v.id("role_assignments"),
    targetUserId: v.id("users"),
    reason: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    requestedBy: v.id("users"),
    requestedAt: v.number(),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewNote: v.optional(v.string()),
  }).index("by_status", ["status"]).index("by_assignment", ["assignmentId"])
    .index("by_assignment_status", ["assignmentId", "status"]),

  base_role_change_requests: defineTable({
    targetUserId: v.id("users"),
    previousRole: v.union(v.literal("admin"), v.literal("staff"), v.literal("safeguarding_officer"), v.literal("paralegal"), v.literal("stakeholder")),
    reason: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    requestedBy: v.id("users"),
    requestedAt: v.number(),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewNote: v.optional(v.string()),
  }).index("by_target", ["targetUserId"]).index("by_status", ["status"])
    .index("by_target_status", ["targetUserId", "status"]),

  directory_correction_requests: defineTable({
    serviceId: v.id("justice_services"),
    organizationId: v.id("justice_service_organizations"),
    requestedBy: v.id("users"),
    reason: v.string(),
    proposedDetails: v.string(),
    status: v.union(v.literal("pending"), v.literal("applied"), v.literal("rejected")),
    submittedAt: v.number(),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewNote: v.optional(v.string()),
    linkedServiceUpdateAt: v.optional(v.number()),
    linkedServiceUpdateBy: v.optional(v.id("users")),
    linkedServiceUpdateNote: v.optional(v.string()),
  }).index("by_status", ["status"]).index("by_organization", ["organizationId"]),

  saada_evaluation_cases: defineTable({
    question: v.string(),
    language: v.union(v.literal("sw"), v.literal("en")),
    topic: v.string(),
    expectedBehavior: v.string(),
    riskLevel: v.union(v.literal("standard"), v.literal("high")),
    status: v.union(v.literal("active"), v.literal("retired")),
    createdBy: v.id("users"),
    createdAt: v.number(),
    replacesCaseId: v.optional(v.id("saada_evaluation_cases")),
    replacedByCaseId: v.optional(v.id("saada_evaluation_cases")),
  }).index("by_status", ["status"]),

  saada_evaluation_reviews: defineTable({
    caseId: v.id("saada_evaluation_cases"),
    messageId: v.optional(v.id("sara_chats")),
    questionAsked: v.optional(v.string()),
    retrievedSources: v.optional(v.array(v.object({ documentId: v.string(), title: v.string(), publisher: v.optional(v.string()), versionLabel: v.optional(v.string()), sourceUrl: v.optional(v.string()) }))),
    observedAnswer: v.string(),
    verdict: v.union(v.literal("pass"), v.literal("fail"), v.literal("needs_legal_review")),
    reviewNote: v.string(),
    reviewerId: v.id("users"),
    reviewedAt: v.number(),
  }).index("by_case", ["caseId"]).index("by_case_message", ["caseId", "messageId"]),

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
      v.literal("in_app"),
    )),
    statement: v.optional(v.string()),
    evidenceNote: v.optional(v.string()),
    evidenceStorageId: v.optional(v.id("_storage")),
    evidenceFileName: v.optional(v.string()),
    evidenceFileType: v.optional(v.string()),
    evidenceFileSize: v.optional(v.number()),
    retentionUntil: v.optional(v.number()),
    retentionStatus: v.optional(v.union(v.literal("active"), v.literal("expired"), v.literal("hold"))),
    reviewStatus: v.optional(v.union(v.literal("pending_review"), v.literal("accepted"), v.literal("rejected"))),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewNotes: v.optional(v.string()),
    informationShared: v.optional(v.array(v.string())),
    relatedCaseId: v.optional(v.id("cases")),
    relatedReferralId: v.optional(v.id("referrals")),
    destinationServiceId: v.optional(v.id("justice_services")),
    recordedBy: v.optional(v.id("users")),
    recordedAt: v.number(),
    withdrawnAt: v.optional(v.number()),
  }).index("by_user_type", ["userId", "type"])
    .index("by_type_review", ["type", "reviewStatus"])
    .index("by_type_retention", ["type", "retentionStatus", "retentionUntil"]),

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
    issueCategory: v.optional(v.union(v.literal("employment"), v.literal("land"), v.literal("family"), v.literal("safety"), v.literal("consumer"), v.literal("other"))),
    sourceServiceId: v.optional(v.id("justice_services")),
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
    involvedParties: v.optional(v.string()),
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
    triageStartedAt: v.optional(v.number()),
  }).index("by_public_id", ["publicId"])
    .index("by_owner", ["ownerId"])
    .index("by_owner_client_request", ["ownerId", "clientRequestId"])
    .index("by_submitted_at", ["submittedAt"])
    .index("by_status", ["status"]),

  intake_answers: defineTable({
    requestId: v.id("legal_help_requests"),
    ownerId: v.id("users"),
    questionKey: v.string(),
    value: v.string(),
    updatedAt: v.number(),
  }).index("by_request", ["requestId"])
    .index("by_request_question", ["requestId", "questionKey"]),

  request_attachments: defineTable({
    requestId: v.id("legal_help_requests"),
    ownerId: v.id("users"),
    storageId: v.id("_storage"),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    note: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_request", ["requestId"])
    .index("by_owner", ["ownerId"]),

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
    organizationId: v.optional(v.id("justice_service_organizations")),
    scopeReviewDecision: v.optional(v.union(v.literal("organisation"), v.literal("independent"))),
    scopeReviewedBy: v.optional(v.id("users")),
    scopeReviewedAt: v.optional(v.number()),
    scopeReviewReason: v.optional(v.string()),
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
    .index("by_case_user", ["caseId", "userId"])
    .index("by_role_scope_review_status", ["role", "organizationId", "scopeReviewDecision", "status"]),

  case_assignments: defineTable({
    caseId: v.id("cases"),
    assigneeId: v.id("users"),
    organizationId: v.optional(v.id("justice_service_organizations")),
    assigneeRole: v.optional(v.union(v.literal("paralegal"), v.literal("provider_staff"))),
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

  case_tasks: defineTable({
    caseId: v.id("cases"),
    assigneeId: v.id("users"),
    createdBy: v.id("users"),
    title: v.string(),
    note: v.optional(v.string()),
    status: v.union(v.literal("open"), v.literal("done"), v.literal("cancelled")),
    dueAt: v.optional(v.number()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_assignee_status", ["assigneeId", "status"])
    .index("by_case", ["caseId"]),

  paralegal_support_requests: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("supervisor"), v.literal("peer_support"), v.literal("wellbeing"), v.literal("challenging_case"), v.literal("payment")),
    note: v.string(),
    status: v.union(v.literal("submitted"), v.literal("in_review"), v.literal("responded"), v.literal("closed")),
    responseNote: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    respondedAt: v.optional(v.number()),
  }).index("by_user_status", ["userId", "status"])
    .index("by_status", ["status"]),

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
    type: v.union(v.literal("text"), v.literal("voice"), v.literal("system")),
    body: v.string(),
    storageId: v.optional(v.id("_storage")),
    mimeType: v.optional(v.string()),
    durationMs: v.optional(v.number()),
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
    pushEnabled: v.optional(v.boolean()),
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

  justice_service_organizations: defineTable({
    name: v.string(),
    organizationType: v.union(
      v.literal("lsf"),
      v.literal("legal_aid_provider"),
      v.literal("government"),
      v.literal("cso"),
      v.literal("community_paralegal_network"),
      v.literal("private_provider"),
      v.literal("donor_partner"),
      v.literal("other"),
    ),
    verificationStatus: v.union(v.literal("draft"), v.literal("verified"), v.literal("suspended"), v.literal("inactive")),
    referralAgreementStatus: v.union(v.literal("none"), v.literal("draft"), v.literal("active"), v.literal("expired"), v.literal("suspended")),
    focalPersonName: v.optional(v.string()),
    focalPersonEmail: v.optional(v.string()),
    focalPersonPhone: v.optional(v.string()),
    slaHours: v.optional(v.number()),
    safeguardingReady: v.boolean(),
    dataSharingAgreementVersion: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdBy: v.id("users"),
    lastMaterialEditedBy: v.optional(v.id("users")),
    verifiedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status", ["verificationStatus"])
    .index("by_referral_agreement", ["referralAgreementStatus"])
    .searchIndex("search_name", { searchField: "name" }),

  justice_services: defineTable({
    name: v.string(),
    organizationId: v.optional(v.id("justice_service_organizations")),
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
    lastMaterialEditedBy: v.optional(v.id("users")),
    verifiedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_active_visibility", ["active", "visibility"])
    .index("by_organization", ["organizationId"])
    .index("by_verification", ["verificationStatus"])
    .searchIndex("search_name", { searchField: "name" })
    .searchIndex("search_region", { searchField: "region" })
    .searchIndex("search_district", { searchField: "district" })
    .index("by_region", ["region"])
    .index("by_district", ["district"])
    .index("by_type", ["servicePointType"]),

  saved_justice_services: defineTable({
    userId: v.id("users"),
    serviceId: v.id("justice_services"),
    savedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_service", ["userId", "serviceId"]),

  justice_service_visits: defineTable({
    userId: v.id("users"),
    serviceId: v.id("justice_services"),
    plannedFor: v.number(),
    channel: v.union(v.literal("in_person"), v.literal("phone"), v.literal("remote")),
    status: v.union(v.literal("planned"), v.literal("completed"), v.literal("cancelled")),
    outcome: v.optional(v.union(v.literal("helpful"), v.literal("partly_helpful"), v.literal("not_helpful"))),
    note: v.optional(v.string()),
    createdAt: v.number(),
    checkedInAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_user_service", ["userId", "serviceId"])
    .index("by_created_at", ["createdAt"])
    .index("by_checked_in_at", ["checkedInAt"]),

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
    reviewStatus: v.optional(v.union(
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("needs_changes"),
      v.literal("escalated"),
      v.literal("restricted"),
    )),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewNote: v.optional(v.string()),
    restrictionReason: v.optional(v.string()),
    modelAssisted: v.boolean(),
    createdAt: v.number(),
  }).index("by_requester", ["requesterId"])
    .index("by_request", ["requestId"])
    .index("by_case", ["caseId"])
    .index("by_review_status", ["reviewStatus"])
    .index("by_created", ["createdAt"]),

  metric_definitions: defineTable({
    key: v.string(),
    version: v.string(),
    label: v.string(),
    ownerRole: v.string(),
    formula: v.string(),
    sourceTables: v.array(v.string()),
    suppressionThreshold: v.number(),
    status: v.union(v.literal("draft"), v.literal("approved"), v.literal("retired")),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    rejectedBy: v.optional(v.id("users")),
    rejectedAt: v.optional(v.number()),
    reviewNote: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_key_version", ["key", "version"])
    .index("by_status", ["status"]),

  metric_snapshots: defineTable({
    periodStart: v.number(),
    periodEnd: v.number(),
    generatedBy: v.id("users"),
    generatedAt: v.number(),
    approvalStatus: v.union(v.literal("draft"), v.literal("approved"), v.literal("rejected")),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    rejectedBy: v.optional(v.id("users")),
    rejectedAt: v.optional(v.number()),
    reviewNote: v.optional(v.string()),
    definitionVersion: v.string(),
    values: v.any(),
    qualityFlags: v.array(v.string()),
    publicSummary: v.string(),
  }).index("by_period", ["periodStart", "periodEnd"])
    .index("by_status_generated", ["approvalStatus", "generatedAt"]),

  report_share_events: defineTable({
    snapshotId: v.id("metric_snapshots"),
    initiatedBy: v.id("users"),
    initiatedAt: v.number(),
    channel: v.literal("device_share_sheet"),
  }).index("by_snapshot", ["snapshotId", "initiatedAt"]),

  referrals: defineTable({
    publicId: v.string(),
    caseId: v.id("cases"),
    requestId: v.optional(v.id("legal_help_requests")),
    sourceServiceId: v.optional(v.id("justice_services")),
    destinationServiceId: v.id("justice_services"),
    destinationUserId: v.optional(v.id("users")),
    parentReferralId: v.optional(v.id("referrals")),
    createdBy: v.id("users"),
    beneficiaryId: v.id("users"),
    reason: v.string(),
    informationShared: v.array(v.string()),
    consentId: v.optional(v.id("consents")),
    consentCollectedAt: v.optional(v.number()),
    status: v.union(
      v.literal("draft"),
      v.literal("awaiting_beneficiary_consent"),
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
    .index("by_parent", ["parentReferralId"])
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
    .index("by_referral_time", ["referralId", "occurredAt"])
    .index("by_occurred_at", ["occurredAt"]),

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

  // Mobile practical guides are governed separately from website publications.
  legal_guides: defineTable({
    titleSw: v.string(), titleEn: v.string(),
    summarySw: v.string(), summaryEn: v.string(),
    stepsSw: v.array(v.string()), stepsEn: v.array(v.string()),
    category: v.string(), jurisdiction: v.union(v.literal("tanzania_mainland"), v.literal("zanzibar"), v.literal("national")),
    sourceTitle: v.string(), sourceUrl: v.string(), publisher: v.string(),
    reviewDueAt: v.number(), version: v.number(),
    replacesGuideId: v.optional(v.id("legal_guides")),
    resubmitsGuideId: v.optional(v.id("legal_guides")),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("retired")),
    submittedBy: v.id("users"), submittedAt: v.number(),
    reviewedBy: v.optional(v.id("users")), reviewedAt: v.optional(v.number()), reviewNote: v.optional(v.string()),
  }).index("by_status", ["status"]).index("by_submitted_by", ["submittedBy"])
    .index("by_status_review_due", ["status", "reviewDueAt"])
    .index("by_submitter_status_review_due", ["submittedBy", "status", "reviewDueAt"])
    .index("by_replaces_status", ["replacesGuideId", "status"])
    .index("by_resubmits_status", ["resubmitsGuideId", "status"]),

  paralegal_training_modules: defineTable({
    titleSw: v.string(), titleEn: v.string(), contentSw: v.string(), contentEn: v.string(),
    topic: v.string(), sourceTitle: v.string(), sourceUrl: v.string(),
    required: v.boolean(), reviewDueAt: v.number(), version: v.number(),
    replacesModuleId: v.optional(v.id("paralegal_training_modules")),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("retired")),
    submittedBy: v.id("users"), submittedAt: v.number(),
    reviewedBy: v.optional(v.id("users")), reviewedAt: v.optional(v.number()), reviewNote: v.optional(v.string()),
  }).index("by_status", ["status"])
    .index("by_replaces_status", ["replacesModuleId", "status"]),
  paralegal_training_completions: defineTable({
    moduleId: v.id("paralegal_training_modules"), userId: v.id("users"),
    completedAt: v.number(), moduleVersion: v.number(),
  }).index("by_user_module", ["userId", "moduleId"]),

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
    imageStorageId: v.optional(v.id("_storage")),
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
    intakeOrigin: v.optional(v.union(v.literal("manual_invitation"), v.literal("csv_invitation"))),
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
    resumeStorageId: v.optional(v.id("_storage")),
    idDocumentStorageId: v.optional(v.id("_storage")),
    certificateStorageId: v.optional(v.id("_storage")),
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
    ethicsAcceptedAt: v.optional(v.number()),
    codeOfConductAcceptedAt: v.optional(v.number()),
    safeguardingTrainingCompletedAt: v.optional(v.number()),
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
    publisher: v.optional(v.string()),
    jurisdiction: v.optional(v.union(v.literal("tanzania_mainland"), v.literal("zanzibar"), v.literal("national"), v.literal("other"))),
    language: v.optional(v.union(v.literal("sw"), v.literal("en"), v.literal("bilingual"), v.literal("other"))),
    contentCategory: v.optional(v.string()),
    versionLabel: v.optional(v.string()),
    replacesDocumentId: v.optional(v.id("documents")),
    effectiveDate: v.optional(v.string()),
    reviewDueAt: v.optional(v.number()),
    metadata: v.optional(v.any()), // PDF metadata
    uploadedAt: v.number(),
    processedAt: v.optional(v.number()),
    indexingStatus: v.optional(v.union(v.literal("processing"), v.literal("ready"), v.literal("failed"))),
    indexingError: v.optional(v.string()),
    lastReviewedAt: v.optional(v.number()), // For content freshness alerts
    approvalStatus: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("withdrawn"))),
    uploadedByClerkId: v.optional(v.string()),
    reviewedBy: v.optional(v.id("users")),
    reviewNote: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
  }).index("by_storageId", ["storageId"])
    .index("by_approval_status", ["approvalStatus"])
    .index("by_approval_review_due", ["approvalStatus", "reviewDueAt"])
    .index("by_replaces_approval", ["replacesDocumentId", "approvalStatus"]),

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
  sara_conversations: defineTable({
    userId: v.string(),
    title: v.string(),
    updatedAt: v.number(),
  }).index("by_user_updated", ["userId", "updatedAt"]),

  sara_chats: defineTable({
    userId: v.string(), // Clerk ID
    conversationId: v.optional(v.id("sara_conversations")),
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
    .index("by_user_conversation", ["userId", "conversationId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_user_role_time", ["userId", "role", "timestamp"]),

  // SARA Feedback (for detailed analytics)
  sara_feedback: defineTable({
    messageId: v.id("sara_chats"),
    userId: v.string(),
    rating: v.union(v.literal("positive"), v.literal("negative")),
    comment: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_rating", ["rating"])
    .index("by_timestamp", ["timestamp"]),

  // Saada AI risk events for safety, governance, and donor audit review.
  saada_risk_events: defineTable({
    userId: v.string(),
    eventType: v.union(
      v.literal("emergency_keyword"),
      v.literal("low_confidence"),
      v.literal("tool_routing"),
      v.literal("policy_block"),
      v.literal("normal_response"),
    ),
    source: v.union(v.literal("web"), v.literal("mobile"), v.literal("unknown")),
    messagePreview: v.string(),
    metadata: v.optional(v.any()),
    dispositionStatus: v.optional(v.union(
      v.literal("open"),
      v.literal("reviewed"),
      v.literal("escalated"),
      v.literal("case_follow_up"),
      v.literal("false_positive"),
    )),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewNote: v.optional(v.string()),
    followUpStatus: v.optional(v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"))),
    followUpOwnerId: v.optional(v.id("users")),
    followUpClaimedAt: v.optional(v.number()),
    followUpCompletedAt: v.optional(v.number()),
    followUpOutcome: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_event_type", ["eventType"])
    .index("by_disposition", ["dispositionStatus"])
    .index("by_created", ["createdAt"]),

  saada_activity_events: defineTable({
    userId: v.string(),
    requestId: v.string(),
    source: v.union(v.literal("web"), v.literal("mobile"), v.literal("unknown")),
    type: v.union(
      v.literal("intent_detected"),
      v.literal("risk_check_started"),
      v.literal("risk_check_completed"),
      v.literal("knowledge_search_started"),
      v.literal("knowledge_search_completed"),
      v.literal("pathway_lookup_started"),
      v.literal("pathway_lookup_completed"),
      v.literal("service_search_started"),
      v.literal("service_search_completed"),
      v.literal("matching_started"),
      v.literal("matching_completed"),
      v.literal("document_analysis_started"),
      v.literal("document_analysis_completed"),
      v.literal("draft_started"),
      v.literal("draft_completed"),
      v.literal("confirmation_required"),
      v.literal("tool_execution_started"),
      v.literal("tool_execution_completed"),
      v.literal("human_review_requested"),
      v.literal("waiting_external_response"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    status: v.union(v.literal("started"), v.literal("completed"), v.literal("failed"), v.literal("waiting")),
    labelKey: v.string(),
    summary: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_user_request_time", ["userId", "requestId", "createdAt"])
    .index("by_user_time", ["userId", "createdAt"])
    .index("by_type_time", ["type", "createdAt"]),

  // SARA Configuration (System Prompt, etc.)
  sara_config: defineTable({
    key: v.string(), // e.g. 'system_prompt'
    value: v.string(),
  }).index("by_key", ["key"]),

  saada_prompt_versions: defineTable({
    prompt: v.string(),
    version: v.number(),
    changeNote: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("retired")),
    submittedBy: v.id("users"),
    submittedAt: v.number(),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewNote: v.optional(v.string()),
  }).index("by_status", ["status"])
    .index("by_version", ["version"]),

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

  // Aggregate-only journey telemetry. No user, case, search or location data.
  journey_daily_counts: defineTable({
    day: v.string(),
    surface: v.union(v.literal("web"), v.literal("mobile")),
    step: v.union(
      v.literal("find_help_search"),
      v.literal("find_help_no_results"),
      v.literal("request_review"),
      v.literal("service_call_open"),
      v.literal("service_directions_open"),
    ),
    count: v.number(),
    updatedAt: v.number(),
  }).index("by_day", ["day"])
    .index("by_day_surface_step", ["day", "surface", "step"]),

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
