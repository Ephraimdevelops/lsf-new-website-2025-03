# Haki Yangu Product Execution Audit

Date: 2026-09-09
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
| Mobile identity bootstrap | New partial | Mobile now syncs a signed-in Clerk user into Convex through `users.syncUser`, preventing authenticated mobile sessions from missing required server-side user records. Device QA remains required. |
| Secure token cache | Done | Clerk token cache uses `expo-secure-store` with device-only keychain access. |
| Real sign-in/sign-up UI | Partial | Email/password sign-in and email-code sign-up are implemented. Account recovery/MFA remain dependent on Clerk Native Applications configuration. |
| SecureStore key crash | Done | Local keys were normalized to `haki_yangu_*` format and Clerk token-cache keys are rejected unless they match SecureStore's allowed key pattern. |
| Paralegal matching UX | Improved | Directory now shows “Why this may fit,” “For sensitive cases,” and “Let LSF match me.” |
| Private mobile demo fallback removal | Improved | Cases, documents, notifications, paralegal discovery, and appointments no longer pretend fake backend records are real in production app flows. Explicit prototype review mode remains separate. |
| Backend directory seed | Done | `hakiYanguSeed.seedMobileDirectory` can seed verified mobile paralegal records through an admin/staff-authenticated mutation. |
| Mobile QA matter seed | New partial | `hakiYanguSeed.seedMyMobileQaMatter` can create real request, case, message, document, appointment, and notification records for the signed-in beneficiary when the development/staging environment explicitly enables `HAKI_ALLOW_MOBILE_QA_SEED=true`. |
| Justice Service Directory foundation | New partial | `justice_services` and `matching_decisions` tables plus public/staff Convex functions now exist. |
| Staff service management UI | New partial | Staff operations now includes a Services tab for creating, verifying, deactivating, reviewing, and seeding justice service records. |
| Destination organization modeling | New partial | Staff can create partner organizations with verification status, referral agreement status, focal contact, SLA, safeguarding readiness, data-sharing version, and link service points to those organizations. |
| Partner SLA analytics | New partial | Staff Services now shows partner referral performance for the last 30 days, including response rate, SLA compliance, overdue open referrals, average response hours, delivery count, closure count, onward referrals, and linked service names. |
| Matching governance | New partial | `matching_decisions` now carry review status, reviewer, notes, and restriction reason. Staff dashboard includes a Matching review queue with approve, needs-changes, escalation, and restriction actions. Immediate-safety matches are restricted from returning ordinary public recommendations until safeguarding review. |
| Referral graph foundation | New partial | `referrals` and `referral_events` tables now track consented case handoffs across verified justice services. |
| Beneficiary referral visibility | New partial | Mobile case details now include a Referrals tab showing destination, status, shared information, reason, and referral events. |
| Staff referral operations | New partial | Staff dashboard now includes a Referrals tab with queue filtering and status actions for notified, accepted, declined, scheduled, delivered, returned, escalated, and closed states. |
| Staff referral creation | New partial | Staff can create a referral from a selected case by choosing a verified referral-capable service, recording reason, and listing minimum information shared. Signed consent artifact capture remains required. |
| Provider referral inbox | New partial | Provider/paralegal dashboard now includes a referral inbox for destination-assigned referrals with accept, decline, return, schedule, deliver, and close actions. |
| Referral consent evidence | Improved partial | Referral creation now records consent method, statement, evidence note, destination service, staff recorder, minimum shared information, optional signed evidence file metadata, retention date/status, a staff evidence review queue, and an hourly retention-expiry flag. Final purge/export legal policy remains required. |
| Onward referral chaining | New partial | Assigned providers can create an onward referral from accepted/scheduled/delivered referrals, with a child referral, parent referral status update, consent record, audit event, notifications, staff visibility, and beneficiary mobile chain labels. |
| Mobile appointment booking bridge | New partial | Signed-in mobile users can choose an open case, select phone/remote/in-person support, add preferred time and note, and submit a real appointment request. Paralegal list/profile booking buttons pass provider context into that request. |
| Appointment request confirmation | New partial | Staff and providers can now confirm a beneficiary appointment request directly from the case timeline event into a scheduled appointment, preserving request context, notifying the beneficiary, and marking the request event as scheduled. |
| Contract regression suite | Passing | `npm run test:haki-contracts` passes 29/29. |
| Mobile typecheck | Passing | `cd mobile && npm run typecheck` passes. |
| Root build/security | Passing | `npm run build` and `npm run test:security` pass. |

## Product Map

