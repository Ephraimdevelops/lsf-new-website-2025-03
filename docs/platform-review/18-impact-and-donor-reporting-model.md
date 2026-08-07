# Impact and Donor Reporting Model

## Reporting principle

Operational records answer “what service occurred?” Metric definitions answer “how is it counted?” Immutable snapshots answer “what was reported for this period?” Never derive donor access by exposing a filtered case table.

## Core metrics

| Metric | Definition controls |
|---|---|
| people reached | deduplicated person/service scope; separate anonymous education reach from registered beneficiaries |
| help requests | submitted, non-test requests; report duplicates/withdrawals separately |
| geographic coverage | service location at approved granularity; suppress small cells |
| time to first response | submitted → first qualified human response; median/p75/p90 |
| time to assignment | eligible/assignment-ready → accepted assignment |
| referral acceptance | accepted / valid offered referrals, with expiry/decline separately |
| outcomes | approved outcome taxonomy and evidence level; never equate closure with resolution |
| unresolved/ageing | open by age band and blocker reason |
| satisfaction/understanding | question/version, response rate and channel shown |
| provider capacity | declared slots versus active workload; not a staff performance weapon without context |
| programme attribution | explicit service-event allocation rules; prevent double counting |

Every `metricDefinition` has key, version, owner, formula, dimensions, exclusions, source events, quality checks, suppression threshold, effective dates and approval. `metricSnapshots` store period, definition version, generated time, input watermark, values, quality flags and approval.

## Donor access

Only approved dashboards/exports with aggregation, geographic coarsening, small-cell suppression and no free text, identifiers, precise locations, case references or attachment links. Funding source does not imply case access. Every export is scoped, watermarked, logged and expires where shared by link.

## Justice Pulse

Trend outputs use taxonomy-versioned, de-identified counts and clearly state coverage bias, missingness and methodology. AI-derived issue classification remains a reviewed analytical signal, not ground truth. Public trend release requires re-identification and harm review.

## Data quality

Required-field completeness, status-transition validity, duplicate detection, stale-case checks, impossible date/order checks, outcome evidence level, referral reconciliation and programme-allocation totals. Quality exceptions are visible and do not get silently removed from denominators.
