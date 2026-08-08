import { internalMutation } from "./_generated/server";

const brokenHeroImages: Record<string, string> = {
  "https://example.com/absolute-test.jpg":
    "/lovable-uploads/background with mother umage .png",
  kg2e5rga5xwk4eamhed85pgzt982sgs3:
    "/lovable-uploads/haki yangu app uzinuzi.webp",
};

export const repairKnownBrokenHeroImages = internalMutation({
  args: {},
  handler: async (ctx) => {
    const slides = await ctx.db.query("hero_slides").collect();
    let repaired = 0;

    for (const slide of slides) {
      const replacement = brokenHeroImages[slide.imageUrl];
      if (!replacement) continue;

      await ctx.db.patch(slide._id, { imageUrl: replacement });
      repaired += 1;
    }

    return { repaired };
  },
});
