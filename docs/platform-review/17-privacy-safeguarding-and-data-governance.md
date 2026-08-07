# Privacy, Safeguarding and Data Governance

This is an architecture baseline, not a substitute for Tanzanian counsel, LSF safeguarding policy or a formal data-protection impact assessment.

## Data classes

Public content; account/contact data; legal-service confidential data; highly restricted safeguarding/GBV/child/whistleblower data; operational metadata; de-identified reporting. Each field has purpose, lawful/approved basis, owner, recipients, retention, deletion method and export rule.

## Consent model

Record policy/version/language/time/channel/actor for terms/privacy, private-data processing, separate referral sharing, sensitive information, optional AI processing, optional analytics and communications. Withdrawal affects future processing but does not erase legally required/audited history. Assisted/guardian consent requires policy-specific evidence.

## Access and safeguarding

- Default deny; case access is participant/active assignment/organisation scope, with field-level restricted flags.
- Whistleblower identities and GBV/child records use specialist groups; anonymity is preserved from normal admins/staff where possible.
- Break-glass access requires reason, short duration, alert and review.
- Every sensitive view, export, download, role change and reassignment is logged and reviewed.
- Safeguarding rules are deterministic and configurable; AI can flag but cannot close or silently route a matter.

## Retention and user rights

Approve a retention schedule per record type before launch. Implement account deletion request, data export, correction, consent history, attachment purge, legal hold and de-identification. “Delete chat” must define whether messages are immediately removed, soft-deleted or retained for safety/legal obligations. Backups need expiry and tested restoration/deletion behavior.

## Notification and session safety

Push/email/SMS avoid issue type, allegations, party names and document names. Sensitive screens require recent authentication, block accidental screenshots where platform/policy justifies it, expire after inactivity and hide previews. Device loss revokes tokens. Shared-device sign-out purges local private data.

## Third parties

Maintain a processor register and data-flow record for Clerk, Convex, OpenAI/n8n, Resend, Sentry, Vercel and future push/SMS providers. Approve regions, sub-processors, retention, training/data-use settings, breach terms and deletion verification. Do not send case text to analytics or error logs.

## Required governance artifacts

Data-protection impact assessment; records of processing; safeguarding escalation procedure; breach response; access-review schedule; retention/deletion schedule; AI acceptable-use and evaluation policy; content approval policy; vendor register; incident contact tree; beneficiary-facing privacy/consent copy in Swahili and English.
