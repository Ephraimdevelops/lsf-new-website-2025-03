# Upload and organisation readiness — 7 October 2026

No documents have been uploaded in this run. The upload page redirects to the staff/admin sign-in screen. User approval in chat authorizes uploading, but the app still requires authentication and independent document review before retrieval.

## Documents

128 unique PDFs have been checked against their recorded SHA-256 hashes. 123 have native extracted text and fit the app's 15 MiB limit. This is technical screening, not legal approval or confirmation of PDF.js extraction quality. Required publisher, jurisdiction, language, category, version and future review date must be completed honestly before ingestion.

Five original PDFs have no native extracted text: CMA-PROCEDURE, CMA-GUIDELINES, LABOUR-COURT-RULES, EMPLOYMENT-GENERAL-FORMS and ZNZ-EMPLOYMENT. The two CMA files also exceed 15 MiB. Retain originals; prepare and review searchable derivatives before indexing. Machine OCR currently available for CMA is unverified. Readable counterparts for other scans require identity reconciliation.

The acquired Zanzibar Constitution copy is R.E. 2006. Do not label it as the latest edition. Amendment, commencement, applicability and permissions checks remain in the original research pack.

## Organisation information

The inventory retains 13 earlier office/programme rows, seven later public candidate rows, and 17 rows from a Zanzibar registry PDF. These overlap and are not a count of distinct verified organisations. Eight named public leads are TAWLA, LHRC, WLAC, WiLDAF, WoteSawa, KIWOHEDE, ZLSC and TLS. The registry adds paralegal and other organisation leads; its current completeness and registration status are unverified.

Some names, public phone numbers, emails, addresses and registry locations are available. We do not have all operational parameters. Provider confirmation is needed for service coverage, issue categories, eligibility, fees, hours, walk-in/appointment arrangements, remote and phone services, intake state, capacity, languages, disability access, privacy, gender sensitivity and emergency capability. Organisation owners must supply focal contacts, referral agreements, response commitments, safeguarding readiness and data-sharing terms. Independent reviewers must record verifying authority and review dates. Public clinic emails are not automatically authorised referral focal contacts.

The configured backend returned zero public, active, verified and review-current Find Help services at the recorded check time. Private/draft counts remain unknown until staff access is available.

## All app fields

`all-app-parameters.csv` covers all 11 organisation and 40 service input fields directly from `convex/justiceServices.ts`. System-generated audit fields are listed separately in the inventory. Some additional information the app needs, including fees and service email/website, has no dedicated field in the current service input. The intake enum and required capability booleans also lack an explicit unknown state. These gaps require a deliberate data-model decision before importing incomplete research as services.

## Files

- `upload-plan.json`: all 128 absolute file paths, hashes, technical screening and unresolved metadata.
- `organisation-research-inventory.json`: source-preserving public research and registry rows, overlaps, unknown field templates.
- `all-app-parameters.csv`: every organisation/service input field and evidence status.
- `public-directory-check.json`: scope and outcome of the configured backend read.

This folder is a separate preparation supplement. The existing private-review ZIP and its hashes are unchanged by this script. No providers have been contacted, registered, verified or activated by this preparation.
