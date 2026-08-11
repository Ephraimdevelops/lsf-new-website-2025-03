# 44. Paralegal approval to assignable access bridge

## What changed

- Added a shared Convex helper for approved paralegal access activation.
- When staff approve a paralegal application, the platform now:
  - marks the profile verified
  - sets approval metadata
  - grants an active paralegal role assignment if a matching user account exists
  - upgrades the legacy user role from `user` to `paralegal` where needed
- Manual paralegal creation and CSV import now use the same activation path.
- Clerk user sync now activates paralegal access when a user signs in with an email that already has an approved paralegal profile.

## Product reason

The mobile app directory was already backed by approved paralegal profiles, and staff-side matching was already ranking assignable service providers. The risk was that an approved profile could be visible in discovery but not actually assignable in case operations unless a separate user role existed.

This closes that operational mismatch:

- directory profile
- provider workspace access
- staff matching recommendations
- assignment offer/acceptance

now line up around the same approved paralegal identity.

## Matching status

Matching exists today as a staff-assisted workflow:

- staff convert a legal-help request into a case
- provider recommendations rank paralegals/providers by location, district, issue fit, verification, and current workload
- staff send an assignment offer
- the paralegal/provider accepts before receiving case access

This is the right model for a legal-aid product because direct automatic assignment can create safety, conflict-of-interest, and capacity risks.

## Verification

- `npx convex codegen` passed.
- Root `npx tsc --noEmit` passed.
- Mobile `npm run typecheck` passed.
- `npm run test:security` passed.
- `npm run test:haki-contracts` passed, now 7/7.
- `git diff --check` passed.
- `npm run build` passed.

## Remaining risk

- A real staff approval and paralegal sign-in should be tested against Clerk + Convex data on a live dev deployment.
- Conflict-of-interest, safeguarding exclusions, and geographic catchment rules are still policy inputs that LSF must define before fully automated assignment.
