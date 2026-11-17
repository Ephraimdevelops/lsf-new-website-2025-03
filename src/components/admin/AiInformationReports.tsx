import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
export default function AiInformationReports() {
  const [status, setStatus] = useState<"pending" | "reviewed">("pending");
  const rows = useQuery(api.aiCorrections.reviewQueue, { status });
  const review = useMutation(api.aiCorrections.review);
  const [notes, setNotes] = useState<Record<string, string>>({}),
    [urls, setUrls] = useState<Record<string, string>>({}),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [targets, setTargets] = useState<Record<string, string>>({});
  async function decide(
    id: Id<"ai_information_reports">,
    decision: "suspend" | "corrected" | "dismiss",
  ) {
    setBusy(id);
    setError("");
    try {
      await review({
        id,
        decision,
        note: notes[id] ?? "",
        ...(targets[id] ? { referenceId: targets[id] } : {}),
        ...(urls[id]?.trim() ? { evidenceUrl: urls[id].trim() } : {}),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the review.");
    } finally {
      setBusy("");
    }
  }
  return (
    <section className="rounded-2xl border bg-white p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">
            Reported information problems
          </h3>
          <p className="text-sm text-neutral-600">
            Review incorrect contacts, places, guidance and answers. A report
            pauses that item in the person's chat; shared changes require
            verification.
          </p>
        </div>
        <select
          className="rounded-lg border p-2"
          aria-label="Report status"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="pending">Needs review</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {rows === undefined ? (
        <p>Loading reports…</p>
      ) : !rows.length ? (
        <p className="text-sm text-neutral-600">No reports in this view.</p>
      ) : (
        rows.map((row) => (
          <article key={row._id} className="rounded-xl border p-4 space-y-3">
            <div>
              <p className="font-semibold">{row.title}</p>
              <p className="text-sm text-neutral-600">
                {row.category.replaceAll("_", " ")} ·{" "}
                {new Date(row.submittedAt).toLocaleDateString()}
              </p>
            </div>
            <blockquote className="border-l-2 pl-3 text-sm whitespace-pre-wrap">
              {row.statement}
            </blockquote>
            {row.sourceUrl && (
              <a
                className="text-sm underline"
                href={row.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open recorded source
              </a>
            )}
            {status === "pending" || row.decision === "suspend" ? (
              <>
                {row.kind === "answer" && row.relatedReferences.length > 0 && (
                  <label className="block text-sm">
                    Source being checked
                    <select
                      className="block w-full rounded-lg border p-2"
                      value={targets[row._id] ?? ""}
                      onChange={(e) =>
                        setTargets({ ...targets, [row._id]: e.target.value })
                      }
                    >
                      <option value="">Review the answer only</option>
                      {row.relatedReferences.map((ref) => (
                        <option value={ref.id} key={ref.id}>
                          {ref.title}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="block text-sm">
                  Verification notes
                  <textarea
                    className="mt-1 w-full rounded-lg border p-2"
                    value={notes[row._id] ?? ""}
                    onChange={(e) =>
                      setNotes({ ...notes, [row._id]: e.target.value })
                    }
                    placeholder="What did you check, and what changed?"
                  />
                </label>
                <label className="block text-sm">
                  Public verification source
                  <input
                    className="mt-1 w-full rounded-lg border p-2"
                    type="url"
                    value={urls[row._id] ?? ""}
                    onChange={(e) =>
                      setUrls({ ...urls, [row._id]: e.target.value })
                    }
                    placeholder="https://…"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {(row.kind !== "answer" || targets[row._id]) && (
                    <>
                      <button
                        disabled={!!busy || status !== "pending"}
                        className="rounded-lg border px-3 py-2 text-sm"
                        onClick={() => decide(row._id, "suspend")}
                      >
                        Verified problem: suspend from AI
                      </button>
                      <button
                        disabled={!!busy}
                        className="rounded-lg border px-3 py-2 text-sm"
                        onClick={() => decide(row._id, "corrected")}
                      >
                        Verified correction: restore
                      </button>
                    </>
                  )}
                  <button
                    disabled={!!busy || status !== "pending"}
                    className="rounded-lg border px-3 py-2 text-sm"
                    onClick={() => decide(row._id, "dismiss")}
                  >
                    {row.kind === "answer" ? "Record review" : "Dismiss report"}
                  </button>
                </div>
                <p className="text-xs text-neutral-600">
                  Edit the original source before confirming a correction.
                  Suspension affects AI recommendations; it does not delete an
                  external directory record or change anyone's account.
                </p>
              </>
            ) : (
              <p className="text-sm">
                {row.decision}: {row.reviewNote}
              </p>
            )}
          </article>
        ))
      )}
    </section>
  );
}
