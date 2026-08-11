import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useLanguage } from "../../src/i18n";
import { colors, type } from "../../src/theme";

export default function TabLayout() {
  const { t } = useLanguage();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.burgundy,
      tabBarInactiveTintColor: colors.inkMuted,
      tabBarLabelStyle: { fontFamily: type.bold, fontSize: 10, marginTop: 2 },
      tabBarItemStyle: { paddingTop: 9 },
      tabBarStyle: {
        position: "absolute",
        left: 18,
        right: 18,
        bottom: 18,
        height: 74,
        paddingTop: 5,
        paddingBottom: 8,
        borderTopWidth: 0,
        borderRadius: 30,
        backgroundColor: "rgba(255,255,255,0.94)",
        shadowColor: colors.charcoal,
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
      },
    }}>
      <Tabs.Screen name="index" options={{ title: t("home"), tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="cases" options={{ title: t("cases"), tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" color={color} size={size} /> }} />
      <Tabs.Screen
        name="help"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="add"
              color={colors.surface}
              size={28}
              style={{
                backgroundColor: focused ? colors.burgundyDark : colors.burgundy,
                borderRadius: 26,
                padding: 12,
                marginTop: -18,
                borderWidth: 4,
                borderColor: "rgba(255,255,255,0.95)",
                shadowColor: colors.burgundy,
                shadowOpacity: 0.22,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 6 },
                elevation: 6,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen name="learn" options={{ title: t("learn"), tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: t("profile"), tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}
