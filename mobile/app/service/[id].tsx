import { directoryLabel } from "../../src/directoryLabels";
import { plainError } from "../../../shared/plainLanguage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Pressable, Share, StyleSheet, Text, View } from "react-native";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { useIntakeDraft } from "../../src/intake/IntakeDraftContext";
import { useAuth } from "../../src/auth";
import { colors, radius, spacing, type } from "../../src/theme";

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage();
  const { updateDraft } = useIntakeDraft();
  const { isSignedIn } = useAuth();
  const [saving, setSaving] = useState(false);
  const service = useQuery(api.justiceServices.getPublicService, id ? { id: id as Id<"justice_services"> } : "skip");
  const savedServices = useQuery(api.justiceServices.mySavedServices, isSignedIn ? {} : "skip");
  const toggleSavedService = useMutation(api.justiceServices.toggleSavedService);
  const recordJourney = useMutation(api.journeyAnalytics.record);
  async function openExternal(url: string, step: "service_call_open" | "service_directions_open") {
    try {
      await Linking.openURL(url);
      void recordJourney({ surface: "mobile", step }).catch(() => undefined);
    } catch {
      Alert.alert(t("Haikuwezekana kufungua", "Could not open"), t("Jaribu tena au tumia maelezo ya huduma.", "Try again or use the service details."));
    }
  }
  const isSaved = savedServices?.some((item) => item.service._id === id) ?? false;
  const t = (sw: string, en: string) => locale === "sw" ? sw : en;
  async function saveService(serviceId: Id<"justice_services">) {
    if (!isSignedIn) {
      router.push({ pathname: "/sign-in", params: { returnTo: "service", serviceId: String(serviceId) } });
      return;
    }
    if (saving || savedServices === undefined) return;
    setSaving(true);
    try {
      await toggleSavedService({ serviceId, saved: !isSaved });
    } catch (caught) {
      Alert.alert(t("Haikuhifadhiwa", "Could not update saved service"), plainError(caught, locale));
    } finally {
      setSaving(false);
    }
  }
  return <Screen>
    <AppHeader back title={t("Maelezo ya huduma", "Service details")} eyebrow={locale === "sw" ? "Haki Yangu · Tafuta msaada" : "Haki Yangu · Find help"} />
    {service === undefined ? <Text style={styles.muted}>{t("Inapakia...", "Loading...")}</Text> : service === null ? <Surface tone="pink"><Text style={styles.title}>{t("Huduma haipatikani", "Service unavailable")}</Text><Text style={styles.muted}>{t("Inaweza kuwa haionekani kwa umma au uthibitisho wake umebadilika.", "It may no longer be public or verified.")}</Text><Button label={t("Tafuta huduma nyingine", "Find another service")} onPress={() => router.replace("/nearby-help")} /></Surface> : <>
      <View style={styles.hero}><View style={styles.heroTop}><View style={styles.serviceIcon}><Ionicons name="business-outline" size={30} color={colors.surface} /></View><Pressable style={styles.shareButton} accessibilityRole="button" accessibilityLabel={t("Shiriki huduma", "Share service")} onPress={() => void Share.share({ message: `${service.name}\n${[service.physicalLocation, service.district, service.region].filter(Boolean).join(", ")}` })}><Ionicons name="share-outline" size={21} color={colors.burgundy} /></Pressable></View><View style={styles.verified}><Ionicons name="checkmark-circle" size={17} color={colors.success} /><Text style={styles.verifiedText}>{t("Huduma iliyothibitishwa", "Verified service")}</Text></View><Text style={styles.heroTitle}>{service.name}</Text><View style={styles.location}><Ionicons name="location-outline" size={17} color={colors.inkMuted} /><Text style={styles.heroBody}>{[service.district, service.region].filter(Boolean).join(", ")}</Text></View></View>
      <View style={styles.quickActions}>
        {service.phone && service.phoneSupport ? <Pressable accessibilityRole="button" accessibilityLabel={t("Piga simu kwa huduma", "Call this service")} style={styles.quickAction} onPress={() => void openExternal(`tel:${service.phone}`, "service_call_open")}><View style={styles.quickIcon}><Ionicons name="call-outline" size={21} color={colors.teal} /></View><Text style={styles.quickLabel}>{t("Piga simu", "Call")}</Text></Pressable> : null}
        {((service.latitude !== undefined && service.longitude !== undefined) || service.physicalLocation) ? <Pressable accessibilityRole="button" accessibilityLabel={t("Pata maelekezo", "Get directions")} style={styles.quickAction} onPress={() => { const destination = service.latitude !== undefined && service.longitude !== undefined ? `${service.latitude},${service.longitude}` : [service.physicalLocation, service.district, service.region, "Tanzania"].filter(Boolean).join(", "); void openExternal(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`, "service_directions_open"); }}><View style={styles.quickIcon}><Ionicons name="navigate-outline" size={21} color={colors.teal} /></View><Text style={styles.quickLabel}>{t("Maelekezo", "Directions")}</Text></Pressable> : null}
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: saving || (isSignedIn && savedServices === undefined) }} disabled={saving || (isSignedIn && savedServices === undefined)} accessibilityLabel={isSaved ? t("Ondoa kwenye huduma nilizohifadhi", "Remove from saved services") : t("Hifadhi huduma hii", "Save this service")} style={styles.quickAction} onPress={() => void saveService(service._id as Id<"justice_services">)}><View style={styles.quickIcon}><Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={21} color={colors.teal} /></View><Text style={styles.quickLabel}>{saving ? t("Subiri...", "Saving...") : isSaved ? t("Imehifadhiwa", "Saved") : t("Hifadhi", "Save")}</Text></Pressable>
      </View>
      <Surface style={styles.surface}><Text style={styles.title}>{t("Msaada unaopatikana", "Available support")}</Text><View style={styles.helpTags}>{(service.issueCategories.length ? service.issueCategories : [t("Msaada wa kisheria", "Legal support")]).map((category) => <Text key={category} style={styles.helpTag}>{directoryLabel(category, locale === "sw")}</Text>)}</View>{service.eligibility ? <><Text style={styles.label}>{t("Nani anaweza kutumia huduma", "Who can use this service")}</Text><Text style={styles.body}>{service.eligibility}</Text></> : null}</Surface>
      <Surface style={styles.surface}><Text style={styles.title}>{t("Mawasiliano na kufika", "Contact and visiting")}</Text>{service.lastVerifiedAt ? <Info icon="checkmark-circle-outline" label={t("Ilikaguliwa mara ya mwisho", "Last checked")} value={new Date(service.lastVerifiedAt).toLocaleDateString(locale === "sw" ? "sw-TZ" : "en-TZ", { dateStyle: "medium" })} /> : null}<Info icon="time-outline" label={t("Saa za kazi", "Opening hours")} value={service.openingHours || t("Thibitisha kabla ya kutembelea", "Confirm before visiting")} /><Info icon="location-outline" label={t("Anwani", "Address")} value={service.physicalLocation || [service.ward, service.district, service.region].filter(Boolean).join(", ")} /><Info icon="language-outline" label={t("Lugha", "Languages")} value={service.languages.join(", ") || t("Haijawekwa", "Not listed")} /><Info icon="information-circle-outline" label={t("Namna ya huduma", "Access options")} value={[service.walkIn && t("Kutembelea", "Walk-in"), service.phoneSupport && t("Simu", "Phone"), service.remoteSupport && t("Bila kufika ofisini", "Without visiting"), service.appointmentRequired && t("Miadi inahitajika", "Appointment required")].filter(Boolean).join(" · ") || t("Wasiliana na huduma", "Contact the service")} /><Info icon="pulse-outline" label={t("Kupokea maombi", "Current intake")} value={directoryLabel(service.currentIntakeState, locale === "sw")} /></Surface>
      <Surface tone="pink" style={styles.surface}><View style={styles.prepareHeading}><Ionicons name="bulb-outline" size={22} color={colors.orange} /><Text style={styles.title}>{t("Kabla ya kuwasiliana", "Before you contact them")}</Text></View><Text style={styles.body}>{t("Eleza tatizo kwa ufupi. Thibitisha namba na saa za kazi. Kabla ya kutuma hati nyeti nje ya programu, hakikisha unajua mpokeaji.", "Briefly describe your issue. Confirm contact details and hours. Before sending sensitive documents outside the app, check who will receive them.")}</Text></Surface>
      <View style={styles.actions}>
        <Button label={t("Panga kutembelea au kupiga simu", "Plan a visit or call")} variant="secondary" onPress={() => { if (!isSignedIn) { router.push({ pathname: "/sign-in", params: { returnTo: "service-visit", serviceId: String(service._id) } }); return; } router.push({ pathname: "/service-visit", params: { serviceId: String(service._id) } }); }} />
        <Pressable style={styles.secondary} onPress={() => { const category = service.issueCategories.find((item): item is "employment" | "land" | "family" | "safety" | "consumer" => ["employment", "land", "family", "safety", "consumer"].includes(item)); updateDraft({ sourceServiceId: id, issueCategory: category, region: service.region, district: service.district }); router.push("/intake"); }}><Ionicons name="document-text-outline" size={20} color={colors.burgundy} /><Text style={styles.secondaryText}>{t("Nahitaji msaada zaidi kutoka LSF", "I need more help from LSF")}</Text></Pressable>
      </View>
    </>}
  </Screen>;
}

function Info({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return <View style={styles.info}><Ionicons name={icon} size={20} color={colors.burgundy} /><View style={styles.infoCopy}><Text style={styles.label}>{label}</Text><Text style={styles.body}>{value}</Text></View></View>;
}
const styles = StyleSheet.create({
  hero: { backgroundColor: colors.burgundySoft, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm, borderWidth: 1, borderColor: "#EFC5D4" },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  serviceIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center" },
  shareButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  verified: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: spacing.xs, borderRadius: radius.pill, backgroundColor: colors.greenSoft, paddingHorizontal: spacing.sm, paddingVertical: 5 },
  verifiedText: { fontFamily: type.bold, color: colors.success, fontSize: 12 },
  heroTitle: { fontFamily: type.bold, fontWeight: "700", fontSize: 28, lineHeight: 34, color: colors.ink },
  location: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  heroBody: { fontFamily: type.regular, fontSize: 15, color: colors.inkMuted },
  quickActions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  quickAction: { flex: 1, minHeight: 82, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", gap: 4, padding: spacing.sm },
  quickIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.tealSoft, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontFamily: type.bold, color: colors.ink, fontSize: 12, textAlign: "center" },
  surface: { marginTop: spacing.md },
  helpTags: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  helpTag: { overflow: "hidden", borderRadius: radius.pill, backgroundColor: colors.burgundySoft, color: colors.burgundy, paddingHorizontal: spacing.sm, paddingVertical: 5, fontFamily: type.medium, fontSize: 12, textTransform: "capitalize" },
  prepareHeading: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  actions: { marginTop: spacing.lg, gap: spacing.sm },
  title: { fontFamily: type.bold, fontWeight: "700", fontSize: 18, color: colors.ink, marginBottom: spacing.sm },
  label: { fontFamily: type.bold, fontWeight: "700", fontSize: 13, color: colors.ink },
  body: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.inkMuted },
  muted: { fontFamily: type.regular, fontSize: 14, lineHeight: 21, color: colors.inkMuted, marginBottom: spacing.md },
  info: { flexDirection: "row", gap: spacing.md, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.line },
  infoCopy: { flex: 1, gap: 3 },
  secondary: { minHeight: 52, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.burgundy, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, padding: spacing.md },
  secondaryText: { fontFamily: type.bold, fontWeight: "700", fontSize: 14, color: colors.burgundy },
});
