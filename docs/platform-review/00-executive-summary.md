# LSF–Haki Yangu Platform Review

**Assessment date:** 2026-08-04  
**Evidence base:** GitHub `main`, downloaded ZIP, local build, browser runtime, and authenticated GitHub commit/deployment metadata.  
**Decision:** **Do not release the current backend as a legal-case platform and do not start mobile screens.** The public-content website can be recovered, but the current authorization model is unsafe for beneficiary, paralegal, whistleblower, or case data.

## Honest product position

The repository is a public website/CMS prototype with Clerk identity, Convex content storage, two unrelated AI paths, public forms, and placeholder role dashboards. It is **not yet a case-management system**. There are no help-request, case, assignment, referral, appointment, message, notification, organisation-membership, consent, safeguarding, or outcome entities. Claims on `/haki-yangu` such as 50k users, 1,200 cases, “100% Privacy Guaranteed,” instant routing, and 48-hour resolution are hard-coded marketing copy and are not produced by this system.

## Release blockers

1. A logged-out caller can invoke `users.makeAdmin`; `users.syncUser` trusts caller-supplied `clerkId`, email, and role. This is direct privilege escalation.
2. Many CMS, newsletter, SARA training/configuration, paralegal, contact, debug, seed, email, and analytics functions have no server-side role check.
3. `ProtectedRoute` renders protected children after a five-second timeout even when user/role resolution failed.
4. Executable-looking legacy files were added together in commit `ec5005950e43` and copied into production output. Two contain unrelated Indonesian account/password forms. Later Vercel production deployments are confirmed.
5. `.env` is committed on GitHub and `.gitignore` does not exclude it. A public fallback admin PIN is bundled in the frontend.
6. Upload tickets can be issued without correct role checks; the server trusts caller-provided MIME/size metadata and does not verify file signatures.
7. Stored CMS HTML is rendered with `dangerouslySetInnerHTML` without an identified sanitizer. Contact email HTML interpolates user input.
8. Local UI cannot start because Clerk/Convex client configuration is missing. Live auth, CMS, SARA, forms, email, and Convex logs are therefore unverified.

## Target architecture

Clerk remains the identity provider. Convex becomes the single application system of record behind a versioned service layer shared by web and mobile. Roles, organisation memberships, verification and record-level permissions belong in Convex, never client metadata. SARA/Saada becomes one governed AI orchestration service using approved knowledge, versioned prompts, safety configuration, human escalation and monthly cost aggregates. Supabase should be decommissioned after a production-data check; it has migrations and configuration but no active application client usage.

## First complete release

The first product slice is: guided beneficiary help request → account/phone verification → staff triage → request-to-case conversion → verified paralegal assignment → secure case messaging → appointment/next action → outcome → beneficiary feedback. It must work across the current staff web app, Expo mobile app, Clerk, Convex and private notifications before utility features are added.

## Immediate order

1. Freeze production changes, preserve evidence/logs, remove contaminated public artifacts in a dedicated security commit, rotate high-risk credentials, and review access logs.
2. Fix privilege escalation and centralize Convex authorization; deny unresolved frontend routes.
3. Secure HTML, forms, uploads, webhooks and environment handling; add CI quality gates.
4. Approve identity/role, organisation, request/case, assignment/referral, messaging, notification and audit contracts.
5. Approve SARA/Saada naming and one authoritative AI backend.
6. Implement the vertical slice; only then scaffold product expansion.

Owner decisions are tracked in [23-open-questions-and-decisions.md](23-open-questions-and-decisions.md). The executable backlog is in [21-phased-execution-roadmap.md](21-phased-execution-roadmap.md).
