import { BrandLoading } from '../src/components/BrandLoading';
import { SearchFilters } from "../src/components/SearchFilters";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useState } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { AdminIntro as CivicPageIntro } from "../src/admin/AdminIntro";
import { Button } from "../src/components/Button";
import { AdminScreen as Screen } from "../src/admin/AdminScreen";
import { SectionHeading, Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";
import { useSensitiveScreenProtection } from "../src/useSensitiveScreenProtection";
import { directoryLabel } from "../src/directoryLabels";

export default function DirectoryManagementScreen() {
  useSensitiveScreenProtection("service-directory-governance");
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const access = useQuery(api.users.currentAccess);
  const roles: string[] = access?.roles ?? [];
  const allowed = roles.some((role) => ["admin", "staff", "supervisor"].includes(role));
  const canManage = roles.some((role) => ["admin", "staff"].includes(role));
  const organisationPage = usePaginatedQuery(api.justiceServices.staffOrganizationsPage, allowed ? {} : "skip", { initialNumItems: 20 });
  const organisationReviewPage = usePaginatedQuery(api.justiceServices.staffOrganizationsPage, allowed ? { status: "draft" } : "skip", { initialNumItems: 10 });
  const servicePage = usePaginatedQuery(api.justiceServices.staffServicesPage, allowed ? {} : "skip", { initialNumItems: 20 });
  const serviceDraftPage = usePaginatedQuery(api.justiceServices.staffServicesPage, allowed ? { status: "draft" } : "skip", { initialNumItems: 10 });
  const serviceExpiredPage = usePaginatedQuery(api.justiceServices.staffServicesPage, allowed ? { status: "expired" } : "skip", { initialNumItems: 10 });
  const correctionPage = usePaginatedQuery(api.justiceServices.listDirectoryCorrectionsPage, allowed ? {} : "skip", { initialNumItems: 20 });
  const [organisationSearch, setOrganisationSearch] = useState("");
  const searchingOrganisations = organisationSearch.trim().length >= 2;
  const searchedOrganisations = useQuery(api.justiceServices.staffSearchOrganizations, allowed && searchingOrganisations ? { search: organisationSearch.trim() } : "skip");
  const [search, setSearch] = useState("");
  const searching = search.trim().length >= 2;
  const searchedServices = useQuery(api.justiceServices.staffSearchServices, allowed && searching ? { search: search.trim() } : "skip");
  const organisations = organisationPage.status === "LoadingFirstPage" ? undefined : organisationPage.results;
  const visibleOrganisations = searchingOrganisations ? searchedOrganisations : organisationSearch.trim().length === 1 ? [] : organisations;
  const services = servicePage.status === "LoadingFirstPage" ? undefined : servicePage.results;
  const organisationsNeedingReview = organisationReviewPage.status === "LoadingFirstPage" ? undefined : organisationReviewPage.results;
  const draftServices = serviceDraftPage.status === "LoadingFirstPage" ? undefined : serviceDraftPage.results;
  const expiredServices = serviceExpiredPage.status === "LoadingFirstPage" ? undefined : serviceExpiredPage.results;
  const servicesNeedingReview = draftServices && expiredServices ? [...draftServices, ...expiredServices] : undefined;
  const corrections = correctionPage.status === "LoadingFirstPage" ? undefined : correctionPage.results;
  const visibleServices = searching ? searchedServices : search.trim().length === 1 ? [] : services;
  const reviewHasMore = [organisationReviewPage, serviceDraftPage, serviceExpiredPage].some((page) => page.status === "CanLoadMore");

  if (access === undefined) return <Screen><BrandLoading compact text={sw ? "Inapakia..." : "Loading..."}/></Screen>;
  if (!allowed) return <Screen><AppHeader back title={sw ? "Orodha ya huduma" : "Service directory"} /><Surface tone="orange"><Text style={styles.title}>{sw ? "Ufikiaji haujaruhusiwa" : "Access is not authorised"}</Text></Surface></Screen>;

  return <Screen>
    <AppHeader back title={sw ? "Taasisi na maeneo ya msaada" : "Organisations & help places"} eyebrow="LSF · VERIFIED DIRECTORY" />
    <CivicPageIntro icon="location-outline" eyebrow="LSF · DIRECTORY" title={sw ? "Msaada sahihi, taarifa zilizothibitishwa." : "Trusted help, verified details."} description={sw ? "Thibitisha huduma na upatikanaji bila kufichua maeneo ya siri." : "Verify services and availability without exposing private locations."} tone="teal" />
    <View style={styles.metrics}><Metric value={organisations === undefined ? undefined : `${organisations.length}${organisationPage.status === "CanLoadMore" ? "+" : ""}`} label={sw ? "Taasisi zilizoonyeshwa" : "Organisations shown"} /><Metric value={services === undefined ? undefined : `${services.length}${servicePage.status === "CanLoadMore" ? "+" : ""}`} label={sw ? "Huduma zilizoonyeshwa" : "Services shown"} /><Metric value={organisationsNeedingReview && servicesNeedingReview ? `${organisationsNeedingReview.length + servicesNeedingReview.length}${reviewHasMore ? "+" : ""}` : undefined} label={sw ? "Ukaguzi ulioonyeshwa" : "Reviews shown"} /></View>
    <SectionHeading title={sw ? "Uthibitishaji unaosubiri" : "Verification queue"} />
    {organisationsNeedingReview === undefined || servicesNeedingReview === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia rekodi za kuthibitisha..." : "Loading verification records..."}/></Surface> : organisationsNeedingReview.length + servicesNeedingReview.length === 0 ? <Surface><Text style={styles.muted}>{sw ? "Hakuna taasisi au huduma inayosubiri uthibitishaji." : "No organisation or service is awaiting verification."}</Text></Surface> : <>
      {organisationsNeedingReview.map((item) => <Surface key={item._id} tone="pink"><Text style={styles.title}>{item.name}</Text><Text style={styles.muted}>{sw ? "Taasisi" : "Organisation"} · {directoryLabel(item.organizationType, sw)}</Text><Button label={sw ? "Kagua taasisi" : "Review organisation"} variant="secondary" onPress={() => router.push({ pathname: "/directory-organisation/[id]", params: { id: item._id } })} /></Surface>)}
      {servicesNeedingReview.map((item) => <Surface key={item._id} tone="pink"><Text style={styles.title}>{item.name}</Text><Text style={styles.muted}>{sw ? "Huduma" : "Service"} · {item.district}, {item.region}</Text><Button label={sw ? "Kagua huduma" : "Review service"} variant="secondary" onPress={() => router.push({ pathname: "/directory-service/[id]", params: { id: item._id } })} /></Surface>)}
    </>}
    {organisationReviewPage.status === "CanLoadMore" ? <Button label={sw ? "Pakia taasisi nyingine za ukaguzi" : "Load more organisations to review"} variant="secondary" onPress={() => organisationReviewPage.loadMore(10)} /> : null}
    {serviceDraftPage.status === "CanLoadMore" ? <Button label={sw ? "Pakia huduma nyingine za rasimu" : "Load more draft services"} variant="secondary" onPress={() => serviceDraftPage.loadMore(10)} /> : null}
    {serviceExpiredPage.status === "CanLoadMore" ? <Button label={sw ? "Pakia huduma nyingine zilizopitwa na muda" : "Load more expired services"} variant="secondary" onPress={() => serviceExpiredPage.loadMore(10)} /> : null}
    <SectionHeading title={sw ? `Marekebisho yanayosubiri (${corrections?.length ?? "…"})` : `Pending corrections (${corrections?.length ?? "…"})`} />
    {corrections === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia maombi..." : "Loading requests..."}/></Surface> : corrections.length === 0 ? <Surface><Text style={styles.muted}>{sw ? "Hakuna maombi yanayosubiri." : "No correction requests are waiting."}</Text></Surface> : corrections.map((item) => <Surface key={item._id} tone="orange"><Text style={styles.title}>{item.serviceName}</Text><Text style={styles.copy}>{item.requestedByName} · {new Date(item.submittedAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ")}</Text><Text style={styles.copy} numberOfLines={2}>{item.reason}</Text><Button label={sw ? "Pitia ombi la marekebisho" : "Review correction request"} variant="secondary" onPress={() => router.push({ pathname: "/directory-correction/[id]", params: { id: item._id } })} /></Surface>)}
    {correctionPage.status === "CanLoadMore" ? <Button label={sw ? "Pakia maombi zaidi" : "Load more requests"} variant="secondary" onPress={() => correctionPage.loadMore(20)} /> : correctionPage.status === "LoadingMore" ? <Surface><BrandLoading compact text={sw ? "Inapakia zaidi..." : "Loading more..."}/></Surface> : null}

    <SectionHeading title={sw ? "Taasisi" : "Organisations"} />
    {canManage ? <Button label={sw ? "+ Ongeza taasisi" : "+ Add organisation"} onPress={() => router.push("/directory-organisation-form")} /> : null}
    <SearchFilters value={organisationSearch} onChange={setOrganisationSearch} sw={sw} placeholder={sw ? "Tafuta taasisi kwa jina" : "Find an organisation"} />
    {visibleOrganisations === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia taasisi..." : "Loading organisations..."}/></Surface> : organisationSearch.trim().length === 1 ? <Surface><Text style={styles.muted}>{sw ? "Andika angalau herufi mbili kutafuta taasisi zote." : "Enter at least two characters to search all organisations."}</Text></Surface> : visibleOrganisations.length === 0 ? <Surface><Text style={styles.muted}>{!organisationSearch.trim() && organisations?.length === 0 ? (sw ? "Hakuna taasisi. Ongeza rekodi ya kwanza ili kuanza ukaguzi." : "No organisations yet. Add the first record to begin verification.") : (sw ? "Hakuna taasisi inayolingana na utafutaji." : "No organisation matches this search.")}</Text></Surface> : null}
    {visibleOrganisations?.map((item) => <Surface key={item._id}>
      <View style={styles.row}><View style={styles.icon}><Ionicons name="business-outline" size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{item.name}</Text><Text style={styles.muted}>{directoryLabel(item.organizationType, sw)}</Text></View><Status value={item.verificationStatus} sw={sw} /></View>
      <Text style={styles.copy}>{sw ? "Makubaliano ya rufaa" : "Referral agreement"}: {directoryLabel(item.referralAgreementStatus, sw)} · {sw ? "Ulinzi" : "Safeguarding"}: {item.safeguardingReady ? (sw ? "tayari" : "ready") : (sw ? "haujathibitishwa" : "not confirmed")}</Text>
      <Button label={sw ? "Pitia taarifa za taasisi" : "Review organisation details"} variant="secondary" onPress={() => router.push({ pathname: "/directory-organisation/[id]", params: { id: item._id } })} />
    </Surface>)}
    {searchingOrganisations && (searchedOrganisations?.length ?? 0) >= 100 ? <Text style={styles.muted}>{sw ? "Taasisi 100 zimeonyeshwa. Boresha utafutaji kuona zilizobaki." : "Showing 100 organisations. Refine the search for more."}</Text> : null}
    {!organisationSearch.trim() && organisationPage.status === "CanLoadMore" ? <Button label={sw ? "Pakia taasisi zaidi" : "Load more organisations"} variant="secondary" onPress={() => organisationPage.loadMore(20)} /> : !organisationSearch.trim() && organisationPage.status === "LoadingMore" ? <Surface><BrandLoading compact text={sw ? "Inapakia zaidi..." : "Loading more..."}/></Surface> : null}

    <SectionHeading title={sw ? "Maeneo na huduma" : "Service points"} />
    {canManage ? <Button label={sw ? "+ Ongeza eneo la msaada" : "+ Add service point"} onPress={() => router.push("/directory-service-form")} /> : null}
    <SearchFilters value={search} onChange={setSearch} sw={sw} placeholder={sw ? "Tafuta huduma au eneo" : "Find a service or area"} />
    {visibleServices?.map((item) => <Surface key={item._id} tone={item.servicePointType === "safe_house" ? "orange" : undefined}>
      <View style={styles.row}><View style={styles.icon}><Ionicons name={item.servicePointType === "safe_house" ? "shield-checkmark-outline" : "location-outline"} size={21} color={colors.burgundy} /></View><View style={styles.flex}><Text style={styles.title}>{item.name}</Text><Text style={styles.muted}>{item.organizationName ?? "—"}</Text><Text style={styles.muted}>{item.district}, {item.region} · {directoryLabel(item.currentIntakeState, sw)}</Text></View><Status value={item.verificationStatus} sw={sw} /></View>
      <Text style={styles.copy}>{directoryLabel(item.visibility, sw)} · {directoryLabel(item.servicePointType, sw)} · {item.referralCapability ? (sw ? "hupokea rufaa" : "accepts referrals") : (sw ? "hakuna rufaa" : "no referrals")}</Text>
      <Text style={styles.copy}>{sw ? "Chanzo" : "Source"}: {item.source || "—"} · {sw ? "Mthibitishaji" : "Authority"}: {item.verifyingAuthority || "—"}</Text>
      {item.servicePointType === "safe_house" ? <Text style={styles.warning}>{sw ? "Mahali pa siri: kamwe pasiwekwe hadharani." : "Confidential location: never publish publicly."}</Text> : null}
      <Button label={sw ? "Pitia rekodi ya huduma" : "Review service record"} variant="secondary" onPress={() => router.push({ pathname: "/directory-service/[id]", params: { id: item._id } })} />
    </Surface>)}
    {visibleServices === undefined ? <Surface><BrandLoading compact text={sw ? "Inapakia huduma..." : "Loading services..."}/></Surface> : search.trim().length === 1 ? <Surface><Text style={styles.muted}>{sw ? "Andika angalau herufi mbili kutafuta kote." : "Enter at least two characters to search all records."}</Text></Surface> : visibleServices.length === 0 ? <Surface><Text style={styles.muted}>{!search.trim() && services?.length === 0 ? (sw ? "Hakuna huduma bado. Ongeza eneo la msaada ili likaguliwe." : "No services yet. Add a help place for review.") : (sw ? "Hakuna huduma inayolingana na utafutaji." : "No service matches this search.")}</Text></Surface> : null}
    {searching && (searchedServices?.length ?? 0) >= 100 ? <Text style={styles.muted}>{sw ? "Matokeo 100 yameonyeshwa. Boresha utafutaji kuona yaliyobaki." : "Showing 100 matches. Refine the search for more."}</Text> : null}
    {!search.trim() && servicePage.status === "CanLoadMore" ? <Button label={sw ? "Pakia huduma zaidi" : "Load more services"} variant="secondary" onPress={() => servicePage.loadMore(20)} /> : !search.trim() && servicePage.status === "LoadingMore" ? <Surface><BrandLoading compact text={sw ? "Inapakia zaidi..." : "Loading more..."}/></Surface> : null}
  </Screen>;
}

