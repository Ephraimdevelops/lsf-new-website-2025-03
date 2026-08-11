# Provider Availability and Assignment Fit

## What changed

- Added structured provider availability fields to paralegal/provider profiles:
  - `availabilityStatus`
  - `weeklyCapacity`
  - `workingHours`
  - `availabilityNotes`
- Provider profile editing now lets verified paralegals/providers maintain availability and capacity.
- Staff assignment recommendations now factor declared availability and remaining capacity into score and reasons.
- Staff recommendation cards show availability status, remaining slots, working hours, and assignment notes.
- Public/mobile paralegal directory shows only safe availability status, not staff-only notes.
- Provider dashboard header shows the provider's current availability state and capacity.

## Why this matters

Assignment quality cannot rely only on location and issue fit. A good match must also account for whether the provider is actually taking new cases and has capacity. This reduces stalled offers, improves response time, and makes staff decisions auditable.

## Current matching behavior

- `accepting_cases`: positive score when remaining capacity exists.
- `limited`: small positive score only when capacity remains.
- `paused` and `unavailable`: strong score penalty with visible reasons.
- Remaining capacity is calculated from `weeklyCapacity - active accepted case load`.
- Public/mobile users only see general status; operational notes remain in staff/provider workflows.

## Still not done

- Calendar-based availability by date and time.
- Automatic assignment filtering to hide paused/unavailable providers entirely.
- Provider response SLA by availability state.
- Staff override reason when assigning a paused/unavailable provider.
- Historical availability audit trail.
