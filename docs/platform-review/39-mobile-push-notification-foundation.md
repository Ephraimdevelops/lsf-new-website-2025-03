# Mobile Push Notification Delivery Phase

## What changed

Added the registration and server-side delivery plumbing required for mobile push notifications.

Implemented:

- Installed `expo-notifications`
- `push_subscriptions` Convex table
- `notification_preferences` Convex table
- `notifications.registerPushToken`
- `notifications.disablePushToken`
- `notifications.getPreferences`
- `notifications.updatePreferences`
- Internal Expo push delivery action
- Internal Expo receipt polling action
- Internal notification payload query
- Internal push delivery attempt recorder
- `push_delivery_attempts` tracking table
- Central `createNotification` helper used by legal-help and case-management domain events
- Mobile EAS project ID config support
- Mobile push permission and Expo token registration hook
- Notification preference sync from mobile to Convex
- Security harness classification for all new notification functions
- Contract test preventing domain notification writes from bypassing the central delivery helper

## Product behavior

When a signed-in user opens the configured mobile app, the app can request notification permission, obtain an Expo push token, and register that token against the authenticated Haki Yangu user.

Notification category preferences are now stored both locally and in Convex for signed-in users.

When legal-help or case-management code creates an in-app notification through the central helper, Convex schedules an internal Expo push delivery action. Delivery uses neutral notification copy and never pushes case descriptions, messages, or other sensitive content.

Delivery attempts are recorded as:

- `sent`: Expo accepted the send request and returned a ticket.
- `receipt_ok`: Expo later confirmed the push receipt.
- `failed`: Expo send or receipt failed.
- `skipped`: user preferences disabled the category or no enabled token exists.

Receipt polling is scheduled after successful ticket creation. Tokens are disabled when Expo reports unrecoverable device/credential errors.

## Remaining

- Production EAS project ID must be present in app config.
- Delivery must be tested on physical iOS and Android devices.
- Production push credentials must be configured during app build/release.
- Notification copy needs final LSF/legal review before production.
