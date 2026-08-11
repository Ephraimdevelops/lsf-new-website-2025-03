# Mobile Release and QA Readiness

## Validation performed

- Confirmed local Node version: `v22.14.0`.
- Confirmed npm version: `10.9.2`.
- Confirmed Expo CLI version: `57.0.13`.
- Confirmed Expo public config resolves with SDK `57.0.0`.
- Confirmed app assets referenced by config exist.
- Confirmed iOS bundle identifier: `org.lsftz.hakiyangu`.
- Confirmed Android package: `org.lsftz.hakiyangu`.

## Current config state

- Convex URL can be inherited from the parent development `.env.local`.
- Clerk publishable key is empty until explicitly configured for mobile.
- EAS project ID is empty until an Expo project is created/linked.
- Push credentials are not proven until EAS/device QA is complete.

## Release blockers

- Production Convex deployment URL.
- Matching Clerk instance and JWT template named `convex`.
- EAS project ID and credentials.
- Physical-device QA on iOS and Android.
- Verified emergency/safety content from LSF.
- Production app store metadata and privacy disclosures.

## Device QA scope

The mobile README now includes a manual QA checklist covering:

- authentication and Convex identity sync
- intake drafts and idempotent submission
- case messages, appointments, reviews, feedback, and offline pending sync
- document upload and review
- push notifications and notification preferences
- screen-capture protection and Quick Exit
- offline saved guides and pending sync visibility

## Tooling note

`npx expo-doctor --version` did not produce useful output in this environment before validation moved on. Deterministic checks were still run with `npx expo config --type public`, TypeScript, security, contracts, and production web build.
