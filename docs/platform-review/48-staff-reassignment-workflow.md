# 48. Staff reassignment workflow

## What changed

- Added `caseManagement.reassignCase`.
- Added staff dashboard support for choosing a replacement provider from a case review request.
- Added neutral assignment-ended notification copy.
- Updated the case lifecycle so active service states can move back to `assignment_pending` during reassignment.
- Added contract coverage for reassignment invariants.

## Product reason

Beneficiaries can now request review or reassignment, but staff also need an operational action to complete that request. This phase closes that loop:

- active accepted assignment is ended
- existing offered assignment is expired
- active provider participant access is removed
- replacement assignment offer is created
- case status returns to `assignment_pending`
- beneficiary and providers receive neutral notifications
- reassignment is auditable

## Safety behavior

- The previous provider receives only neutral access-change copy.
- Complaint/review text is not sent to the previous provider.
- The replacement provider must explicitly accept before receiving active case access.
- Staff still remain accountable for choosing the replacement; no automatic assignment is performed.

## Verification

- `npm run test:security` passed, now 204 public functions classified.
- `npm run test:haki-contracts` passed, now 10/10.

## Remaining risk

- Staff UI still uses a compact selector. Production should show provider recommendation scores and workload in the reassignment panel.
- Resolution notes should be captured from staff instead of using the backend default when reassignment is completed from the review queue.
