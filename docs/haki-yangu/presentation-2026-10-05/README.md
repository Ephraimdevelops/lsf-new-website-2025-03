# Haki Yangu — presentation readiness, 5 October 2026

This packet contains researched inputs, actual backend counts and limited runtime evidence. It is not a release certificate. Both clients use the same configured development Convex deployment and Clerk instance. Production Clerk configuration and EAS project ID remain open in the preflight.

## What was actually accomplished in this pass

- Downloaded 8 original official legal PDFs; parsed all 8, recorded page counts, byte sizes, SHA-256 checksums, exact source links and edition labels in `legal-source-manifest.json`. These are private review copies, not published or uploaded to RAG. Previewed the Legal Aid Act first page visually.
- Prepared 7 organisation research candidates in `directory-review-packet.json`: TAWLA, TANLAP, LHRC, WLAC, the ministry/NaLIS, CMA and RITA. Office contacts, unknown fields and conflicting source details are recorded. These are not LSF-verified partners.
- Located the LHRC public paralegal network. Repeated names across district sections and unconfirmed current credentials prevent a verified individual import. No individual has been invented or imported.
- Added and deployed an internal-only, read-only aggregate readiness query. `backend-inventory.json` records its result; it exposes no people, conversations or credentials.
- Corrected LSF phone buttons in the website and mobile app to the office number published on LSF's site, +255 22 260 1534. Removed the unsubstantiated regional phone list and 24/7 claims from the contact widgets. Opening hours and live response still require LSF confirmation. Office source: https://www.lsftz.org/public/bio/9 .
- Fixed new website requests to retain valid selected issue and region from Find Help. Existing saved drafts remain preserved.
- Removed false green "System Healthy", "GPT-4o Online" and "Paralegal Database Connected & Indexed" claims from the Saada admin view. The screen now reads eligible source, public-service and ready-paralegal inventory, and clearly says that inventory is not model uptime or legal-quality evidence. The source list is the latest 100 records, so its count must not be treated as a complete corpus count when that limit is reached; `backend-inventory.json` is the full-deployment snapshot for this presentation.
- Relabelled the Saada switch as enable/pause rather than a "Go Live" action. Budget and document freshness are limited operational checks, not release approval.
- Started the actual website on http://127.0.0.1:5173 and Expo on http://localhost:19007 . No authentication or approval gate was bypassed.

## Configured backend — checked at 11:52:53 EAT

| Inventory | Actual count |
| --- | ---: |
| Organisations | 0 |
| Services / verified public services | 0 / 0 |
| Active referral agreements | 0 |
| Paralegal applications / approved | 1 / 0 |
| Legal-source records / approved | 7 / 0 |
| Approved, indexed, current sources | 0 |
| Retrievable approved chunks | 0 |
| Approved Saada prompt versions | 0 |

The 7 database source records are distinct from the 8 newly downloaded files. Neither set has been independently approved in this pass. Pending count is also zero: the old records must be examined in the governance workspace to establish their lifecycle/provenance; do not silently relabel or approve them.

## Verified navigation evidence

- Expo app at a 390 × 844 browser viewport: home renders; Find Help opens; employment selection leads to real no-service recovery; recovery opens intake with employment selected. Screenshots: `mobile-home-phone-browser.jpg`, `mobile-no-service-phone-browser.jpg`, `mobile-intake-context-phone-browser.jpg`.
- Website: Haki Yangu entry renders; corrected LSF office contact renders; directory returns the real empty state; choosing land and Arusha then requesting help opens the form with land and Arusha retained.
- These checks cover guest entry and context transfer only. A phone-sized browser is not an iOS/Android native device review. No real-account submission, assignment, provider response or case closure was rehearsed here.

## How to feed the real platform

