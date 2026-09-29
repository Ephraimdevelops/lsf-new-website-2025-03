import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getActiveRoles, requireAnyRole, requireAuthenticatedUser } from "./lib/auth";

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
const matchingReviewStatus = v.union(
  v.literal("pending_review"),
  v.literal("approved"),
  v.literal("needs_changes"),
  v.literal("escalated"),
  v.literal("restricted"),
);
const matchingReviewRoles = ["admin", "staff", "supervisor", "safeguarding_officer"] as const;

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

function isCurrentPublicService(service: {
  active: boolean;
  visibility: string;
  verificationStatus: string;
  servicePointType: string;
  nextReviewAt?: number;
}) {
  return service.active && service.visibility === "public" && service.verificationStatus === "verified"
    && service.servicePointType !== "safe_house"
    && (service.nextReviewAt === undefined || service.nextReviewAt >= Date.now());
}

function publicServiceProjection(service: {
  _id: unknown;
  name: string;
  organizationName?: string;
  servicePointType: string;
  classification: string;
  verificationStatus: string;
  lastVerifiedAt?: number;
  region: string;
  district: string;
  ward?: string;
  physicalLocation?: string;
  latitude?: number;
  longitude?: number;
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
    lastVerifiedAt: service.lastVerifiedAt,
    region: service.region,
    district: service.district,
    ward: service.ward,
    physicalLocation: service.physicalLocation,
    latitude: service.latitude,
    longitude: service.longitude,
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

export const myOrganization = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAnyRole(ctx, ["paralegal", "provider_staff"]);
    const assignments = await ctx.db
      .query("role_assignments")
      .withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", "active"))
      .collect();
    const organizationId = assignments.find((assignment) =>
      ["paralegal", "provider_staff"].includes(assignment.role) && assignment.organizationId,
    )?.organizationId;
    if (!organizationId) return null;
    const organization = await ctx.db.get(organizationId as Id<"justice_service_organizations">);
    if (!organization) return null;
    const services = await ctx.db
      .query("justice_services")
      .withIndex("by_organization", (q) => q.eq("organizationId", organization._id))
      .collect();
    return {
      organization: {
        _id: organization._id,
        name: organization.name,
        organizationType: organization.organizationType,
        verificationStatus: organization.verificationStatus,
        referralAgreementStatus: organization.referralAgreementStatus,
        safeguardingReady: organization.safeguardingReady,
        slaHours: organization.slaHours,
        focalPersonName: organization.focalPersonName,
        focalPersonPhone: organization.focalPersonPhone,
      },
      services: services.map((service) => ({
        _id: service._id,
        name: service.name,
        servicePointType: service.servicePointType,
        verificationStatus: service.verificationStatus,
        active: service.active,
        region: service.region,
        district: service.district,
        currentIntakeState: service.currentIntakeState,
        referralCapability: service.referralCapability,
        openingHours: service.openingHours,
        phone: service.phone,
      })),
    };
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
    search: v.optional(v.string()),
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
    const search = normalize(args.search);

    return services
      .filter(isCurrentPublicService)
      .filter((service) => !search || [service.name, service.organizationName, service.region, service.district, service.ward, service.physicalLocation, ...service.issueCategories, ...service.serviceTypes].some((item) => normalize(item).includes(search)))
      .filter((service) => !region || service.region.toLowerCase().includes(region) || service.serviceCoverageRegions.some((item) => item.toLowerCase().includes(region)))
      .filter((service) => !district || service.district.toLowerCase().includes(district))
      .filter((service) => !issueCategory || service.issueCategories.some((item) => item.toLowerCase().includes(issueCategory)))
      .filter((service) => !serviceType || service.serviceTypes.some((item) => item.toLowerCase().includes(serviceType)))
      .map(publicServiceProjection);
  },
});

export const getPublicService = query({
  args: { id: v.id("justice_services") },
  handler: async (ctx, args) => {
    const service = await ctx.db.get(args.id);
    if (!service || !isCurrentPublicService(service)) return null;
    return publicServiceProjection(service);
  },
});

export const mySavedServices = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const saved = await ctx.db.query("saved_justice_services")
      .withIndex("by_user", (q) => q.eq("userId", user._id)).order("desc").take(100);
    const services = await Promise.all(saved.map(async (item) => {
      const service = await ctx.db.get(item.serviceId);
      return service && isCurrentPublicService(service)
        ? { savedAt: item.savedAt, service: publicServiceProjection(service) } : null;
    }));
    return services.filter((item) => item !== null);
  },
});

