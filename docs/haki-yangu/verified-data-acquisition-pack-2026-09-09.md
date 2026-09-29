# Haki Yangu verified data acquisition pack

## Purpose

This pack identifies the real data required to operate Haki Yangu as a dependable Tanzanian justice-navigation platform. It distinguishes public facts that can be safely prepared now from operational records that must come from the responsible institution. No record should be presented as a verified provider, current local service, legal conclusion, or live safeguarding route merely because it appears on a website.

The import-ready registers are:

- `data/haki-yangu/verified-public-service-endpoints.csv`
- `data/haki-yangu/legal-knowledge-source-register.csv`
- `data/haki-yangu/data-acquisition-register.csv`

## What has been verified

The Government of Tanzania publishes national short codes for police (112), crime prevention (111), fire and rescue (114), ambulance (115), Gender and Children Desk / child protection (116), and health information (199). The TCRA 2025 numbering plan independently identifies 112 as the emergency/police code and 116 as the Child Helpline. These records can be prepared for publication, subject to pilot calls that confirm network routing and product copy that does not promise response times.

The Ministry of Constitutional and Legal Affairs operates NaLIS, which provides legal-aid applications, tracking, complaints, and a provider register. The NaLIS site publishes the toll-free legal hotline 0800004004 and `support.nalis@sheria.go.tz`. The provider feed should not be bulk-published into Haki Yangu yet: the public listing observed during research included entries named like test records and implausible location combinations. Haki Yangu needs a clean export from MoCLA with registry identifiers and an agreed verification process.

The Office of the Attorney General operates the official Online Laws Catalogue. Current catalogue pages were located for the Legal Aid Act, Land Act, Village Land Act, Land Disputes Courts Act, Employment and Labour Relations Act, Labour Institutions Act, Law of Marriage Act, and Probate and Administration of Estates Act. These are valid retrieval sources, but legislation must pass legal-editor review before it is transformed into advice, decision trees, templates, or Saada knowledge chunks.

The National Bureau of Statistics publishes 2022 census administrative boundary data covering regions, districts, councils, divisions, wards, villages/mitaa and enumeration areas, with official codes. That source should become the platform's canonical location hierarchy. It is preferable to hand-written region and district lists because matching and reporting need stable parent-child codes.

Official public channels were also confirmed for CHRAGG human-rights complaints, RITA civil registration and estate services, CMA labour dispute services, and Judiciary feedback routing. The public sources do not yet provide all local offices, current capacity, privacy facilities, disability access, or service-level commitments required for high-quality matching.

## Data that cannot be responsibly obtained by open-web research alone

The following records require an owner-approved export, written confirmation, or data-sharing agreement:

1. Named paralegals, accreditation numbers, individual phone numbers, specialties, availability and disciplinary status.
2. Provider capacity, current intake state, referral focal people and response SLAs.
3. Local Police Gender and Children Desk routing, social-welfare contacts, one-stop-centre readiness, and any confidential shelter or safe-house details.
4. LSF partner agreements, case-opening rules, donor indicator definitions, retention periods and escalation responsibilities.
5. Copyright or reuse permission for third-party legal guides, training manuals and translated resources.
6. Historical beneficiary records or case outcomes. These need a lawful basis, minimisation, de-identification, quality checks and controlled migration.

Safe-house locations must never enter the public service directory. Haki Yangu should store a restricted referral record that exposes only safe instructions to the beneficiary and reveals operational contact data solely to authorised safeguarding staff.

## Required ingestion controls

Every imported service should have a source authority, source URL or access record, verifier, verification date, next review date, geographic code, visibility class and current intake state. “Verified” must mean the responsible authority or LSF has checked the record; it must not mean a crawler found the name online.

Every legal source should have an exact title, chapter or instrument number, edition or effective date, source authority, URL, retrieved file checksum, language, amendment check, legal reviewer, approval state and next review date. Saada should retrieve only approved chunks and should show the source and review date in answers.

The recommended lifecycle is:

`identified → retrieved → structurally validated → owner verified → legally/content reviewed → approved → published → monitored → expired or renewed`

Automated checks should reject duplicate registry IDs, malformed Tanzanian phone numbers, impossible region/district relationships, expired verification dates, public safe-house records, “verified” records without a verifier, and legal knowledge without an effective version and named approver.

## Recommended institutional requests

