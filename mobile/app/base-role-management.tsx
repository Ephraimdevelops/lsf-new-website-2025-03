import { plainError } from "../../shared/plainLanguage";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { AdminIntro as CivicPageIntro } from "../src/admin/AdminIntro";
import { AdminScreen as Screen } from "../src/admin/AdminScreen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

export default function BaseRoleManagementScreen() {
  useSensitiveScreenProtection("base-role-management");
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const admin = access?.roles.includes("admin") ?? false;
  const [search, setSearch] = useState("");
  const searching = search.trim().length >= 2;
  const peoplePage = usePaginatedQuery(api.admin.listUsersWithAccessPage, admin && !searching ? {} : "skip", { initialNumItems: 40 });
  const searchedPeople = useQuery(api.admin.searchUsersWithAccess, admin && searching ? { search: search.trim() } : "skip");
  const people = searching ? searchedPeople : peoplePage.status === "LoadingFirstPage" ? undefined : peoplePage.results;
  const requestPage = usePaginatedQuery(api.admin.listBaseRoleChangesPage, admin ? {} : "skip", { initialNumItems: 20 });
  const requests = requestPage.status === "LoadingFirstPage" ? undefined : requestPage.results;
  const requestChange = useMutation(api.admin.requestBaseRoleChange);
  const reviewChange = useMutation(api.admin.reviewBaseRoleChange);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null); const [reason, setReason] = useState(""); const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const pending = requests?.filter((request) => request.status === "pending") ?? [];
  const candidates = search.trim().length === 1 ? [] : people?.filter((person) => !person.isDeleted && person.role !== "user" && person._id !== access?.user?._id) ?? [];

  async function submit(targetUserId: Id<"users">) {
    if (busy) return; setBusy(true); setError("");
    try { await requestChange({ targetUserId, reason: reason.trim() }); setReason(""); setSelectedPerson(null); setNotice(sw ? "Ombi limepelekwa kwa msimamizi mwingine." : "Request sent for independent admin review."); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }
  async function decide(id: Id<"base_role_change_requests">, decision: "approved" | "rejected") {
    if (busy) return; setBusy(true); setError("");
    try { await reviewChange({ id, decision, note: note.trim() }); setNote(""); setSelectedRequest(null); setNotice(sw ? "Uamuzi umehifadhiwa." : "Decision recorded."); }
    catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Kagua ruhusa za akaunti" : "Base role review"} eyebrow="LSF · TWO-PERSON ACCESS REVIEW" />
    {access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} /> : !admin ? <State text={sw ? "Ruhusa ya msimamizi inahitajika." : "Administrator access required."} /> : <>
      <CivicPageIntro icon="shield-checkmark-outline" eyebrow="LSF · INDEPENDENT REVIEW" title={sw ? "Kagua kabla ya kuondoa jukumu." : "Review before removing a role."} description={sw ? "Idhini huondoa ruhusa za jukumu hili. Akaunti na historia hubaki." : "Approval removes this role's access. The account and its history remain."} />
      {error ? <Surface tone="orange"><Text accessibilityRole="alert" style={styles.error}>{error}</Text></Surface> : null}
      {notice ? <Surface tone="teal"><Text style={styles.body}>{notice}</Text></Surface> : null}
      <SectionHeading title={sw ? `Yanayosubiri ukaguzi (${requests === undefined ? "…" : pending.length})` : `Awaiting review (${requests === undefined ? "…" : pending.length})`} />
      {requests === undefined ? <State text={sw ? "Inapakia maombi..." : "Loading requests..."} /> : pending.length === 0 ? <State text={sw ? "Hakuna ombi linalosubiri." : "No base-role request is waiting."} /> : pending.map((request) => <Surface key={request._id} tone="orange"><Text style={styles.title}>{request.targetName}</Text><Text style={styles.body}>{request.previousRole.replaceAll("_", " ")} → {sw ? "mnufaika" : "beneficiary"}</Text><Text style={styles.body}>{request.reason}</Text><Text style={styles.meta}>{sw ? "Jukumu la sasa" : "Current role"}: {request.currentRole}</Text>{request.requestedBy === access?.user?._id ? <Text style={styles.meta}>{sw ? "Msimamizi mwingine lazima aamue ombi lako." : "Another administrator must decide your request."}</Text> : request.targetUserId === access?.user?._id ? null : <><Button label={selectedRequest === request._id ? (sw ? "Ficha ukaguzi" : "Hide review") : (sw ? "Kagua na uamue" : "Review and decide")} variant="secondary" onPress={() => { setSelectedRequest(selectedRequest === request._id ? null : request._id); setNote(""); }} />{selectedRequest === request._id ? <><TextInput value={note} onChangeText={setNote} multiline maxLength={2000} style={styles.input} placeholder={sw ? "Sababu ya uamuzi (herufi 10 au zaidi)" : "Review reason (at least 10 characters)"} placeholderTextColor={colors.inkMuted} /><Button label={sw ? "Idhinisha mabadiliko" : "Approve role change"} disabled={busy || note.trim().length < 10} onPress={() => Alert.alert(sw ? "Badilisha jukumu?" : "Change base role?", sw ? "Ruhusa za jukumu hili zitaondolewa mara moja. Hakikisha mwombaji na mlengwa ni watu tofauti nawe." : "This role's access will be removed immediately. Check the requester and target are different from you.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Idhinisha" : "Approve", onPress: () => void decide(request._id, "approved") }])} /><Button label={sw ? "Kataa ombi" : "Reject request"} variant="secondary" disabled={busy || note.trim().length < 10} onPress={() => void decide(request._id, "rejected")} /></> : null}</>}</Surface>)}
      {requestPage.status === "CanLoadMore" ? <Button label={sw ? "Pakia maombi zaidi" : "Load more requests"} variant="secondary" onPress={() => requestPage.loadMore(20)} /> : requestPage.status === "LoadingMore" ? <State text={sw ? "Inapakia zaidi..." : "Loading more..."} /> : null}
      <SectionHeading title={sw ? "Wasilisha mabadiliko" : "Request a base-role change"} />
      <TextInput value={search} onChangeText={setSearch} style={styles.search} placeholder={sw ? "Tafuta jina au barua pepe" : "Search name or email"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Tafuta akaunti" : "Search accounts"} />
      {people === undefined ? <State text={sw ? "Inapakia watu..." : "Loading people..."} /> : search.trim().length === 1 ? <State text={sw ? "Andika angalau herufi mbili kutafuta." : "Enter at least two characters to search."} /> : candidates.length === 0 ? <State text={sw ? "Hakuna akaunti inayolingana." : "No eligible account matches."} /> : candidates.map((person) => <Surface key={person._id}><Text style={styles.title}>{person.name || person.email}</Text><Text style={styles.meta}>{person.email} · {person.role.replaceAll("_", " ")}</Text><Text style={styles.body}>{sw ? "Majukumu mengine yaliyoidhinishwa yataendelea; jukumu hili la msingi pekee litabadilishwa." : "Other approved roles remain; this base role alone will change."}</Text>{person.pendingBaseRoleChange ? <Text style={styles.body}>{sw ? "Ombi la jukumu hili linasubiri ukaguzi huru." : "A request for this base role is awaiting independent review."}</Text> : <><Button label={selectedPerson === person._id ? (sw ? "Ficha" : "Hide") : (sw ? "Omba ukaguzi wa jukumu" : "Request role review")} variant="secondary" onPress={() => { setSelectedPerson(selectedPerson === person._id ? null : person._id); setReason(""); }} />{selectedPerson === person._id ? <><TextInput value={reason} onChangeText={setReason} multiline maxLength={2000} style={styles.input} placeholder={sw ? "Sababu na ushahidi (herufi 10 au zaidi)" : "Reason and evidence (at least 10 characters)"} placeholderTextColor={colors.inkMuted} /><Button label={sw ? "Tuma kwa ukaguzi huru" : "Send for independent review"} disabled={busy || reason.trim().length < 10} onPress={() => void submit(person._id)} /></> : null}</>}</Surface>)}
      {!searching && peoplePage.status === "CanLoadMore" ? <Button label={sw ? "Pakia akaunti zaidi" : "Load more accounts"} variant="secondary" onPress={() => peoplePage.loadMore(40)} /> : null}
      <Surface tone="pink"><Text style={styles.title}>{sw ? "Ulinzi wa msimamizi wa mwisho" : "Last-administrator protection"}</Text><Text style={styles.body}>{sw ? "Mfumo utakataa mabadiliko yakiondoa msimamizi pekee aliyebaki. Mabadiliko yanaingia kwenye kumbukumbu ya ukaguzi." : "The system rejects a change that would remove the last active administrator. Every decision enters the audit trail."}</Text></Surface>
      <Button label={sw ? "Rudi kwenye ruhusa" : "Back to access"} variant="quiet" onPress={() => router.back()} />
    </>}
  </Screen>;
}
function State({ text }: { text: string }) { return <Surface><Text style={styles.body}>{text}</Text></Surface>; }
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 30, lineHeight: 38 }, heroBody: { color: colors.peach, fontFamily: type.regular, fontSize: 16, lineHeight: 24 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 18 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 16, lineHeight: 24, marginTop: spacing.sm }, meta: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 14, lineHeight: 20, marginTop: spacing.sm }, input: { minHeight: 100, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, color: colors.ink, fontSize: 16, padding: spacing.md, textAlignVertical: "top" }, search: { minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, color: colors.ink, fontSize: 16, paddingHorizontal: spacing.md, marginBottom: spacing.md }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 16 } });
