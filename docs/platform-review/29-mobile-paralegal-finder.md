# Mobile Paralegal Finder Phase

## What changed

The mobile home action `Find a paralegal` now opens a real screen instead of sending users to the learning tab.

Implemented:

- `mobile/app/paralegals.tsx`
- Stack route registration for `paralegals`
- Home dashboard action routing to `/paralegals`
- Verified approved paralegal listing from `paralegals.listApprovedParalegals`
- Region, district, ward, and specialization search
- Provider cards with name, verified state, location, bio, and specializations
- Call action using public phone number where available
- Request-help action that sends the user into guided intake
- Safety note directing sensitive cases through LSF matching

## Backend connection

This phase reuses the existing approved-paralegal query and profile-view mutation:

- `paralegals.listApprovedParalegals`
- `paralegals.incrementProfileViews`

No new backend surface was added.

## Product rationale

The screenshots include a clear `Find a Paralegal` journey. This implementation makes that path functional while keeping sensitive matching governed:

- Users can browse public verified providers.
- Users can call a listed provider.
- Users are still encouraged to use guided intake for sensitive or safety-related issues.

## Remaining

- Map view and distance sorting.
- Provider profile detail screen.
- Request-assistance-to-specific-provider workflow.
- Availability indicators from live assignments and working hours.
