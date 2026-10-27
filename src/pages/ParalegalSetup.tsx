import BrandLoading from '@/components/shared/BrandLoading';
import { usePlainError } from "@/i18n/usePlainError";
import { useCopy } from "@/i18n/useCopy";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { isParalegalReady } from "../../convex/lib/paralegalAccess";
import Layout from "@/components/layout/Layout";
import ParalegalIllustration from "@/components/paralegal/ParalegalIllustration";
import ParalegalProfileEdit from "@/components/paralegal/ParalegalProfileEdit";
import { Button } from "@/components/ui/button";

export default function ParalegalSetup() {
  const readError = usePlainError();
  const c = useCopy();
  const profile = useQuery(api.paralegals.getMyApplication, {});
  const training = useQuery(api.paralegalTraining.readiness, profile?.status === "approved" ? {} : "skip");
  const complete = useMutation(api.paralegals.completeMyOnboarding);
  const [ethics, setEthics] = useState(false);
  const [conduct, setConduct] = useState(false);
  const [safety, setSafety] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const verified = Boolean(profile?.status === "approved" && profile.isVerified && profile.reviewedBy && (profile.idDocumentStorageId || profile.idDocumentUrl) && profile.certificateStorageId);
  const trainingDone = Boolean(training?.requiredCount && training.completedCount === training.requiredCount);
  return <Layout><main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
    <Link to="/dashboard/paralegal" className="inline-flex min-h-12 items-center font-semibold text-primary underline">{c("Back to my work")}</Link>
    <header className="flex items-center gap-5"><div className="flex-1"><h1 className="text-3xl font-bold">{c("Your work setup")}</h1><p className="mt-2 text-base text-neutral-600">{c("Finish these steps before accepting cases.")}</p></div><ParalegalIllustration pose="safety" /></header>
    {profile === undefined ? <BrandLoading compact text={c("Loading your work profile…")}/> : !profile ? <section className="rounded-2xl border bg-orange-50 p-5"><h2 className="text-xl font-semibold">{c("Your work profile is not linked")}</h2><p className="mt-2">{c("Use your LSF invitation or contact LSF to connect your application and documents.")}</p><Link className="mt-4 inline-block font-semibold text-primary underline" to="/become-a-paralegal">{c("See how to join")}</Link></section> : <>
      <section className="overflow-hidden rounded-2xl border bg-white">
        {[
          [verified, "LSF review and documents", verified ? "Your identity and training documents have been reviewed." : `${c("Application status:")} ${c(profile.status.replaceAll("_", " "))}. ${c("LSF must approve and verify your documents.")}`],
          [Boolean(profile.bio?.trim() && profile.specializations?.length), "Public work profile", "Add a short introduction and the issues you can help with."],
          [Boolean(profile.availabilityStatus && profile.workingHours?.trim()), "Time to help", "Set your availability and working hours."],
          [trainingDone, "Required LSF training", training ? `${c("Required lessons reviewed:")} ${training.completedCount}/${training.requiredCount}` : "Read and confirm the required training."],
          [Boolean(profile.onboardingCompleted), "Conduct and safeguarding", "Review the standards and confirm you have understood them."],
        ].map(([done, title, body]) => <div key={String(title)} className="flex gap-4 border-b p-5 last:border-b-0"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${done ? "bg-teal-100 text-teal-800" : "bg-orange-100 text-orange-800"}`} aria-label={done ? c("Complete") : c("Still needed")}>{done ? "✓" : "•"}</span><div><h2 className="text-lg font-semibold">{c(String(title))}</h2><p className="mt-1 text-base text-neutral-600">{c(String(body))}</p></div></div>)}
      </section>
      {profile.status === "approved" && <div className="flex flex-wrap gap-3"><ParalegalProfileEdit paralegal={profile} /><Button asChild variant="outline"><Link to="/dashboard/paralegal/learning">{c("Read required training")}</Link></Button></div>}
      {isParalegalReady(profile) ? <p role="status" className="rounded-2xl bg-teal-50 p-5 font-semibold text-teal-800">{c("Your setup is complete. You can review new assignments.")}</p> : verified && <section className="rounded-2xl border bg-white p-5"><h2 className="text-xl font-semibold">{c("Confirm your preparation")}</h2><p className="mt-2 text-neutral-600">{c("Finish your profile and training. Confirm each statement after reviewing the LSF standards.")}</p>
        {[[ethics, setEthics, "I reviewed the paralegal confidentiality and ethics rules."], [conduct, setConduct, "I understand and accept the code of conduct."], [safety, setSafety, "I completed the required safeguarding training."]].map(([value, setter, label]) => <label key={String(label)} className="mt-2 flex min-h-12 items-center gap-3"><input type="checkbox" checked={Boolean(value)} onChange={event => (setter as (value: boolean) => void)(event.target.checked)} />{c(String(label))}</label>)}
        <Button className="mt-4 min-h-12" disabled={saving || !trainingDone || !ethics || !conduct || !safety || !profile.bio?.trim() || !profile.specializations?.length || !profile.workingHours?.trim() || !profile.availabilityStatus} onClick={async () => { setSaving(true); setNotice(""); try { await complete({ id: profile._id, ethicsAccepted: ethics, codeOfConductAccepted: conduct, safeguardingTrainingCompleted: safety }); setNotice(c("Your setup was saved.")); } catch (error) { setNotice(readError(error, "Could not save. Please try again.")); } finally { setSaving(false); } }}>{saving ? c("Saving…") : c("Save my preparation")}</Button>
      </section>}
    </>}
    {notice && <p role="status" className="rounded-xl border p-4">{notice}</p>}
  </main></Layout>;
}
