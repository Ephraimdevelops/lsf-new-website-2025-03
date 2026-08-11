# 67. Mobile my-appointments list

## What changed

- Added backend `caseManagement.myAppointments`.
- Added a standalone appointment list at the mobile `appointments` screen.
- Added Home and Profile entry points.
- The screen shows appointments across accessible cases with:
  - scheduled appointments first
  - date and time
  - mode and location
  - case public ID
  - lifecycle status
  - lifecycle notes
  - tap-through to the related case

## Product reason

The reference Haki Yangu direction includes appointment confirmation and notification flows. The app already showed appointments inside a case, but beneficiaries with multiple cases needed one place to see upcoming appointments and appointment history.

## Guardrails

- The backend reads only cases owned by the authenticated beneficiary or cases where the user is an active participant.
- Appointments are fetched through scoped case IDs, not through a public appointment listing.
- The query is classified in the Convex security gate as authenticated and internally scopes records before returning them.
- The mobile screen is read-only; scheduling and lifecycle changes remain controlled by staff/provider workflows.

## Remaining product work

- Add local calendar export once calendar permissions and UX are approved.
- Add reschedule request flow with worker approval.
- Add appointment reminder QA on a real device with Expo push tokens.
