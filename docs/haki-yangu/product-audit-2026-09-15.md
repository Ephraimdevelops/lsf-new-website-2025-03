# Haki Yangu product audit against master execution brief

Date: 2026-09-15  
Scope: Web app, mobile app, shared Convex backend, Saada, service directory, governance, case/referral workflows, RAG knowledge base and launch readiness.

## Executive status

The platform is not complete and should not be described as 98% launch-ready yet.

The current repository is materially stronger than a prototype: web build passes, mobile typecheck passes, Clerk/Convex auth foundations exist, case/referral/provider/staff/directory/Saada foundations exist, and recent privacy fixes reduce referral and public paralegal leakage. The remaining work is now mostly product maturity work: real governed data, complete user workflows, AI governance, confirmation gates, runtime role-boundary QA, mobile device verification, and operational handover.

Practical maturity estimate:

- Engineering foundation: about 75-80%.
- End-to-end product completeness: about 65-72%.
- Launch readiness for a real Tanzania public legal-aid rollout: about 55-65% until verified data, governance approval, QA, and pilot checks are completed.

This estimate is conservative because a justice platform is only complete when it is safe, governed, verified, and operationally usable, not only when screens compile.

## Evidence from current repository

| Area | Evidence | Status |
| --- | --- | --- |
| Shared backend | Web and mobile use Convex contracts. Mobile uses `ConvexProviderWithClerk`; web routes use Convex queries/mutations. | Partial / strong foundation |
| Web auth | Web routes use Clerk-backed `ProtectedRoute` and `api.users.currentAccess`. | Partial |
| Mobile auth | Mobile has Clerk provider, secure token cache, sign in, sign up and reset-password flow. | Partial |
| Legacy auth risk | `src/utils/auth.ts` still contains localStorage token helpers. It appears legacy/unused from current `rg`, but should be removed or isolated so nobody reuses it. | Remaining risk |
| Case management | Backend tables/functions exist for cases, documents, messages, appointments, feedback/reviews and events. Beneficiary and mobile case screens exist. | Partial |
| Referrals | Referral backend and provider/staff workflows exist; recent projection fix avoids returning raw operational records to beneficiaries. | Partial improved |
| Justice service directory | Backend supports paralegals, legal aid providers, government offices, local government, police gender/children desks, social welfare, courts/tribunals, labour, land, mediation, CSOs, protection services, safe houses and other. Staff UI has now been updated to manage the full taxonomy. | Partial improved |
| Matching | `matchServices` creates decision records with reasons, safety restriction and staff review queue. | Partial |
| Saada chat | Web and mobile chat screens exist. Backend records real activity events for risk checks, knowledge search, service search, tool execution, completion and failure. | Partial improved |
| Saada tools | Current real tool support is still narrow. The implemented allow-listed tool is mainly `find_paralegals`; case/referral/appointment/document/draft tools are not complete. | Major gap |
| Saada RAG | PDF ingestion, chunking and embedding exist. Current document metadata is too thin for authoritative legal knowledge governance. | Major gap |
| Safeguarding | Roles and safety restriction foundations exist; safe-house public visibility is blocked in backend and staff UI now defaults safe-house entries to restricted. | Partial |
| Data | Staged data packs exist, but they are not approved authoritative production data. Real Tanzania institutions and contact points must be verified before public use. | Major gap |
| Analytics/reporting | Admin/staff/donor reporting foundations exist. | Partial |
| Visual/device QA | Web build and mobile typecheck pass. Full route sweep, device screen review, accessibility checks and offline/low-data QA are still pending. | Major gap |

## User types and access model

The platform currently supports these practical user groups:

| User type | How they use the app | Access scope | Completeness |
| --- | --- | --- | --- |
| Public / guest beneficiary | Reads public content, asks Saada, searches help, can start a request. | Public directory and public guidance only; sensitive case actions require auth. | Partial |
| Registered beneficiary | Creates legal help requests, views own case, messages, appointments, documents, feedback/reviews, referrals where exposed. | Own profile, own requests, own cases, own safe projected referral progress. | Partial |
| Paralegal / provider staff | Receives assigned referrals/cases, accepts or declines, communicates, records service progress. | Provider-scoped operational data. | Partial |
| LSF staff / navigator | Triage, cases, referrals, matching queue, service directory and operational review. | Operational workspace for managed cases and directory data. | Partial strong |
| Supervisor / admin | Governance, users/roles, content, service directory, reporting, configuration. | Broad platform management. | Partial |
| Safeguarding officer | Handles restricted safety-sensitive matters and immediate-risk routing. | Restricted safeguarding queues and safe records. | Partial |
| Donor / stakeholder | Reads aggregate, donor-safe reporting. | Aggregate reporting only, no personally sensitive case data. | Partial |