| Product Capability | Current State | Honest Read |
| --- | --- | --- |
| Public website | Partial/strong visual | Main LSF website builds. CMS/admin media issue was previously investigated, but full content governance and donor/reporting workflows still need hardening. |
| Admin/staff dashboard | Partial | Staff case workflow, Justice Service Management, assignment monitor, reviews, documents, and a first referral operations queue exist. Escalation, reporting, and mature workload operations remain incomplete. |
| Beneficiary mobile home | Visual/interactive | Stronger premium home direction exists, with paralegal-first flow and quick tools. Needs real device QA after auth config. |
| Mobile sign-in/sign-up | Implemented, unverified on device | Code is wired to Clerk and now bootstraps the matching Convex user profile. Clerk Dashboard must enable Native Applications before runtime sign-in will work. |
| Guest mode | Partial/improved | Public routes work and private screens now ask for secure sign-in instead of showing fake records. Guest-to-account claim flow is not implemented yet. |
| Intake/help request | Partial/connected | Intake draft and submission flow exist. A guarded QA seed can create a real connected sample matter for a signed-in beneficiary. Needs stronger mapping into service/referral/case lifecycle and guest claim. |
| Case tracking | Partial/connected | Case timeline, messages, documents, appointments, referrals, feedback, review requests exist. Private mobile case/document/notification screens now show real account state only. Needs full staff/provider operational QA. |
| Paralegal discovery | Partial/connected | Public approved provider listing exists with safer projection and matching language. Needs seeded real providers, service coverage, capability scoring, and map support. |
| Governed matching engine | Partial/improved | Deterministic public service matching now records `matching_decisions`, safety-critical routing is restricted, and staff can review/approve/escalate/restrict recommendations. Still needs richer scoring, bias/fairness review, beneficiary-facing outcome states, and deeper pathway integration. |
| Referral graph | Partial | Case-to-service referral tables, optional destination provider assignment, event trail, beneficiary case visibility, selected-case staff referral creation, staff queue actions, provider referral response UI, consent evidence records with signed-file upload/review/retention flagging, onward referral chaining, organization-linked service points, and partner SLA performance analytics now exist. Missing final retention purge/export policy and donor-safe reporting snapshots. |
| Appointments | Partial/connected | Backend-backed my-appointments list exists, case details and standalone mobile booking can request appointments, and staff/providers can confirm requested appointments into scheduled appointments. Needs true availability slots, reschedule/cancel request flow, conflict detection, and production reminder QA. |
| Documents | Partial/connected | Upload, case docs, generated letters, and library exist. Needs stricter consent screens, retention policy, file review operations, and malware/content scanning plan. |
| Document checker | Practical prototype | Pre-signing checklist and explicit attach-to-case consent exist. AI document analysis is not production governed yet. |
| Demand-letter builder | Good MVP | Offline draft/save/share/attach exists. Needs more templates, Swahili legal copy review, export-to-PDF, and human-review prompts. |
| Saada AI | Partial/improved | Web and mobile now call the governed Convex action with source labels. The action has kill-switch, budget cap, emergency keyword bypass, RAG confidence warning, paralegal lookup tooling, risk-event logging, and basic staff disposition. Still needs case-linked sessions, AI-to-case follow-up automation, legal-content evals, and production model monitoring. |
| AI agentic tools | Early governance | Saada now records policy/risk events, paralegal-tool routing, and staff disposition states. Full production-safe tool execution with user confirmation, case-linked handoff, policy gate, and rollback is not ready. |
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
7. Add case-linked Saada sessions and convert selected AI risk events into case/safeguarding follow-up tasks.
8. Add legal-content evaluation sets, safer answer templates, and human-escalation routing for risky AI sessions.
9. Complete appointment reschedule/cancel request flow, provider availability slots, conflict detection, and reminder QA.
10. Add beneficiary-facing matching review states so restricted recommendations explain safe next steps without exposing unsafe destinations.
11. Complete donor-safe reporting dashboard and monthly snapshot generation.
12. Run full mobile device QA, accessibility QA, low-bandwidth QA, and safeguarding review.

## Immediate Blockers

| Blocker | Why It Matters | Required Action |
| --- | --- | --- |
| Clerk Native Applications disabled | Real mobile login will throw `Native API is disabled`. | In Clerk Dashboard, enable Native Applications for the active instance. |
| Live key was pasted in chat | Secret key exposure risk. | Rotate `CLERK_SECRET_KEY` in Clerk before production. Publishable key can remain public, secret key cannot. |
| No verified seed data guarantee | Reduced | Run `npx convex run hakiYanguSeed:seedMobileDirectory` and `npx convex run hakiYanguSeed:seedJusticeServices` as admin/staff for directory QA. Enable `HAKI_ALLOW_MOBILE_QA_SEED=true` only in development/staging before creating a signed-in beneficiary QA matter. Replace seed records with live verified provider data before production. |
| Saada mobile not fully governed | Reduced | Mobile now routes through the governed Convex AI action and records risk events; staff can disposition those events. Case-linked AI sessions, AI-to-case follow-up, and legal-content evals remain required. |
| No app-store build QA | Expo Go is not a production runtime and notifications are limited. | Create EAS development build, then TestFlight/internal Android build. |

## Completion Estimate

| Dimension | Current Completion |
| --- | --- |
| Visual mobile presentation | 75% |
| Real beneficiary mobile MVP | 56% |
| Backend case-management foundation | 75% |
| Website/admin integration | 79% |
| AI governance | 46% |
| App-store readiness | 30% |
| Donor-ready platform credibility | 75% |

Overall product completion: about 75%. This can be shown as an advanced working prototype plus real backend foundation, service directory, governed matching review, governed mobile/web Saada action routing with risk-event logging and basic staff disposition, organization-linked referral graph with staff/provider handoff, signed-file consent evidence support, onward referral chaining, mobile case-linked appointment requests, staff/provider request confirmation, mobile Clerk-to-Convex identity bootstrap, production private-screen demo fallback removal, guarded mobile QA matter seeding, and early partner SLA analytics, not as a finished national-scale justice platform yet.
