# Saada knowledge and data status

## Evidence and corrections

The existing application has a public approved-paralegal query and authenticated staff directory operations. A read-only call to `paralegals:listApprovedParalegals` on the locally configured Convex deployment returned an empty array. This does not establish that the live website database is empty. Resolve deployment identity and read the existing live directory before acquiring a replacement dataset. The QA seed file contains invented people and asserted verification; those are not evidence for real providers.

The existing Saada ingestion code stores PDF text, creates character-based chunks and embeddings, and performs vector retrieval. The inspected ingestion path does not capture source URL, jurisdiction, effective dates, rights clearance or legal approval. Finding and indexing a PDF therefore does not establish a governed legal knowledge base. The new research pack is staged locally, not ingested or approved.

The earlier acquisition report was too restrictive about public office data. Regional clinic contacts and public shelter-provider referral contacts can be researched. New records include TAWLA regional offices, LHRC clinics, WLAC, WiLDAF, WoteSawa and a KIWOHEDE programme source. Website publication establishes source-observed contact information, not accreditation, an LSF agreement, current capacity or 24-hour availability.

The earlier CSV should not be treated as production-ready: its CMA full telephone numbers added an area code not established by the cited page; its national coverage fields were too broad for service-specific jurisdiction; and its publishable/verified labels overstate operational checks. Treat that file as research staging until these fields are reconciled. NaLIS test-looking search results came from the development hostname; they do not prove that the production register is contaminated.

## The knowledge Saada needs

1. Constitutional foundations: Union Constitution and Zanzibar Constitution, rights, duties, remedies, jurisdiction and amendment history. The [OAG catalogue](https://oagmis.oag.go.tz/public) lists both. Constitution download links failed during this pass; no complete constitution text has been acquired locally.
2. Legal-aid practice: eligibility, permitted paralegal work, supervision, advocate escalation, fees, complaints and professional conduct. The [Legal Aid Act PDF](https://oagmis.oag.go.tz/portal/acts/revised/126/download) was opened: Cap. 21 R.E. 2023, 28 PDF pages, Mainland application in section 2. Full-text reuse rights require assessment; the publication expressly restricts reproduction/distribution.
3. Subject law: land/tenancy, employment, family/maintenance, inheritance, children, disability, criminal process/bail, debt/consumer matters, civil registration, trafficking, privacy, public administration and legal remedies. Existing source register covers part of this; criminal procedure, consumer, tenancy specifics, Zanzibar subject law and current case-law effects remain incomplete.
4. Procedure: correct forum, territorial and subject jurisdiction, prerequisites, filing and service, fees/waivers, time limits, appeal and enforcement. Each rule needs a cited instrument, locator, effective date and exceptions. A statute title alone cannot support a pathway.
5. Practical pathways: questions to ask, documents to prepare, first service, alternatives if inaccessible, escalation if refused, follow-up and outcome. These are authored decision aids requiring review; they are not automatically law.
6. Service navigation: public offices and live existing paralegal profiles. Query current structured records at answer time; do not embed capacity, appointment slots or personal contacts into enduring legal text.
7. Safety and access: consent, safe communication, child-sensitive response, language, disability accommodation and assisted/offline access. [National safe-home guidelines](https://www.jamii.go.tz/uploads/documents/sw-1721825362-sw1695200377-NATIONAL%20GUIDELINE%20FOR%20SAFE%20HOMES.pdf) are a source lead, not a current admission list.
8. Privacy and product boundaries: the [PDPC Act source](https://www.pdpc.go.tz/media/media/THE_PERSONAL_DATA_PROTECTION_ACT.pdf), approved LSF policy, data minimisation and authorised case access. Private cases must not enter shared public RAG.
9. Plain-language Kiswahili/English: reviewed FAQs, vocabulary, informal descriptions and uncertainty language. Six source-linked draft FAQs are included in the companion JSON.
10. Preparation tools: five bilingual original templates are included. Prescribed forms, binding instruments and legal deadlines require independent validation.

## Proposed pathway cards to develop

| Issue | Ask first | Preparation | Destination evidence / current limit |
|---|---|---|---|
| Dismissal or unpaid wages | Mainland/Zanzibar, dates, employment relationship, existing proceeding | Contract if available, payslips, messages, event chronology | [CMA FAQ](https://cma.go.tz/faqs) supports Mainland procedural FAQs; do not universalise time limits |
| Land boundary or eviction | Location, tenure, notice, existing forum, immediate risk | Notices, land documents if available, chronology | Existing Land/Village Land/Land Disputes sources; exact forum and jurisdiction need legal review |
| Inheritance | Location, death, will if known, existing administrator, safety concerns | Available death/property records; do not require all before seeking help | Probate source and [RITA](https://rita.go.tz/erita.php); religious/customary rules must be resolved |
| Violence or child protection | Immediate safety and safe contact, without demanding detailed narrative | Only safe necessary information | Government emergency routes and source-observed protection contacts; do not promise admission |
| Civil registration | Mainland/Zanzibar, record type, new application or correction | Existing reference/documents if available | RITA services page; Zanzibar route remains to acquire |
| Disability access denial | Service refused, location, requested accommodation | Brief factual record; avoid unnecessary medical detail | Source acquisition and rights-specific review still needed |

## Publication and retrieval rules to implement

Use separate states for source observed, content extracted, rights assessed, legally reviewed and published. Every chunk must retain jurisdiction, language, document version, section/page, source URL and approval. Filter before retrieval and check again before response. Withdraw superseded content and conflicting guidance; do not merely append the newest version alongside it.

Use the user's problem location and event date to select applicable law. Ask targeted questions where jurisdiction or facts change the answer. Show understandable next steps with citations. When evidence is missing, provide an honest handoff rather than a generated deadline, fee or outcome guarantee.

Emergency contacts must be structured configuration with provenance. LSF may be the platform's support/escalation contact under the owner's direction; confirm its public number, operating hours and response scope before labeling it an emergency responder. The current Saada emergency response also includes legacy Muhimbili and LHRC numbers without provenance in that code; those need reconciliation.

## What is acquired and what remains

- Acquired locally: 13 organisation/office/programme research entries, including explicit unresolved conflicts; six draft FAQ answers; five bilingual preparation templates; a knowledge architecture and pathway coverage plan.
- Read online: Legal Aid Act PDF and public provider/office/FAQ evidence. Other links are source leads unless specifically stated. No claim of a complete downloaded legal corpus.
- Still needed: live website/deployment reconciliation, approved LSF support details, complete versioned source files and permission assessment, Zanzibar coverage, case-law/amendment review, current local government/court/tribunal directories, expert approval and retrieval evaluations.
- Cannot invent: accreditation, provider availability, safe-house vacancies, emergency hours, court authority, legal advice approval, legal deadlines, official document status or beneficiary outcomes.
- No production imports, partner messages or external submissions were made.
