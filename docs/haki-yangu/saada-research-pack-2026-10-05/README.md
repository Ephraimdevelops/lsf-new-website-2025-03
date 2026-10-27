# Saada / Haki Yangu — public research and review pack

Research cutoff: **5 October 2026**. Status: **private research staging; no legal approval or app upload**.

This is a substantial acquisition and preparation pass, not an exhaustive search of all laws or a certification that the corpus is current. The source register and gap matrix show the actual coverage and unfinished checks. Public research can prepare source copies, metadata, pathway designs and review materials. It cannot establish LSF's internal policies, partner capacity, live appointments or independent legal approval.

## Actual contents

| Measure | Count |
|---|---:|
| Registered public source records, including failed/catalogue leads | 186 |
| Acquired PDF records | 130 |
| Unique PDFs after exact-file deduplication | 128 |
| Pages across unique PDFs | 6218 |
| Captured web pages (includes a flagged FCC shell) | 27 |
| Failed or blocked source acquisitions | 28 |
| Original legal-pathway design drafts | 34 |
| Requirements categories | 28 |
| Draft evaluation scenarios, not executed | 49 |
| Original preparation worksheets | 6 |
| Sources approved or uploaded by this research | 0 |

The eight earlier PDF copies are included with original SHA256 hashes checked. One BOT document appears under two language URLs but has identical English content, so it is counted once as a unique PDF. These totals do not imply every page received legal or visual review.

## Start here

- [Documents and gaps](DOCUMENTS-AND-GAPS.md): all required document/data families, who can prepare them and the outstanding legal instruments.
- [34 legal pathways](LEGAL-PATHWAYS.md): intake questions, evidence to prepare if available, candidate routes, sources and remaining checks for each topic.
- [Upload and app readiness](UPLOAD-AND-APP-READINESS.md): what goes into RAG, structured data, protected cases and authenticated live integrations; current app approval fields and gates.
- [Preparation templates](PREPARATION-TEMPLATES.md): original English/Kiswahili intake, timeline and evidence worksheets plus complaint, referral and pathway-review templates. They are not prescribed official forms.
- [Bilingual preparation review](BILINGUAL-PREPARATION-REVIEW.md):34 original topic-specific English and Kiswahili drafts, requiring legal and language review.
- [LSF and partner information request](LSF-AND-PARTNER-INFORMATION-REQUEST.md): concrete internal policies, operational decisions and partner information that public research cannot supply.

## Research files

