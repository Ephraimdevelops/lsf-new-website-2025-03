import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, type } from "../theme";

export function CivicPageIntro({ icon, eyebrow, title, description, tone = "burgundy" }: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  eyebrow: string;
  title: string;
  description: string;
  tone?: "burgundy" | "teal" | "orange";
}) {
  const accent = tone === "teal" ? colors.teal : tone === "orange" ? colors.orange : colors.burgundy;
  const tint = tone === "teal" ? colors.tealSoft : tone === "orange" ? colors.orangeSoft : colors.burgundySoft;
  return <View style={styles.intro}>
    <View style={[styles.symbol, { backgroundColor: tint }]}><Ionicons name={icon} size={29} color={accent} /></View>
    <Text style={[styles.eyebrow, { color: accent }]}>{eyebrow}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>;
}

const styles = StyleSheet.create({
  intro: { paddingTop: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm },
  symbol: { width: 64, height: 64, borderRadius: radius.lg, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  eyebrow: { fontFamily: type.semibold, fontSize: 12, letterSpacing: 0.4 },
  title: { color: colors.ink, fontFamily: type.semibold, fontSize: 30, lineHeight: 37 },
  description: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 16, lineHeight: 24 },
});
