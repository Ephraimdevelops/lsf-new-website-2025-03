import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const convexDir = path.join(root, "convex");
const srcDir = path.join(root, "src");

const publicFunctions = new Map([
  ["admin.getAnalytics", "admin"],
  ["admin.getUsers", "admin"],
  ["admin.updateUserRole", "admin"],
  ["analytics.classifyChat", "authenticated-self"],
  ["analytics.getChatTopicStats", "admin"],
  ["analytics.getCostMetrics", "admin"],
  ["analytics.getDailyChats", "admin"],
  ["analytics.getDashboardOverview", "admin"],
  ["analytics.getKnowledgeStats", "admin"],
  ["analytics.getPageViewStats", "admin"],
  ["analytics.getParalegalFunnel", "admin"],
  ["analytics.getUserGrowth", "admin"],
  ["analytics.logEvent", "public-tracking"],
  ["chatbotProxy.sendMessage", "public-proxied-chatbot"],
  ["caseManagement.createFromRequest", "staff"],
  ["caseManagement.myCases", "authenticated"],
  ["caseManagement.staffCaseQueue", "staff"],
  ["caseManagement.serviceProviders", "staff"],
  ["caseManagement.providerRecommendations", "case-worker"],
  ["caseManagement.staffAssignmentOffers", "staff"],
  ["caseManagement.getCase", "case-access"],
  ["caseManagement.offerAssignment", "case-worker"],
  ["caseManagement.reassignCase", "case-worker"],
  ["caseManagement.assignmentInbox", "service-provider"],
  ["caseManagement.respondToAssignment", "service-provider"],
  ["caseManagement.expireStaleAssignmentOffersNow", "staff"],
  ["caseManagement.updateStatus", "case-worker"],
  ["caseManagement.listMessages", "case-access"],
  ["caseManagement.generateDocumentUploadUrl", "case-access"],
  ["caseManagement.addDocument", "case-access"],
  ["caseManagement.addGeneratedLetterDocument", "case-access"],
  ["caseManagement.listDocuments", "case-access"],
  ["caseManagement.myDocuments", "authenticated"],
  ["caseManagement.staffDocumentQueue", "staff"],
  ["caseManagement.reviewDocument", "case-worker"],
  ["caseManagement.sendMessage", "case-access"],
  ["caseManagement.scheduleAppointment", "case-worker"],
  ["caseManagement.updateAppointmentStatus", "case-worker"],
  ["caseManagement.myAppointments", "authenticated"],
  ["caseManagement.requestAppointment", "case-access"],
  ["caseManagement.recordOutcome", "case-worker"],
  ["caseManagement.submitFeedback", "case-access"],
  ["caseManagement.requestCaseReview", "case-access"],
  ["caseManagement.staffReviewRequests", "staff"],
  ["caseManagement.resolveCaseReviewRequest", "staff"],
  ["debug.checkCurrentSession", "authenticated"],
  ["debug.getUserByEmail", "admin"],
  ["debug.listAdmins", "admin"],
  ["formSubmissions.deleteContact", "admin"],
  ["formSubmissions.getParalegalApplicationStats", "staff"],
  ["formSubmissions.listContactSubmissions", "staff"],
  ["formSubmissions.listParalegalApplications", "staff"],
  ["formSubmissions.listWhistleblowerReports", "staff"],
  ["formSubmissions.reviewParalegalApplication", "staff"],
  ["formSubmissions.submitContact", "public-submission"],
  ["formSubmissions.submitParalegalApplication", "public-submission"],
  ["formSubmissions.submitWhistleblowerReport", "public-submission"],
  ["formSubmissions.updateContactStatus", "staff"],
  ["formSubmissions.updateWhistleblowerReport", "staff"],
  ["hero.create", "staff"],
  ["hero.get", "public-read"],
  ["hero.remove", "admin"],
  ["hero.seed", "admin"],
  ["hero.update", "staff"],
  ["hero.updateCategories", "staff"],
  ["heros.create", "staff"],
  ["heros.getById", "public-read"],
  ["heros.getBySlug", "public-read"],
  ["heros.list", "public-read"],
  ["heros.remove", "admin"],
  ["heros.update", "staff"],
  ["hakiYanguSeed.seedMobileDirectory", "staff"],
  ["hakiYanguSeed.seedJusticeServices", "staff"],
  ["justiceServices.createOrganization", "staff"],
  ["justiceServices.createService", "staff"],
  ["justiceServices.listPublicServices", "public-read"],
  ["justiceServices.matchServices", "public-counter"],
  ["justiceServices.reviewMatchingDecision", "staff"],
  ["justiceServices.staffPartnerPerformance", "staff"],
  ["justiceServices.staffMatchingDecisionQueue", "staff"],
  ["justiceServices.staffListOrganizations", "staff"],
  ["justiceServices.staffListServices", "staff"],
  ["justiceServices.updateOrganization", "staff"],
  ["justiceServices.updateService", "staff"],
  ["media.generateUploadUrl", "staff"],
  ["media.saveMedia", "staff"],
  ["legalHelp.saveDraft", "authenticated"],
  ["legalHelp.saveAnswer", "authenticated"],
  ["legalHelp.submit", "authenticated"],
  ["legalHelp.myRequests", "authenticated"],
  ["legalHelp.getDraft", "authenticated"],
  ["legalHelp.staffQueue", "staff"],
  ["legalHelp.openForTriage", "staff"],
  ["legalHelp.setReviewStatus", "staff"],
  ["news.create", "staff"],
  ["news.createForMigration", "admin"],
  ["news.get", "public-read"],
  ["news.getById", "public-read"],
  ["news.getBySlugOrId", "public-read"],
  ["news.getFeatured", "public-read"],
  ["news.remove", "admin"],
  ["news.seed", "admin"],
  ["news.update", "staff"],
  ["newsletter.createCampaign", "staff"],
  ["newsletter.createTemplate", "staff"],
  ["newsletter.deleteCampaign", "admin"],
  ["newsletter.deleteSubscriber", "admin"],
  ["newsletter.deleteTemplate", "admin"],
  ["newsletter.getCampaign", "staff"],
  ["newsletter.getSubscriberStats", "staff"],
  ["newsletter.importSubscribers", "staff"],
  ["newsletter.listCampaigns", "staff"],
  ["newsletter.listSubscribers", "staff"],
  ["newsletter.listTemplates", "staff"],
  ["newsletter.sendCampaign", "staff"],
  ["newsletter.subscribe", "public-subscription"],
  ["newsletter.unsubscribe", "public-subscription"],
  ["newsletter.updateCampaign", "staff"],
  ["newsletter.updateSubscriber", "staff"],
  ["notifications.inbox", "authenticated"],
  ["notifications.markRead", "authenticated"],
  ["notifications.markAllRead", "authenticated"],
  ["notifications.getPreferences", "authenticated"],
  ["notifications.updatePreferences", "authenticated"],
  ["notifications.registerPushToken", "authenticated"],
  ["notifications.disablePushToken", "authenticated"],
  ["opportunities.create", "staff"],
  ["opportunities.get", "public-read"],
  ["opportunities.getById", "public-read"],
  ["opportunities.remove", "admin"],
  ["opportunities.update", "staff"],
  ["ops.getBudgetStatus", "admin"],
  ["ops.getSystemStatus", "public-read"],
  ["ops.listStaleDocuments", "admin"],
  ["ops.toggleSystemStatus", "admin"],
  ["paralegals.addParalegalManually", "staff"],
  ["paralegals.deactivateParalegal", "staff"],
  ["paralegals.getDashboardData", "authenticated-self-or-staff"],
  ["paralegals.getParalegal", "public-read"],
  ["paralegals.getParalegalByEmail", "authenticated-self-or-staff"],
  ["paralegals.getParalegalStats", "staff"],
  ["paralegals.importParalegalsBatch", "staff"],
  ["paralegals.incrementProfileViews", "public-counter"],
  ["paralegals.listApprovedParalegals", "public-read"],
  ["paralegals.toggleVerified", "staff"],
  ["paralegals.updateParalegalProfile", "authenticated-self-or-staff"],
  ["programs.create", "staff"],
  ["programs.get", "public-read"],
  ["programs.getById", "public-read"],
  ["programs.getBySlug", "public-read"],
  ["programs.remove", "admin"],
  ["programs.update", "staff"],
  ["publications.create", "staff"],
  ["publications.createForMigration", "admin"],
  ["publications.get", "public-read"],
  ["publications.getById", "public-read"],
  ["publications.getFeatured", "public-read"],
  ["publications.incrementDownloadCount", "public-counter"],
  ["publications.remove", "admin"],
  ["publications.seed", "admin"],
  ["publications.update", "staff"],
  ["quickLinks.create", "admin"],
  ["quickLinks.getAll", "admin"],
  ["quickLinks.getPublic", "public-read"],
  ["quickLinks.swapOrder", "admin"],
  ["quickLinks.toggleStatus", "admin"],
  ["quickLinks.trackClick", "public-counter"],
  ["quickLinks.update", "admin"],
  ["referrals.createForCase", "case-worker"],
  ["referrals.createOnwardReferral", "case-worker-or-assigned-provider"],
  ["referrals.generateConsentUploadUrl", "case-worker"],
  ["referrals.listForCase", "case-access"],
  ["referrals.myDestinationQueue", "service-provider"],
  ["referrals.respondAsDestination", "service-provider"],
  ["referrals.reviewConsentEvidence", "staff"],
  ["referrals.staffConsentEvidenceQueue", "staff"],
  ["referrals.staffQueue", "staff"],
  ["referrals.updateStatus", "case-worker"],
  ["resend.sendEmail", "staff-action"],
  ["sara.deleteDocument", "admin"],
  ["sara.generateUploadUrl", "staff"],
  ["sara.getConfig", "public-read"],
  ["sara.getDocuments", "staff"],
  ["sara.updateConfig", "admin"],
  ["sara_actions.ask", "authenticated-action"],
  ["sara_actions.ingestDocument", "staff-action"],
  ["sara_chat.clearHistory", "authenticated"],
  ["sara_chat.getAnalytics", "staff"],
  ["sara_chat.getFeedbackList", "staff"],
  ["sara_chat.getMessages", "authenticated-or-empty"],
  ["sara_chat.getRiskEvents", "staff"],
  ["sara_chat.sendMessage", "authenticated"],
  ["sara_chat.submitFeedback", "authenticated-self"],
  ["seedContent.clearAllAndReseed", "admin"],
  ["seedContent.seedAllContent", "admin"],
  ["seo.getSitemapData", "public-read"],
  ["settings.getSetting", "public-read"],
  ["settings.getSettings", "public-read"],
  ["settings.updateSettings", "admin"],
  ["stats.get", "public-read"],
  ["stats.seed", "admin"],
  ["stories.create", "staff"],
  ["stories.createForMigration", "admin"],
  ["stories.get", "public-read"],
  ["stories.getById", "public-read"],
  ["stories.remove", "admin"],
  ["stories.seed", "admin"],
  ["stories.update", "staff"],
  ["team.create", "staff"],
  ["team.get", "public-read"],
  ["team.getById", "public-read"],
  ["team.remove", "admin"],
  ["team.seed", "admin"],
  ["team.update", "staff"],
  ["testimonials.create", "staff"],
  ["testimonials.get", "public-read"],
  ["testimonials.getFeatured", "public-read"],
  ["testimonials.remove", "admin"],
  ["testimonials.seed", "admin"],
  ["testimonials.update", "staff"],
  ["users.generateUploadUrl", "authenticated"],
  ["users.getCurrentUser", "public-self-null"],
  ["users.currentAccess", "public-self-null"],
  ["users.deactivateMyProfile", "authenticated-self"],
  ["users.getDashboardData", "authenticated"],
  ["users.makeAdmin", "admin"],
  ["users.syncUser", "authenticated-self"],
  ["users.updateProfile", "authenticated"],
  ["whistleblower.getById", "staff"],
  ["whistleblower.getStats", "staff"],
  ["whistleblower.list", "staff"],
  ["whistleblower.remove", "admin"],
  ["whistleblower.submit", "public-submission"],
  ["whistleblower.updateStatus", "staff"],
]);

