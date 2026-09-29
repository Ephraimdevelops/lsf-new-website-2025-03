# Haki Yangu User Role and Access Matrix

Date: 2026-09-09

## Current Enforced User Types

The platform currently has 11 practical user types: one guest type plus ten authenticated Convex roles.

| User type | Backend role | Primary app surface | Scope |
| --- | --- | --- | --- |
| Guest | none | Mobile public screens and public website | Read public guides, use public discovery, start non-private flows, then sign in before private records are saved to the backend. |
| Beneficiary / community member | `user` | Mobile app and web user dashboard | Submit legal-help requests, track own cases, message case participants, upload own case documents, request appointments, request case review, and submit feedback. |
| Verified paralegal | `paralegal` | Web provider dashboard; mobile support path | Accept or decline assigned cases, communicate inside assigned cases, create appointments, review documents, record outcomes, manage availability, and respond to referrals. |
| Partner/provider staff | `provider_staff` | Web provider dashboard | Work only on destination-assigned referrals or scoped service-provider case work. |
| LSF staff / case worker | `staff` | Staff dashboard | Triage requests, create cases, offer assignments, create referrals, review matching decisions, review consent evidence, supervise document/appointment operations, and manage service records within staff scope. |
| LSF safeguarding officer | `safeguarding_officer` | Staff dashboard safeguarding queues | Review safety-sensitive case review requests and immediate-safety matching decisions without receiving ordinary private case work by default. |
| LSF supervisor | `supervisor` | Staff dashboard | Review escalations, reassignment requests, assignment quality, closure readiness, and operational exceptions. |
| Content editor | `content_editor` | Admin/CMS scope where enabled | Manage approved public content and knowledge resources without case-owner privileges. |
| Stakeholder viewer | `stakeholder` | Stakeholder dashboard | View approved aggregate information only; no private case details. |
| Donor/reporting viewer | `donor` | Stakeholder dashboard | View approved donor-safe reporting snapshots with no case-level access. |
| Administrator | `admin` | Admin and staff dashboards | Manage platform configuration, users, CMS, seed/dev utilities, service directories, and privileged operations. |

## Persona Mapping From The Product Spec

Some product-spec personas are not separate enforced roles yet. They are represented through current roles and scoped workflows:

| Product-spec persona | Current implementation |
| --- | --- |
| Guest | Guest access without Convex private records. |
| Beneficiary | `user`. |
| Paralegal | `paralegal`. |
| Partner staff | `provider_staff`. |
| LSF case worker | `staff`. |
| LSF safeguarding officer | `safeguarding_officer`. |
| LSF supervisor | `supervisor`. |
| Knowledge manager / legal expert | Currently `content_editor` plus staff review where needed; legal expert workflow is not fully separated. |
| Programme manager | Currently `staff`, `supervisor`, or future reporting role; programme analytics remain incomplete. |
| Content editor | `content_editor`. |
| Administrator | `admin`. |
| Approved reporting / stakeholder viewer | `stakeholder` and `donor`. |

## Completeness Read

The enforced role model is good enough for an advanced MVP foundation, but pilot readiness still needs:

- scheduled donor-safe reporting exports before donor users are enabled broadly;
- removal of remaining demo dashboard data in stakeholder/user web dashboards;
- stronger organization-scoped membership rules for partner staff;
- full device QA for mobile authentication and private-record access.
