# 66. Mobile my-documents library

## What changed

- Added backend `caseManagement.myDocuments`.
- Added mobile `documents` screen.
- Added Home and Profile entry points.
- The screen shows case documents across accessible cases with:
  - file name
  - category
  - size
  - case public ID
  - review status
  - review notes when present
  - link to open the stored document URL
  - text preview for generated letter drafts

## Product reason

The reference Haki Yangu direction includes “My Documents” as a first-class user area. The app already supported case-specific uploads, but beneficiaries had no cross-case document library. That creates friction when users need to find evidence, check review status, or reopen a document after upload.

## Guardrails

- The backend reads only cases owned by the authenticated beneficiary or cases where the user is an active participant.
- Documents are fetched through case IDs already scoped to the user, not by broad public document listing.
- The query is classified in the Convex security gate as authenticated and internally scopes records before returning them.
- The mobile screen does not create new uploads; case upload remains inside the governed case workspace.

## Remaining product work

- Add document filters by category/status.
- Add authenticated conversion from local document-checker selection into a case upload after user consent.
- Add retention and explicit deletion policy once LSF approves document governance.
