import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const supportActions = [
  { key: "request", icon: "document-text-outline", route: "/intake", sw: "Omba msaada", en: "Request help", swHelp: "Tuma maelezo ya tatizo lako kwa LSF.", enHelp: "Send your issue details to LSF." },
  { key: "sara", icon: "sparkles-outline", route: "/sara", sw: "Uliza Haki", en: "Ask Haki", swHelp: "Pata taarifa rahisi na hatua zinazofuata.", enHelp: "Get simple information and next steps." },
  { key: "safety", icon: "warning-outline", route: "/safety", sw: "Mpango wa usalama", en: "Safety plan", swHelp: "Anza hapa kama hali ni nyeti au hatari.", enHelp: "Start here if the situation is sensitive or unsafe." },
  { key: "learn", icon: "book-outline", route: "/(tabs)/learn", sw: "Soma miongozo", en: "Read guides", swHelp: "Elewa haki zako kwa lugha rahisi.", enHelp: "Understand your rights in plain language." },
] as const;

export default function SupportScreen() {
  const { locale } = useLanguage();
  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Msaada" : "Support"}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <Text style={styles.title}>{locale === "sw" ? "Unahitaji nini sasa?" : "What do you need now?"}</Text>
      <Text style={styles.body}>
        {locale === "sw"
          ? "Chagua njia inayofaa. Kama kuna hatari ya haraka, tafuta huduma rasmi ya dharura kwanza."
          : "Choose the right path. If there is immediate danger, contact official emergency help first."}
      </Text>
      <View style={styles.list}>
        {supportActions.map((action) => (
          <Pressable key={action.key} style={styles.card} onPress={() => router.push(action.route)}>
            <View style={styles.iconChip}><Ionicons name={action.icon} size={23} color={colors.burgundy} /></View>
            <View style={styles.copy}>
              <Text style={styles.cardTitle}>{action[locale]}</Text>
              <Text style={styles.cardBody}>{locale === "sw" ? action.swHelp : action.enHelp}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  headerSpacer: { width: 26 },
  title: { marginTop: spacing.xl, fontFamily: type.bold, color: colors.charcoal, fontSize: 30, lineHeight: 36 },
  body: { marginTop: spacing.sm, fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 23 },
  list: { marginTop: spacing.xl, gap: spacing.md },
  card: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg },
  iconChip: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1 },
  cardTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 15 },
  cardBody: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
});
