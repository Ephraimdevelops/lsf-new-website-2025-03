# Haki Yangu upload launch gates

## Actual Status

The code is implemented and locally verified, not cleared for production launch.
An existing `convex dev` watcher is deploying edits automatically to development
deployment `joyous-spaniel-5`. The new `/secure-upload` OPTIONS route responds 204.
An isolated Vercel scanner project, `haki-yangu-private-scanner-dev`, is configured
with development-only secrets and the authenticated Convex fetch transport.
Synthetic hosted rehearsals passed all eight upload purposes, a 16 MiB AI-source
fixture, cross-owner/cross-case denial, replay denial and EICAR rejection. The
environment report records the latest run; this is not a signed-in mobile UI test.
The latest lazy-initialization container was also rehearsed successfully:
`dpl_79hKLPAhXELaAxTDMzxTcJR4cKUY`, immutable image digest
`sha256:54e43d7e45e20b3951b6cb5a881c6a359e89b377f6d4cf0096e34d12426093d1`.
No live website or production Convex deployment was performed. Do not disable
scan enforcement to make the upload UI pass.

Development metadata confirms twelve upload-control handlers are internal-only
with the expected types. Production schema dry-run validation passed, but public
API changes are incompatible with some callers in the live website's September 9
commit. Backend-only promotion is not cleared. See
`backend-signature-review-2026-10-08.json` and the remaining gates below.

### Hosting Target Discovery

On 2026-10-08, the signed-in Vercel dashboard identified the existing project as
`ephraim-ngowis-projects/lsf-new-website-2025-03`, serving `lsftz.org` from `main`.
Its `VITE_CONVEX_URL` is configured for all environments as
`https://dusty-ox-781.convex.cloud`. A read-only function metadata check confirmed
that backend is accessible with the existing CLI credentials and has no
`managedUploads` handlers. This is distinct from development `joyous-spaniel-5`;
no production code or environment settings were changed during discovery.

The user selected Vercel and Convex for hosting. Current Vercel documentation
supports container-image functions in beta, but the same 4.5 MB request payload
limit applies. The new Vercel transport uses temporary quarantine with
authenticated, bounded fetches and clean-only promotion, avoiding large scanner
request bodies without reducing evidence limits. Its source is fixed to the
development Convex endpoint; callers cannot supply arbitrary fetch URLs.
Vercel preview/production backend settings must also be reviewed and separated
before preview upload tests can be considered isolated from live data.

References: https://vercel.com/docs/functions/container-images and
https://vercel.com/docs/functions/limitations.

### Isolated Website Test Release

The user approved separate testing before any coordinated live release. The
isolated Vercel project `haki-yangu-web-test`
(`prj_Xl2OyvCO1725EU6rOAow0UG1l7nT`) now serves
`https://haki-yangu-web-test.vercel.app`. Deployment
`dpl_9BCZp1F5PRVzTK6UyeWBGUVffPUQ` is ready. Vercel calls the stable alias
"production" within this test-only project; it does not serve `lsftz.org` or use
the live production backend.

Only the built static website was uploaded from an isolated temporary staging
directory, using the existing development Convex URL and Clerk test key. Build
inspection rejected the live Convex URL, source maps, private research paths and
private credential markers. Environment files and the old public placeholder
webhook are excluded. The superseded deployment containing that placeholder was
removed; the current build deploys no webhook function. This project's deployment
metadata lists Vercel authentication protection; it was not disabled.

The web production build, web/backend TypeScript checks and all 192 regression
tests passed. The deployed Haki Yangu entry, service directory and request-help
form rendered without captured browser console errors. The request-help route
returned HTTP 200 through the CLI's authenticated deployment-protection access.
The service directory showed an honest empty verified-results state, not seeded
or invented providers. These are signed-out smoke checks, not an authenticated
upload journey or production launch approval. Use only synthetic test evidence.

## Implemented Controls

- Authenticated issuance binds a five-minute, one-use upload capability to the
  database user, purpose and, for case documents/voice/consent, the case ID.
  Only its SHA-256 is stored. Native storage upload URLs are not returned directly.
