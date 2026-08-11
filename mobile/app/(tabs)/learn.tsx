import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { resources } from "../../src/resources";
import { useSavedResources } from "../../src/useSavedResources";
import { colors, radius, spacing, type } from "../../src/theme";

const categories = [
  { id: "all", sw: "Zote", en: "All" },
  { id: "land", sw: "Ardhi", en: "Land" },
  { id: "employment", sw: "Ajira", en: "Employment" },
  { id: "family", sw: "Familia", en: "Family" },
  { id: "safety", sw: "Usalama", en: "Safety" },
  { id: "contracts", sw: "Mikataba", en: "Contracts" },
] as const;

export default function LearnScreen() {
  const { locale, t } = useLanguage();
  const { isSaved, toggleSaved } = useSavedResources();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]["id"]>("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const categoryMatches = category === "all" || resource.category === category;
      const text = `${resource.title[locale]} ${resource.summary[locale]} ${resource.steps.map((step) => step[locale]).join(" ")}`.toLowerCase();
      return categoryMatches && (!needle || text.includes(needle));
    });
  }, [category, locale, query]);

  return (
    <Screen>
      <Text style={styles.title}>{t("learn")}</Text>
      <View style={styles.search}>
        <Ionicons name="search" size={19} color={colors.inkMuted} />
        <TextInput value={query} onChangeText={setQuery} accessibilityLabel={locale === "sw" ? "Tafuta mada" : "Search topics"} placeholder={locale === "sw" ? "Tafuta haki, mada au mwongozo..." : "Search rights, topics or guides..."} placeholderTextColor={colors.inkMuted} style={styles.input} />
      </View>

      <View style={styles.categoryRow}>
        {categories.map((item) => (
          <Pressable key={item.id} onPress={() => setCategory(item.id)} style={[styles.category, category === item.id && styles.categoryActive]}>
            <Text style={[styles.categoryText, category === item.id && styles.categoryTextActive]}>{item[locale]}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>{locale === "sw" ? "Miongozo" : "Guides"}</Text>
      {filtered.map((resource) => (
        <Pressable key={resource.id} style={styles.guide} onPress={() => router.push({ pathname: "/resource/[id]", params: { id: resource.id } })}>
          <View style={[styles.guideIcon, { backgroundColor: resource.color }]}><Ionicons name={resource.icon} size={22} color={colors.burgundy} /></View>
          <View style={styles.guideCopy}>
            <Text style={styles.guideText}>{resource.title[locale]}</Text>
            <Text style={styles.summary} numberOfLines={2}>{resource.summary[locale]}</Text>
            <Text style={styles.minutes}>{resource.minutes} {locale === "sw" ? "dakika" : "min read"}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Hifadhi" : "Save"} onPress={() => void toggleSaved(resource.id)} style={styles.saveButton}>
            <Ionicons name={isSaved(resource.id) ? "bookmark" : "bookmark-outline"} size={20} color={colors.burgundy} />
          </Pressable>
        </Pressable>
      ))}
      {filtered.length === 0 ? <Text style={styles.empty}>{locale === "sw" ? "Hakuna mwongozo unaolingana na utafutaji huu." : "No guide matches this search."}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: type.bold, color: colors.charcoal, fontSize: 30, marginTop: spacing.lg, marginBottom: spacing.lg },
  search: { minHeight: 48, borderRadius: radius.sm, backgroundColor: "#F0EDEF", flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md },
  input: { flex: 1, paddingHorizontal: spacing.sm, fontFamily: type.regular, color: colors.charcoal, fontSize: 14 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.lg },
  category: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  categoryActive: { borderColor: colors.burgundy, backgroundColor: colors.softPink },
  categoryText: { fontFamily: type.medium, color: colors.inkMuted, fontSize: 12 },
  categoryTextActive: { color: colors.burgundy },
  section: { fontFamily: type.bold, color: colors.charcoal, fontSize: 17, marginTop: spacing.xl, marginBottom: spacing.md },
  guide: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  guideIcon: { width: 44, height: 44, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  guideCopy: { flex: 1 },
  guideText: { fontFamily: type.bold, color: colors.charcoal, fontSize: 14, lineHeight: 19 },
  summary: { fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  minutes: { fontFamily: type.medium, color: colors.burgundy, fontSize: 11, marginTop: spacing.xs },
  saveButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  empty: { fontFamily: type.regular, color: colors.inkMuted, textAlign: "center", marginTop: spacing.xl, lineHeight: 21 },
});
