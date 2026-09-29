import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";

export default function DirectoryManagementScreen() {
  useSensitiveScreenProtection("service-directory-governance");
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "staff", "supervisor"].includes(role));
  const canManage = roles.some((role) => ["admin", "staff"].includes(role));
  const organisations = useQuery(api.justiceServices.staffListOrganizations, allowed ? {} : "skip");
  const services = useQuery(api.justiceServices.staffListServices, allowed ? {} : "skip");
  const updateOrganisation = useMutation(api.justiceServices.updateOrganization);
  const updateService = useMutation(api.justiceServices.updateService);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const visibleServices = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return services ?? [];
    return (services ?? []).filter((item) => [item.name, item.organizationName, item.region, item.district, item.servicePointType].some((value) => value?.toLowerCase().includes(needle)));
  }, [search, services]);

  if (access === undefined) return <Screen><Text style={styles.muted}>{sw ? "Inapakia..." : "Loading..."}</Text></Screen>;
  if (!allowed) return <Screen><AppHeader back title={sw ? "Orodha ya huduma" : "Service directory"} /><Surface tone="orange"><Text style={styles.title}>{sw ? "Ufikiaji haujaruhusiwa" : "Access is not authorised"}</Text></Surface></Screen>;

  async function setOrganisationStatus(id: Id<"justice_service_organizations">, status: "verified" | "suspended") {
    setBusy(id); setError("");
    try { await updateOrganisation({ id, updates: { verificationStatus: status, ...(status === "suspended" ? { referralAgreementStatus: "suspended" as const } : {}) } }); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(null); }
  }

  async function setServiceState(id: Id<"justice_services">, active: boolean) {
    setBusy(id); setError("");
    try { await updateService({ id, updates: { active } }); }
    catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(null); }
  }

  async function verifyService(id: Id<"justice_services">) {
    setBusy(id); setError("");
    try {
      const now = Date.now();
      await updateService({ id, updates: { verificationStatus: "verified", active: true, lastVerifiedAt: now, nextReviewAt: now + 180 * 24 * 60 * 60 * 1000 } });
    } catch (caught) { setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setBusy(null); }
  }

  return <Screen>
    <AppHeader back title={sw ? "Taasisi na maeneo ya msaada" : "Organisations & help places"} eyebrow="LSF · VERIFIED DIRECTORY" />
    <View style={styles.hero}><Text style={styles.kicker}>TRUST · COVERAGE · REFERRALS</Text><Text style={styles.heroTitle}>{sw ? "Msaada sahihi, taarifa zilizothibitishwa." : "Trusted help, verified details."}</Text><Text style={styles.heroBody}>{sw ? "Dhibiti uthibitisho, uwezo wa kupokea rufaa na upatikanaji bila kuweka maeneo ya siri hadharani." : "Control verification, referral readiness, and availability without exposing confidential locations."}</Text></View>
    <View style={styles.metrics}><Metric value={organisations?.length ?? 0} label={sw ? "Taasisi" : "Organisations"} /><Metric value={services?.filter((item) => item.active).length ?? 0} label={sw ? "Huduma hai" : "Active services"} /><Metric value={services?.filter((item) => item.verificationStatus !== "verified").length ?? 0} label={sw ? "Zikaguliwe" : "Need review"} /></View>
    {error ? <Text style={styles.error}>{error}</Text> : null}

    <SectionHeading title={sw ? "Taasisi" : "Organisations"} />
    {organisations?.map((item) => <Surface key={item._id}>
      <View style={styles.row}><View style={styles.icon}><Ionicons name="business-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{item.name}</Text><Text style={styles.muted}>{item.organizationType.replaceAll("_", " ")} · {item.serviceCount} {sw ? "huduma" : "services"}</Text></View><Status value={item.verificationStatus} /></View>
      <Text style={styles.copy}>{sw ? "Makubaliano ya rufaa" : "Referral agreement"}: {item.referralAgreementStatus} · {sw ? "Ulinzi" : "Safeguarding"}: {item.safeguardingReady ? (sw ? "tayari" : "ready") : (sw ? "haujathibitishwa" : "not confirmed")}</Text>
      <Button label={sw ? "Pitia taarifa za taasisi" : "Review organisation details"} variant="secondary" onPress={() => router.push({ pathname: "/directory-organisation/[id]", params: { id: item._id } })} />
      {canManage ? <View style={styles.actions}>{item.verificationStatus === "verified" ? <Button label={sw ? "Sitisha" : "Suspend"} variant="quiet" disabled={busy === item._id} onPress={() => void setOrganisationStatus(item._id, "suspended")} /> : <Button label={sw ? "Thibitisha taasisi" : "Verify organisation"} variant="secondary" disabled={busy === item._id} onPress={() => void setOrganisationStatus(item._id, "verified")} />}</View> : null}
    </Surface>)}

    <SectionHeading title={sw ? "Maeneo na huduma" : "Service points"} />
    <View style={styles.search}><Ionicons name="search-outline" size={20} color={colors.inkMuted} /><TextInput value={search} onChangeText={setSearch} style={styles.searchInput} placeholder={sw ? "Tafuta jina, mkoa au wilaya" : "Search name, region or district"} placeholderTextColor={colors.inkMuted} /></View>
    {visibleServices.map((item) => <Surface key={item._id} tone={item.servicePointType === "safe_house" ? "orange" : undefined}>
      <View style={styles.row}><View style={styles.icon}><Ionicons name={item.servicePointType === "safe_house" ? "shield-checkmark-outline" : "location-outline"} size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{item.name}</Text><Text style={styles.muted}>{item.organization?.name ?? item.organizationName ?? "—"}</Text><Text style={styles.muted}>{item.district}, {item.region} · {item.currentIntakeState}</Text></View><Status value={item.verificationStatus} /></View>
      <Text style={styles.copy}>{item.visibility} · {item.servicePointType.replaceAll("_", " ")} · {item.referralCapability ? (sw ? "hupokea rufaa" : "accepts referrals") : (sw ? "hakuna rufaa" : "no referrals")}</Text>
      <Text style={styles.copy}>{sw ? "Chanzo" : "Source"}: {item.source || "—"} · {sw ? "Mthibitishaji" : "Authority"}: {item.verifyingAuthority || "—"}</Text>
      {item.servicePointType === "safe_house" ? <Text style={styles.warning}>{sw ? "Mahali pa siri: kamwe pasiwekwe hadharani." : "Confidential location: never publish publicly."}</Text> : null}
      <Button label={sw ? "Pitia rekodi ya huduma" : "Review service record"} variant="secondary" onPress={() => router.push({ pathname: "/directory-service/[id]", params: { id: item._id } })} />
      {canManage ? <View style={styles.actions}><Button label={item.active ? (sw ? "Sitisha huduma" : "Pause service") : (sw ? "Washa huduma" : "Activate service")} variant="quiet" disabled={busy === item._id} onPress={() => void setServiceState(item._id, !item.active)} />{item.verificationStatus !== "verified" ? <Button label={sw ? "Thibitisha kwa miezi 6" : "Verify for 6 months"} variant="secondary" disabled={busy === item._id || !item.source || !item.verifyingAuthority} onPress={() => void verifyService(item._id)} /> : null}</View> : null}
    </Surface>)}
    {visibleServices.length === 0 ? <Surface><Text style={styles.muted}>{sw ? "Hakuna huduma inayolingana." : "No matching service."}</Text></Surface> : null}
  </Screen>;
}

