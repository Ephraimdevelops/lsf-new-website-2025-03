# 65. Mobile document checker

## What changed

- Added a native mobile `document-checker` screen.
- Added a home quick-tool entry point.
- Users can select a PDF, image, or Word document from the device.
- The screen provides:
  - pre-signing checklist
  - red-flag checklist
  - path to request document review help
  - path to the demand-letter builder
- Signed-in users can explicitly select a case and upload the selected document for review.

## Product reason

The reference Haki Yangu direction includes “Before you sign” and document-checker flows. This first implementation gives users practical protection before they sign or pay, without pretending to perform legal analysis or OCR.

## Guardrails

- There is no silent upload. The selected document remains on the device unless the user starts a help request or later attaches it to a case.
- `copyToCacheDirectory` is disabled for the picker to reduce unnecessary local copies.
- Case attachment requires explicit case selection and consent copy explaining that the file will be shared with the case team.
- The checklist is guidance, not a legal opinion.
- The escalation path goes through the governed intake flow.

## Remaining product work

- Add OCR/document text extraction only after privacy, retention, and legal-review policy are defined.
- Add specific checklists for employment contracts, tenancy agreements, land sale agreements, and loan/payment documents.
