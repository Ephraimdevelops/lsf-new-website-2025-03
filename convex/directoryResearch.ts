import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
import { requireAnyRole } from "./lib/auth";
import {
  globallySuspendedReferences,
  referenceExcluded,
} from "./lib/aiCorrections";
import { researchSearchText, validateResearchEntry } from "./lib/researchEntry";
const input = {
  externalKey: v.string(),
  kind: v.union(
    v.literal("organisation"),
    v.literal("centre"),
    v.literal("pathway"),
  ),
  title: v.string(),
  region: v.optional(v.string()),
  district: v.optional(v.string()),
  address: v.optional(v.string()),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  notes: v.string(),
  sourceUrls: v.array(v.string()),
  originalRecord: v.string(),
};
// Private research is deliberately separate from public recommendations and provider memberships.
export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    archived: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAnyRole(ctx, ["admin", "staff", "supervisor"]);
    const search = (args.search ?? "").trim().toLowerCase();
    if (search.length > 200) throw new Error("Use a shorter search.");
    if (search)
      return ctx.db
        .query("directory_research")
        .withSearchIndex("search_research", (q) =>
          q.search("searchText", search).eq("archived", args.archived),
        )
        .paginate(args.paginationOpts);
    return ctx.db
      .query("directory_research")
      .withIndex("by_archived", (q) => q.eq("archived", args.archived))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