const gatePatterns = {
  admin: [/requireAnyRole\(ctx,\s*\["admin"\]/],
  staff: [/requireAnyRole\(ctx,\s*\["admin",\s*"staff"(?:,\s*"supervisor")?\]\)/, /requireAdminOrStaff\(ctx\)/],
  authenticated: [/requireAuthenticatedUser\(ctx\)/, /ctx\.auth\.getUserIdentity\(\)/],
  "authenticated-self": [/requireAuthenticatedUser\(ctx\)/, /ctx\.auth\.getUserIdentity\(\)/],
  "authenticated-self-or-staff": [/requireAuthenticatedUser\(ctx\)/],
  "authenticated-action": [/ctx\.auth\.getUserIdentity\(\)/],
  "staff-action": [/requireAdminOrStaffAction\(ctx\)/],
  "case-access": [/requireCaseAccess\(ctx,/],
  "case-worker": [/requireCaseWorker\(ctx,/],
  "case-worker-or-assigned-provider": [
    /requireAnyRole\(ctx,\s*\["admin",\s*"staff",\s*"supervisor",\s*"paralegal",\s*"provider_staff"\]\)/,
    /parent\.destinationUserId !== actor\.user\._id/,
  ],
  "service-provider": [/requireAnyRole\(ctx,\s*\["paralegal",\s*"provider_staff"\]\)/],
};

const publicCategories = new Set([
  "public-read",
  "public-tracking",
  "public-submission",
  "public-subscription",
  "public-counter",
  "public-proxied-chatbot",
  "public-self-null",
  "authenticated-or-empty",
]);

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "_generated" || entry === "node_modules" || entry === "dist") continue;
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function extractExportedFunctions(file, source) {
  const moduleName = path.basename(file).replace(/\.[tj]sx?$/, "");
  const results = [];
  const re = /export\s+const\s+(\w+)\s*=\s*(query|mutation|action)\s*\(/g;
  let match;
  while ((match = re.exec(source))) {
    const name = match[1];
    const kind = match[2];
    const start = match.index;
    const next = source.slice(re.lastIndex).search(/\nexport\s+const\s+\w+\s*=/);
    const end = next === -1 ? source.length : re.lastIndex + next;
    results.push({
      key: `${moduleName}.${name}`,
      kind,
      body: source.slice(start, end),
    });
  }
  return results;
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}

const failures = [];
const foundPublicFunctions = new Set();

for (const file of walk(convexDir).filter((file) => file.endsWith(".ts"))) {
  const source = readFileSync(file, "utf8");
  for (const fn of extractExportedFunctions(file, source)) {
    foundPublicFunctions.add(fn.key);
    const classification = publicFunctions.get(fn.key);
    assert(classification, `Unclassified public Convex function: ${fn.key}`, failures);
    if (!classification) continue;

    const patterns = gatePatterns[classification];
    if (patterns) {
      assert(
        patterns.some((pattern) => pattern.test(fn.body)),
        `${fn.key} is classified as ${classification} but does not contain the expected auth gate`,
        failures,
      );
    }

    if ((fn.kind === "mutation" || fn.kind === "action") && !publicCategories.has(classification) && !patterns) {
      failures.push(`${fn.key} is a non-public ${fn.kind} without an auth gate rule`);
    }
  }
}

for (const expected of publicFunctions.keys()) {
  assert(foundPublicFunctions.has(expected), `Expected public Convex function missing: ${expected}`, failures);
}

const frontendFiles = walk(srcDir).filter((file) => /\.(tsx|ts)$/.test(file));
for (const file of frontendFiles) {
  const source = readFileSync(file, "utf8");
  if (source.includes("dangerouslySetInnerHTML") && !source.includes("sanitizeHtml(") && !file.endsWith("chart.tsx")) {
    failures.push(`Unsafe HTML render without sanitizeHtml: ${path.relative(root, file)}`);
  }
}

const secretSearchFiles = [...walk(srcDir), ...walk(convexDir), path.join(root, ".env.example")];
for (const file of secretSearchFiles.filter((file) => /\.(tsx?|jsx?|example)$/.test(file))) {
  const source = readFileSync(file, "utf8");
  if (/webhook-test|webhook\/webhook|lsfsaraai|lsfai\.app\.n8n|anonymous_dev_user|Lsf2026|unsafeMetadata\?\.role/.test(source)) {
    failures.push(`Forbidden legacy secret/bypass string found in ${path.relative(root, file)}`);
  }
}

if (failures.length) {
  console.error("Convex security checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Convex security checks passed (${foundPublicFunctions.size} public functions classified).`);
