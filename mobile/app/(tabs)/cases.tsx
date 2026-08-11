import { useAuth } from "../../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../../src/backend/api";
import { caseStatusLabels } from "../../src/caseLabels";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";

export default function CasesScreen() {
  const { isSignedIn } = useAuth();
  const { locale, t } = useLanguage();
  const cases = useQuery(api.caseManagement.myCases, isSignedIn ? {} : "skip");
  const demoCases = [
    {
      id: "demo-unpaid-salary",
      publicId: "HY-2025-000123",
      status: locale === "sw" ? "Inakaguliwa" : "Under review",
      summary: locale === "sw" ? "Ombi la mshahara ambao haujalipwa. LSF inapitia maelezo yako." : "Unpaid salary request. LSF is reviewing your details.",
      updated: locale === "sw" ? "Leo, 10:30 AM" : "Today, 10:30 AM",
    },
    {
      id: "demo-land",
      publicId: "HY-2025-000245",
      status: locale === "sw" ? "Amepewa paralegal" : "Assigned",
      summary: locale === "sw" ? "Mgogoro wa mpaka wa ardhi. Paralegal Rehema amepangiwa kufuatilia." : "Land boundary dispute. Paralegal Rehema has been assigned for follow-up.",
      updated: locale === "sw" ? "Jana, 2:15 PM" : "Yesterday, 2:15 PM",
    },
  ];
  return (
    <Screen>
      <Text style={styles.title}>{t("cases")}</Text>
      {isSignedIn && cases?.length ? cases.map((item) => (
        <Pressable key={item._id} style={styles.card} onPress={() => router.push({ pathname: "/case/[id]", params: { id: item._id } })}>
          <View style={styles.row}><Text style={styles.caseId}>{item.publicId}</Text><Text style={styles.status}>{caseStatusLabels[locale][item.status]}</Text></View>
          <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
          <Text style={styles.updated}>{new Date(item.updatedAt).toLocaleDateString(locale === "sw" ? "sw-TZ" : "en-TZ")}</Text>
        </Pressable>
      )) : demoCases.map((item) => (
        <Pressable key={item.id} style={styles.card} onPress={() => router.push("/appointments")}>
          <View style={styles.row}><Text style={styles.caseId}>{item.publicId}</Text><Text style={styles.status}>{item.status}</Text></View>
          <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
          <Text style={styles.updated}>{item.updated}</Text>
        </Pressable>
      ))}
      <View style={styles.nextCard}>
        <Ionicons name="git-branch-outline" size={24} color={colors.burgundy} />
        <View style={styles.nextCopy}>
          <Text style={styles.nextTitle}>{locale === "sw" ? "Endelea na flow" : "Continue the flow"}</Text>
          <Text style={styles.body}>{locale === "sw" ? "Tuma ombi jipya au angalia hatua za kesi na mawasiliano." : "Submit a new request or view timeline and case messaging."}</Text>
        </View>
      </View>
      <Button label={t("startRequest")} onPress={() => router.push("/intake")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 30, marginTop: spacing.lg, marginBottom: spacing.xl },
  empty: { marginTop: 80, alignItems: "center", gap: spacing.lg },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 22, textAlign: "center" },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.line, marginBottom: spacing.md, gap: spacing.sm },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.sm },
  caseId: { fontFamily: type.bold, color: colors.charcoal, fontSize: 14 },
  status: { fontFamily: type.medium, color: colors.success, backgroundColor: "#E7F4ED", borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontSize: 11 },
  summary: { fontFamily: type.regular, color: colors.charcoal, lineHeight: 20 },
  updated: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12 },
  nextCard: { flexDirection: "row", gap: spacing.md, backgroundColor: "#FFF7FA", borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: "#E8B8CC", marginTop: spacing.md, marginBottom: spacing.lg },
  nextCopy: { flex: 1, gap: spacing.xs },
  nextTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 15 },
});
