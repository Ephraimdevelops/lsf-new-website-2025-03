import BrandLoading from '@/components/shared/BrandLoading';
import { useStatusLabel } from "@/i18n/useStatusLabel";
import { usePlainError } from "@/i18n/usePlainError";
import { useCopy } from "@/i18n/useCopy";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

import AdminPageIntro from '@/components/admin/AdminPageIntro';
export default function LegalGuideReview() {
  const statusLabel = useStatusLabel();
  const readError = usePlainError();
  const c = useCopy();
  const { id } = useParams();
  const guideId = id as Id<"legal_guides"> | undefined;
  const record = useQuery(api.publications.getLegalGuideForReview, guideId ? { id: guideId } : "skip");
  const access = useQuery(api.users.currentAccess);
  const review = useMutation(api.publications.reviewLegalGuide);
  const retire = useMutation(api.publications.retireLegalGuide);
  const [confirmation,setConfirmation]=useState<{decision:"approved"|"rejected"|"retired";note:string;version:number}|null>(null);
  useEffect(()=>{setNote("");setConfirmation(null);setError("");setNotice("");},[id]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const isAdmin = access?.roles.includes("admin") ?? false;
  const guide = record?.guide;

  async function decide(decision: "approved" | "rejected" | "retired") {
    if (!guide || !confirmation || busy) return;
    setBusy(true); setError(""); setNotice("");
    try {
      if (decision === "retired") await retire({ id: guide._id, reason: confirmation.note,expectedEditVersion:confirmation.version });
      else await review({ id: guide._id, decision, note: confirmation.note,expectedEditVersion:confirmation.version });
      setNotice(decision === "approved" ? "Guide approved for public guidance." : decision === "rejected" ? "Guide rejected for correction." : "Guide retired from public guidance.");
      setNote("");setConfirmation(null);
    } catch (cause) { setError(readError(cause, "Could not record the decision.")); }
    finally { setBusy(false); }
  }

  return <Layout><main className="mx-auto max-w-5xl space-y-6 px-4 py-10"><Link className="text-sm text-primary underline" to="/dashboard/editorial">{c("Back to editorial queue")}</Link>{record === undefined ? <BrandLoading compact text={c("Loading guide…")}/> : !guide ? <p className="rounded-2xl border bg-white p-6">{c("Guide unavailable or access denied.")}</p> : <><AdminPageIntro title={guide.titleEn} body={`${guide.titleSw} · Version ${guide.version} · ${guide.status==='pending'?'Awaiting review':guide.status==='approved'?'Published':guide.status==='rejected'?'Needs correction':'Removed'}`} pose="documents"/>{error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}{notice && <p role="status" className="rounded-xl bg-green-50 p-4 text-green-800">{notice}</p>}
      <div className="grid gap-5 md:grid-cols-2">{(["sw", "en"] as const).map(language => <section key={language} className="rounded-2xl border bg-white p-6"><p className="text-xs font-bold uppercase tracking-wide text-primary">{language === "sw" ? "Kiswahili" : c("English")}</p>{guide.coverImageUrl && <img src={guide.coverImageUrl} alt={(language === "sw" ? guide.coverImageAltSw : guide.coverImageAltEn) || ""} referrerPolicy="no-referrer" className="mb-4 max-h-64 w-full rounded-xl object-contain" />}<h2 className="mt-2 text-xl font-semibold">{language === "sw" ? guide.titleSw : guide.titleEn}</h2><p className="mt-3 whitespace-pre-wrap leading-7">{language === "sw" ? guide.summarySw : guide.summaryEn}</p><ol className="mt-4 list-decimal space-y-2 pl-5">{(language === "sw" ? guide.stepsSw : guide.stepsEn).map((step, index) => <li key={index}>{step}</li>)}</ol></section>)}</div>
      <section className="rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">{c("Source and publication scope")}</h2><p className="mt-3 text-sm">{guide.publisher} · {guide.sourceTitle}</p><a href={guide.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block break-all text-primary underline">{c("Open public source")}</a><p className="mt-3 text-sm">{c("Category: ")}{guide.category}{c(" · Jurisdiction: ")}{statusLabel(guide.jurisdiction)}</p><p className="mt-1 text-sm">{c("Next source review: ")}{new Date(guide.reviewDueAt).toLocaleDateString("en-TZ")}</p>{guide.reviewDueAt <= Date.now() && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{c("This source review is overdue. It cannot be newly approved and is excluded from public guide results.")}</p>}{guide.reviewNote && <p className="mt-3 text-sm">{c("Last review reason: ")}{guide.reviewNote}</p>}</section>
      {record.previous && <section className="rounded-2xl border bg-[#fbf5f7] p-6"><h2 className="text-xl font-semibold">{c("Previous approved version · v")}{record.previous.version}</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><div><h3 className="font-semibold">Kiswahili</h3><p className="mt-2">{record.previous.titleSw}</p><p className="mt-2 text-sm">{record.previous.summarySw}</p><ol className="mt-2 list-decimal pl-5 text-sm">{record.previous.stepsSw.map((step, index) => <li key={index}>{step}</li>)}</ol></div><div><h3 className="font-semibold">{c("English")}</h3><p className="mt-2">{record.previous.titleEn}</p><p className="mt-2 text-sm">{record.previous.summaryEn}</p><ol className="mt-2 list-decimal pl-5 text-sm">{record.previous.stepsEn.map((step, index) => <li key={index}>{step}</li>)}</ol></div></div><p className="mt-3 text-xs text-neutral-600">{c("Source: ")}{record.previous.publisher} · {record.previous.sourceTitle}</p></section>}
      {record.rejectedDraft && <p className="rounded-xl bg-amber-50 p-4 text-sm">{c("Resubmission of rejected version ")}{record.rejectedDraft.version}{c(". Earlier reason: ")}{record.rejectedDraft.reviewNote}</p>}
      {isAdmin && ["pending", "approved"].includes(guide.status) && <section className="rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">{c("Decision")}</h2><p className="mt-2 text-sm text-neutral-600">{c("A different administrator must review the author’s submission. Record the source, language and safety checks in the reason.")}</p><label className="mt-4 block text-sm font-medium" htmlFor="decision-note">{c("Reason (at least 10 characters)")}</label><textarea id="decision-note" className="mt-2 min-h-28 w-full rounded-lg border p-3" maxLength={2000} value={note} onChange={event => {setNote(event.target.value);setConfirmation(null);}} /><div className="mt-3 flex flex-wrap gap-2">{guide.status === "pending" ? <><Button disabled={busy || guide.reviewDueAt <= Date.now() || note.trim().length < 10 || guide.submittedBy === access?.user?._id} onClick={() => setConfirmation({decision:"approved",note:note.trim(),version:guide.editVersion??0})}>{c("Approve and publish")}</Button><Button variant="outline" disabled={busy || note.trim().length < 10 || guide.submittedBy === access?.user?._id} onClick={() => setConfirmation({decision:"rejected",note:note.trim(),version:guide.editVersion??0})}>{c("Reject for correction")}</Button></> : <Button variant="outline" disabled={busy || note.trim().length < 10} onClick={() => setConfirmation({decision:"retired",note:note.trim(),version:guide.editVersion??0})}>{c("Retire from public guidance")}</Button>}</div></section>}
      {confirmation&&<section aria-label={c("Confirm guide decision")} className="space-y-3 rounded-2xl bg-[#f8eaf0] p-5"><h2 className="text-xl font-semibold">{confirmation.decision==='approved'?c("Confirm publication"):confirmation.decision==='rejected'?c("Confirm rejection"):c("Confirm retirement")}</h2><p>{confirmation.note}</p><p className="text-sm">{confirmation.decision==='approved'?'This version will become public after the decision is saved.':'The decision and reason will be retained in history.'}</p><Button disabled={busy} onClick={()=>void decide(confirmation.decision)}>{c("Confirm and save")}</Button><Button variant="outline" disabled={busy} className="ml-2" onClick={()=>setConfirmation(null)}>{c("Edit")}</Button></section>}
    </>}</main></Layout>;
}
