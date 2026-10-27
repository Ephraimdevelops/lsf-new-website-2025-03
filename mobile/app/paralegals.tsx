import { BrandLoading } from '../src/components/BrandLoading';
import ServiceMap from "../src/location/ServiceMap";
import { NearbySearch, type SearchPoint } from "../src/location/NearbySearch";
import { SearchFilters } from "../src/components/SearchFilters";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "convex/react";
import { usePublicDirectoryQuery } from "../src/backend/usePublicDirectoryQuery";
import { DirectoryConnectionError } from "../src/components/DirectoryConnectionError";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { CivicIllustration } from "../src/components/CivicIllustration";
import { CivicObject } from "../src/components/CivicObject";
import { CivicPageHeader } from "../src/components/CivicPageHeader";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { IntakeSelect } from "../src/intake/IntakeSelect";
import { colors, type } from "../src/theme";
import { ProviderThumbnail } from "../src/components/ProviderThumbnail";
import { matchesParalegal, paralegalAvailabilityLabel } from "../src/paralegalDirectory";

export default function ParalegalsScreen() {
  const [mapVisible, setMapVisible] = useState(false);
  const [origin, setOrigin] = useState<SearchPoint>();
  const [radiusKm, setRadius] = useState<number>();
  const [refresh, setRefresh] = useState(0);
  useEffect(() => { const timer = setInterval(() => setRefresh(v => v + 1), 30_000); return () => clearInterval(timer); }, []);
  const { locale } = useLanguage();
  const sw = locale === "sw";
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [acceptingOnly, setAcceptingOnly] = useState(false);
  const { data: records, failed, retry } = usePublicDirectoryQuery(api.paralegals.listApprovedParalegals, { verifiedOnly: true, origin: origin ? { latitude: origin.latitude, longitude: origin.longitude } : undefined, radiusKm, refresh });
  const incrementProfileViews = useMutation(api.paralegals.incrementProfileViews);
  const regions = useMemo(() => [...new Set((records ?? []).map(item => item.region).filter(Boolean))].sort(), [records]);
  const filtered = useMemo(() => (records ?? []).filter(item => matchesParalegal(item, query, region, acceptingOnly)), [records, query, region, acceptingOnly]);

  function openProfile(item: NonNullable<typeof records>[number]) {
    void incrementProfileViews({ id: item._id }).catch(() => {});
    router.push({ pathname: "/paralegal-profile", params: {
      name: item.fullName, district: item.district, region: item.region, phone: item.phone ?? "",
      specialties: (item.specializations ?? []).join(","), languages: (item.languages ?? []).join(","),
      bio: item.bio ?? "", photoUri: item.photoUrl ?? "", availability: item.availabilityStatus ?? "unknown", verified: item.isVerified ? "true" : "false",
    } });
  }
  async function contact(phone: string, method: "tel" | "sms") {
    try { await Linking.openURL(method + ":" + phone.replace(/\s+/g, "")); }
    catch { Alert.alert(sw ? "Huduma haijafunguka" : "Could not open this service", (sw ? "Unaweza kutumia namba hii: " : "You can use this number: ") + phone); }
  }
  const reset = () => { setQuery(""); setRegion(""); setAcceptingOnly(false); };

  return <Screen>
    <CivicPageHeader back compact title={sw ? "Tafuta msaidizi wa kisheria" : "Find a paralegal"} />
    <View style={styles.intro}><View style={styles.copy}><Text style={styles.heading}>{sw ? "Msaada wa mtu kwa mtu." : "Help, person to person."}</Text><Text style={styles.body}>{sw ? "Tafuta msaidizi wa sheria kwenye mtandao uliothibitishwa wa LSF." : "Find legal support in LSF's verified network."}</Text></View><CivicIllustration pose="welcome" size={104} /></View>
    <NearbySearch sw={sw} origin={origin} radiusKm={radiusKm} onChange={(point, radius) => { if (point && point !== origin) setRegion(""); setOrigin(point); setRadius(radius); }} />
    <Pressable accessibilityRole="button" style={{ minHeight: 48 }} onPress={() => setMapVisible(v => !v)}><Text style={styles.linkText}>{mapVisible ? (sw ? "Ficha ramani" : "Hide map") : (sw ? "Ofisi za mikutano kwenye ramani" : "Meeting offices on map")}</Text></Pressable>
    {mapVisible && <ServiceMap sw={sw} places={filtered.flatMap(item => item.meetingPoint ? [{ id: String(item._id), name: item.fullName + " · " + item.meetingPoint.name, latitude: item.meetingPoint.latitude, longitude: item.meetingPoint.longitude }] : [])} onSelect={id => { const item = filtered.find(p => String(p._id) === id); if (item) openProfile(item); }} />}
    <SearchFilters value={query} onChange={setQuery} placeholder={sw ? "Tafuta jina au msaada" : "Find a name or help"} sw={sw} label={sw ? "Eneo" : "Area"} title={sw ? "Eneo na upatikanaji" : "Area and availability"} count={Number(!!region) + Number(acceptingOnly)} summary={[region, acceptingOnly ? (sw ? "Wanaopokea maombi" : "Accepting requests") : ""].filter(Boolean).join(" · ")} onReset={() => { setRegion(""); setAcceptingOnly(false); }}>
      <IntakeSelect label={sw ? "Mkoa" : "Region"} value={region} options={[{ value: "", label: sw ? "Mikoa yote" : "All regions" }, ...regions.map(value => ({ value, label: value }))]} onChange={setRegion} sw={sw} />
      <Pressable accessibilityRole="checkbox" aria-checked={acceptingOnly} accessibilityState={{ checked: acceptingOnly }} style={styles.availabilityFilter} onPress={() => setAcceptingOnly(!acceptingOnly)}><Ionicons name={acceptingOnly ? "checkbox" : "square-outline"} size={23} color={colors.burgundy} /><Text style={[styles.body, { flex: 1 }]}>{sw ? "Wanaopokea maombi sasa" : "Accepting requests now"}</Text></Pressable>
    </SearchFilters>
    <View style={styles.listHeader}><Text style={styles.section}>{sw ? "Wasaidizi wa sheria" : "Paralegals"}{records !== undefined ? " (" + filtered.length + ")" : ""}</Text>{query || region || acceptingOnly ? <Pressable accessibilityRole="button" style={styles.link} onPress={reset}><Text style={styles.linkText}>{sw ? "Futa yote" : "Reset"}</Text></Pressable> : null}</View>
    {failed ? <DirectoryConnectionError sw={sw} retry={retry} /> : records === undefined ? <View style={styles.empty}><BrandLoading compact text={sw ? "Inapakia wasaidizi wa sheria..." : "Loading paralegals..."}/></View> : filtered.length ? filtered.map(item => <View key={item._id} style={styles.person}>
      <Pressable accessibilityRole="button" accessibilityLabel={(sw ? "Angalia wasifu wa " : "View profile of ") + item.fullName} style={styles.identity} onPress={() => openProfile(item)}><ProviderThumbnail kind="paralegal" name={item.fullName} photoUri={item.photoUrl} publicPhoto size={64} /><View style={styles.copy}><View style={styles.nameRow}><Text style={styles.name}>{item.fullName}</Text>{item.isVerified ? <Ionicons accessibilityLabel={sw ? "Amethibitishwa" : "Verified"} name="checkmark-circle" size={17} color={colors.teal} /> : null}</View><Text style={styles.meta}>{[item.district, item.region].filter(Boolean).join(", ")}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>
      <Text style={styles.meta}>{item.presence === "online" ? (sw ? "Yuko mtandaoni" : "Online") : item.presence === "away" ? (sw ? "Hayuko kwenye programu kwa sasa" : "Away") : (sw ? "Hali ya mtandaoni haipatikani" : "Online status unavailable")}</Text>
      {item.distanceSource === "current_location" && item.distanceKm != null && <Text style={styles.meta}>{sw ? "Eneo la sasa · takriban" : "Current location · approximately"} {item.distanceKm} km</Text>}
      {item.meetingPoint && <Text style={styles.meta}>{sw ? "Ofisi iliyochaguliwa" : "Chosen meeting office"}: {item.meetingPoint.name}{item.distanceSource === "office" && item.distanceKm != null ? ` · ${item.distanceKm.toFixed(1)} km` : ""}</Text>}
      <Text style={[styles.status, item.availabilityStatus === "accepting_cases" && { color: colors.teal }]}>{paralegalAvailabilityLabel(item.availabilityStatus, locale)}</Text>
      <Text style={styles.name}>{sw ? "Kwa nini wasifu huu unaweza kufaa" : "Why this may fit"}</Text>
      <Text style={styles.meta}>{sw ? "Linganisha eneo, aina za msaada na lugha zilizoonyeshwa. Wasifu huu hauhakikishi kupokelewa au mgawo wa kesi." : "Compare the listed location, support areas and languages. This profile does not guarantee intake or case assignment."}</Text>
      {!!item.specializations?.length && <Text style={styles.body}>{item.specializations.join(" · ")}</Text>}
      {!!item.languages?.length && <Text style={styles.meta}>{sw ? "Lugha" : "Languages"}: {item.languages.join(", ")}</Text>}
      <View style={styles.actions}>{item.phone ? <><Pressable accessibilityRole="button" style={styles.link} onPress={() => void contact(item.phone!, "tel")}><Ionicons name="call-outline" size={18} color={colors.burgundy} /><Text style={styles.linkText}>{sw ? "Piga simu" : "Call"}</Text></Pressable><Pressable accessibilityRole="button" style={styles.link} onPress={() => void contact(item.phone!, "sms")}><Ionicons name="chatbubble-outline" size={18} color={colors.burgundy} /><Text style={styles.linkText}>SMS</Text></Pressable></> : null}<Pressable accessibilityRole="button" style={styles.link} onPress={() => router.push({ pathname: "/appointments", params: { providerName: item.fullName, providerDistrict: [item.district, item.region].filter(Boolean).join(", "), providerPhone: item.phone ?? "" } })}><Ionicons name="calendar-outline" size={18} color={colors.burgundy} /><Text style={styles.linkText}>{sw ? "Omba miadi" : "Request a meeting"}</Text></Pressable></View>
    </View>) : <View style={styles.empty}><CivicObject kind="empty" size={88} /><Text style={styles.name}>{sw ? "Hakuna matokeo" : "No matches"}</Text><Text style={styles.body}>{sw ? "Jaribu eneo au mada nyingine, au omba LSF ikusaidie kupata msaidizi." : "Try another area or topic, or ask LSF to help find support."}</Text></View>}
    <View style={styles.safety}><Ionicons name="shield-checkmark-outline" size={22} color={colors.burgundy} /><View style={styles.copy}><Text style={styles.name}>{sw ? "Kwa kesi nyeti" : "For sensitive cases"}</Text><Text style={styles.body}>{sw ? "Omba msaada kupitia LSF kabla ya kutuma nyaraka binafsi kwa simu au SMS. Chagua njia salama ya mawasiliano katika ombi lako." : "Request support through LSF before sending private documents by phone or SMS. Choose a safe contact method in your request."}</Text></View></View>
    <Pressable accessibilityRole="button" style={styles.match} onPress={() => router.push("/intake")}><Ionicons name="git-merge-outline" size={22} color={colors.teal} /><View style={styles.copy}><Text style={styles.name}>{sw ? "LSF inisaidie kupata msaidizi" : "Help me find the right support"}</Text><Text style={styles.meta}>{sw ? "Tuma ombi ili eneo na mahitaji yako yakaguliwe." : "Send a request for your location and needs to be reviewed."}</Text></View><Ionicons name="arrow-forward" size={20} color={colors.teal} /></Pressable>
  </Screen>;
}

