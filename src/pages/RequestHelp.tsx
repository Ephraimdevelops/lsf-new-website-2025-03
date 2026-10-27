import BrandLoading from '@/components/shared/BrandLoading';
import { usePlainError } from "@/i18n/usePlainError";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { decodeWebDraft, newWebDraft, webDraftKey, webDraftReady, type WebIntakeDraft as Draft, type Issue, type Urgency, type Contact } from '@/lib/webIntakeDraft';
import { regionOptions, districtOptions } from '../../mobile/src/regionOptions';
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react';
const MAX_FILE = 10 * 1024 * 1024;
const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);

export default function RequestHelp() {
  const c = useCopy();
  const { isLoaded, userId } = useAuth();
  if (!isLoaded) return <Layout><Container><BrandLoading compact text={c("Loading your account…")}/></Container></Layout>;
  return <RequestHelpForm key={userId ?? 'guest'} owner={userId ?? null} />;
}
function RequestHelpForm({ owner }: { owner: string | null }) {
  const readError = usePlainError();
  const c = useCopy();
  const { locale, setLocale } = useLanguage();
  const [params] = useSearchParams();
  const { isSignedIn } = useAuth();
  const [draft, setDraft] = useState<Draft>(() => ({ ...newWebDraft(params), locale }));
  const [hasSaved, setHasSaved] = useState(() => { try { return !!sessionStorage.getItem(webDraftKey(owner)); } catch { return false; } });
  const [hasGuest, setHasGuest] = useState(() => { try { return !!owner && !!sessionStorage.getItem(webDraftKey(null)); } catch { return false; } });
  const [notice, setNotice] = useState('');
  const [consent, setConsent] = useState(false);
  const lock = useRef(false);
  const [recordId, setRecordId] = useState('');
  const sw = locale === 'sw';
  useEffect(() => { setDraft(current => current.locale === locale ? current : { ...current, locale }); setConsent(false); }, [locale]);
  const t = (swText: string, enText: string) => sw ? swText : enText;
  function persist() {
    setError(''); setNotice('');
    try { sessionStorage.setItem(webDraftKey(owner), JSON.stringify({ owner, draft })); setHasSaved(true); setNotice(t('Rasimu imehifadhiwa kwenye kichupo hiki. Faili lazima lichaguliwe tena ukirudi.', 'Draft saved in this browser tab. Select your file again when you return.')); return true; }
    catch { setError(t('Rasimu haijahifadhiwa. Endelea kwenye kichupo hiki.', 'Draft could not be saved. Continue in this tab.')); return false; }
  }
  function restore(guest = false) {
    setError(''); setNotice('');
    try {
      const sourceOwner = guest ? null : owner;
      const raw = sessionStorage.getItem(webDraftKey(sourceOwner));
      if (!raw) return;
      let restored = decodeWebDraft(raw, sourceOwner);
      if (guest) {
        restored = { ...restored, id: newWebDraft(params).id };
        sessionStorage.setItem(webDraftKey(owner), JSON.stringify({ owner, draft: restored }));
        sessionStorage.removeItem(webDraftKey(null)); setHasGuest(false); setHasSaved(true);
      }
      setDraft(restored); setLocale(restored.locale); setConsent(false); setStep('write');
      setNotice(restored.locale === 'sw' ? 'Rasimu imerejeshwa. Kagua taarifa kabla ya kutuma.' : 'Draft restored. Review the details before sending.');
    } catch { setError(t('Rasimu haijarejeshwa. Unaweza kuendelea na ombi jipya.', 'Draft could not be restored. You can continue with a new request.')); }
  }
  const [file, setFile] = useState<File | null>(null);
  const uploadedFile = useRef<{ file: File; requestId: string; storageId: Id<'_storage'> } | null>(null);
  const [attachmentRecorded, setAttachmentRecorded] = useState(false);
  const [cleanupFailed, setCleanupFailed] = useState(false);
  const [step, setStep] = useState<'write' | 'review' | 'done'>('write');
  const [reference, setReference] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const existing = useQuery(api.legalHelp.getDraft, isSignedIn ? { clientRequestId: draft.id } : 'skip');
  const saveDraft = useMutation(api.legalHelp.saveDraft);
  const generateUploadUrl = useMutation(api.legalHelp.generateAttachmentUploadUrl);
  const attach = useMutation(api.legalHelp.attachToDraft);
  const submit = useMutation(api.legalHelp.submit);
  const recordJourney = useMutation(api.journeyAnalytics.record);
  function review() {
    if (!webDraftReady(draft)) return;
    setConsent(false); setStep('review');
    void recordJourney({ surface: 'web', step: 'request_review' }).catch(() => undefined);
  }
  function update(partial: Partial<Draft>) { setDraft(current => ({ ...current, ...partial })); setConsent(false); setNotice(''); }
  function chooseFile(next: File | null) {
    setError('');
    if (!next) { setFile(null); return; }
    if (!allowedTypes.has(next.type) || next.size < 1 || next.size > MAX_FILE) {
      setError(t('Chagua PDF, JPG au PNG lisilozidi MB 10.', 'Choose a PDF, JPG or PNG file up to 10 MB.'));
      return;
    }
    setFile(next);
  }
  function confirmSubmission(publicId: string, requestId: string) {
    setReference(publicId); setRecordId(requestId); setStep('done');
    try { sessionStorage.removeItem(webDraftKey(owner)); setHasSaved(false); setCleanupFailed(false); }
    catch { setCleanupFailed(true); }
  }
  async function send() {
    if (lock.current || busy || !isSignedIn || existing === undefined || !consent || !webDraftReady(draft)) return;
    lock.current = true;
    setBusy(true); setError('');
    try {
      const saved = await saveDraft({
        clientRequestId: draft.id, locale: draft.locale, description: draft.story.trim(),
        issueCategory: draft.issue, region: draft.region.trim(), district: draft.district.trim(),
        desiredHelp: draft.desiredHelp.trim(), safeContactMethod: draft.contact,
        preferredLanguage: draft.locale, urgency: draft.urgency,
        hasDocuments: Boolean(file || attachmentRecorded || existing?.attachments.length),
        sourceServiceId: draft.sourceServiceId as Id<'justice_services'> | undefined,
      });
      if (saved.status === 'withdrawn') throw new Error('This request was withdrawn. Check your requests before starting a new one.');
      if (saved.status !== 'draft') {
        confirmSubmission(saved.publicId, saved.requestId); return;
      }
      let expectedVersion = saved.version;
      if (file && !attachmentRecorded && !existing?.attachments.length) {
        let storageId = uploadedFile.current?.file === file && uploadedFile.current.requestId === saved.requestId ? uploadedFile.current.storageId : undefined;
        if (!storageId) {
          const uploadUrl = await generateUploadUrl({});
          const response = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
          if (!response.ok) throw new Error('Evidence upload failed. Your request has not been sent. Please try again.');
          storageId = (await response.json() as { storageId: Id<'_storage'> }).storageId;
          uploadedFile.current = { file, requestId: saved.requestId, storageId };
        }
        const attached = await attach({ requestId: saved.requestId, storageId, name: file.name, type: file.type, size: file.size });
        setAttachmentRecorded(true);
        expectedVersion = attached.version;
      }
      const result = await submit({ requestId: saved.requestId, expectedVersion, consentVersion: 'service-v1' });
      confirmSubmission(result.publicId, saved.requestId);
    } catch (caught) {
      setError(readError(caught, 'Could not send your request. Please try again.'));
    } finally { lock.current = false; setBusy(false); }
  }
  const issueLabels: Record<Issue, string> = { employment: t('Ajira', 'Employment'), land: t('Ardhi na nyumba', 'Land and housing'), family: t('Familia', 'Family'), safety: t('Usalama', 'Safety'), consumer: t('Bidhaa na huduma', 'Goods and services'), other: t('Msaada mwingine', 'Other help') };
  const contactLabels: Record<Contact, string> = { in_app: t('Ndani ya programu au tovuti', 'In the app or website'), phone: t('Simu', 'Phone'), sms: 'SMS', email: t('Barua pepe', 'Email'), none: t('Usiwasiliane nami kwa sasa', 'Do not contact me for now') };
  const urgencyLabels: Record<Urgency, string> = { standard: t('Kawaida', 'Standard'), urgent: t('Haraka', 'Urgent'), immediate_safety: t('Wasiwasi wa usalama wa sasa', 'Immediate safety concern') };
  const districts = districtOptions(draft.region, [], draft.district);
  return <Layout><section className="bg-[#FAF5F3] py-8 sm:py-12"><Container><div className="mx-auto max-w-2xl" lang={sw ? c("sw") : c("en")}>
    <div className="flex flex-wrap items-center justify-between gap-4"><Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary" to="/legal-help"><ArrowLeft size={17} aria-hidden="true" />{t('Pata msaada', 'Get help')}</Link><div className="flex gap-2" aria-label={t('Lugha ya ukurasa', 'Page language')}>{(['sw','en'] as const).map(locale => <button type="button" key={locale} aria-pressed={draft.locale === locale} disabled={busy} onClick={() => { setLocale(locale); update({ locale }); }} className={`min-h-11 rounded-full px-4 text-sm font-semibold ${draft.locale === locale ? 'bg-primary text-white' : 'border bg-white text-primary'}`}>{locale === 'sw' ? 'Kiswahili' : c("English")}</button>)}</div></div>
    <p className="mt-6 text-xs font-semibold text-primary">HAKI YANGU · LSF</p><h1 className="mt-3 text-3xl font-semibold text-[#241820] sm:text-4xl">{step === 'review' ? t('Kagua kabla ya kutuma', 'Review before sending') : step === 'done' ? t('Ombi limepokelewa', 'Request received') : t('Tuambie kilichotokea.', 'Tell us what happened.')}</h1><p className="mt-3 leading-7 text-neutral-600">{t('LSF itakagua ombi lako. Unachagua taarifa za kushiriki na njia salama ya kuwasiliana nawe.', 'LSF will review your request. You choose what to share and a safe way to contact you.')}</p>
    {step === 'done' ? <section className="mt-7 space-y-4 rounded-2xl border border-[#D9E8E3] bg-white p-7"><Check size={32} className="text-[#176A67]" /><h2 className="text-2xl font-semibold">{t('Tumepokea ombi lako.', 'We have your request.')}</h2>{cleanupFailed && <p role="alert" className="text-sm text-amber-800">{t('Ombi limetumwa, lakini rasimu haikuondolewa kwenye kichupo. Usitume tena; tumia namba hii.', 'Your request was sent, but the saved draft could not be cleared. Do not send again; use this reference.')}</p>}<p>{t('Kumbukumbu', 'Reference')}: <strong>{reference}</strong></p><p className="text-neutral-600">{t('Fuatilia maendeleo na ujibu maswali ya LSF kwenye ombi lako.', 'Follow progress and reply to LSF questions in your request.')}</p><Button asChild><Link to={`/dashboard/user/requests/${recordId}`}>{t('Fuatilia ombi langu', 'Track my request')}</Link></Button></section> : <>
      <ol aria-label={t('Hatua za ombi', 'Request steps')} className="mt-7 flex gap-5 text-sm">{[t('Eleza tatizo', 'Tell your story'), t('Kagua na tuma', 'Review and send')].map((label, index) => <li key={label} aria-current={(step === 'write' ? 0 : 1) === index ? 'step' : undefined} className={`flex items-center gap-2 ${(step === 'write' ? 0 : 1) === index ? 'font-semibold text-primary' : 'text-neutral-500'}`}><span className="flex h-7 w-7 items-center justify-center rounded-full border bg-white">{index + 1}</span>{label}</li>)}</ol>
      {(hasSaved || hasGuest) && step === 'write' && <section className="mt-5 rounded-xl border border-[#D9E8E3] bg-[#EEF5F3] p-4"><p className="text-sm">{hasGuest ? t('Kuna rasimu uliyoanza kabla ya kuingia. Irejeshe kwenye akaunti hii ukitaka.', 'There is a draft started before sign-in. Restore it to this account if it is yours.') : t('Una rasimu iliyohifadhiwa kwenye kichupo hiki.', 'You have a saved draft in this browser tab.')}</p><div className="mt-3 flex flex-wrap gap-3">{hasSaved && <Button variant="outline" onClick={() => restore()}>{t('Rejesha rasimu yangu', 'Restore my saved draft')}</Button>}{hasGuest && <Button variant="outline" onClick={() => restore(true)}>{t('Rejesha rasimu ya kabla ya kuingia', 'Restore the draft from before sign-in')}</Button>}</div></section>}
      <section className="mt-6 rounded-2xl border border-[#EFDFE3] bg-white p-5 sm:p-8">
        {step === 'write' ? <div className="space-y-5">
          <label className="block text-sm font-semibold">{t('Tatizo linahusu nini?', 'What is your issue?')}<select className="mt-2 min-h-12 w-full rounded-xl border p-3" value={draft.issue} onChange={event => update({ issue: event.target.value as Issue })}>{Object.entries(issueLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="block text-sm font-semibold">{t('Nini kilitokea?', 'What happened?')}<textarea className="mt-2 min-h-36 w-full rounded-xl border p-3" value={draft.story} maxLength={5000} onChange={event => update({ story: event.target.value })} placeholder={t('Eleza hali yako kwa maneno yako mwenyewe', 'Describe the situation in your own words')} /><span className="mt-1 block text-xs font-normal text-neutral-500">{t('Andika angalau herufi 10.', 'Write at least 10 characters.')} {draft.story.length}/5000</span></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">{t('Mkoa', 'Region')}<select value={draft.region} onChange={event => update({ region: event.target.value, district: '' })} className="mt-2 min-h-12 w-full rounded-xl border p-3"><option value="">{t('Chagua mkoa', 'Choose a region')}</option>{regionOptions.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}{draft.region && !regionOptions.some(item => item.value === draft.region) && <option value={draft.region}>{draft.region}</option>}</select></label><label className="text-sm font-semibold">{t('Wilaya', 'District')}<Input list="intake-districts" maxLength={100} disabled={!draft.region} className="mt-2 min-h-12" value={draft.district} onChange={event => update({ district: event.target.value })} placeholder={t('Chagua au andika wilaya', 'Choose or enter district')} /><datalist id="intake-districts">{districts.map(item => <option key={item.value} value={item.value} />)}</datalist></label></div>
          <label className="block text-sm font-semibold">{t('Ungependa msaada gani?', 'What support would you like?')}<textarea className="mt-2 min-h-24 w-full rounded-xl border p-3" value={draft.desiredHelp} maxLength={1000} onChange={event => update({ desiredHelp: event.target.value })} /><span className="mt-1 block text-xs font-normal text-neutral-500">{draft.desiredHelp.length}/1000</span></label>
          <label className="block text-sm font-semibold">{t('Uharaka wa msaada', 'Urgency')}<select className="mt-2 min-h-12 w-full rounded-xl border p-3" value={draft.urgency} onChange={event => update({ urgency: event.target.value as Urgency })}>{Object.entries(urgencyLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          {draft.urgency === 'immediate_safety' && <p className="rounded-xl bg-[#FFF3E8] p-4 text-sm leading-6">{t('Ombi hili halihakikishi msaada wa dharura. Tumia njia salama zaidi inayopatikana kwako ikiwa uko hatarini sasa.', 'This request does not guarantee emergency assistance. Use the safest available way to seek immediate help if you are in danger now.')}</p>}
          <label className="block text-sm font-semibold">{t('Njia salama ya kuwasiliana nawe', 'Safe way to contact you')}<select className="mt-2 min-h-12 w-full rounded-xl border p-3" value={draft.contact} onChange={event => update({ contact: event.target.value as Contact })}>{Object.entries(contactLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <div className="rounded-xl border border-dashed p-4"><label htmlFor="request-evidence" className="text-sm font-semibold">{t('Hati au picha (si lazima)', 'Documents or photos (optional)')}</label><p className="mt-1 text-xs leading-5 text-neutral-600">{t('PDF, JPG au PNG moja, hadi MB 10. Tuma taarifa zinazohitajika tu.', 'One PDF, JPG or PNG, up to 10 MB. Share only the information needed.')}</p>{existing?.attachments.length ? <p className="mt-3 text-sm">{t('Vilivyoambatishwa', 'Attached')}: {existing.attachments.map(item => item.name).join(', ')}</p> : <input id="request-evidence" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="mt-3 block w-full text-sm" onChange={event => chooseFile(event.target.files?.[0] ?? null)} />}</div>
          <div className="flex flex-wrap gap-3"><Button disabled={!webDraftReady(draft)} onClick={review}>{t('Kagua ombi', 'Review request')}</Button><Button variant="outline" onClick={() => persist()}>{t('Hifadhi, endelea baadaye', 'Save for later')}</Button></div><p className="text-xs leading-5 text-neutral-500">{t('Maandishi yanahifadhiwa kwenye kichupo hiki unapochagua Hifadhi. Hakuna faili linalotumwa hadi utume ombi.', 'Text is saved in this tab when you choose Save. Files are uploaded only when you send the request.')}</p>
        </div> : <div className="space-y-5">
          <h2 className="text-xl font-semibold">{t('Maelezo utakayotuma', 'The details you will send')}</h2><p className="whitespace-pre-wrap break-words rounded-xl bg-[#FAF5F3] p-4 leading-7">{draft.story}</p><dl className="space-y-3 text-sm">{[[t('Tatizo','Issue'),issueLabels[draft.issue]],[t('Mahali','Location'),`${draft.district}, ${draft.region}`],[t('Msaada unaotaka','Help requested'),draft.desiredHelp],[t('Uharaka','Urgency'),urgencyLabels[draft.urgency]],[t('Mawasiliano salama','Safe contact'),contactLabels[draft.contact]],[t('Lugha','Language'),sw ? 'Kiswahili' : 'English'],[t('Ushahidi','Evidence'),existing?.attachments.map(item => item.name).join(', ') || file?.name || t('Hakuna','None')]].map(([label,value]) => <div key={label}><dt className="font-semibold text-neutral-600">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words">{value}</dd></div>)}</dl>
          {!isSignedIn ? <div className="rounded-xl border border-[#D9E8E3] bg-[#EEF5F3] p-4"><p className="text-sm leading-6">{t('Ingia kutuma ombi. Hifadhi rasimu kwanza, kisha irejeshe ukirudi. Chagua faili lako tena.', 'Sign in to send. Save your draft first, then restore it when you return. Select your file again.')}</p><Button asChild className="mt-3"><Link to="/login?returnTo=%2Frequest-help" onClick={event => { if (!persist()) event.preventDefault(); }}>{t('Hifadhi na ingia','Save and sign in')}</Link></Button></div> : <label className="flex items-start gap-3 rounded-xl bg-[#EEF5F3] p-4 text-sm leading-6"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={consent} disabled={busy} onChange={event => setConsent(event.target.checked)} /><span>{t('Ninakubali LSF kutumia taarifa hizi kukagua na kujibu ombi langu. Rufaa kwenda huduma nyingine itahitaji uamuzi wangu tofauti.', 'I agree that LSF may use this information to review and respond to my request. Referral to another service requires my separate decision.')}</span></label>}
          <div className="flex flex-wrap gap-3"><Button variant="outline" disabled={busy} onClick={() => { setConsent(false); setStep('write'); }}>{t('Hariri','Edit')}</Button><Button disabled={!isSignedIn || existing === undefined || busy || !consent} onClick={() => void send()}>{busy ? t('Inatuma…','Sending…') : t('Tuma ombi','Send request')}</Button></div><div className="flex items-center gap-2 text-xs text-neutral-500"><ShieldCheck size={16} aria-hidden="true" /><Link to="/privacy" className="underline">{t('Soma kuhusu faragha yako','Read about your privacy')}</Link></div>
        </div>}
        {!!notice && <p role="status" className="mt-4 text-sm leading-6 text-[#176A67]">{notice}</p>}{!!error && <p role="alert" className="mt-4 text-sm leading-6 text-red-700">{error}</p>}
      </section>
    </>}
  </div></Container></section></Layout>;
}
