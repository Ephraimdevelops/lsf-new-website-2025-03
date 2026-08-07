# Testing and Quality Strategy

## Current baseline

| Check | Result |
|---|---|
| dependency install | pass; vulnerability triage required |
| TypeScript `--noEmit` | pass |
| production build | pass with warnings |
| lint | fail; parser/type/hook issues |
| automated tests | absent |
| browser smoke | provider config error; app flows blocked |
| Convex logs/functions | untested without deployment config |
| Clerk roles/auth | untested |
| uploads/email/SARA | untested |

## Required test layers

- Unit: validators, permission helpers, state machines, beneficiary labels, metric formulas, prompt/emergency configuration.
- Convex integration: every function with unauthenticated, each role, wrong organisation, wrong owner, deleted user and break-glass cases.
- Contract: web/mobile fixture compatibility and unknown enum handling.
- E2E web/mobile: all 24 journeys, especially vertical slice, account recovery, shared phone, offline/retry/conflict.
- Security: dependency/SAST/secret scan, executable-public-file deny rule, upload polyglots/signature/size, stored/reflected XSS, webhook replay/auth, rate abuse, IDOR, export permissions.
- AI: Swahili/English legal benchmark, citations, abstention, emergency determinism, prompt injection, sensitive leakage, cost/latency and human escalation.
- Accessibility: keyboard, screen reader, dynamic type, contrast, reduced motion, touch size and Swahili labels.
- Reliability: notification outbox retries, provider outage, Convex/OpenAI/n8n timeout, migration resume, backup restore and load tests.

## CI gates

No merge unless format/lint/type/unit/contract/build and secret/security scans pass. Schema/auth changes require permission tests. Mobile release requires signed staging E2E, crash-free threshold, privacy checklist and rollback rehearsal. Production smoke tests use synthetic accounts/data, never a beneficiary record.

## Vertical-slice acceptance test

A beneficiary can draft offline, authenticate, submit once despite retry, receive a neutral receipt, staff sees only scoped queues, converts and offers assignment, only the verified assignee can accept and message, beneficiary sees a plain-language timeline, appointment/outcome complete, feedback is recorded, and every sensitive view/write appears in audit logs. Cross-user, cross-org and stale-offline writes are denied.
