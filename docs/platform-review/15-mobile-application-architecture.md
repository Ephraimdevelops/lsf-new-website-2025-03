# Mobile Application Architecture

## Stack

Expo + TypeScript + Expo Router, Clerk Expo, Convex React Native, `expo-secure-store` for tokens, SQLite for controlled offline drafts/cache/operation queue, Expo Notifications, i18n message catalogues, Sentry and privacy-minimized analytics. Use TanStack Query only for non-Convex/external cache needs; Convex owns live server state and a small explicit local store owns draft/sync UI state.

## Repository and folders

```text
haki-yangu-mobile/
  app/(public) app/(auth) app/(beneficiary) app/(paralegal)
  src/components src/features src/services src/offline
  src/i18n/{sw,en} src/security src/telemetry
  assets scripts tests
```

Keep `lsf-website` separate. Both consume shared, versioned contracts only after they stabilize.

## Platform configuration

- Application IDs proposed for owner approval: Android `org.lsftz.hakiyangu`; iOS `org.lsftz.hakiyangu`.
- Deep links: `hakiyangu://` plus verified universal/app links under an LSF-owned domain; allow-list routes and never include sensitive query data.
- Clerk redirects have environment-specific allow-lists. Tokens use OS secure storage; no auth tokens in AsyncStorage.
- Device push registration is per user/device/environment, rotated on sign-in/out and revocable remotely.
- Attachments use purpose-bound intents, compression, resumable upload and scan state.
- Feature flags are server-evaluated by role/region/version; no secret or authorization in flags.

## Release process

Separate dev/staging/prod Expo projects, Clerk/Convex deployments, bundle identifiers/signing credentials and telemetry. CI runs type/lint/unit/contract/security/mobile E2E, produces signed preview builds, then staged internal testing, closed pilot, phased rollout and rollback monitoring. Store review includes truthful privacy/data-safety declarations.

## Accessibility and language

Swahili is the source language, English a reviewed translation. Support screen readers, dynamic type, high contrast, reduced motion, large touch targets, clear focus, low-literacy audio where consented and no color-only status. Legal copy and emergency content require named reviewers/version dates.
