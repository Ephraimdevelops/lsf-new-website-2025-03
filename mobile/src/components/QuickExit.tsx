import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import type { Locale } from "../i18n";
import { colors, radius, spacing, type } from "../theme";

export function QuickExit({ locale }: { locale: Locale }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={locale === "sw" ? "Ondoka haraka" : "Quick exit"}
      onPress={() => router.replace("/(tabs)")}
      style={styles.button}
    >
      <Ionicons name="exit-outline" size={16} color={colors.surface} />
      <Text style={styles.text}>{locale === "sw" ? "Toka" : "Exit"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.burgundy,
    paddingHorizontal: spacing.md,
  },
  text: { fontFamily: type.bold, color: colors.surface, fontSize: 12 },
});
