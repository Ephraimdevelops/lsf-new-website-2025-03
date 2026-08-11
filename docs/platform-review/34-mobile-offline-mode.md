# Mobile Offline Mode Phase

## What changed

Added an offline-mode foundation for Haki Yangu mobile.

Implemented:

- `mobile/app/offline.tsx`
- Stack route registration for `/offline`
- Home dashboard offline entry point
- Profile offline entry point
- Saved-guide display from the existing AsyncStorage-backed saved resources
- Fallback essential guides when the user has not saved anything
- Clear explanation of what still requires connection
- Emergency/safety boundary copy

## Product behavior

The app can show built-in legal guides and saved guide selections without requiring a backend request. This supports the design direction where users can still read rights guidance when connectivity is poor.

The app does not yet queue sensitive actions offline. Case requests, messages, SARA, and document uploads still require network access.

## Remaining

- Network status detection and offline banner.
- Encrypted offline draft queue for intake.
- Pending-sync queue for low-risk actions.
- Conflict handling for case updates after reconnect.
