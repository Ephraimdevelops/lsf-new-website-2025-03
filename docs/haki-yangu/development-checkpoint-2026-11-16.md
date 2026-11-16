# Development checkpoint — 16 November 2026

This checkpoint packages the current website, mobile and AI work for development review. Production promotion remains separate.

## Contents

- Bilingual AI conversation, editable same-chat memory, grounded legal retrieval and bounded tool execution.
- Meta messaging, consent, requested human support and timed routine resumption. WhatsApp voice processing includes bounded authenticated downloads, validated duration, metering, language hints and unclear-audio handling.
- Clearer resource/source management, service research and support inbox interfaces.
- Mobile beneficiary hierarchy, appointment navigation and chat-memory controls.
- Updated behavioral test fixtures for the current shared typography, appointment selector and memory schema. Existing authorization, duplicate-submission and recording-lifecycle assertions remain active.

Commits prepared before this note:

- `52e1dbc`: AI/backend, messaging and relevant tests.
- `8d12083`: web resource management, chat and support inbox.
- `0e267fb`: mobile journeys, assets and lifecycle test updates.
- The previously unpushed onboarding commit `cae4dca` is included in the development branch history.

## Verification

- Full release regression suite: **692 passed, zero failed**. Scanner tests ran with loopback test-server access.
- Security checks, web type checks, mobile type checks and web production build passed.
- Mobile environment validation is ready for development sign-in. The environment-only EAS project variable is not set locally; the existing app configuration has a project ID. Verify the intended EAS environment before producing a native release.
- Native device acceptance and store submission have not been completed by this checkpoint.
- Homepage components and the homepage route were not changed during checkpoint preparation.

## Verified hosting separation

The signed-in Vercel project lists production branch tracking as **main**, serving the existing LSF domains. Preview tracks all unassigned branches. The build uses the Vite framework defaults, with no custom command that deploys a Convex backend.

Two public client configuration overrides were added only for the **dev/haki-yangu-v2 preview branch**, pointing at the existing matching development Convex and Clerk instance. Production and other branches were not edited. The next development push should create a preview deployment; deployment success and authenticated runtime behavior must be verified afterward.

Do not confuse a Git push, a frontend preview deployment and backend/data migration. Existing RAG documents, embeddings, directory approvals and professional roles remain in their current database deployment until explicitly migrated.

## Private evidence

Local research rosters, actual chat transcripts, account-verification screenshots, backend inventories and internal review drafts are excluded from public Git tracking. The owner’s local evidence remains available. A local ignored working-file archive was also prepared before checkpoint commits.

## Outstanding review inputs

- Independent legal/language approval and current office/paralegal verification.
- Completion of any new WhatsApp test-recipient verification by the recipient.
- Confirmed and accepted app testing roles for additional Messenger reviewers; Page access is not evidence that an app tester invitation succeeded.
- Instagram account authorization and real delivery testing.
- Production identity, backend, data migration, mobile release and channel cutover checks described in the release-readiness audit.

## Preview build correction

The first pushed preview exposed an environment-specific build failure: web imports of pure helpers beneath `mobile/src` caused Vite to resolve `mobile/tsconfig.json`, which extends Expo’s configuration. Expo is intentionally not installed by the web-only project install, so the remote build failed despite local builds succeeding with mobile dependencies present.

The web build now applies its TypeScript transform options after the React plugin’s configuration hook, using the Vite 5 string configuration form that avoids per-file Expo configuration discovery. The mobile configuration and homepage components remain unchanged. A clean archived checkout, with only root web dependencies and no mobile dependencies, reproduced the original failure and passed after this correction. A regression test exercises the resolved Vite configuration against an Expo-dependent helper directory without Expo installed.
