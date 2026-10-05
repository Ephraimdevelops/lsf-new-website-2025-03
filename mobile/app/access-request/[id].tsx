import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useSensitiveScreenProtection } from "../../src/useSensitiveScreenProtection";

export default function AccessRequestScreen() {
  useSensitiveScreenProtection("access-request-review");
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const isAdmin = access?.roles.includes("admin") ?? false;
  const request = useQuery(api.accessRequests.adminRequestForReview, isAdmin && id ? { id: id as Id<"access_requests"> } : "skip");
  const organizationPage = usePaginatedQuery(api.justiceServices.staffOrganizationsPage, isAdmin ? { status: "verified" } : "skip", { initialNumItems: 20 });
  const [organizationSearch, setOrganizationSearch] = useState("");
  const searchingOrganizations = organizationSearch.trim().length >= 2;
  const searchedOrganizations = useQuery(api.justiceServices.staffSearchOrganizations, isAdmin && searchingOrganizations ? { search: organizationSearch.trim() } : "skip");
  const organizations = searchingOrganizations ? searchedOrganizations : organizationSearch.trim().length === 1 ? [] : organizationPage.status === "LoadingFirstPage" ? undefined : organizationPage.results;
  const decide = useMutation(api.accessRequests.decide);
  const [organizationId, setOrganizationId] = useState<Id<"justice_service_organizations"> | null>(null);
  const [note, setNote] = useState("");
  const [choice, setChoice] = useState<"approved" | "rejected" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState<"approved" | "rejected" | null>(null);
  const selfReview = request?.userId === access?.user._id || Boolean(request?.invitationEvidence && request.invitationEvidence.invitedBy === access?.user._id);
  const eligibleOrgs = organizations?.filter((org) => org.verificationStatus === "verified" && (!request?.invitationId || org._id === request.organizationId) && (!request || request.requestedRole !== "staff" || org.organizationType === "lsf") && (!request || request.requestedRole !== "provider_staff" || org.referralAgreementStatus === "active")) ?? [];

  async function saveDecision() {
    if (!request || !choice || busy || selfReview || note.trim().length < 10 || (choice === "approved" && (!organizationId || (request.invitationId && !request.invitationEvidence?.inviterStillMember)))) return;
    setBusy(true); setError("");
    try {
      await decide({ requestId: request._id, decision: choice, decisionNote: note.trim(), organizationId: choice === "approved" ? organizationId! : undefined });
      setCompleted(choice);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : sw ? "Uamuzi haujahifadhiwa. Jaribu tena." : "Decision was not saved. Please try again.");
    } finally { setBusy(false); }
  }

  function confirmDecision() {
    if (!request || !choice || busy || selfReview || note.trim().length < 10 || (choice === "approved" && !organizationId)) return;
    const applicant = request.applicant?.name || request.applicant?.email || (sw ? "mwombaji" : "applicant");
    const organization = eligibleOrgs.find((org) => org._id === organizationId)?.name;
    Alert.alert(
      choice === "approved" ? (sw ? "Idhinisha ufikiaji?" : "Grant access?") : (sw ? "Kataa ombi?" : "Reject request?"),
      choice === "approved"
        ? (sw ? `${applicant} atapewa jukumu la ${request.requestedRole.replaceAll("_", " ")} katika ${organization ?? "taasisi iliyochaguliwa"}.` : `${applicant} will receive the ${request.requestedRole.replaceAll("_", " ")} role at ${organization ?? "the selected organisation"}.`)
        : (sw ? `Ombi la ${applicant} litafungwa bila kutoa ruhusa.` : `${applicant}'s request will close without granting access.`),
      [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Thibitisha" : "Confirm", onPress: () => void saveDecision() }],
    );
  }

  return <Screen>
    <AppHeader back title={sw ? "Kagua ufikiaji" : "Review access"} eyebrow="LSF · GOVERNANCE" />
    {!isSignedIn ? <State icon="lock-closed-outline" title={sw ? "Maombi ni ya siri" : "Applications are private"} body={sw ? "Ingia kwa akaunti ya msimamizi." : "Sign in with an administrator account."} action={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
      : access === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia ruhusa" : "Loading access"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !isAdmin ? <State icon="shield-outline" title={sw ? "Idhini ya msimamizi inahitajika" : "Administrator approval required"} body={sw ? "Ni msimamizi wa jukwaa pekee anayeweza kufanya uamuzi wa ufikiaji." : "Only a platform administrator can decide access requests."} />
      : completed ? <View style={styles.done}><Ionicons name="checkmark-circle" size={57} color={colors.success} /><Text style={styles.heroTitleDone}>{completed === "approved" ? (sw ? "Ufikiaji umeidhinishwa" : "Access approved") : (sw ? "Ombi limekataliwa" : "Request rejected")}</Text><Text style={styles.body}>{sw ? "Uamuzi umehifadhiwa kwenye kumbukumbu ya ukaguzi." : "The decision is saved in the audit trail."}</Text><Button label={sw ? "Rudi kwenye utawala" : "Back to governance"} onPress={() => router.replace("/governance")} /></View>
      : request === undefined || organizations === undefined ? <State icon="hourglass-outline" title={sw ? "Tunapakia ombi" : "Loading request"} body={sw ? "Subiri kidogo." : "Please wait a moment."} />
      : !request || request.status !== "pending" ? <State icon="search-outline" title={sw ? "Ombi halisubiri tena" : "Request is no longer pending"} body={sw ? "Huenda uamuzi umefanywa. Rudi kwenye foleni." : "A decision may already have been made. Return to the queue."} action={sw ? "Rudi kwenye utawala" : "Back to governance"} onPress={() => router.replace("/governance")} />
      : <>
        <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="person-add-outline" size={31} color={colors.surface} /></View><Text style={styles.heroKicker}>{sw ? "OMBI LA UFIKIAJI" : "ACCESS APPLICATION"}</Text><Text style={styles.heroTitle}>{request.applicant?.name ?? (sw ? "Mwombaji" : "Applicant")}</Text><Text style={styles.heroBody}>{sw ? "Kagua jukumu, taasisi na sababu kabla ya kutoa ruhusa." : "Review the role, organisation and reason before granting access."}</Text></View>
        <View style={styles.card}><Info label={sw ? "Jukumu analoomba" : "Requested role"} value={request.requestedRole.replaceAll("_", " ")} /><Info label={sw ? "Taasisi aliyotaja" : "Organisation stated"} value={request.organizationName} />{request.applicant?.email ? <Info label={sw ? "Barua pepe" : "Email"} value={request.applicant.email} /> : null}<Info label={sw ? "Sababu ya kuomba" : "Reason for applying"} value={request.statement} /><Info label={sw ? "Aliomba tarehe" : "Submitted"} value={new Date(request.submittedAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "long" })} /></View>
        {request.invitationEvidence && <View style={styles.card}><Info label={sw ? "Aliyealika" : "Invited by"} value={request.invitationEvidence.inviterName} /><Info label={sw ? "Hali ya uanachama wa aliyealika" : "Inviter membership"} value={request.invitationEvidence.inviterStillMember ? (sw ? "Bado hai" : "Currently active") : (sw ? "Hauko hai; idhini imezuiwa" : "No longer active; approval blocked")} /></View>}
        {selfReview ? <View style={styles.warning}><Ionicons name="shield-outline" size={22} color={colors.burgundy} /><Text style={styles.body}>{sw ? "Huwezi kuidhinisha ombi lako mwenyewe. Msimamizi mwingine lazima alikague." : "You cannot decide your own application. Another administrator must review it."}</Text></View> : <>
          <Text style={styles.sectionTitle}>{sw ? "Taasisi iliyothibitishwa" : "Verified organisation"}</Text><Text style={styles.body}>{sw ? "Idhini itaunganisha jukumu hili na taasisi uliyothibitisha, si jina aliloandika mwombaji pekee." : "Approval links this role to a verified organisation, not just the name typed by the applicant."}</Text>
          <TextInput value={organizationSearch} onChangeText={(value) => { setOrganizationSearch(value); setOrganizationId(null); }} style={styles.searchInput} placeholder={sw ? "Tafuta taasisi kwa jina" : "Search organisation by name"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Tafuta taasisi" : "Search organisations"} />
          <View style={styles.options}>{organizationSearch.trim().length === 1 ? <Text style={styles.body}>{sw ? "Andika angalau herufi mbili kutafuta taasisi zote." : "Enter at least two characters to search all organisations."}</Text> : eligibleOrgs.length ? eligibleOrgs.map((org) => <Pressable key={org._id} accessibilityRole="radio" accessibilityState={{ checked: organizationId === org._id }} aria-checked={organizationId === org._id} onPress={() => setOrganizationId(org._id)} style={[styles.option, organizationId === org._id && styles.optionActive]}><Ionicons name="business-outline" size={22} color={colors.burgundy} /><View style={styles.flex}><Text style={styles.optionTitle}>{org.name}</Text><Text style={styles.optionMeta}>{org.organizationType.replaceAll("_", " ")}</Text></View><Ionicons name={organizationId === org._id ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /></Pressable>) : <Text style={styles.body}>{sw ? "Hakuna taasisi inayostahili katika matokeo haya. Tafuta kwa jina au pakia ukurasa mwingine; usiidhinishe kabla ya uthibitishaji." : "No eligible organisation in these results. Search by name or load another page; do not approve before verification."}</Text>}</View>
          {!organizationSearch.trim() && organizationPage.status === "CanLoadMore" ? <Button label={sw ? "Pakia taasisi nyingine zilizothibitishwa" : "Load more verified organisations"} variant="secondary" onPress={() => organizationPage.loadMore(20)} /> : null}
          {searchingOrganizations && (searchedOrganizations?.length ?? 0) >= 100 ? <Text style={styles.body}>{sw ? "Matokeo 100 yameonyeshwa. Boresha utafutaji kuona mengine." : "Showing 100 matches. Refine the search for more."}</Text> : null}
          <Text style={styles.sectionTitle}>{sw ? "Sababu ya uamuzi" : "Decision reason"}</Text><TextInput value={note} onChangeText={setNote} multiline maxLength={2000} placeholder={sw ? "Andika sababu inayoweza kukaguliwa (angalau herufi 10)..." : "Record an auditable reason (at least 10 characters)..."} placeholderTextColor={colors.inkMuted} style={styles.input} />
          <View style={styles.choices}><Pressable accessibilityRole="radio" accessibilityState={{ checked: choice === "approved" }} aria-checked={choice === "approved"} onPress={() => setChoice("approved")} style={[styles.choice, choice === "approved" && styles.choiceActive]}><Ionicons name="checkmark-circle-outline" size={22} color={colors.success} /><Text style={styles.choiceText}>{sw ? "Idhinisha" : "Approve"}</Text></Pressable><Pressable accessibilityRole="radio" accessibilityState={{ checked: choice === "rejected" }} aria-checked={choice === "rejected"} onPress={() => setChoice("rejected")} style={[styles.choice, choice === "rejected" && styles.choiceActive]}><Ionicons name="close-circle-outline" size={22} color={colors.danger} /><Text style={styles.choiceText}>{sw ? "Kataa" : "Reject"}</Text></Pressable></View>
          {choice ? <View style={styles.confirm}><Text style={styles.confirmTitle}>{choice === "approved" ? (sw ? "Thibitisha ufikiaji" : "Confirm access grant") : (sw ? "Thibitisha kukataa" : "Confirm rejection")}</Text><Text style={styles.body}>{choice === "approved" ? (sw ? "Jukumu litaanza kutumika baada ya uamuzi huu." : "The role becomes active after this decision.") : (sw ? "Ombi litafungwa bila kutoa ruhusa." : "The request will close without granting access.")}</Text>{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<Button label={choice === "approved" ? (sw ? "Idhinisha ufikiaji" : "Grant access") : (sw ? "Kataa ombi" : "Reject request")} disabled={busy || note.trim().length < 10 || (choice === "approved" && !organizationId)} loading={busy} onPress={confirmDecision} /></View> : null}
        </>}
        <Button label={sw ? "Rudi kwenye foleni" : "Back to queue"} variant="quiet" onPress={() => router.push("/governance")} />
      </>}
  </Screen>;
}

function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>; }
function State({ icon, title, body, action, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onPress?: () => void }) { return <View style={styles.state}><Ionicons name={icon} size={36} color={colors.burgundy} /><Text style={styles.heroTitleDone}>{title}</Text><Text style={styles.body}>{body}</Text>{action && onPress ? <Button label={action} onPress={onPress} /> : null}</View>; }

const styles = StyleSheet.create({
  hero: { marginTop: spacing.md, padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.burgundy, gap: spacing.sm }, heroIcon: { width: 57, height: 57, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }, heroKicker: { marginTop: spacing.md, fontFamily: type.bold, color: colors.peach, fontSize: 12 }, heroTitle: { fontFamily: type.bold, color: colors.surface, fontSize: 25 }, heroBody: { fontFamily: type.regular, color: colors.surface, fontSize: 14, lineHeight: 21 }, heroTitleDone: { fontFamily: type.bold, color: colors.ink, fontSize: 21, textAlign: "center" },
  card: { marginTop: spacing.xl, paddingHorizontal: spacing.lg, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg }, info: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line }, label: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 }, value: { marginTop: spacing.xs, fontFamily: type.bold, color: colors.ink, fontSize: 15, lineHeight: 21 }, sectionTitle: { marginTop: spacing.xl, fontFamily: type.bold, color: colors.ink, fontSize: 19 }, body: { marginVertical: spacing.sm, fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 }, warning: { marginTop: spacing.xl, flexDirection: "row", gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.burgundySoft },
  options: { marginTop: spacing.md, gap: spacing.sm }, searchInput: { minHeight: 52, marginTop: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: spacing.md, backgroundColor: colors.surface, color: colors.ink, fontFamily: type.regular, fontSize: 16 }, option: { minHeight: 65, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }, optionActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, flex: { flex: 1 }, optionTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 14 }, optionMeta: { marginTop: spacing.xs, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12 }, input: { minHeight: 105, marginTop: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, fontFamily: type.regular, color: colors.ink, textAlignVertical: "top" }, choices: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }, choice: { flex: 1, minHeight: 55, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }, choiceActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, choiceText: { fontFamily: type.bold, color: colors.ink, fontSize: 14 }, confirm: { marginTop: spacing.xl, marginBottom: spacing.lg, backgroundColor: colors.burgundySoft, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm }, confirmTitle: { fontFamily: type.bold, color: colors.burgundy, fontSize: 18 }, error: { fontFamily: type.medium, color: colors.danger }, done: { marginTop: spacing.xl, backgroundColor: colors.greenSoft, borderRadius: radius.lg, padding: spacing.xl, alignItems: "center", gap: spacing.md }, state: { marginTop: spacing.xl, backgroundColor: colors.burgundySoft, borderRadius: radius.lg, padding: spacing.xl, alignItems: "center", gap: spacing.md },
});
