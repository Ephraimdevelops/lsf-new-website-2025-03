import { BrandLoading } from '../src/components/BrandLoading';
import { SearchFilters } from "../src/components/SearchFilters";
import { IntakeSelect } from "../src/intake/IntakeSelect";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePublicDirectoryQuery } from "../src/backend/usePublicDirectoryQuery";
import { DirectoryConnectionError } from "../src/components/DirectoryConnectionError";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { CivicPageHeader } from "../src/components/CivicPageHeader";
import { Screen } from "../src/components/Screen";
import { ProviderThumbnail } from "../src/components/ProviderThumbnail";
import { CivicObject } from "../src/components/CivicObject";
import { directoryLabel } from "../src/directoryLabels";
import { regionOptions, districtOptions } from "../src/regionOptions";
import { useLanguage } from "../src/i18n";
import { colors, type } from "../src/theme";

const providers: { key: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "all", icon: "apps-outline" },
  { key: "paralegal", icon: "people-outline" },
  { key: "legal_aid_provider", icon: "scale-outline" },
  { key: "government_office", icon: "business-outline" },
  { key: "local_government", icon: "home-outline" },
  { key: "police_gender_children_desk", icon: "shield-outline" },
  { key: "social_welfare", icon: "heart-outline" },
  { key: "court_or_tribunal", icon: "library-outline" },
  { key: "labour_service", icon: "briefcase-outline" },
  { key: "land_service", icon: "map-outline" },
  { key: "cso", icon: "people-circle-outline" },
  { key: "protection_service", icon: "shield-checkmark-outline" },
  { key: "mediation", icon: "chatbubbles-outline" },
  { key: "partner_organisation", icon: "business-outline" },
  { key: "other", icon: "ellipsis-horizontal-outline" },
];

const normalize = (value?: string) => value?.trim().toLowerCase() ?? "";

