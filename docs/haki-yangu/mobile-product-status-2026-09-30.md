# Haki Yangu mobile product status — 30 September 2026

This is an evidence audit of the **launch Expo app** and its shared Convex backend, not a completion percentage. The working rule remains: a journey closes only after screens, writes/reads, permissions, status transitions, errors, notifications, recovery, cross-account scenarios and phone review work with verified data. The [journey map](mobile-user-journey-map-2026-09-28.md) records **0 of 11 role journeys release-verified**. Code presence is called *implemented*, not *accepted*.

## Evidence checked now

- `mobile/app` contains **95 TSX route files** (including layouts); a file count is not a screen-quality or flow-completion count.
- The configured mobile environment has a Convex URL and Clerk publishable key; `EXPO_PUBLIC_EAS_PROJECT_ID` is **missing_optional**, and the environment check says it is needed for push-token scoping and release builds. Google/Apple SSO buttons are conditional on environment flags and provider configuration; their end-to-end success has not been proved.
- `npx convex dev --once` reported functions ready for the current development deployment. Root/mobile TypeScript, 71 contract checks, 346-function security classification and iOS export pass after the latest organisation-switch change. These checks do not run the multi-account or device journeys.
- Live public development queries returned `[]` for `justiceServices:listPublicServices` and `publications:listPublicLegalGuides`. Authenticated Saada source inventory and real account/role counts were not available from those public queries.
- The checkout has extensive uncommitted work. A successful development function upload is not a production release or app-store build.

## Journey status by user

| User | Implemented mobile route and backend path | Still unproved or missing |
| --- | --- | --- |
| Guest | Home, language, public Find Help, comparison, practical checklists, protected-action sign-in gate | Populated verified directory, real contact/visit, complete English/Swahili device and accessibility review |
| Beneficiary | Intake draft/review/submit, reference/status, case timeline, messages, documents, appointments, referral consent, outcome, feedback/review; Saada question can prefill an explicit user-reviewed intake draft | Real employment/land/family/safety/no-service runs; staff/provider responses; notification delivery, offline replay, consent wording and safe-contact review |
| Paralegal | Application, credential review, onboarding, learning, profile/availability, assignment offers, case work, tasks, wellbeing/support | Real application-to-activation and case run, training evidence, offer expiry/revocation and phone acceptance; no established payment/benefit system |
| Provider staff | Access application, selected-organisation workspace, linked service status/correction, intake capacity, consented referral inbox/response | Multiple-affiliation phone test, organisation suspension/reinstatement, three-account referral run, membership/revocation check |
| LSF case worker | Triage, request reveal, case creation, matching/offer, case workspace, referral oversight and directory review | Operational rehearsal, exception timing, real records and cross-role notifications |
| Safeguarding officer | Restricted queue and decision path | Real incident protocol, verified local contacts, handoff response time, privacy and device review |
| Supervisor | Review overview, audited reassignment and closure-review routes | Reassignment/closure exception rehearsal, separation of duties and phone review |
| Content editor | Bilingual guide authoring, provenance, replacement/resubmission and independent review | A real editor/admin publication with legally reviewed content and both language layouts |
| Stakeholder | Approved aggregate report view | Real approved/suppressed report and role-isolation run |
| Donor | Approved aggregate report view and text sharing | Disclosure review, export/delivery lifecycle and distinct donor-account run |
| Administrator | Governance hub, access/paralegal approval, directory lifecycle, Saada source/prompt/flag/evaluation screens, audit/reporting | Two-admin decisions, filled-record queue usability, permission/retention audit, production operations rehearsal |

## What the shared backend actually connects

The Expo app and web app use the same Convex functions for identity-linked roles and domain records. The mobile app has real calls for drafts, cases, messages, documents, appointments, directory, referrals, guide governance and Saada; it is not an isolated visual prototype. Server checks include active role assignments, current case participation, organisation-scoped **new** professional assignments, consent before provider referral visibility, and audit records for many decisions. Older professional case affiliations without organisation context enter an LSF review queue and are denied until classified. The latest provider organisation screen offers a switch among active affiliations and scopes staff/service views to the selected one; a provider cannot change intake on an inactive or unverified organisation/service. These rules still need separate-account execution against realistic data.

## Saada AI: current ability and limits

