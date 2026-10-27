# Haki Yangu management and beneficiary verification

Prepared on 7 October 2026. Automated handler tests use in-memory fixtures and real repository handlers/auth helpers. They do not impersonate an account on the hosted backend. Read-only deployed checks use a guest HTTP client without a token or identity override. No real provider was contacted or invited, and no corpus/guide/directory record was uploaded.

## Checks completed

| Actor or surface | Verified result | Evidence level |
| --- | --- | --- |
| Guest | Public guide list/search and service directory are reachable; private research, editorial queue and memberships are denied | Configured development backend HTTP checks |
| Guest in browser | Know Your Rights displays the empty approved-content state and a help route; editorial management redirects to login | Local browser connected to the development backend |
| Beneficiary | Cannot submit/edit guides or create/update directory services; receives only current reviewed public projections | Application handler tests with in-memory fixtures |
| Content editor | Imports remain pending; retries reuse records without silently extending review dates; cannot edit another author's guide or approve content | Application handler tests with in-memory fixtures |
| Admin/reviewer | Independent approval controls public guide visibility; guide retirement removes it from public search; self-approval is denied | Application handler tests with in-memory fixtures |
| Staff | Research import creates 71 private records and retry creates none; contact updates, provenance protection, removal/restoration and audit events work | Application handler tests with in-memory fixtures |
| Supervisor | Can read research; cannot import, edit or remove it | Application handler tests with in-memory fixtures; corresponding web controls hidden |
| Provider staff | Can update its own active verified intake; other organisations and inactive services are denied | Application handler tests with in-memory fixtures |
| Paralegal, stakeholder, donor | Cannot manage private directory research through these APIs | Application handler tests with in-memory fixtures |
| Service reviewer | Same creator cannot verify; material edits remove public visibility; organisation removal deactivates linked services; restoring a draft does not republish | Application handler tests with in-memory fixtures |
| Public safety boundary | Confidential safe-house addresses are excluded, and a public safe-house creation is rejected | Application handler tests with in-memory fixtures |
| Mobile beneficiary topics | All 108 questions map into nine reachable topic filters, including inheritance, documents, access to justice and Zanzibar; future categories remain discoverable | Pure content/filter tests |
| Web, backend and mobile code | Type checks pass; web build and Expo web/iOS/Android JS bundle exports succeed | Compilation, not installed-device testing |

The full test suite contains 150 passing tests, including existing case, intake, invitation, confidentiality and Saada contracts. Tests do not certify legal accuracy, live provider availability or physical-device behaviour.

## Remaining signed-in rehearsal

Use existing, authorised accounts. Do not fabricate identities, grant test roles to real beneficiaries, or bypass independent review. Use clearly labelled test records only where the organisation has designated a test environment and permitted test data.

1. Sign in as admin/staff and open the staff Services workspace. Import `upload-preparation-2026-10-07/directory-research-import.json`. Confirm the returned added/skipped counts and saved record IDs. Retry and confirm no additional records. Search for a centre by name/contact/location; edit a research record; remove and restore it. Confirm another unauthorised role cannot open the private queue.
2. Review each source row against the original observation. Resolve overlaps, current contact/location, coverage, hours, eligibility, intake and referral conditions. Create an organisation draft and link its service points only after factual details are confirmed. Unknowns must remain research notes, not inferred intake readiness.
3. Have a different LSF reviewer verify the organisation and each service using checked evidence and a future review date. Confirm services remain hidden before review. Edit a material public detail, confirm it becomes inactive/expired, and complete renewed independent review. Confirm removal and draft restoration do not silently republish linked services.
4. Sign in as content editor/admin and open `/dashboard/editorial`. Import `know-your-rights-expanded-2026-10-07/guide-drafts.json` with a deliberate next source-review date. Confirm 108 pending records and exact IDs/counts; retry and confirm the receipt reports existing references rather than new submissions. Exercise pagination in pending/history queues, bilingual editing, image URL/description validation, removal and copying into a new review draft.
5. Complete legal, Kiswahili/English, jurisdiction, source and practical-pathway review. A different real administrator must approve. Confirm pending/rejected/retired/expired content never appears publicly or in guide search. User approval in chat is not a saved app review decision.
6. As beneficiary/guest, check topic filtering, both languages, guide/source links, help routing and an expired or removed guide. For approved content, ask Haki Yangu AI relevant Mainland and Zanzibar questions, check its source/jurisdiction attribution, and ensure it does not claim to have sent a referral. Test unmatched questions and unavailable services. Actual AI provider/API behaviour has not been rehearsed in this run.
7. As approved provider staff, confirm the profile shows only approved affiliations, own service intake updates and permitted members. Try an out-of-organisation service ID and confirm denial. Invitations need an identified recipient and the existing independent membership-review process; research import must never grant profile access.
8. Rehearse on installed Android and iOS clients, including navigation, keyboard/screen reader, cover-image failure, loss of network, returning to sign-in and case/privacy boundaries. Compiled bundles are available locally; they have not been distributed through Play Store/App Store or an OTA channel.

## Release scope

The backend target configured in this checkout is development. The website changes are available locally and a production web build is prepared. No production web hosting or app-store release has been performed. Content remains 108 local guide drafts plus 71 local research inputs, with no authenticated import confirmed. The development public queries currently return zero approved guides and zero verified public services.
