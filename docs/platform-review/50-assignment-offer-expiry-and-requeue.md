# Assignment Offer Expiry and Requeue

## What changed

- Assignment offers now carry an `expiresAt` timestamp.
- New offers expire after 48 hours if the provider does not respond.
- Convex runs an hourly cron to expire stale Haki Yangu assignment offers.
- Provider responses are guarded server-side, so an expired offer cannot be accepted even if the cron has not run yet.
- Staff have an Assignment offer monitor with status filtering and a manual "expire stale offers now" control.
- Provider dashboard shows the response window and highlights offers close to expiry.
- Expired offers create an internal case timeline event, notifications, and audit entries.

## Product reason

Legal-help requests should not stall because a provider missed an offer. Expiry keeps cases moving back through assignment operations and gives staff visibility into stalled handoffs.

## Operational policy

- Default response window: 48 hours.
- Staff can manually run stale-offer cleanup if urgent.
- Expiry does not expose beneficiary details in notifications.
- Expired offers remain auditable for workload and provider reliability review.

## Verification

- Schema includes `case_assignments.expiresAt` and `by_status_expires`.
- `offerAssignment` and `reassignCase` write expiry timestamps.
- `respondToAssignment` rejects stale offers.
- `expireStaleAssignmentOffers` is registered in `convex/crons.ts`.
- Staff and provider dashboards display assignment expiry state.
