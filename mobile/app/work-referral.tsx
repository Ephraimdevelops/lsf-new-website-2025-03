import { BrandLoading } from '../src/components/BrandLoading';
import { plainError } from "../../shared/plainLanguage";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { Screen } from "../src/components/Screen";
import { CivicPageHeader } from "../src/components/CivicPageHeader";
import { ParalegalIntro } from "../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../src/components/ParalegalNavigation";
import { Button } from "../src/components/Button";
import { IntakeSelect } from "../src/intake/IntakeSelect";
import { useLanguage } from "../src/i18n";
import { colors, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";
export default function WorkReferral() {
  useSensitiveScreenProtection("work-referral");
  const { caseId: caseParam, parentId } = useLocalSearchParams<{ caseId: string; parentId?: string }>();
  const caseId = caseParam as Id<"cases">;
  const { isSignedIn } = useAuth(); const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some(role => (parentId ? ["paralegal", "provider_staff"] : ["admin", "staff", "supervisor", "paralegal", "provider_staff"]).includes(role));
  const details = useQuery(api.caseManagement.getCase, allowed && caseId && !parentId ? { caseId } : "skip");
  const parent = useQuery(api.referrals.getForDestination, allowed && parentId ? { referralId: parentId as Id<"referrals"> } : "skip");
  const [service, setService] = useState(""); const [provider, setProvider] = useState(""); const [reason, setReason] = useState(""); const [information, setInformation] = useState("");
  const [step, setStep] = useState(1);
  const [review, setReview] = useState(false); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(""); const [saved, setSaved] = useState(false);
  const validParent = parent && parent.referral.caseId === caseId && ["accepted", "scheduled", "service_delivered"].includes(parent.referral.status) && !parent.onwardReferral;
  const canPropose = !!(parentId ? validParent : details?.closureReadiness && details.case.beneficiaryId !== access?.user._id && !["closed", "resolved", "closed_unresolved"].includes(details.case.status));
  const services = useQuery(api.referrals.destinations, canPropose && caseId ? { caseId, ...(parentId ? { parentReferralId: parentId as Id<"referrals"> } : {}) } : "skip");
  const providers = useQuery(api.referrals.destinationProviders, canPropose && service ? { caseId, destinationServiceId: service as Id<"justice_services">, ...(parentId ? { parentReferralId: parentId as Id<"referrals"> } : {}) } : "skip");
  const create = useMutation(api.referrals.createForCase); const onward = useMutation(api.referrals.createOnwardReferral);
  async function submit() {
    if (busy || !canPropose) return;
    if (step === 1) { if (service && provider) { setStep(2); setNotice(""); } else setNotice(sw ? "Chagua huduma na anayepokea ombi." : "Choose the service and the person who will receive the request."); return; }
    if (!service || !provider || reason.trim().length < 10 || information.trim().length < 10) { setNotice(sw ? "Chagua huduma na mtoa huduma. Eleza sababu na taarifa zinazohitajika." : "Choose a service and provider. Describe the reason and the information needed."); return; }
    if (!review) { setReview(true); setStep(3); return; }
    setBusy(true); setNotice("");
    try { const args = { destinationServiceId: service as Id<"justice_services">, destinationUserId: provider as Id<"users">, reason: reason.trim(), informationShared: [information.trim()] }; if (parentId) await onward({ ...args, parentReferralId: parentId as Id<"referrals"> }); else await create({ ...args, caseId }); setSaved(true); }
    catch (error) { setNotice(plainError(error, locale, (sw ? "Haijahifadhiwa. Jaribu tena." : "Could not save. Try again."))); }
    finally { setBusy(false); }
  }
  const change = (setter: (value: string) => void) => (value: string) => { setter(value); setReview(false); setNotice(""); };
  return <Screen footer={allowed ? <ParalegalNavigation current="cases" /> : undefined}>
    <CivicPageHeader compact back title={sw ? "Pendekeza huduma nyingine" : "Suggest another service"} />
    <ParalegalIntro pose="contact" title={sw ? "Unganisha msaada unaofaa." : "Connect the right help."} body={sw ? "Mnufaika ataamua kama taarifa zake zinaweza kushirikiwa." : "The beneficiary decides whether their information can be shared."} />
    {!isSignedIn ? <Button label={sw ? "Ingia" : "Sign in"} onPress={() => router.push("/sign-in")} /> : access === undefined || (allowed && (parentId ? parent === undefined : details === undefined)) ? <BrandLoading compact text={sw ? "Inapakia…" : "Loading…"}/> : !allowed || !canPropose ? <Text style={styles.body}>{sw ? "Rufaa haiwezi kuanzishwa katika hatua hii." : "A referral cannot be started at this stage."}</Text> : saved ? <View style={styles.box}><Text style={styles.title}>{sw ? "Pendekezo limetumwa" : "Suggestion sent"}</Text><Text style={styles.body}>{sw ? "LSF na mnufaika wataona pendekezo. Mtoa huduma atapata taarifa baada ya mnufaika kukubali." : "LSF and the beneficiary can see your suggestion. The provider receives it after the beneficiary agrees."}</Text><Button label={sw ? "Rudi kwenye kesi" : "Back to the case"} onPress={() => router.replace({ pathname: "/case/[id]", params: { id: caseId, section: "referrals" } })} /></View> : <View style={styles.form}>
      <Text style={styles.title}>{sw ? `Hatua ${step} ya 3` : `Step ${step} of 3`} · {step === 1 ? (sw ? "Chagua huduma" : "Choose a service") : step === 2 ? (sw ? "Eleza msaada" : "Explain the help needed") : (sw ? "Kagua na omba ruhusa" : "Check and ask permission")}</Text>
      {step === 1 && <>
      {services === undefined && <BrandLoading compact text={sw ? "Inapakia huduma…" : "Loading services…"}/>}
      {services?.filter(item => item.referralCapability && item._id !== parent?.referral.destinationServiceId).length === 0 && <><Text style={styles.body}>{sw ? "Hakuna huduma inayopatikana kwa kesi hii." : "No service is available for this case."}</Text><Button variant="secondary" label={sw ? "Omba msaada wa LSF" : "Ask LSF to help"} onPress={() => router.push("/paralegal-support")} /></>}
      <IntakeSelect sw={sw} label={sw ? "Huduma inayopokea" : "Receiving service"} value={service} onChange={value => { change(setService)(value); setProvider(""); }} options={(services ?? []).filter(item => item.referralCapability && item._id !== parent?.referral.destinationServiceId).map(item => ({ value: String(item._id), label: `${item.name} · ${item.district}` }))} />
      <IntakeSelect sw={sw} label={sw ? "Mtoa huduma anayepokea" : "Receiving provider"} value={provider} onChange={change(setProvider)} disabled={!service || providers === undefined} options={(providers ?? []).map(item => ({ value: item._id, label: item.name }))} />
      {!!service && providers?.length === 0 && <Text style={styles.body}>{sw ? "Huduma hii haina mtoa huduma aliyesajiliwa. Omba LSF ikusaidie kuchagua." : "This service has no linked provider. Ask LSF to help select a destination."}</Text>}
      </>}
      {step === 2 && <>
      <Text style={styles.label}>{sw ? "Kwa nini huduma hii inahitajika?" : "Why is this service needed?"}</Text><TextInput accessibilityLabel={sw ? "Sababu ya rufaa" : "Referral reason"} multiline value={reason} onChangeText={change(setReason)} maxLength={2000} style={styles.input} />
      <Text style={styles.label}>{sw ? "Taarifa gani tu zinahitajika?" : "Which information is needed?"}</Text><Text style={styles.body}>{sw ? "Weka taarifa chache zinazohitajika kwa msaada huu." : "Include only the information needed for this help."}</Text><TextInput accessibilityLabel={sw ? "Taarifa za kushirikishwa" : "Information to share"} multiline value={information} onChangeText={change(setInformation)} maxLength={160} style={styles.input} />
      </>}
      {review && <View style={styles.box}><Text style={styles.title}>{sw ? "Kagua pendekezo" : "Review your suggestion"}</Text><Text style={styles.body}>{services?.find(item => item._id === service)?.name} · {providers?.find(item => item._id === provider)?.name}</Text><Text style={styles.body}>{reason.trim()}</Text><Text style={styles.body}>{information.trim()}</Text><Text style={styles.body}>{sw ? "Hii inaomba uamuzi wa mnufaika. Taarifa hazitatumwa kwa mtoa huduma mpaka akubali." : "This asks for the beneficiary’s decision. Information goes to the provider only after they agree."}</Text></View>}
      {!!notice && <Text accessibilityRole="alert" style={styles.body}>{notice}</Text>}
      {step > 1 && <Button variant="quiet" disabled={busy} label={sw ? "Rudi na badilisha" : "Back and edit"} onPress={() => { setStep(step - 1); setReview(false); setNotice(""); }} />}
      <Button loading={busy} disabled={busy} label={busy ? (sw ? "Inatuma…" : "Sending…") : review ? (sw ? "Omba idhini ya mnufaika" : "Ask the person for permission") : step === 1 ? (sw ? "Endelea: eleza msaada" : "Next: explain the help") : (sw ? "Endelea: kagua ombi" : "Next: check the request")} onPress={() => void submit()} />
    </View>}
  </Screen>;
}
const styles = StyleSheet.create({ form: { gap: 16 }, box: { padding: 16, borderRadius: 16, backgroundColor: colors.tealSoft, gap: 12 }, title: { fontFamily: type.semibold, color: colors.ink, fontSize: 20 }, label: { fontFamily: type.medium, color: colors.ink, fontSize: 16 }, body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 16, lineHeight: 24 }, input: { borderWidth: 1, borderColor: colors.line, borderRadius: 12, minHeight: 110, padding: 16, fontFamily: type.regular, fontSize: 16, color: colors.ink, textAlignVertical: "top" } });
