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

const blank = { titleSw: "", titleEn: "", contentSw: "", contentEn: "", topic: "", sourceTitle: "", sourceUrl: "", reviewDate: "", required: true, replacesModuleId: "" };

export default function TrainingManagement() {
  const readError = usePlainError();
  const c = useCopy();
  const access = useQuery(api.users.currentAccess);
  const modules = useQuery(api.paralegalTraining.listForReview, {});
  const submit = useMutation(api.paralegalTraining.submit);
  const review = useMutation(api.paralegalTraining.review);
  const retire = useMutation(api.paralegalTraining.retire);
  const [fields, setFields] = useState(blank);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [language, setLanguage] = useState<"sw" | "en">("sw");
  const isAdmin = access?.roles.includes("admin") ?? false;
  const field = (key: keyof typeof blank, label: string, multiline = false) => <label className="block text-sm font-medium">{label}{multiline ? <textarea className="mt-1 min-h-36 w-full rounded-lg border p-3" required value={String(fields[key])} onChange={event => setFields(current => ({ ...current, [key]: event.target.value }))} /> : <input className="mt-1 w-full rounded-lg border p-3" required type={key === "reviewDate" ? "date" : key === "sourceUrl" ? "url" : "text"} value={String(fields[key])} onChange={event => setFields(current => ({ ...current, [key]: event.target.value }))} />}</label>;

  async function submitModule(event: React.FormEvent) {
    event.preventDefault(); setBusy("submit"); setError(""); setNotice("");
    try { const reviewDueAt = new Date(`${fields.reviewDate}T12:00:00+03:00`).getTime(); await submit({ titleSw: fields.titleSw, titleEn: fields.titleEn, contentSw: fields.contentSw, contentEn: fields.contentEn, topic: fields.topic, sourceTitle: fields.sourceTitle, sourceUrl: fields.sourceUrl, reviewDueAt, required: fields.required, replacesModuleId: fields.replacesModuleId ? fields.replacesModuleId as Id<"paralegal_training_modules"> : undefined }); setFields(blank); setNotice("Module submitted. A different administrator must review it before paralegals can see it."); }
    catch (cause) { setError(readError(cause, "Could not submit the module.")); }
    finally { setBusy(null); }
  }

  async function decide(id: Id<"paralegal_training_modules">, decision: "approved" | "rejected" | "retired") {
    setBusy(id); setError(""); setNotice("");
    try { const reason = reasons[id]?.trim() ?? ""; if (decision === "retired") await retire({ id, reason }); else await review({ id, decision, note: reason }); setNotice(decision === "approved" ? "Module approved for paralegal learning." : decision === "rejected" ? "Module rejected." : "Module retired from learning."); }
    catch (cause) { setError(readError(cause, "Could not save the decision.")); }
    finally { setBusy(null); }
  }

  return <Layout><main className="mx-auto max-w-6xl space-y-7 px-4 py-10"><Link className="text-sm text-primary underline" to="/dashboard/staff">{c("Back to LSF operations")}</Link><AdminPageIntro title={c("Paralegal training")} body="Prepare clear lessons in both languages. Another reviewer checks each version before it is published." pose="documents" />
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}{notice && <p role="status" className="rounded-xl bg-green-50 p-4 text-green-800">{notice}</p>}
    <form className="grid gap-4 rounded-2xl border bg-white p-6 md:grid-cols-2" onSubmit={event => void submitModule(event)}><div className="md:col-span-2"><h2 className="text-xl font-semibold">{c("Submit a training module")}</h2><p className="mt-1 text-sm text-neutral-600">{c("Write both languages, cite an HTTPS source and set a future review date. Submission does not publish.")}</p></div>{field("titleSw", "Title · Kiswahili")}{field("titleEn", "Title · English")}{field("contentSw", "Content · Kiswahili", true)}{field("contentEn", "Content · English", true)}{field("topic", "Topic")}{field("sourceTitle", "Source title")}{field("sourceUrl", "Official source URL")}{field("reviewDate", "Next review date")}<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={fields.required} onChange={event => setFields(current => ({ ...current, required: event.target.checked }))} />{c("Required for paralegals")}</label><label className="text-sm">{c("Replace an approved module (optional)")}<select className="mt-1 w-full rounded-lg border p-3" value={fields.replacesModuleId} onChange={event => setFields(current => ({ ...current, replacesModuleId: event.target.value }))}><option value="">{c("New module")}</option>{modules?.filter(item => item.status === "approved").map(item => <option key={item._id} value={item._id}>{item.titleEn}{c(" · v")}{item.version}</option>)}</select></label><div className="md:col-span-2"><Button type="submit" disabled={busy !== null}>{busy === "submit" ? c("Submitting…") : "Submit for independent review"}</Button></div></form>
    <section><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-semibold">{c("Module lifecycle")}</h2><p className="mt-1 text-sm text-neutral-600">{c("Check both languages, source and review date before a decision.")}</p></div><div className="inline-flex rounded-xl border bg-white p-1"><button className={`rounded-lg px-3 py-2 text-sm ${language === "sw" ? "bg-primary text-white" : "text-neutral-700"}`} onClick={() => setLanguage("sw")}>Kiswahili</button><button className={`rounded-lg px-3 py-2 text-sm ${language === "en" ? "bg-primary text-white" : "text-neutral-700"}`} onClick={() => setLanguage("en")}>{c("English")}</button></div></div>{modules === undefined ? <BrandLoading compact text={c("Loading modules…")}/> : !modules.length ? <p className="mt-4 rounded-2xl border bg-white p-6">{c("No modules have been submitted.")}</p> : <div className="mt-4 space-y-4">{modules.map(item => <article key={item._id} className="rounded-2xl border bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-primary">{item.topic}{c(" · v")}{item.version}</p><h3 className="mt-2 text-xl font-semibold">{language === "sw" ? item.titleSw : item.titleEn}</h3></div><span className="rounded-full bg-neutral-100 px-3 py-1 text-sm capitalize">{item.status}</span></div><details className="mt-4"><summary className="cursor-pointer text-sm font-semibold text-primary">{c("Read content and source")}</summary><p className="mt-3 whitespace-pre-wrap leading-7">{language === "sw" ? item.contentSw : item.contentEn}</p><p className="mt-3 text-sm">{c("Source: ")}<a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{item.sourceTitle}</a></p><p className="text-sm text-neutral-600">{c("Review due ")}{new Date(item.reviewDueAt).toLocaleDateString("en-TZ")} · {item.required ? c("Required") : c("Optional")}</p></details>{item.reviewNote && <p className="mt-3 rounded-lg bg-neutral-50 p-3 text-sm">{c("Previous review: ")}{item.reviewNote}</p>}{isAdmin && ["pending", "approved"].includes(item.status) && <div className="mt-4 border-t pt-4"><label className="block text-sm font-medium" htmlFor={`module-reason-${item._id}`}>{c("Decision reason (10+ characters)")}</label><textarea id={`module-reason-${item._id}`} className="mt-2 min-h-20 w-full rounded-lg border p-3" maxLength={1000} value={reasons[item._id] ?? ""} onChange={event => setReasons(current => ({ ...current, [item._id]: event.target.value }))} /><div className="mt-3 flex flex-wrap gap-2">{item.status === "pending" ? <><Button disabled={busy !== null || (reasons[item._id]?.trim().length ?? 0) < 10} onClick={() => void decide(item._id, "approved")}>{c("Approve")}</Button><Button variant="outline" disabled={busy !== null || (reasons[item._id]?.trim().length ?? 0) < 10} onClick={() => void decide(item._id, "rejected")}>{c("Reject")}</Button></> : <Button variant="outline" disabled={busy !== null || (reasons[item._id]?.trim().length ?? 0) < 10} onClick={() => void decide(item._id, "retired")}>{c("Retire module")}</Button>}</div><p className="mt-2 text-xs text-neutral-500">{c("The backend prevents the submitter from approving the same module.")}</p></div>}</article>)}</div>}</section>
  </main></Layout>;
}
