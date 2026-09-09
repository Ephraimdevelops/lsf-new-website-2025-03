# Haki Yangu Mobile

Expo/React Native client for the shared LSF digital justice platform.

## Architecture

- Expo Router and TypeScript
- Clerk identity with encrypted Expo SecureStore token persistence
- Convex as the shared backend used by the LSF website
- Kiswahili-first copy with English support
- Sensitive intake drafts remain in memory unless the user explicitly saves them with SecureStore
- Non-sensitive language/onboarding preferences use AsyncStorage

The app imports Convex API types from the repository but creates runtime function references from its own Convex dependency. It does not contain a second backend.

## Local environment

Create `mobile/.env.local` from `.env.example` with development values:

```text
EXPO_PUBLIC_CONVEX_URL=https://<development-deployment>.convex.cloud
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_<development-instance>
EXPO_PUBLIC_EAS_PROJECT_ID=<eas-project-id-for-push-tokens>
```

The app may reuse the parent development Convex URL. It will only reuse the parent Clerk key when that key begins with `pk_test_`; production Clerk keys are deliberately rejected during local development.

The Clerk development instance must expose a JWT template named `convex` and enable the selected email/password verification methods.

## Development and staging seed data

Presentation data must be real Convex data, not hardcoded private records in the production mobile app.

- Staff/admin can seed verified directory records with `hakiYanguSeed.seedMobileDirectory` and `hakiYanguSeed.seedJusticeServices`.
- A signed-in beneficiary can receive a synthetic QA request/case/document/appointment/notification through `hakiYanguSeed.seedMyMobileQaMatter`.
- `seedMyMobileQaMatter` is disabled unless the Convex environment variable `HAKI_ALLOW_MOBILE_QA_SEED` is exactly `true`.
- Do not enable `HAKI_ALLOW_MOBILE_QA_SEED` in production.

## Commands

```bash
npm install
npm run env:check
npm run prototype
npm run typecheck
npm run ios
npm run android
npm run web
```

`npm run prototype` starts a web-based prototype review mode with mock data and screen navigation. It is for design review only and does not bypass production Clerk/Convex requirements.

## Current connected slice

- language selection and onboarding
- secure email signup, verification and sign-in
- shared Clerk-to-Convex identity bootstrap
- beneficiary home and stable five-tab navigation
- progressive legal-help intake with consent and safety states
- SecureStore save-and-continue-later intake drafts
- idempotent authenticated submission
- beneficiary case list and case timeline
- case-scoped secure text messaging
- private case document upload
- appointment request flow
- outcomes and feedback display
- neutral in-app notifications and synced notification preferences
- Expo push token registration
- Convex-backed Expo push delivery and receipt polling
- learning-centre, saved guides, and offline reading foundations
- SecureStore pending-action queue for case messages, appointment requests, review requests, and feedback
- profile, privacy/security, support, and about screens
- SARA mobile assistant with structured paralegal recommendation cards
- paralegal finder
- prototype review mode for walking through implemented mobile screens without live auth

## Deliberately incomplete

- phone authentication and account recovery UX
- governed legal knowledge publishing
- SARA source/citation display
- verified emergency/hotline contacts
- production app store metadata
- app store screenshots generated from final device builds
- physical-device QA for push notifications, file upload, SecureStore draft/queue size, and platform permissions
- production EAS project ID, push credentials, Clerk production key, and Convex production URL

These are product phases, not mock buttons. Unimplemented actions should not be presented as complete in release builds.

## Release configuration

Native builds use `app.json`, `app.config.js`, and `eas.json`.

Required production values:

- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_EAS_PROJECT_ID`

Local validation commands:

```bash
npm run env:check
npm run typecheck
npx expo config --type public
```

Full repository validation from the parent project:

```bash
npx convex codegen
npx tsc --noEmit
npm run test:security
npm run test:haki-contracts
npm run build
```

Release blockers before preview or production distribution:

- Configure EAS project ID and push credentials.
- Confirm iOS bundle identifier: `org.lsftz.hakiyangu`.
- Confirm Android package: `org.lsftz.hakiyangu`.
- Set `EXPO_PUBLIC_CONVEX_URL` to the intended Convex deployment.
- Set `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` for the matching Clerk instance.
- Verify Clerk JWT template `convex` against the selected Convex deployment.
- Run physical-device QA for push token registration and notification receipts.
- Run physical-device QA for SecureStore intake draft and pending queue persistence.
- Run physical-device QA for document upload on iOS and Android.
- Run physical-device QA for screen-capture protection on intake, SARA, safety, and case detail.
- Confirm emergency/safety copy with LSF before production release.
- Review neutral notification copy with LSF/legal stakeholders.

## Manual device QA checklist

Use at least one iOS device and one Android device. Simulators are not enough for push notifications, SecureStore behavior, native document pickers, and screen-capture protection.

### Authentication and identity

- Fresh install opens onboarding.
- Sign in with Clerk development account.
- Sign out and sign back in.
- Convex user profile is created or synced.
- Deactivated account cannot silently restore.

### Intake and drafts

- Start a legal-help intake.
- Save draft for later.
- Force-close and reopen the app.
- Restore draft.
- Submit intake with consent.
- Confirm duplicate taps do not create duplicate help requests.

### Case operations

- Open the created case.
- Send a case message online.
- Turn network off and send a case message; confirm it enters pending sync.
- Restore network and use "Try syncing now"; confirm the message sends once.
- Request appointment online and offline.
- Submit case review request online and offline.
- Submit feedback after an outcome is recorded.

### Documents

- Upload JPG, PNG, PDF, and DOC/DOCX under 10 MB.
- Confirm rejected file types are blocked.
- Confirm large files are rejected.
- Confirm uploaded documents appear as pending review.
- Confirm staff/provider review changes document status.

### Push notifications

- Accept notification permissions.
- Confirm Expo push token registration.
- Trigger case status, assignment, appointment, message, review, and feedback notifications.
- Confirm notification receipts are recorded by Convex.
- Confirm notification preferences suppress disabled categories.

### Privacy and safety

- Confirm screen capture is blocked or app-switcher content is obscured on intake, SARA, safety, and case detail where platform support allows it.
- Confirm Quick Exit appears on safety-sensitive flows.
- Confirm saved resources are stored and still visible offline.
- Confirm pending queue data is cleared after successful sync.
- Confirm no sensitive case content appears in notification body copy.

### Offline mode

- Open saved guides with network off.
- Confirm pending sync count appears on Offline screen.
- Confirm SARA and document uploads clearly require connection.
- Confirm the app does not claim emergency-service capability.

## Security status

Clerk Expo is pinned outside the disclosed authorization-bypass advisory range. Current npm audit output still reports Expo/Metro/React Native toolchain advisories whose proposed automatic fix is an incompatible Expo downgrade. Do not run `npm audit fix --force`; review compatible upstream patches when Expo publishes them.
