import { LoadingText } from '@/components/shared/BrandLoading';
import BrandLoading from '@/components/shared/BrandLoading';
import { WorkHeader, WorkAction, WorkStats } from "@/components/dashboard/WorkArea";
import { useLanguage } from "@/providers/LanguageProvider";
import { useStatusLabel } from "@/i18n/useStatusLabel";
import { usePlainError } from "@/i18n/usePlainError";
import { useCopy } from "@/i18n/useCopy";
import { useEffect, useState } from "react";
import { useMutation, useQuery, usePaginatedQuery } from "convex/react";
import Layout from "@/components/layout/Layout";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Link, useSearchParams } from "react-router-dom";
import LegalGuideImport from "@/components/haki-yangu/LegalGuideImport";
import { usePersonalGreeting } from '@/hooks/usePersonalGreeting';
import PersonalAvatar from '@/components/dashboard/PersonalAvatar';

import SearchFilterBar from '@/components/shared/SearchFilterBar';
import ParalegalIllustration from '@/components/paralegal/ParalegalIllustration';
import { validateGuideContent } from '../../convex/lib/legalGuideContent';
import { Button } from '@/components/ui/button';

type Jurisdiction = "national" | "tanzania_mainland" | "zanzibar";
const emptyFields = { titleSw: "", titleEn: "", summarySw: "", summaryEn: "", stepsSw: "", stepsEn: "", category: "", jurisdiction: "national" as Jurisdiction, sourceTitle: "", sourceUrl: "", publisher: "", reviewDate: "", coverImageUrl: "", coverImageAltSw: "", coverImageAltEn: "" };

