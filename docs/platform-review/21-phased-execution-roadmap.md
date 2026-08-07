# Phased Execution Roadmap and Backlog

## Phase 0 — Audit and security remediation

**Scope/dependencies:** incident owner and console access; preserve/remove contaminated files, rotate secrets, fix Convex RBAC/route guard, sanitize HTML/email, secure uploads/webhooks, standardize env/CI, decide AI.  
**Schema/backend:** central auth helpers, audit/access records, upload intents/quarantine; internalize debug/seed/email/admin functions.  
**Frontend:** fail-closed routes, remove PIN/email bypass, honest Haki Yangu/AI claims, shared validation.  
**Tests/migration:** full permission matrix tests, XSS/upload/webhook abuse, role migration plan, production smoke.  
**Acceptance:** no critical/high exploitable authorization path; former contaminated URLs absent; secrets rotated; clean CI; owner-approved incident closure and AI decision.  
**Risks:** lost logs, unknown production data, breaking undocumented CMS use.

## Phase 1 — Shared platform contracts

**Scope/dependencies:** approved roles, organisation model, taxonomy, statuses, consent/retention.  
**Schema/backend:** identities/memberships, requests, cases, assignments, referrals, messages, appointments, outcomes, notifications and audit services.  
**Frontend:** adapt staff web to `v1` service layer; no mobile feature UI yet.  
**Tests/migration:** state-machine/contract/ownership/org tests; backfill current roles and paralegal verification.  
**Acceptance:** documented service contracts are stable, cross-role denial proven, migrations reversible/additive.  
**Risks:** taxonomy ownership and process disagreement.

## Phase 2 — First connected mobile vertical slice

**Scope:** Expo foundation, Clerk phone/email, guided intake, staff triage, assignment, timeline, paralegal inbox, secure communication, appointment/next action, outcome, feedback, neutral push.  
**Dependencies:** phases 0–1, app IDs, store accounts, notification credentials, pilot team.  
**Security/tests:** secure storage, device revocation, private attachments, E2E across mobile/web/Convex, offline retry/idempotency and safeguarding pilot.  
**Migration:** current contact requests are not auto-converted; manually qualify/import with consent.  
**Acceptance:** complete flow in [22-first-vertical-slice-specification.md](22-first-vertical-slice-specification.md) passes in staging and limited production pilot.  
**Risks:** staff adoption, capacity overload, notification deliverability.

## Phase 3 — Everyday justice utilities

**Scope:** Justice/Remedy Navigator, Evidence Vault, letter builder, Before You Sign, life-event packs, calendar and offline knowledge.  
**Dependencies:** governed content/templates, AI evaluation, storage/privacy controls.  
**Schema/backend/frontend:** evidence/timeline, template/draft, document-review and reminder services plus mobile/web experiences.  
**Security/tests:** document isolation/deletion, AI disclaimers/citations/abstention, reviewed letter outputs.  
**Acceptance:** users can act without misrepresentation of legal validity; human escalation works.  
**Risks:** harmful advice, evidence expectations, storage cost.

## Phase 4 — Paralegal and provider operations

**Scope:** offline field notes, tasks, capacity, service network, referrals, supervision and training.  
**Dependencies:** provider agreements, device/offline policy, partner onboarding.  
**Schema/backend/frontend:** capabilities/service areas/capacity, partner membership, sync/conflict and supervision dashboards.  
**Security/tests:** org isolation, lost-device revocation, offline conflict/load and referral consent.  
**Acceptance:** verified providers manage scoped work online/offline with complete audit and supervision.  
**Risks:** shared devices, stale data, uneven capacity.

## Phase 5 — Impact and programme intelligence

**Scope:** metric governance, programme attribution, data quality, service performance, geographic coverage, donor reporting and Justice Pulse.  
**Dependencies:** stable operational data and approved de-identification methodology.  
**Schema/backend/frontend:** definitions/snapshots/funding/service events, quality jobs and aggregate dashboards.  
**Security/tests:** small-cell/re-identification/export tests, formula regression and independent reconciliation.  
**Acceptance:** every published number is reproducible to an approved definition without donor case access.  
**Risks:** double counting, biased interpretation, pressure to expose granular data.

## Ordered backlog

| Priority | Work item | Phase |
|---|---|---:|
| P0 | incident preservation, logs, contaminated-file removal/CDN purge | 0 |
| P0 | rotate committed/exposed credentials and remove `.env`/PIN | 0 |
| P0 | block `makeAdmin`/unsafe `syncUser`; central Convex auth helpers | 0 |
| P0 | guard every private function; remove email bypass/debug/seed exposure | 0 |
| P0 | fail-closed route guard; upload/webhook/email/HTML hardening | 0 |
| P0 | permission/XSS/upload/secret CI tests; dependency triage | 0 |
| P1 | approve roles, organisations, taxonomy, consent, retention, AI name/path | 1 |
| P1 | implement `v1` contracts, domain tables, audit and notification outbox | 1 |
| P1 | adapt existing staff/admin flow to service layer and migrate roles/providers | 1 |
| P2 | Expo foundation/auth/draft claim/guided request | 2 |
| P2 | staff triage/case conversion/assignment and paralegal inbox | 2 |
| P2 | timeline/messages/appointment/outcome/feedback/push | 2 |
| P3 | governed navigator/content/evidence/document/letter utilities | 3 |
| P4 | provider network, referrals, offline field workflow and supervision | 4 |
| P5 | metric definitions, quality, snapshots, donor reporting and trends | 5 |

## Risk register

| Risk | Likelihood / impact | Owner / mitigation |
|---|---|---|
| active privilege abuse | possible / critical | security + engineering; disable, logs, role review |
| legacy compromise wider than repo | possible / critical | incident lead; host/CDN/audit forensics and rotation |
| legal data disclosure | likely if launched / critical | DPO/security; default-deny RBAC, DPIA, tests |
| harmful AI/emergency output | possible / critical | legal/content/AI owners; governed rules/evals/escalation |
| unsupported public claims erode trust | current / high | product/comms; evidence review and correction |
| two backends/two AI histories diverge | current / high | architecture owner; one source and migration/sunset |
| staff/provider capacity bottleneck | likely / high | operations; capacity-aware rollout and SLAs |
| offline conflict/lost phone exposure | possible / high | mobile/security; minimized cache, reauth, revocation |
| donor re-identification/double counting | possible / high | MEL/DPO; definitions, suppression, snapshots |
| migration loses/duplicates records | possible / high | engineering/data; idempotent ledger/checksums/backup |
