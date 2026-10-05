import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { assertCaseTransition, caseTransitions } from "../convex/lib/caseLifecycle.ts";
import { hasCurrentServiceReview, isReferralOrganisationBlocked, isServiceReviewOverdue, referralStatusAfterOrganisationChange, requireActiveReferralReadiness, requireDirectoryDecisionReason, requireDraftOrganisation, requireDraftService, requireIndependentDirectoryReviewer, requireLinkedCorrectionUpdate } from "../convex/lib/directoryLifecycle.ts";
import { requireReadySourceForApproval } from "../convex/lib/saadaSourceLifecycle.ts";
import { requireIndependentBaseRoleReview, requireRemainingAdministrator } from "../convex/lib/baseRoleLifecycle.ts";
import { requireGuideResubmission } from "../convex/lib/guideLifecycle.ts";
import { canClassifyIndependentParalegal, canUseCaseParticipantRole, canUseScopedCaseAffiliation, requireIndependentLegacyScopeReview } from "../convex/lib/caseParticipantAccess.ts";
import { countDistinctReferralTransitions, summarizeTriage } from "../convex/lib/journeyMetrics.ts";
import { prepareSaadaHistory } from "../convex/lib/saadaConversation.ts";
import { noSourceResponse } from "../convex/lib/saadaEvidence.ts";
import { isSameCaseRetry } from "../convex/lib/caseRetry.ts";
import { acceptsMatchingIntake, requireMatchingLinkAccess, requireMatchingSource } from "../convex/lib/matchingAccess.ts";
import { allowsCasePushToBeneficiary } from "../convex/lib/safeContact.ts";

test("ordinary matching excludes emergency-only, closed and exhausted services", () => {
  for (const urgency of [undefined, "standard", "urgent"]) {
    assert.equal(acceptsMatchingIntake("emergency_only", urgency, 2), false);
    assert.equal(acceptsMatchingIntake("open", urgency, 2), true);
    assert.equal(acceptsMatchingIntake("limited", urgency), true);
  }
  assert.equal(acceptsMatchingIntake("emergency_only", "immediate_safety", 2), true);
  for (const state of ["open", "limited", "closed", "emergency_only"]) {
    assert.equal(acceptsMatchingIntake(state, "immediate_safety", 0), false);
  }
  assert.equal(acceptsMatchingIntake("closed", "immediate_safety", 2), false);
});

test("case push delivery honors the beneficiary's safe-contact choice", () => {
  for (const method of [undefined, "none", "in_app"]) assert.equal(allowsCasePushToBeneficiary(method), false);
  for (const method of ["phone", "sms", "email"]) assert.equal(allowsCasePushToBeneficiary(method), true);
  const backend = readFileSync(new URL("../convex/notifications.ts", import.meta.url), "utf8");
  assert.match(backend, /recipient\.isDeleted/);
  assert.match(backend, /caseRecord\?\.beneficiaryId === notification\.userId/);
  assert.match(backend, /request\?\.ownerId === notification\.userId && !allowsCasePushToBeneficiary\(request\.safeContactMethod\)/);
  const expoPayload = backend.slice(backend.indexOf('fetch("https://exp.host/--/api/v2/push/send"'), backend.indexOf('const result = await response.json()'));
  assert.match(expoPayload, /notificationId: notification\._id/);
  assert.doesNotMatch(expoPayload, /resourceId: notification\.resourceId|resourceType: notification\.resourceType/);
});

test("external push needs account opt-in and the mobile inbox remains complete", () => {
  const backend = readFileSync(new URL("../convex/notifications.ts", import.meta.url), "utf8");
  const settings = readFileSync(new URL("../mobile/app/notification-settings.tsx", import.meta.url), "utf8");
  const inbox = readFileSync(new URL("../mobile/app/notifications.tsx", import.meta.url), "utf8");
  const registration = readFileSync(new URL("../mobile/src/usePushNotifications.ts", import.meta.url), "utf8");
  const signOut = readFileSync(new URL("../mobile/src/useSafeSignOut.ts", import.meta.url), "utf8");
  assert.match(backend, /pushEnabled: false/);
  assert.match(backend, /mergedPreferences\.pushEnabled !== true/);
  assert.match(backend, /args\.enabled && preferences\?\.pushEnabled !== true/);
  assert.match(backend, /export const disableMyPushTokens = mutation/);
  assert.match(backend, /type\.startsWith\("referral\."\)/);
  assert.match(settings, /updatePushEnabled/);
  assert.match(inbox, /const visibleNotifications = notifications;/);
  assert.doesNotMatch(registration, /requestPermissionsAsync/);
  assert.match(signOut, /await disableMyPushTokens\(\{\}\);\s*await signOut\(\);/);
});

test("web roles can reach the shared authenticated notification inbox", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const page = readFileSync(new URL("../src/pages/NotificationCenter.tsx", import.meta.url), "utf8");
  const staff = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");
  const provider = readFileSync(new URL("../src/pages/ParalegalDashboard.tsx", import.meta.url), "utf8");
  assert.match(app, /path="\/notifications" element=\{<ProtectedRoute><NotificationCenter\s*\/><\/ProtectedRoute>\}/);
  assert.match(page, /api\.notifications\.inbox/);
  assert.match(page, /api\.notifications\.markRead/);
  assert.match(page, /api\.notifications\.getPreferences/);
  assert.match(page, /api\.notifications\.setPushEnabled/);
  assert.match(staff, /to="\/notifications"/);
  assert.match(provider, /to="\/notifications"/);
});

