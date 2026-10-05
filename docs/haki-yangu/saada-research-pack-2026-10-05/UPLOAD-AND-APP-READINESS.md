# Preparing research for Saada and Haki Yangu

This pack is staged for review. No document or service was uploaded or approved during this research. It is not a direct backend import file. Source IDs are research IDs, not Convex document IDs.

## What belongs where

| Information | Destination | Preparation needed |
|---|---|---|
| Current laws, rules, reviewed guidance and judgments | Approved legal knowledge/RAG | Identity, amendments, applicability, citations, rights to reuse, independent legal approval |
| Provider offices, contacts, languages, coverage, eligibility, hours and costs | Structured service directory | Provider confirmation, verification date, expiry, service owner and referral agreement |
| Region/district/ward codes, boundaries and coordinates | Structured geography | Official code mapping, licence, geographic QA and update date |
| Triage and issue-to-service pathways | Structured, versioned routing rules and reviewed user guidance | Legal branches plus real service capability; explicit safety and urgency rules |
| Cases, evidence, personal details and appointments | Protected case system | Access permissions, consent/lawful basis, secure storage, audit and retention |
| Availability, referral status and booked appointments | Authenticated live integrations | Actual service APIs/workflows and confirmation; public websites cannot supply live availability |
| Prompt policy, safe handoff, escalation and operating procedures | Versioned operational configuration | LSF approval, named owners, testing and review calendar |

Uploading PDFs alone cannot create a working referral, booking, case-management or safeguarding service.

## Review each document

1. Match the downloaded cover, title, issuing body, Act/GN number, edition and actual document type. Exclude wrong files, bills mistaken for Acts, catalogue pages mistaken for laws and duplicate language files.
2. Establish the jurisdiction and scope from the law. Mainland and Zanzibar are distinct; some Union or regulatory instruments have mixed scope and exceptions. Research labels ending in `_candidate` are unresolved and must not be imported as authoritative jurisdiction values.
3. Reconcile amendments, commencement, repeals and binding judgments through the intended release date. Record predecessor/replacement relationships. Upload date and revised-edition label are not proof of current law.
4. Check extraction against the PDF. Review tables, schedules, scanned forms, marginal citations and low-text pages. Preserve original PDF and page-level citation mapping. An extracted text file is a review aid, not a verified transcription.
5. Record the licence or permission for storage, indexing, translation and redistribution separately. Keep private research copies within their authorised use.
6. For every pathway branch, identify exact section/rule and conditions, responsible forum, documents, service method, deadline trigger and exceptions, fee and remission. Keep unknowns unresolved rather than filling them with guesses.
7. Obtain qualified legal review and operational/service-owner confirmation. Review Kiswahili separately. Record names, decisions, notes and the next review date.

## Mapping to the current app

The local `convex/schema.ts` documents table stores title, source URL, publisher, jurisdiction, topic, language, version label, effective date, review date, processing and approval information. The upload mutation in `convex/sara.ts` requires source metadata and a review date. These drafts deliberately leave effective dates and review dates unresolved, so they need reviewer decisions before using that mutation.

The existing review flow requires a different administrator from the uploader. Retrieved sources must be approved and within their review date. Keep those gates; downloading, extracting or embedding a file is not legal approval. Confirm processing succeeded and citations resolve before an independently approved source is eligible for answers. Use supported jurisdiction values only after review: `tanzania_mainland`, `zanzibar`, `national` or `other`.

This research does not verify the live backend state. The earlier presentation snapshot recorded zero approved sources/services; that is a dated snapshot, not a claim about the backend now.

## Upload order after review

1. Approved assistant scope, urgent handoff policy, privacy/consent wording and verified core legal-aid service records.
2. Current foundations, legal-aid eligibility law and jurisdiction definitions.
3. One complete priority pathway at a time, including rules, forms, deadlines, fees, judgments and operational referral. Partial topic coverage must be visible to the assistant.
4. Reviewed bilingual guidance/checklists and safe preparation templates, linked to their supporting sources.
5. Additional topics only after their source bundle and service route pass the same checks.

Keep source texts separated from private client evidence. Do not put client case files, survivor identities, confidential shelter locations, credentials or staff-only procedures into a general user-facing knowledge index.

## Checks before calling the app functional

- Retrieval finds the correct current approved document, exact provision and jurisdiction, and excludes expired, withdrawn and unapproved copies.
- Answers use the retrieved evidence faithfully, disclose missing evidence and avoid invented deadlines, fees, legal outcomes or provider availability.
- A user can reach a confirmed eligible provider, with a safe contact choice and a real consented handoff. Failed or rejected referrals have an owner and follow-up route.
- Intake distinguishes initial help from mandatory filing documents. Missing ID or paperwork does not silently exclude users from initial assistance.
- Urgent safety, child protection, detention and imminent hearing cases follow approved escalation procedures.
- Booking and case tracking reflect actual status with access controls. Uploads, notifications and data deletion/export behave according to approved policy.
- English and Kiswahili guidance is reviewed; accessibility, low bandwidth and location ambiguity are tested.
- A qualified reviewer scores the 49 draft evaluation cases and adds real-world anonymised examples; critical failures block the affected feature.

These are readiness requirements and proposed checks, not claims that the existing app already passes them.
