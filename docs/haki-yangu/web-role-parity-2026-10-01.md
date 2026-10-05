# Haki Yangu web role parity: working inventory

## LSF control centre update, 2 October 2026

The default `/admin` screen now opens the Haki Yangu control centre. Website traffic and content analytics remain under **Website overview**. The control centre reads current access requests, paralegal applications, pending matching decisions, case review requests and documents awaiting review, and links into the existing decision workspaces. Lists capped at 100 or opened with an initial page are labelled as shown counts rather than platform totals. Pending imported paralegal invitations are identified as awaiting the applicant's documents and excluded from the actionable paralegal-review count. The sidebar has a narrow-screen selector.

Web TypeScript, mobile TypeScript, the production website build, security checks and 71 contract checks pass. The updated functions were uploaded to the configured development Convex deployment through code generation. Read-only public queries on 2 October returned `[]` for both published justice services and approved public legal guides. This verifies code and routes, not the visual result for signed-in LSF staff or the cross-account decision lifecycle. Real LSF-verified records and distinct authenticated roles are needed to rehearse approvals, assignments, safeguarding, revocation and reporting.

The website and mobile app call the same Convex backend. This inventory records visible web routes and the remaining work; a route or passing build is not end-to-end verification.

| User | Current web entry | Main gap to close |
| --- | --- | --- |
| Guest / beneficiary | `/haki-yangu`, `/find-help`, `/request-help`, `/sara`, `/dashboard/user` | Complete bilingual Find Help and intake, document attachment, saved services, appointments, referral consent, notifications and case recovery on web with phone and browser checks. Public directory currently depends on LSF-verified records; an empty directory must remain honest. |
| Paralegal | `/become-a-paralegal`, `/dashboard/paralegal` | Match mobile onboarding, learning, availability, assignment, communication, evidence and outcome workflows with separate-account checks. |
| Provider staff | `/dashboard/paralegal`, `/dashboard/provider/organisation` | Organisation switch, members, capacity and service-correction screens are present; referral handling and access revocation need cross-account verification. |
| LSF staff / supervisor | `/dashboard/staff` | Split the combined workspace into clear queue/detail/decision routes and verify sensitive-case, matching and exception actions. |
| Safeguarding officer | `/dashboard/safeguarding` | Rehearse restricted access, escalation, handoff and audit with real role separation. |
| Content editor | `/dashboard/editorial` | Full guide version and publication lifecycle; separate author and approver accounts. |
| Donor / stakeholder | `/dashboard/stakeholder` | Verify only approved aggregate reports are visible and review disclosure controls. |
| Admin | `/admin`, `/sara/train`, staff and governance workspaces | A cohesive management centre linking user approvals, roles, directory, organisations, guides, Saada sources and evaluation, reporting and audit; lifecycle and revocation tests. |

## Build order

1. Close public beneficiary Find Help and Ask for Help end to end, including return from sign-in and real-data/no-data states.
2. Build a role-aware web workspace shell and admin management centre over existing backend permissions; do not fork a second data or auth system.
3. Complete provider and paralegal workflows, then LSF safeguarding, editorial, Saada governance and reporting.
4. Run multi-account web/mobile journeys and visual, language, accessibility, privacy and operational checks. Production readiness remains unverified until these pass with approved sources and service records.

## This implementation slice

`/find-help` reads the approved public service projection and can save a service to the user's account. `/request-help` saves and submits through the same `legalHelp` mutations as mobile. The beneficiary dashboard, Haki Yangu landing page, Legal Help page and header help dialog link to these routes. The request form provides review, consent text, session draft and reference confirmation.

`/dashboard/user/saved-help` shows the account's saved services and visit plans and allows removing or cancelling them. `/dashboard/user/requests/:id` shows an owner-scoped request detail, status and withdrawal where the backend permits it. The beneficiary dashboard links directly to these pages and to its case workspace. Admin management cards link to the appropriate staff tabs and safeguarding workspace. Web layout uses wider panels and sidebars while preserving mobile journey concepts.

Still open for beneficiary web parity: full bilingual copy, notifications and case recovery across statuses, and multi-account/device verification. The LSF and paralegal web workspaces still need separate screen-level parity passes; this slice does not establish end-to-end completion.

## Next beneficiary web screens added

`/find-help/:id` is a dedicated desktop service detail screen. It reads the verified public projection, offers save/unsave, public phone contact when supported, a service-context help request, personal visit/call planning, cancellation and post-visit check-in. The backend still enforces future time, supported channel and check-in timing. A personal plan is clearly labelled as distinct from a provider-confirmed appointment. Saved Help links back to this detail screen.

`/know-your-rights` and `/know-your-rights/:id` show the same approved, not-expired legal guides used by mobile, including bilingual content, source, publisher and next review date. No guide is invented when the approved library is empty. The web request draft survives a sign-in trip in the same browser tab and the login page accepts a restricted return path back to it.

The web intake now accepts one optional PDF, JPG or PNG evidence file up to 10 MB, uploads it to the existing owner-scoped request draft before submission, and shows it on the private request detail screen afterward. Draft lookup reports existing attachments so a retry does not deliberately upload the same file again. This still needs an actual authenticated upload and retry rehearsal across browsers.

