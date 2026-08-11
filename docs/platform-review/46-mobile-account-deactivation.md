# 46. Mobile account deactivation and deleted-user guard

## What changed

- Added `users.deactivateMyProfile`.
- The mutation:
  - requires an authenticated user
  - blocks staff/admin/supervisor self-deactivation
  - revokes active additive role assignments
  - marks the Convex user profile as deleted with `isDeleted` and `deletedAt`
- `users.syncUser` now refuses to silently restore a deleted Convex profile.
- `users.getCurrentUser` now hides deleted users.
- `users.updateProfile` now uses the shared authenticated-user guard.
- Mobile profile now exposes a destructive confirmation flow to deactivate the Haki Yangu profile.

## Product reason

The schema already modeled soft deletion, but the sync path could revive a deleted user on the next Clerk sync. That is a serious account lifecycle gap for a legal-aid app because a person may intentionally stop access from a device or account.

The app now distinguishes between:

- Haki Yangu profile deactivation in Convex
- external sign-in provider account lifecycle through Clerk

The mobile copy explicitly says deactivation affects Haki Yangu access, not necessarily the external login account.

## Verification

- `npx convex codegen` passed.
- Root `npx tsc --noEmit` passed.
- Mobile `npm run typecheck` passed.
- Contract tests now include deleted-profile restore protection.
- Security classifier now classifies `users.deactivateMyProfile` as authenticated self-service.

## Remaining risk

- Full account deletion from Clerk is not implemented here.
- Data retention policy still needs LSF/legal sign-off because case records, audit logs, messages, and documents may have legal retention requirements.
