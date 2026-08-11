# Mobile Safety Plan Phase

## What changed

Added a dedicated safety-planning flow for Haki Yangu mobile.

Implemented:

- `mobile/app/safety.tsx`
- Stack route registration for `/safety`
- Direct safety entry from the Get Help tab
- Immediate-danger boundary copy
- Quick safety plan checklist
- Privacy/device safety guidance
- CTAs back into intake and rights guidance

## Product decision

No hotline numbers are hardcoded in this phase. The app gives safety planning guidance and tells users to contact nearby official emergency services, police, health facilities, or trusted people.

Hotline numbers should only be added after source verification, jurisdiction review, and maintenance ownership are agreed.

## Remaining

- Verified Tanzania emergency and GBV/support contacts.
- Optional private trusted-contact storage.
- Fast-exit behavior for high-risk pages.
- Safety plan localization review with domain experts.
