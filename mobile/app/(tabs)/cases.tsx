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
  return (
    <Screen>
      <Text style={styles.title}>{t("cases")}</Text>
      {!isSignedIn ? (
        <View style={styles.empty}>
          <Ionicons name="lock-closed-outline" size={34} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{locale === "sw" ? "Ingia kuona kesi zako" : "Sign in to view your cases"}</Text>
          <Text style={styles.body}>
            {locale === "sw"
              ? "Kesi, ujumbe, miadi na nyaraka huonekana baada ya kuingia kwenye akaunti salama."
              : "Cases, messages, appointments, and documents appear only after secure sign-in."}
          </Text>
          <Button label={locale === "sw" ? "Ingia salama" : "Sign in securely"} onPress={() => router.push("/sign-in")} />
        </View>
      ) : cases === undefined ? (
        <View style={styles.empty}>
          <Ionicons name="hourglass-outline" size={32} color={colors.burgundy} />
          <Text style={styles.body}>{locale === "sw" ? "Tunapakua kesi zako..." : "Loading your cases..."}</Text>
        </View>
      ) : cases.length ? (
        cases.map((item) => (
          <Pressable key={item._id} style={styles.card} onPress={() => router.push({ pathname: "/case/[id]", params: { id: item._id } })}>
            <View style={styles.row}><Text style={styles.caseId}>{item.publicId}</Text><Text style={styles.status}>{caseStatusLabels[locale][item.status]}</Text></View>
            <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
            <Text style={styles.updated}>{new Date(item.updatedAt).toLocaleDateString(locale === "sw" ? "sw-TZ" : "en-TZ")}</Text>
          </Pressable>
        ))
      ) : (
        <View style={styles.empty}>
          <Ionicons name="folder-open-outline" size={34} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{locale === "sw" ? "Hakuna kesi bado" : "No cases yet"}</Text>
          <Text style={styles.body}>
            {locale === "sw"
              ? "Ombi lako likikubaliwa na LSF, kesi yako itaonekana hapa na hatua zinazofuata."
              : "When LSF accepts your request, your case and next steps will appear here."}
          </Text>
        </View>
      )}
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
  emptyTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 18, textAlign: "center" },
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
