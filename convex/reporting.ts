import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getActiveRoles, requireAnyRole } from "./lib/auth";
import { externalImpactValues } from "../shared/impactReporting";

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_SUPPRESSION_THRESHOLD = 5;
const REPORTING_DEFINITION_VERSION = "2026-09-09.v1";

function clampDays(days: number | undefined) {
  return Math.min(Math.max(Math.trunc(days ?? 30), 1), 366);
}

function percentage(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function donorSafePercentage(numerator: number, denominator: number) {
  if (denominator < DEFAULT_SUPPRESSION_THRESHOLD) return null;
  const remainder = denominator - numerator;
  if ((numerator > 0 && numerator < DEFAULT_SUPPRESSION_THRESHOLD) || (remainder > 0 && remainder < DEFAULT_SUPPRESSION_THRESHOLD)) return null;
  return percentage(numerator, denominator);
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function suppressSmallCell(value: number, threshold = DEFAULT_SUPPRESSION_THRESHOLD) {
  return value > 0 && value < threshold ? null : value;
}

export const generateDonorSafeSnapshot = mutation({
  args: {
    days: v.optional(v.number()),
    approveImmediately: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    if (args.approveImmediately) throw new ConvexError("Donor-safe reports require independent approval after generation.");
    const days = clampDays(args.days);
    const now = Date.now();
    const periodStart = now - days * MILLIS_PER_DAY;

    const [requests, cases, assignments, appointments, referrals, referralEvents, outcomes, feedback, reviewRequests] = await Promise.all([
      ctx.db.query("legal_help_requests").collect(),
      ctx.db.query("cases").collect(),
      ctx.db.query("case_assignments").collect(),
      ctx.db.query("case_appointments").collect(),
      ctx.db.query("referrals").collect(),
      ctx.db.query("referral_events").collect(),
      ctx.db.query("case_outcomes").collect(),
      ctx.db.query("case_feedback").collect(),
      ctx.db.query("case_review_requests").collect(),
    ]);

    const periodRequests = requests.filter((request) => (request.submittedAt ?? request.createdAt) >= periodStart);
    const periodCases = cases.filter((caseRecord) => caseRecord.createdAt >= periodStart);
    const periodAssignments = assignments.filter((assignment) => assignment.offeredAt >= periodStart);
    const periodAppointments = appointments.filter((appointment) => appointment.createdAt >= periodStart);
    const periodReferrals = referrals.filter((referral) => referral.createdAt >= periodStart);
    const periodOutcomes = outcomes.filter((outcome) => outcome.recordedAt >= periodStart);
    const periodFeedback = feedback.filter((record) => record.submittedAt >= periodStart);
    const periodReviews = reviewRequests.filter((review) => review.createdAt >= periodStart);

    const acceptedAssignments = periodAssignments.filter((assignment) => assignment.status === "accepted");
    const acceptedReferrals = periodReferrals.filter((referral) => ["accepted", "scheduled", "service_delivered", "closed", "referred_onward"].includes(referral.status));
    const completedAppointments = periodAppointments.filter((appointment) => appointment.status === "completed");
    const resolvedCases = periodCases.filter((caseRecord) => ["resolved", "closed"].includes(caseRecord.status));
    const safeguardingCases = periodCases.filter((caseRecord) => caseRecord.priority === "safeguarding");
    const safeguardingReviews = periodReviews.filter((review) => review.reason === "safety_concern");

    const assignmentResponseHours = acceptedAssignments
      .filter((assignment) => assignment.respondedAt)
      .map((assignment) => ((assignment.respondedAt ?? assignment.offeredAt) - assignment.offeredAt) / 3_600_000);
    const responseEventTypes = new Set(["referral_accepted", "referral_declined", "referral_returned", "referral_escalated"]);
    const referralResponseHours = periodReferrals.flatMap((referral) => {
      const firstResponse = referralEvents
        .filter((event) => event.referralId === referral._id && responseEventTypes.has(event.type))
        .sort((a, b) => a.occurredAt - b.occurredAt)[0];
      return firstResponse ? [(firstResponse.occurredAt - referral.createdAt) / 3_600_000] : [];
    });

    const values = {
      periodDays: days,
      requestsSubmitted: suppressSmallCell(periodRequests.filter((request) => request.status !== "draft").length),
      casesCreated: suppressSmallCell(periodCases.length),
      openCases: suppressSmallCell(cases.filter((caseRecord) => !["resolved", "closed_unresolved", "closed"].includes(caseRecord.status)).length),
      resolvedCases: suppressSmallCell(resolvedCases.length),
      safeguardingCases: suppressSmallCell(safeguardingCases.length),
      safeguardingReviewRequests: suppressSmallCell(safeguardingReviews.length),
      assignmentAcceptanceRate: donorSafePercentage(acceptedAssignments.length, periodAssignments.length),
      averageAssignmentResponseHours: assignmentResponseHours.length >= DEFAULT_SUPPRESSION_THRESHOLD ? average(assignmentResponseHours) : null,
      appointmentsKeptRate: donorSafePercentage(completedAppointments.length, periodAppointments.length),
      referralAcceptanceRate: donorSafePercentage(acceptedReferrals.length, periodReferrals.length),
      averageReferralResponseHours: referralResponseHours.length >= DEFAULT_SUPPRESSION_THRESHOLD ? average(referralResponseHours) : null,
      referralCompletionCount: suppressSmallCell(periodReferrals.filter((referral) => ["service_delivered", "closed"].includes(referral.status)).length),
      feedbackAverageRating: periodFeedback.length >= DEFAULT_SUPPRESSION_THRESHOLD ? average(periodFeedback.map((record) => record.rating)) : null,
      feedbackCount: suppressSmallCell(periodFeedback.length),
    };

    const qualityFlags = [
      periodRequests.length < DEFAULT_SUPPRESSION_THRESHOLD ? "request_count_below_public_threshold" : "",
      periodCases.length < DEFAULT_SUPPRESSION_THRESHOLD ? "case_count_below_public_threshold" : "",
      periodFeedback.length === 0 ? "no_feedback_in_period" : "",
    ].filter(Boolean);

    const snapshotId = await ctx.db.insert("metric_snapshots", {
      periodStart,
      periodEnd: now,
      generatedBy: user._id,
      generatedAt: now,
      approvalStatus: "draft",
      definitionVersion: REPORTING_DEFINITION_VERSION,
      values,
      qualityFlags,
      publicSummary: "Aggregate Haki Yangu service snapshot. Small cells are suppressed before donor or stakeholder viewing.",
    });

    await ctx.db.insert("audit_logs", { action: "reporting.snapshot_generated", entityType: "metric_snapshot", entityId: snapshotId, userId: user._id, timestamp: now, metadata: { periodDays: days, definitionVersion: REPORTING_DEFINITION_VERSION, changedFieldNames: ["approvalStatus"] } });
    return { snapshotId, approvalStatus: "draft", values, qualityFlags };
  },
});

export const approveSnapshot = mutation({
  args: {
    snapshotId: v.id("metric_snapshots"),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "supervisor"]);
    const snapshot = await ctx.db.get(args.snapshotId);
    if (!snapshot) throw new ConvexError("Metric snapshot not found.");
    if (snapshot.generatedBy === user._id) throw new ConvexError("A different administrator or supervisor must approve this report.");
    if (snapshot.approvalStatus !== "draft") throw new ConvexError("Only draft reports can be approved.");
    if (args.note.trim().length < 10) throw new ConvexError("Record the disclosure review and approval reason.");
    await ctx.db.patch(snapshot._id, {
      approvalStatus: "approved",
      approvedBy: user._id,
      approvedAt: Date.now(),
      reviewNote: args.note.trim(),
    });
    await ctx.db.insert("audit_logs", { action: "reporting.snapshot_approved", entityType: "metric_snapshot", entityId: snapshot._id, userId: user._id, timestamp: Date.now(), metadata: { generatedBy: snapshot.generatedBy, changedFieldNames: ["approvalStatus", "approvedBy", "approvedAt", "reviewNote"] } });
    return { success: true };
  },
});

