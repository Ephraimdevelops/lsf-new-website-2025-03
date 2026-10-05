import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme";

type Variant = "welcome" | "verify" | "recover" | "success";

const settings: Record<Variant, { icon: React.ComponentProps<typeof Ionicons>["name"]; color: string; tint: string }> = {
  welcome: { icon: "shield-checkmark", color: colors.burgundy, tint: colors.burgundySoft },
  verify: { icon: "mail-unread", color: colors.burgundy, tint: colors.burgundySoft },
  recover: { icon: "key", color: colors.teal, tint: colors.tealSoft },
  success: { icon: "checkmark", color: colors.teal, tint: colors.tealSoft },
};

export function AuthVisual({ variant }: { variant: Variant }) {
  const item = settings[variant];
  return <View style={[styles.halo, { backgroundColor: item.tint }]} accessible={false}>
    <View style={[styles.medallion, { backgroundColor: item.color }]}>
      <Ionicons name={item.icon} size={54} color={colors.surface} />
    </View>
    <View style={[styles.dot, styles.dotLeft, { backgroundColor: colors.gold }]} />
    <View style={[styles.dot, styles.dotRight, { backgroundColor: colors.teal }]} />
  </View>;
}

const styles = StyleSheet.create({
  halo: { width: 164, height: 164, borderRadius: 82, alignItems: "center", justifyContent: "center", alignSelf: "center" },
  medallion: { width: 112, height: 112, borderRadius: 56, alignItems: "center", justifyContent: "center", shadowColor: colors.burgundyDark, shadowOpacity: 0.15, shadowRadius: 14, shadowOffset: { width: 0, height: 9 }, elevation: 4 },
  dot: { position: "absolute", width: 12, height: 12, borderRadius: 6 },
  dotLeft: { left: 9, top: 33 },
  dotRight: { right: 5, bottom: 33 },
});
