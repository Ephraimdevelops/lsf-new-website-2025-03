import { plainError } from "../../../shared/plainLanguage";
import { BrandLoading } from './BrandLoading';
import { Component, useState, type ReactNode } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../backend/api";
import { useLanguage } from "../i18n";
import { Surface } from "./Surface";
import { Button } from "./Button";
import { CivicIllustration } from "./CivicIllustration";
import { colors, spacing, type } from "../theme";


function invitationError(error: unknown, sw: boolean) {
  const message = error instanceof Error ? error.message : "";
  const known: Array<[string, string, string]> = [
    ["Enter another team member's email address.", "Weka barua pepe sahihi ya mwenzako, tofauti na yako.", "Enter a valid colleague's email, different from yours."],
    ["An active invitation already exists.", "Mwaliko upo tayari. Angalia orodha ya mialiko.", "An invitation already exists. Check the invitation list."],
    ["Verify the invited email address on your account before responding.", "Thibitisha kwenye akaunti yako barua pepe iliyopokea mwaliko, kisha ujibu.", "Verify the invited email on your account, then respond."],
    ["Invitation is no longer available.", "Mwaliko huu haupatikani tena. Omba mwaliko mpya.", "This invitation is no longer available. Ask for a new one."],
    ["The inviting organisation or member is no longer eligible.", "Taasisi au aliyetuma mwaliko hana ruhusa inayohitajika sasa. Wasiliana na LSF.", "The organisation or inviter no longer has the required approval. Contact LSF."],
    ["Complete your existing access review before accepting another invitation.", "Subiri ombi lako la ruhusa likamilike kabla ya kukubali mwaliko mwingine.", "Wait for your current access review to finish before accepting another invitation."],
    ["Invitations require a verified organisation and active referral agreement.", "LSF lazima ithibitishe taasisi na makubaliano ya rufaa yawe yanatumika kabla ya mialiko.", "Invitations need a verified organisation and an active referral agreement."],
    ["Invitation not found.", "Mwaliko haujapatikana. Angalia orodha ya mialiko.", "Invitation not found. Check the invitation list."],
    ["Only a pending invitation can be cancelled.", "Unaweza kufuta mwaliko unaosubiri jibu tu. Angalia hali yake.", "Only invitations waiting for a reply can be cancelled. Check its status."],
  ];
  const match = known.find(([key]) => message.includes(key));
  return match?.[sw ? 1 : 2] ?? plainError(error, sw ? "sw" : "en", sw ? "Hatukuweza kuthibitisha hatua hii. Angalia hali ya mwaliko kabla ya kujaribu tena." : "We could not confirm this action. Check the invitation status before retrying.");
}

export function ProviderInviteInbox() {
  const sw = useLanguage().locale === "sw";
  return <InvitationBoundary sw={sw}><InvitationList /></InvitationBoundary>;
}

class InvitationBoundary extends Component<{ sw: boolean; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <View style={{ paddingVertical: 12, gap: 8 }}><Text accessibilityRole="alert" style={{ fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.inkMuted }}>{this.props.sw ? "Mialiko haipatikani kwa sasa. Unaweza kuendelea na ombi lako." : "Invitations are unavailable right now. You can still continue your application."}</Text><Pressable accessibilityRole="button" style={{ minHeight: 48, justifyContent: "center" }} onPress={() => this.setState({ failed: false })}><Text style={{ fontFamily: type.medium, color: colors.burgundy }}>{this.props.sw ? "Jaribu tena" : "Try again"}</Text></Pressable></View>;
  }
}

function InvitationList() {
  const sw = useLanguage().locale === "sw";
  const invitations = useQuery(api.providerInvitations.mine, {});
  const respond = useMutation(api.providerInvitations.respond);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function decide(id: Id<"provider_invitations">, accept: boolean) {
    setBusy(true); setMessage("");
    try { await respond({ id, accept }); setMessage(accept ? (sw ? "Umekubali. LSF itakagua kabla ya kutoa ruhusa." : "Accepted. LSF will review before granting access.") : (sw ? "Mwaliko umekataliwa." : "Invitation declined.")); }
    catch (error) { setMessage(invitationError(error, sw)); }
    finally { setBusy(false); }
  }
  const copy = { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.inkMuted };
  return <View style={{ paddingVertical: 12, gap: 12 }}><Text style={copy}>{sw ? "Kukubali hakutoi ruhusa ya kazi; LSF lazima iidhinishe." : "Acceptance requires LSF approval before work access."}</Text>
    {invitations === undefined ? <BrandLoading compact text={sw ? "Inapakia..." : "Loading..."}/> : invitations.length === 0 ? <Text style={copy}>{sw ? "Hakuna mwaliko unaosubiri jibu." : "No invitations waiting for a reply."}</Text> : invitations.map(item => <View key={item.id} style={{ gap: 10, paddingVertical: 12 }}><Text style={{ fontFamily: type.semibold, fontSize: 16, color: colors.ink }}>{item.organizationName}</Text><Text style={copy}>{sw ? "Mwisho" : "Expires"}: {new Date(item.expiresAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { timeZone: "Africa/Dar_es_Salaam" })}</Text><Button label={sw ? "Kubali kwa ukaguzi wa LSF" : "Accept for LSF review"} disabled={busy} onPress={() => void decide(item.id, true)} /><Button label={sw ? "Kataa" : "Decline"} variant="quiet" disabled={busy} onPress={() => void decide(item.id, false)} /></View>)}
    {!!message && <Text style={copy} accessibilityLiveRegion="polite">{message}</Text>}
  </View>;
}

