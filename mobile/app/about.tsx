import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BrandMark } from "../src/components/BrandMark";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { colors, radius, spacing, type } from "../src/theme";

export default function AboutScreen() {
  const { locale } = useLanguage();
  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable>
        <Text style={styles.headerTitle}>{locale === "sw" ? "Kuhusu" : "About"}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.hero}>
        <BrandMark />
        <Text style={styles.title}>Haki Yangu</Text>
        <Text style={styles.tagline}>{locale === "sw" ? "Haki ya kila siku kwa maisha ya kila siku." : "Everyday justice for everyday lives."}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{locale === "sw" ? "Tunachofanya" : "What this app does"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Haki Yangu hukusaidia kuelewa haki zako, kutuma ombi la msaada, kupata msaidizi wa kisheria, kufuatilia kesi, kuhifadhi nyaraka, na kuuliza Haki kwa taarifa rahisi."
            : "Haki Yangu helps you understand your rights, request support, find legal helpers, track cases, store documents, and ask Haki for simple information."}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{locale === "sw" ? "Mipaka muhimu" : "Important limits"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "App hii si huduma ya dharura, si wakili wako, na Haki haitoi ushauri wa kisheria unaobadilisha mtaalamu. Kwa hatari ya haraka, tafuta huduma rasmi ya dharura."
            : "This app is not an emergency service, is not your lawyer, and Haki does not replace professional legal advice. For immediate danger, contact official emergency help."}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© Legal Services Facility</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  headerSpacer: { width: 26 },
  hero: { marginTop: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md },
  title: { fontFamily: type.bold, color: colors.burgundy, fontSize: 36, lineHeight: 42 },
  tagline: { fontFamily: type.medium, color: colors.charcoal, fontSize: 16, lineHeight: 23 },
  card: { marginTop: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.sm },
  cardTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 22 },
  footer: { marginTop: spacing.xl, marginBottom: spacing.xl, gap: spacing.xs },
  footerText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, textAlign: "center" },
});
