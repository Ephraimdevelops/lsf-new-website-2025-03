# 68. Mobile prototype review mode

## What changed

- Added `EXPO_PUBLIC_PROTOTYPE_MODE=1` support in mobile app config.
- Added `npm run prototype`.
- Added a mock-data prototype navigator covering the key Haki Yangu screens:
  - splash
  - onboarding
  - home dashboard
  - guided intake
  - SARA assistant
  - know-your-rights library
  - resource detail
  - paralegal finder
  - case timeline
  - case chat
  - my documents
  - document checker
  - letter builder
  - appointments
  - notifications
  - offline mode
  - safety plan
  - profile

## Product reason

The live mobile app still needs Clerk mobile configuration before authenticated device QA. Prototype review mode lets LSF, donors, and product stakeholders inspect visual direction, screen coverage, navigation, copy, and information architecture without pretending that production auth is configured.

## Guardrails

- Prototype mode is activated only by `EXPO_PUBLIC_PROTOTYPE_MODE=1`.
- Production configuration still requires Convex URL and Clerk publishable key.
- Prototype screens use mock data and are labelled as prototype review mode.
- This does not replace real device QA, push testing, Clerk sign-in, or Convex workflow testing.

## Remaining product work

- Capture screenshots from this mode for stakeholder review.
- Run real app flows once Clerk mobile key and EAS project ID are configured.
- Replace prototype screenshots with real device screenshots before app store submission.
