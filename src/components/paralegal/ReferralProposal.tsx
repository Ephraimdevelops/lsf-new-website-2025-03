import { usePlainError } from "@/i18n/usePlainError";
import { useCopy } from "@/i18n/useCopy";
import { useLanguage } from "@/providers/LanguageProvider";
import BrandLoading from '@/components/shared/BrandLoading';
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ParalegalIllustration from "./ParalegalIllustration";
export default function ReferralProposal({ caseId, parentId, excludeServiceId, supportHref = "/dashboard/paralegal?tab=tools" }: { supportHref?: string; caseId: Id<"cases">; parentId?: Id<"referrals">; excludeServiceId?: Id<"justice_services"> }) {
 const c = useCopy(); const readError = usePlainError(); const { locale } = useLanguage();
 const services = useQuery(api.referrals.destinations, { caseId, ...(parentId ? { parentReferralId: parentId } : {}) });
 const [service, setService] = useState(""); const [provider, setProvider] = useState(""); const [reason, setReason] = useState(""); const [information, setInformation] = useState("");
 const [step, setStep] = useState(1);
 const [review, setReview] = useState(false); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(""); const [saved, setSaved] = useState(false);
 const providers = useQuery(api.referrals.destinationProviders, service ? { caseId, destinationServiceId: service as Id<"justice_services">, ...(parentId ? { parentReferralId: parentId } : {}) } : "skip");
 const create = useMutation(api.referrals.createForCase); const onward = useMutation(api.referrals.createOnwardReferral);
 function change(set: (value: string) => void, value: string) { set(value); setReview(false); setNotice(""); }
 async function submit() {
  if (busy) return;
  if (step === 1) { if (service && provider) setStep(2); else setNotice(c("Choose the service and the person who will receive this request.")); return; }
  if (!service || !provider || reason.trim().length < 10 || information.trim().length < 10) { setNotice(c("Choose a service and provider. Describe why help is needed and which information to share.")); return; }
  if (!review) { setReview(true); setStep(3); return; }
  setBusy(true); setNotice("");
  try { const args = { destinationServiceId: service as Id<"justice_services">, destinationUserId: provider as Id<"users">, reason: reason.trim(), informationShared: [information.trim()] }; if (parentId) await onward({ ...args, parentReferralId: parentId }); else await create({ ...args, caseId }); setSaved(true); }
  catch (error) { setNotice(readError(error, "Could not send. Try again.")); } finally { setBusy(false); }
 }
 return <section className="rounded-2xl border bg-white p-5">
  <div className="mb-5 flex items-center gap-4"><ParalegalIllustration pose="contact" size={72} /><div><h3 className="mb-1 text-lg">{parentId ? c("Suggest onward help") : c("Suggest another service")}</h3><p className="mb-0 text-sm text-neutral-600">{c("Choose where to ask for help. The person decides whether their details can be shared.")}</p></div></div>
  {saved ? <p role="status">{c("Suggestion sent. The provider receives it after the beneficiary agrees.")}</p> : <form className="grid gap-4" onSubmit={event => { event.preventDefault(); void submit(); }}>
   <p className="mb-0 text-sm font-bold text-primary">{c("Step")} {step} {c("of 3 ·")} {step === 1 ? c("Choose a service") : step === 2 ? c("Explain the help needed") : c("Check and ask permission")}</p>
   {step === 1 && <>
   {services === undefined && <BrandLoading compact text={"Loading services\u2026"}/>}
   {services?.filter(item => item.referralCapability && item._id !== excludeServiceId).length === 0 && <p role="status" className="mb-0 text-sm">{c("No service is available for this case.")} <Link className="font-semibold text-primary" to={supportHref}>{c("Ask LSF to help →")}</Link></p>}
   <label className="grid gap-2 text-sm font-semibold">{c("Which service can help?")}<select required value={service} onChange={event => { change(setService, event.target.value); setProvider(""); }} className="min-h-12 rounded-xl border bg-white px-3"><option value="">{c("Choose a service")}</option>{services?.filter(item => item.referralCapability && item._id !== excludeServiceId).map(item => <option key={String(item._id)} value={String(item._id)}>{item.name} · {item.district}</option>)}</select></label>
   <label className="grid gap-2 text-sm font-semibold">{c("Who will receive this request?")}<select required disabled={!service || providers === undefined} value={provider} onChange={event => change(setProvider, event.target.value)} className="min-h-12 rounded-xl border bg-white px-3"><option value="">{c("Choose a provider")}</option>{providers?.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label>
   {service && providers?.length === 0 && <p className="mb-0 text-sm">{c("No provider is linked to this service. Ask LSF to help choose a destination.")}</p>}
   </>}
   {step === 2 && <>
   <label className="grid gap-2 text-sm font-semibold">{c("Why is this service needed?")}<Textarea required minLength={10} maxLength={2000} value={reason} onChange={event => change(setReason, event.target.value)} /></label>
   <label className="grid gap-2 text-sm font-semibold">{c("Which information is needed?")}<span className="font-normal text-neutral-600">{c("Include only the details needed for this help.")}</span><Textarea required minLength={10} maxLength={160} value={information} onChange={event => change(setInformation, event.target.value)} /></label>
   </>}
   {review && <div className="rounded-xl bg-teal-50 p-4"><h4>{c("Review your suggestion")}</h4><p>{services?.find(item => item._id === service)?.name} · {providers?.find(item => item._id === provider)?.name}</p><p className="whitespace-pre-wrap">{reason}</p><p className="whitespace-pre-wrap">{information}</p><p className="mb-0">{c("This asks for the beneficiary’s approval. Details go to the provider only after they agree.")}</p></div>}
   {!!notice && <p role="alert" className="mb-0 text-sm">{notice}</p>}
   <div className="flex flex-wrap gap-2">{step > 1 && <Button type="button" variant="outline" disabled={busy} onClick={() => { setStep(step - 1); setReview(false); setNotice(""); }}>{c("Back and edit")}</Button>}<Button type="submit" disabled={busy}>{busy ? c("Sending…") : review ? c("Ask the person for permission") : step === 1 ? c("Next: explain the help") : c("Next: check the request")}</Button></div>
  </form>}
 </section>;
}