LSF should send four consolidated requests first because they unlock the highest share of product value:

1. MoCLA/NaLIS: accredited legal-aid organisations and paralegals, registry IDs, approval status, geographic coverage, public contacts, specialities and update feed terms.
2. NBS/PO-RALG: the latest administrative hierarchy in machine-readable form, code definitions and update policy.
3. Judiciary, CMA, Ministry of Lands, RITA and CHRAGG: current public-facing office directories, jurisdiction/coverage, intake methods, opening hours and official update contacts.
4. LSF safeguarding partners: a restricted referral map, safe-contact rules, 24/7 status where applicable, consent protocol and escalation ownership.

## Reliability assessment

The current pack is sufficient to replace invented emergency and head-office contact data, establish the canonical legal and geographic sources, and begin formal acquisition. It is not sufficient to claim nationwide provider matching. That claim becomes supportable only when local provider, office, capacity and safeguarding records are owner-verified and kept current.

## Sources

1. Government of Tanzania. [Emergency numbers and government contact portal](https://www.tanzania.go.tz/index.php/contact-us). Accessed 9 September 2026.
2. Tanzania Communications Regulatory Authority. [National Numbering and Signaling Point Code Plans, 2025](https://www.tcra.go.tz/download/sw-1751634705-National_Numbering_and_Signaling_Point_Code_Plans_edition_of_2025.pdf). Accessed 9 September 2026.
3. Ministry of Constitutional and Legal Affairs. [National Legal Information System](https://nalis.sheria.go.tz/en). Accessed 9 September 2026.
4. Ministry of Constitutional and Legal Affairs. [Legal Aid Providers List](https://nalis.sheria.go.tz/en/legal-aid-providers-list). Accessed 9 September 2026.
5. Office of the Attorney General. [Online Laws Catalogue](https://oagmis.oag.go.tz/public). Accessed 9 September 2026.
6. Office of the Attorney General. [Legal Aid Act, Cap. 21](https://oagmis.oag.go.tz/portal/revised-acts/revised/126). Catalogue publication 25 April 2025.
7. Office of the Attorney General. [Land Act, Cap. 113](https://oagmis.oag.go.tz/portal/revised-acts/revised/218). Catalogue publication 24 April 2025.
8. Office of the Attorney General. [Village Land Act, Cap. 114](https://oagmis.oag.go.tz/portal/revised-acts/revised/219). Catalogue publication 24 April 2025.
9. Office of the Attorney General. [Land Disputes Courts Act, Cap. 216](https://oagmis.oag.go.tz/portal/revised-acts/revised/320). Catalogue publication 25 April 2025.
10. Office of the Attorney General. [Employment and Labour Relations Act, 2004 / Cap. 366](https://oagmis.oag.go.tz/portal/acts/231). Accessed 9 September 2026.
11. Office of the Attorney General. [Labour Institutions Act, Cap. 300](https://oagmis.oag.go.tz/portal/revised-acts/revised/57). Accessed 9 September 2026.
12. Office of the Attorney General. [Law of Marriage Act, Cap. 29](https://oagmis.oag.go.tz/portal/revised-acts/revised/134). Catalogue publication 25 April 2025.
13. Office of the Attorney General. [Probate and Administration of Estates Act, Cap. 352](https://oagmis.oag.go.tz/portal/revised-acts/revised/456). Catalogue publication 25 April 2025.
14. National Bureau of Statistics. [2022 Population and Housing Census administrative boundary shapefiles](https://www.nbs.go.tz/statistics/topic/gis). Accessed 9 September 2026.
15. Commission for Human Rights and Good Governance. [Complaints and contact channel](https://chragg.go.tz/index.php/complaints). Accessed 9 September 2026.
16. Registration Insolvency and Trusteeship Agency. [Head office and branches](https://www.rita.go.tz/rita-hq.php). Accessed 9 September 2026.
17. Commission for Mediation and Arbitration. [Official contact and stakeholder page](https://www.cma.go.tz/pages/our-stakeholders). Accessed 9 September 2026.
18. Judiciary of Tanzania. [Sema na Mahakama](https://sema.judiciary.go.tz/). Accessed 9 September 2026.
19. National Audit Office of Tanzania. [Accessibility of Legal Aid Services for the Indigent Population](https://www.nao.go.tz/reports/view/accessibility-of-legal-aid-services-for-the-indigent-population). Published 10 April 2026.
