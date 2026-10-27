# Mobile Media And Signup

## Implemented

- Account choices use distinct branded objects rather than repeating one avatar.
- Role forms open in a cancellable sheet. Paralegal application has contact, experience and document steps. Choosing a role never grants access.
- Region choices are shared. District suggestions come from published service records; manual entry remains available because the directory is not a complete geographic register.
- Signup document upload uses native file transfer on iOS/Android and XHR on web, with progress, actual-file size checks, upload error feedback and success indicators. Identity evidence is not converted or compressed.
- Existing civic/provider PNG sheets have lossless WebP runtime derivatives. `node scripts/optimize-mobile-assets.mjs` regenerates them and checks every visible pixel and alpha channel against the original. Source PNG files remain recoverable. Only the derivatives are referenced by these runtime components.
- Expo Image handles WebP rendering across platforms. A custom native build needs rebuilding after this dependency addition.

## File Policy

| Content | Original | Delivery derivative |
| --- | --- | --- |
| App illustrations | Keep source PNG | Lossless WebP with alpha |
| Public provider photos | Keep authorized original | Size-specific WebP/JPEG thumbnail |
| ID, certificates, evidence, signed documents | Private, immutable, byte-for-byte original | Optional private page thumbnail; never replace evidence |
| Public product video | Keep master | MP4/H.264 baseline; optional WebM after device support checks |
| Case video/audio evidence | Private original | Optional authorized playback derivative, clearly marked |

WebM is a video container, not an image or PDF compression format. Lossy compression can preserve perceived quality but cannot promise identical pixels or sound. The implemented illustration pipeline is lossless; resizing and video encoding require separate quality acceptance.

## Server Processing Architecture (Not Yet Deployed)

1. Authenticated client requests an upload ticket tied to owner, purpose, expected type and size. Never log document contents or signed URLs.
2. Client uploads directly to private object storage. Commit a receipt only after server-side metadata validation, signature/type detection and ownership checks.
3. Quarantine uploaded media until validation/malware checks finish. Original content gets a digest, owner, retention policy and access rules.
4. An idempotent background job keyed by original digest plus recipe version creates derivatives. Use a bounded worker service for image/video processing, not a synchronous Convex mutation. FFmpeg belongs in this worker, not the mobile bundle.
5. Track `queued`, `processing`, `ready`, `failed` separately from upload state. Processing failure must never remove or block access to a validated original. Retry with backoff and a capped attempt count.
6. Each derivative records original ID, recipe, dimensions, bytes, MIME type and quality-check result. Private derivatives inherit original permissions and use short-lived authorized URLs. Public CDN delivery is only for explicitly public media.
7. Migrate existing records in batches with a dry run, access checks and rollback. Never rewrite existing evidence IDs or silently delete originals.

## Performance Budget

- Only load art relevant to the current screen. Do not bundle FFmpeg, video masters or unused generated variants into the app.
- Measure runtime export bytes, decoded image memory and device rendering separately. Smaller files do not automatically mean smaller decoded bitmaps.
- Existing sprite conversion preserves resolution. A later per-tile export can reduce decoded-memory overhead and enable appropriately sized variants, but must be visually reviewed at 1x/2x/3x before adoption.
- Prefer small stills for role selection and empty states. No automatic video downloads on signup or slow-network flows.

## Outstanding Verification

- Live signed-in identity/certificate upload and application submission on a device; no test application or real identity document was submitted during UI verification.
- Complete, authoritative district/ward registry for dependent location selectors.
- Background media worker, virus scanning, upload-ticket ownership enforcement and existing-upload migration are architecture proposals, not deployed features.

## New Artwork

Built-in ImageGen produced the six-object sprite (support folder, paralegal badge, office, collaboration/report, empty search, question/guide). Prompt: transparent 3x2 sheet, tactile civic objects, burgundy/teal/gold, exact supporting LSF mark, no people, generous safe margins. A second built-in edit removed the background. Runtime asset: `mobile/assets/civic-objects.webp`; generated PNG originals remain in the Codex generated-images folder.
