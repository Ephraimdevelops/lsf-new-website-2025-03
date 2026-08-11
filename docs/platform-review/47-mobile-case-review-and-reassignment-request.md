# 47. Mobile case review and reassignment request

## What changed

- Added `case_review_requests` to Convex.
- Added backend functions:
  - `caseManagement.requestCaseReview`
  - `caseManagement.staffReviewRequests`
  - `caseManagement.resolveCaseReviewRequest`
- Added beneficiary mobile UI in the case detail feedback tab for:
  - reassignment request
  - service concern
  - safety concern
  - other review request
- Added staff dashboard `Reviews` queue.
- Added neutral notification copy for review request events.

## Product reason

The first vertical slice requires beneficiaries to be able to request reassignment or complain without exposing sensitive details to the worker they may be concerned about.

This phase implements a safe first version:

- beneficiary submits a review request from the case
- request details go into a staff/supervisor queue
- assigned providers are not directly notified with the concern text
- beneficiary timeline gets a neutral confirmation event
- staff can mark the request under review, resolved, or declined

## Safeguarding behavior

- `case_review_requested` timeline event is beneficiary-only.
- Supervisor/staff notifications use neutral copy.
- The detailed note is stored in `case_review_requests`, visible through the staff queue, not pushed to assigned workers.
- This does not automatically remove or replace an assignee. That remains a staff decision because reassignment may require safety, conflict, capacity, and continuity checks.

## Verification

- `npx convex codegen` passed.
- Root `npx tsc --noEmit` passed.
- Mobile `npm run typecheck` passed.
- `npm run test:security` passed, now 203 public functions classified.
- `npm run test:haki-contracts` passed, now 9/9.

## Remaining risk

- Staff still need a full reassignment action that can end an accepted assignment, deactivate a participant, and offer a replacement with audit history.
- Review-resolution notes are supported in the backend, but the current staff UI exposes status actions only. A richer resolution-note form should be added before production.
