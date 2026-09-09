# Mobile Production Private States

Date: 2026-09-09

## What Changed

Private beneficiary mobile screens no longer substitute demo records when real backend data is unavailable:

- My Cases now shows a sign-in prompt, loading state, real case list, or real empty state.
- My Documents now shows a sign-in prompt, loading state, real document list, or real empty state.
- Notifications now shows a sign-in prompt, loading state, real notification list, or real empty state.
- Clerk token-cache storage ignores invalid SecureStore keys instead of crashing the app.

## Why It Matters

The product specification requires presentation/demo data to live in explicit prototype or seeded staging mode. Production app screens must not imply a beneficiary has real cases, documents, or notifications when Convex has no such records.

## Honest Limits

Still required:

- Clerk Native Applications must be enabled in the active Clerk instance for real mobile sign-in.
- Development/staging seed data is still needed for a presentation-friendly but production-authentic walkthrough.
- Guest-to-account claim is still missing.
- Full iPhone/Android device QA remains required.
