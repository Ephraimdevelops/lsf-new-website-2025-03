# Mobile Environment Preflight

## What changed

- Created an ignored `mobile/.env.local` file from safe parent development values.
- Added `npm run env:check` to the mobile app.
- Added `mobile/scripts/check-env.mjs` to verify local device-test readiness without printing secrets.
- Added an in-app configuration guard that lists public environment key status without printing values.

## Current state

- `EXPO_PUBLIC_CONVEX_URL`: set.
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: missing.
- `EXPO_PUBLIC_EAS_PROJECT_ID`: missing optional local value, required for push/release.

## Why Clerk remains missing

The parent `.env.local` has a Clerk value, but the mobile config intentionally only reuses a development `pk_test_` key. The current parent value did not pass that mobile-safe reuse rule, so the mobile app still needs an explicit Clerk publishable key.

## Next action

Add the matching Clerk publishable key to `mobile/.env.local`:

```text
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Then run:

```bash
cd mobile
npm run env:check
npx expo start --localhost
```

Use a physical device for QR testing after the checker passes.

## In-app diagnostic guard

If a tester opens the app before required public values are set, the root app shell now shows:

- `EXPO_PUBLIC_CONVEX_URL`: set or missing.
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: set or missing.
- `EXPO_PUBLIC_EAS_PROJECT_ID`: set or optional.

The guard blocks Clerk and Convex initialization until required config is valid and points the tester to:

```bash
cd mobile
npm run env:check
```

It does not display actual key values.