The beneficiary case workspace now has a case-scoped PDF/JPG/PNG upload (10 MB limit), document review notes, recorded outcome, one-time outcome feedback, and an LSF review request with reason and status. `/dashboard/user/documents` lists the user's accessible case documents with search/filter, status, file/text view and links back to the case. Closed cases link to a new help request; the backend does not currently allow a beneficiary to reopen a closed case, so the screen does not promise reopening.

Still open: actual authenticated upload/retry, feedback and LSF review rehearsal with separate accounts; fuller bilingual copy; notification and offline recovery; device plus multi-account verification. A build passing does not close these flows.

## Provider web workspace added

`/dashboard/provider/organisation` reads only organisations tied to approved paralegal or provider-staff roles. It supports switching between approved affiliations, viewing organisation verification and referral agreement, viewing linked services and members, provider-staff updates to verified services' intake state and capacity, and correction requests that LSF must review before public details change. Paralegals can see their affiliated organisation without provider-staff mutation controls. The provider case dashboard links to this page. Organisation membership approval and revocation remain LSF-controlled and require cross-account verification.

## Web governance controls added on 2 October

The Saada source list at `/sara/train` now shows publisher, jurisdiction, language, version, review due date, indexing state/error and last review reason. Pending sources can be approved only when indexed and within the review window; failed indexing can be retried. An approved source can be withdrawn from future answers with an audited reason. The primary web control no longer offers deletion of approved material. The list still reads the latest 100 sources, so full pagination and source-answer evidence review remain open.

Admin → Users & Access now exposes per-assignment role revocation requests and the independent approval queue. Reasons are required, and the backend prevents self-review and base-role removal through this path. The admin platform also links to Saada knowledge and public-guide editorial. These controls compile and build, but require separate administrator accounts for workflow acceptance.

## LSF reporting web screen added

`/dashboard/reporting` is available to approved admin, supervisor and staff roles. It creates a private aggregate snapshot through the shared reporting mutation, previews every donor-visible metric including suppressed cells and quality flags, and lets an eligible administrator or supervisor approve or reject with a reason. The backend requires the reviewer to differ from the generator. Approved and rejected history is shown; donors still read only approved snapshots in their separate dashboard. Admin and LSF operations link to the new screen. Build and TypeScript checks pass; cross-account generation, approval, rejection and donor-view testing are still required.

## Paralegal learning web flow

`/dashboard/paralegal/learning` now shows approved, current training modules, Kiswahili/English content, source links, required-module readiness and self-study acknowledgement through the same Convex APIs used by mobile. It also lists approved public legal guides and has explicit no-content states. `/dashboard/training-management` lets LSF staff or admins submit sourced bilingual modules and lets admins independently approve, reject or retire them with a reason. The backend enforces that the submitter cannot approve their own module. Paralegal, staff and admin navigation links lead to these screens. Authenticated cross-role rehearsal, mobile/browser visual review and LSF-approved module content remain open.

## Saada evaluation web screen

`/dashboard/saada-evaluations` lets approved admin/staff accounts create and page through test cases, open Saada with the exact question prefilled, select their own saved completed response, inspect its retrieved sources, and record a human pass/fail/legal-review verdict with evidence. Admins can retire a case with a reason; the review history remains visible. The route is linked from the admin platform and Saada knowledge page. The shared backend verifies question equality, response ownership and timing. This screen does not itself prove legal accuracy. Authenticated reviewer-account tests, comprehensive high-risk evaluation content and legal review remain open.

## Legal-guide editorial web flow

`/dashboard/editorial` now previews bilingual content before submission and supports preparing a new version of an approved guide or correcting and resubmitting an author's rejected draft. The queue shows status, version, jurisdiction and review date. `/dashboard/editorial/review/:id` shows both languages, source metadata, the previous approved version or rejected-draft reason, and admin approval, rejection or retirement with a recorded reason. The shared backend enforces independent approval, review dates and approved-only public visibility. The current web queue still uses the latest-100 query; pagination, signed-in separate-editor/admin rehearsal and legal review of actual content remain open.

## LSF access review web screen

`/admin?tab=access` now has a paginated pending professional-access queue. Each application opens `/dashboard/access-requests/:id`, a focused review screen showing the applicant, requested role, stated organisation, submission and reason. The reviewer searches or pages verified organisations, records an auditable reason, previews the decision and confirms it. The existing backend prevents self-review, enforces organisation eligibility and records the resulting role assignment and audit event. Admin tab selection and the staff and provider work areas now persist in the URL, so links and browser history return to the intended screen. Separate administrator and applicant accounts must still rehearse approval, rejection, refresh and subsequent revocation before this flow is accepted.

`/dashboard/paralegal-reviews` now provides paginated pending and under-review queues for LSF staff and admins, with a focused `/dashboard/paralegal-reviews/:id` detail screen. Reviewers see the private application profile and identity, certificate and CV links; staff can start review or reject, while final approval requires an admin and the required evidence. The old inline approval buttons in Admin → Submissions now link to this detail screen. The shared backend now rejects self-review, requires an auditable reason for final decisions and enforces pending → under review → final status. A separate staff/admin/applicant rehearsal and review of real credential evidence remain open.
