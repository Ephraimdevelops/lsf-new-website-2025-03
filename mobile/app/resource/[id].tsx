import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { CivicPageHeader } from "../../src/components/CivicPageHeader";
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
    return <Screen style={styles.center}><Text style={styles.title}>{locale === "sw" ? "Orodha haijapatikana" : "Checklist not found"}</Text><Button label={locale === "sw" ? "Rudi" : "Go back"} onPress={() => router.back()} /></Screen>;
  }

  return (
    <Screen>
      <CivicPageHeader back title={locale === "sw" ? "Maandalizi" : "Preparation"} actionIcon={isSaved(resource.id) ? "bookmark" : "bookmark-outline"} actionLabel={isSaved(resource.id) ? (locale === "sw" ? "Ondoa orodha iliyohifadhiwa" : "Remove saved checklist") : (locale === "sw" ? "Hifadhi orodha" : "Save checklist")} onAction={() => void toggleSaved(resource.id)} />
      <Text style={styles.kicker}>{locale === "sw" ? "ORODHA YA MAANDALIZI" : "PREPARATION CHECKLIST"}</Text>
      <Text style={styles.title}>{resource.title[locale]}</Text>
      <Text style={styles.summary}>{resource.summary[locale]}</Text>
      <Text style={styles.meta}>{resource.minutes} {locale === "sw" ? "dakika kusoma" : "min read"}</Text>

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
      <View style={styles.notice}><Ionicons name="information-circle-outline" size={18} color={colors.teal} /><Text style={styles.noticeText}>{locale === "sw" ? "Hii ni orodha ya maandalizi, si ushauri wa kisheria uliopitiwa na LSF. Thibitisha sheria na muda wa mwisho kwa mtaalamu." : "This is a preparation checklist, not LSF-reviewed legal advice. Confirm laws and deadlines with a qualified person."}</Text></View>

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
  kicker: { fontFamily: type.medium, color: colors.teal, fontSize: 12, marginTop: spacing.sm },
  title: { fontFamily: type.editorial, color: colors.ink, fontSize: 27, lineHeight: 35, marginTop: spacing.sm },
  meta: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12, marginTop: spacing.sm },
  summary: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 16, lineHeight: 24, marginTop: spacing.md },
  notice: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingTop: spacing.md, marginBottom: spacing.xl },
  noticeText: { flex: 1, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
  panel: { marginTop: spacing.xxl },
  panelTitle: { fontFamily: type.semibold, color: colors.ink, fontSize: 19, marginBottom: spacing.sm },
  step: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start", paddingVertical: spacing.md, borderBottomWidth: 1, borderColor: colors.line },
  stepNumber: { width: 24, color: colors.burgundy, fontFamily: type.semibold, fontSize: 15 },
  stepText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 16, lineHeight: 24 },
  tipPanel: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.goldSoft, borderRadius: 8, padding: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.xl },
  tipCopy: { flex: 1 },
  tipTitle: { fontFamily: type.semibold, color: colors.charcoal, fontSize: 15, marginBottom: spacing.xs },
  tipText: { fontFamily: type.regular, color: colors.charcoal, fontSize: 15, lineHeight: 23 },
});
