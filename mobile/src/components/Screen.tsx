import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../theme";

export function Screen({ children, scroll = true, style }: { children: ReactNode; scroll?: boolean; style?: ViewStyle }) {
  const content = <View style={[styles.content, style]}>{children}</View>;
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingBottom: 112 },
});

