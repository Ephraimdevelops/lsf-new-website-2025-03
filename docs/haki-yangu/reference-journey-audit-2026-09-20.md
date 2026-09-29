# Haki Yangu reference-journey audit — 20 September 2026

The 20 images supplied on 20 September are design and flow references, not verified Tanzania provider or legal data. They include sample people, phone numbers, organisations, dates, promises and some Kenya-specific content; none of those details should be imported as facts. The seven earlier LSF governance/operations images are likewise workflow references.

## Current implementation against the references

| Journey in the images | Current connected implementation | Still needed before product-complete |
| --- | --- | --- |
| Two ways to start: Find Help / Request Help | Mobile home, service search, matched verified service list, new service details, intake; web Haki Yangu entry | Device-verified visual continuity; Find Help saved services and post-visit check-in linked to formal request |
| Beneficiary request to resolution | Guided intake, private case, timeline, messages, documents, appointment requests, referrals, feedback/review request; shared Convex backend | Real multi-user end-to-end QA, notification delivery, offline conflict testing, direct beneficiary consent/review before every referral |
| Find Help service discovery | Public visibility/verification filter, issue and region matching, service details and real phone action where recorded | Map, saved help, side-by-side comparison, verified coverage and contact audit, service-specific booking |
| Beneficiary documents and letters | Mobile vault/case upload, document checklist, letter builder | File scanning, retention/purge, lawyer-reviewed templates and document analysis, PDF export QA |
| Paralegal invitation and onboarding | Mobile account/path choice, application, admin approval, role assignment, workspace and assignment inbox | Invitation token flow, credential verification, training completion, availability, organisation-specific permissions, device QA |
| Paralegal daily work | Mobile assignments, cases and workspace; web paralegal dashboard with referrals | Full mobile task board, secure case chat/voice, provider appointment and evidence workflows, wellbeing/learning/payments integrations |
| LSF operations and approvals | Admin access queue, verified-org role grant, audit; staff case/referral/service and safeguarding workspaces; role access on same backend | Supervisor approval for privileged roles, scoped provider organisation access, comprehensive case supervision and legal/audit review |
| Saada beneficiary and governance | Web/mobile Saada, admin knowledge uploads, pending/review/approval gate, approved-only retrieval, prompt controls, risk events | Legal source/version inventory, citation traceability, prompt change approval, rigorous Tanzania legal evaluations, ongoing monitoring |
| Reporting | Aggregate snapshot generation/approval and stakeholder reads | MEL sign-off, export, scheduled generation, independent re-identification review |

## Release truth

A passing build and TypeScript check show the source compiles; they do not prove production login, Google/Apple sign-in, role redirects, consent safety, referral completion, source correctness, or device polish. Live auth QA is blocked by the current Clerk production key's allowed origin and mobile SSO provider/redirect setup. Legal sources and public directory entries must be verified by LSF and partner organisations. No defensible 98–99% product-completeness claim can be made yet.

## Highest-priority completion gates

1. Configure and test Clerk web/mobile origins, native application support, SSO providers and redirect URI on real devices.
2. Run a beneficiary → LSF → approved paralegal/provider → referral → outcome test with separate accounts and consent evidence.
3. Restrict every provider/staff case and document query to an assigned case or authorised organisation, then penetration-test the role boundaries.
4. Validate and version Tanzania legal RAG sources, require human legal approval and test high-risk questions before Saada legal guidance is treated as dependable.
5. Verify public service identities, contacts, hours, location and safeguarding visibility with LSF; test device layouts, low bandwidth, offline sync, accessibility and notifications.