The access model is directionally correct, but it still needs runtime tests with seeded accounts for every role boundary: beneficiary cannot see another beneficiary case; provider cannot see another provider assignment; donor cannot see PII; safeguarding records stay restricted.

## Five real beneficiary scenarios checked against the product

| Scenario | Expected justice journey | What exists now | Remaining work |
| --- | --- | --- | --- |
| A woman facing domestic violence in Mwanza needs safe help now. | App must detect safety risk, avoid exposing unsafe addresses, route to safeguarding/human support, show emergency-safe language, and avoid public safe-house disclosure. | Risk detection and restricted matching foundation exist. Safe-house public visibility is blocked. | Full safeguarding incident workflow, restricted notes, human escalation SLA, verified protection contacts and non-public safe-house handling remain. |
| A worker in Dar es Salaam was terminated without pay. | Saada explains labour pathway, asks region/district, searches labour/legal-aid help, creates a request/case, schedules follow-up. | Labour issue category and service matching foundation exist; cases and appointments exist. | Labour pathway RAG must be approved; Saada cannot yet create appointment/referral through governed confirmation gates. |
| A rural land dispute beneficiary in Dodoma has no lawyer. | App collects facts in simple language, explains land pathway, finds local paralegal/land office/tribunal, creates case and referral. | Land services are supported; directory/matching/case foundations exist. | Verified land offices/tribunals/paralegals data is needed; pathway engine and referral automation need completion. |
| A child maintenance or family dispute beneficiary needs mediation. | App asks safe structured questions, offers mediation/legal-aid/social welfare pathway, creates case, tracks appointment and documents. | Social welfare and mediation service types are now manageable in staff UI/backend; case documents and messages exist. | Family pathway content, child-sensitive safeguards, document templates and appointment lifecycle need completion. |
| A person with disability needs accessible nearby legal aid. | App must find verified providers with language/disability/accessibility metadata and contact options. | Directory schema has language and disability-access fields; matching can consider location and support channels. | Matching does not yet deeply score disability access; verified accessibility data must be collected and reviewed. |

## RAG and Saada knowledge needed for a dependable Tanzania legal-aid brain

The platform should not rely on improvised answers. The RAG corpus needs an approval workflow before content becomes authoritative.

Required knowledge/data categories:

1. Core laws and official legal instruments: Constitution, Legal Aid Act/regulations, labour, land, family, inheritance/probate, criminal procedure basics, civil procedure basics, child protection, GBV/domestic violence, disability rights, refugees/migration if in scope, legal identity/civil registration, local government dispute pathways.
2. Official justice pathways: what office handles each problem, what documents are needed, what steps happen first, expected timeframes, limits, fees if any, appeal/review path and emergency exceptions.
3. Verified service directory: LSF partners, paralegal units, legal aid providers, government legal aid desks, local government offices, police gender/children desks, social welfare offices, labour offices, land offices, courts/tribunals, mediation services, CSOs, protection services and restricted safe-house records.
4. Templates: intake forms, referral letters, appointment notes, case closure summaries, consent forms, complaint letters, labour demand letters, land dispute summaries, family/maintenance request summaries, police report preparation checklists and evidence checklists. These can be drafted, but must be reviewed by LSF/legal experts before production use.
5. FAQs and plain-language explainers: Swahili-first, region-aware, low-literacy versions, with legal disclaimers and emergency escalation wording.
6. Governance metadata for every source: title, source institution, source URL/file, document type, jurisdiction, language, effective date, publication date, retrieved date, review date, version, approval status, approved by, sensitivity classification, allowed Saada use, retirement status and replacement source.
7. Operational data: service capacity, intake state, opening hours, focal person, referral agreement, SLA, safeguarding readiness, privacy availability, accessibility and last verification date.
8. Evaluation data: golden Q&A, unsafe prompt tests, hallucination tests, refusal tests, referral matching cases, and reviewer feedback.

