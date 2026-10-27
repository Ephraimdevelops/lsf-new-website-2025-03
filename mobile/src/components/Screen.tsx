import type { ScrollViewInstance } from "react-native";
import { useLanguage } from "../i18n";
import type { ReactNode, Ref } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../theme";

export function Screen({ children, scroll = true, style, footer, scrollRef }: { children: ReactNode; scroll?: boolean; style?: ViewStyle; footer?: ReactNode; scrollRef?: Ref<ScrollViewInstance> }) {
  const { locale } = useLanguage();
  const content = <View accessibilityLanguage={locale === "sw" ? "sw-TZ" : "en-TZ"} style={[styles.content, footer ? styles.contentWithFooter : null, style]}>{children}</View>;
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
        >
          {content}
        </ScrollView>
      ) : content}
      {footer ? <SafeAreaView edges={["bottom"]} style={styles.footer}><View style={styles.footerContent}>{footer}</View></SafeAreaView> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingBottom: 112 },
  contentWithFooter: { paddingBottom: spacing.xl },
  footer: { backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.line },
  footerContent: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
});
