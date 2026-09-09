import { mutation } from "./_generated/server";
import { requireAnyRole, requireAuthenticatedUser } from "./lib/auth";

const mobileDirectorySeed = [
  {
    fullName: "Rehema Mwanga",
    email: "rehema.mwanga.seed@lsf.or.tz",
    phone: "+255712345678",
    whatsapp: "+255712345678",
    region: "Dar es Salaam",
    district: "Kinondoni",
    ward: "Mikocheni",
    education: "Diploma in Law",
    experience: "5+ years supporting employment, land, and family matters.",
    motivation: "Seeded for Haki Yangu mobile directory QA.",
    languages: ["Swahili", "English"],
    bio: "Helps individuals and families resolve employment, land, and family issues through clear guidance and practical support.",
    specializations: ["Employment", "Land", "Family"],
    availabilityStatus: "accepting_cases" as const,
    weeklyCapacity: 12,
    workingHours: "Mon - Sat, 8:00 AM - 6:00 PM",
  },
  {
    fullName: "Juma Khatibu",
    email: "juma.khatibu.seed@lsf.or.tz",
    phone: "+255713456789",
    whatsapp: "+255713456789",
    region: "Dar es Salaam",
    district: "Ilala",
    ward: "Kariakoo",
    education: "Certificate in Legal Aid",
    experience: "4+ years supporting workers, tenants, and consumer complaints.",
    motivation: "Seeded for Haki Yangu mobile directory QA.",
    languages: ["Swahili"],
    bio: "Supports workers, consumers, and tenants with documentation, referrals, and follow-up steps.",
    specializations: ["Employment", "Consumer", "Tenancy"],
    availabilityStatus: "limited" as const,
    weeklyCapacity: 8,
    workingHours: "Mon - Fri, 9:00 AM - 5:00 PM",
  },
  {
    fullName: "Asha Mohamed",
    email: "asha.mohamed.seed@lsf.or.tz",
    phone: "+255714567890",
    whatsapp: "+255714567890",
    region: "Arusha",
    district: "Arusha DC",
    ward: "Moshono",
    education: "Community Paralegal Training",
    experience: "6+ years supporting family, land, and GBV-sensitive referrals.",
    motivation: "Seeded for Haki Yangu mobile directory QA.",
    languages: ["Swahili", "English"],
    bio: "Focused on family, land, and GBV-sensitive referrals with privacy-first support.",
    specializations: ["Family", "Land", "Safety"],
    availabilityStatus: "accepting_cases" as const,
    weeklyCapacity: 10,
    workingHours: "Mon - Sat, 8:30 AM - 5:30 PM",
  },
];

