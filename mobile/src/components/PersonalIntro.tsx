import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useLanguage } from "../i18n";
import { colors, type } from "../theme";
import { usePersonalIdentity } from "../usePersonalIdentity";

export function PersonalAvatar({ size = 72 }: { size?: number }) {
  const { imageUrl, initials, name } = usePersonalIdentity();
  const [failedUrl, setFailedUrl] = useState<string>();
  const dimensions = { width: size, height: size, borderRadius: size / 2 };
  return imageUrl && failedUrl !== imageUrl
    ? <Image accessibilityLabel={name} source={{ uri: imageUrl }} style={dimensions} onError={() => setFailedUrl(imageUrl)} />
    : <View style={[styles.avatar, dimensions]}>{initials ? <Text style={[styles.initials, { fontSize: size / 3 }]}>{initials}</Text> : <Ionicons name="person-outline" size={size / 2} color={colors.burgundy} />}</View>;
}

export function PersonalIntro({ body, profile = false }: { body: string; profile?: boolean }) {
  const { name, greeting } = usePersonalIdentity();
  const { locale } = useLanguage();
  return <View style={styles.intro}>
    <View style={styles.copy}><Text style={styles.title}>{profile ? name || (locale === "sw" ? "Akaunti yako" : "Your account") : greeting}</Text><Text style={styles.body}>{body}</Text></View>
    <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Fungua wasifu" : "Open profile"} onPress={() => router.push("/(tabs)/profile")}><PersonalAvatar /></Pressable>
  </View>;
}

const styles = StyleSheet.create({
  intro: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 24 },
  copy: { flex: 1, gap: 8 },
  title: { fontFamily: type.semibold, fontSize: 24, lineHeight: 31, color: colors.ink },
  body: { fontFamily: type.regular, fontSize: 15, lineHeight: 23, color: colors.inkMuted },
  avatar: { alignItems: "center", justifyContent: "center", backgroundColor: colors.burgundySoft },
  initials: { fontFamily: type.semibold, color: colors.burgundy },
});
