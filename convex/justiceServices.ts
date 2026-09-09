import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";

const servicePointType = v.union(
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
);

const classification = v.union(
  v.literal("public"),
  v.literal("community"),
  v.literal("government"),
  v.literal("private"),
  v.literal("restricted"),
);

const visibility = v.union(v.literal("public"), v.literal("restricted"), v.literal("confidential"));
const verificationStatus = v.union(v.literal("draft"), v.literal("verified"), v.literal("expired"), v.literal("inactive"));
const intakeState = v.union(v.literal("open"), v.literal("limited"), v.literal("closed"), v.literal("emergency_only"));
const urgency = v.union(v.literal("standard"), v.literal("urgent"), v.literal("immediate_safety"));

const organizationType = v.union(
  v.literal("lsf"),
  v.literal("legal_aid_provider"),
  v.literal("government"),
  v.literal("cso"),
  v.literal("community_paralegal_network"),
  v.literal("private_provider"),
  v.literal("donor_partner"),
  v.literal("other"),
);
const organizationVerificationStatus = v.union(v.literal("draft"), v.literal("verified"), v.literal("suspended"), v.literal("inactive"));
const referralAgreementStatus = v.union(v.literal("none"), v.literal("draft"), v.literal("active"), v.literal("expired"), v.literal("suspended"));

const organizationInput = {
  name: v.string(),
  organizationType,
  verificationStatus: organizationVerificationStatus,
  referralAgreementStatus,
  focalPersonName: v.optional(v.string()),
  focalPersonEmail: v.optional(v.string()),
  focalPersonPhone: v.optional(v.string()),
  slaHours: v.optional(v.number()),
  safeguardingReady: v.boolean(),
  dataSharingAgreementVersion: v.optional(v.string()),
  notes: v.optional(v.string()),
};

const serviceInput = {
  name: v.string(),
  organizationId: v.optional(v.id("justice_service_organizations")),
  organizationName: v.optional(v.string()),
  servicePointType,
  classification,
  visibility,
  verificationStatus,
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
  currentIntakeState: intakeState,
  capacity: v.optional(v.number()),
  emergencyCapability: v.boolean(),
  languages: v.array(v.string()),
  disabilityAccess: v.optional(v.string()),
  privacyAvailable: v.boolean(),
  genderSensitive: v.boolean(),
};

function normalize(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

function publicServiceProjection(service: {
  _id: unknown;
  name: string;
  organizationName?: string;
  servicePointType: string;
  classification: string;
  verificationStatus: string;
  region: string;
  district: string;
  ward?: string;
  serviceCoverageRegions: string[];
  issueCategories: string[];
  serviceTypes: string[];
  jurisdiction?: string;
  referralCapability: boolean;
  eligibility?: string;
  openingHours?: string;
  walkIn: boolean;
  appointmentRequired: boolean;
  remoteSupport: boolean;
  phoneSupport: boolean;
  phone?: string;
  currentIntakeState: string;
  emergencyCapability: boolean;
  languages: string[];
  disabilityAccess?: string;
  privacyAvailable: boolean;
  genderSensitive: boolean;
}) {
  return {
    _id: service._id,
    name: service.name,
    organizationName: service.organizationName,
    servicePointType: service.servicePointType,
    classification: service.classification,
    verificationStatus: service.verificationStatus,
    region: service.region,
    district: service.district,
    ward: service.ward,
    serviceCoverageRegions: service.serviceCoverageRegions,
    issueCategories: service.issueCategories,
    serviceTypes: service.serviceTypes,
    jurisdiction: service.jurisdiction,
    referralCapability: service.referralCapability,
    eligibility: service.eligibility,
    openingHours: service.openingHours,
    walkIn: service.walkIn,
    appointmentRequired: service.appointmentRequired,
    remoteSupport: service.remoteSupport,
    phoneSupport: service.phoneSupport,
    phone: service.phone,
    currentIntakeState: service.currentIntakeState,
    emergencyCapability: service.emergencyCapability,
    languages: service.languages,
    disabilityAccess: service.disabilityAccess,
    privacyAvailable: service.privacyAvailable,
    genderSensitive: service.genderSensitive,
  };
}

export const staffListOrganizations = query({
  args: {},
  handler: async (ctx) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const organizations = await ctx.db.query("justice_service_organizations").collect();
    return await Promise.all(organizations.map(async (organization) => {
      const services = await ctx.db
        .query("justice_services")
        .withIndex("by_organization", (q) => q.eq("organizationId", organization._id))
        .collect();
      return {
        ...organization,
        serviceCount: services.length,
        activeReferralServiceCount: services.filter((service) => service.active && service.referralCapability).length,
      };
    }));
  },
});

