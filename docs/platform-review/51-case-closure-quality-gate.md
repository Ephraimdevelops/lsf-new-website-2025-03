# Case Closure Quality Gate

## What changed

- Case detail now returns a `closureReadiness` checklist for staff and providers.
- Final `closed` status is blocked server-side unless the case is ready.
- Staff and provider dashboards show the closure checklist before final close.
- The final close option is disabled in dashboards until Convex reports readiness.
- Recording an outcome now also records a `feedback_requested` timeline event.

## Closure requirements

A case can only move to final `closed` when all of these are true:

- Outcome recorded.
- Outcome summary is beneficiary-safe and at least 20 characters.
- All uploaded case documents have been accepted or rejected.
- Beneficiary feedback has been requested.

## Product reason

Closure is a service-quality and accountability point, not just a status label. The gate prevents cases from being closed without a documented outcome, unresolved document review work, or a beneficiary feedback request.

## Notes

- `closed_unresolved` remains available for cases that cannot reach a resolved outcome.
- Final `closed` is intended for cases with a recorded outcome and completed closure hygiene.
- The backend enforces the rule, so web UI restrictions are only a user-experience layer.
