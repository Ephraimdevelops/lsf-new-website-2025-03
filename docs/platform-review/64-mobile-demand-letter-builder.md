# 64. Mobile demand-letter builder

## What changed

- Added a native mobile `letter-builder` screen.
- Added a home entry point under quick tools.
- Added a demand-letter guide CTA that opens the builder.
- The builder creates a bilingual plain-language draft from:
  - sender name
  - recipient name
  - issue summary
  - requested action
  - response deadline
- Users can export through the device share sheet or move into intake for human help.
- Users can save and delete an encrypted local draft using Expo SecureStore.
- Signed-in users can explicitly select a case and attach the draft as a pending case document.

## Product reason

The reference Haki Yangu direction includes practical document tools, not just articles. A demand-letter builder is a high-utility first tool because it supports unpaid salary, consumer complaints, contract disputes, and some land/payment issues.

This is intentionally offline-capable and local-first. It does not require a case, file upload, or backend write before the user can create a draft.

## Guardrails

- The screen frames the output as a draft to review, not legal advice.
- The app asks users to request help for risky or complex matters.
- No generated letter content is sent to Convex unless the user chooses to start intake separately.
- Local drafts use `SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY` and can be explicitly deleted from the builder screen.
- Case attachment requires explicit case selection and consent copy explaining that the draft will be shared with the case team.
- No new third-party document generation service was added.

## Remaining product work

- Add more templates: payment request, landlord/tenant issue, child support, and consumer complaint.
- Add document checker support for uploaded contracts and letters.
