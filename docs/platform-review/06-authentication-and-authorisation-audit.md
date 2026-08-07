# Authentication and Authorisation Audit

## Critical findings

- `users.makeAdmin` has no authentication. Any client can promote an email.
- `users.syncUser` has no identity check and accepts a caller-controlled `clerkId` and role. Clerk `unsafeMetadata` is passed by the client. This makes platform role authority forgeable.
- `users.generateUploadUrl`, SARA training/config/document functions, destructive seed functions, email actions and many CMS/newsletter functions are public.
- `ProtectedRoute` forces loading false after five seconds, checks roles only when a user object exists, then renders children. Authentication failure therefore fails open.
- Email allow-lists and a frontend PIN are authorization bypasses, not controls.

## Required server helpers

Create one `convex/lib/auth.ts` using typed query/mutation contexts:

- `requireAuthenticatedUser`: derive Clerk subject from `ctx.auth`; load active Convex user.
- `requireRole` / `requireAnyRole`: evaluate normalized role assignments, not client metadata.
- `requireOrganisationMember`: active membership plus organisation status.
- `requireCaseAccess`: participant, active assignee, scoped organisation member or LSF supervisor.
- `requireCaseSupervisor`, `requireContentEditor`, `requireSystemAdmin`: explicit capabilities.
- All helpers return the authorized actor and reject deleted/disabled accounts. Every sensitive write emits an immutable audit event.

## Target role/capability matrix

| Capability | Beneficiary | Paralegal | Partner staff | LSF staff | Supervisor | Editor | Admin | Donor |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Own request/case | own | assigned only | referred/assigned org | scoped | supervised scope | no | emergency break-glass | no |
| Case notes | no | assigned | assigned org | scoped | yes | no | break-glass | no |
| Assign/reassign | no | accept/decline | internal assignee | yes | yes | no | yes | no |
| Publish knowledge | no | propose | propose | propose | approve domain | edit | configure | no |
| Sensitive reports | submit | no default | no default | designated | designated | no | break-glass | no |
| User/role admin | own profile | own profile | own profile | no | no | no | yes | no |
| Aggregated reports | own | own workload | own org | programme | programme | content only | all aggregate | approved aggregate |

Users may have multiple role assignments. Capabilities should be calculated from active assignments, organisation scope and record relationship.

## Identity lifecycle

Clerk authenticates email/phone and recovery. A Clerk webhook or authenticated first-session mutation creates/updates the Convex profile using `identity.subject`; it never accepts role authority from the browser. Role grants require an audited admin workflow or approved paralegal/partner verification. Guest browsing and general AI remain possible; private intake drafts use a random local draft ID and are claimed atomically after authentication with a one-time signed claim token.

## Frontend rule

Protected routes render only one of: loading, signed-out redirect, forbidden, or authorized children. Missing/failed role lookup is forbidden/error, never authorized. This is usability defense only; Convex remains authoritative.
