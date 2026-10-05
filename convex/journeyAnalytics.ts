import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";
import { countDistinctReferralTransitions, summarizeTriage } from "./lib/journeyMetrics";

const surface = v.union(v.literal("web"), v.literal("mobile"));
const step = v.union(
  v.literal("find_help_search"),
  v.literal("find_help_no_results"),
  v.literal("request_review"),
  v.literal("service_call_open"),
  v.literal("service_directions_open"),
);

// Best-effort interaction counts. This endpoint accepts no free text or identity.
// Counts can be inflated by retries or abusive clients; they are not outcomes.
export const record = mutation({
  args: { surface, step },
  handler: async (ctx, args) => {
    const now = Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const existing = await ctx.db.query("journey_daily_counts")
      .withIndex("by_day_surface_step", (q) => q.eq("day", day).eq("surface", args.surface).eq("step", args.step))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { count: existing.count + 1, updatedAt: now });
    } else {
      await ctx.db.insert("journey_daily_counts", { day, surface: args.surface, step: args.step, count: 1, updatedAt: now });
    }
  },
});

export const overview = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin"]);
    const days = Math.min(90, Math.max(1, Math.floor(args.days ?? 30)));
    const start = new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0, 10);
    const rows = await ctx.db.query("journey_daily_counts")
      .withIndex("by_day", (q) => q.gte("day", start))
      .collect();
    const interactions = {
      web: { find_help_search: 0, find_help_no_results: 0, request_review: 0, service_call_open: 0, service_directions_open: 0 },
      mobile: { find_help_search: 0, find_help_no_results: 0, request_review: 0, service_call_open: 0, service_directions_open: 0 },
    };
    for (const row of rows) interactions[row.surface][row.step] += row.count;

    // Submitted requests come from domain records, including later status changes.
    const cutoff = Date.parse(`${start}T00:00:00.000Z`);
    const submitted = await ctx.db.query("legal_help_requests")
      .withIndex("by_submitted_at", (q) => q.gte("submittedAt", cutoff))
      .collect();
    const [planned, checkedIn, referralEvents, awaitingTriage] = await Promise.all([
      ctx.db.query("justice_service_visits").withIndex("by_created_at", (q) => q.gte("createdAt", cutoff)).collect(),
      ctx.db.query("justice_service_visits").withIndex("by_checked_in_at", (q) => q.gte("checkedInAt", cutoff)).collect(),
      ctx.db.query("referral_events").withIndex("by_occurred_at", (q) => q.gte("occurredAt", cutoff)).collect(),
      ctx.db.query("legal_help_requests").withIndex("by_status", (q) => q.eq("status", "submitted")).collect(),
    ]);
    const referralTypes = ["referral_consent_requested", "referral_consent_approved", "referral_consent_declined", "referral_accepted", "referral_declined", "referral_returned", "referral_service_delivered"] as const;
    const referrals = countDistinctReferralTransitions(referralEvents, referralTypes) as Record<(typeof referralTypes)[number], number>;
    return {
      periodDays: days,
      interactions,
      submittedRequests: submitted.length,
      triage: summarizeTriage(submitted, awaitingTriage, Date.now()),
      personalVisitPlans: planned.length,
      visitCheckIns: {
        total: checkedIn.length,
        helpful: checkedIn.filter((visit) => visit.outcome === "helpful").length,
        partlyHelpful: checkedIn.filter((visit) => visit.outcome === "partly_helpful").length,
        notHelpful: checkedIn.filter((visit) => visit.outcome === "not_helpful").length,
      },
      referrals,
    };
  },
});
