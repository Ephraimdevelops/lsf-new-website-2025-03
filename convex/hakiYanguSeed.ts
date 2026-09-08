import { mutation } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";

const mobileDirectorySeed = [
  {
    fullName: "Rehema Mwanga",
    email: "rehema.mwanga.seed@lsf.or.tz",
    phone: "+255712345678",
    whatsapp: "+255712345678",
    region: "Dar es Salaam",
    district: "Kinondoni",
    ward: "Mikocheni",
    education: "Diploma in Law",
    experience: "5+ years supporting employment, land, and family matters.",
    motivation: "Seeded for Haki Yangu mobile directory QA.",
    languages: ["Swahili", "English"],
    bio: "Helps individuals and families resolve employment, land, and family issues through clear guidance and practical support.",
    specializations: ["Employment", "Land", "Family"],
    availabilityStatus: "accepting_cases" as const,
    weeklyCapacity: 12,
    workingHours: "Mon - Sat, 8:00 AM - 6:00 PM",
  },
  {
    fullName: "Juma Khatibu",
    email: "juma.khatibu.seed@lsf.or.tz",
    phone: "+255713456789",
    whatsapp: "+255713456789",
    region: "Dar es Salaam",
    district: "Ilala",
    ward: "Kariakoo",
    education: "Certificate in Legal Aid",
    experience: "4+ years supporting workers, tenants, and consumer complaints.",
    motivation: "Seeded for Haki Yangu mobile directory QA.",
    languages: ["Swahili"],
    bio: "Supports workers, consumers, and tenants with documentation, referrals, and follow-up steps.",
    specializations: ["Employment", "Consumer", "Tenancy"],
    availabilityStatus: "limited" as const,
    weeklyCapacity: 8,
    workingHours: "Mon - Fri, 9:00 AM - 5:00 PM",
  },
  {
    fullName: "Asha Mohamed",
    email: "asha.mohamed.seed@lsf.or.tz",
    phone: "+255714567890",
    whatsapp: "+255714567890",
    region: "Arusha",
    district: "Arusha DC",
    ward: "Moshono",
    education: "Community Paralegal Training",
    experience: "6+ years supporting family, land, and GBV-sensitive referrals.",
    motivation: "Seeded for Haki Yangu mobile directory QA.",
    languages: ["Swahili", "English"],
    bio: "Focused on family, land, and GBV-sensitive referrals with privacy-first support.",
    specializations: ["Family", "Land", "Safety"],
    availabilityStatus: "accepting_cases" as const,
    weeklyCapacity: 10,
    workingHours: "Mon - Sat, 8:30 AM - 5:30 PM",
  },
];

export const seedMobileDirectory = mutation({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    const now = Date.now();
    let inserted = 0;
    let updated = 0;

    for (const item of mobileDirectorySeed) {
      const existing = await ctx.db
        .query("paralegal_applications")
        .withIndex("by_email", (q) => q.eq("email", item.email))
        .first();

      const record = {
        ...item,
        status: "approved" as const,
        isVerified: true,
        submittedAt: existing?.submittedAt ?? now,
        approvedAt: existing?.approvedAt ?? now,
        reviewedAt: now,
        reviewedBy: user.email,
        reviewNotes: "Approved seed record for Haki Yangu mobile QA. Replace with live verified provider records before production.",
        profileViews: existing?.profileViews ?? 0,
        hasJoinedHakiYangu: existing?.hasJoinedHakiYangu ?? false,
        onboardingCompleted: true,
      };

      if (existing) {
        await ctx.db.patch(existing._id, record);
        updated += 1;
      } else {
        await ctx.db.insert("paralegal_applications", record);
        inserted += 1;
      }
    }

    return {
      success: true,
      inserted,
      updated,
      total: mobileDirectorySeed.length,
    };
  },
});
