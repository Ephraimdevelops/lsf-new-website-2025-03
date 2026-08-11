# 63. Appointment lifecycle quality

## What changed

- Added a worker-only appointment lifecycle mutation: scheduled appointments can now be marked completed, cancelled, or no-show.
- Stored lifecycle evidence on each appointment:
  - status note
  - worker who updated the status
  - update timestamp
- Provider dashboard appointment cards now include lifecycle note input and actions for Complete, Cancel, and No-show.
- Staff case detail now shows appointment lifecycle history alongside assignment history and the accountable timeline.
- Mobile case detail now shows beneficiary-safe appointment states in Kiswahili and English, including provider/staff status notes.
- Appointment lifecycle changes create case events, neutral beneficiary notifications, and audit records.
- Hourly appointment reminders now send one neutral beneficiary notification for scheduled appointments coming up within 24 hours.

## Product reason

Provider/staff appointment completion is a core service-quality signal. The previous system could schedule appointments, but it could not prove whether an appointment happened, was cancelled, or was missed. That left gaps in:

- case progress evidence
- staff supervision
- beneficiary trust
- outcome readiness
- appointment performance metrics

## Guardrails

- Only assigned case workers or authorized staff can update appointment lifecycle state through the existing case-worker guard.
- Closed or resolved cases cannot update appointments.
- Only scheduled appointments can transition to completed, cancelled, or missed.
- The beneficiary notification remains neutral: it says the appointment changed, not why or with whom.
- Reminder notifications are one-shot per appointment through `reminderSentAt` and skip closed cases.
- Internal notes are shown in the beneficiary case only when written as appointment lifecycle notes, not as private audit metadata.

## Verification

- Contract coverage asserts schema fields, backend mutation, audit/notification behavior, provider controls, staff visibility, and mobile labels.
- Full verification should include Convex codegen, web TypeScript, mobile TypeScript, contract tests, diff checks, and production build.

## Remaining product work

- Push receipt monitoring already uses the existing notification delivery pipeline; production QA still needs live Expo receipt checks on device.
- Reschedule requests should become a first-class lifecycle path instead of being represented as cancellation plus new scheduling.
- Staff reporting should aggregate kept, cancelled, and no-show rates by region/provider without exposing beneficiary details.
