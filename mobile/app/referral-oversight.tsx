import { LoadingText } from '../src/components/BrandLoading';
import { BrandLoading } from '../src/components/BrandLoading';
import { SearchFilters } from "../src/components/SearchFilters";
import { AdminIntro } from "../src/admin/AdminIntro";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { AdminScreen as Screen } from "../src/admin/AdminScreen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

type Filter = "attention" | "consent" | "provider" | "all";
const attention = new Set(["declined", "returned", "escalated"]);
const awaitingProvider = new Set(["created", "destination_notified"]);

export default function ReferralOversightScreen() {
  useSensitiveScreenProtection("referral-oversight");
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const [filter, setFilter] = useState<Filter>("attention");
  const [search, setSearch] = useState("");
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff", "supervisor"].includes(role));
  const queue = useQuery(api.referrals.staffQueue, allowed ? {} : "skip");
  const evidence = useQuery(api.referrals.staffConsentEvidenceQueue, allowed ? { status: "pending_review" } : "skip");
  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (queue ?? []).filter(({ referral, case: record, destinationService, destinationUnavailable }) => {
      if (filter === "attention" && !attention.has(referral.status) && !(destinationUnavailable && !["closed", "declined", "returned"].includes(referral.status))) return false;
      if (filter === "consent" && referral.status !== "awaiting_beneficiary_consent") return false;
      if (filter === "provider" && !awaitingProvider.has(referral.status)) return false;
      return !needle || [referral.publicId, record?.publicId, destinationService?.name].some((value) => value?.toLowerCase().includes(needle));
    });
  }, [queue, filter, search]);

  if (access === undefined) return <Screen><AppHeader back title={sw ? "Usimamizi wa rufaa" : "Referral oversight"} /><BrandLoading compact text={sw ? "Inapakia ruhusa..." : "Loading access..."}/></Screen>;
  if (!allowed) return <Screen><AppHeader back title={sw ? "Usimamizi wa rufaa" : "Referral oversight"} /><Surface tone="orange"><Text style={styles.title}>{sw ? "Ruhusa ya timu ya LSF inahitajika." : "An authorised LSF role is required."}</Text></Surface></Screen>;

  return <Screen>
    <AppHeader back title={sw ? "Usimamizi wa rufaa" : "Referral oversight"} eyebrow="LSF · RESTRICTED" />
    <AdminIntro icon="book-outline" eyebrow="LSF" title={sw ? "Fuatilia kila uelekezaji." : "Track every handoff."} description={sw ? "Angalia ridhaa inayosubiriwa, majibu ya watoa huduma, rufaa zilizorudishwa na ushahidi unaohitaji ukaguzi." : "See pending consent, provider responses, returned referrals and evidence awaiting review."} />
    <View style={styles.metrics}><Metric value={queue?.filter(({ referral }) => referral.status === "awaiting_beneficiary_consent").length ?? 0} label={sw ? "Ridhaa" : "Consent"} /><Metric value={queue?.filter(({ referral, destinationUnavailable }) => attention.has(referral.status) || destinationUnavailable && !["closed", "declined", "returned"].includes(referral.status)).length ?? 0} label={sw ? "Zihitaji hatua" : "Need action"} /><Metric value={evidence?.length ?? 0} label={sw ? "Ushahidi" : "Evidence"} /></View>
    <SearchFilters value={search} onChange={setSearch} sw={sw} placeholder={sw ? "Tafuta rufaa, kesi au huduma" : "Find a referral, case or service"} label={sw ? "Onyesha" : "Show"} title={sw ? "Rufaa unazotaka kuona" : "Referrals to show"} count={Number(filter !== "attention")} onReset={() => setFilter("attention")}><View style={{gap:8}}>{(["attention","consent","provider","all"] as Filter[]).map(item => <Button key={item} label={item === "attention" ? (sw ? "Zinahitaji hatua" : "Need attention") : item === "consent" ? (sw ? "Zinasubiri ridhaa" : "Awaiting consent") : item === "provider" ? (sw ? "Zinasubiri mtoa huduma" : "Awaiting provider") : (sw ? "Zote" : "All")} variant={filter === item ? "primary" : "secondary"} onPress={() => setFilter(item)} />)}</View></SearchFilters>
    <LoadingText style={styles.count}>{queue === undefined ? (sw ? "Inapakia rufaa..." : "Loading referrals...") : `${visible.length} ${sw ? "rufaa" : "referrals"}`}</LoadingText>
    {queue !== undefined && visible.length === 0 ? <Surface tone="teal"><Text style={styles.title}>{sw ? "Hakuna rufaa inayolingana." : "No matching referrals."}</Text><Text style={styles.body}>{sw ? "Badili kichujio au utafutaji kuona hali nyingine." : "Change the filter or search to see another status."}</Text></Surface> : visible.map(({ referral, case: record, destinationService, destinationUnavailable, consent }) => <Pressable key={referral._id} accessibilityRole="button" style={styles.card} onPress={() => router.push({ pathname: "/referral-oversight/[id]", params: { id: referral._id } })}>
      <View style={styles.row}><View style={styles.icon}><Ionicons name={attention.has(referral.status) ? "alert-circle-outline" : "paper-plane-outline"} size={22} color={attention.has(referral.status) ? colors.orange : colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{referral.publicId}</Text><Text style={styles.muted}>{record?.publicId ?? "—"} · {referral.status.replaceAll("_", " ")}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></View>
      <Text style={styles.body} numberOfLines={2}>{destinationService?.name ?? (sw ? "Huduma haipatikani" : "Service unavailable")}</Text>
      {destinationUnavailable && !["closed", "declined", "returned"].includes(referral.status) ? <Text accessibilityRole="alert" style={styles.muted}>{sw ? "Mahali pa rufaa hapokei tena; LSF ikague njia mbadala." : "Destination unavailable; LSF must review an alternative."}</Text> : null}
      <Text style={styles.muted}>{sw ? "Ridhaa" : "Consent"}: {consent?.granted ? (sw ? "imerekodiwa" : "recorded") : (sw ? "inasubiriwa" : "pending")}</Text>
    </Pressable>)}
    {evidence?.length ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Ushahidi wa ridhaa unaosubiri ukaguzi" : "Consent evidence awaiting review"}</Text><Text style={styles.body}>{sw ? "Kagua faili na taarifa za rufaa kabla ya kukubali au kukataa ushahidi." : "Inspect the file and referral details before accepting or rejecting evidence."}</Text>{evidence.slice(0, 5).map(({ consent, referral }) => referral ? <Button key={consent._id} label={`${referral.publicId} · ${sw ? "Kagua ushahidi" : "Review evidence"}`} variant="secondary" onPress={() => router.push({ pathname: "/referral-oversight/[id]", params: { id: referral._id } })} /> : null)}</Surface> : null}
  </Screen>;
}

function Metric({ value, label }: { value: number; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.muted}>{label}</Text></View>; }
const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, backgroundColor: colors.burgundy, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27, lineHeight: 33 }, heroBody: { color: "#F9E8EF", fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  metrics: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }, metric: { flex: 1, minHeight: 88, padding: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }, metricValue: { color: colors.burgundy, fontFamily: type.bold, fontSize: 25 },
  search: { minHeight: 50, marginTop: spacing.xl, paddingHorizontal: spacing.md, color: colors.ink, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }, filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md }, filter: { minHeight: 44, justifyContent: "center", paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line }, filterActive: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, filterText: { color: colors.inkMuted, fontFamily: type.bold, fontSize: 12 }, filterTextActive: { color: colors.surface }, count: { marginTop: spacing.lg, marginBottom: spacing.sm, color: colors.burgundy, fontFamily: type.bold, fontSize: 13 },
  card: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, marginBottom: spacing.sm }, row: { flexDirection: "row", alignItems: "center", gap: spacing.md }, icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" }, flex: { flex: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 15 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 20, marginTop: spacing.sm },
});
