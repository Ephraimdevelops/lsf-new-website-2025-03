import { referralLabels } from '../src/provider/referralFlow';
import { SearchFilters } from "../src/components/SearchFilters";
import { ParalegalIntro } from "../src/components/ParalegalIntro";
import { ParalegalNavigation } from "../src/components/ParalegalNavigation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../src/auth";
import { api } from "../src/backend/api";
import { CivicPageHeader as AppHeader } from "../src/components/CivicPageHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

export default function ProviderReferralsScreen() {
  useSensitiveScreenProtection("provider-referrals");
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const [tab, setTab] = useState<"new" | "active" | "closed">("new");
  const [search, setSearch] = useState("");
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some((role) => role === "paralegal" || role === "provider_staff") ?? false;
  const rows = useQuery(api.referrals.myDestinationQueue, allowed ? {} : "skip");
  const closedRows = useQuery(api.referrals.myDestinationQueue, allowed && tab === "closed" ? { status: "closed" } : "skip");
  const declinedRows = useQuery(api.referrals.myDestinationQueue, allowed && tab === "closed" ? { status: "declined" } : "skip");
  const dataLoading = rows === undefined || (tab === "closed" && (closedRows === undefined || declinedRows === undefined));
  const newRows = rows?.filter(({ referral }) => ["created", "destination_notified", "escalated"].includes(referral.status)) ?? [];
  const activeRows = rows?.filter(({ referral }) => !["created", "destination_notified", "escalated", "closed", "declined"].includes(referral.status)) ?? [];
  const completedRows = [...(closedRows ?? []), ...(declinedRows ?? [])];
  const visible = (tab === "new" ? newRows : tab === "closed" ? completedRows : activeRows).filter(({ referral, case: record, destinationService }) => [referral.publicId, record?.publicId, referral.reason, destinationService?.name].join(" ").toLowerCase().includes(search.trim().toLowerCase()));

  return <Screen footer={allowed ? <ParalegalNavigation current={access?.roles.includes("provider_staff") ? "referrals" : "cases"} /> : undefined}>
    <AppHeader compact back title={sw ? "Maombi kutoka huduma nyingine" : "Incoming referrals"} />
    <ParalegalIntro pose="direction" title={sw ? "Pokea rufaa. Fuatilia msaada." : "Receive a referral. Follow through."} body={sw ? "Rufaa huonekana hapa baada ya ridhaa ya mnufaika. Fungua maelezo kabla ya kujibu." : "A referral appears here after beneficiary consent. Read its details before responding."} />
    {!isSignedIn ? <Surface tone="pink"><Text style={styles.title}>{sw ? "Ingia kuona rufaa zako" : "Sign in to see your referrals"}</Text><Text style={styles.body}>{sw ? "Taarifa za kesi zinalindwa." : "Case information is protected."}</Text><Button label={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} /></Surface>
      : access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} />
      : !allowed ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Jukumu la mtoa huduma lililoidhinishwa linahitajika." : "An approved provider role is required."}</Text><Button label={sw ? "Angalia kujiunga" : "View onboarding"} variant="secondary" onPress={() => router.push("/paralegal-onboarding")} /></Surface>
      : <>
        <View style={styles.metrics}><Metric value={newRows.length} label={sw ? "Zinahitaji jibu" : "Need response"} /><Metric value={activeRows.length} label={sw ? "Zinaendelea" : "In progress"} /></View>
        <SearchFilters value={search} onChange={setSearch} placeholder={sw ? "Tafuta rufaa" : "Search referrals"} sw={sw} label={sw ? "Hali" : "Status"} title={sw ? "Hali ya rufaa" : "Referral status"} count={Number(tab !== "new")} summary={tab === "new" ? (sw ? "Zinahitaji jibu" : "Waiting for a reply") : tab === "active" ? (sw ? "Zinaendelea" : "In progress") : (sw ? "Zilizofungwa" : "Completed")} onReset={() => setTab("new")}><View style={{gap:8}}>{(["new", "active", "closed"] as const).map(item => <Button key={item} label={item === "new" ? (sw ? "Zinahitaji jibu" : "Waiting for a reply") : item === "active" ? (sw ? "Zinaendelea" : "In progress") : (sw ? "Zilizofungwa" : "Completed")} variant={tab === item ? "primary" : "secondary"} onPress={() => setTab(item)} />)}</View></SearchFilters>
        {dataLoading ? <State text={sw ? "Inapakia rufaa..." : "Loading referrals..."} /> : visible.length === 0 ? <Surface tone="teal"><Ionicons name="checkmark-circle-outline" size={29} color={colors.teal} /><Text style={styles.title}>{search.trim() ? (sw ? "Hakuna rufaa inayolingana" : "No matching referrals") : tab === "new" ? (sw ? "Hakuna rufaa mpya" : "No new referrals") : tab === "closed" ? (sw ? "Hakuna rufaa iliyofungwa" : "No completed referrals") : (sw ? "Hakuna rufaa inayoendelea" : "No referrals in progress")}</Text><Text style={styles.body}>{sw ? "Timu ya LSF itakujulisha hatua mpya ikipatikana." : "LSF will notify you when there is a new step."}</Text></Surface> : visible.map(({ referral, case: record, destinationService }) => <Pressable key={referral._id} accessibilityRole="button" style={styles.card} onPress={() => router.push({ pathname: "/provider-referral/[id]", params: { id: referral._id } })}>
          <View style={styles.row}><View style={styles.icon}><Ionicons name="paper-plane-outline" size={20} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{referral.publicId}</Text><Text style={styles.meta}>{record?.publicId ?? (sw ? "Kesi inalindwa" : "Protected case")} · {referralLabels[referral.status]?.[locale] ?? referral.status.replaceAll("_", " ")}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.inkMuted} /></View>
          <Text style={styles.body} numberOfLines={2}>{referral.reason}</Text><Text style={styles.meta}>{destinationService?.name ?? (sw ? "Huduma haipatikani" : "Service unavailable")}</Text>
        </Pressable>)}
      </>}
  </Screen>;
}

function Metric({ value, label }: { value: number; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.meta}>{label}</Text></View>; }
function State({ text }: { text: string }) { return <Surface><Text style={styles.body}>{text}</Text></Surface>; }

const styles = StyleSheet.create({
  hero: { padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.ink, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27, lineHeight: 32 }, heroBody: { color: "#E6DCE1", fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  metrics: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }, metric: { flex: 1, minHeight: 82, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.md }, metricValue: { color: colors.burgundy, fontFamily: type.bold, fontSize: 25 },
  tabs: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.md }, tab: { flex: 1, minHeight: 46, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, justifyContent: "center", alignItems: "center" }, tabActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, tabText: { color: colors.inkMuted, fontFamily: type.bold, fontSize: 13 }, tabTextActive: { color: colors.surface },
  card: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, marginBottom: spacing.sm, gap: spacing.sm }, row: { flexDirection: "row", gap: spacing.md, alignItems: "center" }, icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" }, flex: { flex: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 15, lineHeight: 23, marginTop: spacing.sm }, meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 },
});
