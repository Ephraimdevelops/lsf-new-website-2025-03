import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import Layout from "@/components/layout/Layout";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export default function SafeguardingDashboard() {
  const submitted = useQuery(api.caseManagement.staffReviewRequests, { status: "submitted" });
  const inReview = useQuery(api.caseManagement.staffReviewRequests, { status: "under_review" });
  const matches = useQuery(api.justiceServices.staffMatchingDecisionQueue, {});
  const resolve = useMutation(api.caseManagement.resolveCaseReviewRequest);
  const reviewMatch = useMutation(api.justiceServices.reviewMatchingDecision);
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const reviews = [...(submitted ?? []), ...(inReview ?? [])].sort((a, b) => b.review.updatedAt - a.review.updatedAt);
  const safetyMatches = matches?.filter(({ decision }) =>
    (decision.urgency === "immediate_safety" || decision.reviewStatus === "restricted" || decision.reviewStatus === "escalated") &&
    ["pending_review", "restricted", "escalated"].includes(decision.reviewStatus),
  );

  async function updateReview(id: Id<"case_review_requests">, status: "under_review" | "resolved" | "declined") {
    if (status !== "under_review" && note.trim().length < 10) { setError("Record a decision reason of at least 10 characters."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      await resolve({ reviewRequestId: id, status, resolutionNote: note.trim() || undefined });
      setSelected(null); setNote(""); setNotice("Review decision recorded.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not update the review."); }
    finally { setBusy(false); }
  }

  async function updateMatch(id: Id<"matching_decisions">, status: "approved" | "needs_changes" | "escalated" | "restricted") {
    if (note.trim().length < 10) { setError("Record a review reason of at least 10 characters."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      await reviewMatch({ decisionId: id, status, reviewNote: note.trim(), restrictionReason: status === "restricted" ? note.trim() : undefined });
      setSelected(null); setNote(""); setNotice("Matching decision recorded.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not update the matching decision."); }
    finally { setBusy(false); }
  }

  return <Layout><main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
    <header><p className="text-sm font-semibold text-primary">LSF · RESTRICTED</p><h1 className="mt-2 text-3xl font-bold">Safeguarding workspace</h1><p className="mt-2 text-gray-600">Review safety-sensitive case requests and matching decisions within your server-approved scope.</p></header>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{error}</p>}
    {notice && <p role="status" className="rounded-lg bg-green-50 p-4 text-green-800">{notice}</p>}
    <section><h2 className="mb-3 text-xl font-semibold">Case review requests</h2>
      {submitted === undefined || inReview === undefined ? <p role="status">Loading reviews…</p> : reviews.length === 0 ? <p>No open safeguarding reviews.</p> : <div className="space-y-4">{reviews.map(({ review, case: caseRecord }) => <article key={review._id} className="rounded-xl border bg-white p-5"><h3 className="font-semibold">{caseRecord?.publicId ?? "Protected case"}</h3><p className="mt-1 text-sm text-gray-600">{review.reason.replaceAll("_", " ")} · {review.status.replaceAll("_", " ")}</p><p className="mt-2 text-sm">{review.note || "No additional note."}</p><button type="button" onClick={() => { setSelected(selected === review._id ? null : review._id); setNote(""); }} className="mt-3 font-semibold text-primary">{selected === review._id ? "Close" : "Review"}</button>{selected === review._id && <div className="mt-4 space-y-3"><textarea aria-label="Decision reason" value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={1200} className="w-full rounded-lg border p-3" placeholder="Findings and decision reason" /><div className="flex flex-wrap gap-2">{review.status === "submitted" && <Action label="Start review" busy={busy} onClick={() => void updateReview(review._id, "under_review")} />}<Action label="Resolve" busy={busy} onClick={() => void updateReview(review._id, "resolved")} /><Action label="Decline" busy={busy} onClick={() => void updateReview(review._id, "declined")} /></div></div>}</article>)}</div>}
    </section>
    <section><h2 className="mb-3 text-xl font-semibold">Safety-sensitive matching decisions</h2>
      {safetyMatches === undefined ? <p role="status">Loading matching decisions…</p> : safetyMatches.length === 0 ? <p>No matching decisions need attention.</p> : <div className="space-y-4">{safetyMatches.map(({ decision, request, case: caseRecord }) => <article key={decision._id} className="rounded-xl border bg-white p-5"><h3 className="font-semibold">{caseRecord?.publicId ?? request?.publicId ?? "Protected request"}</h3><p className="mt-1 text-sm text-gray-600">{decision.urgency.replaceAll("_", " ")} · {decision.reviewStatus.replaceAll("_", " ")}</p><button type="button" onClick={() => { setSelected(selected === decision._id ? null : decision._id); setNote(""); }} className="mt-3 font-semibold text-primary">{selected === decision._id ? "Close" : "Review match"}</button>{selected === decision._id && <div className="mt-4 space-y-3"><textarea aria-label="Matching review reason" value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={2000} className="w-full rounded-lg border p-3" placeholder="Document the decision and any safety restriction" /><div className="flex flex-wrap gap-2"><Action label="Approve" busy={busy} onClick={() => void updateMatch(decision._id, "approved")} /><Action label="Needs changes" busy={busy} onClick={() => void updateMatch(decision._id, "needs_changes")} /><Action label="Escalate" busy={busy} onClick={() => void updateMatch(decision._id, "escalated")} /><Action label="Restrict" busy={busy} onClick={() => void updateMatch(decision._id, "restricted")} /></div></div>}</article>)}</div>}
    </section>
  </main></Layout>;
}

function Action({ label, busy, onClick }: { label: string; busy: boolean; onClick: () => void }) {
  return <button type="button" disabled={busy} onClick={onClick} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{label}</button>;
}
