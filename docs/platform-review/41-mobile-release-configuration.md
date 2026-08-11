# Mobile Release Configuration Phase

## What changed

Added explicit Expo/EAS release configuration for the Haki Yangu mobile app.

Implemented:

- `expo-notifications` config plugin in `mobile/app.json`
- Runtime `easProjectId` support in `mobile/app.config.js`
- `EXPO_PUBLIC_EAS_PROJECT_ID` in `mobile/.env.example`
- `mobile/eas.json` with development, preview, and production build profiles
- Updated `mobile/README.md` to reflect the real implemented feature set and remaining release gates

## Product behavior

The app can now receive the EAS project ID through config and use it for Expo push token registration. Native builds have a clear place to provide Convex, Clerk, and EAS values per build profile.

## Remaining

- Fill production EAS environment values.
- Configure iOS/Android push credentials in EAS.
- Physical-device QA for notification permissions, token registration, push delivery, receipts, file upload, and SecureStore draft size.
- Store metadata, screenshots, privacy declarations, and release review.
