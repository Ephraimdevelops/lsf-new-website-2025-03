import { internalQuery } from "./_generated/server";

// Operator-only aggregate evidence. Never expose people, conversations or keys.
export const summary = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const documents = await ctx.db.query("documents").collect();
    const organisations = await ctx.db.query("justice_service_organizations").collect();
    const services = await ctx.db.query("justice_services").collect();
    const applications = await ctx.db.query("paralegal_applications").collect();
    const prompts = await ctx.db.query("saada_prompt_versions").collect();
    const retrievable = documents.filter((d) => d.approvalStatus === "approved" && d.indexingStatus === "ready" && (d.reviewDueAt ?? 0) > now);
    let retrievableChunks = 0;
    for (const document of retrievable) {
      retrievableChunks += (await ctx.db.query("embeddings").withIndex("by_documentId", (q) => q.eq("documentId", document._id)).collect()).length;
    }
    return {
      checkedAt: new Date(now).toISOString(),
      scope: "Configured deployment aggregate inventory; does not certify legal currency, operational capacity or successful account journeys",
      legalSources: {
        total: documents.length,
        pending: documents.filter((d) => d.approvalStatus === "pending").length,
        approved: documents.filter((d) => d.approvalStatus === "approved").length,
        failedIndexing: documents.filter((d) => d.indexingStatus === "failed").length,
        approvedReadyReviewCurrent: retrievable.length,
        retrievableChunks,
        approvedPromptVersions: prompts.filter((p) => p.status === "approved").length,
      },
      directory: {
        organisations: organisations.length,
        verifiedOrganisations: organisations.filter((o) => o.verificationStatus === "verified").length,
        activeReferralAgreements: organisations.filter((o) => o.referralAgreementStatus === "active").length,
        services: services.length,
        activeVerifiedPublicServices: services.filter((s) => s.active && s.visibility === "public" && s.verificationStatus === "verified").length,
      },
      paralegals: {
        applications: applications.length,
        approvedApplications: applications.filter((a) => a.status === "approved").length,
        verifiedApprovedApplications: applications.filter((a) => a.status === "approved" && a.isVerified).length,
        note: "Application counts are not a count of role-active, trained, available providers",
      },
    };
  },
});
