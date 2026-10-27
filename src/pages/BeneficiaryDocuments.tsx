import BrandLoading from '@/components/shared/BrandLoading';
import { WorkHeader } from "@/components/dashboard/WorkArea";
import { displayLabel } from "../../shared/plainLanguage";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Layout from "@/components/layout/Layout";



export default function BeneficiaryDocuments() {
  const c = useCopy();
  const { locale } = useLanguage();
  const documents = useQuery(api.caseManagement.myDocuments, { context: "personal" });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const visible = documents?.filter(item => (category === "all" || item.category === category) && `${item.name} ${item.casePublicId} ${item.caseSummary}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return <Layout><main className="work-page mx-auto max-w-6xl px-4 py-10">
    <Link className="text-sm text-primary underline" to="/dashboard/user">{c("Back to my account")}</Link>
    <WorkHeader eyebrow={c("My Haki Yangu")} title={c("My documents")} description={c("View your case files and their review status. Open a file or its case.")}/>
    <div className="mt-6 grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-[1fr_220px]"><div><label className="block text-sm font-medium" htmlFor="document-search">{c("Search documents or case reference")}</label><input id="document-search" className="mt-2 w-full rounded-lg border p-3" value={search} onChange={event => setSearch(event.target.value)} /></div><div><label className="block text-sm font-medium" htmlFor="document-category">{c("Type")}</label><select id="document-category" className="mt-2 w-full rounded-lg border p-3" value={category} onChange={event => setCategory(event.target.value)}><option value="all">{c("All types")}</option>{["evidence", "identity", "contract", "letter", "receipt", "other"].map(value => <option key={value} value={value}>{displayLabel(value, locale)}</option>)}</select></div></div>
    {documents === undefined ? <BrandLoading compact text={c("Loading your documents…")}/> : !documents.length ? <section className="mt-6 rounded-2xl border bg-white p-8"><h2 className="text-xl font-semibold">{c("No case documents yet")}</h2><p className="mt-2 text-neutral-600">{c("Files shared in a case will appear here. Open a case to add a document for your team.")}</p><Link className="mt-4 inline-block text-primary underline" to="/dashboard/user">{c("View my cases")}</Link></section> : !visible.length ? <p className="mt-8">{c("No documents match these filters.")}</p> : <div className="mt-6 work-document-list">{visible.map(item => <article key={item._id} className="work-form-panel"><p className="text-xs font-bold uppercase tracking-wide text-primary">{item.casePublicId} · {displayLabel(item.category, locale)}</p><h2 className="mt-2 break-words text-lg font-semibold">{item.name}</h2><p className="mt-1 text-sm capitalize text-neutral-600">{displayLabel(item.status, locale)} · {new Date(item.createdAt).toLocaleDateString((locale === "sw" ? "sw-TZ" : "en-TZ"), { timeZone: "Africa/Dar_es_Salaam" })}</p>{item.reviewNotes && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm">{c("Review note: ")}{item.reviewNotes}</p>}{item.textContent && <details className="mt-3"><summary className="cursor-pointer text-primary">{c("Read document text")}</summary><p className="mt-2 whitespace-pre-wrap break-words text-sm">{item.textContent}</p></details>}<div className="mt-4 flex flex-wrap gap-4 text-sm">{item.url && <a className="text-primary underline" href={item.url} target="_blank" rel="noopener noreferrer">{c("Open file")}</a>}<Link className="text-primary underline" to={`/dashboard/user/cases/${item.caseId}?section=documents`}>{c("Open related case")}</Link></div></article>)}</div>}
    <p className="mt-6 text-sm text-neutral-600">{c("Only people authorised for the case can see these files. Open that case to add a file.")}</p>
  </main></Layout>;
}
