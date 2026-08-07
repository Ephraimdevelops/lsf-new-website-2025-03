# Migration and Backward Compatibility Plan

## Strategy

Use additive schema changes and service adapters. Keep current public website reads working while new `v1` domain services are introduced. Do not expose new clients to legacy tables directly.

## Sequence

1. Snapshot/backup Convex and verify restoration; export Supabase if it has production data.
2. Add auth helpers, audit events and safe public projections without changing public page responses.
3. Add profile/role assignments/organisations/memberships; backfill one role assignment per current active `users.role`; dual-read during verification, then stop role writes to `users.role`.
4. Add taxonomy versions, requests, cases, assignments, events and notification outbox.
5. Wrap current website/CMS calls in stable services; preserve old aliases temporarily with usage telemetry and removal dates.
6. Migrate approved paralegal applications into verification/provider profiles while preserving application records as provenance.
7. Consolidate whistleblower code paths only after record-count/status comparison and safeguarding approval.
8. Migrate SARA configuration/history/sources under approved retention; route n8n UI through shared AI service, then revoke direct webhook.
9. Verify Supabase zero-write state, archive export, revoke keys and remove dependency/env/migrations only after owner sign-off.
10. Remove deprecated fields/functions after web/mobile versions below the compatibility floor are blocked or upgraded.

## Migration mechanics

Every migration is idempotent, versioned and writes a migration ledger with source count, destination count, skipped IDs, errors, checksum and operator. Dry-run in staging using sanitized data. Backfills paginate and resume. High-risk state transitions are not inferred from free text.

## Compatibility policy

Support current and previous mobile contract versions for a stated window. Server returns `minimumSupportedVersion` and neutral upgrade messaging. Enum additions are backward compatible; semantic changes require a version. Never reuse an old status code with a new meaning.

## Rollback

Feature flags stop new writes, old readers remain available, and additive fields/tables remain in place. Restore from backup only for corruption, not routine application rollback. External side effects use idempotency/outbox reconciliation so rollback does not duplicate messages or notifications.
