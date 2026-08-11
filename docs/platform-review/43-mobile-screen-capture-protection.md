# 43. Mobile screen-capture and app-switcher privacy

## What changed

- Installed `expo-screen-capture` using the Expo SDK 57 resolver.
- Added `mobile/src/useSensitiveScreenProtection.ts` as a reusable protection hook.
- Applied the hook to sensitive Haki Yangu flows:
  - guided intake
  - SARA assistant
  - safety plan
  - case detail, including messages, appointments, documents, and feedback

## Product reason

These screens can expose legal issues, identity details, safety concerns, documents, and private chat content. The app should reduce accidental exposure through screenshots, screen recordings, and app-switcher previews.

## Platform behavior

- Android: `expo-screen-capture` uses the secure window flag to block screen capture and hide recent-apps previews.
- iOS: screen capture prevention is enabled where supported, and app-switcher blur is enabled while sensitive screens are mounted.
- Unsupported runtimes fail closed for the user experience: protection errors are swallowed so a legal-aid flow does not crash.

## Limits

- This is a privacy hardening layer, not a replacement for device security, trusted-device guidance, or caseworker safety protocols.
- Physical-device QA is still required on iOS and Android to confirm screenshot, recording, and app-switcher behavior.
- The current quick-exit button does not erase locally saved drafts or SARA history; that remains intentional but should be reviewed with LSF’s safety policy.

## Verification

- `mobile npm run typecheck` passed after adding the hook.
