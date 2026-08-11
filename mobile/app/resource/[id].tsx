import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { getResource } from "../../src/resources";
import { useSavedResources } from "../../src/useSavedResources";
import { colors, radius, spacing, type } from "../../src/theme";

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage();
  const { isSaved, toggleSaved } = useSavedResources();
  const resource = getResource(id);

  if (!resource) {
    return <Screen style={styles.center}><Text style={styles.title}>{locale === "sw" ? "Mwongozo haujapatikana" : "Guide not found"}</Text><Button label={locale === "sw" ? "Rudi" : "Go back"} onPress={() => router.back()} /></Screen>;
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}><Ionicons name="chevron-back" size={26} color={colors.burgundy} /></Pressable>
        <Pressable accessibilityRole="button" onPress={() => void toggleSaved(resource.id)}><Ionicons name={isSaved(resource.id) ? "bookmark" : "bookmark-outline"} size={24} color={colors.burgundy} /></Pressable>
      </View>
      <View style={[styles.heroIcon, { backgroundColor: resource.color }]}><Ionicons name={resource.icon} size={34} color={colors.burgundy} /></View>
      <Text style={styles.title}>{resource.title[locale]}</Text>
      <Text style={styles.meta}>{resource.minutes} {locale === "sw" ? "dakika kusoma" : "min read"}</Text>
      <Text style={styles.summary}>{resource.summary[locale]}</Text>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>{locale === "sw" ? "Hatua muhimu" : "Key steps"}</Text>
        {resource.steps.map((step, index) => (
          <View key={`${resource.id}-step-${index}`} style={styles.step}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.stepText}>{step[locale]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tipPanel}>
        <Ionicons name="bulb-outline" size={22} color={colors.warning} />
        <View style={styles.tipCopy}>
          <Text style={styles.tipTitle}>{locale === "sw" ? "Kumbuka" : "Remember"}</Text>
          {resource.tips.map((tip, index) => <Text key={`${resource.id}-tip-${index}`} style={styles.tipText}>{tip[locale]}</Text>)}
        </View>
      </View>

      {resource.id === "demand-letter" ? (
        <Button label={locale === "sw" ? "Tengeneza barua ya madai" : "Build a demand letter"} onPress={() => router.push("/letter-builder")} />
      ) : null}
      <Button label={locale === "sw" ? "Omba msaada kuhusu hili" : "Request help about this"} onPress={() => router.push("/intake")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: "center", gap: spacing.lg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md },
  heroIcon: { width: 68, height: 68, borderRadius: radius.lg, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 28, lineHeight: 34, marginTop: spacing.lg },
  meta: { fontFamily: type.medium, color: colors.burgundy, fontSize: 12, marginTop: spacing.sm },
  summary: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 23, marginTop: spacing.md },
  panel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md, marginTop: spacing.xl },
  panelTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17 },
  step: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  stepNumber: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.softPink, textAlign: "center", paddingTop: 4, fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  stepText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 14, lineHeight: 21 },
  tipPanel: { flexDirection: "row", gap: spacing.md, backgroundColor: "#FFF7E8", borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.lg },
  tipCopy: { flex: 1 },
  tipTitle: { fontFamily: type.bold, color: colors.charcoal, fontSize: 14, marginBottom: spacing.xs },
  tipText: { fontFamily: type.regular, color: colors.charcoal, fontSize: 13, lineHeight: 20 },
});