Current RAG gap: `documents` and `embeddings` store basic file/title/text/chunk data. They do not yet enforce authority, approval status, legal-domain taxonomy, versioning, source dates, reviewer identity, active/retired state, or a rule that unapproved documents cannot answer public users. Also, `ingestDocument` currently creates embeddings immediately after upload; that is not enough for production governance.

## Remaining work to reach a serious 98% product

### Must finish before UAT

1. Replace or delete legacy localStorage auth helpers and prove all protected flows use Clerk/Convex identity.
2. Complete guest mode and guest-to-account conversion for mobile/web request drafts.
3. Add role-boundary contract tests for beneficiary, provider, staff, supervisor, safeguarding, donor and admin.
4. Add Saada tool confirmation gates. Saada must ask before saving a request, creating a referral, booking an appointment, storing a generated letter, sharing user data or escalating a case.
5. Expand Saada tools beyond `find_paralegals`: pathway lookup, service matching, case creation, document checklist, letter drafting, appointment request, referral preparation and human review request.
6. Build the RAG knowledge governance workflow: draft -> reviewed -> approved -> active -> retired, with source/version metadata.
7. Prevent unapproved knowledge from being used in public Saada answers.
8. Import real verified Tanzania service data only from approved/traceable sources; do not invent offices, contacts or safe-house locations.
9. Complete web beneficiary case workspace: referral progress, upload UX, feedback, review request, appointment lifecycle and bilingual empty/error/success states.
10. Complete staff/provider workflows end-to-end: accept/decline, schedule, deliver service, return/escalate, close, review and audit trail.
11. Complete safeguarding incident workflow and restricted notes.
12. Finish mobile screen-by-screen device QA for Android/iOS including offline, loading, empty, error and accessibility states.
13. Finish web route sweep across public website, dashboards and admin pages.
14. Add operational runbooks, data import SOP, knowledge approval SOP, safeguarding SOP and launch rollback plan.

### Needs verified external data

These can be researched and imported, but should remain staged until LSF approves them:

- Government legal aid / Ministry responsible contacts.
- Judiciary/court and tribunal locations relevant to pathways.
- Commission for Mediation and Arbitration / labour office contacts.
- Land office / land tribunal pathway data.
- Social welfare office directory.
- Police gender and children desk contact/routing information.
- LSF partner and paralegal rosters.
- Legal aid providers and CSOs by region/district.
- Public emergency contacts approved by LSF/government.
- Safe-house/protection service data, stored as restricted/confidential with no public address exposure.

### Things we can create internally, then send for review

- Plain-language FAQs.
- Legal pathway drafts.
- Intake question flows.
- Document checklists.
- Non-sensitive letter templates.
- Saada evaluation question sets.
- Training/operations manuals.
- Donor-safe analytics definitions.

### Things we must not make up

- Real office phone numbers, email addresses or addresses.
- Paralegal/provider rosters.
- Safe-house locations.
- Official legal deadlines or fees without verified source.
- Any statement that a source is government-approved unless verified.

## Concrete change made during this audit

Staff service-directory management now exposes the full backend service taxonomy. Staff can create and manage partner organisations, police gender/children desks, social welfare offices, courts/tribunals, mediation services and safe-house/shelter entries, in addition to the existing paralegal/legal-aid/government/local-government/labour/land/protection/CSO/other categories. Safe-house entries default to restricted classification/visibility, and public safe-house visibility is blocked before submission as well as by backend validation.

Changed file: `src/pages/StaffDashboard.tsx`.

## Verification from this audit turn

- Mobile typecheck passed: `cd mobile && npm run typecheck`.
- Web build passed after security prebuild checks: `npm run build`.
- Convex public-function security classifier passed: 241 public functions classified.
- Product contract tests printed passing test dots in the prior root verification run.
- Convex codegen was blocked by restricted-network Sentry DNS telemetry (`o1192621.ingest.sentry.io`), not by a schema error shown in the captured output.

## Current product verdict

The product is moving in the right architecture: one backend, real auth foundation, real case/referral/service-directory foundation, real Saada activity foundation and increasing privacy controls.

It is not yet finished. The highest-risk unfinished parts are not visual polish; they are authority, safety and operational correctness: verified data, approved RAG, Saada action gates, role-boundary tests, safeguarding completion, and full mobile/web workflow QA.
