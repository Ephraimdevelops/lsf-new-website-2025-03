import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import Layout from "@/components/layout/Layout";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Link } from "react-router-dom";

type Jurisdiction = "national" | "tanzania_mainland" | "zanzibar";
const emptyFields = { titleSw: "", titleEn: "", summarySw: "", summaryEn: "", stepsSw: "", stepsEn: "", category: "", jurisdiction: "national" as Jurisdiction, sourceTitle: "", sourceUrl: "", publisher: "", reviewDate: "" };

export default function EditorialDashboard() {
  const access = useQuery(api.users.currentAccess);
  const guides = useQuery(api.publications.listLegalGuidesForReview);
  const submit = useMutation(api.publications.submitLegalGuide);
  const [fields, setFields] = useState(emptyFields);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [replacesGuideId, setReplacesGuideId] = useState<Id<"legal_guides"> | undefined>();
  const [resubmitsGuideId, setResubmitsGuideId] = useState<Id<"legal_guides"> | undefined>();
  const [revisionTitle, setRevisionTitle] = useState("");
  const update = (key: keyof typeof fields, value: string) => setFields((current) => ({ ...current, [key]: value }));
  const field = (key: keyof typeof fields, label: string, multiline = false) => <label className="block text-sm font-medium text-gray-800">{label}{multiline
    ? <textarea required value={fields[key]} onChange={(event) => update(key, event.target.value)} rows={3} className="mt-1 w-full rounded-lg border p-3" />
    : <input required value={fields[key]} onChange={(event) => update(key, event.target.value)} type={key === "reviewDate" ? "date" : key === "sourceUrl" ? "url" : "text"} className="mt-1 w-full rounded-lg border p-3" />}</label>;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const reviewDueAt = Date.parse(`${fields.reviewDate}T12:00:00+03:00`);
    if (!Number.isFinite(reviewDueAt)) { setError("Enter a valid review date."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const { reviewDate: _reviewDate, ...guideFields } = fields;
      await submit({ ...guideFields, stepsSw: fields.stepsSw.split("\n").map((step) => step.trim()).filter(Boolean), stepsEn: fields.stepsEn.split("\n").map((step) => step.trim()).filter(Boolean), reviewDueAt, replacesGuideId, resubmitsGuideId });
      setFields(emptyFields); setReplacesGuideId(undefined); setResubmitsGuideId(undefined); setRevisionTitle("");
      setNotice("Guide submitted for independent review.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not submit the guide."); }
    finally { setBusy(false); }
  }

  return <Layout><main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
    <header className="rounded-3xl bg-gradient-to-br from-[#661130] to-[#a33153] p-8 text-white"><p className="text-xs font-bold uppercase tracking-widest">LSF · Governed content</p><h1 className="mt-3 text-3xl font-bold">Guide editorial workspace</h1><p className="mt-3 max-w-2xl text-white/90">Submit bilingual legal guides with a source. An independent administrator reviews them before publication.</p></header>
    <form onSubmit={(event) => void onSubmit(event)} className="grid gap-4 rounded-2xl border bg-white p-6 md:grid-cols-2">
      {revisionTitle && <div className="rounded-xl bg-amber-50 p-4 text-sm md:col-span-2">Revising {revisionTitle}. The earlier version and review history remain available. <button type="button" className="font-semibold text-primary underline" onClick={() => { setFields(emptyFields); setReplacesGuideId(undefined); setResubmitsGuideId(undefined); setRevisionTitle(""); }}>Discard revision draft</button></div>}
      {field("titleSw", "Title · Kiswahili")}{field("titleEn", "Title · English")}
      {field("summarySw", "Summary · Kiswahili", true)}{field("summaryEn", "Summary · English", true)}
      {field("stepsSw", "Steps · Kiswahili, one per line", true)}{field("stepsEn", "Steps · English, one per line", true)}
      {field("category", "Category")}
      <label className="block text-sm font-medium text-gray-800">Jurisdiction<select value={fields.jurisdiction} onChange={(event) => update("jurisdiction", event.target.value)} className="mt-1 w-full rounded-lg border p-3"><option value="national">National</option><option value="tanzania_mainland">Tanzania mainland</option><option value="zanzibar">Zanzibar</option></select></label>
      {field("sourceTitle", "Source title")}{field("sourceUrl", "Official HTTPS source URL")}
      {field("publisher", "Publisher")}{field("reviewDate", "Review due date")}
      <div className="rounded-xl bg-[#fbf5f7] p-5 md:col-span-2"><h2 className="font-semibold">Bilingual preview</h2><div className="mt-3 grid gap-5 md:grid-cols-2">{(["sw", "en"] as const).map(language => <div key={language}><p className="text-xs font-bold uppercase text-primary">{language === "sw" ? "Kiswahili" : "English"}</p><h3 className="mt-2 font-semibold">{language === "sw" ? fields.titleSw : fields.titleEn}</h3><p className="mt-2 whitespace-pre-wrap text-sm">{language === "sw" ? fields.summarySw : fields.summaryEn}</p><ol className="mt-2 list-decimal pl-5 text-sm">{(language === "sw" ? fields.stepsSw : fields.stepsEn).split("\n").filter(Boolean).map((step, index) => <li key={index}>{step}</li>)}</ol></div>)}</div></div>
      {error && <p role="alert" className="text-red-700 md:col-span-2">{error}</p>}{notice && <p role="status" className="text-green-700 md:col-span-2">{notice}</p>}
      <button disabled={busy} className="rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50 md:col-span-2">{busy ? "Submitting…" : "Submit for review"}</button>
    </form>
    <section><h2 className="mb-3 text-xl font-semibold">Guide queue and versions</h2>{guides === undefined ? <p role="status">Loading guides…</p> : guides.length === 0 ? <p>No guides yet.</p> : <ul className="grid gap-3 md:grid-cols-2">{guides.map(guide => <li key={guide._id} className="rounded-xl border bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-2"><strong>{guide.titleEn}</strong><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">{guide.status}</span></div><p className="mt-1 text-sm">{guide.titleSw}</p><p className="mt-2 text-xs text-gray-600">{guide.category} · {guide.jurisdiction.replaceAll("_", " ")} · v{guide.version} · review due {new Date(guide.reviewDueAt).toLocaleDateString("en-TZ")}</p>{guide.reviewNote && <p className="mt-2 text-sm text-gray-600">Review reason: {guide.reviewNote}</p>}<div className="mt-4 flex flex-wrap gap-3 text-sm"><Link className="font-semibold text-primary underline" to={`/dashboard/editorial/review/${guide._id}`}>Open full review</Link>{guide.status === "approved" || (guide.status === "rejected" && guide.submittedBy === access?.user?._id) ? <button type="button" className="font-semibold text-primary underline" onClick={() => { setFields({ titleSw: guide.titleSw, titleEn: guide.titleEn, summarySw: guide.summarySw, summaryEn: guide.summaryEn, stepsSw: guide.stepsSw.join("\n"), stepsEn: guide.stepsEn.join("\n"), category: guide.category, jurisdiction: guide.jurisdiction, sourceTitle: guide.sourceTitle, sourceUrl: guide.sourceUrl, publisher: guide.publisher, reviewDate: "" }); setReplacesGuideId(guide.status === "approved" ? guide._id : guide.replacesGuideId); setResubmitsGuideId(guide.status === "rejected" ? guide._id : undefined); setRevisionTitle(`${guide.titleEn} · v${guide.version}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{guide.status === "rejected" ? "Correct and resubmit" : "Prepare new version"}</button> : null}</div></li>)}</ul>}</section>
  </main></Layout>;
}
