# Offline, Low-Data and Assisted Access

## What works offline

- Approved knowledge bundles and saved resources with version/expiry labels.
- Beneficiary intake drafts before submission.
- Paralegal notes/tasks/status intentions explicitly marked unsynced.
- Small attachment metadata queue; large media uploads resume only on suitable connection/user choice.

## Sync protocol

Each queued operation has UUID, actor, entity, base version, payload schema version, creation time, retry count and sensitivity class. Server mutations are idempotent. Non-conflicting field updates merge; status, assignment, referral, consent and safeguarding conflicts require server validation and an explicit user resolution screen. Never silently overwrite a newer case state.

SQLite data is minimized and encrypted where platform support permits; sensitive cached screens re-authenticate after timeout. Sign-out/account removal wipes private local data and queued operations after warning/confirmation. UI always shows Offline, Pending, Synced, Failed or Conflict.

## Data reduction

Text-first lists, cursor pagination, thumbnails, WebP/JPEG compression, deferred audio/video, downloadable content packs, network-aware retries and no background upload of large evidence without consent. Capture original evidence when needed but offer compressed working copies without destroying originals.

## Assisted channels

Paralegals can create a request on behalf of a beneficiary with recorded assisted-access role, beneficiary identity status and consent method. The model supports future WhatsApp adapter, SMS/USSD status/reference lookups, call-centre intake and printable/shareable summaries. These channels call the same services and do not create shadow databases.

## Shared-phone safety

Neutral app switcher/notification text where feasible, optional local app lock, configurable session timeout, hidden sensitive previews, quick exit, no issue type in recent-search UI, and user-controlled offline deletion.