export function ProviderInviteManager({ organizationId }: { organizationId: Id<"justice_service_organizations"> }) {
  const sw = useLanguage().locale === "sw";
  const invitations = useQuery(api.providerInvitations.listForOrganisation, { organizationId });
  const create = useMutation(api.providerInvitations.create);
  const cancel = useMutation(api.providerInvitations.cancel);
  const [email, setEmail] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const copy = { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.inkMuted };
  const statusLabels: Record<string, string> = sw ? { pending: "Inasubiri jibu", accepted: "Imekubaliwa", declined: "Imekataliwa", cancelled: "Imefutwa", expired: "Muda umepita" } : { pending: "Waiting for a reply", accepted: "Accepted", declined: "Declined", cancelled: "Cancelled", expired: "Expired" };
  async function invite() {
    setBusy(true); setMessage("");
    try { await create({ organizationId, email }); setEmail(""); setMessage(sw ? "Mwaliko umeundwa. Mwenzako aingie kwa barua pepe hii na afungue Jiunge. Ruhusa ya kazi inahitaji idhini ya LSF." : "Invitation created. Your colleague should sign in with this email and open Join. LSF approval is required."); }
    catch (error) { setMessage(invitationError(error, sw)); }
    finally { setBusy(false); }
  }
  async function withdraw(id: Id<"provider_invitations">) {
    setBusy(true);
    try { await cancel({ id }); setMessage(sw ? "Mwaliko umefutwa." : "Invitation cancelled."); }
    catch (error) { setMessage(invitationError(error, sw)); }
    finally { setBusy(false); }
  }
  return <Surface style={{ gap: 12 }}><View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}><View style={{ flex: 1, gap: 6 }}><Text style={{ fontFamily: type.semibold, color: colors.ink, fontSize: 19 }}>{sw ? "Alika mwenzako" : "Invite a colleague"}</Text><Text style={copy}>{sw ? "Mwenzako akikubali, LSF itakagua ombi la ruhusa. Mwaliko unaisha baada ya siku saba." : "After your colleague accepts, LSF reviews the access request. Invitations expire after seven days."}</Text></View><CivicIllustration pose="contact" size={64} /></View><Button variant="quiet" label={showForm ? (sw ? "Ficha fomu" : "Hide form") : (sw ? "Mwaliko mpya" : "New invitation")} onPress={() => setShowForm(value => !value)} />{showForm && <><TextInput accessibilityLabel={sw ? "Barua pepe ya mwenzako" : "Colleague's email"} placeholder={sw ? "Barua pepe" : "Email address"} autoCapitalize="none" keyboardType="email-address" maxLength={254} value={email} onChangeText={setEmail} style={{ fontFamily: type.regular, color: colors.ink, borderWidth: 1, borderColor: colors.line, padding: spacing.md, borderRadius: 12 }} /><Button label={sw ? "Unda mwaliko" : "Create invitation"} disabled={busy || !email.trim()} onPress={() => void invite()} /></>}
    {!!message && <Text style={copy} accessibilityLiveRegion="polite">{message}</Text>}
    {invitations === undefined ? <BrandLoading compact text={sw ? "Inapakia…" : "Loading…"}/> : invitations.length === 0 ? <Text style={copy}>{sw ? "Hakuna mialiko bado." : "No invitations yet."}</Text> : invitations.map(item => <Surface key={item._id} style={{ gap: 8 }}><Text style={{ ...copy, color: colors.ink, fontFamily: type.semibold }}>{item.email}</Text><Text style={copy}>{item.status === "pending" && item.expiresAt <= Date.now() ? (sw ? "Muda umepita" : "Expired") : statusLabels[item.status] ?? item.status}</Text>{item.status === "accepted" && <Text style={copy} accessibilityLiveRegion="polite">{item.accessReviewStatus === "pending" ? (sw ? "Inasubiri ukaguzi huru wa LSF; mwaliko haujatoa ruhusa ya kazi." : "Waiting for LSF approval. Work access has not been granted.") : item.accessReviewStatus === "rejected" ? (sw ? "LSF imekataa ombi la ruhusa." : "LSF declined the access request.") : item.accessReviewStatus === "approved" ? (item.hasActiveMembership ? (sw ? "LSF imeidhinisha; uanachama wa taasisi unatumika." : "LSF approved; organisation membership active.") : (sw ? "LSF iliidhinisha awali; uanachama wa taasisi hautumiki sasa." : "LSF approved previously; organisation membership is not currently active.")) : (sw ? "Hali ya ukaguzi haipatikani. Wasiliana na LSF kuhusu ruhusa." : "Review status unavailable. Contact LSF about access.")}</Text>}{item.status === "pending" && item.expiresAt > Date.now() && <Button label={sw ? "Futa mwaliko" : "Cancel invitation"} variant="secondary" disabled={busy} onPress={() => void withdraw(item._id)} />}</Surface>)}
  </Surface>;
}
