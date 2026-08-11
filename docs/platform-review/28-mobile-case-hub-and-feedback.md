# Mobile Case Hub And Feedback Phase

## What changed

The mobile case detail screen now behaves more like a real beneficiary case hub instead of a two-tab timeline view.

Implemented:

- Case summary header with the current status and next-step guidance.
- Appointment reminder banner when a case has scheduled appointments.
- Four case tabs: timeline, messages, appointments, and feedback.
- Appointment list with mode, status, date, and optional location/call note.
- Resolved-case outcome display.
- Beneficiary feedback submission with 1-5 rating and optional comment.
- Error handling for failed message and feedback submissions.

## Backend connection

`caseManagement.getCase` now returns:

- `outcome` from `case_outcomes`
- `feedback` from `case_feedback` for the beneficiary

This keeps the mobile feedback UI attached to real backend state. It does not invent a local-only resolved state.

## Product flow impact

This completes more of the backbone flow:

1. Beneficiary submits an intake request.
2. Staff convert the request to a case.
3. Provider accepts assignment and works the case.
4. Provider schedules appointments and records the outcome.
5. Beneficiary sees appointments, outcome, timeline updates, and can submit feedback.

## Remaining mobile gaps

- Document upload and review.
- SARA mobile assistant with governed sources.
- Find-a-paralegal map/search.
- Beneficiary-side appointment request/reschedule flow.
- Offline queue and conflict resolution.
- Push notification registration.
- Rich resource library and saved resources.
