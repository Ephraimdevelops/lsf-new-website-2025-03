# Paralegal workspace functionality and design plan

The paralegal experience will use the beneficiary screens and journey as its Human Civic reference. It will help an approved paralegal understand what needs attention, review a new case, support the person, record progress, and ask LSF for help. Mobile is the first design target; the web workspace will use the same labels, states, and workflow with a layout suited to wider screens.

This plan records the original scope and the completed development implementation. The final verification record below supersedes the initial empty-account check. Synthetic QA readiness is clearly marked and is not real professional verification.

## Current experience and gaps

| Area | Existing foundation | Change needed |
| --- | --- | --- |
| Work home | `mobile/app/workspace.tsx` reads assignments and tasks and links to work tools | Dedicated provider presentation, useful priorities, compact civic introduction, fewer competing links |
| New case offers | `paralegal-assignments.tsx`, `assignment/[id].tsx`, assignment inbox and response mutations | Always open offer details before a decision; show readiness, expiry, saving, conflict and retry states |
| Assigned cases | Shared Cases and `case/[id].tsx`; web `ParalegalDashboard.tsx` | Worker labels and actions; clear case overview and next action; preserve beneficiary presentation in shared routes |
| Case work | Shared messages, documents, appointments, tasks, referrals and outcome endpoints | A guided work sequence and readable grouping; confirm each action against its actual permissions and beneficiary visibility |
| Availability | Profile update against a linked paralegal application | Explain a missing profile; make availability visible on the home; assess organisation availability separately for provider staff |
| Learning | Published training modules, acknowledgements and public legal guides | One Learning entry, distinguish training from guidance, show completion based on stored evidence |
| Support | Supervision, challenging case, peer, wellbeing and payment enquiry requests | Compact choice, useful confirmation, reply/status tracking and easy return to work |
| Progress | Existing paralegal performance readout | Useful activity with labelled periods and measured counts; define any new metrics before implementing them |
| Navigation | Provider workspace reached from Profile; common tabs serve several roles | Explicit work context and return path; role-aware navigation without losing personal account access |

Concrete issues in the current work home:

- It serves operations, safeguarding, reporting, editorial and providers in one component. A focused provider view will make the work hierarchy easier to maintain.
- It uses a large dark introductory block, a long button stack, and duplicate learning entries leading to different destinations.
- A statistic counts account roles, which does not help a paralegal decide what to do next.
- Inline Accept and Decline bypass the dedicated offer review screen and its confirmation and error feedback.
- The readiness message treats `onboardingCompleted` as sufficient. The backend also requires an approved and verified profile, reviewer, identity and certificate evidence, ethics acceptance, conduct acceptance and safeguarding training evidence.
- Availability cannot be updated without a linked application. The test-account provisioning script establishes identity and roles; it does not create this professional evidence.
- Provider staff share the workspace but need organisation-specific access and readiness. The paralegal application form is not a universal provider staff setup flow.

## Creative direction from the beneficiary journey

Use the completed beneficiary treatments in Home, Request Help, My Cases, Messages, Nearby Help, Know Your Rights and Profile as the visual reference. Apply their clear headings, guided decisions, quiet rows, compact filters and visible next steps to professional work.

Retain Onest, warm white surfaces, burgundy primary actions and quiet tinted supporting choices. Teal marks cases and discovery, orange marks guidance and attention, and gold marks learning. State labels and icons must explain meaning alongside colour. Use the existing 48 point minimum touch size, 16 point body text and shared spacing tokens; verify large text before accepting a layout.

Reuse `CivicPageHeader`, `CivicIllustration`, `CivicObject`, `SearchFilters` and the shared typography. Use small illustrations at introductions, onboarding, empty states and successful completion. Case lists, messages and documents need more space for their content. A compact header can pair a short title and one sentence with a 64–96 point illustration.

| Moment | Asset direction | Presentation |
| --- | --- | --- |
| Start work | Existing welcome pose or paralegal object | Small companion beside “Your work today” |
| Review a new case | Existing review or documents pose | Short introduction, then facts and the decision |
| Set availability | Existing location or direction pose | State choice followed by hours and capacity |
| No assignments | Existing empty object | Explain that new offers will appear here; offer one useful next step |
| Learning | Existing documents object or pose | Readable module rows with a clear completion label |
| Ask LSF for help | Existing contact pose | Calm question and support choices |
| Sensitive case work | Small existing safety symbol when needed | Prominent practical action and restrained illustration |