export const staffPartnerPerformance = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const days = Math.min(Math.max(Math.trunc(args.days ?? 30), 1), 365);
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    const referrals = await ctx.db
      .query("referrals")
      .filter((q) => q.gte(q.field("createdAt"), cutoff))
      .collect();
    const organizations = await ctx.db.query("justice_service_organizations").collect();
    const organizationMap = new Map(organizations.map((organization) => [organization._id, organization]));
    const buckets = new Map<string, {
      organizationId: string;
      organizationName: string;
      referralAgreementStatus: string;
      verificationStatus: string;
      slaHours: number;
      safeguardingReady: boolean;
      totalReferrals: number;
      respondedCount: number;
      withinSlaCount: number;
      overdueOpenCount: number;
      deliveredCount: number;
      closedCount: number;
      onwardCount: number;
      totalResponseHours: number;
      serviceNames: Set<string>;
    }>();

    for (const referral of referrals) {
      const service = await ctx.db.get(referral.destinationServiceId);
      const organization = service?.organizationId ? organizationMap.get(service.organizationId) : undefined;
      const organizationId = organization?._id ?? service?.organizationName ?? service?.name ?? "unlinked";
      const organizationName = organization?.name ?? service?.organizationName ?? "Unlinked service points";
      const slaHours = organization?.slaHours ?? 72;
      const bucketKey = String(organizationId);
      if (!buckets.has(bucketKey)) {
        buckets.set(bucketKey, {
          organizationId: bucketKey,
          organizationName,
          referralAgreementStatus: organization?.referralAgreementStatus ?? "none",
          verificationStatus: organization?.verificationStatus ?? "draft",
          slaHours,
          safeguardingReady: organization?.safeguardingReady ?? false,
          totalReferrals: 0,
          respondedCount: 0,
          withinSlaCount: 0,
          overdueOpenCount: 0,
          deliveredCount: 0,
          closedCount: 0,
          onwardCount: 0,
          totalResponseHours: 0,
          serviceNames: new Set(),
        });
      }
      const bucket = buckets.get(bucketKey)!;
      bucket.totalReferrals += 1;
      if (service?.name) bucket.serviceNames.add(service.name);
      if (referral.status === "service_delivered") bucket.deliveredCount += 1;
      if (referral.status === "closed") bucket.closedCount += 1;
      if (referral.status === "referred_onward" || referral.onwardReferralId) bucket.onwardCount += 1;

      const events = await ctx.db
        .query("referral_events")
        .withIndex("by_referral_time", (q) => q.eq("referralId", referral._id))
        .collect();
      const firstResponse = events
        .filter((event) => ["referral_accepted", "referral_declined", "referral_returned", "referral_scheduled", "referral_service_delivered"].includes(event.type))
        .sort((a, b) => a.occurredAt - b.occurredAt)[0];
      if (firstResponse) {
        const responseHours = Math.max(0, (firstResponse.occurredAt - referral.createdAt) / (60 * 60 * 1000));
        bucket.respondedCount += 1;
        bucket.totalResponseHours += responseHours;
        if (responseHours <= slaHours) bucket.withinSlaCount += 1;
      } else if (["created", "destination_notified"].includes(referral.status) && now - referral.createdAt > slaHours * 60 * 60 * 1000) {
        bucket.overdueOpenCount += 1;
      }
    }

    const rows = [...buckets.values()].map((bucket) => ({
      organizationId: bucket.organizationId,
      organizationName: bucket.organizationName,
      referralAgreementStatus: bucket.referralAgreementStatus,
      verificationStatus: bucket.verificationStatus,
      slaHours: bucket.slaHours,
      safeguardingReady: bucket.safeguardingReady,
      totalReferrals: bucket.totalReferrals,
      respondedCount: bucket.respondedCount,
      responseRate: bucket.totalReferrals ? Math.round((bucket.respondedCount / bucket.totalReferrals) * 100) : 0,
      withinSlaCount: bucket.withinSlaCount,
      slaComplianceRate: bucket.respondedCount ? Math.round((bucket.withinSlaCount / bucket.respondedCount) * 100) : 0,
      overdueOpenCount: bucket.overdueOpenCount,
      deliveredCount: bucket.deliveredCount,
      closedCount: bucket.closedCount,
      onwardCount: bucket.onwardCount,
      averageResponseHours: bucket.respondedCount ? Math.round((bucket.totalResponseHours / bucket.respondedCount) * 10) / 10 : null,
      serviceNames: [...bucket.serviceNames].slice(0, 5),
    })).sort((a, b) => b.overdueOpenCount - a.overdueOpenCount || a.slaComplianceRate - b.slaComplianceRate || b.totalReferrals - a.totalReferrals);

    return {
      periodDays: days,
      generatedAt: now,
      totals: {
        referrals: rows.reduce((sum, row) => sum + row.totalReferrals, 0),
        responded: rows.reduce((sum, row) => sum + row.respondedCount, 0),
        overdueOpen: rows.reduce((sum, row) => sum + row.overdueOpenCount, 0),
        delivered: rows.reduce((sum, row) => sum + row.deliveredCount, 0),
        onward: rows.reduce((sum, row) => sum + row.onwardCount, 0),
      },
      partners: rows,
    };
  },
});

