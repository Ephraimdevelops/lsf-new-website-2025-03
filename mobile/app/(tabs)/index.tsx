import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth, useUser } from "../../src/auth";
import { api } from "../../src/backend/api";
import { caseStatusLabels } from "../../src/caseLabels";
import { Screen } from "../../src/components/Screen";
import { useLanguage } from "../../src/i18n";
import { colors, spacing, type } from "../../src/theme";

const primaryActions = [
  { icon: "search-outline", sw: "Tafuta msaada", en: "Find help", subSw: "Huduma zilizothibitishwa karibu nawe", subEn: "Verified services near you", route: "/find-services", color: "#147F79", foreground: "#FFFFFF" },
  { icon: "document-text-outline", sw: "Omba msaada", en: "Request help", subSw: "Eleza unachohitaji", subEn: "Tell us what you need", route: "/intake", color: "#A62B4D", foreground: "#FFFFFF" },
  { icon: "chatbubble-ellipses-outline", sw: "Uliza Saada", en: "Ask Saada", subSw: "Mwongozo wa haki kwa lugha rahisi", subEn: "Plain-language rights guidance", route: "/sara", color: "#F16C22", foreground: "#FFFFFF" },
  { icon: "book-outline", sw: "Jua haki zako", en: "Know your rights", subSw: "Miongozo mifupi ya vitendo", subEn: "Short, practical guides", route: "/(tabs)/learn?view=all", color: "#F3B61F", foreground: "#25201B" },
] as const;

const quickTools = [
  { icon: "document-text-outline", sw: "Kagua\nHati", en: "Check\nDocument", route: "/document-checker", color: "#0E4C92" },
  { icon: "folder-outline", sw: "Nyaraka\nZangu", en: "My\nDocuments", route: "/documents", color: "#2563EB" },
  { icon: "clipboard-outline", sw: "Muundo\nwa Barua", en: "Letter\nTemplate", route: "/letter-builder", color: "#087F6F" },
  { icon: "shield-checkmark-outline", sw: "Vidokezo\nvya Usalama", en: "Safety\nTips", route: "/safety", color: "#E5A100" },
] as const;

const requestStatusLabels = {
  draft: { sw: "Rasimu", en: "Draft" },
  submitted: { sw: "Limewasilishwa", en: "Submitted" },
  under_review: { sw: "Linakaguliwa", en: "Under review" },
  waiting_for_information: { sw: "Taarifa zinahitajika", en: "Information needed" },
  information_only: { sw: "Mwongozo umetolewa", en: "Guidance provided" },
  referred: { sw: "Limepelekwa kwa mtoa huduma", en: "Referred" },
  converted_to_case: { sw: "Limekuwa kesi", en: "Converted to case" },
  withdrawn: { sw: "Limeondolewa", en: "Withdrawn" },
  closed: { sw: "Limefungwa", en: "Closed" },
} as const;

