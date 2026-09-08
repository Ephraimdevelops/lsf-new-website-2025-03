# Haki Yangu Product Execution Audit

Date: 2026-09-08  
Owner: Legal Services Facility  
Scope: website, admin/staff operations, Convex backend, Expo mobile app, Saada AI, justice-service workflows

## Current Truth

The platform is past a visual prototype, but it is not yet a finished market-ready justice product. The strongest completed layer is the case-management backend foundation. The weakest layers are real mobile authentication QA, Saada governance depth, seeded service/provider data, staff service operations, donor analytics, and production release hardening.

## Implemented In This Pass

| Area | Status | Evidence |
| --- | --- | --- |
| Mobile auth facade removed | Done | `mobile/src/auth.ts` now re-exports Clerk Expo hooks instead of fake signed-out hooks. |
| Clerk provider added | Done | `mobile/app/_layout.tsx` wraps production app with `ClerkProvider`. |
| Convex auth bridge added | Done | `mobile/app/_layout.tsx` uses `ConvexProviderWithClerk`. |
| Secure token cache | Done | Clerk token cache uses `expo-secure-store` with device-only keychain access. |
| Real sign-in/sign-up UI | Partial | Email/password sign-in and email-code sign-up are implemented. Account recovery/MFA remain dependent on Clerk Native Applications configuration. |
| SecureStore key crash | Done | Local keys were normalized to `haki_yangu_*` format. |
| Paralegal matching UX | Improved | Directory now shows “Why this may fit,” “For sensitive cases,” and “Let LSF match me.” |
| Production demo fallback removal | Partial | Paralegal and appointment screens no longer pretend fake backend data is real. Document/case demo cleanup still needs a repo-wide pass. |
| Backend directory seed | Done | `hakiYanguSeed.seedMobileDirectory` can seed verified mobile paralegal records through an admin/staff-authenticated mutation. |
| Justice Service Directory foundation | New partial | `justice_services` and `matching_decisions` tables plus public/staff Convex functions now exist. |
| Contract regression suite | Passing | `npm run test:haki-contracts` passes 27/27. |
| Mobile typecheck | Passing | `cd mobile && npm run typecheck` passes. |
| Root build/security | Passing | `npm run build` and `npm run test:security` pass. |

## Product Map

| Product Capability | Current State | Honest Read |
| --- | --- | --- |
| Public website | Partial/strong visual | Main LSF website builds. CMS/admin media issue was previously investigated, but full content governance and donor/reporting workflows still need hardening. |
| Admin/staff dashboard | Partial | Staff case workflow exists, but justice-service management, escalation queues, and reporting operations are not fully mature. |
| Beneficiary mobile home | Visual/interactive | Stronger premium home direction exists, with paralegal-first flow and quick tools. Needs real device QA after auth config. |
| Mobile sign-in/sign-up | Implemented, unverified on device | Code is wired to Clerk. Clerk Dashboard must enable Native Applications before runtime sign-in will work. |
| Guest mode | Partial | Public routes work, but guest-to-account claim flow is not implemented yet. |
| Intake/help request | Partial/connected | Intake draft and submission flow exist. Needs stronger mapping into service/referral/case lifecycle and guest claim. |
| Case tracking | Partial/connected | Case timeline, messages, documents, appointments, feedback, review requests exist. Needs full staff/provider operational QA. |
| Paralegal discovery | Partial/connected | Public approved provider listing exists with safer projection and matching language. Needs seeded real providers, service coverage, capability scoring, and map support. |
| Governed matching engine | Partial | Deterministic public service matching now records `matching_decisions`; still needs richer scoring, staff review UI, safeguarding restrictions, bias/fairness review, and pathway integration. |
| Appointments | Partial/connected | Backend-backed my-appointments list exists. Booking request/confirmation lifecycle needs final UX and staff/provider scheduling workflow. |
| Documents | Partial/connected | Upload, case docs, generated letters, and library exist. Needs stricter consent screens, retention policy, file review operations, and malware/content scanning plan. |
| Document checker | Practical prototype | Pre-signing checklist and explicit attach-to-case consent exist. AI document analysis is not production governed yet. |
| Demand-letter builder | Good MVP | Offline draft/save/share/attach exists. Needs more templates, Swahili legal copy review, export-to-PDF, and human-review prompts. |
| Saada AI | Partial | Web Convex action exists with RAG and guardrails. Mobile assistant is not fully unified to governed backend tooling yet. Public name must stay Saada. |
| AI agentic tools | Not ready | No production-safe tool execution loop with user confirmation, policy gate, audit trail, and rollback. |
| Safeguarding/GBV | Partial | Safety plan/emergency concepts exist. Needs restricted safeguarding workspace, critical escalation flow, safe language, and partner protocols. |
| Offline/low-data | Partial | Pending queue exists for selected case actions. Needs broader offline read cache, sync status, duplicate prevention across more flows, and field testing. |
| Notifications | Partial | Safe notification translation and push delivery records exist. Expo Go warns about notification limits; production needs development build/EAS build QA. |
| Analytics/donor reporting | Early | Some analytics tables exist. Needs metric definitions, reporting snapshots, privacy-preserving dashboards, and donor-ready exports. |
| App Store readiness | Not ready | Needs production Clerk/Convex env, EAS project, privacy policy, screenshots, TestFlight, crash monitoring, device QA, accessibility QA, and Tanzanian legal/content review. |

