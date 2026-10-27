import { BrandLoading } from '../src/components/BrandLoading';
import { SearchFilters } from "../src/components/SearchFilters";
import { AdminIntro } from "../src/admin/AdminIntro";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { AdminScreen as Screen } from "../src/admin/AdminScreen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

export default function PartnerPerformanceScreen() {
  useSensitiveScreenProtection("partner-performance");
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const [search, setSearch] = useState("");
  const [days, setDays] = useState<30 | 90>(30);
  const access = useQuery(api.users.currentAccess);
  const allowed = access?.roles.some((role: string) => ["admin", "staff", "supervisor"].includes(role));
  const report = useQuery(api.justiceServices.staffPartnerPerformance, allowed ? { days } : "skip");
  return <Screen>
    <AppHeader back title={sw ? "Utendaji wa washirika" : "Partner performance"} eyebrow="LSF · RESTRICTED" />
    {access === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia ruhusa..." : "Loading access..."}/></Surface> : !allowed ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Ruhusa ya timu ya LSF inahitajika." : "An authorised LSF role is required."}</Text></Surface> : <>
      <AdminIntro icon="bar-chart-outline" eyebrow="LSF" title={sw ? "Takwimu za rufaa halisi." : "Real referral activity."} description={sw ? "Angalia majibu, muda wa huduma na rufaa zilizochelewa kwa kila taasisi." : "See responses, service timing and overdue referrals by organisation."} />
      <SearchFilters value={search} onChange={setSearch} sw={sw} placeholder={sw ? "Tafuta mshirika au huduma" : "Find a partner or service"} label={sw ? "Muda" : "Period"} title={sw ? "Muda wa taarifa" : "Reporting period"} count={Number(days !== 30)} summary={`${days} ${sw ? "siku" : "days"}`} onReset={() => setDays(30)}><View style={{gap:8}}>{([30,90] as const).map(period => <Button key={period} label={`${period} ${sw ? "siku" : "days"}`} variant={days === period ? "primary" : "secondary"} onPress={() => setDays(period)} />)}</View></SearchFilters>
      {report === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia takwimu..." : "Loading metrics..."}/></Surface> : <>
        <View style={styles.metrics}><Metric value={report.totals.referrals} label={sw ? "Rufaa" : "Referrals"} /><Metric value={report.totals.responded} label={sw ? "Zimejibiwa" : "Responded"} /><Metric value={report.totals.overdueOpen} label={sw ? "Zimechelewa" : "Overdue"} /></View>
        <Text style={styles.section}>{sw ? "Taasisi zilizo na rufaa" : "Partners with referrals"} · {report.partners.length}</Text>
        {report.partners.length === 0 ? <Surface tone="teal"><Text style={styles.title}>{sw ? "Hakuna rufaa katika kipindi hiki." : "No referrals in this period."}</Text><Text style={styles.body}>{sw ? "Takwimu zitaonekana baada ya rufaa halisi kurekodiwa." : "Metrics appear after real referrals are recorded."}</Text></Surface> : report.partners.filter(partner => [partner.organizationName,...partner.serviceNames].join(" ").toLowerCase().includes(search.trim().toLowerCase())).map((partner) => <Surface key={partner.organizationId} tone={partner.overdueOpenCount > 0 ? "orange" : "white"}>
          <View style={styles.row}><View style={styles.icon}><Ionicons name="business-outline" size={23} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{partner.organizationName}</Text><Text style={styles.muted}>{sw ? "Uthibitishaji" : "Verification"}: {partner.verificationStatus} · {sw ? "Makubaliano" : "Agreement"}: {partner.referralAgreementStatus}</Text></View></View>
          <View style={styles.stats}><Metric value={partner.totalReferrals} label={sw ? "Rufaa" : "Referrals"} /><Metric value={`${partner.responseRate}%`} label={sw ? "Majibu" : "Response rate"} /><Metric value={partner.overdueOpenCount} label={sw ? "Zimechelewa" : "Overdue"} /></View>
          <Text style={styles.body}>{sw ? "Ndani ya muda wa huduma" : "Within response target"}: {partner.respondedCount ? `${partner.slaComplianceRate}%` : "—"} · {sw ? "Wastani wa saa" : "Average hours"}: {partner.averageResponseHours ?? "—"}</Text>
          <Text style={styles.muted}>{sw ? "Huduma" : "Services"}: {partner.serviceNames.join(", ") || "—"}</Text>
        </Surface>)}
        <Surface tone="teal"><Text style={styles.title}>{sw ? "Chukua hatua" : "Take action"}</Text><Text style={styles.body}>{sw ? "Angalia rufaa zilizo wazi au rekodi za huduma zinazohitaji kusahihishwa." : "Review open referrals or service records that need correction."}</Text><Button label={sw ? "Fungua rufaa" : "Open referral oversight"} variant="secondary" onPress={() => router.push("/referral-oversight")} /><Button label={sw ? "Fungua orodha ya huduma" : "Open service directory"} variant="quiet" onPress={() => router.push("/directory-management")} /></Surface>
        <Text style={styles.foot}>{sw ? "Kiwango cha huduma kinapimwa kwa rufaa zilizojibiwa pekee. Taasisi zisizo na rufaa hazionekani hapa." : "Response target rate uses responded referrals only. Partners without referrals do not appear here."}</Text>
      </>}
    </>}
  </Screen>;
}
function Metric({ value, label }: { value: number | string; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.muted}>{label}</Text></View>; }
const styles = StyleSheet.create({
  hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 27, lineHeight: 33 }, heroBody: { color: "#F9E8EF", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, filters: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }, filter: { minHeight: 44, minWidth: 100, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill }, filterOn: { backgroundColor: colors.burgundy, borderColor: colors.burgundy }, filterText: { color: colors.inkMuted, fontFamily: type.bold, fontSize: 13 }, filterTextOn: { color: colors.surface }, metrics: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.sm }, metric: { flex: 1, minHeight: 74, padding: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface }, metricValue: { color: colors.burgundy, fontFamily: type.bold, fontSize: 22 }, section: { color: colors.burgundy, fontFamily: type.bold, fontSize: 17, marginTop: spacing.lg, marginBottom: spacing.sm }, row: { flexDirection: "row", alignItems: "center", gap: spacing.md }, icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" }, flex: { flex: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 15 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 19 }, stats: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 20, marginVertical: spacing.sm }, foot: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, marginTop: spacing.md },
});
