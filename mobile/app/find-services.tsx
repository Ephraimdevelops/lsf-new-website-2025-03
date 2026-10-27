import { BrandLoading } from '../src/components/BrandLoading';
import ServiceMap from "../src/location/ServiceMap";
import { NearbySearch, type SearchPoint } from "../src/location/NearbySearch";
import { SearchFilters } from "../src/components/SearchFilters";
import { IntakeSelect } from "../src/intake/IntakeSelect";
import { regionOptions, districtOptions } from "../src/regionOptions";
import { helpIssues, resolveHelpIssue } from "../src/helpIssues";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "convex/react";
import { usePublicDirectoryQuery } from "../src/backend/usePublicDirectoryQuery";
import { withRequestDeadline } from "../src/backend/requestDeadline";
import { DirectoryConnectionError } from "../src/components/DirectoryConnectionError";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Linking } from "react-native";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { CivicPageHeader } from "../src/components/CivicPageHeader";
import { CivicIllustration } from "../src/components/CivicIllustration";
import { ProviderThumbnail } from "../src/components/ProviderThumbnail";
import { PublicInformationLinks } from "../src/components/PublicInformationLinks";
import { useLanguage } from "../src/i18n";
import { useIntakeDraft } from "../src/intake/IntakeDraftContext";
import { colors, radius, spacing, type } from "../src/theme";
import { directoryLabel } from "../src/directoryLabels";
import { helpGoals } from "../src/helpGoals";

const issueTones = { employment: "#FFF0E6", land: "#E8F4ED", family: "#F8EAF0", safety: "#F2EAFB", consumer: "#FFF7DA", other: "#EAF2FA" };
const issueOptions = helpIssues.map(issue => ({ ...issue, tone: issueTones[issue.key] }));

const providerOptions = ["all", "paralegal", "legal_aid_provider", "government_office", "local_government", "police_gender_children_desk", "social_welfare", "court_or_tribunal", "labour_service", "land_service", "cso", "protection_service", "mediation", "partner_organisation", "other"] as const;

const serviceTypeLabels: Record<string, { sw: string; en: string }> = {
  legal_information: { sw: "Taarifa za kisheria", en: "Legal information" },
  document_support: { sw: "Msaada wa nyaraka", en: "Document support" },
  referral: { sw: "Rufaa", en: "Referral" },
  case_follow_up: { sw: "Ufuatiliaji wa kesi", en: "Case follow-up" },
  labour_guidance: { sw: "Mwongozo wa ajira", en: "Employment guidance" },
  appointment: { sw: "Miadi", en: "Appointments" },
  safeguarding_triage: { sw: "Tathmini ya usalama", en: "Safety triage" },
};

const suitabilityLabels: Record<string, string> = {
  "Handles this issue area": "Hushughulikia aina hii ya tatizo",
  "Serves this region": "Inahudumia mkoa huu",
  "Located in this district": "Ipo katika wilaya hii",
  "Currently accepting requests": "Inapokea maombi kwa sasa",
  "Can receive referrals": "Inaweza kupokea rufaa",
  "Remote contact is available": "Mawasiliano ya mbali yanapatikana",
  "Verified public service": "Huduma ya umma iliyothibitishwa",
};

function intakeLabel(state: string, locale: "sw" | "en") {
  const labels: Record<string, { sw: string; en: string }> = {
    open: { sw: "Inapokea", en: "Accepting" },
    limited: { sw: "Nafasi chache", en: "Limited" },
    closed: { sw: "Imefungwa", en: "Closed" },
  };
  return labels[state]?.[locale] ?? state.replaceAll("_", " ");
}