function Metric({ value, label }: { value: number | string | undefined; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value ?? "—"}</Text><Text style={styles.muted}>{label}</Text></View>; }
function Status({ value, sw }: { value: string; sw: boolean }) { const good = value === "verified"; const labels: Record<string, [string, string]> = { draft: ["Rasimu", "Draft"], verified: ["Imethibitishwa", "Verified"], suspended: ["Imesimamishwa", "Suspended"], expired: ["Muda umeisha", "Expired"], inactive: ["Imeondolewa", "Retired"] }; return <View style={[styles.badge, good && styles.badgeGood]}><Text style={[styles.badgeText, good && styles.badgeTextGood]}>{labels[value]?.[sw ? 0 : 1] ?? value.replaceAll("_", " ")}</Text></View>; }
const styles = StyleSheet.create({ flex: { flex: 1 }, hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, kicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1.2 }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 30, lineHeight: 37 }, heroBody: { color: "#FAEAF0", fontFamily: type.regular, fontSize: 16, lineHeight: 24 }, metrics: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }, metric: { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, padding: spacing.md }, metricValue: { color: colors.burgundy, fontFamily: type.bold, fontSize: 25 }, row: { flexDirection: "row", alignItems: "center", gap: spacing.md }, icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 17, lineHeight: 23 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 14, lineHeight: 20 }, copy: { marginTop: spacing.sm, color: colors.charcoal, fontFamily: type.regular, fontSize: 15, lineHeight: 22 }, warning: { marginTop: spacing.sm, color: colors.orange, fontFamily: type.bold, fontSize: 12 }, actions: { marginTop: spacing.md, gap: spacing.sm }, badge: { borderRadius: radius.pill, backgroundColor: colors.orangeSoft, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }, badgeGood: { backgroundColor: "#E7F4ED" }, badgeText: { color: colors.orange, fontFamily: type.bold, fontSize: 10, textTransform: "uppercase" }, badgeTextGood: { color: colors.success }, search: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, backgroundColor: colors.surface, paddingHorizontal: spacing.md, minHeight: 50, marginBottom: spacing.md }, searchInput: { flex: 1, color: colors.ink, fontSize: 16 }, error: { marginTop: spacing.md, color: colors.danger, fontFamily: type.medium } });