const justiceServiceSeed = [
  {
    name: "Kinondoni Community Paralegal Desk",
    organizationName: "LSF Partner Network",
    servicePointType: "paralegal" as const,
    classification: "community" as const,
    visibility: "public" as const,
    verificationStatus: "verified" as const,
    verifyingAuthority: "LSF",
    source: "LSF verified provider list",
    country: "Tanzania",
    region: "Dar es Salaam",
    district: "Kinondoni",
    ward: "Mikocheni",
    serviceCoverageRegions: ["Dar es Salaam"],
    issueCategories: ["employment", "land", "family", "consumer"],
    serviceTypes: ["legal_information", "document_support", "referral", "case_follow_up"],
    jurisdiction: "Community legal aid and referral support",
    referralCapability: true,
    eligibility: "Community members seeking practical legal-information support.",
    openingHours: "Mon - Sat, 8:00 AM - 6:00 PM",
    walkIn: true,
    appointmentRequired: false,
    remoteSupport: true,
    phoneSupport: true,
    phone: "+255712345678",
    currentIntakeState: "open" as const,
    capacity: 12,
    emergencyCapability: false,
    languages: ["Swahili", "English"],
    disabilityAccess: "Call ahead for accessibility arrangements.",
    privacyAvailable: true,
    genderSensitive: true,
  },
  {
    name: "Ilala Labour Support Referral Point",
    organizationName: "LSF Partner Network",
    servicePointType: "labour_service" as const,
    classification: "public" as const,
    visibility: "public" as const,
    verificationStatus: "verified" as const,
    verifyingAuthority: "LSF",
    source: "LSF verified service directory seed",
    country: "Tanzania",
    region: "Dar es Salaam",
    district: "Ilala",
    ward: "Kariakoo",
    serviceCoverageRegions: ["Dar es Salaam"],
    issueCategories: ["employment", "unpaid salary", "workplace dispute"],
    serviceTypes: ["labour_guidance", "referral", "appointment"],
    jurisdiction: "Employment and labour-related service navigation",
    referralCapability: true,
    eligibility: "Workers needing employment or unpaid wage support.",
    openingHours: "Mon - Fri, 9:00 AM - 5:00 PM",
    walkIn: false,
    appointmentRequired: true,
    remoteSupport: false,
    phoneSupport: true,
    phone: "+255713456789",
    currentIntakeState: "limited" as const,
    capacity: 8,
    emergencyCapability: false,
    languages: ["Swahili"],
    privacyAvailable: true,
    genderSensitive: false,
  },
  {
    name: "Arusha Family and Protection Referral Desk",
    organizationName: "LSF Partner Network",
    servicePointType: "protection_service" as const,
    classification: "restricted" as const,
    visibility: "public" as const,
    verificationStatus: "verified" as const,
    verifyingAuthority: "LSF",
    source: "LSF verified service directory seed",
    country: "Tanzania",
    region: "Arusha",
    district: "Arusha DC",
    ward: "Moshono",
    serviceCoverageRegions: ["Arusha"],
    issueCategories: ["family", "safety", "gbv", "child protection"],
    serviceTypes: ["safeguarding_triage", "referral", "case_follow_up"],
    jurisdiction: "Family and protection-sensitive referral support",
    referralCapability: true,
    eligibility: "People needing private family or safety-related support.",
    openingHours: "Mon - Sat, 8:30 AM - 5:30 PM",
    walkIn: false,
    appointmentRequired: true,
    remoteSupport: true,
    phoneSupport: true,
    phone: "+255714567890",
    currentIntakeState: "open" as const,
    capacity: 10,
    emergencyCapability: true,
    languages: ["Swahili", "English"],
    disabilityAccess: "Contact first for safe accessibility planning.",
    privacyAvailable: true,
    genderSensitive: true,
  },
];

export const seedMobileDirectory = mutation({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    const now = Date.now();
    let inserted = 0;
    let updated = 0;

    for (const item of mobileDirectorySeed) {
      const existing = await ctx.db
        .query("paralegal_applications")
        .withIndex("by_email", (q) => q.eq("email", item.email))
        .first();

      const record = {
        ...item,
        status: "approved" as const,
        isVerified: true,
        submittedAt: existing?.submittedAt ?? now,
        approvedAt: existing?.approvedAt ?? now,
        reviewedAt: now,
        reviewedBy: user.email,
        reviewNotes: "Approved seed record for Haki Yangu mobile QA. Replace with live verified provider records before production.",
        profileViews: existing?.profileViews ?? 0,
        hasJoinedHakiYangu: existing?.hasJoinedHakiYangu ?? false,
        onboardingCompleted: true,
      };

      if (existing) {
        await ctx.db.patch(existing._id, record);
        updated += 1;
      } else {
        await ctx.db.insert("paralegal_applications", record);
        inserted += 1;
      }
    }

    return {
      success: true,
      inserted,
      updated,
      total: mobileDirectorySeed.length,
    };
  },
});

export const seedJusticeServices = mutation({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    const now = Date.now();
    let inserted = 0;
    let updated = 0;

    for (const item of justiceServiceSeed) {
      const existing = (await ctx.db.query("justice_services").collect()).find(
        (service) => service.name.toLowerCase() === item.name.toLowerCase() && service.district === item.district,
      );
      const record = {
        ...item,
        active: true,
        lastVerifiedAt: now,
        nextReviewAt: now + 1000 * 60 * 60 * 24 * 180,
        createdBy: existing?.createdBy ?? user._id,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      if (existing) {
        await ctx.db.patch(existing._id, record);
        updated += 1;
      } else {
        await ctx.db.insert("justice_services", record);
        inserted += 1;
      }
    }

    return {
      success: true,
      inserted,
      updated,
      total: justiceServiceSeed.length,
    };
  },
});

