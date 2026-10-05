import { useState } from "react";
import { Text, TextInput } from "react-native";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../backend/api";
import { useLanguage } from "../i18n";
import { Surface } from "./Surface";
import { Button } from "./Button";
import { colors, spacing } from "../theme";

export function ProviderInviteInbox() {
  const sw = useLanguage().locale === "sw";
  const invitations = useQuery(api.providerInvitations.mine, {});
  const respond = useMutation(api.providerInvitations.respond);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function decide(id: Id<"provider_invitations">, accept: boolean) {
    setBusy(true); setMessage("");
    try { await respond({ id, accept }); setMessage(accept ? (sw ? "Umekubali. LSF itakagua kabla ya kutoa ruhusa." : "Accepted. LSF will review before granting access.") : (sw ? "Mwaliko umekataliwa." : "Invitation declined.")); }
    catch (error) { setMessage(error instanceof Error ? error.message : (sw ? "Jaribu tena." : "Try again.")); }
    finally { setBusy(false); }
  }
  return <Surface><Text style={{ fontWeight: "700", fontSize: 19 }}>{sw ? "Mialiko ya timu" : "Team invitations"}</Text><Text>{sw ? "Kukubali hakutoi ruhusa ya kazi; LSF lazima iidhinishe." : "Acceptance requires LSF approval before work access."}</Text>
    {invitations === undefined ? <Text>{sw ? "Inapakia…" : "Loading…"}</Text> : invitations.length === 0 ? <Text>{sw ? "Hakuna mwaliko hai." : "No active invitations."}</Text> : invitations.map(item => <Surface key={item.id}><Text style={{ fontWeight: "700" }}>{item.organizationName}</Text><Text>{sw ? "Mwisho" : "Expires"}: {new Date(item.expiresAt).toLocaleDateString()}</Text><Button label={sw ? "Kubali kwa ukaguzi wa LSF" : "Accept for LSF review"} disabled={busy} onPress={() => void decide(item.id, true)} /><Button label={sw ? "Kataa" : "Decline"} variant="secondary" disabled={busy} onPress={() => void decide(item.id, false)} /></Surface>)}
    {!!message && <Text accessibilityLiveRegion="polite">{message}</Text>}
  </Surface>;
}

export function ProviderInviteManager({ organizationId }: { organizationId: Id<"justice_service_organizations"> }) {
  const sw = useLanguage().locale === "sw";
  const invitations = useQuery(api.providerInvitations.listForOrganisation, { organizationId });
  const create = useMutation(api.providerInvitations.create);
  const cancel = useMutation(api.providerInvitations.cancel);
  const [email, setEmail] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function invite() {
    setBusy(true); setMessage("");
    try { await create({ organizationId, email }); setEmail(""); setMessage(sw ? "Mwaliko umeundwa. Mwenzako aingie kwa barua pepe hii na afungue Jiunge. LSF lazima iidhinishe." : "Invitation created. Your colleague should sign in with this email and open Join. LSF approval is required."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Try again."); }
    finally { setBusy(false); }
  }
  async function withdraw(id: Id<"provider_invitations">) {
    setBusy(true);
    try { await cancel({ id }); setMessage(sw ? "Mwaliko umefutwa." : "Invitation cancelled."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Try again."); }
    finally { setBusy(false); }
  }
  return <Surface><Text style={{ fontWeight: "700", fontSize: 19 }}>{sw ? "Alika mfanyakazi" : "Invite a colleague"}</Text><Text>{sw ? "Mwaliko wa ndani ya programu unaisha baada ya siku saba. Kukubali kunatuma ombi kwa LSF." : "In-app invitations expire after seven days. Acceptance sends an access request to LSF."}</Text><TextInput accessibilityLabel={sw ? "Barua pepe ya mwenzako" : "Colleague's email"} placeholder={sw ? "Barua pepe" : "Email address"} autoCapitalize="none" keyboardType="email-address" maxLength={254} value={email} onChangeText={setEmail} style={{ borderWidth: 1, borderColor: colors.line, padding: spacing.md, borderRadius: 12 }} /><Button label={sw ? "Unda mwaliko" : "Create invitation"} disabled={busy || !email.trim()} onPress={() => void invite()} />
    {!!message && <Text accessibilityLiveRegion="polite">{message}</Text>}
    {invitations === undefined ? <Text>{sw ? "Inapakia…" : "Loading…"}</Text> : invitations.map(item => <Surface key={item._id}><Text>{item.email}</Text><Text>{item.status === "pending" && item.expiresAt <= Date.now() ? (sw ? "Muda umepita" : "Expired") : item.status}</Text>{item.status === "pending" && item.expiresAt > Date.now() && <Button label={sw ? "Futa mwaliko" : "Cancel invitation"} variant="secondary" disabled={busy} onPress={() => void withdraw(item._id)} />}</Surface>)}
  </Surface>;
}
