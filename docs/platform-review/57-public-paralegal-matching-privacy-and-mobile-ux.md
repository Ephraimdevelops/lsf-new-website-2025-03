# Public Paralegal Matching Privacy and Mobile UX

## What changed

- `paralegals.listApprovedParalegals` now returns a public-safe projection by default.
- Staff/admin callers can request private operational fields with `includePrivate: true`, guarded by staff/admin auth.
- The mobile paralegal finder now presents LSF matching as the primary path.
- Mobile paralegal cards show plain-language match signals such as verification, location fit, issue-area fit, and languages.
- Direct phone contact remains available, but the UI warns users to use the governed request flow for sensitive cases.

## Why this matters

The paralegal directory is public-facing, but approved application records can contain operational or personal data that the public app does not need. Public reads should return only what is intentionally displayable. Matching also needs to be understandable: users and staff should know whether a recommendation is based on location, issue area, verification, language, or availability.

## Current matching behavior

- Beneficiary mobile finder: public-safe directory search by region, district, ward, and specialization.
- Beneficiary safe matching: routes into the legal-help intake so LSF can assess safety and assign support.
- Staff assignment panel: uses `caseManagement.providerRecommendations` to rank assignable providers by location, issue fit, verification, and current caseload.
- Admin directory: explicitly requests private operational fields.

## Still not done

- Live distance/geolocation matching.
- Provider availability calendars and working hours.
- Beneficiary language preference captured during intake.
- Safeguarding specialist rules for high-risk issue types.
- Automatic requeue after declined or expired offers beyond the current expiry job.
