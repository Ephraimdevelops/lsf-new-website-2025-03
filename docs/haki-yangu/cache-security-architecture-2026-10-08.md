# Haki Yangu: caching, limits and private media

## Status

Update: the later implementation and actual development deployment status are
recorded in `upload-launch-security-2026-10-08.md`. That record supersedes the
upload ownership/scanning and 35-finding status below. Private revocable downloads,
trusted edge limits and historical-file rescanning remain separate launch work.

This is an implementation record plus a production architecture proposal, not a
claim that the whole platform has been security audited or deployed. Changes in
this pass are local source changes; backend deployment is separate.

Implemented in this pass:

- Paralegal application limits use the authenticated database user ID, not the
  caller's optional `clientIdentifier`: three committed submissions per hour.
- Paralegal document upload URL issuance has a separate 20/hour/account budget.
  This accommodates three required/optional documents and retries. Enforcement
  uses the existing indexed `rate_limits` table inside the mutation transaction.
- Application attachment metadata permits only exact PDF/JPEG/PNG MIME types,
  rejects zero-byte files, and retains the existing 10MB ceiling. Metadata checks
  are not content inspection or proof of upload ownership.
- Offline case actions are stored under collision-free, authenticated-owner keys
  in native SecureStore, with device-only accessibility. Guests cannot queue
  actions. Ownerless legacy queues are not adopted or replayed under a new user.
  Legacy data remains untouched because its owner cannot be safely inferred.
- Queue writes are serialized per owner within this JS runtime. The 25-item cap
  rejects new work instead of silently evicting older unsent work. Error receipts
  store a generic sync failure rather than arbitrary backend error text.
  Case forms retain their entered text and show a localized notice if saving
  fails or capacity is exhausted, rather than clearing an unsaved action.
- Queue UI hides another owner's snapshot immediately on account changes.
  Backend case authorization still applies to every replayed action.
- ProviderThumbnail remote image caching defaults to `none`. Only photos from
  the approved public directory query explicitly opt into disk caching. Profile
  URLs supplied through route parameters do not opt in. Recycling keys prevent
  an old thumbnail remaining while the next URL loads.
- Paralegal search uses the existing new object artwork for no-results state;
  no additional image bytes are added. Privacy copy no longer claims that local
  preparation-checklist bookmarks in AsyncStorage are encrypted.
- The mobile lockfile updates only `shell-quote` from 1.10.0 to 1.12.0 within
  its existing parent dependency's compatible range. The read-only npm audit
  initially reported 36 affected packages (10 moderate, 25 high, 1 critical);
  after the patch it reports 35 (10 moderate, 25 high, 0 critical). These are
  package-level advisory counts, not 35 independent exploitable app flaws.
  Remaining findings need reachability and compatibility triage; suggested
  forced Expo/React Native downgrades were not applied.

## Cache Boundaries

| Data | Current / proposed storage | Refresh / invalidation |
| --- | --- | --- |
| Bundled brand artwork and fonts | Current versioned app assets, lossless WebP derivatives | New app/update asset version; never remote prefetch every pose |
| Published directory photos | Current explicit public disk image cache | Use new storage/version URL when photo changes; never repurpose an old public URL for private content |
| Published directory search results | Current live Convex query subscription; no added persistent snapshot | Proposed bounded public-only cache below; contacting/availability remains online |
| Reviewed legal guides | Current online queries; bundled checklists remain explicitly unreviewed | Proposed offline opt-in with revision and review date; revoked guides need an online revocation check |
| Case history, AI conversations, application documents | Current authenticated backend reads; do not add public persistent query caching | Authorization on each access; no shared CDN or plaintext localStorage |
| Intake drafts and pending case actions | Current explicit native SecureStore saves, owner-scoped | Keep pending work until acknowledged or explicitly discarded; do not silently expire it |
| Checklist bookmarks and language | Current AsyncStorage, not encrypted | Device preference, not a secure private case store |

### Proposed Public Query Cache (Not Implemented)

Use one allowlisted public projection cache, not a generic cache for arbitrary
Convex responses. Key by schema version, publication revision, locale, resource
kind and canonical filters. Debounce search and cancel obsolete requests; use
pagination before persisting a large directory. Coalesce identical in-flight
requests. Do not persist precise device coordinates or private query text.

Start with a 5MB / 100-entry least-recently-used budget, directory freshness of
5 minutes and maximum offline age of 24 hours. These are proposed product
defaults, not guarantees supplied by the existing image SDK. Show offline and
last-updated status. Cached data must not claim current availability, verification
or permission. Force online refresh before request submission. An expired or
revoked resource must not be silently presented as current legal guidance.

Store guide content only after explicit download, with review date, jurisdiction,
source, publication revision and an expiry/revocation policy agreed by editorial
staff. Stale guide snapshots must be labeled; do not cache individualized AI
legal answers as reusable responses for other users.

Expo Image controls image caching but does not enforce these application-data
TTL/budget rules. On web, browser HTTP caching is separate from native image
cache policy. Private file delivery must enforce HTTP `Cache-Control: no-store`
at the serving layer; a UI prop alone cannot secure a public storage URL.

## Private Upload Architecture (Still Required)

