import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../src/auth";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
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
  const [tab, setTab] = useState<"new" | "active">("new");
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const allowed = access?.roles.some((role) => role === "paralegal" || role === "provider_staff") ?? false;
  const rows = useQuery(api.referrals.myDestinationQueue, allowed ? {} : "skip");
  const newRows = rows?.filter(({ referral }) => referral.status === "created" || referral.status === "destination_notified") ?? [];
  const activeRows = rows?.filter(({ referral }) => !["created", "destination_notified"].includes(referral.status)) ?? [];
  const visible = tab === "new" ? newRows : activeRows;

  return <Screen>
    <AppHeader back title={sw ? "Rufaa nilizopokea" : "Incoming referrals"} eyebrow="HAKI YANGU · PROVIDER" />
    <View style={styles.hero}><Ionicons name="git-compare-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{sw ? "Pokea rufaa. Fuatilia msaada." : "Receive a referral. Follow through."}</Text><Text style={styles.heroBody}>{sw ? "Rufaa huonekana hapa baada ya ridhaa ya mnufaika. Fungua maelezo kabla ya kujibu." : "A referral appears here after beneficiary consent. Read its details before responding."}</Text></View>
    {!isSignedIn ? <Surface tone="pink"><Text style={styles.title}>{sw ? "Ingia kuona rufaa zako" : "Sign in to see your referrals"}</Text><Text style={styles.body}>{sw ? "Taarifa za kesi zinalindwa." : "Case information is protected."}</Text><Button label={sw ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} /></Surface>
      : access === undefined ? <State text={sw ? "Inapakia ruhusa..." : "Loading access..."} />
      : !allowed ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Jukumu la mtoa huduma lililoidhinishwa linahitajika." : "An approved provider role is required."}</Text><Button label={sw ? "Angalia kujiunga" : "View onboarding"} variant="secondary" onPress={() => router.push("/paralegal-onboarding")} /></Surface>
      : <>
        <View style={styles.metrics}><Metric value={newRows.length} label={sw ? "Zinahitaji jibu" : "Need response"} /><Metric value={activeRows.length} label={sw ? "Zinaendelea" : "In progress"} /></View>
        <View style={styles.tabs}>{(["new", "active"] as const).map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: tab === item }} style={[styles.tab, tab === item && styles.tabActive]} onPress={() => setTab(item)}><Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item === "new" ? (sw ? "Mpya" : "New") : (sw ? "Zinaendelea" : "In progress")}</Text></Pressable>)}</View>
        {rows === undefined ? <State text={sw ? "Inapakia rufaa..." : "Loading referrals..."} /> : visible.length === 0 ? <Surface tone="teal"><Ionicons name="checkmark-circle-outline" size={29} color={colors.teal} /><Text style={styles.title}>{tab === "new" ? (sw ? "Hakuna rufaa mpya" : "No new referrals") : (sw ? "Hakuna rufaa inayoendelea" : "No referrals in progress")}</Text><Text style={styles.body}>{sw ? "Timu ya LSF itakujulisha hatua mpya ikipatikana." : "LSF will notify you when there is a new step."}</Text></Surface> : visible.map(({ referral, case: record, destinationService }) => <Pressable key={referral._id} accessibilityRole="button" style={styles.card} onPress={() => router.push({ pathname: "/provider-referral/[id]", params: { id: referral._id } })}>
          <View style={styles.row}><View style={styles.icon}><Ionicons name="paper-plane-outline" size={20} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{referral.publicId}</Text><Text style={styles.meta}>{record?.publicId ?? (sw ? "Kesi inalindwa" : "Protected case")} · {referral.status.replaceAll("_", " ")}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.inkMuted} /></View>
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
  card: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, marginBottom: spacing.sm, gap: spacing.sm }, row: { flexDirection: "row", gap: spacing.md, alignItems: "center" }, icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" }, flex: { flex: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 20, marginTop: spacing.sm }, meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 },
});
