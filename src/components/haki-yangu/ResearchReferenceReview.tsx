import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

export default function ResearchReferenceReview({
  record,
}: {
  record: Doc<"directory_research">;
}) {
  const review = useMutation(api.directoryResearch.reviewPublicReference);
  const previous = record.publicReference;
  const [fields, setFields] = useState({
    titleEn: previous?.titleEn ?? record.title,
    titleSw: previous?.titleSw ?? "",
    bodyEn: previous?.bodyEn ?? "",
    bodySw: previous?.bodySw ?? "",
    phone: previous?.phone ?? "",
    email: previous?.email ?? "",
    address: previous?.address ?? "",
    region: previous?.region ?? "",
    district: previous?.district ?? "",
    note: "",
    sourceUrls: previous?.sourceUrls.join("\n") ?? record.sourceUrls.join("\n"),
    reviewDue: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  });
  const [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const scope = record.kind === "pathway" ? "preparation" : "published_contact";
  return (
    <details className="rounded-xl border bg-slate-50 p-4">
      <summary>Review for AI answers</summary>
      <p className="my-3 text-sm">
        {scope === "preparation"
          ? "Approve a practical preparation checklist only. Unverified courts, legal rules, fees and deadlines remain in the private research."
          : "Approve publisher contact details only. This does not verify registration, current intake or case eligibility. Keep confidential shelter locations private."}
      </p>
      {(
        [
          "titleEn",
          "titleSw",
          "bodyEn",
          "bodySw",
          "sourceUrls",
          "note",
          "reviewDue",
          ...(scope === "published_contact"
            ? ["phone", "email", "address", "region", "district"]
            : []),
        ] as Array<keyof typeof fields>
      ).map((key) => (
        <label key={key} className="mb-3 block text-sm">
          {
            {
              titleEn: "English title",
              titleSw: "Kiswahili title",
              bodyEn: "English guidance / contact context",
              bodySw: "Kiswahili guidance / contact context",
              sourceUrls: "Checked public source links, one per line",
              note: "What did you verify? Record unresolved conflicts.",
              reviewDue: "Review again by",
              phone: "Checked public phone",
              email: "Checked public email",
              address: "Checked public office address",
              region: "Checked region",
              district: "Checked district",
            }[key]
          }
          {["bodyEn", "bodySw", "sourceUrls", "note"].includes(key) ? (
            <textarea
              className="block min-h-24 w-full rounded-lg border p-2"
              value={fields[key]}
              onChange={(e) => setFields({ ...fields, [key]: e.target.value })}
            />
          ) : (
            <input
              className="block w-full rounded-lg border p-2"
              type={key === "reviewDue" ? "date" : "text"}
              value={fields[key]}
              onChange={(e) => setFields({ ...fields, [key]: e.target.value })}
            />
          )}
        </label>
      ))}
      <button
        type="button"
        disabled={busy || record.archived}
        className="rounded-lg bg-primary px-4 py-2 text-white"
        onClick={async () => {
          setBusy(true);
          setNotice("");
          try {
            const { sourceUrls, reviewDue, ...text } = fields;
            await review({
              id: record._id,
              scope,
              ...text,
              phone: text.phone || undefined,
              email: text.email || undefined,
              address: text.address || undefined,
              region: text.region || undefined,
              district: text.district || undefined,
              sourceUrls: sourceUrls
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean),
              reviewDueAt: Date.parse(reviewDue + "T20:59:59Z"),
            });
            setNotice(
              "Approved within this scope. Available to AI information searches.",
            );
          } catch (e) {
            setNotice(e instanceof Error ? e.message : "Could not approve.");
          } finally {
            setBusy(false);
          }
        }}
      >
        Approve{" "}
        {scope === "preparation"
          ? "preparation checklist"
          : "published contact"}
      </button>
      {notice && (
        <p role="status" className="mt-3 text-sm">
          {notice}
        </p>
      )}
    </details>
  );
}
