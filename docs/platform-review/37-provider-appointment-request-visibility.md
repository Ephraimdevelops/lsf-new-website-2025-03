# Appointment Request Visibility Phase

## What changed

Improved staff and provider visibility for beneficiary appointment requests.

Implemented:

- Provider dashboard timeline title for `appointment_requested`
- Provider dashboard detail rendering for requested mode, preferred time, and note
- Staff dashboard timeline title for `appointment_requested`
- Staff dashboard detail rendering for requested mode, preferred time, and note
- This connects the mobile appointment request flow to the provider scheduling workflow

## Product behavior

Beneficiaries request an appointment from mobile. Staff and providers see that request in the case timeline with enough context to coordinate and schedule an actual appointment.

## Remaining

- Appointment request status tracking is still event-based, not a separate request object.
