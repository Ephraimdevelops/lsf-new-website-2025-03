import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useUser } from "../auth";
import { useLanguage } from "../i18n";
import { colors, spacing, type } from "../theme";

export function AppHeader({ title, eyebrow, avatarUrl, initial = "H", back = false, onBell, showAvatar = true }: {
  title: string;
  eyebrow?: string;
  avatarUrl?: string;
  initial?: string;
  back?: boolean;
  onBell?: () => void;
  showAvatar?: boolean;
}) {
  const { locale } = useLanguage();
  const { user } = useUser();
  const imageUrl = avatarUrl ?? user?.imageUrl;

  return <View style={styles.header}>
    {back ? <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Rudi" : "Go back"} onPress={() => router.back()} style={styles.iconButton}><Ionicons name="chevron-back" size={24} color={colors.ink} /></Pressable> : showAvatar ? <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Fungua wasifu" : "Open profile"} onPress={() => router.push("/(tabs)/profile")} style={styles.avatarButton}>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.avatar} /> : <View style={styles.avatar}><Text style={styles.initial}>{initial.slice(0, 1).toUpperCase()}</Text></View>}
    </Pressable> : null}
    <View style={styles.copy}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.82}>{title}</Text>
    </View>
    {onBell ? <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Arifa" : "Notifications"} onPress={onBell} style={styles.iconButton}><Ionicons name="notifications-outline" size={22} color={colors.ink} /></Pressable> : null}
  </View>;
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingTop: spacing.sm, marginBottom: spacing.xl },
  avatarButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" },
  initial: { fontFamily: type.semibold, color: colors.burgundy, fontSize: 18 },
  copy: { flex: 1, gap: 2 },
  eyebrow: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  title: { fontFamily: type.semibold, color: colors.ink, fontSize: 21 },
  iconButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center" },
});
