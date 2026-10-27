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
            ? "Elewa haki zako, omba msaada na fuatilia kesi. Unaweza pia kuhifadhi hati na kuuliza Haki Yangu AI."
            : "Understand your rights, request help and track cases. You can also save documents and ask Haki Yangu AI."}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{locale === "sw" ? "Mipaka muhimu" : "Important limits"}</Text>
        <Text style={styles.body}>
          {locale === "sw"
            ? "Haki Yangu si huduma ya dharura. Majibu ya AI yanaweza kukosea na hayachukui nafasi ya wakili. Ukiwa hatarini sasa, tafuta huduma ya dharura."
            : "Haki Yangu is not an emergency service. AI answers can be wrong and do not replace a lawyer. For immediate danger, contact official emergency help."}
        </Text>
      </View>
      <Pressable accessibilityRole="link" onPress={() => router.push("/font-license")} style={styles.licenseLink}>
        <Text style={styles.licenseLinkText}>{locale === "sw" ? "Leseni ya fonti ya Onest" : "Onest font license"}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.burgundy} />
      </Pressable>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© Legal Services Facility</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  headerTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 },
  headerSpacer: { width: 26 },
  hero: { marginTop: spacing.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md },
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 36, lineHeight: 42 },
  tagline: { fontFamily: type.medium, fontWeight: "500", color: colors.charcoal, fontSize: 16, lineHeight: 23 },
  card: { marginTop: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.sm },
  cardTitle: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17 },
  body: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 22 },
  licenseLink: { minHeight: 48, marginTop: spacing.lg, paddingHorizontal: spacing.lg, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  licenseLinkText: { fontFamily: type.medium, color: colors.burgundy, fontSize: 14 },
  footer: { marginTop: spacing.xl, marginBottom: spacing.xl, gap: spacing.xs },
  footerText: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, textAlign: "center" },
});
