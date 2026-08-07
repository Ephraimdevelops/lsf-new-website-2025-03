# Component and Design-System Audit

## Existing language

- Brand tokens: primary burgundy (`332 67% 35%`), teal, orange, yellow, green and neutral scales in `src/index.css`/Tailwind.
- Typography: Ubuntu headings; CSS requests Avenir body text but no Avenir package is bundled, so platform-dependent fallback occurs. Inter and Playfair packages are present but usage is inconsistent.
- UI foundation: shadcn/Radix primitives for buttons, inputs, dialogs, alerts, tabs, cards, menus, forms, toasts and loading patterns.
- Layout: shared `Layout`, header/navigation, footer, `Container`, typography and responsive Tailwind breakpoints.
- Motion: Framer Motion and global CSS transitions; reduced-motion support is not consistently evident.

## Reuse decision

Reuse brand tokens, tone, icon principles, spacing rhythm, content hierarchy and accessibility semantics as **design guidance**. Do not port DOM/Radix components or Tailwind class strings to React Native. Mobile needs native primitives, 44px touch targets, screen-reader labels, dynamic text sizing, offline/sync states and safe-notification patterns.

## Gaps

- Loading/error/empty states are inconsistent and sometimes replaced by mock data or forced timeouts.
- Forms duplicate validation and do not share Zod contracts with Convex.
- CMS rich HTML is previewed/rendered without an identified sanitization boundary.
- Global transitions on `*` can create motion/performance/accessibility problems.
- No automated axe/WCAG checks, keyboard-route tests, contrast report or screen-reader acceptance suite.
- Haki Yangu uses hard-coded claims, stock imagery and a chatbot-led product story instead of an actual service journey.
- Swahili exists in fragments; there is no i18n message catalogue or Swahili-first content workflow.

## Mobile design principles

Calm, trustworthy and plain-language; Swahili first; one primary action per screen; statuses explained in beneficiary language; neutral lock-screen notifications; visible offline/sync state; progressive disclosure for sensitive details; no legal-category knowledge required; emergency guidance always governed and source-stamped.
