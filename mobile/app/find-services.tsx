import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../src/backend/api";
import { Button } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const issueOptions = [
  { key: "employment", sw: "Ajira", en: "Employment" },
  { key: "land", sw: "Ardhi", en: "Land" },
  { key: "family", sw: "Familia", en: "Family" },
  { key: "safety", sw: "Usalama", en: "Safety" },
  { key: "consumer", sw: "Mlaji", en: "Consumer" },
];

export default function FindServicesScreen() {
  const { locale } = useLanguage();
  const [region, setRegion] = useState("Dar es Salaam");
  const [issueCategory, setIssueCategory] = useState("employment");
  const [matching, setMatching] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<{
    service: {
      _id: string;
      name: string;
      organizationName?: string;
      servicePointType: string;
      region: string;
      district: string;
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
    issueCategory: issueCategory || undefined,
  });
  const matchServices = useMutation(api.justiceServices.matchServices);

  async function runMatch() {
    setMatching(true);
    try {
      const result = await matchServices({
        source: "directory",
        ordinaryProblem: issueCategory,
        issueCategory,
        region,
        urgency: "standard",
      });
      setRecommendations(result.recommendations as typeof recommendations);
    } finally {
      setMatching(false);
    }
  }

  const list = recommendations ?? services?.map((service) => ({
    service,
    score: 0,
    whySuitable: [locale === "sw" ? "Huduma imethibitishwa" : "Verified public service"],
    whatToPrepare: [],
  }));

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Tafuta msaada" : "Find Help"}</Text>
        <Pressable style={styles.headerAction} onPress={() => router.push("/paralegals")}>
          <Ionicons name="people-outline" size={19} color={colors.burgundy} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Text style={styles.kicker}>{locale === "sw" ? "Haki Yangu Navigator" : "Haki Yangu Navigator"}</Text>
        <Text style={styles.title}>
          {locale === "sw" ? "Pata mlango sahihi wa msaada." : "Find the right door for your situation."}
        </Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Sio kila tatizo linahitaji paralegal pekee. Tutatafuta huduma iliyoidhinishwa kulingana na eneo, aina ya tatizo, uwezo na usalama."
            : "Not every problem needs only a paralegal. We look for verified support based on location, issue type, mandate, capacity, and safety."}
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>{locale === "sw" ? "Eneo" : "Location"}</Text>
        <TextInput
          value={region}
          onChangeText={setRegion}
          placeholder={locale === "sw" ? "Mfano: Dar es Salaam" : "Example: Dar es Salaam"}
          placeholderTextColor={colors.inkMuted}
          style={styles.input}
        />
        <Text style={styles.label}>{locale === "sw" ? "Aina ya tatizo" : "Issue type"}</Text>
        <View style={styles.issueGrid}>
          {issueOptions.map((issue) => (
            <Pressable key={issue.key} style={[styles.issueChip, issueCategory === issue.key && styles.issueChipActive]} onPress={() => setIssueCategory(issue.key)}>
              <Text style={[styles.issueText, issueCategory === issue.key && styles.issueTextActive]}>{issue[locale]}</Text>
            </Pressable>
          ))}
        </View>
        <Button label={matching ? (locale === "sw" ? "Inatafuta..." : "Matching...") : (locale === "sw" ? "Tafuta huduma inayofaa" : "Find suitable services")} loading={matching} disabled={matching} onPress={() => void runMatch()} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{locale === "sw" ? "Mapendekezo" : "Recommendations"}</Text>
        <Text style={styles.sectionMeta}>{locale === "sw" ? "Yaliyothibitishwa na salama kuonyesha" : "Verified and safe to show"}</Text>
      </View>

      {!services ? <ActivityIndicator color={colors.burgundy} style={styles.loading} /> : null}

      {list?.length ? list.map((item) => (
        <View key={String(item.service._id)} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.serviceIcon}>
              <Ionicons name={iconForType(item.service.servicePointType)} size={22} color={colors.burgundy} />
            </View>
            <View style={styles.cardCopy}>
              <Text style={styles.serviceName}>{item.service.name}</Text>
              <Text style={styles.serviceMeta}>{item.service.district}, {item.service.region}</Text>
            </View>
            <Text style={styles.statePill}>{item.service.currentIntakeState.replaceAll("_", " ")}</Text>
          </View>
          <Text style={styles.subhead}>{locale === "sw" ? "Kwa nini inaweza kufaa" : "Why this may fit"}</Text>
          {item.whySuitable.slice(0, 3).map((reason) => (
            <View key={reason} style={styles.reasonRow}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.teal} />
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
          <View style={styles.chips}>
            {item.service.serviceTypes.slice(0, 3).map((serviceType) => (
              <Text key={serviceType} style={styles.chip}>{serviceType.replaceAll("_", " ")}</Text>
            ))}
          </View>
          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryAction} onPress={() => router.push("/paralegals")}>
              <Text style={styles.secondaryText}>{locale === "sw" ? "Ona paralegal" : "View paralegals"}</Text>
            </Pressable>
            <Pressable style={styles.primaryAction} onPress={() => router.push("/intake")}>
              <Text style={styles.primaryText}>{locale === "sw" ? "Omba msaada" : "Request help"}</Text>
              <Ionicons name="arrow-forward" size={17} color={colors.surface} />
            </Pressable>
          </View>
        </View>
      )) : services ? (
        <View style={styles.empty}>
          <Ionicons name="compass-outline" size={42} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{locale === "sw" ? "Huduma bado hazijawekwa" : "No services seeded yet"}</Text>
          <Text style={styles.emptyText}>
            {locale === "sw"
              ? "LSF inaweza kuweka huduma zilizothibitishwa kwenye mazingira ya majaribio bila kuweka data ya uongo kwenye app."
              : "LSF can seed verified services into the QA environment without hardcoding fake app data."}
          </Text>
          <Button label={locale === "sw" ? "Omba LSF ikupangie" : "Let LSF match me"} onPress={() => router.push("/intake")} />
        </View>
      ) : null}
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
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.md, marginBottom: spacing.xl },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 18 },
  headerAction: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  hero: { borderRadius: 30, backgroundColor: colors.charcoal, padding: spacing.xl, gap: spacing.md, marginBottom: spacing.lg },
  kicker: { fontFamily: type.bold, color: colors.peach, fontSize: 12, letterSpacing: 0.8 },
  title: { fontFamily: type.bold, color: colors.surface, fontSize: 28, lineHeight: 33, letterSpacing: -0.8 },
  body: { fontFamily: type.regular, color: colors.surface, fontSize: 13, lineHeight: 20, opacity: 0.9 },
  formCard: { borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, gap: spacing.md },
  label: { fontFamily: type.bold, color: colors.charcoal, fontSize: 12 },
  input: { minHeight: 50, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFCFD", paddingHorizontal: spacing.md, fontFamily: type.regular, color: colors.charcoal, fontSize: 14 },
  issueGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  issueChip: { borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  issueChipActive: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  issueText: { fontFamily: type.bold, color: colors.inkMuted, fontSize: 12 },
  issueTextActive: { color: colors.burgundy },
  sectionHeader: { marginTop: spacing.xl, marginBottom: spacing.md, gap: 3 },
  sectionTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 20 },
  sectionMeta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13 },
  loading: { marginTop: spacing.xl },
  card: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.md, marginBottom: spacing.md },
  cardTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  serviceIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  cardCopy: { flex: 1, gap: 3 },
  serviceName: { fontFamily: type.bold, color: colors.charcoal, fontSize: 15, lineHeight: 20 },
  serviceMeta: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12 },
  statePill: { overflow: "hidden", borderRadius: radius.pill, backgroundColor: colors.tealSoft, color: colors.teal, paddingHorizontal: spacing.sm, paddingVertical: 5, fontFamily: type.bold, fontSize: 10, textTransform: "capitalize" },
  subhead: { fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  reasonRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  reasonText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 12, lineHeight: 18 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  chip: { overflow: "hidden", borderRadius: radius.pill, backgroundColor: "#FFF7FA", borderWidth: 1, borderColor: "#E8B8CC", paddingHorizontal: spacing.sm, paddingVertical: 4, fontFamily: type.medium, color: colors.burgundy, fontSize: 10, textTransform: "capitalize" },
  actionRow: { flexDirection: "row", gap: spacing.sm },
  secondaryAction: { flex: 1, minHeight: 44, borderRadius: radius.pill, borderWidth: 1, borderColor: "#E8B8CC", alignItems: "center", justifyContent: "center" },
  secondaryText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  primaryAction: { flex: 1, minHeight: 44, borderRadius: radius.pill, backgroundColor: colors.burgundy, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.xs },
  primaryText: { fontFamily: type.bold, color: colors.surface, fontSize: 12 },
  empty: { alignItems: "center", gap: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl },
  emptyTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 18, textAlign: "center" },
  emptyText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20, textAlign: "center" },
});
