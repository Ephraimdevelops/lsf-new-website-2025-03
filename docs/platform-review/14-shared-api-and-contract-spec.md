# Shared API and Contract Specification

## Contract rules

- Version public service functions (`v1.*`) and shared Zod/Convex validators; never expose raw table documents.
- Every response uses stable public IDs, ISO timestamps, `schemaVersion`, locale-ready enums and a typed error (`UNAUTHENTICATED`, `FORBIDDEN`, `VALIDATION`, `CONFLICT`, `RATE_LIMITED`, `UNAVAILABLE`).
- Mutations accept an `idempotencyKey` and expected record version where retries/offline queues are possible.
- Taxonomy/status changes are versioned; clients tolerate unknown values with safe fallback labels.

## Initial services

| Service | Queries | Mutations/actions | Core authorization |
|---|---|---|---|
| identity | `me`, `capabilities` | `syncFromIdentity`, `claimGuestDraft`, `registerDevice` | authenticated subject/own device |
| taxonomy | `legalIssues`, `regions`, `districts`, `statusLabels` | admin publish version | public read; admin publish |
| intake | `getDraft`, `getRequest`, `myRequests` | `saveDraft`, `submit`, `withdraw` | owner; staff projection after submit |
| cases | `myCases`, `getTimeline`, `staffQueue` | `createFromRequest`, `updateStatus`, `close` | case access/capability |
| assignments | `inbox`, `caseAssignments` | `offer`, `respond`, `reassign` | staff offer; assignee response |
| referrals | `get`, `inbox` | `create`, `consent`, `respond`, `complete` | case access + target org membership |
| messages | `listConversation` | `send`, `markRead`, `report` | conversation participant |
| attachments | `list` | `createIntent`, `finalize`, `remove` | record access + purpose policy |
| appointments | `list` | `schedule`, `respond`, `cancel` | case participant/worker |
| outcomes/feedback | `caseOutcome` | `record`, `approve`, `submitFeedback` | worker/supervisor/beneficiary split |
| knowledge | `list`, `get`, `offlineManifest` | editorial workflow | public approved; editor/reviewer writes |
| AI | `session`, `history` | `start`, `send`, `feedback`, `deleteSession` | consent + owner; case access when linked |
| notifications | `preferences`, `inbox` | `updatePreferences`, `markRead` | owner |
| reporting | approved metric snapshots | generate/export internal jobs | programme scope; donor aggregate only |

## Notification event catalogue

`request.submitted`, `request.more_information`, `case.created`, `assignment.offered`, `assignment.accepted`, `assignment.declined`, `case.status_changed`, `message.received`, `document.requested`, `attachment.ready/rejected`, `appointment.created/changed/reminder`, `referral.offered/accepted/declined/completed`, `reassignment.received/decided`, `safeguarding.escalated`, `case.outcome_recorded`, `feedback.requested`. Templates are locale/versioned. Push titles use neutral text such as “You have an update in Haki Yangu,” never issue type or party names.

## Analytics event catalogue

Allow-list only: `resource_viewed/saved`, `navigator_started/completed`, `intake_started/step_completed/submitted`, `auth_started/completed`, `request_viewed`, `assignment_responded`, `message_sent`, `appointment_responded`, `referral_responded`, `outcome_recorded`, `feedback_submitted`, `offline_queue_added/synced/conflicted`, `ai_session_started`, `ai_answer_feedback`, `human_escalation_requested`. Prohibit message text, names, phone/email, case descriptions, attachment names/URLs and precise coordinates. Operational metrics come from domain events, not client analytics.

## Audit event shape

`eventId`, `occurredAt`, `actorUserId`, `actorRoleAssignmentId`, `organisationId`, `action`, `resourceType`, `resourceId`, `caseId?`, `purpose`, `result`, `changedFieldNames`, `requestCorrelationId`, `channel`, `ipHash?`, `deviceId?`. Never store secrets or raw sensitive payloads in audit metadata.
