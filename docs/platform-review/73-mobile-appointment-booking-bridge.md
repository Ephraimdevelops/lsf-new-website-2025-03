# Mobile Appointment Booking Bridge

Date: 2026-09-09

## What Changed

The mobile appointment screen is now more than a read-only appointment list. Signed-in users can:

- choose one of their open cases
- select phone, virtual, or in-person support
- enter a preferred time
- add a note for the case team
- submit a real `caseManagement.requestAppointment` mutation

Paralegal list and paralegal profile booking buttons pass preferred provider context into the appointment request screen. That context is included in the appointment request note so staff/paralegals can see what the beneficiary intended.

## Why It Matters

This connects the premium “Book support” journey to actual backend operations. The beneficiary can ask for an appointment, the case team receives the request through the case timeline/notifications, and staff/providers can schedule or complete the appointment from their dashboards.

## Honest Limits

Still required for production:

- true calendar slot availability
- staff approval/scheduling from a requested appointment into a confirmed appointment
- reschedule/cancel requests from mobile
- provider-specific appointment availability
- reminders tested in a development build/TestFlight
