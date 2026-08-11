# Assisted Provider Matching Phase

## What changed

Added assisted matching for staff assignment decisions.

Backend:

- Added `caseManagement.providerRecommendations`.
- Ranks active `paralegal` and `provider_staff` accounts for a case.
- Uses location, issue keywords, verified paralegal profile data, and current accepted caseload.
- Returns score and short reasons for staff review.

Staff workspace:

- Assignment panel now shows top recommended providers.
- Staff can click a recommendation to select that provider.
- Staff still sends the assignment offer manually.

## Matching model

Current recommendation signals:

- Same region.
- Same district.
- Verified profile.
- Specialization matching issue keywords from case/request text.
- Lower active accepted caseload.

This is assisted matching, not automatic assignment. The human staff member remains accountable for the final offer.

## What is not done yet

- True availability calendars.
- Distance/geolocation.
- Language preference matching from beneficiary profile.
- Provider working hours.
- Safeguarding specialist rules.
- Automatic reassignment after declined/expired offers.