export const importDrafts = mutation({
  args: { entries: v.array(v.object(input)) },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    if (args.entries.length < 1 || args.entries.length > 100)
      throw new Error("Import 1–100 research records per batch.");
    let added = 0,
      skipped = 0;
    for (const entry of args.entries) {
      validateResearchEntry(entry);
      const existing = await ctx.db
        .query("directory_research")
        .withIndex("by_external_key", (q) =>
          q.eq("externalKey", entry.externalKey),
        )
        .first();
      if (existing) {
        skipped++;
        continue;
      }
      await ctx.db.insert("directory_research", {
        ...entry,
        searchText: researchSearchText(entry),
        title: entry.title.trim(),
        archived: false,
        createdBy: user._id,
        updatedBy: user._id,
        updatedAt: Date.now(),
      });
      added++;
    }
    await ctx.db.insert("audit_logs", {
      action: "directory.research_imported",
      entityType: "directory_research",
      entityId: "batch",
      userId: user._id,
      timestamp: Date.now(),
      metadata: { added, skipped },
    });
    return { added, skipped };
  },
});
export const update = mutation({
  args: { id: v.id("directory_research"), ...input },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    const old = await ctx.db.get(args.id);
    if (!old) throw new Error("Research record not found.");
    validateResearchEntry(args);
    if (
      args.externalKey !== old.externalKey ||
      args.originalRecord !== old.originalRecord
    )
      throw new Error("Original provenance must be retained.");
    const { id, ...entry } = args;
    await ctx.db.patch(id, {
      ...entry,
      publicReference: undefined,
      searchText: researchSearchText(entry),
      title: entry.title.trim(),
      updatedBy: user._id,
      updatedAt: Date.now(),
    });
    await ctx.db.insert("audit_logs", {
      action: "directory.research_updated",
      entityType: "directory_research",
      entityId: id,
      userId: user._id,
      timestamp: Date.now(),
      metadata: { previous: old },
    });
  },
});
export const setArchived = mutation({
  args: {
    id: v.id("directory_research"),
    archived: v.boolean(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin", "staff"]);
    if (args.reason.trim().length < 10 || args.reason.length > 2000)
      throw new Error("Record a 10–2000 character reason.");
    if (!(await ctx.db.get(args.id)))
      throw new Error("Research record not found.");
    await ctx.db.patch(args.id, {
      archived: args.archived,
      updatedBy: user._id,
      updatedAt: Date.now(),
    });
    await ctx.db.insert("audit_logs", {
      action: args.archived
        ? "directory.research_archived"
        : "directory.research_restored",
      entityType: "directory_research",
      entityId: args.id,
      userId: user._id,
      timestamp: Date.now(),
      metadata: { reason: args.reason },
    });
  },
});

// Approval here is deliberately limited to factual preparation or publisher
// contacts. It does not establish a legal rule, registered provider or intake.
export const reviewPublicReference = mutation({
  args: {
    id: v.id("directory_research"),
    scope: v.union(v.literal("preparation"), v.literal("published_contact")),
    titleEn: v.string(),
    titleSw: v.string(),
    bodyEn: v.string(),
    bodySw: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    region: v.optional(v.string()),
    district: v.optional(v.string()),
    sourceUrls: v.array(v.string()),
    note: v.string(),
    reviewDueAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin"]);
    const row = await ctx.db.get(args.id);
    if (!row || row.archived) throw Error("Active research record not found");
    if ((row.kind === "pathway") !== (args.scope === "preparation"))
      throw Error(
        "Pathways can only be approved as preparation, not legal determinations",
      );
    for (const [key, max] of [
      ["titleEn", 200],
      ["titleSw", 200],
      ["bodyEn", 3000],
      ["bodySw", 3000],
      ["note", 2000],
    ] as const) {
      if (args[key].trim().length < 10 || args[key].length > max)
        throw Error("Provide a bounded bilingual review: " + key);
    }
    if (!args.sourceUrls.length || args.sourceUrls.length > 10)
      throw Error("Include 1–10 checked public sources");
    for (const text of args.sourceUrls) {
      const url = new URL(text);
      if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        text.length > 1000
      )
        throw Error("Use public HTTPS source links");
    }
    if (
      args.reviewDueAt <= Date.now() ||
      args.reviewDueAt > Date.now() + 90 * 86400000
    )
      throw Error("Set a future review within 90 days");
    for (const key of [
      "phone",
      "email",
      "address",
      "region",
      "district",
    ] as const)
      if ((args[key]?.length ?? 0) > 300)
        throw Error("Contact field is too long");
    if (
      args.scope === "preparation" &&
      (args.phone || args.email || args.address)
    )
      throw Error("Keep contact recommendations in a separate checked record");
    if (/shelter|safe.?house/i.test(row.title) && args.address)
      throw Error(
        "Publish only the safe public referral contact for this record",
      );
    const { id, ...content } = args;
    await ctx.db.patch(id, {
      publicReference: {
        ...content,
        reviewedBy: user._id,
        reviewedAt: Date.now(),
      },
    });
    await ctx.db.insert("audit_logs", {
      action: "directory.reference_approved",
      entityType: "directory_research",
      entityId: id,
      userId: user._id,
      timestamp: Date.now(),
      metadata: {
        scope: args.scope,
        sourceUrls: args.sourceUrls,
        note: args.note,
      },
    });
    return { success: true };
  },
});
export const withdrawPublicReference = mutation({
  args: { id: v.id("directory_research"), reason: v.string() },
  handler: async (ctx, args) => {
    const { user } = await requireAnyRole(ctx, ["admin"]);
    const row = await ctx.db.get(args.id);
    if (!row?.publicReference) throw Error("Published reference not found");
    if (args.reason.trim().length < 10 || args.reason.length > 2000)
      throw Error("Explain the withdrawal");
    await ctx.db.patch(args.id, { publicReference: undefined });
    await ctx.db.insert("audit_logs", {
      action: "directory.reference_withdrawn",
      entityType: "directory_research",
      entityId: args.id,
      userId: user._id,
      timestamp: Date.now(),
      metadata: { reason: args.reason },
    });
  },
});
export const searchPublicReferences = query({
  args: {
    search: v.optional(v.string()),
    excludedIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    if ((args.search?.length ?? 0) > 200)
      throw Error("Use a shorter reference search");
    const terms = (args.search ?? "")
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(
        (x) =>
          x.length > 2 &&
          !["the", "and", "kwa", "naomba", "msaada", "legal", "help"].includes(
            x,
          ),
      );
    if ((args.excludedIds?.length ?? 0) > 300)
      throw Error("Too many exclusions");
    const suspended = await globallySuspendedReferences(ctx);
    for (const id of args.excludedIds ?? []) suspended.add(id);
    const rows = await ctx.db
      .query("directory_research")
      .withIndex("by_archived", (q) => q.eq("archived", false))
      .collect();
    return rows
      .filter(
        (x) =>
          x.publicReference &&
          x.publicReference.reviewDueAt > Date.now() &&
          !referenceExcluded(
            suspended,
            "research:" + x._id,
            x.publicReference?.phone,
          ),
      )
      .map((x) => {
        const { reviewedBy, note, ...published } = x.publicReference!;
        return { id: "research:" + x._id, ...published };
      })
      .map((x) => {
        const tokens = (text: string) =>
          new Set(text.toLowerCase().split(/[^\p{L}\p{N}]+/u));
        const title = tokens(x.titleEn + " " + x.titleSw),
          area = tokens((x.region ?? "") + " " + (x.district ?? "")),
          body = tokens(x.bodyEn + " " + x.bodySw);
        return {
          reference: x,
          score: terms.reduce(
            (n, t) =>
              n +
              3 * Number(title.has(t)) +
              4 * Number(area.has(t)) +
              Number(body.has(t)),
            0,
          ),
        };
      })
      .filter((x) => !terms.length || x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.reference);
  },
});
