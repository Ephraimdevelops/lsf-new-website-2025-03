import { plainError } from "../../shared/plainLanguage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { AdminIntro as CivicPageIntro } from "../src/admin/AdminIntro";
import { AdminScreen as Screen } from "../src/admin/AdminScreen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

import { SearchFilters } from '../src/components/SearchFilters';
import { PersonalIntro } from '../src/components/PersonalIntro';
import { CivicPageHeader } from '../src/components/CivicPageHeader';
import { validateGuideContent } from '../src/content/legalGuideContent';

type Jurisdiction = "national" | "tanzania_mainland" | "zanzibar";
export default function EditorialWorkspaceScreen() {
  useSensitiveScreenProtection("editorial-workspace");
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["content_editor", "admin"].includes(role));
  const isAdmin = roles.includes("admin");
  const params=useLocalSearchParams<{view?:string}>();
  const [search,setSearch]=useState("");
  const [editingId,setEditingId]=useState<Id<"legal_guides">>();const [editVersion,setEditVersion]=useState<number>();
  const [coverImageUrl,setCoverImageUrl]=useState("");const [coverImageAltSw,setCoverImageAltSw]=useState("");const [coverImageAltEn,setCoverImageAltEn]=useState("");
  const savePending=useMutation(api.publications.updatePendingLegalGuide);
  const archive=useMutation(api.publications.archiveLegalGuide);
  const [retirementConfirmation,setRetirementConfirmation]=useState<{id:Id<"legal_guides">;version:number;note:string}|null>(null);
  const [queueTab, setQueueTab] = useState<"pending" | "due" | "approved" | "history">("pending");
  const guidePage = usePaginatedQuery(api.publications.listLegalGuidesPage, allowed ? { status: queueTab } : "skip", { initialNumItems: 20 });
  const guides = guidePage.status === "LoadingFirstPage" ? undefined : guidePage.results;
  const submit = useMutation(api.publications.submitLegalGuide);
  const retire = useMutation(api.publications.retireLegalGuide);
  const [titleSw, setTitleSw] = useState(""); const [titleEn, setTitleEn] = useState("");
  const [summarySw, setSummarySw] = useState(""); const [summaryEn, setSummaryEn] = useState("");
  const [stepsSw, setStepsSw] = useState(""); const [stepsEn, setStepsEn] = useState("");
  const [category, setCategory] = useState(""); const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("national");
  const [sourceTitle, setSourceTitle] = useState(""); const [sourceUrl, setSourceUrl] = useState(""); const [publisher, setPublisher] = useState(""); const [reviewDate, setReviewDate] = useState("");
  const [replacesGuideId, setReplacesGuideId] = useState<Id<"legal_guides"> | null>(null);
  const [resubmitsGuideId, setResubmitsGuideId] = useState<Id<"legal_guides"> | null>(null);
  const [replacementContext, setReplacementContext] = useState<{ title: string; version: number } | null>(null);
  const [retiring, setRetiring] = useState<string | null>(null); const [retireReason, setRetireReason] = useState("");
  const [mode, setMode] = useState<"queue" | "author">("queue");
  useEffect(()=>{setMode(params.view==="author"?"author":"queue");if(params.view==="history")setQueueTab("history");},[params.view]);
  const [authorStep, setAuthorStep] = useState<1 | 2 | 3>(1);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  function clearAuthorDraft() {
    setEditingId(undefined);setEditVersion(undefined);setCoverImageUrl("");setCoverImageAltSw("");setCoverImageAltEn("");
    setTitleSw(""); setTitleEn(""); setSummarySw(""); setSummaryEn(""); setStepsSw(""); setStepsEn("");
    setCategory(""); setJurisdiction("national"); setSourceTitle(""); setSourceUrl(""); setPublisher(""); setReviewDate("");
    setReplacesGuideId(null); setResubmitsGuideId(null); setReplacementContext(null); setAuthorStep(1); setError("");
  }
  function continueToSource() {
    const lines = [stepsSw, stepsEn].map((value) => value.split("\n").map((step) => step.trim()).filter(Boolean));
    if ([titleSw, titleEn, summarySw, summaryEn].some((value) => value.trim().length < 3) || lines.some((steps) => steps.length < 1 || steps.length > 12 || steps.some((step) => step.length < 8))) {
      setError(sw ? "Jaza vichwa, muhtasari na hatua 1–12 kwa kila lugha. Kila hatua iwe na herufi 8 au zaidi." : "Complete both titles, summaries and 1–12 steps per language. Each step needs at least 8 characters."); return;
    }
    setError(""); setAuthorStep(2);
  }
  function continueToPreview() {
    const dueAt = Date.parse(`${reviewDate.trim()}T12:00:00+03:00`);
    let validUrl = false;
    try { const url = new URL(sourceUrl.trim()); validUrl = url.protocol === "https:" && url.hostname.includes("."); } catch { /* source URL is validated below */ }
    if ([category, sourceTitle, publisher].some((value) => value.trim().length < 3) || !validUrl || !/^\d{4}-\d{2}-\d{2}$/.test(reviewDate.trim()) || !Number.isFinite(dueAt) || new Date(dueAt).toISOString().slice(0, 10) !== reviewDate.trim() || dueAt <= Date.now() || dueAt > Date.now() + 3 * 365 * 24 * 60 * 60 * 1000) {
      setError(sw ? "Jaza mada, chanzo rasmi cha HTTPS, mchapishaji na tarehe ya ukaguzi ndani ya miaka mitatu." : "Complete the category, official HTTPS source, publisher and a review date within three years."); return;
    }
    try {validateGuideContent({titleSw,titleEn,summarySw,summaryEn,stepsSw:stepsSw.split("\n").map(x=>x.trim()).filter(Boolean),stepsEn:stepsEn.split("\n").map(x=>x.trim()).filter(Boolean),category,jurisdiction,sourceTitle,sourceUrl,publisher,reviewDueAt:dueAt,coverImageUrl,coverImageAltSw,coverImageAltEn});}catch(cause){setError(plainError(cause, locale, "Check the source and image."));return;}
    setError(""); setAuthorStep(3);
  }
  async function submitGuide() {
    setError(""); setNotice("");
    const reviewDueAt = Date.parse(`${reviewDate.trim()}T12:00:00+03:00`);
    if (!Number.isFinite(reviewDueAt)) { setError(sw ? "Weka tarehe halali ya ukaguzi (YYYY-MM-DD)." : "Enter a valid review date (YYYY-MM-DD)."); return; }
    setBusy(true);
    try {
      const content = { titleSw, titleEn, summarySw, summaryEn, stepsSw: stepsSw.split("\n").filter(Boolean), stepsEn: stepsEn.split("\n").filter(Boolean), category, jurisdiction, sourceTitle, sourceUrl, publisher, reviewDueAt, replacesGuideId: replacesGuideId ?? undefined, resubmitsGuideId: resubmitsGuideId ?? undefined,coverImageUrl,coverImageAltSw,coverImageAltEn };
      if(editingId){const {replacesGuideId:_replace,resubmitsGuideId:_resubmit,...fields}=content;await savePending({id:editingId,expectedEditVersion:editVersion,...fields});}else await submit(content);
      clearAuthorDraft();
      setMode("queue");setQueueTab("pending");router.replace("/editorial-workspace");
      setNotice(sw ? "Mwongozo umetumwa kwa idhini huru." : "Guide submitted for independent review.");
    } catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }
  async function confirmRemoval(){
    if(!retirementConfirmation||busy)return;setBusy(true);setError("");
    try {await archive({id:retirementConfirmation.id,expectedEditVersion:retirementConfirmation.version,reason:retirementConfirmation.note});setRetirementConfirmation(null);setRetiring(null);setRetireReason("");setNotice(sw?"Mwongozo umeondolewa; historia imehifadhiwa.":"Guide removed. Its history is retained.");}
    catch(cause){setError(plainError(cause, locale, "Could not remove guide."));}finally{setBusy(false);}
  }
  function revise(guide: NonNullable<typeof guides>[number]) {
    setEditingId(guide.status==="pending"?guide._id:undefined);setEditVersion(guide.editVersion??0);setCoverImageUrl(guide.coverImageUrl??"");setCoverImageAltSw(guide.coverImageAltSw??"");setCoverImageAltEn(guide.coverImageAltEn??"");
    setReplacesGuideId(guide.status === "approved" ? guide._id : guide.status==="retired"?null:guide.replacesGuideId ?? null); setTitleSw(guide.titleSw); setTitleEn(guide.titleEn); setSummarySw(guide.summarySw); setSummaryEn(guide.summaryEn);
    setResubmitsGuideId(guide.status === "rejected" ? guide._id : null);
    setReplacementContext({ title: sw ? guide.titleSw : guide.titleEn, version: guide.version });
    setStepsSw(guide.stepsSw.join("\n")); setStepsEn(guide.stepsEn.join("\n")); setCategory(guide.category); setJurisdiction(guide.jurisdiction);
    setSourceTitle(guide.sourceTitle); setSourceUrl(guide.sourceUrl); setPublisher(guide.publisher); setReviewDate(guide.status==="pending"?new Date(guide.reviewDueAt).toLocaleDateString("en-CA",{timeZone:"Africa/Dar_es_Salaam"}):"");
    router.setParams({view:"author"});setMode("author");
    setAuthorStep(1);
    setNotice(guide.status === "pending"
      ? (sw ? "Rasimu yako imefunguliwa. Kagua maandishi, chanzo na tarehe kabla ya kuhifadhi." : "Your draft is open. Check the words, source and date before saving.")
      : (sw ? "Maandishi ya toleo la sasa yamejazwa. Kagua chanzo tena na uweke tarehe mpya ya ukaguzi kabla ya kuwasilisha kwa idhini huru." : "The current text is loaded. Recheck the source and enter a new review date before submitting for independent approval."));
  }
  const visibleGuides = (guides ?? []).filter(guide=>[guide.titleEn,guide.titleSw,guide.category,guide.sourceTitle,guide.publisher].join(" ").toLowerCase().includes(search.trim().toLowerCase()));
  return <Screen key={`editor-${mode}-${authorStep}-${queueTab}`}>
    <CivicPageHeader compact title={sw?"Miongozo · LSF":"Guides · LSF"} actionIcon="notifications-outline" actionLabel={sw?"Arifa":"Notifications"} onAction={()=>router.push("/notifications")}/><PersonalIntro body={sw?"Andika kwa urahisi. Kagua lugha zote. Hakikisha chanzo ni cha sasa.":"Write clearly. Check both languages. Keep the source current."}/>
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !allowed ? <State text={sw ? "Ruhusa ya mhariri au msimamizi inahitajika." : "Editor or administrator access is required."} /> : <>
      <CivicPageIntro icon="book-outline" eyebrow={sw ? "LSF · MIONGOZO" : "LSF · GUIDANCE"} title={sw ? "Kagua miongozo ya msaada" : "Review help guides"} description={sw ? "Mwongozo huchapishwa baada ya msimamizi mwingine kukagua chanzo na maudhui." : "Guidance is published after another administrator reviews its source and content."} />
      {error ? <Surface tone="orange"><Text accessibilityRole="alert" style={styles.error}>{error}</Text></Surface> : null}
      {notice ? <Surface tone="teal"><Text style={styles.body}>{notice}</Text></Surface> : null}
      <View style={styles.choices}><QueueTab active={mode === "queue"} label={sw ? "Foleni na matoleo" : "Queue & versions"} onPress={() => {router.setParams({view:"guides"});setMode("queue");}} /><QueueTab active={mode === "author"} label={sw ? "Andika mwongozo" : "Write guide"} onPress={() => {router.setParams({view:"author"});setMode("author");}} /></View>
      {mode === "author" ? <>
      <Surface tone="pink"><Text style={styles.section}>{editingId ? (sw?"Hariri rasimu inayosubiri":"Edit pending draft") : replacesGuideId ? (sw ? "Tayarisha toleo jipya" : "Prepare a new version") : resubmitsGuideId ? (sw ? "Sahihisha mwongozo uliokataliwa" : "Correct rejected guide") : (sw ? "Andika mwongozo mpya" : "Write a new guide")}</Text><Text style={styles.body}>{sw ? `Hatua ya ${authorStep} kati ya 3 · ${authorStep === 1 ? "Maudhui" : authorStep === 2 ? "Chanzo" : "Hakiki"}` : `Step ${authorStep} of 3 · ${authorStep === 1 ? "Content" : authorStep === 2 ? "Source" : "Preview"}`}</Text>
        {replacesGuideId || resubmitsGuideId ? <Surface tone="orange"><Text style={styles.body}>{resubmitsGuideId ? (sw ? "Unasahihisha rasimu iliyokataliwa. Historia yake itabaki na idhini huru bado inahitajika." : "You are correcting a rejected draft. Its history remains and independent approval is still required.") : (sw ? "Unatayarisha toleo mbadala. Toleo la sasa litaendelea kuwa hai mpaka hili liidhinishwe." : "You are preparing a replacement. The current version stays live until this one is approved.")}</Text>{replacementContext ? <Text style={styles.meta}>{resubmitsGuideId ? (sw ? "Imetokana na" : "Resubmits") : (sw ? "Linabadilisha" : "Replaces")}: {replacementContext.title} · v{replacementContext.version}</Text> : null}<Button label={sw ? "Ghairi na futa rasimu ya toleo" : "Cancel & discard revision draft"} variant="quiet" onPress={() => {clearAuthorDraft();setMode("queue");router.replace("/editorial-workspace");}} /></Surface> : null}
        {authorStep === 1 ? <>
        <Field label="Kichwa · Kiswahili" value={titleSw} onChange={setTitleSw} />
        <Field label="Title · English" value={titleEn} onChange={setTitleEn} />
        <Field label="Muhtasari · Kiswahili" value={summarySw} onChange={setSummarySw} multiline />
        <Field label="Summary · English" value={summaryEn} onChange={setSummaryEn} multiline />
        <Field label={sw ? "Hatua kwa Kiswahili (mstari mmoja kila hatua)" : "Swahili steps (one per line)"} value={stepsSw} onChange={setStepsSw} multiline />
        <Field label={sw ? "Hatua kwa Kiingereza (mstari mmoja kila hatua)" : "English steps (one per line)"} value={stepsEn} onChange={setStepsEn} multiline />
        <Button label={sw ? "Endelea kwenye chanzo" : "Continue to source"} onPress={continueToSource} />
        </> : null}
        {authorStep === 2 ? <>
        <Field label={sw ? "Mada" : "Category"} value={category} onChange={setCategory} />
        <Text style={styles.label}>{sw ? "Eneo la sheria" : "Jurisdiction"}</Text><View style={styles.choices}>{(["national", "tanzania_mainland", "zanzibar"] as Jurisdiction[]).map((value) => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: jurisdiction === value }} aria-checked={jurisdiction === value} onPress={() => setJurisdiction(value)} style={[styles.chip, jurisdiction === value && styles.chipOn]}><Text style={[styles.chipText, jurisdiction === value && styles.chipTextOn]}>{value.replaceAll("_", " ")}</Text></Pressable>)}</View>
        <Field label={sw ? "Jina la chanzo" : "Source title"} value={sourceTitle} onChange={setSourceTitle} />
        <Field label={sw ? "Kiungo rasmi cha HTTPS" : "Official HTTPS URL"} value={sourceUrl} onChange={setSourceUrl} />
        <Field label={sw ? "Mchapishaji" : "Publisher"} value={publisher} onChange={setPublisher} />
        <Field label={sw ? "Ukaguzi ujao · YYYY-MM-DD" : "Review due · YYYY-MM-DD"} value={reviewDate} onChange={setReviewDate} />
        <Field label={sw?"Kiungo cha picha HTTPS (hiari)":"Image HTTPS URL (optional)"} value={coverImageUrl} onChange={setCoverImageUrl}/>
        {coverImageUrl ? <><Text style={styles.meta}>{sw?"Tumia picha yenye ruhusa ya matumizi.":"Use an image you have permission to display."}</Text><Field label="Maelezo ya picha · Kiswahili" value={coverImageAltSw} onChange={setCoverImageAltSw}/><Field label="Image description · English" value={coverImageAltEn} onChange={setCoverImageAltEn}/></> : null}
        <Button label={sw ? "Endelea kuhakiki" : "Continue to preview"} onPress={continueToPreview} />
        <Button label={sw ? "Rudi kwenye maudhui" : "Back to content"} variant="quiet" onPress={() => setAuthorStep(1)} />
        </> : null}
        {authorStep === 3 ? <>
        <Text style={styles.body}>{sw ? "Kagua Kiswahili, Kiingereza, chanzo na tarehe. Uwasilishaji huu utasubiri ukaguzi huru." : "Check both languages, the source and review date. Submission waits for independent review."}</Text>
        <Button label={editingId ? (sw?"Hifadhi rasimu inayosubiri":"Save pending draft") : resubmitsGuideId ? (sw ? "Wasilisha rasimu iliyosahihishwa" : "Submit corrected draft") : replacesGuideId ? (sw ? "Wasilisha toleo jipya kwa ukaguzi" : "Submit revision for review") : (sw ? "Wasilisha kwa ukaguzi" : "Submit for review")} loading={busy} onPress={() => void submitGuide()} />
        <Button label={sw ? "Hariri chanzo" : "Edit source"} variant="quiet" onPress={() => setAuthorStep(2)} />
        </> : null}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      </Surface>
      {authorStep === 3 ? <>{coverImageUrl.startsWith("https://")?<Image source={{uri:coverImageUrl}} accessibilityLabel={sw?coverImageAltSw:coverImageAltEn} style={{height:160,borderRadius:16}} resizeMode="contain"/>:null}<Surface tone="white"><Text style={styles.section}>Kiswahili</Text><Text style={styles.title}>{titleSw}</Text><Text style={styles.body}>{summarySw}</Text>{stepsSw.split("\n").filter(Boolean).map((step, index) => <Text key={index} style={styles.body}>{index + 1}. {step}</Text>)}</Surface><Surface tone="white"><Text style={styles.section}>English</Text><Text style={styles.title}>{titleEn}</Text><Text style={styles.body}>{summaryEn}</Text>{stepsEn.split("\n").filter(Boolean).map((step, index) => <Text key={index} style={styles.body}>{index + 1}. {step}</Text>)}</Surface><Surface tone="teal"><Text style={styles.section}>{sw ? "Chanzo na ukaguzi" : "Source & review"}</Text><Text style={styles.body}>{publisher} · {sourceTitle}</Text><Text style={styles.meta}>{sourceUrl}</Text><Text style={styles.meta}>{sw ? "Ukaguzi ujao" : "Review due"}: {reviewDate}</Text></Surface></> : null}
      </> : <>
      <Button label={sw?"Ingiza faili ya miongozo":"Import guide pack"} variant="quiet" onPress={()=>router.push("/guide-import")}/>
      <Text style={styles.section}>{sw ? "Miongozo na matoleo" : "Guides & versions"}</Text>
      <SearchFilters value={search} onChange={setSearch} sw={sw} placeholder={sw?"Tafuta mwongozo au chanzo":"Find a guide or source"} label={sw?"Onyesha":"Show"} title={sw?"Hali ya mwongozo":"Guide status"} count={Number(queueTab!=="pending")} onReset={()=>{setSearch("");setQueueTab("pending");}}><View style={{gap:8}}>{[["pending","Awaiting review","Zinasubiri ukaguzi"],["due","Source review due","Ukaguzi wa chanzo"],["approved","Published","Zimechapishwa"],["history","Removed and rejected","Zimeondolewa au kukataliwa"]].map(([value,en,translation])=><Button key={value} label={sw?translation:en} variant={queueTab===value?"primary":"secondary"} onPress={()=>setQueueTab(value as typeof queueTab)}/>)}</View></SearchFilters>
      <Text style={styles.meta}>{sw?"Utafutaji unatumia miongozo iliyopakiwa. Pakia zaidi kutafuta zaidi.":"Search covers loaded guides. Load more to search further."}</Text>
      {queueTab === "due" ? <Surface tone="orange"><Text style={styles.body}>{sw ? "Hapa kuna miongozo iliyoidhinishwa ambayo ukaguzi wa chanzo umepita au unafika ndani ya siku 30. Tayarisha toleo mbadala; la sasa litaendelea hadi toleo jipya liidhinishwe, isipokuwa tarehe yake imepita." : "Approved guides appear here when source review is overdue or due within 30 days. Prepare a replacement; the current guide stays live until approval of the new version unless its review date has passed."}</Text></Surface> : null}
      {guides === undefined ? <State text={sw ? "Inapakia miongozo..." : "Loading guides..."} /> : visibleGuides.length === 0 ? <State text={guidePage.status === "CanLoadMore" ? (sw ? "Hakuna kwenye ukurasa huu. Pakia rekodi zaidi." : "None on this page. Load more records.") : queueTab === "pending" ? (sw ? "Hakuna mwongozo unaosubiri ukaguzi." : "No guide is awaiting review.") : queueTab === "due" ? (sw ? "Hakuna mwongozo unaohitaji ukaguzi ndani ya siku 30." : "No guide needs source review within 30 days.") : queueTab === "approved" ? (sw ? "Hakuna mwongozo uliochapishwa." : "No published guide yet.") : (sw ? "Hakuna toleo lililokataliwa au kuondolewa." : "No rejected or retired versions yet.")} /> : visibleGuides.map((guide) => <Surface key={guide._id} tone={guide.status === "approved" ? "teal" : "white"}>
        <Text style={styles.title}>{sw ? guide.titleSw : guide.titleEn}</Text><Text style={styles.meta}>{guide.category} · {guide.jurisdiction.replaceAll("_", " ")} · {guideStatus(guide.status, sw)}</Text><Text style={styles.body}>{sw ? guide.summarySw : guide.summaryEn}</Text><Text style={styles.meta}>{guide.publisher} · {guide.sourceTitle}</Text><Text style={styles.meta}>{sw ? "Ukaguzi kabla ya" : "Review due"}: {new Date(guide.reviewDueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ")}</Text>
        {guide.status === "approved" && guide.reviewDueAt <= Date.now() ? <Text style={styles.error}>{sw ? "Ukaguzi wa chanzo umepitwa na muda; mwongozo hauonyeshwi tena kwa umma. Andaa toleo jipya." : "Source review is overdue; this guide is no longer public. Prepare a new version."}</Text> : null}
        {guide.reviewNote ? <Text style={styles.meta}>{sw ? "Sababu ya ukaguzi" : "Review reason"}: {guide.reviewNote}</Text> : null}
        <Button label={sw?"Soma toleo hili":"Read this version"} variant="quiet" onPress={()=>router.push({pathname:"/legal-guide-review/[id]",params:{id:guide._id}})}/>
        {guide.status === "pending" && guide.submittedBy === access?.user?._id ? <Button label={sw?"Hariri rasimu":"Edit pending draft"} variant="secondary" onPress={()=>revise(guide)}/> : null}
        {guide.status === "pending" ? <Button label={isAdmin && guide.submittedBy !== access?.user?._id ? (sw ? "Kagua lugha zote na uamue" : "Review both languages & decide") : (sw ? "Angalia toleo lililowasilishwa" : "View submitted version")} variant="secondary" onPress={() => router.push({ pathname: "/legal-guide-review/[id]", params: { id: guide._id } })} /> : null}
        {guide.status === "approved" && guide.reviewDueAt > Date.now() ? <Button label={sw ? "Angalia mwongozo wa umma" : "View public guide"} variant="quiet" onPress={() => router.push({ pathname: "/legal-guide/[id]", params: { id: guide._id } })} /> : null}
        {guide.resubmitsGuideId ? <Text style={styles.meta}>{sw ? "Rasimu iliyosahihishwa" : "Corrected resubmission"} · v{guide.version}</Text> : guide.replacesGuideId ? <Text style={styles.meta}>{sw ? "Toleo mbadala" : "Replacement version"} · v{guide.version}</Text> : <Text style={styles.meta}>v{guide.version}</Text>}
        {guide.status === "approved" || (guide.status === "rejected" && guide.submittedBy === access?.user?._id) || (guide.status==="retired"&&(isAdmin||guide.submittedBy===access?.user?._id)) ? <Button label={guide.status === "rejected" ? (sw ? "Rekebisha na uwasilishe tena" : "Edit & resubmit") : (sw ? "Tayarisha toleo jipya" : "Prepare a new version")} variant="secondary" onPress={() => revise(guide)} /> : null}
        {guide.status !== "retired" && (isAdmin || (guide.status!=="approved" && guide.submittedBy===access?.user?._id)) ? <><Button label={sw ? "Ondoa kwenye uchapishaji" : "Remove guide"} variant="secondary" onPress={() => { setRetiring(retiring === guide._id ? null : guide._id); setRetireReason("");setRetirementConfirmation(null); }} />{retiring === guide._id ? <><Text style={styles.body}>{sw ? "Hii itaondoa mwongozo kwenye orodha ya umma mara moja; historia itabaki." : "This removes the guide from the public list immediately; its history remains."}</Text><Field label={sw ? "Sababu ya kuondoa" : "Retirement reason"} value={retireReason} onChange={value=>{setRetireReason(value);setRetirementConfirmation(null);}} multiline /><Button label={sw ? "Thibitisha kuondoa" : "Confirm retirement"} loading={busy} disabled={busy || retireReason.trim().length < 10} onPress={() => setRetirementConfirmation({id:guide._id,version:guide.editVersion??0,note:retireReason.trim()})} /></> : null}</> : null}
      </Surface>)}
      {retirementConfirmation?<Surface tone="pink"><Text style={styles.title}>{sw?"Thibitisha kuondoa":"Confirm removal"}</Text><Text style={styles.body}>{retirementConfirmation.note}</Text><Button label={sw?"Thibitisha na hifadhi":"Confirm and save"} loading={busy} onPress={()=>void confirmRemoval()}/><Button variant="secondary" label={sw?"Hariri":"Edit"} onPress={()=>setRetirementConfirmation(null)}/></Surface>:null}
      {guidePage.status === "CanLoadMore" ? <Button label={sw ? "Pakia miongozo zaidi" : "Load more guides"} variant="secondary" onPress={() => guidePage.loadMore(20)} /> : guidePage.status === "LoadingMore" ? <State text={sw ? "Inapakia zaidi..." : "Loading more..."} /> : null}
      </>}
    </>}
  </Screen>;
}
function guideStatus(status: string, sw: boolean) { const labels: Record<string, [string, string]> = { pending: ["Inasubiri ukaguzi", "Awaiting review"], approved: ["Imechapishwa", "Published"], rejected: ["Imekataliwa", "Rejected"], retired: ["Imeondolewa", "Retired"] }; return labels[status]?.[sw ? 0 : 1] ?? status; }
function State({ text }: { text: string }) { return <Surface><Text style={styles.body}>{text}</Text></Surface>; }
function QueueTab({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) { return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.chip, active && styles.chipOn]}><Text style={[styles.chipText, active && styles.chipTextOn]}>{label}</Text></Pressable>; }
function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) { return <View><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChange} multiline={multiline} style={[styles.input, multiline && styles.multi]} placeholder={label} placeholderTextColor={colors.inkMuted} accessibilityLabel={label} /></View>; }
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 30, lineHeight: 37 }, heroBody: { color: "#F9E8EF", fontFamily: type.regular, fontSize: 16, lineHeight: 24 }, section: { color: colors.burgundy, fontFamily: type.bold, fontSize: 21, marginTop: spacing.md }, label: { color: colors.ink, fontFamily: type.bold, fontSize: 15, marginTop: spacing.sm }, input: { minHeight: 48, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, color: colors.ink, fontFamily:type.regular }, multi: { minHeight: 88, textAlignVertical: "top" }, choices: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, chip: { minHeight: 48, justifyContent: "center", borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: spacing.md }, chipOn: { backgroundColor: colors.burgundy }, chipText: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 14 }, chipTextOn: { color: colors.surface }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 18 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 16, lineHeight: 24, marginTop: spacing.sm }, meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 14, lineHeight: 20, marginTop: spacing.sm }, error: { color: colors.danger, fontFamily: type.bold, fontSize: 13 } });
