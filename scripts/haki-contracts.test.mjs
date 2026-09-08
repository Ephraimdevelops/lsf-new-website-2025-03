import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { assertCaseTransition, caseTransitions } from "../convex/lib/caseLifecycle.ts";

test("the case lifecycle accepts every declared transition", () => {
  for (const [from, targets] of Object.entries(caseTransitions)) {
    for (const to of targets) assert.doesNotThrow(() => assertCaseTransition(from, to));
  }
});

test("the case lifecycle rejects skipped and terminal transitions", () => {
  assert.throws(() => assertCaseTransition("under_review", "resolved"));
  assert.throws(() => assertCaseTransition("closed", "under_review"));
  assert.throws(() => assertCaseTransition("resolved", "assistance_underway"));
});

test("retryable domain writes have unique lookup indexes", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  assert.match(schema, /by_owner_client_request/);
  assert.match(schema, /by_source_request/);
  assert.match(schema, /by_sender_client/);
});

test("sensitive notifications use translation keys, not case content", () => {
  const source = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /bodyKey:\s*(args\.|caseRecord\.summary|request\.description)/);
  assert.match(source, /bodyKey:\s*"notifications\./);
});

test("domain notifications use the central delivery helper", () => {
  for (const file of ["../convex/caseManagement.ts", "../convex/legalHelp.ts"]) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.match(source, /createNotification\(ctx,/);
    assert.doesNotMatch(source, /ctx\.db\.insert\("notifications"/);
  }
});

test("push delivery records Expo send tickets and receipt outcomes", () => {
  const notifications = readFileSync(new URL("../convex/notifications.ts", import.meta.url), "utf8");
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  assert.match(notifications, /deliverPushForNotification/);
  assert.match(notifications, /checkExpoPushReceipts/);
  assert.match(notifications, /push\/getReceipts/);
  assert.match(schema, /receipt_ok/);
  assert.match(schema, /by_ticket/);
});

test("approved paralegal profiles activate assignable user access", () => {
  const users = readFileSync(new URL("../convex/users.ts", import.meta.url), "utf8");
  const formSubmissions = readFileSync(new URL("../convex/formSubmissions.ts", import.meta.url), "utf8");
  const paralegals = readFileSync(new URL("../convex/paralegals.ts", import.meta.url), "utf8");
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");

  assert.match(users, /getApprovedParalegalProfileByEmail/);
  assert.match(users, /role:\s*approvedParalegalProfile\s*\?\s*"paralegal"\s*:\s*"user"/);
  assert.match(formSubmissions, /activateParalegalRoleForUser/);
  assert.match(paralegals, /activateParalegalRoleForUser/);
  assert.match(formSubmissions, /isVerified:\s*args\.status\s*===\s*"approved"\s*\?\s*true/);
  assert.match(caseManagement, /withIndex\("by_role_status",\s*\(q\)\s*=>\s*q\.eq\("role",\s*"paralegal"\)\.eq\("status",\s*"active"\)\)/);
  assert.match(caseManagement, /legacyParalegalUsers/);
});

test("public paralegal directory uses a safe projection and governed matching UX", () => {
  const paralegals = readFileSync(new URL("../convex/paralegals.ts", import.meta.url), "utf8");
  const adminParalegals = readFileSync(new URL("../src/components/admin/AdminParalegals.tsx", import.meta.url), "utf8");
  const mobileFinder = readFileSync(new URL("../mobile/app/paralegals.tsx", import.meta.url), "utf8");
  const projection = paralegals.slice(paralegals.indexOf("return paralegals.map"));

  assert.match(paralegals, /includePrivate:\s*v\.optional\(v\.boolean\(\)\)/);
  assert.match(paralegals, /if \(includePrivate\) \{/);
  assert.match(paralegals, /requireAnyRole\(ctx,\s*\["admin",\s*"staff"\]\)/);
  assert.match(paralegals, /return paralegals\.map\(\(paralegal\) => \(\{/);
  assert.doesNotMatch(projection, /email:\s*paralegal\.email/);
  assert.doesNotMatch(projection, /idDocumentUrl:\s*paralegal\.idDocumentUrl/);
  assert.doesNotMatch(projection, /resumeUrl:\s*paralegal\.resumeUrl/);
  assert.match(adminParalegals, /includePrivate:\s*true/);
  assert.match(mobileFinder, /Need LSF to match you/);
  assert.match(mobileFinder, /Why this may fit/);
  assert.match(mobileFinder, /Let LSF match me/);
  assert.match(mobileFinder, /For sensitive cases/);
});

test("intake captures preferred support language for staff routing and matching", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const legalHelp = readFileSync(new URL("../convex/legalHelp.ts", import.meta.url), "utf8");
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const intakeDraft = readFileSync(new URL("../mobile/src/intake/IntakeDraftContext.tsx", import.meta.url), "utf8");
  const mobileIntake = readFileSync(new URL("../mobile/app/intake.tsx", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");

  assert.match(schema, /preferredLanguage:\s*v\.optional\(v\.union\(/);
  assert.match(schema, /preferredLanguageOther:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(legalHelp, /preferredLanguageValidator/);
  assert.match(legalHelp, /preferredLanguage:\s*args\.preferredLanguage/);
  assert.match(legalHelp, /preferredLanguageOther:\s*normalizeOptionalText\(args\.preferredLanguageOther/);
  assert.match(legalHelp, /!request\.preferredLanguage/);
  assert.match(legalHelp, /request\.preferredLanguage === "other" && !request\.preferredLanguageOther/);
  assert.match(intakeDraft, /preferredLanguage:\s*"sw" \| "en" \| "both" \| "other"/);
  assert.match(intakeDraft, /preferredLanguageOther:\s*string/);
  assert.match(mobileIntake, /Preferred support language/);
  assert.match(mobileIntake, /preferredLanguage:\s*draft\.preferredLanguage/);
  assert.match(mobileIntake, /preferredLanguageOther:\s*draft\.preferredLanguageOther/);
  assert.match(mobileIntake, /Enter language/);
  assert.match(staffDashboard, /Support language/);
  assert.match(staffDashboard, /preferredLanguageOther/);
  assert.match(caseManagement, /language fit:/);
  assert.match(caseManagement, /profile\?\.languages/);
  assert.match(caseManagement, /preferredLanguageOther/);
});

test("provider availability informs assignment fit without exposing staff notes publicly", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const paralegals = readFileSync(new URL("../convex/paralegals.ts", import.meta.url), "utf8");
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const profileEdit = readFileSync(new URL("../src/components/paralegal/ParalegalProfileEdit.tsx", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");
  const providerDashboard = readFileSync(new URL("../src/pages/ParalegalDashboard.tsx", import.meta.url), "utf8");
  const mobileFinder = readFileSync(new URL("../mobile/app/paralegals.tsx", import.meta.url), "utf8");
  const projection = paralegals.slice(paralegals.indexOf("return paralegals.map"));

  assert.match(schema, /availabilityStatus:\s*v\.optional\(v\.union\(/);
  assert.match(schema, /weeklyCapacity:\s*v\.optional\(v\.number\(\)\)/);
  assert.match(schema, /workingHours:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(schema, /availabilityNotes:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(paralegals, /availabilityStatus:\s*paralegal\.availabilityStatus \?\? "accepting_cases"/);
  assert.doesNotMatch(projection, /availabilityNotes:\s*paralegal\.availabilityNotes/);
  assert.match(paralegals, /Math\.max\(0,\s*Math\.min\(50,\s*Math\.floor\(updates\.weeklyCapacity\)\)\)/);
  assert.match(caseManagement, /remainingCapacity/);
  assert.match(caseManagement, /paused new cases/);
  assert.match(caseManagement, /unavailable for new cases/);
  assert.match(profileEdit, /Availability for new Haki Yangu cases/);
  assert.match(profileEdit, /weeklyCapacity/);
  assert.match(staffDashboard, /declared availability/);
  assert.match(staffDashboard, /availabilityNotes/);
  assert.match(providerDashboard, /case\/week capacity/);
  assert.match(mobileFinder, /availabilityLabel/);
  assert.match(mobileFinder, /Accepting new requests/);
});

test("paused provider assignment requires an audited staff override reason", () => {
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/60-assignment-availability-override-control.md", import.meta.url), "utf8");

  assert.match(caseManagement, /requireAssignableAvailability/);
  assert.match(caseManagement, /availabilityOverrideReason:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(caseManagement, /availabilityStatus === "paused" \|\| availabilityStatus === "unavailable"/);
  assert.match(caseManagement, /Record an override reason before sending the offer/);
  assert.match(caseManagement, /metadata:\s*\{ assignmentId, assigneeId: args\.assigneeId, expiresAt, \.\.\.availability \}/);
  assert.match(caseManagement, /metadata:\s*\{ assignmentId, endedAssigneeIds: \[\.\.\.endedAssigneeIds\], \.\.\.availability \}/);
  assert.match(caseManagement, /assignment\.offered",\s*"case_assignment",\s*assignmentId,\s*\{ caseId: args\.caseId, \.\.\.availability \}/);
  assert.match(caseManagement, /\.\.\.availability,\s*\n\s*\}\);/);
  assert.match(staffDashboard, /assignmentOverrideReason/);
  assert.match(staffDashboard, /reassignmentOverrideReason/);
  assert.match(staffDashboard, /requiresAvailabilityOverride/);
  assert.match(staffDashboard, /paused or unavailable provider/);
  assert.match(staffDashboard, /availabilityStatus \?\? "accepting_cases"\)\.replaceAll/);
  assert.match(phaseNote, /backend enforces the rule/i);
  assert.match(phaseNote, /audit records include/);
});

test("staff assignment monitor exposes response timing and availability override history", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/61-assignment-history-visibility.md", import.meta.url), "utf8");

  assert.match(schema, /availabilityStatus:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(schema, /availabilityOverrideReason:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(caseManagement, /availabilityStatus:\s*availability\.availabilityStatus/);
  assert.match(caseManagement, /availabilityOverrideReason:\s*availability\.availabilityOverrideReason/);
  assert.match(caseManagement, /history:\s*\{/);
  assert.match(caseManagement, /responseHours/);
  assert.match(caseManagement, /offerAgeHours/);
  assert.match(caseManagement, /isOverdue/);
  assert.match(staffDashboard, /Availability at offer/);
  assert.match(staffDashboard, /Response evidence/);
  assert.match(staffDashboard, /Availability override:/);
  assert.match(staffDashboard, /item\.history\.responseHours/);
  assert.match(phaseNote, /Who was offered the case/);
  assert.match(phaseNote, /response duration/i);
});

test("case detail exposes assignment history to workers without beneficiary leakage", () => {
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");
  const providerDashboard = readFileSync(new URL("../src/pages/ParalegalDashboard.tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/62-case-level-assignment-history.md", import.meta.url), "utf8");

  assert.match(caseManagement, /const assignmentRows = isBeneficiary\s*\?\s*\[\]/);
  assert.match(caseManagement, /assignmentHistory = await Promise\.all/);
  assert.match(caseManagement, /assigneeName/);
  assert.match(caseManagement, /offeredByName/);
  assert.match(caseManagement, /availabilityOverrideReason/);
  assert.match(caseManagement, /return \{ case: access\.caseRecord, events: visibleEvents, appointments, outcome, feedback, reviewRequests, assignmentHistory, closureReadiness \}/);
  assert.match(staffDashboard, /Assignment history/);
  assert.match(staffDashboard, /caseDetail\.assignmentHistory\.map/);
  assert.match(staffDashboard, /Override:/);
  assert.match(providerDashboard, /Assignment history/);
  assert.match(providerDashboard, /caseDetail\.assignmentHistory\.map/);
  assert.match(phaseNote, /Beneficiar.*empty assignment-history array/i);
});

test("appointment lifecycle is auditable and visible across worker and mobile surfaces", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const crons = readFileSync(new URL("../convex/crons.ts", import.meta.url), "utf8");
  const notifications = readFileSync(new URL("../convex/notifications.ts", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");
  const providerDashboard = readFileSync(new URL("../src/pages/ParalegalDashboard.tsx", import.meta.url), "utf8");
  const mobileCase = readFileSync(new URL("../mobile/app/case/[id].tsx", import.meta.url), "utf8");
  const mobileNotifications = readFileSync(new URL("../mobile/app/notifications.tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/63-appointment-lifecycle-quality.md", import.meta.url), "utf8");

  assert.match(schema, /statusNote:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(schema, /statusUpdatedBy:\s*v\.optional\(v\.id\("users"\)\)/);
  assert.match(schema, /statusUpdatedAt:\s*v\.optional\(v\.number\(\)\)/);
  assert.match(schema, /reminderSentAt:\s*v\.optional\(v\.number\(\)\)/);
  assert.match(schema, /by_status_start/);
  assert.match(caseManagement, /updateAppointmentStatus/);
  assert.match(caseManagement, /Only scheduled appointments can be updated/);
  assert.match(caseManagement, /type:\s*`appointment_\$\{args\.status\}`/);
  assert.match(caseManagement, /type:\s*"appointment\.changed"/);
  assert.match(caseManagement, /writeAudit\(ctx,\s*user\._id,\s*`appointment\.\$\{args\.status\}`/);
  assert.match(caseManagement, /sendUpcomingAppointmentReminders/);
  assert.match(caseManagement, /APPOINTMENT_REMINDER_WINDOW_MS/);
  assert.match(caseManagement, /type:\s*"appointment\.reminder"/);
  assert.match(caseManagement, /reminderSentAt:\s*now/);
  assert.match(crons, /send Haki Yangu appointment reminders/);
  assert.match(notifications, /"appointment\.changed"/);
  assert.match(notifications, /"appointment\.reminder"/);
  assert.match(providerDashboard, /changeAppointmentStatus/);
  assert.match(providerDashboard, /Complete/);
  assert.match(providerDashboard, /No-show/);
  assert.match(staffDashboard, /Appointment lifecycle/);
  assert.match(staffDashboard, /statusUpdatedAt/);
  assert.match(mobileCase, /appointment_completed/);
  assert.match(mobileCase, /appointmentStatusLabels/);
  assert.match(mobileCase, /appointment\.statusNote/);
  assert.match(mobileNotifications, /"appointment\.changed"/);
  assert.match(mobileNotifications, /"appointment\.reminder"/);
  assert.match(phaseNote, /Provider\/staff appointment completion/i);
  assert.match(phaseNote, /within 24 hours/i);
});

test("deactivated Haki Yangu profiles are not silently restored", () => {
  const users = readFileSync(new URL("../convex/users.ts", import.meta.url), "utf8");

  assert.match(users, /deactivateMyProfile/);
  assert.match(users, /existingUser\.isDeleted/);
  assert.match(users, /has been deactivated/);
  assert.match(users, /q\.neq\(q\.field\("isDeleted"\),\s*true\)/);
  assert.match(users, /role_assignments/);
  assert.match(users, /status:\s*"revoked"/);
});

test("beneficiary case review requests are routed through staff without notifying assigned workers with details", () => {
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const mobileCase = readFileSync(new URL("../mobile/app/case/[id].tsx", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");

  assert.match(schema, /case_review_requests/);
  assert.match(caseManagement, /requestCaseReview/);
  assert.match(caseManagement, /staffReviewRequests/);
  assert.match(caseManagement, /resolveCaseReviewRequest/);
  assert.match(caseManagement, /type:\s*"case_review_requested"/);
  assert.match(caseManagement, /audience:\s*"beneficiary"/);
  assert.match(caseManagement, /notifySupervisors/);
  assert.doesNotMatch(caseManagement, /type:\s*"case_review_requested"[\s\S]{0,220}audience:\s*"all"/);
  assert.match(mobileCase, /requestCaseReviewMutation/);
  assert.match(mobileCase, /not directly to your assigned helper/);
  assert.match(staffDashboard, /staffReviewRequests/);
  assert.match(staffDashboard, /Case review and reassignment requests/);
});

test("staff reassignment ends current access and creates a replacement offer", () => {
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const lifecycle = readFileSync(new URL("../convex/lib/caseLifecycle.ts", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");

  assert.match(caseManagement, /reassignCase/);
  assert.match(caseManagement, /status:\s*nextStatus/);
  assert.match(caseManagement, /status:\s*"inactive"/);
  assert.match(caseManagement, /status:\s*"offered"/);
  assert.match(caseManagement, /assertCaseTransition\(caseRecord\.status,\s*"assignment_pending"\)/);
  assert.match(caseManagement, /type:\s*"assignment_reassigned"/);
  assert.match(caseManagement, /type:\s*"assignment\.ended"/);
  assert.match(caseManagement, /resolutionNote:\s*normalizeOptionalText\(args\.resolutionNote/);
  assert.match(caseManagement, /assignment\.reassigned/);
  assert.match(lifecycle, /assigned:\s*\["assignment_pending"/);
  assert.match(staffDashboard, /reassignCase/);
  assert.match(staffDashboard, /Load matching evidence/);
  assert.match(staffDashboard, /Staff resolution note/);
  assert.match(staffDashboard, /Reassign and offer/);
});

test("assignment offers expire automatically and cannot be accepted after expiry", () => {
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const crons = readFileSync(new URL("../convex/crons.ts", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");
  const providerDashboard = readFileSync(new URL("../src/pages/ParalegalDashboard.tsx", import.meta.url), "utf8");

  assert.match(schema, /expiresAt:\s*v\.optional\(v\.number\(\)\)/);
  assert.match(schema, /by_status_expires/);
  assert.match(caseManagement, /ASSIGNMENT_OFFER_EXPIRY_MS/);
  assert.match(caseManagement, /expiresAt:\s*assignmentOfferExpiresAt\(now\)/);
  assert.match(caseManagement, /expireStaleAssignmentOffers/);
  assert.match(caseManagement, /Assignment offer has expired/);
  assert.match(caseManagement, /type:\s*"assignment_expired"/);
  assert.match(caseManagement, /type:\s*"assignment\.expired"/);
  assert.match(crons, /expire stale Haki Yangu assignment offers/);
  assert.match(staffDashboard, /Assignment offer monitor/);
  assert.match(staffDashboard, /Expire stale offers now/);
  assert.match(providerDashboard, /Response window/);
});

test("final case closure requires outcome, safe summary, document review, and feedback request", () => {
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");
  const providerDashboard = readFileSync(new URL("../src/pages/ParalegalDashboard.tsx", import.meta.url), "utf8");

  assert.match(caseManagement, /getClosureReadiness/);
  assert.match(caseManagement, /outcomeRecorded/);
  assert.match(caseManagement, /beneficiarySafeSummary/);
  assert.match(caseManagement, /documentsReviewed/);
  assert.match(caseManagement, /feedbackRequested/);
  assert.match(caseManagement, /Case is not ready to close/);
  assert.match(caseManagement, /type:\s*"feedback_requested"/);
  assert.match(staffDashboard, /Closure readiness/);
  assert.match(staffDashboard, /Final close is blocked/);
  assert.match(providerDashboard, /Closure readiness/);
  assert.match(providerDashboard, /Final close is blocked/);
});

test("beneficiary mobile closure experience shows outcome, feedback request, and submitted feedback", () => {
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const mobileCase = readFileSync(new URL("../mobile/app/case/[id].tsx", import.meta.url), "utf8");

  assert.match(caseManagement, /Feedback opens after a case outcome is recorded/);
  assert.match(caseManagement, /caseRecord\.beneficiaryId !== user\._id/);
  assert.match(mobileCase, /closureCopy/);
  assert.match(mobileCase, /Case closed/);
  assert.match(mobileCase, /Case outcome/);
  assert.match(mobileCase, /feedback_requested/);
  assert.match(mobileCase, /Your feedback goes to LSF to improve service quality/);
  assert.match(mobileCase, /details\.feedback!\.rating/);
  assert.match(mobileCase, /feedbackQuote/);
});

test("mobile offline queue stores sensitive pending case actions securely", () => {
  const pendingActions = readFileSync(new URL("../mobile/src/pendingActions.ts", import.meta.url), "utf8");
  const mobileCase = readFileSync(new URL("../mobile/app/case/[id].tsx", import.meta.url), "utf8");
  const offlineScreen = readFileSync(new URL("../mobile/app/offline.tsx", import.meta.url), "utf8");

  assert.match(pendingActions, /expo-secure-store/);
  assert.match(pendingActions, /WHEN_UNLOCKED_THIS_DEVICE_ONLY/);
  assert.match(pendingActions, /MAX_PENDING_ACTIONS\s*=\s*25/);
  assert.match(pendingActions, /case_message/);
  assert.match(pendingActions, /appointment_request/);
  assert.match(pendingActions, /case_review_request/);
  assert.match(pendingActions, /case_feedback/);
  assert.match(pendingActions, /shouldQueueError/);
  assert.match(mobileCase, /enqueuePendingAction/);
  assert.match(mobileCase, /clientMessageId/);
  assert.match(mobileCase, /Try syncing now/);
  assert.match(offlineScreen, /Pending sync/);
  assert.match(offlineScreen, /Uploading documents/);
});

test("mobile demand-letter builder provides an offline practical document tool", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../mobile/app/_layout.tsx", import.meta.url), "utf8");
  const home = readFileSync(new URL("../mobile/app/(tabs)/index.tsx", import.meta.url), "utf8");
  const resourceDetail = readFileSync(new URL("../mobile/app/resource/[id].tsx", import.meta.url), "utf8");
  const letterBuilder = readFileSync(new URL("../mobile/app/letter-builder.tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/64-mobile-demand-letter-builder.md", import.meta.url), "utf8");

  assert.match(schema, /textContent:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(schema, /source:\s*v\.optional\(v\.union\(v\.literal\("upload"\),\s*v\.literal\("letter_builder"\)/);
  assert.match(caseManagement, /addGeneratedLetterDocument/);
  assert.match(caseManagement, /source:\s*"letter_builder"/);
  assert.match(caseManagement, /case_document\.generated_letter/);
  assert.match(security, /\["caseManagement\.addGeneratedLetterDocument",\s*"case-access"\]/);
  assert.match(layout, /letter-builder/);
  assert.match(home, /Demand letter/);
  assert.match(home, /router\.push\("\/letter-builder"\)/);
  assert.match(resourceDetail, /resource\.id === "demand-letter"/);
  assert.match(resourceDetail, /Build a demand letter/);
  assert.match(letterBuilder, /Share\.share/);
  assert.match(letterBuilder, /expo-secure-store/);
  assert.match(letterBuilder, /WHEN_UNLOCKED_THIS_DEVICE_ONLY/);
  assert.match(letterBuilder, /Save secure draft/);
  assert.match(letterBuilder, /Delete draft/);
  assert.match(letterBuilder, /Attach draft to case/);
  assert.match(letterBuilder, /api\.caseManagement\.myCases/);
  assert.match(letterBuilder, /addGeneratedLetterDocument/);
  assert.match(letterBuilder, /ready to share it with your case team/);
  assert.match(letterBuilder, /REQUEST TO RESOLVE A LEGAL ISSUE/);
  assert.match(letterBuilder, /I need help with this letter/);
  assert.match(letterBuilder, /plain-language draft/);
  assert.match(phaseNote, /offline-capable/i);
  assert.match(phaseNote, /SecureStore/i);
});

test("mobile document checker gives pre-signing guidance without silent upload", () => {
  const layout = readFileSync(new URL("../mobile/app/_layout.tsx", import.meta.url), "utf8");
  const home = readFileSync(new URL("../mobile/app/(tabs)/index.tsx", import.meta.url), "utf8");
  const documentChecker = readFileSync(new URL("../mobile/app/document-checker.tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/65-mobile-document-checker.md", import.meta.url), "utf8");

  assert.match(layout, /document-checker/);
  assert.match(home, /Document check/);
  assert.match(home, /router\.push\("\/document-checker"\)/);
  assert.match(documentChecker, /expo-document-picker/);
  assert.match(documentChecker, /copyToCacheDirectory:\s*false/);
  assert.match(documentChecker, /The document is not uploaded unless you start a help request/);
  assert.match(documentChecker, /generateDocumentUploadUrl/);
  assert.match(documentChecker, /addDocument/);
  assert.match(documentChecker, /Attach document to case/);
  assert.match(documentChecker, /ready to share this file with your case team/);
  assert.match(documentChecker, /category:\s*"contract"/);
  assert.match(documentChecker, /Before signing, check/);
  assert.match(documentChecker, /Stop and ask if/);
  assert.match(documentChecker, /Request document review help/);
  assert.match(phaseNote, /no silent upload/i);
});

test("mobile my-documents library is backed by scoped case documents", () => {
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../mobile/app/_layout.tsx", import.meta.url), "utf8");
  const home = readFileSync(new URL("../mobile/app/(tabs)/index.tsx", import.meta.url), "utf8");
  const profile = readFileSync(new URL("../mobile/app/(tabs)/profile.tsx", import.meta.url), "utf8");
  const documents = readFileSync(new URL("../mobile/app/documents.tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/66-mobile-my-documents-library.md", import.meta.url), "utf8");

  assert.match(caseManagement, /myDocuments/);
  assert.match(caseManagement, /withIndex\("by_beneficiary"/);
  assert.match(caseManagement, /withIndex\("by_user"/);
  assert.match(caseManagement, /withIndex\("by_case"/);
  assert.match(caseManagement, /casePublicId/);
  assert.match(caseManagement, /ctx\.storage\.getUrl\(document\.storageId\)/);
  assert.match(security, /\["caseManagement\.myDocuments",\s*"authenticated"\]/);
  assert.match(layout, /documents/);
  assert.match(home, /My documents/);
  assert.match(profile, /My documents/);
  assert.match(documents, /api\.caseManagement\.myDocuments/);
  assert.match(documents, /Linking\.openURL/);
  assert.match(documents, /document\.textContent/);
  assert.match(documents, /reviewNotes/);
  assert.match(phaseNote, /cross-case document library/i);
});

test("mobile my-appointments list is backed by scoped case appointments", () => {
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../mobile/app/_layout.tsx", import.meta.url), "utf8");
  const home = readFileSync(new URL("../mobile/app/(tabs)/index.tsx", import.meta.url), "utf8");
  const profile = readFileSync(new URL("../mobile/app/(tabs)/profile.tsx", import.meta.url), "utf8");
  const appointments = readFileSync(new URL("../mobile/app/appointments.tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/67-mobile-my-appointments-list.md", import.meta.url), "utf8");

  assert.match(caseManagement, /myAppointments/);
  assert.match(caseManagement, /withIndex\("by_beneficiary"/);
  assert.match(caseManagement, /withIndex\("by_user"/);
  assert.match(caseManagement, /withIndex\("by_case"/);
  assert.match(caseManagement, /casePublicId/);
  assert.match(caseManagement, /a\.status === "scheduled"/);
  assert.match(security, /\["caseManagement\.myAppointments",\s*"authenticated"\]/);
  assert.match(layout, /appointments/);
  assert.match(home, /My appointments/);
  assert.match(profile, /My appointments/);
  assert.match(appointments, /api\.caseManagement\.myAppointments/);
  assert.match(appointments, /upcomingCount/);
  assert.match(appointments, /statusNote/);
  assert.match(appointments, /router\.push\(\{ pathname: "\/case\/\[id\]"/);
  assert.match(phaseNote, /standalone appointment list/i);
});

test("mobile release documentation identifies required environment and device QA gates", () => {
  const readme = readFileSync(new URL("../mobile/README.md", import.meta.url), "utf8");
  const appConfig = readFileSync(new URL("../mobile/app.config.js", import.meta.url), "utf8");
  const appJson = readFileSync(new URL("../mobile/app.json", import.meta.url), "utf8");
  const easJson = readFileSync(new URL("../mobile/eas.json", import.meta.url), "utf8");
  const mobilePackage = readFileSync(new URL("../mobile/package.json", import.meta.url), "utf8");
  const envCheck = readFileSync(new URL("../mobile/scripts/check-env.mjs", import.meta.url), "utf8");
  const mobileConfig = readFileSync(new URL("../mobile/src/config.ts", import.meta.url), "utf8");
  const rootLayout = readFileSync(new URL("../mobile/app/_layout.tsx", import.meta.url), "utf8");

  assert.match(readme, /EXPO_PUBLIC_CONVEX_URL/);
  assert.match(readme, /EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY/);
  assert.match(readme, /EXPO_PUBLIC_EAS_PROJECT_ID/);
  assert.match(readme, /npm run env:check/);
  assert.match(readme, /Manual device QA checklist/);
  assert.match(readme, /push token registration/);
  assert.match(readme, /SecureStore intake draft and pending queue persistence/);
  assert.match(readme, /screen-capture protection/);
  assert.match(appConfig, /VITE_CONVEX_URL/);
  assert.match(appConfig, /pk_test_/);
  assert.match(appJson, /org\.lsftz\.hakiyangu/);
  assert.match(easJson, /appVersionSource/);
  assert.match(mobilePackage, /"env:check":\s*"node scripts\/check-env\.mjs"/);
  assert.match(envCheck, /EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY/);
  assert.match(envCheck, /pk_\(test\|live\)_/);
  assert.match(envCheck, /Mobile environment is not ready for QR\/device sign-in testing/);
  assert.match(mobileConfig, /configDiagnostics/);
  assert.match(mobileConfig, /missingRequiredConfig/);
  assert.match(mobileConfig, /EXPO_PUBLIC_EAS_PROJECT_ID/);
  assert.match(rootLayout, /ConfigurationRequired/);
  assert.match(rootLayout, /Missing required/);
  assert.match(rootLayout, /npm run env:check/);
});

test("mobile prototype review mode exposes mock screen navigation without weakening production auth", () => {
  const appConfig = readFileSync(new URL("../mobile/app.config.js", import.meta.url), "utf8");
  const mobileConfig = readFileSync(new URL("../mobile/src/config.ts", import.meta.url), "utf8");
  const packageJson = readFileSync(new URL("../mobile/package.json", import.meta.url), "utf8");
  const rootLayout = readFileSync(new URL("../mobile/app/_layout.tsx", import.meta.url), "utf8");
  const prototype = readFileSync(new URL("../mobile/src/prototype/PrototypeApp.tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/68-mobile-prototype-review-mode.md", import.meta.url), "utf8");

  assert.match(appConfig, /EXPO_PUBLIC_PROTOTYPE_MODE/);
  assert.match(mobileConfig, /prototypeMode/);
  assert.match(packageJson, /"prototype":\s*"EXPO_PUBLIC_PROTOTYPE_MODE=1 expo start --web"/);
  assert.match(rootLayout, /appConfig\.prototypeMode/);
  assert.match(rootLayout, /<PrototypeApp \/>/);
  assert.match(rootLayout, /requiredConfigReady/);
  assert.match(prototype, /Prototype review mode/);
  assert.match(prototype, /Splash/);
  assert.match(prototype, /Guided intake/);
  assert.match(prototype, /SARA assistant/);
  assert.match(prototype, /Document checker/);
  assert.match(prototype, /Letter builder/);
  assert.match(prototype, /Appointments/);
  assert.match(phaseNote, /does not replace real device QA/i);
});

test("referral graph connects staff creation, provider response, and beneficiary visibility", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const referrals = readFileSync(new URL("../convex/referrals.ts", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");
  const providerDashboard = readFileSync(new URL("../src/pages/ParalegalDashboard.tsx", import.meta.url), "utf8");
  const mobileCase = readFileSync(new URL("../mobile/app/case/[id].tsx", import.meta.url), "utf8");

  assert.match(schema, /referrals:\s*defineTable/);
  assert.match(schema, /destinationUserId:\s*v\.optional\(v\.id\("users"\)\)/);
  assert.match(schema, /by_destination_user_status/);
  assert.match(schema, /referral_events:\s*defineTable/);
  assert.match(referrals, /createForCase/);
  assert.match(referrals, /destinationUserId:\s*v\.optional\(v\.id\("users"\)\)/);
  assert.match(referrals, /getActiveRoles\(ctx,\s*destinationUser\._id\)/);
  assert.match(referrals, /myDestinationQueue/);
  assert.match(referrals, /respondAsDestination/);
  assert.match(referrals, /requireAnyRole\(ctx,\s*\["paralegal",\s*"provider_staff"\]\)/);
  assert.match(referrals, /referral\.destinationUserId !== user\._id/);
  assert.match(security, /\["referrals\.myDestinationQueue",\s*"service-provider"\]/);
  assert.match(security, /\["referrals\.respondAsDestination",\s*"service-provider"\]/);
  assert.match(staffDashboard, /Create service referral/);
  assert.match(staffDashboard, /destinationUserId:\s*referralDestinationUserId/);
  assert.match(staffDashboard, /minimum information/);
  assert.match(providerDashboard, /Referral inbox/);
  assert.match(providerDashboard, /api\.referrals\.myDestinationQueue/);
  assert.match(providerDashboard, /api\.referrals\.respondAsDestination/);
  assert.match(providerDashboard, /Accept referral/);
  assert.match(providerDashboard, /Return to LSF/);
  assert.match(mobileCase, /Referrals/);
  assert.match(mobileCase, /api\.referrals\.listForCase/);
  assert.match(mobileCase, /Information shared/);
});