Saada is an authenticated chat backed by `sara_actions.ask`, using OpenAI `gpt-4o`, embeddings (`text-embedding-3-small`) and approved-source vector retrieval. It can answer in conversational language, search approved chunks, call **two bounded lookup tools** (`find_paralegals`, `find_services`), show source metadata with a completed response, collect feedback, and hand the user's own question into a request draft that the beneficiary must review and submit. It does **not** autonomously create a case, send a referral, approve consent, contact a provider, book an appointment or resolve a case. Calling it “agentic” means limited tool routing, not autonomous legal case management.

Governance code supports PDF upload/index/retry, provenance, version replacement, independent admin source approval, review dates, withdrawal from retrieval, prompt versions, flagged-response review/follow-up and human-authored evaluation cases and verdicts. Retrieval filters to currently approved, unexpired source chunks. A public query cannot establish whether any approved Saada source exists; this requires an authorised inventory check.

Accuracy is **not measured as 99%**. The `0.75` vector similarity threshold is a retrieval heuristic, not a calibrated probability that a legal answer is correct. With zero matches or low-confidence matches, the model still receives a cautionary prompt and may produce an answer; there is no deterministic block on unsupported legal claims or automatic sentence-to-citation verification. Source citation is prompted and source IDs are logged, but a generated sentence is not mechanically checked against its source. The evaluation workspace records human pass/fail/legal-review decisions for selected actual answers; it is not a comprehensive automated benchmark or Tanzania legal sign-off. The action's token cap sums stored chat tokens while its error calls it a “monthly” cap, so that wording and accounting need correction. Tool-call parsing and partial streaming/error recovery need adversarial tests. The current emergency keyword list can miss indirect danger and falsely match ordinary terms.

## How case sensitivity is assessed today

Beneficiaries explicitly choose `standard`, `urgent` or `immediate_safety` in intake and select an issue category. An immediate-safety choice shows an emergency notice and makes automated service matching **restricted** with `immediate_safety_review_required`; safeguarding staff review is required before recommendations. Staff create a case with a selected priority, including a safeguarding priority, rather than a validated machine-generated severity score. Saada separately scans a fixed English/Swahili emergency-keyword list before calling the model and returns a fixed emergency message when matched, while recording a risk event for staff review. Low retrieval similarity records a different Saada risk event. These are separate mechanisms; no one should infer that Saada's keyword trigger and the case's staff priority constitute a reliable unified sensitivity score. Safety-category selection without an explicit immediate-safety urgency does not by itself invoke that restricted matching branch. LSF must verify emergency contacts, protocols, local referral paths and false-negative/false-positive scenarios.

## UI/UX and integration acceptance

The owner-supplied screenshots guide structure and visual hierarchy. Existing screens have a shared human civic design direction, bilingual labels on some management forms, and explicit empty/loading/restricted states in many routes. A route and iOS bundle do not prove its filled state looks or navigates correctly. Only a narrow iPhone 17 Pro Max beneficiary pass (Home, Profile, empty Find Help, opening intake) is recorded; admin, paralegal, provider, Saada and populated-data states have not had full bilingual device acceptance. The static preparation checklists are now labelled separately from independently approved legal guides; their own wording remains unreviewed. Offline action storage exists for some actions, but replay, conflicts, duplicate prevention and document-upload recovery still require scenario tests.

## Priority remaining work

1. **Supply governed real data:** LSF-verified public providers/contacts/hours, safeguarded private destinations, official Tanzanian sources with jurisdiction/effective dates/review owners, and bilingual approved guides. Current public development inventories are empty.
2. **Run real account handoffs:** beneficiary → staff → paralegal/provider → supervisor/administrator, including safety, no local provider, rejection, consent decline, revocation, suspension and reactivation. Record reads/writes, alerts and audit events.
3. **Harden Saada:** no-source legal-answer policy, citation-grounding checks, emergency language evaluation, tool-call/error handling, usable evaluation set, human escalation procedure and source-quality/legal review. Fix misleading token-budget wording/accounting.
4. **Finish device acceptance:** filled, empty, error, restricted and offline states in Swahili/English on representative iOS and Android screens; accessibility, navigation and action confirmations for all roles.
5. **Release readiness:** configure EAS/push, verify push delivery and offline replay, review privacy/retention and safeguarding, complete deployment/security review, then decide release from scenario evidence. No 98–99% or “finished” claim is supported yet.