export const listPublicServices = query({
  args: {
    region: v.optional(v.string()),
    district: v.optional(v.string()),
    issueCategory: v.optional(v.string()),
    serviceType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const services = await ctx.db
      .query("justice_services")
      .withIndex("by_active_visibility", (q) => q.eq("active", true).eq("visibility", "public"))
      .collect();

    const region = normalize(args.region);
    const district = normalize(args.district);
    const issueCategory = normalize(args.issueCategory);
    const serviceType = normalize(args.serviceType);

    return services
      .filter((service) => service.verificationStatus === "verified")
      .filter((service) => !region || service.region.toLowerCase().includes(region) || service.serviceCoverageRegions.some((item) => item.toLowerCase().includes(region)))
      .filter((service) => !district || service.district.toLowerCase().includes(district))
      .filter((service) => !issueCategory || service.issueCategories.some((item) => item.toLowerCase().includes(issueCategory)))
      .filter((service) => !serviceType || service.serviceTypes.some((item) => item.toLowerCase().includes(serviceType)))
      .map(publicServiceProjection);
  },
});

export const staffListServices = query({
  args: {},
  handler: async (ctx) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const services = await ctx.db.query("justice_services").collect();
    return await Promise.all(services.map(async (service) => ({
      ...service,
      organization: service.organizationId ? await ctx.db.get(service.organizationId) : null,
    })));
  },
});

export const createOrganization = mutation({
  args: organizationInput,
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    const name = args.name.trim();
    if (name.length < 2) throw new ConvexError("Organization name is required.");
    if (args.referralAgreementStatus === "active" && args.verificationStatus !== "verified") {
      throw new ConvexError("Only verified organizations can have an active referral agreement.");
    }
    if (args.slaHours !== undefined && (args.slaHours < 1 || args.slaHours > 720)) {
      throw new ConvexError("SLA hours must be between 1 and 720.");
    }
    const now = Date.now();
    const id = await ctx.db.insert("justice_service_organizations", {
      ...args,
      name,
      focalPersonName: args.focalPersonName?.trim() || undefined,
      focalPersonEmail: args.focalPersonEmail?.trim().toLowerCase() || undefined,
      focalPersonPhone: args.focalPersonPhone?.trim() || undefined,
      dataSharingAgreementVersion: args.dataSharingAgreementVersion?.trim() || undefined,
      notes: args.notes?.trim() || undefined,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });
    return { id };
  },
});

