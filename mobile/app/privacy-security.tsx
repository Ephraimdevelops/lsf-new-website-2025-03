import { PresenceSettings } from "../src/components/PresenceSettings";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../src/components/Screen";
import { DeleteAccount } from "../src/components/DeleteAccount";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

const practices = {
  sw: [
    "Ukichagua kuhifadhi rasimu, itawekwa sehemu iliyolindwa kwenye simu hii.",
    "Orodha za maandalizi ulizohifadhi hukumbukwa kwenye kifaa hiki. Mtu anayeweza kutumia kifaa anaweza kuona mada hizo.",
    "Ingia kuona historia ya Haki Yangu AI na kesi zako.",
    "Ujumbe, nyaraka, na hatua za kesi zinaonekana kwa watu wenye ruhusa kwenye kesi hiyo.",
    "Arifa zinaepuka kuonyesha maelezo nyeti ya kesi.",
  ],
  en: [
    "If you choose to save a draft, it stays in secure storage on this device.",
    "Saved preparation checklists are remembered on this device. Someone with access to the device may see those topics.",
    "Sign in to see your Haki Yangu AI history and cases.",
    "Messages, documents, and case steps are visible only to authorized case participants.",
    "Notifications avoid exposing sensitive case details.",
  ],
};

export default function PrivacySecurityScreen() {
  const { locale } = useLanguage();
  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={locale === "sw" ? "Rudi" : "Back"}
          style={styles.backButton}
          onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)/profile")}
        ><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Faragha" : "Privacy"}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <PresenceSettings />
      <View style={styles.hero}>
        <Ionicons name="shield-checkmark-outline" size={42} color={colors.burgundy} />
        <Text style={styles.title}>{locale === "sw" ? "Jinsi taarifa zako zinavyotumika" : "How your information is used"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Angalia kinachohifadhiwa na nani anaweza kukiona."
            : "See what is saved and who can see it."}
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
      <DeleteAccount />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 },
  backButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  headerSpacer: { width: 48 },
  hero: { marginTop: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md },
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 28, lineHeight: 34 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  card: { marginTop: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  rowText: { flex: 1, fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 13, lineHeight: 20 },
  warningCard: { marginTop: spacing.xl, flexDirection: "row", gap: spacing.md, backgroundColor: colors.softPink, borderRadius: radius.md, padding: spacing.lg },
  warningText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
});
