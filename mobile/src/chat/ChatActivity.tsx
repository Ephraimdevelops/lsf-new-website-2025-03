import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from "react-native";
import { colors, type } from "../theme";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (active) setReduced(value); });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduced);
    return () => { active = false; subscription.remove(); };
  }, []);
  return reduced;
}

export function ChatActivity({ label, reducedMotion }: { label: string; reducedMotion: boolean }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reducedMotion) return;
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 950, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 950, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [pulse, reducedMotion]);
  useEffect(() => {
    fade.setValue(reducedMotion ? 1 : 0);
    const animation = Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [label, reducedMotion, fade]);
  return <View style={styles.row} accessibilityLiveRegion="polite">
    <Animated.View style={[styles.dot, { opacity: reducedMotion ? 0.6 : pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.9] }) }]} />
    <Animated.View style={{ opacity: fade, flex: 1 }}><Text numberOfLines={1} style={styles.label}>{label}</Text></Animated.View>
  </View>;
}

const styles = StyleSheet.create({
  row: { minHeight: 34, flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.burgundy },
  label: { fontFamily: type.regular, fontSize: 13, color: colors.inkMuted, lineHeight: 20 },
});