export const seedMyMobileQaMatter = mutation({
  args: {},
  handler: async (ctx) => {
    if (process.env.HAKI_ALLOW_MOBILE_QA_SEED !== "true") {
      throw new Error("Mobile QA seed is disabled. Set HAKI_ALLOW_MOBILE_QA_SEED=true only in development or staging.");
    }

    const { user } = await requireAuthenticatedUser(ctx);
    const now = Date.now();
    const clientRequestId = "haki-yangu-mobile-qa-matter-v1";
    const existingRequest = await ctx.db
      .query("legal_help_requests")
      .withIndex("by_owner_client_request", (q) => q.eq("ownerId", user._id).eq("clientRequestId", clientRequestId))
      .first();

    if (existingRequest) {
      const existingCase = await ctx.db
        .query("cases")
        .withIndex("by_source_request", (q) => q.eq("sourceRequestId", existingRequest._id))
        .first();
      return { success: true, requestId: existingRequest._id, caseId: existingCase?._id, existing: true };
    }

    const requestId = await ctx.db.insert("legal_help_requests", {
      publicId: `HY-QA-${String(now).slice(-6)}`,
      ownerId: user._id,
      clientRequestId,
      status: "converted_to_case",
      locale: "en",
      description: "Synthetic QA matter: unpaid salary after two months of work. Created for authenticated mobile presentation testing.",
      safeContactMethod: "in_app",
      preferredLanguage: "both",
      region: "Dar es Salaam",
      district: "Ilala",
      occurredAt: now - 1000 * 60 * 60 * 24 * 12,
      desiredHelp: "Understand next steps, prepare evidence, and book support with a verified paralegal.",
      hasDocuments: true,
      urgency: "standard",
      consentVersion: "qa-seed-v1",
      version: 1,
      createdAt: now,
      updatedAt: now,
      submittedAt: now,
    });

    await ctx.db.insert("intake_answers", {
      requestId,
      ownerId: user._id,
      questionKey: "plain_language_problem",
      value: "My employer has not paid me for two months.",
      updatedAt: now,
    });

    const caseId = await ctx.db.insert("cases", {
      publicId: `HY-${new Date(now).getFullYear()}-${String(now).slice(-6)}`,
      sourceRequestId: requestId,
      beneficiaryId: user._id,
      status: "appointment_scheduled",
      priority: "standard",
      summary: "Unpaid salary request. Evidence checklist prepared and appointment scheduled for next-step support.",
      createdBy: user._id,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("case_participants", {
      caseId,
      userId: user._id,
      role: "beneficiary",
      status: "active",
      addedBy: user._id,
      addedAt: now,
    });

    const conversationId = await ctx.db.insert("case_conversations", {
      caseId,
      status: "active",
      createdAt: now,
    });

    await ctx.db.insert("case_events", {
      caseId,
      actorId: user._id,
      type: "request_submitted",
      audience: "all",
      publicLabelKey: "case.timeline.requestSubmitted",
      metadata: { seeded: true, requestId },
      occurredAt: now,
    });
    await ctx.db.insert("case_events", {
      caseId,
      actorId: user._id,
      type: "appointment_created",
      audience: "all",
      publicLabelKey: "case.timeline.appointmentScheduled",
      metadata: { seeded: true },
      occurredAt: now + 1000,
    });

    await ctx.db.insert("case_messages", {
      conversationId,
      caseId,
      senderId: user._id,
      clientMessageId: "qa-seed-beneficiary-message-v1",
      type: "text",
      body: "I have saved my work agreement and payment notes. Please help me understand the next step.",
      createdAt: now + 2000,
    });

    await ctx.db.insert("case_documents", {
      caseId,
      uploaderId: user._id,
      clientDocumentId: "qa-seed-demand-letter-v1",
      name: "Draft unpaid salary demand letter",
      type: "text/plain",
      size: 824,
      category: "letter",
      textContent: "This is a synthetic QA draft for presentation testing. Replace with a real beneficiary document in production.",
      source: "letter_builder",
      note: "Seeded QA document. No real beneficiary data.",
      status: "pending_review",
      createdAt: now + 3000,
    });

    const appointmentId = await ctx.db.insert("case_appointments", {
      caseId,
      createdBy: user._id,
      startsAt: now + 1000 * 60 * 60 * 24 * 2,
      mode: "phone",
      location: "Phone consultation",
      status: "scheduled",
      statusNote: "Synthetic QA appointment for mobile presentation testing.",
      createdAt: now + 4000,
      updatedAt: now + 4000,
    });

    await ctx.db.insert("notifications", {
      userId: user._id,
      type: "appointment.created",
      titleKey: "notifications.update.title",
      bodyKey: "notifications.appointmentCreated.body",
      resourceType: "case",
      resourceId: caseId,
      createdAt: now + 5000,
    });

    return { success: true, requestId, caseId, appointmentId, existing: false };
  },
});
