import { useAuth } from "../../src/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../../src/backend/api";
import { caseStatusLabels } from "../../src/caseLabels";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { AppHeader } from "../../src/components/AppHeader";
import { useLanguage } from "../../src/i18n";
import { useAccountSync } from "../../src/useStoreUserEffect";
import { colors, radius, spacing, type } from "../../src/theme";

const requestStatus: Record<string, { sw: string; en: string }> = {
  submitted: { sw: "Limepokelewa", en: "Submitted" },
  under_review: { sw: "Linakaguliwa", en: "Under review" },
  waiting_for_information: { sw: "Taarifa zinahitajika", en: "Information needed" },
  information_only: { sw: "Taarifa zimetolewa", en: "Information provided" },
  referred: { sw: "Limeelekezwa", en: "Referred" },
  withdrawn: { sw: "Limeondolewa", en: "Withdrawn" },
  closed: { sw: "Limefungwa", en: "Closed" },
};

export default function CasesScreen() {
  const { isSignedIn } = useAuth();
  const { ready: accountReady } = useAccountSync();
  const { locale, t } = useLanguage();
  const cases = useQuery(api.caseManagement.myCases, isSignedIn && accountReady ? {} : "skip");
  const requests = useQuery(api.legalHelp.myRequests, isSignedIn && accountReady ? {} : "skip");
  const visibleRequests = requests?.filter((item) => item.status !== "converted_to_case") ?? [];
  return (
    <Screen>
      <AppHeader title={t("cases")} eyebrow={locale === "sw" ? "MAOMBI NA HATUA" : "REQUESTS & PROGRESS"} initial="C" />
      <View style={styles.hero}><Text style={styles.heroTitle}>{locale === "sw" ? "Fuatilia kila hatua." : "Follow every step."}</Text><Text style={styles.heroBody}>{locale === "sw" ? "Ujumbe, nyaraka na miadi yako hukaa pamoja na kesi husika." : "Messages, documents, and appointments stay with the right case."}</Text></View>
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
        <><Text style={styles.listHeading}>{locale === "sw" ? "Kesi zinazoendelea" : "Your cases"}</Text>
        {cases.map((item) => (
          <Pressable key={item._id} style={styles.card} onPress={() => router.push({ pathname: "/case/[id]", params: { id: item._id } })}>
            <View style={styles.row}><Text style={styles.caseId}>{item.publicId}</Text><Text style={styles.status}>{caseStatusLabels[locale][item.status]}</Text></View>
            <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
            <Text style={styles.updated}>{new Date(item.updatedAt).toLocaleDateString(locale === "sw" ? "sw-TZ" : "en-TZ")}</Text>
          </Pressable>
        ))}</>
      ) : (
        <View style={styles.empty}>
          <Ionicons name="folder-open-outline" size={34} color={colors.burgundy} />
          <Text style={styles.emptyTitle}>{visibleRequests.length ? (locale === "sw" ? "Ombi lako bado linashughulikiwa" : "Your request is still in progress") : (locale === "sw" ? "Hakuna kesi bado" : "No cases yet")}</Text>
          <Text style={styles.body}>
            {locale === "sw"
              ? "LSF ikifungua kesi, itaonekana hapa pamoja na hatua zinazofuata."
              : "If LSF opens a case, it will appear here with the next steps."}
          </Text>
        </View>
      )}
      {isSignedIn && visibleRequests.length ? <Text style={styles.listHeading}>{locale === "sw" ? "Maombi yangu" : "My requests"}</Text> : null}
      {isSignedIn && visibleRequests.map((item) => (
        <Pressable key={item._id} style={styles.requestCard} onPress={() => router.push({ pathname: "/request/[id]", params: { id: item._id } })}>
          <View style={styles.row}><Text style={styles.caseId}>{item.publicId}</Text><Text style={styles.status}>{requestStatus[item.status]?.[locale] ?? item.status.replaceAll("_", " ")}</Text></View>
          <Text style={styles.summary}>{locale === "sw" ? "Ombi lako linashughulikiwa na timu ya Haki Yangu." : "Your help request is being handled by the Haki Yangu team."}</Text>
          <View style={styles.openRow}><Text style={styles.openText}>{locale === "sw" ? "Angalia hatua inayofuata" : "View progress and next step"}</Text><Ionicons name="chevron-forward" size={18} color={colors.burgundy} /></View>
        </Pressable>
      ))}
      <View style={styles.nextCard}>
        <Ionicons name="git-branch-outline" size={24} color={colors.burgundy} />
        <View style={styles.nextCopy}>
          <Text style={styles.nextTitle}>{locale === "sw" ? "Unahitaji msaada zaidi?" : "Need more help?"}</Text>
          <Text style={styles.body}>{locale === "sw" ? "Tuma ombi jipya au angalia hatua za kesi na mawasiliano." : "Submit a new request or view timeline and case messaging."}</Text>
        </View>
      </View>
      <Button label={t("startRequest")} onPress={() => router.push("/intake")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 30, marginTop: spacing.lg, marginBottom: spacing.xl },
  listHeading: { fontFamily: type.bold, color: colors.ink, fontSize: 19, marginTop: spacing.md, marginBottom: spacing.md },
  hero: { borderRadius: radius.xl, backgroundColor: colors.tealSoft, padding: spacing.xl, marginBottom: spacing.lg },
  heroTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 27, letterSpacing: -0.6 },
  heroBody: { marginTop: spacing.sm, fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 20 },
  empty: { marginTop: spacing.xl, alignItems: "center", gap: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, padding: spacing.xl },
  emptyTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 18, textAlign: "center" },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 22, textAlign: "center" },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.line, marginBottom: spacing.md, gap: spacing.sm },
  requestCard: { backgroundColor: "#FFF7FA", borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: "#E8B8CC", marginBottom: spacing.md, gap: spacing.sm },
  openRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.xs }, openText: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 13 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.sm },
  caseId: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14 },
  status: { fontFamily: type.medium, fontWeight: "500", color: colors.success, backgroundColor: "#E7F4ED", borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5, fontSize: 13 },
  summary: { fontFamily: type.regular, color: colors.charcoal, lineHeight: 20 },
  updated: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13 },
  nextCard: { flexDirection: "row", gap: spacing.md, backgroundColor: "#FFF7FA", borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: "#E8B8CC", marginTop: spacing.md, marginBottom: spacing.lg },
  nextCopy: { flex: 1, gap: spacing.xs },
  nextTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 15 },
});
