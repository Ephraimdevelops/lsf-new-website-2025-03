import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { usePendingActions } from "../src/pendingActions";
import { resources } from "../src/resources";
import { useSavedResources } from "../src/useSavedResources";
import { colors, radius, spacing, type } from "../src/theme";

export default function OfflineScreen() {
  const { locale } = useLanguage();
  const { savedIds } = useSavedResources();
  const pendingActions = usePendingActions();
  const savedResources = savedIds
    .map((id) => resources.find((resource) => resource.id === id))
    .filter((resource) => resource !== undefined);
  const fallbackResources = resources.slice(0, 4);
  const visibleResources = savedResources.length ? savedResources : fallbackResources;

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Go back"} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
        </Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Nje ya mtandao" : "Offline mode"}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.hero}>
        <Ionicons name="cloud-offline-outline" size={46} color={colors.surface} />
        <Text style={styles.title}>{locale === "sw" ? "Unaweza kuendelea kusoma" : "You can keep reading"}</Text>
        <Text style={styles.heroBody}>
          {locale === "sw"
            ? "Miongozo iliyopo ndani ya app na uliyoihifadhi inaweza kufunguliwa bila mtandao. Baadhi ya hatua za kesi huhifadhiwa kwenye kifaa na kutumwa mtandao ukirudi."
            : "Built-in and saved guides can open without network. Some case actions are saved on this device and sent when your connection returns."}
        </Text>
      </View>

      <View style={styles.syncCard}>
        <View style={styles.syncHeader}>
          <Text style={styles.sectionKicker}>{locale === "sw" ? "Vinavyosubiri kutumwa" : "Pending sync"}</Text>
          <Text style={styles.syncCount}>{pendingActions.pendingCount}</Text>
        </View>
        {pendingActions.pendingCount ? (
          pendingActions.actions.slice(0, 5).map((action) => (
            <View key={action.id} style={styles.checkRow}>
              <Ionicons name="time-outline" size={18} color={colors.burgundy} />
              <Text style={styles.checkText}>
                {action.type.replaceAll("_", " ")} · {new Date(action.createdAt).toLocaleString(locale === "sw" ? "sw-TZ" : "en-TZ", { dateStyle: "medium", timeStyle: "short" })}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.checkRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
            <Text style={styles.checkText}>{locale === "sw" ? "Hakuna hatua inayosubiri kutumwa." : "No pending actions are waiting to sync."}</Text>
          </View>
        )}
      </View>

      <View style={styles.syncCard}>
        <Text style={styles.sectionKicker}>{locale === "sw" ? "Kinachohitaji mtandao" : "Needs connection"}</Text>
        {[
          locale === "sw" ? "Kutuma au kufuatilia ombi la msaada" : "Submitting or tracking a help request",
          locale === "sw" ? "Kutuma ujumbe, maoni, au ombi la miadi moja kwa moja" : "Sending messages, feedback, or appointment requests immediately",
          locale === "sw" ? "Kupakia nyaraka" : "Uploading documents",
          locale === "sw" ? "Kupata majibu ya Haki" : "Getting Haki answers",
        ].map((item) => (
          <View key={item} style={styles.checkRow}>
            <Ionicons name="time-outline" size={18} color={colors.burgundy} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{savedResources.length ? (locale === "sw" ? "Miongozo uliyohifadhi" : "Saved guides") : (locale === "sw" ? "Miongozo muhimu" : "Essential guides")}</Text>
      <View style={styles.resourceList}>
        {visibleResources.map((resource) => (
          <Pressable key={resource.id} style={styles.resourceCard} onPress={() => router.push({ pathname: "/resource/[id]", params: { id: resource.id } })}>
            <View style={[styles.iconChip, { backgroundColor: resource.color }]}>
              <Ionicons name={resource.icon} size={22} color={colors.burgundy} />
            </View>
            <View style={styles.resourceCopy}>
              <Text style={styles.resourceTitle}>{resource.title[locale]}</Text>
              <Text style={styles.resourceSummary} numberOfLines={2}>{resource.summary[locale]}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
          </Pressable>
        ))}
      </View>

      <View style={styles.safetyCard}>
        <Ionicons name="shield-checkmark-outline" size={28} color={colors.burgundy} />
        <View style={styles.resourceCopy}>
          <Text style={styles.safetyTitle}>{locale === "sw" ? "Kama kuna hatari ya haraka" : "If there is immediate danger"}</Text>
          <Text style={styles.resourceSummary}>
            {locale === "sw"
              ? "Tafuta msaada wa dharura wa eneo lako au mtu unayemwamini. Haki Yangu si huduma ya dharura."
              : "Contact local emergency help or a trusted person. Haki Yangu is not an emergency service."}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  headerSpacer: { width: 26 },
  hero: { marginTop: spacing.xl, backgroundColor: colors.burgundy, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md },
  title: { fontFamily: type.bold, color: colors.surface, fontSize: 28, lineHeight: 34 },
  heroBody: { fontFamily: type.regular, color: "#FBE7EF", fontSize: 14, lineHeight: 21 },
  syncCard: { marginTop: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  syncHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  syncCount: { fontFamily: type.bold, color: colors.burgundy, backgroundColor: colors.softPink, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  sectionKicker: { fontFamily: type.bold, color: colors.burgundy, fontSize: 11, textTransform: "uppercase" },
  checkRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  checkText: { flex: 1, fontFamily: type.medium, color: colors.charcoal, fontSize: 13, lineHeight: 19 },
  sectionTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 18, marginTop: spacing.xl, marginBottom: spacing.md },
  resourceList: { gap: spacing.md },
  resourceCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md },
  iconChip: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  resourceCopy: { flex: 1 },
  resourceTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 14 },
  resourceSummary: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
  safetyCard: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.softPink, borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.xl },
  safetyTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 14 },
});
