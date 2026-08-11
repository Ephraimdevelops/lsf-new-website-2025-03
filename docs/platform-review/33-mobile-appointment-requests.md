# Mobile Appointment Request Phase

## What changed

Added a beneficiary appointment request flow without weakening the existing scheduling controls.

Implemented:

- `caseManagement.requestAppointment`
- Mobile Appointments tab request form
- Preferred appointment mode: phone, remote, or in-person
- Optional preferred time text
- Optional appointment note
- Timeline event: `appointment_requested`
- Worker notifications for active non-beneficiary case participants
- Audit log entry: `appointment.requested`
- Security harness classification as `case-access`

## Product decision

Beneficiaries can request an appointment, but the app does not mark that request as a confirmed appointment. Staff or assigned providers still schedule the actual appointment through the case workspace.

That is intentional because a legal-aid appointment needs availability, safety, and case-worker coordination before confirmation.

## Remaining

- Appointment cancellation/reschedule workflow.
- Calendar export/reminders.
- Push notification delivery beyond stored in-app notifications.
