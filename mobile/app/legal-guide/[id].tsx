import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, StyleSheet, Text, View } from "react-native";
import { api } from "../../src/backend/api";
import { AppHeader } from "../../src/components/AppHeader";
import { Button } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { Surface } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { colors, radius, spacing, type } from "../../src/theme";
import { useReviewClock } from "../../src/useReviewClock";

export default function LegalGuideScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const reviewNow = useReviewClock();
  const guides = useQuery(api.publications.listPublicLegalGuides, { refreshTick: reviewNow });
  const guide = guides?.find((item) => item._id === id && item.reviewDueAt > reviewNow);
  return <Screen>
    <AppHeader back title={sw ? "Mwongozo wa vitendo" : "Practical guide"} eyebrow="HAKI YANGU · REVIEWED" />
    {guides === undefined ? <Surface><Text style={styles.body}>{sw ? "Inapakia mwongozo..." : "Loading guide..."}</Text></Surface> : !guide ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Mwongozo haupatikani tena." : "This guide is no longer available."}</Text><Text style={styles.body}>{sw ? "Huenda ukaguzi wake umepitwa na wakati." : "Its review may have expired."}</Text></Surface> : <>
      <View style={styles.hero}><Text style={styles.kicker}>{sw ? "MWONGOZO ULIOPITIWA" : "REVIEWED GUIDE"}</Text><Text style={styles.heroTitle}>{sw ? guide.titleSw : guide.titleEn}</Text><Text style={styles.heroBody}>{sw ? guide.summarySw : guide.summaryEn}</Text></View>
      <View style={styles.steps}><Text style={styles.title}>{sw ? "Hatua za kuanza" : "Steps to start"}</Text>{(sw ? guide.stepsSw : guide.stepsEn).map((step, index) => <View key={index} style={styles.step}><Text style={styles.number}>{index + 1}.</Text><Text style={styles.body}>{step}</Text></View>)}</View>
      <View style={styles.source}><Ionicons name="shield-checkmark-outline" size={19} color={colors.teal} /><View style={styles.sourceCopy}><Text style={styles.sourceTitle}>{sw ? "Chanzo kilichopitiwa" : "Reviewed source"}</Text><Text style={styles.meta}>{guide.sourceTitle} · {guide.publisher}</Text><Text style={styles.meta}>{sw ? "Ukaguzi ujao" : "Review due"} {new Date(guide.reviewDueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ")}</Text><Text style={styles.sourceLink} onPress={() => void Linking.openURL(guide.sourceUrl)}>{sw ? "Fungua chanzo" : "Open source"}  →</Text></View></View>
      <Button label={sw ? "Omba msaada kuhusu hili" : "Request help with this"} onPress={() => router.push("/intake")} />
    </>}
  </Screen>;
}
const styles = StyleSheet.create({
  hero: { paddingTop: spacing.md, paddingBottom: spacing.lg, gap: spacing.sm },
  kicker: { color: colors.teal, fontFamily: type.semibold, fontSize: 11 },
  heroTitle: { color: colors.ink, fontFamily: type.editorial, fontSize: 30, lineHeight: 37 },
  heroBody: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 16, lineHeight: 24 },
  steps: { marginTop: spacing.lg, marginBottom: spacing.xl },
  title: { color: colors.ink, fontFamily: type.semibold, fontSize: 19 },
  body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 16, lineHeight: 24, flex: 1 },
  step: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start", paddingVertical: spacing.md, borderBottomWidth: 1, borderColor: colors.line },
  number: { width: 24, color: colors.burgundy, fontFamily: type.semibold, fontSize: 15 },
  source: { flexDirection: "row", gap: spacing.sm, borderTopWidth: 1, borderColor: colors.line, paddingTop: spacing.lg, marginBottom: spacing.xl },
  sourceCopy: { flex: 1, gap: spacing.xs },
  sourceTitle: { fontFamily: type.semibold, color: colors.ink, fontSize: 14 },
  meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12, lineHeight: 18 },
  sourceLink: { color: colors.burgundy, fontFamily: type.medium, fontSize: 14, marginTop: spacing.xs },
});
