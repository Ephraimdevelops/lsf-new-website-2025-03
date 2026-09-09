# Mobile Identity Bootstrap

Date: 2026-09-09

## What Changed

The production mobile app now includes a Clerk-to-Convex identity bootstrap:

- `mobile/src/useStoreUserEffect.ts` reads the authenticated Clerk user.
- The hook calls `users.syncUser` with Clerk ID, email, name, and profile image.
- The hook avoids repeated sync calls for the same restored Clerk session.
- `mobile/app/_layout.tsx` mounts the hook inside the Clerk and Convex provider tree.

## Why It Matters

Clerk answers who the person is, but Convex enforces what that person can access. Without this bootstrap, a mobile user could sign in successfully but still fail case, document, appointment, and notification queries because no matching Convex `users` record exists.

## Honest Limits

Still required:

- Clerk Native Applications must be enabled before device sign-in can be verified.
- Account recovery, MFA, and deep-link callback behavior need device QA.
- Guest-to-account claim flow is still missing.
- Role assignment beyond ordinary beneficiary remains server-side/admin controlled and must not be added through mobile client metadata.