export default function HomeScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { locale } = useLanguage();
  const cases = useQuery(api.caseManagement.myCases, isSignedIn ? {} : "skip");
  const requests = useQuery(api.legalHelp.myRequests, isSignedIn ? {} : "skip");
  const activeCase = cases?.find((item) => !["closed", "closed_unresolved"].includes(item.status));
  const activeRequest = requests?.find((item) => !["converted_to_case", "withdrawn", "closed"].includes(item.status));
  const isLoadingJourney = isSignedIn && (cases === undefined || requests === undefined);
  const firstName = user?.firstName;
  const journeyTitle = activeCase ? (locale === "sw" ? "Kesi yangu" : "My case") : activeRequest ? (locale === "sw" ? "Ombi langu" : "My request") : (locale === "sw" ? "Kesi yangu" : "My case");
  const journeyStatus = activeCase
    ? `${activeCase.publicId} · ${caseStatusLabels[locale][activeCase.status]}`
    : activeRequest
      ? `${activeRequest.publicId} · ${requestStatusLabels[activeRequest.status][locale]}`
      : isLoadingJourney
        ? (locale === "sw" ? "Tunapakua taarifa zako..." : "Loading your progress...")
        : (locale === "sw" ? "Bado huna kesi hai" : "No active case yet");
  const journeyHint = activeCase || activeRequest
    ? (locale === "sw" ? "Fungua kuona hatua inayofuata" : "Open to see your next step")
    : (locale === "sw" ? "Ukiomba msaada, ombi lako litaonekana hapa" : "When you request help, your request will appear here");
  const openJourney = () => {
    if (activeCase) return router.push({ pathname: "/case/[id]", params: { id: activeCase._id } });
    if (activeRequest) return router.push({ pathname: "/request/[id]", params: { id: activeRequest._id } });
    return router.push("/(tabs)/cases");
  };

  return (
    <Screen scroll={false} style={styles.screen}>
      <View style={styles.header}>
        {user?.imageUrl ? <Image source={{ uri: user.imageUrl }} style={styles.avatar} /> : <View style={styles.avatarFallback}><Text style={styles.avatarInitial}>{firstName?.slice(0, 1).toUpperCase() ?? "H"}</Text></View>}
        <View style={styles.greeting}>
          <Text style={styles.greetingEyebrow}>{locale === "sw" ? "HAKI YANGU" : "HAKI YANGU"}</Text>
          <Text style={styles.greetingTitle}>{firstName ? (locale === "sw" ? `Habari, ${firstName}` : `Hello, ${firstName}`) : (locale === "sw" ? "Karibu" : "Welcome")}</Text>
          <Text style={styles.greetingBody}>{locale === "sw" ? "Haki Yangu · msaada unaanzia hapa" : "Haki Yangu · your next step starts here"}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Arifa" : "Notifications"} style={styles.bell} onPress={() => router.push("/notifications")}>
          <Ionicons name="notifications-outline" size={27} color="#C90043" />
        </Pressable>
      </View>

      <ScrollView style={styles.homeScroll} contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeBand}>
        <View style={styles.welcomeAccent} />
        <View style={styles.welcomeCopy}>
          <Text style={styles.welcomeEyebrow}>{locale === "sw" ? "HAKI YAKO, HATUA YAKO" : "YOUR RIGHTS. YOUR NEXT STEP."}</Text>
          <Text style={styles.welcomeTitle}>{locale === "sw" ? "Msaada wa kisheria, unaoeleweka." : "Legal help, made clearer."}</Text>
          <Text style={styles.welcomeBody}>{locale === "sw" ? "Jifunze, pata huduma, au zungumza na Saada." : "Learn your rights, find verified help, or ask Saada."}</Text>
        </View>
        <View style={styles.welcomeMark}><Ionicons name="compass-outline" size={25} color="#FFFFFF" /></View>
      </View>
      <Text style={styles.sectionTitle}>{locale === "sw" ? "Anza hapa" : "Start here"}</Text>
      <View style={styles.actionGrid}>
        {primaryActions.map((action, index) => (
          <Pressable key={action.en} accessibilityRole="button" accessibilityLabel={locale === "sw" ? action.sw : action.en} accessibilityHint={locale === "sw" ? action.subSw : action.subEn} style={({ pressed }) => [styles.actionCard, index < 2 ? styles.actionLarge : styles.actionCompact, { backgroundColor: action.color }, pressed && styles.pressed]} onPress={() => router.push(action.route)}>
            <View style={styles.actionTop}><View style={styles.actionIcon}><Ionicons name={action.icon} size={23} color={action.foreground} /></View><Ionicons name="arrow-forward" size={19} color={action.foreground} /></View>
            <View style={styles.actionCopy}>
              <Text style={[styles.actionTitle, { color: action.foreground }]}>{action[locale]}</Text>
              <Text style={[styles.actionBody, { color: action.foreground }]}>{locale === "sw" ? action.subSw : action.subEn}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel={`${journeyTitle}. ${journeyStatus}`} accessibilityHint={journeyHint} style={({ pressed }) => [styles.caseCard, pressed && styles.pressed]} onPress={openJourney}>
        <View style={styles.caseIcon}><Ionicons name="folder-outline" size={27} color="#0C4A6E" /></View>
        <View style={styles.caseCopy}>
          <Text style={styles.caseTitle}>{journeyTitle}</Text>
          <Text style={styles.caseBody}>{journeyStatus}</Text>
          <Text style={styles.caseHint}>{journeyHint}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#123B52" />
      </Pressable>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{locale === "sw" ? "Zana za haraka" : "Quick tools"}</Text><Pressable accessibilityRole="button" accessibilityLabel={locale === "sw" ? "Tazama zana zote" : "See all tools"} onPress={() => router.push("/(tabs)/profile")}><Text style={styles.seeAll}>{locale === "sw" ? "Tazama zote" : "See all"}</Text></Pressable></View>
      <View style={styles.tools}>
        {quickTools.map((tool) => (
          <Pressable key={tool.en} accessibilityRole="button" accessibilityLabel={(locale === "sw" ? tool.sw : tool.en).replace("\n", " ")} style={({ pressed }) => [styles.tool, pressed && styles.pressed]} onPress={() => router.push(tool.route)}>
            <Ionicons name={tool.icon} size={25} color={tool.color} />
            <Text style={styles.toolText}>{tool[locale]}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable accessibilityRole="button" style={styles.exploreCard} onPress={() => router.push("/explore")}>
        <View style={styles.exploreIcon}><Ionicons name="grid-outline" size={23} color={colors.burgundy} /></View>
        <View style={styles.caseCopy}><Text style={styles.exploreTitle}>{locale === "sw" ? "Angalia skrini na safari" : "Explore screens and journeys"}</Text><Text style={styles.exploreBody}>{locale === "sw" ? "Fungua sehemu za programu bila kuingia." : "Open app sections without signing in."}</Text></View>
        <Ionicons name="chevron-forward" size={19} color={colors.burgundy} />
      </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: spacing.sm, paddingHorizontal: 20, paddingBottom: 94 },
  header: { minHeight: 58, flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  homeScroll: { flex: 1 },
  homeContent: { paddingBottom: spacing.lg },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: "#F4CFD9" },
  avatarFallback: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#F4CFD9", alignItems: "center", justifyContent: "center" },
  avatarInitial: { fontFamily: type.bold, color: colors.burgundy, fontSize: 22 },
  greeting: { flex: 1, marginLeft: 14 },
  greetingEyebrow: { fontFamily: type.bold, color: colors.burgundy, fontSize: 11 },
  greetingTitle: { marginTop: 2, fontFamily: type.bold, color: "#161616", fontSize: 20 },
  greetingBody: { marginTop: 2, fontFamily: type.regular, color: "#686168", fontSize: 13 },
  bell: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  welcomeBand: { minHeight: 156, flexDirection: "row", alignItems: "center", overflow: "hidden", marginTop: 6, marginBottom: 23, paddingHorizontal: 17, paddingVertical: 17, borderRadius: 8, backgroundColor: "#173F3D" },
  welcomeAccent: { position: "absolute", top: 0, bottom: 0, left: 0, width: 5, backgroundColor: "#F3B61F" },
  welcomeCopy: { flex: 1, paddingLeft: 4 },
  welcomeEyebrow: { fontFamily: type.bold, color: "#B8DED6", fontSize: 9 },
  welcomeTitle: { marginTop: 7, maxWidth: 255, fontFamily: type.bold, color: "#FFFFFF", fontSize: 23, lineHeight: 28 },
  welcomeBody: { marginTop: 6, maxWidth: 245, fontFamily: type.regular, color: "#E0EFEC", fontSize: 12, lineHeight: 17 },
  welcomeMark: { width: 42, height: 42, marginLeft: 9, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#2B6860" },
  sectionTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 18 },
  actionGrid: { marginTop: spacing.sm, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10 },
  actionCard: { width: "48.4%", borderRadius: 8, padding: 13, justifyContent: "space-between" },
  actionLarge: { minHeight: 126 },
  actionCompact: { minHeight: 108 },
  actionTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  actionIcon: { width: 34, height: 34, borderRadius: 7, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  actionCopy: { marginTop: spacing.sm },
  actionTitle: { fontFamily: type.bold, fontSize: 15, lineHeight: 19 },
  actionBody: { marginTop: 3, fontFamily: type.regular, fontSize: 10, lineHeight: 14, opacity: 0.96 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  caseCard: { minHeight: 82, marginTop: 19, borderRadius: 8, borderWidth: 1, borderColor: "#DCE4EA", backgroundColor: "#F5F8FA", padding: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  caseIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#E2F0F6", alignItems: "center", justifyContent: "center" },
  caseCopy: { flex: 1 },
  caseTitle: { fontFamily: type.bold, color: "#172B3A", fontSize: 15 },
  caseBody: { marginTop: 2, fontFamily: type.medium, color: "#496273", fontSize: 12 },
  caseHint: { marginTop: 2, fontFamily: type.regular, color: "#718493", fontSize: 11.5, lineHeight: 15 },
  sectionHeader: { marginTop: 20, marginBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  seeAll: { fontFamily: type.medium, color: "#0C4A6E", fontSize: 13 },
  tools: { flexDirection: "row", gap: 8 },
  tool: { flex: 1, minHeight: 72, borderRadius: 7, borderWidth: 1, borderColor: "#E1E7EB", backgroundColor: "#FFFFFF", paddingVertical: 8, paddingHorizontal: 3, alignItems: "center", justifyContent: "center" },
  toolText: { marginTop: 5, fontFamily: type.medium, color: "#17384C", fontSize: 10, lineHeight: 13, textAlign: "center" },
  exploreCard: { minHeight: 78, marginTop: spacing.lg, borderRadius: 8, borderWidth: 1, borderColor: "#E8B8CC", backgroundColor: "#FFF7FA", padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  exploreIcon: { width: 42, height: 42, borderRadius: 8, backgroundColor: colors.softPink, alignItems: "center", justifyContent: "center" },
  exploreTitle: { fontFamily: type.bold, color: colors.ink, fontSize: 14 },
  exploreBody: { marginTop: 3, fontFamily: type.regular, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
});
