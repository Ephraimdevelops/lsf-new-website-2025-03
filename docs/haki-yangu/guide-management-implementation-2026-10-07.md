# Guide and directory management — implementation status

Implemented on 7 October 2026 and deployed to the configured development Convex backend. No authenticated import, publication, production website deployment or mobile distribution occurred. The browser remains at http://localhost:8080/login. Development guest queries are confirmed; signed-in account flows are not yet rehearsed.

## Prepared content

- 108 original bilingual Know Your Rights review drafts: twelve per category across nine categories. The earlier 72-question pack and its archive remain preserved separately.
- Expanded pack: `know-your-rights-expanded-2026-10-07/guide-drafts.json`. All records retain unset review dates and reviewers, `productionEligible: false`, `backendGuideId: null` and legal/language/currentness blockers. It references 88 sources; references and candidate page locators are review aids, not certified current legal citations.
- Directory research import: `upload-preparation-2026-10-07/directory-research-import.json`, containing 37 overlapping organisation/office/registry source rows and 34 pathway drafts. These are 71 research records, not 71 unique organisations or verified services. Original observations, unknowns and source links are retained.
- Existing PDF ingestion preparation remains separate. No new PDF was indexed or approved here.

## Management changes

The editorial workspace imports bilingual packs of up to 250 guides (2 MiB file limit), previews content and requires a future source-review date. Imports stay pending. An indexed server import reference prevents the same pack entry being inserted again after a lost response; local previews also skip matching loaded entries. An import reference includes bilingual titles, source URL, category and jurisdiction. It does not merge separately named questions or revised content automatically.

The guide queue now paginates pending, published, due and historical records instead of hiding records after 100. Authors edit their pending drafts. Published guides use the existing independent revision process. Admins remove published guides; authors can remove their own unpublished drafts. Removal retires a guide and preserves its audit history. A removed guide can be copied into a new review draft with a new source-review date; this is not automatic republication or restoration of its prior approval.

Hosted HTTPS cover images and bilingual descriptions are supported by the web editorial/review/public guide interfaces. This is URL support, not a file-storage uploader. No images were added to the research pack. Mobile guide details now support hosted cover images with bilingual accessibility descriptions and graceful failure; the updated mobile client still requires distribution.

The private research queue accepts the prepared organisation/centre/pathway pack, skips existing external references transactionally, paginates and uses a full-text index for searches across records and contact/location fields, displays original observations and pathway details, edits contact/location/source notes, and supports removal/restoration with an audit reason. Original provenance and stable references cannot be overwritten. This queue permits admin/staff management and supervisor read access and is excluded from public AI recommendations and provider membership grants.

The staff directory now displays every organisation in its loaded list and supports editing organisational contact and accountability fields, removing from active use, and restoring as a draft. Removing an organisation deactivates linked active/verified services through existing backend lifecycle rules. Service forms support editing, physical address, coverage regions and eligibility alongside existing contacts, region/district, intake and other fields. Inactive services remain retained for history; renewed verification is required for public use. Blank capacity or SLA inputs no longer become an invented zero.

Organisation profiles continue to use existing approved memberships, organisation-scoped intake management and reviewed invitations. Research imports do not create profiles, grant an organisation access, or confirm referral agreements. These flows were inspected, not changed into broader access.

## System query and AI access

`publications.searchPublicLegalGuides` projects only independently approved guides whose review date has not passed, searches both languages, separates Mainland/Zanzibar applicability and returns at most ten matches. Haki Yangu AI has a `find_guides` tool that uses this query. When PDF retrieval has no usable evidence but approved guides match, it returns the approved text and source links deterministically; it does not generate unsupported legal instructions. With PDF evidence, guide results are passed into the grounded tool response. Unverified research never enters this tool.

The existing Saada service tool continues to use verified current public directory records and now excludes closed and emergency-only intake from ordinary suggestions. It is directory filtering, not the scored service matcher. The app's scored matcher remains a distinct existing flow. Confidential shelter locations are excluded from public results. No shelter capacity or admission has been confirmed.

Public website/mobile guides continue to use the shared approved-guide query. Content count is not fixed at 72. New content can flow through existing clients after backend deployment/import/approval; new native image UI would require a separate mobile release.

## Verification and remaining work

Focused pack/content/edit/image/search/provenance tests, selected guide/directory/matching contracts, TypeScript checking, security checks and the production web build were run. See the completion evidence file for final results. Authenticated UI, live function availability, actual import IDs/counts, legal review, invitations and end-to-end AI/provider recommendations remain unverified.

The checkout contains other pre-existing uncommitted work. Full repository tests and strict backend checking passed before the development backend push. Production hosting and mobile distribution were not performed. Sign in with the appropriate admin/staff/editor account, import private research and pending guides, and confirm returned IDs/counts. Complete source/legal/language review and independent approval before publication. Keep uncertain emergency capacity and confidential locations outside public records.

## Continuation verification

Full suite: 150 passing tests. Web, mobile and strict backend TypeScript checks pass. Production web build and Expo web/iOS/Android JS exports pass. Six guest HTTP smoke checks pass against the configured development backend; public guides and services both currently return zero. The local public guidance empty state and editorial sign-in redirect were checked in the browser. Private imports, real signed-in role flows, actual AI responses and installed-device testing remain pending. See `management-role-rehearsal-2026-10-07.md` and `management-live-check-2026-10-07.json`.
