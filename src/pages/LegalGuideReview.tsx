import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export default function LegalGuideReview() {
  const { id } = useParams();
  const guideId = id as Id<"legal_guides"> | undefined;
  const record = useQuery(api.publications.getLegalGuideForReview, guideId ? { id: guideId } : "skip");
  const access = useQuery(api.users.currentAccess);
  const review = useMutation(api.publications.reviewLegalGuide);
  const retire = useMutation(api.publications.retireLegalGuide);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const isAdmin = access?.roles.includes("admin") ?? false;
  const guide = record?.guide;

  async function decide(decision: "approved" | "rejected" | "retired") {
    if (!guide) return;
    setBusy(true); setError(""); setNotice("");
    try {
      if (decision === "retired") await retire({ id: guide._id, reason: note.trim() });
      else await review({ id: guide._id, decision, note: note.trim() });
      setNotice(decision === "approved" ? "Guide approved for public guidance." : decision === "rejected" ? "Guide rejected for correction." : "Guide retired from public guidance.");
      setNote("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not record the decision."); }
    finally { setBusy(false); }
  }

  return <Layout><main className="mx-auto max-w-5xl space-y-6 px-4 py-10"><Link className="text-sm text-primary underline" to="/dashboard/editorial">Back to editorial queue</Link>{record === undefined ? <p role="status">Loading guide…</p> : !guide ? <p className="rounded-2xl border bg-white p-6">Guide unavailable or access denied.</p> : <><header className="rounded-3xl bg-gradient-to-br from-[#661130] to-[#a33153] p-8 text-white"><p className="text-xs font-bold uppercase tracking-widest">LSF · Bilingual source review</p><h1 className="mt-3 text-3xl font-bold">{guide.titleSw}</h1><p className="mt-2 text-lg text-white/90">{guide.titleEn}</p><p className="mt-3 text-sm">Version {guide.version} · {guide.status} · {guide.jurisdiction.replaceAll("_", " ")}</p></header>{error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}{notice && <p role="status" className="rounded-xl bg-green-50 p-4 text-green-800">{notice}</p>}
      <div className="grid gap-5 md:grid-cols-2">{(["sw", "en"] as const).map(language => <section key={language} className="rounded-2xl border bg-white p-6"><p className="text-xs font-bold uppercase tracking-wide text-primary">{language === "sw" ? "Kiswahili" : "English"}</p><h2 className="mt-2 text-xl font-semibold">{language === "sw" ? guide.titleSw : guide.titleEn}</h2><p className="mt-3 whitespace-pre-wrap leading-7">{language === "sw" ? guide.summarySw : guide.summaryEn}</p><ol className="mt-4 list-decimal space-y-2 pl-5">{(language === "sw" ? guide.stepsSw : guide.stepsEn).map((step, index) => <li key={index}>{step}</li>)}</ol></section>)}</div>
      <section className="rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">Source and publication scope</h2><p className="mt-3 text-sm">{guide.publisher} · {guide.sourceTitle}</p><a href={guide.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block break-all text-primary underline">Open public source</a><p className="mt-3 text-sm">Category: {guide.category} · Jurisdiction: {guide.jurisdiction.replaceAll("_", " ")}</p><p className="mt-1 text-sm">Next source review: {new Date(guide.reviewDueAt).toLocaleDateString("en-TZ")}</p>{guide.reviewDueAt <= Date.now() && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">This source review is overdue. It cannot be newly approved and is excluded from public guide results.</p>}{guide.reviewNote && <p className="mt-3 text-sm">Last review reason: {guide.reviewNote}</p>}</section>
      {record.previous && <section className="rounded-2xl border bg-[#fbf5f7] p-6"><h2 className="text-xl font-semibold">Previous approved version · v{record.previous.version}</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><div><h3 className="font-semibold">Kiswahili</h3><p className="mt-2">{record.previous.titleSw}</p><p className="mt-2 text-sm">{record.previous.summarySw}</p><ol className="mt-2 list-decimal pl-5 text-sm">{record.previous.stepsSw.map((step, index) => <li key={index}>{step}</li>)}</ol></div><div><h3 className="font-semibold">English</h3><p className="mt-2">{record.previous.titleEn}</p><p className="mt-2 text-sm">{record.previous.summaryEn}</p><ol className="mt-2 list-decimal pl-5 text-sm">{record.previous.stepsEn.map((step, index) => <li key={index}>{step}</li>)}</ol></div></div><p className="mt-3 text-xs text-neutral-600">Source: {record.previous.publisher} · {record.previous.sourceTitle}</p></section>}
      {record.rejectedDraft && <p className="rounded-xl bg-amber-50 p-4 text-sm">Resubmission of rejected version {record.rejectedDraft.version}. Earlier reason: {record.rejectedDraft.reviewNote}</p>}
      {isAdmin && ["pending", "approved"].includes(guide.status) && <section className="rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">Decision</h2><p className="mt-2 text-sm text-neutral-600">A different administrator must review the author’s submission. Record the source, language and safety checks in the reason.</p><label className="mt-4 block text-sm font-medium" htmlFor="decision-note">Reason (at least 10 characters)</label><textarea id="decision-note" className="mt-2 min-h-28 w-full rounded-lg border p-3" maxLength={2000} value={note} onChange={event => setNote(event.target.value)} /><div className="mt-3 flex flex-wrap gap-2">{guide.status === "pending" ? <><Button disabled={busy || guide.reviewDueAt <= Date.now() || note.trim().length < 10 || guide.submittedBy === access?.user?._id} onClick={() => void decide("approved")}>Approve and publish</Button><Button variant="outline" disabled={busy || note.trim().length < 10 || guide.submittedBy === access?.user?._id} onClick={() => void decide("rejected")}>Reject for correction</Button></> : <Button variant="outline" disabled={busy || note.trim().length < 10} onClick={() => void decide("retired")}>Retire from public guidance</Button>}</div></section>}
    </>}</main></Layout>;
}
