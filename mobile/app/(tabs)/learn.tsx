import { BrandLoading } from '../../src/components/BrandLoading';
import { SearchFilters } from "../../src/components/SearchFilters";
import { availableGuideTopics, guideTopic } from "../../src/guideTopics";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { AppHeader } from "../../src/components/AppHeader";
import { CivicPageHeader } from "../../src/components/CivicPageHeader";
import { CivicIllustration } from "../../src/components/CivicIllustration";
import { IntakeSelect } from "../../src/intake/IntakeSelect";
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
  { id: "land", sw: "Ardhi na makazi", en: "Land and housing" },
  { id: "employment", sw: "Ajira na malipo", en: "Work and pay" },
  { id: "family", sw: "Familia na watoto", en: "Family and children" },
  { id: "safety", sw: "Usalama na ukatili", en: "Safety and violence" },
  { id: "contracts", sw: "Mikataba na madai", en: "Agreements and claims" },
  { id: "consumer", sw: "Bidhaa na huduma", en: "Goods and services" },
] as const;

export default function LearnScreen({ libraryOnly = false }: { libraryOnly?: boolean } = {}) {
  const { isSignedIn } = useAuth();
  const { ready: accountReady } = useAccountSync();
  const { locale } = useLanguage();
  const params = useLocalSearchParams<{ view?: string }>();
  const { savedIds, isSaved, toggleSaved } = useSavedResources();
  const savedServices = useQuery(api.justiceServices.mySavedServices, isSignedIn && accountReady ? {} : "skip");
  const personalDocuments = useQuery(api.personalDocuments.list, isSignedIn && accountReady ? {} : "skip");
  const caseDocuments = useQuery(api.caseManagement.myDocuments, isSignedIn && accountReady ? {} : "skip");
  const reviewNow = useReviewClock();
  const reviewedGuides = useQuery(api.publications.listPublicLegalGuides, { refreshTick: reviewNow });
  const currentReviewedGuides = reviewedGuides?.filter((guide) => guide.reviewDueAt > reviewNow);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [view, setView] = useState<"saved" | "all">(libraryOnly || params.view === "all" ? "all" : "saved");

  useEffect(() => {
    setView(libraryOnly || params.view === "all" ? "all" : "saved");
  }, [params.view, libraryOnly]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const categoryMatches = category === "all" || resource.category === category;
      const text = `${resource.title[locale]} ${resource.summary[locale]} ${resource.steps.map((step) => step[locale]).join(" ")}`.toLowerCase();
      const saveMatches = view === "all" || savedIds.includes(resource.id);
      return saveMatches && categoryMatches && (!needle || text.includes(needle));
    });
  }, [category, locale, query, savedIds, view]);
  const topicOptions = [...categories.map(item => ({ value: item.id as string, label: item[locale] })), ...availableGuideTopics(currentReviewedGuides ?? []).filter(topic => !categories.some(item => item.id === topic.key)).map(topic => ({ value: topic.key, label: topic[locale] }))];
  const visibleReviewedGuides = currentReviewedGuides?.filter(guide => (category === "all" || guideTopic(guide.category).key === category) && (!query.trim() || `${guide.titleSw} ${guide.titleEn} ${guide.summarySw} ${guide.summaryEn}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))) ?? [];

  if (view === "saved") {
    const savedResources = resources.filter((resource) => savedIds.includes(resource.id));
    return <Screen>
      <AppHeader title={locale === "sw" ? "Vilivyohifadhiwa" : "Saved items"} eyebrow="HAKI YANGU" initial="H" />
      <View style={styles.libraryIntro}><View style={{ flex: 1 }}><Text style={styles.introHeading}>{locale === "sw" ? "Muhimu kwako, sehemu moja." : "What matters, in one place."}</Text><Text style={styles.libraryLead}>{locale === "sw" ? "Hati, huduma na orodha ulizohifadhi." : "Your saved documents, services and checklists."}</Text></View><CivicIllustration pose="review" size={100} /></View>
      <View style={styles.savedSection}><Text style={styles.sectionTitle}>{locale === "sw" ? "Hati zangu" : "My documents"}</Text><Text style={styles.sectionCount}>{(personalDocuments?.length ?? 0) + (caseDocuments?.length ?? 0)}</Text></View>
      {personalDocuments?.map(document => <Pressable key={document._id} accessibilityRole="button" style={styles.guide} onPress={() => router.push({ pathname: "/saved-document/[id]", params: { id: document._id } })}><Ionicons name="document-text-outline" size={25} color={colors.teal} /><View style={styles.guideCopy}><Text style={styles.guideText}>{document.name}</Text><Text style={styles.summary}>{locale === "sw" ? "Binafsi" : "Private"} · {(document.size / 1024 / 1024).toFixed(1)} MB{document.brief ? (locale === "sw" ? " · Maelezo ya AI" : " · AI summary") : ""}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>)}
      {caseDocuments?.map(document => <Pressable key={document._id} accessibilityRole="button" style={styles.guide} onPress={() => router.push({ pathname: "/document/[id]", params: { id: document._id } })}><Ionicons name="folder-open-outline" size={25} color={colors.burgundy} /><View style={styles.guideCopy}><Text style={styles.guideText}>{document.name}</Text><Text style={styles.summary}>{document.casePublicId}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.inkMuted} /></Pressable>)}
      {isSignedIn && (personalDocuments === undefined || caseDocuments === undefined) ? <BrandLoading compact task="documents"/> : !personalDocuments?.length && !caseDocuments?.length ? <Text style={styles.savedEmpty}>{locale === "sw" ? "Piga picha au chagua hati. Ingia kuihifadhi kwenye akaunti." : "Take a photo or choose a document. Sign in to save it."}</Text> : null}
      <Pressable accessibilityRole="button" style={styles.savedShortcut} onPress={() => router.push("/document-checker")}><Ionicons name="scan-outline" size={23} color={colors.teal} /><Text style={styles.shortcutText}>{locale === "sw" ? "Piga picha na hifadhi hati" : "Capture and save a document"}</Text><Ionicons name="arrow-forward" size={18} color={colors.teal} /></Pressable>
      <Pressable style={styles.savedShortcut} onPress={() => router.push("/nearby-help")}><Ionicons name="location-outline" size={21} color={colors.teal} /><Text style={styles.shortcutText}>{locale === "sw" ? "Tafuta huduma" : "Find a service"}</Text><Ionicons name="arrow-forward" size={18} color={colors.teal} /></Pressable>
      <View style={styles.savedSection}><Text style={styles.sectionTitle}>{locale === "sw" ? "Huduma" : "Services"}</Text><Text style={styles.sectionCount}>{savedServices?.length ?? 0}</Text></View>
      {savedServices?.length ? savedServices.map(({ service }) => <Pressable key={String(service._id)} accessibilityRole="button" style={styles.guide} onPress={() => router.push({ pathname: "/service/[id]", params: { id: String(service._id) } })}><View style={[styles.guideIcon, { backgroundColor: colors.tealSoft }]}><Ionicons name="business-outline" size={22} color={colors.teal} /></View><View style={styles.guideCopy}><Text style={styles.guideText}>{service.name}</Text><Text style={styles.summary}>{[service.district, service.region].filter(Boolean).join(", ")}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.inkMuted} /></Pressable>) : <Text style={styles.savedEmpty}>{isSignedIn ? (locale === "sw" ? "Huduma unazohifadhi zitaonekana hapa." : "Services you save will appear here.") : (locale === "sw" ? "Ingia ili kuona huduma ulizohifadhi." : "Sign in to see your saved services.")}</Text>}
      <View style={styles.savedSection}><Text style={styles.sectionTitle}>{locale === "sw" ? "Orodha za maandalizi" : "Preparation checklists"}</Text><Text style={styles.sectionCount}>{savedResources.length}</Text></View>
      {savedResources.map((resource) => <Pressable key={resource.id} accessibilityRole="button" style={styles.guide} onPress={() => router.push({ pathname: "/resource/[id]", params: { id: resource.id } })}><View style={[styles.guideIcon, { backgroundColor: resource.color }]}><Ionicons name={resource.icon} size={22} color={colors.burgundy} /></View><View style={styles.guideCopy}><Text style={styles.guideText}>{resource.title[locale]}</Text><Text style={styles.summary} numberOfLines={1}>{resource.summary[locale]}</Text></View><Ionicons name="chevron-forward" size={20} color={colors.inkMuted} /></Pressable>)}
      {!savedResources.length ? <Text style={styles.savedEmpty}>{locale === "sw" ? "Orodha unazohifadhi zitaonekana hapa." : "Checklists you save will appear here."}</Text> : null}
      <Pressable style={styles.savedShortcut} onPress={() => router.push("/(tabs)/cases")}><Ionicons name="folder-outline" size={21} color={colors.burgundy} /><Text style={styles.shortcutText}>{locale === "sw" ? "Kesi na maombi yangu" : "My cases and requests"}</Text><Ionicons name="arrow-forward" size={18} color={colors.burgundy} /></Pressable>
    </Screen>;
  }

  return (
    <Screen>
      <CivicPageHeader back title={locale === "sw" ? "Jua haki zako" : "Know your rights"} />
      <View style={styles.libraryIntro}><View style={{ flex: 1, gap: 6 }}><Text style={styles.introHeading}>{locale === "sw" ? "Elewa. Jiandae. Chukua hatua." : "Understand. Prepare. Take a step."}</Text><Text style={styles.libraryLead}>{locale === "sw" ? "Anza na jambo linalokuhusu." : "Start with the issue that matters to you."}</Text></View><CivicIllustration pose="documents" size={90} /></View>
      <SearchFilters value={query} onChange={setQuery} placeholder={locale === "sw" ? "Tafuta mada au swali" : "Find a topic or question"} sw={locale === "sw"} label={locale === "sw" ? "Mada" : "Topic"} title={locale === "sw" ? "Chagua mada" : "Choose a topic"} count={Number(category !== "all")} summary={category !== "all" ? topicOptions.find(item => item.value === category)?.label : undefined} onReset={() => setCategory("all")}>
        <IntakeSelect label={locale === "sw" ? "Mada" : "Topic"} value={category} options={topicOptions} sw={locale === "sw"} onChange={value => setCategory(value as typeof category)} />
      </SearchFilters>

      <View style={styles.libraryHeader}>
        <Text style={styles.sectionTitle}>{locale === "sw" ? "Miongozo" : "Guides"}</Text>
        <Pressable accessibilityRole="button" onPress={() => libraryOnly ? router.push("/(tabs)/learn?view=saved") : setView("saved")} style={styles.savedToggle}>
          <Ionicons name="bookmark-outline" size={16} color={colors.burgundy} />
          <Text style={styles.savedToggleText}>{locale === "sw" ? "Vilivyohifadhiwa" : "Saved"}</Text>
        </Pressable>
      </View>
      {reviewedGuides === undefined ? <BrandLoading compact task="content"/> : null}
      {visibleReviewedGuides.length ? <><SectionHeading title={locale === "sw" ? "Miongozo iliyopitiwa" : "Reviewed guides"} action={`${visibleReviewedGuides.length}`} />
        {visibleReviewedGuides.map((guide) => <Pressable key={guide._id} accessibilityRole="button" style={styles.guide} onPress={() => router.push({ pathname: "/legal-guide/[id]", params: { id: guide._id } })}><View style={styles.guideIcon}><Ionicons name="shield-checkmark-outline" size={22} color={colors.teal} /></View><View style={styles.guideCopy}><Text style={styles.guideText}>{locale === "sw" ? guide.titleSw : guide.titleEn}</Text><Text style={styles.summary} numberOfLines={2}>{locale === "sw" ? guide.summarySw : guide.summaryEn}</Text><Text style={styles.minutes}>{guide.publisher} · {guide.jurisdiction.replaceAll("_", " ")}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.inkMuted} /></Pressable>)}</> : null}

      <SectionHeading title={locale === "sw" ? "Orodha za maandalizi" : "Preparation checklists"} action={`${filtered.length}`} />
      {filtered.map((resource) => (
        <View key={resource.id} style={styles.guide}>
          <View style={styles.guideIcon}><Ionicons name={resource.icon} size={23} color={colors.teal} /></View>
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
  libraryIntro: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  introHeading: { fontFamily: type.semibold, fontSize: 21, lineHeight: 28, color: colors.ink },
  savedIntro: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 23, marginBottom: spacing.xl },
  savedSection: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.xl, marginBottom: spacing.sm },
  sectionCount: { fontFamily: type.medium, color: colors.burgundy, fontSize: 13 },
  savedShortcut: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: spacing.md, borderBottomWidth: 1, borderColor: colors.line },
  shortcutText: { flex: 1, fontFamily: type.medium, color: colors.ink, fontSize: 15 },
  savedEmpty: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, paddingVertical: spacing.md },
  libraryLead: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 15, lineHeight: 23 },
  libraryFootnote: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 18, marginTop: spacing.xl },
  intro: { minHeight: 154, justifyContent: "center", borderRadius: 8, backgroundColor: "#173F3D", padding: spacing.lg, marginBottom: spacing.lg, overflow: "hidden" },
  introTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  introAccent: { width: 18, height: 3, backgroundColor: "#F3B61F" },
  kicker: { flex: 1, fontFamily: type.bold, color: "#B8DED6", fontSize: 9, lineHeight: 14 },
  introTitle: { marginTop: spacing.md, maxWidth: 280, fontFamily: type.editorial, color: "#FFFFFF", fontSize: 27, lineHeight: 33 },
  introBody: { maxWidth: 290, marginTop: spacing.sm, fontFamily: type.regular, color: "#E0EFEC", fontSize: 13, lineHeight: 19 },
  search: { minHeight: 54, borderRadius: 8, backgroundColor: "#F3F5F4", flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md },
  input: { flex: 1, paddingHorizontal: spacing.sm, fontFamily: type.regular, color: colors.charcoal, fontSize: 15 },
  libraryHeader: { marginTop: spacing.xl, marginBottom: spacing.sm, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  sectionTitle: { flex: 1, fontFamily: type.editorial, color: colors.ink, fontSize: 20 },
  savedToggle: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: spacing.sm },
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
  guideIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#F3F5F4", alignItems: "center", justifyContent: "center" },
  guideCopy: { flex: 1 },
  guideText: { fontFamily: type.semibold, color: colors.charcoal, fontSize: 16, lineHeight: 23 },
  summary: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 14, lineHeight: 21, marginTop: 4 },
  guideMeta: { marginTop: spacing.sm, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  minutes: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, marginTop: 4 },
  readAction: { fontFamily: type.bold, color: colors.burgundy, fontSize: 11 },
  saveButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  empty: { fontFamily: type.regular, color: colors.inkMuted, textAlign: "center", marginTop: spacing.xl, lineHeight: 21 },
  emptyCard: { alignItems: "center", paddingVertical: spacing.xl, gap: spacing.sm },
  emptyTitle: { marginTop: spacing.md, fontFamily: type.bold, color: colors.ink, fontSize: 17 },
  exploreButton: { marginTop: spacing.lg, minHeight: 44, borderRadius: radius.pill, backgroundColor: colors.burgundy, paddingHorizontal: spacing.xl, alignItems: "center", justifyContent: "center" },
  exploreText: { fontFamily: type.bold, color: colors.surface, fontSize: 13 },
});
