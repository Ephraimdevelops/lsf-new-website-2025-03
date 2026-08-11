# Assignment History Visibility

## What changed

- Assignment records now persist availability context at the time an offer is sent:
  - `availabilityStatus`
  - `availabilityOverrideReason`
- `staffAssignmentOffers` returns a normalized `history` payload for the staff monitor.
- Staff assignment monitor now shows:
  - availability status at offer time
  - availability override reason
  - response duration or current offer age
  - expiry status
  - decline, expiry, or reassignment reason

## Why this matters

Staff need assignment operations to be auditable without digging through raw events. A strong workflow must answer:

- Who was offered the case?
- Who offered it?
- How long did the provider take to respond?
- Did the offer expire?
- Was the provider paused or unavailable?
- If staff overrode availability, why?

## Current behavior

- Active offers show current offer age and expiry.
- Accepted, declined, expired, and ended offers show response or end timing.
- Availability override reason is displayed only in staff operations.
- The backend computes offer age, response duration, and overdue state so UI behavior is consistent.

## Still not done

- Dedicated assignment history timeline inside each case detail.
- Exportable assignment audit report.
- Supervisor review workflow for availability overrides.
- Analytics dashboard for average response time and assignment expiry rate.
