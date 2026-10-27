import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../src/components/Screen";
import { useLanguage } from "../src/i18n";
import { onestLicense } from "../src/onestLicense";
import { colors, spacing, type } from "../src/theme";

export default function FontLicenseScreen() {
  const { locale } = useLanguage();
  return <Screen>
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Back"} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={26} color={colors.burgundy} />
      </Pressable>
      <Text style={styles.title}>{locale === "sw" ? "Leseni ya fonti" : "Font license"}</Text>
    </View>
    <Text style={styles.intro}>Onest · SIL Open Font License 1.1</Text>
    <Text selectable style={styles.license}>{onestLicense}</Text>
  </Screen>;
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingTop: spacing.md },
  title: { fontFamily: type.bold, color: colors.ink, fontSize: 22 },
  intro: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 14, marginTop: spacing.lg },
  license: { fontFamily: type.regular, color: colors.ink, fontSize: 12, lineHeight: 19, marginTop: spacing.lg },
});
