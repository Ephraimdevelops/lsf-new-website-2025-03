# Provider Workspace Phase

## What changed

The legacy paralegal dashboard was replaced with a case operations workspace for verified `paralegal` and `provider_staff` users.

Implemented screens and workflows:

- Assignment inbox with accept and decline actions.
- Accepted case list scoped through `case_participants`.
- Case detail view with timeline, status transitions, messages, appointments, and outcome recording.
- Appointment scheduling through the shared `caseManagement.scheduleAppointment` mutation.
- Case-scoped messaging through the shared `caseManagement.sendMessage` mutation.
- Outcome recording through `caseManagement.recordOutcome`, which resolves the case and triggers beneficiary feedback.
- Legacy paralegal profile editing remains available when a legacy paralegal profile exists.

## Access model

The `/dashboard/paralegal` route now allows both `paralegal` and `provider_staff` effective roles.

Case access still depends on backend authorization:

- Assignment offers are visible through `caseManagement.assignmentInbox`.
- A provider receives full case access only after accepting an assignment.
- Accepted assignments create or reactivate a non-beneficiary `case_participants` record.
- Messages, appointments, status updates, and outcomes use the existing case-worker guard.

## Product direction

This phase makes the human-service side of Haki Yangu operational:

- Staff triage turns a request into a case.
- Staff offer the case to a verified provider.
- Provider accepts, works the case, communicates with the beneficiary, schedules support, and records the outcome.
- Beneficiary mobile screens consume the same case timeline and messages.

## Verification

Checks run after implementation:

- `npx tsc --noEmit`
- `npm run test:security`
- `npm run test:haki-contracts`

The next important verification is an authenticated browser pass with a real `paralegal` or `provider_staff` role account and at least one assignment offer.
