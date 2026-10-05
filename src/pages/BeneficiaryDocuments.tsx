import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Layout from "@/components/layout/Layout";

const readable = (value: string) => value.replaceAll("_", " ");

export default function BeneficiaryDocuments() {
  const documents = useQuery(api.caseManagement.myDocuments, {});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const visible = documents?.filter(item => (category === "all" || item.category === category) && `${item.name} ${item.casePublicId} ${item.caseSummary}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return <Layout><main className="mx-auto max-w-6xl px-4 py-10">
    <Link className="text-sm text-primary underline" to="/dashboard/user">Back to my workspace</Link>
    <header className="mt-6 rounded-3xl bg-gradient-to-br from-primary to-[#720D31] p-8 text-white"><p className="text-sm font-semibold uppercase tracking-widest">My Haki Yangu</p><h1 className="mt-2 text-3xl font-bold">My documents</h1><p className="mt-2 max-w-2xl text-white/90">Find files shared in your legal-help cases, see their review status, and return to the related case.</p></header>
    <div className="mt-6 grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-[1fr_220px]"><div><label className="block text-sm font-medium" htmlFor="document-search">Search documents or case reference</label><input id="document-search" className="mt-2 w-full rounded-lg border p-3" value={search} onChange={event => setSearch(event.target.value)} /></div><div><label className="block text-sm font-medium" htmlFor="document-category">Type</label><select id="document-category" className="mt-2 w-full rounded-lg border p-3" value={category} onChange={event => setCategory(event.target.value)}><option value="all">All types</option>{["evidence", "identity", "contract", "letter", "receipt", "other"].map(value => <option key={value} value={value}>{readable(value)}</option>)}</select></div></div>
    {documents === undefined ? <p role="status" className="mt-8">Loading your documents…</p> : !documents.length ? <section className="mt-6 rounded-2xl border bg-white p-8"><h2 className="text-xl font-semibold">No case documents yet</h2><p className="mt-2 text-neutral-600">Files shared in a case will appear here. Open a case to add a document for your team.</p><Link className="mt-4 inline-block text-primary underline" to="/dashboard/user">View my cases</Link></section> : !visible.length ? <p className="mt-8">No documents match these filters.</p> : <div className="mt-6 grid gap-4 md:grid-cols-2">{visible.map(item => <article key={item._id} className="rounded-2xl border bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-primary">{item.casePublicId} · {readable(item.category)}</p><h2 className="mt-2 break-words text-lg font-semibold">{item.name}</h2><p className="mt-1 text-sm capitalize text-neutral-600">{readable(item.status)} · {new Date(item.createdAt).toLocaleDateString("en-TZ", { timeZone: "Africa/Dar_es_Salaam" })}</p>{item.reviewNotes && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm">Review note: {item.reviewNotes}</p>}{item.textContent && <details className="mt-3"><summary className="cursor-pointer text-primary">Read document text</summary><p className="mt-2 whitespace-pre-wrap break-words text-sm">{item.textContent}</p></details>}<div className="mt-4 flex flex-wrap gap-4 text-sm">{item.url && <a className="text-primary underline" href={item.url} target="_blank" rel="noopener noreferrer">Open file</a>}<Link className="text-primary underline" to={`/dashboard/user/cases/${item.caseId}`}>Open related case</Link></div></article>)}</div>}
    <p className="mt-6 text-sm text-neutral-600">Documents are visible only to people authorised for the related case. Share new files from that case's workspace.</p>
  </main></Layout>;
}
