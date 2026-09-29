import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { AppHeader } from "../../src/components/AppHeader";
import { SectionHeading } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { resources } from "../../src/resources";
import { useSavedResources } from "../../src/useSavedResources";
import { colors, radius, spacing, type } from "../../src/theme";
import { api } from "../../src/backend/api";
import { useAuth } from "../../src/auth";

const categories = [
  { id: "all", sw: "Zote", en: "All" },
  { id: "land", sw: "Ardhi", en: "Land" },
  { id: "employment", sw: "Ajira", en: "Employment" },
  { id: "family", sw: "Familia", en: "Family" },
  { id: "safety", sw: "Usalama", en: "Safety" },
  { id: "contracts", sw: "Mikataba", en: "Contracts" },
  { id: "consumer", sw: "Walaji", en: "Consumer" },
] as const;

export default function LearnScreen() {
  const { isSignedIn } = useAuth();
  const { locale } = useLanguage();
  const params = useLocalSearchParams<{ view?: string }>();
  const { savedIds, isSaved, toggleSaved } = useSavedResources();
  const savedServices = useQuery(api.justiceServices.mySavedServices, isSignedIn ? {} : "skip");
  const reviewedGuides = useQuery(api.publications.listPublicLegalGuides, {});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]["id"]>("all");
  const [view, setView] = useState<"saved" | "all">(params.view === "saved" ? "saved" : "all");

  useEffect(() => {
    if (params.view === "all") setView("all");
  }, [params.view]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const categoryMatches = category === "all" || resource.category === category;
      const text = `${resource.title[locale]} ${resource.summary[locale]} ${resource.steps.map((step) => step[locale]).join(" ")}`.toLowerCase();
      const saveMatches = view === "all" || savedIds.includes(resource.id);
      return saveMatches && categoryMatches && (!needle || text.includes(needle));
    });
  }, [category, locale, query, savedIds, view]);

  return (
    <Screen>
      <AppHeader title={locale === "sw" ? "Jua haki zako" : "Know your rights"} eyebrow={locale === "sw" ? "MWONGOZO WA VITENDO" : "PRACTICAL GUIDANCE"} initial="H" />
      <View style={styles.intro}>
        <View style={styles.introTop}><View style={styles.introAccent} /><Text style={styles.kicker}>{locale === "sw" ? "MWONGOZO WA HAKI · TANZANIA" : "RIGHTS GUIDE · TANZANIA"}</Text><Ionicons name="sunny-outline" size={20} color="#F3B61F" /></View>
        <Text style={styles.introTitle}>{locale === "sw" ? "Anza na swali lako." : "Start with your question."}</Text>
        <Text style={styles.introBody}>{locale === "sw" ? "Mwongozo wazi wa hatua zinazofuata, kwa mada zinazokuhusu." : "Clear next steps across the issues that affect you."}</Text>
      </View>
      <View style={styles.search}>
        <Ionicons name="search" size={19} color={colors.inkMuted} />
        <TextInput value={query} onChangeText={setQuery} accessibilityLabel={locale === "sw" ? "Tafuta mada" : "Search topics"} placeholder={locale === "sw" ? "Tafuta haki, mada au mwongozo..." : "Search rights, topics or guides..."} placeholderTextColor={colors.inkMuted} style={styles.input} />
      </View>

      <View style={styles.libraryHeader}>
        <Text style={styles.sectionTitle}>{view === "saved" ? (locale === "sw" ? "Ulizohifadhi" : "Saved guides") : (locale === "sw" ? "Chagua mada" : "Explore by topic")}</Text>
        <Pressable accessibilityRole="button" onPress={() => setView(view === "all" ? "saved" : "all")} style={styles.savedToggle}>
          <Ionicons name={view === "saved" ? "grid-outline" : "bookmark-outline"} size={16} color={colors.burgundy} />
          <Text style={styles.savedToggleText}>{view === "saved" ? (locale === "sw" ? "Miongozo yote" : "All guides") : (locale === "sw" ? "Zilizohifadhiwa" : "Saved")}</Text>
        </Pressable>
      </View>
      <View style={styles.categoryRow}>
        {categories.map((item) => (
          <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: category === item.id }} onPress={() => setCategory(item.id)} style={[styles.category, category === item.id && styles.categoryActive]}>
            <Text style={[styles.categoryText, category === item.id && styles.categoryTextActive]}>{item[locale]}</Text>
          </Pressable>
        ))}
      </View>
      {view === "all" ? <><SectionHeading title={locale === "sw" ? "Miongozo iliyopitiwa" : "Reviewed guides"} action={`${reviewedGuides?.length ?? 0}`} />
        {reviewedGuides === undefined ? <Text style={styles.empty}>{locale === "sw" ? "Inapakia miongozo..." : "Loading guides..."}</Text> : reviewedGuides.length === 0 ? <Text style={styles.empty}>{locale === "sw" ? "Hakuna mwongozo uliopitishwa na LSF kwa sasa." : "No LSF-approved guide is available yet."}</Text> : reviewedGuides.filter((guide) => !query.trim() || `${guide.titleSw} ${guide.titleEn} ${guide.category}`.toLowerCase().includes(query.trim().toLowerCase())).map((guide) => <Pressable key={guide._id} accessibilityRole="button" style={styles.guide} onPress={() => router.push({ pathname: "/legal-guide/[id]", params: { id: guide._id } })}><View style={[styles.guideIcon, { backgroundColor: colors.tealSoft }]}><Ionicons name="shield-checkmark-outline" size={22} color={colors.teal} /></View><View style={styles.guideCopy}><Text style={styles.guideText}>{locale === "sw" ? guide.titleSw : guide.titleEn}</Text><Text style={styles.summary} numberOfLines={2}>{locale === "sw" ? guide.summarySw : guide.summaryEn}</Text><Text style={styles.minutes}>{guide.publisher} · {guide.jurisdiction.replaceAll("_", " ")}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></Pressable>)}</> : null}

      {view === "saved" && savedServices?.length ? <><SectionHeading title={locale === "sw" ? "Huduma ulizohifadhi" : "Saved services"} action={`${savedServices.length}`} />{savedServices.map(({ service }) => <Pressable key={String(service._id)} style={styles.guide} onPress={() => router.push({ pathname: "/service/[id]", params: { id: String(service._id) } })}><View style={[styles.guideIcon, { backgroundColor: colors.tealSoft }]}><Ionicons name="business-outline" size={22} color={colors.teal} /></View><View style={styles.guideCopy}><Text style={styles.guideText}>{service.name}</Text><Text style={styles.summary}>{[service.district, service.region].filter(Boolean).join(", ")}</Text><Text style={styles.minutes}>{locale === "sw" ? "Huduma iliyothibitishwa" : "Verified service"}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.inkMuted} /></Pressable>)}</> : null}
      <SectionHeading title={view === "saved" ? (locale === "sw" ? "Miongozo uliyohifadhi" : "Saved guides") : (locale === "sw" ? "Miongozo ya vitendo" : "Practical guides")} action={`${filtered.length}`} />
      {filtered.map((resource) => (
        <View key={resource.id} style={styles.guide}>
          <View style={[styles.guideIcon, { backgroundColor: resource.color }]}><Ionicons name={resource.icon} size={23} color={colors.burgundy} /></View>
          <View style={styles.guideCopy}>
            <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: "/resource/[id]", params: { id: resource.id } })}>
              <Text style={styles.guideText}>{resource.title[locale]}</Text>
              <Text style={styles.summary} numberOfLines={2}>{resource.summary[locale]}</Text>
              <View style={styles.guideMeta}><Text style={styles.minutes}>{resource.minutes} {locale === "sw" ? "dakika" : "min read"}</Text><Text style={styles.readAction}>{locale === "sw" ? "Soma" : "Read"} <Ionicons name="arrow-forward" size={12} color={colors.burgundy} /></Text></View>
            </Pressable>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={isSaved(resource.id) ? (locale === "sw" ? "Ondoa kwenye zilizohifadhiwa" : "Remove saved guide") : (locale === "sw" ? "Hifadhi mwongozo" : "Save guide")} onPress={() => void toggleSaved(resource.id)} style={styles.saveButton}>
            <Ionicons name={isSaved(resource.id) ? "bookmark" : "bookmark-outline"} size={20} color={colors.burgundy} />
          </Pressable>
        </View>
      ))}
      {filtered.length === 0 ? <View style={styles.emptyCard}><Ionicons name={view === "saved" ? "bookmark-outline" : "search-outline"} size={32} color={colors.burgundy} /><Text style={styles.emptyTitle}>{view === "saved" ? (locale === "sw" ? "Bado hujahifadhi mwongozo" : "No saved guides yet") : (locale === "sw" ? "Hakuna matokeo" : "No results")}</Text><Text style={styles.empty}>{view === "saved" ? (locale === "sw" ? "Fungua miongozo yote kisha bonyeza alama ya kuhifadhi." : "Open all guides and tap the bookmark on anything useful.") : (locale === "sw" ? "Hakuna mwongozo unaolingana na utafutaji huu." : "No guide matches this search.")}</Text>{view === "saved" ? <Pressable style={styles.exploreButton} onPress={() => setView("all")}><Text style={styles.exploreText}>{locale === "sw" ? "Gundua miongozo" : "Explore guides"}</Text></Pressable> : null}</View> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { minHeight: 154, justifyContent: "center", borderRadius: 8, backgroundColor: "#173F3D", padding: spacing.lg, marginBottom: spacing.lg, overflow: "hidden" },
  introTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  introAccent: { width: 18, height: 3, backgroundColor: "#F3B61F" },
  kicker: { flex: 1, fontFamily: type.bold, color: "#B8DED6", fontSize: 9, lineHeight: 14 },
  introTitle: { marginTop: spacing.md, maxWidth: 280, fontFamily: type.bold, color: "#FFFFFF", fontSize: 25, lineHeight: 29 },
  introBody: { maxWidth: 290, marginTop: spacing.sm, fontFamily: type.regular, color: "#E0EFEC", fontSize: 13, lineHeight: 19 },
  search: { minHeight: 52, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md },
  input: { flex: 1, paddingHorizontal: spacing.sm, fontFamily: type.regular, color: colors.charcoal, fontSize: 14 },
  libraryHeader: { marginTop: spacing.xl, marginBottom: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  sectionTitle: { flex: 1, fontFamily: type.bold, color: colors.ink, fontSize: 17 },
  savedToggle: { minHeight: 38, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: spacing.sm },
  savedToggleText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  category: { minHeight: 35, justifyContent: "center", borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: 6, paddingHorizontal: 11 },
  categoryActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundy },
  categoryText: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  categoryTextActive: { color: colors.surface },
  section: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17, marginTop: spacing.xl, marginBottom: spacing.md },
  guide: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: spacing.md },
  guideIcon: { width: 48, height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  guideCopy: { flex: 1 },
  guideText: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 14, lineHeight: 19 },
  summary: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 13, lineHeight: 19, marginTop: 2 },
  guideMeta: { marginTop: spacing.sm, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  minutes: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 11 },
  readAction: { fontFamily: type.bold, color: colors.burgundy, fontSize: 11 },
  saveButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  empty: { fontFamily: type.regular, color: colors.inkMuted, textAlign: "center", marginTop: spacing.xl, lineHeight: 21 },
  emptyCard: { alignItems: "center", borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, padding: spacing.xl },
  emptyTitle: { marginTop: spacing.md, fontFamily: type.bold, color: colors.ink, fontSize: 17 },
  exploreButton: { marginTop: spacing.lg, minHeight: 44, borderRadius: radius.pill, backgroundColor: colors.burgundy, paddingHorizontal: spacing.xl, alignItems: "center", justifyContent: "center" },
  exploreText: { fontFamily: type.bold, color: colors.surface, fontSize: 13 },
});
