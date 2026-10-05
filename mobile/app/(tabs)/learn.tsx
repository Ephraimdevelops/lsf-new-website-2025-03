import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { AppHeader } from "../../src/components/AppHeader";
import { SectionHeading } from "../../src/components/Surface";
import { useLanguage } from "../../src/i18n";
import { resources } from "../../src/resources";
import { useSavedResources } from "../../src/useSavedResources";
import { colors, radius, spacing, type } from "../../src/theme";
import { api } from "../../src/backend/api";
import { useAuth } from "../../src/auth";
import { useAccountSync } from "../../src/useStoreUserEffect";
import { useReviewClock } from "../../src/useReviewClock";

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
  const { ready: accountReady } = useAccountSync();
  const { locale } = useLanguage();
  const params = useLocalSearchParams<{ view?: string }>();
  const { savedIds, isSaved, toggleSaved } = useSavedResources();
  const savedServices = useQuery(api.justiceServices.mySavedServices, isSignedIn && accountReady ? {} : "skip");
  const reviewNow = useReviewClock();
  const reviewedGuides = useQuery(api.publications.listPublicLegalGuides, { refreshTick: reviewNow });
  const currentReviewedGuides = reviewedGuides?.filter((guide) => guide.reviewDueAt > reviewNow);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]["id"]>("all");
  const [view, setView] = useState<"saved" | "all">(params.view === "all" ? "all" : "saved");

  useEffect(() => {
    setView(params.view === "all" ? "all" : "saved");
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

  if (view === "saved") {
    const savedResources = resources.filter((resource) => savedIds.includes(resource.id));
    return <Screen>
      <AppHeader title={locale === "sw" ? "Vilivyohifadhiwa" : "Saved items"} eyebrow="HAKI YANGU" initial="H" />
      <Text style={styles.savedIntro}>{locale === "sw" ? "Huduma na orodha muhimu ulizoweka karibu." : "The services and checklists you kept close."}</Text>
      <Pressable style={styles.savedShortcut} onPress={() => router.push("/nearby-help")}><Ionicons name="location-outline" size={21} color={colors.teal} /><Text style={styles.shortcutText}>{locale === "sw" ? "Tafuta huduma" : "Find a service"}</Text><Ionicons name="arrow-forward" size={18} color={colors.teal} /></Pressable>
      <View style={styles.savedSection}><Text style={styles.sectionTitle}>{locale === "sw" ? "Huduma" : "Services"}</Text><Text style={styles.sectionCount}>{savedServices?.length ?? 0}</Text></View>
      {savedServices?.length ? savedServices.map(({ service }) => <Pressable key={String(service._id)} accessibilityRole="button" style={styles.guide} onPress={() => router.push({ pathname: "/service/[id]", params: { id: String(service._id) } })}><View style={[styles.guideIcon, { backgroundColor: colors.tealSoft }]}><Ionicons name="business-outline" size={22} color={colors.teal} /></View><View style={styles.guideCopy}><Text style={styles.guideText}>{service.name}</Text><Text style={styles.summary}>{[service.district, service.region].filter(Boolean).join(", ")}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.inkMuted} /></Pressable>) : <Text style={styles.savedEmpty}>{isSignedIn ? (locale === "sw" ? "Huduma unazohifadhi zitaonekana hapa." : "Services you save will appear here.") : (locale === "sw" ? "Ingia ili kuona huduma ulizohifadhi." : "Sign in to see your saved services.")}</Text>}
      <View style={styles.savedSection}><Text style={styles.sectionTitle}>{locale === "sw" ? "Orodha za maandalizi" : "Preparation checklists"}</Text><Text style={styles.sectionCount}>{savedResources.length}</Text></View>
      {savedResources.map((resource) => <Pressable key={resource.id} accessibilityRole="button" style={styles.guide} onPress={() => router.push({ pathname: "/resource/[id]", params: { id: resource.id } })}><View style={[styles.guideIcon, { backgroundColor: resource.color }]}><Ionicons name={resource.icon} size={22} color={colors.burgundy} /></View><View style={styles.guideCopy}><Text style={styles.guideText}>{resource.title[locale]}</Text><Text style={styles.summary} numberOfLines={1}>{resource.summary[locale]}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.inkMuted} /></Pressable>)}
      {!savedResources.length ? <Text style={styles.savedEmpty}>{locale === "sw" ? "Orodha unazohifadhi zitaonekana hapa." : "Checklists you save will appear here."}</Text> : null}
      <Pressable style={styles.savedShortcut} onPress={() => router.push("/(tabs)/learn?view=all")}><Ionicons name="book-outline" size={21} color={colors.burgundy} /><Text style={styles.shortcutText}>{locale === "sw" ? "Jua haki zako" : "Know your rights"}</Text><Ionicons name="arrow-forward" size={18} color={colors.burgundy} /></Pressable>
      <Pressable style={styles.savedShortcut} onPress={() => router.push("/(tabs)/cases")}><Ionicons name="folder-outline" size={21} color={colors.burgundy} /><Text style={styles.shortcutText}>{locale === "sw" ? "Kesi na maombi yangu" : "My cases and requests"}</Text><Ionicons name="arrow-forward" size={18} color={colors.burgundy} /></Pressable>
    </Screen>;
  }

  return (
    <Screen>
      <AppHeader title={locale === "sw" ? "Jua haki zako" : "Know your rights"} eyebrow={locale === "sw" ? "MWONGOZO WA VITENDO" : "PRACTICAL GUIDANCE"} initial="H" />
      <Text style={styles.libraryLead}>{locale === "sw" ? "Tafuta jambo linalokuhusu, kisha soma hatua za kuanza." : "Find what matters to you, then see how to begin."}</Text>
      <View style={styles.search}>
        <Ionicons name="search" size={19} color={colors.inkMuted} />
        <TextInput value={query} onChangeText={setQuery} accessibilityLabel={locale === "sw" ? "Tafuta mada" : "Search topics"} placeholder={locale === "sw" ? "Tafuta haki, mada au mwongozo..." : "Search rights, topics or guides..."} placeholderTextColor={colors.inkMuted} style={styles.input} />
      </View>

      <View style={styles.libraryHeader}>
        <Text style={styles.sectionTitle}>{locale === "sw" ? "Chagua mada" : "Topics"}</Text>
        <Pressable accessibilityRole="button" onPress={() => setView("saved")} style={styles.savedToggle}>
          <Ionicons name="bookmark-outline" size={16} color={colors.burgundy} />
          <Text style={styles.savedToggleText}>{locale === "sw" ? "Vilivyohifadhiwa" : "Saved"}</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categories.map((item) => (
          <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: category === item.id }} onPress={() => setCategory(item.id)} style={[styles.category, category === item.id && styles.categoryActive]}>
            <Text style={[styles.categoryText, category === item.id && styles.categoryTextActive]}>{item[locale]}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {currentReviewedGuides?.length ? <><SectionHeading title={locale === "sw" ? "Miongozo iliyopitiwa" : "Reviewed guides"} action={`${currentReviewedGuides.length}`} />
        {currentReviewedGuides.filter((guide) => (category === "all" || guide.category === category) && (!query.trim() || `${guide.titleSw} ${guide.titleEn} ${guide.category}`.toLowerCase().includes(query.trim().toLowerCase()))).map((guide) => <Pressable key={guide._id} accessibilityRole="button" style={styles.guide} onPress={() => router.push({ pathname: "/legal-guide/[id]", params: { id: guide._id } })}><View style={[styles.guideIcon, { backgroundColor: colors.tealSoft }]}><Ionicons name="shield-checkmark-outline" size={22} color={colors.teal} /></View><View style={styles.guideCopy}><Text style={styles.guideText}>{locale === "sw" ? guide.titleSw : guide.titleEn}</Text><Text style={styles.summary} numberOfLines={2}>{locale === "sw" ? guide.summarySw : guide.summaryEn}</Text><Text style={styles.minutes}>{guide.publisher} · {guide.jurisdiction.replaceAll("_", " ")}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></Pressable>)}</> : null}

      <SectionHeading title={locale === "sw" ? "Orodha za maandalizi" : "Preparation checklists"} action={`${filtered.length}`} />
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
          <Pressable accessibilityRole="button" accessibilityLabel={isSaved(resource.id) ? (locale === "sw" ? "Ondoa orodha kwenye zilizohifadhiwa" : "Remove saved checklist") : (locale === "sw" ? "Hifadhi orodha" : "Save checklist")} onPress={() => void toggleSaved(resource.id)} style={styles.saveButton}>
            <Ionicons name={isSaved(resource.id) ? "bookmark" : "bookmark-outline"} size={20} color={colors.burgundy} />
          </Pressable>
        </View>
      ))}
      {filtered.length === 0 ? <View style={styles.emptyCard}><Ionicons name="search-outline" size={32} color={colors.burgundy} /><Text style={styles.emptyTitle}>{locale === "sw" ? "Hakuna matokeo" : "No results"}</Text><Text style={styles.empty}>{locale === "sw" ? "Jaribu neno au mada nyingine." : "Try another word or topic."}</Text></View> : null}
      <Text style={styles.libraryFootnote}>{locale === "sw" ? "Orodha hizi ni za maandalizi ya jumla, si ushauri wa kisheria uliopitiwa na LSF." : "These are general preparation checklists, not LSF-reviewed legal advice."}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  savedIntro: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 23, marginBottom: spacing.xl },
  savedSection: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.xl, marginBottom: spacing.sm },
  sectionCount: { fontFamily: type.medium, color: colors.burgundy, fontSize: 13 },
  savedShortcut: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: spacing.md, borderBottomWidth: 1, borderColor: colors.line },
  shortcutText: { flex: 1, fontFamily: type.medium, color: colors.ink, fontSize: 15 },
  savedEmpty: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, paddingVertical: spacing.md },
  libraryLead: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 23, marginBottom: spacing.lg },
  libraryFootnote: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18, marginTop: spacing.xl },
  intro: { minHeight: 154, justifyContent: "center", borderRadius: 8, backgroundColor: "#173F3D", padding: spacing.lg, marginBottom: spacing.lg, overflow: "hidden" },
  introTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  introAccent: { width: 18, height: 3, backgroundColor: "#F3B61F" },
  kicker: { flex: 1, fontFamily: type.bold, color: "#B8DED6", fontSize: 9, lineHeight: 14 },
  introTitle: { marginTop: spacing.md, maxWidth: 280, fontFamily: type.editorial, color: "#FFFFFF", fontSize: 27, lineHeight: 33 },
  introBody: { maxWidth: 290, marginTop: spacing.sm, fontFamily: type.regular, color: "#E0EFEC", fontSize: 13, lineHeight: 19 },
  search: { minHeight: 52, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md },
  input: { flex: 1, paddingHorizontal: spacing.sm, fontFamily: type.regular, color: colors.charcoal, fontSize: 14 },
  libraryHeader: { marginTop: spacing.xl, marginBottom: spacing.sm, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  sectionTitle: { flex: 1, fontFamily: type.editorial, color: colors.ink, fontSize: 20 },
  savedToggle: { minHeight: 38, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: spacing.sm },
  savedToggleText: { fontFamily: type.bold, color: colors.burgundy, fontSize: 12 },
  checklistNotice: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, backgroundColor: colors.tealSoft, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  checklistNoticeText: { flex: 1, fontFamily: type.regular, color: colors.charcoal, fontSize: 12, lineHeight: 18 },
  categoryRow: { flexDirection: "row", gap: 7, paddingBottom: spacing.sm },
  category: { minHeight: 35, justifyContent: "center", borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: 6, paddingHorizontal: 11 },
  categoryActive: { borderColor: colors.burgundy, backgroundColor: colors.burgundy },
  categoryText: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  categoryTextActive: { color: colors.surface },
  section: { fontFamily: type.bold, fontWeight: "700", color: colors.charcoal, fontSize: 17, marginTop: spacing.xl, marginBottom: spacing.md },
  guide: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: spacing.md },
  guideIcon: { width: 48, height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  guideCopy: { flex: 1 },
  guideText: { fontFamily: type.semibold, color: colors.charcoal, fontSize: 15, lineHeight: 21 },
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