An asset inventory comes before new artwork. If an existing tile does not fit, specify the missing object or pose and produce one consistent addition. Branded clothing uses the established LSF emblem reference. Illustrations are decorative and must not suggest that the character is the person's assigned professional. Any newly sourced asset needs provenance and usage terms recorded with it.

## Navigation and screen structure

Proposed work navigation: **Home · Cases · Messages · Learn · Profile**. Home contains tasks, appointments, new offers and availability. Profile contains work details, organisation, progress, and support. Personal help remains accessible through an explicit switch between personal and work context when the account has both.

Keep the current routes available while introducing the work context. Define direct-link and back behaviour before changing tabs. Notifications should open the relevant offer, task, case or appointment and return to the work context.

### Work home

Order the first screen by actions that need attention:

1. Compact “Your work today” heading with a small civic asset and notifications.
2. Availability label such as “Taking new cases” with an Edit action, or a specific setup requirement.
3. A priority strip for a new offer, overdue task or upcoming appointment, based on real records. Never invent a response deadline.
4. Up to three useful counts with clear destinations: new offers, active cases, tasks due. Agree counting rules and query support first.
5. Today's tasks and appointments, with “View all” for each.
6. Quiet shortcuts to Learning and Ask LSF for help.

The home should answer “What do I need to do now?” in its first viewport. Missing data displays a loading or unavailable state before any empty message. A person with unfinished setup sees the exact next setup step.

### Screen plan

| Screen | Main action and information | Existing route or foundation | Priority |
| --- | --- | --- | --- |
| Work setup | Show review status and finish the exact readiness requirements | `paralegal-onboarding`, `paralegal-profile`, approved application | First |
| Work home | Open the next task, offer or appointment | Provider branch of `workspace` | First |
| New offers | Compact search and filters; summary, area, topic and response deadline when supplied | `paralegal-assignments` | First |
| Offer detail | Read permitted case facts, check capacity, choose accept or decline, confirm | `assignment/[id]` | First |
| My cases | Search plus one filter control; ongoing/history; topic, reference, status and next step | Shared Cases, assignment queries | First |
| Case overview | Read the person's request, latest step, next task and next appointment | `case/[id]` | First |
| Messages | Open a case conversation, send text or supported attachments and see send status | Shared messages and case messaging | Next |
| Documents | Upload, open or review permitted files; show upload and review state | Shared case documents | Next |
| Appointments | Propose or schedule through existing allowed actions; confirm time and method | `appointments`, `appointment/[id]`, case appointments | Next |
| Tasks | Open the task and case context, record completion, show saved state | `paralegal-tasks`, `task/[id]` | Next |
| Referrals | Follow the permitted handoff, consent, response and service steps | `provider-referrals`, referral detail routes | Next |
| Outcome and follow-up | Record what happened, check the next step, explain review or closure state | `case-outcome/[id]`, `case-follow-up/[id]`, existing outcome/closure logic | Next |
| Availability | Set state, working hours and weekly capacity with clear save feedback | `paralegal-availability` | First |
| Learning | Read published guidance, complete applicable training and see evidence of completion | `paralegal-learning`, guide and training routes | Later |
| Ask LSF for help | Choose the support type, write the request, track the reply | `paralegal-support`, support request detail | Next |
| My progress | Review recorded work for a labelled period | `paralegal-performance` | Later |
| Work profile | Review approved details, credentials, organisation and permitted edits | `paralegal-profile`, `my-organisation` | First |

Lists use the same compact search-plus-filter pattern as beneficiary discovery. Extra choices open in a sheet. Keep selections, result count, clear/reset and no-result recovery visible. Search scope must be stated accurately when only loaded records are searchable; large queues require backend pagination and filtering.

The proposed case navigation is **Overview · Messages · Documents · More**. More groups appointments, tasks, referrals and outcome by readable headings, with outstanding work visible from Overview. Preserve direct section links and existing backend authorisation while reducing the seven competing tabs.