export const rejectSnapshot = mutation({
  args: { snapshotId: v.id("metric_snapshots"), reason: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "supervisor"]);
    const snapshot = await ctx.db.get(args.snapshotId);
    if (!snapshot || snapshot.approvalStatus !== "draft") throw new ConvexError("Only draft reports can be rejected.");
    if (snapshot.generatedBy === user._id) throw new ConvexError("A different reviewer must reject this report.");
    if (args.reason.trim().length < 10) throw new ConvexError("Record the rejection reason.");
    const now = Date.now();
    await ctx.db.patch(snapshot._id, { approvalStatus: "rejected", rejectedBy: user._id, rejectedAt: now, reviewNote: args.reason.trim() });
    await ctx.db.insert("audit_logs", { action: "reporting.snapshot_rejected", entityType: "metric_snapshot", entityId: snapshot._id, userId: user._id, timestamp: now, metadata: { changedFieldNames: ["approvalStatus", "reviewNote"] } });
    return { success: true };
  },
});

export const recordShareInitiated = mutation({
  args: { snapshotId: v.id("metric_snapshots") },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const snapshot = await ctx.db.get(args.snapshotId);
    if (!snapshot || snapshot.approvalStatus !== "approved") throw new ConvexError("Only approved reports may be shared.");
    const now = Date.now();
    const id = await ctx.db.insert("report_share_events", { snapshotId: snapshot._id, initiatedBy: user._id, initiatedAt: now, channel: "device_share_sheet" });
    await ctx.db.insert("audit_logs", { action: "reporting.share_initiated", entityType: "metric_snapshot", entityId: snapshot._id, userId: user._id, timestamp: now, metadata: { shareEventId: id } });
    return id;
  },
});

