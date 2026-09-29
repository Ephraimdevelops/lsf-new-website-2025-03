# Haki Yangu mobile screen-first execution

This pass changes the **existing Expo launch app** in `mobile/app`. The supplied images guide hierarchy, navigation, visual language, and journey coverage. They are not evidence for legal rules, provider identities, contact details, or operational data.

## Delivery rule

For each route: design the normal, loading, empty, error, signed-out, restricted, and completed states that apply; keep existing backend calls connected; make every visible action lead to a real route or an explicitly labelled unavailable state; review on a phone-sized simulator in Swahili and English; record any flow that cannot be exercised without verified data or accounts. Screen completion does **not** mean integration or launch approval.

## Screen groups and order

| Order | Journey | Existing route group | Screen work | Integration boundary |
| --- | --- | --- | --- | --- |
| 1 | Entry and identity | onboarding, sign-in, join, Home, tabs | welcome, role choice, return after sign-in, clear role destination, shared navigation | Clerk role activation and provider approval remain server-governed |
| 2 | Find Help | find-services, service detail, saved services, service visit, paralegal directory/profile | search, filters, results, match reasons, service detail, contact, saved list, personal visit, after-visit help | Public services must be LSF verified; no invented contacts or confirmed appointment claim |
| 3 | Ask for Help | intake, request detail, My Case | guided form, evidence, review, submission, status, withdrawal/recovery | Draft, submission, permissions and notifications remain connected |
| 4 | Beneficiary case | case detail, messages, appointments, documents, notifications | timeline, secure chat, files, referrals/consent, appointment, outcome, feedback, more help | All private actions require real case access and backend state |
| 5 | Saada and learning | sara, Learn, resource detail, document checker, letter builder, safety | conversation, sources, suggested actions, history, resource detail, practical tools | AI/RAG claims depend on governed approved knowledge and risk handling |
| 6 | Paralegal and partner | onboarding, workspace, profile, performance, support, organisation | approval progress, tasks, case work, availability, learning/support, partner service view | Approval, assignment, and organisation scope remain enforced by Convex |
| 7 | LSF administration | operations, safeguarding, governance, directory management, Saada governance, reporting, audit | triage, protected review, user access, source review, reporting, audit | Staff-only permissions; sensitive operational data never in public screens |
| 8 | Account and resilience | profile, privacy, notification settings, offline, support, about | preferences, saved items, recovery, offline status, access and support | Device/offline and cross-account QA still required |

## Shared design language

Use the current burgundy, teal, orange and warm neutral palette with Ubuntu typography. Screens should have a clear title, one primary next action, concise reason or status copy, 44pt+ touch targets, visible back navigation, consistent safe-area/scroll behavior, and concise Swahili and English text. Use cards and step indicators where they clarify progress, not as decoration. Screenshot compositions are adapted to actual phone dimensions and data density.

## Effect on development

The work is additive to the launch app: it reuses existing Convex and Clerk contracts and preserves routes. New screens may expose missing data fields or mutations; record those explicitly and integrate in the later backend pass. Do not show decorative buttons that imply a working feature, populate public listings with QA seed records, or mark a journey complete solely because its UI renders. Keep TypeScript, contract/security checks and simulator review in the loop for each group.

## Current evidence and limits

Home, Find Help search/empty state and no-match escalation have simulator review. Find Help service cards, service detail, saving and visit follow-up still need real verified public service records and signed-in multi-account QA. The live public service query currently returns zero records in the connected environment. Other groups have routes and varying levels of UI and backend wiring, but have **not** been visually accepted as a complete set against the supplied references.

## Route-level design queue

There are now 53 `.tsx` files under `mobile/app`, including layouts, splash/redirect and auth callback files. Existence does not count as design acceptance. `Reviewed` below means a specific state was seen on the iPhone simulator; it does not imply the entire route is complete.

| Group | Routes | Current screen-first disposition |
| --- | --- | --- |
| Shell and entry | `_layout`, `(tabs)/_layout`, `index`, `onboarding` | Existing; full navigation/accessibility review open |
| Identity | `sign-in`, `join`, `sso-callback` | Existing; return from service work added; auth/account-state review open |
| Beneficiary hub | `(tabs)/index`, `(tabs)/cases`, `(tabs)/help`, `(tabs)/learn`, `(tabs)/profile` | Home reviewed in one simulator state; remaining states and tabs open |
| Find Help | `find-services`, `service/[id]`, `saved-services`, `service-visit`, `paralegals`, `paralegal-profile` | Search and empty state reviewed; Saved Help guest state reviewed; signed-in/service states open |
| Request and case | `intake`, `request/[id]`, `case/[id]`, `appointments`, `appointment/[id]`, `documents`, `document/[id]`, `notifications` | All eight intake steps were traversed with non-sensitive example input on an iPhone simulator. Autocorrect changed a typed district, so location autocorrect was disabled; urgency labels and draft recovery placement were corrected. Sign-in return, direct review edits, localized safe-contact choices, true request tracking after submission, and terminal request status display are in code. Appointment and document details now have dedicated routes backed by the user's accessible records; their device review is still open. Signed-in submission, request status, evidence upload, Swahili visual review and multi-account QA remain open. |
| Saada and rights | `sara`, `resource/[id]`, `document-checker`, `letter-builder`, `safety` | Saada guest state now explains sign-in, returns to chat after auth, and offers real Find Help/Request Help routes. Clear-history confirmation and directory verification for AI-rendered helper cards were added. Signed-in conversation, source presentation, risk escalation and phone visual review remain open. Other rights/tools routes remain open. |
| Paralegal and partner | `paralegal-onboarding`, `workspace`, `paralegal-assignments`, `paralegal-tasks`, `paralegal-availability`, `paralegal-performance`, `paralegal-support`, `my-organisation`, `provider-referrals`, `provider-referral/[id]` | Onboarding shows the application-to-work sequence to guests. Assignments, tasks, availability and the consented provider-referral inbox/detail are linked from the workspace and screen index. The referral decision screen uses the existing scoped backend transition and records reasons for refusal or closure. Approved-role device review and three-account workflow acceptance remain open. |
| LSF governance | `operations`, `referral-oversight`, `referral-oversight/[id]`, `supervision`, `matching-review`, `partner-performance`, `safeguarding`, `governance`, `directory-management`, `directory-service/[id]`, `directory-organisation/[id]`, `saada-governance`, `reporting`, `audit-log` | Operations links to staff referral oversight and consent-evidence review. Supervisor overview connects case review, matching decisions, partner metrics, safeguarding and audit. Directory list now opens dedicated service and organisation records for verification evidence, state and linked-service review; actions use the existing audited update mutations. Staff-state, permission and device visual review remain open. |
| Account/support | `privacy-security`, `notification-settings`, `offline`, `support`, `about` | Existing routes; settings and recovery visual review open |

Public browsing now starts without a Clerk key when a valid Convex URL is configured. A local Expo web session with a production Clerk key also falls back to guest browsing instead of a configuration blocker. Sign-in, private records and staff actions remain unavailable until Clerk is correctly configured. Home links to `explore`, an index of actual routes; protected routes show their real signed-out or restricted state. Saada no longer produces a sample answer for guests. The guest web bundle exports successfully, but an interactive phone/browser review of this latest change is still required before accepting the screens.