## End to end work journey

**Join and submit evidence → independent LSF review → finish work setup → set availability → receive an offer → review and respond → work the accepted case → record progress or request support → record outcome → follow up and complete permitted closure.**

Every transition must explain what changed and where to go next. The same event should make sense on the beneficiary side:

| Paralegal action | Beneficiary experience to verify |
| --- | --- |
| Accepts an assignment | Assigned helper and case progress reflect the recorded assignment |
| Sends a case message | Message appears in the correct beneficiary conversation |
| Schedules an appointment | Time, method, timezone and current appointment state agree |
| Uploads or reviews a file | Only files and review information permitted for the beneficiary are shown |
| Completes an internal task | Worker-only notes remain restricted; any public progress uses its intended audience |
| Participates in a referral | The beneficiary's consent and approved sharing scope govern the handoff |
| Records an outcome | Outcome and feedback appear through the existing workflow; closure state is explicit |
| Asks for professional support | Work support stays in its intended staff workflow |

This requires a three-account rehearsal using beneficiary, LSF staff and paralegal identities, plus provider staff where a referral changes organisations. Assignment acceptance and outcomes must follow the existing server rules. A design change cannot make an unready worker eligible or expose another organisation's cases.

## Plain language and feedback

| Current or technical wording | Proposed English | Proposed Kiswahili |
| --- | --- | --- |
| Assignment inbox | New case offers | Ofa mpya za kesi |
| Service delivery | Your work today | Kazi zako leo |
| Availability | Taking new cases | Napokea kesi mpya |
| Case tasks | What to do next | Hatua zinazofuata |
| Supervisor guidance | Ask LSF for help | Omba msaada wa LSF |
| Performance | My progress | Maendeleo yangu |
| Outcome recording | What happened? | Nini kimetokea? |

These are working labels to check with Kiswahili readers. Give each screen one clear primary action. Replace internal enums with readable labels. Separate unsent, uploading, saved and failed states; preserve entered text on failure and offer a retry that does not duplicate a submission. Successful actions include an explicit next step.

Review loading, empty, filled, error, offline, saving, success, expired and denied states for each applicable screen. Empty offers can explain “No new case offers yet. LSF will show new offers here.” A withdrawn offer must say it is unavailable and provide a return path. An account missing an approved profile must see a setup or support action.

## Functional work before visual completion

1. Establish a single readiness projection matching `isParalegalReady` and assignment acceptance rules. Expose the missing requirement as a useful user action without exposing review internals.
2. Route home offers through the existing detail review and confirmation flow. Handle expired, withdrawn, already answered and unready states without a misleading success.
3. Define work home queries for due tasks, appointments and active cases. Reuse scoped existing reads; add only the missing projections and pagination.
4. Identify where shared case and message routes need worker wording and grouping. Preserve participant and organisation authorisation on every read and mutation.
5. Rehearse message, file, appointment, task, referral and outcome changes with the beneficiary account open separately.
6. Verify notification delivery and deep links with safe previews. Use existing offline facilities only where the action actually supports them. An unsupported offline action stays unsent with a clear retry path.
7. Keep payment enquiries within LSF support. Training acknowledgements and progress cards must describe their stored evidence accurately.

## Implementation sequence and acceptance

### First delivery

Build the work home, provider context, readiness presentation, new offers, offer review, My Cases and availability. Reuse civic components and existing APIs. Prepare synthetic development fixtures for one new offer, one active case, one due task, one appointment and relevant setup states. Fixture evidence stays synthetic and is not promoted as a verified public provider.

Accept when an approved and ready test paralegal can review an offer, accept it, see the assigned case and return to Home. An unready account sees a precise explanation. Declining, expiry, revocation and failed saving have usable recovery. Availability changes persist where a linked approved profile exists.

### Second delivery

Complete the case journey: messages, documents, appointments, tasks, referrals, outcome and support. Apply the beneficiary case treatment and the proposed reduced navigation. Validate the events and audience rules across beneficiary, staff and paralegal accounts.