1. An authorised admin/staff member opens the existing Saada knowledge workspace, uploads each PDF, enters exact provenance and edition, and supplies a reviewed jurisdiction, effective date where known and next-review date. Confirm storage/indexing reuse permission first. Do not claim a revised edition includes all later amendments or judgments.
2. Indexing must finish successfully. A separate qualified reviewer approves each source and the prompt. Only approved, current sources may support answers. Run the scenario/evaluation workspace and check actual citations and refusal behavior.
3. Directory staff creates organisation drafts using the research packet. Resolve addresses and phone conflicts; check production NaLIS registration, region/district, service coverage, intake, hours, accessibility and safeguarding. Unknown fields stay unknown.
4. Add service points and verify them through the existing directory workflow. Referral acceptance additionally needs a real approved agreement, organisation membership and accountable staff. A public phone number is not referral consent or partner readiness.
5. Reconcile the owner's existing paralegal dataset against this configured backend. Validate credentials, identity/organisation review, onboarding/training, language/location and current availability. Import through the governed onboarding process; do not grant roles by copying a public listing.
6. Run separate beneficiary, LSF reviewer, provider/paralegal and supervisor accounts through submission → triage → assignment → consented referral → appointments/messages/documents → outcome/review. Check offline retry and access revocation on web and native phones.

## What prevents declaring completion now

No LSF/admin reviewer account is available, as confirmed by the owner. Therefore source approval, verified provider publication, scoped account activation and authenticated cross-role rehearsals remain open. The release ledger still records 0 of 11 roles as fully release-verified. Preparing official PDFs and passing handler tests does not remove those requirements.

The remaining corpus also needs reviewed Swahili material, Zanzibar-specific laws/pathways, current amendments and binding judgments, labour/land/court procedural rules and forms, fees/deadlines, legal-aid eligibility, safeguarding/complaints procedures, inheritance/contract/consumer/identity coverage, and LSF-approved operating policies and learning guides. The 8-PDF starter packet is not a complete Tanzania legal corpus.

## Presentation route

Show the actual public home, Find Help, honest no-service recovery, context-retaining request entry and sign-in gate. Show the private source/review packet and backend evidence as implementation inputs. Explain that approvals and full account journeys are unfinished. Do not demonstrate fabricated provider availability, legal citations, real referrals or case outcomes.

`rehearsal-scenarios.json` contains 8 clearly fictional QA scenarios, not live people or case records. The handler rehearsals for submissions, draft recovery and invitations use isolated fixtures; they do not prove live cross-role journeys.

## Technical verification completed in this pass

- Web and mobile TypeScript checks: passed after the contact and request-context changes.
- Convex deployment/typecheck: passed for the internal readiness query.
- Convex security classification: passed, 360 public functions classified; the readiness query remains internal.
- Haki contracts: 82 tests passed.
- Request/evidence retry handlers: 5 tests passed; account draft isolation/recovery: 5 passed; provider invitation/independent approval handlers: 4 passed.
- Website production build: passed. Expo web/iOS/Android export: passed. Neither proves native runtime or store release.
- After the Saada admin wording correction, web TypeScript, `git diff --check`, security prebuild, auth routing and the website production build passed again. Both existing presentation URLs returned HTTP 200 at 12:51 EAT. HTTP response alone does not prove signed-in admin or native flows.

Build output is retained in this directory. No new source or organisation was approved, no real role was granted, and no outbound provider contact or invitation email was sent.

## Official information recovery — 5 October

Web Find Help and mobile Find Services now show topic-filtered publisher-owned information links when the verified directory is empty. The shared public query lists CMA, TAWLA, FCC, RITA, LHRC and NaLIS information pages. These are explicitly separate from LSF-verified provider records; opening them does not submit or refer a case. No source or provider approval has been inferred from a public website.

The deployed query returned CMA, LHRC and NaLIS for employment. The web rendered those same links and retained employment in its request link. The mobile rendered the Swahili cards at 390 × 844; its LHRC link opened the publisher's contact page. Screenshot: `mobile-official-information-sw.jpg`. Native external-link handling includes an error message and selectable URL, but was not exercised on an actual native device.

Web, mobile and backend TypeScript, 82 contract tests, 361-function security classification, website production build and the final Android/iOS/web Expo export passed. The Vite development dependency scan now starts from the application index instead of treating downloaded research HTML as application entries. These checks do not close the authenticated account, verified inventory or legal-review gates.