export const toggleSavedService = mutation({
  args: { serviceId: v.id("justice_services"), saved: v.boolean() },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const existing = await ctx.db.query("saved_justice_services")
      .withIndex("by_user_service", (q) => q.eq("userId", user._id).eq("serviceId", args.serviceId)).unique();
    if (!args.saved) {
      if (existing) await ctx.db.delete(existing._id);
      return { saved: false };
    }
    const service = await ctx.db.get(args.serviceId);
    if (!service || !isCurrentPublicService(service)) {
      throw new ConvexError("This service is no longer available to save.");
    }
    if (!existing) await ctx.db.insert("saved_justice_services", { userId: user._id, serviceId: args.serviceId, savedAt: Date.now() });
    return { saved: true };
  },
});

export const myServiceVisits = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const visits = await ctx.db.query("justice_service_visits").withIndex("by_user", (q) => q.eq("userId", user._id)).order("desc").take(100);
    return await Promise.all(visits.map(async (visit) => {
      const service = await ctx.db.get(visit.serviceId);
      return { visit, service: service ? { _id: service._id, name: service.name, district: service.district, region: service.region } : null };
    }));
  },
});

export const planServiceVisit = mutation({
  args: { serviceId: v.id("justice_services"), plannedFor: v.number(), channel: v.union(v.literal("in_person"), v.literal("phone"), v.literal("remote")) },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const service = await ctx.db.get(args.serviceId);
    if (!service || !isCurrentPublicService(service)) throw new ConvexError("This public service is not available for visit planning.");
    if (args.plannedFor < Date.now() - 60_000) throw new ConvexError("Choose a future date and time.");
    if (args.channel === "in_person" && !service.walkIn && service.appointmentRequired) throw new ConvexError("Contact this service to confirm an appointment before planning an in-person visit.");
    if (args.channel === "phone" && !service.phoneSupport) throw new ConvexError("Phone support is not listed for this service.");
    if (args.channel === "remote" && !service.remoteSupport) throw new ConvexError("Remote support is not listed for this service.");
    const id = await ctx.db.insert("justice_service_visits", { userId: user._id, serviceId: service._id, plannedFor: args.plannedFor, channel: args.channel, status: "planned", createdAt: Date.now() });
    await ctx.db.insert("audit_logs", { action: "directory.visit_planned", entityType: "justice_service_visit", entityId: id, userId: user._id, timestamp: Date.now(), metadata: { serviceId: service._id, channel: args.channel } });
    return { id };
  },
});

export const checkInServiceVisit = mutation({
  args: { visitId: v.id("justice_service_visits"), outcome: v.union(v.literal("helpful"), v.literal("partly_helpful"), v.literal("not_helpful")), note: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const visit = await ctx.db.get(args.visitId);
    if (!visit || visit.userId !== user._id) throw new ConvexError("Visit not found.");
    if (visit.status !== "planned") throw new ConvexError("This visit has already been updated.");
    if (Date.now() < visit.plannedFor - 30 * 60 * 1000) throw new ConvexError("Check in after the planned service time.");
    const note = args.note?.trim();
    if (note && note.length > 1000) throw new ConvexError("Check-in note is too long.");
    await ctx.db.patch(visit._id, { status: "completed", outcome: args.outcome, note: note || undefined, checkedInAt: Date.now() });
    await ctx.db.insert("audit_logs", { action: "directory.visit_checked_in", entityType: "justice_service_visit", entityId: visit._id, userId: user._id, timestamp: Date.now(), metadata: { serviceId: visit.serviceId, outcome: args.outcome } });
    return { success: true };
  },
});

