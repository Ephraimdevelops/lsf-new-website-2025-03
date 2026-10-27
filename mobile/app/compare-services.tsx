import { BrandLoading } from '../src/components/BrandLoading';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function CompareServicesScreen() {
  const { ids } = useLocalSearchParams<{ ids?: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const selectedIds = [...new Set((ids ?? "").split(",").filter(Boolean))].slice(0, 3);
  const directory = useQuery(api.justiceServices.listPublicServices, {});
  const services = selectedIds.map((id) => directory?.find((item) => String(item._id) === id)).filter((item) => item !== undefined);

  return <Screen>
    <AppHeader back title={sw ? "Linganisha huduma" : "Compare services"} eyebrow={locale === "sw" ? "HAKI YANGU · TAFUTA MSAADA" : "HAKI YANGU · FIND HELP"} />
    <View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="git-compare-outline" size={27} color={colors.teal} /></View><Text style={styles.kicker}>{sw ? "CHAGUO ZILIZOTHIBITISHWA" : "VERIFIED PUBLIC OPTIONS"}</Text><Text style={styles.heroTitle}>{sw ? "Chagua msaada unaokufaa." : "Choose the support that fits you."}</Text><Text style={styles.heroBody}>{sw ? "Linganisha msaada, eneo na mawasiliano. Fungua huduma kuona maelezo yote." : "Compare support, location and contact details. Open a service for full details."}</Text></View>
    {directory === undefined ? <Surface style={styles.card}><BrandLoading compact text={sw ? "Inapakia huduma..." : "Loading services..."}/></Surface> : services.length === 0 ? <Surface tone="orange" style={styles.card}><Text style={styles.title}>{sw ? "Huduma zilizochaguliwa hazipatikani tena." : "Selected services are no longer available."}</Text><Text style={styles.muted}>{sw ? "Tafuta tena kwenye orodha ya huduma zilizothibitishwa." : "Search the verified directory again for current options."}</Text><Button label={sw ? "Rudi kutafuta" : "Return to Find Help"} onPress={() => router.replace("/find-services")} /></Surface> : <>
      <Text style={styles.section}>{sw ? "Huduma zilizochaguliwa" : "Selected services"} · {services.length}</Text>
      {services.map((service, index) => <Surface key={String(service._id)} style={styles.card}>
        <View style={styles.cardTop}><View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View><View style={styles.flex}><Text style={styles.title}>{service.name}</Text><Text style={styles.muted}>{service.organizationName || service.servicePointType.replaceAll("_", " ")}</Text></View><Ionicons name="shield-checkmark" size={22} color={colors.teal} /></View>
        <View style={styles.grid}><Fact icon="location-outline" label={sw ? "Eneo" : "Location"} value={[service.district, service.region].filter(Boolean).join(", ") || "—"} /><Fact icon="time-outline" label={sw ? "Hali ya mapokezi" : "Intake status"} value={service.currentIntakeState.replaceAll("_", " ")} /><Fact icon="chatbubble-ellipses-outline" label={sw ? "Lugha" : "Languages"} value={service.languages?.join(", ") || "—"} /><Fact icon="call-outline" label={sw ? "Msaada wa simu" : "Phone support"} value={service.phoneSupport ? (sw ? "Ndiyo" : "Yes") : (sw ? "Hapana" : "No")} /><Fact icon="globe-outline" label={sw ? "Msaada wa mbali" : "Remote support"} value={service.remoteSupport ? (sw ? "Ndiyo" : "Yes") : (sw ? "Hapana" : "No")} /><Fact icon="walk-outline" label={sw ? "Bila miadi" : "Walk-in"} value={service.walkIn ? (sw ? "Ndiyo" : "Yes") : (sw ? "Hapana" : "No")} /></View>
        <Text style={styles.label}>{sw ? "Masuala yanayoshughulikiwa" : "Issue areas"}</Text><View style={styles.tags}>{service.issueCategories?.length ? service.issueCategories.map((issue) => <Text key={issue} style={styles.tag}>{issue.replaceAll("_", " ")}</Text>) : <Text style={styles.muted}>{sw ? "Hayajabainishwa" : "Not specified"}</Text>}</View>
        <Button label={sw ? "Angalia maelezo na mawasiliano" : "View details and contact"} onPress={() => router.push({ pathname: "/service/[id]", params: { id: String(service._id) } })} />
      </Surface>)}
      <Surface tone="teal" style={styles.card}><Text style={styles.title}>{sw ? "Bado hujapata msaada unaofaa?" : "Still need a better option?"}</Text><Text style={styles.muted}>{sw ? "Unaweza kutafuta tena au kutuma ombi kwa LSF ikusaidie." : "Search again or ask LSF to help match you."}</Text><Button variant="secondary" label={sw ? "Tafuta huduma nyingine" : "Find other services"} onPress={() => router.push("/find-services")} /><Button variant="quiet" label={sw ? "Omba msaada wa LSF" : "Ask LSF for help"} onPress={() => router.push("/intake")} /></Surface>
    </>}
  </Screen>;
}

function Fact({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) { return <View style={styles.fact}><Ionicons name={icon} size={18} color={colors.burgundy} /><Text style={styles.factLabel}>{label}</Text><Text style={styles.factValue}>{value}</Text></View>; }
const styles = StyleSheet.create({ hero: { marginTop: spacing.sm, backgroundColor: colors.tealSoft, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, kicker: { color: colors.teal, fontFamily: type.bold, fontSize: 11, letterSpacing: 1 }, heroTitle: { color: colors.ink, fontFamily: type.bold, fontSize: 26, lineHeight: 32 }, heroBody: { color: colors.charcoal, fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, section: { marginTop: spacing.xl, marginBottom: spacing.md, color: colors.ink, fontFamily: type.bold, fontSize: 19 }, card: { marginBottom: spacing.md, gap: spacing.md }, cardTop: { flexDirection: "row", alignItems: "center", gap: spacing.md }, number: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" }, numberText: { color: colors.surface, fontFamily: type.bold, fontSize: 17 }, flex: { flex: 1 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 16 }, muted: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 13, lineHeight: 19 }, grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, fact: { width: "48%", minHeight: 93, borderRadius: radius.md, backgroundColor: "#F9F7F8", padding: spacing.sm, gap: 3 }, factLabel: { color: colors.inkMuted, fontFamily: type.medium, fontSize: 11 }, factValue: { color: colors.ink, fontFamily: type.bold, fontSize: 13, textTransform: "capitalize" }, label: { color: colors.burgundy, fontFamily: type.bold, fontSize: 12 }, tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }, tag: { overflow: "hidden", backgroundColor: colors.burgundySoft, color: colors.burgundy, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 5, fontFamily: type.medium, fontSize: 12 } });
