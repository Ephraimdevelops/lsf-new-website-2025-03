# Mobile QA Seed Matter

Date: 2026-09-09

## What Changed

Added `hakiYanguSeed.seedMyMobileQaMatter`, a guarded development/staging utility that creates real Convex records for the currently signed-in mobile beneficiary:

- legal-help request
- intake answer
- case
- beneficiary case participant
- case conversation
- case timeline events
- case message
- case document
- scheduled appointment
- safe notification

The mutation is idempotent for the signed-in user and reuses the same synthetic client request ID instead of creating duplicates.

## Guardrail

The mutation is disabled unless the Convex environment variable `HAKI_ALLOW_MOBILE_QA_SEED` is exactly `true`.

This keeps presentation data out of production by default while still allowing a real connected mobile walkthrough in development or staging.

## Why It Matters

After removing fake private-screen fallbacks, an empty development account correctly shows no cases, documents, or notifications. This utility gives LSF a safer way to demonstrate the real app journey using actual backend records instead of hardcoded client records.

## Honest Limits

Still required:

- A small staff/admin tool or CLI procedure to trigger this for selected QA users.
- Real Clerk Native Applications setup before device sign-in can be tested.
- Seeded provider/staff accounts for the full beneficiary-to-staff-to-provider vertical slice.
- Replacement with verified live provider/service data before production.
