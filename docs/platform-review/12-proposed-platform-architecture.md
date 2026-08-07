# Proposed Platform Architecture

```mermaid
flowchart TB
  Web["LSF website + staff/partner web"] --> Contracts["Versioned application services"]
  Mobile["Haki Yangu Expo app"] --> Contracts
  Future["Future WhatsApp / assisted / SMS adapters"] --> Contracts
  Contracts --> Authz["Convex authz + domain services"]
  Authz --> Clerk["Clerk authentication"]
  Authz --> Core["Convex system of record"]
  Core --> Storage["Private Convex storage + scan pipeline"]
  Core --> Notify["Notification outbox → push/email/SMS"]
  Core --> AI["Governed SARA/Saada service"]
  AI --> Sources["Approved legal knowledge"]
  AI --> Provider["OpenAI or private n8n orchestration"]
  Core --> Reporting["De-identified metric snapshots"]
  Core --> Audit["Audit/access logs + retention jobs"]
```

## Principles

1. One Clerk identity plane and one Convex application source of truth.
2. Public CMS data, private service data and especially restricted safeguarding/whistleblower data have separate projections and authorization policies.
3. Web/mobile call stable service functions, not raw table CRUD.
4. Every external side effect uses an authenticated server adapter and outbox/delivery record.
5. Attachments default private and quarantined; access is record-scoped.
6. Analytics is allow-listed, minimized and separated from operational/legal records.
7. AI is a governed capability, never the owner of emergency contacts, roles or case state.

## Service boundaries

`identity`, `organisations`, `taxonomy`, `intake`, `cases`, `assignments`, `referrals`, `communications`, `appointments`, `attachments`, `knowledge`, `ai`, `notifications`, `safeguarding`, `feedback`, `reporting`, `audit`. Internal table migrations may evolve without changing the versioned client contracts.

## Repository strategy

Keep this website repository and create a separate `haki-yangu-mobile` repository only after contracts are approved. Share the Convex deployment and Clerk instance. Publish a small versioned private TypeScript contracts package when shapes stabilize. Do not monorepo-migrate a functioning public website during foundation repair.
