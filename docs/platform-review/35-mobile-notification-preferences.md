# Mobile Notification Preferences Phase

## What changed

Added user-facing notification controls for the mobile app.

Implemented:

- `mobile/src/useNotificationPreferences.ts`
- `mobile/app/notification-settings.tsx`
- Stack route registration for `/notification-settings`
- Settings entry from the notifications inbox header
- Local preference persistence with AsyncStorage
- Inbox filtering by category

## Categories

- Cases and requests
- Messages
- Appointments
- Documents
- Service notices

## Product behavior

Preferences currently control which notification records appear inside the mobile inbox. Critical safety notices can still be shown in future even if normal categories are disabled.

This is not push-device registration yet. Push delivery still needs Expo Notifications, token registration, backend token storage, delivery jobs, and opt-in permission handling.

## Remaining

- Expo push notification permission flow.
- Device token registration.
- Backend push delivery.
- Server-side honoring of preferences before push delivery.
