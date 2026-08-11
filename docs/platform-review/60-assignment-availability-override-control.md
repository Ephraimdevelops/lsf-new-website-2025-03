# Assignment Availability Override Control

## What changed

- Initial assignment offers now reject paused or unavailable providers unless staff records an override reason.
- Reassignment offers use the same availability guard.
- Assignment events and audit records include:
  - `availabilityStatus`
  - `availabilityOverrideReason`
- Staff assignment and reassignment panels show an override textarea when the selected provider is paused or unavailable.
- Staff provider dropdowns show availability status so staff can see the risk before selecting.

## Why this matters

Availability scoring is not enough. Staff also need a hard operational control so paused/unavailable providers are not assigned accidentally. When staff decide to override, the reason becomes part of the case assignment evidence.

## Current behavior

- `accepting_cases` and `limited` providers can receive offers without override reason.
- `paused` and `unavailable` providers require an override reason.
- The backend enforces the rule even if the UI misses it.
- Override context is stored in worker-visible events and audit metadata.

## Still not done

- Staff override reason display in the assignment-offer history tab.
- Separate staff permission for high-risk availability overrides.
- Automatic supervisor review for assigning unavailable providers.
- Analytics on how often availability overrides happen.