export function FindServicesScreen({ initialStage = "search" }: { initialStage?: "search" | "results" }) {
  const [mapVisible, setMapVisible] = useState(false);
  const [origin, setOrigin] = useState<SearchPoint>();
  const [radiusKm, setRadius] = useState<number>();
  const { locale } = useLanguage();
  const { draft, updateDraft } = useIntakeDraft();
  const params = useLocalSearchParams<{ issue?: string; goal?: string; region?: string; district?: string }>();
  const initialIssue = resolveHelpIssue(params.issue ?? draft.issueCategory ?? "")?.key ?? "";
  const [issueDetail, setIssueDetail] = useState(helpIssues.find(issue => issue.id === draft.issueDetail && issue.key === initialIssue)?.id ?? resolveHelpIssue(params.issue ?? "")?.id ?? "");
  const [moreIssues, setMoreIssues] = useState(false);
  const [goal] = useState(params.goal ?? draft.helpGoal ?? "");
  const selectedGoal = helpGoals.find(item => item.value === goal);
  const [region, setRegion] = useState(params.region ?? draft.region ?? "");
  const [district, setDistrict] = useState(params.district ?? draft.district ?? "");
  const [providerType, setProviderType] = useState<(typeof providerOptions)[number]>("all");
  const [search, setSearch] = useState("");
  const [issueCategory, setIssueCategory] = useState<(typeof issueOptions)[number]["key"] | "">(initialIssue);
  const [stage, setStage] = useState<"search" | "results">(initialIssue || goal ? "results" : initialStage);
  const [matching, setMatching] = useState(false);
  const matchGeneration = useRef(0);
  const [matchError, setMatchError] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Array<{
    service: {
      _id: string;
      name: string;
      organizationName?: string;
      servicePointType: string;
      region: string;
      district: string;
      ward?: string;
      villageOrMtaa?: string;
      physicalLocation?: string;
      latitude?: number;
      longitude?: number;
      issueCategories: string[];
      serviceTypes: string[];
      phoneSupport: boolean;
      remoteSupport: boolean;
      walkIn: boolean;
      currentIntakeState: string;
      languages: string[];
      genderSensitive: boolean;
      privacyAvailable: boolean;
    };
    distanceKm?: number | null;
    score: number;
    whySuitable: string[];
    whatToPrepare: string[];
  }> | null>(null);
  const typedIssue = resolveHelpIssue(search);
  const typedTopic = typedIssue?.key;
  const { data: services, failed, retry } = usePublicDirectoryQuery(api.justiceServices.listPublicServices, {
    origin: origin ? { latitude: origin.latitude, longitude: origin.longitude } : undefined, radiusKm,
    region: region.trim() || undefined,
    district: district.trim() || undefined,
    issueCategory: typedTopic || issueCategory || undefined,
    serviceType: selectedGoal?.serviceType || undefined,
    providerType: providerType === "all" ? undefined : providerType,
    search: typedTopic ? undefined : search.trim() || undefined,
  });
  const { data: allPublicServices } = usePublicDirectoryQuery(api.justiceServices.listPublicServices, {});
  const matchServices = useMutation(api.justiceServices.matchServices);
  const recordJourney = useMutation(api.journeyAnalytics.record);

  function clearMatches() {
    matchGeneration.current += 1;
    setRecommendations(null);
    setMatchError("");
    setMatching(false);
  }

  async function runMatch(topic = typedTopic || issueCategory) {
    const generation = ++matchGeneration.current;
    setStage("results");
    void recordJourney({ surface: "mobile", step: "find_help_search" }).catch(() => undefined);
    if (search.trim() && !typedTopic) {
      // Keyword searches use the verified directory query; the matcher does not accept a keyword.
      setRecommendations(null);
      setMatchError("");
      setMatching(false);
      if (services?.length === 0) void recordJourney({ surface: "mobile", step: "find_help_no_results" }).catch(() => undefined);
      return;
    }
    setMatching(true);
    setMatchError("");
    try {
      const result = await withRequestDeadline(matchServices({
        providerType: providerType === "all" ? undefined : providerType,
        serviceType: selectedGoal?.serviceType || undefined,
        origin: origin ? { latitude: origin.latitude, longitude: origin.longitude } : undefined, radiusKm,
        source: "directory",
        ordinaryProblem: topic || undefined,
        issueCategory: topic || undefined,
        region: region.trim() || undefined,
        district: district.trim() || undefined,
        urgency: "standard",
      }));
      if (generation !== matchGeneration.current) return;
      setRecommendations(result.recommendations as typeof recommendations);
      if (result.recommendations.length === 0) void recordJourney({ surface: "mobile", step: "find_help_no_results" }).catch(() => undefined);
    } catch {
      if (generation !== matchGeneration.current) return;
      setMatchError(locale === "sw" ? "Mapendekezo hayajapatikana. Unaweza kuangalia huduma zilizothibitishwa hapa chini." : "Recommendations could not load. You can still browse verified services below.");
      setRecommendations(null);
    } finally {
      if (generation === matchGeneration.current) setMatching(false);
    }
  }

  const unfilteredList = recommendations ?? services?.map((service) => ({
    service,
    distanceKm: service.distanceKm,
    score: 0,
    whySuitable: [locale === "sw" ? "Huduma imethibitishwa" : "Verified public service"],
    whatToPrepare: [],
  }));
  const list = unfilteredList?.filter((item) => {
    if (selectedGoal?.serviceType && !item.service.serviceTypes.includes(selectedGoal.serviceType)) return false;
    if (providerType !== "all" && item.service.servicePointType !== providerType) return false;
    return true;
  });
  const compared = list?.filter((item) => compareIds.includes(String(item.service._id))) ?? [];
  function startEscalation() {
    updateDraft({
      issueCategory: typedTopic || issueCategory || undefined,
      issueDetail: typedIssue?.id ?? (issueDetail || undefined),
      sourceServiceId: undefined,
      region: region.trim(),
      district: district.trim(),
      helpGoal: goal || undefined,
      desiredHelp: draft.helpGoal === goal && draft.desiredHelp ? draft.desiredHelp : selectedGoal?.[locale] ?? draft.desiredHelp,
    });
    router.push("/intake");
  }

  const selectedIssue = issueOptions.find((issue) => issue.id === issueDetail && issue.key === issueCategory);
  const searchSummary = [providerType !== "all" ? directoryLabel(providerType, locale === "sw") : "", selectedGoal?.[locale], selectedIssue?.[locale] ?? (issueCategory ? directoryLabel(issueCategory, locale === "sw") : ""), search.trim(), district.trim(), region.trim()].filter(Boolean).join(" · ");
  const districts = districtOptions(region, allPublicServices ?? [], district);
  const clearLocation = () => { setRegion(""); setDistrict(""); clearMatches(); };
  const searchControls = <View style={{ gap: 12 }}>
    <IntakeSelect label={locale === "sw" ? "Aina ya msaada" : "Type of help"} value={providerType} options={providerOptions.map(value => ({ value, label: value === "all" ? (locale === "sw" ? "Watoa msaada wote" : "All providers") : directoryLabel(value, locale === "sw") }))} onChange={value => { const provider = providerOptions.find(option => option === value); if (provider) { setProviderType(provider); clearMatches(); } }} sw={locale === "sw"} />
    <SearchFilters value={search} onChange={value => { setSearch(value); clearMatches(); }} placeholder={locale === "sw" ? "Tafuta huduma au jina" : "Search services or names"} sw={locale === "sw"} label={locale === "sw" ? "Eneo" : "Location"} title={locale === "sw" ? "Unatafuta msaada wapi?" : "Where do you need help?"} count={[region.trim(), district.trim()].filter(Boolean).length} summary={stage === "search" ? [district.trim(), region.trim()].filter(Boolean).join(" · ") : undefined} onReset={clearLocation} onSubmit={() => void runMatch()}>
      <IntakeSelect label={locale === "sw" ? "Mkoa" : "Region"} value={region} options={[{ value: "", label: locale === "sw" ? "Mikoa yote" : "All regions" }, ...regionOptions]} onChange={value => { setRegion(value); setDistrict(""); clearMatches(); }} sw={locale === "sw"} />
      <IntakeSelect label={locale === "sw" ? "Wilaya" : "District"} value={district} disabled={!region} placeholder={locale === "sw" ? "Weka mkoa kwanza" : "Set a region first"} options={[{ value: "", label: locale === "sw" ? "Wilaya zote" : "All districts" }, ...districts]} allowCustom onChange={value => { setDistrict(value); clearMatches(); }} sw={locale === "sw"} />
    </SearchFilters>
  </View>;

  return (
    <Screen key={stage}>
      <CivicPageHeader back compact title={locale === "sw" ? "Tafuta msaada" : "Find help"} actionIcon="bookmark-outline" actionLabel={locale === "sw" ? "Huduma nilizohifadhi" : "Saved help"} onAction={() => router.push("/saved-services")} />

      <NearbySearch sw={locale === "sw"} origin={origin} radiusKm={radiusKm} onChange={(point, radius) => { if (point && point !== origin) { setRegion(""); setDistrict(""); } setOrigin(point); setRadius(radius); clearMatches(); }} />
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: mapVisible }} style={{ minHeight: 48, justifyContent: "center" }} onPress={() => setMapVisible(v => !v)}><Text style={styles.body}>{mapVisible ? (locale === "sw" ? "Ficha ramani" : "Hide map") : (locale === "sw" ? "Onyesha ofisi kwenye ramani" : "Show offices on map")}</Text></Pressable>
      {mapVisible && <ServiceMap sw={locale === "sw"} places={(list ?? []).map(item => ({ id: String(item.service._id), name: item.service.name, latitude: item.service.latitude, longitude: item.service.longitude }))} onSelect={id => router.push({ pathname: "/service/[id]", params: { id } })} />}
      {stage === "search" ? <>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.kicker}>{locale === "sw" ? "WATU NA OFISI ZA MSAADA" : "PEOPLE AND OFFICES THAT CAN HELP"}</Text>
          <Text style={styles.title}>{locale === "sw" ? "Msaada unaokufaa." : "The right help for you."}</Text>
          <Text style={styles.body}>{locale === "sw" ? "Tafuta msaada wa kisheria au ofisi ya serikali karibu nawe." : "Find legal help or a government office near you."}</Text>
        </View>
        <CivicIllustration pose="welcome" size={108} />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.topicHeading}>{locale === "sw" ? "Unahitaji msaada kuhusu nini?" : "What do you need help with?"}</Text>
        <View style={styles.issueGrid}>{issueOptions.filter((issue, index) => moreIssues || index < 6 || issue.id === issueDetail).map(issue => {
          const selected = selectedIssue?.id === issue.id;
          return <Pressable key={issue.id} accessibilityRole="radio" accessibilityLabel={issue[locale]} accessibilityState={{ checked: selected }} style={[styles.issueTile, { backgroundColor: issue.tone }, selected && styles.issueTileActive]} onPress={() => { setIssueCategory(issue.key); setIssueDetail(issue.id); clearMatches(); updateDraft({ issueCategory: issue.key, issueDetail: issue.id }); }}><Ionicons name={issue.icon} size={22} color={selected ? colors.surface : colors.burgundy} /><Text style={[styles.issueTileText, selected && styles.issueTileTextActive]}>{issue[locale]}</Text></Pressable>;
        })}</View>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: moreIssues }} style={[styles.editSearch, { marginTop: 0 }]} onPress={() => setMoreIssues(value => !value)}><Text style={styles.editSearchText}>{moreIssues ? (locale === "sw" ? "Onyesha machache" : "Show fewer") : (locale === "sw" ? "Matatizo mengine / sina uhakika" : "Other issues / not sure")}</Text><Ionicons name={moreIssues ? "chevron-up" : "chevron-down"} size={18} color={colors.burgundy} /></Pressable>
        {searchControls}
        <Button label={matching ? (locale === "sw" ? "Inatafuta..." : "Searching...") : (locale === "sw" ? "Onyesha msaada" : "Show support")} loading={matching} disabled={matching} onPress={() => void runMatch()} />
        {matchError ? <Text accessibilityRole="alert" style={styles.body}>{matchError}</Text> : null}
      </View>
      <View style={styles.assurance}><Ionicons name="shield-checkmark-outline" size={18} color={colors.teal} /><Text style={styles.assuranceText}>{locale === "sw" ? "Huduma zilizothibitishwa. Unaweza kutafuta bila akaunti." : "Verified public services. Search without an account."}</Text></View>
      <Pressable accessibilityRole="button" style={styles.editSearch} onPress={() => router.push("/paralegals")}><Ionicons name="people-outline" size={18} color={colors.burgundy} /><Text style={styles.editSearchText}>{locale === "sw" ? "Tafuta msaidizi wa kisheria aliyethibitishwa" : "Find a verified paralegal"}</Text><Ionicons name="arrow-forward" size={16} color={colors.burgundy} /></Pressable>
      </> : <>
      <View style={styles.hero}><View style={styles.heroCopy}><Text style={styles.directoryTitle}>{locale === "sw" ? "Msaada unaokufaa" : "Support for your situation"}</Text><Text style={styles.body}>{locale === "sw" ? "Watu na ofisi zinazoweza kukusaidia katika eneo lako." : "People and offices that can help in your area."}</Text></View><CivicIllustration pose="welcome" size={96} /></View>
      <Text style={[styles.body, { marginTop: 6 }]}>{searchSummary || (locale === "sw" ? "Huduma zilizothibitishwa" : "Verified services")}</Text>
      {initialStage === "search" ? <Pressable accessibilityRole="button" disabled={matching} style={styles.editSearch} onPress={() => setStage("search")}><Ionicons name="arrow-back" size={18} color={colors.burgundy} /><Text style={styles.editSearchText}>{selectedIssue ? (locale === "sw" ? "Badili tatizo" : "Change the issue") : (locale === "sw" ? "Ongeza tatizo" : "Add an issue")}</Text></Pressable> : null}
      {!!matchError && <Text accessibilityRole="alert" style={[styles.body, { marginTop: 12 }]}>{matchError}</Text>}
      {searchControls}
      <Pressable accessibilityRole="button" onPress={() => router.push("/paralegals")} style={styles.paralegalLink}><Ionicons name="people-outline" size={19} color={colors.teal} /><Text style={styles.paralegalText}>{locale === "sw" ? "Tafuta msaidizi wa kisheria" : "Find a paralegal"}</Text><Ionicons name="arrow-forward" size={17} color={colors.teal} /></Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{allPublicServices?.length === 0 ? (locale === "sw" ? "Njia nyingine za kupata msaada" : "Other ways to get help") : (locale === "sw" ? "Huduma" : "Services")}{allPublicServices?.length && !matching && list ? ` (${list.length})` : ""}</Text>
        {allPublicServices?.length ? <Text style={styles.sectionMeta}>{locale === "sw" ? "Rekodi zilizothibitishwa" : "Verified records"}</Text> : null}
      </View>

      {failed ? <DirectoryConnectionError sw={locale === "sw"} retry={retry} /> : (!services || matching) ? <BrandLoading compact task="services"/> : null}

      {!matching && list?.length ? list.map((item) => (
        <View key={String(item.service._id)} style={styles.card}>
          <View style={styles.cardTop}>
            <ProviderThumbnail kind={item.service.servicePointType} name={item.service.name} />
            <View style={styles.cardCopy}>
              <Text style={styles.serviceName}>{item.service.name}</Text>
              <Text style={styles.serviceMeta}>{item.service.district}, {item.service.region}</Text>
            </View>
            <Text style={styles.statePill}>{intakeLabel(item.service.currentIntakeState, locale)}</Text>
          </View>
          {item.distanceKm != null && <Text style={styles.providerLabel}>{item.distanceKm.toFixed(1)} km · {locale === "sw" ? "mstari wa moja kwa moja" : "straight-line"}</Text>}
          <Text style={styles.providerLabel}>{directoryLabel(item.service.servicePointType, locale === "sw")}{item.service.ward ? ` · ${item.service.ward}` : ""}</Text>
          {item.whySuitable.slice(0, 1).map((reason) => (
            <View key={reason} style={styles.reasonRow}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.teal} />
              <Text style={styles.reasonText}>{locale === "sw" ? suitabilityLabels[reason] ?? reason : reason}</Text>
            </View>
          ))}
          <View style={styles.chips}>
            {item.service.serviceTypes.slice(0, 3).map((serviceType) => (
              <Text key={serviceType} style={styles.chip}>{serviceTypeLabels[serviceType]?.[locale] ?? serviceType.replaceAll("_", " ")}</Text>
            ))}
          </View>
          <View style={styles.actionRow}>
            <Pressable accessibilityRole="button" style={styles.primaryAction} onPress={() => { updateDraft({ issueCategory: typedTopic || issueCategory || undefined, issueDetail: typedIssue?.id ?? (issueDetail || undefined), helpGoal: goal || undefined, desiredHelp: draft.helpGoal === goal && draft.desiredHelp ? draft.desiredHelp : selectedGoal?.[locale] ?? draft.desiredHelp, sourceServiceId: String(item.service._id), region: item.service.region, district: item.service.district }); router.push({ pathname: "/service/[id]", params: { id: String(item.service._id) } }); }}>
              <Text style={styles.primaryText}>{locale === "sw" ? "Angalia huduma" : "View service"}</Text>
              <Ionicons name="arrow-forward" size={17} color={colors.surface} />
            </Pressable>
          </View>
          {((item.service.latitude !== undefined && item.service.longitude !== undefined) || item.service.physicalLocation) ? <Pressable accessibilityRole="button" style={styles.mapAction} onPress={() => { const destination = item.service.latitude !== undefined && item.service.longitude !== undefined ? `${item.service.latitude},${item.service.longitude}` : [item.service.physicalLocation, item.service.district, item.service.region, "Tanzania"].filter(Boolean).join(", "); void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`); }}>
            <Ionicons name="navigate-outline" size={16} color={colors.burgundy} />
            <Text style={styles.secondaryText}>{locale === "sw" ? "Fungua ramani" : "Open in map"}</Text>
          </Pressable> : null}
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: compareIds.includes(String(item.service._id)) }} onPress={() => setCompareIds((current) => current.includes(String(item.service._id)) ? current.filter((id) => id !== String(item.service._id)) : current.length < 3 ? [...current, String(item.service._id)] : current)}>
            <Text style={styles.compareText}>{compareIds.includes(String(item.service._id)) ? (locale === "sw" ? "Imechaguliwa kwa kulinganisha" : "Selected for comparison") : (locale === "sw" ? "Linganisha huduma hii" : "Compare this service")}</Text>
          </Pressable>
        </View>
      )) : !matching && services ? (
        <View style={styles.empty}>
          <Ionicons name="compass-outline" size={42} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{allPublicServices?.length === 0 ? (locale === "sw" ? "Timu ya LSF inaweza kukuelekeza" : "LSF can guide you") : (locale === "sw" ? "Hakuna huduma inayolingana sasa" : "No matching services yet")}</Text>
          <Text style={styles.emptyText}>
            {allPublicServices?.length === 0
              ? (locale === "sw" ? "Orodha ya huduma bado inaandaliwa. Piga LSF au tuma ombi ili upate maelekezo yanayofaa." : "The service directory is being prepared. Call LSF or send a request for guidance.")
              : (locale === "sw" ? "Badili eneo au aina ya tatizo, au omba msaada wa LSF." : "Change the location or issue, or ask LSF for help.")}
          </Text>
          {allPublicServices?.length ? <Button label={locale === "sw" ? "Badili eneo" : "Change location"} variant="secondary" onPress={() => { clearLocation(); setStage("search"); setCompareIds([]); }} /> : <Button label={locale === "sw" ? "Piga LSF" : "Call LSF"} variant="secondary" onPress={() => void Linking.openURL("tel:+255222601534")} />}
          <Button label={locale === "sw" ? "Omba LSF ikupangie" : "Let LSF match me"} onPress={startEscalation} />
        </View>
      ) : null}
      {!matching && list?.length === 0 && <PublicInformationLinks issue={issueCategory} />}
      {compared.length > 0 ? <View style={styles.comparePanel}>
        <Text style={styles.sectionTitle}>{locale === "sw" ? "Linganisha huduma" : "Compare services"} · {compared.length}/3</Text>
        <Text style={styles.compareMeta}>{compared.map((item) => item.service.name).join(" · ")}</Text>
        <Button label={locale === "sw" ? "Fungua ulinganishi" : "Open comparison"} onPress={() => router.push({ pathname: "/compare-services", params: { ids: compared.map((item) => item.service._id).join(",") } })} />
        <Button label={locale === "sw" ? "Futa ulinganishi" : "Clear comparison"} variant="quiet" onPress={() => setCompareIds([])} />
      </View> : null}
      </>}
    </Screen>
  );
}

function iconForType(typeName: string): keyof typeof Ionicons.glyphMap {
  if (typeName.includes("police") || typeName.includes("protection")) return "shield-checkmark-outline";
  if (typeName.includes("labour")) return "briefcase-outline";
  if (typeName.includes("land")) return "map-outline";
  if (typeName.includes("court")) return "scale-outline";
  if (typeName.includes("paralegal")) return "people-outline";
  return "business-outline";
}

const styles = StyleSheet.create({
  field: { gap: 4 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md, marginBottom: spacing.lg },
  backButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 18 },
  headerAction: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  hero: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 24 },
  heroCopy: { flex: 1, gap: 4 },
  heroIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  kicker: { fontFamily: type.medium, color: colors.teal, fontSize: 11, lineHeight: 17, letterSpacing: 0 },
  title: { fontFamily: type.semibold, color: colors.ink, fontSize: 25, lineHeight: 32, letterSpacing: 0 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 22 },
  formCard: { gap: 14 },
  formTitle: { fontFamily: type.semibold, color: colors.ink, fontSize: 18, lineHeight: 25 },
  label: { fontFamily: type.medium, color: colors.charcoal, fontSize: 14 },
  input: { minHeight: 50, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFCFD", paddingHorizontal: spacing.md, fontFamily: type.regular, color: colors.charcoal, fontSize: 14 },
  searchField: { minHeight: 54, borderRadius: 8, backgroundColor: "#F3F5F4", paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  searchInput: { flex: 1, minHeight: 50, fontFamily: type.regular, color: colors.charcoal, fontSize: 14 },
  filtersButton: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  filtersButtonText: { flex: 1, fontFamily: type.medium, color: colors.burgundy, fontSize: 14 },
  assurance: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md, paddingHorizontal: spacing.sm },
  assuranceText: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
  resultsHero: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.tealSoft },
  resultsIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  resultsCopy: { flex: 1, gap: 3 },
  resultsTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 17, lineHeight: 22 },
  resultsBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  editSearch: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md, paddingHorizontal: spacing.sm },
  editSearchText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 13 },
  filterToggle: { minHeight: 64, borderRadius: radius.md, backgroundColor: colors.tealSoft, padding: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  filterCopy: { flex: 1 }, filterTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 13 }, filterBody: { marginTop: 2, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  topicHeading: { fontFamily: type.medium, fontSize: 16, lineHeight: 24, color: colors.ink },
  issueGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  issueTile: { flexBasis: "46%", flexGrow: 1, minHeight: 64, borderRadius: 8, borderWidth: 1, borderColor: "transparent", padding: 10, flexDirection: "row", alignItems: "center", gap: 8 },
  issueTileActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundy },
  issueIcon: { width: 32, height: 32, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.74)", alignItems: "center", justifyContent: "center" },
  issueIconActive: { backgroundColor: "rgba(255,255,255,0.16)" },
  issueTileText: { flex: 1, fontFamily: type.medium, color: colors.ink, fontSize: 13, lineHeight: 20 },
  issueTileTextActive: { color: colors.surface },
  issueChip: { borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  issueChipActive: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  issueText: { fontFamily: type.bold, fontWeight: "700", color: colors.inkMuted, fontSize: 13 },
  issueTextActive: { color: colors.burgundy },
  sectionHeader: { marginTop: spacing.xl, marginBottom: spacing.md, gap: 3 },
  sectionTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 20 },
  sectionMeta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13 },
  loading: { marginTop: spacing.xl },
  card: { borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 20, gap: 12, marginBottom: 8 },
  cardTop: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12 },
  serviceIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  cardCopy: { flex: 1, gap: 3 },
  serviceName: { fontFamily: type.semibold, color: colors.charcoal, fontSize: 16, lineHeight: 23 },
  serviceMeta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13 },
  statePill: { overflow: "hidden", borderRadius: radius.pill, backgroundColor: colors.tealSoft, color: colors.teal, paddingHorizontal: spacing.sm, paddingVertical: 5, fontFamily: type.bold, fontWeight: "700", fontSize: 13, textTransform: "capitalize" },
  subhead: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
  reasonRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  reasonText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 18 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  chip: { overflow: "hidden", borderRadius: radius.pill, backgroundColor: "#FFF7FA", borderWidth: 1, borderColor: "#E8B8CC", paddingHorizontal: spacing.sm, paddingVertical: 4, fontFamily: type.medium, fontWeight: "500", color: colors.burgundy, fontSize: 13, textTransform: "capitalize" },
  actionRow: { flexDirection: "row", gap: spacing.sm },
  secondaryAction: { flex: 1, minHeight: 44, borderRadius: radius.pill, borderWidth: 1, borderColor: "#E8B8CC", alignItems: "center", justifyContent: "center" },
  secondaryText: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
  primaryAction: { flex: 1, minHeight: 44, borderRadius: radius.pill, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.xs },
  primaryText: { fontFamily: type.bold, fontWeight: "700", color: colors.surface, fontSize: 13 },
  empty: { alignItems: "center", gap: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl },
  emptyTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 18, textAlign: "center" },
  emptyText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20, textAlign: "center" },
  compareText: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13, textAlign: "center", paddingVertical: spacing.xs },
  mapAction: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: spacing.xs, paddingVertical: spacing.xs },
  comparePanel: { marginTop: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.softPink, borderWidth: 1, borderColor: "#E8B8CC", padding: spacing.lg, gap: spacing.md },
  compareRow: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs },
  compareName: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14 },
  compareMeta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  directoryTitle: { marginTop: 20, fontFamily: type.editorial, color: colors.ink, fontSize: 24, lineHeight: 30 },
  directoryFilters: { marginTop: 15, gap: 10 },
  filterTrigger: { minHeight: 49, paddingHorizontal: 13, borderRadius: 9, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", gap: 10 },
  filterTriggerText: { flex: 1, fontFamily: type.medium, color: colors.burgundy, fontSize: 14 },
  locationRow: { flexDirection: "row", gap: 10 },
  locationInput: { flex: 1, minWidth: 0 },
  filterLabel: { marginTop: 6, fontFamily: type.semibold, fontSize: 13, color: colors.ink },
  providerWrap: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  providerChip: { minHeight: 36, paddingHorizontal: 11, borderRadius: 8, backgroundColor: colors.surface, justifyContent: "center" },
  providerChipActive: { backgroundColor: colors.burgundy },
  providerText: { fontFamily: type.medium, fontSize: 12, color: colors.ink },
  providerTextActive: { color: colors.surface },
  reset: { minHeight: 38, flexDirection: "row", alignItems: "center", gap: 5 },
  resetText: { fontFamily: type.medium, color: colors.burgundy, fontSize: 13 },
  providerLabel: { fontFamily: type.medium, color: colors.teal, fontSize: 12 },
  paralegalLink: { minHeight: 49, marginTop: 10, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, borderRadius: 9, backgroundColor: colors.tealSoft },
  paralegalText: { flex: 1, fontFamily: type.semibold, color: colors.teal, fontSize: 13 },
});

export default FindServicesScreen;
