# Appointment Request Confirmation

Date: 2026-09-09

## What Changed

Beneficiary appointment requests can now be confirmed directly by staff or providers:

- `caseManagement.scheduleAppointmentFromRequest` validates the case and original `appointment_requested` event.
- The mutation creates a scheduled appointment, carries the beneficiary request context into the appointment status note, marks the original request event as scheduled, notifies the beneficiary, and writes an audit entry.
- Provider dashboard appointment tab shows pending appointment requests and can confirm a selected date/time.
- Staff dashboard selected case view shows pending appointment requests and can confirm a selected date/time.

## Why It Matters

This closes a practical workflow gap between mobile booking and operations. A beneficiary can request support from the app, and LSF/paralegal staff can turn that request into a scheduled appointment without losing the original preferred mode, preferred time, or note.

## Honest Limits

Still required:

- reschedule request flow from mobile
- beneficiary cancel request flow
- provider availability calendar and slot inventory
- automated conflict detection
- TestFlight/development-build QA for reminders
