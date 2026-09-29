import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useLanguage } from "../../src/i18n";
import { colors } from "../../src/theme";

export default function TabLayout() {
  const { t, locale } = useLanguage();
  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.burgundy,
    tabBarInactiveTintColor: "#626269",
    tabBarLabelStyle: { fontFamily: "Ubuntu_500Medium", fontSize: 11 },
    tabBarItemStyle: { paddingTop: 7, paddingBottom: 5 },
    tabBarStyle: { height: 68, paddingBottom: 6, backgroundColor: "#FFFFFF", borderTopColor: "#E5E7EB", elevation: 0 },
  }}>
    <Tabs.Screen name="index" options={{ title: t("home"), tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} /> }} />
    <Tabs.Screen name="cases" options={{ title: locale === "sw" ? "Kesi yangu" : "My Case", tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "folder" : "folder-outline"} color={color} size={size} /> }} />
    <Tabs.Screen name="help" options={{ title: locale === "sw" ? "Ujumbe" : "Messages", tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} color={color} size={size} /> }} />
    <Tabs.Screen name="learn" options={{ title: locale === "sw" ? "Hifadhi" : "Saved", tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "bookmark" : "bookmark-outline"} color={color} size={size} /> }} />
    <Tabs.Screen name="profile" options={{ title: t("profile"), tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size} /> }} />
  </Tabs>;
}
