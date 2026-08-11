# Mobile Local Run Smoke Test

## Result

The Expo mobile app can start Metro locally and can bundle for iOS export.

## Commands run

```bash
npm run env:check
npx expo config --type public
EXPO_NO_TELEMETRY=1 npx expo start --port 8083 --localhost --clear
EXPO_NO_TELEMETRY=1 npx expo export --platform ios --output-dir /tmp/haki-yangu-ios-export
```

## Evidence

- Expo config resolved successfully.
- Metro started on `http://localhost:8083`.
- iOS export bundled `node_modules/expo-router/entry.js`.
- Export compiled `1442` modules.
- Export wrote output to `/tmp/haki-yangu-ios-export`.

## Environment state

- Mobile `.env.local` is missing.
- Parent `.env.local` provides `VITE_CONVEX_URL` and `VITE_CLERK_PUBLISHABLE_KEY`.
- `app.config.js` can reuse the parent Convex URL.
- Mobile-specific `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and `EXPO_PUBLIC_EAS_PROJECT_ID` remain unset.
- A local `mobile/.env.local` was later created with Convex set, but Clerk remains missing because the parent Clerk key is not a reusable `pk_test_` mobile development key.
- `npm run env:check` is now the preflight for QR/device testing and currently fails until a Clerk publishable key is added.

## Limits

- Direct sandbox `curl` checks to the escalated Metro process could not connect even while `lsof` showed the process listening. The deterministic `expo export` compile was used as the bundle proof.
- No physical phone was connected in this run.
- Push notification, document picker, SecureStore persistence, and screen-capture behavior still require physical-device QA.

## Next step

Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to `mobile/.env.local`, optionally add `EXPO_PUBLIC_EAS_PROJECT_ID`, then run Expo with a physical iOS and Android device.