const styles = StyleSheet.create({
  safety: { marginTop: 20, flexDirection: "row", gap: 12, padding: 16, borderRadius: 8, backgroundColor: colors.softPink },
  intro: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 }, copy: { flex: 1, gap: 4 },
  heading: { fontFamily: type.semibold, fontSize: 23, lineHeight: 30, color: colors.ink }, body: { fontFamily: type.regular, fontSize: 14, lineHeight: 22, color: colors.inkMuted },
  search: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 54, paddingHorizontal: 14, borderRadius: 8, backgroundColor: "#F3F5F4", marginBottom: 16 }, input: { flex: 1, fontFamily: type.regular, fontSize: 15, color: colors.ink }, iconButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  availabilityFilter: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 12 }, listHeader: { marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, section: { flex: 1, fontFamily: type.semibold, fontSize: 19, color: colors.ink },
  person: { paddingVertical: 20, borderBottomWidth: 1, borderColor: colors.line, gap: 8 }, identity: { flexDirection: "row", alignItems: "center", gap: 12 }, avatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: colors.tealSoft }, initial: { fontFamily: type.semibold, fontSize: 17, color: colors.teal }, nameRow: { flexDirection: "row", gap: 8, alignItems: "center" }, name: { flexShrink: 1, fontFamily: type.semibold, fontSize: 16, lineHeight: 23, color: colors.ink }, meta: { fontFamily: type.regular, fontSize: 13, lineHeight: 20, color: colors.inkMuted }, status: { fontFamily: type.medium, fontSize: 13, lineHeight: 20, color: colors.inkMuted }, actions: { flexDirection: "row", flexWrap: "wrap", gap: 16 }, link: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 6 }, linkText: { fontFamily: type.medium, fontSize: 13, color: colors.burgundy }, empty: { paddingVertical: 30, gap: 12 }, match: { marginTop: 24, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 16 },
});
