export type AiReference = {
  id: string;
  title: string;
  kind: string;
  url?: string;
  phone?: string;
};
export function phoneReferenceKey(phone?: string) {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0"))
    digits = "255" + digits.slice(1);
  if (digits.length < 9 || digits.length > 15) return undefined;
  return "phone:" + digits;
}
export function referenceExcluded(
  excluded: ReadonlySet<string>,
  id: string,
  phone?: string,
) {
  const key = phoneReferenceKey(phone);
  return excluded.has(id) || Boolean(key && excluded.has(key));
}
export const correctionCategories = [
  "wrong_contact",
  "unavailable",
  "wrong_location",
  "unsuitable_service",
  "incorrect_guidance",
  "outdated_information",
  "other",
] as const;
export function correctionCategory(text: string) {
  if (
    /(?:my (?:certificate|document|account|address|phone|number|record)|cheti changu|nyaraka zangu|namba yangu)/i.test(
      text,
    ) &&
    !/(?:you gave|you sent|you said|your answer|uliyonipa|uliyotoa|ulichosema)/i.test(
      text,
    )
  )
    return undefined;
  if (/^(?:what if|suppose|if |kama |ikiwa |vipi kama)/i.test(text.trim()))
    return undefined;
  if (
    /wrong (?:phone|number)|incorrect number|(?:the |that |this )?(?:phone|number).{0,30}(?:is wrong|doesn.t work|not correct)|namba.{0,25}(?:si sahihi|siyo|sio sahihi|sio yake|si yake|haipo|haifanyi|wrong)/i.test(
      text,
    )
  )
    return "wrong_contact";
  if (
    /(?:this|that|huyu).{0,25}(?:unavailable|hayupo)|not accepting|not answering|not picking up|no answer|hapokei|hawapokei|namba.{0,25}(?:haipatikani|haipokelewi)/i.test(
      text,
    )
  )
    return "unavailable";
  if (
    /ofisi.{0,25}(?:haipo|hawapo|si hapo|imehama)|wrong (?:location|address)|(?:location|address).{0,20}(?:wrong|incorrect)|anwani.{0,25}(?:si sahihi|siyo)|eneo.{0,25}si sahihi/i.test(
      text,
    )
  )
    return "wrong_location";
  if (
    /not.{0,12}(?:right|suitable).{0,15}(?:service|contact|person)|huyu.{0,25}(?:hanisaidii|hafanyi)|huduma.{0,25}hainifai/i.test(
      text,
    )
  )
    return "unsuitable_service";
  if (/outdated|imepitwa na wakati|zimepitwa na wakati/i.test(text))
    return "outdated_information";
  if (
    /(?:this|that|your|answer|information|advice).{0,30}(?:wrong|incorrect|not correct)|(?:hii|hiyo|taarifa|jibu|ushauri).{0,35}(?:si sahihi|siyo sahihi|sio sahihi|sio kweli|siyo kweli|si kweli)|^(?:sio|siyo|si) kweli[.!]?$|umenipotosha|(?:you are|you.re) wrong/i.test(
      text,
    )
  )
    return "incorrect_guidance";
  return undefined;
}
export const correctionInstructions = `INFORMATION CORRECTIONS: Treat a user's report of a wrong number, unsuitable service, wrong location, outdated source or incorrect answer as actionable feedback, not a human-takeover request. Briefly acknowledge it. If the reason or which of several contacts is unclear, ask one short clarification. Use report_information_problem with an ID from RECENT SHOWN REFERENCES (last_answer for a general answer problem). The server records the user's own words for admin review and excludes the disputed item in this chat; never claim global correction, suspension or provider contact happened. Search alternatives without repeating an excluded contact/source. A user disputing a legal claim does not establish a replacement legal rule: recheck approved alternate evidence and explain specific uncertainty. Do not treat a previous disputed assistant answer as evidence.`;
export function correctionReference(text: string, references: AiReference[]) {
  const digits = text.replace(/\D/g, "");
  const matches = references.filter(
    (r) =>
      r.kind !== "answer" &&
      ((r.phone &&
        digits.length >= 9 &&
        digits.includes(r.phone.replace(/\D/g, ""))) ||
        r.title
          .toLowerCase()
          .split(/\s+/)
          .filter(
            (x) =>
              x.length > 3 &&
              ![
                "published",
                "directory",
                "information",
                "legal",
                "paralegal",
              ].includes(x),
          )
          .some((name) =>
            new RegExp(
              "\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b",
              "i",
            ).test(text),
          )),
  );
  return matches.length === 1 ? matches[0].id : "last_answer";
}

export async function recordShownReferences(
  ctx: any,
  scope: string,
  references: AiReference[],
  answerId?: string,
) {
  const refs = references.slice(0, 20);
  for (const ref of refs) {
    if (ref.id.length > 250 || ref.title.length > 250)
      throw Error("Invalid reference");
    const old = await ctx.db
      .query("ai_reference_exposures")
      .withIndex("by_scope_reference", (q: any) =>
        q.eq("scope", scope).eq("referenceId", ref.id),
      )
      .unique();
    const fields = {
      title: ref.title,
      kind: ref.kind,
      ...(ref.url ? { url: ref.url } : {}),
      ...(ref.phone ? { phone: ref.phone } : {}),
      shownAt: Date.now(),
    };
    if (old) await ctx.db.patch(old._id, fields);
    else
      await ctx.db.insert("ai_reference_exposures", {
        scope,
        referenceId: ref.id,
        ...fields,
      });
  }
  if (answerId) {
    const referenceId = "answer:" + answerId;
    const old = await ctx.db
      .query("ai_reference_exposures")
      .withIndex("by_scope_reference", (q: any) =>
        q.eq("scope", scope).eq("referenceId", referenceId),
      )
      .unique();
    const fields = {
      title: "Previous AI answer",
      kind: "answer",
      relatedIds: refs.map((x) => x.id),
      shownAt: Date.now(),
    };
    if (old) await ctx.db.patch(old._id, fields);
    else
      await ctx.db.insert("ai_reference_exposures", {
        scope,
        referenceId,
        ...fields,
      });
  }
}
export async function globallySuspendedReferences(
  ctx: any,
): Promise<Set<string>> {
  return new Set(
    (
      await ctx.db
        .query("ai_reference_reviews")
        .withIndex("by_suspended", (q: any) => q.eq("suspended", true))
        .take(1000)
    ).flatMap((x: any) => [x.referenceId, ...(x.phoneKey ? [x.phoneKey] : [])]),
  );
}