function Metric({ value, label }: { value: number; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.muted}>{label}</Text></View>; }
function Status({ value }: { value: string }) { const good = value === "verified"; return <View style={[styles.badge, good && styles.badgeGood]}><Text style={[styles.badgeText, good && styles.badgeTextGood]}>{value.replaceAll("_", " ")}</Text></View>; }
const styles = StyleSheet.create({ flex: { flex: 1 }, hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1.2 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 28, lineHeight: 33 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, metrics: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }, metric: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, padding: spacing.md }, metricValue: { color: colors.burgundy, fontFamily: type.bold, fontSize: 25 }, row: { flexDirection: "row", alignItems: "center", gap: spacing.md }, icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 15 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 }, copy: { marginTop: spacing.sm, color: colors.charcoal, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, warning: { marginTop: spacing.sm, color: colors.orange, fontFamily: type.bold, fontSize: 12 }, actions: { marginTop: spacing.md, gap: spacing.sm }, badge: { borderRadius: radius.pill, backgroundColor: colors.orangeSoft, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }, badgeGood: { backgroundColor: "#E7F4ED" }, badgeText: { color: colors.orange, fontFamily: type.bold, fontSize: 10, textTransform: "uppercase" }, badgeTextGood: { color: colors.success }, search: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, paddingHorizontal: spacing.md, minHeight: 50, marginBottom: spacing.md }, searchInput: { flex: 1, color: colors.ink, fontSize: 14 }, error: { marginTop: spacing.md, color: colors.danger, fontFamily: type.medium } });
