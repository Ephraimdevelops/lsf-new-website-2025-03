# Beneficiary help search contract

- The problem is a broad `issueCategory` plus a stable `issueDetail` answer. Find Help and intake share `mobile/src/helpIssues.ts`; distinct family and land situations are not collapsed in the beneficiary's draft.
- Provider type is `providerType` on the search/matching API, compared to the record's `servicePointType`. It is not the requested outcome.
- Requested outcome is `serviceType`, derived from a saved help goal. Both provider and outcome filters run before the matcher ranks and limits recommendations to five. Existing callers can omit both optional fields.
- Visibility, review expiry, active status, request/case access and immediate-safety restrictions remain mandatory. Stored staff/linked-request matching decisions retain the applied provider/outcome filters.
- Main search selections do not navigate automatically. The beneficiary uses **Onyesha msaada**; explicit intake links may open a prefilled results page. Changing filters invalidates older in-flight match responses.
- The location sheet has only region and district. Clearing location preserves the problem, requested outcome and provider.
- Find Help, intake and Nearby Help share an offline district helper. Nearby Help remains a location-first directory; it does not become the guided problem-first Find Help journey.

## Geography provenance

`mobile/src/data/tanzania-districts.json` derives **district names**, not council names, from `reg_name` / `dist_name` in the [official NBS 2022 census ward archive](https://www.nbs.go.tz/uploads/statistics/documents/en-1714652282-TANZANIA_2022PHC_WARD_SHAPEFILES.zip), published in 2024 on the [NBS GIS page](https://www.nbs.go.tz/statistics/topic/gis). The file stores the archive SHA-256 and vintage. It contains 31 regions and 150 district names, about 3.6 KB; no boundaries or ward geometry ship in the app.

This is a versioned census catalogue, not a claim that administrative boundaries are current in 2026. New published service locations and existing saved selections supplement the list. A manual fallback remains for areas absent from the census snapshot. Region changes clear dependent districts. Do not use this catalogue to decide legal jurisdiction or eligibility.

To regenerate, download the named archive and run `python3 scripts/import-nbs-districts.py /path/to/archive.zip` with `pyshp` available in the development Python environment. Review any changed region/district count and names before accepting the generated file. The app requires no Python package or external location API.

## Verification and rollout

Handler tests cover a requested provider that would previously disappear after the top-five cut, support-type filtering, confidential-service exclusion and immediate-safety suppression. Geography tests work with zero public directory records. Mobile contracts cover intentional search, precise detail carryover and stale-response invalidation.

Synchronize the backend before distributing a mobile build that sends the new optional fields. Development synchronization is not a production release or evidence that directory services have been published.