export default function EditorialDashboard() {
  const statusLabel = useStatusLabel();
  const readError = usePlainError();
  const c = useCopy();
  const {locale} = useLanguage();
  const { greeting } = usePersonalGreeting();
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some(role=>['admin','content_editor'].includes(role));
  const [params,setParams]=useSearchParams();const view=params.get('view')??'guides';
  const [step,setStep]=useState(1);const [search,setSearch]=useState('');
  const [editVersion,setEditVersion]=useState<number>();const [removalVersion,setRemovalVersion]=useState<number>();
  const isAdmin = access?.roles.includes("admin") ?? false;
  const [queueStatus, setQueueStatus] = useState<"pending" | "approved" | "due" | "history">("pending");
  useEffect(()=>{if(view==="history")setQueueStatus("history");else if(view==="guides")setQueueStatus("pending");},[view]);
  const { results: guides, status: queueLoadStatus, loadMore } = usePaginatedQuery(api.publications.listLegalGuidesPage, allowed ? { status: queueStatus } : "skip", { initialNumItems: 24 });
  const submit = useMutation(api.publications.submitLegalGuide);
  const archive = useMutation(api.publications.archiveLegalGuide);
  const [removingId, setRemovingId] = useState<Id<"legal_guides"> | undefined>();
  const [removalReason, setRemovalReason] = useState("");
  const savePending = useMutation(api.publications.updatePendingLegalGuide);
  const [editingId, setEditingId] = useState<Id<"legal_guides"> | undefined>();
  const [fields, setFields] = useState(emptyFields);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [replacesGuideId, setReplacesGuideId] = useState<Id<"legal_guides"> | undefined>();
  const [resubmitsGuideId, setResubmitsGuideId] = useState<Id<"legal_guides"> | undefined>();
  const [revisionTitle, setRevisionTitle] = useState("");
  const visibleGuides=guides.filter(guide=>[guide.titleEn,guide.titleSw,guide.category,guide.sourceTitle,guide.publisher].join(" ").toLowerCase().includes(search.trim().toLowerCase()));
  const update = (key: keyof typeof fields, value: string) => setFields((current) => ({ ...current, [key]: value }));
  const field = (key: keyof typeof fields, label: string, multiline = false, required = true) => <label className="block text-sm font-medium text-gray-800">{c(label)}{multiline
    ? <textarea required={required} value={fields[key]} onChange={(event) => update(key, event.target.value)} rows={3} className="mt-1 w-full rounded-lg border p-3" />
    : <input required={required} value={fields[key]} onChange={(event) => update(key, event.target.value)} type={key === "reviewDate" ? "date" : key === "sourceUrl" || key === "coverImageUrl" ? "url" : "text"} className="mt-1 w-full rounded-lg border p-3" />}</label>;

  function continueAuthor(){
    try {
      const content={...fields,stepsSw:fields.stepsSw.split("\n").map(x=>x.trim()).filter(Boolean),stepsEn:fields.stepsEn.split("\n").map(x=>x.trim()).filter(Boolean),reviewDueAt:Date.parse(`${fields.reviewDate}T12:00:00+03:00`)};
      if(step===1){if([fields.titleSw,fields.titleEn,fields.summarySw,fields.summaryEn].some(x=>x.trim().length<3)||[content.stepsSw,content.stepsEn].some(lines=>!lines.length||lines.length>12||lines.some(x=>x.length<8)))throw new Error("Complete both languages with 1–12 clear steps, at least 8 characters each.");}
      else validateGuideContent(content);
      setError("");setStep(step+1);
    } catch(cause){setError(readError(cause, "Check this step."));}
  }
  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const reviewDueAt = Date.parse(`${fields.reviewDate}T12:00:00+03:00`);
    if (!Number.isFinite(reviewDueAt)) { setError(c("Enter a valid review date.")); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const { reviewDate: _reviewDate, ...guideFields } = fields;
      const content = { ...guideFields, stepsSw: fields.stepsSw.split("\n").map((step) => step.trim()).filter(Boolean), stepsEn: fields.stepsEn.split("\n").map((step) => step.trim()).filter(Boolean), reviewDueAt };
      if (editingId) await savePending({ id: editingId, expectedEditVersion:editVersion, ...content });
      else await submit({ ...content, replacesGuideId, resubmitsGuideId });
      setFields(emptyFields); setReplacesGuideId(undefined); setResubmitsGuideId(undefined); setRevisionTitle("");
      setNotice(editingId ? "Pending guide updated. Independent review is still required." : "Guide submitted for independent review.");
      setEditingId(undefined);setStep(1);setQueueStatus("pending");setParams({view:"guides"});
    } catch (caught) { setError(readError(caught, "Could not submit the guide.")); }
    finally { setBusy(false); }
  }

  return <Layout><main className="work-page mx-auto max-w-5xl space-y-8 px-4 py-10">
    <WorkHeader eyebrow={c("Haki Yangu")} title={view==='author'?c('Write guide'):view==='history'?c('Guide history'):view==='import'?c('Import guide pack'):c('Guides')} description={c("Write clearly. Check both languages. Keep the source current.")} action={view!=="author"?<WorkAction to="/dashboard/editorial?view=author">{c("Write guide")}</WorkAction>:undefined}/>
    <nav aria-label={c("Editorial work areas")} className="work-tabs">{[['guides','Guides'],['author','Write'],['import','Import pack'],['history','History']].map(([value,label])=><Link key={value} aria-current={view===value?'page':undefined} className={`min-h-11 rounded-xl px-4 py-3 text-sm font-semibold ${view===value?'bg-primary text-white':'border bg-white text-neutral-600'}`} to={`/dashboard/editorial${value==='guides'?'':`?view=${value}`}`}>{c(label)}</Link>)}</nav>

    {error&&<p role="alert" className="rounded-xl bg-orange-50 p-4 text-red-800">{error}</p>}{notice&&<p role="status" className="rounded-xl bg-[#e7f4f1] p-4">{notice}</p>}
    {!allowed?<LoadingText as="p" role="status">{access===undefined?c("Loading access…"):c("Editor access is required.")}</LoadingText>:<>
    {view==='import'&&<LegalGuideImport existing={guides}/>}
    {view==='author'&&<>
    <ol className="work-steps" aria-label={c("Guide preparation")}>{[[1,c("Words")],[2,c("Source & image")],[3,c("Preview")]].map(([value,label])=><li key={value} aria-current={step===value?'step':undefined}><span>{value}</span>{label}</li>)}</ol>
    <form onSubmit={(event) => {if(step<3){event.preventDefault();continueAuthor();}else void onSubmit(event);}} className="grid gap-4 rounded-2xl border bg-white p-6 md:grid-cols-2">
      {editingId && <div className="rounded-xl bg-sky-50 p-4 text-sm md:col-span-2">{c("Editing your pending guide. ")}<button type="button" className="font-semibold underline" onClick={() => { setEditingId(undefined); setFields(emptyFields); }}>{c("Cancel editing")}</button></div>}
      {revisionTitle && <div className="rounded-xl bg-amber-50 p-4 text-sm md:col-span-2">{c("Revising ")}{revisionTitle}{c(". The earlier version and review history remain available. ")}<button type="button" className="font-semibold text-primary underline" onClick={() => { setFields(emptyFields); setReplacesGuideId(undefined); setResubmitsGuideId(undefined); setRevisionTitle(""); }}>{c("Discard revision draft")}</button></div>}
      {step===1&&<>
      {field("titleSw", "Title · Kiswahili")}{field("titleEn", "Title · English")}
      {field("summarySw", "Summary · Kiswahili", true)}{field("summaryEn", "Summary · English", true)}
      {field("stepsSw", "Steps · Kiswahili, one per line", true)}{field("stepsEn", "Steps · English, one per line", true)}
      </>}
      {step===2&&<>
      {field("category", "Category")}
      <label className="block text-sm font-medium text-gray-800">{c("Jurisdiction")}<select value={fields.jurisdiction} onChange={(event) => update("jurisdiction", event.target.value)} className="mt-1 w-full rounded-lg border p-3"><option value="national">{c("National")}</option><option value="tanzania_mainland">{c("Tanzania mainland")}</option><option value="zanzibar">Zanzibar</option></select></label>
      {field("sourceTitle", "Source title")}{field("sourceUrl", "Official HTTPS source URL")}
      {field("publisher", "Publisher")}{field("reviewDate", "Review due date")}
      {field("coverImageUrl", "Cover image HTTPS URL (optional)", false, false)}
      <p className="self-center text-sm text-gray-600">{c("Use an image you have permission to display. This accepts an existing hosted image; it does not upload an image file.")}</p>
      {field("coverImageAltSw", "Image description · Kiswahili", false, Boolean(fields.coverImageUrl))}{field("coverImageAltEn", "Image description · English", false, Boolean(fields.coverImageUrl))}
      {fields.coverImageUrl.startsWith("https://") && <img src={fields.coverImageUrl} alt={fields.coverImageAltEn || "Cover preview"} referrerPolicy="no-referrer" className="max-h-64 w-full rounded-xl object-contain md:col-span-2" />}
      </>}
      {step===3&&<>
      <div className="rounded-xl bg-[#fbf5f7] p-5 md:col-span-2"><h2 className="font-semibold">{c("Bilingual preview")}</h2><div className="mt-3 grid gap-5 md:grid-cols-2">{(["sw", "en"] as const).map(language => <div key={language}><p className="text-xs font-bold uppercase text-primary">{language === "sw" ? "Kiswahili" : c("English")}</p><h3 className="mt-2 font-semibold">{language === "sw" ? fields.titleSw : fields.titleEn}</h3><p className="mt-2 whitespace-pre-wrap text-sm">{language === "sw" ? fields.summarySw : fields.summaryEn}</p><ol className="mt-2 list-decimal pl-5 text-sm">{(language === "sw" ? fields.stepsSw : fields.stepsEn).split("\n").filter(Boolean).map((step, index) => <li key={index}>{step}</li>)}</ol></div>)}</div></div>
      <div className="rounded-xl bg-[#e7f4f1] p-4 text-sm md:col-span-2"><p>{fields.publisher} · {fields.sourceTitle}</p><p className="break-all">{fields.sourceUrl}</p><p>{c("Source review due: ")}{fields.reviewDate}</p></div></>}
      {error && <p role="alert" className="text-red-700 md:col-span-2">{error}</p>}{notice && <p role="status" className="text-green-700 md:col-span-2">{notice}</p>}
      <button disabled={busy} className="rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50 md:col-span-2">{busy ? "Saving…" : step<3 ? (step===1?c("Continue to source"):c("Continue to preview")) : editingId ? "Save pending guide" : c("Submit for review")}</button>
      {step>1&&<Button type="button" variant="outline" disabled={busy} onClick={()=>setStep(step-1)}>{c("Back to ")}{step===3?'source':'words'}</Button>}
    </form></>}
    {(view==='guides'||view==='history')&&<section><h2 className="mb-3 text-xl font-semibold">{c("Guide queue and versions")}</h2><SearchFilterBar value={search} onChange={setSearch} placeholder={c("Find a guide, topic or source")} label={c("Show")} title={c("Guide status")} onReset={()=>{setSearch('');setQueueStatus(view==='history'?'history':'pending');}}><label className="block text-sm font-medium">{c("Status")}<select value={queueStatus} onChange={event=>setQueueStatus(event.target.value as typeof queueStatus)} className="mt-2 min-h-12 w-full rounded-xl border p-3"><option value="pending">{c("Awaiting review")}</option><option value="approved">{c("Published")}</option><option value="due">{c("Source review due")}</option><option value="history">{c("Removed and rejected")}</option></select></label></SearchFilterBar><p className="mb-3 text-xs text-neutral-500">{c("Search covers loaded guides. Load more to search further.")}</p>{removingId && <div className="mb-4 space-y-3 rounded-xl border p-4"><p>{c("Remove this guide from active use. Review history is retained.")}</p><label className="block">{c("Reason")}<textarea value={removalReason} onChange={e => setRemovalReason(e.target.value)} className="block w-full rounded-lg border p-2" /></label><button disabled={busy || removalReason.trim().length < 10} className="rounded-lg border px-4 py-2" onClick={async () => { setBusy(true); setError(""); try { await archive({ id: removingId, reason: removalReason, expectedEditVersion:removalVersion }); setRemovingId(undefined); setRemovalReason(""); setNotice("Guide removed. It remains in history."); } catch (cause) { setError(readError(cause, "Could not remove guide.")); } finally { setBusy(false); } }}>{c("Confirm removal")}</button><button className="ml-3 underline" onClick={() => setRemovingId(undefined)}>{c("Cancel")}</button></div>}{queueLoadStatus === "LoadingFirstPage" ? <BrandLoading compact text={c("Loading guides…")}/> : visibleGuides.length === 0 ? <p>{search?"No loaded guides match your search.":"No guides in this group."}</p> : <ul className="work-guide-list">{visibleGuides.map(guide => <li key={guide._id} className="work-guide-card"><div className="flex flex-wrap items-start justify-between gap-2"><strong>{locale==='sw'?guide.titleSw:guide.titleEn}</strong><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">{guide.status}</span></div><p className="mt-1 text-sm text-neutral-600">{locale==='sw'?guide.titleEn:guide.titleSw}</p><p className="mt-2 text-xs text-gray-600">{guide.category} · {statusLabel(guide.jurisdiction)}{c(" · v")}{guide.version}{c(" · review due ")}{new Date(guide.reviewDueAt).toLocaleDateString("en-TZ")}</p>{guide.reviewNote && <p className="mt-2 text-sm text-gray-600">{c("Review reason: ")}{guide.reviewNote}</p>}<div className="mt-4 flex flex-wrap gap-3 text-sm"><Link className="font-semibold text-primary underline" to={`/dashboard/editorial/review/${guide._id}`}>{c("Open full review")}</Link>{guide.status === "pending" && guide.submittedBy === access?.user?._id && <button type="button" className="font-semibold text-primary underline" onClick={() => { setEditingId(guide._id); setReplacesGuideId(undefined); setResubmitsGuideId(undefined); setRevisionTitle(""); setFields({ titleSw: guide.titleSw, titleEn: guide.titleEn, summarySw: guide.summarySw, summaryEn: guide.summaryEn, stepsSw: guide.stepsSw.join("\n"), stepsEn: guide.stepsEn.join("\n"), category: guide.category, jurisdiction: guide.jurisdiction, sourceTitle: guide.sourceTitle, sourceUrl: guide.sourceUrl, publisher: guide.publisher, reviewDate: new Date(guide.reviewDueAt).toLocaleDateString("en-CA", { timeZone: "Africa/Dar_es_Salaam" }), coverImageUrl: guide.coverImageUrl ?? "", coverImageAltSw: guide.coverImageAltSw ?? "", coverImageAltEn: guide.coverImageAltEn ?? "" }); setEditVersion(guide.editVersion??0);setStep(1);setParams({view:"author"}); }}>{c("Edit pending guide")}</button>}{guide.status === "approved" || (guide.status === "rejected" && guide.submittedBy === access?.user?._id) || (guide.status === "retired" && (guide.submittedBy === access?.user?._id || isAdmin)) ? <button type="button" className="font-semibold text-primary underline" onClick={() => { setEditingId(undefined); setFields({ titleSw: guide.titleSw, titleEn: guide.titleEn, summarySw: guide.summarySw, summaryEn: guide.summaryEn, stepsSw: guide.stepsSw.join("\n"), stepsEn: guide.stepsEn.join("\n"), category: guide.category, jurisdiction: guide.jurisdiction, sourceTitle: guide.sourceTitle, sourceUrl: guide.sourceUrl, publisher: guide.publisher, reviewDate: "", coverImageUrl: guide.coverImageUrl ?? "", coverImageAltSw: guide.coverImageAltSw ?? "", coverImageAltEn: guide.coverImageAltEn ?? "" }); setReplacesGuideId(guide.status === "approved" ? guide._id : guide.status === "retired" ? undefined : guide.replacesGuideId); setResubmitsGuideId(guide.status === "rejected" ? guide._id : undefined); setRevisionTitle(`${guide.titleEn} · v${guide.version}`); setEditVersion(guide.editVersion??0);setStep(1);setParams({view:"author"}); }}>{guide.status === "rejected" ? "Correct and resubmit" : guide.status === "retired" ? "Copy into a new review draft" : "Prepare new version"}</button> : null}{guide.status !== "retired" && (isAdmin || (guide.status !== "approved" && guide.submittedBy === access?.user?._id)) && <button className="font-semibold text-red-700 underline" onClick={() => { setRemovingId(guide._id); setRemovalVersion(guide.editVersion??0);setRemovalReason(""); }}>{c("Remove guide")}</button>}</div></li>)}</ul>}{queueLoadStatus === "CanLoadMore" && <button className="mt-4 rounded-lg border px-4 py-2" onClick={() => loadMore(24)}>{c("Load more guides")}</button>}</section>}
    </>}
  </main></Layout>;
}
