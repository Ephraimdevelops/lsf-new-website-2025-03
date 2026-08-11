# Mobile Secure Intake Drafts Phase

## What changed

Added explicit save-and-continue-later support for guided intake.

Implemented:

- SecureStore-backed local intake draft persistence
- `saveDraftForLater`
- `restoreSavedDraft`
- `clearSavedDraft`
- Intake screen save button
- Intake screen restore prompt
- Submission clears any saved local draft

## Product behavior

Users can save an incomplete intake draft on the device and restore it later. The draft is stored with Expo SecureStore rather than plain AsyncStorage because intake content may be sensitive.

This is intentionally user-triggered. The app does not silently persist every keystroke of sensitive legal facts.

## Remaining

- Cross-device server draft recovery is still handled by authenticated backend draft saving at submit time, not autosync.
- SecureStore size limits should be tested on target devices with very long descriptions.
- A future encrypted offline queue may be needed for low-connectivity field use.
