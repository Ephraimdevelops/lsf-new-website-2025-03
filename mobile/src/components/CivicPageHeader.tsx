import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography, colors } from "../theme";
import { useLanguage } from "../i18n";

export function CivicPageHeader({ title, subtitle, compact = false, back, backLabel, onBack, actionIcon, actionLabel, onAction }: {
  title: string;
  subtitle?: string;
  compact?: boolean;
  back?: boolean;
  backLabel?: string;
  onBack?: () => void;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { locale } = useLanguage();
  return <View style={styles.header}>
    <View style={styles.top}>
      {back ? <Pressable accessibilityRole="button" accessibilityLabel={backLabel ?? (locale === "sw" ? "Rudi" : "Back")} onPress={onBack ?? (() => router.canGoBack() ? router.back() : router.replace("/(tabs)"))} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.ink} /></Pressable> : null}
      <Text accessibilityRole="header" style={[styles.title, compact && typography.compactTitle]}>{title}</Text>
      {actionIcon && actionLabel && onAction ? <Pressable accessibilityRole="button" accessibilityLabel={actionLabel} onPress={onAction} style={({ pressed }) => [styles.action, pressed && styles.pressed]}><Ionicons name={actionIcon} size={23} color={colors.burgundy} /></Pressable> : null}
    </View>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  header: { paddingTop: 12, marginBottom: 18 },
  top: { flexDirection: "row", alignItems: "center", gap: 10 },
  back: { width: 44, minHeight: 48, justifyContent: "center" },
  title: { flex: 1, ...typography.pageTitle },
  action: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  subtitle: { ...typography.body, marginTop: 6, color: colors.inkMuted },
  pressed: { opacity: 0.65 },
});