1. Authenticated server issues an upload ticket: owner, purpose, allowed actual
   formats, byte budget, expiry, target entity and use state. Limit issuance and
   cumulative bytes per account; URLs themselves are bearer capabilities.
2. A trusted ingestion service receives the bytes and binds the resulting object
   to that ticket. Do not let an arbitrary authenticated caller claim ownership
   merely by presenting someone else's storage ID after upload.
3. Quarantine originals, inspect signatures/decoded content, scan for malware,
   and preserve checksums and original evidence. Client MIME labels are untrusted.
4. Authorize attachment binding against both ticket ownership and entity access.
   Only safe, purpose-approved objects can become available to reviewers.
5. Serve private documents through authorized, short-lived delivery. Authorizing
   a query that returns a permanent bearer URL is not revocable file security.
   Validate authorization again on downloads, with private/no-store headers.
6. Generate thumbnails/compressed derivatives asynchronously, with independent
   states and idempotent jobs. Never recompress the only copy of legal evidence.
7. Clean up expired tickets and unbound quarantined objects with bounded batches,
   retention policy and auditable deletion. Do not mass-delete existing uploads.

The current paralegal upload flow does not yet prove storage-object ownership or
scan actual content. Its URL limit bounds issuance, not the bytes accepted by an
already-issued upload capability. These remain production security blockers.

## Platform Abuse and Cost Controls (Proposed)

| Operation | Initial proposed limit | Trust boundary |
| --- | --- | --- |
| AI answers | 10 starts/minute/account, one concurrent generation | Server-side admission before provider call; separate daily/monthly token and money budgets |
| Voice transcription | Keep existing 5/minute owner reservation; add minute/audio byte budget | Server checks owner, draft state and actual recording metadata |
| Case messages | 20/minute/account plus case-level anti-spam | Server permission and persistent client message ID deduplication |
| Public forms | Layered global + edge IP/session budgets; challenge on suspicious traffic | Trusted edge derives network identity; never trust browser-supplied client ID |
| Directory queries | Bounded pagination/search length; edge abuse monitoring | Rate limiting reads must not depend on mutating from a Convex query |
| Uploads | Account URL issuance + trusted ingest byte/day budgets | Ticket-bound trusted ingestion, not mobile-side checks alone |

Numbers above require traffic measurement before rollout. Existing anonymous
contact/whistleblower identifiers remain caller-controlled and must be replaced
by trusted ingress controls. Do not accidentally throttle all anonymous people
through one shared bucket. Emergency phone links must remain available even when
AI/form budgets are exhausted.

Use atomic reservations before external AI/transcription calls and finalize
receipts afterward. Failed mutations roll back their database writes, so counting
inside a rejected mutation does not measure repeated failed validation attempts.
Use ingress controls for that abuse surface. Persist idempotency receipts for
every retryable side effect: messages have client IDs, but appointments/reviews/
feedback still need end-to-end replay deduplication before automatic background
sync can safely be promised. Add exponential backoff with jitter and a bounded
retry budget; never retry permission or validation errors as connectivity errors.

## Session, Storage and Operations

- Keep auth tokens in platform secure storage. Do not fall back to plaintext
  localStorage for private drafts/queues on web. Native SecureStore is not a
  large-document store; eventual encrypted offline databases require key
  management, lock/logout behavior, backup policy and explicit device opt-in.
- Account-keyed storage prevents cross-account UI access but does not erase data
  from the device on logout. Offer an explicit, reversible product decision for
  unsent work before device-data removal; do not silently destroy a user's draft.
- Audit remaining device stores, especially the legacy letter-builder draft and
  local profile-cover URI. This pass does not isolate every persistence feature.
- Logs/telemetry should contain operation, opaque actor ID, outcome, duration,
  quota bucket and correlation ID; not stories, filenames, signed URLs or tokens.
- Add storage quotas, retained-byte metrics, alert thresholds, backup/restore
  rehearsal, key rotation and least-privilege worker credentials.
- Run dependency audits and controlled upgrades independently from design work.
  Do not use force upgrades that violate Expo's supported React/native versions.

## Verification and Release Gate

`scripts/mobile-cache-security.test.mjs` covers identity-based limits, anonymous
upload refusal, exact MIME checks, owner isolation, legacy queue non-adoption,
concurrent writes, queue capacity, generic failure receipts and invalid payloads.
Mocks test local contracts, not hosted deployment, OS encryption or edge limits.
The focused 12-test suite, mobile and backend TypeScript checks, and static
Convex security classification check passed. Browser verification confirmed the
paralegal empty-state art loads. No live private upload or role application was
submitted during this pass.

Before production: signed-in device account switching; offline/reconnect replay;
real upload success/cancel/retry; ownership-negative download tests; quarantine
and malware test files in a safe environment; cross-account cache access tests;
revoked guide/photo invalidation; low-memory/performance checks; dependency audit
triage. Deploy only the reviewed backend changes, not unrelated worktree changes.

## References

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Expo Image cache policy](https://docs.expo.dev/versions/v57.0.0/sdk/image/)
- [Convex upload capabilities](https://docs.convex.dev/file-storage/upload-files)
- [Convex transactional mutations](https://docs.convex.dev/functions/mutation-functions)
- [Media compression plan](mobile-media-architecture-2026-10-08.md)
