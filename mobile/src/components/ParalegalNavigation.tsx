import { useQuery } from 'convex/react';
import { api } from '../backend/api';
import { StaffNavigation } from "../staff/StaffNavigation";
import { SupervisorNavigation } from '../supervisor/SupervisorNavigation';
import { AdminNavigation } from '../admin/AdminNavigation';
import { ProviderNavigation } from '../provider/ProviderNavigation';
import { useWorkMode } from "../work/WorkMode";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../i18n";
import { colors, type } from "../theme";
const links = [
  { key: "home", route: "/workspace", icon: "home-outline", en: "Work", sw: "Kazi" },
  { key: "cases", route: "/paralegal-assignments?view=active", icon: "folder-open-outline", en: "Cases", sw: "Kesi" },
  { key: "messages", route: "/(tabs)/help", icon: "chatbubble-outline", en: "Messages", sw: "Ujumbe" },
  { key: "learn", route: "/paralegal-learning", icon: "book-outline", en: "Learn", sw: "Jifunze" },
  { key: "profile", route: "/work-profile", icon: "person-outline", en: "Profile", sw: "Wasifu" },
] as const;
export function ParalegalNavigation({ current }: { current?: string }) {
  const { locale } = useLanguage();
  const { setMode } = useWorkMode();
  const access = useQuery(api.users.currentAccess);
  if (access?.roles.includes("admin")) return <AdminNavigation />;
  if (access?.roles.includes("supervisor")) return <SupervisorNavigation />;
  if (access?.roles.includes("staff")) return <StaffNavigation />;
  if (access?.roles.includes("provider_staff")) return <ProviderNavigation current={current === "learn" || current === "messages" ? "tools" : current} />;
  return <View style={styles.nav}>{links.map(item => <Pressable key={item.key} accessibilityRole="button" accessibilityLabel={locale === "sw" ? item.sw : item.en} accessibilityState={{ selected: current === item.key }} onPress={() => { setMode("work"); router.replace(item.route as Href); }} style={styles.item}><Ionicons name={item.icon} size={22} color={current === item.key ? colors.burgundy : colors.inkMuted} /><Text style={[styles.label, current === item.key && styles.selected]}>{locale === "sw" ? item.sw : item.en}</Text></Pressable>)}</View>;
}
const styles = StyleSheet.create({ nav: { flexDirection: "row", paddingBottom: 4 }, item: { flex: 1, minHeight: 56, alignItems: "center", justifyContent: "center", gap: 4 }, label: { fontFamily: type.medium, fontSize: 10, color: colors.inkMuted }, selected: { color: colors.burgundy, fontFamily: type.semibold } });
