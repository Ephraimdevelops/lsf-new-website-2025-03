import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, usePathname, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { api } from "../backend/api";
import { useLanguage } from "../i18n";
import { colors, type } from "../theme";

const links = [
  { route: "/workspace", en: "Today", sw: "Leo", icon: "home-outline" },
  { route: "/operations", en: "Cases", sw: "Kesi", icon: "folder-open-outline" },
  { route: "/access-management", en: "People", sw: "Watu", icon: "people-outline" },
  { route: "/admin-tools", en: "Tools", sw: "Zana", icon: "grid-outline" },
  { route: "/admin-profile", en: "Account", sw: "Akaunti", icon: "person-outline" },
] as const;
export function AdminNavigation() {
  const access = useQuery(api.users.currentAccess);
  const path = usePathname();
  const { locale } = useLanguage();
  if (!access?.roles.includes("admin")) return null;
  return <View style={styles.nav}>{links.map(link => {
    const selected = path === link.route;
    return <Pressable key={link.route} accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={locale === "sw" ? link.sw : link.en} onPress={() => router.replace(link.route as Href)} style={styles.link}><Ionicons name={link.icon} size={22} color={selected ? colors.burgundy : colors.inkMuted} /><Text style={[styles.label, selected && styles.selected]}>{locale === "sw" ? link.sw : link.en}</Text></Pressable>;
  })}</View>;
}
const styles = StyleSheet.create({ nav: { flexDirection: "row" }, link: { flex: 1, minHeight: 56, justifyContent: "center", alignItems: "center", gap: 4 }, label: { fontFamily: type.medium, fontSize: 11, color: colors.inkMuted }, selected: { color: colors.burgundy, fontFamily: type.semibold } });
