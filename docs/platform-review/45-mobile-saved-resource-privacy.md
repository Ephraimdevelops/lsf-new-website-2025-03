# 45. Mobile saved-resource privacy

## What changed

- Moved saved guide IDs from AsyncStorage to Expo SecureStore.
- Used device-only, unlocked-device keychain accessibility for saved guide IDs.
- Updated the mobile privacy screen so it accurately explains:
  - explicit intake draft saving
  - secure saved-guide storage
  - case/message/document access boundaries
  - notification privacy behavior

## Product reason

Saved guides can reveal sensitive legal interests, even when the guide content itself is public. For example, saving safety, employment, family, or land guides can expose what kind of issue a person may be facing.

Keeping those IDs in secure device storage is a low-cost privacy improvement and matches the legal-aid threat model better than plain app storage.

## What still uses AsyncStorage

AsyncStorage remains acceptable for lower-sensitivity preferences:

- selected language
- onboarding-complete flag
- local notification category toggles

## Verification

- Mobile `npm run typecheck` passed after the storage change.