export const updateOrganization = mutation({
  args: {
    id: v.id("justice_service_organizations"),
    updates: v.object({
      name: v.optional(v.string()),
      organizationType: v.optional(organizationType),
      verificationStatus: v.optional(organizationVerificationStatus),
      referralAgreementStatus: v.optional(referralAgreementStatus),
      focalPersonName: v.optional(v.string()),
      focalPersonEmail: v.optional(v.string()),
      focalPersonPhone: v.optional(v.string()),
      slaHours: v.optional(v.number()),
      safeguardingReady: v.optional(v.boolean()),
      dataSharingAgreementVersion: v.optional(v.string()),
      notes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff"]);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("Organization not found.");
    const nextVerification = args.updates.verificationStatus ?? existing.verificationStatus;
    const nextAgreement = args.updates.referralAgreementStatus ?? existing.referralAgreementStatus;
    if (nextAgreement === "active" && nextVerification !== "verified") {
      throw new ConvexError("Only verified organizations can have an active referral agreement.");
    }
    await ctx.db.patch(args.id, {
      ...args.updates,
      name: args.updates.name?.trim(),
      focalPersonEmail: args.updates.focalPersonEmail?.trim().toLowerCase(),
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const createService = mutation({
  args: serviceInput,
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    if (args.servicePointType === "safe_house" && args.visibility === "public") {
      throw new ConvexError("Safe-house services cannot be public.");
    }
    const organization = args.organizationId ? await ctx.db.get(args.organizationId) : null;
    if (args.organizationId && !organization) throw new ConvexError("Linked organization not found.");
    if (organization && organization.verificationStatus !== "verified" && args.verificationStatus === "verified") {
      throw new ConvexError("A verified service must be linked to a verified organization.");
    }
    const now = Date.now();
    return await ctx.db.insert("justice_services", {
      ...args,
      organizationName: organization?.name ?? args.organizationName,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateService = mutation({
  args: {
    id: v.id("justice_services"),
    updates: v.object({
      name: v.optional(v.string()),
      organizationId: v.optional(v.id("justice_service_organizations")),
      organizationName: v.optional(v.string()),
      servicePointType: v.optional(servicePointType),
      classification: v.optional(classification),
      visibility: v.optional(visibility),
      verificationStatus: v.optional(verificationStatus),
      verifyingAuthority: v.optional(v.string()),
      source: v.optional(v.string()),
      lastVerifiedAt: v.optional(v.number()),
      nextReviewAt: v.optional(v.number()),
      active: v.optional(v.boolean()),
      country: v.optional(v.string()),
      region: v.optional(v.string()),
      district: v.optional(v.string()),
      council: v.optional(v.string()),
      ward: v.optional(v.string()),
      villageOrMtaa: v.optional(v.string()),
      latitude: v.optional(v.number()),
      longitude: v.optional(v.number()),
      physicalLocation: v.optional(v.string()),
      serviceCoverageRegions: v.optional(v.array(v.string())),
      issueCategories: v.optional(v.array(v.string())),
      serviceTypes: v.optional(v.array(v.string())),
      jurisdiction: v.optional(v.string()),
      referralCapability: v.optional(v.boolean()),
      eligibility: v.optional(v.string()),
      openingHours: v.optional(v.string()),
      walkIn: v.optional(v.boolean()),
      appointmentRequired: v.optional(v.boolean()),
      remoteSupport: v.optional(v.boolean()),
      phoneSupport: v.optional(v.boolean()),
      phone: v.optional(v.string()),
      currentIntakeState: v.optional(intakeState),
      capacity: v.optional(v.number()),
      emergencyCapability: v.optional(v.boolean()),
      languages: v.optional(v.array(v.string())),
      disabilityAccess: v.optional(v.string()),
      privacyAvailable: v.optional(v.boolean()),
      genderSensitive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff"]);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("Service not found.");
    const nextType = args.updates.servicePointType ?? existing.servicePointType;
    const nextVisibility = args.updates.visibility ?? existing.visibility;
    if (nextType === "safe_house" && nextVisibility === "public") {
      throw new ConvexError("Safe-house services cannot be public.");
    }
    const organization = args.updates.organizationId ? await ctx.db.get(args.updates.organizationId) : null;
    if (args.updates.organizationId && !organization) throw new ConvexError("Linked organization not found.");
    if (organization && organization.verificationStatus !== "verified" && (args.updates.verificationStatus ?? existing.verificationStatus) === "verified") {
      throw new ConvexError("A verified service must be linked to a verified organization.");
    }
    await ctx.db.patch(args.id, {
      ...args.updates,
      organizationName: organization?.name ?? args.updates.organizationName,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const matchServices = mutation({
  args: {
    source: v.optional(v.union(v.literal("navigator"), v.literal("saada"), v.literal("staff"), v.literal("directory"))),
    ordinaryProblem: v.optional(v.string()),
    issueCategory: v.optional(v.string()),
    region: v.optional(v.string()),
    district: v.optional(v.string()),
    urgency: v.optional(urgency),
    requestId: v.optional(v.id("legal_help_requests")),
    caseId: v.optional(v.id("cases")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = identity
      ? await ctx.db.query("users").withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject)).unique()
      : null;
    const services = await ctx.db
      .query("justice_services")
      .withIndex("by_active_visibility", (q) => q.eq("active", true).eq("visibility", "public"))
      .collect();
    const issueCategory = normalize(args.issueCategory ?? args.ordinaryProblem);
    const region = normalize(args.region);
    const district = normalize(args.district);
    const isCritical = args.urgency === "immediate_safety";
    const safetyFlags = isCritical ? ["immediate_safety_review_required"] : [];

    const ranked = services
      .filter((service) => service.verificationStatus === "verified")
      .map((service) => {
        const reasons: string[] = [];
        let score = 0;
        if (issueCategory && service.issueCategories.some((item) => issueCategory.includes(item.toLowerCase()) || item.toLowerCase().includes(issueCategory))) {
          score += 35;
          reasons.push("Handles this issue area");
        }
        if (region && (service.region.toLowerCase().includes(region) || service.serviceCoverageRegions.some((item) => item.toLowerCase().includes(region)))) {
          score += 20;
          reasons.push("Serves this region");
        }
        if (district && service.district.toLowerCase().includes(district)) {
          score += 10;
          reasons.push("Located in this district");
        }
        if (service.currentIntakeState === "open") {
          score += 15;
          reasons.push("Currently accepting requests");
        }
        if (service.referralCapability) {
          score += 10;
          reasons.push("Can receive referrals");
        }
        if (service.phoneSupport || service.remoteSupport) {
          score += 5;
          reasons.push("Remote contact is available");
        }
        if (isCritical && service.emergencyCapability) {
          score += 20;
          reasons.push("Has emergency support capability");
        }
        if (isCritical && !service.privacyAvailable) score -= 20;
        return { service, score, reasons: reasons.length ? reasons : ["Verified public service"] };
      })
      .filter((item) => item.score > 0 || (!issueCategory && !region && !district))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const explanation = ranked.flatMap((item) => item.reasons.slice(0, 2));
    const decisionId = await ctx.db.insert("matching_decisions", {
      requesterId: user?._id,
      requestId: args.requestId,
      caseId: args.caseId,
      source: args.source ?? "directory",
      issueCategory: args.issueCategory,
      ordinaryProblem: args.ordinaryProblem,
      region: args.region,
      district: args.district,
      urgency: args.urgency,
      recommendedServiceIds: ranked.map((item) => item.service._id),
      explanation,
      safetyFlags,
      modelAssisted: false,
      createdAt: Date.now(),
    });

    return {
      decisionId,
      safetyFlags,
      recommendations: ranked.map((item) => ({
        service: publicServiceProjection(item.service),
        score: item.score,
        whySuitable: item.reasons,
        whatToPrepare: [
          "Brief description of what happened",
          "Any dates, names, notices, agreements, or receipts",
          "Preferred safe contact method",
        ],
      })),
    };
  },
});
