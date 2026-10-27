import BrandLoading from '@/components/shared/BrandLoading';
import { usePlainError } from "@/i18n/usePlainError";
import { useCopy } from "@/i18n/useCopy";
import AdminPageIntro from "@/components/admin/AdminPageIntro";
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
  const readError = usePlainError();
  const c = useCopy();
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
    catch (cause) { setError(readError(cause, "Could not prepare the report.")); }
    finally { setBusy(null); }
  }

  async function decide(snapshotId: Id<"metric_snapshots">, decision: "approved" | "rejected") {
    setBusy(snapshotId); setError(""); setNotice("");
    try {
      const note = notes[snapshotId]?.trim() ?? "";
      if (decision === "approved") await approve({ snapshotId, note });
      else await reject({ snapshotId, reason: note });
      setNotice(decision === "approved" ? "Snapshot approved for donor and stakeholder viewing." : "Snapshot rejected and retained in the review history.");
    } catch (cause) { setError(readError(cause, "Could not record the decision.")); }
    finally { setBusy(null); }
  }

  return <Layout><main className="mx-auto max-w-6xl space-y-7 px-4 py-10">
    <Link to={access?.roles.includes("supervisor") && !access.roles.includes("admin") ? "/dashboard/supervisor" : "/dashboard/staff"} className="text-sm text-primary underline">{c("Back to LSF operations")}</Link>
    <AdminPageIntro title={c("Impact reports")} body="Check summary figures and privacy before sending a draft for independent approval." pose="direction" />
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}{notice && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">{notice}</p>}
    <section className="rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">{c("Prepare a snapshot")}</h2><p className="mt-1 text-sm text-neutral-600">{c("Create a private summary of the work done. Small totals are hidden to protect people. Another administrator or supervisor reviews the draft before donors can see it.")}</p><div className="mt-4 flex flex-wrap items-end gap-3"><label className="text-sm font-medium">{c("Reporting period")}<select className="mt-1 block rounded-lg border p-3" value={days} onChange={event => setDays(Number(event.target.value))}><option value={7}>{c("Last 7 days")}</option><option value={30}>{c("Last 30 days")}</option><option value={90}>{c("Last 90 days")}</option><option value={365}>{c("Last 365 days")}</option></select></label><Button disabled={busy !== null} onClick={() => void generateDraft()}>{busy === "generate" ? "Preparing…" : "Generate private draft"}</Button></div></section>
    <section><h2 className="text-xl font-semibold">{c("Awaiting independent review")}</h2>{drafts === undefined ? <BrandLoading compact text={c("Loading drafts…")}/> : !drafts.length ? <p className="mt-3 rounded-2xl border bg-white p-6">{c("No draft snapshots awaiting review.")}</p> : <div className="mt-4 space-y-5">{drafts.map(snapshot => <article key={snapshot._id} className="rounded-2xl border bg-white p-6"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-semibold">{date(snapshot.periodStart)} – {date(snapshot.periodEnd)}</h3><p className="text-xs text-neutral-500">{c("Generated ")}{date(snapshot.generatedAt)}{c(" · Definition ")}{snapshot.definitionVersion}</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800">{c("Draft")}</span></div><p className="mt-3 text-sm">{snapshot.publicSummary}</p><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(snapshot.values as Record<string, number | null>).filter(([key]) => key !== "periodDays").map(([key, value]) => <div key={key} className="rounded-lg bg-neutral-50 p-3"><p className="text-xs text-neutral-600">{readable(key)}</p><p className="font-semibold">{value === null ? "Suppressed" : value ?? "Unavailable"}</p></div>)}</div><div className="mt-4"><h4 className="text-sm font-semibold">{c("Disclosure and quality flags")}</h4>{snapshot.qualityFlags.length ? <ul className="mt-2 list-disc pl-5 text-sm text-amber-800">{snapshot.qualityFlags.map(flag => <li key={flag}>{readable(flag)}</li>)}</ul> : <p className="text-sm text-neutral-600">{c("No quality flags recorded.")}</p>}</div>{canApprove ? <div className="mt-5 border-t pt-4"><label className="block text-sm font-medium" htmlFor={`report-note-${snapshot._id}`}>{c("Disclosure review and decision reason (10+ characters)")}</label><textarea id={`report-note-${snapshot._id}`} maxLength={2000} className="mt-2 min-h-24 w-full rounded-lg border p-3" value={notes[snapshot._id] ?? ""} onChange={event => setNotes(current => ({ ...current, [snapshot._id]: event.target.value }))} /><p className="mt-2 text-xs text-neutral-600">{c("The person who prepared this draft cannot approve it. A different administrator or supervisor must review it.")}</p><div className="mt-3 flex flex-wrap gap-2"><Button disabled={busy !== null || (notes[snapshot._id]?.trim().length ?? 0) < 10} onClick={() => void decide(snapshot._id, "approved")}>{c("Approve for donors")}</Button><Button variant="outline" disabled={busy !== null || (notes[snapshot._id]?.trim().length ?? 0) < 10} onClick={() => void decide(snapshot._id, "rejected")}>{c("Reject draft")}</Button></div></div> : <p className="mt-4 text-sm text-neutral-600">{c("An administrator or supervisor must review this draft.")}</p>}</article>)}</div>}</section>
    <section><h2 className="text-xl font-semibold">{c("Approved and rejected history")}</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{([...(approved ?? []), ...(rejected ?? [])]).sort((a,b) => b.generatedAt - a.generatedAt).map(snapshot => <article key={snapshot._id} className="rounded-2xl border bg-white p-5"><p className="text-xs font-bold uppercase text-primary">{snapshot.approvalStatus}</p><h3 className="mt-2 font-semibold">{date(snapshot.periodStart)} – {date(snapshot.periodEnd)}</h3><p className="mt-2 text-sm text-neutral-600">{snapshot.reviewNote || "No review note shown"}</p>{snapshot.approvedAt && <p className="mt-2 text-xs text-neutral-500">{c("Approved ")}{date(snapshot.approvedAt)}</p>}</article>)}{approved !== undefined && rejected !== undefined && !approved.length && !rejected.length && <p className="rounded-2xl border bg-white p-6">{c("No completed report decisions yet.")}</p>}</div><p className="mt-3 text-xs text-neutral-600">{c("Recent snapshots only. Donor accounts can query approved snapshots; drafts and rejected reports remain internal.")}</p></section>
  </main></Layout>;
}
