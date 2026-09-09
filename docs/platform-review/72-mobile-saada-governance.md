# Mobile Saada Governance Bridge

Date: 2026-09-09

## What Changed

The mobile Saada screen no longer generates local demo answers. It now:

- Requires the user to accept a short AI-use consent notice before sending.
- Saves the user message through `sara_chat.sendMessage`.
- Calls the governed Convex action `sara_actions.ask` with `source: "mobile"`.
- Shows safe fallback language when authentication, maintenance, budget, or AI configuration prevents a response.
- Uses the public product name Saada in mobile copy.

The Saada backend now records governance events in `saada_risk_events`:

- emergency keyword bypass
- low-confidence retrieval
- tool routing
- policy block
- normal response

Admin/staff users can review the latest events in the Saada AI analytics panel.

## Honest Limits

This is an important governance bridge, not full AI readiness. Still required:

- case-linked Saada sessions
- human handoff workflow from risky AI sessions
- staff disposition workflow for AI risk events
- more robust legal-content evaluation
- production model/cost monitoring
- mobile real-device QA with Clerk Native Applications enabled
