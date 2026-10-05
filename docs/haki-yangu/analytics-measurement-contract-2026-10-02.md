# Haki Yangu measurement contract — 2 October 2026

## Implemented website measures

- **Page views:** recorded `page_view` events in the selected period. Content-specific view events are excluded from this total because the same visit can emit both.
- **Identified visitors:** distinct recorded browser visitor IDs or authenticated IDs. This is not a census of people: shared devices, blocked storage and repeat devices affect the count.
- **Daily visitors:** distinct IDs with a page view on that UTC date. A day with no attributable IDs is zero, not an estimate.
- **PDF download requests:** `publication_download` events after a publication has a PDF URL. The browser cannot prove the file was delivered or opened. One event now increments the publication counter once.
- **Recent activity:** distinct IDs with an event in the last five minutes, not a live-presence signal. Hourly page views use a rolling 60-minute window.
- **Sources and devices:** coarse classes derived in the browser; no raw referrer URL, query string or user agent is sent by current page-view instrumentation. Older stored records may still contain these fields and require a retention review.
- **Session duration and bounce:** unavailable until sessions and exits have defined instrumentation. No imputed value should be shown.

## Beneficiary journey counters now implemented

- Web and mobile record aggregate-only daily counts when someone explicitly searches Find Help or opens the final request review. A no-result search is counted separately. The API accepts only the platform and an allowlisted step; it stores no search, location, user ID, case ID or device identifier.
- The LSF Analytics tab shows these interaction counts by platform and a combined count of submitted help requests from the authoritative request table. A request stays in this count when later triaged, referred or closed.
- Service-detail call and direction actions are counted by platform. These mean a dialer/map was opened (or a web call link was clicked), not that contact or a visit occurred. Personal visit/call plans and beneficiary check-ins are counted from their own backend records, with self-reported helpfulness shown separately. Plans are not provider-confirmed appointments; check-ins are not independently verified outcomes.
- Referral consent requests, beneficiary approvals/declines, provider acceptances/declines, returns and recorded service delivery are counted from referral transition events. Each number is distinct referrals with that event during the period. One referral may occur in several measures; do not divide stage totals into a conversion rate. The dashboard shows no destination, case, beneficiary or reason.
- LSF triage waiting time uses **all** requests still in `submitted` status, including requests older than the selected period; "over 24 hours" is an operational attention threshold, not a promised service level. New first-review transitions record `triageStartedAt`, enabling average time from submission to first review for requests submitted in the period. Historic transitions without that timestamp are excluded from the average. Provider response counts and overdue open referrals use the existing organisation-specific response target (72-hour fallback) and first recorded response event.
- Public click counters remain vulnerable to automated or repeated calls because the anonymous endpoint has no trusted caller identity or edge rate limit. Do not use these for contractual targets or demand estimates until that control and real-account verification are in place.
- Searches and review openings are best-effort interactions and can repeat. The public count endpoint can be inflated by abusive clients; do not interpret these as unique people, a conversion funnel, or a validated service outcome. Submission totals are authoritative domain data but are not yet separated by originating platform.

## Next measurement work before operational decisions

1. Extend the allowlisted web/mobile contract beyond the first beneficiary steps to service contact, consent and follow-up. Do not log case narratives, chat text, search terms, contact details, document names or referral destinations as analytics metadata.
2. Instrument request draft/review/submit, Find Help result/contact/save, Saada answer/escalation, referral consent and provider response with idempotent identifiers. For outcomes and case status, use authoritative domain records rather than click events.
3. Define role-specific dashboards: LSF demand, triage ageing, safeguarding and referral completion; provider capacity and response time; paralegal assignments and follow-up; Saada citation coverage, abstentions and human review. Suppress small groups and sensitive geography in aggregate exports.
4. Configure consent, retention, access, deletion and export rules with LSF's privacy and safeguarding owners before a third-party analytics SDK is activated. Avoid advertising identifiers and session replay on legal-help screens.
5. Reconcile historic publication counters affected by the former double-write before using lifetime totals. Verify measurements with separate accounts on the configured website and device build. Add indexed rollups before event volume makes full-period `.collect()` queries expensive.

This contract describes implemented measures and outstanding work; it is not a release verification of app analytics.
