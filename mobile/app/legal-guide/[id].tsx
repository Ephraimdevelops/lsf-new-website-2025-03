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

export default function LegalGuideScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLanguage(); const sw = locale === "sw";
  const guides = useQuery(api.publications.listPublicLegalGuides, {});
  const guide = guides?.find((item) => item._id === id);
  return <Screen>
    <AppHeader back title={sw ? "Mwongozo wa vitendo" : "Practical guide"} eyebrow="HAKI YANGU · REVIEWED" />
    {guides === undefined ? <Surface><Text style={styles.body}>{sw ? "Inapakia mwongozo..." : "Loading guide..."}</Text></Surface> : !guide ? <Surface tone="orange"><Text style={styles.title}>{sw ? "Mwongozo haupatikani tena." : "This guide is no longer available."}</Text><Text style={styles.body}>{sw ? "Huenda ukaguzi wake umepitwa na wakati." : "Its review may have expired."}</Text></Surface> : <>
      <View style={styles.hero}><Ionicons name="book-outline" size={30} color={colors.peach} /><Text style={styles.heroTitle}>{sw ? guide.titleSw : guide.titleEn}</Text><Text style={styles.heroBody}>{sw ? guide.summarySw : guide.summaryEn}</Text></View>
      <Surface><Text style={styles.title}>{sw ? "Hatua za kuanza" : "Steps to start"}</Text>{(sw ? guide.stepsSw : guide.stepsEn).map((step, index) => <View key={index} style={styles.step}><Text style={styles.number}>{index + 1}</Text><Text style={styles.body}>{step}</Text></View>)}</Surface>
      <Surface tone="teal"><Text style={styles.title}>{sw ? "Chanzo na ukaguzi" : "Source and review"}</Text><Text style={styles.body}>{guide.sourceTitle} · {guide.publisher}</Text><Text style={styles.meta}>{guide.jurisdiction.replaceAll("_", " ")} · {sw ? "Ukaguzi ujao" : "Review due"} {new Date(guide.reviewDueAt).toLocaleDateString(sw ? "sw-TZ" : "en-TZ")}</Text><Button label={sw ? "Fungua chanzo" : "Open source"} variant="secondary" onPress={() => void Linking.openURL(guide.sourceUrl)} /></Surface>
      <Button label={sw ? "Omba msaada kuhusu hili" : "Request help with this"} onPress={() => router.push("/intake")} />
    </>}
  </Screen>;
}
const styles = StyleSheet.create({ hero: { backgroundColor: colors.burgundy, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm }, heroTitle: { color: colors.surface, fontFamily: type.bold, fontSize: 26, lineHeight: 32 }, heroBody: { color: "#F9E8EF", fontFamily: type.regular, fontSize: 14, lineHeight: 21 }, title: { color: colors.ink, fontFamily: type.bold, fontSize: 18 }, body: { color: colors.charcoal, fontFamily: type.regular, fontSize: 14, lineHeight: 21, flex: 1 }, meta: { color: colors.inkMuted, fontFamily: type.regular, fontSize: 12 }, step: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start", marginTop: spacing.md }, number: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.softPink, color: colors.burgundy, textAlign: "center", paddingTop: 4, fontFamily: type.bold } });