export default function NearbyHelpScreen() {
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const { data: services, failed, retry } = usePublicDirectoryQuery(api.justiceServices.listPublicServices, {});
  const [search, setSearch] = useState("");
  const [providerType, setProviderType] = useState("all");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const locationLabel = [ward, district, region].filter(Boolean).join(", ");
  const hasFilters = !!(search || locationLabel || providerType !== "all");
  const filtered = services?.filter((service) => {
    if (providerType !== "all" && service.servicePointType !== providerType) return false;
    if (region && ![service.region, ...service.serviceCoverageRegions].some((value) => normalize(value).includes(normalize(region)))) return false;
    if (district && !normalize(service.district).includes(normalize(district))) return false;
    if (ward && ![service.ward, service.physicalLocation].some((value) => normalize(value).includes(normalize(ward)))) return false;
    return !search || [service.name, service.organizationName, service.region, service.district, service.ward, directoryLabel(service.servicePointType, sw)].some((value) => normalize(value).includes(normalize(search)));
  });

  function clearFilters() {
    setSearch(""); setRegion(""); setDistrict(""); setWard(""); setProviderType("all");
  }
  function openExternal(url: string) {
    void Linking.openURL(url).catch(() => Alert.alert(sw ? "Imeshindikana kufungua" : "Unable to open", sw ? "Jaribu tena kwenye kifaa kinachoweza kutumia huduma hii." : "Please try again on a device that supports this service."));
  }

  return <Screen>
    <CivicPageHeader title={sw ? "Msaada karibu" : "Nearby help"} subtitle={sw ? "Tafuta huduma na watu katika eneo lako." : "Find services and people in your area."} back backLabel={sw ? "Rudi" : "Back"} onBack={() => router.back()} actionIcon="bookmark-outline" actionLabel={sw ? "Huduma zilizohifadhiwa" : "Saved services"} onAction={() => router.push("/saved-services")} />

    <SearchFilters value={search} onChange={setSearch} placeholder={sw ? "Tafuta huduma" : "Find help"} sw={sw} label={sw ? "Eneo" : "Area"} title={sw ? "Eneo na msaada" : "Area and help"} count={Number(!!region) + Number(!!district) + Number(!!ward) + Number(providerType !== "all")} summary={[locationLabel, providerType !== "all" ? directoryLabel(providerType, sw) : ""].filter(Boolean).join(" · ")} onReset={() => { setRegion(""); setDistrict(""); setWard(""); setProviderType("all"); }}>
      <IntakeSelect label={sw ? "Mkoa" : "Region"} value={region} options={[{ value: "", label: sw ? "Mikoa yote" : "All regions" }, ...regionOptions]} onChange={value => { setRegion(value); setDistrict(""); setWard(""); }} sw={sw} />
      <IntakeSelect label={sw ? "Wilaya" : "District"} value={district} disabled={!region} options={[{ value: "", label: sw ? "Wilaya zote" : "All districts" }, ...districtOptions(region, services ?? [], district)]} onChange={value => { setDistrict(value); setWard(""); }} sw={sw} allowCustom />
      <View style={styles.field}><Text style={styles.fieldLabel}>{sw ? "Kata au mtaa" : "Ward or street"}</Text><TextInput accessibilityLabel={sw ? "Kata au mtaa" : "Ward or street"} value={ward} onChangeText={setWard} placeholder={sw ? "Si lazima" : "Optional"} placeholderTextColor={colors.inkMuted} style={styles.locationInput} /></View>
      <IntakeSelect label={sw ? "Aina ya msaada" : "Type of help"} value={providerType} onChange={setProviderType} sw={sw} options={providers.map(item => ({ value: item.key, label: item.key === "all" ? (sw ? "Huduma zote" : "All services") : directoryLabel(item.key, sw) }))} />
    </SearchFilters>
    {hasFilters ? <Pressable accessibilityRole="button" onPress={clearFilters} style={styles.reset}><Text style={styles.resetText}>{sw ? "Futa yote" : "Clear all"}</Text></Pressable> : null}

    <Pressable accessibilityRole="button" style={styles.paralegalLink} onPress={() => router.push("/paralegals")}><View style={styles.paralegalIcon}><Ionicons name="people-outline" size={22} color={colors.teal} /></View><View style={styles.linkCopy}><Text style={styles.linkTitle}>{sw ? "Msaidizi wa kisheria wa jamii" : "Community paralegals"}</Text><Text style={styles.linkSubtitle}>{sw ? "Tafuta msaidizi aliyethibitishwa" : "Find a verified support provider"}</Text></View><Ionicons name="arrow-forward" size={19} color={colors.teal} /></Pressable>

    {failed ? <DirectoryConnectionError sw={sw} retry={retry} /> : services === undefined ? <View style={styles.loading}><BrandLoading compact text={sw ? "Tunapakua huduma..." : "Loading services..."}/></View> : filtered?.length ? <>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{sw ? "Huduma zinazopatikana" : "Available services"}</Text><Text style={styles.count}>{filtered.length}</Text></View>
      {filtered.map((service) => <View key={String(service._id)} style={styles.service}>
        <Pressable accessibilityRole="button" accessibilityLabel={service.name} onPress={() => router.push({ pathname: "/service/[id]", params: { id: String(service._id) } })} style={({ pressed }) => [styles.serviceMain, pressed && styles.pressed]}>
          <ProviderThumbnail kind={service.servicePointType} name={service.name} />
          <View style={styles.serviceCopy}><Text style={styles.serviceType}>{directoryLabel(service.servicePointType, sw)}</Text><Text style={styles.serviceName}>{service.name}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
        </Pressable>
        <View style={styles.serviceDetails}><View style={styles.locationLine}><Ionicons name="location-outline" size={14} color={colors.inkMuted} /><Text style={styles.locationText}>{[service.ward, service.district, service.region].filter(Boolean).join(", ")}</Text></View><View style={styles.availability}><View style={[styles.dot, service.currentIntakeState !== "open" && styles.dotMuted]} /><Text style={styles.availabilityText}>{directoryLabel(service.currentIntakeState, sw)}</Text><Ionicons name="checkmark-circle-outline" size={13} color={colors.teal} /><Text style={styles.verifiedText}>{sw ? "Imethibitishwa" : "Verified"}</Text></View></View>
        {(service.phone || service.physicalLocation || service.latitude !== undefined && service.longitude !== undefined) ? <View style={styles.serviceActions}>{service.phone ? <Pressable accessibilityRole="button" style={styles.serviceAction} onPress={() => openExternal(`tel:${service.phone!.replace(/\s+/g, "")}`)}><Ionicons name="call-outline" size={17} color={colors.burgundy} /><Text style={styles.serviceActionText}>{sw ? "Piga simu" : "Call"}</Text></Pressable> : null}{(service.physicalLocation || service.latitude !== undefined && service.longitude !== undefined) ? <Pressable accessibilityRole="button" style={styles.serviceAction} onPress={() => { const destination = service.latitude !== undefined && service.longitude !== undefined ? `${service.latitude},${service.longitude}` : [service.physicalLocation, service.district, service.region, "Tanzania"].filter(Boolean).join(", "); openExternal(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`); }}><Ionicons name="navigate-outline" size={17} color={colors.teal} /><Text style={[styles.serviceActionText, styles.tealText]}>{sw ? "Maelekezo" : "Directions"}</Text></Pressable> : null}</View> : null}
      </View>)}
    </> : <View style={styles.empty}>
      <CivicObject kind="empty" size={104} />
      <Text style={styles.emptyTitle}>{services.length === 0 ? (sw ? "Tukusaidie kupata pa kwenda." : "Let us help you find a way forward.") : (sw ? "Jaribu eneo au huduma nyingine." : "Try another area or provider.")}</Text>
      <Text style={styles.emptyBody}>{services.length === 0 ? (sw ? "Hakuna huduma zilizochapishwa kwa sasa. Unaweza kutuma ombi kwa LSF ili upate maelekezo." : "There are no published services yet. Send a request to LSF for guidance.") : (sw ? "Hakuna huduma inayolingana na vichujio vyako kwa sasa." : "No services match your filters right now.")}</Text>
      <Button label={services.length === 0 ? (sw ? "Omba msaada wa LSF" : "Request LSF support") : (sw ? "Onyesha huduma zote" : "Show all services")} style={styles.button} onPress={services.length === 0 ? () => router.push("/intake") : clearFilters} />
      <Pressable accessibilityRole="button" style={styles.callLsf} onPress={() => openExternal("tel:+255870119363")}><Ionicons name="call-outline" size={18} color={colors.burgundy} /><Text style={styles.resetText}>{sw ? "Piga LSF" : "Call LSF"}</Text></Pressable>
    </View>}

  </Screen>;
}

const styles = StyleSheet.create({
  search: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 52, paddingHorizontal: 14, borderRadius: 10, backgroundColor: "#F5F4F4" },
  searchInput: { flex: 1, minWidth: 0, minHeight: 50, fontFamily: type.regular, color: colors.ink, fontSize: 14 },
  clear: { width: 32, minHeight: 44, alignItems: "center", justifyContent: "center" },
  filters: { flexDirection: "row", gap: 9, marginTop: 10 },
  filterButton: { flex: 1, minWidth: 0, minHeight: 48, flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 11, borderRadius: 8, backgroundColor: "#F5F4F4" },
  filterActive: { backgroundColor: colors.burgundySoft },
  filterText: { flex: 1, fontFamily: type.medium, fontSize: 12, color: colors.ink },
  filterSummary: { minHeight: 42, flexDirection: "row", alignItems: "center", gap: 10 },
  filterSummaryText: { flex: 1, fontFamily: type.regular, fontSize: 12, color: colors.inkMuted },
  reset: { minHeight: 42, justifyContent: "center" },
  resetText: { fontFamily: type.medium, fontSize: 13, color: colors.burgundy },
  paralegalLink: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 88, marginTop: 17 },
  paralegalIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: "#EEF5F3", alignItems: "center", justifyContent: "center" },
  linkCopy: { flex: 1, gap: 3 },
  linkTitle: { fontFamily: type.semibold, color: colors.ink, fontSize: 14 },
  linkSubtitle: { fontFamily: type.regular, fontSize: 12, color: colors.inkMuted, lineHeight: 18 },
  sectionHeader: { marginTop: 20, marginBottom: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { flex: 1, fontFamily: type.semibold, fontSize: 17, color: colors.ink },
  count: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  service: { borderRadius: 18, backgroundColor: "#F7F6F6", padding: 16, marginBottom: 13 },
  serviceMain: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  serviceIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: "#EAF2EF", alignItems: "center", justifyContent: "center" },
  serviceCopy: { flex: 1, gap: 4 },
  serviceType: { fontFamily: type.regular, fontSize: 11, color: colors.inkMuted, lineHeight: 16 },
  serviceName: { fontFamily: type.semibold, color: colors.ink, fontSize: 15, lineHeight: 22 },
  serviceDetails: { marginTop: 14, gap: 9 },
  locationLine: { flexDirection: "row", alignItems: "center", gap: 5 },
  locationText: { flex: 1, fontFamily: type.regular, fontSize: 12, lineHeight: 18, color: colors.inkMuted },
  availability: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.teal },
  dotMuted: { backgroundColor: colors.inkMuted },
  availabilityText: { fontFamily: type.regular, fontSize: 11, color: colors.inkMuted, marginRight: 7 },
  verifiedText: { fontFamily: type.regular, fontSize: 11, color: colors.teal },
  serviceActions: { flexDirection: "row", gap: 14, marginTop: 10 },
  serviceAction: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 6 },
  serviceActionText: { fontFamily: type.medium, fontSize: 12, color: colors.burgundy },
  tealText: { color: colors.teal },
  empty: { paddingTop: 26, paddingBottom: 12 },
  emptyIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: "#EEF5F3", alignItems: "center", justifyContent: "center", marginBottom: 17 },
  emptyTitle: { fontFamily: type.editorial, color: colors.ink, fontSize: 24, lineHeight: 31 },
  emptyBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 22, marginTop: 9 },
  button: { marginTop: 24, borderRadius: 10 },
  callLsf: { minHeight: 49, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 7 },
  loading: { minHeight: 180, justifyContent: "center", alignItems: "center", gap: 12 },
  muted: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13 },
  pressed: { opacity: 0.65 },
  modalRoot: { flex: 1, justifyContent: "flex-end" },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(22,18,21,0.28)" },
  sheet: { maxHeight: "84%", backgroundColor: colors.surface, borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingHorizontal: 24, paddingBottom: 8 },
  sheetHandle: { width: 34, height: 4, borderRadius: 2, backgroundColor: "#D7D1D4", alignSelf: "center", marginTop: 12, marginBottom: 10 },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 },
  sheetTitle: { flex: 1, fontFamily: type.editorial, fontSize: 24, color: colors.ink },
  closeButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  providerSearch: { flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 12, backgroundColor: "#F5F4F4", borderRadius: 8, marginBottom: 10 },
  providerList: { flexShrink: 1 },
  noProviders: { paddingVertical: 24, fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.inkMuted },
  providerRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 54, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 8 },
  providerSelected: { backgroundColor: colors.burgundySoft },
  providerLabel: { flex: 1, fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.ink },
  providerLabelSelected: { fontFamily: type.medium, color: colors.burgundy },
  locationForm: { paddingBottom: 10, gap: 16 },
  sheetSubtitle: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.inkMuted, marginBottom: 5 },
  field: { gap: 7 },
  fieldLabel: { fontFamily: type.medium, color: colors.ink, fontSize: 13 },
  locationInput: { minHeight: 50, borderRadius: 8, paddingHorizontal: 14, backgroundColor: "#F5F4F4", fontFamily: type.regular, fontSize: 14, color: colors.ink },
  sheetButton: { marginTop: 8, borderRadius: 10 },
});
