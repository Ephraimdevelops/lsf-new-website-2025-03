# Case-Level Assignment History

## What changed

- `caseManagement.getCase` now returns `assignmentHistory` for staff and provider users.
- Beneficiary case detail receives an empty assignment-history array to avoid exposing worker-only operational notes.
- Staff case detail shows assignment history in context before the accountable timeline.
- Provider case timeline shows assignment history alongside case events.

## Why this matters

The global assignment monitor is useful for operations, but case workers need assignment evidence while working the case. Case-level history answers:

- Which providers were offered the case?
- Who sent each offer?
- Did an offer expire, get declined, or get accepted?
- How long did each provider take to respond?
- Was availability overridden?

## Current behavior

- Assignment rows are sorted newest first.
- Each row includes assignee, offered-by user, status, expiry, response timing, reason, availability status, and override reason.
- Provider-visible history is limited to users who already have case access.
- Beneficiaries still see only the safe public case timeline.

## Still not done

- Assignment-history export from an individual case.
- Supervisor-only review markers for availability overrides.
- Separate filtering between assignment history and public case events.
