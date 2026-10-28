import type { ReactNode } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { colors, radius, shadow, spacing, type, typography } from "../theme";

export function SectionHeading({ title, action }: { title: string; action?: string }) {
  return <View style={styles.heading}><Text accessibilityRole="header" style={styles.title}>{title}</Text>{action ? <Text style={styles.action}>{action}</Text> : null}</View>;
}

export function Surface({ children, tone = "white", style }: { children: ReactNode; tone?: "white" | "pink" | "orange" | "teal" | "gold"; style?: ViewStyle }) {
  return <View style={[styles.surface, tones[tone], style]}>{children}</View>;
}

const tones = StyleSheet.create({
  white: { backgroundColor: colors.surface },
  pink: { backgroundColor: colors.burgundySoft },
  orange: { backgroundColor: colors.orangeSoft },
  teal: { backgroundColor: colors.tealSoft },
  gold: { backgroundColor: colors.goldSoft },
});

const styles = StyleSheet.create({
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, marginTop: spacing.xxl, marginBottom: spacing.md },
  title: { ...typography.sectionTitle, flex: 1 },
  action: { fontFamily: type.medium, fontWeight: "500", color: colors.burgundy, fontSize: 13 },
  surface: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, ...shadow.card },
});
