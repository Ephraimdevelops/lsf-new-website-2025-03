import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";

const issueCards = [
  { key: "employment", title: { sw: "Ajira", en: "Employment" }, body: { sw: "Haki za kazi, kufukuzwa, au mishahara.", en: "Workplace rights, unfair dismissal, or pay issues." }, icon: "briefcase-outline" },
  { key: "land", title: { sw: "Ardhi", en: "Land" }, body: { sw: "Umiliki, mipaka, au kufukuzwa.", en: "Land ownership, boundaries, or eviction." }, icon: "document-outline" },
  { key: "family", title: { sw: "Familia", en: "Family" }, body: { sw: "Talaka, urithi, watoto, au msaada.", en: "Divorce, inheritance, child custody, or support." }, icon: "people-outline" },
  { key: "safety", title: { sw: "Usalama", en: "Safety" }, body: { sw: "Vitisho, GBV, au ulinzi wa haraka.", en: "Threats, GBV, or immediate safety concerns." }, icon: "shield-checkmark-outline" },
  { key: "consumer", title: { sw: "Mlaji", en: "Consumer" }, body: { sw: "Bidhaa mbovu, huduma duni, au marejesho.", en: "Defective products, poor services, or refunds." }, icon: "bag-handle-outline" },
  { key: "custom", title: { sw: "Tuambie kilichotokea", en: "Tell us what happened" }, body: { sw: "Eleza tatizo lako kwa maneno yako mwenyewe.", en: "Describe your issue in your own words." }, icon: "create-outline" },
] as const;

export default function HelpScreen() {
  const { locale } = useLanguage();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Omba msaada" : "Request help"}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressDot, styles.progressDotActive]} />
        <View style={styles.progressLine} />
        <View style={styles.progressDot} />
        <View style={styles.progressLine} />
        <View style={styles.progressDot} />
      </View>
      <Text style={styles.title}>{locale === "sw" ? "Ni msaada gani unahitaji?" : "What kind of help do you need?"}</Text>
      <Text style={styles.body}>{locale === "sw" ? "Chagua aina ya tatizo linalofanana zaidi na hali yako." : "Choose a category that best describes your issue."}</Text>

      <View style={styles.cardList}>
        {issueCards.map((item) => (
          <Pressable key={item.key} style={styles.issueCard} onPress={() => router.push("/intake")}>
            <View style={styles.issueIcon}>
              <Ionicons name={item.icon} size={23} color={item.key === "consumer" ? colors.orange : colors.burgundy} />
            </View>
            <View style={styles.issueCopy}>
              <Text style={styles.issueTitle}>{item.title[locale]}</Text>
              <Text style={styles.issueBody}>{item.body[locale]}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.burgundy} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", paddingTop: spacing.md, marginBottom: spacing.lg },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 22, letterSpacing: -0.4 },
  progressTrack: { flexDirection: "row", alignItems: "center", alignSelf: "center", width: 170, marginBottom: spacing.xl },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#DDD4D8" },
  progressDotActive: { backgroundColor: colors.burgundy },
  progressLine: { flex: 1, height: 2, backgroundColor: "#DDD4D8", marginHorizontal: spacing.xs },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 27, lineHeight: 32, letterSpacing: -0.6 },
  body: { marginTop: spacing.sm, fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  cardList: { marginTop: spacing.xl, gap: spacing.md },
  issueCard: { minHeight: 88, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: "#F0E3E7", padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  issueIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#FAEFF3", alignItems: "center", justifyContent: "center" },
  issueCopy: { flex: 1, gap: 3 },
  issueTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 15 },
  issueBody: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
});
