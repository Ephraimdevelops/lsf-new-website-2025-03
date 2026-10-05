import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../src/backend/api";
import { useAuth } from "../src/auth";
import { AppHeader } from "../src/components/AppHeader";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { Surface } from "../src/components/Surface";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function SavedServicesScreen() {
  const { locale } = useLanguage();
  const { isSignedIn } = useAuth();
  const saved = useQuery(api.justiceServices.mySavedServices, isSignedIn ? {} : "skip");
  const visits = useQuery(api.justiceServices.myServiceVisits, isSignedIn ? {} : "skip");
  const sw = locale === "sw";
  const planned = visits?.filter(({ visit }) => visit.status === "planned") ?? [];

  return <Screen>
    <AppHeader back title={sw ? "Msaada uliohifadhi" : "Saved Help"} eyebrow="Haki Yangu · Find Help" />
    <View style={styles.hero}>
      <View style={styles.heroIcon}><Ionicons name="bookmark-outline" size={26} color={colors.surface} /></View>
      <Text style={styles.heroKicker}>{sw ? "HUDUMA ZAKO" : "YOUR SUPPORT"}</Text>
      <Text style={styles.heroTitle}>{sw ? "Rudi kwenye msaada uliouchagua." : "Pick up where you left off."}</Text>
      <Text style={styles.heroBody}>{sw ? "Huduma ulizohifadhi na mipango yako ya kuwasiliana nayo iko hapa." : "Your saved services and personal contact plans are together here."}</Text>
    </View>

    {!isSignedIn ? <Surface tone="pink" style={styles.panel}>
      <Ionicons name="lock-closed-outline" size={25} color={colors.burgundy} />
      <Text style={styles.title}>{sw ? "Ingia kuona huduma zako" : "Sign in to see your saved help"}</Text>
      <Text style={styles.body}>{sw ? "Huduma na mipango yako inaonekana kwako tu baada ya kuingia." : "Your saved services and plans are visible only after sign-in."}</Text>
      <Button label={sw ? "Ingia" : "Sign in"} onPress={() => router.push({ pathname: "/sign-in", params: { returnTo: "saved-services" } })} />
      <Button label={sw ? "Endelea kutafuta huduma" : "Continue exploring services"} variant="secondary" onPress={() => router.push("/nearby-help")} />
    </Surface> : <>
      <Text style={styles.sectionTitle}>{sw ? "Huduma nilizohifadhi" : "Saved services"}{saved ? ` · ${saved.length}` : ""}</Text>
      {saved === undefined ? <ActivityIndicator color={colors.burgundy} style={styles.loading} /> : saved.length ? saved.map(({ service }) => <Pressable key={String(service._id)} accessibilityRole="button" style={styles.serviceCard} onPress={() => router.push({ pathname: "/service/[id]", params: { id: String(service._id) } })}>
        <View style={styles.serviceIcon}><Ionicons name="business-outline" size={22} color={colors.burgundy} /></View>
        <View style={styles.flex}><Text style={styles.serviceName}>{service.name}</Text><Text style={styles.meta}>{[service.district, service.region].filter(Boolean).join(", ")}</Text><View style={styles.verified}><Ionicons name="checkmark-circle" size={14} color={colors.success} /><Text style={styles.verifiedText}>{sw ? "Imethibitishwa" : "Verified"}</Text></View></View>
        <Ionicons name="chevron-forward" size={20} color={colors.inkMuted} />
      </Pressable>) : <Surface style={styles.empty}>
        <Ionicons name="bookmark-outline" size={29} color={colors.teal} />
        <Text style={styles.title}>{sw ? "Bado hakuna huduma iliyohifadhiwa" : "No saved services yet"}</Text>
        <Text style={styles.body}>{sw ? "Tafuta huduma iliyothibitishwa, kisha uihifadhi ili uirudie hapa." : "Explore verified services and save one to return to it here."}</Text>
        <Button label={sw ? "Tafuta huduma karibu" : "Find nearby services"} onPress={() => router.push("/nearby-help")} />
      </Surface>}

      <Text style={styles.sectionTitle}>{sw ? "Mipango ya kutembelea au kupiga simu" : "Visit and call plans"}{visits ? ` · ${planned.length}` : ""}</Text>
      {visits === undefined ? <ActivityIndicator color={colors.burgundy} style={styles.loading} /> : planned.length ? planned.slice(0, 3).map(({ visit, service }) => <Pressable key={String(visit._id)} accessibilityRole="button" style={styles.visitCard} onPress={() => router.push(service ? { pathname: "/service-visit", params: { serviceId: String(visit.serviceId) } } : "/service-visit")}>
        <View style={styles.visitIcon}><Ionicons name={visit.channel === "in_person" ? "location-outline" : "call-outline"} size={22} color={colors.teal} /></View>
        <View style={styles.flex}><Text style={styles.serviceName}>{service?.name ?? (sw ? "Huduma haipatikani tena" : "Service no longer public")}</Text><Text style={styles.meta}>{new Date(visit.plannedFor).toLocaleString(sw ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })}</Text><Text style={styles.planLabel}>{sw ? "Mpango binafsi · si miadi iliyothibitishwa" : "Personal plan · not a confirmed appointment"}</Text></View>
        <Ionicons name="chevron-forward" size={20} color={colors.inkMuted} />
      </Pressable>) : <Surface tone="teal" style={styles.empty}><Text style={styles.body}>{sw ? "Bado hujapanga ziara au simu. Unaweza kupanga kutoka ukurasa wa huduma." : "No visits or calls planned. You can make a personal plan from a service page."}</Text></Surface>}
      {planned.length > 3 ? <Button label={sw ? "Angalia mipango yote" : "View all plans"} variant="secondary" onPress={() => router.push("/service-visit")} /> : null}
      <View style={styles.footer}><Button label={sw ? "Tafuta huduma zaidi" : "Find more services"} variant="secondary" onPress={() => router.push("/nearby-help")} /></View>
    </>}
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.ink, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm },
  heroIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: "#73425A", alignItems: "center", justifyContent: "center" },
  heroKicker: { color: colors.peach, fontFamily: type.bold, fontSize: 11, letterSpacing: 1.2 },
  heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 26, lineHeight: 32 },
  heroBody: { color: "#E8E1E4", fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  panel: { marginTop: spacing.lg, gap: spacing.md },
  sectionTitle: { color: colors.ink, fontFamily: type.bold, fontSize: 20, marginTop: spacing.xl, marginBottom: spacing.md },
  loading: { padding: spacing.xl },
  serviceCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 94, padding: spacing.md, marginBottom: spacing.sm, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  serviceIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" },
  visitCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 90, padding: spacing.md, marginBottom: spacing.sm, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  visitIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.tealSoft, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1 },
  serviceName: { color: colors.ink, fontFamily: type.bold, fontSize: 15, lineHeight: 20 },
  meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, marginTop: 3 },
  verified: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 4, marginTop: 5 },
  verifiedText: { color: colors.success, fontFamily: type.medium, fontSize: 11 },
  planLabel: { color: colors.teal, fontFamily: type.medium, fontSize: 11, marginTop: 5 },
  empty: { gap: spacing.md },
  title: { color: colors.ink, fontFamily: type.bold, fontSize: 18 },
  body: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 14, lineHeight: 21 },
  footer: { marginTop: spacing.xl },
});
