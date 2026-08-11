# Case Documents And Review Phase

## What changed

This phase adds the private case-document foundation needed for evidence, IDs, contracts, letters, receipts, and other case files.

Backend:

- Added `case_documents` table.
- Added case-scoped upload URL generation.
- Added document registration after Convex Storage upload.
- Added document listing for case participants/workers.
- Added worker review with `accepted` and `rejected` states.
- Added audit entries and worker-only case events for uploaded/reviewed documents.
- Enforced allowed MIME types and 10MB case-document size limit.

Provider web workspace:

- Added `Documents` tab to the provider/paralegal case workspace.
- Shows uploaded documents, category, size, note, and review status.
- Allows case workers to open, accept, or reject pending documents.

Mobile:

- Added `Docs` tab to mobile case detail.
- Shows attached documents and review status.
- Added native file picking with `expo-document-picker`.
- Uploads selected files to Convex Storage.
- Registers uploaded files with `caseManagement.addDocument`.
- Lets beneficiaries choose a document category and optional note.
- New uploads appear as `pending_review`.

## Dependency

Installed:

```bash
npx expo install expo-document-picker
```

Installed SDK-compatible package:

- `expo-document-picker@57.0.1`

## Upload flow

Implemented mobile flow:

1. Pick a file on device.
2. Request `caseManagement.generateDocumentUploadUrl`.
3. POST the file to Convex Storage.
4. Call `caseManagement.addDocument`.
5. Show the document as `pending_review`.

## Next step

Add staff-side document review to the staff operations dashboard so LSF staff can review documents even before provider assignment.
