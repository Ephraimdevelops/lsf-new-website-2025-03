import type { Id } from "./_generated/dataModel";
type Fixture = { profileId: Id<"paralegal_applications">; requestId: Id<"legal_help_requests">; providerId: Id<"users">; beneficiaryId: Id<"users">; reviewerId: Id<"users">; scope: string; destinationServiceId: Id<"justice_services">; onwardServiceId: Id<"justice_services">; receiverId: Id<"users"> };
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
function developmentOnly() {
 if (process.env.CONVEX_SITE_URL !== "https://joyous-spaniel-5.convex.site") throw new Error("Synthetic paralegal fixtures are restricted to the named development deployment.");
}
export const prepare = internalAction({
 args: { scenario: v.optional(v.string()) },
 handler: async (ctx, args): Promise<Fixture> => {
  developmentOnly();
  const storageId = await ctx.storage.store(new Blob(["SYNTHETIC DEVELOPMENT FIXTURE. No real identity, qualification or beneficiary document. For screen and workflow testing only."], { type: "text/plain" }));
  try { return await ctx.runMutation(internal.paralegalRehearsal.seed, { storageId, scenario: args.scenario }); }
  catch (error) { await ctx.storage.delete(storageId); throw error; }
 },
});
export const seed = internalMutation({
 args: { storageId: v.id("_storage"), scenario: v.optional(v.string()) },
 handler: async (ctx, args) => {
  developmentOnly();
  const qa = async (slug: string) => {
   const user = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", `haki-qa-${slug}+clerk_test@example.com`)).unique();
   if (!user || user.isDeleted || !user.clerkId || !user.name.startsWith("QA ")) throw new Error(`Expected existing QA ${slug} account.`);
   return user;
  };
  const [provider, beneficiary, reviewer] = await Promise.all([qa("paralegal"), qa("beneficiary"), qa("admin")]);
  const now = Date.now();
  const scenario = args.scenario ?? "active-v1";
  if (!/^[a-z0-9-]{1,64}$/.test(scenario)) throw new Error("Invalid synthetic scenario.");
  const existing = await ctx.db.query("paralegal_applications").withIndex("by_email", q => q.eq("email", provider.email)).collect();
  if (existing.some(item => !item.syntheticDevelopmentFixture)) throw new Error("A real or pre-existing profile cannot be replaced by synthetic fixtures.");
  const profile = existing[0];
  const profileId = profile?._id ?? await ctx.db.insert("paralegal_applications", { syntheticDevelopmentFixture: true, fullName: "QA Paralegal — TEST ONLY", email: provider.email, phone: "+255000000000", region: "Dar es Salaam", district: "Ilala", education: "Synthetic testing qualification", experience: "Synthetic testing experience", motivation: "Test paralegal screens and workflows in development.", languages: ["Kiswahili", "English"], submittedAt: now, status: "approved", reviewedBy: reviewer.clerkId, reviewedAt: now, reviewNotes: "SIMULATED development approval. No real qualification checked.", isVerified: true, idDocumentStorageId: args.storageId, certificateStorageId: args.storageId, bio: "Synthetic development account. Not a public legal aid provider.", specializations: ["employment"], availabilityStatus: "accepting_cases", weeklyCapacity: 20, workingHours: "Monday–Friday, 09:00–17:00 EAT", onboardingCompleted: true, ethicsAcceptedAt: now, codeOfConductAcceptedAt: now, safeguardingTrainingCompletedAt: now, hasJoinedHakiYangu: true, approvedAt: now });
  if (profile) await ctx.storage.delete(args.storageId);
  const requests = await ctx.db.query("legal_help_requests").withIndex("by_owner", q => q.eq("ownerId", beneficiary._id)).collect();
  let request = requests.find(item => item.clientRequestId === `paralegal-rehearsal-${scenario}`);
  if (!request) {
   const id = await ctx.db.insert("legal_help_requests", { publicId: "TEST-PARALEgal-REQUEST", ownerId: beneficiary._id, clientRequestId: `paralegal-rehearsal-${scenario}`, status: "submitted", locale: "en", description: "TEST ONLY: a fictional person requests guidance about an unpaid wage. No real dispute or personal data.", issueCategory: "employment", safeContactMethod: "in_app", preferredLanguage: "both", region: "Dar es Salaam", district: "Ilala", desiredHelp: "Understand the next steps for a fictional wage issue.", hasDocuments: false, urgency: "standard", version: 1, createdAt: now, updatedAt: now, submittedAt: now });
   request = (await ctx.db.get(id)) ?? undefined;
  }
  const receiver = await qa("provider");
  const serviceFor = async (userId: Id<"users">, name: string) => {
   const memberships = await ctx.db.query("role_assignments").withIndex("by_user_status", q => q.eq("userId", userId).eq("status", "active")).collect();
   const organisationKey = memberships.find(item => item.organizationId && ["provider_staff", "paralegal"].includes(item.role))?.organizationId;
   const organisationId = organisationKey ? ctx.db.normalizeId("justice_service_organizations", organisationKey) : null;
   if (!organisationId) throw new Error("Expected existing QA professional organisation.");
   const services = await ctx.db.query("justice_services").withIndex("by_organization", q => q.eq("organizationId", organisationId)).collect();
   const existing = services.find(item => item.name === name && item.syntheticDevelopmentFixture);
   if (existing) return existing._id;
   return await ctx.db.insert("justice_services", { syntheticDevelopmentFixture: true, name, organizationId: organisationId, servicePointType: "legal_aid_provider", classification: "community", visibility: "public", verificationStatus: "verified", source: "Synthetic development fixture; simulated verification", lastVerifiedAt: now, nextReviewAt: now + 30*86400000, active: true, country: "Tanzania", region: "Dar es Salaam", district: "Ilala", serviceCoverageRegions: ["Dar es Salaam"], issueCategories: ["employment"], serviceTypes: ["advice"], referralCapability: true, walkIn: false, appointmentRequired: true, remoteSupport: true, phoneSupport: false, currentIntakeState: "open", emergencyCapability: false, languages: ["English", "Kiswahili"], privacyAvailable: true, genderSensitive: true, createdBy: reviewer._id, createdAt: now, updatedAt: now });
  };
  const destinationServiceId = await serviceFor(receiver._id, "TEST ONLY — QA receiving service");
  const onwardServiceId = await serviceFor(provider._id, "TEST ONLY — QA onward service");
  return { profileId, requestId: request!._id, providerId: provider._id, beneficiaryId: beneficiary._id, reviewerId: reviewer._id, destinationServiceId, onwardServiceId, receiverId: receiver._id, scope: "Synthetic development only; simulated readiness; excluded from public paralegal listings." };
 },
});
