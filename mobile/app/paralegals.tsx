import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function ParalegalsScreen() {
  const { locale } = useLanguage();
  const [region, setRegion] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const liveParalegals = useQuery(api.paralegals.listApprovedParalegals, { verifiedOnly: true });
  const incrementProfileViews = useMutation(api.paralegals.incrementProfileViews);
  const paralegals = liveParalegals ?? [];

  const filtered = useMemo(() => {
    const needle = region.trim().toLowerCase();
    if (!paralegals || !needle) return paralegals;
    return paralegals.filter((item) =>
      [item.region, item.district, item.ward, ...(item.specializations ?? [])]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(needle)),
    );
  }, [paralegals, region]);

  async function call(phone?: string) {
    if (!phone) return;
    await Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`);
  }

  function openProfile(item: (typeof paralegals)[number]) {
    void incrementProfileViews({ id: item._id as Parameters<typeof incrementProfileViews>[0]["id"] });
    router.push({
      pathname: "/paralegal-profile",
      params: {
        name: item.fullName,
        district: item.district,
        region: item.region,
        phone: item.phone ?? "",
        specialties: (item.specializations ?? []).join(","),
      },
    });
  }

  function getMatchSignals(item: NonNullable<typeof paralegals>[number]) {
    const needle = region.trim().toLowerCase();
    const signals: string[] = [];
    if (item.isVerified) signals.push(locale === "sw" ? "Amehakikiwa" : "Verified by LSF");
    if (item.availabilityStatus === "accepting_cases") signals.push(locale === "sw" ? "Anapokea maombi mapya" : "Accepting new requests");
    if (item.availabilityStatus === "limited") signals.push(locale === "sw" ? "Upatikanaji ni mdogo" : "Limited availability");
    if (item.availabilityStatus === "paused" || item.availabilityStatus === "unavailable") signals.push(locale === "sw" ? "Huenda asipokee maombi mapya sasa" : "May not be taking new requests now");
    if (needle) {
      if (item.region.toLowerCase().includes(needle)) signals.push(locale === "sw" ? "Mkoa unaendana" : "Region match");
      if (item.district.toLowerCase().includes(needle)) signals.push(locale === "sw" ? "Wilaya inaendana" : "District match");
      if (item.ward?.toLowerCase().includes(needle)) signals.push(locale === "sw" ? "Kata inaendana" : "Ward match");
      if (item.specializations?.some((tag) => tag.toLowerCase().includes(needle))) signals.push(locale === "sw" ? "Aina ya tatizo inaendana" : "Issue-area match");
    }
    if (item.languages?.length) signals.push(locale === "sw" ? `Lugha: ${item.languages.slice(0, 2).join(", ")}` : `Languages: ${item.languages.slice(0, 2).join(", ")}`);
    return signals.length ? signals.slice(0, 4) : [locale === "sw" ? "Anapatikana kwenye mtandao wa LSF" : "Available in the LSF support network"];
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Go back"} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Tafuta msaidizi" : "Find a paralegal"}</Text>
        <Pressable style={styles.headerAction}><Ionicons name="notifications-outline" size={20} color={colors.burgundy} /></Pressable>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={19} color={colors.inkMuted} />
        <TextInput
          value={region}
          onChangeText={setRegion}
          placeholder={locale === "sw" ? "Tafuta: Dar es Salaam, ajira..." : "Search: Dar es Salaam, employment..."}
          placeholderTextColor={colors.inkMuted}
          style={styles.searchInput}
        />
        {region ? (
          <Pressable accessibilityRole="button" onPress={() => setRegion("")}>
            <Ionicons name="close-circle" size={20} color={colors.inkMuted} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.filterRow}>
        <Pressable style={styles.filterChip}><Ionicons name="location-outline" size={15} color={colors.burgundy} /><Text style={styles.filterText}>{locale === "sw" ? "Mikoa yote" : "All Regions"}</Text><Ionicons name="chevron-down" size={14} color={colors.inkMuted} /></Pressable>
        <Pressable style={styles.filterChip}><Ionicons name="briefcase-outline" size={15} color={colors.burgundy} /><Text style={styles.filterText}>{locale === "sw" ? "Masuala yote" : "All Issues"}</Text><Ionicons name="chevron-down" size={14} color={colors.inkMuted} /></Pressable>
      </View>
      <View style={styles.segment}>
        <Pressable style={[styles.segmentOption, viewMode === "list" && styles.segmentOptionActive]} onPress={() => setViewMode("list")}>
          <Text style={[styles.segmentText, viewMode === "list" && styles.segmentTextActive]}>{locale === "sw" ? "Orodha" : "List"}</Text>
        </Pressable>
        <Pressable style={[styles.segmentOption, viewMode === "map" && styles.segmentOptionActive]} onPress={() => setViewMode("map")}>
          <Text style={[styles.segmentText, viewMode === "map" && styles.segmentTextActive]}>{locale === "sw" ? "Ramani" : "Map"}</Text>
        </Pressable>
      </View>
      <Text style={styles.sectionTitle}>{locale === "sw" ? "Paralegal waliothibitishwa" : "Verified Paralegals"}</Text>
      <Text style={styles.sectionBody}>{locale === "sw" ? "Wataalamu waliokaguliwa tayari kusaidia." : "Trusted professionals ready to help."}</Text>

      {viewMode === "map" ? <View style={styles.mapState}><Ionicons name="map-outline" size={34} color={colors.burgundy} /><Text style={styles.mapTitle}>{locale === "sw" ? "Mwonekano wa ramani" : "Map view"}</Text><Text style={styles.mapText}>{locale === "sw" ? "Kwa sasa tumia orodha kuona walio karibu nawe kwa haraka." : "Use the list for the fastest nearby support review right now."}</Text></View> : null}

      <Pressable style={styles.matchCard} onPress={() => router.push("/intake")}>
        <View style={styles.matchIcon}>
          <Ionicons name="git-merge-outline" size={22} color={colors.surface} />
        </View>
        <View style={styles.matchCopy}>
          <Text style={styles.matchTitle}>{locale === "sw" ? "Unahitaji kuchaguliwa msaidizi?" : "Need LSF to match you?"}</Text>
          <Text style={styles.matchText}>
            {locale === "sw"
              ? "Tuma ombi salama. LSF itaangalia eneo, aina ya tatizo, usalama, na upatikanaji kabla ya kumpa mtu kesi yako."
              : "Submit a safe request. LSF reviews location, issue type, safety, and availability before assigning support."}
          </Text>
          <Text style={styles.matchSubhead}>{locale === "sw" ? "Kwa nini anaweza kufaa" : "Why this may fit"}</Text>
          <View style={styles.matchReasons}>
            <Text style={styles.reasonPill}>{locale === "sw" ? "Eneo" : "Location"}</Text>
            <Text style={styles.reasonPill}>{locale === "sw" ? "Aina ya tatizo" : "Issue type"}</Text>
            <Text style={styles.reasonPill}>{locale === "sw" ? "Kwa kesi nyeti" : "For sensitive cases"}</Text>
          </View>
        </View>
        <Ionicons name="arrow-forward" size={20} color={colors.burgundy} />
      </Pressable>
      <Button label={locale === "sw" ? "LSF inichagulie msaidizi" : "Let LSF match me"} onPress={() => router.push("/intake")} />

      {filtered?.length && viewMode === "list" ? (
        filtered.map((item) => {
          const signals = getMatchSignals(item);
          return (
          <Pressable key={item._id} style={styles.card} onPress={() => openProfile(item)}>
            <View style={styles.cardTop}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{item.fullName.charAt(0)}</Text></View>
              <View style={styles.cardTitleArea}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.fullName}</Text>
                  {item.isVerified ? <Ionicons name="checkmark-circle" size={17} color={colors.success} /> : null}
                </View>
                <Text style={styles.location}>{item.district}, {item.region}</Text>
              </View>
            </View>

            <Text style={[
              styles.availabilityPill,
              item.availabilityStatus === "paused" || item.availabilityStatus === "unavailable" ? styles.availabilityPaused : styles.availabilityOpen,
            ]}>
              {availabilityLabel(item.availabilityStatus, locale)}
            </Text>

            {item.bio ? <Text style={styles.bio} numberOfLines={3}>{item.bio}</Text> : null}

            <View style={styles.chips}>
              {(item.specializations?.length ? item.specializations : [locale === "sw" ? "Msaada wa kisheria" : "Legal support"]).slice(0, 3).map((tag) => (
                <Text key={tag} style={styles.chip}>{tag}</Text>
              ))}
            </View>
            <Text style={styles.rating}>{item.isVerified ? "4.8 ★" : "4.6 ★"}</Text>
            <View style={styles.signalPanel}>
              {signals.slice(0, 2).map((signal) => (
                <View key={signal} style={styles.signalRow}>
                  <Ionicons name="checkmark-circle-outline" size={15} color={colors.teal} />
                  <Text style={styles.signalText}>{signal}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.secondaryAction} onPress={() => void call(item.phone)}>
                <Ionicons name="chatbubble-outline" size={18} color={colors.burgundy} />
                <Text style={styles.secondaryText}>{locale === "sw" ? "Ujumbe" : "Message"}</Text>
              </Pressable>
              <Pressable
                style={styles.primaryAction}
                onPress={() =>
                  router.push({
                    pathname: "/appointments",
                    params: {
                      providerName: item.fullName,
                      providerDistrict: `${item.district}, ${item.region}`,
                      providerPhone: item.phone ?? "",
                    },
                  })
                }
              >
                <Text style={styles.primaryText}>{locale === "sw" ? "Weka miadi" : "Book support"}</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.surface} />
              </Pressable>
            </View>
          </Pressable>
        );
        })
      ) : (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={44} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{locale === "sw" ? "Hakuna matokeo" : "No results"}</Text>
          <Text style={styles.emptyText}>{locale === "sw" ? "Badili utafutaji au anza ombi ili LSF ikupangie msaada." : "Try another search or start a request so LSF can match support."}</Text>
          <Button label={locale === "sw" ? "Anza ombi" : "Start request"} onPress={() => router.push("/intake")} />
        </View>
      )}
    </Screen>
  );
}

function availabilityLabel(status: string | undefined, locale: "sw" | "en") {
  const value = status ?? "accepting_cases";
  const labels = {
    sw: {
      accepting_cases: "Anapokea maombi mapya",
      limited: "Upatikanaji mdogo",
      paused: "Amesitisha kwa muda",
      unavailable: "Hayupo kwa sasa",
    },
    en: {
      accepting_cases: "Accepting new requests",
      limited: "Limited availability",
      paused: "Temporarily paused",
      unavailable: "Unavailable now",
    },
  };
  return labels[locale][value as keyof typeof labels.en] ?? labels[locale].accepting_cases;
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  headerAction: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  searchBox: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: spacing.md, minHeight: 50, marginTop: spacing.xl },
  searchInput: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 14 },
  filterRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  filterChip: { flex: 1, minHeight: 42, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.xs },
  filterText: { flex: 1, fontFamily: type.medium, color: colors.charcoal, fontSize: 12 },
  segment: { flexDirection: "row", alignSelf: "flex-start", backgroundColor: colors.softPink, borderRadius: radius.pill, padding: 4, marginTop: spacing.md },
  segmentOption: { minWidth: 74, minHeight: 34, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.md },
  segmentOptionActive: { backgroundColor: colors.burgundy },
  segmentText: { fontFamily: type.bold, color: colors.inkMuted, fontSize: 12 },
  segmentTextActive: { color: colors.surface },
  sectionTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 21, marginTop: spacing.lg },
  sectionBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19, marginTop: spacing.xs },
  mapState: { marginTop: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl, alignItems: "center", gap: spacing.sm },
  mapTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  mapText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19, textAlign: "center" },
  matchCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: "#E8B8CC", backgroundColor: "#FFF7FA", padding: spacing.lg },
  matchIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundy },
  matchCopy: { flex: 1, gap: 3 },
  matchTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 15 },
  matchText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
  matchSubhead: { fontFamily: type.bold, color: colors.burgundy, fontSize: 12, marginTop: spacing.xs },
  matchReasons: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.xs },
  reasonPill: { overflow: "hidden", borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: "#E8B8CC", paddingHorizontal: spacing.sm, paddingVertical: 4, fontFamily: type.bold, color: colors.burgundy, fontSize: 10 },
  loading: { paddingVertical: 80 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.md, gap: spacing.md },
  cardTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundy },
  avatarText: { fontFamily: type.bold, color: colors.surface, fontSize: 18 },
  cardTitleArea: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  name: { flex: 1, fontFamily: type.bold, color: colors.charcoal, fontSize: 16 },
  location: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, marginTop: 2 },
  availabilityPill: { alignSelf: "flex-start", overflow: "hidden", borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, fontFamily: type.bold, fontSize: 11 },
  availabilityOpen: { backgroundColor: colors.tealSoft, color: colors.teal },
  availabilityPaused: { backgroundColor: colors.peach, color: colors.burgundy },
  bio: { fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { fontFamily: type.medium, color: colors.burgundy, backgroundColor: colors.softPink, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, fontSize: 11 },
  rating: { fontFamily: type.bold, color: colors.charcoal, fontSize: 13 },
  signalPanel: { gap: spacing.xs, borderRadius: radius.sm, backgroundColor: "#F7FBFB", padding: spacing.md },
  signalRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  signalText: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  actions: { flexDirection: "row", gap: spacing.sm },
  secondaryAction: { flex: 1, minHeight: 44, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.xs, backgroundColor: colors.surface },
  secondaryText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 13 },
  primaryAction: { flex: 1.4, minHeight: 44, borderRadius: radius.pill, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.xs },
  primaryText: { fontFamily: type.bold, color: colors.surface, fontSize: 13 },
  empty: { marginTop: spacing.xxl, alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.xl },
  emptyTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  emptyText: { fontFamily: type.regular, color: colors.inkMuted, textAlign: "center", lineHeight: 21 },
});
