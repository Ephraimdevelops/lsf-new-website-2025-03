# Mobile Offline Pending Action Queue

## What changed

- Added a SecureStore-backed pending action queue for sensitive mobile case actions.
- Case messages, appointment requests, case review requests, and feedback can be queued when a likely network failure happens.
- Case detail shows pending sync items for the current case and provides a manual retry button.
- Offline mode shows total pending sync count and recent queued actions.
- Queued messages keep a stable client message ID so retries remain idempotent.

## What is not queued

- Document uploads are still online-only. The app does not currently store file blobs securely for later upload.
- New intake submission still requires backend calls, although drafts can be saved securely on-device.
- SARA answers still require network access.

## Security boundary

- Queue storage uses Expo SecureStore with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`.
- The queue is capped at 25 actions to avoid unbounded sensitive local storage.
- Only likely network failures are queued. Validation and permission errors are surfaced immediately.

## Product reason

Users with unstable connectivity should not lose carefully typed case messages or feedback. This gives the prototype a credible offline behavior without pretending the whole legal-help workflow can run offline.