- The gateway bounds actual body bytes, checks format signatures, reserves the
  scan budget before external processing, and requires a clean verdict with an
  exact SHA-256 and definitions less than 48 hours old. Failed, encrypted,
  oversized, uninspectable or malicious files never receive a clean receipt.
- Raw self-hosted transport scans in memory. Vercel fetch transport temporarily
  stores untrusted bytes behind an internal quarantine record, uses a two-minute
  single-use fetch capability, and promotes the same object only after an exact
  clean verdict. Rejected/failed files are deleted; a fifteen-minute bounded cron
  retries cleanup failures. No public query exposes quarantine file URLs.
  Original accepted evidence is not recompressed.
- New application, intake, case, voice, consent, profile-photo, media-library and
  AI-source bindings require the exact owner and purpose. Case-scoped receipts
  cannot be attached to another case. Source indexing and research archive
  registration require an owned clean AI-source receipt.
- Public media fields reject private storage IDs and Convex storage URLs. Public
  editors can share clean public-media receipts. Unchanged legacy references are
  preserved; this is not a retrospective scan of existing files.
- Paralegal applications remain PDF/JPEG/PNG, 10 MiB. Intake supports the formats
  already offered in the UI, including Word and UTF-8 text. AI-source/public-media
  uploads are capped at 20 MiB, other purposes at 10 MiB. HTTP platform limits
  still apply; larger originals need a separately designed private ingest path.
- Ticket ownership is rechecked before scan admission and clean completion.
  AI-source/public-media tickets also recheck the platform's active staff/admin
  role rules, so revoked assigned access cannot remain usable through an older
  ticket. Final clean receipts validate hash format and definition freshness.
- A fifteen-minute internal cron terminates stale issued/scanning work in bounded
  batches of at most 100. It prioritizes stalled scans and schedules failed
  temporary-file cleanup. Clean receipts and accepted original evidence are
  preserved; it performs no historical evidence deletion.

## Limits

All account keys are server-derived; browser-supplied client identifiers do not
control these admission buckets. Mutations enforce budgets transactionally.

| Operation | Implemented allowance |
| --- | --- |
| Upload ticket issuance | 30/hour/account across purposes |
| Upload starts | 10/minute/account |
| Scanned bytes, including rejected scans | 100 MiB/day/account; separate staff-only AI-source allowance of 1 GiB/day |
| AI starts | 10/minute and 100/day/account, reserved before provider work; existing monthly budget remains |
| Case text/voice messages | 20/minute/account; acknowledged retries remain idempotent |
| New intake drafts | 10/hour/account |
| Draft saves | 60/minute/account |
| Transcription | Existing 5 starts/10 minutes plus 20/day/account; owned scanned recording required |
| Appointment requests | 5/hour/account |
| Case review requests | 3/hour/account; existing open requests are returned |
| Access requests | 3/hour/account |
| Paralegal applications | 3 committed submissions/hour/account |
| Contact form | 100/hour globally plus 3/hour/email |
| Whistleblower forms | Shared 60/hour global safety budget across both APIs |

Anonymous global/email budgets are supplemental safeguards, not trusted IP limits
or bot protection. Global starvation is a residual risk. A trusted edge/challenge
layer must be configured at the actual host, with sensitive request bodies and
contact values excluded from logs. Failed database mutations roll back counts;
ingress limits are necessary to measure failed or malformed attempts.

## Scanner Verification

`services/private-scanner` has no runtime npm dependencies. Its API runs as a
non-root user on a read-only filesystem, authenticates its caller, limits concurrent
scans, and communicates with ClamAV on an internal network. Port 3310 is not
published. Host API port 8088 is bound only to localhost. Both container images are
pinned to the tested immutable digests. Deploy on amd64 and provide an authenticated
HTTPS reverse proxy, body/time limits, firewall controls and secret management.

The real Docker rehearsal passed clean-file acceptance, matching checksum, fresh
definitions, EICAR rejection and wrong-token refusal. Test containers/networks were
removed afterward. The definitions volume is retained to avoid repeated downloads.
Contract tests additionally cover stale definitions, outages, oversized uploads,
ownership mismatches, ticket reuse, scan admission and storage rollback. Local
tests do not establish availability or authorization correctness on a hosted setup.

## Dependency Triage

