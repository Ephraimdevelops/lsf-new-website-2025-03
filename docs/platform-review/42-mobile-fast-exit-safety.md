# Mobile Fast Exit Safety Phase

## What changed

Added a fast-exit control for sensitive mobile flows.

Implemented:

- `mobile/src/components/QuickExit.tsx`
- Fast exit on Safety screen
- Fast exit on Intake screen
- Fast exit on SARA screen

## Product behavior

The fast-exit button immediately replaces the current route with the neutral home tab. This helps users leave sensitive screens quickly if someone else can see their device.

The action does not silently delete saved drafts or SARA history. Destructive clearing should remain explicit because users may rely on saved drafts and chat history for support.

## Remaining

- Physical-device QA for fast-exit behavior with deep navigation stacks.
- Optional app-switcher privacy blur/snapshot protection for native builds.
- Final safety review with LSF/domain experts.