export const listShareEvents = query({
  args: { snapshotId: v.id("metric_snapshots") },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    return await ctx.db.query("report_share_events").withIndex("by_snapshot", (q) => q.eq("snapshotId", args.snapshotId)).order("desc").take(20);
  },
});

export const listSnapshots = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("approved"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    const actor = await requireAnyRole(ctx, ["admin", "staff", "supervisor", "stakeholder", "donor"]);
    const actorRoles = await getActiveRoles(ctx, actor.user._id);
    const hasOperationsReportingRole = actorRoles.some((role) => ["admin", "staff", "supervisor"].includes(role));
    const hasExternalReportingRole = actorRoles.some((role) => ["stakeholder", "donor"].includes(role));
    const externalReportingOnly = hasExternalReportingRole && !hasOperationsReportingRole;
    const status = externalReportingOnly ? "approved" : args.status ?? "approved";
    const snapshots = await ctx.db
      .query("metric_snapshots")
      .withIndex("by_status_generated", (q) => q.eq("approvalStatus", status))
      .order("desc")
      .take(12);

    return snapshots.map((snapshot) => ({
      _id: snapshot._id,
      periodStart: snapshot.periodStart,
      periodEnd: snapshot.periodEnd,
      generatedAt: snapshot.generatedAt,
      approvalStatus: snapshot.approvalStatus,
      definitionVersion: snapshot.definitionVersion,
      values: externalReportingOnly ? externalImpactValues(snapshot.values) : snapshot.values,
      qualityFlags: externalReportingOnly ? snapshot.qualityFlags.filter(flag => ["request_count_below_public_threshold", "case_count_below_public_threshold", "no_feedback_in_period"].includes(flag)) : snapshot.qualityFlags,
      publicSummary: externalReportingOnly ? "Approved summary figures. Small groups are hidden to protect people’s privacy." : snapshot.publicSummary,
      generatedBy: externalReportingOnly ? undefined : snapshot.generatedBy,
      approvedBy: externalReportingOnly ? undefined : snapshot.approvedBy,
      approvedAt: snapshot.approvedAt,
      reviewNote: externalReportingOnly ? undefined : snapshot.reviewNote,
    }));
  },
});