35 previously flagged mobile packages are now 29 (7 moderate, 22 high, zero
critical). Compatible patches were applied to xmldom, brace-expansion and
source-map-js. A narrowly scoped query-string override uses decode-uri-component
0.5.0. Expo/React Native were not downgraded.

The decoder's ESM export needs a two-line compatibility patch in the existing
CommonJS query-string 7.1.3 consumer. `mobile/scripts/patch-query-string-decoder.mjs`
applies it idempotently during mobile postinstall and rejects unexpected parser
versions/source. It does not modify the decoder algorithm. Builds using
`--ignore-scripts` must run this hook explicitly. Regression tests exercise valid
deep links and long malformed percent escapes; release-map checks verify the
patch is actually present in shipped parser sources, not just installed locally.

The remaining package flags descend from three advisories: braces, node-forge and
uuid. None is included in the verified iOS, Android or web release JS source maps.
The package-by-package evidence, lockfile/map hashes, build-side precautions and
review deadline are in `mobile-dependency-triage-2026-10-08.json`. This is triage,
not an assertion of zero vulnerabilities. Keep Metro private, CI isolated and
build inputs/signing certificates trusted. Any new direct advisory or affected
package entering a shipped bundle makes the triage script fail.

Primary advisory records:
- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- https://github.com/advisories/GHSA-86w9-cpqp-85rv
- https://github.com/advisories/GHSA-w5hq-g745-h8pq

## Remaining Gates

1. Vercel/Convex targets are identified and development is configured. Provision
   the isolated production scanner with production-specific source/secrets after
   the release compatibility review. Configure host ingress/edge limits.
   Neither scanner credential belongs in Vite or Expo public environment values.
2. Hosted synthetic development gateway checks passed. Still run signed-in
   two-account mobile/web upload journeys, retry/outage UI behavior, and the
   equivalent production smoke checks using synthetic data.
3. Review the actual deployment diff. Development auto-deploy includes other
   concurrent repository edits; do not blindly promote this dirty checkout.
   Coordinate the website/backend release: the old website sends removed
   `syncUser.email` and `ask.history` arguments, while ingestion/testimonial APIs
   now require reviewed metadata or clean upload receipts. Do not restore unsafe
   role assignment, public email sending or unscanned uploads for compatibility.
4. Record release-owner acceptance of the three build-tool advisory exposures
   and upstream monitoring. Production deployment and verification remain open.
5. Existing legacy files have no clean ownership receipts. New bindings reject
   them. A historical rescan/backfill must use trusted existing relationships,
   not arbitrary caller claims, and must not mass-delete original evidence.

Separate security work still required for revocable private download delivery:
authenticated queries currently return storage bearer URLs. Those URLs are not
made private merely by disabling the mobile image cache. Convex documents this
limitation at https://docs.convex.dev/file-storage/serve-files. Failed temporary
quarantine files are cleaned; receipt retention and unbound-clean-file deletion
still need an approved retention policy.

## Repeatable Checks

Verified in this implementation pass: 192/192 repository contract/security tests,
backend and mobile TypeScript checks, public-asset/auth-route/378-function security
checks, real pinned-image ClamAV rehearsal, and iOS/Android/web release JS exports.
The website production build also passed; it was not deployed to the live domain.
The final dependency report verifies decoder interop in all three source maps.
The development environment report includes hosted synthetic cross-owner/case,
replay and malware checks, not authenticated UI journeys. Production deployment
and production runtime verification are not counted as passed.

From the repository root:

```sh
node --experimental-strip-types --test --test-reporter ./scripts/test-support/concise-reporter.mjs scripts/*.test.mjs
node scripts/check-convex-security.mjs
npx tsc --noEmit -p convex/tsconfig.json
node scripts/private-scanner-live-check.mjs
node scripts/upload-launch-check.mjs docs/haki-yangu/upload-launch-environment-2026-10-08.json
node scripts/mobile-dependency-triage.mjs /path/to/all-platform-release-export docs/haki-yangu/mobile-dependency-triage-2026-10-08.json
```

The upload launch check exits nonzero if development scanner configuration or
hosted verification fails. It prints/saves no secret values. The dependency
check requires source maps for all three platforms; never publish those maps as
public production assets.
