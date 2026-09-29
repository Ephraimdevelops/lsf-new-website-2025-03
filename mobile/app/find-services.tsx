import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Linking } from "react-native";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { useIntakeDraft } from "../src/intake/IntakeDraftContext";
import { colors, radius, spacing, type } from "../src/theme";

const issueOptions = [
  { key: "employment", sw: "Ajira", en: "Work", icon: "briefcase-outline", tone: "#FFF0E6" },
  { key: "land", sw: "Ardhi", en: "Land", icon: "home-outline", tone: "#E8F4ED" },
  { key: "family", sw: "Familia", en: "Family", icon: "people-outline", tone: "#F8EAF0" },
  { key: "safety", sw: "Usalama", en: "Safety", icon: "shield-checkmark-outline", tone: "#F2EAFB" },
  { key: "consumer", sw: "Mlaji", en: "Consumer", icon: "wallet-outline", tone: "#FFF7DA" },
] as const;

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

export default function FindServicesScreen() {
  const { locale } = useLanguage();
  const { updateDraft } = useIntakeDraft();
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [search, setSearch] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [openOnly, setOpenOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [stage, setStage] = useState<"search" | "results">("search");
  const [matching, setMatching] = useState(false);
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
    score: number;
    whySuitable: string[];
    whatToPrepare: string[];
  }> | null>(null);
  const services = useQuery(api.justiceServices.listPublicServices, {
    region: region.trim() || undefined,
    district: district.trim() || undefined,
    issueCategory: issueCategory || undefined,
    search: search.trim() || undefined,
  });
  const allPublicServices = useQuery(api.justiceServices.listPublicServices, stage === "results" ? {} : "skip");
  const matchServices = useMutation(api.justiceServices.matchServices);

  async function runMatch() {
    setStage("results");
    if (search.trim()) {
      // Keyword searches use the verified directory query; the matcher does not accept a keyword.
      setRecommendations(null);
      setMatchError("");
      setMatching(false);
      return;
    }
    setMatching(true);
    setMatchError("");
    try {
      const result = await matchServices({
        source: "directory",
        ordinaryProblem: issueCategory || undefined,
        issueCategory: issueCategory || undefined,
        region: region.trim() || undefined,
        district: district.trim() || undefined,
        urgency: "standard",
      });
      setRecommendations(result.recommendations as typeof recommendations);
    } catch {
      setMatchError(locale === "sw" ? "Ulinganishi haujakamilika. Huduma zilizothibitishwa bado zinaonyeshwa hapa chini." : "Matching could not finish. Verified services are still shown below.");
      setRecommendations(null);
    } finally {
      setMatching(false);
    }
  }

  const unfilteredList = recommendations ?? services?.map((service) => ({
    service,
    score: 0,
    whySuitable: [locale === "sw" ? "Huduma imethibitishwa" : "Verified public service"],
    whatToPrepare: [],
  }));
  const list = unfilteredList?.filter((item) => !openOnly || item.service.currentIntakeState === "open");
  const compared = list?.filter((item) => compareIds.includes(String(item.service._id))) ?? [];
  function startEscalation() {
    updateDraft({
      issueCategory: issueCategory ? issueCategory as "employment" | "land" | "family" | "safety" | "consumer" : undefined,
      sourceServiceId: undefined,
      region: region.trim(),
      district: district.trim(),
    });
    router.push("/intake");
  }

  const selectedIssue = issueOptions.find((issue) => issue.key === issueCategory);
  const searchSummary = [selectedIssue?.[locale], search.trim(), district.trim(), region.trim()].filter(Boolean).join(" · ");

  return (
    <Screen key={stage}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Go back"} onPress={() => stage === "results" ? setStage("search") : router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{stage === "results" ? (locale === "sw" ? "Matokeo ya huduma" : "Service results") : (locale === "sw" ? "Tafuta msaada" : "Find Help")}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Msaada uliohifadhi" : "Saved Help"} style={styles.headerAction} onPress={() => router.push("/saved-services")}>
          <Ionicons name="bookmark-outline" size={19} color={colors.burgundy} />
        </Pressable>
      </View>

      {stage === "search" ? <>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.kicker}>{locale === "sw" ? "HUDUMA ZILIZOTHIBITISHWA" : "VERIFIED SUPPORT"}</Text>
          <Text style={styles.title}>{locale === "sw" ? "Pata msaada karibu nawe." : "Find help near you."}</Text>
          <Text style={styles.body}>{locale === "sw" ? "Chagua tatizo lako au tafuta huduma. Unaweza kuongeza eneo ili kupata huduma zinazokufaa." : "Choose your issue or search for a service. Add a location to find a closer match."}</Text>
        </View>
        <View style={styles.heroIcon}><Ionicons name="search" size={25} color={colors.surface} /></View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>{locale === "sw" ? "Unahitaji msaada gani?" : "What do you need help with?"}</Text>
        <View style={styles.issueGrid}>
          {issueOptions.map((issue) => (
            <Pressable key={issue.key} accessibilityRole="button" accessibilityState={{ selected: issueCategory === issue.key }} accessibilityLabel={issue[locale]} style={[styles.issueTile, { backgroundColor: issue.tone }, issueCategory === issue.key && styles.issueTileActive]} onPress={() => { setIssueCategory(issueCategory === issue.key ? "" : issue.key); setRecommendations(null); }}>
              <View style={[styles.issueIcon, issueCategory === issue.key && styles.issueIconActive]}><Ionicons name={issue.icon} size={22} color={issueCategory === issue.key ? colors.surface : colors.burgundy} /></View>
              <Text style={[styles.issueTileText, issueCategory === issue.key && styles.issueTileTextActive]}>{issue[locale]}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>{locale === "sw" ? "Tafuta kwa jina au huduma" : "Search by name or service"}</Text>
        <View style={styles.searchField}><Ionicons name="search-outline" size={20} color={colors.inkMuted} /><TextInput accessibilityLabel={locale === "sw" ? "Tafuta kwa jina au huduma" : "Search by name or service"} value={search} onChangeText={(value) => { setSearch(value); setRecommendations(null); }} placeholder={locale === "sw" ? "Mfano: msaada wa ajira" : "Example: employment support"} placeholderTextColor={colors.inkMuted} style={styles.searchInput} returnKeyType="search" onSubmitEditing={() => void runMatch()} /></View>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: showFilters }} style={styles.filtersButton} onPress={() => setShowFilters((current) => !current)}>
          <Ionicons name="options-outline" size={20} color={colors.burgundy} />
          <Text style={styles.filtersButtonText}>{locale === "sw" ? "Eneo na vichujio" : "Location and filters"}{region.trim() ? ` · ${region.trim()}` : ""}</Text>
          <Ionicons name={showFilters ? "chevron-up" : "chevron-down"} size={18} color={colors.burgundy} />
        </Pressable>
        {showFilters ? <>
          <Text style={styles.label}>{locale === "sw" ? "Mkoa (si lazima)" : "Region (optional)"}</Text>
          <TextInput accessibilityLabel={locale === "sw" ? "Mkoa" : "Region"} value={region} onChangeText={(value) => { setRegion(value); setRecommendations(null); }} placeholder={locale === "sw" ? "Mfano: Dar es Salaam" : "Example: Dar es Salaam"} placeholderTextColor={colors.inkMuted} style={styles.input} />
          <Text style={styles.label}>{locale === "sw" ? "Wilaya (si lazima)" : "District (optional)"}</Text>
          <TextInput accessibilityLabel={locale === "sw" ? "Wilaya" : "District"} value={district} onChangeText={(value) => { setDistrict(value); setRecommendations(null); }} placeholder={locale === "sw" ? "Mfano: Ilala" : "Example: Ilala"} placeholderTextColor={colors.inkMuted} style={styles.input} />
          <Pressable accessibilityRole="switch" accessibilityState={{ checked: openOnly }} style={styles.filterToggle} onPress={() => setOpenOnly((current) => !current)}><View style={styles.filterCopy}><Text style={styles.filterTitle}>{locale === "sw" ? "Zinazopokea maombi sasa" : "Accepting requests now"}</Text><Text style={styles.filterBody}>{locale === "sw" ? "Ficha huduma zilizofungwa au zenye nafasi chache." : "Hide closed and limited services."}</Text></View><Ionicons name={openOnly ? "toggle" : "toggle-outline"} size={34} color={openOnly ? colors.teal : colors.inkMuted} /></Pressable>
        </> : null}
        <Button label={matching ? (locale === "sw" ? "Inatafuta..." : "Matching...") : (locale === "sw" ? "Tafuta huduma inayofaa" : "Find suitable services")} loading={matching} disabled={matching} onPress={() => void runMatch()} />
        {matchError ? <Text accessibilityRole="alert" style={styles.body}>{matchError}</Text> : null}
      </View>
      <View style={styles.assurance}><Ionicons name="shield-checkmark-outline" size={18} color={colors.teal} /><Text style={styles.assuranceText}>{locale === "sw" ? "Huduma za umma zilizothibitishwa pekee. Huhitaji akaunti ili kutafuta." : "Only verified public services. No account needed to explore."}</Text></View>
      <Pressable accessibilityRole="button" style={styles.editSearch} onPress={() => router.push("/paralegals")}><Ionicons name="people-outline" size={18} color={colors.burgundy} /><Text style={styles.editSearchText}>{locale === "sw" ? "Tafuta paralegal aliyethibitishwa" : "Find a verified paralegal"}</Text><Ionicons name="arrow-forward" size={16} color={colors.burgundy} /></Pressable>
      </> : <>
      <View style={styles.resultsHero}>
        <View style={styles.resultsIcon}><Ionicons name={list?.length === 0 ? "search-outline" : "checkmark-circle-outline"} size={25} color={colors.teal} /></View>
        <View style={styles.resultsCopy}><Text style={styles.resultsTitle}>{matching || !services ? (locale === "sw" ? "Tunatafuta huduma..." : "Finding services...") : allPublicServices?.length === 0 ? (locale === "sw" ? "Hakuna huduma zilizochapishwa" : "No published services") : list?.length === 0 ? (locale === "sw" ? "Hakuna huduma inayolingana" : "No matching services") : (locale === "sw" ? "Hizi ndizo huduma zinazopatikana" : "Here are available services")}</Text><Text style={styles.resultsBody}>{searchSummary || (locale === "sw" ? "Huduma zote zilizothibitishwa" : "All verified public services")}</Text></View>
      </View>
      <Pressable accessibilityRole="button" style={styles.editSearch} onPress={() => setStage("search")}><Ionicons name="options-outline" size={18} color={colors.burgundy} /><Text style={styles.editSearchText}>{locale === "sw" ? "Badili tatizo, eneo au vichujio" : "Edit issue, location or filters"}</Text></Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{locale === "sw" ? "Matokeo" : "Results"}{!matching && list ? ` (${list.length})` : ""}</Text>
        <Text style={styles.sectionMeta}>{locale === "sw" ? "Yaliyothibitishwa na salama kuonyesha" : "Verified and safe to show"}</Text>
      </View>

      {(!services || matching) ? <ActivityIndicator color={colors.burgundy} style={styles.loading} /> : null}

      {!matching && list?.length ? list.map((item) => (
        <View key={String(item.service._id)} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.serviceIcon}>
              <Ionicons name={iconForType(item.service.servicePointType)} size={22} color={colors.burgundy} />
            </View>
            <View style={styles.cardCopy}>
              <Text style={styles.serviceName}>{item.service.name}</Text>
              <Text style={styles.serviceMeta}>{item.service.district}, {item.service.region}</Text>
            </View>
            <Text style={styles.statePill}>{intakeLabel(item.service.currentIntakeState, locale)}</Text>
          </View>
          <Text style={styles.subhead}>{locale === "sw" ? "Kwa nini inaweza kufaa" : "Why this may fit"}</Text>
          {item.whySuitable.slice(0, 3).map((reason) => (
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
            <Pressable style={styles.secondaryAction} onPress={() => router.push({ pathname: "/service/[id]", params: { id: String(item.service._id) } })}>
              <Text style={styles.secondaryText}>{locale === "sw" ? "Maelezo" : "Details"}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.primaryAction} onPress={() => { updateDraft({ issueCategory: issueCategory ? issueCategory as "employment" | "land" | "family" | "safety" | "consumer" : undefined, sourceServiceId: String(item.service._id), region: item.service.region, district: item.service.district }); router.push("/intake"); }}>
              <Text style={styles.primaryText}>{locale === "sw" ? "Omba msaada" : "Request help"}</Text>
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
          <Text style={styles.emptyTitle}>{allPublicServices?.length === 0 ? (locale === "sw" ? "Huduma zilizothibitishwa bado hazijachapishwa" : "No verified services are published yet") : (locale === "sw" ? "Hakuna huduma inayolingana sasa" : "No matching services yet")}</Text>
          <Text style={styles.emptyText}>
            {allPublicServices?.length === 0
              ? (locale === "sw" ? "LSF bado haijachapisha rekodi za huduma zilizokaguliwa. Unaweza kutuma ombi salama ili timu ikusaidie." : "LSF has not published reviewed service records. You can still send a private request for help.")
              : (locale === "sw" ? "Jaribu eneo au tatizo jingine, au tuma ombi salama ili LSF ikusaidie." : "Try a different location or issue, or send a private request so LSF can help.")}
          </Text>
          {allPublicServices?.length ? <Button label={locale === "sw" ? "Futa vichujio" : "Clear filters"} variant="secondary" onPress={() => { setRegion(""); setDistrict(""); setSearch(""); setIssueCategory(""); setOpenOnly(false); setRecommendations(null); setCompareIds([]); setStage("search"); }} /> : null}
          <Button label={locale === "sw" ? "Omba LSF ikupangie" : "Let LSF match me"} onPress={startEscalation} />
        </View>
      ) : null}
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
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md, marginBottom: spacing.lg },
  backButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 18 },
  headerAction: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  hero: { flexDirection: "row", alignItems: "flex-start", borderRadius: 24, backgroundColor: colors.tealSoft, padding: spacing.lg, gap: spacing.md, marginBottom: spacing.md, overflow: "hidden" },
  heroCopy: { flex: 1, gap: 4 },
  heroIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  kicker: { fontFamily: type.bold, fontWeight: "700", color: colors.teal, fontSize: 11, letterSpacing: 1.1 },
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 23, lineHeight: 28, letterSpacing: -0.6 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  formCard: { borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.md, gap: spacing.sm },
  formTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 18, marginBottom: spacing.xs },
  label: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 13 },
  input: { minHeight: 50, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFCFD", paddingHorizontal: spacing.md, fontFamily: type.regular, color: colors.charcoal, fontSize: 14 },
  searchField: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFCFD", paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  searchInput: { flex: 1, minHeight: 50, fontFamily: type.regular, color: colors.charcoal, fontSize: 14 },
  filtersButton: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.sm, borderRadius: radius.md, backgroundColor: colors.burgundySoft },
  filtersButtonText: { flex: 1, fontFamily: type.bold, color: colors.burgundy, fontSize: 13 },
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
  issueGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.xs },
  issueTile: { width: "31%", minHeight: 70, borderRadius: radius.md, borderWidth: 1, borderColor: "transparent", padding: spacing.xs, alignItems: "center", justifyContent: "center", gap: 4 },
  issueTileActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundy },
  issueIcon: { width: 32, height: 32, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.74)", alignItems: "center", justifyContent: "center" },
  issueIconActive: { backgroundColor: "rgba(255,255,255,0.16)" },
  issueTileText: { fontFamily: type.bold, color: colors.ink, fontSize: 12, textAlign: "center" },
  issueTileTextActive: { color: colors.surface },
  issueChip: { borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  issueChipActive: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  issueText: { fontFamily: type.bold, fontWeight: "700", color: colors.inkMuted, fontSize: 13 },
  issueTextActive: { color: colors.burgundy },
  sectionHeader: { marginTop: spacing.xl, marginBottom: spacing.md, gap: 3 },
  sectionTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 20 },
  sectionMeta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13 },
  loading: { marginTop: spacing.xl },
  card: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.md, marginBottom: spacing.md },
  cardTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  serviceIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  cardCopy: { flex: 1, gap: 3 },
  serviceName: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 15, lineHeight: 20 },
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
});
