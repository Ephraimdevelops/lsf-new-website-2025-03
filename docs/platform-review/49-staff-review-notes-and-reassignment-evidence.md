# Staff Review Notes and Reassignment Evidence

## What changed

- Staff can record a beneficiary-safe resolution note when marking a case review request under review, resolved, or declined.
- Reassignment from a review request now stores the staff-provided resolution note instead of always using a generic note.
- The review queue can load provider matching evidence before selecting a replacement provider.
- Replacement provider cards show score, role, location, active case load, and matching reasons.

## Product reason

Reassignment is a trust-sensitive workflow. Staff need to show why a change was made, beneficiaries need a clear safe update, and LSF needs an audit trail that does not expose internal disciplinary or provider-side details.

## Privacy boundary

Resolution notes must remain beneficiary-safe:

- Do not include internal disciplinary notes.
- Do not include confidential provider-side details.
- Do not include sensitive allegations beyond what the beneficiary already submitted.
- Use the note to explain the decision and next step.

## Verification

- Convex mutation args include `resolutionNote` for `reassignCase`.
- Staff dashboard sends notes through `resolveCaseReviewRequest` and `reassignCase`.
- Contract tests assert the reassignment path preserves staff notes and exposes matching evidence in the review workflow.