test("public matching cannot forge staff provenance or attach another person's request or case", () => {
  assert.doesNotThrow(() => requireMatchingSource("directory", false));
  assert.throws(() => requireMatchingSource("staff", false));
  assert.throws(() => requireMatchingSource("saada", true));
  const ownRequest = { actorId: "user-a", requestOwnerId: "user-a", isStaff: false, canAccessCase: false };
  assert.doesNotThrow(() => requireMatchingLinkAccess(ownRequest));
  assert.throws(() => requireMatchingLinkAccess({ ...ownRequest, actorId: "user-b" }));
  assert.throws(() => requireMatchingLinkAccess({ ...ownRequest, actorId: undefined }));
  assert.doesNotThrow(() => requireMatchingLinkAccess({ ...ownRequest, actorId: "staff", isStaff: true }));
  assert.throws(() => requireMatchingLinkAccess({ actorId: "user-a", caseBeneficiaryId: "user-a", isStaff: false, canAccessCase: false }));
  assert.throws(() => requireMatchingLinkAccess({ actorId: "user-a", caseBeneficiaryId: "user-a", isStaff: false, canAccessCase: true, requestId: "request-a", caseSourceRequestId: "request-b" }));
  const backend = readFileSync(new URL("../convex/justiceServices.ts", import.meta.url), "utf8");
  assert.match(backend, /if \(args\.caseId\) await requireCaseAccess\(ctx, args\.caseId\)/);
  assert.match(backend, /requestOwnerId: request\?\.ownerId/);
  assert.match(backend, /args\.requestId \|\| args\.caseId \|\| source === "staff" \? await ctx\.db\.insert\("matching_decisions"/);
});

test("case chat keeps the newest messages and retry keys cannot cross case or content type", () => {
  assert.equal(isSameCaseRetry({ caseId: "case-a", kind: "text" }, { caseId: "case-a", kind: "text" }), true);
  assert.equal(isSameCaseRetry({ caseId: "case-a", kind: "text" }, { caseId: "case-b", kind: "text" }), false);
  assert.equal(isSameCaseRetry({ caseId: "case-a", kind: "voice" }, { caseId: "case-a", kind: "text" }), false);
  const backend = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const listMessages = backend.slice(backend.indexOf("export const listMessages"), backend.indexOf("export const generateVoiceMessageUploadUrl"));
  assert.match(listMessages, /\.order\("desc"\)\s*\.take\(200\)/);
  assert.match(listMessages, /messages\.reverse\(\)/);
  assert.equal((backend.match(/isSameCaseRetry\(/g) ?? []).length, 4);
});

test("Saada does not invent an answer when approved evidence is absent", () => {
  assert.match(noSourceResponse("en", "legal"), /cannot verify a legal answer/);
  assert.match(noSourceResponse("sw", "legal"), /Siwezi kuthibitisha/);
  assert.match(noSourceResponse("en", "services", 2), /No referral has been sent/);
  assert.match(noSourceResponse("en", "services", 0), /could not find a current verified public match/);
  const action = readFileSync(new URL("../convex/sara_actions.ts", import.meta.url), "utf8");
  assert.match(action, /if \(retrievedSources\.length === 0 && !toolCallBuffer\)/);
  assert.match(action, /if \(retrievedSources\.length === 0\)/);
});

test("saved visit plans do not reveal retired service details or allow new plans when intake is closed", () => {
  const backend = readFileSync(new URL("../convex/justiceServices.ts", import.meta.url), "utf8");
  const mobile = readFileSync(new URL("../mobile/app/service-visit.tsx", import.meta.url), "utf8");
  assert.match(backend, /service && isCurrentPublicService\(service\) \? \{ _id: service\._id, name: service\.name/);
  assert.match(backend, /service\.currentIntakeState === "closed"\) throw new ConvexError/);
  assert.match(mobile, /service\.currentIntakeState !== "closed"/);
});

test("Saada uses stored conversation turns without repeating the current user message", () => {
  const stored = [
    { role: "user", content: "Where can I get help?" },
    { role: "assistant", content: "Which district?" },
    { role: "user", content: "Ilala" },
  ];
  assert.deepEqual(prepareSaadaHistory(stored, "Ilala"), stored.slice(0, 2));
  assert.deepEqual(prepareSaadaHistory(stored, "New question"), stored);
  const action = readFileSync(new URL("../convex/sara_actions.ts", import.meta.url), "utf8");
  assert.match(action, /getRecentHistoryInternal/);
  assert.doesNotMatch(action, /args\.history/);
});

test("triage timing counts older open requests but excludes historic reviews without a timestamp", () => {
  const now = 200_000_000;
  const recent = [
    { status: "under_review", submittedAt: now - 7_200_000, triageStartedAt: now - 3_600_000 },
    { status: "closed", submittedAt: now - 14_400_000, triageStartedAt: now - 3_600_000 },
    { status: "under_review", submittedAt: now - 1_000_000 },
  ];
  const waiting = [
    { status: "submitted", submittedAt: now - 90_000_000 },
    { status: "submitted", submittedAt: now - 2_000_000 },
  ];
  assert.deepEqual(summarizeTriage(recent, waiting, now), {
    startedWithTimestamp: 2,
    averageHoursToStart: 2,
    awaitingStart: 2,
    awaitingOver24Hours: 1,
  });
  assert.equal(summarizeTriage([], [], now).averageHoursToStart, null);
});

test("referral transitions count each referral once per stage", () => {
  const events = [
    { type: "referral_accepted", referralId: "r1" },
    { type: "referral_accepted", referralId: "r1" },
    { type: "referral_accepted", referralId: "r2" },
    { type: "referral_service_delivered", referralId: "r1" },
  ];
  assert.deepEqual(countDistinctReferralTransitions(events, ["referral_accepted", "referral_service_delivered"]), {
    referral_accepted: 2,
    referral_service_delivered: 1,
  });
});

test("base-role change needs independent review and another active administrator", () => {
  assert.throws(() => requireIndependentBaseRoleReview("admin-a", "admin-a", "target"));
  assert.throws(() => requireIndependentBaseRoleReview("admin-a", "target", "target"));
  assert.doesNotThrow(() => requireIndependentBaseRoleReview("admin-a", "admin-b", "target"));
  assert.throws(() => requireRemainingAdministrator("admin-a", ["admin-a", "admin-a"]));
  assert.doesNotThrow(() => requireRemainingAdministrator("admin-a", ["admin-a", "admin-b"]));
});

test("Saada approval requires indexed content and current provenance", () => {
  const now = Date.now();
  const source = { indexingStatus: "ready", processedAt: now, publisher: "Official publisher", jurisdiction: "national", language: "sw", contentCategory: "Law", versionLabel: "2026", reviewDueAt: now + 86_400_000 };
  assert.doesNotThrow(() => requireReadySourceForApproval(source, true, now));
  assert.throws(() => requireReadySourceForApproval({ ...source, indexingStatus: "failed" }, true, now));
  assert.throws(() => requireReadySourceForApproval(source, false, now));
  assert.throws(() => requireReadySourceForApproval({ ...source, reviewDueAt: now }, true, now));
  assert.throws(() => requireReadySourceForApproval({ ...source, publisher: " " }, true, now));
});

test("directory drafts cannot be published at creation", () => {
  assert.doesNotThrow(() => requireDraftOrganisation("draft", "none"));
  assert.doesNotThrow(() => requireDraftService("draft", false));
  assert.throws(() => requireDraftOrganisation("verified", "active"));
  assert.throws(() => requireDraftService("verified", true));
  assert.throws(() => requireDraftService("draft", true));
});

test("directory review requires a different person and a recorded reason", () => {
  assert.throws(() => requireIndependentDirectoryReviewer("creator", "creator"));
  assert.throws(() => requireIndependentDirectoryReviewer("editor", "creator", "editor"));
  assert.doesNotThrow(() => requireIndependentDirectoryReviewer("reviewer", "creator", "editor"));
  assert.throws(() => requireDirectoryDecisionReason("too short"));
  assert.equal(requireDirectoryDecisionReason("Checked public contact and office hours."), "Checked public contact and office hours.");
});

test("public service review dates must exist and be in the future", () => {
  const now = Date.now();
  assert.equal(hasCurrentServiceReview(undefined, now), false);
  assert.equal(hasCurrentServiceReview(now, now), false);
  assert.equal(hasCurrentServiceReview(now - 1, now), false);
  assert.equal(hasCurrentServiceReview(now + 1, now), true);
  assert.equal(isServiceReviewOverdue("verified", undefined, now), true);
  assert.equal(isServiceReviewOverdue("verified", now - 1, now), true);
  assert.equal(isServiceReviewOverdue("verified", now + 1, now), false);
  assert.equal(isServiceReviewOverdue("draft", undefined, now), false);
});

test("rejected public guide resubmission preserves editor and replacement lineage", () => {
  const rejected = { status: "rejected", submittedBy: "editor-a", replacesGuideId: "published-v1" };
  assert.doesNotThrow(() => requireGuideResubmission(rejected, "editor-a", "published-v1"));
  assert.throws(() => requireGuideResubmission(rejected, "editor-b", "published-v1"));
  assert.throws(() => requireGuideResubmission(rejected, "editor-a", undefined));
  assert.throws(() => requireGuideResubmission({ ...rejected, status: "approved" }, "editor-a", "published-v1"));
});

test("provider correction completion requires a linked service edit after submission", () => {
  assert.throws(() => requireLinkedCorrectionUpdate(100, undefined, 200));
  assert.throws(() => requireLinkedCorrectionUpdate(100, 99, 200));
  assert.throws(() => requireLinkedCorrectionUpdate(100, 150, 149));
  assert.doesNotThrow(() => requireLinkedCorrectionUpdate(100, 150, 150));
});

test("referral agreements require verified organisations, safeguarding and a recorded data agreement", () => {
  assert.throws(() => requireActiveReferralReadiness("draft", true, "signed-v1"));
  assert.throws(() => requireActiveReferralReadiness("verified", false, "signed-v1"));
  assert.throws(() => requireActiveReferralReadiness("verified", true, "  "));
  assert.doesNotThrow(() => requireActiveReferralReadiness("verified", true, "signed-v1"));
});

test("suspending or retiring an organisation cannot leave referrals active", () => {
  assert.equal(referralStatusAfterOrganisationChange("suspended", "active"), "suspended");
  assert.equal(referralStatusAfterOrganisationChange("inactive", "active"), "suspended");
  assert.equal(referralStatusAfterOrganisationChange("draft", "active"), "suspended");
  assert.throws(() => referralStatusAfterOrganisationChange("inactive", "active", "active"));
  assert.equal(referralStatusAfterOrganisationChange("verified", "suspended", "active"), "active");
  assert.equal(isReferralOrganisationBlocked("suspended"), true);
  assert.equal(isReferralOrganisationBlocked("inactive"), true);
  assert.equal(isReferralOrganisationBlocked("verified"), false);
});

test("case participation does not survive loss of its professional role", () => {
  assert.equal(canUseCaseParticipantRole("provider_staff", new Set(["provider_staff"])), true);
  assert.equal(canUseCaseParticipantRole("provider_staff", new Set(["beneficiary"])), false);
  assert.equal(canUseCaseParticipantRole("paralegal", new Set(["provider_staff"])), false);
  assert.equal(canUseCaseParticipantRole("case_officer", new Set(["staff"])), true);
  assert.equal(canUseCaseParticipantRole("case_officer", new Set(["beneficiary"])), false);
  assert.equal(canUseScopedCaseAffiliation("verified", true), true);
  assert.equal(canUseScopedCaseAffiliation("suspended", true), false);
  assert.equal(canUseScopedCaseAffiliation("inactive", true), false);
  assert.equal(canUseScopedCaseAffiliation("verified", false), false);
});

test("legacy case scope requires a separate reviewer and only permits true independent paralegals", () => {
  assert.throws(() => requireIndependentLegacyScopeReview("reviewer", "reviewer", "worker"));
  assert.throws(() => requireIndependentLegacyScopeReview("reviewer", "other", "reviewer"));
  assert.doesNotThrow(() => requireIndependentLegacyScopeReview("reviewer", "other", "worker"));
  assert.equal(canClassifyIndependentParalegal("paralegal", "paralegal", false), true);
  assert.equal(canClassifyIndependentParalegal("paralegal", "paralegal", true), false);
  assert.equal(canClassifyIndependentParalegal("provider_staff", "provider_staff", false), false);
});

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

test("reviewed paralegal profiles activate a role and readiness gates assignment", () => {
  const users = readFileSync(new URL("../convex/users.ts", import.meta.url), "utf8");
  const formSubmissions = readFileSync(new URL("../convex/formSubmissions.ts", import.meta.url), "utf8");
  const paralegals = readFileSync(new URL("../convex/paralegals.ts", import.meta.url), "utf8");
  const notifications = readFileSync(new URL("../convex/notifications.ts", import.meta.url), "utf8");
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");

  assert.match(users, /getApprovedParalegalProfileByEmail/);
  assert.match(users, /role:\s*approvedParalegalProfile\s*\?\s*"paralegal"\s*:\s*"user"/);
  assert.match(formSubmissions, /activateParalegalRoleForUser/);
  assert.match(paralegals, /isParalegalReady/);
  assert.match(caseManagement, /requireParalegalReadiness/);
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

test("beneficiary intake persists complete triage context into staff review", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const legalHelp = readFileSync(new URL("../convex/legalHelp.ts", import.meta.url), "utf8");
  const intakeDraft = readFileSync(new URL("../mobile/src/intake/IntakeDraftContext.tsx", import.meta.url), "utf8");
  const mobileIntake = readFileSync(new URL("../mobile/app/intake.tsx", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");

  assert.match(schema, /occurredAt:\s*v\.optional\(v\.number\(\)\)/);
  assert.match(schema, /involvedParties:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(legalHelp, /involvedParties:\s*normalizeOptionalText\(args\.involvedParties/);
  assert.match(intakeDraft, /occurredOn:\s*string/);
  assert.match(intakeDraft, /involvedParties:\s*string/);
  assert.match(mobileIntake, /const TOTAL_STEPS = 8/);
  assert.match(mobileIntake, /Boolean\(draft\.issueCategory\)/);
  assert.match(mobileIntake, /occurredAt:\s*draft\.occurredOn/);
  assert.match(mobileIntake, /involvedParties:\s*draft\.involvedParties/);
  assert.match(staffDashboard, /People or organisations involved/);
  assert.match(staffDashboard, /detail\.request\.involvedParties/);
});

test("submitted requests have an owner-scoped progress and withdrawal journey", () => {
  const legalHelp = readFileSync(new URL("../convex/legalHelp.ts", import.meta.url), "utf8");
  const cases = readFileSync(new URL("../mobile/app/(tabs)/cases.tsx", import.meta.url), "utf8");
  const requestDetail = readFileSync(new URL("../mobile/app/request/[id].tsx", import.meta.url), "utf8");

  assert.match(legalHelp, /export const getMyRequest = query/);
  assert.match(legalHelp, /request\.ownerId !== user\._id/);
  assert.match(legalHelp, /export const withdrawMyRequest = mutation/);
  assert.match(legalHelp, /help_request\.withdrawn/);
  assert.match(cases, /pathname: "\/request\/\[id\]"/);
  assert.match(requestDetail, /Request progress/);
  assert.match(requestDetail, /withdrawMyRequest/);
  assert.match(requestDetail, /More information needed/);
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
  assert.match(caseManagement, /return \{ case: access\.caseRecord, events: visibleEvents, appointments, outcome, feedback, reviewRequests, assignmentHistory, closureReadiness, tasks \}/);
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
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");
  const providerDashboard = readFileSync(new URL("../src/pages/ParalegalDashboard.tsx", import.meta.url), "utf8");
  const mobileCase = readFileSync(new URL("../mobile/app/case/[id].tsx", import.meta.url), "utf8");
  const mobileAppointments = readFileSync(new URL("../mobile/app/appointments.tsx", import.meta.url), "utf8");
  const mobileParalegals = readFileSync(new URL("../mobile/app/paralegals.tsx", import.meta.url), "utf8");
  const mobileParalegalProfile = readFileSync(new URL("../mobile/app/paralegal-profile.tsx", import.meta.url), "utf8");
  const mobileNotifications = readFileSync(new URL("../mobile/app/notifications.tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/63-appointment-lifecycle-quality.md", import.meta.url), "utf8");
  const bookingBridgeNote = readFileSync(new URL("../docs/platform-review/73-mobile-appointment-booking-bridge.md", import.meta.url), "utf8");
  const requestConfirmationNote = readFileSync(new URL("../docs/platform-review/74-appointment-request-confirmation.md", import.meta.url), "utf8");

  assert.match(schema, /statusNote:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(schema, /statusUpdatedBy:\s*v\.optional\(v\.id\("users"\)\)/);
  assert.match(schema, /statusUpdatedAt:\s*v\.optional\(v\.number\(\)\)/);
  assert.match(schema, /reminderSentAt:\s*v\.optional\(v\.number\(\)\)/);
  assert.match(schema, /by_status_start/);
  assert.match(caseManagement, /updateAppointmentStatus/);
  assert.match(caseManagement, /scheduleAppointmentFromRequest/);
  assert.match(caseManagement, /sourceRequestEventId/);
  assert.match(caseManagement, /scheduledAppointmentId/);
  assert.match(caseManagement, /appointment\.created_from_request/);
  assert.match(caseManagement, /Only scheduled appointments can be updated/);
  assert.match(security, /\["caseManagement\.scheduleAppointmentFromRequest",\s*"case-worker"\]/);
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
  assert.match(providerDashboard, /scheduleAppointmentFromRequest/);
  assert.match(providerDashboard, /Schedule selected time from request/);
  assert.match(providerDashboard, /Complete/);
  assert.match(providerDashboard, /No-show/);
  assert.match(staffDashboard, /Appointment lifecycle/);
  assert.match(staffDashboard, /Appointment requests awaiting confirmation/);
  assert.match(staffDashboard, /scheduleRequestedAppointment/);
  assert.match(staffDashboard, /statusUpdatedAt/);
  assert.match(mobileCase, /appointment_completed/);
  assert.match(mobileCase, /appointmentStatusLabels/);
  assert.match(mobileCase, /appointment\.statusNote/);
  assert.match(mobileAppointments, /api\.caseManagement\.requestAppointment/);
  assert.match(mobileAppointments, /api\.caseManagement\.myCases/);
  assert.match(mobileAppointments, /providerName/);
  assert.match(mobileAppointments, /Choose case/);
  assert.match(mobileAppointments, /Send appointment request/);
  assert.match(mobileParalegals, /providerName:\s*item\.fullName/);
  assert.match(mobileParalegalProfile, /providerName:\s*name/);
  assert.match(mobileNotifications, /"appointment\.changed"/);
  assert.match(mobileNotifications, /"appointment\.reminder"/);
  assert.match(phaseNote, /Provider\/staff appointment completion/i);
  assert.match(phaseNote, /within 24 hours/i);
  assert.match(bookingBridgeNote, /real `caseManagement\.requestAppointment` mutation/);
  assert.match(requestConfirmationNote, /scheduleAppointmentFromRequest/);
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
  const crons = readFileSync(new URL("../convex/crons.ts", import.meta.url), "utf8");
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
  assert.match(resourceDetail, /router\.push\("\/letter-builder"\)/);
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
  assert.match(home, /route: "\/document-checker"/);
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
  const explore = readFileSync(new URL("../mobile/app/explore.tsx", import.meta.url), "utf8");
  const profile = readFileSync(new URL("../mobile/app/(tabs)/profile.tsx", import.meta.url), "utf8");
  const documents = readFileSync(new URL("../mobile/app/documents.tsx", import.meta.url), "utf8");
  const documentDetail = readFileSync(new URL("../mobile/app/document/[id].tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/66-mobile-my-documents-library.md", import.meta.url), "utf8");

  assert.match(caseManagement, /myDocuments/);
  assert.match(caseManagement, /withIndex\("by_beneficiary"/);
  assert.match(caseManagement, /withIndex\("by_user"/);
  assert.match(caseManagement, /withIndex\("by_case"/);
  assert.match(caseManagement, /casePublicId/);
  assert.match(caseManagement, /ctx\.storage\.getUrl\(document\.storageId\)/);
  assert.match(security, /\["caseManagement\.myDocuments",\s*"authenticated"\]/);
  assert.match(layout, /documents/);
  assert.match(home, /router\.push\("\/explore"\)/);
  assert.match(explore, /route: "\/documents"/);
  assert.match(profile, /My documents/);
  assert.match(documents, /api\.caseManagement\.myDocuments/);
  assert.match(documents, /pathname: "\/document\/\[id\]"/);
  assert.match(documentDetail, /api\.caseManagement\.myDocuments/);
  assert.match(documentDetail, /Linking\.openURL/);
  assert.match(documentDetail, /pathname: "\/case\/\[id\]"/);
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
  const appointmentDetail = readFileSync(new URL("../mobile/app/appointment/[id].tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/67-mobile-my-appointments-list.md", import.meta.url), "utf8");

  assert.match(caseManagement, /myAppointments/);
  assert.match(caseManagement, /withIndex\("by_beneficiary"/);
  assert.match(caseManagement, /withIndex\("by_user"/);
  assert.match(caseManagement, /withIndex\("by_case"/);
  assert.match(caseManagement, /casePublicId/);
  assert.match(caseManagement, /a\.status === "scheduled"/);
  assert.match(security, /\["caseManagement\.myAppointments",\s*"authenticated"\]/);
  assert.match(layout, /appointments/);
  assert.match(profile, /My appointments/);
  assert.match(appointments, /api\.caseManagement\.myAppointments/);
  assert.match(appointments, /upcomingCount/);
  assert.match(appointments, /statusNote/);
  assert.match(appointments, /pathname: "\/appointment\/\[id\]"/);
  assert.match(appointmentDetail, /api\.caseManagement\.myAppointments/);
  assert.match(appointmentDetail, /pathname: "\/case\/\[id\]"/);
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
  const mobileUserSync = readFileSync(new URL("../mobile/src/useStoreUserEffect.tsx", import.meta.url), "utf8");
  const userSyncNote = readFileSync(new URL("../docs/platform-review/76-mobile-identity-bootstrap.md", import.meta.url), "utf8");

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
  assert.match(rootLayout, /AccountSyncProvider/);
  assert.match(mobileUserSync, /api\.users\.syncUser/);
  assert.match(mobileUserSync, /retry/);
  assert.match(mobileUserSync, /primaryEmailAddress/);
  assert.match(userSyncNote, /Clerk-to-Convex identity bootstrap/);
});

test("mobile account recovery and role scope are visible without client-side privilege grants", () => {
  const signIn = readFileSync(new URL("../mobile/app/sign-in.tsx", import.meta.url), "utf8");
  const profile = readFileSync(new URL("../mobile/app/(tabs)/profile.tsx", import.meta.url), "utf8");
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const auth = readFileSync(new URL("../convex/lib/auth.ts", import.meta.url), "utf8");
  const roleMatrix = readFileSync(new URL("../docs/haki-yangu/user-role-access-matrix-2026-09-09.md", import.meta.url), "utf8");

  assert.match(signIn, /reset_password_email_code/);
  assert.match(signIn, /Recover your account/);
  assert.match(signIn, /Set new password/);
  assert.match(profile, /api\.users\.currentAccess/);
  assert.match(profile, /Guest access/);
  assert.match(profile, /Beneficiary access/);
  assert.match(profile, /Provider access/);
  assert.match(profile, /Operations access/);
  assert.match(profile, /Safeguarding access/);
  assert.match(profile, /Reporting access/);
  assert.doesNotMatch(profile, /makeAdmin|role:\s*"admin"|role_assignments/);
  assert.match(schema, /v\.literal\("safeguarding_officer"\)/);
  assert.match(auth, /"safeguarding_officer"/);
  assert.match(roleMatrix, /11 practical user types/);
});

test("safeguarding officer is an enforced restricted operations role", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const justiceServices = readFileSync(new URL("../convex/justiceServices.ts", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");
  const roleMatrix = readFileSync(new URL("../docs/haki-yangu/user-role-access-matrix-2026-09-09.md", import.meta.url), "utf8");

  assert.match(app, /"safeguarding_officer"/);
  assert.match(caseManagement, /operationalReviewRoles/);
  assert.match(caseManagement, /q\.eq\("role",\s*"safeguarding_officer"\)/);
  assert.match(caseManagement, /review\.reason === "safety_concern" \|\| row\.case\?\.priority === "safeguarding"/);
  assert.match(caseManagement, /Safeguarding officers can resolve safety-sensitive reviews only/);
  assert.match(justiceServices, /matchingReviewRoles/);
  assert.match(justiceServices, /decision\.urgency === "immediate_safety"/);
  assert.match(justiceServices, /Safeguarding officers can review safety-sensitive matching decisions only/);
  assert.match(security, /operationalReviewRoles/);
  assert.match(security, /matchingReviewRoles/);
  assert.match(roleMatrix, /LSF safeguarding officer/);
});

test("donor and stakeholder reporting uses approved aggregate snapshots", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const reporting = readFileSync(new URL("../convex/reporting.ts", import.meta.url), "utf8");
  const stakeholderDashboard = readFileSync(new URL("../src/pages/StakeholderDashboard.tsx", import.meta.url), "utf8");
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");
  const roleMatrix = readFileSync(new URL("../docs/haki-yangu/user-role-access-matrix-2026-09-09.md", import.meta.url), "utf8");

  assert.match(schema, /metric_definitions:\s*defineTable/);
  assert.match(schema, /metric_snapshots:\s*defineTable/);
  assert.match(schema, /suppressionThreshold:\s*v\.number\(\)/);
  assert.match(schema, /qualityFlags:\s*v\.array\(v\.string\(\)\)/);
  assert.match(reporting, /generateDonorSafeSnapshot/);
  assert.match(reporting, /approveSnapshot/);
  assert.match(reporting, /listSnapshots/);
  assert.match(reporting, /suppressSmallCell/);
  assert.match(reporting, /Aggregate Haki Yangu service snapshot/);
  assert.match(reporting, /ctx\.db\.query\("referral_events"\)/);
  assert.match(reporting, /getActiveRoles\(ctx,\s*actor\.user\._id\)/);
  assert.match(reporting, /externalReportingOnly\s*\?\s*"approved"/);
  assert.match(security, /\["reporting\.generateDonorSafeSnapshot",\s*"staff"\]/);
  assert.match(security, /\["reporting\.approveSnapshot",\s*"admin-or-supervisor"\]/);
  assert.match(security, /\["reporting\.listSnapshots",\s*"aggregate-reporting"\]/);
  assert.match(app, /allowedRoles=\{\["stakeholder",\s*"donor"\]\}/);
  assert.match(stakeholderDashboard, /api\.reporting\.listSnapshots/);
  assert.match(stakeholderDashboard, /Donor-safe reporting/);
  assert.match(stakeholderDashboard, /Approved aggregate metrics only/);
  assert.doesNotMatch(stakeholderDashboard, /Mock projects|Community Outreach Program|Legal Aid Clinic Expansion/);
  assert.match(roleMatrix, /donor-safe reporting snapshots/);
});

test("beneficiary web dashboard is connected to scoped private Haki Yangu records", () => {
  const userDashboard = readFileSync(new URL("../src/pages/UserDashboard.tsx", import.meta.url), "utf8");

  assert.match(userDashboard, /api\.users\.currentAccess/);
  assert.match(userDashboard, /api\.legalHelp\.myRequests/);
  assert.match(userDashboard, /api\.caseManagement\.myCases/);
  assert.match(userDashboard, /api\.caseManagement\.myAppointments/);
  assert.match(userDashboard, /api\.caseManagement\.myDocuments/);
  assert.match(userDashboard, /My Haki Yangu workspace/);
  assert.match(userDashboard, /Current legal-help status/);
  assert.match(userDashboard, /Privacy-first access/);
  assert.match(userDashboard, /dashboardPath\(roles\)/);
  assert.doesNotMatch(userDashboard, /Recent Activity Placeholder|No recent activity yet|Community Member Dashboard/);
});

test("mobile always launches the connected application without a prototype switch", () => {
  const appConfig = readFileSync(new URL("../mobile/app.config.js", import.meta.url), "utf8");
  const mobileConfig = readFileSync(new URL("../mobile/src/config.ts", import.meta.url), "utf8");
  const packageJson = readFileSync(new URL("../mobile/package.json", import.meta.url), "utf8");
  const rootLayout = readFileSync(new URL("../mobile/app/_layout.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(appConfig, /EXPO_PUBLIC_PROTOTYPE_MODE/);
  assert.doesNotMatch(mobileConfig, /prototypeMode/);
  assert.doesNotMatch(packageJson, /"prototype(?:\:ios|\:android)?"/);
  assert.doesNotMatch(rootLayout, /PrototypeApp|prototypeMode/);
  assert.match(rootLayout, /requiredConfigReady/);
  assert.match(rootLayout, /<Navigation \/>/);
});

test("production mobile private surfaces do not show demo backend records", () => {
  const rootLayout = readFileSync(new URL("../mobile/app/_layout.tsx", import.meta.url), "utf8");
  const cases = readFileSync(new URL("../mobile/app/(tabs)/cases.tsx", import.meta.url), "utf8");
  const documents = readFileSync(new URL("../mobile/app/documents.tsx", import.meta.url), "utf8");
  const notifications = readFileSync(new URL("../mobile/app/notifications.tsx", import.meta.url), "utf8");
  const audit = readFileSync(new URL("../docs/haki-yangu/product-execution-audit-2026-09-08.md", import.meta.url), "utf8");

  assert.match(rootLayout, /isValidSecureStoreKey/);
  assert.match(rootLayout, /\^\[A-Za-z0-9\._-\]\+\$/);
  for (const source of [cases, documents, notifications]) {
    assert.doesNotMatch(source, /demo[A-Z]|demo-|mock/i);
    assert.match(source, /router\.push\("\/sign-in"\)/);
    assert.match(source, /No .* yet|Hakuna .* bado|Sign in to view|Ingia kuona/i);
  }
  assert.match(audit, /Private mobile demo fallback removal/);
});

test("mobile QA seed creates real records only behind an explicit environment guard", () => {
  const seed = readFileSync(new URL("../convex/hakiYanguSeed.ts", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");
  const note = readFileSync(new URL("../docs/platform-review/77-mobile-qa-seed-matter.md", import.meta.url), "utf8");
  const audit = readFileSync(new URL("../docs/haki-yangu/product-execution-audit-2026-09-08.md", import.meta.url), "utf8");

  assert.match(seed, /seedMyMobileQaMatter/);
  assert.match(seed, /HAKI_ALLOW_MOBILE_QA_SEED/);
  assert.match(seed, /requireAuthenticatedUser/);
  assert.match(seed, /legal_help_requests/);
  assert.match(seed, /case_appointments/);
  assert.match(seed, /notifications/);
  assert.match(security, /\["hakiYanguSeed\.seedMyMobileQaMatter",\s*"authenticated"\]/);
  assert.match(note, /real Convex records/);
  assert.match(audit, /Mobile QA matter seed/);
});

test("mobile Saada uses governed Convex AI with risk events and consent", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const saraActions = readFileSync(new URL("../convex/sara_actions.ts", import.meta.url), "utf8");
  const sara = readFileSync(new URL("../convex/sara.ts", import.meta.url), "utf8");
  const saraChat = readFileSync(new URL("../convex/sara_chat.ts", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");
  const mobileSara = readFileSync(new URL("../mobile/app/sara.tsx", import.meta.url), "utf8");
  const adminAnalytics = readFileSync(new URL("../src/components/admin/AdminSaraAnalytics.tsx", import.meta.url), "utf8");
  const webSara = readFileSync(new URL("../src/pages/SaraAI.tsx", import.meta.url), "utf8");
  const phaseNote = readFileSync(new URL("../docs/platform-review/72-mobile-saada-governance.md", import.meta.url), "utf8");

  assert.match(schema, /saada_risk_events:\s*defineTable/);
  assert.match(schema, /eventType:\s*v\.union\(/);
  assert.match(schema, /emergency_keyword/);
  assert.match(schema, /low_confidence/);
  assert.match(schema, /tool_routing/);
  assert.match(schema, /dispositionStatus:\s*v\.optional\(v\.union/);
  assert.match(schema, /by_disposition/);
  assert.match(sara, /recordRiskEvent/);
  assert.match(sara, /dispositionStatus:\s*"open"/);
  assert.match(saraChat, /getRiskEvents/);
  assert.match(saraChat, /resolveRiskEvent/);
  assert.match(saraActions, /source:\s*v\.optional\(v\.union/);
  assert.match(saraActions, /internal\.sara\.recordRiskEvent/);
  assert.match(saraActions, /eventType:\s*"emergency_keyword"/);
  assert.match(saraActions, /eventType:\s*"low_confidence"/);
  assert.match(saraActions, /eventType:\s*"policy_block"/);
  assert.match(saraActions, /eventType:\s*"tool_routing"/);
  assert.match(security, /\["sara_chat\.getRiskEvents",\s*"staff"\]/);
  assert.match(security, /\["sara_chat\.resolveRiskEvent",\s*"staff"\]/);
  assert.match(mobileSara, /useAction\(api\.sara_actions\.ask\)/);
  assert.match(mobileSara, /useMutation\(api\.sara_chat\.sendMessage\)/);
  assert.match(mobileSara, /source:\s*"mobile"/);
  assert.match(mobileSara, /consentAccepted/);
  assert.doesNotMatch(mobileSara, /buildDemoReply/);
  assert.match(adminAnalytics, /Saada Governance Events/);
  assert.match(adminAnalytics, /api\.sara_chat\.getRiskEvents/);
  assert.match(adminAnalytics, /api\.sara_chat\.resolveRiskEvent/);
  assert.match(adminAnalytics, /Case follow-up/);
  assert.match(adminAnalytics, /False positive/);
  assert.match(webSara, /source:\s*"web"/);
  assert.match(phaseNote, /no longer generates local demo answers/i);
  assert.match(phaseNote, /disposition events/i);
});

test("Saada restores governed history and only exposes verified public directory routes", () => {
  const mobileSaada = readFileSync(new URL("../mobile/app/sara.tsx", import.meta.url), "utf8");
  const actions = readFileSync(new URL("../convex/sara_actions.ts", import.meta.url), "utf8");
  const services = readFileSync(new URL("../convex/justiceServices.ts", import.meta.url), "utf8");

  assert.match(mobileSaada, /api\.sara_chat\.getConversationMessages/);
  assert.match(mobileSaada, /api\.sara_chat\.getLegacyConversation/);
  assert.match(mobileSaada, /usePaginatedQuery/);
  assert.match(actions, /name: "find_services"/);
  assert.match(actions, /api\.justiceServices\.listPublicServices/);
  assert.match(actions, /do not claim a referral was sent/);
  assert.match(actions, /Police Emergency:\*\* \*\*112/);
  assert.match(actions, /Gender and Children Desk \/ Child Helpline/);
  assert.doesNotMatch(actions, /\+255 22 215 0302/);
  assert.doesNotMatch(actions, /\+255 22 266 2755/);
  assert.match(services, /service\.servicePointType !== "safe_house"/);
});

test("Saada exposes real backend activity events instead of a generic spinner", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const sara = readFileSync(new URL("../convex/sara.ts", import.meta.url), "utf8");
  const saraActions = readFileSync(new URL("../convex/sara_actions.ts", import.meta.url), "utf8");
  const saraChat = readFileSync(new URL("../convex/sara_chat.ts", import.meta.url), "utf8");
  const mobileSara = readFileSync(new URL("../mobile/app/sara.tsx", import.meta.url), "utf8");
  const webSara = readFileSync(new URL("../src/pages/SaraAI.tsx", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");

  assert.match(schema, /saada_activity_events:\s*defineTable/);
  assert.match(schema, /knowledge_search_started/);
  assert.match(schema, /tool_execution_completed/);
  assert.match(sara, /recordActivityEvent/);
  assert.match(saraChat, /getActivityEvents/);
  assert.match(saraActions, /clientRequestId/);
  assert.match(saraActions, /knowledge_search_started/);
  assert.match(saraActions, /service_search_completed/);
  assert.match(saraActions, /human_review_requested/);
  assert.match(webSara, /Saada activity/);
  assert.match(webSara, /api\.sara_chat\.getActivityEvents/);
  assert.match(mobileSara, /ChatActivity label=\{activityLabel\}/);
  assert.match(mobileSara, /api\.sara_chat\.getActivityEvents/);
  assert.match(security, /\["sara_chat\.getActivityEvents",\s*"authenticated-self"\]/);
});

test("referral graph connects staff creation, provider response, and beneficiary visibility", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const referrals = readFileSync(new URL("../convex/referrals.ts", import.meta.url), "utf8");
  const justiceServices = readFileSync(new URL("../convex/justiceServices.ts", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");
  const crons = readFileSync(new URL("../convex/crons.ts", import.meta.url), "utf8");
  const staffDashboard = readFileSync(new URL("../src/pages/StaffDashboard.tsx", import.meta.url), "utf8");
  const providerDashboard = readFileSync(new URL("../src/pages/ParalegalDashboard.tsx", import.meta.url), "utf8");
  const mobileCase = readFileSync(new URL("../mobile/app/case/[id].tsx", import.meta.url), "utf8");

  assert.match(schema, /referrals:\s*defineTable/);
  assert.match(schema, /justice_service_organizations:\s*defineTable/);
  assert.match(schema, /referralAgreementStatus/);
  assert.match(schema, /safeguardingReady:\s*v\.boolean\(\)/);
  assert.match(schema, /organizationId:\s*v\.optional\(v\.id\("justice_service_organizations"\)\)/);
  assert.match(schema, /by_organization/);
  assert.match(schema, /method:\s*v\.optional\(v\.union\(/);
  assert.match(schema, /statement:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(schema, /evidenceNote:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(schema, /evidenceStorageId:\s*v\.optional\(v\.id\("_storage"\)\)/);
  assert.match(schema, /retentionUntil:\s*v\.optional\(v\.number\(\)\)/);
  assert.match(schema, /retentionStatus:\s*v\.optional\(v\.union\(/);
  assert.match(schema, /reviewStatus:\s*v\.optional\(v\.union\(/);
  assert.match(schema, /reviewedBy:\s*v\.optional\(v\.id\("users"\)\)/);
  assert.match(schema, /matching_decisions:[\s\S]*restrictionReason:\s*v\.optional\(v\.string\(\)\)/);
  assert.match(schema, /by_review_status/);
  assert.match(schema, /by_type_review/);
  assert.match(schema, /by_type_retention/);
  assert.match(schema, /relatedReferralId:\s*v\.optional\(v\.id\("referrals"\)\)/);
  assert.match(schema, /destinationUserId:\s*v\.optional\(v\.id\("users"\)\)/);
  assert.match(schema, /parentReferralId:\s*v\.optional\(v\.id\("referrals"\)\)/);
  assert.match(schema, /onwardReferralId:\s*v\.optional\(v\.id\("referrals"\)\)/);
  assert.match(schema, /by_parent/);
  assert.match(schema, /by_destination_user_status/);
  assert.match(schema, /referral_events:\s*defineTable/);
  assert.match(referrals, /createForCase/);
  assert.match(referrals, /createOnwardReferral/);
  assert.match(referrals, /parentReferralId:\s*v\.id\("referrals"\)/);
  assert.match(referrals, /Only the assigned destination provider can create an onward referral/);
  assert.match(referrals, /status:\s*"referred_onward"/);
  assert.match(referrals, /onwardReferralId:\s*referralId/);
  assert.match(referrals, /generateConsentUploadUrl/);
  assert.match(referrals, /staffConsentEvidenceQueue/);
  assert.match(referrals, /reviewConsentEvidence/);
  assert.match(referrals, /expireConsentEvidenceRetention/);
  assert.match(referrals, /ctx\.storage\.generateUploadUrl\(\)/);
  assert.match(referrals, /ctx\.storage\.getUrl\(consent\.evidenceStorageId\)/);
  assert.match(referrals, /destinationUserId:\s*v\.optional\(v\.id\("users"\)\)/);
  assert.match(referrals, /consentMethod:\s*v\.optional\(consentMethod\)/);
  assert.match(referrals, /consentEvidenceStorageId:\s*v\.optional\(v\.id\("_storage"\)\)/);
  assert.match(referrals, /signed_document/);
  assert.match(referrals, /retentionUntil/);
  assert.match(referrals, /retentionStatus:\s*"active"/);
  assert.match(referrals, /retentionStatus:\s*"expired"/);
  assert.match(referrals, /ctx\.db\.insert\("consents"/);
  assert.match(referrals, /relatedReferralId:\s*referralId/);
  assert.match(referrals, /getActiveRoles\(ctx,\s*destinationUser\._id\)/);
  assert.match(referrals, /myDestinationQueue/);
  assert.match(referrals, /respondAsDestination/);
  assert.match(referrals, /requireAnyRole\(ctx,\s*\["paralegal",\s*"provider_staff"\]\)/);
  assert.match(referrals, /referral\.destinationUserId !== user\._id/);
  assert.match(justiceServices, /staffListOrganizations/);
  assert.match(justiceServices, /staffPartnerPerformance/);
  assert.match(justiceServices, /staffMatchingDecisionQueue/);
  assert.match(justiceServices, /reviewMatchingDecision/);
  assert.match(justiceServices, /Immediate safety requests require safeguarding review/);
  assert.match(justiceServices, /reviewStatus:\s*isRestricted \? "restricted" : "pending_review"/);
  assert.match(justiceServices, /slaComplianceRate/);
  assert.match(justiceServices, /overdueOpenCount/);
  assert.match(justiceServices, /averageResponseHours/);
  assert.match(justiceServices, /createOrganization/);
  assert.match(justiceServices, /updateOrganization/);
  assert.match(justiceServices, /requireActiveReferralReadiness\(nextVerification/);
  assert.match(security, /\["referrals\.myDestinationQueue",\s*"service-provider"\]/);
  assert.match(security, /\["referrals\.respondAsDestination",\s*"service-provider"\]/);
  assert.match(security, /\["referrals\.createOnwardReferral",\s*"case-worker-or-assigned-provider"\]/);
  assert.match(security, /\["referrals\.generateConsentUploadUrl",\s*"case-worker"\]/);
  assert.match(security, /\["referrals\.staffConsentEvidenceQueue",\s*"staff"\]/);
  assert.match(security, /\["referrals\.reviewConsentEvidence",\s*"staff"\]/);
  assert.match(security, /\["justiceServices\.staffMatchingDecisionQueue",\s*"staff"\]/);
  assert.match(security, /\["justiceServices\.reviewMatchingDecision",\s*"staff"\]/);
  assert.match(crons, /flag expired Haki Yangu consent evidence/);
  assert.match(crons, /internal\.referrals\.expireConsentEvidenceRetention/);
  assert.match(staffDashboard, /Create service referral/);
  assert.match(staffDashboard, /Partner organization/);
  assert.match(staffDashboard, /Organization accountability/);
  assert.match(staffDashboard, /Partner referral performance/);
  assert.match(staffDashboard, /Matching decision review/);
  assert.match(staffDashboard, /api\.justiceServices\.staffMatchingDecisionQueue/);
  assert.match(staffDashboard, /api\.justiceServices\.reviewMatchingDecision/);
  assert.match(staffDashboard, /Restrict recommendations/);
  assert.match(staffDashboard, /Escalate to safeguarding lead/);
  assert.match(staffDashboard, /staffPartnerPerformance/);
  assert.match(staffDashboard, /createJusticeOrganization/);
  assert.match(staffDashboard, /destinationUserId:\s*referralDestinationUserId/);
  assert.match(staffDashboard, /minimum information/);
  assert.match(staffDashboard, /Awaiting beneficiary decision/);
  assert.match(referrals, /awaiting_beneficiary_consent/);
  assert.match(referrals, /decideBeneficiaryConsent/);
  assert.match(staffDashboard, /referralConsentStatement/);
  assert.match(staffDashboard, /generateReferralConsentUploadUrl/);
  assert.match(staffDashboard, /type="file"/);
  assert.match(staffDashboard, /Open consent file/);
  assert.match(staffDashboard, /Referral consent evidence/);
  assert.match(staffDashboard, /Accept consent evidence/);
  assert.match(staffDashboard, /Retention:/);
  assert.match(providerDashboard, /Referral inbox/);
  assert.match(providerDashboard, /api\.referrals\.myDestinationQueue/);
  assert.match(providerDashboard, /api\.referrals\.respondAsDestination/);
  assert.match(providerDashboard, /api\.referrals\.createOnwardReferral/);
  assert.match(providerDashboard, /Accept referral/);
  assert.match(providerDashboard, /Return to LSF/);
  assert.match(providerDashboard, /Propose onward referral for beneficiary approval/);
  assert.match(providerDashboard, /Consent proof/);
  assert.match(mobileCase, /Referrals/);
  assert.match(mobileCase, /api\.referrals\.listForCase/);
  assert.match(mobileCase, /referral_referred_onward/);
  assert.match(mobileCase, /Continued to referral/);
  assert.match(mobileCase, /Information shared/);
  assert.match(mobileCase, /Consent recorded/);
});

test("paralegal mobile case workspace connects worker tasks and document review", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const mobileCase = readFileSync(new URL("../mobile/app/case/[id].tsx", import.meta.url), "utf8");
  const mobileWorkspace = readFileSync(new URL("../mobile/app/workspace.tsx", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");

  assert.match(schema, /case_tasks:\s*defineTable/);
  assert.match(schema, /by_assignee_status/);
  assert.match(schema, /by_case/);
  assert.match(caseManagement, /export const myTasks/);
  assert.match(caseManagement, /export const createTask/);
  assert.match(caseManagement, /export const completeTask/);
  assert.match(caseManagement, /export const listTasksForCase/);
  assert.match(caseManagement, /type:\s*"task_created"/);
  assert.match(caseManagement, /type:\s*"task_completed"/);
  assert.match(caseManagement, /task\.assigneeId !== user\._id/);
  assert.match(caseManagement, /export const reviewDocument/);
  assert.match(caseManagement, /case_document\.reviewed/);
  assert.match(mobileCase, /CaseTab = .*tasks/);
  assert.match(mobileCase, /details\.tasks/);
  assert.match(mobileCase, /const completeTask = useMutation\(api\.caseManagement\.completeTask\)/);
  assert.match(mobileCase, /api\.caseManagement\.createTask/);
  assert.match(mobileCase, /Add task/);
  assert.match(mobileCase, /api\.caseManagement\.reviewDocument/);
  assert.match(mobileCase, /Document reviewed and accepted/);
  assert.match(mobileWorkspace, /api\.caseManagement\.myTasks/);
  assert.match(mobileWorkspace, /api\.caseManagement\.completeTask/);
  assert.match(security, /\["caseManagement\.myTasks",\s*"service-provider"\]/);
  assert.match(security, /\["caseManagement\.createTask",\s*"case-worker"\]/);
  assert.match(security, /\["caseManagement\.completeTask",\s*"authenticated-self"\]/);
  assert.match(security, /\["caseManagement\.listTasksForCase",\s*"case-worker"\]/);
  assert.match(security, /\["caseManagement\.reviewDocument",\s*"case-worker"\]/);
});

test("paralegal mobile case workspace connects appointments, referrals, and outcomes", () => {
  const caseManagement = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const referrals = readFileSync(new URL("../convex/referrals.ts", import.meta.url), "utf8");
  const mobileCase = readFileSync(new URL("../mobile/app/case/[id].tsx", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");

  assert.match(caseManagement, /export const scheduleAppointment/);
  assert.match(caseManagement, /Appointment must be in the future/);
  assert.match(caseManagement, /export const recordOutcome/);
  assert.match(caseManagement, /assertCaseTransition\(caseRecord\.status, "resolved"\)/);
  assert.match(referrals, /export const updateStatus/);
  assert.match(mobileCase, /api\.caseManagement\.scheduleAppointment/);
  assert.match(mobileCase, /Schedule beneficiary appointment/);
  assert.match(mobileCase, /api\.referrals\.updateStatus/);
  assert.match(mobileCase, /locale === "sw" \? "Kubali" : "Accept"/);
  assert.match(mobileCase, /api\.caseManagement\.recordOutcome/);
  assert.match(mobileCase, /Record case outcome/);
  assert.match(mobileCase, /details\.closureReadiness/);
  assert.match(security, /\["caseManagement\.scheduleAppointment",\s*"case-worker"\]/);
  assert.match(security, /\["caseManagement\.recordOutcome",\s*"case-worker"\]/);
  assert.match(security, /\["referrals\.updateStatus",\s*"case-worker"\]/);
});

test("paralegal deactivation revokes active access and records a notification and audit event", () => {
  const paralegals = readFileSync(new URL("../convex/paralegals.ts", import.meta.url), "utf8");
  const notifications = readFileSync(new URL("../convex/notifications.ts", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");

  assert.match(paralegals, /export const deactivateParalegal/);
  assert.match(paralegals, /status:\s*"rejected"/);
  assert.match(paralegals, /availabilityStatus:\s*"unavailable"/);
  assert.match(paralegals, /assignment\.role === "paralegal"/);
  assert.match(paralegals, /status:\s*"revoked"/);
  assert.match(paralegals, /matchingUser\.role === "paralegal"/);
  assert.match(paralegals, /role:\s*"user"/);
  assert.match(paralegals, /type:\s*"access\.revoked"/);
  assert.match(paralegals, /paralegal\.access_revoked/);
  assert.match(notifications, /"access\.revoked"/);
  assert.match(security, /\["paralegals\.deactivateParalegal",\s*"staff"\]/);
});

test("provider mobile organisation screen uses scoped governed service data", () => {
  const justiceServices = readFileSync(new URL("../convex/justiceServices.ts", import.meta.url), "utf8");
  const mobileOrganisation = readFileSync(new URL("../mobile/app/my-organisation.tsx", import.meta.url), "utf8");
  const mobileWorkspace = readFileSync(new URL("../mobile/app/workspace.tsx", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");

  assert.match(justiceServices, /export const myOrganization/);
  assert.match(justiceServices, /export const myOrganizations/);
  assert.match(justiceServices, /const \{ assignments \} = await requireAnyRole\(ctx, \["paralegal", "provider_staff"\]\)/);
  assert.match(justiceServices, /outside your approved access/);
  assert.match(justiceServices, /\["paralegal", "provider_staff"\]/);
  assert.match(justiceServices, /withIndex\("by_organization"/);
  assert.match(justiceServices, /verificationStatus: organization\.verificationStatus/);
  assert.match(justiceServices, /referralAgreementStatus: organization\.referralAgreementStatus/);
  assert.match(justiceServices, /services: services\.map/);
  assert.match(mobileOrganisation, /api\.justiceServices\.myOrganization/);
  assert.match(mobileOrganisation, /api\.justiceServices\.myOrganizations/);
  assert.match(mobileOrganisation, /Choose an approved organisation/);
  assert.match(mobileOrganisation, /No organisation linked/);
  assert.match(mobileOrganisation, /Linked services/);
  assert.match(mobileOrganisation, /Only LSF can verify/);
  assert.match(mobileOrganisation, /router\.push\(\{ pathname: "\/service\/\[id\]"/);
  assert.match(mobileWorkspace, /router\.push\("\/my-organisation"\)/);
  assert.match(security, /\["justiceServices\.myOrganization",\s*"service-provider"\]/);
  assert.match(security, /\["justiceServices\.myOrganizations",\s*"service-provider"\]/);
});

test("paralegal mobile performance is computed from assigned cases and beneficiary feedback", () => {
  const paralegals = readFileSync(new URL("../convex/paralegals.ts", import.meta.url), "utf8");
  const mobilePerformance = readFileSync(new URL("../mobile/app/paralegal-performance.tsx", import.meta.url), "utf8");
  const mobileWorkspace = readFileSync(new URL("../mobile/app/workspace.tsx", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");

  assert.match(paralegals, /export const getMyPerformance/);
  assert.match(paralegals, /by_assignee_status/);
  assert.match(paralegals, /case_outcomes/);
  assert.match(paralegals, /case_feedback/);
  assert.match(paralegals, /averageRating/);
  assert.match(mobilePerformance, /api\.paralegals\.getMyPerformance/);
  assert.match(mobilePerformance, /Cases handled/);
  assert.match(mobilePerformance, /beneficiary feedback responses included/);
  assert.match(mobilePerformance, /router\.push\("\/support"\)/);
  assert.match(mobileWorkspace, /router\.push\("\/paralegal-performance"\)/);
  assert.match(security, /\["paralegals\.getMyPerformance",\s*"service-provider"\]/);
});

test("paralegal support and wellbeing requests are persisted and staff-scoped", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const paralegals = readFileSync(new URL("../convex/paralegals.ts", import.meta.url), "utf8");
  const notifications = readFileSync(new URL("../convex/notifications.ts", import.meta.url), "utf8");
  const mobileSupport = readFileSync(new URL("../mobile/app/paralegal-support.tsx", import.meta.url), "utf8");
  const mobileWorkspace = readFileSync(new URL("../mobile/app/workspace.tsx", import.meta.url), "utf8");
  const security = readFileSync(new URL("../scripts/check-convex-security.mjs", import.meta.url), "utf8");

  assert.match(schema, /paralegal_support_requests:\s*defineTable/);
  assert.match(schema, /wellbeing/);
  assert.match(schema, /challenging_case/);
  assert.match(schema, /by_user_status/);
  assert.match(schema, /by_status/);
  assert.match(paralegals, /export const mySupportRequests/);
  assert.match(paralegals, /export const requestSupport/);
  assert.match(paralegals, /export const staffSupportQueue/);
  assert.match(paralegals, /export const respondToSupportRequest/);
  assert.match(paralegals, /paralegal\.support_requested/);
  assert.match(paralegals, /notifications\.paralegalSupportRequested\.body/);
  assert.match(paralegals, /role.*staff/);
  assert.match(paralegals, /role.*supervisor/);
  assert.match(paralegals, /role.*admin/);
  assert.match(notifications, /paralegal\.support_requested/);
  assert.match(notifications, /paralegal\.support_updated/);
  assert.match(mobileSupport, /api\.paralegals\.mySupportRequests/);
  assert.match(mobileSupport, /api\.paralegals\.requestSupport/);
  assert.match(mobileSupport, /wellbeing/);
  assert.match(mobileSupport, /challenging_case/);
  assert.match(mobileSupport, /Send to LSF/);
  assert.match(mobileWorkspace, /router\.push\("\/paralegal-wellbeing"\)/);
  assert.match(mobileWorkspace, /api\.paralegals\.staffSupportQueue/);
  assert.match(mobileWorkspace, /api\.paralegals\.respondToSupportRequest/);
  assert.match(security, /\["paralegals\.mySupportRequests",\s*"service-provider"\]/);
  assert.match(security, /\["paralegals\.requestSupport",\s*"service-provider"\]/);
  assert.match(security, /\["paralegals\.staffSupportQueue",\s*"staff"\]/);
  assert.match(security, /\["paralegals\.respondToSupportRequest",\s*"staff"\]/);
});

test("case referral list projects private operational data before returning to clients", () => {
  const referrals = readFileSync(new URL("../convex/referrals.ts", import.meta.url), "utf8");
  const listForCase = referrals.slice(referrals.indexOf("export const listForCase"), referrals.indexOf("export const staffQueue"));

  assert.match(listForCase, /publicServiceProjection/);
  assert.match(listForCase, /workerServiceProjection/);
  assert.match(listForCase, /canSeeOperationalDetails/);
  assert.match(listForCase, /destinationUser:\s*canSeeOperationalDetails/);
  assert.doesNotMatch(listForCase, /\.\.\.referral/);
  assert.doesNotMatch(listForCase, /evidenceStorageId/);
  assert.doesNotMatch(listForCase, /destinationService:\s*await ctx\.db\.get/);
  assert.doesNotMatch(listForCase, /destinationUser:\s*referral\.destinationUserId \? await ctx\.db\.get/);
  assert.doesNotMatch(listForCase, /consent:\s*referral\.consentId \? await ctx\.db\.get/);
});

test("Saada knowledge and prompt changes require provenance and independent approval", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const sara = readFileSync(new URL("../convex/sara.ts", import.meta.url), "utf8");
  const lifecycle = readFileSync(new URL("../convex/lib/saadaSourceLifecycle.ts", import.meta.url), "utf8");
  const actions = readFileSync(new URL("../convex/sara_actions.ts", import.meta.url), "utf8");
  const admin = readFileSync(new URL("../src/pages/SaraTrain.tsx", import.meta.url), "utf8");
  const mobile = readFileSync(new URL("../mobile/app/sara.tsx", import.meta.url), "utf8");

  assert.match(schema, /saada_prompt_versions:\s*defineTable/);
  assert.match(schema, /publisher: v\.optional/);
  assert.match(schema, /reviewDueAt: v\.optional/);
  assert.match(sara, /A different administrator must review this prompt/);
  assert.match(sara, /requireReadySourceForApproval/);
  assert.match(lifecycle, /Complete source provenance before approval/);
  assert.match(actions, /getApprovedPromptInternal/);
  assert.doesNotMatch(actions, /getConfigInternal, \{ key: "system_prompt" \}/);
  assert.match(actions, /PUBLISHER:/);
  assert.match(admin, /Submit for approval/);
  assert.match(admin, /Review due/);
  assert.match(mobile, /api\.sara_chat\.submitFeedback/);
  assert.match(mobile, /Helpful response/);
  assert.match(mobile, /Unhelpful response/);
});

test("paralegal readiness requires verified profile, availability, ethics and safeguarding", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const paralegals = readFileSync(new URL("../convex/paralegals.ts", import.meta.url), "utf8");
  const onboarding = readFileSync(new URL("../mobile/app/paralegal-onboarding.tsx", import.meta.url), "utf8");

  assert.match(schema, /ethicsAcceptedAt/);
  assert.match(schema, /codeOfConductAcceptedAt/);
  assert.match(schema, /safeguardingTrainingCompletedAt/);
  assert.match(paralegals, /export const completeMyOnboarding/);
  assert.match(paralegals, /LSF approval and verification are required/);
  assert.match(paralegals, /Complete your public profile first/);
  assert.match(paralegals, /Set your availability and working hours first/);
  assert.match(paralegals, /Use the governed onboarding completion flow/);
  assert.match(onboarding, /api\.paralegals\.completeMyOnboarding/);
  assert.match(onboarding, /accessibilityRole="checkbox"/);
});

test("mobile paralegal applications securely collect reviewable identity and credential files", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const forms = readFileSync(new URL("../convex/formSubmissions.ts", import.meta.url), "utf8");
  const join = readFileSync(new URL("../mobile/app/join.tsx", import.meta.url), "utf8");

  assert.match(schema, /idDocumentStorageId/);
  assert.match(schema, /certificateStorageId/);
  assert.match(forms, /generateParalegalDocumentUploadUrl/);
  assert.match(forms, /requireAuthenticatedUser/);
  assert.match(forms, /Application email must match the signed-in account/);
  assert.match(forms, /Identity evidence is required before approval/);
  assert.match(forms, /Paralegal credential evidence is required before approval/);
  assert.match(forms, /identityDocumentUrl/);
  assert.match(forms, /certificateDocumentUrl/);
  assert.match(join, /DocumentPicker\.getDocumentAsync/);
  assert.match(join, /idDocumentStorageId: identityDocument\.id/);
  assert.match(join, /certificateStorageId: certificateDocument\.id/);
});

test("mobile LSF operations connects intake triage, case creation, matching and restricted safeguarding", () => {
  const operations = readFileSync(new URL("../mobile/app/operations.tsx", import.meta.url), "utf8");
  const matching = readFileSync(new URL("../mobile/app/case-matching/[id].tsx", import.meta.url), "utf8");
  const safeguarding = readFileSync(new URL("../mobile/app/safeguarding.tsx", import.meta.url), "utf8");
  const safeguardingReview = readFileSync(new URL("../mobile/app/safeguarding-review/[id].tsx", import.meta.url), "utf8");
  const workspace = readFileSync(new URL("../mobile/app/workspace.tsx", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../mobile/app/_layout.tsx", import.meta.url), "utf8");

  assert.match(operations, /api\.legalHelp\.staffQueue/);
  assert.match(operations, /api\.legalHelp\.openForTriage/);
  assert.match(operations, /api\.caseManagement\.createFromRequest/);
  assert.match(operations, /\/case-matching\/\[id\]/);
  assert.match(matching, /api\.caseManagement\.providerRecommendations/);
  assert.match(matching, /api\.caseManagement\.offerAssignment/);
  assert.match(safeguarding, /useSensitiveScreenProtection\("safeguarding"\)/);
  assert.match(safeguarding, /api\.caseManagement\.staffReviewRequests/);
  assert.match(safeguarding, /status: "under_review"/);
  assert.match(safeguardingReview, /api\.caseManagement\.resolveCaseReviewRequest/);
  assert.match(workspace, /router\.push\("\/operations"\)/);
  assert.match(workspace, /router\.push\("\/safeguarding"\)/);
  assert.match(layout, /name="operations"/);
  assert.match(layout, /name="safeguarding"/);
});

test("mobile governance connects access, paralegal approval and Saada risk review", () => {
  const governance = readFileSync(new URL("../mobile/app/governance.tsx", import.meta.url), "utf8");
  const saadaRisk = readFileSync(new URL("../mobile/app/saada-risk/[id].tsx", import.meta.url), "utf8");
  const accessReview = readFileSync(new URL("../mobile/app/access-request/[id].tsx", import.meta.url), "utf8");
  const paralegalReview = readFileSync(new URL("../mobile/app/paralegal-application/[id].tsx", import.meta.url), "utf8");
  const workspace = readFileSync(new URL("../mobile/app/workspace.tsx", import.meta.url), "utf8");
  assert.match(governance, /useSensitiveScreenProtection\("governance"\)/);
  assert.match(governance, /api\.accessRequests\.adminQueue/);
  assert.match(accessReview, /api\.accessRequests\.decide/);
  assert.match(governance, /api\.formSubmissions\.paralegalReviewQueue/);
  assert.match(governance, /\/paralegal-review-queue/);
  assert.match(paralegalReview, /api\.formSubmissions\.paralegalApplicationForReview/);
  assert.match(paralegalReview, /api\.formSubmissions\.reviewParalegalApplication/);
  assert.match(accessReview, /api\.justiceServices\.staffOrganizationsPage/);
  assert.match(accessReview, /api\.justiceServices\.staffSearchOrganizations/);
  assert.match(governance, /api\.sara_chat\.getRiskEventsPage/);
  assert.match(governance, /\/saada-risk\/\[id\]/);
  assert.match(saadaRisk, /api\.sara_chat\.resolveRiskEvent/);
  assert.match(saadaRisk, /api\.sara_chat\.getRiskEventForReview/);
  const riskQueue = readFileSync(new URL("../mobile/app/saada-risk-queue.tsx", import.meta.url), "utf8");
  assert.match(riskQueue, /api\.sara_chat\.getRiskEventsPage/);
  assert.match(governance, /roles\.includes\("admin"\)/);
  assert.match(workspace, /router\.push\("\/governance"\)/);
});

test("mobile Saada source review opens provenance and uses independent approval", () => {
  const library = readFileSync(new URL("../mobile/app/saada-governance.tsx", import.meta.url), "utf8");
  const detail = readFileSync(new URL("../mobile/app/saada-source/[id].tsx", import.meta.url), "utf8");
  const backend = readFileSync(new URL("../convex/sara.ts", import.meta.url), "utf8");
  assert.match(library, /\/saada-source\/\[id\]/);
  assert.match(library, /api\.sara\.listDocumentsPage/);
  assert.match(detail, /api\.sara\.getDocumentForReview/);
  assert.match(detail, /api\.sara\.reviewDocument/);
  assert.match(detail, /sourcePdfUrl/);
  assert.match(backend, /A different administrator must review this source/);
});

test("mobile Saada policy review opens full instructions before independent approval", () => {
  const governance = readFileSync(new URL("../mobile/app/saada-governance.tsx", import.meta.url), "utf8");
  const detail = readFileSync(new URL("../mobile/app/saada-policy/[id].tsx", import.meta.url), "utf8");
  assert.match(governance, /\/saada-policy\/\[id\]/);
  assert.match(detail, /version\.prompt/);
  assert.match(detail, /api\.sara\.reviewPromptVersion/);
  assert.match(detail, /ownSubmission/);
});

test("Find Help comparison reads current verified public service records", () => {
  const search = readFileSync(new URL("../mobile/app/find-services.tsx", import.meta.url), "utf8");
  const comparison = readFileSync(new URL("../mobile/app/compare-services.tsx", import.meta.url), "utf8");
  assert.match(search, /\/compare-services/);
  assert.match(comparison, /api\.justiceServices\.listPublicServices/);
  assert.match(comparison, /\/service\/\[id\]/);
});

test("mobile service directory governance requires provenance and audits status changes", () => {
  const directory = readFileSync(new URL("../mobile/app/directory-management.tsx", import.meta.url), "utf8");
  const backend = readFileSync(new URL("../convex/justiceServices.ts", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../mobile/app/_layout.tsx", import.meta.url), "utf8");
  assert.match(directory, /api\.justiceServices\.staffOrganizationsPage/);
  assert.match(directory, /api\.justiceServices\.staffSearchOrganizations/);
  assert.match(directory, /api\.justiceServices\.staffServicesPage/);
  assert.match(directory, /api\.justiceServices\.staffSearchServices/);
  const organisationDetail = readFileSync(new URL("../mobile/app/directory-organisation/[id].tsx", import.meta.url), "utf8");
  const serviceDetail = readFileSync(new URL("../mobile/app/directory-service/[id].tsx", import.meta.url), "utf8");
  assert.match(organisationDetail, /api\.justiceServices\.updateOrganization/);
  assert.match(serviceDetail, /api\.justiceServices\.updateService/);
  assert.match(directory, /servicePointType === "safe_house"/);
  assert.match(backend, /Verified services require source, verifying authority/);
  assert.match(backend, /directory\.organization_updated/);
  assert.match(backend, /directory\.service_updated/);
  assert.match(layout, /name="directory-management"/);
});

test("Find Help continues through planned visits, check-in and escalation", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const backend = readFileSync(new URL("../convex/justiceServices.ts", import.meta.url), "utf8");
  const visit = readFileSync(new URL("../mobile/app/service-visit.tsx", import.meta.url), "utf8");
  const detail = readFileSync(new URL("../mobile/app/service/[id].tsx", import.meta.url), "utf8");
  assert.match(schema, /justice_service_visits: defineTable/);
  assert.match(backend, /export const planServiceVisit/);
  assert.match(backend, /export const checkInServiceVisit/);
  assert.match(backend, /Check in after the planned service time/);
  assert.match(visit, /api\.justiceServices\.myServiceVisits/);
  assert.match(visit, /Request more help from LSF/);
  assert.match(detail, /pathname: "\/service-visit"/);
});

test("mobile governance exposes a restricted content-safe platform audit trail", () => {
  const admin = readFileSync(new URL("../convex/admin.ts", import.meta.url), "utf8");
  const screen = readFileSync(new URL("../mobile/app/audit-log.tsx", import.meta.url), "utf8");
  assert.match(admin, /export const listPlatformAudit/);
  assert.match(admin, /requireAnyRole\(ctx, \["admin", "supervisor"\]\)/);
  assert.match(admin, /changedFieldNames/);
  assert.doesNotMatch(admin, /listPlatformAudit[\s\S]{0,1200}metadata: row\.metadata/);
  assert.match(screen, /useSensitiveScreenProtection\("platform-audit-log"\)/);
  assert.match(screen, /api\.admin\.listPlatformAudit/);
});

test("local Expo web browses as guest with a production Clerk key and keeps sign-in disabled", () => {
  const config = readFileSync(new URL("../mobile/src/config.ts", import.meta.url), "utf8");
  const checker = readFileSync(new URL("../mobile/scripts/check-env.mjs", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../mobile/app/_layout.tsx", import.meta.url), "utf8");
  assert.match(config, /Platform\.OS === "web"/);
  assert.match(config, /pk_live_/);
  assert.match(config, /Guest browsing works on local Expo web/);
  assert.match(config, /export const clerkReady = configDiagnostics\.clerkPublishableKey\.ready/);
  assert.match(layout, /if \(!clerkReady\) \{[\s\S]*?<ConvexProvider client=\{convex\}>/);
  assert.match(checker, /pk_live_ cannot authenticate on localhost Expo web/);
});

test("mobile donor reporting uses suppressed snapshots and independent approval", () => {
  const backend = readFileSync(new URL("../convex/reporting.ts", import.meta.url), "utf8");
  const screen = readFileSync(new URL("../mobile/app/reporting.tsx", import.meta.url), "utf8");
  assert.match(backend, /Donor-safe reports require independent approval/);
  assert.match(backend, /A different administrator or supervisor must approve/);
  assert.match(backend, /reporting\.snapshot_generated/);
  assert.match(backend, /reporting\.snapshot_approved/);
  assert.match(screen, /api\.reporting\.generateDonorSafeSnapshot/);
  assert.match(screen, /api\.reporting\.approveSnapshot/);
  assert.match(screen, /Share\.share/);
  assert.match(screen, /Small counts are suppressed/);
  assert.match(screen, /referralAcceptanceRate == null \? null/);
});

test("case chat supports governed two-minute voice notes", () => {
  const schema = readFileSync(new URL("../convex/schema.ts", import.meta.url), "utf8");
  const backend = readFileSync(new URL("../convex/caseManagement.ts", import.meta.url), "utf8");
  const mobile = readFileSync(new URL("../mobile/app/case/[id].tsx", import.meta.url), "utf8");
  assert.match(schema, /v\.literal\("voice"\)/);
  assert.match(backend, /generateVoiceMessageUploadUrl/);
  assert.match(backend, /export const sendVoiceMessage/);
  assert.match(backend, /durationMs > 120_000/);
  assert.match(backend, /mimeType\.startsWith\("audio\/"\)/);
  assert.match(mobile, /useAudioRecorder\(RecordingPresets\.LOW_QUALITY\)/);
  assert.match(mobile, /requestRecordingPermissionsAsync/);
  assert.match(mobile, /api\.caseManagement\.sendVoiceMessage/);
  assert.match(mobile, /function VoiceNote/);
});
