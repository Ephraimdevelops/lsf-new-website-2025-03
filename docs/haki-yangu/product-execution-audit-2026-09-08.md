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
| Staff service management UI | New partial | Staff operations now includes a Services tab for creating, verifying, deactivating, reviewing, and seeding justice service records. |
| Destination organization modeling | New partial | Staff can create partner organizations with verification status, referral agreement status, focal contact, SLA, safeguarding readiness, data-sharing version, and link service points to those organizations. |
| Partner SLA analytics | New partial | Staff Services now shows partner referral performance for the last 30 days, including response rate, SLA compliance, overdue open referrals, average response hours, delivery count, closure count, onward referrals, and linked service names. |
| Referral graph foundation | New partial | `referrals` and `referral_events` tables now track consented case handoffs across verified justice services. |
| Beneficiary referral visibility | New partial | Mobile case details now include a Referrals tab showing destination, status, shared information, reason, and referral events. |
| Staff referral operations | New partial | Staff dashboard now includes a Referrals tab with queue filtering and status actions for notified, accepted, declined, scheduled, delivered, returned, escalated, and closed states. |
| Staff referral creation | New partial | Staff can create a referral from a selected case by choosing a verified referral-capable service, recording reason, and listing minimum information shared. Signed consent artifact capture remains required. |
| Provider referral inbox | New partial | Provider/paralegal dashboard now includes a referral inbox for destination-assigned referrals with accept, decline, return, schedule, deliver, and close actions. |
| Referral consent evidence | Improved partial | Referral creation now records consent method, statement, evidence note, destination service, staff recorder, minimum shared information, optional signed evidence file metadata, retention date/status, a staff evidence review queue, and an hourly retention-expiry flag. Final purge/export legal policy remains required. |
| Onward referral chaining | New partial | Assigned providers can create an onward referral from accepted/scheduled/delivered referrals, with a child referral, parent referral status update, consent record, audit event, notifications, staff visibility, and beneficiary mobile chain labels. |
| Contract regression suite | Passing | `npm run test:haki-contracts` passes 28/28. |
| Mobile typecheck | Passing | `cd mobile && npm run typecheck` passes. |
| Root build/security | Passing | `npm run build` and `npm run test:security` pass. |

## Product Map

| Product Capability | Current State | Honest Read |
| --- | --- | --- |
| Public website | Partial/strong visual | Main LSF website builds. CMS/admin media issue was previously investigated, but full content governance and donor/reporting workflows still need hardening. |
| Admin/staff dashboard | Partial | Staff case workflow, Justice Service Management, assignment monitor, reviews, documents, and a first referral operations queue exist. Escalation, reporting, and mature workload operations remain incomplete. |
| Beneficiary mobile home | Visual/interactive | Stronger premium home direction exists, with paralegal-first flow and quick tools. Needs real device QA after auth config. |
| Mobile sign-in/sign-up | Implemented, unverified on device | Code is wired to Clerk. Clerk Dashboard must enable Native Applications before runtime sign-in will work. |
| Guest mode | Partial | Public routes work, but guest-to-account claim flow is not implemented yet. |
| Intake/help request | Partial/connected | Intake draft and submission flow exist. Needs stronger mapping into service/referral/case lifecycle and guest claim. |
| Case tracking | Partial/connected | Case timeline, messages, documents, appointments, referrals, feedback, review requests exist. Needs full staff/provider operational QA. |
| Paralegal discovery | Partial/connected | Public approved provider listing exists with safer projection and matching language. Needs seeded real providers, service coverage, capability scoring, and map support. |
| Governed matching engine | Partial | Deterministic public service matching now records `matching_decisions`; referral records now capture downstream handoff state. Still needs richer scoring, staff review UI, safeguarding restrictions, bias/fairness review, and pathway integration. |
| Referral graph | Partial | Case-to-service referral tables, optional destination provider assignment, event trail, beneficiary case visibility, selected-case staff referral creation, staff queue actions, provider referral response UI, consent evidence records with signed-file upload/review/retention flagging, onward referral chaining, organization-linked service points, and partner SLA performance analytics now exist. Missing final retention purge/export policy and donor-safe reporting snapshots. |
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
5. Add final retention purge/export policy after LSF legal approval.
6. Add donor-safe reporting snapshots and exports.
7. Add matching-decision review screens and safeguarding restrictions.
8. Unify mobile Saada to the governed Convex AI backend.
9. Add AI risk assessment records, consent gates, escalation, and audit events.
10. Complete appointment booking from paralegal/service profile through request, confirmation, reschedule, cancel, complete/no-show.
11. Complete donor-safe reporting dashboard and monthly snapshot generation.
12. Run full mobile device QA, accessibility QA, low-bandwidth QA, and safeguarding review.

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
| Backend case-management foundation | 75% |
| Website/admin integration | 77% |
| AI governance | 35% |
| App-store readiness | 30% |
| Donor-ready platform credibility | 69% |

Overall product completion: about 69%. This can be shown as an advanced working prototype plus real backend foundation, service directory, organization-linked referral graph with staff/provider handoff, signed-file consent evidence support, onward referral chaining, and early partner SLA analytics, not as a finished national-scale justice platform yet.
