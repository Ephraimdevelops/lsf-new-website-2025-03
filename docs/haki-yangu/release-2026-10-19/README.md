# Haki Yangu release control — target 19 October 2026

Prepared 15 October 2026. Status: NOT approved for production. The owner has not yet selected Google Play or Expo/EAS accounts. No store submission or production deployment was made during this preparation.

## Product scope

Promise: find legal help, request support, and follow progress. Kiswahili first, with English support. Public launch depends on a functioning staffed service, not only working screens. Do not advertise guaranteed representation, emergency response, legal outcomes, response times, or assistant accuracy.

Keep the first release focused on directory search, verified educational content, consent-based intake, case progress, messages, documents, and appointments. Saada, maps, audio, and push need their own production acceptance. Do not announce features that fail that acceptance.

## Current evidence

- The 12 failing legacy contract checks were traced to wording changes, quote formatting, direct record queries, extracted referral components, and explicit resolved/unresolved outcomes. Assertions now follow current wiring while preserving backend access checks. All 82 contract tests pass.
- Production mobile configuration rejects local-development fallback, test Clerk keys, missing backend URLs, and invalid EAS UUIDs. EAS tooling and runtime push use the same project identity. Four regression tests cover these boundaries.
- `npm run typecheck` now checks the web application and Node configurations explicitly. The previous root `tsc --noEmit` has an empty files list and does not prove the app was checked.
- Android production profile explicitly requests an app bundle.
- Public `/account-deletion` page provides website and email paths without requiring the mobile app. `/privacy` links to it. This does NOT establish an approved retention policy or complete data-erasure implementation.
- Android JavaScript export succeeded. It is not a signed AAB, native compilation, device installation, or Play approval.

## Release gates and accountability

| Gate | Owner to assign | Evidence needed | Status |
| --- | --- | --- | --- |
| Google Play / Expo ownership | LSF accountable owner | Organisation names, recovery access, verified Play account and production eligibility | BLOCKED: undecided |
| Production auth and backend | Release engineer | Matching live Clerk instance, Convex deployment, JWT issuer, authorised domains and native redirects; login/recovery test | OPEN |
| Android signing and push | Release engineer | EAS project, upload signing credentials, FCM setup, signed AAB and tested push delivery | OPEN |
| Privacy and retention | LSF privacy/legal owner | Approved categories, purposes, processors, retention durations/exceptions, request handling and deletion implementation | BLOCKED: owner/policy needed |
| Store package | Product/design owner | Final listing, assets from release device, declarations, reviewer instructions, verified public URLs | DRAFT |
| Service readiness | LSF operations owner | Real verified directory inventory, staffed queues, escalation roster and agreed service hours | OPEN |
| Device and cross-role acceptance | QA lead | Dated evidence against the same release build | OPEN |
| Production web | Release engineer | HTTPS/domain, direct-route reloads, production sign-in and complete service journey | OPEN |
| Monitoring and recovery | Operations + engineer | Tested alert, rollback/hotfix rehearsal, backup restore evidence, support contact | OPEN |
| Release decision | One named release owner | All required gates closed; exact build/version and evidence signed off | NO-GO |

## Local verification commands

From repository root:

```sh
npm run typecheck
npm run test:release
npm run build
npm run haki:preflight:release
```

From `mobile`:

```sh
npm run typecheck
npm run env:check
npm run release:config
npx expo export --platform android --output-dir /tmp/haki-android-release-export
```

`test:release` includes local-loopback scanner tests. A sandbox port denial is not a scanner assertion failure. Release configuration should fail until actual production values are provided. Syntax checks cannot prove a Convex deployment is production or that a Clerk key belongs to it; verify in the dashboards and with a real session.

After ownership and production configuration are established, link the existing app to the correct EAS project and build `eas build --platform android --profile production`. Preserve `org.lsftz.hakiyangu` unless the accountable owner explicitly changes the identity before first publication. Check the compiled manifest, permissions, native Mapbox loading and supported devices. Do not upload until the release candidate and declarations have passed review.

## Acceptance rehearsal

Use synthetic accounts and data in a controlled environment. Record build version, device/OS, tester, timestamp, outcome, evidence and defect link for each step.

1. New beneficiary installs, chooses language, signs up, verifies email, signs out, recovers password and signs in again.
2. Same user signs into web; identity and own records match mobile.
3. Submit a help request with consent; repeated taps create one request. Draft survives restart only when explicitly saved.
4. Staff triages, assigns a provider; provider accepts and receives only appropriate records. Another beneficiary and unassigned provider are denied access.
5. Send messages, upload allowed documents, reject unsupported/oversized files, record appointment and outcome. User sees progress and can submit feedback.
6. Revoke worker access while a screen is open; access is removed. Verify safeguarding restrictions and donor aggregate suppression.
7. Deny location/microphone/notifications; the main journey remains usable. Test slow network, disconnect/reconnect, force-close, offline queue replay once, and logout cleanup.
8. Test notification opt-in/opt-out, delivery/receipts and neutral lock-screen wording. Verify the intended screen protection on the physical device.
9. Test account deletion on a disposable account; verify role/push revocation, login removal and the disclosed retained records. Rehearse manual data-deletion request handling without real personal data.
10. Test large text, screen reader labels, keyboard focus on web, small Android displays, error recovery and both languages.

## Launch-day operation (EAT)

Before announcing: release owner verifies approval, install URL, production configuration and service roster. QA installs from Play and completes a synthetic request. Operations confirms it reaches the staffed queue. Announce only after this passes.

Suggested monitoring: at launch, after one hour, four hours and the following morning, inspect login failures, intake failures, API errors, crashes, notification failures and unanswered requests. Keep sensitive case text out of analytics. Stop promotion and triage immediately for data exposure, missing requests or widespread sign-in failure. Keep the previous web artifact, maintain backend compatibility, and use a higher-version Android fix; do not assume installed apps can be rolled back instantly.

## Decisions still needed

Choose LSF-controlled Play and Expo ownership; name release, support, safeguarding and privacy owners; approve retention/deletion rules; confirm public domain and monitored support channel; complete real-device QA. Monday availability is conditional on store approval. If approval is pending, communicate the actual web/beta availability rather than claiming a Play launch.

References: [Google publishing controls](https://support.google.com/googleplay/android-developer/answer/9859654?hl=en), [account deletion](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en-EN), [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).

## Final local validation — 15 October

- Complete suite: 302 passed, 0 failed (`npm run test:release`, local ports enabled for scanner fixtures).
- Web explicit project type checks: passed; mobile type check: passed.
- Final web production build: passed; large lazy-loaded Mapbox chunk warning remains.
- Android Hermes JavaScript export: passed at `/tmp/haki-launch-android-2026-10-15`.
- Public deletion route: inspected in local browser while signed out, with visible profile, email, contact and privacy links. No email or deletion was submitted. Desktop preview: `/tmp/haki-account-deletion-preview.jpg`. Physical-device and responsive acceptance remain open.
- Strict release preflight: intentionally FAILS on absent live Clerk and EAS ID in the local environment. Production service dashboards were not accessed.
- No native AAB was compiled, uploaded or signed, and no production deployment was made.

Prior changes in the working tree were preserved. This pass changed release configuration, verification commands and stale contract assertions, added the deletion information route, and prepared release documentation. It does not replace a full product/device acceptance review.
