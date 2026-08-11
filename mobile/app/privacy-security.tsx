import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const practices = {
  sw: [
    "Unaweza kuhifadhi rasimu ya intake kwenye kifaa hiki kwa hiari; inahifadhiwa kwenye storage salama ya app.",
    "Miongozo uliyohifadhi huhifadhiwa kwenye storage salama ya app kwa sababu inaweza kuonyesha mada unazojali.",
    "Historia ya Haki na kesi zinahitaji akaunti salama.",
    "Ujumbe, nyaraka, na hatua za kesi zinaonekana kwa watu wenye ruhusa kwenye kesi hiyo.",
    "Arifa zinaepuka kuonyesha maelezo nyeti ya kesi.",
  ],
  en: [
    "You can explicitly save an intake draft on this device; it is stored in the app's secure storage.",
    "Saved guides are stored in the app's secure storage because they can reveal topics you care about.",
    "Haki history and cases require a secure account.",
    "Messages, documents, and case steps are visible only to authorized case participants.",
    "Notifications avoid exposing sensitive case details.",
  ],
};

export default function PrivacySecurityScreen() {
  const { locale } = useLanguage();
  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Faragha" : "Privacy"}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.hero}>
        <Ionicons name="shield-checkmark-outline" size={42} color={colors.burgundy} />
        <Text style={styles.title}>{locale === "sw" ? "Taarifa zako zinalindwa" : "Your information is protected"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Haki Yangu imeundwa kwa tahadhari kwa sababu masuala ya kisheria yanaweza kuwa nyeti."
            : "Haki Yangu is designed carefully because legal support information can be sensitive."}
        </Text>
      </View>
      <View style={styles.card}>
        {practices[locale].map((practice) => (
          <View key={practice} style={styles.row}>
            <Ionicons name="checkmark-circle-outline" size={21} color={colors.success} />
            <Text style={styles.rowText}>{practice}</Text>
          </View>
        ))}
      </View>
      <View style={styles.warningCard}>
        <Ionicons name="eye-off-outline" size={24} color={colors.burgundy} />
        <Text style={styles.warningText}>
          {locale === "sw"
            ? "Ikiwa mtu mwingine anaweza kuona simu yako, tumia kifaa salama na epuka kuandika maelezo yanayoweza kuongeza hatari."
            : "If someone else can see your phone, use a safer device and avoid writing details that could increase risk."}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  headerSpacer: { width: 26 },
  hero: { marginTop: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 28, lineHeight: 34 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  card: { marginTop: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  rowText: { flex: 1, fontFamily: type.medium, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  warningCard: { marginTop: spacing.xl, flexDirection: "row", gap: spacing.md, backgroundColor: colors.softPink, borderRadius: radius.md, padding: spacing.lg },
  warningText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
});
