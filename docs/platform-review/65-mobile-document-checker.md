# 65. Mobile document checker

## What changed

- Added a native mobile `document-checker` screen.
- Added a home quick-tool entry point.
- Users can capture a photo or select a PDF, JPEG, PNG or WebP up to 10 MB.
- The screen provides:
  - pre-signing checklist
  - red-flag checklist
  - path to request document review help
  - private cloud saving and optional AI brief
- Signed-in users can explicitly select a case and upload the selected document for review.

## Product reason

The tool's primary workflow is capture, save, and understand a document. The pre-signing checklist remains a secondary aid. An optional AI description is not legal approval or advice.

## Guardrails

- There is no silent upload. The selected document remains on the device until the user explicitly saves it to their account or shares it with a case.
- `copyToCacheDirectory` is enabled so uploads can read the file. Account changes clear in-memory selection and upload receipts.
- Case attachment requires explicit case selection and consent copy explaining that the file will be shared with the case team.
- The checklist is guidance, not a legal opinion.
- The escalation path goes through the governed intake flow.

## Remaining product work

- Before production: verify authenticated mobile save/open/AI journeys, Kiswahili brief quality, retention/deletion policy, download-link lifecycle, and privacy review of external AI processing.
- Add specific checklists for employment contracts, tenancy agreements, land sale agreements, and loan/payment documents.

## Development Extension (2026-10-09)

- `personal_documents` are separate from shared case documents and the public legal-source corpus. Saved shows both personal and scoped case documents.
- `personal_document` uploads use the existing one-use, owner-bound malware-scanning gateway. MIME type and size come from the clean receipt. Save retries are idempotent.
- Listing, opening and AI reservation require an active authenticated owner. Private files are never indexed as public AI sources.
- The user separately agrees to send a file to OpenAI. PDF text or readable photos receive a brief description; image-only PDFs require a clear photo instead.
- Provider response storage is disabled. The short brief is saved in the owner's document record.
- Limits: ten AI reservations per owner per hour, 50,000 PDF text characters, 600 output tokens, 45-second API timeout, no automatic retries.
- Know Your Rights has its own `/rights` route; Saved remains a saved-items destination.
- Backend functions are synced to development, not production.