export const cancelServiceVisit = mutation({
  args: { visitId: v.id("justice_service_visits") },
  handler: async (ctx, args) => {
    const { user } = await requireAuthenticatedUser(ctx);
    const visit = await ctx.db.get(args.visitId);
    if (!visit || visit.userId !== user._id) throw new ConvexError("Visit not found.");
    if (visit.status !== "planned") throw new ConvexError("Only planned visits can be cancelled.");
    await ctx.db.patch(visit._id, { status: "cancelled" });
    return { success: true };
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
    await ctx.db.insert("audit_logs", { action: "directory.organization_created", entityType: "justice_service_organization", entityId: id, userId: user._id, timestamp: now, metadata: { verificationStatus: args.verificationStatus, referralAgreementStatus: args.referralAgreementStatus } });
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
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new ConvexError("Organization not found.");
    const nextVerification = args.updates.verificationStatus ?? existing.verificationStatus;
    const nextAgreement = args.updates.referralAgreementStatus ?? existing.referralAgreementStatus;
    if (nextAgreement === "active" && nextVerification !== "verified") {
      throw new ConvexError("Only verified organizations can have an active referral agreement.");
    }
    await ctx.db.patch(args.id, {
      ...args.updates,
      ...(args.updates.name !== undefined ? { name: args.updates.name.trim() } : {}),
      ...(args.updates.focalPersonEmail !== undefined ? { focalPersonEmail: args.updates.focalPersonEmail.trim().toLowerCase() } : {}),
      updatedAt: Date.now(),
    });
    await ctx.db.insert("audit_logs", { action: "directory.organization_updated", entityType: "justice_service_organization", entityId: args.id, userId: user._id, timestamp: Date.now(), metadata: { changedFieldNames: Object.keys(args.updates), previousVerificationStatus: existing.verificationStatus, nextVerificationStatus: nextVerification } });
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
    if (args.verificationStatus === "verified" && (!args.source?.trim() || !args.verifyingAuthority?.trim() || !args.lastVerifiedAt || !args.nextReviewAt)) {
      throw new ConvexError("Verified services require source, verifying authority, verification date, and next review date.");
    }
    const now = Date.now();
    const id = await ctx.db.insert("justice_services", {
      ...args,
      organizationName: organization?.name ?? args.organizationName,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("audit_logs", { action: "directory.service_created", entityType: "justice_service", entityId: id, userId: user._id, timestamp: now, metadata: { verificationStatus: args.verificationStatus, visibility: args.visibility, servicePointType: args.servicePointType } });
    return id;
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
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
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
    const nextVerification = args.updates.verificationStatus ?? existing.verificationStatus;
    const source = args.updates.source ?? existing.source;
    const verifyingAuthority = args.updates.verifyingAuthority ?? existing.verifyingAuthority;
    const lastVerifiedAt = args.updates.lastVerifiedAt ?? existing.lastVerifiedAt;
    const nextReviewAt = args.updates.nextReviewAt ?? existing.nextReviewAt;
    if (nextVerification === "verified" && (!source?.trim() || !verifyingAuthority?.trim() || !lastVerifiedAt || !nextReviewAt || nextReviewAt <= lastVerifiedAt)) {
      throw new ConvexError("Verified services require source, verifying authority, and a valid future review date.");
    }
    await ctx.db.patch(args.id, {
      ...args.updates,
      ...(organization ? { organizationName: organization.name } : args.updates.organizationName !== undefined ? { organizationName: args.updates.organizationName } : {}),
      updatedAt: Date.now(),
    });
    await ctx.db.insert("audit_logs", { action: "directory.service_updated", entityType: "justice_service", entityId: args.id, userId: user._id, timestamp: Date.now(), metadata: { changedFieldNames: Object.keys(args.updates), previousVerificationStatus: existing.verificationStatus, nextVerificationStatus: nextVerification, previousActive: existing.active, nextActive: args.updates.active ?? existing.active } });
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
    const isRestricted = isCritical;

    const ranked = isRestricted ? [] : services
      .filter(isCurrentPublicService)
      .filter((service) => !issueCategory || service.issueCategories.some((item) => item.toLowerCase().includes(issueCategory) || issueCategory.includes(item.toLowerCase())))
      .filter((service) => !region || service.region.toLowerCase().includes(region) || service.serviceCoverageRegions.some((item) => item.toLowerCase().includes(region)))
      .filter((service) => !district || service.district.toLowerCase().includes(district) || service.remoteSupport)
      .filter((service) => service.currentIntakeState !== "closed")
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

    const explanation = isRestricted
      ? ["Immediate safety requests require LSF safeguarding review before service recommendations are shown."]
      : ranked.flatMap((item) => item.reasons.slice(0, 2));
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
      reviewStatus: isRestricted ? "restricted" : "pending_review",
      restrictionReason: isRestricted
        ? "Immediate safety requests require safeguarding review before service recommendations are shown."
        : undefined,
      modelAssisted: false,
      createdAt: Date.now(),
    });

    return {
      decisionId,
      safetyFlags,
      reviewStatus: isRestricted ? "restricted" : "pending_review",
      restrictionReason: isRestricted
        ? "Immediate safety requests require safeguarding review before service recommendations are shown."
        : undefined,
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

export const staffMatchingDecisionQueue = query({
  args: {
    status: v.optional(matchingReviewStatus),
  },
  handler: async (ctx, args) => {
    const actor = await requireAnyRole(ctx, matchingReviewRoles);
    const actorRoles = await getActiveRoles(ctx, actor.user._id);
    const safeguardingOnly = actorRoles.includes("safeguarding_officer") &&
      !actorRoles.some((role) => ["admin", "staff", "supervisor"].includes(role));
    const decisions = args.status
      ? await ctx.db
          .query("matching_decisions")
          .withIndex("by_review_status", (q) => q.eq("reviewStatus", args.status))
          .collect()
      : await ctx.db.query("matching_decisions").withIndex("by_created").collect();

    const scopedDecisions = safeguardingOnly
      ? decisions.filter((decision) => decision.urgency === "immediate_safety" || decision.reviewStatus === "restricted" || decision.reviewStatus === "escalated")
      : decisions;
    const recent = scopedDecisions.sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
    return await Promise.all(
      recent.map(async (decision) => {
        const [requester, request, caseRecord] = await Promise.all([
          decision.requesterId ? ctx.db.get(decision.requesterId) : null,
          decision.requestId ? ctx.db.get(decision.requestId) : null,
          decision.caseId ? ctx.db.get(decision.caseId) : null,
        ]);
        const recommendedServices = await Promise.all(
          decision.recommendedServiceIds.map(async (serviceId) => {
            const service = await ctx.db.get(serviceId);
            if (!service) return null;
            return {
              _id: service._id,
              name: service.name,
              organizationName: service.organizationName,
              servicePointType: service.servicePointType,
              region: service.region,
              district: service.district,
              currentIntakeState: service.currentIntakeState,
              referralCapability: service.referralCapability,
              emergencyCapability: service.emergencyCapability,
            };
          }),
        );
        return {
          decision,
          requester: requester
            ? { name: requester.name, email: requester.email }
            : null,
          request: request
            ? {
                _id: request._id,
                publicId: request.publicId,
                status: request.status,
                urgency: request.urgency,
              }
            : null,
          case: caseRecord
            ? {
                _id: caseRecord._id,
                publicId: caseRecord.publicId,
                status: caseRecord.status,
                priority: caseRecord.priority,
              }
            : null,
          recommendedServices: recommendedServices.filter((service) => service !== null),
        };
      }),
    );
  },
});

export const reviewMatchingDecision = mutation({
  args: {
    decisionId: v.id("matching_decisions"),
    status: matchingReviewStatus,
    reviewNote: v.optional(v.string()),
    restrictionReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, matchingReviewRoles);
    const decision = await ctx.db.get(args.decisionId);
    if (!decision) throw new ConvexError("Matching decision not found.");
    if (args.status === "pending_review") throw new ConvexError("A review decision must choose a final review state.");
    const reviewNote = args.reviewNote?.trim();
    if (!reviewNote || reviewNote.length < 10 || reviewNote.length > 2000) {
      throw new ConvexError("Record a review reason between 10 and 2000 characters.");
    }
    const restrictionReason = args.restrictionReason?.trim();
    if (args.status === "restricted" && (!restrictionReason || restrictionReason.length < 10)) {
      throw new ConvexError("Restricted matches require a documented reason.");
    }
    const actorRoles = await getActiveRoles(ctx, user._id);
    const safeguardingOnly = actorRoles.includes("safeguarding_officer") &&
      !actorRoles.some((role) => ["admin", "staff", "supervisor"].includes(role));
    if (safeguardingOnly && decision.urgency !== "immediate_safety" && decision.reviewStatus !== "restricted" && decision.reviewStatus !== "escalated") {
      throw new ConvexError("Safeguarding officers can review safety-sensitive matching decisions only.");
    }
    const now = Date.now();
    await ctx.db.patch(args.decisionId, {
      reviewStatus: args.status,
      reviewedBy: user._id,
      reviewedAt: now,
      reviewNote,
      restrictionReason: args.status === "restricted" ? restrictionReason : undefined,
    });
    await ctx.db.insert("audit_logs", {
      action: "directory.matching_decision_reviewed",
      entityType: "matching_decision",
      entityId: args.decisionId,
      userId: user._id,
      timestamp: now,
      metadata: { previousStatus: decision.reviewStatus ?? "pending_review", nextStatus: args.status, changedFieldNames: ["reviewStatus", "reviewedBy", "reviewedAt", "reviewNote", "restrictionReason"] },
    });
    return { success: true };
  },
});
