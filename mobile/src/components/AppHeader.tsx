import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, type } from "../theme";

export function AppHeader({ title, eyebrow, avatarUrl, initial = "H", back = false, onBell }: {
  title: string;
  eyebrow?: string;
  avatarUrl?: string;
  initial?: string;
  back?: boolean;
  onBell?: () => void;
}) {
  return (
    <View style={styles.header}>
      {back ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={23} color={colors.ink} />
        </Pressable>
      ) : avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatar}><Text style={styles.initial}>{initial.slice(0, 1).toUpperCase()}</Text></View>
      )}
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.82}>{title}</Text>
      </View>
      {onBell ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={onBell} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={22} color={colors.ink} />
        </Pressable>
      ) : <View style={styles.iconSpacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingTop: spacing.sm, marginBottom: spacing.xl },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.burgundySoft, alignItems: "center", justifyContent: "center" },
  initial: { fontFamily: type.bold, fontWeight: "700", color: colors.burgundy, fontSize: 18 },
  copy: { flex: 1, gap: 2 },
  eyebrow: { fontFamily: type.medium, fontWeight: "500", color: colors.inkMuted, fontSize: 13 },
  title: { fontFamily: type.bold, fontWeight: "700", color: colors.ink, fontSize: 21, letterSpacing: -0.45 },
  iconButton: { width: 46, height: 46, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  iconSpacer: { width: 46 },
});
