import { AdminNavigation } from "../../src/admin/AdminNavigation";
import { useWorkMode } from "../../src/work/WorkMode";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { useAuth } from "../../src/auth";
import { api } from "../../src/backend/api";
import { ParalegalNavigation } from "../../src/components/ParalegalNavigation";
import { Tabs } from "expo-router";
import { useLanguage } from "../../src/i18n";
import { FloatingTabBar } from "../../src/components/FloatingTabBar";

export default function TabLayout() {
  const { mode } = useWorkMode();
  const { t, locale } = useLanguage();
  const { isSignedIn } = useAuth();
  const access = useQuery(api.users.currentAccess, isSignedIn ? {} : "skip");
  const workRole = mode === "work" && access?.roles.some(role => ["paralegal", "provider_staff"].includes(role)) && !access.roles.some(role => ["admin", "staff", "supervisor"].includes(role));
  return <Tabs tabBar={(props) => access?.roles.includes("admin") ? <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "white", paddingHorizontal: 24 }}><AdminNavigation /></SafeAreaView> : workRole ? <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "white", paddingHorizontal: 24 }}><ParalegalNavigation current={props.state.routes[props.state.index].name === "index" ? "home" : props.state.routes[props.state.index].name === "cases" ? "cases" : props.state.routes[props.state.index].name === "profile" ? "profile" : props.state.routes[props.state.index].name === "learn" ? "learn" : "messages"} /></SafeAreaView> : <FloatingTabBar {...props} />} screenOptions={{
    headerShown: false,
    tabBarHideOnKeyboard: true,
  }}>
    <Tabs.Screen name="index" options={{ title: t("home"), tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} /> }} />
    <Tabs.Screen name="cases" options={{ title: locale === "sw" ? "Kesi yangu" : "My Case", tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "folder" : "folder-outline"} color={color} size={size} /> }} />
    <Tabs.Screen name="help" options={{ title: locale === "sw" ? "Ujumbe" : "Messages", tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} color={color} size={size} /> }} />
    <Tabs.Screen name="learn" options={{ title: locale === "sw" ? "Hifadhi" : "Saved", tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "bookmark" : "bookmark-outline"} color={color} size={size} /> }} />
    <Tabs.Screen name="profile" options={{ title: t("profile"), tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size} /> }} />
  </Tabs>;
}
