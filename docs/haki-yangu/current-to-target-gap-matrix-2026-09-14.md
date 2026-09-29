# Haki Yangu current-to-target gap matrix

Date: 2026-09-14

This matrix reflects the repository state after reading the master execution brief and after the latest web/backend/mobile baseline fixes. It is intentionally conservative: a feature is not marked done unless it has implementation evidence and a passing verification signal.

| Area | Current status | Target from master brief | Gap / next action |
| --- | --- | --- | --- |
| Shared backend | Partial | One authoritative Convex backend for web and mobile | Core case, referral, directory, reporting and Saada functions exist. Continue hardening typed contracts and avoid duplicate data systems. |
| Web build health | Done | Production web build passes | `npm run build` passes with security prebuild checks. Existing warnings remain for old Browserslist data and an ambiguous Tailwind duration class. |
| Web TypeScript | Done | TypeScript gate passes | `npx tsc --noEmit -p tsconfig.app.json` now passes. |
| Mobile TypeScript | Done | Mobile TypeScript gate passes | `npm run typecheck` in `mobile/` now passes. Device QA is still pending. |
| Product contracts | Done for current suite | Existing contracts pass and new contracts added where risk grows | Haki product contracts pass. Added referral projection privacy regression coverage. More contracts are still needed for Saada activity events, offline sync, matching, and AI confirmation gates. |
| Referral privacy | Partial improved | Beneficiary sees progress without operational leakage | `referrals.listForCase` now projects safe data instead of returning raw referral, user, service, event, and consent records. Needs runtime role-boundary tests with seeded users. |
| Public paralegal detail privacy | Partial improved | Public directory exposes only approved safe profile fields | `getParalegal` now returns safe fields for approved records and restricts non-approved records to staff/admin. Needs visual profile QA. |
| Beneficiary web case workspace | Partial | Beneficiary can manage messages, documents, appointment requests, feedback, reviews, referrals | Case workspace exists with messages, documents, appointments and history. Still needs referral UI on web, upload, feedback, review request, bilingual copy, and visual QA. |
| Staff operations | Partial | Website is LSF operations control center | Staff dashboard has cases, referrals, service directory, matching and consent evidence flows. Needs full route review, UAT scripts, exports, monitoring and operational runbooks. |
| Provider workspace | Partial | Providers accept/decline work, message, appoint, document, progress and close | Provider dashboard/referral inbox exists. Needs end-to-end QA with real role accounts and provider organisation scope checks. |
| Justice Service Directory | Partial | Governed directory for paralegals, providers, government offices, CSOs, safeguarding services | Schema and staff management exist. Verified live data acquisition and periodic review workflow remain incomplete. |
| Matching engine | Partial | Deterministic matching with reasons, constraints, decision records | Matching decision foundation exists. Needs broader rules, staff override policy, runtime test cases and LSF policy approval. |
| Saada identity | Partial | One public Saada identity across web and mobile | Many user-facing strings say Saada. Legacy internal filenames/routes still use Sara/SARA. Needs cleanup without breaking routes. |
| Saada governance | Partial improved | Approved RAG, source provenance, prompt/model tracking, risk events, tool allow-list, activity events | Existing Saada has RAG ingestion, risk events and typed activity events. Still needs knowledge approval metadata, full tool confirmation gates, case-linked sessions, cost monitoring and kill switch UX. |
| Saada activity UX | Partial foundation done | Real backend/tool activity steps shown to user | Web and mobile now show typed backend activity events for risk checks, knowledge search, service search, tool execution, human-review recommendation, completion and failure. More activity types remain for pathways, matching, document analysis, drafts and confirmation gates. |
| Safeguarding | Partial | Dedicated restricted role, incidents, safe referrals, restricted notes, audit | Role and scoped queues exist. Needs full safeguarding incident workflow, restricted notes and safe referral handling. |
| Data governance | Partial | Classification, retention configuration, audit, export, deletion/archive | Some audit and consent retention support exists. Needs configurable policy tables, LSF-approved retention values, export/deletion flows and documentation. |
| Notifications | Partial | In-app, push, email where appropriate, future SMS | In-app and push foundations exist. Email/SMS and privacy-safe template management remain incomplete. |
| Offline / low-data | Partial | Drafts, sync queue, conflict handling, encrypted local sensitive storage where appropriate | Some mobile offline screens/queues exist. Needs full sync QA and conflict strategy validation. |
| Mobile screen design | Partial | Every screen polished with loading, empty, error, offline, success, accessibility | Many redesigned screens exist and mobile TypeScript passes. Full screen-by-screen device QA has not yet been completed. |
| Web route design | Partial | Every public/admin route reviewed, responsive, accessible, no dead routes | Build passes and missing imports were fixed. Full browser route sweep, console check and responsive QA remain. |
| Infrastructure / release | Partial | Dev/staging/prod environments, CI/CD, EAS, monitoring, rollback | Not launch-ready yet. Requires env inventory, EAS release config verification, CI gates, observability, backup and incident runbooks. |
| Data / RAG corpus | Partial | Verified Tanzanian legal and service data with approval workflow | Local data packs exist as staging research. They are not approved authoritative production knowledge. |
| Final launch readiness | Not ready | GO only after product, mobile, web, security, privacy, AI, safeguarding, operations, infra and pilot gates pass | Current status remains NO-GO for national launch. Continue implementation and QA before UAT/pilot. |

Immediate engineering sequence:

1. Complete web beneficiary case workspace: referrals, uploads, feedback, review request and bilingual states.
2. Add knowledge-source approval/version metadata before any RAG corpus is treated as authoritative.
3. Add Saada confirmation gates for saved plans, requests, referrals, appointments and document actions.
4. Run mobile screen-by-screen visual/device QA after the shared contracts stabilize.
5. Add runtime role-boundary tests for beneficiary/provider/staff/donor/safeguarding access.