Accept when a synthetic case can move from assignment through work and outcome with correct beneficiary updates, consent handling and restricted worker notes. Refresh, restart and retry must not lose saved work or duplicate important actions.

### Third delivery

Finish Learning, work profile, progress and web presentation. Inspect small phones, larger text, keyboard layouts, screen-reader labels, English and Kiswahili. Verify notification entry and return paths on a native device. Run focused checks for the changed transitions and access rules.

Completion means the designed screens and the connected journey have passed these checks. Empty dashboard access alone remains a login check.

## Reference files

- Design contract: `docs/haki-yangu/mobile-human-civic-design-system.md`.
- Beneficiary reference: `mobile/app/(tabs)/index.tsx`, `cases.tsx`, `help.tsx`, `profile.tsx`, plus `intake.tsx`, `nearby-help.tsx` and `rights.tsx`.
- Civic assets and tokens: `mobile/src/components/CivicIllustration.tsx`, `CivicObject.tsx`, `CivicPageHeader.tsx`, `SearchFilters.tsx` and `mobile/src/theme.ts`.
- Work entry and web implementation: `mobile/app/workspace.tsx`, `src/pages/ParalegalDashboard.tsx`.
- Readiness and work rules: `convex/lib/paralegalAccess.ts`, `convex/paralegals.ts`, `convex/caseManagement.ts`, `convex/referrals.ts`, `convex/paralegalTraining.ts`.
- Existing provider implementation record: `docs/platform-review/27-provider-workspace.md`.


## Implementation update — 9 October 2026

### Applied in this delivery

- Added the dedicated mobile work home and work profile, with real offers, assigned work cases, due tasks, upcoming appointments, setup state and support destinations.
- Paralegal/provider accounts enter the work home. Operations roles retain their existing workspace. Work navigation is Work, Cases, Messages, Learn and Profile. Personal help remains available from the work profile.
- Reused the beneficiary clay companion atlas and object atlas. Compact illustrated introductions now cover setup, offers, offer detail, tasks and task detail, availability, learning, progress, wellbeing, support and support detail, referrals and referral detail, organisation and work profile.
- Offers open a detail review before acceptance. The UI reflects the existing backend approval/document/training readiness requirements. The backend still makes the final access decision.
- Added single-row search with a labelled filter sheet for case status and task due dates, plus referral search. Referral history fetches closed and declined records explicitly because the default destination queue contains open records only.
- Shared case work uses Overview, Messages, Documents and More. More opens the existing appointment, task, referral and outcome actions. Work-specific next-step and outcome copy complements the beneficiary journey.
- Appointment detail, outcome and follow-up now recognise work context. Messages has a work introduction and case destinations rather than a personal intake prompt.
- The web provider workspace uses the same clay atlas, three primary counts, compact search/status controls, review-before-response offers and readiness guidance. Added a working setup route and aligned the learning introduction.
- Reused the existing Onest font and bundled assets; no new external asset or font dependency was introduced.

### Checks performed

- Mobile TypeScript check: passed, including the final query and navigation changes.
- Web TypeScript check: passed.
- iOS Expo export: passed.
- Web production build, public-asset/security checks, Convex function classification and authentication-routing tests: passed.
- Development paralegal login and verification: passed in the mobile web preview and web workspace.
- Visually checked the work home, cases/filter sheet, messages, work profile, missing-profile setup guidance and web workspace/setup navigation.

### Initial delivery test-data limit (superseded below)

The QA paralegal has its role but no linked approved professional application, no assignment offers and no populated work cases. The UI reports this accurately. This delivery does **not** certify a completed assignment-to-outcome journey. That requires a linked development profile with synthetic documents, independent review, published required training and an assigned synthetic case. Native device checks for notification entry, large text, keyboard behaviour and populated document/message/appointment/referral transitions also remain acceptance checks. No live case or professional approval was fabricated to make the dashboard appear complete.


## Completed development implementation — 9 October 2026

All 17 screen areas in the screen plan now have the intended paralegal treatment and connected actions. The mobile work navigation is Work, Cases, Messages, Learn and Profile. The beneficiary clay atlases, Onest type and civic colours remain the references.