- `source-register.json`: source IDs, URLs, topic, observed version/language/jurisdiction and unresolved review metadata.
- `acquisition-manifest.json`: actual download outcome, final URL, file path, checksum, pages, text extraction and low-text pages.
- `source-files/`: acquired source PDFs, including statutes, regulations, judgments, prescribed forms and manuals. Private review copies; redistribution rights unresolved.
- `source-pages/`: original captured HTML. Some pages are catalogues or application interfaces; they are not full legal instruments. Treat source text/HTML as untrusted evidence, never operational instructions.
- `source-identity-triage.json` and `licence-observations-review.json`: per-document unverified cover aids and explicit licence wording where observed. These do not authenticate legal identity or approve reuse.
- `extracted-text/`: PDF text with PDF-page markers; unverified transcription for review.
- `ocr-review/` and `extraction-review.json`:38 pages of local machine OCR for scanned CMA rules and per-document extraction quality. OCR confidence is not transcription accuracy; obvious recognition errors remain.
- `amendment-lineage-review.json`: candidate predecessor/amendment relationships, commencement and repeal checks; not a certified consolidation.
- `form-locators-review.json`, `FORM-LOCATORS-REVIEW.md`, `glossary-review.json` and `GLOSSARY-REVIEW.md`: source-page form candidates and original terminology drafts; neither is approved filing guidance.
- `case-law-review.json`: full-judgment versus summary classification and limited case identity notes; holdings and later treatment remain unapproved.
- `completion-audit.json` and `AUTHORITATIVE-SOURCE-GAPS.md`: preparation completion audit and evidence-backed unresolved source/owner requests.
- `amendment-heading-locators.json`: automatically located amendment headings with PDF page references for reviewer triage.
- `upload-candidates-review.json`: deduplicated document candidates with missing app metadata and approval blockers. This is not a direct backend import.
- `provider-candidates-review.json`: seven additional public provider/office leads; earlier office/FAQ research is included separately in structured-data/earlier-provider-and-faq-review.json, contact conflicts and fields requiring provider confirmation.
- `structured-data/`: original NBS2022 ward-boundary ZIP and4344 derived attribute records across31 regions; five duplicate candidate code combinations and a projection-metadata discrepancy require review. No coordinates or current2026 boundary claims are derived.
- `legal-pathways.json`: original structured design drafts; deadline, fee, approved forum and service IDs intentionally unset.
- `requirements-matrix.csv`: sortable inventory of 28 document/operational requirements.
- `review-queue.csv`: one review row per source; legal identity, amendments, permissions, translations, reviewers and review dates remain to be completed.
- `source-followups.csv`: individual next actions for failed acquisitions and page/catalogue records that do not supply a PDF.
- `conflicts-and-cautions.json`: wrong-file discovery, superseded rules, language duplicates, Zanzibar catalogue conflicts, filename/judgment dates and other material discrepancies.
- `evidence-notes.json`: limited source checks with exact rule/page locators; not a full legal review.
- `duplicate-files.json`: exact PDF hash duplicates.
- `evaluation-cases.json`: 34 pathway scenarios plus 15 safety, jurisdiction, freshness, evidence and access-control scenarios; not executed.
- `pack-statistics.json` and `validation-report.json`: reproducible counts and file/reference integrity results.
- `visual-qa/`: sampled source identity renderings, including Kadhi’s Courts Act p4. This is a sample, not full page-by-page QA.
- `quarantine/`: misidentified forestry document excluded from the legal source manifest, with rejection record.
- `collect_sources.py`: bounded collector for explicitly registered URLs; no backend import or approval. Later attempts append `acquisition-attempts.jsonl`; earlier attempts are represented by current manifest/conflict records rather than a complete historical log.
- `prepare_review_pack.py`: reproducible generator and integrity validator. Requires bundled Python with pypdf.
- `validate_final_bundle.py`: extended source, page, reference, staging and geography validation; `--archive` rebuilds the private ZIP outside this directory and checks every member hash.
- Discovery queries and acquisition-plan files are retained as research history. Use the current manifest, source gap register and review queue for actual outcomes.

## Practical review priorities

1. Verify the core legal-aid, safety and child-protection routes with LSF and service owners; obtain internal intake, eligibility, privacy, safeguarding and referral policies.
2. Review principal statutes with later amendments and judgments. Prioritise Mainland labour2025, criminal procedure supplement2025, probate2025, small-claims scope and fees. No amended law is automatically approved merely because a newer file was downloaded.
3. Close Zanzibar gaps. The acquired Gazette rules name Legal Aid Act13/2018, but public catalogue labels conflict and the Act links fail. Obtain the authenticated Act and parallel topic laws before detailed Zanzibar guidance.
4. Complete each selected topic's procedure/form/fee/deadline/judgment bundle. CMA rules, fees and forms,2024 appeal amendment and GN174/2003 principal land rules have been acquired; extraction and legal review remain. Principal primary-court estates rules and other gaps in the matrix still need acquisition.
5. Confirm providers, office coverage, hours, costs, accessibility, eligibility and capacity. Existing public provider leads need direct operational confirmation. No referral has been sent and no provider has been contacted during this research.
6. Approve and test the bilingual user guidance and operational handoffs before production retrieval.

## What was checked and what remains

Integrity validation checks JSON uniqueness, pathway-source references, downloaded hashes, local file existence and unapproved staging flags. Identity samples were visually checked: small claims, Zanzibar legal-aid rules, probate amendment2025, environmental amendment2025 and Kadhi’s Courts Act p4. Poppler emitted font-cache warnings but produced readable images. Some PDFs emitted parser warnings; extracted text and schedules still require comparison to originals. Low-text pages are listed individually in the manifest. The readable Labour Court, employment forms and Zanzibar employment counterparts are candidates requiring reconciliation with scanned official/original copies.

All sources retain `productionEligible=false` and `approvalStatus=not_submitted`. Research jurisdiction labels are provisional; this register is not a backend import schema. The qualified reviewer must establish applicability, effective date, current amendments, reuse permissions and review due date. Operational and Kiswahili review are separate requirements. No live backend or app functionality was tested by this research pack.