## Required Next Execution Order

1. Finish real mobile auth QA.
2. Enable Clerk Native Applications and test sign-in/sign-up on iPhone Expo Go or a development build.
3. Seed development Convex with real-looking but non-sensitive LSF service providers, paralegals, legal clinics, guides, sample cases, and appointments.
4. Build guest-to-account claim flow for intake drafts and document/letter attachments.
5. Complete Justice Service Directory schema and staff management UI.
6. Add matching-decision records and staff override screens.
7. Unify mobile Saada to the governed Convex AI backend.
8. Add AI risk assessment records, consent gates, escalation, and audit events.
9. Complete appointment booking from paralegal/service profile through request, confirmation, reschedule, cancel, complete/no-show.
10. Complete donor-safe reporting dashboard and monthly snapshot generation.
11. Run full mobile device QA, accessibility QA, low-bandwidth QA, and safeguarding review.

## Immediate Blockers

| Blocker | Why It Matters | Required Action |
| --- | --- | --- |
| Clerk Native Applications disabled | Real mobile login will throw `Native API is disabled`. | In Clerk Dashboard, enable Native Applications for the active instance. |
| Live key was pasted in chat | Secret key exposure risk. | Rotate `CLERK_SECRET_KEY` in Clerk before production. Publishable key can remain public, secret key cannot. |
| No verified seed data guarantee | Reduced | Run `npx convex run hakiYanguSeed:seedMobileDirectory` and `npx convex run hakiYanguSeed:seedJusticeServices` while signed in as admin/staff to populate verified QA records. Replace seed records with live verified provider data before production. |
| Saada mobile not fully governed | AI cannot be presented as production legal support without controls. | Route mobile assistant through Convex AI action with policy/risk/audit. |
| No app-store build QA | Expo Go is not a production runtime and notifications are limited. | Create EAS development build, then TestFlight/internal Android build. |

## Completion Estimate

| Dimension | Current Completion |
| --- | --- |
| Visual mobile presentation | 75% |
| Real beneficiary mobile MVP | 50% |
| Backend case-management foundation | 65% |
| Website/admin integration | 65% |
| AI governance | 35% |
| App-store readiness | 30% |
| Donor-ready platform credibility | 55% |

Overall product completion: about 55%. This can be shown as an advanced working prototype plus real backend foundation, not as a finished national-scale justice platform yet.
