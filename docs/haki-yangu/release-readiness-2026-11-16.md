# Development checkpoint and release readiness — 16 November 2026

Recommendation: prepare a reviewed development checkpoint and a controlled preview for Richard. Hold the full production promotion pending the concrete gates below. This audit did not commit, push, merge or change production.

## Confirmed repository state

Snapshot before this audit file was created:

- Branch: `dev/haki-yangu-v2`, HEAD `cae4dca`.
- GitHub development branch: `a8044b2`, verified with a read-only remote lookup. One local commit is unpushed.
- Local/GitHub main: `4d9c428`. Development is six commits ahead of this main, in addition to its uncommitted work.
- 67 tracked files modified and 121 untracked files. Changed areas include backend/schema, mobile, web, scripts and documentation. A successful push of the existing commit alone would not include this uncommitted work.
- No repository `.github` workflow directory and no local `.vercel/project.json` linkage were found. `vercel.json` specifies SPA rewrites only. These facts do not identify the hosting project's production branch, automatic deployment behavior or hosted environment settings.
- The redesigned homepage route is `/new-homepage03`. `/` currently remains a separate Index route. A production decision about the homepage is still required.

## Current verification evidence

- Latest AI work: 161 targeted tests passed, web/mobile type checks and web build passed. This is scoped validation, not whole-project release acceptance.
- Fresh broader contract check: 81 passed, 1 failed. The failure expects `Choose case` in the mobile appointment surface. Determine whether the current selector behavior is correct and whether the test or UI needs correction; do not silence the check to manufacture a pass.
- Fresh local release preflight: shared web/mobile Convex and Clerk pairing, EAS ID and package identifiers passed. The production Clerk key check is OPEN. This reports local configuration only; remote production configuration has not been inspected.
- Source data is in the development deployment. A Git push does not transfer source files, embeddings, review decisions, directory data, users or roles into another Convex deployment.

## What can be prepared now

Engineering can continue AI/retrieval regressions, chat memory, voice-note quality, admin handover checks and operational configuration/monitoring checks. Website preview and mobile build preparation can also proceed once intended hosting/EAS access is confirmed.

Required external inputs or decisions:

1. Richard's exact Facebook testing account and WhatsApp recipient number, followed by any required account acceptance or recipient verification.
2. LSF review of legal/language accuracy and provider credentials, contacts and actual availability. Private research entries must not be promoted as verified public providers.
3. Confirmed preview/production hosting project, production branch and domains, live authentication/backend pairing, mobile build access and the approved homepage choice. Actual production settings must be verified rather than inferred from local configuration.

## Development checkpoint preparation

1. Review and group the existing changes: AI/messaging backend; AI and resource management web UI; mobile hierarchy and chat UI; tests and scripts; shareable documentation.
2. Keep secrets, local account/session details, real-message test evidence, private review exports and personal-contact research out of a public code push. Existing ignore rules protect local environment files, but do not automatically protect every newly generated research/evidence file. Review visibility and contents before staging.
3. Resolve the appointment contract failure with a meaningful behavior check, then run the required whole-release checks appropriate to the packaged changes.
4. Verify the hosting provider's branch/deployment configuration before pushing; a development branch name alone is not proof that production cannot auto-deploy.
5. Create reviewable commits, push the reviewed development branch, and provide a controlled preview and internal mobile build. Keep a known rollback revision.

## Production promotion gates

- The reviewed release contents and required checks pass.
- Preview and native role-based journeys are demonstrated using the intended accounts.
- Production Clerk/Convex/hosting/EAS configuration and admin identities are verified.
- Approved knowledge/directory data has an explicit migration manifest, with confidential, draft and QA records excluded from public matching.
- Meta callbacks, credentials, permitted access and channel ownership are configured for one authoritative sending backend. Development and production must not both reply for the same live LSF account.
- Public Messenger access and a real WhatsApp business-number setup are resolved; the current WhatsApp test recipient setup is not a public launch.
- Instagram authorization and a real incoming/outgoing test are completed if Instagram is included in the launch scope.
- A cutover and rollback plan is reviewed with the LSF owner, then production promotion occurs as a separate explicit action.

## Checkpoint preparation follow-up

The initial repository/test snapshot above is retained as an audit of the starting state. During preparation, the stale appointment-label contract was updated to check the current selector, actual case options and invalid-selection guard. Full regression execution also revealed obsolete typography mocks, an incomplete memory-table fixture, old AI disclosure/tool-count expectations and sandbox-only scanner port restrictions. These were corrected without removing the relevant ownership, retry, consent or recording-lifecycle checks. The full suite then passed **692/692**.

Three implementation commits package the AI/backend, web and mobile work. Local private review artifacts are excluded from public Git tracking, and the original working files have a local ignored backup.

The user then signed into Vercel. Its current Environments page confirmed **main** as production, with **all unassigned branches** using Preview. The Vite build has no custom backend-deploy command. Public development Convex/Clerk overrides were saved only for the **dev/haki-yangu-v2** preview branch. No homepage, production domain, production variable, production backend or Meta channel callback was changed by these preparations.

See `development-checkpoint-2026-11-16.md` for the packaged contents. Actual push and preview deployment verification are recorded separately after execution.
