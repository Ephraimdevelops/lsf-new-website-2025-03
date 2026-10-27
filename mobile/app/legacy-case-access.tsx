import { LoadingText } from '../src/components/BrandLoading';
import { BrandLoading } from '../src/components/BrandLoading';
import { plainError } from "../../shared/plainLanguage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { AdminIntro as CivicPageIntro } from "../src/admin/AdminIntro";
import { AdminScreen as Screen } from "../src/admin/AdminScreen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

type Role = "paralegal" | "provider_staff";
type Decision = { kind: "organisation"; organizationId: Id<"justice_service_organizations">; role: Role } | { kind: "independent" };

export default function LegacyCaseAccessScreen() {
  useSensitiveScreenProtection("legacy-case-access");
  const { locale } = useLanguage(); const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const admin = access?.roles.includes("admin") ?? false;
  const [role, setRole] = useState<Role>("paralegal");
  const page = usePaginatedQuery(api.caseManagement.legacyCaseScopeQueuePage, admin ? { role } : "skip", { initialNumItems: 20 });
  const rows = page.status === "LoadingFirstPage" ? undefined : page.results;
  const review = useMutation(api.caseManagement.reviewLegacyCaseScope);
  const [selected, setSelected] = useState<Id<"case_participants"> | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");

  async function save(participantId: Id<"case_participants">) {
    if (!decision || busy || reason.trim().length < 15) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await review({ participantId, decision: decision.kind, organizationId: decision.kind === "organisation" ? decision.organizationId : undefined, professionalRole: decision.kind === "organisation" ? decision.role : undefined, reason: reason.trim() });
      setSelected(null); setDecision(null); setReason("");
      setNotice(sw ? "Uhusiano wa kesi umehakikiwa na kuhifadhiwa kwenye kumbukumbu." : "Case affiliation reviewed and recorded in the audit trail.");
    } catch (caught) { setError(plainError(caught, locale)); }
    finally { setBusy(false); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Uhusiano wa kesi" : "Case affiliation review"} eyebrow="LSF · RESTRICTED" />
    {access === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia ruhusa..." : "Loading access..."}/></Surface> : !admin ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Msimamizi wa LSF anahitajika." : "LSF administrator access is required."}</Text></Surface> : <>
      <CivicPageIntro icon="shield-checkmark-outline" eyebrow="LSF · ACCESS REVIEW" title={sw ? "Unganisha kesi ya zamani na uhusiano sahihi." : "Resolve older case affiliations."} description={sw ? "Rekodi hizi za zamani hazionyeshi taasisi ya mtoa msaada. Kagua ushahidi kabla ya kurejesha ufikiaji wa kesi." : "Older case records do not identify the worker's organisation. Review evidence before restoring case access."} tone="orange" />
      <Surface tone="orange"><Text style={styles.body}>{sw ? "Ufikiaji wa kazi za kesi hizi unazuiliwa hadi uhakiki ukamilike. Usibuni uhusiano wa taasisi; chagua uhusiano hai uliothibitishwa au, kwa msaidizi wa kisheria asiye na taasisi, rekodi uamuzi wa kujitegemea." : "Case work access is paused until review. Do not infer an organisation: choose an active verified affiliation or, for a paralegal without one, record an independent decision."}</Text></Surface>
      {error ? <Surface tone="orange"><Text accessibilityRole="alert" style={styles.error}>{error}</Text></Surface> : null}
      {notice ? <Surface tone="teal"><Text accessibilityRole="alert" style={styles.body}>{notice}</Text></Surface> : null}
      <View style={styles.tabs}><Tab label={sw ? "Msaidizi wa kisheria" : "Paralegals"} active={role === "paralegal"} onPress={() => { setRole("paralegal"); setSelected(null); setDecision(null); }} /><Tab label={sw ? "Watoa huduma" : "Provider staff"} active={role === "provider_staff"} onPress={() => { setRole("provider_staff"); setSelected(null); setDecision(null); }} /></View>
      <LoadingText style={styles.count}>{rows === undefined ? (sw ? "Inapakia..." : "Loading...") : `${rows.length}${page.status === "CanLoadMore" ? "+" : ""} ${sw ? "rekodi zinazoonyeshwa" : "records shown"}`}</LoadingText>
      {rows === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia orodha..." : "Loading queue..."}/></Surface> : rows.length === 0 ? <Surface tone="teal"><Text style={styles.title}>{sw ? "Hakuna kesi ya zamani inayosubiri kwenye kundi hili." : "No older cases await review in this group."}</Text></Surface> : rows.map((row) => {
        const active = selected === row.participant._id;
        const ownDecision = row.participant.addedBy === access?.user?._id || row.participant.userId === access?.user?._id;
        return <Surface key={row.participant._id} tone={active ? "pink" : undefined}>
          <View style={styles.heading}><View style={styles.icon}><Ionicons name="person-outline" size={22} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{row.workerName}</Text><Text style={styles.body}>{row.casePublicId} · {row.caseStatus.replaceAll("_", " ")}</Text><Text style={styles.body}>{row.participant.role.replaceAll("_", " ")} · {new Date(row.participant.addedAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ")}</Text></View></View>
          {ownDecision ? <Text style={styles.body}>{sw ? "Msimamizi mwingine lazima akague uhusiano huu." : "A different administrator must review this affiliation."}</Text> : <Button label={active ? (sw ? "Ficha ukaguzi" : "Hide review") : (sw ? "Kagua uhusiano" : "Review affiliation")} variant="secondary" onPress={() => { setSelected(active ? null : row.participant._id); setDecision(null); setReason(""); setError(""); }} />}
          {active && !ownDecision ? <><Text style={styles.title}>{sw ? "Uhusiano uliothibitishwa" : "Verified affiliation"}</Text>{row.affiliations.length ? row.affiliations.map((affiliation) => <Pressable key={affiliation.organizationId} accessibilityRole="radio" accessibilityState={{ checked: decision?.kind === "organisation" && decision.organizationId === affiliation.organizationId }} aria-checked={decision?.kind === "organisation" && decision.organizationId === affiliation.organizationId} onPress={() => setDecision({ kind: "organisation", organizationId: affiliation.organizationId, role: affiliation.role })} style={[styles.option, decision?.kind === "organisation" && decision.organizationId === affiliation.organizationId && styles.optionSelected]}><Ionicons name={decision?.kind === "organisation" && decision.organizationId === affiliation.organizationId ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={styles.optionText}>{affiliation.organizationName} · {affiliation.role.replaceAll("_", " ")}</Text></Pressable>) : <Text style={styles.body}>{sw ? "Hakuna uhusiano hai wa taasisi iliyothibitishwa." : "No active verified organisation affiliation is available."}</Text>}
            {row.canMarkIndependent ? <Pressable accessibilityRole="radio" accessibilityState={{ checked: decision?.kind === "independent" }} aria-checked={decision?.kind === "independent"} onPress={() => setDecision({ kind: "independent" })} style={[styles.option, decision?.kind === "independent" && styles.optionSelected]}><Ionicons name={decision?.kind === "independent" ? "radio-button-on" : "radio-button-off"} size={20} color={colors.burgundy} /><Text style={styles.optionText}>{sw ? "Msaidizi wa kisheria wa kujitegemea" : "Independent paralegal"}</Text></Pressable> : null}
            <Text style={styles.title}>{sw ? "Sababu na ushahidi wa uamuzi" : "Reason and evidence for the decision"}</Text><TextInput value={reason} onChangeText={setReason} multiline maxLength={1000} style={styles.input} placeholder={sw ? "Eleza uhusiano uliokaguliwa na ushahidi wake" : "Explain the checked affiliation and its evidence"} placeholderTextColor={colors.inkMuted} accessibilityLabel={sw ? "Sababu ya uhakiki" : "Review reason"} /><Button label={sw ? "Hifadhi uamuzi wa uhusiano" : "Record affiliation decision"} disabled={busy || !decision || reason.trim().length < 15} loading={busy} onPress={() => Alert.alert(sw ? "Thibitisha uhusiano?" : "Confirm affiliation?", sw ? "Uamuzi huu utarejesha ufikiaji wa kesi kulingana na jukumu na hali ya taasisi." : "This decision restores case access according to the worker's role and organisation status.", [{ text: sw ? "Ghairi" : "Cancel", style: "cancel" }, { text: sw ? "Hifadhi" : "Record", onPress: () => void save(row.participant._id) }])} /></> : null}
        </Surface>;
      })}
      {page.status === "CanLoadMore" ? <Button label={sw ? "Pakia rekodi zaidi" : "Load more records"} variant="secondary" onPress={() => page.loadMore(20)} /> : page.status === "LoadingMore" ? <Surface><BrandLoading compact text={sw ? "Inapakia zaidi..." : "Loading more..."}/></Surface> : null}
    </>}
  </Screen>;
}

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) { return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.tab, active && styles.tabActive]}><Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text></Pressable>; }
const styles = StyleSheet.create({ title: { color: colors.ink, fontFamily: type.bold, fontSize: 17 }, body: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, error: { color: colors.danger, fontFamily: type.medium, fontSize: 14 }, count: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 13, marginTop: spacing.md }, tabs: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }, tab: { flex: 1, minHeight: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, justifyContent: "center", alignItems: "center", paddingHorizontal: spacing.sm }, tabActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, tabText: { color: colors.ink, fontFamily: type.medium, fontSize: 14 }, tabTextActive: { color: colors.surface }, heading: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm }, icon: { width: 43, height: 43, borderRadius: 15, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, flex: { flex: 1 }, option: { minHeight: 50, flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.sm }, optionSelected: { borderColor: colors.burgundy, backgroundColor: colors.burgundySoft }, optionText: { flex: 1, color: colors.ink, fontFamily: type.medium, fontSize: 14 }, input: { minHeight: 100, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.md, color: colors.ink, textAlignVertical: "top" } });
