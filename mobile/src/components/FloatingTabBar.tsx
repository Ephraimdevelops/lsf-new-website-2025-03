import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, type } from "../theme";

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];

export function FloatingTabBar({ state, descriptors, emitter, navigateToTab }: TabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);
  if (keyboardVisible) return null;
  return <View style={[styles.bar, { bottom: Math.max(insets.bottom, 12) }]}>
    {state.routes.map((route, index) => {
      const options = descriptors[route.key].options;
      const focused = state.index === index;
      const label = typeof options.tabBarLabel === "string" ? options.tabBarLabel : options.title ?? route.name;
      const onPress = () => {
        const event = emitter.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
        if (event.defaultPrevented) return;
        if (route.name === "learn") router.navigate({ pathname: "/(tabs)/learn", params: { view: "saved" } });
        else if (!focused) navigateToTab(route.key);
      };
      const icon = options.tabBarIcon?.({ focused, color: focused ? colors.burgundy : colors.inkMuted, size: 25 }) ?? <Ionicons name="ellipse-outline" size={25} color={colors.inkMuted} />;
      return <TabItem key={route.key} label={label} icon={icon} focused={focused} onPress={onPress} />;
    })}
  </View>;
}

function TabItem({ label, icon, focused, onPress }: { label: string; icon: React.ReactNode; focused: boolean; onPress: () => void }) {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(progress, { toValue: focused ? 1 : 0, useNativeDriver: true, friction: 8, tension: 90 }).start();
  }, [focused, progress]);
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -2] });
  return <Pressable accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={label} onPress={onPress} style={[styles.item, focused && styles.activeItem]}>
    <Animated.View style={[styles.icon, { transform: [{ scale }, { translateY }] }]}>{icon}</Animated.View>
    <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} style={[styles.label, focused && styles.activeLabel]}>{label}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  bar: { position: "absolute", left: 18, right: 18, height: 68, flexDirection: "row", alignItems: "center", paddingHorizontal: 5, borderRadius: 24, backgroundColor: colors.surface, shadowColor: colors.ink, shadowOpacity: 0.13, shadowRadius: 18, shadowOffset: { width: 0, height: 5 }, elevation: 8 },
  item: { flex: 1, height: 58, alignItems: "center", justifyContent: "center", gap: 3, borderRadius: 19 },
  activeItem: { backgroundColor: colors.burgundySoft },
  icon: { height: 28, alignItems: "center", justifyContent: "center" },
  label: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 10, textAlign: "center" },
  activeLabel: { fontFamily: type.semibold, color: colors.burgundy },
});
