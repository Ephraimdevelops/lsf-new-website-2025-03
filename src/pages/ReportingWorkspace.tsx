import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const readable = (value: string) => value.replaceAll("_", " ");
const date = (value: number) => new Date(value).toLocaleString("en-TZ", { timeZone: "Africa/Dar_es_Salaam" });

export default function ReportingWorkspace() {
  const access = useQuery(api.users.currentAccess);
  const drafts = useQuery(api.reporting.listSnapshots, { status: "draft" });
  const approved = useQuery(api.reporting.listSnapshots, { status: "approved" });
  const rejected = useQuery(api.reporting.listSnapshots, { status: "rejected" });
  const generate = useMutation(api.reporting.generateDonorSafeSnapshot);
  const approve = useMutation(api.reporting.approveSnapshot);
  const reject = useMutation(api.reporting.rejectSnapshot);
  const [days, setDays] = useState(30);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const canApprove = access?.roles.some(role => role === "admin" || role === "supervisor") ?? false;

  async function generateDraft() {
    setBusy("generate"); setError(""); setNotice("");
    try { await generate({ days }); setNotice("Draft generated. A different administrator or supervisor must review it before donors can see it."); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not prepare the report."); }
    finally { setBusy(null); }
  }

  async function decide(snapshotId: Id<"metric_snapshots">, decision: "approved" | "rejected") {
    setBusy(snapshotId); setError(""); setNotice("");
    try {
      const note = notes[snapshotId]?.trim() ?? "";
      if (decision === "approved") await approve({ snapshotId, note });
      else await reject({ snapshotId, reason: note });
      setNotice(decision === "approved" ? "Snapshot approved for donor and stakeholder viewing." : "Snapshot rejected and retained in the review history.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not record the decision."); }
    finally { setBusy(null); }
  }

  return <Layout><main className="mx-auto max-w-6xl space-y-7 px-4 py-10">
    <Link to="/dashboard/staff" className="text-sm text-primary underline">Back to LSF operations</Link>
    <header className="rounded-3xl bg-gradient-to-br from-[#7f1236] to-[#bd4166] p-8 text-white"><p className="text-xs font-bold uppercase tracking-widest">LSF · Haki Yangu</p><h1 className="mt-3 text-3xl font-bold">Donor-safe reporting</h1><p className="mt-3 max-w-2xl text-white/90">Prepare an aggregate snapshot, check suppressed figures and quality flags, then send it through independent approval.</p></header>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}{notice && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">{notice}</p>}
    <section className="rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">Prepare a snapshot</h2><p className="mt-1 text-sm text-neutral-600">The backend calculates aggregate metrics and suppresses small values. Generation creates a private draft; it does not publish.</p><div className="mt-4 flex flex-wrap items-end gap-3"><label className="text-sm font-medium">Reporting period<select className="mt-1 block rounded-lg border p-3" value={days} onChange={event => setDays(Number(event.target.value))}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option><option value={365}>Last 365 days</option></select></label><Button disabled={busy !== null} onClick={() => void generateDraft()}>{busy === "generate" ? "Preparing…" : "Generate private draft"}</Button></div></section>
    <section><h2 className="text-xl font-semibold">Awaiting independent review</h2>{drafts === undefined ? <p role="status" className="mt-3">Loading drafts…</p> : !drafts.length ? <p className="mt-3 rounded-2xl border bg-white p-6">No draft snapshots awaiting review.</p> : <div className="mt-4 space-y-5">{drafts.map(snapshot => <article key={snapshot._id} className="rounded-2xl border bg-white p-6"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-semibold">{date(snapshot.periodStart)} – {date(snapshot.periodEnd)}</h3><p className="text-xs text-neutral-500">Generated {date(snapshot.generatedAt)} · Definition {snapshot.definitionVersion}</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800">Draft</span></div><p className="mt-3 text-sm">{snapshot.publicSummary}</p><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(snapshot.values as Record<string, number | null>).filter(([key]) => key !== "periodDays").map(([key, value]) => <div key={key} className="rounded-lg bg-neutral-50 p-3"><p className="text-xs text-neutral-600">{readable(key)}</p><p className="font-semibold">{value === null ? "Suppressed" : value ?? "Unavailable"}</p></div>)}</div><div className="mt-4"><h4 className="text-sm font-semibold">Disclosure and quality flags</h4>{snapshot.qualityFlags.length ? <ul className="mt-2 list-disc pl-5 text-sm text-amber-800">{snapshot.qualityFlags.map(flag => <li key={flag}>{readable(flag)}</li>)}</ul> : <p className="text-sm text-neutral-600">No quality flags recorded.</p>}</div>{canApprove ? <div className="mt-5 border-t pt-4"><label className="block text-sm font-medium" htmlFor={`report-note-${snapshot._id}`}>Disclosure review and decision reason (10+ characters)</label><textarea id={`report-note-${snapshot._id}`} maxLength={2000} className="mt-2 min-h-24 w-full rounded-lg border p-3" value={notes[snapshot._id] ?? ""} onChange={event => setNotes(current => ({ ...current, [snapshot._id]: event.target.value }))} /><p className="mt-2 text-xs text-neutral-600">The report's generator cannot decide this draft. The server checks the reviewer identity.</p><div className="mt-3 flex flex-wrap gap-2"><Button disabled={busy !== null || (notes[snapshot._id]?.trim().length ?? 0) < 10} onClick={() => void decide(snapshot._id, "approved")}>Approve for donors</Button><Button variant="outline" disabled={busy !== null || (notes[snapshot._id]?.trim().length ?? 0) < 10} onClick={() => void decide(snapshot._id, "rejected")}>Reject draft</Button></div></div> : <p className="mt-4 text-sm text-neutral-600">An administrator or supervisor must review this draft.</p>}</article>)}</div>}</section>
    <section><h2 className="text-xl font-semibold">Approved and rejected history</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{([...(approved ?? []), ...(rejected ?? [])]).sort((a,b) => b.generatedAt - a.generatedAt).map(snapshot => <article key={snapshot._id} className="rounded-2xl border bg-white p-5"><p className="text-xs font-bold uppercase text-primary">{snapshot.approvalStatus}</p><h3 className="mt-2 font-semibold">{date(snapshot.periodStart)} – {date(snapshot.periodEnd)}</h3><p className="mt-2 text-sm text-neutral-600">{snapshot.reviewNote || "No review note shown"}</p>{snapshot.approvedAt && <p className="mt-2 text-xs text-neutral-500">Approved {date(snapshot.approvedAt)}</p>}</article>)}{approved !== undefined && rejected !== undefined && !approved.length && !rejected.length && <p className="rounded-2xl border bg-white p-6">No completed report decisions yet.</p>}</div><p className="mt-3 text-xs text-neutral-600">Recent snapshots only. Donor accounts can query approved snapshots; drafts and rejected reports remain internal.</p></section>
  </main></Layout>;
}