| Flow | Connected capability and design | Verification |
| --- | --- | --- |
| Setup and readiness | Exact approval/document/conduct/training requirements; useful missing-profile state; work profile and organisation links | Missing-profile UI, linked synthetic-ready UI, role/access checks |
| Offers and cases | Review before accept/decline; expiry/readiness guards; assigned/history search; worker overview and status confirmation | UI acceptance and status save; live QA assignment-to-case flow |
| Messages | Text and voice; voice preview/discard/send; stable retry identifiers; worker/personal conversations separated | Live two-way messages, duplicate-retry check, scanned generated audio upload and beneficiary playback source |
| Documents | Work list/detail, upload, review note, accept/reject, retained upload retry; final closed cases reject new documents | Browser scanned PDF upload and acceptance; live generated document and review; old-record/access tests |
| Appointments | Tanzania date/time picker, requests and scheduling, completed/cancelled/missed results; work list/detail | UI scheduling; live result and beneficiary visibility; closure waits for scheduled results |
| Tasks | Case task creation, optional due time, due/open/completed filters, task detail and completion | Browser creation; live completion; work home updates |
| Referrals | Initial and onward proposals, named receiver, beneficiary decision, destination response, consent-aware history | Live worker → beneficiary → provider → onward → beneficiary → paralegal chain; permission and revoked-membership tests |
| Outcomes and closure | Resolved/unresolved disposition, beneficiary-safe summary, review/confirm save, missing-outcome repair, explicit final-close requirements | Live resolved outcome, beneficiary feedback, staff review and final closure; unresolved/legacy and closure guard tests |
| Support and wellbeing | Supervisor, difficult case, peer, wellbeing and payment enquiries; private request/reply status | Live worker request → staff response → worker visibility |
| Availability, learning and progress | Hours/capacity/availability, published training and guidance, measured case/outcome/rating summaries | Profile and learning states checked; existing authorised mutations connected; aggregate privacy retained |
| Personal help and notifications | Same account can enter beneficiary help and return to work; case/document/appointment/support/referral links use their resources | Browser personal-home/case separation and return; destination notification identifiers tested; cold case link opens the requested Messages section |
| Web workspace | Corresponding case actions plus task/support/progress tools, voice/file controls and personal entry | TypeScript, production build and populated browser case/tool checks |

### Evidence

- `output/paralegal-revamp/complete-development-journey.json`: named development deployment, synthetic case IDs and successful workflow checks.
- `output/paralegal-revamp/media-development-journey.json`: generated audio, managed scanning, idempotent send, beneficiary playback source and unassigned-provider rejection.
- `scripts/paralegal-workflows.test.mjs`: handler-level scope, consent, history, closure, document and context regression checks.
- `scripts/paralegal-complete-journey.mjs`: repeatable multi-role live development rehearsal; `--finish` resumes final checks for the recorded synthetic case.
- `scripts/paralegal-development-journey.mjs`: prepares the separate active exploration fixture.
- Browser proof includes accepted case, task creation, status save, referral review, accepted PDF, phone work home and cold case link screenshots in `output/paralegal-revamp`.
- Final mobile TypeScript check and iOS export passed after the cold-link fix. The root navigator stays mounted while account readiness gates screen content, preserving incoming routes and parameters.
- 21 focused paralegal workflow/directory regression checks passed; web production build and security/authentication gates passed. The security classifier recognises 389 public Convex functions.

Synthetic professional and service fixtures are internal-only creations restricted to `joyous-spaniel-5`. Public paralegal/service list and detail queries exclude them. Referral test destinations are visible only to the development QA accounts through a case-scoped work query. Professional readiness is simulated and labelled; no actual professional verification, examination or agreement acceptance is certified.

### Verification limits

The populated browser previews and live Convex role journey have been exercised. Mobile and web TypeScript, Convex type checking, the web production build/security gates and iOS bundle export pass. An iOS export does not prove device microphone capture, operating-system push delivery, screen-reader interaction or large-text keyboard behaviour. Those remain real-device release QA. Generated audio was used to verify the authorised upload, send and playback path without requesting microphone permission. Learning acknowledgements represent self-study, not an examination certificate; LSF remains responsible for approving current training content.
